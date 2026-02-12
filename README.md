# SocialLinker - AI驱动的社交连接平台

基于 SecondMe 和 Next.js 构建的智能社交连接应用。

## 项目概览

SocialLinker 是一个完整的 Next.js 应用程序,集成了 SecondMe 的 OAuth 认证、用户档案、AI 聊天、消息起草和意图分类功能。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **数据库**: SQLite with Prisma ORM v7
- **样式**: Tailwind CSS
- **认证**: SecondMe OAuth 2.0
- **部署**: 可部署到 Vercel 或任何支持 Node.js 的平台

## 项目结构

```
SecondsMe/
├── src/
│   ├── app/                          # Next.js App Router 页面
│   │   ├── api/                      # API 路由
│   │   │   ├── auth/                 # 认证模块
│   │   │   │   ├── login/route.ts    # OAuth 登录重定向
│   │   │   │   ├── callback/route.ts # OAuth 回调处理
│   │   │   │   └── logout/route.ts   # 登出处理
│   │   │   ├── user/                 # 用户信息模块
│   │   │   │   ├── info/route.ts     # 获取用户基本信息
│   │   │   │   └── shades/route.ts   # 获取用户兴趣领域
│   │   │   ├── chat/route.ts         # 流式聊天 API (SSE)
│   │   │   ├── sessions/route.ts     # 获取聊天会话列表
│   │   │   └── act/route.ts          # 意图分类 API
│   │   ├── dashboard/                # 仪表盘页面
│   │   │   └── page.tsx
│   │   ├── layout.tsx                # 根布局 (深色模式主题)
│   │   ├── page.tsx                  # 登录页面
│   │   └── globals.css               # 全局样式
│   ├── components/                   # React 组件
│   │   ├── LoginButton.tsx           # 登录按钮
│   │   ├── UserProfile.tsx           # 用户档案展示
│   │   ├── ChatWindow.tsx            # AI 聊天窗口
│   │   ├── MessageDrafter.tsx        # 消息起草助手
│   │   └── IntentClassifier.tsx      # 意图分类器
│   └── lib/                          # 工具库
│       ├── prisma.ts                 # Prisma 客户端单例
│       ├── auth.ts                   # 认证工具函数
│       └── act.ts                    # Act API 工具函数
├── prisma/
│   ├── schema.prisma                 # Prisma 数据库模型
│   └── migrations/                   # 数据库迁移
├── .env.local                        # 环境变量 (SecondMe 配置)
├── prisma.config.ts                  # Prisma 配置
└── package.json
```

## 核心功能

### 1. 认证模块 (Auth)
- **OAuth 2.0 登录流程**: 使用 SecondMe 进行安全认证
- **Token 自动刷新**: 自动处理 access token 过期和刷新
- **Session 管理**: 基于 Cookie 的会话管理
- **文件**: `src/lib/auth.ts`, `src/app/api/auth/*`

### 2. 用户档案 (Profile)
- **基本信息展示**: 显示用户昵称、头像、用户ID
- **兴趣领域 (Shades)**: 展示用户的兴趣和专业领域
- **文件**: `src/components/UserProfile.tsx`, `src/app/api/user/*`

### 3. AI 聊天 (Chat)
- **流式响应**: 使用 Server-Sent Events (SSE) 实现实时流式聊天
- **会话管理**: 自动创建和保存聊天会话
- **消息历史**: 所有消息存储在 SQLite 数据库
- **文件**: `src/components/ChatWindow.tsx`, `src/app/api/chat/route.ts`

### 4. 消息起草 (Message Drafter)
- **AI 辅助撰写**: 根据用户提供的背景信息生成专业消息
- **一键复制**: 快速复制生成的消息到剪贴板
- **文件**: `src/components/MessageDrafter.tsx`

### 5. 意图分类 (Act)
- **智能分类**: 分析文本并识别意图类别
- **支持类别**: 招聘 (hiring)、合作 (collaboration)、学习 (learning)、商业 (business)
- **可视化结果**: 以进度条形式展示各类别的置信度
- **文件**: `src/components/IntentClassifier.tsx`, `src/lib/act.ts`

## 数据库模型

