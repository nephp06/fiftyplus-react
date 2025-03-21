# FiftyPlus CMS

一个基于 React 和 Express 的内容管理系统。

## 项目结构

```
project-root/
├── client/                # 前端代码
│   ├── public/           # 静态资源
│   ├── src/             # React源代码
│   │   ├── components/  # 组件
│   │   ├── layouts/     # 布局组件
│   │   ├── pages/       # 页面组件
│   │   ├── services/    # API服务
│   │   └── styles/      # 样式文件
│   └── package.json     # 前端依赖
│
├── server/               # 后端代码
│   ├── src/            # Express源代码
│   │   ├── controllers/# 控制器
│   │   ├── models/     # 数据模型
│   │   ├── routes/     # 路由
│   │   └── middleware/ # 中间件
│   └── package.json    # 后端依赖
│
└── package.json         # 根目录依赖
```

## 开发环境设置

1. 安装依赖：
```bash
npm run install:all
```

2. 启动开发服务器：
```bash
npm run dev
```

这将同时启动：
- 前端服务器 (http://localhost:3000)
- 后端服务器 (http://localhost:5000)

## 单独运行

### 前端
```bash
npm run client
```

### 后端
```bash
npm run server
```

## 生产环境部署

1. 构建前端：
```bash
npm run build
```

2. 启动服务器：
```bash
npm start
```

## 技术栈

### 前端
- React
- React Router
- Axios
- Material-UI
- React-Quill

### 后端
- Express
- SQLite
- JWT Authentication
- Multer (文件上传)

## API 文档

API 文档请参考 `docs/api.md`。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request 