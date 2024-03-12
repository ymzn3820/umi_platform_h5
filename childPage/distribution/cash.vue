<template>
	<view class="container">
		<view class="back_img">
			<image class="tip_img" :src='upbackgroundImg' />
			<view class="back_cont">
				<view class="back_title">可提现金额<text style="font-size: 26upx; margin-left:10upx;">(元)</text> </view>
				<view class="back_cash">￥{{ cash_price }}</view>
			</view>
			
			<view class="bank_title">到账银行</view>
			<view class="lists" @click="bankShow=true">
				<!-- <image class="bank_img" src='@/static/user/share.png' /> -->
				<view class="txt" v-if="bankList.length > 0">{{ bankName }} ({{ card_num.slice(-4)}})</view>
				<view class="txt" v-else>选择银行卡</view>
				<image class="lists_img right_img" src='@/static/images/right.png' />
			</view>
			
			<view class="cash">
				<view class="cash_title">提现金额</view>
				<view class="cash_price">
					<text class="price_l">￥</text>
					<u-input :customStyle='{"background":"#fff","padding":"8px"}' fontSize="16" v-model="price" border="none"
						placeholder="请输入提现金额" type="number" @blur="priceChange"></u-input>
				</view>
				<view class="cash_tip">
					<view class="tip_l">
						<u-icon name="error-circle" color="#EC808D" size="14"></u-icon>
						<text class="tip_text">提现金额为100的倍数</text>
					</view>
					<view class="tip_r" @click="allPrice">全部提现</view>
				</view>
				<view style="font-size: 24rpx;font-weight: 600;margin-bottom: 20rpx;margin-top: 40rpx;">或者，您也可以选择将佣金兑换成通用算力</view>
				<view class="item_btn" @click="toExchange">兑换算力</view>
			</view>
		</view>
		
		<view class="footer" @click="submit">
			<button style="background-color: #1F64FF;color: #fff;" class="btn" size="default"
				type="default">立即提现</button>
		</view>
		
		<u-popup :show="bankShow" mode="bottom" :round="10" @close="bankShow=false">
			<view class="pop_cont">
				<view class="cont_top">
					<image class="close_img" src="@/static/user/close.png" @click="bankShow=false" />
					<view class="top_l">选择到账银行卡</view>
				</view>
				<view class="cont_mid" v-for="(item,index) in bankList" :key="index" @click="selectBank(item.card_code,item.bank,item.card_number,index)">
					<view class="mid_l">{{ item.bank }}  ({{ item.new_num }})</view>
					<image class="mid_img" src="@/static/user/done.png" v-if="selectDone == index" />
				</view>
				<view class="lists" style="padding-left: 0; border-bottom: 1upx solid rgba(0, 0, 0, 0.1);" @click="toBank">
					<image class="bank_img" :src="bankImg" />
					<view class="txt">使用新卡提现</view>
					<image class="lists_img right_img_bank" src='@/static/images/right.png' />
				</view>
		
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { getBank, applyCash} from '@/apis/user.js'

	export default {
		data() {
			return {
				isClick: true,
				price: '',
				cash_price: 0,
				bankShow: false,
				selectDone: 0,
				bankName: '',
				card_code: '',
				card_num: '',
				userInfo: JSON.parse(uni.getStorageSync('userInfo')),
				upbackgroundImg: global.baseImg+'/xcx/793a5158-3894-44df-be77-d637a76ae7b4.jpg',
				bankImg: global.baseImg+'/xcx/2656b6fd-e7dc-446e-ab30-9b26aef70571.jpg',
				bankList: []
			}
		},
		components: {
			
		},
		onLoad() {

		},
		onShow() {
			let info = JSON.parse(uni.getStorageSync('distributionInfo'));
			this.cash_price = info.withdraw_balance;
			this.getBankList()

		},
		methods: {
			// 获取银行卡列表
			getBankList() {
				getBank().then(res => {
					if (res.code == 20000) {
						this.bankList = res.data;
						this.selectDone = 0
						this.bankName = res.data[0].bank
						this.card_code = res.data[0].card_code
						this.card_num = res.data[0].card_number
						this.bankList.forEach((ele)=>{
							ele.new_num = ele.card_number.slice(-4)
						})
					} else {
						// this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})
			},
			// 选择银行
			selectBank(code, name, num, index) {
				this.selectDone = index;
				this.card_code = code;
				this.card_num = num;
				this.bankName = name;
				this.bankShow = false
			},
			//添加银行卡
			toBank() {
				uni.navigateTo({
					url: '/pages/distribution/bank',
				})
				this.bankShow = false;
			},
			//全部提现
			allPrice() {
				this.price = this.cash_price
			},
			priceChange() {
				if(this.price == 0) {
					return this.$api.msg('提现金额不能为零');
				}
				
				if(this.price > this.cash_price) {
					return this.$api.msg('提现金额不能大于可提现金额');
				}
				
				if(this.price%100 > 0) {
					return this.$api.msg('提现金额必须为100的倍数');
				}
			},
			//发起提现申请
			submit() {
				if(this.price == '') {
					return this.$api.msg('请填写提现金额');
				}
				
				if(this.price == 0) {
					return this.$api.msg('提现金额不能为零');
				}
				
				if(this.price > this.cash_price) {
					return this.$api.msg('提现金额不能大于可提现金额');
				}
				
				if(this.price%100 > 0) {
					return this.$api.msg('提现金额必须为100的倍数');
				}
				
				if(this.isClick == false) return;
				this.isClick = false;
				
				let val = {
					"withdrawal_amount": this.price,
					"card_code": this.card_code
				}
				
				applyCash(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('已发起申请，请等待后台审核')
						setTimeout(() => {
							this.isClick = true;
						    uni.redirectTo({
						    	url: '/pages/distribution/distribution',
						    })
						}, 1500);
					} else {
						this.$api.msg(res.msg);
						this.isClick = true;
					}
				}).catch(err => {
					this.isClick = true;
					this.$api.msg('提现失败');
				})
			},
			toExchange() {
				uni.navigateTo({
					url: '/childPage/distribution/Exchange',
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.container {
		padding: 30upx 24upx;
	}
	.back_img {
		width: 100%;
		position: relative;
		.tip_img {
			width: 100%;
			height: 240upx;
		}
		.back_cont {
			position: absolute;
			top: 0;
			left: 0;
			padding: 40upx 36upx;
			width: 100%;
			.back_title {
				font-weight: 500;
				font-size: 32upx;
				line-height: 50upx;
				color: #fff;
			}
			.back_cash {
				width: 100%;
				text-align: center;
				font-weight: 520;
				font-size: 60upx;
				line-height: 90upx;
				color: #fff;
				padding-top: 30upx;
			}
		}
	}
	
	.bank_title {
		font-weight: 400;
		font-size: 26upx;
		line-height: 32upx;
		color: #333;
		padding: 24upx 0 12upx 20upx;
	}
	
	.lists {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 30upx 20upx;
		background: #fff;
		border-radius: 8upx;
		margin-bottom: 25upx;
		.lists_img {
			width: 38upx;
			height: 38upx;
		}
		
		.txt {
			font-size: 30upx;
			margin-left: 20upx;
			flex: 1;
		}
		
		.bank_img {
			width: 42upx;
			height: 42upx;
		}
		
		.right_img {
			width: 24upx;
			height: 24upx;
			margin-right: 25upx;
		}
		.right_img_bank {
			width: 24upx;
			height: 24upx;
			margin-right: 30upx;
		}
	}
	
	.cash {
		display: flex;
		flex-direction: column;
		padding: 26upx;
		background: #fff;
		border-radius: 8upx;
		margin-bottom: 25upx;
		.cash_title {
			font-weight: 400;
			font-size: 32upx;
			line-height: 50upx;
			color: #333;
		}
		.cash_price {
			padding: 20upx;
			font-weight: 530;
			font-size: 40upx;
			line-height: 60upx;
			display: flex;
			align-items: center;
			.price_l {
				padding-right: 80upx;
			}
		}
		.cash_tip {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.tip_l {
				display: flex;
				.tip_text {
					font-weight: 400;
					font-size: 24upx;
					line-height: 30upx;
					color: #EC808D;
					margin-left: 8upx;
				}
			}
			.tip_r {
				font-weight: 400;
				font-size: 24upx;
				line-height: 30upx;
				color: #1F64FF;
			}
			
		}
	}
	
	.footer {
		position: fixed;
		left: 0;
		bottom: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		.btn {
			width: 80%;
			height: 75upx;
			line-height: 75upx;
		}
		
	}
	
	.pop_cont {
		padding: 30upx;
		.cont_top {
			display: flex;
			align-items: center;
			padding-bottom: 40upx;
			border-bottom: 1upx solid rgba(0, 0, 0, 0.1);
		}
		
		.top_l {
			flex: 1;
			font-weight: 500;
			font-size: 32upx;
			line-height: 150%;
			text-align: center;
			padding-left: 26upx;
		}
		
		.close_img {
			width: 26upx;
			height: 26upx;
		}
		
		.cont_mid {
			border-bottom: 1upx solid rgba(0, 0, 0, 0.1);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 30rpx 30rpx 62rpx;
		}
		
		.mid_l {
			font-style: normal;
			font-weight: 400;
			font-size: 32upx;
			/* line-height: 24px; */
		}
		
		.mid_img {
			width: 48upx;
			height: 48upx;
			padding-right: 10upx;
		}
	
	}
	.item_btn {
		font-size: 24upx;
		color: #fff;
		line-height: 30upx;
		padding: 15upx;
		background: #1f64ff;
		border-radius: 8upx;
		width: 24%;
		text-align: center;
		margin: 10upx 0;
	}
	
</style>