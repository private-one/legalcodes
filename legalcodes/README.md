# Legal Codes

A static editorial publication built with HTML, CSS and vanilla JavaScript.

## Structure

- `index.html` — publication homepage
- `blogs.html` — complete article archive
- `about.html` — publication + editor
- `contact.html` — contact page
- `articles/` — individual article HTML files
- `assets/css/style.css` — all visual styling
- `assets/js/main.js` — navigation, article listing and universal search
- `data/articles.json` — generated article index

## Adding a new article

Create a new HTML file inside `articles/`.

Add these metadata tags inside its `<head>`:

```html
<meta name="article-title" content="Your title">
<meta name="article-category" content="Law & Society">
<meta name="article-date" content="2026-10-01">
<meta name="article-read-time" content="8 min read">
<meta name="article-description" content="A short description.">
<meta name="article-featured" content="false">
```

Commit and push. GitHub Actions automatically scans the `articles/` folder and regenerates `data/articles.json`.

The Blogs page and universal search then pick up the new article automatically.

## Editing the design

All global styling is in:

`assets/css/style.css`

Site-wide JavaScript is in:

`assets/js/main.js`

No React, Tailwind, Vite or Node runtime is required to serve the finished site.

## GitHub Pages

The included workflow deploys the repository through GitHub Pages.

In repository Settings → Pages, choose **GitHub Actions** as the source.
