// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129

// 微信公众号相关
const crypto = require('crypto');
module.exports = {
	_before: function() { // 通用预处理器

	},

	authGzh(ctx) {
		const token = 'mywxtoken',
			signature = ctx.signature,
			timestamp = ctx.timestamp,
			nonce = ctx.nonce
		// 字典排序
		const arr = [token, timestamp, nonce].sort()
		const sha1 = crypto.createHash('sha1')
		sha1.update(arr.join(''))
		const result = sha1.digest('hex')
		console.log(result)
		console.log(signature)
		if (result == signature) {
			return ctx.echostr
		} else {
			return false
		}
	},
	async getWxAccessToken(){
		
		console.log("调用获取token 了")
		let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxe930e462d424515a&secret=27de622f4c012adb3fcc432e00c15715`
		let response = await uniCloud.httpclient.request(url, {
			method: "GET",
			dataType: "json"
		})
		console.log(response)
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
