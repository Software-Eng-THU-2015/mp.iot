var express = require('express');
var wechat = require('wechat');
var tools = require('./tools');
var server = express.Router();

var config = {
    token: tools.token,
    appid: tools.appid,
}

server.use(express.query());
server.use('/', wechat(config).text(function(message, req, res, next){
  // TODO
  tools.customSendText(message.FromUserName, "我是主动消息");
  tools.customSendArticle(message.FromUserName, "信仰圣光吧！", "圣光会制裁你的！", "http://image.baidu.com/search/down?tn=download&ipn=dwnl&word=download&ie=utf8&fr=result&url=http%3A%2F%2Fdb.hs.tuwan.com%2Fcard%2Fpremium%2FEX1_383.png", "http://www.hearthstone.com.cn/landing");
  res.reply("Hello World!I am text.\nYour openid is:" + message.FromUserName);
}).image(function(message, req, res, next){
  // TODO
  res.reply("Hello World!I am image.\nYour openid is:" + message.FromUserName);
}).voice(function(message, req, res, next){
  // TODO
  res.reply("Hello World!I am voice.\nYour openid is:" + message.FromUserName);
}).location(function(message, req, res, next){
  // TODO
  res.reply("Hello World!I am location.\nYour openid is:" + message.FromUserName);
}).link(function(message, req, res, next){
  // TODO
  res.reply("Hello World!I am link.\nYour openid is:" + message.FromUserName);
}).event(function(message, req, res, next){
  // TODO
  res.reply("Hello World!I am event.\nYour openid is:" + message.FromUserName);
}).middlewarify());

module.exports = server;
