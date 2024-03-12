<template>
	<view class="heads">
		<view class="tab_li">
			<u-tabs :list="tablist" lineWidth='45' lineHeight='2' lineColor='#1f64ff'
				:activeStyle='{color: "#1F64FF","font-size":"30rpx"}' @change='tabsChange' :current='current'
				:inactiveStyle='{"font-size":"30rpx"}'></u-tabs>
		</view>

		<view style="padding: 25upx 25upx 230upx 25upx;">
			<view class="copy_cont">
				<view class="cont_t">
					<view class="t_li">
						<text class="li_left">*</text>
						<text class="li_right">声音名称</text>
					</view>

					<view class="lists" @click="openRole">
						<view class="txt">{{ roleValue }}</view>
						<u-icon name="arrow-down" color="#666" size="18"></u-icon>
					</view>

				</view>

				<view class="cont_t" style="margin-top: 20upx">
					<view class="t_li">
						<!-- <text class="li_left">*</text> -->
						<text class="li_right">输入文本试听</text>
					</view>
					<view class="t_li">
						<u--textarea v-model="voice_cont" placeholder="请输入文本" height="200" maxlength="300"
							count></u--textarea>
					</view>
					<view class="t_li_text">
						<text class="li_count">每字消耗0.32w算力</text>
						<text class="li_count" @click="toHistory" v-if="speech_url != ''">历史记录</text>
					</view>

					<view class="li_line">
						<text class="line_text">音量</text>
						<u-slider v-model="vol_val" blockSize="13" showValue></u-slider>
					</view>

					<view class="li_line">
						<text class="line_text">语调</text>
						<u-slider v-model="intonation" blockSize="13" min="-500" max="500" showValue></u-slider>
					</view>

					<view class="li_line">
						<text class="line_text">语速</text>
						<u-slider v-model="speed" blockSize="13" min="-500" max="500" showValue></u-slider>
					</view>

				</view>
			</view>

		</view>

		<view class="bottoms">
			<view class="bottom_cont" style="width: 100%;" v-if="speech_url == ''">
				<view class="cont_text" @click="toHistory">历史记录</view>
				<view class="bottom_buy" @click="addVoice">开始合成</view>
			</view>
			<view class="bottom_btn" v-else>
				<view class="btn_text" @click="playVoice(info.speech_url)">
					<image class="btn_img" :src="icoImg1" mode=""></image>
					<text class="text_slove">播放</text>
				</view>
				<view class="btn_text" @click="nextVoice()">
					<image class="btn_img" :src="icoImg1" mode=""></image>
					<text class="text_slove">下一条</text>
				</view>
				<view class="btn_text" @click="shareVoice(info.speech_url)">
					<image class="btn_img" :src="icoImg1" mode=""></image>
					<text class="text_slove">下载</text>
				</view>
				<view class="btn_text" @click.stop="delVoice(info.h_code)">
					<image class="btn_img" :src="icoImg1" mode=""></image>
					<text class="text_slove">删除</text>
				</view>
			</view>
		</view>

		<u-popup :show="playShow" mode="center" :round="10" @close="playShow = false" :zIndex="10099"
			:closeOnClickOverlay="false">
			<view class="pop_voice">
				<image class="pop_img" :src="picImg"></image>

				<view class="pop_stop" @click="stop">停止播放</view>
			</view>

		</u-popup>

		<!-- 分组选择 -->
		<u-picker :show="roleShow" :columns="roleList" v-model="roleIndex" keyName="voice_name"
			@cancel="roleShow = false" @confirm="roleSubmit"></u-picker>
	</view>
</template>

