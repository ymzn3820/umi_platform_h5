<template>
	<view style="padding: 30upx;">
		<!-- <view class="top">
			<view class="title">账号：{{ memberInfo.nick_name }}</view>
			<view class="title" v-if="memberInfo.level_expire_time != null">服务商到期时间： {{ memberInfo.level_expire_time }}</view>
		</view> -->
		<view class="headline" v-if="listItem.length > 0">
			<view style="color: #000;font-size: 32rpx;font-weight: 500;margin-right: 40upx;">成交明细</view>
			<view class="text" style="margin-right: 32rpx;">成员人数：{{ serveInfo.member }}人</view>
			<view class="text">累计佣金：{{ serveInfo.count_balance }}元</view>
		</view>
		<scroll-view class="listItem" v-for="(item,index) in listItem" :key="index" v-if="listItem.length > 0">
			<view class="base">
				<view class="item">
					<view class="left">订单编号</view>
					<view class="right">{{item.order_no}}</view>
				</view>
				<view class="item">
					<view class="left">购买人</view>
					<view class="right">{{item.nick_name}}</view>
				</view>
				<view class="item">
					<view class="left">充值金额</view>
					<view class="right">{{item.amount}}</view>
				</view>
				<view class="item">
					<view class="left">服务商分佣</view>
					<view class="right">{{item.reward_commission}}</view>
				</view>
				<view class="item">
					<view class="left">分佣比例</view>
					<view class="right">{{item.commission_ratio}}</view>
				</view>
				<view class="item">
					<view class="left">购买时间</view>
					<view class="right">{{item.create_time}}</view>
				</view>
			</view>
		</scroll-view>
		
		<view class="on_order" v-if="listItem.length == 0">
			<image class="order_img" :src="backImg"></image>
		</view>
		
		<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
	</view>
</template>

<script>
	import { getMission } from '@/apis/user.js'
	export default {
		data() {
			return {
				memberInfo: '',
				page_no: 1,
				page_count: 10,
				pageTotal: 0,
				loadingType: 0,
				listItem: [],
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg',
				serveInfo: ''
			};
		},
        
		onLoad(option) {
			this.serveInfo = JSON.parse(uni.getStorageSync('serveInfo'))
			// console.log(this.memberInfo, 555)
		},
		onShow() {
			this.getMissionList()
		},
		
		methods: {
			myShare() {
				uni.navigateTo({
					url: '/childPage/distribution/share',
				})
			},
			
			// 获取人员列表
			getMissionList() {
				let val = {
					page_size: this.page_count,
					page: this.page_no
				}
				getMission(val).then(res => {
					if (res.code == 20000) {
						this.listItem = res.data.data;
						console.log(this.listItem,5558)
			
						let total = res.data.total;
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						if (this.pageTotal == 1) {
							this.loadingType = 1;
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取信息失败');
				})
			},
			
			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
					page_size: this.page_count,
					page: this.page_no
				}
				getMission(val).then(res => {
					if (res.code == 20000) {
			
						let total = res.data.total;
						if (total == 0) return
						let List = res.data.data;
						let addList = this.listItem;
						List.forEach(item => {
							addList.push(item);
						});
			
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						// console.log(this.pageTotal, 158)
						if (this.pageTotal <= this.page_no) {
							this.loadingType = 1
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取信息失败');
				})
			},
			
		}

	}
</script>

<style lang="less" scoped>
	.top {
		width: calc(100% - 60upx);
		border-radius: 8upx;
		background: #FFF;
		padding: 16upx 30upx;

		.title {
			color: #1E211F;
			font-size: 26upx;
			font-weight: 400;
			line-height: 42upx;
		}
	}

	.headline {
		margin: 32upx 0 24upx 0;
		display: flex;
		

		.text {
			color: #000;
			font-size: 28upx;
			font-weight: 400;
			line-height: 150%;
			/* 21px */
		}
	}

	.listItem {
		width: calc(100% - 60upx);
		border-radius: 8upx;
		background: #FFF;
		padding: 30upx;
		margin-top: 24upx;

		.base {
			margin-top: 32upx;

			.item {
				display: flex;
				justify-content: space-between;
				margin-top: 32upx;
				margin-top: 28upx;

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
	
	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60vh;
		width: 100vw;
	}
	
	.order_img {
		width: 450upx;
		height: 450upx;
	}
	
	.on_order_list {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28upx;
		height: 100upx;
		line-height: 100upx;
		width: calc(100% - 60upx);
		text-align: center;
		color: #C0C4CC;
	}
</style>