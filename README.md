## Java
---

###DEMO来源

DEMO源自微信开放的服务端Demo代码 http://iot.weixin.qq.com/doc/blue/BlueDemoServer.zip

###DEMO环境需要

Jre1.6+

Eclipse

对应版本的tomcat(Jre1.6->tomcat6, Jre1.7->tomcat7, Jre1.8->tomcat8)

推荐配置：Jre1.7+tomcat7

###DEMO环境配置

1. 安装Jre1.7
2. 打开Eclipse，选择Import->Existing Project,选择Demo所在文件夹，选择bluelight
3. 若打开后有大量Import Error，则右键bluelight->Build Path->Add External Archives,jar文件的bluelight/lib文件夹内
4. 在config.properties内填入微信、硬件信息，其中appID,appsecret为微信提供，token为自己设定，DeviceID,DeviceType,Mac为给定值
5. 将build.xml中的war.name改成自己项目的名字(目前为wrist.war)
6. 点击Window->Show View->Ant打开Ant窗口，将build.xml拖入，双击make-war生成war文件，保存在dist文件夹下。
7. tomcat服务器设置
	1. Linux下配置：
		1. 创建/usr/local/tomcat目录
		2. 修改权限：sudo chown 你的用户名 -R /usr/local/tomcat
		3. 在 http://mirrors.tuna.tsinghua.edu.cn/apache/tomcat/ 上下载对应的tomcat版本(bin文件夹下)，解压缩到/usr/local/tomcat目录下: tar xzvf xxx.tar.gz -C /usr/local/tomcat
		4. 将/usr/local/tomcat/apache-tomcat-*文件夹复制一份，重新名为自己项目的名字
		5. 启动tomcat(注意不要使用root权限): /usr/local/tomcat/XXX/bin/startup.sh
8. 在微信公众号/测试号上填写服务器url信息
9. 值得注意的是，目前微信服务器只支持80端口，而tomcat默认的端口的8080端口，解决方法如下：
	1. 若自己的服务器上已有nginx/apache等服务占用了80端口，则可设置的虚拟主机的proxy转发到8080端口
	2. 若未占用80端口，则可直接将项目文件夹下conf/server.xml中的<Connector port="8080" protocol="HTTP/1.1" .../>中的8080换成80

###DEMO结构说明

微信消息分类处理：com.bluelight.demo.service.CallbackService

硬件、微信API调用：com.bluelight.demo.api

开发调试工具类：com.bluelight.tools.Tools

注：开发调试工具可用于创建菜单、生成二维码以及其他你想要测试的功能；使用方法即直接运行Tool.java(作为Java Application)

###API文档

####transMsg

函数功能：

向设备发送信息

使用：

	import com.bluelight.demo.api.DeviceApi
	DeviceApi.tranMsg(....)

函数类型: public static String transMsg(String deviceType, String deviceID, String openID, String content)

参数说明:

deviceType,deviceID：用于唯一标识device，可用写死的固定值，或者用boundInfo内的参数(若已经绑定的话)

openID:用于唯一标识用户，可用写死的固定值，或者用boundInfo内的参数

content:发送给设备的信息，需要进行base64编码

Example:

    // 根据 fromUserName 获取绑定的信息
	Map<String, String> boundInfo = DBMock.queryBoundInfo(fromUser);

	// 未绑定
	if (boundInfo == null) {
		return XmlResp.buildText(fromUser, toUser, "未绑定");
	}

	String deviceType = boundInfo.get("deviceType");
	String deviceID = boundInfo.get("deviceID");
	String openID = boundInfo.get("openID");
	
	// 构造设备消息
	CmdId cmdId = BlueLight.CmdId.SEND_TEXT_REQ;
	String req_content = ""; //TODO:发送给设备的Content
	byte[] respRaw = BlueLight.build(cmdId, req_content, (short)0).toBytes();
	// Base64编码
	final String content = Base64.encodeBase64String(respRaw);
	// 推送消息给设备
	DeviceApi.transMsg(deviceType, deviceID, openID, content);

#### createQrcode

函数功能：

生成deviceIds对应的二维码ticket

使用：

	import com.bluelight.demo.api.DeviceApi
	DeviceApi.createQrcode(..)

函数类型：public static String createQrcode(List<String> deviceIds);

参数说明：

deviceIds:需要生成二维码的设备的deviceId(可一次生成多个设备的二维码)

返回值：

一个如下的字符串，其中ticket为有效性息：

	{
	    "errcode":0,
	    "errmsg":"succ",
	    "device_num":1,
	    "code_list":[{"device_id":"id1","ticket":"t1"}]
	}

#### createQrImage

函数功能：

利用createQrcode生成的ticket生成相应的二维码图片

使用说明：

	import com.bluelight.tools.Tools

函数类型：private static void createQrImage(String path, String deviceId, String ticket)

参数说明：

path:生成的二维码的存放路径

ticket:二维码字符串，由createQrcode生成

#### createQrByDeviceId

函数功能：

联合createQrcode,createQrImage,直接由deviceId生成相应的二维码图片

使用：

	import com.bluelight.tools.Tools
    Tools.createQrByDeviceId(..)

函数类型：public static void createQrByDeviceId(String deviceId)

#### getStat

函数功能：

查询设备状态

使用说明：

	import com.bluelight.demo.api.DeviceApi
	DeviceApi.getStat(..)

函数类型：public static String getStat(String deviceId);

返回结果：

一个JSON字符串，例如:

	{"errcode":0,"errmsg":"ok","status":1,"status_info":"authorized"}
#### getOpenId

函数功能：

查询设备绑定的用户的OpenId

使用说明：

	import com.bluelight.demo.api.DeviceApi
	DeviceApi.getOpenId(..)

函数类型：public static String getOpenId(String deviceType, String deviceId);

返回结果：

一个JSON字符串，例如：

	{
	"open_id":["omN7ljrpaxQgK4NW4H5cRzFRtfa8","omN7ljtqrTZuvYLkjPEX_t_Pmmlg",],
	"resp_msg":{"ret_code":0,"error_info":"get open id list OK!"}
	}

#### customSendText

函数功能：

给用户发送客服文本信息

使用说明：

	import com.bluelight.demo.api.MpApi
	MpApi.customSendText(..)

函数类型：public static void customSendText(String touser, String content)

参数说明：

touser：目标用户的openId,可通过boundInfo获得

#### menuCreate

函数功能:

创建自定义菜单

使用说明：

	import com.bluelight.demo.api.MpApi
    MpApi.menuCreate(..)

函数类型:public static String menuCreate(String body);

参数说明：

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

使用说明：

	import com.bluelight.demo.api.MpApi
	MpApi.menuQuery()

函数原型：public static String menuQuery();

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

使用说明：

	import com.bluelight.demo.api.MpApi
	MpApi.menuDelete();

函数类型：public static String menuDelete();

返回值：

一个JSON字符串，表示操作结果，如下：

	{"errcode":0,"errmsg":"ok"}