# syntax = docker/dockerfile:1

# This Dockerfile is designed for production, not development. Use with Kamal or build'n'run by hand:
# docker build -t my-app .
# docker run -d -p 80:80 -p 443:443 --name my-app -e RAILS_MASTER_KEY=<value from config/master.key> my-app

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version
ARG RUBY_VERSION=4.0.6
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

# Rails app lives here
WORKDIR /rails

# Runtime-only packages. Compilers and headers belong to the build stage: this
# layer is inherited by the final image, so anything added here ships.
# - curl: used by the compose health check
# - libjemalloc2: enabled by bin/docker-entrypoint
# - libyaml-0-2: runtime library Psych links against (the -dev package is only
#   needed while native extensions are compiled)
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      curl \
      ca-certificates \
      libjemalloc2 \
      libyaml-0-2 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Production environment
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development:test"

# ---------- BUILD STAGE ----------
FROM base AS build

# Toolchain for native gem extensions; discarded with this stage.
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      libyaml-dev \
      pkg-config \
      git \
      unzip && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Bun comes from its own image: a pinned, cacheable layer instead of piping an
# install script over the network on every build. Keep the tag in sync with
# "packageManager" in package.json.
COPY --from=docker.io/oven/bun:1.2.23-slim /usr/local/bin/bun /usr/local/bin/bun

# Install Ruby gems
COPY Gemfile Gemfile.lock ./
RUN --mount=type=cache,target=/usr/local/bundle/cache,sharing=locked \
    bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# JS dependencies with Bun (cache-friendly)
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache,sharing=locked \
    bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Precompile Ruby bootsnap
RUN bundle exec bootsnap precompile app/ lib/

# Precompile Rails assets, then drop everything only the build needed.
# node_modules is build input for Vite and is dead weight at runtime, and
# normalising modes here means the final COPY carries them instead of a
# chmod -R rewriting (and so duplicating) the whole tree in its own layer.
RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile && \
    rm -rf node_modules && \
    # The tailwindcss-ruby CLI is a ~105 MB build-time binary; the compiled
    # stylesheet is already in the asset output. The gem itself stays in place
    # so Bundler can still require it, only the executable is dropped.
    rm -rf "${BUNDLE_PATH}"/ruby/*/gems/tailwindcss-ruby-*/exe && \
    chmod -R a+rX /rails && \
    chown -R 1000:1000 log tmp

# ---------- FINAL RUNTIME STAGE ----------
FROM base

# Copy gems and app artifacts
COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=build /rails /rails

# Non-root user
# log/ and tmp/ are already owned by 1000:1000 from the build stage; COPY
# preserves numeric ownership, so chowning again here would rewrite every
# cached file into a second copy of the layer.
RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash
USER 1000:1000

# Entrypoint and server
ENTRYPOINT ["/rails/bin/docker-entrypoint"]
EXPOSE 3000
CMD ["./bin/rails", "server"]
