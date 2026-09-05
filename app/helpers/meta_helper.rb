# frozen_string_literal: true

# Builds SEO, Open Graph, Twitter Card and JSON-LD metadata.
#
# Every path is served by HomeController (SPA catch-all), so per-utility
# metadata is resolved from the request path rather than from content_for.
module MetaHelper
  SITE_NAME = 'Rails Utilities'
  SITE_DESCRIPTION = 'A comprehensive collection of 60 developer utilities built with Rails 8, Vue 3, and ' \
                     'TailwindCSS 4. All tools run client-side for privacy and speed.'
  SITE_KEYWORDS = 'developer tools, web utilities, json formatter, timestamp converter, base64 encoder, online utilities'
  SITE_IMAGE = '/og-default.png'
  SITE_URL = 'https://rails.da-vinci-noob.com'
  UTILITIES_SOURCE = 'app/frontend/data/utilities.ts'
  SEO_COPY_SOURCE = 'config/seo_meta.yml'
  DASHBOARD_TITLE = 'All Utilities'

  # Mirrors titleToPath() in app/frontend/lib/routes.ts. These must stay
  # identical, otherwise generated URLs (sitemap, og:url, canonical) point at
  # paths the client-side router cannot resolve.
  def utility_slug(title)
    title.tr('/', '-').gsub(/\s+/, '-').gsub(/[^a-zA-Z0-9-]/, '').downcase
  end

  # Utility titles read from the same source of truth the frontend uses.
  def utility_titles
    @utility_titles ||= begin
      titles = Rails.root.join(UTILITIES_SOURCE).read.scan(/title: '([^']+)'/).flatten
      titles.delete(DASHBOARD_TITLE)
      titles
    end
  end

  def utility_copy
    @utility_copy ||= YAML.safe_load(Rails.root.join(SEO_COPY_SOURCE).read).transform_values(&:symbolize_keys).freeze
  end

  def utility_title_for_path(path)
    slug = path.to_s.delete_prefix('/').chomp('/')
    return if slug.blank?

    utility_titles.find { |title| utility_slug(title) == slug }
  end

  def meta_for_path(path)
    title = utility_title_for_path(path)
    title ? utility_meta_tags(title) : home_meta_tags
  end

  def json_ld_for_path(path)
    title = utility_title_for_path(path)
    title ? utility_json_ld(title) : home_json_ld
  end

  def home_meta_tags
    build_meta(title: SITE_NAME, description: SITE_DESCRIPTION, keywords: SITE_KEYWORDS, url: SITE_URL, image: absolute_url(SITE_IMAGE))
  end

  def utility_meta_tags(utility_title)
    copy = utility_copy[utility_title] || default_utility_meta(utility_title)

    build_meta(
      title:       "#{utility_title} - #{SITE_NAME}",
      description: copy[:description],
      keywords:    copy[:keywords],
      url:         utility_url(utility_title),
      image:       absolute_url(og_image_for(utility_title))
    )
  end

  def home_json_ld
    json_ld(name: SITE_NAME, description: SITE_DESCRIPTION, url: SITE_URL)
  end

  def utility_json_ld(utility_title)
    copy = utility_copy[utility_title] || default_utility_meta(utility_title)
    json_ld(name: utility_title, description: copy[:description], url: utility_url(utility_title))
  end

  def utility_url(utility_title)
    "#{SITE_URL}/#{utility_slug(utility_title)}"
  end

  private

  def build_meta(title:, description:, keywords:, url:, image:)
    {
      title: title, description: description, keywords: keywords,
      og_title: title, og_description: description, og_image: image,
      og_url: url, og_type: 'website',
      twitter_card: 'summary_large_image', twitter_title: title,
      twitter_description: description, twitter_image: image
    }
  end

  # JSON-LD must reach the page unescaped, so the payload is first escaped for a
  # <script> context: '<', '>' and '&' become \u escapes, which keeps the JSON
  # valid while making a '</script>' break-out impossible.
  def json_ld(name:, description:, url:)
    payload = {
      '@context':          'https://schema.org',
      '@type':             'WebApplication',
      name:                name,
      description:         description,
      url:                 url,
      applicationCategory: 'DeveloperApplication',
      operatingSystem:     'Any',
      offers:              { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author:              { '@type': 'Organization', name: SITE_NAME }
    }.to_json

    script_safe(payload).html_safe # rubocop:disable Rails/OutputSafety
  end

  def script_safe(json)
    json.gsub('<', '\\u003c').gsub('>', '\\u003e').gsub('&', '\\u0026')
  end

  def default_utility_meta(utility_title)
    {
      description: "#{utility_title} - A developer utility from #{SITE_NAME}. " \
                   'Runs entirely in your browser for privacy and speed.',
      keywords:    "#{utility_title.downcase}, developer tool, online utility, web tool"
    }
  end

  # Per-utility share images are optional; fall back to the site image instead
  # of advertising a URL that 404s.
  def og_image_for(utility_title)
    candidate = "og-#{utility_slug(utility_title)}.png"
    Rails.public_path.join(candidate).exist? ? "/#{candidate}" : SITE_IMAGE
  end

  def absolute_url(path)
    return path if path.start_with?('http')

    "#{SITE_URL}#{path}"
  end
end
