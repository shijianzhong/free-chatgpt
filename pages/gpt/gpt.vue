<template>
	<view class="gpt-container">
		<view class="box-1" id="list-box">
			<view class="talk-list">
				<ad unit-id="adunit-03b4ea4a78917251"></ad>
				<view v-for="(item,index) in talkList" :key="index" :id="`msg-${index}`">
					<view class="item flex_col" :class=" item.type == 1 ? 'push':'pull' ">
						<image :src="item.pic" mode="aspectFill" class="pic"></image>
						<view class="content">{{item.content}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="box-2" v-if="isline==1">
			<view class="flex_col">
				<view class="flex_grow">
					<input type="text" class="content" v-model="tempQs" placeholder="请输入聊天内容"
						placeholder-style="color:#DDD;" :cursor-spacing="6">
				</view>
				<button class="send" @tap="send">发送</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const gpt = uniCloud.importObject("chatgpt")
	const cconfig = uniCloud.importObject("cconfig")
	const talkList = ref([])
	const tempQs = ref()
	const isline = ref(0)
	const send = async () => {
		talkList.value.push({
			type: 1,
			content: tempQs.value
		})
		let _data = await gpt.chatgpt(tempQs.value)
		
		if (_data.choices.length > 0) {
			tempQs.value = ""
			for (let i = 0; i < _data.choices.length; i++) {
				talkList.value.push({
					type: 0,
					content: _data.choices[i].text
				})
			}
		}
		console.log(_data)
	}
	const getConfig = async () =>{
		let {data} = await cconfig.getConfig()
		console.log(data[0].isOnline)
		isline.value = data[0].isOnline
	}
	getConfig()
</script>

<style lang="scss">
	@import "../../lib/global.scss";

	page {
		background-color: #F3F3F3;
		font-size: 28rpx;
		height: 100%;
	}

	.gpt-container{
		height: 100%;
		// display: flex;
		// flex-direction: column;
		// align-content: space-between;
	}
	.box-1 {
		width: 100%;
		height: auto;
		padding-bottom: 200rpx;
		box-sizing: content-box;

		/* 兼容iPhoneX */
		margin-bottom: 0;
		margin-bottom: constant(safe-area-inset-bottom);
		margin-bottom: env(safe-area-inset-bottom);
	}

	.box-2 {
		position: fixed;
		
		left: 0;
		width: 100%;
		bottom: 0;
		height: auto;
		z-index: 2;
		border-top: #e5e5e5 solid 1px;
		box-sizing: content-box;
		background-color: #F3F3F3;

		/* 兼容iPhoneX */
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		>view {
			padding: 0 20rpx;
			height: 100rpx;
		}

		.content {
			background-color: #fff;
			height: 64rpx;
			padding: 0 20rpx;
			border-radius: 32rpx;
			font-size: 28rpx;
		}

		.send {
			background-color: #42b983;
			color: #fff;
			height: 64rpx;
			margin-left: 20rpx;
			border-radius: 32rpx;
			padding: 0;
			width: 120rpx;
			line-height: 62rpx;

			&:active {
				background-color: #5fc496;
			}
		}
	}

	.talk-list {
		padding-bottom: 20rpx;

		/* 消息项，基础类 */
		.item {
			padding: 20rpx 20rpx 0 20rpx;
			align-items: flex-start;
			align-content: flex-start;
			color: #333;

			.pic {
				width: 92rpx;
				height: 92rpx;
				border-radius: 50%;
				border: #fff solid 1px;
			}

			.content {
				padding: 20rpx;
				border-radius: 4px;
				max-width: 500rpx;
				word-break: break-all;
				line-height: 52rpx;
				position: relative;
			}

			/* 收到的消息 */
			&.pull {
				.content {
					margin-left: 32rpx;
					background-color: #fff;

					&::after {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 16rpx solid transparent;
						border-bottom: 16rpx solid transparent;
						border-right: 20rpx solid #fff;
						position: absolute;
						top: 30rpx;
						left: -18rpx;
					}
				}
			}

			/* 发出的消息 */
			&.push {
				/* 主轴为水平方向，起点在右端。使不修改DOM结构，也能改变元素排列顺序 */
				flex-direction: row-reverse;

				.content {
					margin-right: 32rpx;
					background-color: #a0e959;

					&::after {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 16rpx solid transparent;
						border-bottom: 16rpx solid transparent;
						border-left: 20rpx solid #a0e959;
						position: absolute;
						top: 30rpx;
						right: -18rpx;
					}
				}
			}
		}
	}
</style>
