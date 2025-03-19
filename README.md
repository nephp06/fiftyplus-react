# FiftyPlus React 前端项目

这是一个基于 Figma 设计稿开发的 FiftyPlus 网站 React 前端项目。FiftyPlus 是一个为50+中高龄人群提供内容和服务的平台，包含各种生活、健康、理财等内容。

## 项目结构

```
fiftyplus-react/
├── public/              # 静态资源
│   └── images/          # 图片资源
├── src/                 # 源代码
│   ├── components/      # 可复用组件
│   ├── pages/           # 页面组件
│   ├── App.js           # 应用程序根组件
│   ├── App.css          # App 样式
│   ├── index.js         # 入口文件
│   └── index.css        # 全局样式
└── package.json         # 项目配置
```

## 可用脚本

在项目目录中，可以运行：

### `npm start`

在开发模式下运行应用程序。
打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看。

当您进行更改时，页面将重新加载。
您还可以在控制台中看到任何lint错误。

### `npm test`

在交互式监视模式下启动测试运行程序。

### `npm run build`

将生产应用程序构建到 `build` 文件夹。
它在生产模式下正确地捆绑了 React 并优化了构建以获得最佳性能。

构建被压缩，文件名包含哈希值。

## 主要功能

- 响应式设计，兼容移动设备和桌面浏览器
- 模块化组件架构
- 首页展示轮播图、热门文章、分类内容和课程信息
- 简洁美观的用户界面，符合中高龄用户浏览习惯
- 使用 Unsplash 提供的精美图片资源

## 图片处理

本项目使用 Unsplash 的免费图片资源。通过自定义的 `UnsplashImage` 组件，可以根据内容类别自动获取相关图片。

使用方法示例：

```jsx
<UnsplashImage 
  category="yoga,senior,fitness" 
  width={400} 
  height={300} 
  alt="瑜伽课程" 
/>
```

参数说明：
- `category`: 指定图片类别关键词，多个关键词用逗号分隔
- `width`: 图片宽度（像素）
- `height`: 图片高度（像素）
- `alt`: 图片替代文本（用于无障碍）
- `className`: 可选的CSS类名

## 技术栈

- React 18
- React Router v6
- CSS Modules
- 现代 JavaScript (ES6+)

## 设计资源

设计原型基于 Figma 设计稿，保持了原设计的视觉风格和用户体验。

## 贡献

欢迎提出问题和建议，也欢迎提交 Pull Request。 