<template>
	<view>
		<view class="top_cont">
			<view class="search_cont">
				<view class="search">
					<image class="search_img" src="@/static/user/search.png"></image>
					<input v-model="searchValue" placeholder="请输入订单编号" type="text" class="search_input" @input="search" />
				</view>
				<view class="cont_tabs">
					<view class="tabs_l">
						<view @click="version(0)" :class="[active == 0 ? 'active_tabs' : 'tabs']">全部</view>
					</view>
					<view class="tabs_l">
						<view @click="version(1)" :class="[active == 1 ? 'active_tabs' : 'tabs']">待付款</view>
					</view>
					<view class="tabs_l">
						<view @click="version(2)" :class="[active == 2 ? 'active_tabs' : 'tabs']">已付款</view>
					</view>
					<view class="tabs_l">
						<view @click="version(4)" :class="[active == 4 ? 'active_tabs' : 'tabs']">已过期</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 历史对话内容 -->
		<view class="chat_cont">
			<scroll-view class="list_ul" scroll-y="true" v-if="orderList.length > 0">
				<view class="ul_style" v-for="(item, index) in orderList" :key="index" >
					<view class="li_style" @click="toDetail(item.order_id)">
						<view class="li_top">
							<text class="top_l">订单号：{{ item.order_id }}</text>
							<text class="top_r">{{ item.created_at.slice(0,10) }}</text>
						</view>
						<view class="li_btn">金&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;额：￥{{ item.total_amount }}</view>
						<view class="li_bom">
							<view class="bom_l">套&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;餐：{{ item.prod_name }}</view>
							<view class="bom_r">
								<text class="r_btn" v-if="item.status == 1">待付款</text> 
								<text class="r_btn_stop" v-if="item.status == 2">已付款</text>
								<text class="r_btn_gq" v-if="item.status == 4">已过期</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<view class="on_order" v-else>
				<image class="order_img" :src="backImg"></image>
			</view>
						
			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
		</view>
		
	</view>
</template>

<script>
	import { orderList } from '@/apis/user.js'
	export default {
		data() {
			return {
				active: 0,
                searchValue: '',
				loadingType: 0,
				page_no: 1,
				page_count: 10,
				orderList: [],
				pageTotal: 0,
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg'
			}
		},
		components: {
			
		},
		onLoad() {
			
		},
		onShow() {
			this.getOrderList();
		},
		methods: {
			// 选择版本
			version(val) {
				if(val == 0) {
					this.active = 0
				} else if(val == 1) {
					this.active = 1
				} else if(val == 2) {
					this.active = 2
				} else if(val == 4) {
					this.active = 4
				}
				this.page_no = 1;
				this.loadingType = 0;
				this.searchValue = '';
				this.getOrderList()
			},
			
			search() {
				this.page_no = 1;
				this.loadingType = 0;
				// this.searchValue = '';
				this.getOrderList()
			},
			
			// 获取对话列表
			getOrderList() {
			  let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			  let val = {
				  'user_id': userInfo.user_id,
				  'prod_cate_id': '[3]',
				  'status': this.active,
				  'order_id': this.searchValue,
				  'page_index': this.page_no,
				  'page_count': this.page_count
			  }
			  orderList(val).then(res => {
				  if (res.code == 20000) {
					   this.orderList = res.data;
					 
					  let total = res.total;
					  if(total%this.page_count == 0) {
						   this.pageTotal = total/this.page_count
					  } else {
						   this.pageTotal = parseInt(total/this.page_count) + 1
					  }
					  if(this.pageTotal == 1) {
						  this.loadingType = 1;
					  }
				  } else {
					  this.$api.msg(res.msg);
				  }
			  }).catch(err => {
				  this.$api.msg('获取订单信息失败');
			  })
			},
			
			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let val = {
				  'user_id': userInfo.user_id,
				  'prod_cate_id': '[3]',
				  'status': this.active,
				  'order_id': this.searchValue,
				  'page_index': this.page_no,
				  'page_count': this.page_count
				}
				orderList(val).then(res => {
				  if (res.code == 20000) {

					  let total = res.total;
					  if (total == 0) return
					  let List = res.data;
					  let addList = this.orderList;
					  List.forEach(item => {
					  	addList.push(item);
					  });
					  
					  if(total%this.page_count == 0) {
						   this.pageTotal = total/this.page_count
					  } else {
						   this.pageTotal = parseInt(total/this.page_count) + 1
					  }
					  // console.log(this.pageTotal,158)
					  if (this.pageTotal <= this.page_no) {
					  	this.loadingType = 1
					  }
				  } else {
					  this.$api.msg(res.msg);
				  }
				}).catch(err => {
					  this.$api.msg('获取订单信息失败');
				})
			},
			
			//查看详情
			toDetail(order_id) {
				uni.navigateTo({
					url: '/pages/user/order/order_detail?order_id=' + order_id,
				})
			}
		}
	}
