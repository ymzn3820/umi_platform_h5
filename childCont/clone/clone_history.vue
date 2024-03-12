<template>
	<view>
		
		<view class="top_cont">
			<view class="search_cont">
				<view class="search">
					<image class="search_img" src="@/static/user/search.png"></image>
					<input v-model="searchValue" placeholder="请输入搜索内容" type="text" class="search_input" @input="search" />
				</view>
			</view>
		</view>
		<view class="chat_cont" style="margin-top: 130upx;">
			
			<scroll-view class="list_ul" scroll-y="true" v-if="chatList.length > 0">
				<view class="ul_style" v-for="(item, index) in chatList" :key="index">
					<view class="li_style">
						<view class="ul_right">
							<view class="li_top">
								<text class="top_l">{{ item.title }}</text>
							</view>
							<view class="li_btn">
								<view class="btn_l">创建时间</view>
								<view class="btn_r">{{ item.create_time }}</view>
							</view>
							
							<view class="li_edit">
								<view class="edit_l" @click.stop="shareVoice(item.speech_url)">分享</view>
								<view class="edit_l" @click.stop="playVoice(item.speech_url)">播放</view>
								<view class="edit_r" @click.stop="delVoice(item.h_code)">删除</view>
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
		
		<u-popup :show="playShow" mode="center" :round="10" @close="playShow = false" :zIndex="10099" :closeOnClickOverlay="false">
			<view class="pop_voice">
				<image class="pop_img" :src="picImg"></image>
				
				<view class="pop_stop" @click="stop">停止播放</view>
			</view>
			
		</u-popup>

	</view>
</template>

