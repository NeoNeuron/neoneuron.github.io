# kchen513.top

Source of Kai Chen's (陈开) personal academic website, served at <https://kchen513.top> (English at `/`, Chinese at `/zh-cn/`).

Built with [Jekyll](https://jekyllrb.com/) on the [al-folio](https://github.com/alshedivat/al-folio) v1.x theme gems, with [jekyll-polyglot](https://github.com/untra/polyglot) for the two languages (originally forked from [multi-language-al-folio](https://github.com/george-gca/multi-language-al-folio)).

## Local development

Requires Ruby (see `.ruby-version`), Bundler, and ImageMagick on `PATH`.

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

Alternatively, `docker-compose up` serves the site at <http://localhost:8080> without a local Ruby.

Formatting is checked in CI with Prettier:

```bash
npm install
npx prettier --write <files you changed>
```

## Where things live

| What                  | Where                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------- |
| Pages                 | `_pages/<lang>/` (keep both languages in sync)                                           |
| News                  | `_news/<lang>/` (keep both languages in sync)                                            |
| Blog posts            | `_posts/<lang>/`                                                                         |
| Publications          | `_bibliography/papers.bib`                                                               |
| CV                    | `assets/json/resume_<lang>.json`, PDF in `assets/pdf/<lang>/`                            |
| UI strings            | `_data/<lang>/strings.yml`                                                               |
| Social links          | `_data/socials.yml`                                                                      |
| Site configuration    | `_config.yml`                                                                            |
| Local theme overrides | `_includes/`, `_layouts/`, `_sass/`, `assets/js/` (tracked in `.al-folio-overrides.yml`) |

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to the `gh-pages` branch. The custom domain is set by the root `CNAME` file.

## License

The theme is available as open source under the terms of the [MIT License](LICENSE).
