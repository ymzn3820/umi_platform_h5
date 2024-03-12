<template>
	<view class="container">
		<view class="back_img">
			<image class="tip_img" :src='upbackgroundImg' />
			<view class="back_cont">
				<view class="back_title">可提现金额<text style="font-size: 26upx; margin-left:10upx;">(元)</text> </view>
				<view class="back_cash">￥{{ cash_price }}</view>
			</view>


			<view class="cash">
				<view class="cash_title">兑换算力</view>
				<view class="cash_price">
					<text class="price_l">￥</text>
					<u-input :customStyle='{"background":"#fff","padding":"8px"}' fontSize="16" v-model="price"
						border="none" placeholder="请输入兑换金额" type="number" @blur="priceChange"></u-input>
				</view>
				<view class="cash_tip">
					<view class="tip_l">
						<text class="tip_text">折合{{price*100}}万通用算力</text>
					</view>
					<view class="tip_r" @click.stop="allPrice">全部兑换</view>
				</view>
			</view>
		</view>

		<view class="footer" @click="submit">
			<button style="background-color: #1F64FF;color: #fff;" class="btn" size="default"
				type="default">立即兑换</button>
		</view>

		<u-popup :show="bankShow" mode="bottom" :round="10" @close="bankShow=false">
			<view class="pop_cont">
				<view class="cont_top">
					<image class="close_img" src="@/static/user/close.png" @click="bankShow=false" />
					<view class="top_l">选择到账银行卡</view>
				</view>
				<view class="cont_mid" v-for="(item,index) in bankList" :key="index"
					@click="selectBank(item.card_code,item.bank,item.card_number,index)">
					<view class="mid_l">{{ item.bank }} ({{ item.new_num }})</view>
					<image class="mid_img" src="@/static/user/done.png" v-if="selectDone == index" />
				</view>
				<view class="lists" style="padding-left: 0; border-bottom: 1upx solid rgba(0, 0, 0, 0.1);"
					@click="toBank">
					<image class="bank_img" :src="bankImg" />
					<view class="txt">使用新卡提现</view>
					<image class="lists_img right_img_bank" src='@/static/images/right.png' />
				</view>

			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		exchange
	} from '@/apis/user.js'

	export default {
		data() {
			return {
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				isClick: true,
				price: '',
				cash_price: 0,
				bankShow: false,
				selectDone: 0,
				bankName: '',
				card_code: '',
				card_num: '',
				userInfo: JSON.parse(uni.getStorageSync('userInfo')),
				upbackgroundImg: global.baseImg + '/xcx/793a5158-3894-44df-be77-d637a76ae7b4.jpg',
				bankImg: global.baseImg + '/xcx/2656b6fd-e7dc-446e-ab30-9b26aef70571.jpg',
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

		},
		methods: {

			//全部兑换
			allPrice() {
				this.price = this.cash_price
			},
			priceChange() {
				this.$nextTick(() => {
					if (this.price == 0) {
						return this.$api.msg('兑换金额不能为零');
					}

					if (this.price > this.cash_price) {
						return this.$api.msg('兑换金额不能大于可兑换金额');
					}
				})
			},
			//发起兑换申请
			submit() {
				if (this.price == '') {
					return this.$api.msg('请填写兑换金额');
				}

				if (this.price == 0) {
					return this.$api.msg('兑换金额不能为零');
				}

				if (this.price > this.cash_price) {
					return this.$api.msg('兑换金额不能大于可兑换金额');
				}

				if (this.isClick == false) return;
				this.isClick = false;
				let val = {
					"amount": this.price,
				}

				exchange(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('已发起申请，请等待后台审核')
						setTimeout(() => {
							this.isClick = true;
							uni.redirectTo({
								url: '/childPage/distribution/distribution',
							})
						}, 1500);
					} else {
						this.$api.msg(res.msg);
						this.isClick = true;
					}
				}).catch(err => {
					console.log(err);
					this.isClick = true;
					this.$api.msg('兑换失败');
				})
			},
			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			}
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
			width: calc(100% - 72upx);

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
					font-weight: 500;
					font-size: 28upx;
					line-height: 30upx;
					color: #333;
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
</style>