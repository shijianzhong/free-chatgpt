<template>
	<view class="main-containt">
		<uni-card title="视频地址">

			<uni-easyinput :inputBorder="false" type="textarea" v-model="videoUrl" placeholder="视频点击分享按钮,复制链接后,粘贴至此">
			</uni-easyinput>
			<view class="btns">
				<button type="primary" size="mini" @click="dealUrl">解析</button>
				<button size="mini" @click="clearUrl">清空</button>
			</view>

		</uni-card>
		<ad unit-id="adunit-4993e59bd01bfc1a" ad-type="video" ad-theme="white"></ad>
		<uni-card v-if="showVideoEle" title="预览视频" padding="0" spacing="0">
			<video id="my-video" :src="videoSource" controls></video>
			<progress :percent="percent" show-info stroke-width="3" />
			<view slot="actions" class="card-actions no-border">
				<button type="primary" size="mini" @click="showAd">下载</button>
			</view>
		</uni-card>
		<!-- <ad unit-id="adunit-03b4ea4a78917251"></ad> -->

	</view>
</template>
<!-- https://v.ixigua.com/BUQufbG/ -->
<!-- 6.12 LJI:/ 复制打开抖音，看看【瑞梵💋希🌈🌈的作品】粉色少女的沉浸式手帐# 手帐er手帐日常 # 手账... https://v.douyin.com/BYDaJTf/ -->
<!-- https://v.douyin.com/NKyY6Ch/ -->
<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import {
		onReady,
	} from "@dcloudio/uni-app";
	let videoUrl = ref('')
	let percent = ref(0)
	let videoAd = reactive(null)
	let isLoading = ref(false)
	const vvideo = uniCloud.importObject("vvideo")
	let videoSource = ref('')
	let showVideoEle = ref(false)
	let hadShowAd = ref(false)

	onReady(() => {
		isLoading.value = true;

		if (wx.createRewardedVideoAd) {
			videoAd = wx.createRewardedVideoAd({
				adUnitId: 'adunit-7c59818bab10151c'
			})
			videoAd.onLoad(() => {
				isLoading.value = false;
			})
			videoAd.onError((err) => {
				isLoading.value = true;
			})
			videoAd.onClose((res) => {
				console.log(res)
				if (res && res.isEnded) {
					hadShowAd.value = true
					downData()
					console.log("正常播放结束，可以下发游戏奖励onClose ");
					// 正常播放结束，可以下发游戏奖励
				} else {
					console.log("播放中途退出，不下发游戏奖励onClose ");
					// 播放中途退出，不下发游戏奖励
				}
			})
		}
	})
	const showAd = () => {
		if (hadShowAd.value) {
			downData()
		} else {
			if (isLoading.value) {
				return
			}
			if (videoAd) {
				videoAd.show().catch(() => {
					// 失败重试
					videoAd.load()
						.then(() => videoAd.show())
						.catch(err => {
							console.log('激励视频 广告显示失败')
						})
				})
			}
		}
	}
	const clearUrl = () => {
		videoUrl.value = ""
	}
	
	const dealUrl = async ()=>{
		if (!videoUrl.value) {
			uni.showToast({
				title: "空链接",
				duration: 2000
			})
			return
		}
		let regexp = /((http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
		// let urlReg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g //第二种
		let realUrl = videoUrl.value.match(regexp)
		if (!realUrl) {
			uni.showToast({
				title: "请输入正确的分享链接或内容",
				duration: 2000
			})
			return
		}
		console.log(realUrl[0])
		let {code ,data} = await vvideo.getPolymerization(realUrl[0])
		if(code===200){
			if(data.code==200 && data.data &&data.data.url){
				showVideoEle.value = true
				videoSource.value = data.data.url
			}else{
				uni.showToast({
					title: "无法获取数据",
					duration: 2000
				})
			}
		}else{
			uni.showToast({
				title: "无法获取数据",
				duration: 2000
			})
		}
	}
	
	const dealUrl1 = async () => {
		if (!videoUrl.value) {
			uni.showToast({
				title: "空链接",
				duration: 2000
			})
			return
		}
		let regexp = /((http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
		// let urlReg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g //第二种
		let realUrl = videoUrl.value.match(regexp)
		if (!realUrl) {
			uni.showToast({
				title: "请输入正确的分享链接或内容",
				duration: 2000
			})
			return
		}
		let _itemId = await vvideo.getIemId(realUrl[0])
		let {
			url,
			desc
		} = await vvideo.getVideoInfo(_itemId)
		if (url) {
			showVideoEle.value = true
		}
		videoSource.value = url
	}
	const downData = async () => {
		vvideo.vvLog("视频地址",videoSource.value)
		const downloadTask = uni.downloadFile({
			url: videoSource.value,
			success: (res) => {
				vvideo.vvLog("临时地址",res.tempFilePath)
				uni.saveVideoToPhotosAlbum({
					filePath: res.tempFilePath,
					success: (o) => {
						uni.showToast({
							title: "保存成功",
							duration: 2000
						})
					}
				})
			},
			fail: (e) => {
				vvideo.vvLog("下载失败",JSON.stringify(e))
			},
		});
		downloadTask.onProgressUpdate((res) => {
			percent.value = res.progress
			// console.log('下载进度' + res.progress);
			// console.log('已经下载的数据长度' + res.totalBytesWritten);
			// console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
		})
	}
</script>

<style>
	.btns {
		display: flex;
		justify-content: flex-end;

	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.card-actions {
		display: flex;
		margin-bottom: 30rpx;
	}

	video {
		width: 100%;
	}
</style>
