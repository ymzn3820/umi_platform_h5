<template>
	<view>
		<view class="tab_li">
			<u-tabs :list="tablist" lineWidth='45' lineHeight='2' lineColor='#1f64ff'
				:activeStyle='{color: "#1F64FF","font-size":"30rpx"}' @change='tabsChange' :current='current'
				:inactiveStyle='{"font-size":"30rpx"}'></u-tabs>
		</view>
		<view class="search_cont">
			<view class="search">
				<image class="search_img" src="@/static/user/search.png"></image>
				<input v-model="searchValue" placeholder="请输入声音名称" type="text" class="search_input" @input="search" />
			</view>
		</view>
		
		<view class="select_tab">
			<view :class="select_type == 0 ? 'tabs_active' : 'tabs'" @click="getList(0)">全部</view>
			<!-- <view :class="select_type == 1 ? 'tabs_active' : 'tabs'" @click="getList(1)" >待付款</view> -->
			<view :class="select_type == 2 ? 'tabs_active' : 'tabs'" @click="getList(2)" >训练中</view>
			<view :class="select_type == 3 ? 'tabs_active' : 'tabs'" @click="getList(3)" >制作成功</view>
			<view :class="select_type == 4 ? 'tabs_active' : 'tabs'" @click="getList(4)" >制作失败</view>
			<view :class="select_type == 5 ? 'tabs_active' : 'tabs'" @click="getList(5)" >已启用</view>
			<view :class="select_type == 6 ? 'tabs_active' : 'tabs'" @click="getList(6)" >已过期</view>
		</view>
		
		<view class="chat_cont">
			<scroll-view class="list_ul" scroll-y="true" v-if="voiceList.length > 0">
				<view class="ul_style" v-for="(item, index) in voiceList" :key="index">
					<view class="li_style">
						<view class="ul_right">
							<view class="li_top">
								<text class="top_l">{{ item.voice_name }}</text>
							</view>
							<view class="li_btn">
								<view class="btn_l">价格</view>
								<view class="btn_r">￥299</view>
							</view>
							
							<view class="li_btn">
								<view class="btn_l">状态</view>
								<view class="btn_r">
									<!-- <text style="color: #f9ae4d" v-if="item.voice_status == 1">待付款</text> -->
									<text style="color: #1F64FF" v-if="item.voice_status == 2">训练中</text>
									<text style="color: #32BE48" v-if="item.voice_status == 3">制作成功</text>
									<text style="color: #fa3534" v-if="item.voice_status == 4">制作失败</text>
									<text style="color: #333" v-if="item.voice_status == 5">已启用</text>
									<text style="color: #c8c9cc" v-if="item.voice_status == 6">已过期</text>
								</view>
							</view>
							<view class="li_btn">
								<view class="btn_l">创建时间</view>
								<view class="btn_r">{{ item.create_time }}</view>
							</view>
							
							<view class="li_edit">
								<view class="edit_l" v-if="item.voice_status == 3 || item.voice_status == 5" @click.stop="play(item.demo_audio)">试听</view>
								<view class="edit_l" v-if="item.voice_status == 3 || item.voice_status == 4" @click.stop="againVoice(item)">重新训练</view>
								<view class="edit_l" v-if="item.voice_status == 5" @click.stop="generatVoice(item)">合成</view>
								<view class="edit_l" v-if="item.voice_status == 3 || item.voice_status == 5" @click="toHistory()">记录</view>
								<view class="edit_r" v-if="item.voice_status == 3" @click.stop="openVoice(item.train_code)">启用</view>
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
		
		<view class="bottoms">
			<view class="bottom_cont" style="width: 100%;">
				<view class="bottom_buy" @click="toVoice">创建声音</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getVoiceList, openVoice, getVoiceCount
	} from '@/apis/home.js'
	export default {
		data() {
			return {
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				loadingType: 0,
				page_no: 1,
				page_count: 10,
				voiceList: [],
				pageTotal: 0,
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg',
				addImg: global.baseImg+'/xcx/01fece57-06c7-4eff-ab60-671230d86f80.jpg',
				
				tablist: [
					{
						name: '我的声音',
						index: 1
					}, {
						name: '声音克隆',
						index: 2
					},
					{
						name: '合成配音',
						tip: 3
					},
					{
						name: '订单记录',
						tip: 4
					}
				],
				current: 0,
				
				select_type:0,
				voice_status: '',
				voice_name: '',
				searchValue: '',
				
				innerAudioContext: null,
				playShow: false,
				picImg: global.baseImg + '/xcx/com/message_center/%E6%9C%80%E6%96%B0%E5%8A%A8%E5%9B%BE.gif',
				voiceCount: 0
			}
		},
		
		components: {
		},
		onLoad(option) {
           //语音播放初始化
           this.init()
		},
		onShow() {
			this.getHumanList()
			this.getVoiceCount()
		},
		created() {
			
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
			
			// 获取训练声音次数
			getVoiceCount() {
				
				getVoiceCount().then(res => {
					if (res.code == 20000) {
						this.voiceCount = res.data.count_number
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取失败');
				})
			},
			
			tabsChange(e) {
				this.current = e.index
				if(this.current == 0) {
					uni.navigateTo({
						url: '/childCont/clone/my_voice'
					})
				} else if(this.current == 1) {
					if(this.voiceCount > 0) {
						uni.navigateTo({
							url: '/childCont/clone/voice_clone',
						})
					} else {
						this.current = 0
						uni.navigateTo({
							url: '/childCont/clone/pay_clone'
						})
					}
					
				} else if(this.current == 2) {
					uni.navigateTo({
						url: '/childCont/clone/copy_voice'
					})
				} else if(this.current == 3) {
					uni.navigateTo({
						url: '/childCont/clone/voice_order'
					})
				}
			},
			
			// 获取声音列表
			getHumanList() {
				let val = {
					page_size: this.page_count,
					page: this.page_no,
					voice_name: this.voice_name,
					voice_status: this.voice_status
				}
				getVoiceList(val).then(res => {
					if (res.code == 20000) {
						this.voiceList = res.data.data;
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
					this.$api.msg('获取失败');
				})
			},

			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
					page_size: this.page_count,
					page: this.page_no,
					voice_name: this.voice_name,
					voice_status: this.voice_status
				}
				getVoiceList(val).then(res => {
					if (res.code == 20000) {

						let total = res.data.total;
						if (total == 0) return
						let List = res.data.data;
						let addList = this.voiceList;
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
					this.$api.msg('获取失败');
				})
			},
			
			
			getList(val) {
				this.select_type = val
				if(val == 0) {
					this.voice_status = ''
				} else {
					this.voice_status = val
				}
				this.getHumanList()
			},
			
			toVoice() {
				if(this.voiceCount > 0) {
					uni.navigateTo({
						url: '/childCont/clone/voice_clone',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/clone/pay_clone'
					})
				}
			},
			
			search() {
				this.voice_name = this.searchValue
				this.getHumanList()
			},
			
			play(url) {
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
			
			//合成
			generatVoice(item) {
				uni.navigateTo({
					url: '/childCont/clone/copy_voice?item='+JSON.stringify(item)
				})
			},
			//合成记录
			toHistory() {
				uni.navigateTo({
					url: '/childCont/clone/clone_history'
				})
			},
			//重新训练
			againVoice(item) {
				uni.navigateTo({
					url: '/childCont/clone/voice_clone?edit=2'+'&info='+JSON.stringify(item)
				})
			},
			
			//启用
			openVoice(val) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定启用该声音吗？',
					confirmText: "启用",
					success(res) {
					  if (res.confirm) {
						 that.voiceStart(val)
					  }
					}
				});
			},
			
			voiceStart(val) {
				// console.log(val,669)
				openVoice(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('启用成功');
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('启用失败');
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #f6f8fb;
	}
    .tab_li {
    	background: #fff;
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
		width: calc(100% - 40upx);
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
		height: 50vh;
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
	
	.li_edit {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 10upx;
		.edit_l {
			padding: 10upx 20upx;
			border-radius: 8upx;
			border: 1upx solid #A4A4A4;
			color: #A4A4A4;
			text-align: center;
			font-size: 26upx;
			font-style: normal;
			font-weight: 500; 
			margin-right: 15upx;
		}
		.edit_r {
			padding: 10upx 20upx;
			border-radius: 8upx;
			background:  #1F64FF;
			color: #fff;
			text-align: center;
			font-size: 26upx;
			font-style: normal;
			font-weight: 500; 
		}
	}
	
	.search_cont {
		width: 100%;
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
	
	.select_tab {
		display: flex;
		padding: 15upx;
		width: 100%;
		flex-wrap: wrap;
		.tabs {
			border-radius: 10upx;
			background: #fff;
			color: #747474;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
			line-height: 48upx;
			padding: 10upx 20upx;
			margin: 0 15upx 15upx 0;
		}
		
		.tabs_active {
			border-radius: 10upx;
			background: #1F64FF;
			color: #fff;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
			line-height: 48upx;
			padding: 10upx 20upx;
			margin: 0 15upx 15upx 0;
		}
	}
	
	.bottoms {
		width: 100%;
		background: #ffffff;
		position: fixed;
		bottom: 0;
		z-index: 999;
		.bottom_cont {
			width: 100%;
			padding: 20upx;
			display: flex;
			flex-direction: column;
			.cont_text {
				color: #3E7AFF;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 60upx;
			}
		}
	}
	
	.bottom_buy {
		width: 100%;
		height: 80upx;
		background: #1F64FF;
		border-radius: 6px;
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 20px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
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