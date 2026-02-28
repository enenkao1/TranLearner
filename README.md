# tranLearn - AI 语言学习 Chrome 插件

一个 Chrome 插件，帮助你在浏览 YouTube 时学习语言。支持评论区一键翻译和 AI 语法分析。

## 功能

1. **评论翻译**：YouTube 评论区每条评论下方会出现"翻译"按钮，点击即可查看中文翻译。
2. **AI 语法学习**：点击"语法学习"按钮，AI 会分析该评论的语法点、动词变形和少见词汇。

## 安装与使用

### 前置条件

- [Node.js](https://nodejs.org/) v18+
- Google Cloud Translation API Key（[获取地址](https://console.cloud.google.com/)，启用 Cloud Translation API）
- DeepSeek API Key（[获取地址](https://platform.deepseek.com/)）

### 1. 克隆项目并安装依赖

```bash
git clone <你的仓库地址>
cd tranLearn
npm install
```

### 2. 配置 API Key

在项目根目录创建 `.env` 文件，填入你自己的 Key：

```
PLASMO_PUBLIC_GOOGLE_TRANSLATE_API_KEY=你的Google翻译APIKey
PLASMO_PUBLIC_DEEPSEEK_API_KEY=你的DeepSeekAPIKey
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 加载到 Chrome

1. 打开 Chrome，访问 `chrome://extensions/`
2. 右上角开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择项目下的 `build/chrome-mv3-dev` 文件夹

### 5. 开始使用

- 打开任意 YouTube 视频页面，滚动到评论区
- 每条评论下方会出现「翻译」和「语法学习」两个按钮

## 构建生产版本

```bash
npm run build
```

生产版本会输出到 `build/chrome-mv3-prod` 目录。

## 技术栈

- [Plasmo](https://docs.plasmo.com/) - Chrome 插件开发框架
- React + TypeScript
- Google Cloud Translation API v2
- DeepSeek Chat API
