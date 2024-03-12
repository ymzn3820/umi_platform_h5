<template>
	<view class="container">
		<view class="cont">
			<view class="cont_top">
				<text class="order_sn">订&nbsp;单&nbsp;号：</text>
				<text class="order_sn">{{ orderInfo.order_id }}</text>
			</view>
			
			<view class="cont_top">
				<text class="order_price">商品总额：</text>
				<text class="order_price">￥{{ orderInfo.total_amount  }}</text>
			</view>
			
			<view class="cont_top">
				<text class="order_price">商品单价：</text>
				<text class="order_price">￥{{ orderInfo.prod_price  }}</text>
			</view>
			
			<view class="cont_top">
				<text class="order_price">商品数量：</text>
				<text class="order_price">{{ orderInfo.quantity  }}</text>
			</view>
			
			<view class="cont_top">
				<text class="order_price">套&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;餐：</text>
				<text class="order_price">{{ orderInfo.prod_name }}</text>
				<text class="order_price" v-if="orderInfo.prod_cate_id == 5">(流量包)</text>
			</view>
			
			<view class="cont_top">
				<text class="order_price">购买日期：</text>
				<text class="order_sn">{{ orderInfo.created_at }}</text>
			</view>
			
			<view class="cont_top" v-if="orderInfo.expire_at != ''">
				<text class="order_price">有&nbsp;效&nbsp;期：</text>
				<text class="order_price">{{ orderInfo.expire_at }}</text>
			</view>
		</view>
		
		<view class="bottom" v-if="orderInfo.status == 1">
			<view class="bottom_cont">
				<view class="bottom_buy" @click="pay">待付款</view>
			</view>
		</view>
		
	</view>
</template>


<script>
	import {
		wxpay,
		getResult,
		againPay
	} from '@/apis/chat.js'
	import { orderList } from '@/apis/user.js'
	export default {
		data() {
			return {
				orderInfo: '',
				isClick: true,
				timer: 0
			}
		},
		components: {
			
		},
		onLoad(option) {
			// this.orderInfo = JSON.parse(option.info) 
			this.order_id = option.order_id
			// console.log(this.orderInfo,56)
		},
		onShow() {
	        // this.userInfo = JSON.parse(uni.getStorageSync('memberInfo'));
			// console.log(this.userInfo,4589)
			this.getOrderList();
		},
		onUnload() {
			console.log('隐藏了');
			clearInterval(this.timer);
		},
		methods: {
			getOrderList() {
			  let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			  let val = {
				  'user_id': userInfo.user_id,
				  'order_id': this.order_id,
				  'prod_cate_id': '[3]'
			  }
			  orderList(val).then(res => {
				  if (res.code == 20000) {
					   this.orderInfo = res.data[0];
				  } else {
					  this.$api.msg(res.msg);
				  }
			  }).catch(err => {
				  this.$api.msg('获取订单信息失败');
			  })
			},
			
			pay() {
				// console.log(this.userInfo,4856)
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let ua = navigator.userAgent.toLowerCase();
				if(this.orderInfo.source != 'h5' && this.orderInfo.source != 'umi_h5') {
					uni.showModal({
						title: '提示',
						content: '当前不支持此订单支付，请前往订单来源处进行支付',
						confirmText: "知道了",
						showCancel: false,
					});
					return
				}
				if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
					if(this.orderInfo.source == 'h5') {
						uni.showModal({
							title: '提示',
							content: '当前不支持此订单支付，请前往网页端打开支付',
							confirmText: "知道了",
							showCancel: false,
						});
						return
					}
					
				} else {
					if(this.orderInfo.source == 'umi_h5') {
						uni.showModal({
							title: '提示',
							content: '当前不支持此订单支付，请前往公众号打开支付',
							confirmText: "知道了",
							showCancel: false,
						});
						return
					}
				}
				
				let val = {
					"order_id": this.orderInfo.order_id,
					"user_id": userInfo.user_id
				}
				if (this.isClick == false) {
					return false
				}
				this.isClick = false;
				let that = this;
				againPay(val).then(res => {
					// console.log(JSON.parse(res.data[0].pay_data),7789)
					if (res.code == 20000) {
						that.isClick = true;
						if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
							let req_data = JSON.parse(res.data[0].pay_data)
							WeixinJSBridge.invoke(
							  'getBrandWCPayRequest', {
								 "appId": req_data.app_id,     //公众号ID，由商户传入     
								 "timeStamp": req_data.time_stamp, //时间戳，自1970年以来的秒数     
								 "nonceStr": req_data.nonce_str, //随机串     
								 "package": req_data.package,     
								 "signType": req_data.sign_type,  //微信签名方式：     
								 "paySign": req_data.pay_sign //微信签名 
							  },
							  function(res){
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
							let oWindow = window.open('', '_blank');
							let order_id = res.data[0].order_id;
							oWindow.location = res.data[0].pay_data;
							this.timer = setInterval(() => {
								that.getPayResult(order_id)
							},2000)
						}
						
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
				let val = { 'order_id': order_id }
				getResult(val).then(res => {
					if (res.code == 20000) {
						if(res.data[0].status == 1) {
							this.$api.msg('支付成功');
							this.isClick = true;
							clearInterval(this.timer);
							let info = JSON.stringify(res.data[0])
							uni.redirectTo({
								url: '/pages/user/vip/pay_success?info='+ info,
							})
						} else if(res.data[0].status == 2) {
							this.isClick = true;
							clearInterval(this.timer);
							this.$api.msg('已退款');
						} else if(res.data[0].status == 3) {
							this.isClick = true;
							clearInterval(this.timer);  
							this.$api.msg('支付失败');
						} else if(res.data[0].status == 4) {
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
		}
	}
</script>

<style scoped>
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
		width: calc(100% - 48upx);
		position: fixed;
		bottom: 100upx;
	}
	
	.bottom_cont {
		width: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
	
	.bottom_buy {
		width: 100%;
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
		margin: auto;
	}
	
</style>