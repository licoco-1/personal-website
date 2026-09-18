// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // 主题仓库自带的演示站地址；使用时改成你的域名，自定义域名部署时删掉 base 一行
  site: 'https://licoco-1.github.io',
  base: '/personal-website',
  vite: {
    plugins: [tailwindcss()],
  },
});
