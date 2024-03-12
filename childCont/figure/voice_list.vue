<template>
	<view>
		<view class="containar">
			<view class="step">
				<view class="step_li">
					<text class="li_top li_end">1</text>
					<text class="li_bot">填写信息</text>
				</view>
				<view class="step_line"></view>
				<view class="step_li">
					<text class="li_top">2</text>
					<text class="li_bot li_text">上传音频文件</text>
				</view>
				<view class="step_line"></view>
				<view class="step_li">
					<text class="li_top li_end">3</text>
					<text class="li_bot">等待声音训练</text>
				</view>
				<view class="step_line"></view>
				<view class="step_li">
					<text class="li_top li_end">4</text>
					<text class="li_bot">试听并使用</text>
				</view>
			</view>
		</view>
		
		<view class="video_cont">
			<view class="cont_title">上传音频</view>
			<view class="li_cont">
				<view class="li_voice">{{ voice_text }}</view>
				<view class="li_next">
					<view class="li_tip" @click="nextStep">
						<text>下一条</text>
						<text>({{ step_value }}/20)</text>
					</view>
				</view>
			</view>
			<view class="cont_tip">
				<text class="tip_li">操作提示:</text>
				<text class="tip_li">1.请按打开手机录音功能按照上述文本朗读并保存录音文件</text>
				<text class="tip_li">2.上传录音文件，上传成功后继续下一条录音，总共20段录音</text>
			</view>
			<view class="li_cont">
				<view class="cont_up" @click="saveVideo">
					<image class="li_img" :src="upImg" mode="aspectFit"></image>
					<text class="li_text">上传音频文件</text>
				</view>
			</view>
			
			<view class="voice_list" v-for="(item, index) in videoList" :key="index">
				<view class="list_li">
					<Audio :audio="getImgUrl(item.audio_record_url)" :title="(index+1)"></Audio>
					<!-- <view class="li_del">
						<text class="del_text">删除</text>
					</view> -->
				</view>
			</view>
		</view>
		
		<view class="video_cont">
			<view class="tip">
				<text class="tip_line"></text>
				<text class="tip_text">声音克隆须知</text>
				<text class="tip_line"></text>
			</view>
			
			<view class="slove" @click="toDetail">
				<text class="slove_text">声音克隆要求</text>
				<u-icon name="arrow-right" color="#000" size="18"></u-icon>
			</view>
		</view>
		
		
		<view class="bottom">
			<view class="bottom_left">
				<text class="left_text">￥</text>
				<text class="right_text">{{ pay_price }}</text>
				<text class="left_text">/次</text>
			</view>
			<view class="bottom_cont">
				<view class="bottom_buy" @click="wxPay">立即定制</view>
				<view class="bottom_desc">
					<text>定制即默认接受</text>
					<text style="color: #1F64FF;" @click="checkAgree">《声音克隆协议》</text>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import Audio from '../components/audio/audio.vue'
	import { wxpay, webpay, getProductList, getResult } from '@/apis/chat.js'
	import { getText, checkText, voiceDetail, changeAudio} from '@/apis/user.js'
	export default {
		data() {
			return {
				videoList: [],
				isClick: true,
				upImg: global.baseImg+'/'+'/xcx/com/message_center/share.png',
				voice_text: '',
				step_value: 1,
				videoText: [],
				info: '',
				pay_price: 0,
				productInfo: [],
				timer: 0
			}
		},
		components: {
	      Audio
		},
		onLoad(option) {
		   if(option.id) {
		   	   this.getDetail(option.id)
		   }
		   
		   let ua = navigator.userAgent.toLowerCase();
		   if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
				if (uni.getStorageSync('openid') == null || uni.getStorageSync('openid') == 'null'||uni.getStorageSync('openid') == '') {
					this.getCode()
				}
		   }
		},
		onShow() {
			this.getText()
			this.getProduct()
			let order_id = uni.getStorageSync('orderId')
			if(order_id != '') {
				this.timer = setInterval(() => {
					this.getPayResult(order_id)
				},2000)
			}
		},
		onHide() {
			clearInterval(this.timer);
		},
		onUnload() {
		    clearInterval(this.timer);
		},
		methods: {
			
			getDetail(id) {
			  let val = {
				  'id': id,
			  }
			  voiceDetail(val).then(res => {
				  if (res.code == 20000) {
					   this.info = res.data;
					   this.videoList = res.data.voice_info;
				  } else {
					  this.$api.msg(res.msg);
				  }
			  }).catch(err => {
				  this.$api.msg('获取失败');
			  })
			},
			
			// 获取商品列表
			getProduct() {
				let val = {
					'prod_cate_id': [7]
				}
				
				getProductList(val).then(res => {
					if (res.code == 20000) {
						this.productInfo = res.data[7][0];
						// console.log(this.productInfo,5562)
						this.pay_price = this.productInfo.prod_price;
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
			//获取朗读文字
			getText() {
			  getText().then(res => {
				  if (res.code == 20000) {
					   this.videoText = res.data;
					   
					   if(this.videoList.length > 0) {
						   this.step_value = res.data[this.videoList.length - 1].AudioId;
						   this.voice_text = res.data[this.videoList.length - 1].Text;
					   } else {
						   this.step_value = res.data[0].AudioId;
						   this.voice_text = res.data[0].Text;
					   }
				  } else {
					  this.$api.msg(res.msg);
				  }
			  }).catch(err => {
				  this.$api.msg('获取失败');
			  })
			},
			saveVideo() {
				let that = this;
				uni.chooseFile({
				  count: 1,
				  type: 'all',
				  extension:['.mp3','.wav','.m4a'],//此处限制文件类型
				  success (res) {
					// tempFilePath可以作为img标签的src属性显示图片
					// console.log(res,88888)
					const size = res.tempFiles[0].size;
					const imageName = res.tempFiles[0].name;
					
					if(size > 20971520) { // 音频文件最大只能上传20m
						that.$api.msg('该文件已超过20M，不能上传')
						return
					}
					
					const tempFilePaths = res.tempFilePaths[0];
					let headers = {
						'source': global.source,
					}
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					if (userInfo.token) headers.Authorization = userInfo.token;
					if (userInfo.role) headers.role = userInfo.role
					uni.uploadFile({
						// url: global.loginUrl + '/api/user/oss_upload', 
						url: global.baseUrl + '/api/sv_voice/audio_conversion',
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
								let url = imgData.data.oss_url
								let name = imgData.data.name
								let val = { audio_record_url: url, fileName: name }
								if(that.videoList == null) {
									that.videoList = []
								}
								that.videoList.push(val)
								that.checkText(url)
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
			
			//音频检测
			checkText(url) {
			  let text = {
				  audio_record_url: url,
				  audio_record_id: this.step_value
			  }
			  let arr = []
			  arr.push(text)
			  let val = {
				  voice_name: this.info.voice_name,
				  gender: this.info.gender,
				  voice_list: arr
			  }
			  checkText(val).then(res => {
				  if (res.code == 20000) {
					   this.$api.msg('检测成功')
				  } else {
					  this.$api.msg(res.msg);
					  this.videoList.splice(this.videoList.length - 1, 1)
				  }
			  }).catch(err => {
				  this.$api.msg('检测失败');
				  this.videoList.splice(this.videoList.length - 1, 1)
			  })
			},
			
			
			checkAgree() {
				uni.navigateTo({
					url: '/pages/agree/agree?agree_type=7',
				})
			},
			
			nextStep() {
				if(this.step_value == this.videoList.length) {
					this.voice_text = this.videoText[this.step_value].Text
					this.step_value += 1
				} else {
					let msg = '请上传第'+ this.step_value + '段音频'
					this.$api.msg(msg)
				}
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			toDetail() {
				uni.navigateTo({
					url: '/childCont/figure/pay_voice',
				})
			},
			
			//发起微信支付
			wxPay() {
				if(this.videoList.length < 20) {
					this.$api.msg('请上传20段完整录音')
					return
				}
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					"user_id": userInfo.user_id,
					"prod_id": this.productInfo.prod_id,
					"prod_cate_id": this.productInfo.prod_cate_id,
					"prod_name": this.productInfo.prod_name,
					"total_amount": this.productInfo.prod_price,
					"price": this.productInfo.prod_price,
					"model_name": this.info.voice_name,
					"live_code": this.info.voice_code,
					"quantity": 1
				}
				
				if (this.isClick == false) {
					return false
				}
				this.isClick = false;
				let that = this;
				// let oWindow = window.open('', '_blank');
				
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
							let url = encodeURIComponent(global.url + '/#/childCont/figure/video_list?order_id='+ order_id);
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
				let val = { 'order_id': order_id }
				getResult(val).then(res => {
					if (res.code == 20000) {
						if(res.data[0].status == 1) {
							this.$api.msg('支付成功');
							this.isClick = true;
							clearInterval(this.timer);
							uni.setStorageSync('orderId', '');
							// let info = JSON.stringify(res.data[0])
							uni.redirectTo({
								url: '/childCont/figure/pay_voice',
							})
						} else if(res.data[0].status == 2) {
							this.isClick = true;
							clearInterval(this.timer);
							this.$api.msg('已退款');
							uni.setStorageSync('orderId', '');
						} else if(res.data[0].status == 3) {
							this.isClick = true;
							clearInterval(this.timer);  
							this.$api.msg('支付失败');
							uni.setStorageSync('orderId', '');
						} else if(res.data[0].status == 4) {
							this.isClick = true;
							clearInterval(this.timer);  
							this.$api.msg('支付失败');
							uni.setStorageSync('orderId', '');
						} else {
							// clearInterval(this.timer);
							uni.setStorageSync('orderId', '');
						}
					} else {
						clearInterval(this.timer); 
						this.isClick = true;
						this.$api.msg(res.msg)
						uni.setStorageSync('orderId', '');
					}
				}).catch(err => {
					clearInterval(this.timer); 
					this.isClick = true;
					this.$api.msg('获取支付结果失败！')
					uni.setStorageSync('orderId', '');
				})
			},
			
			getCode() { // 非静默授权，第一次有弹框
				let local = global.url + '/#/childCont/figure/figure_oral' //当前页面的地址
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
	.containar {
		width: 100%;
	}
	
	.video_cont {
		width: 100%;
		background: #fff;
		padding: 40upx 30upx;
		flex: 1;
		margin-bottom: 20upx;
		.cont_title {
			color: #000;
			font-size: 32upx;
			font-style: normal;
			font-weight: 500;
			line-height: 150%;
			margin-bottom: 30upx;
			text-align: center;
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
		
		.slove {
			border-radius: 6upx;
			background: #F6F8FB;
			padding: 20upx 30upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			.slove_text {
				color: #2D2D2D;
				font-size: 24upx;
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
	}
	
	.step {
		width: 100%;
		padding: 40upx 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
		.step_li {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			width: 180upx;
			.li_top {
				width: 50upx;
				height: 50upx;
				border: 1upx solid #1F64FF;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 22upx;
				color: #1F64FF;
				border-radius: 50%;
			}
			.li_end {
				border: 1upx solid #D1D3D6;
				color: #D1D3D6;
			}
			.li_bot {
				color: #000;
				font-size: 22upx;
				font-style: normal;
				font-weight: 500;
				line-height: 40upx;
			}
			.li_text {
				color: #1F64FF;
			}
		}
		.step_line {
			border-top: 1upx dashed #D8D8D8;
			width: 30upx;
			// margin: 0 20upx;
			margin-bottom: 40upx;
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
	
	.li_cont {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		.li_voice {
			flex: 1;
			min-height: 150upx;
			border-radius: 10upx;
			border: 1upx solid #D1D3D6;
			padding: 15upx;
		}
		.li_next {
			background: #1F64FF;
			border-radius: 6upx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 10upx 25upx;
			margin-left: 20upx;
			.li_tip {
				font-style: normal;
				font-weight: 500;
				font-size: 26upx;
				line-height: 30upx;
				color: #FFFFFF;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
			}
		}
		
		.cont_up {
			border-radius: 8upx;
			border: 1upx solid #E6E6E6;
			background: #F6F8FB;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 50upx 0;
			margin-top: 20upx;
			.li_img {
				width: 45upx;
				height: 45upx;
			}
			.li_text {
				color: #000;
				font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%; 
				padding: 10upx 0;
			}
		}
	}
	.cont_tip {
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		flex-direction: column;
		.tip_li {
			color: #2d2d2d;
			font-size: 24upx;
			line-height: 52upx;
		}
	}
	
	.voice_list {
		width: 100%;
		.list_li {
			width: 100%;
			border-radius: 12upx;
			background: #FFF;
			margin: 20upx 0;
			padding: 20upx;
			border: 1upx solid #D1D3D6;
		}
	}
	
	.li_del {
		width: 100%;
		text-align: right;
		.del_text {
			color: #1F64FF;
			font-size: 24upx;
			line-height: 40upx;
			padding-top: 20upx;
		}
	}
	
</style>