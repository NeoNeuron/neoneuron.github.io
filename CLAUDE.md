# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal academic website for Kai Chen (陈开), built on the [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme — specifically the multi-language variant maintained by `george-gca`. Deployed to GitHub Pages at https://neoneuron.github.io. Most day-to-day work is content editing (publications, news, CV, blog posts), not theme development.

## Commands

```bash
bundle install                      # install Ruby gem dependencies (first time / after Gemfile change)
bundle exec jekyll serve --lsi      # local dev server with live reload at http://localhost:4000; --lsi enables related-posts
bundle exec jekyll build            # one-off production build into _site/ (same as bin/cibuild)
docker-compose up                   # alternative dev server via Docker (no local Ruby needed)
npm install                         # install Prettier + the liquid plugin (needed before any prettier command)
npx prettier --write <files>        # format .liquid/.md/.yml/etc. per .prettierrc (printWidth 150)
npx prettier . --check              # exactly what CI enforces
```

Ruby is pinned to 3.2.7 locally (`.ruby-version`); the deploy workflow uses 3.3.5. `imagemagick.enabled: true` in `_config.yml` means builds shell out to `convert` for responsive WebP variants — ImageMagick must be on `PATH` or image processing fails.

There is no test suite. Two independent CI checks run on push/PR to `main`:

- `deploy.yml` — builds the site (broken Liquid or bad front matter fails here) and, on push, deploys `_site/` to `gh-pages`.
- `prettier.yml` — runs `npx prettier . --check`. This is a _separate_ red X from build failures, and **it is already failing on `main`**: ~62 tracked files (most `_news/*`, `_posts/*`, `_config.yml`, `README.md`, vendored `_sass/flag-icons/*`) do not conform. Do **not** run `npx prettier --write .` to fix it — that rewrites the whole tree and buries your change in an unrelated diff. Format only the files you touched.

Do not run `bin/deploy` manually — it force-pushes a built `gh-pages` branch and is the legacy path superseded by `deploy.yml`.

Two build-time behaviors differ from local `jekyll serve`:

- The deploy job runs **purgecss** (`purgecss.config.js`) over `_site/assets/css/` after the production build. CSS classes that only appear in JS-generated markup can survive locally but get stripped in production.
- `_plugins/google-scholar-citations.rb` and `inspirehep-citations.rb` fetch citation counts over the network at build time, so builds are slower and can warn/degrade when offline.

## Multi-language architecture (important)

This site runs **jekyll-polyglot** with `languages: ["en-us", "zh-cn"]`, default `en-us` (served at `/`; Chinese at `/zh-cn/`). This is the single biggest difference from stock al-folio and the most common source of mistakes.

- Content collections are split into per-language subdirectories: `_pages/en-us/` & `_pages/zh-cn/`, `_news/en-us/` & `_news/zh-cn/`, `_posts/en-us/` & `_posts/zh-cn/`, `_projects/zh-cn/`, `_data/en-us/` & `_data/zh-cn/`. `lang_from_path: true` derives a file's language from its directory.
- **Pages and news must be mirrored across both language directories** — pages back the navbar, and news feeds the homepage, so a missing sibling leaves that language broken or inconsistent. A change to `_pages/en-us/cv.md` needs the matching edit in `_pages/zh-cn/cv.md`.
- **Blog posts may be single-language.** `_posts/en-us/` legitimately has more entries than `_posts/zh-cn/`; polyglot simply builds what exists. Don't machine-translate a post just to fill the gap.
- `_projects/` currently has only an empty `zh-cn/` directory — the projects page renders empty in both languages. Adding real projects means creating `_projects/en-us/` too.
- UI chrome (button labels, section headings, month names, footer) lives in `_data/<lang>/strings.yml` and is read as `site.data[site.active_lang].strings.*` from templates. Adding a new translatable label means adding the key to **both** `strings.yml` files. `_plugins/localization-exists.rb` provides `{% localization_exists key.path %}` to guard optional keys.
- `_bibliography/papers.bib`, `_data/{coauthors,venues,repositories,socials}.yml`, and most of `assets/` are shared across languages (`exclude_from_localization` covers assets).

## Content model

- **Publications** — `_bibliography/papers.bib` (BibTeX), rendered by **jekyll-scholar** through `_layouts/bib.liquid` + `_includes/citation.liquid`, grouped by year descending. Author name highlighting keys off `scholar.last_name`/`first_name` in `_config.yml` (`Chen` / `Kai, K.`). Custom bibtex fields (`abbr`, `abstract`, `selected`, `preview`, `pdf`, `bibtex_show`, `award`, …) drive badges and detail pages. `_plugins/hide-custom-bibtex.rb` strips them from the displayed BibTeX using the `filtered_bibtex_keywords` list in `_config.yml` — **a new custom field must be added to that list or it leaks into the shown BibTeX**. `_data/coauthors.yml` turns coauthor names into profile links (matched by last name + first-name variants); `_data/venues.yml` sets venue colors/URLs for the `abbr` badge. `max_author_limit: 5` collapses long author lists.
- **News** — one Markdown file per item in `_news/<lang>/`, named by date (`YYYY-MM-<slug>.md`), `layout: post`. The homepage shows the newest 5 (`news.limit` in `about.md`).
- **Blog posts** — `_posts/<lang>/YYYY-MM-DD-slug.md`. Long-form technical posts use `layout: distill` with a per-post bibliography file in `assets/bibliography/` referenced by the `bibliography:` front-matter key. `display_categories` / `display_tags` in `_config.yml` control which categories/tags surface on the blog landing page (currently `Journal Club` and `RNN`); a new category won't appear there unless added.
- **CV** — `_pages/<lang>/cv.md` is front matter only (`layout: cv`, `cv_pdf:` points at a PDF in `assets/pdf/`); the actual content comes from structured YAML in `_data/<lang>/cv.yml`, rendered by `_includes/cv/*` per entry `type` (`map`, `time_table`, `list`, …).
- **Pages** — `_pages/<lang>/`; the homepage is `about.md` (`permalink: /`, `layout: about`), whose front matter toggles the profile block, selected papers, news, and latest-posts sections.

## Layouts, includes, plugins

- `_layouts/*.liquid` define page types (`about`, `cv`, `distill`, `bib`, `post`, `page`, `archive-*`); `_includes/*.liquid` are reusable partials; `_sass/` holds styles. Edit these only for theme/structure changes.
- `_plugins/*.rb` are custom Ruby Jekyll plugins (citation fetching, cache-busting, accent removal, external posts, localization helpers, `file-exists`, `details`). They run at build time.
- Site-wide configuration lives in `_config.yml` (profile fields, `enable_*` feature flags, scholar settings, polyglot, archives, plugin list). Changing `_config.yml` requires restarting `jekyll serve`.
- This repo tracks upstream al-folio via merge commits (`Merge tag 'v0.13.4'`, merges from `george-gca/multi-language-al-folio`). Prefer minimal, localized edits to theme files so future upstream merges stay clean.

## Conventions

- Liquid template extension is `.liquid` (not `.html`) in this fork.
- `.pre-commit-config.yaml` enforces trailing-whitespace / EOF / YAML checks / large-file guard; Prettier (with `@shopify/prettier-plugin-liquid`) formats templates. `.prettierignore` exempts vendored and minified assets.
- Commit messages here are short and content-focused (e.g. "update new publication", "update news and cv").
