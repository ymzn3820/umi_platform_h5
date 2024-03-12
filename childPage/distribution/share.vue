<template>
	<view>

		<!-- 提示 -->
		<!-- <view class="tip" v-show="isTip">
			<view class="tip_title">邀请奖励规则</view>
			<view class="tip_text">1.将你的推广海报分享给未使用过的好友，他/她首次打开成功注册后，你将立即获得100万通用算力奖励。</view>
			<view class="tip_text">2.好友打开注册后，他/她也将立即获得50万通用算力奖励。</view>
			<view class="tip_text">3.该邀请奖励规则针对分享的每一个新用户（未使用过）有效。例如：A使用过无忧秘书智脑，而B和C从未使用过，是新用户，
			那么B和C都通过A的邀请海报成功注册后，那么B和C能各自得到50万通用算力，A可以共获得（100+100=）200万通用算力。</view>
			
			<view class="tip_btn">
				<view class="btn_left" @click="backInfo">取消</view>
				<view class="btn_right" @click="checkShare">确认</view>
			</view>
		</view> -->
		
		<!-- 海报 -->
		<view v-show="!isTip">
			<view style="position: fixed; top: 0; z-index: 11; width: 100%;">
				<!-- <view style="text-align: center;font-weight: 700;font-size: 26upx;margin-top: 18upx;">分享海报</view> -->
				<view >
					<image :show-menu-by-longpress='true' style="width: 68%;margin: 20upx 126upx;border-radius: 5%; "
						mode="widthFix" :src='pageData.post_img' />
				</view>
				
				<view style="text-align: center; font-size: 24upx;">长按上方图片保存，分享给朋友</view>
				<view class="placard_swiper">
					<image @click='changeCurrent(i)' class="img" mode="widthFix" v-for="(v,i) in thumbnailList" :key='i'
						:src="v" alt="" />
				</view>
			</view>
			
			<view style="position: fixed; top: 0; z-index: 10; width: 100vw; height: 100vh; background: #fff;"></view>
			<!-- //画布 -->
			<view style="position: fixed; top: 0; z-index: 9;">
				<canvas canvas-id="shareCanvas" class="canvas"  bindlongpress="saveImg" catchtouchmove="true"
					:style="{height: canvasHeight+'px',width:canvasWidth+'px'}">
				</canvas>
			</view>
		</view>
		
	</view>

</template>

<script>
	import {
		getQrCode
	} from '@/apis/user.js'
