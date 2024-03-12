<template>
	<view>
		<view class="head">
			<image class="head_img" :src="zsBack" mode="" v-if="memberInfo.d_level == 1"></image>
			<image class="head_img" :src="jpBack" mode="" v-if="memberInfo.d_level == 2"></image>
			<view class="head_cont">
				<image class="cont_img" :src="avatarUrl" mode=""></image>
				<view class="head_desc">
					<view class="nickname">
						<text class="nickname_l"
							:style="[{color:(memberInfo.d_level == 2 ? '#0A42BE':'')}]">{{ userInfo.nick_name }}</text>
						<image class="tip_img" :src="zsTip" mode="" v-if="memberInfo.d_level == 1"></image>
						<image class="tip_img" :src="jpTip" mode="" v-if="memberInfo.d_level == 2"></image>
					</view>
					<view class="desc" v-if="memberInfo.d_level == 1">升级金牌分销享受更多权益</view>
					<view class="desc" v-if="memberInfo.d_level == 2" style="color: #0A42BE">
						会员有效期:{{ memberInfo.expire_time.slice(0,10) }}</view>
				</view>
			</view>
		</view>

		<view class="container">
			<view class="container_item" v-for="(item, index) in productList" :key="index"
				@click="selctProduct(index,item)" :style="[{border:(active == index ? '1px solid #1F64FF':'none')}]">
				<view class="cont_time">{{ item.prod_desc.valid }}</view>
				<!-- <view style="height: 40upx;" v-if="index > 0"></view> -->
				<view class="cont_desc">{{ item.prod_name }}</view>
				<view class="cont_price">
					<text class="price_left">￥</text>
					<text class="price_right">{{ item.prod_price }}</text>
				</view>
				<!-- <view class="cont_original">原价: <text
						style="text-decoration: line-through;">{{ item.prod_origin_price }}元</text></view> -->
			</view>
		</view>

		<view class="cont_tip">
			<view class="tip_title">
				<text class="tip_l"></text>
				<text class="tip_r">升级分销&升级须知</text>
			</view>

			<view class="tip_text">分销服务为虚拟商品，支付成功后不支持退款。</view>
			<view class="tip_text">充值99元您将升级成为金牌分销，佣金15%提升到30%，享有更高佣金福利。</view>
			<view class="tip_text">想享有更高佣金，<text class="tip_link" @click="cooperate">点我</text>申请升级为服务商。</view>
		</view>

		<view class="bottom">
			<view class="bottom_cont">
				<view class="bottom_buy" @click="wxPay">立即购买</view>
				<view class="bottom_desc">
					<text>开通会员即默认接受</text>
					<text style="color: #1F64FF;" @click="checkAgree">《分销服务协议》</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getProductList,
		alipay,
		getResult,
		getUserInfo,
		wxpay,
		webpay
	} from '@/apis/chat.js'
	export default {
		data() {
			return {
				productList: [],
				memberInfo: '',
				productInfo: '',
				active: 0,
				isClick: true,
				timer: 0,
				avatarUrl: '',
				userInfo: JSON.parse(uni.getStorageSync('userInfo')),
				zsTip: global.baseImg + '/xcx/com/message_center/lan.png',
				jpTip: global.baseImg + '/xcx/com/message_center/jin.png',
				zsBack: global.baseImg + '/xcx/00931564-3ccb-481b-9d93-20d9f7a0101a.jpg',
				jpBack: global.baseImg + '/xcx/82f2189a-50cb-4830-b592-f17f3088d028.jpg',
			}
		},
		onLoad(query) {

			if (query.order_id) {
				this.getPayResult(query.order_id)
			}

			let ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				if (uni.getStorageSync('openid') == null || uni.getStorageSync('openid') == 'null' || uni.getStorageSync(
						'openid') == '') {
					this.getCode()
				}

			}
		},
		onShow() {
			this.memberInfo = JSON.parse(uni.getStorageSync('distributionInfo'));
			this.avatarUrl = global.baseImg + '/' + uni.getStorageSync("avatarUrl");

			// console.log( , 662)
			this.getProduct();
			clearInterval(this.timer);
		},
		onUnload() {
			console.log('隐藏了');
			clearInterval(this.timer);
		},
		methods: {
			// 获取商品列表
			getProduct() {
				// const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					'prod_cate_id': [4]
				}

				getProductList(val).then(res => {
					if (res.code == 20000) {
						if (res.data[4].length > 0) {
							this.productList = res.data[4];
							this.productInfo = res.data[4][0];
							// this.otherList = res.data[5];
							// this.otherList.forEach((ele)=>{
							// 	ele.count = 1
							// })
							// console.log(this.otherList,662)
						}
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
			//选择商品
			selctProduct(index, item) {
				this.active = index;
				this.productInfo = item
			},

			//发起微信支付
			wxPay() {
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					"user_id": this.userInfo.user_id,
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
				// let oWindow = window.open('', '_blank');
				let ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
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
									"appId": res.data[0].req_data.app_id, //公众号ID，由商户传入     
									"timeStamp": res.data[0].req_data.time_stamp, //时间戳，自1970年以来的秒数     
									"nonceStr": res.data[0].req_data.nonce_str, //随机串     
									"package": res.data[0].req_data.package,
									"signType": res.data[0].req_data.sign_type, //微信签名方式：     
									"paySign": res.data[0].req_data.pay_sign //微信签名 
								},
								function(res) {
									if (res.err_msg == "get_brand_wcpay_request:ok") {
										// 使用以上方式判断前端返回,微信团队郑重提示：
										//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
										//查询支付是否成功
										that.getPayResult(order_id)
										that.isClick = true
									} else if (res.err_msg == "get_brand_wcpay_request:fail") {
										console.log("支付失败")
										that.isClick = true
									} else {
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
						// console.log(res, 548)
						if (res.code == 20000) {
							// console.log(res, 336);
							// let data = res.data[0].req_data;
							let order_id = res.data[0].order_id;
							that.isClick = true;
							let url = encodeURIComponent(global.url + '/#/pages/distribution/grade?order_id=' +
								order_id);
							let href = res.data[0].req_data.mweb_url + '&redirect_url=' + url
							// oWindow.location = href;
							window.location.href = href;
							// this.timer = setInterval(() => {
							// 	that.getPayResult(order_id)
							// },2000)

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

			// 发起支付宝支付
			pay() {
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					"user_id": this.userInfo.user_id,
					"prod_id": this.productInfo.prod_id,
					"prod_cate_id": this.productInfo.prod_cate_id,
					"prod_name": this.productInfo.prod_name,
					"total_amount": this.productInfo.prod_price,
					"price": this.productInfo.prod_price,
					"method": 2,
					"quantity": 1
				}
				if (this.isClick == false) {
					return false
				}
				this.isClick = false;
				let that = this;
				let oWindow = window.open('', '_blank');
				alipay(val).then(res => {
					// console.log(res,548)
					if (res.code == 20000) {
						// console.log(res, 336);
						// let data = res.data[0].req_data;
						let order_id = res.data[0].order_id;
						that.isClick = true;

						// window.open(res.data[0].pay_url);
						oWindow.location = res.data[0].pay_url;
						// window.location.href = res.data[0].pay_url;
						this.timer = setInterval(() => {
							that.getPayResult(order_id)
						}, 2000)

					} else {
						console.log(res.msg, 663);
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
						if (res.data[0].status == 1) {
							this.$api.msg('支付成功');
							this.isClick = true;
							clearInterval(this.timer);
							let info = JSON.stringify(res.data[0])
							uni.redirectTo({
								url: '/pages/user/vip/pay_success?info=' + info,
							})
						} else if (res.data[0].status == 2) {
							this.isClick = true;
							clearInterval(this.timer);
							this.$api.msg('已退款');
						} else if (res.data[0].status == 3) {
							this.isClick = true;
							clearInterval(this.timer);
							this.$api.msg('支付失败');
						} else if (res.data[0].status == 4) {
							this.isClick = true;
							clearInterval(this.timer);
							this.$api.msg('支付失败');
						} else {
							// clearInterval(this.timer);
						}
					} else {
						clearInterval(this.timer);
						this.isClick = true;
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					clearInterval(this.timer);
					this.isClick = true;
					this.$api.msg('获取支付结果失败！')
				})
			},

			checkAgree() {
				uni.navigateTo({
					url: '/pages/agree/agree?agree_type=5',
				})
			},

			// 商务合作
			cooperate() {
				uni.navigateTo({
					url: '/pages/user/cooperate/cooperate',
				})
			},

			getCode() { // 非静默授权，第一次有弹框
				let local = global.url + '/#/pages/user/vip/vip' //当前页面的地址
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
					let val = {
						code: this.code
					}
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
				console.log(theRequest, '111')
				return theRequest
			},
		}
	}
</script>

<style lang="less" scoped>
	.head {
		width: 100%;
		height: 240upx;
		padding: 20upx 32upx;
		position: relative;
	}

	.head_img {
		width: 100%;
		height: 240upx;
	}

	.head_cont {
		width: 100%;
		display: flex;
		position: absolute;
		top: 88upx;
		margin-left: 40upx;
	}

	.cont_img {
		width: 104upx;
		height: 104upx;
		border-radius: 50%;
	}

	.nickname {
		margin-left: 20upx;
		margin-top: 10upx;
		display: flex;
		align-items: center;

		.nickname_l {
			font-style: normal;
			font-weight: 500;
			font-size: 36upx;
			line-height: 120%;
			color: #fff;
			max-width: 180upx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.tip_img {
			width: 120upx;
			height: 34upx;
			margin-left: 20upx;
		}
	}

	.desc {
		margin-left: 20upx;
		margin-top: 12upx;
		font-style: normal;
		font-weight: 400;
		font-size: 24upx;
		line-height: 120%;
		text-transform: uppercase;
		color: #fff;
	}

	.container {
		width: 100%;
		padding: 40upx 32upx;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 100upx;
	}

	.container_item {
		width: 30%;
		/* height: 240upx; */
		/* margin-left: 32upx; */
		background: #FFFFFF;
		border-radius: 8px;
		margin: 10upx 1.6%;
	}

	.cont_time {
		width: 140upx;
		height: 40upx;
		background: linear-gradient(180deg, #EE7863 0%, #EB504B 100%);
		border-radius: 8px 0px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 10px;
		line-height: 14px;
		color: #FFFFFF;
	}

	.cont_desc {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 32upx;
		line-height: 150%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #222;
		margin-top: 20upx;
	}

	.cont_price {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		padding: 30upx 0;
	}

	.price_left {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 600;
		font-size: 28upx;
		line-height: 38upx;
		color: #EB504B;
	}

	.price_right {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 600;
		font-size: 48upx;
		line-height: 48upx;
		color: #EB504B;
	}

	.cont_original {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 24upx;
		line-height: 150%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999;
		margin-bottom: 20upx;

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
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 24upx;
		line-height: 34upx;
		margin: 20upx auto 0;
		text-align: center;
	}

	.cont_tip {
		display: flex;
		flex-direction: column;
		padding: 0 32upx 230upx 32upx;

		.tip_title {
			display: flex;
			align-items: center;
			margin-bottom: 18upx;

			.tip_l {
				width: 6upx;
				height: 28upx;
				background: #1F64FF;
			}

			.tip_r {
				font-style: normal;
				font-weight: 400;
				font-size: 28upx;
				line-height: 42upx;
				color: #333;
				padding-left: 20upx;
			}
		}

		.tip_text {
			font-weight: 400;
			font-size: 26upx;
			line-height: 40upx;
			color: #888;
			padding: 0 0 15upx 15upx;

			.tip_link {
				color: #1F64FF;
				padding: 0 10upx;
			}
		}
	}
</style>