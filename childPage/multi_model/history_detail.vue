<template>
	<view>
		<view style="padding: 32upx 32upx 180upx 32upx;">
			<view class="main" v-for="(item,index) in messageList" :key="index">
				<view class="item up" v-if="index == 0">
					<view class="top">
						<image class="pic" :src="log" mode="widthFix"></image>
						<view class="title">无忧秘书智脑</view>
					</view>
					<ua-markdown :source="item.content" :showLine="false" />
					
				</view>
				<view class="item up" v-if="item.role=='assistant'">
					<view class="top">
						<image class="pic" :src="getImgUrl(item.role_logo)" mode="widthFix"></image>
						<view class="title">{{ item.role_name }}</view>
					</view>
					<ua-markdown :source="item.content" :showLine="false" />
					
				</view>
			</view>
		</view>
		
		<view class="pic_btn">
			<view class="btn" @click="toStart()">开启新对话</view>
		</view>
	</view>
</template>

<script>
	import {
		getOneList
	} from "@/apis/user.js"
	import uaMarkdown from '../../components/ua2-markdown/ua-markdown.vue'
	export default {
		data() {
			return {
				log: global.baseImg + '/xcx/com/message_center/Frame%20427320411.png',
				userImg: global.baseImg + '/xcx/com/message_center/Ellipse%202309.png',
				session_code: '',
				userName: '',
				messageList: [],
			};
		},
		onLoad(option) {
			if(option.session_code) {
				this.session_code = option.session_code
			}
			
			let avatarUrl = global.baseImg+ '/'+ uni.getStorageSync("avatarUrl");
			this.userImg = avatarUrl;
			let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			this.userName = userInfo.nick_name;
			
		},
		onShow() {
			this.historySession()
		},
		components: {
			uaMarkdown
		},
		methods: {
			
			
			historySession() {

				let code = this.session_code
				this.messageList = []
				getOneList(code).then(res => {
					if(res.code == 20000) {
						if(res.data == null) {
							this.messageList = []
						} else {
							this.messageList = res.data
						}
						
					} else {
						this.$api.msg(res.msg)
					}
					
				})
				// console.log(this.messageList, 5589)
			},
			
			toStart() {
				uni.navigateTo({
					url: '/childPage/multi_model/multi_model'
				})
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
		}
	}
</script>

<style lang="less" scoped>
	.main {
		border-radius: 8upx;
		background: #FFF;
		padding: 0 32upx;

		.item {
			padding: 15upx 20upx;
			width: calc(100% - 40upx);
			.top {
				display: flex;

				.pic {
					width: 64upx;
					hieght: 64upx;
					border-radius: 50%;
					margin-right: 24upx;
				}

				.title {
					color: #000;
					font-size: 28upx;
					font-weight: 500;
					line-height: 235%;
					/* 21px */
				}
			}

			.bottom {
				color: #505050;
				font-size: 24upx;
				line-height: 150%;
				/* 18px */
				margin-top: 24upx;
			}
		}

		.up {
			border-top: none;
		}

	}

	.pic_btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 15upx 0;
		position: fixed;
		bottom: 0;
		background: #fff;
		.pic_top {
			width: 100%;
			text-align: center;
			font-size: 28upx;
			line-height: 40upx;
			margin-bottom: 20upx;
		}
		.btn{
			border-radius: 12rpx;
			background: #1F64FF;
			width: 70%;
			padding: 20rpx 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-size: 34upx;
			line-height: 34upx;
		}
	}
	
	.bot_btn {
		width: 100%;
		padding: 20upx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		.btn_left {
			font-size: 30upx;
			color: #1F64FF;
			font-weight: 530;
		}
	}
</style>