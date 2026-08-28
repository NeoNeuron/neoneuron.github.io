source 'https://rubygems.org'

gem 'jekyll'

# Core plugins that directly affect site building
group :jekyll_plugins do
    gem 'jekyll-3rd-party-libraries'
    gem 'jekyll-archives'
    gem 'jekyll-cache-bust'
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

# al-folio v1.x plugins, at the exact versions upstream's starter pins (the al_folio_*
# gem series has never left 1.0.x). al_folio_distill and al_folio_bootstrap_compat were
# evaluated and rejected (see _config.yml al_folio.compat / al_folio.distill comments):
# both are opaque render-tag/CSS-collision gems with no local-override path, and adopting
# them would silently break this site's bilingual rendering. al_search and al_comments are
# not adopted because this site already has working, bilingual-aware equivalents (the
# vendored ninja-keys search stack with its own per-language index generator; the local
# giscus.liquid override) and jekyll-polyglot has no official v1 support, so swapping either
# risks the same silent bilingual breakage as distill.
#
# al_cookie/al_analytics/al_icons/al_math replace equivalent hand-rolled logic that used
# to live in _includes/head.liquid and _includes/scripts.liquid (see .al-folio-overrides.yml
# for the resulting override diffs). Two behavior changes from that swap, both intentional:
# al_math's script tag no longer emits the cdnjs ES6 polyfill our old inline block loaded
# alongside MathJax (upstream dropped it; modern browsers don't need it) - not preserved as
# an override. al_analytics also recognizes cloudflare_analytics/enable_cloudflare_analytics
# and enable_simple_analytics in addition to the google/cronitor/pirsch/openpanel keys our
# old block covered; all are unset so this is dormant capacity, not a behavior change today.
#
# al_charts/al_newsletter/al_marimo/al_rtl/al_email_protect are wired up as dormant capacity
# the same way al_math's tikzjax/pseudocode support is: no current content uses page.chart.*,
# page.marimo, or an RTL page.lang, and site.newsletter.enabled stays false, so these are
# available but invisible today. al_email_protect is the one live behavior change: it
# replaces jekyll-email-protect (removed from :jekyll_plugins below) for the one mailto: link
# in _includes/social.liquid, via al_email_protect_html piped over the existing icon-only
# markup so the visible UI is unchanged - see that file for why the filter's plaintext
# fallback (for labels containing "@") never triggers here.
#
# al_img_tools is deliberately NOT adopted despite being dormant-content-wise (no page.images.*
# usage exists): its ImageToolsScriptsTag bundles medium-zoom handling together with the
# lightbox/gallery/slider features, and its zoom.js (unlike ours) never assigns the
# mediumZoom() result to a global `medium_zoom` variable. assets/js/theme.js:79-80 reads that
# global to refresh the zoom overlay's background color on dark-mode toggle - adopting the
# gem's script wholesale would silently break that AND double-initialize medium-zoom
# alongside our kept local zoom.js (site-wide, since enable_medium_zoom: true is live, not
# dormant). Revisit only alongside a local override of al_img_tools_scripts.liquid that
# excludes the medium-zoom branch.
group :al_folio_plugins do
    gem 'al_folio_core', '= 1.0.15'
    gem 'al_folio_cv', '= 1.0.2'
    gem 'al_folio_upgrade', '= 1.0.3'
    gem 'al_citations', '= 1.0.1'
    gem 'al_ext_posts', '= 1.0.3'
    gem 'al_cookie', '= 1.0.1'
    gem 'al_analytics', '= 1.0.2'
    gem 'al_icons', '= 1.0.0'
    gem 'al_math', '= 1.0.2'
    gem 'al_charts', '= 1.0.1'
    gem 'al_newsletter', '= 1.0.0'
    gem 'al_marimo', '= 1.0.0'
    gem 'al_rtl', '= 1.0.0'
    gem 'al_email_protect', '= 1.0.1'
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