### User (用户)
- `id`: 用户唯一标识
- `secondmeUserId`: SecondMe 用户 ID
- `accessToken`: 访问令牌
- `refreshToken`: 刷新令牌
- `tokenExpiresAt`: 令牌过期时间
- `nickname`: 昵称
- `avatar`: 头像 URL

### ChatSession (聊天会话)
- `id`: 会话唯一标识
- `userId`: 用户 ID
- `sessionName`: 会话名称
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### Message (消息)
- `id`: 消息唯一标识
- `sessionId`: 所属会话 ID
- `userId`: 用户 ID
- `role`: 角色 (user/assistant)
- `content`: 消息内容
- `createdAt`: 创建时间

## 环境变量配置

在 `.env.local` 文件中配置以下变量:

```bash
# SecondMe OAuth2 配置
SECONDME_CLIENT_ID=your-client-id
SECONDME_CLIENT_SECRET=your-client-secret
SECONDME_REDIRECT_URI=http://localhost:3000/api/auth/callback

# SecondMe API 端点
SECONDME_API_BASE_URL=https://app.mindos.com/gate/lab
SECONDME_OAUTH_URL=https://go.second.me/oauth/
SECONDME_TOKEN_ENDPOINT=https://app.mindos.com/gate/lab/api/oauth/token/code
SECONDME_REFRESH_ENDPOINT=https://app.mindos.com/gate/lab/api/oauth/token/refresh

# 数据库
DATABASE_URL=file:./dev.db

# JWT 密钥 (生产环境请更改)
JWT_SECRET=your-secret-key-change-this-in-production
```

## 安装和运行

### 1. 安装依赖
```bash
npm install
```

### 2. 初始化数据库
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. 运行开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 4. 构建生产版本
```bash
npm run build
npm start
```

## API 端点

### 认证 API
- `GET /api/auth/login` - OAuth 登录重定向
- `GET /api/auth/callback` - OAuth 回调处理
- `POST /api/auth/logout` - 退出登录

### 用户 API
- `GET /api/user/info` - 获取用户基本信息
- `GET /api/user/shades` - 获取用户兴趣领域

### 聊天 API
- `POST /api/chat` - 发送消息并接收流式响应
  - 请求体: `{ "message": "string", "sessionId": "string?" }`
  - 响应: SSE 流式数据
- `GET /api/sessions` - 获取所有聊天会话

### Act API
- `POST /api/act` - 意图分类
  - 请求体: `{ "text": "string" }`
  - 响应: `{ "code": 0, "data": { "hiring": 0.8, "collaboration": 0.2, ... } }`

## 设计特点

### 视觉设计
- **深色主题**: 使用 slate-900 和 purple-900 渐变背景
- **玻璃态效果**: backdrop-blur 和半透明背景
- **蓝紫渐变**: 主要交互元素使用蓝色到紫色的渐变
- **流畅动画**: hover 效果和平滑过渡

### 用户体验
- **响应式设计**: 适配桌面和移动设备
- **实时反馈**: 加载状态、动画和即时更新
- **中文界面**: 所有用户界面文本使用中文
- **直观操作**: 清晰的视觉层次和交互反馈

## 技术亮点

1. **Token 自动刷新**: 在 `getCurrentUser()` 函数中自动检测并刷新过期的 token
2. **SSE 流式传输**: 聊天 API 使用 Server-Sent Events 实现实时流式响应
3. **Prisma v7 支持**: 使用最新的 Prisma 7 配置和 libSQL 适配器
4. **类型安全**: 完整的 TypeScript 类型定义
5. **错误处理**: 完善的错误处理和用户友好的错误提示

## 部署建议

### Vercel 部署
1. 将项目推送到 Git 仓库
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署完成后更新 `SECONDME_REDIRECT_URI` 为生产环境 URL

### 生产环境注意事项
- 更改 `JWT_SECRET` 为强随机字符串
- 使用更健壮的数据库 (如 PostgreSQL) 替代 SQLite
- 配置 HTTPS 和安全的 Cookie 设置
- 实现日志记录和错误监控

## 许可证

MIT

## 支持

如有问题,请联系开发团队或查看 SecondMe 官方文档。

---

Powered by SecondMe & Next.js
