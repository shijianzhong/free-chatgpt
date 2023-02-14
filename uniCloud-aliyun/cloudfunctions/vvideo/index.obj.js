// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function() { // 通用预处理器

	},

	async getIemId(dyurl) {
		try {
			let response = await uniCloud.httpclient.request(dyurl, {
				method: 'GET',
				headers: {
					'user-agent': ' Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
				},
				dataType: "text"
			})
			var revideo = /video\/(\d*)/
			var item_ids = revideo.exec(response.headers.location)[1]
			return item_ids
		} catch (error) {
			return 0
		}
	},
	async getVideoInfo(itemId) {

		try {
			let _url = `https://www.iesdouyin.com/aweme/v1/web/aweme/detail/?aweme_id=${itemId}`
			console.log(itemId)
			console.log("_url:::::", _url)
			let response = await uniCloud.httpclient.request(_url, {
				method: "POST",
				headers: {
					'user-agent': ' Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
				},
				dataType: "json"
			})
			let {
				status_code
			} = response.data
			if (status_code === 0) {
				// 无水印视频链接
				// let url = item_list.video.play_addr.url_list[0].replace(
				//     'playwm',
				//     'play'
				// )
				// let url = response.data.aweme_detail.video.play_addr.url_list[2]
				let uri = response.data.aweme_detail.video.play_addr.uri
				// 转换成1080p
				url = `https://aweme.snssdk.com/aweme/v1/play/?video_id=${uri}&ratio=1080p`
				console.log('1080p  ', url);
				// 视频文案
				let desc = response.data.aweme_detail.desc;
				// 文案过滤非法字符
				const errwin = /[\\\\/:*?\"<>|]/g;
				const subwin = ``;
				desc.replace(errwin, subwin);

				console.log('video play url  ', url);
				console.log('video desc  ', desc);
				return {
					url,
					desc
				}
			}
		} catch (e) {
			//TODO handle the exception
		}
	},
	
	
	/**
	 * 聚合短视频去水印
	 * 支持列表: 皮皮虾, 抖音, 微视, 快手, 6间房, 哔哩哔哩, 微博, 绿洲, 度小视, 开眼, 陌陌, 皮皮搞笑
	 * 全民k歌, 逗拍, 虎牙, 新片场, 哔哩哔哩, Acfun, 美拍, 西瓜视频, 火山小视频, 网易云Mlog
	 * @param {Object} url
	 */
	async getPolymerization(url){
	
		// https://docs.tenapi.cn/watermark/video.html
		let response = await uniCloud.httpclient.request("https://tenapi.cn/v2/video",{
			method:"POST",
			dataType:"json",
			data:{
				url
			}
		})
		if(response && response.data){
			return {
				code:200,
				data:response.data
			}
		}else{
			return {
				code:0,
				data:null
			}
		}
		
	},
	async vvLog(title,detail){
		const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云对象的clientInfo
			clientInfo: this.getClientInfo()
		})
		const categories = await dbJQL.collection('video-no-watermark-log').add({
			title,detail,
			create_time:new Date().toLocaleString()
		})
	}
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	/* 
	method1(param1) {
		// 参数校验，如无参数则不需要
		if (!param1) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		
		// 返回结果
		return {
			param1 //请根据实际需要返回值
		}
	}
	*/
}
