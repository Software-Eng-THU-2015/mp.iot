/*
* author:chendaxixi
* description:主动调用API
* 注:所有callback均为一个函数，参数为err, result。
* example:
*       tools.menuQuery(function(err, result){
*           //TODO
*           console.log(result);
*        });
*/
var tools = {};
var API = require("wechat-api");
var request = require("request");
var fs = require("fs");
var path = require("path");

tools.token = "";
tools.appid = "";
tools.appsec = ""; 

var custom_url = "https://api.weixin.qq.com/cgi-bin/message/custom/send"
var device_url = "https://api.weixin.qq.com/device/"
var access_token = "";
var latest_time = 0;

var api = new API(tools.appid, tools.appsec);

var wrapper = function(callback){
   return function(err, data){
      callback = callback || function () {};
      if(err){
	err.name = "WeChatAPI" + err.name;
	return callback(err, data);
      }
      if(data && data.errcode){
	err = new Error(data.errmsg);
	err.name = "WeChatAPIError";
	err.code = data.errcode;
	return callback(err, data);
      }
       callback(null, data);
   };
};

var postJSON = function(data){
   return {
	dataType: "json",
	type: "POST",
	data: data,
	headers: {
	  "Content-Type": "application/json"
	}
   };
};

//创建菜单，menu为一个dict
tools.menuCreate = function(menu, callback){
    api.createMenu(menu, callback);
};

tools.menuQuery = function(callback){
    api.getMenu(callback);
};

tools.menuDelete = function(callback){
    api.remove(callback);
};

//获取海思力的token
tools.getToken = function(callback){
    request("http://wx.chendaxixi.me/token",function(err, res, body){
        callback(err, body);
    });
};

//获取自己的token
tools.getMToken = function(callback){
    if(access_token == "" || new Date.now() > latest_time - 20000){
	api.getLatestToken(function(err, result){
	    access_token = result.accessToken;
	    latest_time = result.expireTime;
	    callback(null, access_token);
	});
    } else {
	callback(null, access_token);
    } 
};

//上传媒体文件,若操作成功可从callback的result中获取media_id(可console.log(result);查看result结构);media_id将用于下面的Image,Voice,Video发送
tools.uploadMedia = function(type, filename, callback){
    tools.getMToken(function(err, token){
	if(err){ 
	    callback(err, null);
	    return;
        }
	var url = "https://api.weixin.qq.com/cgi-bin/media/upload?access_token=" + token + "&type=" + type;
	var r = request.post(url, function(err, res, data){
	    callback(err, data);
	});
	var form = r.form();
	form.append("files", fs.createReadStream(filename));
    });
};

tools.customSendText = function(user, content, callback){
    api.sendText(user, content, callback);
};

tools.customSendImageByName = function(user, filename, callback){
    tools.uploadMedia("image", filename, function(err, result){
	api.sendImage(user, JSON.parse(result).media_id, callback);
    });
};


tools.customSendImage = function(user, mediaId, callback){
   api.sendImage(user, mediaId, callback);
};

tools.customSendVoice = function(user, mediaId, callback){
   api.sendVoice(user, mediaId, callback);
};

tools.customSendVideoByName = function(user, filename, callback){
   tools.uploadMedia("video", filename, function(err, result){
	api.sendVideo(user, JSON.parse(result).media_id, callback);
   });
};

tools.customSendVideo = function(user, mediaId, callback){
   api.sendVideo(user, mediaId, callback);
};

tools.customSendArticle = function(user, title, description, image, url, callback){
   var articles = [{
     "title": title,
     "description": description,
     "picurl": image,
     "url": url
   }];
   api.sendNews(user, articles, callback);
};

//发送多条图文消息，最多一次10条，articles为上面的articles数组
tools.customSendArticles = function(user, articles, callback){
   api.sendNews(user, articles, callback);
};

//获取设备状态
tools.getStat = function(device_id, callback){
   tools.getToken(function(err, token){
	var url = device_url + "get_stat?access_token=" + token + "&device_id=" + device_id;
        api.request(url, {dataType: "json"}, wrapper(callback));
   });
};

//获取与设备绑定的用户信息
tools.getOpenId = function(device_type, device_id, callback){
   tools.getToken(function(err, token){
	var url = device_url + "get_openid?access_token=" + token + "&device_type=" + device_type + "&device_id=" + device_id;
	api.request(url, {dataType: "json"}, wrapper(callback));
   });
};

//获取用户绑定的设备
tools.getBindDevice = function(openid, callback){
   tools.getToken(function(err, token){
        var url = device_url + "get_bind_device?access_token=" + token + "&openid=" + openid;
        api.request(url, {dataType: "json"}, wrapper(callback));
   });
};

//向设备发送信息
tools.transMsg = function(device_type, device_id, user, content, callback){
   tools.getToken(function(err, token){
        var url = device_url + "transmsg?access_token=" + token;
	var info = {
	  "device_type": device_type,
	  "device_id": device_id,
	  "open_id": user,
	  "content": new Buffer(content).toString('base64')
        };
        api.request(url, postJSON(info), wrapper(callback));
   });
};

module.exports = tools;
