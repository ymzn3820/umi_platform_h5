<template>
	<view style="padding: 32upx;">
		<view class="main">
			<view class="title">升级服务商，将拥有更高佣金及收益</view>
			<view style="border-top: 4upx solid #F4F4F4;margin-top: 32upx;"></view>
			<view class="centre">
				<view class="left">当前等级：</view>
				<view style="font-weight: 500;">{{ level == 1 ? '普通分销' : '金牌分销' }}</view>
				<view class="right" @click="toUpgrades" v-if="level == 1">升级金牌分销</view>
			</view>
			<view style="font-size: 24upx;">当前分佣比例: 成员充值金额的{{ level == 1 ? '15%' : '30%' }}</view>
			<view class="bottom">
				<view class="left" @click="toService">申请服务商</view>
				<view class="right" @click="toEquity">查看权益</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		checkToken
	} from '@/apis/user.js'
	export default {
		data() {
			return {
                level: 0
			};
		},
		onLoad(option) {
			this.level = option.level
		},
		methods:{
			
			// 查看权益
			toEquity(){
				if(uni.getStorageSync('checkToken')) {
					let token = uni.getStorageSync('checkToken')
					let val = {
						'top_token': token
					}
					checkToken(val).then(res => {
						if (res.code == 20000) {
							uni.navigateTo({
								url:'/childPage/facilitator/equity'
							})
						} else if(res.code == 40023) {
							uni.navigateTo({
								url:'/childPage/facilitator/enter'
							})
						} else {
							this.$api.msg(res.msg)
						}
					}).catch(err => {
						this.$api.msg('获取信息失败！')
					})
				} else {
					uni.navigateTo({
						url:'/childPage/facilitator/enter'
					})
				}
				
			},
			// 服务商升级
			toUpgrades(){
				uni.navigateTo({
					url:'/childPage/distribution/grade'
				})
			},
			// 服务商信息
			toService(){
				uni.navigateTo({
					url:'/childPage/facilitator/message'
				})
				// uni.navigateTo({
				// 	url:'/childPage/facilitator/service'
				// })
			}
		}
	}
</script>

<style lang="less">
	.main {
		width: 100%;
		border-radius: 8upx;
		padding: 32upx;
		background: #FFF;

		.title {
			color: #1D2129;
			font-size: 28upx;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			
		}

		.centre {
			display: flex;
			align-items: center;
			margin: 46upx 0 30upx 0;

			.left {
				color: #1D2129;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				margin-right: 20upx;
			}

			.right {
				color: #FFF;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 34upx;
				padding: 5upx 30upx;
				flex-shrink: 0;
				border-radius: 8upx;
				background: #1F64FF;
				text-align: center;
				margin-left: 24rpx;
			}
		}

		.bottom {
			margin-top: 104upx;
			display: flex;
			align-items: center;
			justify-content: center;

			.left {
				color: #F6F8FB;
				text-align: center;
				font-size: 30upx;
				font-style: normal;
				font-weight: 500;
				line-height: 80upx;
				border-radius: 12upx;
				background: #1F64FF;
				width: 40%;
				height: 80upx;
				justify-content: space-between;
				align-items: center;
				flex-shrink: 0;
				margin-right: 20upx;
			}

			.right {
				color: #1F64FF;
				font-size: 30upx;
				font-style: normal;
				font-weight: 500;
				display: flex;
				width: 40%;
				height: 80upx;
				line-height: 80upx;
				align-items: center;
				flex-shrink: 0;
				border-radius: 12upx;
				border: 3upx solid #1F64FF;
				display: flex;
				justify-content: center;
			}
		}
	}
</style>