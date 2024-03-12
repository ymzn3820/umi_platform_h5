<template>
	<view class="heads">
		<view class="tab_li">
			<u-tabs :list="tablist" lineWidth='45' lineHeight='2' lineColor='#1f64ff'
				:activeStyle='{color: "#1F64FF","font-size":"30rpx"}' @change='tabsChange' :current='current'
				:inactiveStyle='{"font-size":"30rpx"}'></u-tabs>
		</view>
		
		<view class="cont_title">
			<view class="title_t">声音克隆</view>
			<view class="title_b">轻松3步，复刻高品质真人声音</view>
		</view>
		
		<view class="cont_text">
			<view class="cont_step">
				<view class="step_t">
					<text class="t_l">1</text>
					<text class="t_r">创建你的声音</text>
				</view>
				<view class="step_b">
					<u-input inputAlign="left" v-model="voiceName"
						placeholder="例如:埃隆马斯克" type="text" maxlength="10" ></u-input>
				</view>
			</view>
			
			<view class="cont_step" style="margin-top: 25rpx;">
				<view class="step_t">
					<text class="t_l">2</text>
					<text class="t_r">上传录制视频</text>
				</view>
				<view class="voice_up" @click="saveVideo" v-if="videoList.length == 0">
					<image class="up_img" :src="icoImg1" mode=""></image>
					<text class="up_text" style="padding: 20upx 0;">wav、mp3、ogg、m4a、aac、pcm,文件小于20MB</text>
					<text class="up_text">建议10s-30s的单个音频</text>
				</view>
				
				<view  class="voice_up" v-for="(item, index) in videoList" :key="index"  v-if="videoList.length > 0">
					<view class="up_del" @click="delVideo"><u-icon name="trash" color="#000" size="26"></u-icon></view>
					<Audio :audio="getImgUrl(item.audio_url)" :title="item.fileName" style="width: 100%"></Audio>
				</view>
			</view>
			
			<view class="video_cont">
				<view class="tip">
					<text class="tip_line"></text>
					<text class="tip_text">录音规范</text>
					<text class="tip_line"></text>
				</view>
				
				<view class="slove" @click="toVoiceReq">
					<text class="slove_text">查看录音规范</text>
					<u-icon name="arrow-right" color="#000" size="18"></u-icon>
				</view>
				
				<view class="slove_cont">
					<view class="cont_li">
						<image class="li_img" :src="icoImg2" mode=""></image>
						<text class="li_text">单人录音</text>
					</view>
					
					<view class="cont_li">
						<image class="li_img" :src="icoImg3" mode=""></image>
						<text class="li_text">周围安静无噪音</text>
					</view>
					
					<view class="cont_li">
						<image class="li_img" :src="icoImg4" mode=""></image>
						<text class="li_text">录制符合日常使用场景</text>
					</view>
				</view>
			</view>
			
			<view class="cont_step"  style="padding-bottom: 250upx;">
				<view class="step_t">
					<text class="t_l">3</text>
					<text class="t_r">点击开始训练，等待训练完成即可使用</text>
				</view>
				<!-- <view class="step_bt">付款定制，即可快速复刻，拥有高品质Al定制音色，实现你的专属发音播稿</view> -->
			</view>
			
			
			<!-- <view class="bottom" v-if="edit == 1">
				<view class="bottom_left">
					<text class="left_text">￥</text>
					<text class="right_text">{{ pay_price }}</text>
					<text class="left_text">/次</text>
				</view>
				<view class="bottom_cont">
					<view class="bottom_buy" @click="customizedVoice">立即定制</view>
					<view class="bottom_desc">
						<text>定制即默认接受</text>
						<text style="color: #1F64FF;" @click="checkAgree">《声音克隆协议》</text>
					</view>
				</view>
			</view> -->
			<view class="bottoms" v-if="edit == 1">
				<view class="bottom_cont" style="width: 100%;">
					<view class="bottom_buy" @click="creatVoice">开始训练</view>
				</view>
			</view>
			
			<view class="bottoms" v-else>
				<view class="bottom_cont" style="width: 100%;">
					<view class="bottom_buy" @click="againVoice">重新训练</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		getProductList,
		wxpay,
		getResult,
	} from '@/apis/chat.js'
	import { creatVoice, getVoiceIdQuery, againVoice } from '@/apis/home.js'
	import Audio from '../components/audio/audio.vue'
	export default {
		data() {
			return {
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
						index: 3
					},
					{
						name: '订单记录',
						index: 4
					}
				],
				current: 1,
				voiceName: '',
				pay_price: 0,
				productInfo: '',
				icoImg1: global.baseImg + '/xcx/com/hotel/com/message_center/icon_4.png',
				icoImg2: global.baseImg + '/xcx/com/hotel/com/message_center/icon_3.png',
				icoImg3: global.baseImg + '/xcx/com/hotel/com/message_center/icon_2.png',
				icoImg4: global.baseImg + '/xcx/com/hotel/com/message_center/icon_1.png',
				videoList: [],
				isClick: true,
				edit: 1, //用于判断是否是编辑状态
				train_code: ''
				// {
				// 	'audio_url': '/static/digitized_human-audio_list/b3d1b096-378a-4d69-8359-467cadba82ba.wav'
				// }
			}
		},
		components: {
		  Audio
		},
		onLoad(option) {
			if(option.edit) {
				this.edit = option.edit
				let info = JSON.parse(option.info)
				this.voiceName = info.voice_name
				this.videoList = JSON.parse(info.audios)
				this.train_code = info.train_code
				console.log(this.videoList,9996)
			} else {
				this.edit = 1
			}
		},
		onShow() {
			this.getProduct()
		},
		
		methods: {
			tabsChange(e) {
				console.log(e)
				this.current = e.index
				if(this.current == 0) {
					uni.navigateTo({
						url: '/childCont/clone/my_voice'
					})
				} else if(this.current == 1) {
					uni.navigateTo({
						url: '/childCont/clone/voice_clone',
					})
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
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			// 获取会员商品列表
			getProduct() {
				// const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					'prod_cate_id': [9]
				}
			
				getProductList(val).then(res => {
			
					if (res.code == 20000) {
						this.pay_price = res.data[9][0].prod_price;
						this.productInfo = res.data[9][0]
						
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
			
			customizedVoice() {
						
				getVoiceIdQuery().then(res => {
							
					if (res.code == 20000) {
						this.pay()
					} else {
						// this.$api.msg(res.msg)
						uni.showModal({
							title: '提示',
							content: res.msg,
							confirmText: "知道了"
						});
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
			
			// 发起微信支付
			pay() {
				if(this.voiceName == '') {
					return this.$api.msg('请填写声音名称')
				}
				
				if(this.videoList.length == 0) {
					return this.$api.msg('请上传音频文件')
				}
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				const openid = uni.getStorageSync('openid')
				let val = {
						"user_id": userInfo.user_id,
						"prod_id": this.productInfo.prod_id,
						"prod_cate_id": this.productInfo.prod_cate_id,
						"prod_name": this.productInfo.prod_name,
						"total_amount": this.productInfo.prod_price,
						"price": this.productInfo.prod_price,
						"open_id": openid,
						"quantity": 1
					}
			
				if (this.isClick == false) {
					return false
				}
				this.isClick = false;
				let that = this;
				wxpay(val).then(res => {
					// console.log(res, 548)
					if (res.code == 20000) {
						// console.log(res, 336);
						let data = res.data[0].req_data;
						let order_id = res.data[0].order_id;
						// that.isClick = true;
						// that.productInfo = '';
			
						wx.requestPayment({
							"timeStamp": data.time_stamp,
							"nonceStr": data.nonce_str,
							"package": data.package,
							"signType": data.sign_type,
							"paySign": data.pay_sign,
							"success": (res) => {
								that.isClick = true;
								that.getPayResult(order_id)
							},
							"fail": (res) => {
								that.isClick = true;
								that.$api.msg('支付已关闭');
							}
						})
					} else {
						// console.log(res.msg, 663);
						that.$api.msg(res.msg)
						that.isClick = true;
					}
				}).catch(err => {
					that.isClick = true;
					that.$api.msg('获取支付信息失败！')
				})
			},
			
			// 查询支付结果
			getPayResult(order_id) {
				let val = {
					'order_id': order_id
				}
				getResult(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('支付成功');
						this.isClick = true;
						this.creatVoice()
					} else {
						this.isClick = true;
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.isClick = true;
					this.$api.msg('获取支付结果失败！')
				})
			},
			
			// 创建声音
			creatVoice() {
				if(this.voiceName == '') {
					return this.$api.msg('请填写声音名称')
				}
				
				if(this.videoList.length == 0) {
					return this.$api.msg('请上传音频文件')
				}
				// const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					'audios': this.videoList,
					'voice_name': this.voiceName
				}
				creatVoice(val).then(res => {
					if (res.code == 20000) {
					    this.current = 0
						uni.navigateTo({
							url: '/childCont/clone/my_voice'
						})
					} else {
						this.$api.msg(res.msg)
						this.current = 0
						// uni.navigateTo({
						// 	url: '/childCont/clone/my_voice'
						// })
					}
				}).catch(err => {
					this.$api.msg('创建失败！')
				})
			},
			
			
			saveVideo() {
				let that = this;
				uni.chooseFile({
				  count: 1,
				  type: 'all',
				  extension:['.mp3','.wav', '.m4a'],//此处限制文件类型
				  success (res) {
				    // tempFilePath可以作为img标签的src属性显示图片
					console.log(res,7458)
				    const tempFilePaths = res.tempFilePaths[0];
					const imageName = res.tempFiles[0].name
					const size = res.tempFiles[0].size;
					if(size > 20971520) { // 音频文件最大只能上传20m
						that.$api.msg('该文件已超过20M，不能上传')
						return
					}
					// console.log(image_name,774)
					uni.showLoading({ title: '上传中' });
					let headers = {
						'source': global.source,
					}
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					if (userInfo.token) headers.Authorization = userInfo.token;
					if (userInfo.role) headers.role = userInfo.role
					uni.uploadFile({
						url: global.loginUrl + '/api/user/oss_upload', 
						filePath: tempFilePaths,
						header: headers,
						name: 'image',
						formData: {
							"image": tempFilePaths,
							"image_name": imageName,
							"oss_dir": 'static',
							"cate": 'create_character'
						},
						success: (uploadFileRes) => {
							let imgData = JSON.parse(uploadFileRes.data)
							if(imgData.code == 20000) {
								let url = imgData.data.new_url
								let name = imgData.data.name
								let val = { audio_url: url, fileName: name }
								if(that.videoList == null) {
									that.videoList = []
								}
								that.videoList.push(val)
								uni.hideLoading()
							} else {
								that.$api.msg(imgData.msg)
								uni.hideLoading()
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
			
			delVideo() {
				this.videoList = []
			},
			
			toVoiceReq() {
				uni.navigateTo({
					url: '/childCont/clone/clone_qs'
				})
			},
			
			againVoice() {
				console.log(this.videoList,5589)
				let val = {
					'audios': this.videoList,
					'voice_name': this.voiceName,
					'train_code': this.train_code
				}
				againVoice(val).then(res => {
					if (res.code == 20000) {
					    this.current = 0
						uni.navigateTo({
							url: '/childCont/clone/my_voice'
						})
					} else {
						this.$api.msg(res.msg)
						this.current = 0
						uni.navigateTo({
							url: '/childCont/clone/my_voice'
						})
					}
				}).catch(err => {
					this.$api.msg('创建失败！')
				})
			}
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
	
	.cont_title {
		width: 100%;
		padding: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.title_t {
			color: #000;
			font-size: 32upx;
			font-style: normal;
			font-weight: 500;
			line-height: 64upx;
		}
		
		.title_b {
			color: #666;
			font-size: 28upx;
			font-style: normal;
			font-weight: 400;
			line-height: 56upx;
		}
	}
	
	.cont_text {
		background: #fff;
		border-radius: 10upx;
		padding: 30upx 0upx;
		
		.cont_step {
			padding: 0 20upx;
			.step_t {
				display: flex;
				align-items: center;
				margin-bottom: 20upx;
				.t_l {
					width: 50upx;
					height: 50upx;
					border-radius: 50%;
					background: #1F64FF;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #fff;
					font-size: 32upx;
					margin-right: 20upx;
				}
				.t_r {
					color: #333;
					font-size: 32upx;
					font-style: normal;
					font-weight: 500;
					line-height: 150%;
				}
			}
			.step_bt {
				color: #505257;
				font-size: 22upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%; 
			}
			
		}
		
		.voice_up {
			border-radius: 10upx;
			border: 1upx dashed #D1D3D6;
			background: #FBFCFF;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 40upx 20upx;
			.up_img {
				width: 120upx;
				height: 100upx;
			}
			.up_text {
				color: #666;
				font-size: 27upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				text-align: center;
			}
			.up_del {
				width: 100%;
				display: flex;
				justify-content: flex-end;
			}
		}
		
		.video_cont {
			width: 100%;
			background: #fff;
			padding: 40upx 30upx;
			flex: 1;
			margin-bottom: 20upx;
			
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
			
			.slove {
				border-radius: 6upx;
				background: #F6F8FB;
				padding: 20upx 30upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: calc(100% -60upx);
				.slove_text {
					color: #2D2D2D;
					font-size: 24upx;
				}
				
			}
			
			.slove_cont {
				display: flex;
				padding: 20upx 0;
				justify-content: space-between;
				width: 100%;
				.cont_li {
					width: 25%;
					border-radius: 10upx;
					background: #F7F8F9;
					padding: 20upx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					.li_img {
						width: 70upx;
						height: 70upx;
					}
					.li_text {
						color: #666;
						font-size: 24upx;
						font-style: normal;
						font-weight: 400;
						line-height: 40upx;
						text-align: center;
						height: 80upx;
					}
				}
			}
		}
		
		.bottom {
			width: 100%;
			background: #ffffff; 
			position: fixed;
			bottom: 0;
			display: flex;
			border-top: 1upx solid #E7E7E7;
			padding-top: 20upx;
			.bottom_left {
				width: 35%;
				padding: 20upx;
				.left_text {
					color: #EB504B;
					font-size: 28upx;
					font-style: normal;
					font-weight: 600;
					line-height: 52upx; 
				}
				
				.right_text {
					color: #EB504B;
					font-size: 52upx;
					font-style: normal;
					font-weight: 700;
				}
			}
			
			.bottom_cont {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				padding-bottom: 25upx;
				width: 65%;
				.bottom_buy {
					width: 90%;
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
					margin: auto;
				}
				
				.bottom_desc {
					// width: 624upx;
					height: 34upx;
					font-style: normal;
					font-weight: 400;
					font-size: 24upx;
					line-height: 34upx;
					margin: 20upx auto 0;
					text-align: center;
				}
			}
		}
		
		
	}
	
	.bottoms {
		width: 100%;
		background: #ffffff;
		position: fixed;
		bottom: 0;
		z-index: 999;
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
	}
	
	
</style>
