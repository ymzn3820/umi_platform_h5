<template>
	<view>
		<!-- 绘画历史 -->
		<view class="chat_cont" >
			<scroll-view class="list_ul" scroll-y="true" v-if="chatList.length > 0">
			    <view class="ul_li">
					<view class="ul_style" v-for="(item, index) in chatList" :key="index">
						<view class="li_style">
							<view class="li_wz" @click.stop="checkImg(item.content)">
								<image class="li_img" :src="getImgUrl(item.content)"></image>
								<view class="ex_del" @click.stop="delPhoto(item.session_code)" ><u-icon name="trash" color="#fff" size="24"></u-icon></view>
							</view>
						</view>
					</view>
				</view>
				
			</scroll-view>
			<view class="on_order" v-if="chatList.length == 0">
				<image class="order_img" :src="backImg"></image>
			</view>
		
			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
		</view>

	</view>
</template>

<script>
	import {
		drawList
	} from '@/apis/user.js'
	import {
		del_session
	} from '@/apis/chat.js'
	export default {
		data() {
			return {
				loadingType: 0,
				page_no: 1,
				page_count: 20,
				chatList: [],
				pageTotal: 0,
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg'
			}
		},
		components: {

		},
		onLoad(option) {
			
		},
		onShow() {
			this.page_no = 1;
			this.loadingType = 0;
			this.getChatList();
		},
		methods: {
			
			// 获取对话列表
			getChatList() {
				let val = {
					chat_type: '-1',
					title: '',
					page_size: this.page_count,
					page: this.page_no
				}
				drawList(val).then(res => {
					if (res.code == 20000) {
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
					chat_type: '-1',
					title: '',
					page_size: this.page_count,
					page: this.page_no
				}
				
				drawList(val).then(res => {
					if (res.code == 20000) {
				
						let total = res.data.total;
						if (total == 0) return
						let List = res.data.data;
						let addList = this.chatList;
						List.forEach(item => {
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
			
			// 图片预览
			checkImg(url) {
				let img_url = global.baseImg+'/'+url;
				// console.log(img_url,332)
				uni.previewImage({
					urls:[img_url],
					current:0
				})
				
			},
			
			delPhoto(code) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该图片吗？',
					success(res) {
					  if (res.confirm) {
						  that.delCont(code)
					  }
					}
				});
			},
			
			// 删除信息
			delCont(code) {
				let data = [];
				data.push(code)
				let val = { 'session_codes': JSON.stringify(data) }
				console.log(val,6666)
				del_session(val).then(res => {
					if(res.code == 20000) {
						this.$api.msg('删除成功')
						this.getChatList()
					} else {
						this.$api.msg(res.msg)
					}
					
				})
				
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
	
	.chat_cont {
		margin-top: 20upx;
	}
	.list_ul {
		width: 100%;
		.ul_li{
			display: flex;
			align-items: center;
			justify-content: flex-start;
			flex-wrap: wrap;
		}
	}
	
	.ul_style {
		width: 50%;
	}
	
	.li_style {
		display: flex;
		// flex-direction: column;
		align-items: center;
		justify-content: center;
		.li_wz {
			position: relative;
			padding: 10upx;
		}
		.li_img {
			width: 320upx;
			height: 320upx;
			border-radius: 40upx;
		}
		
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
		width: 90%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.top_r {
		ont-weight: 400;
		font-size: 24upx;
		line-height: 30upx;
		color: #6E7480;
		;
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
		width: calc(100% - 160upx);
	}
	.ex_del {
		position: absolute;
		top: 40upx;
		right: 20upx;
	}
</style>