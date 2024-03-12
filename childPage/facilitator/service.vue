<template>
	<view style="padding: 32upx;">
		<view class="top">
			<view class="title">账号：{{ memberInfo.nick_name }}</view>
			<view class="title" v-if="serveInfo.status < 2">服务商状态：审核中</view>
			<view class="title" v-if="serveInfo.status == 2">服务商状态：审核通过</view>
			<view class="title" v-if="serveInfo.status == 3">服务商状态：已失效</view>
			<view class="title" v-if="memberInfo.level_expire_time != null">服务商到期时间： {{ memberInfo.level_expire_time }}
			</view>
		</view>
		<view class="main">
			<view style="color: #000;font-size: 32upx;font-weight: 500;">概括</view>
			<view class="gird">
				<view class="item">
					<view class="number">{{ serveInfo.member }}</view>
					<view class="text">我的成员人数(人)</view>
					<view class="item_btn" @click="toManage">查看成员</view>
				</view>
				<view class="item">
					<view class="number">{{ serveInfo.count_balance }}</view>
					<view class="text">分佣总金额(元)</view>
					<view class="item_btn" @click="toDeal">查看明细</view>
				</view>
				<view class="item">
					<view class="number">{{ serveInfo.withdraw_balance }}</view>
					<view class="text">未提现佣金(元)</view>
					<view class="item_btn" @click="toBank">提现</view>
					<view class="item_btn" @click="toExchange">兑换算力</view>
				</view>
			</view>
			<view style="border-top: 4upx solid #F4F4F4;"></view>
			<view class="gird_btn">
				<view class="item" style="background-color: #F4F7FE;" @click="toManage">
					<image :src="manage_img" mode=""></image>
					<view class="text">团队成员管理</view>
				</view>
				<view class="item" style="background-color: #FEF4F4;" @click="toDeal">
					<image :src="deal_img" mode=""></image>
					<view class="text">成员成交明细</view>
				</view>
				<view class="item" style="background-color: #FEF9F4;" @click="toBrokerage">
					<image :src="brokerage_img" mode=""></image>
					<view class="text">提佣记录</view>
				</view>
				<view class="item" style="background-color: #F4F6FE;" @click="toEquity">
					<image :src="equity_img" mode=""></image>
					<view class="text">查看权益</view>
				</view>
			</view>
		</view>
		<!-- <view class="listItem">
			<view style="color: #000;font-size: 32upx;font-weight: 500;">服务商信息</view>
			<view class="base">
				<view class="item">
					<view class="left">审核状态</view>
					<view class="right">已通过</view>
				</view>
				<view class="item">
					<view class="left">服务商到期时间</view>
					<view class="right">2024-08-31 10:20:21</view>
				</view>
				<view class="item">
					<view class="left">注册通过时间</view>
					<view class="right">2023-09-31 10:20:21</view>
				</view>
				<view class="item">
					<view class="left">注册服务商时间</view>
					<view class="right">2023-07-31 10:20:18</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import {
		OperatorStatistics
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				manage_img: global.baseImg +
					'/xcx/com/message_center/%E5%9B%A2%E9%98%9F%E6%88%90%E5%91%98%E7%AE%A1%E7%90%86.png', //成员管理
				deal_img: global.baseImg +
					'/xcx/com/message_center/%E6%88%90%E5%91%98%E4%BA%A4%E6%98%93%E6%98%8E%E7%BB%86.png', //成交明细
				brokerage_img: global.baseImg + '/xcx/com/message_center/%E6%8F%90%E7%8E%B0%E8%AE%B0%E5%BD%95.png', //提佣
				equity_img: global.baseImg + '/xcx/com/message_center/%E6%9F%A5%E7%9C%8B%E6%9D%83%E7%9B%8A.png', //权益
				serveInfo: '',
				memberInfo: ''
			};
		},
		onLoad() {
			this.memberInfo = JSON.parse(uni.getStorageSync('memberInfo'))
			console.log(this.memberInfo, 8895)
		},
		onShow() {
			this.getInfo()
		},
		methods: {

			// 获取服务商信息
			getInfo() {
				OperatorStatistics().then(res => {
					if (res.code == 20000) {
						// console.log(res.data, 320)
						this.serveInfo = res.data;
						// console.log(this.serveInfo,8886)
						uni.setStorageSync('serveInfo', JSON.stringify(res.data));
						uni.setStorageSync('distributionInfo', JSON.stringify(res.data));
					}else if(res.code == 50000){
						this.$api.msg(res.msg)
						uni.navigateTo({
							url:'/pages/login/login'
						})
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取信息失败！')
				})
			},
			// 查看权益
			toEquity() {
				uni.navigateTo({
					url: '/childPage/facilitator/equity?level=3'
				})
			},
			toManage() {
				uni.navigateTo({
					url: '/childPage/facilitator/manage'
				})
			},
			toDeal() {
				uni.navigateTo({
					url: '/childPage/facilitator/deal'
				})
			},
			toBrokerage() {
				uni.navigateTo({
					url: '/childPage/facilitator/brokerage'
				})
			},

			toBank() {
				uni.navigateTo({
					url: '/childPage/distribution/cash',
				})
			},
			toExchange() {
				uni.navigateTo({
					url: '/childPage/distribution/Exchange',
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.top {
		width: 100%;
		border-radius: 8upx;
		background: #FFF;
		padding: 16upx 32upx;

		.title {
			color: #1E211F;
			font-size: 26upx;
			font-weight: 400;
			line-height: 42upx;
		}
	}

	.main {
		width: 100%;
		border-radius: 8upx;
		background: #FFF;
		margin: 24upx 0;
		padding: 16upx 32upx;

		.gird {
			display: flex;
			margin: 32upx 0;

			.item {
				flex: 1;
				text-align: center;

				.number {
					color: #1F64FF;
					font-size: 36upx;
					font-weight: 500;
					line-height: 150%;
				}

				.text {
					color: #666;
					font-size: 24upx;
					font-weight: 400;
					line-height: 150%;
				}

				.item_btn {
					font-size: 24upx;
					color: #fff;
					line-height: 30upx;
					padding: 15upx;
					background: #1f64ff;
					border-radius: 8upx;
					width: 80%;
					margin: 10upx 0;
				}
			}
		}

		.gird_btn {
			display: flex;
			flex-wrap: wrap;
			margin-top: 50upx;

			.item {
				display: flex;
				width: 44%;
				height: 150upx;
				border-radius: 8upx;
				align-items: center;
				margin: 16upx;

				image {
					width: 48upx;
					height: 48upx;
					margin-right: 24upx;
					margin-left: 28upx;
				}

				.text {
					color: #000;
					font-size: 28upx;
					font-weight: 400;
					line-height: 150%;
					/* 21px */
				}
			}
		}
	}

	.listItem {
		width: 100%;
		border-radius: 8upx;
		background: #FFF;
		padding: 16upx 32upx;

		.base {
			margin-top: 6upx;

			.item {
				display: flex;
				justify-content: space-between;
				margin-top: 26upx;

				.left {
					color: #A4A4A4;
					font-size: 28upx;
					font-weight: 400;
					line-height: 150%;
					/* 21px */
				}

				.right {
					color: #272F3B;
					font-size: 28upx;
					font-weight: 400;
					line-height: 40upx;
					/* 142.857% */
				}
			}

		}
	}
</style>