<script>
	import {
		getTextSpeech, delSpeechDetail
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				loadingType: 0,
				page_no: 1,
				page_count: 10,
				chatList: [],
				pageTotal: 0,
				searchValue: '',
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg',
				picImg: global.baseImg + '/xcx/com/message_center/%E6%9C%80%E6%96%B0%E5%8A%A8%E5%9B%BE.gif',

				innerAudioContext: null,
				playShow: false
			}
		},
		components: {
		},
		onLoad(option) {
		   //语音播放初始化
		   this.init()
		},
		onShow() {
			this.getChatList();
		},
		methods: {
			
			init() {
				this.innerAudioContext = uni.createInnerAudioContext();
				this.innerAudioContext.obeyMuteSwitch = false;
				this.innerAudioContext.onPlay(() => {
					console.log('开始播放');
				});
			
				this.innerAudioContext.onEnded(() => {
					
					console.log('播放停止了')
					this.innerAudioContext.stop()
					this.playShow = false
				})
			},
			
			
			search() {
				this.page_no = 1;
				this.loadingType = 0;
				// this.searchValue = '';
				this.getChatList()
			},
			
			// 获取历史列表
			getChatList() {
				let val = {
					title: this.searchValue,
					engine_code: '1000010006',
					page_size: this.page_count,
					page: this.page_no
				}
				getTextSpeech(val).then(res => {
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
			getTextSpeech() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
                    chat_type: 5,
                    scenario_type: 'document',
					page_size: this.page_count,
					title: this.searchValue,
					page: this.page_no
				}
				chatList(val).then(res => {
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
			
			checkDetail(code, qs_id) {
				console.log(qs_id,996)
				let that = this
				uni.showModal({
					// title: '模态弹窗标题',
					content: '是否延续当前对话',
					success: function(res) {
						if (res.confirm) {
							uni.setStorageSync('doc_code', JSON.stringify({
								code,
								type: that.active
							}))
							uni.navigateTo({
								url: '/childPage/document/document_chat?qs_id=' + qs_id
							})
							
						} else if (res.cancel) {
							console.log('您点击了取消');
						}
					}
				});
			},
			
			delVoice(code) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该记录吗？',
					success(res) {
					  if (res.confirm) {
						  that.delCont(code)
					  }
					}
				});
			},
			
			// 删除信息
			delCont(code) {

				delSpeechDetail(code).then(res => {
					if(res.code == 20000) {
						this.$api.msg('删除成功')
						this.getChatList()
					} else {
						this.$api.msg(res.msg)
					}
					
				})
				
			},
			
			playVoice(url) {
				this.playShow = true;
				this.innerAudioContext.src = global.baseImg + '/'+url;
				this.innerAudioContext.play();
			},
			
			//原生停止
			stop() {
				this.innerAudioContext.stop();
				this.playShow = false
				// this.isPlay = false
				// console.log('停止播放')
			},
			
			shareVoice(url) {
				// uni.showLoading({
				// 	title: '下载中'
				// });
				console.log(url, '我是下载URL');
				let that = this;
				uni.downloadFile({
					url: global.baseImg + '/'+url, //下载地址接口，注意：这里的图片的下载链接可直接在浏览器打开下载的
					success: (data) => {
						if (data.statusCode === 200) {
							wx.shareFileMessage({
								filePath: data.tempFilePath,
								showMenu:true, //关键点
								success: (res) => {
									//提示保存成功
									console.log('成功了')
									
									// uni.hideLoading();
									setTimeout(function() {
										uni.showToast({
											title: '分享成功',
											duration: 2000
										})
									}, 500);
								},
								fail: (res) => {
									//失败关闭提示信息！！！
									// uni.hideLoading();
									setTimeout(function() {
										uni.showToast({
											icon: 'none',
											title: '分享失败',
											duration: 2000
										})
									}, 500);
			
									console.log("分享失败", res);
								},
								complete: function(res) {
									//隐藏提示
									// uni.hideLoading();
									// uni.showToast({
									// 	icon: 'none',
									// 	title: '下载失败',
									// 	duration: 2000
									// })
								}
							})
						}
					},
					fail: (err) => {
						console.log(err, 'err')
						uni.showToast({
							icon: 'none',
							mask: true,
							title: '失败请重新下载',
						});
					},
				});
			},
			
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #f6f8fb;
	}

	.cont_title {
		color: #000;
		font-size: 30upx;
		font-style: normal;
		font-weight: 500;
        text-align: center;
		padding: 20upx 0;
	}
	.list_ul {
		padding: 15upx 10upx;
		margin-bottom: 30upx;
		width: calc(100% - 20upx);
	}

	.ul_style {
		display: flex;
		flex-direction: column;
		padding: 15upx 20upx;
	}

	.li_style {
		display: flex;
		align-items: center;
		box-shadow: 0upx 0upx 10upx rgba(0, 0, 0, 0.14);
		border-radius: 10upx;
		padding: 25upx;
		width: calc(100% - 50upx);
		background: #fff;
		.ul_right { flex: 1; }
		.ul_img {
			padding: 10upx;
			.avatar_img {
				width: 80upx;
				height: 80upx;
				border-radius: 8upx;
			}
		}
	}

	.li_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 18upx;
	}

	.top_l {
		font-weight: 500;
		font-size: 30upx;
		line-height: 42upx;
		color: #000;
		width: 80%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.top_r {
		font-weight: 400;
		font-size: 24upx;
		line-height: 30upx;
		color: #6E7480;
	}

	.li_btn {
		font-weight: 400;
		font-size: 28upx;
		line-height: 35upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.btn_l {
			color: #A4A4A4;
			font-size: 28upx;
			font-weight: 400;
			line-height: 150%;
			padding: 5upx 0upx;
			line-height: 48upx;
		}
		.btn_r {
			color: #000;
			font-size: 28upx;
			font-weight: 400;
			line-height: 150%;
			padding: 5upx 0upx;
			line-height: 48upx;
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
	
	.text_conts {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 20upx 30upx 0 30upx;
		.text_u {
			display: flex;
			align-items: center;
			.u_li{
				color: #9A9A9A;
				text-align: center;
				font-size: 22upx;
				font-style: normal;
				font-weight: 400;
				margin-right: 10upx;
			}
			.add_img {
				width: 38upx;
				height: 38upx;
			}
			.add_li {
				color: #1F64FF;
				font-size: 28upx;
				font-style: normal;
				font-weight: 500;
				line-height: 150%;
				padding-left: 10upx;
			}
			.qs_img {
				width: 40upx;
				height: 40upx;
				margin-left: 20upx;
			}
			.text_r {
				color: #000;
				font-size: 32upx;
				font-weight: 500;
				line-height: 50upx;
				margin-right: 10upx;
			}
		}
	}
	.li_edit {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 10upx;
		.edit_l {
			padding: 10upx 30upx;
			border-radius: 8upx;
			border: 1upx solid #A4A4A4;
			color: #A4A4A4;
			text-align: center;
			font-size: 28upx;
			font-style: normal;
			font-weight: 500; 
			margin-right: 20upx;
		}
		.edit_r {
			padding: 10upx 30upx;
			border-radius: 8upx;
			border: 1upx solid #1F64FF;
			color: #1F64FF;
			text-align: center;
			font-size: 28upx;
			font-style: normal;
			font-weight: 500; 
		}
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
		padding: 25upx 25upx 0 25upx;
		background: #fff;
	}
	
	.search {
		width: 90%;
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
	
	.pop_voice {
		padding: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.pop_img {
			width: 300upx;
			height: 300upx;
		}
		.pop_stop {
			color: #fff;
			font-size: 30upx;
			font-weight: 400;
			line-height: 150%;
			width: 70%;
			background: #1F64FF;
			padding: 15upx 0upx;
			border-radius: 8upx;
			margin-top: 30upx;
			text-align: center;
		}
	}
</style>