# Bakery · 面包房

插画师的静态作品集主题：一件作品 1~N 张图，首页黑底主视觉轮播 + 瀑布流作品墙，详情页按顺序看完一整组图。自带中文管理后台，传图、发作品、改站点信息都不用写代码。

Astro 5 · Tailwind CSS 4 · Sveltia CMS

演示站：https://sweetenedsuzuka.github.io/astro-theme-bakery/

## 特性

- 单张插图或多图组图都是一件作品，第一张图自动作为封面
- 首页：主视觉轮播（自动播放、缩略图切换）、画师栏、瀑布流作品墙
- 详情页：多图作品首图折叠，点「全部看完」逐张展开；上一篇/下一篇导航
- 管理后台基于 Sveltia CMS，打开 `/admin/` 就能发布作品、改站点设置
- 图片随仓库保存（构建时自动优化）或用外部直链（Cloudflare R2 等），可以混用
- 纯静态产物，GitHub Pages、Cloudflare Pages、Netlify 都能免费托管

## 快速开始

需要 Node.js 20+。

```bash
npm install
npm run dev
```

打开 `http://localhost:4321` 预览。后台在 `http://localhost:4321/admin/index.html`（dev 服务器对 `/admin/` 不做默认索引，部署后直接访问 `/admin/` 即可）。想在本地直接试后台，登录页选「使用本地仓库」并授权项目文件夹即可；正式使用要连 GitHub 仓库，这样保存才会触发自动部署。

构建：

```bash
npm run build   # 输出到 dist/
```

## 发布作品

### 用后台（推荐）

1. 把仓库推到 GitHub，按「部署到 GitHub Pages」一节配好。
2. `public/admin/config.yml` 里把 `backend.repo` 改成你的仓库（`用户名/仓库名`），提交推送。
3. 打开 `https://<你的域名>/admin/`，用 GitHub Token 登录（Personal Access Token，需要 Contents 读写权限）。如果希望点按钮直接走 GitHub 授权登录，按 [docs/github-login.md](docs/github-login.md) 配置一次认证服务即可。
4. 「作品」→「新建」：填标题、日期、简介、标签，逐张传图（第一张是封面）。
5. 保存后 CMS 会把改动提交到仓库，Actions 自动构建，几分钟后新作品上线。

站点标题、昵称、简介、邮箱、赞助页、导航、社交链接都在后台「站点设置」里改；邮箱和赞助页留空则不显示。

### 手动添加

`src/content/works/` 下新建文件夹（如 `my-work/`），放图片和 `index.md`：

```markdown
---
title: 作品标题
date: 2026-08-18
description: 一句话简介（可选）
tags: [标签1, 标签2]
images:
  - ./01.png
  - ./02.png
  - https://media.example.com/03.png # 外部直链也可以混用
---

正文（可选），支持 Markdown。
```

文件夹名就是作品网址（`/works/my-work/`），建议英文或拼音。

## 图片储存

`images` 里写相对路径就是仓库储存，写 `https://` 就是外部直链，两种方式可以混用。

仓库储存时构建会自动压缩并转 WebP，注意 GitHub 仓库建议控制在 1 GB 以内。

图多建议放 Cloudflare R2（免费额度 10 GB，不计流量费）：按 `public/admin/config.yml` 里的注释填 `media_libraries.cloudflare_r2`，之后后台传图会从浏览器直传 R2，作品里保存的是直链。Secret Access Key 不用写进配置，首次在后台打开媒体库时按提示输入，只保存在你自己的浏览器里。

## 自定义

- 站点信息：`src/data/site.yml`（或后台「站点设置」）
- 配色：`src/styles/global.css` 顶部的 CSS 变量，`--accent` 是主题色
- 头像：在后台「站点设置」里直接上传；也可以替换 `src/assets/avatar.png`（正方形 PNG 即可）
- 图标：在后台「站点设置」里直接上传；也可以替换 `public/favicon.svg`，只有位图就删掉它改放 `public/favicon.png`

## 部署到 GitHub Pages

1. 推送代码到 GitHub。
2. 仓库 Settings → Pages，Source 选 **GitHub Actions**。
3. 之后每次推送 main 都会自动构建发布。

部署在 `https://<用户名>.github.io/<仓库名>/` 子路径下时，在 `astro.config.mjs` 里补 `base`：

```js
export default defineConfig({
  site: 'https://<用户名>.github.io',
  base: '/<仓库名>',
});
```

自定义域名只改 `site`，不用设 `base`。

## 更新主题

你通常只需要改这些文件：

| 文件 | 用途 |
| --- | --- |
| `src/content/works/` | 作品内容 |
| `src/data/site.yml` | 站点设置 |
| `src/assets/avatar.png`、`public/favicon.svg` | 头像与图标 |
| `public/admin/config.yml` 的 `backend.repo` | 后台指向的仓库 |
| `astro.config.mjs` 的 `site` 与 `base` | 部署地址 |

其余都是主题代码，更新时用新版直接覆盖即可，也可以合并上游：

```bash
git remote add upstream https://github.com/SweetenedSuzuka/astro-theme-bakery.git
git fetch upstream
git merge upstream/main
```

只改过上面清单里的文件的话，冲突最多出现在那几个文件，保留自己的版本即可。各版本的文件变更见 `CHANGELOG.md`。

依赖不用追着更新，`package-lock.json` 已锁定版本；后台从 CDN 加载，自动保持最新。要升级 Astro / Tailwind 就 `npm update`，本地 `npm run build` 确认无误再推送。

## 目录结构

```
src/
  content/works/<作品>/   每件作品一个文件夹（index.md + 图片）
  data/site.yml           站点设置
  components/             组件
  layouts/  pages/        布局与页面
  styles/global.css       全局样式与配色变量
public/admin/             管理后台（Sveltia CMS）
```

## License

MIT © [永見涼花](https://suzuka.cc)
