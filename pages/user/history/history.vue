<template>
	<view>
		<view class="top_cont">
			<view class="search_cont">
				<view class="search">
					<image class="search_img" src="@/static/user/search.png"></image>
					<input v-model="searchValue" placeholder="请输入搜索内容" type="text" class="search_input" @input="search" />
				</view>
				<view class="cont_tabs">
					<view class="tabs_l">
						<view @click="version_top(0)" :class="[active_top == 0 ? 'active_tabs_top' : 'tabs_top']">AI对话</view>
					</view>
					<view class="tabs_l">
						<view @click="version_top(1)" :class="[active_top == 1 ? 'active_tabs_top' : 'tabs_top']">AI绘画</view>
					</view>
				</view>
				
				<view class="chat_type" v-if="active_top == 0">
					<view @click="version(4)" :class="[active == 4 ? 'active_tabs' : 'tabs']">文心一言</view>
					<view @click="version(8)" :class="[active == 8 ? 'active_tabs' : 'tabs']">ChatGLM</view>
					<view @click="version(5)" :class="[active == 5 ? 'active_tabs' : 'tabs']">讯飞星火</view>
					<view @click="version(10)" :class="[active == 10 ? 'active_tabs' : 'tabs']">通义千问</view>
					<view @click="version(12)" :class="[active == 12 ? 'active_tabs' : 'tabs']">360智脑</view>
					<!-- <view @click="version(0)" :class="[active == 0 ? 'active_tabs' : 'tabs']">AI35</view>
					<view @click="version(1)" :class="[active == 1 ? 'active_tabs' : 'tabs']">AI40</view>
					<view @click="version(7)" :class="[active == 7 ? 'active_tabs' : 'tabs']">Claude</view> -->
				</view>
				
				<view class="chat_type" v-if="active_top == 1">
					<view @click="version(13)" :class="[active == 13? 'active_tabs' : 'tabs']">通义万相</view>
					<view @click="version(3)" :class="[active == 3 ? 'active_tabs' : 'tabs']">百度绘画</view>
					<view @click="version(14)" :class="[active == 14 ? 'active_tabs' : 'tabs']">火山引擎</view>
				</view>
			</view>
		</view>
		
		<!-- 绘画历史 -->
		<view class="chat_cont" >
			<scroll-view class="list_ul" scroll-y="true" v-if="chatList.length > 0" :style="[{marginTop:(active_top == 1? '268rpx':'340rpx')}]">
			<!-- <scroll-view class="list_ul" scroll-y="true" v-if="chatList.length > 0" style="margin-top: 268rpx;"> -->
				<!-- <view class="ul_style" v-for="(item, index) in chatList" :key="index" @click="checkDetail(item.session_code)"> -->
				<view class="ul_style" v-for="(item, index) in chatList" :key="index" @click="checkDetail(item.chat_type < 13 ? item.session_code : item.image_code)">
					<view class="li_style">
						<view class="li_left" v-if="active_top == 1">
							<image class="li_img" :src="getImgUrl(item.chat_type < 13 ? item.content : item.result_image)"></image>
						</view>
						<view class="li_right">
							<view class="li_top">
								<text class="top_l">{{ item.title }}</text>
								<text class="top_r" v-if="item.chat_type == 4 && item.model === 'completions_pro'">文心一言-4</text>
								<text class="top_r" v-if="item.chat_type == 4 && item.model === 'completions'">文心一言</text>
								<text class="top_r" v-if="item.chat_type == 4 && item.model === 'eb-instant' ">文心一言-Turbo</text>
								<text class="top_r" v-if="item.chat_type == 4 && item.model === ''">文心一言</text>
								<text class="top_r" v-if="item.chat_type == 5 && item.model == 'v3.1' ">讯飞星火-v3.1</text>
								<text class="top_r" v-if="item.chat_type == 5 && item.model == 'v2.1' ">讯飞星火-v2.1</text>
								<text class="top_r" v-if="item.chat_type == 5 && item.model == 'v1.1' ">讯飞星火-v1.1</text>
								<text class="top_r" v-if="item.chat_type == 5 && item.model == '' ">讯飞星火-v1.1</text>
								<text class="top_r" v-if="item.chat_type == 10 && item.model == 'qwen-plus' ">通义千问-plus</text>
								<text class="top_r" v-if="item.chat_type == 10 && item.model == 'qwen-turbo' ">通义千问-turbo</text>
								<text class="top_r" v-if="item.chat_type == 10 && item.model == '' ">通义千问</text>
								<text class="top_r" v-if="item.chat_type == 8">ChatGLM</text>
								<text class="top_r" v-if="item.chat_type == 12 ">360智脑</text>
								<text class="top_r" v-if="item.chat_type == 6 ">Midjourney</text>
								<text class="top_r" v-if="item.chat_type == 9">Stable Diffusion</text>
								<text class="top_r" v-if="item.chat_type == 3 ">百度绘画</text>
								<text class="top_r" v-if="item.chat_type == 13">通义万相</text>
								<text class="top_r" v-if="item.chat_type == 14">火山引擎</text>
							</view>
							<view class="li_btn">提问时间：{{ item.create_time }}</view>
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
	import {
		chatList,
		drawList,
		getImgList
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				active_top: 0,
				active: 4,
				searchValue: '',
				loadingType: 0,
				page_no: 1,
				page_count: 10,
				chatList: [],
				pageTotal: 0,
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg'
			}
		},
		components: {

		},
		onLoad(option) {
            console.log(option)
			if(option.active != undefined) {
				this.active_top = option.active
				if(this.active_top == 0) {
					this.active = 4
				} else {
					this.active = 13
				}
				this.page_no = 1;
				this.loadingType = 0;
				this.searchValue = '';
				this.getChatList()
			}
			
		},
		onShow() {
			this.getChatList();
		},
		methods: {
			// 选择版本
			version_top(val) {
				this.active_top = val;
				if(this.active_top == 0) {
					this.active = 4
				} else {
					this.active = 13
				}
				this.page_no = 1;
				this.loadingType = 0;
				this.searchValue = '';
				this.getChatList()
			},
			
			version(val) {
				this.active = val;
				this.page_no = 1;
				this.loadingType = 0;
				this.searchValue = '';
				this.getChatList()
			},

			search() {
				this.page_no = 1;
				this.loadingType = 0;
				// this.searchValue = '';
				this.getChatList()
			},

			// 获取对话列表
			getChatList() {
				let val = {
					chat_type: this.active,
					title: this.searchValue,
					page_size: this.page_count,
					page: this.page_no
				}
				if(this.active_top == 0) {
					chatList(val).then(res => {
						if (res.code == 20000) {
							res.data.data.map((item, index) => {
								if(item.title.indexOf('(回答内容') != -1) {
									let val = item.title.indexOf('(回答内容')
									item.title = item.title.slice(0, val)
								}
							})
							this.chatList = res.data.data;
					
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
						this.$api.msg('获取对话信息失败');
					})
				} else {
					if(this.active < 13) {
						drawList(val).then(res => {
							if (res.code == 20000) {
								res.data.data.map((item, index) => {
									if(item.title.indexOf('(回答内容') != -1) {
										let val = item.title.indexOf('(回答内容')
										item.title = item.title.slice(0, val)
									}
								})
								this.chatList = res.data.data;
						
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
							this.$api.msg('获取对话信息失败');
						})
					} else {
						getImgList(val).then(res => {
							if (res.code == 20000) {
								res.data.data.map((item, index) => {
									if(item.title.indexOf('(回答内容') != -1) {
										let val = item.title.indexOf('(回答内容')
										item.title = item.title.slice(0, val)
									}
								})
								this.chatList = res.data.data;
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
							this.$api.msg('获取对话信息失败');
						})
					}
					
				}
				
			},

			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
					chat_type: this.active,
					title: this.searchValue,
					page_size: this.page_count,
					page: this.page_no
				}
				
				if(this.active_top == 0) {
					chatList(val).then(res => {
						if (res.code == 20000) {
					
							let total = res.data.total;
							if (total == 0) return
							let List = res.data.data;
							let addList = this.chatList;
							List.forEach(item => {
								if(item.title.indexOf('(回答内容') != -1) {
									let val = item.title.indexOf('(回答内容')
									item.title = item.title.slice(0, val)
								}
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
						this.$api.msg('获取对话信息失败');
					})
				} else {
					if(this.active < 13) {
						drawList(val).then(res => {
							if (res.code == 20000) {
						
								let total = res.data.total;
								if (total == 0) return
								let List = res.data.data;
								let addList = this.chatList;
								List.forEach(item => {
									if(item.title.indexOf('(回答内容') != -1) {
										let val = item.title.indexOf('(回答内容')
										item.title = item.title.slice(0, val)
									}
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
							this.$api.msg('获取对话信息失败');
						})
					} else {
						getImgList(val).then(res => {
							if (res.code == 20000) {
						
								let total = res.data.total;
								if (total == 0) return
								let List = res.data.data;
								let addList = this.chatList;
								List.forEach(item => {
									if(item.title.indexOf('(回答内容') != -1) {
										let val = item.title.indexOf('(回答内容')
										item.title = item.title.slice(0, val)
									}
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
							this.$api.msg('获取对话信息失败');
						})
					}
					
				}
				
			},

			checkDetail(code) {
				let that = this
				uni.showModal({
					// title: '模态弹窗标题',
					content: '是否延续当前对话',
					success: function(res) {
						if (res.confirm) {
							console.log(that.active, 'code');
							
							uni.setStorageSync('history_code', JSON.stringify({
								code,
								type: that.active
							}))
							uni.setStorageSync('tabStatus', that.active)
							if(that.active == 4 || that.active == 5 || that.active == 7 || that.active == 8|| that.active == 10 || that.active == 12) {
								uni.switchTab({
									url: '/pages/chat/chat'
								})
							} else {
								uni.switchTab({
									url: '/pages/draw/draw'
								})
							}
							
						} else if (res.cancel) {
							console.log('您点击了取消');
						}
					}
				});
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
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
		width: calc(100% );
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 25upx;
		background: #fff;
	}
	
	.search {
		width: calc(100% - 64upx);
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
		width: 100%;
		display: flex;
	
	}
	
	.tabs_l {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.active_tabs_top {
		font-style: normal;
		font-weight: 500;
		font-size: 28upx;
		line-height: 50upx;
		color: #1F64FF;
		border-bottom: 5upx solid #1F64FF;
	}
	
	.tabs_top {
		font-style: normal;
		font-weight: 500;
		font-size: 28upx;
		line-height: 50upx;
		color: #999;
	}
	
	.list_ul {
		padding: 25upx 10upx;
		// margin-top: 238upx;
		margin-bottom: 30upx;
		width: calc(100% - 20upx);
	}
	
	.ul_style {
		display: flex;
		flex-direction: column;
		padding: 0 15upx;
		width: 108%;
	}
	
	.li_style {
		display: flex;
		// flex-direction: column;
		align-items: center;
		background: #fff;
		/* border: 1px solid #C0C4CC; */
		box-shadow: 0upx 0upx 10upx rgba(0, 0, 0, 0.14);
		border-radius: 15upx;
		padding: 20upx;
		margin-bottom: 25upx;
		width: calc(100% - 40upx);
	}
	
	
	
	.li_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 18upx;
	}
	
	.top_l {
		ont-weight: 400;
		font-size: 28upx;
		line-height: 42upx;
		color: #333;
		width: 300upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.top_r {
		ont-weight: 400;
		font-size: 24upx;
		line-height: 30upx;
		color: #6E7480;
	}
	
	.li_btn {
		font-weight: 400;
		font-size: 24upx;
		line-height: 35upx;
		color: #6E7480;
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
	
	.chat_type {
		display: flex;
		align-items: center;
		// justify-content: space-around;
		width: 100%;
	    padding: 15upx 0;
		flex-wrap: wrap;
		flex: 1;
		.tabs {
			width: 22%;
			background: #F8F8F9;
			border-radius: 6upx;
			padding: 16upx 0;
			margin: 10upx 1.5%;
			font-style: normal;
			font-weight: 500;
			font-size: 28upx;
			line-height: 150%;
			color: #333;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.active_tabs{
			width: 22%;
			background: rgba(31, 100, 255, 0.15);;
			border-radius: 6upx;
			padding: 16upx 0;
			margin: 10upx 1.5%;
			font-style: normal;
			font-weight: 500;
			font-size: 28upx;
			line-height: 150%;
			color: #1F64FF;
	        display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	
	.li_left {
		padding-right: 10upx;
		.li_img {
			width: 110upx;
			height: 110upx;
			border-radius: 50%;
		}
	}
	.li_right {
		flex: 1;
		// width: calc(100% - 160upx);
	}
</style>