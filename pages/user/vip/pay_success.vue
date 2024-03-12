<template>
	<view>

		<!-- <view class="head">
			<image class="head_img" :src="vipBack" mode=""></image>
			<view class="head_cont">
				<view class="cont_top">
					<image class="cont_img" :src="vipLogo" mode=""></image>
					<text class="top_text">无忧秘书VIP</text>
				</view>
				<view class="head_desc">
					<view class="desc" v-if="memberInfo.member.status == false">暂未开通会员</view>
					<view class="desc" v-if="memberInfo.member.status == true" style="color: #7C432E">
						会员有效期:{{ memberInfo.member.data.expire_date.slice(0,10) }}</view>
				</view>
				<view class="head_desc" style="margin-top: 12rpx;">
					<text class="desc_left">3</text>
					<text class="desc_right">项专属权益</text>
				</view>
			</view>
		</view> -->
		
		<view class="head">
			<image class="head_img" :src="vipTop" mode="aspectFit"></image>
		</view>

		<view class="container">
			<!-- VIP会员 -->
			<view class="container_title" style="padding-top: 20upx;">算力优惠包</view>
			<!-- 选择会员套餐 -->
			<!-- <view class="container_title" v-if="select_type == 1">选择会员套餐</view>
			
			<view class="cont_slove" v-if="select_type == 1">
				<view class="slove">
					<image class="slove_img" :src="vipTip1" mode=""></image>
					<view class="slove_text">更快响应速度</view>
				</view>
				<view class="slove">
					<image class="slove_img" :src="vipTip2" mode=""></image>
					<view class="slove_text">优先使用新功能</view>
				</view>
				<view class="slove">
					<image class="slove_img" :src="vipTip3" mode=""></image>
					<view class="slove_text">可以多轮对话</view>
				</view>
			</view> -->
			<view class="container_cont" style="padding: 20upx 0;">
				<view class="container_item" v-for="(item, index) in productList" :key="index"
					@click="selctProduct(index,item, 1)" :style="[{border:(active === index ? '3rpx solid #1F64FF':'3rpx solid #E8EAEC')}]">
					<view class="cont_time" v-if="index == 0">性价比首选</view>
					<view class="cont_times" v-if="index != 0"></view>
					<view class="cont_desc">{{ item.prod_name }}</view>
					<view class="cont_price">
						<text class="price_left">￥</text>
						<text class="price_right">{{ item.prod_price }}</text>
					</view>
					<view class="cont_original">
						<text style="text-decoration: line-through; " v-if="item.prod_price != item.prod_origin_price">{{ item.prod_origin_price }}元</text>
						<text style="height: 36upx;" v-else></text>
					</view>
					<view class="text_slove_t">通用算力{{ item.universal_hashrate/10000 }}亿</view>
					<view class="text_slove_b">
						<text>对话算力{{ item.directed_hashrate/10000 }}亿</text>
						<image class="qs_img" :src='qsImg' @click.stop="dialogTip(item)" />
					</view>
					<view class="cont_cs" :style="[{background:(active === index ? '#1F64FF':'#E8EAEC')}]">
						{{ item.prod_desc.valid }}</view>
				</view>
			</view>

          <!--  <view class="product_rule" v-if="active == 0 && !isOne">
				<view class="rule_text">*年会员权益说明</view>
				<view class="rule_text">{{ ruleText }}</view>
			</view> -->

			<view class="bottom">
				<view class="bottom_left">
					<text class="left_text">￥</text>
					<text class="right_text">{{ pay_price }}</text>
				</view>
				<view class="bottom_cont">
					<view class="bottom_buy" @click="pay(1)">立即购买</view>
					<view class="bottom_desc">
						<text>开通会员即默认接受</text>
						<text style="color: #1F64FF;" @click="checkAgree">《商品服务协议》</text>
					</view>
				</view>
			</view>

			<!-- 流量通用包 -->
			<view class="container_title" style="margin-top: 30upx;">通用算力包</view>

			<view class="container_cont">
				<view class="container_item" style="height: 250upx;" v-for="(item, index) in currentList" :key="index"
					@click="selctProduct(index,item, 2)" :style="[{border:(active_all == index ? '3rpx solid #1F64FF':'3rpx solid #E8EAEC')}]">
					<!-- <view class="cont_time" v-if="index == 0">最多人购买</view> -->
					<view class="cont_time">{{ item.prod_desc.valid }}</view>
					<view class="cont_desc">{{ item.prod_name }}</view>
					<view class="cont_price" v-if="item.prod_id != '18'">
						<text class="price_left">￥</text>
						<text class="price_right">{{ item.prod_price }}</text>
					</view>
					<view class="cont_price" style="padding: 0 4rpx;margin:20rpx 15rpx; display: flex; align-items: center;justify-content: center;" v-if="item.prod_id == '18'">
						<!-- <input type="number" placeholder="请输入" v-model="price_zdy" style="border: 1rpx solid #BEBEBE; text-align: center;" /> -->
						<u--input
						    placeholder="金额"
						    border="surround"
						    v-model="price_zdy"
						    @change="changePrice"
						  ></u--input>
						<text style="font-size: 24upx;text-align: center; margin-left: 10upx;">元</text>
					</view>
					<view class="cont_original" v-if="item.prod_id != '18'">
						<text style="text-decoration: line-through;">{{ item.prod_origin_price }}元</text>
					</view>
					<view style="text-align: center;font-size: 24rpx;"  v-if="item.prod_id == '18'">包含{{ price_zdy*100 }} 万算力</view>
					<!-- <view class="cont_cs" :style="[{background:(active === index ? '#1F64FF':'#E8EAEC')}]">
						{{ item.prod_desc.valid }}</view> -->
				</view>
				<!-- 自定义流量包 -->
				<!-- <view class="container_item" style="border: 3rpx solid #E8EAEC;">
					<view></view>
					<view class="cont_desc">通用流量包</view>
					<view style="font-size: 24upx;color: #BEBEBE;text-align: center; ">自定义金额</view>
					<view class="cont_price" style="padding: 0 4rpx;margin:20rpx 15rpx;border-radius: 5%;">
						<input type="number" placeholder="请输入" style="border: 1rpx solid #BEBEBE; " />
						<text style="font-size: 24upx;text-align: center;">元</text>
					</view>
					<view style="text-align: center;font-size: 24rpx;">包含 万算力</view>
					<view class="cont_cs" style="margin-top: 16rpx;" :style="[{background:(active === index ? '#1F64FF':'#E8EAEC')}]">
						有效期365天</view>
				</view> -->
			</view>

			<!-- <view class="container_cont" v-if="select_type == 2">
				<view class="container_item" v-for="(item, index) in currentList" :key="index" @click="selctProduct(index,item)"
					:style="[{border:(active === index ? '3rpx solid #1F64FF':'3rpx solid #E8EAEC')}]">
					<view class="cont_time">{{ item.prod_desc.valid }}</view>
					<view class="cont_desc" style="margin-top: 30upx;">{{ item.prod_name }}</view>
					<view class="cont_price" style="margin-bottom: 30upx;">
						<text class="price_left">￥</text>
						<text class="price_right">{{ item.prod_price }}</text>
					</view>
				</view>
			</view> -->
		</view>

		<view class="bottom">
			<view class="bottom_left">
				<text class="left_text">￥</text>
				<text class="right_text">{{ pay_price_all }}</text>
			</view>
			<view class="bottom_cont">
				<view class="bottom_buy" @click="pay(2)">立即购买</view>
				<view class="bottom_desc">
					<text>开通会员即默认接受</text>
					<text style="color: #1F64FF;" @click="checkAgree">《商品服务协议》</text>
				</view>
			</view>
		</view>

		<!-- <view class="tabs">
			<view :class="select_type == 1 ? 'tabs_l_active' : 'tabs_l'" @click="selectType(1)">通用流量包</view>
			<view :class="select_type == 1 ? 'tabs_r' : 'tabs_r_active'" @click="selectType(2)">畅享流量包</view>
		</view> -->

		<!-- <view class="continue" v-show="select_type == 2">
			<view class="continun_cont">
				<view class="cont_title">
					<text class="title_l"></text>
					<text class="title_r">更多轻松畅享流量包</text>
				</view>
				<view class="cont_list">
					<view class="list" v-for="(item, index) in otherList" :key="index">
						<view class="list_title">
							<view class="list_l">
								<text class="text_l">{{ item.prod_name }}</text>
								<text class="text_r" v-if="item.prod_name == 'AI35' || item.prod_name == 'AI40'  || item.prod_name == '文心一言' || item.prod_name == '讯飞星火' || item.prod_name == 'ChatGLM' || item.prod_name == 'Claude'">用量: <text class="tip_text">{{ item.prod_desc.count*item.count }}万</text> token</text>
								<text class="text_r" v-else>用量: <text class="tip_text">{{ item.prod_desc.count*item.count }}</text>张</text>
							</view>
							<view class="cont_time">{{ item.prod_desc.valid }}</view>
						</view>
						<view class="list_pay">
							<view class="pay_price">
								<text class="price_l">￥</text>
								<text class="price_r">{{ item.prod_price*item.count }}</text>
							</view>
							<view class="pay_cont">
								<u-number-box button-size="30"
								color="#333"
								bgColor="#fff"
								iconStyle="color: #333" :min="1" :max="9999" :name="index" :integer="true" @blur="valChange" @change="valChange" :showMinus="item.count == 1 ? false : true">
								</u-number-box>
							</view>
						</view>
						<view class="btn">
							<view class="pay_btn" @click="payMode(item)">立即购买</view>
						</view>
						
					</view>
				</view>
			</view>
					
		</view>
		
		<view class="continue" v-show="select_type == 1">
			<view class="continun_cont">
				<view class="cont_title">
					<text class="title_l"></text>
					<text class="title_r">通用流量包</text>
					<image class="qs_img" :src='qsImg' @click="checkTip" />
				</view>
				<view class="cont_list">
					<view class="list" v-for="(item, index) in currentList" :key="index">
						<view class="list_title">
							<view class="list_l">
								<text class="text_l">{{ item.prod_name }}</text>
							</view>
							<view class="cont_time">{{ item.prod_desc.valid }}</view>
						</view>
						
						<view class="list_title" style="padding-top: 10upx;">
							<view class="list_l">
								<text class="text_c">{{ item.prod_details.value }}</text>
							</view>
						</view>
						
						<view class="list_title" style="padding-top: 10upx;">
							<view class="list_l">
								<text class="text_c">{{ item.prod_points*item.count }} 算力</text>
							</view>
						</view>
						<view class="list_pay_origin">
							<view class="pay_price">
								<text class="price_l">￥</text>
								<text class="price_r">{{ item.prod_price*item.count }}</text>
							</view>
							<view class="pay_origin" v-if="item.prod_price != 50">
								<text class="origin_r">原价：{{ item.prod_origin_price }}</text>
							</view>
							<view class="pay_origin" v-else></view>
							<view class="pay_cont">
								<u-number-box button-size="30"
								color="#333"
								bgColor="#fff"
								iconStyle="color: #333" :min="1" :max="9999" :name="index" :integer="true" @blur="valChange" @change="valChange" :showMinus="item.count == 1 ? false : true">
								</u-number-box>
							</view>
						</view>
						<view class="btn">
							<view class="pay_btn" @click="payMode(item)">立即购买</view>
						</view>
						
					</view>
					
					<view class="list" v-for="(item, index) in otherList" :key="index">
						<view class="list_title">
							<view class="list_l">
								<text class="text_l">{{ item.prod_name }}</text>
								<text class="text_r" 
								   v-if="item.prod_name == 'AI35' || item.prod_name == 'AI40'  || item.prod_name == '文心一言' || item.prod_name == '讯飞星火' || item.prod_name == 'ChatGLM' || item.prod_name == 'Claude' || item.prod_name == '通义千问' || item.prod_name == '商汤日日新'">
									用量: <text class="tip_text">{{ item.prod_desc.count*item.count }}万</text> token</text>
								<text class="text_r" v-else>用量: <text class="tip_text">{{ item.prod_desc.count*item.count }}</text>张</text>
							</view>
							<view class="cont_time">{{ item.prod_desc.valid }}</view>
						</view>
						<view class="list_pay">
							<view class="pay_price">
								<text class="price_l">￥</text>
								<text class="price_r">{{ item.prod_price*item.count }}</text>
							</view>
							<view class="pay_cont">
								<u-number-box button-size="30"
								color="#333"
								bgColor="#fff"
								iconStyle="color: #333" :min="1" :max="9999" :name="index" :integer="true" @blur="vipChange" @change="vipChange" :showMinus="item.count == 1 ? false : true">
								</u-number-box>
							</view>
						</view>
						<view class="btn">
							<view class="pay_btn" @click="payMode(item)">立即购买</view>
						</view>
						
					</view>
				</view>
			</view>
					
		</view>
		
		<view class="bottom">
			<view class="bottom_cont">
				<view class="bottom_desc">
					<text>开通会员即默认接受</text>
					<text style="color: #1F64FF;" @click="checkAgree">《会员服务协议》</text>
				</view>
			</view>
		</view> -->

		<u-modal :show="show" confirmText="确认" cancelText="取消" confirmColor="#1F64FF" :showCancelButton='true'
			@confirm="submitPay" @cancel="show = false" @close="show = false">
			<view class="modal_pay">
				是否办理流量包
			</view>
		</u-modal>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="input" message="成功消息" :duration="2000" :before-close="true" @close="close"
				@confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getProductList,
		wxpay,
		getResult,
		getUserInfo
	} from '@/apis/chat.js'
	export default {
		data() {
			return {
				productList: [], // 会员卡
				otherList: [], //流量包
				currentList: [], //通用流量包
				memberInfo: {
					member: {
						status: false
					}
				},
				productInfo: '',
				otherInfo: '',
				active: 0,
				payNum: 1,
				show: false,
				isClick: true,
				select_type: 1,
				avatar_url: '',
				pay_price: 0,
				isOne: false,
				active_all: 0,
				pay_price_all: 0,
				ruleText: '',
				price_zdy: 1, //自定义金额

				qsImg: global.baseImg + '/xcx/07751606-3161-48d2-a540-a86ed2e1f2ce.jpg',
				vipImg: global.baseImg + '/xcx/357a110c-0255-4ac4-819a-84f5f0529986.jpg',
				vipImg1: global.baseImg + '/xcx/b1c23d0e-07cf-419d-ae66-26e2f5b3669c.jpg',

				vipBack: global.baseImg + '/xcx/473ece7a-3324-4147-a28a-6c355bfd3633.jpg',
				vipTop: global.baseImg + '/xcx/com/message_center/member00.png',
				vipLogo: global.baseImg + '/xcx/b4d4d4bd-2e8a-4dce-84bf-eca60642c249.jpg',
				vipTip1: global.baseImg + '/xcx/8d90f682-e32e-4e26-b46d-6f5d9121ebcb.jpg',
				vipTip2: global.baseImg + '/xcx/2acc6a4c-173a-4943-b180-ddfcb6803578.jpg',
				vipTip3: global.baseImg + '/xcx/8c2472c6-245f-4c34-8007-d02c04c53b47.jpg',
			}
		},
		onShow() {
			if (uni.getStorageSync('memberInfo') == null || uni.getStorageSync('memberInfo') == '' || uni.getStorageSync(
					'memberInfo') == 'null') {
				getUserInfo().then(res => {
					if (res.code == 20000) {
						// console.log(res.data, 320)
						this.memberInfo = res.data;
						uni.setStorageSync('memberInfo', JSON.stringify(res.data));
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取信息失败！')
				})
			} else {
				this.memberInfo = JSON.parse(uni.getStorageSync('memberInfo'));
			}
			
			// console.log('跳转');
			console.log(this.memberInfo,665)
			// console.log( , 662)
			let avatar = uni.getStorageSync("avatarUrl");
			this.avatar_url = global.baseImg + '/' + avatar;
			this.select_type = 1
			this.active = 0;
			this.getProduct();
			// this.getCurrentProduct()
		},
		onHide() {
			// console.log('页面隐藏了')	
		},
		methods: {
			// 获取会员商品列表
			getProduct() {
				// const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					'prod_cate_id': [3,6]
				}

				getProductList(val).then(res => {

					if (res.code == 20000) {
						this.productList = res.data[3];
						this.productInfo = res.data[3][0];
						this.pay_price = this.productInfo.prod_price;
						this.ruleText = this.productInfo.prod_rules;
						// this.otherList = res.data[5];
						this.currentList = res.data[6];
						this.currentInfo = res.data[6][0];
						this.pay_price_all = this.currentInfo.prod_price
						
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},

			selctProduct(index, item, tip) {
				
				if (tip == 1) {
					this.productInfo = item
					this.active = index;
					this.pay_price = item.prod_price;
				} else {
					this.currentInfo = item
					this.active_all = index;
					this.pay_price_all = item.prod_price;
				}
			},
			
			dialogTip(item) {
			    let content = item.prod_rules;
			    uni.showModal({
			    	title: '权益说明',
			    	content: content,
			    
			    })	
			},

			selectVip(index) {
				this.select_type = index
				this.active = 0

				if (index == 1) {
					this.productInfo = this.productList[0]
					this.pay_price = this.productList[0].prod_price;
				} else {
					this.otherInfo = this.currentList[0]
					this.pay_price = this.currentList[0].prod_price;
				}
			},

			//切换流量包类型
			selectType(val) {
				this.select_type = val
			},

			getCurrentProduct() {
				// const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					'prod_cate_id': [6]
				}

				getProductList(val).then(res => {
					if (res.code == 20000) {

						this.currentList = res.data[6];
						this.currentList.forEach((val) => {
							val.count = 1
						})
						console.log(this.currentList, 663)
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},


			//修改数量
			valChange(e) {
				// console.log('当前值为: ' + e.value)
				// console.log('当前值为1: ' + e.name)
				if (e.value == '') {
					e.value = 1
				}

				let index = e.name;
				this.currentList[index].count = e.value;
				// if(this.select_type == 2) {
				// 	this.otherList[index].count = e.value;
				// } else {
				// 	this.currentList[index].count = e.value;
				// }

				this.$forceUpdate()
			},

			vipChange(e) {
				console.log('当前值为: ' + e.value)
				// console.log('当前值为1: ' + e.name)
				if (e.value == '') {
					e.value = 1
				}
				let index = e.name;
				this.otherList[index].count = e.value;
				// if(this.select_type == 2) {
				// 	this.otherList[index].count = e.value;
				// } else {
				// 	this.currentList[index].count = e.value;
				// }

				this.$forceUpdate()
			},
			// 发起微信支付
			pay(tip) {
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				const openid = uni.getStorageSync('openid')
				let val = '';
				if (tip == 1) {
					val = {
						"user_id": this.memberInfo.user_id,
						"prod_id": this.productInfo.prod_id,
						"prod_cate_id": this.productInfo.prod_cate_id,
						"prod_name": this.productInfo.prod_name,
						"total_amount": this.productInfo.prod_price,
						"price": this.productInfo.prod_price,
						"open_id": openid,
						"quantity": 1
					}
				} else {
					val = {
						"user_id": this.memberInfo.user_id,
						"prod_id": this.currentInfo.prod_id,
						"prod_cate_id": this.currentInfo.prod_cate_id,
						"prod_name": this.currentInfo.prod_name,
						"total_amount": (this.currentInfo.prod_price * this.price_zdy).toFixed(2),
						"price": this.currentInfo.prod_price,
						"open_id": openid,
						"quantity": this.price_zdy
					}
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
						
						this.price_zdy = 1;
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

			//发起流量包支付
			payMode(item) {
				this.show = true
				this.otherInfo = item
			},
			submitPay() {
				// console.log(this.otherInfo,665)
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				const openid = uni.getStorageSync('openid')
				// console.log(userInfo,458)
				let val = {
					"user_id": userInfo.user_id,
					"prod_id": this.otherInfo.prod_id,
					"prod_cate_id": this.otherInfo.prod_cate_id,
					"prod_name": this.otherInfo.prod_name,
					"total_amount": (this.otherInfo.prod_price * this.otherInfo.count).toFixed(2),
					"price": this.otherInfo.prod_price,
					// "total_amount": 0.01,
					// "price": 0.01,
					"open_id": openid,
					"quantity": this.otherInfo.count
				}
				if (this.isClick == false) {
					return false
				}
				this.isClick = false;
				let that = this;
				wxpay(val).then(res => {
					if (res.code == 20000) {
						// console.log(res, 336);
						let data = res.data[0].req_data;
						let order_id = res.data[0].order_id;
						// that.isClick = true;
						// this.otherInfo = '';
						this.show = false;

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
						this.$api.msg('支付成功');
						this.isClick = true;
						console.log(res, 777);
						let info = JSON.stringify(res.data[0])
						uni.redirectTo({
							url: '/pages/user/vip/pay_success?info=' + info,
						})
					} else {
						this.isClick = true;
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.isClick = true;
					this.$api.msg('获取支付结果失败！')
				})
			},

			checkAgree() {
				uni.navigateTo({
					url: '/pages/agree/agree?agree_type=2',
				})
			},
			changePrice(e) {
				// console.log('change', e);
				this.pay_price_all = e
			},

			// 查看提示
			checkTip() {
				let content = '购买通用包(流量包）价格转换为算力使用 (1元=50算力)\n\n' +
					'AI对话\n\n' +
					'Al35: 1k token消耗4算力\n Al40: 1k token消耗4算力\n文心一言: 1k token消耗4算力\n 讯飞星火: 1k token消耗4算力\n\n' +
					'AI绘画\n\n' +
					'DALL·E2: 每张图消耗35算力\n 百度绘画: 每张图消耗50算力\n Midjourney: 每张图消耗35算力'

				uni.showModal({
					title: '通用包(流量包)使用价格说明',
					content: content,
					confirmText: "知道了",
					showCancel: false,
				});
			}
		}
	}
</script>
<style>
	page {
		background: #fff;
	}
</style>
<style lang="less" scoped>
	.head {
		width: 100%;
		// height: 260upx;
		// padding: 20upx 24upx;
		// position: relative;
	}

	.head_img {
		width: 100%;
		height: 210upx;
	}

	.head_cont {
		width: 100%;
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 80upx;
		left: 80upx;

		.cont_top {
			display: flex;
			align-items: flex-end;

			.cont_img {
				width: 40upx;
				height: 34upx;
			}

			.top_text {
				color: #966B3C;
				font-size: 40upx;
				font-style: normal;
				font-weight: 500;
				line-height: 40upx;
				padding-left: 10upx;
			}
		}

		.head_desc {
			padding-left: 50upx;
			display: flex;
			align-items: flex-end;

			.desc {
				color: #B1966C;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 50upx;
			}

			.desc_left {
				color: #EE814A;
				font-family: DIN Alternate;
				font-size: 60upx;
				font-style: normal;
				font-weight: 700;
				line-height: 60upx;
			}

			.desc_right {
				color: #9A7143;
				font-size: 30upx;
				font-style: normal;
				font-weight: 500;
			}
		}
	}



	.container {
		padding: 0upx 24upx 40upx 24upx;
		/* padding-bottom: 230upx; */
		white-space: nowrap;
		width: calc(100% -48upx);
		display: flex;
		flex-direction: column;
		background: #fff;

		.container_title {
			color: #000;
			font-size: 28upx;
			font-style: normal;
			font-weight: 530;
			line-height: 150%;
		    
		}
	}

	.container_cont {
		width: 100%;
		display: flex;
		flex-wrap: wrap;

		.container_item {
			width: 28%;
			height: 293upx;
			display: inline-block;
			background: #FFFFFF;
			border-radius: 8px;
			margin: 10upx 1.5%;

		}

		.cont_time {
			width: 140upx;
			height: 40upx;
			// background: linear-gradient(180deg, #EE7863 0%, #EB504B 100%);
			background: var(--unnamed, linear-gradient(135deg, #80A7FF 0%, #4D83FF 100%));
			border-radius: 8px 0px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-style: normal;
			font-weight: 500;
			font-size: 20upx;
			line-height: 28upx;
			color: #FFFFFF;
		}
		
		.cont_times {
			width: 140upx;
			height: 40upx;
		}

		.cont_desc {
			font-style: normal;
			font-weight: 550;
			font-size: 32upx;
			line-height: 48upx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #222;
			padding-top: 10upx;
		}

		.cont_price {
			display: flex;
			justify-content: center;
			align-items: flex-end;
			padding: 10upx 0;
		}

		.price_left {
			font-style: normal;
			font-weight: 600;
			font-size: 26upx;
			line-height: 38upx;
			color: #EB504B;
		}

		.price_right {
			font-style: normal;
			font-weight: 600;
			font-size: 38upx;
			// line-height: 38upx;
			color: #EB504B;
		}

		.cont_original {
			font-style: normal;
			font-weight: 400;
			font-size: 24upx;
			line-height: 36upx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #999;
			margin-bottom: 5upx;

		}

		.cont_cs {
			font-style: normal;
			font-weight: 400;
			font-size: 24upx;
			line-height: 36upx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			background: #1F64FF;
			border-radius: 0 0 8px 8px;
		}

	}

	.bottom {
		width: 100%;
		background: #ffffff;
		display: flex;

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



	.continue {
		padding: 24upx;
	}

	.continun_cont {
		background: #fff;
		border-radius: 18upx;
		padding: 20upx;

		.cont_title {
			display: flex;
			align-items: center;

			.title_l {
				width: 20px;
				height: 4px;
				background: #1F64FF;
				border-radius: 10px;
				transform: rotate(-90deg);
			}

			.title-r {
				font-weight: 550;
				font-size: 26upx;
				line-height: 150%;
				color: #333;
			}

			.qs_img {
				width: 40upx;
				height: 40upx;
				margin-left: 20upx;
			}
		}
	}

	.cont_list {
		margin-top: 10upx;
	}

	.list {
		background: #F6F8FB;
		border-radius: 15upx;
		padding: 0upx 0upx 16upx 28upx;
		margin-top: 15upx;

		.list_title {
			padding: 0upx 0;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;

			.text_l {
				font-style: normal;
				font-weight: 550;
				font-size: 26upx;
				line-height: 150%;
				color: #333;
			}

			.text_r {
				font-style: normal;
				font-weight: 500;
				font-size: 26upx;
				line-height: 150%;
				color: #999;
				padding-left: 18upx;

				.tip_text {
					padding: 10upx 20upx;
					background: #fff;
					color: #333;
					margin: 0 10upx;
				}
			}

			.text_c {
				font-style: normal;
				font-weight: 500;
				font-size: 26upx;
				line-height: 150%;
				color: #999;
			}
		}

		.cont_time {
			width: 150upx;
			height: 50upx;
			// background: linear-gradient(180deg, #EE7863 0%, #EB504B 100%);
			background: var(--unnamed, linear-gradient(135deg, #80A7FF 0%, #4D83FF 100%));
			border-radius: 0px 8px;
			display: flex;
			justify-content: center;
			align-items: center;
			/* font-family: 'PingFang SC'; */
			font-style: normal;
			font-weight: 500;
			font-size: 10px;
			line-height: 14px;
			color: #FFFFFF;
		}

		.list_pay {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 25upx 28upx 25upx 0;

			.pay_price {
				.price_l {
					font-weight: 550;
					font-size: 24upx;
					line-height: 24upx;
					color: #F30C07;
				}

				.price_r {
					font-weight: 550;
					font-size: 30upx;
					line-height: 30upx;
					color: #F30C07;
				}
			}

			.pay_cont {
				// flex: 1;
				// padding-left: 24upx;
			}
		}

		.list_pay_origin {
			display: flex;
			align-items: center;
			padding: 25upx 28upx 25upx 0;

			.pay_price {
				.price_l {
					font-weight: 550;
					font-size: 24upx;
					line-height: 24upx;
					color: #F30C07;
				}

				.price_r {
					font-weight: 550;
					font-size: 30upx;
					line-height: 30upx;
					color: #F30C07;
				}
			}

			.pay_origin {
				flex: 1;
				padding-left: 24upx;
				font-weight: 500;
				font-size: 26upx;
				line-height: 30upx;
				color: #999;
				text-decoration: line-through;
			}
		}

		.btn {
			padding-right: 28upx;

			.pay_btn {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #1F64FF;
				box-shadow: 0px 8upx 36upx rgba(0, 0, 0, 0.05);
				border-radius: 8upx;
				font-weight: 500;
				font-size: 26upx;
				line-height: 40upx;
				color: #F6F8FB;
				padding: 20upx 35upx;
			}
		}

	}

	.modal_pay {
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 500;
		font-size: 32upx;
		line-height: 48upx;
		color: #353535;
	}

	.tabs {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30upx 0 10upx 0;

		.tabs_l {
			color: #1F64FF;
			font-size: 26upx;
			line-height: 40upx;
			background: #fff;
			border-top: 1upx solid #1F64FF;
			border-left: 1upx solid #1F64FF;
			border-bottom: 1upx solid #1F64FF;
			padding: 20upx 70upx;
			border-radius: 4px 0px 0px 4px;
		}

		.tabs_l_active {
			color: #fff;
			font-size: 26upx;
			line-height: 40upx;
			background: #1F64FF;
			border-top: 1upx solid #1F64FF;
			border-left: 1upx solid #1F64FF;
			border-bottom: 1upx solid #1F64FF;
			padding: 20upx 70upx;
			border-radius: 4px 0px 0px 4px;
		}

		.tabs_r {
			color: #1F64FF;
			font-size: 26upx;
			line-height: 40upx;
			background: #fff;
			border-top: 1upx solid #1F64FF;
			border-right: 1upx solid #1F64FF;
			border-bottom: 1upx solid #1F64FF;
			padding: 20upx 70upx;
			border-radius: 0px 4px 4px 0px;
		}

		.tabs_r_active {
			color: #fff;
			font-size: 26upx;
			line-height: 40upx;
			background: #1F64FF;
			border-top: 1upx solid #1F64FF;
			border-right: 1upx solid #1F64FF;
			border-bottom: 1upx solid #1F64FF;
			padding: 20upx 70upx;
			border-radius: 0px 4px 4px 0px;
		}
	}

	.cont_slove {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-bottom: 30upx;

		.slove {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.slove_img {
				width: 80upx;
				height: 80upx;
				margin: 15upx 0;
			}

			.slove_text {
				color: #34373D;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				// padding-top: 20upx;
			}
		}
	}


	.type_l {
		border-radius: 8upx;
		background: #E8EAEC;
		padding: 10upx 20upx;
		color: #6B6B6B;
		font-size: 24upx;
		font-weight: 400;
	}

	.type_l_active {
		border-radius: 8upx;
		background: #E5EDFF;
		padding: 10upx 20upx;
		color: #1F64FF;
		font-size: 24upx;
		font-weight: 400;
	}
	
	.product_rule {
		display: flex;
		flex-direction: column;
		padding: 10upx;
		width: 100%;
		.rule_text {
			font-size: 28upx;
			line-height: 40upx;
			color: #333;
			// word-break:break-all;
			white-space: normal;
		}
	}
	.text_slove_t {
		font-size: 20upx;
		color: #333;
		line-height: 30upx;
		text-align: center;
	}
	
	.text_slove_b {
		font-size: 20upx;
		color: #999;
		line-height: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		.qs_img {
			width: 30upx;
			height: 30upx;
			margin-left: 10upx;
		}
	}
</style>