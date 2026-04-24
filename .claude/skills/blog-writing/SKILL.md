---
name: blog-writing
description: This skill should be used when the user asks to write a blog post, create an article, edit blog content, add a post, or modify the blog website. Applies to any request involving the lolo.desu personal blog at /home/copy/blog/.
---

# Blog Writing & Editing Skill

This skill covers all operations on the lolo.desu personal blog — a static site built with Node.js and deployed to GitHub Pages at **https://lolo-desu.github.io/**.

## Project Structure

```
/home/copy/blog/
├── posts/                          # Markdown posts go here
├── public/css/style.css            # Site stylesheet (CSS variables, dark mode)
├── templates/
│   ├── index.html                  # Homepage template ({{POSTS}}, {{SITE_TITLE}}, {{SITE_DESC}})
│   └── post.html                   # Post template ({{TITLE}}, {{DATE}}, {{CONTENT}}, {{TAGS}}, {{SITE_TITLE}}, {{SITE_DESC}})
├── build.js                        # Build script: Markdown + templates → static HTML
├── build/                          # Generated output (gitignored, built by CI)
├── .github/workflows/deploy.yml    # GitHub Actions: auto-build + deploy on push to main
├── package.json                    # Dependencies: marked, highlight.js
└── .gitignore                      # Ignores node_modules/, build/
```

## Creating a New Post

### File naming

Create a markdown file in `posts/` with format: `YYYY-MM-DD-slug.md`

Example: `posts/2026-04-24-linux-desktop-setup.md`

### Frontmatter format

Each post starts with YAML frontmatter enclosed in `---`:

```markdown
---
title: Your Post Title
date: 2026-04-24
tags: tag1, tag2, tag3
---

Post content starts here...
```

- **title**: Display title (can include spaces, Chinese characters, special chars)
- **date**: ISO date format `YYYY-MM-DD`
- **tags**: Comma-separated tags. Each tag gets its own page at `/tag/<tag>/`. Common tags: `vibecoding`, `linux`, `cachyos`, `desktop`, `blog`

### Content format

Standard Markdown with full `marked` features:
- Headings: `##`, `###`, `####`
- Code blocks with language: ` ```js `, ` ```bash `, ` ```python ` etc. (highlight.js provides syntax highlighting)
- Tables, blockquotes (`>`), images, links
- Inline code with backticks

### Writing conventions

- Use Chinese for the main content, English for technical terms
- The site is a tech blog focused on **vibecoding** (AI-assisted programming) and **Linux**
- Posts should be practical: tutorials, solutions to problems, tool comparisons, configuration notes
- Include code snippets whenever relevant

## Editing the Blog Style/Template

### CSS

Edit `/home/copy/blog/public/css/style.css`. CSS variables are in `:root` (light) and `@media (prefers-color-scheme: dark)` (dark mode). Colors use semantic variable names: `--bg`, `--text`, `--accent`, `--border`, `--code-bg`, `--tag-bg` etc.

### Templates

Edit `/home/copy/blog/templates/index.html` or `/home/copy/blog/templates/post.html`. Placeholders marked `{{PLACEHOLDER}}` are filled by `build.js` using `fillTemplate()`. Available placeholders: `{{SITE_TITLE}}`, `{{SITE_DESC}}`, `{{POSTS}}`, `{{TITLE}}`, `{{DATE}}`, `{{CONTENT}}`, `{{TAGS}}`.

### Build script

Edit `/home/copy/blog/build.js`. Key functions:
- `parsePost(filePath)` — reads markdown + frontmatter, returns post object
- `renderPost(post)` — generates a single post page HTML
- `renderIndex(posts, extra)` — generates the index page (or tag pages when `extra.title` is set)
- `build()` — orchestrates: clean build dir, parse all posts, render pages, copy assets

## Build & Deploy

### Local build

```bash
cd /home/copy/blog && node build.js
```

Output goes to `build/`. Open `build/index.html` to preview.

### Deploy process

1. Commit changes to `main` branch
2. Push to GitHub: `git push origin main`
3. GitHub Actions (`.github/workflows/deploy.yml`) runs `npm ci && npm run build` then deploys `build/` to Pages
4. Site is live at **https://lolo-desu.github.io/** within ~30 seconds

### Commit message style

Co-authored trailer is standard:
```
Your message here

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## Tag Pages

Tags are auto-generated during build. A post tagged with `linux, cachyos` creates:
- `/tag/linux/` — lists all posts tagged `linux`
- `/tag/cachyos/` — lists all posts tagged `cachyos`

No manual setup needed — just use tags in frontmatter.

## Important Notes

- **Never commit `build/` or `node_modules/`** — they are gitignored
- After editing CSS or templates, run `node build.js` to verify locally before pushing
- The site uses **absolute paths** (e.g., `/css/style.css`, `/tag/linux/`) — this works because it's deployed at the root of `lolo-desu.github.io`
- Posts are sorted by date descending (newest first) on the homepage
- The `build.js` `fillTemplate()` uses `replaceAll` — all instances of a placeholder in a template are replaced
- Node.js v25+ is available locally (npm dependencies: `marked` for markdown, `highlight.js` for syntax highlighting)
