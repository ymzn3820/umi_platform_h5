<template>
	<view >
	  <view class="voice_cont">
		  <view class="cont_video" v-if="file_type == 3">
			  <video :src="src" class="up_img"></video>
		  </view>
		  
		  <view class="cont_right">
			   <!-- <view class="btn_text" @click="endRecord"><image class="btn_img" :src='aiImg'></view> -->
			   <!-- <view class="btn_text" @click="saveVoice"><image class="btn_img" :src='saveImg'  v-if="file_type != 3"/></view> -->
			   <view class="btn_text" @click="editVoice"><image class="btn_img" :src='editImg'/></view>
			   <view class="btn_text" @click="copyVoice(stResult)"><image class="btn_img" :src='copyImg'/></view>
		  </view>
		  <view class="record_cont">
			  <view class="cont_title">{{ mesageTime }}</view>
			  <view class="cont_text">
				  <text class="text_l"> {{ stResult }} </text>
			  </view>
		  </view>
		  
		  <view class="btn" v-if="file_type == 2">
			  <view class="btn_play">
				  <gw-audiott :autoplay="false" :src="src"/>
			  </view>
		  </view>
	  </view>
	</view>
</template>

<script>

	import gwAudiott from '../components/gw-audiott/gw-audiott.vue'
	
	import {
		changeType
	} from '@/apis/user.js'
	export default {
		data() {
			return {
                // src:'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3',
				src: '',
				stResult: '', //录音转文字最终结果
				isPlay: false,// 是否播放
				info: '',
				
				recordTime:0,//录音时长 毫秒
				mesageTime: '', // 文本记录时间
				timer_li: 0, //录音计时器
				
				file_name: '音频',
				file_type: 1,
				
				playImg: global.baseImg+'/xcx/e47bc10b-bb4c-43a1-8d5a-1bda0b917003.jpg',
				puaseImg: global.baseImg+'/xcx/90a9be00-0c42-440e-9ea9-267e52d7808b.jpg',
				aiImg: global.baseImg+'/xcx/c0d17f1e-094d-4fca-b45b-448f82fbfd32.jpg',
				saveImg: global.baseImg+'/xcx/f7720998-e1ad-4b9c-83c9-b2dddb2c494c.jpg',
				editImg: global.baseImg+'/xcx/4a6dcc63-9e07-448b-a088-1f98d9dcac54.jpg',
				copyImg: global.baseImg+'/xcx/c7c0e0f7-721b-4713-9d3c-e5012b78ec32.jpg',
				backImg: global.baseImg+'/xcx/28146246-8a0c-47b0-a0ff-9b15abbcb132.jpg',
				nextImg: global.baseImg+'/xcx/84059df3-39be-4e1b-a44d-7f030aa9b641.jpg',
			}
		},
		
		components: {
			gwAudiott
		},
		
		onLoad(options) {
			// console.log(options,5488)
			this.info = JSON.parse(options.info)
		},
		onShow() {
          this.stResult = this.info.speech_text;
          this.mesageTime = this.info.title;
		  this.file_type = this.info.file_type;
		  // console.log(this.file_type,3333)
		 
		  if(this.info.r_type == 1) {
			  this.changeType(this.info.audio_url)
		  } else {
			  this.src = global.baseImg+'/'+ this.info.audio_url
		  }
		  
		  let index = this.info.audio_url.indexOf('.');
		  let val_name = this.info.audio_url.slice(index);
		  this.file_name = this.info.title + val_name
		  
		  
		},
		
		onUnload: function () {
			
		},
		methods: {
			// pcm转wav
			changeType(url) {
				let val = {
					pcm_url: url,
					suffix: 'wav'
				}
				changeType(val).then(res => {
					if (res.code == 20000) {
						this.src = global.baseImg+'/'+ res.data
						// console.log(this.src,5412)
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('转换失败');
				})
				
			},
			// 播放录音
		    playVoice() {
				this.isPlay = true
			},
			
			//暂停播放录音
			pauseVoice() {
				this.isPlay = false
			},
			
			//下载录音
			saveVoice() {
				 wx.downloadFile({
				    url: this.src, // 下载url
				    success (res) {
				      // 下载完成后转发
				      wx.shareFileMessage({
				        filePath: res.tempFilePath,
						fileName: this.file_name,
				        success() {},
				        fail: console.error,
				      })
				    },
				    fail: console.error,
				  })
			},
			
			//编辑录音
			editVoice() {
				uni.navigateTo({
					url: '/childPage/voice/voice_edit?info='+ JSON.stringify(this.info),
				})
			},
			
			//复制文字
			copyVoice(val) {
				uni.setClipboardData({
					data: val, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功'
						})
					}
				})
			},
			
		}
	}
</script>

<style lang="less" scoped>
	page {
		// background: #000;
	}
	
	.voice_cont {
		margin-top: 10upx;
		background: #fff;
		height: calc(100vh - 10upx);
		margin-bottom: 120upx;
	}
	
	.btn {
		// padding: 0 30upx 30upx 30upx;
		background: #fff;
		position: fixed;
		bottom: 0;
		width: 100%;
		// .btn_cont {
		// 	border-radius: 100upx;
		// 	background: #FFF;
		// 	box-shadow: 0 4upx 20upx 0 rgba(51, 51, 51, 0.10);
		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: space-between;
		// 	width: calc(100% - 100upx);
		// 	padding: 15upx 30upx;
		// 	.cont_left {
		// 		display: flex;
		// 		.btn_text {
		// 			flex: 1;
		// 			display: flex;
		// 			align-items: center;
		// 			justify-content: center;
		// 			padding-left: 20upx;
		// 			.btn_img {
		// 				width: 100upx;
		// 				height: 100upx;
		// 			}
		// 		}
		// 	}
			

		// }
	}
	
	.cont_right {
		display: flex;
		width: calc(100% -40upx);
		padding: 20upx 20upx 0 20upx;
		align-items: center;
		justify-content: flex-end;
		.btn_text {
			display: flex;
			padding: 0 24upx;
			.btn_img {
				width: 40upx;
				height: 40upx;
			}
		}
	}
	
	
	.record_cont {
		width: calc(100% - 40upx);
		padding: 20upx;
		.cont_title {
			color: #000;
			font-size: 36upx;
			font-weight: 500;
			// padding: 15upx 0;
			width: 100%;
		}
		.cont_text {
			font-size: 32upx;
			font-weight: 400;
			line-height: 60upx;
			width: 100%;
			margin-bottom: 180upx;
			.text_l {
				color: #272C3D;
			}
			.text_r {
				color: #999;
			}
		}
	}
	.cont_video {
		width: 100%;
		height: 300upx;
		.up_img {
			width: 100%;
			height: 300upx;
		}
	}
	
</style>