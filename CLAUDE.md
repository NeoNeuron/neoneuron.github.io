# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal academic website for Kai Chen (陈开), built on the [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme. It started as a fork of `george-gca`'s multi-language variant and has since migrated to the al-folio v1.x gem architecture (`theme: al_folio_core` plus `al_*` plugin gems, pinned in the `Gemfile`). Deployed to GitHub Pages at https://kchen513.top (custom domain via the root `CNAME` file; `neoneuron.github.io` redirects there). Most day-to-day work is content editing (publications, news, CV, blog posts), not theme development.

## Commands

```bash
bundle install                      # install Ruby gem dependencies (first time / after Gemfile change)
bundle exec jekyll serve            # local dev server with live reload at http://localhost:4000
bundle exec jekyll build            # one-off production build into _site/ (same as bin/cibuild)
docker-compose up                   # alternative dev server via Docker (no local Ruby needed)
npm install                         # install Prettier + the liquid plugin (needed before any prettier command)
npx prettier --write <files>        # format .liquid/.md/.yml/etc. per .prettierrc (printWidth 150)
```

Ruby is pinned to 3.3.13 locally via rbenv (`.ruby-version`); the deploy workflow uses the latest 3.3.x (`ruby-version: "3.3"`; GitHub runners only carry the newest patch release, so an exact pin like 3.3.5 stops installing). Build with a UTF-8 locale (`LANG=en_US.UTF-8`): under a bare `C`/unset locale `al_folio_core`'s startup scan can crash with `invalid byte sequence in US-ASCII` on the Chinese content. `imagemagick.enabled: true` in `_config.yml` means builds shell out to `convert` for responsive WebP variants — ImageMagick must be on `PATH` or image processing fails.

There is no test suite. CI is a single workflow, `.github/workflows/deploy.yml`: on push to `main` (path-filtered) it builds the site (broken Liquid or bad front matter fails here), runs purgecss, and deploys `_site/` to `gh-pages`. Prettier, lychee, CodeQL and axe workflows were removed because they were permanently red or unused.

Prettier is a local-only convenience now. ~40 tracked files (most `_news/*`, `_posts/*`, several `_layouts/*`, vendored `_sass/flag-icons/*`) do not conform, so do **not** run `npx prettier --write .` — that rewrites the whole tree and buries your change in an unrelated diff. Format only the files you touched.

Do not run `bin/deploy` manually — it force-pushes a built `gh-pages` branch and is the legacy path superseded by `deploy.yml`.

Two build-time behaviors differ from local `jekyll serve`:

- The deploy job runs **purgecss** (`purgecss.config.js`) over `_site/assets/css/` after the production build. CSS classes that only appear in JS-generated markup can survive locally but get stripped in production.
- The `al_citations` gem fetches Google Scholar / InspireHEP citation counts over the network at build time for entries that set `google_scholar_id` / `inspirehep_id` (none do today).

## Multi-language architecture (important)

This site runs **jekyll-polyglot** with `languages: ["en-us", "zh-cn"]`, default `en-us` (served at `/`; Chinese at `/zh-cn/`). This is the single biggest difference from stock al-folio and the most common source of mistakes.

- Content collections are split into per-language subdirectories: `_pages/en-us/` & `_pages/zh-cn/`, `_news/en-us/` & `_news/zh-cn/`, `_posts/en-us/` & `_posts/zh-cn/`, `_data/en-us/` & `_data/zh-cn/`. `lang_from_path: true` derives a file's language from its directory.
- **Pages and news must be mirrored across both language directories** — pages back the navbar, and news feeds the homepage, so a missing sibling leaves that language broken or inconsistent. A change to `_pages/en-us/cv.md` needs the matching edit in `_pages/zh-cn/cv.md`.
- **Blog posts may be single-language.** `_posts/en-us/` legitimately has more entries than `_posts/zh-cn/`; polyglot simply builds what exists. Don't machine-translate a post just to fill the gap.
- There is no `_projects/` content — the projects page (`nav: false`) renders empty in both languages. Adding real projects means creating `_projects/en-us/` and `_projects/zh-cn/`.
- UI chrome (button labels, section headings, month names, footer) lives in `_data/<lang>/strings.yml` and is read as `site.data[site.active_lang].strings.*` from templates. Adding a new translatable label means adding the key to **both** `strings.yml` files. `_plugins/localization-exists.rb` provides `{% localization_exists key.path %}` to guard optional keys.
- `_bibliography/papers.bib`, `_data/{coauthors,venues,repositories,socials}.yml`, and most of `assets/` are shared across languages (`exclude_from_localization` covers assets).

