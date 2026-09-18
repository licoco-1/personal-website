// 站内链接生成器：为路径补上部署子路径前缀（例如 GitHub Pages 项目页的 /user/repo），自定义域名部署时前缀为空
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
