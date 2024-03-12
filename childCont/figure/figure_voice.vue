<template>
	<view class="containar">
		<view class="step">
			<view class="step_li">
				<text class="li_top">1</text>
				<text class="li_bot li_text">填写信息</text>
			</view>
			<view class="step_line"></view>
			<view class="step_li">
				<text class="li_top li_end">2</text>
				<text class="li_bot">上传音频文件</text>
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
		
		<view class="video_cont">
			<view class="cont_title">声音信息</view>
			
			<view class="title_info">
				<view class="title_text">
					<text class="text_tip">*</text>
					<text class="text_name">模特名称</text>
				</view>
				<u-input :customStyle='{"width":"100%"}' inputAlign="left" v-model="modelName"
					placeholder="请输入名称" type="text" maxlength="10" ></u-input>
			</view>
			
			<view class="title_info">
				<view class="title_text">
					<text class="text_tip">*</text>
					<text class="text_name">选择性别</text>
				</view>
				<view class="select_tab">
					<view :class="select_sex == 0 ? 'tabs_active' : 'tabs'" @click="getSex(0)">男</view>
					<view :class="select_sex == 1 ? 'tabs_active' : 'tabs'" @click="getSex(1)" >女</view>
				</view>
			</view>
			
		</view>
		
		<view class="btn_cont" @click="saveVoice">
			<view class="cont_text">开始克隆</view>
		</view>
	</view>
</template>

<script>
	import { saveVoice } from '@/apis/user.js'
	export default {
		data() {
			return {
				modelName: '',
				select_sex: 0
			}
		},
		components: {
	
		},
		onLoad(option) {

		},
		onShow() {
			
		},
		methods: {
			// 上传资料
			saveVoice() {
				if(this.modelName == '') {
					this.$api.msg('请填写模特名称')
					return
				}
				let val = {
					voice_name: this.modelName,
					gender: this.select_sex == 1 ? 'female' : 'male'
				}
				saveVoice(val).then(res => {
					if (res.code == 20000) {
					    uni.navigateTo({
						    url: '/childCont/figure/voice_list?id='+ res.data.id,
					    })
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('克隆失败');
				})

				
			},
			
			getSex(tip) {
				this.select_sex = tip
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.containar {
		display: flex;
		flex-direction: column;
		height: 100vh;
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
	
	.video_cont {
		width: 100%;
		background: #fff;
		padding: 80upx 30upx;
		border-radius: 20upx 20upx 0 0;
		flex: 1;
		.cont_title {
			color: #000;
			font-size: 32upx;
			font-style: normal;
			font-weight: 500;
			line-height: 150%;
			margin-bottom: 30upx;
			text-align: center;
		}
		.title_info {
			display: flex;
			flex-direction: column;
			margin-bottom: 30upx;
			width: 100%;
			.title_text {
				font-size: 28upx;
				color: #000;
				padding: 10upx 0;
				.text_tip {
					color: #f00;
				}
			}
		}
	}
	
	.select_tab {
		display: flex;
		padding: 20upx;
		.tabs {
			border-radius: 10upx;
			background: #F6F6F6;
			color: #747474;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
			line-height: 48upx;
			padding: 10upx 50upx;
			margin-right: 20upx;
		}
		
		.tabs_active {
			border-radius: 10upx;
			background: #1F64FF;
			color: #fff;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
			line-height: 48upx;
			padding: 10upx 50upx;
			margin-right: 20upx;
		}
	}
	.btn_cont {
		width: 100%;
		height: 150upx;
		border-top: 1upx solid #E7E7E7;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		background: #fff;
		.cont_text {
			width: 80%;
			border-radius: 10upx;
			background: linear-gradient(301deg, #1F64FF 0%, #5589FF 100%);
			color: #FFF;
			font-size: 30upx;
			font-style: normal;
			font-weight: 500;
			line-height: 50upx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20upx 0;
		}
	}
</style>