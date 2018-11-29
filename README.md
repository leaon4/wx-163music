# wx-163music
网易云音乐小程序

### 安装和开启本地爬虫服务器
```bash
cd server
npm install
node server
```
### 小程序
更改： /wx/wyyyy/app.json/project.config.json
将 "appid" 字段改为你自己的appid
用微信开发者工具打开/wx文件夹

### 真机测试
app.js 中
将 globalData.host 改为你的本机host