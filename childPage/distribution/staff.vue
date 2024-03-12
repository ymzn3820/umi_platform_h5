<template>
	<view class="container">
	    <view class="title">成员人数：{{ memberTotal }}人</view>
		<view class="staff_cont">
			<scroll-view scroll-y="true" v-if="staffList.length > 0">
			     <view class="cont_text" v-for="(item, index) in staffList" :key="index">
			     	<view class="avatar"><image class="avatar_img" :src= "item.avatar_url" mode=""></image></view>
			     	<view class="info">
			     		<text class="info_name">{{ item.nick_name }}</text>
			     		<text class="info_time">{{ item.create_time }}</text>
			     	</view>
			     </view>
			</scroll-view>
			
			<view class="on_order" v-else>
				<image class="order_img" :src="backImg"></image>
			</view>
			
			<view class="on_order_list" v-if="loadingType == 1">没有更多人员了!</view>
			
		</view>
	</view>
</template>

<script>
	import { getStaff } from '@/apis/user.js'

	export default {
		data() {
			return {
				page_no: 1,
				page_count: 10,
				staffList: [],
				pageTotal: 0,
				loadingType: 0,
				memberTotal: 0,
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg'
			}
		},
		components: {
			
		},
		onLoad() {

		},
		onShow() {
			this.getStaffList()
		},
		methods: {
			// 获取人员列表
			getStaffList() {
				let val = {
					page_size: this.page_count,
					page: this.page_no
				}
				getStaff(val).then(res => {
					if (res.code == 20000) {
						this.staffList = res.data.data;
						this.staffList.forEach((ele)=>{
							ele.avatar_url = global.baseImg +'/'+ele.avatar_url
						})
						let total = res.data.total;
						this.memberTotal = res.data.total;
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
				getStaff(val).then(res => {
					if (res.code == 20000) {
			
						let total = res.data.total;
						if (total == 0) return
						let List = res.data.data;
						let addList = this.staffList;
						List.forEach(item => {
							item.avatar_url = global.baseImg +'/'+item.avatar_url
							addList.push(item);
						});
			
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						console.log(this.pageTotal, 158)
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
	.title {
		font-style: normal;
		font-weight: 400;
		font-size: 28upx;
		line-height: 48upx;
		color: #888;
		padding: 20upx 30upx;
	}
	.staff_cont {
		background: #fff;
		padding: 0 30upx;
		.cont_text {
			padding: 15upx 0;
			border-bottom: 1upx solid #eee;
			display: flex;
			align-items: center;
			.avatar {
				padding-right: 20upx;
				.avatar_img {
					width: 98upx;
					height: 98upx;
					border-radius: 50%;
				}
			}
			.info {
				display: flex;
				flex-direction: column;
				.info_name {
					font-style: normal;
					font-weight: 500;
					font-size: 30upx;
					line-height: 150%;
					color: #333;
				}
				.info_time {
					font-style: normal;
					font-weight: 400;
					font-size: 24upx;
					line-height: 150%;
					color: rgba(51, 51, 51, 0.4);
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
		width: 100vw;
		color: #C0C4CC;
	}
	
</style>