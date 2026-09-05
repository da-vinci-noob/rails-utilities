# frozen_string_literal: true

namespace :sitemap do
  desc 'Generate sitemap.xml for all utilities'
  task generate: :environment do
    require 'builder'

    # Titles and slugs come from MetaHelper so the sitemap can never drift from
    # the client-side routes defined in app/frontend/lib/routes.ts.
    helper = Class.new { include MetaHelper }
                  .new
    titles = helper.utility_titles
    base_url = MetaHelper::SITE_URL
    today = Date.current.strftime('%Y-%m-%d')

    xml = Builder::XmlMarkup.new(indent: 2)
    xml.instruct! :xml, version: '1.0', encoding: 'UTF-8'

    xml.urlset(xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9') do
      xml.url do
        xml.loc base_url
        xml.lastmod today
        xml.changefreq 'weekly'
        xml.priority '1.0'
      end

      titles.each do |title|
        xml.url do
          xml.loc "#{base_url}/#{helper.utility_slug(title)}"
          xml.lastmod today
          xml.changefreq 'monthly'
          xml.priority '0.8'
        end
      end
    end

    Rails.public_path.join('sitemap.xml').write(xml.target!)

    puts "Sitemap generated with #{titles.size + 1} URLs"
  end
end
