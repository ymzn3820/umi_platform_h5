<template>
	<view class="container">
		<view class="cont_li">
			<view class="li_text">
				<u--textarea v-model="voice_text" placeholder="请输入需要克隆文本" maxlength="300" count :autoHeight="true" style="min-height: 300rpx;"></u--textarea>
			</view>
			
			<view class="li_line">
				<text class="line_text">音量</text>
				<u-slider v-model="vol_val" blockSize="13" showValue></u-slider>
			</view>
			
			<view class="li_line">
				<text class="line_text">语调</text>
				<u-slider v-model="intonation" blockSize="13" min="-500" max="500" showValue></u-slider>
			</view>
			
			<view class="li_line">
				<text class="line_text">语速</text>
				<u-slider v-model="speed" blockSize="13" min="-500" max="500" showValue></u-slider>
			</view>
			
		</view>
		
		<view class="btn_cont" @click="saveVoice">
			<view class="cont_text">开始合成</view>
		</view>
	</view>
</template>

<script>
    import { makeVoice, getToken } from '@/apis/user.js'
	export default {
		data() {
			return {
				voice_text: '',
				token: '',
				info: '',
				vol_val: 50,
				intonation: 0,
				speed: 0,
			}
		},
		components: {
	      
		},
		onLoad(option) {
	       if(option.info) {
			   this.info = JSON.parse(option.info)
		   }
		},
		onShow() {
            this.getToken()
		},

		methods: {
			getToken() {
				getToken().then(res => {
					if (res.code == 20000) {
						this.token = res.data.token
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取token失败');
				})
			},
			
			saveVoice() {
				let val = {
					live_script: this.voice_text,
					model_id: this.info.model_id,
					token: this.token,
					voice_code:this.info.voice_code,
					volume: this.vol_val,
					time_length: this.intonation,
					voice_name: this.speed
				}
				makeVoice(val).then(res => {
					if (res.code == 20000) {
						uni.navigateTo({
							url: '/childCont/figure/compose_list',
						})
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('合成失败');
				})
			}
			
		}
	}
</script>

<style  lang="less" scoped>
	.container{
		width: 100%;
		.cont_li {
			width: 100%;
			padding: 30upx 20upx;
			.li_text {
				background: #fff;
				border-radius: 10upx;
				padding: 20upx;
			}
			.li_line {
				padding:20upx;
			}
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