# SocialLinker 系统架构

## 概述

SocialLinker 是一款基于 SecondMe API 构建的全栈 Web 应用程序,旨在通过 AI 技术帮助用户建立和扩展社交网络。应用采用 Next.js 15 App Router 架构,提供统一的前后端解决方案。系统集成了 SecondMe OAuth 认证、用户资料管理、AI 驱动的消息起草、智能意图分类以及实时聊天功能。

本架构设计采用单体应用模式,优先考虑开发效率和部署简便性,同时通过模块化设计保持代码的可维护性。系统使用 PostgreSQL 作为主数据库,Prisma ORM 提供类型安全的数据访问层,所有业务逻辑通过 Next.js API Routes 实现。

---

## 关键需求

### 功能性需求
- **OAuth 认证**: 安全的 SecondMe OAuth 2.0 登录流程,支持自动令牌刷新
- **用户资料展示**: 显示用户基本信息、头像、兴趣标签(Shades)
- **AI 消息起草**: 根据用户输入生成个性化社交连接消息
- **意图分类**: 智能识别用户网络目标(招聘、协作、学习、商业)
- **实时聊天**: 通过 Server-Sent Events (SSE) 实现流式 AI 对话
- **会话管理**: 持久化存储聊天历史和用户会话

### 非功能性需求
- **性能**: API 响应时间 < 200ms,流式响应延迟 < 500ms
- **可扩展性**: 支持水平扩展以应对流量增长
- **安全性**: 令牌加密存储,HTTPS 通信,防止 CSRF 和 XSS 攻击
- **可用性**: 99.9% 正常运行时间目标
- **可维护性**: 模块化代码结构,完整的 TypeScript 类型定义
- **可部署性**: 单一构建产物,支持容器化和 Serverless 部署

---

## 高层架构

系统采用经典的三层架构模式,在 Next.js 框架内实现前后端一体化:

**表示层(Presentation Layer)**: React 组件负责 UI 渲染和用户交互,使用 Tailwind CSS 实现暗色主题和响应式设计。

**业务逻辑层(Business Logic Layer)**: Next.js API Routes 处理所有业务逻辑,包括 OAuth 认证、SecondMe API 代理、数据验证和会话管理。

**数据访问层(Data Access Layer)**: Prisma ORM 提供类型安全的数据库访问,PostgreSQL 存储用户数据、会话记录和消息历史。

**外部集成层(External Integration Layer)**: 通过 SecondMe API 集成 OAuth 认证、用户信息、AI 聊天和意图分类功能。

```mermaid
graph TB
    User[用户浏览器]
    NextJS[Next.js 应用]
    DB[(PostgreSQL 数据库)]
    SecondMe[SecondMe API]

    User -->|HTTPS| NextJS
    NextJS -->|Prisma ORM| DB
    NextJS -->|REST/SSE| SecondMe

    subgraph "Next.js 单体应用"
        NextJS
        UI[React 组件层]
        API[API Routes 层]
        Lib[业务逻辑层]

        UI -.->|调用| API
        API -.->|使用| Lib
    end

    style NextJS fill:#1e293b,stroke:#8b5cf6,stroke-width:2px,color:#fff
    style DB fill:#2563eb,stroke:#3b82f6,stroke-width:2px,color:#fff
    style SecondMe fill:#7c3aed,stroke:#a78bfa,stroke-width:2px,color:#fff
```

**架构说明**: 此图展示了 SocialLinker 的系统上下文。用户通过浏览器访问 Next.js 应用,应用同时承担前端渲染和后端 API 的职责。数据持久化到 PostgreSQL,外部 AI 能力通过 SecondMe API 集成。这种单体架构简化了部署和运维,适合中小规模应用快速迭代。

---

## 组件详解

### 1. Web 客户端 (React 前端)

**职责**:
- 渲染用户界面和交互元素
- 处理用户输入和表单验证
- 管理客户端状态(React Hooks)
- 实现流式 UI 更新(SSE 消费)

**主要技术**:
- **框架**: React 18 with Next.js 15 App Router
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 3 (暗色主题 + 蓝紫渐变)
- **状态管理**: React Hooks (useState, useEffect)

