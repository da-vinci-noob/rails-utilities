# syntax = docker/dockerfile:1

# This Dockerfile is designed for production, not development. Use with Kamal or build'n'run by hand:
# docker build -t my-app .
# docker run -d -p 80:80 -p 443:443 --name my-app -e RAILS_MASTER_KEY=<value from config/master.key> my-app

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version
ARG RUBY_VERSION=4.0.6
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

# Rails app lives here
WORKDIR /rails

# Base system packages (needed at runtime and build)
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      curl \
      ca-certificates \
      libjemalloc2 \
      build-essential \
      libyaml-dev \
      pkg-config \
      unzip && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Production environment
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# ---------- BUILD STAGE ----------
FROM base AS build

# Extra build tools
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      git \
      gnupg && \
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

# Precompile Rails assets
RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile

# ---------- FINAL RUNTIME STAGE ----------
FROM base

# Copy gems and app artifacts
COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=build /rails /rails

# Non-root user
RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
    chown -R rails:rails log tmp && \
    # COPY preserves host modes, and a checkout made under a restrictive umask
    # leaves the tree 0700 root-owned, which uid 1000 can neither traverse nor
    # execute ("Permission denied" on bin/docker-entrypoint, then LoadError on
    # config/boot). Grant read + traverse only; no write bit is added, and
    # .dockerignore keeps master.key and credential keys out of the image.
    chmod -R a+rX /rails
USER 1000:1000

# Entrypoint and server
ENTRYPOINT ["/rails/bin/docker-entrypoint"]
EXPOSE 3000
CMD ["./bin/rails", "server"]
