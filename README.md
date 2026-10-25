# Yue-Vue3

基于 Vue 3 + Vite + TypeScript + Element Plus 的后台管理系统，与 **Yue-Api** 后端对接。

## 保留的功能

- 登录 / 退出登录
- 首页仪表盘、个人中心
- 系统管理：用户、角色、菜单、部门、字典、字典项、操作日志
- 头像上传（Yue-Api 文件接口）
- 动态菜单路由、按钮权限、标签页、主题 / 布局设置
- Mock 数据服务（没有后端时也能启动和操作页面）

## 已移除的模块

原项目中的实时大屏、ECharts 图表、WebSocket、招聘数据（factjobs）和演示页面已删除，相关依赖（`echarts`、`echarts-wordcloud` 等）也已从 `package.json` 中移除。

## 环境要求

- Node.js >= 18
- pnpm >= 8
- Yue-Api 已启动（默认 `http://localhost:9980`），或使用 Mock 模式

## 本地启动

### 方式一：连接 Yue-Api

```bash
pnpm install
pnpm dev
```

浏览器访问 `http://localhost:3000`。

开发环境请求链路：

```text
浏览器 /dev-api/api/v1/...  ->  Vite 代理  ->  http://localhost:9980/api/v1/...
```

后端地址在 `.env.development` 中修改：

```dotenv
VITE_APP_BASE_API = /dev-api
VITE_APP_API_URL = http://localhost:9980
```

### 方式二：Mock 模式（无需后端）

```bash
pnpm install
pnpm dev:mock
```

Mock 登录账号：

```text
用户名：admin
密码：123456
验证码：1234
```

Mock 数据位于 `mock/` 目录，覆盖认证、用户、角色、菜单、部门、字典、日志、文件上传等接口。数据保存在内存中，重启 Vite 后会恢复初始数据；修改 mock 文件会自动热更新。

如果想让普通的 `pnpm dev` 也启用 Mock，将 `.env.development` 中的配置改为：

```dotenv
VITE_MOCK_DEV_SERVER = true
```


## 生产构建

```bash
pnpm build
```

产物位于 `dist/`。Nginx 参考配置：

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /prod-api/ {
        proxy_pass http://127.0.0.1:9980/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

生产环境接口前缀在 `.env.production` 中配置为 `/prod-api`。

## 与 Yue-Api 的接口对应关系

| 前端模块 | Yue-Api 接口 |
| --- | --- |
| `src/api/auth.ts` | `/api/v1/auth/login`、`/logout`、`/refresh-token` |
| `src/api/system/user.ts` | `/api/v1/users/**` |
| `src/api/system/role.ts` | `/api/v1/roles/**` |
| `src/api/system/menu.ts` | `/api/v1/menus/**` |
| `src/api/system/dept.ts` | `/api/v1/depts/**` |
| `src/api/system/dict.ts` | `/api/v1/dicts/**` |
| `src/api/system/log.ts` | `/api/v1/logs` |
| `src/api/file.ts` | `/api/v1/files` |

页面组件路径需要与后端菜单表中的 `component` 字段一致，例如：

- `system/user/index`
- `system/role/index`
- `system/menu/index`
- `system/dept/index`
- `system/dict/index`
- `system/dict/dict-item`

## 说明

- Mock 模式下由 `vite-plugin-mock-dev-server` 拦截 `/dev-api/api/v1/**` 请求，不会访问 Yue-Api；接口返回结构与后端 `Result` / `PageResult` 保持一致。
- 登录页会请求 `/api/v1/auth/captcha` 获取图形验证码，登录时提交 `captchaId` 与 `captchaCode`；Mock 模式验证码固定为 `1234`。
- 角色数据权限仅保留后端支持的 1~4 级（全部 / 部门及子部门 / 本部门 / 本人），不再提交自定义部门 `deptIds`。
- 菜单、角色、部门等表单中的 ID 会统一转换为字符串传给 `el-tree-select`，提交时由后端完成 Long 类型转换。
