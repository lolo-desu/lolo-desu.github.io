import { marked } from 'marked';
import hljs from 'highlight.js';
import fs from 'fs';
import path from 'path';

marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

const POSTS_DIR = 'posts';
const PUBLIC_DIR = 'public';
const BUILD_DIR = 'build';
const TEMPLATES_DIR = 'templates';
const SITE_TITLE = 'lolo.desu';
const SITE_DESC = 'vibecoding, Linux, and solutions';

function readTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATES_DIR, `${name}.html`), 'utf-8');
}

function parsePost(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');
  const meta = {};
  let contentStart = 0;

  if (lines[0] === '---') {
    let i = 1;
    while (i < lines.length && lines[i] !== '---') {
      const [key, ...rest] = lines[i].split(':');
      if (key) meta[key.trim()] = rest.join(':').trim();
      i++;
    }
    contentStart = i + 1;
  }

  const body = lines.slice(contentStart).join('\n');
  const slug = path.basename(filePath, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const dateMatch = path.basename(filePath).match(/^(\d{4}-\d{2}-\d{2})/);
  const date = meta.date || (dateMatch ? dateMatch[1] : '');
  const title = meta.title || slug.replace(/-/g, ' ');
  const tags = meta.tags ? meta.tags.split(',').map(t => t.trim()) : [];

  return { title, date, slug, tags, body, raw };
}

function fillTemplate(html, vars) {
  for (const [key, val] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, val);
  }
  return html;
}

function renderPost(post) {
  const content = marked.parse(post.body);
  const tagHtml = post.tags.map(t => `<span class="tag">${t}</span>`).join('');
  return fillTemplate(readTemplate('post'), {
    TITLE: post.title,
    DATE: post.date,
    CONTENT: content,
    TAGS: tagHtml,
    SITE_TITLE,
    SITE_DESC,
  });
}

function renderIndex(posts, extra = {}) {
  const items = posts.map(p => `
    <article class="post-card">
      <time datetime="${p.date}">${p.date}</time>
      <h2><a href="/${p.slug}/">${p.title}</a></h2>
      <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <p class="excerpt">${p.body.split('\n').filter(l => l && !l.startsWith('#') && !l.startsWith('```'))[0]?.slice(0, 160) || ''}</p>
    </article>
  `).join('\n');

  return fillTemplate(readTemplate('index'), {
    POSTS: extra.title ? `<h1 class="page-title">${extra.title}</h1>${items}` : items,
    SITE_TITLE: extra.title ? `${extra.title} - ${SITE_TITLE}` : SITE_TITLE,
    SITE_DESC,
  });
}

function copyAssets() {
  fs.cpSync(PUBLIC_DIR, BUILD_DIR, { recursive: true });
}

function build() {
  fs.rmSync(BUILD_DIR, { recursive: true, force: true });
  fs.mkdirSync(BUILD_DIR, { recursive: true });

  const postFiles = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

  const posts = postFiles.map(f => parsePost(path.join(POSTS_DIR, f)));

  // Build post pages
  for (const post of posts) {
    const dir = path.join(BUILD_DIR, post.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPost(post));
  }

  // Build index
  fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), renderIndex(posts));

  // Create tag pages
  const tagSet = new Set(posts.flatMap(p => p.tags));
  for (const tag of tagSet) {
    const taggedPosts = posts.filter(p => p.tags.includes(tag));
    const dir = path.join(BUILD_DIR, 'tag', tag);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderIndex(taggedPosts, { title: `#${tag}` }));
  }

  copyAssets();
  console.log(`Built ${posts.length} posts to ${BUILD_DIR}/`);
}

build();
