import { load } from 'js-yaml';
import siteYml from './site.yml?raw';

export interface SiteLink {
  label: string;
  href: string;
  icon: 'x' | 'pixiv' | 'instagram' | 'mail';
}

export interface SiteConfig {
  title: string;
  heroTitleLines: string[];
  artist: string;
  handle: string;
  bio: string;
  aboutIntro: string;
  email: string;
  supportUrl: string;
  avatar: string;
  favicon: string;
  heroCount: number;
  nav: { label: string; href: string }[];
  links: SiteLink[];
}

// 站点设置集中在 src/data/site.yml，也可以在 /admin/ 后台的「站点设置」中修改
const data = (load(siteYml) ?? {}) as Partial<SiteConfig>;

// 可选字段留空时 CMS 可能不会把键写进文件，这里统一补默认值，避免页面读取 undefined 出错
export const site: SiteConfig = {
  title: data.title ?? '',
  heroTitleLines: data.heroTitleLines ?? [],
  artist: data.artist ?? '',
  handle: data.handle ?? '',
  bio: data.bio ?? '',
  aboutIntro: data.aboutIntro ?? '',
  email: data.email ?? '',
  supportUrl: data.supportUrl ?? '',
  avatar: data.avatar ?? '',
  favicon: data.favicon ?? '',
  heroCount: data.heroCount ?? 5,
  nav: data.nav ?? [],
  links: data.links ?? [],
};

export type LinkIcon = SiteLink['icon'];