**关键组件**:
- `LoginButton.tsx`: OAuth 登录入口
- `UserProfile.tsx`: 用户资料和兴趣展示
- `ChatWindow.tsx`: 流式 AI 聊天界面
- `MessageDrafter.tsx`: 消息起草助手
- `IntentClassifier.tsx`: 意图分类可视化

**通信方式**:
- 通过 `fetch` API 调用本地 Next.js API Routes
- 使用 EventSource 接收 SSE 流式响应

---

### 2. API 网关层 (Next.js API Routes)

**职责**:
- 提供 RESTful API 端点
- 实现 OAuth 认证流程
- 代理 SecondMe API 请求
- 会话管理和令牌刷新
- 请求验证和错误处理

**主要技术**:
- **运行时**: Node.js (Next.js Server)
- **路由**: Next.js App Router API Routes
- **认证**: Cookie-based sessions

**核心端点**:

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/auth/login` | GET | OAuth 登录重定向 |
| `/api/auth/callback` | GET | OAuth 回调处理 |
| `/api/auth/logout` | POST | 用户登出 |
| `/api/user/info` | GET | 获取用户信息 |
| `/api/user/shades` | GET | 获取兴趣标签 |
| `/api/chat` | POST | 流式 AI 对话 |
| `/api/sessions` | GET | 获取会话列表 |
| `/api/act` | POST | 意图分类 |

**数据所有权**: Session cookies, 临时缓存的令牌

**通信方式**:
- 接收来自前端的 HTTP/HTTPS 请求
- 通过 Prisma 访问数据库
- 通过 HTTPS 调用 SecondMe REST API

---

### 3. 业务逻辑层 (lib/)

**职责**:
- 封装核心业务逻辑
- 提供可复用的工具函数
- 处理 SecondMe API 集成细节
- 令牌生命周期管理

**主要模块**:

**auth.ts**:
- `exchangeCodeForToken()`: 授权码换令牌
- `refreshAccessToken()`: 刷新访问令牌
- `fetchUserInfo()`: 获取用户信息
- `getCurrentUser()`: 获取当前会话用户(含自动刷新)
- `createOrUpdateUser()`: 用户数据持久化
- `setUserSession()`, `clearUserSession()`: 会话管理

**prisma.ts**:
- 提供 Prisma Client 单例
- 配置 LibSQL 适配器(Prisma v7)
- 处理数据库连接池

**act.ts**:
- 封装 SecondMe Act API 调用逻辑
- 意图分类结果解析

**数据所有权**: 业务规则,API 交互逻辑

---

### 4. 数据库 (PostgreSQL + Prisma)

**职责**:
- 持久化存储用户数据
- 管理聊天会话和消息历史
- 提供事务支持和数据一致性

**主要技术**:
- **数据库**: PostgreSQL 14+ (Supabase)
- **ORM**: Prisma 7 with LibSQL adapter
- **迁移**: Prisma Migrate

**核心实体**:
- **User**: 用户表,存储 SecondMe 用户 ID、令牌、过期时间
- **ChatSession**: 聊天会话表,关联用户和消息
- **Message**: 消息表,存储对话内容和角色(user/assistant)

**关系模型**:
```
User 1 ──── N ChatSession
User 1 ──── N Message
ChatSession 1 ──── N Message
```

**通信方式**: 通过 Prisma Client 进行类型安全的 SQL 查询

---

### 5. 外部集成 (SecondMe API)

**职责**:
- 提供 OAuth 2.0 认证服务
- 提供用户资料和兴趣数据
- 提供 AI 聊天和意图分类能力

**主要端点**:
- **OAuth**: `https://go.second.me/oauth/`
- **Token**: `https://app.mindos.com/gate/lab/api/oauth/token/code`
- **Refresh**: `https://app.mindos.com/gate/lab/api/oauth/token/refresh`
- **User Info**: `https://app.mindos.com/gate/lab/api/secondme/user/info`
- **Chat**: `https://app.mindos.com/gate/lab/api/secondme/chat`
- **Act**: `https://app.mindos.com/gate/lab/api/secondme/act`

**认证方式**:
- OAuth 2.0 Authorization Code Flow
- Bearer Token (Access Token)
- Token 有效期: 2 小时(自动刷新)

**数据格式**: JSON with `{ code: 0, data: {...} }` 包装

---

## 数据流

### 用户登录流程

