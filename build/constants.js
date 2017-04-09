/**
 * Created by ganyusheng on 2017/4/9.
 */

var config = require('../config')


exports.contants = function () {
  var env = process.env.NODE_ENV
  if (!env) {
    env = process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
  }

  var constant = {
    ACCESS_TOKEN_API: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET',
    OAUTH_ACCESS_TOKEN_API: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code',
    WECHAT_INFO_API: 'https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN',
    TOKEN: 'wechatOauth',
    APP_ID: 'wx03e310e102aaec78',
    APP_SECRET: 'be419a9e6dffbf169240f33b5456c979'
  }

  //生产环境配置
  if (env === 'production') {
    constant.TOKEN = ''
    constant.APP_ID = ''
    constant.APP_SECRET = ''
  }

  return constant
}

