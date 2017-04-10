wechatOauth
```
微信授权node版本demo
```
技术栈
```
vue2  + vue-router + webpack + ES6/7 + fetch + sass + express + lib-flexible
```

项目运行
```
#### 注意：建议在linux或者mac下运行，由于涉及 ES6/7 等新属性，nodejs 必须是 6.0 以上版本 ，node 7 是先行版，有可能会出问题，建议使用 node 6 稳定版
```
clone项目到本地
```
  git clone
```
命令行cd到根目录安装依赖
```
npm install
```
运行开发环境 自动打开localhost:8080
```
npm run dev
```

生产环境打包
```
npm run build
```

其他配置
```
参考公众平台开发文档，以及ngrok内网穿透
```

服务端代码
```
  主要在build下的contants.js以及dev-server.js，生产环境不会将该文件打包进去
  ```

可能碰到css loader的问题，执行以下命令安装依赖
```
  npm install node-sass --save-dev<br>
  npm install sass-loader --save-dev
```
build for production and view the bundle analyzer report<br>
```
npm run build --report
For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
