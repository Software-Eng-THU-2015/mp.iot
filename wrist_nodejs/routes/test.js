var tools = require('./tools');

var user = "ose6Ut8Ir-41wB7gQx89BifYa49Q";
var user_2 = "ose6UtzLl9NJj7DP7AZAOOybiH1k";

//tools.customSendArticle(user_2, "信仰圣光吧", "圣光会制裁你的！", "http://image.baidu.com/search/down?tn=download&ipn=dwnl&word=download&ie=utf8&fr=result&url=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fblog%2F201403%2F23%2F20140323004621_TX2yr.jpeg", "http://print.ssast2015.com", function(err, result){console.log(result);});
//tools.getStat("gh_99e1bf01488e_001", function(err, result){console.log(result);});

tools.createQrCode("gh_99e1bf01488e_001", function(err, result){console.log(err);console.log(result);});
