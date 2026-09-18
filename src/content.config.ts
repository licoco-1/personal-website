import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 作品集合：src/content/works/ 下每件作品一个文件夹（index.md + 图片）。
// images 支持两种写法，可以在同一件作品里混用：
//   ./01.png     仓库内图片，构建时自动压缩与转格式
//   https://...  外部直链（例如 Cloudflare R2），按原样引用
// 第一张图同时用作列表封面与详情页首图。
const works = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      images: z.array(z.union([image(), z.string().url()])).min(1),
    }),
});

export const collections = { works };
