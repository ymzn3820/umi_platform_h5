<template>
	<view class="heads">

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
				<view class="up_text">
					创建和命名你的声音模型
				</view>
			</view>

			<view class="cont_step" style="margin-top: 25rpx;">
				<view class="step_t">
					<text class="t_l">2</text>
					<text class="t_r">上传录制视频</text>
				</view>
				<view class="voice_up" v-if="videoList.length == 0">
					<text class="up_text" style="padding: 20upx 0;">支持wav、mp3、ogg、m4a、aac、pcm格式</text>
					<text class="up_text">文件小于20MB</text>
					<text class="up_text">建议10s-30s的单个音频</text>
				</view>

				<view class="voice_up" v-for="(item, index) in videoList" :key="index" v-if="videoList.length > 0">
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

			<view class="cont_step" style="padding-bottom: 250upx;">
				<view class="step_t">
					<text class="t_l">3</text>
					<text class="t_r">付费定制，等待训练完成即可使用</text>
				</view>
				<view class="step_bt">付款定制，即可快速复刻，拥有高品质Al定制音色，实现你的专属发音播稿</view>
				<view class="step_bt" style="margin-top: 25rpx;">案例试听</view>
				<view style="width: 100%;">
					<view class="case">
						<Audio :audio="audio1" :title="txt1" style="width: 100%"></Audio>
					</view>
					<view class="case">
						<Audio :audio="audio2" :title="txt2" style="width: 100%"></Audio>
					</view>
				</view>
			</view>


			<view class="bottom" >
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
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getProductList,
		wxpay,
		getResult,
		webpay
	} from '@/apis/chat.js'
	import {
		creatVoice,
		getVoiceIdQuery
	} from '@/apis/home.js'
	import Audio from '../components/audio/audio.vue'
	export default {
		data() {
			return {
				audio1: global.baseImg + '/xcx/com/message_center/案例原声音.wav',
				audio2: global.baseImg + '/xcx/com/message_center/案例克隆声音.wav',
				txt1:'原声音',
				txt2:'克隆声音',
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
			if (option.edit) {
				this.edit = option.edit
				let info = JSON.parse(option.info)
				this.voiceName = info.voice_name
				this.videoList = JSON.parse(info.audios)
				this.train_code = info.train_code
				console.log(this.videoList, 9996)
			} else {
				this.edit = 1
			}
			
			let ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
				if (uni.getStorageSync('openid') == null || uni.getStorageSync('openid') == 'null'||uni.getStorageSync('openid') == '') {
					this.getCode()
				}
			}
		},
		onShow() {
			this.getProduct()
		},
		
		onUnload() {
		    uni.navigateTo({
		    	url: '/childCont/clone/my_voice'
		    })
		},


		methods: {

			getImgUrl(url) {
				return global.baseImg + '/' + url;
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
				// if (this.voiceName == '') {
				// 	return this.$api.msg('请填写声音名称')
				// }

				// if (this.videoList.length == 0) {
				// 	return this.$api.msg('请上传音频文件')
				// }
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					"user_id": userInfo.user_id,
					"prod_id": this.productInfo.prod_id,
					"prod_cate_id": this.productInfo.prod_cate_id,
					"prod_name": this.productInfo.prod_name,
					"total_amount": this.productInfo.prod_price,
					"price": this.productInfo.prod_price,
					"quantity": 1
				}

				if (this.isClick == false) {
					return false
				}
				this.isClick = false;
				let that = this;
				let ua = navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
					// console.log('微信环境')
					val.open_id = uni.getStorageSync('openid')
					wxpay(val).then(res => {
						// console.log(res, 548)
						if (res.code == 20000) {
							// console.log(res, 336);
							// let data = res.data[0].req_data;
							let order_id = res.data[0].order_id;
							WeixinJSBridge.invoke(
							  'getBrandWCPayRequest', {
								 "appId":res.data[0].req_data.app_id,     //公众号ID，由商户传入     
								 "timeStamp":res.data[0].req_data.time_stamp, //时间戳，自1970年以来的秒数     
								 "nonceStr":res.data[0].req_data.nonce_str, //随机串     
								 "package":res.data[0].req_data.package,     
								 "signType":res.data[0].req_data.sign_type,  //微信签名方式：     
								 "paySign":res.data[0].req_data.pay_sign //微信签名 
							  },
							  function(res){
								  // that.timer = setInterval(() => {
								  // 	that.getPayResult(order_id)
								  // },2000)
								  if(res.err_msg == "get_brand_wcpay_request:ok" ){
									// 使用以上方式判断前端返回,微信团队郑重提示：
									//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
									//查询支付是否成功
									  that.getPayResult(order_id)
									  that.isClick = true
								  }else if(res.err_msg == "get_brand_wcpay_request:fail" ){
									  console.log("支付失败")
									  that.isClick = true
								  }else{
									  console.log("取消支付")
									  that.isClick = true
									  //修改上面生成的预支付订单状态
									  // cancelPayMoney();
								  }
							});
					
							
						} else {
							// console.log(res.msg, 663);
							that.$api.msg(res.msg)
							that.isClick = true;
						}
					}).catch(err => {
						that.isClick = true;
						that.$api.msg('获取支付信息失败！')
					})
					
				} else {
					webpay(val).then(res => {
						if (res.code == 20000) {
							let order_id = res.data[0].order_id;
							uni.setStorageSync('orderId', order_id);
							that.isClick = true;
							let url = encodeURIComponent(global.url + '/#/childCont/clone/voice_clone?order_id='+ order_id);
							let href = res.data[0].req_data.mweb_url +'&redirect_url=' + url
							// oWindow.location = href;
							window.location.href = href;
						} else {
							that.$api.msg(res.msg)
							that.isClick = true;
						}
					}).catch(err => {
						that.isClick = true;
						that.$api.msg('获取支付信息失败！')
					})
				}
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
						uni.navigateTo({
							url: '/childCont/clone/voice_clone'
						})
						// this.creatVoice()
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
				// const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					'audios': this.videoList,
					'voice_name': this.voiceName
				}
				creatVoice(val).then(res => {
					if (res.code == 20000) {
						this.current = 1
						uni.navigateTo({
							url: '/childCont/clone/my_voice'
						})
					} else {
						this.$api.msg(res.msg)
						this.current = 1
						uni.navigateTo({
							url: '/childCont/clone/my_voice'
						})
					}
				}).catch(err => {
					this.$api.msg('创建失败！')
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

			getCode() { // 非静默授权，第一次有弹框
				let local = global.url + '/#/childCont/clone/voice_clone' //当前页面的地址
				//  const local = window.location.href;
				let appid = '' //公众号里有自己查，不会找的查一下百度
				this.code = this.getUrlCode().code // 截取code	
				// 判断地址栏参数有无code,如果没有code，页面地址就跳转到微信提供的获取code的链接
				if (this.code == null || this.code == '') {
					// console.log(1116666)
					let href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid +
						"&redirect_uri=" +
						encodeURIComponent(local) + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
						// console.log(href,9995)
						window.location.href = href
				} else {
					// 获取code后自己的业务逻辑
					let that = this;
					let headers = {
						'content-type': 'application/x-www-form-urlencoded',
						'source': global.source
					}
					let val = { code: this.code }
					uni.request({
						url: global.loginUrl + '/api/user/get_open_id',
						data: val,
						header: headers,
						method: 'POST',
						success: (res) => {
							if (res.data.code == 20000) {
								// that.openId = res.data.data
								uni.setStorageSync("openid", res.data.data);
							} else {
								console.log('获取openid失败')
							}
						}
					});
					
				}
			},
			// 截取url中的code方法
			getUrlCode() { 
				var url = location.search
				
				var theRequest = new Object()
				if (url.indexOf("?") != -1) {
					var str = url.substr(1)
					var strs = str.split("&")
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1])
					}
				}
				console.log(theRequest,'111')
				return theRequest
			},
		}
	}
</script>


<style lang="less" scoped>
	.case {
		width: 60%;
		transform: translate(29%);
		border: 2rpx solid #999;
		border-radius: 24rpx;
		padding: 10rpx;
		margin-top: 20rpx;
	}

	
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
		background-color: #fff;

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

		.up_text {
			color: #666;
			font-size: 27upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			text-align: center;
		}

		.voice_up {
			border-radius: 10upx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 0upx 20upx;

			.up_img {
				width: 120upx;
				height: 100upx;
			}

			.up_del {
				width: 100%;
				display: flex;
				justify-content: flex-end;
			}
		}

		.video_cont {
			width: calc(100% - 60upx);
			background: #fff;
			padding: 40upx 30upx;
			flex: 1;
			margin-bottom: 20upx;

			.tip {
				padding: 40upx;
				display: flex;
				align-items: center;
				justify-content: center;
				width: calc(100% - 80upx);

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