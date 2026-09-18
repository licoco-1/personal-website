# 启用「使用 GitHub 登录」

后台默认使用访问令牌（Token）登录。如果希望点按钮走 GitHub 授权登录——对不熟悉技术的使用者更友好——需要额外部署一个认证服务。

原理：GitHub 规定 OAuth 换取令牌时必须携带客户端密钥，纯静态网页无法安全持有密钥，所以需要一个服务端做中转。本文使用 Sveltia 官方的 [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth)，部署在 Cloudflare Workers 免费额度上。一次部署可以被多个站点共用，全程网页操作，大约十分钟。

## 1. 部署认证服务

1. 打开 https://github.com/sveltia/sveltia-cms-auth ，点 README 里的「Deploy to Cloudflare Workers」按钮。
2. 登录或注册 Cloudflare 账号（免费）。
3. 按提示授权 Cloudflare 连接你的 GitHub。它会把 `sveltia-cms-auth` 复制一份到你的 GitHub 账号下，作为服务的代码来源，之后不需要管它。
4. 首次使用 Workers 时会要求设置一个 workers.dev 子域名，任意起名即可。
5. 部署完成后，进入 Cloudflare 面板的「Workers 和 Pages」，点开 `sveltia-cms-auth` 服务，页面上会显示服务地址，形如 `https://sveltia-cms-auth.<子域>.workers.dev`，复制下来。

## 2. 注册 GitHub OAuth App

1. 打开 https://github.com/settings/applications/new 。
2. 填写：
   - **Application name**：任意，例如 `Bakery CMS 登录`。
   - **Homepage URL**：你的站点地址。
   - **Authorization callback URL**（部分界面叫 Redirect URI）：`<第 1 步的服务地址>/callback`，注意结尾的 `/callback` 不能漏。
3. 注册后点 **Generate a new client secret**。
4. 记下 **Client ID** 和 **Client Secret**。Secret 只显示这一次，且不要泄露给任何人。

## 3. 配置认证服务

进入 Cloudflare 面板 →「Workers 和 Pages」→ `sveltia-cms-auth` → **Settings → Variables and Secrets**，添加三条变量：

| 名称 | 值 | 类型 |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | 第 2 步的 Client ID | 纯文本 |
| `GITHUB_CLIENT_SECRET` | 第 2 步的 Client Secret | 密钥（Secret） |
| `ALLOWED_DOMAINS` | 站点域名，如 `username.github.io`，多个用逗号分隔 | 纯文本 |

`ALLOWED_DOMAINS` 是安全锁：认证服务只向这些域名下的页面发放令牌，防止别人借用你的服务。

添加完成后点 **Deploy** 重新部署，否则变量不会生效。

## 4. 回填 CMS 配置

编辑 `public/admin/config.yml`，在 `backend` 段加一行 `base_url`：

```yaml
backend:
  name: github
  repo: 用户名/仓库名
  branch: main
  base_url: https://sveltia-cms-auth.<子域>.workers.dev
```

提交推送，等自动部署完成。打开 `/admin/` 点「使用 GitHub 登录」，会跳转到 GitHub 授权页，同意授权后即登录成功。

## 注意事项

- 用令牌（Token）登录时，细粒度令牌必须在创建页面把站点仓库选进「Only select repositories」，并把「Repository permissions → Contents」设为 **Read and write**；这一项默认不开，直接生成的令牌只读元数据，登录会提示没有访问权限。
- 主题仓库自带的演示站，后台配置指向占位仓库 `your-name/my-site`，在那里尝试登录必然提示没有权限，以你自己部署的站点为准。
- 登录过程中浏览器需要能访问 `github.com` 和 `workers.dev`；在中国大陆网络环境下，这意味着登录的人需要代理。发文等日常操作不走认证服务，只有登录这一步需要。
- 一个认证服务可以供多个站点共用：把这些站点的域名都加进 `ALLOWED_DOMAINS`，各站的 `config.yml` 填同一个 `base_url` 即可。
- 认证服务只负责换取令牌，不储存任何内容；写入仓库用的是登录者自己 GitHub 账号的权限。
- 不想让访客看到登录入口的话，可以在 `robots` 层面忽略 `/admin/`（本主题已设置 `noindex`），但路径本身无法隐藏，不要把它当作秘密。
