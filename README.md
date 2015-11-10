##NodeJS
---

###v1.0更新说明

1. 支持回复信息处理
2. 支持(模拟海思力服务号)调用硬件API
3. 支持发送客服信息

###Demo使用说明

1. 在wrist_nodejs文件夹下调用npm install即可
2. 请在wrist_nodejs/routes/tools.js内补充以下信息:
	1. token
	2. appid
	3. appsrc
3. wrist_nodejs/routes/m_wechat.js下为各消息、推送事件的处理
4. wrist_nodejs/routes/tools.js内为主动调用的API
5. 用于微信测试号：node app.js开启对80端口的监听(已有Nginx/Apache服务器的童鞋可自行换个端口做个转发)

###Wechat 主动调用API

https://github.com/node-webot/wechat-api

###Wechat 自动回复中间件

https://github.com/node-webot/wechat

###Wechat 硬件对接API

Please wait ...Or you can push your version.