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
  // TODO 收到文本消息
  //发送主动文本信息
  tools.customSendText(message.FromUserName, "我是主动消息");
  //发送主动图文信息
  tools.customSendArticle(message.FromUserName, "信仰圣光吧！", "圣光会制裁你的！", "http://image.baidu.com/search/down?tn=download&ipn=dwnl&word=download&ie=utf8&fr=result&url=http%3A%2F%2Fdb.hs.tuwan.com%2Fcard%2Fpremium%2FEX1_383.png", "http://www.hearthstone.com.cn/landing");
  //被动回复文本信息
  //res.reply("text");
  // 或者
  //res.reply({type:"text", content:"Hello world!"});
  //被动回复图片信息
  //res.reply({type:"image", content:{mediaId: "your mediaId"}});
  //被动回复语音信息
  //res.reply({type:"voice", content:{mediaId: "your mediaId"}});
  //被动回复视频信息
  //res.reply({type:"video", content:{mediaId: "your mediaId", title: "你的标题", description: "你的描述"}});
  //被动回复音乐信息
  //res.reply({title:"标题", description:"描述", musicUrl: "音乐url", hqMusicUrl: "高清版url", thumbMediaId: "your mediaid");
  //被动回复图文信息
  //res.reply(articles); //articles的类型请看tools.customSendArticles
  res.reply("Hello World!I am text.\nYour openid is:" + message.FromUserName);
}).image(function(message, req, res, next){
  // TODO 收到图片消息
  res.reply("Hello World!I am image.\nYour openid is:" + message.FromUserName);
}).voice(function(message, req, res, next){
  // TODO 收到语音消息
  res.reply("Hello World!I am voice.\nYour openid is:" + message.FromUserName);
}).location(function(message, req, res, next){
  // TODO 收到定位消息
  res.reply("Hello World!I am location.\nYour openid is:" + message.FromUserName);
}).link(function(message, req, res, next){
  // TODO 收到链接消息
  res.reply("Hello World!I am link.\nYour openid is:" + message.FromUserName);
}).event(function(message, req, res, next){
  // TODO 收到事件消息，可通过message.Event查看事件种类
  res.reply("Hello World!I am event " + message.Event + ".\nYour openid is:" + message.FromUserName);
}).middlewarify());


module.exports = server;