## Content model

- **Publications** — `_bibliography/papers.bib` (BibTeX), rendered by **jekyll-scholar** through `_layouts/bib.liquid` + `_includes/citation.liquid`, grouped by year descending. Author name highlighting keys off `scholar.last_name`/`first_name` in `_config.yml` (`Chen` / `Kai, K.`). Custom bibtex fields (`abbr`, `abstract`, `selected`, `preview`, `pdf`, `bibtex_show`, `award`, …) drive badges and detail pages. The `hideCustomBibtex` filter (from `al_folio_core`) strips them from the displayed BibTeX using the `filtered_bibtex_keywords` list in `_config.yml` — **a new custom field must be added to that list or it leaks into the shown BibTeX**. `_data/coauthors.yml` turns coauthor names into profile links (keyed by **lowercase** last name, then matched on first-name variants); the `doi` field must be a bare DOI (no `https://doi.org/` prefix), and arXiv preprints need an `arxiv = {id}` field to get a link button; `_data/venues.yml` sets venue colors/URLs for the `abbr` badge. `max_author_limit: 5` collapses long author lists.
- **News** — one Markdown file per item in `_news/<lang>/`, named by date (`YYYY-MM-<slug>.md`), `layout: post`. The homepage shows the newest 5 (`news.limit` in `about.md`).
- **Blog posts** — `_posts/<lang>/YYYY-MM-DD-slug.md`. Long-form technical posts use `layout: distill` with a per-post bibliography file in `assets/bibliography/` referenced by the `bibliography:` front-matter key. `display_categories` / `display_tags` in `_config.yml` control which categories/tags surface on the blog landing page (currently `Journal Club` and `RNN`); a new category won't appear there unless added.
- **CV** — `_pages/<lang>/cv.md` is front matter only (`layout: cv`, `cv_pdf:` names a PDF in `assets/pdf/<lang>/`); the content comes from JSON Resume files `assets/json/resume_<lang>.json` (loaded by `jekyll_get_json` in `_config.yml`), rendered section by section through `_includes/resume/*`. The `jsonresume:` list in `_config.yml` controls which sections show and in what order. `_includes/cv/*` is only the fallback renderer for a `_data/<lang>/cv.yml`, which no longer exists.
- **Pages** — `_pages/<lang>/`; the homepage is `about.md` (`permalink: /`, `layout: about`), whose front matter toggles the profile block, selected papers, news, and latest-posts sections.

## Layouts, includes, plugins

- `_layouts/*.liquid` define page types (`about`, `cv`, `distill`, `bib`, `post`, `page`, `archive-*`); `_includes/*.liquid` are reusable partials; `_sass/` holds styles. Most of these are local overrides of files shipped in the `al_folio_core` gem; anything not present locally (e.g. `figure.liquid`, `selected_papers.liquid`, `bib_search.liquid`) comes from the gem. Edit these only for theme/structure changes, and after editing an overridden file update its `local_sha256` in `.al-folio-overrides.yml`.
- The only local plugin is `_plugins/localization-exists.rb`. Everything else that used to live in `_plugins/` (citation fetching, cache-busting, accent removal, external posts, `file_exists`, `details`, BibTeX filtering) now comes from the `al_*` / `jekyll-*` gems. Liquid silently ignores unknown filters, so a filter whose gem was removed fails without any build error — check the rendered output.
- Site-wide configuration lives in `_config.yml` (profile fields, `enable_*` feature flags, scholar settings, polyglot, archives, plugin list). Changing `_config.yml` requires restarting `jekyll serve`.
- Theme updates now arrive as gem version bumps in the `Gemfile`, not upstream merges. `.al-folio-overrides.yml` records, per overridden file, the upstream hash it was forked from; `bundle exec al-folio upgrade audit` reports drift. Keep overrides minimal.

## Conventions

- Liquid template extension is `.liquid` (not `.html`) in this fork.
- `.pre-commit-config.yaml` enforces trailing-whitespace / EOF / YAML checks / large-file guard; Prettier (with `@shopify/prettier-plugin-liquid`) formats templates. `.prettierignore` exempts vendored and minified assets.
- Commit messages here are short and content-focused (e.g. "update new publication", "update news and cv").