import radio from '../../uni_modules/uview-ui/libs/config/props/radio';

	export default {
		data() {
			return {
				// backgroundImg: 'background-image: url("'+global.baseImg+'/xcx/8d112d40-9cac-44f5-a8b0-9e372c07e7a9.jpg")',
				// backgroundImg_guess: 'background-image: url("'+global.baseImg+'/xcx/a48f9928-58ef-4082-af30-cfe4d3a1daf4.jpg")',

				// codeImg: global.baseImg+'/wechat_mp/2a820ac7-5950-4244-9194-b4785701688e.jpg',
				isTip: true,
				codeImg: '',
				info_img: '',
				leftImg: global.baseImg + '/xcx/aecc1078-f862-4c10-915b-61c1a4fcf564.jpg',
				rightImg: global.baseImg + '/xcx/5d998f97-6934-413f-b70a-fd55534ae73f.jpg',
				userInfo: '',
				pageData: {
					post_img: '',
					codePng: null
				},
				ctx: null,
				windowObj: {},
				canvasHeight: 0,
				canvasWidth: 0,
				isShow: true,
				img_link: '',
				current: 2,
				swiperList: [{
						backImg: global.baseImg + '/xcx/com/message_center/%E6%B5%B7%E6%8A%A5.png',
						backImg_guess: global.baseImg + '/xcx/com/message_center/%E6%B5%B7%E6%8A%A5.png'
					},

					{
						backImg: global.baseImg + '/xcx/com/message_center/%E6%B5%B7%E6%8A%A52.png',
						backImg_guess: global.baseImg + '/xcx/com/message_center/%E6%B5%B7%E6%8A%A52.png'
					},
					{
						backImg: global.baseImg + '/xcx/com/message_center/%E6%B5%B7%E6%8A%A53.png',
						backImg_guess: global.baseImg + '/xcx/com/message_center/%E6%B5%B7%E6%8A%A53.png',
					}
				], //大图
				thumbnailList: [
					global.baseImg + '/xcx/com/message_center/mini%E6%B5%B7%E6%8A%A51.png',
					global.baseImg + '/xcx/com/message_center/mini%E6%B5%B7%E6%8A%A52.png',
					global.baseImg + '/xcx/com/message_center/mini%E6%B5%B7%E6%8A%A53.png'
				] //小图

			}
		},
		components: {

		},
		onLoad() {
			this.userInfo = JSON.parse(uni.getStorageSync('memberInfo'));

			let img_url = uni.getStorageSync('qrCode');
			this.codeImg = global.baseImg + '/' + img_url;
            let url = uni.getStorageSync("avatarUrl");
			this.info_img = global.baseImg + '/' + url

			this.getQrCode()
		},
		onShow() {
			this.checkShare()
		},
		onReady() {
			//初始化画布
			this.ctx = wx.createCanvasContext('shareCanvas')
		},
		methods: {
			// 长按保存图片


			changeCurrent(index) {
				// 点击缩略图切换最上方大图
				this.current = index;


				this.exportPost()

			},

			// 获取二维码链接
			getQrCode() {
				let val = {
					"q_type": "2"
				}
				getQrCode(val).then(res => {
					if (res.code == 20000) {
						this.img_link = res.data;
					} else {
						// this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})
			},
			// 二维码位移


			//获取图片的基本信息，即将网络图片转成本地图片，
			getImageInfo(src) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src,
						success: (res) => resolve(res),
						fail: (res) => reject(res)
					})
				});
			},
			exportPost() {
				this.isShow = true
				let that = this
				uni.showLoading({
					title: '推广海报生成中',

				})

				//获取系统的基本信息，为后期的画布和底图适配宽高
				uni.getSystemInfo({
					success: function(res) {

						that.windowObj = res
						// that.windowObj.ratio = that.windowObj.windowWidth/750 //因为小程序是用rpx单位，为了是后期合成的图片更好是适应各个手机屏幕的尺寸，这里先计算出一个比率，后面除以这个比率就可以对各个手机尺寸进行适配了
						that.canvasWidth = that.windowObj.windowWidth //设置画布的宽高
						that.canvasHeight = that.windowObj.windowHeight
						//image是画布的底图，后期可以换成自己需要的
						let image = '';
						if (that.userInfo.role == 'user') {
							image = that.swiperList[that.current].backImg;
						} else {
							image = that.swiperList[that.current].backImg_guess;
						}

						let code_img = that.codeImg;
						let info_img = that.info_img
						// console.log(code_img,7454)
						Promise.all([that.getImageInfo(image), that.getImageInfo(code_img), that.getImageInfo(
							info_img)]).then(res => {

							// let code_width = that.canvasWidth - 100;
							// let code_height = that.canvasHeight - 30;
							// let info_width = that.canvasWidth - 400
							// let info_height = that.canvasHeight - 100
							let code_width = that.canvasWidth - 100;
							let code_height = 30;
							let info_width = 20
							let info_height = that.canvasHeight - 100
							if (that.userInfo.role == 'user') {
								code_height = that.canvasHeight - 135;
							} else {
								code_height = that.canvasHeight * 0.85 - 65;
							}
							that.ctx.drawImage(res[0].path, 0, 0, that.canvasWidth, that.canvasHeight);//背景图
							that.ctx.drawImage(res[1].path, code_width, code_height, 78.5, 78.5);//二维码
							that.ctx.drawImage(res[2].path, info_width, info_height, 60, 60);//头像
							
							that.ctx.fillStyle = '#fff'
							that.ctx.setFontSize(15)
							that.ctx.fillText(`我是用户${that.userInfo.nick_name}`, 90, that.canvasHeight - 80)
							that.ctx.fillStyle = 'rgba(255, 255, 255, 0.80)'

							that.ctx.setFontSize(12)
							that.ctx.fillText('我为无忧秘书智脑代言', 90, that.canvasHeight - 55)
							that.ctx.setFontSize(11)
							that.ctx.fillText('长按识别二维码', code_width, that.canvasHeight - 35)
							that.ctx.setFontSize(11)
							that.ctx.fillText('即刻体验', code_width+ 20, that.canvasHeight - 15)

							that.ctx.draw(true, setTimeout(() => {
								uni.canvasToTempFilePath({ //将canvas生成图片
									x: 0,
									y: 0,
									width: that.windowObj.windowWidth,
									height: that.windowObj.windowHeight,
									destWidth: that.windowObj.windowWidth *
										2, //这里乘以2是为了保证合成图片的清晰度
									destHeight: that.windowObj.windowHeight * 2,
									canvasId: 'shareCanvas',
									fileType: 'jpg', //设置导出图片的后缀名
									success: function(res) {
										uni.hideLoading()
										that.pageData.post_img = res
											.tempFilePath;
										// console.log(that.pageData.post_img,
										// 	415)

										that.isShow = false;
										that.$forceUpdate()
									},
									fail: (err) => {
										console.log(err)
									}
								})
							}, 500))

						})
					}
				})
			},

			// 保存图片
			savePhoto() {
				//保存图片到本地
				uni.showLoading({
					title: '正在保存...'
				})
				uni.saveImageToPhotosAlbum({
					filePath: this.pageData.post_img,
					success: function() {
						uni.hideLoading();
						setTimeout(function() {
							uni.showToast({
								title: '保存成功',
								duration: 2000
							})
						}, 500);
					},
				})
			},

			// 复制链接
			copyLink() {
				let val = '「无忧秘书智脑」是一个AI人工智能平台，点开链接直接打开快来参与吧！' + this.img_link;
				uni.setClipboardData({
					data: val, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功',
							duration: 2000
						})
					}
				})
			},

			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},
			
			backInfo() {
				uni.switchTab({
					url: '/pages/user/user',
				})
			},
			
			checkShare() {
				this.isTip = false;
				this.exportPost()
			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		// width: 100%;
		height: 100vh;
		background-size: 100% 100%;
		z-index: 98;
	}
    
	.back_li {
		width: 100vw;
		height: 100vh;
		background: #fff;
		z-index: 10;
	}
	.btn {
		position: fixed;
		bottom: 40upx;
		width: 100%;
		z-index: 9999;

		.btn_cont {
			display: flex;
			width: 100%;

			.btn_l {
				width: 50%;
				display: flex;
				align-items: center;
				justify-content: center;

				.btn_img {
					width: 70%;
					height: 70upx;
				}
			}
		}

	}

	.placard_swiper {
		display: flex;
		justify-content: center;
		margin-top: 10upx;


		.img {
			border-radius: 5%;
			width: 140upx;
			margin: 10upx;
		}

	}
	
	.tip {
		width: 100vw;
		height: 100vh;
		padding: 25upx;
		.tip_title {
			width: 100%;
			font-size: 30upx;
			color: #000;
			line-height: 50upx;
			font-weight: 550;
			text-align: center;
		}
		.tip_text {
			width: 100%;
			font-size: 26upx;
			color: #333;
			line-height: 50upx;
			font-weight: 500;
		}
		.tip_btn {
			width: 100%;
			position: fixed;
			bottom: 50upx;
			display: flex;
			align-items: center;
			justify-content: center;
			.btn_left {
				font-size: 28upx;
				color: #999;
				border: 1upx solid #999;
				padding: 15upx 50upx;
				line-height: 40upx;
				text-align: center;
				margin: 0 50upx;
				border-radius: 8upx;
			}
			
			.btn_right {
				font-size: 28upx;
				color: #fff;
				background: #1F64FF;
				padding: 15upx 50upx;
				line-height: 40upx;
				text-align: center;
				border-radius: 8upx;
				margin: 0 50upx;
			}
		}
	}
</style>