```mermaid
sequenceDiagram
    participant U as 用户浏览器
    participant N as Next.js 应用
    participant S as SecondMe OAuth
    participant D as PostgreSQL

    U->>N: 1. 访问 /api/auth/login
    N->>S: 2. 重定向到 OAuth 授权页
    U->>S: 3. 用户授权并登录
    S->>N: 4. 回调 /api/auth/callback?code=xxx
    N->>S: 5. POST /token/code (换取令牌)
    S-->>N: 6. 返回 access_token + refresh_token
    N->>S: 7. GET /user/info (Bearer Token)
    S-->>N: 8. 返回用户信息
    N->>D: 9. upsert User 记录
    D-->>N: 10. 返回用户 ID
    N->>U: 11. Set-Cookie + 重定向到 /dashboard
    U->>N: 12. 访问 /dashboard (带 cookie)
    N-->>U: 13. 渲染仪表板页面
```

**流程说明**: OAuth 登录采用标准的授权码模式。用户点击登录后,被重定向到 SecondMe 授权页面。授权成功后,SecondMe 将授权码通过回调 URL 发送回应用。应用后端使用授权码换取访问令牌和刷新令牌,然后获取用户信息并持久化到数据库。最后,应用设置会话 cookie 并重定向用户到仪表板。

---

### AI 消息起草流程

```mermaid
sequenceDiagram
    participant U as 用户界面
    participant A as API Routes
    participant S as SecondMe Chat API
    participant D as Database

    U->>A: POST /api/chat {message, sessionId}
    A->>D: 获取用户令牌
    D-->>A: 返回 accessToken
    A->>A: 检查令牌有效期,必要时刷新
    A->>S: POST /chat (SSE 请求)
    S-->>A: Stream: data: {"content": "您好..."}
    A-->>U: SSE: 转发流式响应
    S-->>A: Stream: data: {"content": "...完整消息"}
    A->>D: 保存消息到 Message 表
    A-->>U: SSE: 发送完成信号
    U->>U: 更新 UI 显示完整消息
```

**流程说明**: 聊天功能使用 Server-Sent Events (SSE) 实现流式响应。用户输入消息后,前端向 API 发起 POST 请求。后端验证用户身份和令牌有效性,然后向 SecondMe Chat API 发起流式请求。SecondMe 逐块返回 AI 生成的内容,后端作为代理转发给前端,前端实时更新 UI。对话完成后,消息被持久化到数据库供后续查看。

---

## 数据模型(高层)

### 核心实体关系

```mermaid
erDiagram
    User ||--o{ ChatSession : owns
    User ||--o{ Message : sends
    ChatSession ||--o{ Message : contains

    User {
        string id PK
        string secondmeUserId UK
        string accessToken
        string refreshToken
        datetime tokenExpiresAt
        string nickname
        string avatar
        datetime createdAt
        datetime updatedAt
    }

    ChatSession {
        string id PK
        string userId FK
        string sessionName
        datetime createdAt
        datetime updatedAt
    }

    Message {
        string id PK
        string sessionId FK
        string userId FK
        string role
        text content
        datetime createdAt
    }
```

**实体说明**:

- **User**: 用户实体,存储 SecondMe 用户映射和 OAuth 令牌。`secondmeUserId` 作为唯一键确保同一 SecondMe 用户不会重复创建。令牌字段用于 API 调用和自动刷新。

- **ChatSession**: 聊天会话实体,代表一次完整的对话主题。用户可以有多个会话,每个会话包含多条消息。

- **Message**: 消息实体,存储对话内容。`role` 字段区分用户消息("user")和 AI 回复("assistant")。关联到会话和用户以支持历史查询。

---

## 基础设施与部署

### 部署架构

```mermaid
graph LR
    Internet[互联网] -->|HTTPS| CDN[CDN/边缘网络]
    CDN --> LB[负载均衡器]
    LB --> App1[Next.js 实例 1]
    LB --> App2[Next.js 实例 2]
    LB --> AppN[Next.js 实例 N]

    App1 --> PG[(PostgreSQL<br/>主实例)]
    App2 --> PG
    AppN --> PG

    PG --> Replica[(只读副本)]

    App1 -.->|外部 API| SecondMe[SecondMe API]
    App2 -.->|外部 API| SecondMe
    AppN -.->|外部 API| SecondMe

    style App1 fill:#1e293b,stroke:#8b5cf6
    style App2 fill:#1e293b,stroke:#8b5cf6
    style AppN fill:#1e293b,stroke:#8b5cf6
    style PG fill:#2563eb,stroke:#3b82f6
    style SecondMe fill:#7c3aed,stroke:#a78bfa
```

