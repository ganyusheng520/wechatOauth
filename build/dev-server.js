require('./check-versions')()

let config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

let opn = require('opn')
let path = require('path')
let express = require('express')
let webpack = require('webpack')
let proxyMiddleware = require('http-proxy-middleware')
let webpackConfig = require('./webpack.dev.conf')


// default port where dev server listens for incoming traffic
let port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
let autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
let proxyTable = config.dev.proxyTable

let app = express()
let compiler = webpack(webpackConfig)


/***********************微信授权相关**********************/

let Constants = require('./constants').contants()
let fetch = require('node-fetch')
let checkSignature = (params, token) => {
  let key = [token, params.timestamp, params.nonce].sort().join('');
  //将token （自己设置的） timestamp（时间戳） nonce（随机数）三个参数进行字典排序
  let sha1 = require('crypto').createHash('sha1');
  //将上面三个字符串拼接成一个字符串再进行sha1加密
  sha1.update(key);
  return sha1.digest('hex') == params.signature;
  //将加密后的字符串与signature进行对比，若成功，返回echostr
}


//验证服务器地址的有效性
app.get('/wechatOauth/config', (req, res) => {
  let params = req.query
  if (!checkSignature(params, Constants.TOKEN)) {
    //如果签名不对，结束请求并返回
    res.end('signature fail');
  }

  res.end(params.echostr);

})

/*
 * 先从全局缓存里取accessToken,如果取不到或者过期,则向微信服务器拉取
 */

let getAccessToken = new Promise((_resolve, _reject) => {
  let accessToken = global.accessToken
  let now = new Date().getTime()
  if (accessToken && (now - accessToken.saveTime) < 7000000) {
    console.log('from cache....')
    _resolve(accessToken)

  } else {
    console.log('request wechatOauth server')
    let url = Constants.ACCESS_TOKEN_API.replace('APPID', Constants.APP_ID).replace('APPSECRET', Constants.APP_SECRET)

    fetch(url).then(response => response.json()).then(json => {
      //deepClone
      accessToken = Object.assign({}, json)
      accessToken.saveTime = new Date().getTime()
      global.accessToken = accessToken

      _resolve(accessToken)
    }).catch((error) => {
      console.log('error', error)
      _reject(error)
    })
  }
})


app.get('/wechatOauth/access_token', (req, res) => {
  getAccessToken.then(json => {
    res.send(json)
  }).catch(error => {
    res.send(error)
  })
})


let getOauthAccessToken = (code) => {
  let url = Constants.OAUTH_ACCESS_TOKEN_API.replace('APPID', Constants.APP_ID).replace('SECRET', Constants.APP_SECRET).replace('CODE', code)
  return new Promise((resolve, reject) => {
    fetch(url).then(res => res.json()).then(json => {
      resolve(json)
    }).catch(error => {
      reject(error)
    })
  })
}


//模拟保存到数据库的操作，不可在生产环境中使用
let saveUserInfo = (userInfo) => {
  global.user = global.user || {}
  global.user[userInfo.openid] = userInfo
}


let getUserInfo = (openid, access_token) => {

  let url = Constants.WECHAT_INFO_API.replace('ACCESS_TOKEN', access_token).replace('OPENID', openid)
  return new Promise((resolve, reject) => {

    //先查询数据库是否已经保存
    let userInfo = global.user ? global.user['openid'] : null
    if (!!userInfo) {
      resolve(userInfo)
    } else {
      fetch(url).then(res => res.json()).then(json => {
        //保存到数据库
        saveUserInfo(json)
        resolve(json)

      }).catch(error => {
        reject(error)
      })
    }

  })
}


//授权后跳转
app.get('/wechatOauth/oauth/redirect', (req, res) => {
  let params = req.query
  let code = params.code
  //获取access_token
  getOauthAccessToken(code).then((json) => {
    let openid = json.openid
    let access_token = json.access_token
    getUserInfo(openid, access_token).then((json) => {
      res.cookie('openid', json.openid,null)
      res.cookie('nickname', encodeURIComponent(json.nickname),null)
      res.cookie('headimgurl', json.headimgurl,null)

      //此处获取到个人微信信息,做签到的操作
      //your code
      console.log(json)
      res.redirect('/#/success')

    }).catch(error => {
      console.log(error)
      res.redirect('/#/fail')

    })

  }).catch(error => {
    console.log(error)
    res.end('fail')
  })
})


/*******************************************************/


let devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

let hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {
  }
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
})


// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

let uri = 'http://localhost:' + port

let _resolve
let readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

let server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