<script>
	import {
		getVoiceList, getVoiceCount
	} from '@/apis/home.js'
	import {
		goTextSpeech,
		delSpeechDetail
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				tablist: [{
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
				current: 2,
				icoImg1: global.baseImg + '/xcx/com/message_center/bf.png',
				icoImg2: global.baseImg + '/xcx/com/message_center/next.png',
				icoImg3: global.baseImg + '/xcx/com/message_center/download.png',
				icoImg4: global.baseImg + '/xcx/com/message_center/trash.png',
				roleValue: '',
				roleIndex: '',
				roleCode: '',
				roleShow: false,
				roleList: [],
				isEdit: false,

				voice_cont: '',
				vol_val: 50,
				intonation: 0,
				speed: 0,
				speech_url: '',
				info: '',
				picImg: global.baseImg + '/xcx/com/message_center/%E6%9C%80%E6%96%B0%E5%8A%A8%E5%9B%BE.gif',
				innerAudioContext: null,
				playShow: false,
				isClick: true,
				voiceCount: 0
			}
		},
		components: {

		},
		onLoad(option) {
			if (option.item) {
				this.isEdit = true
				let item = JSON.parse(option.item)
				this.roleValue = item.voice_name,
					this.roleIndex = item.voice_code,
					this.roleCode = item.engine_code
			}

			//语音播放初始化
			this.init()

		},
		onShow() {
			this.getVoiceList()
			this.getVoiceCount()
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
				if (this.current == 0) {
					uni.navigateTo({
						url: '/childCont/clone/my_voice'
					})
				} else if (this.current == 1) {
					if(this.voiceCount > 0) {
						uni.navigateTo({
							url: '/childCont/clone/voice_clone',
						})
					} else {
						uni.navigateTo({
							url: '/childCont/clone/pay_clone'
						})
					}
				} else if (this.current == 2) {
					uni.navigateTo({
						url: '/childCont/clone/copy_voice'
					})
				} else if (this.current == 3) {
					uni.navigateTo({
						url: '/childCont/clone/voice_order'
					})
				}
			},

			// 获取声音列表
			getVoiceList() {
				let val = {
					voice_name: '',
					voice_status: 5
				}
				getVoiceList(val).then(res => {
					if (res.code == 20000) {
						let voiceList = res.data.data;
						if (voiceList.length > 0) {
							this.roleList.push(voiceList)

							if (!this.isEdit) {
								this.roleValue = voiceList[0].voice_name
								this.roleIndex = voiceList[0].voice_code
								this.roleCode = voiceList[0].engine_code
								console.log(this.roleValue, 889)
							}
						}

					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取失败');
				})
			},


			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},

			// 打开声音弹窗
			openRole() {
				this.roleShow = true;
			},
			roleSubmit(e) {
				console.log(e, 1456)
				this.roleIndex = e.value[0].voice_code;
				this.roleValue = e.value[0].voice_name;
				this.roleCode = e.value[0].engine_code
				this.roleShow = false;
			},


			nextVoice() {
				this.speech_url = ''
				this.info = ''
				this.voice_cont = ''
			},

			toHistory() {
				uni.navigateTo({
					url: '/childCont/clone/clone_history'
				})
			},

			addVoice() {
				if (this.roleIndex == '') {
					return this.$api.msg('请选择声音名称')
				}

				if (this.voice_cont == '') {
					return this.$api.msg('请输入试听文本')
				}
				if (this.isClick == false) {
					return false
				}
				this.isClick = false;
				let val = {
					'engine_code': this.roleCode,
					'voice_code': this.roleIndex,
					'content': this.voice_cont,
					'speech_rate': this.speed,
					'pitch_rate': this.pitch_rate,
					'volume_ratio': this.vol_val
				}
				goTextSpeech(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('合成成功');
						this.speech_url = res.data.speech_url
						this.info = res.data
						this.isClick = true
					} else {
						this.$api.msg(res.msg);
						this.isClick = true
					}
				}).catch(err => {
					this.$api.msg('合成失败');
					this.isClick = true
				})
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
					if (res.code == 20000) {
						this.$api.msg('删除成功')
						this.nextVoice()
					} else {
						this.$api.msg(res.msg)
					}

				})

			},

			playVoice(url) {
				this.playShow = true;
				this.innerAudioContext.src = global.baseImg + '/' + url;
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
					url: global.baseImg + '/' + url, //下载地址接口，注意：这里的图片的下载链接可直接在浏览器打开下载的
					success: (data) => {
						if (data.statusCode === 200) {
							wx.shareFileMessage({
								filePath: data.tempFilePath,
								showMenu: true, //关键点
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
	.heads {
		background: #f6f8fb;
		min-height: 100vh;
	}

	.tab_li {
		background: #fff;
		// padding: 10upx 20upx;
	}

	.copy_cont {
		padding: 20upx;
		background: #fff;
		border-radius: 10upx;

		.cont_t {
			.t_li {
				display: flex;
				align-items: center;
				padding: 5upx 0;

				.li_left {
					color: #F00;
					font-size: 26upx;
					font-style: normal;
					font-weight: 500;
					line-height: 50upx;
					margin-right: 5upx;
				}

				.li_right {
					color: #000;
					font-size: 26upx;
					font-style: normal;
					font-weight: 500;
					line-height: 50upx;
				}
			}

			.lists {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 20upx;
				background: #fff;
				border-radius: 8upx;
				border: 0.5px solid #dadbde;
				// margin-bottom: 25upx;

				.txt {
					font-size: 26upx;
					margin-left: 20upx;
					flex: 1;
				}

			}

			.t_li_text {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.li_count {
					color: #3E7AFF;
					font-size: 28upx;
					font-style: normal;
					font-weight: 400;
					line-height: 150%;
				}
			}

			.li_text {
				background: #fff;
				border-radius: 10upx;
				padding: 20upx;
			}

			.li_line {
				padding: 20upx;
				// display: flex;
			}
		}
	}

	.bottoms {
		width: 100%;
		background: #ffffff;
		position: fixed;
		bottom: 0;
		z-index: 999;

		.bottom_btn {
			display: flex;
			justify-content: space-around;
			width: 100%;
			padding: 30upx 0;

			.btn_text {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				width: 20%;

				.btn_img {
					width: 42upx;
					height: 42upx;
				}

				.text_slove {
					color: #000;
					font-size: 26upx;
					font-style: normal;
					font-weight: 400;
					line-height: 60upx;
				}
			}
		}
	}


	.bottom_cont {
		width: calc(100% - 40upx);
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

	.bottom_buy {
		width: calc(100% - 40upx);
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