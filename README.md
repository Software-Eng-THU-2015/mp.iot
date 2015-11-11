##NodeJS
---

###v1.1更新说明
1. 添加了多种被动回复
2. 添加了注释

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
5. 用于微信测试号：node app.js开启对80端口的监听(已有Nginx/Apache服务器的童鞋可自行换个端口做个转发)，然后url地址填写:http://your ip/wechat/
6. 重要：url地址填写:http://your ip/wechat/，如http://*.*.*.*/wechat/，而不是http://*.*.*.*

###Wechat 主动调用API

https://github.com/node-webot/wechat-api

###Wechat 自动回复中间件

https://github.com/node-webot/wechat

###Nodejs Callback

下面的API函数最后都有一个callback参数，这个参数是一个函数，有两种参数err, result，进行功能完成后对数据的处理(详情请自行了解nodejs的回调函数)。

example:
   
	var menu = {***}; //你的menu的dict
    tools.menuCreate(menu, function(err, result){
	   //TODO 对结果进行处理，调试阶段可以直接输出来查看
       console.log(result);
    });

###Wechat 硬件对接API

####transMsg

函数功能：

向设备发送信息

参数：transMsg(deviceType, deviceId, user, content, callback)

#### createQrCode

函数功能：

直接由deviceId生成相应的二维码

参数：createQrByDeviceId(deviceId, callback)

#### getStat

函数功能：

查询设备状态

参数：getStat(deviceId, callback)

返回结果（callback里面的result)：

一个JSON数组字符串，例如:

	{"errcode":0,"errmsg":"ok","status":1,"status_info":"authorized"}

#### getOpenId

函数功能：

查询设备绑定的用户的OpenId

参数：getOpenId(deviceType, deviceId, callback)

返回结果(callback里面的result）：

一个JSON数组字符串，例如：

	{
	"open_id":["omN7ljrpaxQgK4NW4H5cRzFRtfa8","omN7ljtqrTZuvYLkjPEX_t_Pmmlg",],
	"resp_msg":{"ret_code":0,"error_info":"get open id list OK!"}
	}

##微信相关API

#### customSendText

函数功能：

给用户发送客服文本信息

参数：customSendText(user, content, callback)

user：目标用户的openId,可通过msg.source获得

#### uploadMedia

函数功能：

上传临时素材

参数：uploadMedia(type, filename, callback)

type:"image","voice","video","thumb"

filename:本地文件名，默认目录在项目文件夹下(即与manage.py同级)

注：返回信息为一个JSON数组，若返回成功，在["media_id"]中获得media_id以便发送其他信息时使用。临时素材只保留3天

#### customSendImageByName

函数功能：

给用户发送客服图片信息

参数：customSendImageByName(user, filename, callback)

注：可直接传入filename使用，也可传入之前uploadMedia得到的mediaID使用。建议传入mediaID

#### customSendImage/customSendVoice/customSendVideo

函数功能：

给用户发送客服图片/语音/视频信息

参数：customSendImage/customSendVideo/customSendVoice(user, mediaId, callback)

#### customSendArticle/customSendArticles

函数功能：

给用户发送客服文章信息

参数：customSendArticle(user, title, description, image, url, callback) / customSendArticles(user, articles, callback)

title,description: 文章的标题和概述

image:图片的url地址

url:点击后的链接地址

articles:多个article的数组(每个article是一个dict)

#### menuCreate

函数功能:

创建自定义菜单

参数：menuCreate(body, callback)

body:JSON字符串，格式如下： 详细格式要求可查看微信官方文档

	{
	 "button":[
	 {	
	      "type":"click",
	      "name":"今日歌曲",
	      "key":"V1001_TODAY_MUSIC"
	  },
	  {
	       "name":"菜单",
	       "sub_button":[
	       {	
	           "type":"view",
	           "name":"搜索",
	           "url":"http://www.soso.com/"
	        },
	        {
	           "type":"view",
	           "name":"视频",
	           "url":"http://v.qq.com/"
	        },
	        {
	           "type":"click",
	           "name":"赞一下我们",
	           "key":"V1001_GOOD"
	        }]
	   }]
	}

注：创建自定义菜单时会自动删除原有菜单

#### menuQuery()

函数功能：

查看自定义菜单

参数：menuQuery(callback)

返回值：

一个JSON字符串，例子如下：

    {"menu":
		{"button":[
			{"type":"click","name":"今日歌曲","key":"V1001_TODAY_MUSIC","sub_button":[]},
			{"type":"click","name":"歌手简介","key":"V1001_TODAY_SINGER","sub_button":[]},
			{"name":"菜单","sub_button":[
				{"type":"view","name":"搜索","url":"http://www.soso.com/","sub_button":[]},
				{"type":"view","name":"视频","url":"http://v.qq.com/","sub_button":[]},
				{"type":"click","name":"赞一下我们","key":"V1001_GOOD","sub_button":[]}
			]}
		]}
	}

#### menuDelete

函数功能：

删除原有自定义菜单

参数：menuDelete(callback)

返回值：

一个JSON字符串，表示操作结果，如下：

	{"errcode":0,"errmsg":"ok"}

