# 谢谢你，做我的妈妈

一个温馨、治愈的母亲节礼物网页，送给最亲爱的妈妈。

## 在线预览

将项目部署到 GitHub Pages 后，把链接发给妈妈即可。

## 文件结构

```
.
├── index.html          # 网页主文件
├── styles.css          # 样式表
├── script.js           # 交互脚本
├── images/             # 照片文件夹
│   ├── photo1.jpg
│   ├── photo2.jpg
│   ├── photo3.jpg
│   ├── photo4.jpg
│   ├── photo5.jpg
│   └── photo6.jpg
├── music/              # 音乐文件夹
│   └── bgm.mp3
└── README.md           # 本文件
```

## 快速开始

1. **替换照片**：将自己的照片放入 `images/` 文件夹，命名为 `photo1.jpg` ~ `photo6.jpg`
2. **添加音乐**（可选）：将背景音乐放入 `music/bgm.mp3`
3. **修改文字**（可选）：打开 `index.html`，搜索对应文字进行修改
4. **部署**：将项目推送到 GitHub，开启 GitHub Pages 即可

## 如何部署到 GitHub Pages

1. 在 GitHub 创建一个新仓库，例如 `mothers-day-gift`
2. 将本文件夹内所有文件上传到仓库
3. 进入仓库 **Settings → Pages**
4. Source 选择 **Deploy from a branch**，Branch 选择 **main**，文件夹选择 **/(root)**
5. 点击 Save，等待几分钟即可获得访问链接

## 自定义修改指南

### 修改文字内容

打开 `index.html`，搜索对应的文字直接替换即可。所有文字都在 HTML 中，不需要修改 JavaScript。

### 修改照片

将 `images/` 文件夹中的照片替换为你自己的。建议尺寸：
- 比例：4:3 或 3:4
- 大小：不超过 2MB，避免加载过慢
- 格式：jpg 或 png 均可

### 修改背景音乐

将音乐文件放入 `music/bgm.mp3` 即可。如果不需要音乐，直接不放入文件即可，网页不会报错。

### 修改配色

打开 `styles.css`，修改顶部的 CSS 变量：

```css
:root {
    --bg-cream: #FFFBF5;    /* 背景色 */
    --rose-pink: #E8A0BF;   /* 主色 */
    --coral: #F4A261;       /* 辅色 */
    --lavender: #C9B1FF;    /* 点缀色 */
    --gold: #F2CC8F;        /* 金色 */
}
```

## 技术说明

- **纯前端**：HTML + CSS + JavaScript，无后端依赖
- **响应式**：适配手机、平板、桌面端
- **localStorage**：兑换券领取状态保存在浏览器本地
- **无障碍**：支持键盘操作、图片 alt 文字、ARIA 标签
- **性能优化**：懒加载图片、减少动画偏好支持

## 浏览器支持

- Chrome / Edge / Firefox / Safari 最新版本
- iOS Safari / Android Chrome
- IE 不支持（建议使用现代浏览器）

## 许可

本项目为个人礼物制作，可自由修改和分享。

---

祝所有的妈妈母亲节快乐！
