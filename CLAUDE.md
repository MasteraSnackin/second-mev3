# SecondMe 集成项目

## 应用信息

- **App Name**: Linka
- **Client ID**: cf234a2e-314b-4ca4-ba9d-6e620ccc900c

## API 文档

开发时请参考官方文档（从 `.secondme/state.json` 的 `docs` 字段读取）：

| 文档 | 链接 |
|------|------|
| 快速入门 | https://develop-docs.second.me/zh/docs |
| OAuth2 认证 | https://develop-docs.second.me/zh/docs/authentication/oauth2 |
| API 参考 | https://develop-docs.second.me/zh/docs/api-reference/secondme |
| 错误码 | https://develop-docs.second.me/zh/docs/errors |

## 关键信息

- API 基础 URL: https://app.mindos.com/gate/lab
- OAuth 授权 URL: https://go.second.me/oauth/
- Access Token 有效期: 2 小时
- Refresh Token 有效期: 30 天

> 所有 API 端点配置请参考 `.secondme/state.json` 中的 `api` 和 `docs` 字段

## 已选模块

| 模块 | 说明 | 状态 |
|------|------|------|
| auth | OAuth 认证 | ✅ 已启用 |
| profile | 用户信息展示 | ✅ 已启用 |
| chat | 聊天功能 | ✅ 已启用 |
| act | 结构化动作判断（返回 JSON） | ✅ 已启用 |

## 权限列表 (Scopes)

根据 App Info 中的 Allowed Scopes：

| 权限 | 说明 | 状态 |
|------|------|------|
| `user.info` | 用户基础信息 | ✅ 已授权 |
| `user.info.shades` | 用户兴趣标签 | ✅ 已授权 |
| `chat` | 聊天功能 | ✅ 已授权 |

## 项目结构

```
.
├── .secondme/              # SecondMe 配置目录（包含敏感信息，已添加到 .gitignore）
│   └── state.json         # 项目状态和配置
├── CLAUDE.md              # 本文档
└── (Next.js 项目文件将在生成阶段创建)
```

## 开发注意事项

⚠️ **重要**: `.secondme/` 目录包含敏感信息（Client Secret、数据库连接串等），请确保已添加到 `.gitignore`
