<template>
	<view>
		<view style="padding: 30upx;">
			<!-- <view class="top" v-if="listItem.length > 0">
				<view class="title">账号：用户 123</view>
				<view class="title">服务商到期时间： 2024-11-13 10:10:16</view>
			</view> -->
			<view class="headline" v-if="listItem.length > 0">
				<view style="color: #000;font-size: 32rpx;font-weight: 500;margin-right: 40upx;">我的团队成员</view>
				<view class="text">成员人数：{{ serveInfo.member }}人</view>
			</view>
			<scroll-view class="listItem" v-for="(item,index) in listItem" :key="index" v-if="listItem.length > 0">
				<view style="color: #272F3B;font-size: 28rpx;font-weight: 500;">{{item.nick_name}}</view>
				<view class="base">
					<view class="item">
						<view class="left">成员级别</view>
						<view class="right">
							<text v-if="item.d_level == 1">普通分销</text>
							<text v-if="item.d_level == 2">金牌分销</text>
							<text v-if="item.d_level == 3">服务商</text>
						</view>
					</view>
					<view class="item">
						<view class="left">上级用户名称</view>
						<view class="right">{{item.t_nick_name}}</view>
					</view>
					<view class="item">
						<view class="left">加入团队时间</view>
						<view class="right">{{item.create_time}}</view>
					</view>
				</view>
			</scroll-view>

			<view class="on_order" v-if="listItem.length == 0">
				<image class="order_img" :src="backImg"></image>
			</view>

			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>

		</view>
		<view class="footer">
			<view class="bottom">
				<view class="btn2" @click="myShare">分享海报</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		myMember
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				page_no: 1,
				page_count: 10,
				pageTotal: 0,
				loadingType: 0,
				backImg: global.baseImg + '/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg',
				listItem: [],
				serveInfo: ''
			};
		},
		onLoad() {
			this.serveInfo = JSON.parse(uni.getStorageSync('serveInfo'))
			console.log(this.serveInfo,5555)
		},
		onShow() {
			this.getMemberList()
		},
		methods: {
			// 获取人员列表
			getMemberList() {
				let val = {
					page_size: this.page_count,
					page: this.page_no
				}
				myMember(val).then(res => {
					if (res.code == 20000) {
						this.listItem = res.data.data;

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
				myMember(val).then(res => {
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
			myShare() {
				uni.navigateTo({
					url: '/childPage/distribution/share',
				})
			},
		}


	}
</script>

<style lang="less" scoped>
	.top {
		width: 91%;
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
		display: flex;
		justify-content: space-between;

		.text {
			color: #000;
			font-size: 28upx;
			font-weight: 400;
			line-height: 150%;
			/* 21px */
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
				}
			}

		}
	}

	.footer {
		width: calc(100%);
		background-color: #fff;
		position: fixed;
		bottom: 0;
		padding: 20upx 0;

		.bottom {

			width: 70%;
			height: 85upx;
			border-radius: 12upx;
			background: #1F64FF;
			color: #fff;
			line-height: 85upx;
			text-align: center;
            margin: auto;
			
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