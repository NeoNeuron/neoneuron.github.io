source 'https://rubygems.org'

gem 'jekyll'

# Core plugins that directly affect site building
group :jekyll_plugins do
    gem 'jekyll-3rd-party-libraries'
    gem 'jekyll-archives'
    gem 'jekyll-cache-bust'
    gem 'jekyll-email-protect'
    gem 'jekyll-feed'
    gem 'jekyll-get-json'
    gem 'jekyll-imagemagick'
    gem 'jekyll-jupyter-notebook'
    gem 'jekyll-link-attributes'
    gem 'jekyll-minifier'
    gem 'jekyll-paginate-v2'
    gem 'jekyll-polyglot'
    gem 'jekyll-regex-replace'
    gem 'jekyll-scholar'
    gem 'jekyll-sitemap'
    gem 'jekyll-tabs'
    gem 'jekyll-terser', :git => "https://github.com/RobertoJBeltran/jekyll-terser.git"
    gem 'jekyll-toc'
    gem 'jekyll-twitter-plugin'
    gem 'jemoji'

    gem 'classifier-reborn'  # used for content categorization during the build
end

# al-folio v1.x plugins. These 5 are the full intentionally-adopted set, already at
# the exact versions upstream's v1.2 starter pins (the al_folio_* gem series has never
# left 1.0.x - "v1.2" is a starter-repo release label, not a gem version line). The rest
# of v1.2's Gemfile (al_folio_distill, al_folio_bootstrap_compat, al_icons, al_cookie,
# al_analytics, al_img_tools, al_search, al_charts, al_math, al_comments, al_newsletter,
# al_email_protect, al_marimo, al_rtl) is deliberately not adopted: al_folio_distill and
# al_folio_bootstrap_compat were evaluated and rejected (see _config.yml al_folio.compat
# / al_folio.distill comments); the rest are out of scope for this personal academic site.
group :al_folio_plugins do
    gem 'al_folio_core', '= 1.0.15'
    gem 'al_folio_cv', '= 1.0.2'
    gem 'al_folio_upgrade', '= 1.0.3'
    gem 'al_citations', '= 1.0.1'
    gem 'al_ext_posts', '= 1.0.3'
end

# Gems for development or external data fetching (outside :jekyll_plugins)
group :other_plugins do
    gem 'css_parser'
    gem 'feedjira'
    gem 'httparty'
    gem 'observer'       # used by jekyll-scholar
    gem 'ostruct'        # used by jekyll-twitter-plugin
    gem 'terser'         # used by jekyll-terser
    # gem 'unicode_utils' -- should be already installed by jekyll
    # gem 'webrick' -- should be already installed by jekyll
end
