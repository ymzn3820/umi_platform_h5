<template>
	<view>
		<!-- <view class="top_cont">
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
		</view> -->
		
		<!-- 历史对话内容 -->
		<view class="chat_cont">
			<view class="is_read" @click="readAll">一键已读</view>
			<scroll-view class="list_ul" scroll-y="true" v-if="messageList.length > 0">
				<view class="ul_style" v-for="(item, index) in messageList" :key="index" >
					<view class="li_style" @click="toDetail(item)">
						<view :class="[item.is_read == 1 ? 'li_read_title' : 'li_title']">{{ item.title }}</view>
						<view :class="[item.is_read == 1 ? 'li_read_desc' : 'li_desc']">{{ item.desc }}</view>
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
	import { getMessage, editMessage } from '@/apis/user.js'
	export default {
		data() {
			return {
				active: 0,
                searchValue: '',
				loadingType: 0,
				page_no: 1,
				page_count: 10,
				messageList: [],
				pageTotal: 0,
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg'
			}
		},
		components: {
			
		},
		onLoad() {
			
		},
		onShow() {
			this.getMessageList();
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
				this.getMessageList()
			},
			
			search() {
				this.page_no = 1;
				this.loadingType = 0;
				// this.searchValue = '';
				this.getMessageList()
			},
			
			// 获取公告列表
			getMessageList() {
			  let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			  let val = {
				  'user_id': userInfo.user_id,
				  'page_index': this.page_no,
				  'page_count': this.page_count
			  }
			  getMessage(val).then(res => {
				  if (res.code == 20000) {
					   this.messageList = res.data;
					 
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
				  this.$api.msg('获取公告失败');
			  })
			},
			
			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let val = {
				  'user_id': userInfo.user_id,
				  'page_index': this.page_no,
				  'page_count': this.page_count
				}
				getMessage(val).then(res => {
				  if (res.code == 20000) {

					  let total = res.total;
					  if (total == 0) return
					  let List = res.data;
					  let addList = this.messageList;
					  List.forEach(item => {
					  	addList.push(item);
					  });
					  
					  if(total%this.page_count == 0) {
						   this.pageTotal = total/this.page_count
					  } else {
						   this.pageTotal = parseInt(total/this.page_count) + 1
					  }
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
			
			readAll() {
			  let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			  let val = {
				  'user_id': userInfo.user_id,
			  }
			  editMessage(val).then(res => {
				  if (res.code == 20000) {
					  this.page_no = 1
					  this.loadingType = 0;
					  this.getMessageList()
				  } else {
					  this.$api.msg(res.msg);
				  }
			  }).catch(err => {
				  this.$api.msg('修改失败');
			  })
			},
			
			//查看详情
			toDetail(item) {
				uni.navigateTo({
					url: '/pages/notice/notice_detail?message_id=' + item.message_id,
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #f6f8fb;
	}
	.top_cont {
		width: 100%;
		height: 142upx;
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
		padding: 0 25upx;
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
		padding: 0upx  10upx 25upx 10upx;
		// margin-top: 150upx;
		margin-bottom: 30upx;
	}
	
	.ul_style {
		display: flex;
		flex-direction: column;
		padding: 15upx;
		background: #fff;
		border-radius: 8upx;
		margin-bottom: 15upx;
		.li_title {
			font-size: 30upx;
			line-height: 50upx;
			color: #333;
			width: 70%;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.li_desc {
			font-size: 26upx;
			line-height: 40upx;
			color: #666;
		}
		.li_read_title {
			font-size: 30upx;
			line-height: 40upx;
			color: #bfbfbf;
			width: 70%;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.li_read_desc {
			font-size: 26upx;
			line-height: 40upx;
			color: #bfbfbf;
		}
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
	
	.is_read {
		width: 100%;
		text-align: right;
		color: #1F64FF;
		font-size: 26upx;
		line-height: 40upx;
		padding: 20upx;
	}
	
</style>