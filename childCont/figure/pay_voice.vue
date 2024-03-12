<template>
	<view>
		<view class="container">
			<view class="suc_img">
				<image class="li_img" :src="successImg" mode="aspectFit"></image>
				<text class="li_status">支付成功</text>
				<text class="li_text">合成中,大约需要30分钟左右,可前往我的声音查看。</text>
				<view class="li_btn">
					<view class="btn_l" @click="toIndex">返回首页</view>
					<view class="btn_r" @click="toVoice">我的声音</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
               successImg: global.baseImg+'/xcx/com/message_center/done.png',
			}
		},
		onLoad(option) {

		},
		onShow() {
			
		},
		methods: {
			toIndex() {
				uni.navigateTo({
					url: '/childCont/figure/figure',
				})
			},
			toVoice() {
				uni.navigateTo({
					url: '/childCont/figure/my_voice',
				})
			}
        }
	}
</script>

<style lang="less" scoped>
	.container {
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.suc_img {
		width: 100%;
		padding: 20upx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.li_img {
			width:180upx;
			height: 180upx;
		}
		.li_status {
			color: #000;
			font-size: 38upx;
			font-style: normal;
			font-weight: 500;
			line-height: 52upx;
		}
		.li_text {
			color: #575859;
			font-size: 28upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			padding: 20upx;
			text-align: center;
		}
		.li_btn {
			display: flex;
			align-items: center;
			justify-content: space-around;
			width: 100%;
			margin-top: 10upx;
			.btn_l {
				width: 40%;
				border-radius: 10upx;
				border: 3upx solid #1F64FF;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #1F64FF;
				font-size: 30upx;
				font-style: normal;
				font-weight: 500;
				line-height: 48upx;
				padding: 15upx 0;
			}
			
			.btn_r {
				width: 40%;
				border-radius: 10upx;
				border: 3upx solid #1F64FF;
				background: #1F64FF;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-size: 30upx;
				font-style: normal;
				font-weight: 500;
				line-height: 48upx;
				padding: 15upx 0;
			}
		}
	}
</style>