### 部署方式

**容器化部署**:
- **Docker**: 应用打包为 Docker 镜像,基于 `node:20-alpine`
- **编排**: 可使用 Kubernetes 或 Docker Compose 进行编排
- **构建产物**: 单一 Next.js standalone 输出 + node_modules

**Serverless 部署**:
- **平台**: Vercel(首选)、Netlify、AWS Lambda
- **边缘渲染**: 利用边缘函数减少延迟
- **自动扩展**: 平台自动处理实例扩展

**传统 VM 部署**:
- **进程管理**: PM2 或 systemd
- **反向代理**: Nginx 或 Caddy
- **SSL**: Let's Encrypt 或云提供商证书

### 环境划分

| 环境 | 用途 | 数据库 | 域名示例 |
|------|------|--------|----------|
| **开发 (Development)** | 本地开发和单元测试 | SQLite 或本地 PostgreSQL | localhost:3000 |
| **预发布 (Staging)** | 集成测试和 UAT | PostgreSQL (独立实例) | staging.sociallinker.com |
| **生产 (Production)** | 用户访问的正式环境 | PostgreSQL (高可用集群) | sociallinker.com |

**环境差异**:
- 开发环境使用 SQLite 以简化配置,`.env.local` 覆盖默认配置
- 预发布和生产环境使用 PostgreSQL,通过环境变量区分数据库连接串
- 生产环境启用额外的日志记录和监控集成

---

## 可扩展性与可靠性

### 水平扩展策略

**无状态设计**: Next.js 应用实例无状态,会话数据存储在数据库和 cookie 中,支持任意实例处理任意请求。

