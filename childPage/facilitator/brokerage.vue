<template>
	<view style="padding: 30upx;">
		
		<view class="headline">
			<view style="display: flex;">
				<view style="color: #000;font-size: 32rpx;font-weight: 500;margin-right: 40upx;">成交明细</view>
				<view class="text">提佣次数：{{count }}</view>
			</view>
			<view class="text" style="14upx">提佣成功总金额：{{ serveInfo.count_balance - serveInfo.withdraw_balance }}元</view>
			<view style="display: flex;">
				<view class="text" style="margin-right: 18upx;">未提现金额：{{ serveInfo.withdraw_balance }}元</view>
				<view class="btn" @click="toBank">提现</view>
				<view class="btn" style="margin-left: 50rpx;" @click="toExchange">兑换算力</view>
			</view>
		</view>
		<scroll-view class="listItem" v-for="(item,index) in listItem" :key="index" v-if="listItem.length > 0">
			<view class="base">
				<view class="item">
					<view class="left">提现单号</view>
					<view class="right">{{item.order_no}}</view>
				</view>
				<view class="item">
					<view class="left">提现金额</view>
					<view class="right">{{item.withdrawal_amount}}</view>
				</view>
				<view class="item">
					<view class="left">到账银行</view>
					<view class="right">{{item.bank}}</view>
				</view>
				<view class="item">
					<view class="left">提现时间</view>
					<view class="right">{{item.create_time}}</view>
				</view>
				<view class="item">
					<view class="left">提现状态</view>
					<view class="right">
						<text class="r_tip_g" v-if="item.w_status == 1">审核中</text>
						<text class="r_tip" v-if="item.w_status == 2">已提现</text>
						<text class="r_tip_b" v-if="item.w_status == 3">已驳回</text>
					</view>
				</view>
				<view class="item" v-if="item.w_status == 3">
					<view class="left">驳回理由</view>
					<view class="right">{{item.reason}}</view>
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
	import { getWithdrawal } from '@/apis/user.js'
	export default {
		data() {
			return {
				page_no: 1,
				page_count: 10,
				pageTotal: 0,
				loadingType: 0,
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg',
				listItem: [],
				serveInfo: '',
				count: 0,
			};
		},
		onLoad() {
			this.serveInfo = JSON.parse(uni.getStorageSync('serveInfo'))
			uni.setStorageSync('distributionInfo', uni.getStorageSync('serveInfo'));
		},

        onShow() {
        	this.getWithdrawalList()
        },
		
		methods: {
		   // 获取人员列表
		   getWithdrawalList() {
				let val = {
					page_size: this.page_count,
					page: this.page_no
				}
				getWithdrawal(val).then(res => {
					if (res.code == 20000) {
						this.listItem = res.data.data;
			            this.count = res.data.total;
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
				getWithdrawal(val).then(res => {
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
		width: 91%;
		height: 124upx;
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

	.headline {
		margin: 32upx 0 24upx 0;

		.text {
			color: #000;
			font-size: 28upx;
			font-weight: 400;
			line-height: 150%;
		}

		.btn {
			width: 144upx;
			height: 40upx;
			border-radius: 4px;
			border: 2upx solid #FFF;
			background: #1F64FF;
			text-align: center;
			line-height: 40upx;
			color: #fff;
			font-size: 24upx;
		}
	}

	.listItem {
		width: 91%;
		border-radius: 8upx;
		background: #FFF;
		padding: 32upx;
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
					.r_tip {
						font-size: 22upx;
						color: #FAAD14;
					}
					.r_tip_g {
						font-size: 22upx;
						color: #52C41A;
					}
					.r_tip_b {
						font-size: 22upx;
						color: #FB423F;
					}
				}
			}

		}
	}
	
	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 90vh;
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