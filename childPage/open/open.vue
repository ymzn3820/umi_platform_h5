<template>
	<view>
		<!-- <view class="top_cont">
			<view class="search_cont">
				<view class="search">
					<image class="search_img" src="@/static/user/search.png"></image>
					<input v-model="searchValue" placeholder="请输入搜索内容" type="text" class="search_input" @input="search" />
				</view>
			</view>
		</view> -->
		
		<!-- 历史 -->
		<view class="chat_cont" >
			<scroll-view class="list_ul" scroll-y="true" v-if="chatList.length > 0">
				<view class="ul_style" v-for="(item, index) in chatList" :key="index" @click="checkDetail(item)">
					<view class="li_style">
						<view class="li_left" v-if="item.image_url != ''">
							<image class="li_img" :src="getImgUrl(item.image_url)"></image>
						</view>
						<view class="li_right">
							<view class="li_top">
								<text class="top_l">{{ item.title }}</text>
								<text class="top_r" v-if="item.type_code == 'chat' ">AI对话</text>
								<text class="top_r" v-if="item.type_code == 'image'">AI绘画</text>
								<text class="top_r" v-if="item.type_code == 'celebrity'">名人互动</text>
								<text class="top_r" v-if="item.type_code == 'assistant'">助理中心</text>
								<text class="top_r" v-if="item.type_code == 'cdu'">彩超宝宝</text>
								<text class="top_r" v-if="item.type_code == 'real_time'">实时录音</text>
								<text class="top_r" v-if="item.type_code == 'real_file'">录音文件</text>
							</view>
							<view class="li_btn">
								<view>提问时间：{{ item.create_time }}</view>
								<view @click.stop="delPhoto(item.type_code, item.eid)" ><u-icon name="trash" color="#666" size="20"></u-icon></view>
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
	import {
		getFootprint, delFootprint
	} from '@/apis/user.js'
	export default {
		data() {
			return {
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
			
		},
		onShow() {
			this.page_no = 1;
			this.loadingType = 0;
			// this.searchValue = '';
			this.getChatList();
		},
		methods: {

			search() {
				this.page_no = 1;
				this.loadingType = 0;
				// this.searchValue = '';
				this.getChatList()
			},

			// 获取对话列表
			getChatList() {
				let val = {
					page_size: this.page_count,
					page: this.page_no
				}
				getFootprint(val).then(res => {
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
				
			},

			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
					page_size: this.page_count,
					page: this.page_no
				}
				
				getFootprint(val).then(res => {
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
				
			},

			checkDetail(item) {
				// console.log(item,666666666666666666666666);
				if(item.type_code == 'chat') {
					let chat_type = 8;
					if(item.type_name == '文心一言') {
						chat_type = 4
					} else if(item.type_name == '讯飞星火') {
						chat_type = 5
					} else if(item.type_name == 'ChatGLM') {
						chat_type = 8
					} else if(item.type_name == '通义千问') {
						chat_type = 10
					} else if(item.type_name == '360智脑') {
						chat_type = 12
					}
					// uni.setStorageSync('page_code', JSON.stringify({
					// 	code: item.eid,
					// 	type: chat_type
					// }))
					uni.setStorageSync('page_code', item.eid)
					uni.switchTab({
						url: '/pages/index/index'
					})
				} else if(item.type_code == 'image') {
					let chat_type = 9;
					// if(item.type_name == 'Stable Diffusion') {
					// 	chat_type = 9
					// } else if(item.type_name == 'Midjourney') {
					// 	chat_type = 6
					// } else if(item.type_name == '百度绘画') {
					// 	chat_type = 3
					// }
					uni.setStorageSync('history_code', JSON.stringify({
						code: item.eid,
						type: chat_type
					}))
					uni.switchTab({
						url: '/pages/painting/painting'
					})
				} else if(item.type_code == 'celebrity' || item.type_code == 'assistant') {
					// let chat_type = 4;
					// if(item.type_name == '文心一言') {
					// 	chat_type = 4
					// } else if(item.type_name == '讯飞星火') {
					// 	chat_type = 5
					// } else if(item.type_name == 'ChatGLM') {
					// 	chat_type = 8
					// } else if(item.type_name == '通义千问') {
					// 	chat_type = 10
					// } else if(item.type_name == '商汤日日新') {
					// 	chat_type = 11
					// }
					// uni.setStorageSync('page_code', JSON.stringify({
					// 	code: item.eid,
					// 	type: chat_type
					// }))
					// uni.switchTab({
					// 	url: '/pages/user_chat/user_chat'
					// })
					uni.switchTab({
						url: '/pages/apply/apply'
					})
				} else if(item.type_code == 'real_time' || item.type_code == 'real_file') {
					uni.navigateTo({
						url: '/childPage/voice/voice_index'
					})
				}  else if(item.type_code == 'cdu') {
					uni.navigateTo({
						url: '/childPage/doppler/doppler'
					})
				}  
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			delPhoto(type, eid) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该记录吗？',
					success(res) {
					  if (res.confirm) {
						  that.delCont(type, eid)
					  }
					}
				});
			},
			
			// 删除信息
			delCont(type, eid) {

				let val = { 'type_code': type, 'eid': eid }
				console.log(val,6666)
				delFootprint(val).then(res => {
					if(res.code == 20000) {
						this.$api.msg('删除成功')
						this.getChatList()
					} else {
						this.$api.msg(res.msg)
					}
					
				})
				
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
		width: calc(100% - 50upx);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 25upx;
		background: #fff;
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
		width: 100%;
	}
	
	.ul_style {
		display: flex;
		flex-direction: column;
		padding: 0 15upx
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
		width: 70%;
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
		display: flex;
		align-items: center;
		justify-content: space-between;
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
		width: 100%;
	}
</style>