**数据库连接池**: Prisma 配置连接池限制,避免连接耗尽:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // 生产环境建议: ?connection_limit=10&pool_timeout=10
}
```

**负载均衡**:
- Vercel: 自动负载均衡和边缘缓存
- Kubernetes: 使用 Ingress + Service 实现 L7 负载均衡
- 传统部署: Nginx upstream 配置多实例

### 容错与恢复

**自动重试**: API 调用失败时实现指数退避重试(最多 3 次)

**令牌刷新**: `getCurrentUser()` 函数自动检测令牌过期并刷新,对上层业务透明

**数据库故障转移**:
- PostgreSQL 主从复制,主实例故障时自动切换到从实例
- Prisma 支持只读副本配置以分担读负载

**断路器**: 对 SecondMe API 调用实现断路器模式,防止级联故障

### 性能优化

**服务端渲染(SSR)**: 首屏内容在服务端渲染,减少客户端白屏时间

**增量静态生成(ISR)**: 静态页面(首页)使用 ISR,定期重新生成

**CDN 缓存**: 静态资源(JS/CSS/图片)通过 CDN 分发,缓存时间 1 年

**数据库索引**: 在 `User.secondmeUserId`、`Message.sessionId`、`Message.createdAt` 上建立索引

---

## 安全性与合规

### 认证与授权

**OAuth 2.0**: 使用 SecondMe OAuth 作为唯一认证方式,避免存储密码

**会话管理**:
- HttpOnly Cookie 防止 XSS 窃取
- SameSite=Lax 防止 CSRF 攻击
- 会话有效期 30 天,用户主动登出时立即失效

**令牌加密**:
- Access Token 和 Refresh Token 存储在数据库,数据库层加密
- 传输中始终使用 HTTPS

### 输入验证与防护

**XSS 防护**: React 自动转义用户输入,避免在 `dangerouslySetInnerHTML` 中使用未净化内容

**SQL 注入防护**: Prisma ORM 使用参数化查询,杜绝 SQL 注入

**CSRF 防护**: Cookie SameSite 属性 + State 参数验证(OAuth 回调)

**速率限制**: <待实施> 对 API 端点实施速率限制(如每分钟 100 请求)

### 敏感数据保护

**环境变量**: `.env.local` 和 `.secondme/state.json` 包含敏感配置,已添加到 `.gitignore`

**日志脱敏**: 日志输出中屏蔽 `client_secret`、`access_token` 等敏感字段

**HTTPS 强制**: 生产环境强制 HTTPS,HTTP 请求自动重定向到 HTTPS

### 合规考虑

**GDPR 准备**:
- 用户有权导出和删除个人数据(待实施 UI)
- 数据最小化原则: 仅存储必要的用户信息

**隐私政策**: 明确告知用户数据收集和使用方式

---

## 可观测性

### 日志记录

**应用日志**:
- 使用 `console.log/error` 输出结构化日志
- 生产环境建议集成 Winston 或 Pino

**日志级别**: DEBUG(开发) / INFO(预发布) / WARN+ERROR(生产)

**关键日志点**:
- OAuth 令牌交换成功/失败
- 用户登录/登出事件
- SecondMe API 调用错误
- 数据库查询慢查询(>1s)

### 监控指标

**建议监控指标**:
- **吞吐量**: 每秒请求数(RPS)
- **延迟**: P50、P95、P99 响应时间
- **错误率**: 4xx/5xx 错误比例
- **数据库**: 连接池使用率、查询时间
- **外部 API**: SecondMe API 调用成功率和延迟

**监控工具**:
- Vercel Analytics(如果部署到 Vercel)
- Prometheus + Grafana(自托管)
- Datadog / New Relic(商业方案)

### 链路追踪

**分布式追踪**:
- 使用 OpenTelemetry 集成(待实施)
- 追踪请求从前端 → API Routes → SecondMe API 的完整路径
- 关联 Trace ID 以便排查跨服务问题

### 告警规则

**建议告警**:
- 错误率 > 5% 持续 5 分钟
- P95 延迟 > 1s 持续 10 分钟
- 数据库连接池耗尽
- SecondMe API 调用失败率 > 10%

---

## 权衡与决策

### 架构决策记录 (ADR)

#### ADR-001: 选择单体架构而非微服务

**决策**: 采用 Next.js 单体应用架构,而非微服务拆分。

**理由**:
- 团队规模小,单体架构开发效率更高
- 业务逻辑耦合度高(OAuth、用户、聊天紧密相关)
- 部署和运维成本低,适合 MVP 阶段
- Next.js App Router 提供良好的模块化能力

**权衡**: 未来如需拆分服务,可按功能域逐步抽离(如聊天服务独立部署)。

---

#### ADR-002: 使用 PostgreSQL 而非 NoSQL

**决策**: 选择 PostgreSQL 作为主数据库,而非 MongoDB 等 NoSQL。

**理由**:
- 数据关系明确(User-Session-Message),关系型数据库更合适
- Prisma ORM 对 PostgreSQL 支持完善,类型安全性高
- 需要事务支持(如用户创建 + 会话初始化)
- Supabase 提供托管 PostgreSQL,降低运维成本

**权衡**: 未来如有大量非结构化数据(如用户日志分析),可引入 NoSQL 作为补充。

---

#### ADR-003: 使用 Server-Sent Events (SSE) 而非 WebSocket

**决策**: 聊天功能使用 SSE 实现流式响应,而非 WebSocket。

**理由**:
- SSE 更简单,基于 HTTP,无需额外协议升级
- 聊天场景是单向流(服务器 → 客户端),SSE 足够
- Next.js API Routes 原生支持 SSE
- SSE 自动重连机制更健壮

**权衡**: 如未来需要双向实时通信(如协作编辑),需升级到 WebSocket。

---

#### ADR-004: 令牌存储在数据库而非 Redis

**决策**: 将 OAuth 令牌存储在 PostgreSQL 数据库,而非 Redis。

**理由**:
- 系统规模小,数据库查询性能足够
- 避免引入额外的 Redis 组件,降低架构复杂度
- 令牌与用户数据强关联,存储在同一数据源便于事务操作

**权衡**: 如令牌刷新成为性能瓶颈,可引入 Redis 作为令牌缓存层。

---

#### ADR-005: API 代理模式而非前端直连

**决策**: 前端通过 Next.js API Routes 代理调用 SecondMe API,而非前端直连。

**理由**:
- 避免在前端暴露 Client Secret
- 统一管理令牌刷新逻辑
- 便于添加缓存、速率限制、日志记录等中间层逻辑
- 符合 Next.js 最佳实践(API Routes 作为 BFF 层)

**权衡**: 增加一跳网络延迟(约 10-50ms),但安全性收益远大于性能损失。

---

## 未来改进

### 短期优化(1-3 个月)

1. **速率限制**: 对 API 端点实施基于 IP 和用户的速率限制,防止滥用
2. **日志聚合**: 集成 Loki 或 Elasticsearch,统一收集和查询日志
3. **性能监控**: 接入 Sentry 或 Datadog,实时监控错误和性能指标
4. **缓存层**: 对用户信息、兴趣标签等低频变化数据添加缓存(Redis 或内存缓存)
5. **单元测试**: 提高测试覆盖率至 80%,添加集成测试

### 中期规划(3-6 个月)

1. **消息队列**: 引入 RabbitMQ 或 AWS SQS,异步处理非实时任务(如消息持久化、数据分析)
2. **读写分离**: 配置 PostgreSQL 只读副本,分担读负载
3. **CDN 优化**: 使用 Cloudflare 或 AWS CloudFront 加速全球访问
4. **AI 能力扩展**: 集成更多 SecondMe API 功能(如笔记、知识库)
5. **用户导出功能**: 实现 GDPR 数据导出和删除接口

### 长期愿景(6-12 个月)

1. **微服务拆分**: 如业务增长,将聊天服务、意图分类服务独立部署
2. **实时协作**: 升级到 WebSocket,支持多用户实时交互
3. **移动应用**: 开发 React Native 移动端,复用 API 层
4. **数据分析平台**: 构建用户行为分析和网络推荐系统
5. **多租户支持**: 支持企业客户独立部署和数据隔离

---

## 附录

### 技术栈总览

| 层级 | 技术选型 | 版本 | 说明 |
|------|----------|------|------|
| **前端框架** | Next.js | 15.x | React 全栈框架 |
| **前端库** | React | 18.x | UI 组件库 |
| **语言** | TypeScript | 5.x | 类型安全 |
| **样式** | Tailwind CSS | 3.x | 原子化 CSS |
| **后端运行时** | Node.js | 20.x | 服务器端 JS 运行时 |
| **数据库** | PostgreSQL | 14+ | 关系型数据库 |
| **ORM** | Prisma | 7.x | 类型安全数据访问 |
| **外部集成** | SecondMe API | - | OAuth + AI 能力 |
| **部署平台** | Vercel / Docker | - | Serverless 或容器化 |

### 环境变量清单

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `SECONDME_CLIENT_ID` | SecondMe 应用 ID | `cf234a2e-...` |
| `SECONDME_CLIENT_SECRET` | SecondMe 应用密钥 | `e38f7708...` |
| `SECONDME_REDIRECT_URI` | OAuth 回调地址 | `http://localhost:3000/api/auth/callback` |
| `DATABASE_URL` | 数据库连接串 | `postgresql://user:pass@host:5432/db` |
| `SECONDME_API_BASE_URL` | SecondMe API 基础地址 | `https://app.mindos.com/gate/lab` |
| `SECONDME_OAUTH_URL` | OAuth 授权地址 | `https://go.second.me/oauth/` |
| `SECONDME_TOKEN_ENDPOINT` | 令牌端点 | `https://app.mindos.com/.../token/code` |
| `SECONDME_REFRESH_ENDPOINT` | 刷新端点 | `https://app.mindos.com/.../token/refresh` |
| `JWT_SECRET` | JWT 签名密钥 | `<强随机字符串>` |

### 关键指标目标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| **API 响应时间** | P95 < 500ms | 95% 请求在 500ms 内完成 |
| **错误率** | < 1% | 4xx/5xx 错误占比 |
| **可用性** | 99.9% | 每月停机时间 < 43 分钟 |
| **数据库查询** | P95 < 100ms | 95% 查询在 100ms 内完成 |
| **首屏加载** | < 2s | 用户首次访问到可交互时间 |

---

**文档版本**: v1.0
**最后更新**: 2026-02-12
**维护者**: SocialLinker 开发团队

---

本文档描述了 SocialLinker 系统的整体架构设计。如有疑问或建议,请联系架构团队或提交 GitHub Issue。
