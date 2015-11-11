##Data
---

###获取数据

获取数据通过发送一个HTTP的GET请求到"http://wrist.ssast2015.com/bongdata/"，返回信息为一个JSON数组。

###GET请求参数

params为:

startTime:必须，查询的开始时间，格式为"year-month-day hour:minute:second"

endTime:必须，查询的结束时间，格式同上

type:可选，指定查询的用户活动，活动类别如下：

	1	睡眠
	2	bong
	3	非bong
	4	摘下
	5	充电
	6	异常

subType:可选，若选则先指定type，查询进一步活动类别：
	
	type=1 睡眠：
	
		subType	对应运动	说明
		1	深睡眠	深度睡眠
		2	浅睡眠	浅度睡眠
		3	清醒	一次睡眠中的清醒状态
	
	type=2 bong:
	
		subType	对应运动	说明
		1	热身运动	和字面意思相同，运动强度最轻的一类运动。
		2	健走	强度稍高。
		3	运动	球类等运动。
		4	跑步	有氧跑步运动。
		5	游泳	游泳等水中运动。
		6	自行车	骑车等。
	
	type=3 非bong:
	
		subType	对应运动	说明
		1	静坐	例如坐在椅子上办公。
		2	散步	速度相当于走路。
		3	交通工具	开车、乘公交等快速交通工具。
		4	活动	例如在办公室短时间走动

###返回结果

返回结果为一个JSON数组，记录各时间段的参数，有些参数可能为0(无效)

	参数	说明
	startTime	该区块的开始时间，例如，用户早起跑步的跑步区块从 8:31 开始。
	endTime	该区块的结束时间，例如这个用户跑了 20 分钟，那么区块结束时间是 8:51 分。通过块的划分，可以使用户和开发者均能方便对一天的活动状态做出归纳。
	type	该区块的类型，用这个来区分bong和非bong状态。如果这个区段是bong态，则返回值是「2」，如果是比较平静的非bong态，则返回值是「3」。
	distance	用户在该区段间走过的距离，单位是米。
	speed	用户在该区段的平均运动速度，单位是千米每小时。
	calories	用户在这段时间内消耗了多少热量，单位是千焦耳。
	steps	该区段的步数，单位是步。
	subType	该区段的子运动类型，bong态（当上文中提到的 type 为「2」时）下有4个子类型，具体描述见下，非bong态（type 为「3」时）下有2个子类型，具体描述见下。
	actTime	该区段用户的活动时间，单位是秒。
	nonActTime	该区段用户的非运动时间，单位是秒。
	dsNum	深睡眠时长，单位：分钟
	lsNum	浅睡眠时长，单位：分钟
	wakeNum	清醒时长，单位：分钟
	wakeTimes	清醒次数，单位：次
	score	睡眠质量评分

###Example

GET请求：

	http://wrist.ssast2015.com/bongdata/?startTime=2015-11-10 00:00:00&endTime=2015-11-10 24:00:00

返回结果：

	[{"distance": 0, "score": 0, "wakeNum": 0, "dsNum": 0, "calories": 0, "subType": 0, "nonActTime": 0, "wakeTimes": 0, "steps": 0, "startTime": "2015-11-10 09:40:00", "actTime": 0, "lsNum": 0, "endTime": "2015-11-10 12:20:00", "type": 5},
	 {"distance": 0, "score": 2, "wakeNum": 0, "dsNum": 194, "calories": 0, "subType": 0, "nonActTime": 0, "wakeTimes": 0, "steps": 0, "startTime": "2015-11-10 12:21:00", "actTime": 0, "lsNum": 38, "endTime": "2015-11-10 16:12:00", "type": 1},
	 {"distance": 0, "score": 0, "wakeNum": 0, "dsNum": 0, "calories": 0, "subType": 0, "nonActTime": 0, "wakeTimes": 0, "steps": 0, "startTime": "2015-11-10 16:13:00", "actTime": 0, "lsNum": 0, "endTime": "2015-11-10 20:41:00", "type": 4},
	 {"distance": 157, "score": 0, "wakeNum": 0, "dsNum": 0, "calories": 59, "subType": 1, "nonActTime": 0, "wakeTimes": 0, "steps": 226, "startTime": "2015-11-10 20:42:00", "actTime": 0, "lsNum": 0, "endTime": "2015-11-10 21:42:00", "type": 2}, 
	{"distance": 0, "score": 0, "wakeNum": 0, "dsNum": 0, "calories": 22, "subType": 1, "nonActTime": 0, "wakeTimes": 0, "steps": 0, "startTime": "2015-11-10 21:44:00", "actTime": 0, "lsNum": 0, "endTime": "2015-11-10 22:02:00", "type": 2},
	 {"distance": 498, "score": 0, "wakeNum": 0, "dsNum": 0, "calories": 75, "subType": 0, "nonActTime": 296, "wakeTimes": 0, "steps": 715, "startTime": "2015-11-10 22:03:00", "actTime": 544, "lsNum": 0, "endTime": "2015-11-10 22:16:00", "type": 3}, 
	{"distance": 44, "score": 0, "wakeNum": 0, "dsNum": 0, "calories": 29, "subType": 0, "nonActTime": 360, "wakeTimes": 0, "steps": 65, "startTime": "2015-11-10 22:17:00", "actTime": 300, "lsNum": 0, "endTime": "2015-11-10 22:27:00", "type": 3}]