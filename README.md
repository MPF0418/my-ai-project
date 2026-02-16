# AI助手工具箱

一个功能丰富的个人AI助手工具箱网页应用，包含以下功能：

## 功能特性

### 1. 文本字数统计
- 实时统计文本长度
- 统计中文字数
- 统计英文单词数
- 统计数字个数
- 一键清空输入框

### 2. 单位换算器
- 长度换算：米、厘米、英寸、英尺
- 重量换算：千克、克、磅、盎司
- 温度换算：摄氏度、华氏度

### 3. 随机密码生成器
- 密码长度：8-32位
- 可选择包含的字符类型：大写字母、小写字母、数字、特殊符号
- 实时显示密码强度
- 一键复制密码

### 4. 页面皮肤切换
- 默认皮肤
- 深色皮肤
- 浅色皮肤
- 多彩皮肤
- 皮肤设置自动保存

## 技术栈

- HTML5
- CSS3
- JavaScript

## 响应式设计

- 适配手机、平板、电脑等不同屏幕尺寸
- 现代设计风格
- 流畅的动画效果

## 部署

### 本地运行
```bash
python -m http.server 8000
```

然后在浏览器中访问：http://localhost:8000

### 线上部署
- 已部署到 Vercel：[my-ai-tools-mu.vercel.app](https://my-ai-tools-mu.vercel.app)

## 项目结构

```
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 功能逻辑
├── package.json        # 项目配置
├── vercel.json         # Vercel部署配置
├── .gitignore          # Git忽略文件
└── README.md           # 项目说明
```

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License