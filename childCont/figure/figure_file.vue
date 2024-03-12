<template>
	<view>
		<view class="containar">
			<view class="video_cont">
				<view class="cont_title" v-if="live_code != ''">数字人信息</view>
				
				<view class="title_info" v-if="live_code != ''">
					<text class="title_text">模特名称</text>
					<u-input :customStyle='{"width":"100%"}' inputAlign="left" v-model="modelName"
						placeholder="请输入名称" type="text" border="none" maxlength="10" ></u-input>
				</view>
				
				<view class="cont_title">视频预览</view>
				
				<view class="video_li">
					<view class="video_up" v-if="img_url == ''" @click="saveFile()">
						<u-icon name="plus" color="#D1D3D6" size="24"></u-icon>
						<text class="video_text">请上传视频</text>
					</view>
					<video :src="getImgUrl(img_url)" objectFit='cover' class="sp_img" v-else></video>
					<view class="video_tip">注：上传的视频将用于数字人定制，请慎重选择视频上传</view>
					<view class="bot">
					    <view class="bot_cont">
							<view class="bot_left" @click="saveFile()">上传视频</view>
					    </view>
					</view>
					<view class="video_tip" style="font-size: 28upx;">形象图片（等待图片自动加载出来之后再提交）</view>
					<image :src="getImgUrl(tipImg)" alt="" mode="aspectFit" class="tip_img" v-if="tipImg != ''"></image>
				</view>
				
			</view>
			
			<view class="video_cont">
				
				<view class="cont_title">
					<text>形象授权</text>
				</view>
				
				<view class="video_up" v-if="letter_url == ''" @click="saveVoice">
					<u-icon name="plus" color="#D1D3D6" size="24"></u-icon>
					<text class="video_text">请上传有效授权书截图</text>
				</view>
				<view class="video_li" v-if="letter_url != ''">
					<image :src="getImgUrl(letter_url)" class="sp_img">
				</view>
				<view class="bot" v-if="letter_url != ''">
				    <view class="bot_cont">
						<view class="bot_left" @click="saveVoice">重新上传</view>
				    </view>
				</view>
				
				<view class="tip">
					<text class="tip_line"></text>
					<text class="tip_text">注意事项</text>
					<text class="tip_line"></text>
				</view>
				
				<view class="cont_slove">
					<view class="slove">
						<image class="slove_img" :src="fileTip5" mode=""></image>
						<view class="slove_text">
							<text>下载</text>
							<text class="slove_down" @click="getFile">授权书模板</text>
						</view>
					</view>
					<view class="slove">
						<image class="slove_img" :src="fileTip6" mode=""></image>
						<view class="slove_text">手写授权人信息</view>
					</view>
					<view class="slove">
						<image class="slove_img" :src="fileTip7" mode=""></image>
						<view class="slove_text">拍照上传</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="bottom">
			<view class="bottom_cont">
				<view class="bottom_buy" @click="submit">立即提交</view>
				<view class="bottom_desc">
					<text>提交即默认接受</text>
					<text style="color: #1F64FF;" @click="checkAgree">《定制数字人协议》</text>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { addFigure, getCover, getFigureDetail, editFigure } from '@/apis/user.js'
	import Audio from '../components/audio/audio.vue'
	export default {
		data() {
			return {
				modelName: '',
				img_url: '',
				letter_url: '',
				isClick: true,
				tipImg: '',
				
				fileTip5: global.baseImg+'/xcx/ec3169d9-62e2-4d6d-87a8-574f5ef03dd5.jpg',
				fileTip6: global.baseImg+'/xcx/a39df7f8-62a9-4e3b-b2cb-1e6b859f86f5.jpg',
				fileTip7: global.baseImg+'/xcx/bfb823ee-6ffd-4076-97f0-904eeec92819.jpg',

				live_code: '',
				modelName: ''
			}
		},
		components: {
	       Audio
		},
		onLoad(option) {
            if(option.name) {
				this.modelName = option.name
			}
			
			if(option.live_code) {
				this.live_code = option.live_code
				this.getList(option.live_code)
			}
		},
		onShow() {
			
		},
		methods: {
			getList(code) {
			  let val = {
				  'live_code': code,
			  }
			  getFigureDetail(val).then(res => {
				  if (res.code == 20000) {
					   this.modelName = res.data.live_name;
					   this.img_url = res.data.live_video_url;
					   this.letter_url = res.data.power_attorney_url;
					   this.tipImg = res.data.video_cover_url
				  } else {
					  this.$api.msg(res.msg);
				  }
			  }).catch(err => {
				  this.$api.msg('获取失败');
			  })
			},
			// 上传资料
			saveFile() {
			  let that = this; 
			  uni.chooseVideo({
				sourceType: ['album'],
				extension:['.mp4'],//此处限制文件类型
				success(res) {
				  // console.log(res, 6666)
					const size = res.size;
					
					if(size > 104857600) { // 视频文件最大只能上传100M
						that.$api.msg('该视频已超过100M，不能上传')
						return
					}
					const tempFilePaths = res.tempFilePath;
					uni.showLoading({
						title:'上传中'  
					});
					uni.uploadFile({
						url: global.loginUrl + '/api/user/oss_upload', 
						filePath: tempFilePaths,
						name: 'image',
						formData: {
							"image": tempFilePaths,
							"image_name": '视频',
							"oss_dir": 'static',
							"cate": 'create_character'
						},
						success: (uploadFileRes) => {
							let imgData = JSON.parse(uploadFileRes.data)
							// console.log(imgData,333)
							uni.hideLoading()
							if(imgData.code == 20000) {
								that.img_url = imgData.data.new_url
								that.getCover(imgData.data.new_url)
							} else {
								that.$api.msg(imgData.msg)
							}
						},
						fail: (res) => {
							that.$api.msg('上传失败')
							uni.hideLoading()
						}
					});
				  }
				})
			},
			
			// 上传图片
			saveVoice() {
				let that = this;
				uni.chooseFile({
				  count: 1,
				  type: 'image',
				  sourceType: ['album','camera'],
				  success (res) {
					// tempFilePath可以作为img标签的src属性显示图片
					// console.log(res,88888)
					const size = res.tempFiles[0].size;
					const tempFilePaths = res.tempFilePaths[0];
					
					uni.uploadFile({
						url: global.loginUrl + '/api/user/oss_upload', 
						filePath: tempFilePaths,
						name: 'image',
						formData: {
							"image": tempFilePaths,
							"image_name": '图片',
							"oss_dir": 'static',
							"cate": 'create_character'
						},
						success: (uploadFileRes) => {
							let imgData = JSON.parse(uploadFileRes.data)
							// console.log(imgData,1258)
							if(imgData.code == 20000) {
								that.letter_url = imgData.data.new_url
							} else {
								that.$api.msg(imgData.msg)
							}
						},
						fail: (res) => {
							that.$api.msg('上传失败')
						}
					});
				  }
				})
			},
			
			// 获取数字人封面
			getCover(url) {
				let val = {
					live_video_url: url
				}
				uni.showLoading({
					title:'获取封面中'  
				}); 
				getCover(val).then(res => {
					uni.hideLoading()
					if (res.code == 20000) {
						this.tipImg = res.data;
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取失败');
					uni.hideLoading()
				})
				
			},
			
			submit() {
				
				if(this.img_url == '') {
					this.$api.msg('请上传数字人视频')
					return
				}
				
				if(this.letter_url == '') {
					this.$api.msg('请上传形象授权文件')
					return
				}
				
				if(this.isClick == false) {
					return
				}
				this.isClick = false
				

				let val = {
				  'live_name': this.modelName,
				  'custom_type': '基础模特定制',
				  'power_attorney_url': this.letter_url,
				  'live_video_url': this.img_url,
				  'video_cover_url': this.tipImg
				}
				if(this.live_code == '') {
					addFigure(val).then(res => {
					  if (res.code == 20000) {
						   this.isClick = true
						   this.$api.msg('提交成功');
						   setTimeout( () => {
							   uni.navigateTo({
							   	  url: '/childCont/figure/figure_product'
							   })
						   }, 1000)
						   
					  } else {
						  this.$api.msg(res.msg);
						  this.isClick = true
					  }
					}).catch(err => {
						  this.$api.msg('提交失败');
						  this.isClick = true
					})
				} else {
					val.live_code = this.live_code
					editFigure(val).then(res => {
					  if (res.code == 20000) {
						   this.isClick = true
						   this.$api.msg('修改成功');
						   setTimeout( () => {
							   uni.navigateTo({
							   	  url: '/childCont/figure/figure_product'
							   })
						   }, 1000)
						   
					  } else {
						  this.$api.msg(res.msg);
						  this.isClick = true
					  }
					}).catch(err => {
						  this.$api.msg('修改失败');
						  this.isClick = true
					})
				}
				
			},
			
			checkAgree() {
				uni.navigateTo({
					url: '/pages/agree/agree?agree_type=6',
				})
			},
			
			getFile() {
				window.open(global.baseImg+'/static/digital_human_static/e0945c30-86c8-4db6-a701-1fe66d491406.docx')
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
		}
	}
</script>

<style lang="less" scoped>
	.containar {
		width: 100%;
		padding: 30upx;
	}
	.video_cont {
		width: 100%;
		background: #fff;
		padding: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-bottom: 30upx;
		border-radius: 10upx;
		.cont_title {
			color: #000;
			font-size: 32upx;
			font-style: normal;
			font-weight: 500;
			line-height: 150%;
			padding: 20upx;
		}
		
		.title_info {
			display: flex;
			align-items: center;
			border-radius: 10upx;
			border: 1upx solid #D1D3D6;
			padding: 15upx;
			margin-bottom: 15upx;
			width: 100%;
			.title_text {
				font-size: 28upx;
				color: #000;
				margin-right: 10upx;
			}
		}
		
		.video_up {
			width: 100%;
			height: 350upx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			border-radius: 10upx;
			border: 1upx dashed #D1D3D6;
			background: #F6F8FB;
			.video_text {
				font-size: 28upx;
				color: #666;
				line-height: 48upx;
			}
		}
		
		.video_li {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			.sp_img {
				width: 100%;
				height: 350upx;
				border-radius: 10upx;
			}
			.video_tip {
				color: #2D2D2D;
				font-size: 24upx;
				padding: 20upx 0;
			}
		}
		
		
		.tip {
			padding: 40upx;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			.tip_line {
			    height: 1upx;
				background: #D1D3D6;
				flex: 1;
			}
			.tip_text {
				color: #2D2D2D;
				font-size: 26upx;
				padding: 0 25upx;
			}
		}
		
	}
	
	.bot {
		width:60%;
		.bot_cont {
			display: flex;
			justify-content: space-between;
			padding-bottom: 25upx;
		}
		
		.bot_left {
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
			margin: 20upx auto 0;
		}
	}
	
	.cont_slove {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-bottom: 150upx;
		.slove {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.slove_img {
				width: 60upx;
			    height: 60upx;
				margin: 15upx 0;
			}
			.slove_text {
				color: #34373D;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%; 
				// padding-top: 20upx;
			}
		}
	}
	
	.bottom {
		width: 100%;
		background: #ffffff;
		position: fixed;
		bottom: 0;
	}
	
	.bottom_cont {
		display: flex;
		justify-content: center;
		flex-direction: column;
		padding: 25upx 0;
	}
	
	.bottom_buy {
		width: 90%;
		height: 80upx;
		background: #1F64FF;
		border-radius: 6px;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 20px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20upx auto 0;
	}
	
	.bottom_desc {
		width: 624upx;
		height: 34upx;
		font-style: normal;
		font-weight: 400;
		font-size: 24upx;
		line-height: 34upx;
		margin: 20upx auto 0;
		text-align: center;
	}
	
	
	.slove_down {
		color: #2E6FFF;
	}
	
	.voice_list {
		width: 100%;
		.list_li {
			width: 100%;
			border-radius: 12upx;
			background: #FFF;
			margin: 20upx 0;
			padding: 20upx;
			border: 1upx solid #E1DFDF;
		}
	}
	
	
</style>