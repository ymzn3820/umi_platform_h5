<template>
	<view>
		<view class="container">
			<view class="cont">
				<view class="cont_top">
					<text class="order_sn">模特名称：</text>
					<text class="order_sn">{{ info.live_name }}</text>
				</view>
				
				<view class="cont_top">
					<text class="order_price">商品价格：</text>
					<text class="order_price">￥1999</text>
				</view>
				
				<!-- <view class="cont_top">
					<text class="order_price">定制时间：</text>
					<text class="order_sn">{{ info.created_at }}</text>
				</view> -->
			</view>
		</view>
		
		<view class="bottom" v-if="info.make_status == 1">
			<view class="bottom_left">
				<text class="left_text">￥</text>
				<text class="right_text">{{ pay_price }}</text>
			</view>
			<view class="bottom_cont">
				<view class="bottom_buy" @click="wxPay">立即定制</view>
				<view class="bottom_desc">
					<text>定制即默认接受</text>
					<text style="color: #1F64FF;" @click="checkAgree">《定制数字人协议》</text>
				</view>
			</view>
		</view>
		
	</view>
</template>


<script>
	import { wxpay, webpay, getProductList, getResult } from '@/apis/chat.js'
	import { getFigureDetail } from '@/apis/user.js'
	export default {
		data() {
			return {
				info: '',
				isClick: true,
				live_code: '',
				pay_price: 0,
				productInfo: [],
				timer: 0
			}
		},
		components: {
			
		},
		onLoad(option) {
			if(option.live_code) {
				this.live_code = option.live_code
			}
			
			// if(option.order_id) {
			// 	console.log(option.order_id,9956)
			// 	this.timer = setInterval(() => {
			// 		this.getPayResult(option.order_id)
			// 	},2000)
			// }
			
			let ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
				if (uni.getStorageSync('openid') == null || uni.getStorageSync('openid') == 'null'||uni.getStorageSync('openid') == '') {
				    this.getCode()
				}
				
			}
			
		},
		onShow() {
			this.getList();
			this.getProduct()
			let order_id = uni.getStorageSync('orderId')
			if(order_id != '') {
				this.timer = setInterval(() => {
					this.getPayResult(order_id)
				},2000)
			}
		},
		onUnload() {
            clearInterval(this.timer);
		},
		methods: {
			getList() {
			  let val = {
				  'live_code': this.live_code,
			  }
			  getFigureDetail(val).then(res => {
				  if (res.code == 20000) {
					   this.info = res.data;
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
			
			//发起微信支付
			wxPay() {
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					"user_id": userInfo.user_id,
					"prod_id": this.productInfo.prod_id,
					"prod_cate_id": this.productInfo.prod_cate_id,
					"prod_name": this.productInfo.prod_name,
					"total_amount": this.productInfo.prod_price,
					"price": this.productInfo.prod_price,
					"model_name": this.info.live_name,
					"live_code": this.info.live_code,
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
							that.isClick = true;
							uni.setStorageSync('orderId', order_id);
							
							let url = encodeURIComponent(global.url + '/#/childCont/figure/video_detail?order_id='+ order_id);
							let href = res.data[0].req_data.mweb_url +'&redirect_url=' + url

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
							// let info = JSON.stringify(res.data[0])
							uni.setStorageSync('orderId', '');
							uni.redirectTo({
								url: '/childCont/figure/pay_video',
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
			
			// paySuccess() {
			// 	uni.navigateTo({
			// 		url: '/childCont/figure/pay_success',
			// 	})
			// }
			
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #f6f8fb;
	}
	.container {
		padding: 20upx 24upx;
	}
	.cont {
		padding: 12upx 36upx;
		background: #FFFFFF;
		border-radius: 16px;
	}
	.cont_top {
		padding: 20upx 0;
	}
	.order_sn {
		font-style: normal;
		font-weight: 400;
		font-size: 28upx;
		line-height: 40upx;
		color: #333;
	}
	.order_price {
		font-style: normal;
		font-weight: 400;
		font-size: 28upx;
		line-height: 40upx;
		color: #6E7480;
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
	
</style>