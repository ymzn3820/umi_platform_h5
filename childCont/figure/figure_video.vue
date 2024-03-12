<template>
	<view>
		<view class="step">
			<view class="step_li">
				<text class="li_top">1</text>
				<text class="li_bot">录入数字人信息</text>
			</view>
			<view class="step_line"></view>
			<view class="step_li">
				<text class="li_top li_end">2</text>
				<text class="li_bot">提交成功</text>
			</view>
		</view>
		
		<view class="video_cont">
			<view class="cont_title">数字人信息</view>
			
			<view class="title_info">
				<text class="title_text">模特名称</text>
				<u-input :customStyle='{"width":"100%"}' inputAlign="left" v-model="modelName"
					placeholder="请输入名称" type="text" border="none" maxlength="10" ></u-input>
			</view>
			
			<view class="title_info">
				<text class="title_text">定制类型</text>
				<text>基础模特定制</text>
				<!-- <u-input :customStyle='{ "width":"100%"}' inputAlign="left" v-model="modelType"
					placeholder="请输入类型" type="text" border="none" :disabled="true"></u-input> -->
			</view>
			
			<view class="cont_title">训练视频</view>
			
			<view class="slove" @click="tuVideo">
				<text class="slove_text">去上传视频</text>
				<u-icon name="arrow-right" color="#000" size="18"></u-icon>
			</view>
			
			<view class="tip">
				<text class="tip_line"></text>
				<text class="tip_text">定制数字人须知</text>
				<text class="tip_line"></text>
			</view>
			
			<view class="slove" @click="toCloneReq">
				<text class="slove_text">定制数字人要求</text>
				<u-icon name="arrow-right" color="#000" size="18"></u-icon>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modelName: '',
				modelType: '基础模特定制',
				spImg: ''
			}
		},
		components: {
	
		},
		onLoad(option) {

		},
		onShow() {
			
		},
		methods: {
			
			tuVideo() {
				if(this.modelName == '') {
					this.$api.msg('请填写模特名称')
					return
				}
				uni.navigateTo({
					url: '/childCont/figure/figure_file?name='+ this.modelName,
				})
			},

			toCloneReq() {
				uni.navigateTo({
					url:'/childCont/figure/clone_require'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.step {
		width: 100%;
		padding: 40upx 80upx;
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
				width: 64upx;
				height: 64upx;
				border: 1upx solid #1F64FF;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32upx;
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
		}
		.step_line {
			border-top: 1upx dashed #D8D8D8;
			flex: 1;
			margin: 0 20upx;
			margin-bottom: 40upx;
		}
	}
	
	.video_cont {
		width: 100%;
		background: #fff;
		padding: 80upx 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.cont_title {
			color: #000;
			font-size: 32upx;
			font-style: normal;
			font-weight: 500;
			line-height: 150%;
			margin-bottom: 30upx;
		}
		.title_info {
			display: flex;
			align-items: center;
			border-radius: 10upx;
			border: 1upx solid #D1D3D6;
			padding: 15upx;
			margin-bottom: 15upx;
			width: 100%;
			.title_text {
				font-size: 28upx;
				color: #000;
				margin-right: 10upx;
			}
		}
		
		.video_up {
			width: 100%;
			height: 350upx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			border-radius: 10upx;
			border: 1upx dashed #D1D3D6;
			background: #F6F8FB;
			.video_text {
				font-size: 28upx;
				color: #666;
				line-height: 48upx;
			}
		}
		
		.sp_img {
			width: 100%;
			height: 350upx;
			border-radius: 10upx;
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
		.bottom_cont {
			display: flex;
			justify-content: space-between;
			padding-bottom: 25upx;
		}
		
		.bottom_left {
			width: 96%;
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
			margin: 20upx auto 0;
		}
	}
</style>