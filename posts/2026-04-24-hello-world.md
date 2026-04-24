---
title: Hello World — 这个博客的由来
date: 2026-04-24
tags: vibecoding, blog
---

## 为什么写博客

作为一名对 **vibecoding** 和 **Linux** 充满热情的开发者，我在日常折腾中积累了各种经验、踩坑记录和小技巧。

以前这些内容散落在笔记软件、聊天记录和脑子里——既不方便自己回看，也没法分享给遇到同样问题的朋友。于是就有了这个博客。

## 这个博客会写什么

- **Vibecoding**：AI 辅助编程的实践、工具对比、workflow 优化
- **Linux**：桌面配置、命令行技巧、系统调优、Arch/CachyOS 相关
- **解决方案**：亲测有效的踩坑记录，省得你再去爬论坛

## 技术栈

这个博客本身就很"vibecoding"——用 Node.js 写了一个简单的构建脚本，把 Markdown 渲染成静态页面，托管在 GitHub Pages 上。

```js
// build.js 核心思路
const posts = readdirSync('posts/')
  .filter(f => f.endsWith('.md'))
  .map(parsePost)
  .sort((a, b) => b.date.localeCompare(a.date));

// 每个 post 生成一个静态页面
for (const post of posts) {
  writeFileSync(`${post.slug}/index.html`, renderPost(post));
}
```

极简、可控、没有框架负担。后续如果有需要，再慢慢迭代。
