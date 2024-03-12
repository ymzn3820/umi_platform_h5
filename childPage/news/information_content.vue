<template>
	<view>
		<view class="main">
			<view class="title">{{contentList.title}}</view>
			<view class="center">
				<view class="left">
					<image class="avatar" src="/static/nav/user.png" mode="widthFix"></image>
					<text>无忧秘书智脑</text>
				</view>
				<text class="follow" @click="open">关注公众号</text>
			</view>
			<rich-text class="content" :nodes="contentList.content"></rich-text>
			<view class="bottom">
				<text class="time">{{ contentList.create_time ? contentList.create_time.slice(0,10) : '' }}</text>
				<text class="page_view">阅读{{contentList.read_count}}</text>
				<text class="like">点赞{{contentList.like_count}}</text>
			</view>
		</view>
		<view class="footer">
			<view class="title">
				相关推荐
			</view>
			<view>
				<view class="item" v-for="(item, index) in aiInforList" @click='contentChange(item.message_id)'
					:key="item.message_id">
					<view class="item_infor" v-if="index < 3">
						<view class="left">
							<view class="content">
								{{item.title}}
							</view>
							<view class="bottom">
								<text class="time">{{ item.create_time ? item.create_time.slice(0,10) : '' }}</text>
								<view class="right">
									<text class="page_view">阅读{{item.read_count}}</text>
									<text class="like">点赞{{item.like_count}}</text>
								</view>
							</view>
						</view>
						<view class="right" v-if="item.image">
							<image class="img" :src="item.image" mode="widthFix" />
						</view>
					</view>
				</view>

			</view>
		</view>
		<u-popup :show="infoShow" mode="center" :round="10" closeIconPos="top-right" :closeOnClickOverlay='true'
			@close="infoShow=false">
			<view style="text-align: center; padding: 20upx;">
				<view style="width: 100%; padding: 10upx 0; display: flex; justify-content: flex-end;"><u-icon
						name="close" color="#999" size="20" @click="infoShow=false"></u-icon></view>
				<image style="width:400upx; height: 400upx; " show-menu-by-longpress :src="codeImg" alt="" />
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getapplicationContent,
		getapplication
	} from '@/apis/home.js'
	export default {
		data() {
			return {
				contentList: [],
				aiInforList: [],
				infoShow: false,
				codeImg: global.baseImg +
					'/xcx/com/message_center/lQLPJxJzw4TEw-zNAZDNAZCwwxdv9c2FwUAFP15iKvUTAA_400_400.png'
			};
		},
		onLoad({
			message_id
		}) {

			this.getContent(message_id)
			this.getapplication()
		},
		methods: {
			open() {
				// this.infoShow = true
				window.location.href = "https://mp.weixin.qq.com/s/13GVWgKQKoNIiifMcyImCg";
			},
			async getContent(id) {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let data = {
					user_id: userInfo.user_id,
					message_type: 2,
					message_id: id
				}
				const res = await getapplicationContent(data)

				this.contentList = res.data[0]
				console.log(this.contentList);
			},
			// 获取ai资讯列表
			async getapplication() {

				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));

				let data = {
					user_id: userInfo.user_id,
					message_type: 2
				}
				const res = await getapplication(data)
				this.aiInforList = res.data
				console.log(this.aiInforList);

			},
			// 跳转到内容详情
			contentChange(id) {
				uni.navigateTo({
					url: '/pages/index/information_content?message_id=' + id,
				})
			},
			getImgUrl(url) {
				return global.baseImg + '/' + url;
			}

		}
	}
</script>

<style lang="less">
	.main {
		background-color: #fff;
		margin-top: 32upx;
		padding: 32upx;

		.title {
			font-size: 32upx;
			font-style: normal;
			font-weight: 500;
			line-height: 150%;
			/* 24px */
		}

		.center {
			display: flex;
			justify-content: space-between;
			text-align: center;
			height: 116upx;
			padding-top: 26upx;

			.left {
				text-align: center;
				color: #333;
				display: flex;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;

				/* 21px */
				.avatar {
					width: 48upx;
					height: 48upx;
				}
			}

			.follow {
				color: #1F64FF;
				font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				/* 19.5px */
				width: 160upx;
				height: 48upx;
				line-height: 48upx;
				border-radius: 8upx;
				border: 2upx solid #1F64FF;
			}
		}

		.content {
			color: #000;

			font-size: 26upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			/* 19.5px */
		}

		.bottom {
			color: #A6A6A6;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			margin: 48upx 0 16upx 0;
			display: flex;
			justify-content: space-between;
			text-align: center;

			/* 18px */
			.page_view {
				margin: 0 32upx 0 102upx;
			}
		}
	}

	.footer {
		width: 100%;
		background-color: #fff;
		margin-top: 24upx;
		padding: 32upx;


	}

	.item_infor {
		width: 100%;
		// height: 160upx;
		flex-shrink: 0;
		display: flex;
		justify-content: space-between;
		margin-top: 38upx;


		.left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			flex-grow: 1;
			margin-right: 60upx;

			.content {
				color: #333;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				/* 21px */
			}

			.bottom {
				margin-top: 50upx;
				color: #A6A6A6;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				display: flex;
				justify-content: space-between;

				/* 18px */
				.page_view {
					margin-right: 32upx;
				}
			}

		}

		.right {
			margin-right: 0;

			.img {
				width: 236upx;
				height: 160upx;

			}

		}
	}
</style>