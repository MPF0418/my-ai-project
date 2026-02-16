# 国内云环境部署指南

由于Vercel在国内可能存在访问问题，以下是几种在国内云环境部署静态网站的方法：

## 方法一：Gitee Pages（推荐）

### 步骤：
1. **注册Gitee账号**：访问 https://gitee.com 注册账号
2. **创建新仓库**：
   - 点击右上角"+"号，选择"新建仓库"
   - 仓库名称：例如 "ai-toolbox"
   - 仓库类型：公开
   - 不要勾选"初始化README文件"
   - 点击"创建"
3. **推送代码到Gitee**：
   ```bash
   # 添加Gitee远程仓库
   git remote add gitee https://gitee.com/你的用户名/ai-toolbox.git
   
   # 推送代码
   git push gitee HEAD:main
   ```
4. **开启Gitee Pages**：
   - 进入仓库页面，点击"服务" -> "Gitee Pages"
   - 分支选择：main
   - 目录选择：/(根目录)
   - 点击"启动"
   - 等待部署完成，获取访问链接

## 方法二：阿里云OSS + CDN

### 步骤：
1. **注册阿里云账号**：访问 https://www.aliyun.com 注册账号
2. **开通OSS服务**：
   - 进入控制台，搜索并开通"对象存储OSS"
   - 创建Bucket，选择"公共读"权限
3. **上传文件**：
   - 进入Bucket，点击"上传文件"
   - 上传所有项目文件（index.html、style.css、script.js等）
4. **配置静态网站托管**：
   - 进入Bucket设置，找到"静态网站托管"
   - 开启静态网站托管，默认首页设置为"index.html"
   - 获取访问域名
5. **（可选）配置CDN**：
   - 开通CDN服务
   - 添加加速域名，源站设置为OSS访问域名
   - 等待域名解析生效

## 方法三：腾讯云COS + CDN

### 步骤：
1. **注册腾讯云账号**：访问 https://cloud.tencent.com 注册账号
2. **开通COS服务**：
   - 进入控制台，搜索并开通"对象存储COS"
   - 创建存储桶，选择"公有读私有写"权限
3. **上传文件**：
   - 进入存储桶，点击"上传文件"
   - 上传所有项目文件
4. **配置静态网站**：
   - 进入存储桶设置，找到"静态网站"选项
   - 开启静态网站，默认首页设置为"index.html"
   - 获取访问域名
5. **（可选）配置CDN**：
   - 开通CDN服务
   - 添加加速域名，源站设置为COS访问域名

## 方法四：GitHub Pages（备选）

虽然GitHub是国外服务，但有时候国内访问还可以：

### 步骤：
1. **确保代码已推送到GitHub**
2. **开启GitHub Pages**：
   - 进入仓库页面，点击"Settings"
   - 找到"Pages"选项
   - 分支选择：main
   - 目录选择：/(root)
   - 点击"Save"
   - 等待部署完成，获取访问链接

## 方法五：本地部署（仅供测试）

如果只是本地测试，可以使用Python或Node.js启动本地服务器：

### 使用Python：
```bash
python -m http.server 8000
```

### 使用Node.js（需要安装http-server）：
```bash
npm install -g http-server
http-server -p 8000
```

然后在浏览器中访问：http://localhost:8000

## 部署前检查

确保以下文件存在且内容正确：
- `index.html` - 主页面
- `style.css` - 样式文件
- `script.js` - 功能逻辑
- `README.md` - 项目说明

## 常见问题排查

1. **页面无法加载**：检查文件路径是否正确，确保所有资源文件都已上传
2. **样式丢失**：检查CSS文件路径是否正确
3. **功能不工作**：检查JavaScript文件路径是否正确，浏览器控制台是否有错误信息
4. **访问速度慢**：考虑使用CDN加速

## 推荐配置

对于国内部署，推荐使用：
- **Gitee Pages**：完全国内服务，访问速度快，操作简单
- **阿里云OSS + CDN**：专业级解决方案，稳定性高
- **腾讯云COS + CDN**：类似阿里云，也是不错的选择

根据你的需求和技术水平选择合适的部署方案。