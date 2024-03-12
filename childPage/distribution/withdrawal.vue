<template>
	<view class="container">
		<scroll-view scroll-y="true" v-if="cashList.length > 0">
		    <view class="list" v-for="(item,index) in cashList" :key="index">
		    	<view class="list_top" >
		    		<view class="top_cont">
		    			<view class="top_l">
		    				<text class="l_name">提现单号：</text>
		    				<text class="r_name">{{ item.order_no }}</text>
		    			</view>
		    			<view class="top_r">
		    				<text class="r_text">{{ item.bank }}</text>
		    				<text class="r_tip_g" v-if="item.w_status == 1">审核中</text>
							<text class="r_tip" v-if="item.w_status == 2">已提现</text>
		    				<text class="r_tip_b" v-if="item.w_status == 3">已驳回</text>
		    			</view>
		    		</view>
		    		<view class="top_text">
		    			<text class="text_l">提现金额：</text>
		    			<text class="text_r">￥{{ item.withdrawal_amount }}</text>
		    		</view>
		    		
		    		<view class="top_text">
		    			<text class="text_l">提现时间：</text>
		    			<text class="text_l">{{ item.create_time }}</text>
		    		</view>
		    		
		    		<view class="top_text" v-if="item.w_status == 3">
		    			<text class="text_p">驳回原因：</text>
		    			<text class="text_p">{{ item.reason }}</text>
		    		</view>
		    	</view>
		    </view>
		</scroll-view>
		
		<view class="on_order" v-else>
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
				rightImg: global.baseImg+'/avatar/user/9cfd1b8b-2305-4fad-8846-8db33fd32ac3.jpg',
				page_no: 1,
				page_count: 10,
				pageTotal: 0,
				loadingType: 0,
				cashList: [],
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg'
			}
		},
		components: {
			
		},
		onLoad() {

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
						this.cashList = res.data.data;
			   
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
						let addList = this.cashList;
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
	.container {
		padding: 20upx;
	}
	.list {
		padding: 25upx;
		margin-bottom: 20upx;
		background: #fff;
		.list_top {
			display: flex;
			flex-direction: column;
			.top_cont {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.top_l {
					font-style: normal;
					font-weight: 400;
					font-size: 24upx;
					line-height: 150%;
					.l_name {
						color: #666;
					}
					.r_name {
						color: #333;
					}
				}
				.top_r {
					font-style: normal;
					font-weight: 400;
					line-height: 150%;
					display: flex;
					align-items: flex-start;
					.r_text {
						font-size: 24upx;
						color: #333;
						padding-right: 10upx;
					}
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
			
			.top_text {
				font-style: normal;
				font-weight: 400;
				font-size: 24upx;
				line-height: 150%;
				padding: 10upx 0 10upx 0;
				.text_l {
					color: #666;
				}
				.text_r {
					color: #FB423F;
				}
				.text_p {
					color: #FB423F;
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