</script>

<style scoped>
	page {
		background: #f6f8fb;
	}
	.top_cont {
		width: 100%;
		height: 167upx;
		background: #fff;
		position: fixed;
		top: 0;
		z-index: 10;
	}
	.search_cont {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 25upx 25upx 0 25upx;
	}
	.search {
		width: 100%;
		height: 72upx;
		background: #F6F6F6;
		border-radius: 100upx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 32upx;
		margin-bottom: 20upx;
	}
	.search_input {
		flex: 1;
	}
	.search_img {
		width: 36upx;
		height: 36upx;
	}
	.cont_tabs {
		width:100%;
		display: flex;
		
	}
	.tabs_l {
		width: 25%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.active_tabs {
		font-style: normal;
		font-weight: 500;
		font-size: 28upx;
		line-height: 50upx;
		color: #1F64FF;
		border-bottom: 5upx solid #1F64FF;
	}
	.tabs {
		font-style: normal;
		font-weight: 500;
		font-size: 28upx;
		line-height: 50upx;
		color: #999;
	}
	
	.list_ul {
		padding: 25upx 10upx;
		margin-top: 180upx;
		margin-bottom: 30upx;
	}
	
	.ul_style {
		display: flex;
		flex-direction: column;
		padding: 0 15upx
	}
	
	.li_style {
		display: flex;
		flex-direction: column;
		background: #fff;
		/* border: 1px solid #C0C4CC; */
		box-shadow:0upx 0upx 10upx rgba(0, 0, 0, 0.14);
		border-radius: 15upx;
		padding: 30upx;
		margin-bottom: 25upx;
	}
	.li_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 18upx;
	}
	.top_l {
		font-weight: 400;
		font-size: 28upx;
		line-height: 42upx;
		color: #333;
		width: 70%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.top_r {
		ont-weight: 400;
		font-size: 24upx;
		line-height: 30upx;
		color: #6E7480;;
	}
	.li_btn {
		font-weight: 400;
		font-size: 24upx;
		line-height: 35upx;
		color: #6E7480;
		margin-bottom: 12upx;
	}
	
	.li_bom {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.bom_l {
		font-weight: 400;
		font-size: 24upx;
		line-height: 35upx;
		color: #6E7480;
	}
	.r_btn {
		background: rgba(82, 196, 26, 0.2);
		border-radius: 8upx;
		font-weight: 400;
		font-size: 20upx;
		line-height: 28upx;
		color: #52C41A;
		padding: 8upx 18upx;
	}
	
	.r_btn_stop {
		background: rgba(31, 100, 255, 0.2);
		border-radius: 8upx;
		font-weight: 400;
		font-size: 20upx;
		line-height: 28upx;
		color: #1F64FF;
		padding: 8upx 18upx;
	}
	
	.r_btn_gq {
		background: rgba(245, 172, 62, 0.2);
		border-radius: 8upx;
		font-weight: 400;
		font-size: 20upx;
		line-height: 28upx;
		color: #F5AC3E;
		padding: 8upx 18upx;
	}
	
	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
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