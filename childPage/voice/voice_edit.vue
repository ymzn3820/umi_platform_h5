<template>
	<view style="height: 100vh;">
		<view style="padding: 30upx; margin-bottom: 100upx;">
			<view class="voice_title">音频标题</view>
			<view class="voice_cont">
				<u--input placeholder="请输入录音标题" border="surround" maxlength="50" v-model="messageTitle"></u--input>
			</view>
				
			<view class="voice_title">音频内容</view>
			<view class="voice_cont">
					<u-textarea v-model="stResult" placeholder="在此输入音频的内容" autoHeight :showConfirmBar='false' :adjustPosition='false'
					maxlength='-1' :disableDefaultPadding='true'></u-textarea>
			</view>
		</view>
	 
	  
	    <view class="bottom">
		    <view class="bottom_cont">
			    <view class="bottom_buy" @click="save">保存</view>
		    </view>
	    </view>
	</view>
</template>

<script>
	import {
		editRecord,
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				stResult: '', //录音转文字最终结果
				messageTitle:'',
				info: '',
			}
		},
		
		components: {
			
		},
		onLoad(options) {
			// console.log(options,5489)
			this.info = JSON.parse(options.info)
			this.stResult = this.info.speech_text;
			this.messageTitle = this.info.title;
			
		},
		onShow() {
          
		},
		methods: {
			save() {
				let val = {
					title: this.messageTitle,
					speech_text: this.stResult,
					speech_code: this.info.speech_code
				}
				editRecord(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('修改成功');
						setTimeout(() => {
							uni.redirectTo({
								url: '/childPage/voice/voice_index'
							})
						}, 1500)
						// this.info.speech_text = this.stResult;
						// this.info.messageTitle = this.messageTitle;
						// uni.redirectTo({
						// 	url: '/pages/voice/voice_detail?info='+ JSON.stringify(this.info),
						// })
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('修改失败');
				})
				
			},
		
		}
	}
</script>

<style>
	
	
</style>

<style lang="less" scoped>
	page {
		// background: #000;
	}
	
	.voice_cont {
		background: #fff;
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
		padding-bottom: 25upx;
	}
	
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
		margin: 20upx auto 0;
	}
	
	.voice_title {
		color: #333;
		text-align: center;
		font-size: 26upx;
		font-style: normal;
		font-weight: 530;
		line-height: 60upx;
		text-align: left;
	}
	
	
</style>