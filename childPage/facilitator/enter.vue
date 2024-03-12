<template>
	<view style='padding: 30upx;'>
		<view style="padding: 40upx;width: calc(100% - 60upx);background-color: #fff; border-radius: 10upx;">
			<u-form ref='uForm'>
				<u-form-item label-width='120upx' label="手机号" prop="name" label-position="top" required='true'>
					<u-input v-model="phone" placeholder="请输入您的手机号"/>
				</u-form-item>
				<u-form-item label-width='120upx' label="验证码" prop="code" label-position="top" required='true'>
					<view class="form-row">
						<!-- <u-input  v-model="code"  placeholder="请输入您的验证码" /> -->
						<u-input placeholder="请输入验证码" v-model="code" color='#000' :customStyle="{'padding-right':'10upx'}">
							<!-- <u--text text="请输入验证码" color='#333333' slot="prefix" margin="0 3px 0 0" type="info"></u--text> -->
							<template slot="suffix">
								<u-toast ref="uToast"></u-toast>
								<u-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange"
									changeText='X秒'></u-code>
								<u-button @tap="getCode">{{tips}}</u-button>
							</template>
						</u-input>
					</view>
				</u-form-item>
			</u-form>
			<view style="margin-top: 30upx;">
				<u-button @click="submit" type="primary" :customStyle="{background: '#1F64FF'}">提交</u-button>
			</view>
		</view>
		
		<!-- 图片验证码 -->
		<!-- <u-modal :show="show" @cancel="closeKey" confirmText="确定" confirmColor="#1F64FF" :showCancelButton='true'
			@confirm="changeKey">
			<view class="key_cont" style="">
				<view class="title">请输入图片验证码</view>
				<view class="input_code">
					<u-input :customStyle='{"padding":"8px", "width":"60%" , "height": "90upx"}' inputAlign="center" v-model="imageCode"
						placeholder="请输入图片验证码" type="text" ></u-input>
					<image class="add_img" mode="aspectFit" :src='imgUrl' @click="getImgCode"></image>
				</view>
				
			</view>
		</u-modal> -->
	</view>
</template>

<script>
	import {
		send_code,
		image_code,
	} from '@/apis/chat.js'
	import { mobileVerify } from '@/apis/user.js'
	export default {
		data() {
			return {
				phone: '',
				code:'',
				tips: '',
				seconds: 60,
				selectCheck: 0,
				imageCode: '',
				imageId: '',
				imgUrl: '',
				show: false,
				isClick: true
			}
		},
		
		methods:{
			//按钮文字提示
			codeChange(text) {
				this.tips = text;
			},
			
			//获取图片验证码
			getImgCode() {
				image_code({
					image_id: this.imageId
				}).then(res => {
					if(res.code == 20000) {
						this.imgUrl = res.data.image_code
						this.imageId = res.data.image_id
					}
				})
			},
			//获取验证码
			getCode() {
				let text = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
				if (this.phone == "") {
					return uni.showModal({
						title: '请输入手机号码',
						showCancel: false,
						success() {
							console.log('dianji');
						}
					})
				}

				// console.log(text.test(this.phone));
				if (!text.test(this.phone)) {
					return uni.showModal({
						title: '请输入正确的手机号码',
						showCancel: false,
						success() {
							console.log('dianji');
						}
					})
				}
				this.changeKey()
				// image_code({
				// 	image_id: this.imageId
				// }).then(res => {
				// 	if(res.code == 20000) {
				// 		this.imgUrl = res.data.image_code
				// 		this.imageId = res.data.image_id
				// 		this.show = true
				// 	} else {
				// 		this.$api.msg(res.msg);
				// 	}
				// })
				
			},
			end() {
				uni.$u.toast('倒计时结束');
			},
			start() {
				uni.$u.toast('倒计时开始，时效60秒');
			},
			
			closeKey() {
				this.imageCode = ''
				this.imageId = ''
				this.show = false
			},
			
			changeKey() {
				// if (this.imageCode == '') {
				// 	this.$api.msg('图片验证码不能为空');
				// 	return
				// }
			
				// if (this.isClick == false) {
				// 	return false;
				// }
				// this.isClick = false;
				
				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: '正在获取验证码'
					})
					this.show = false
					this.isClick = true
					send_code({
						mobile: this.phone,
						// image_id: this.imageId,
						// image_code: this.imageCode
					}).then(res => {
						if(res.code == 20000) {
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							uni.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
							// this.imageId = ''
							// this.imageCode = ''
						} else {
							this.$api.msg(res.msg);
						}
						
					})
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			submit() {
				
				if (this.phone == "") {
					return uni.showModal({
						title: '请输入手机号码',
						showCancel: false,
						success() {
							console.log('dianji');
						}
					})
				}
				if (this.code == "") {
					return uni.showModal({
						title: '请输入验证码',
						showCancel: false,
						success() {
							console.log('dianji');
						}
					})
				}
				
				if (this.isClick == false) {
					return false;
				}
				this.isClick = false
				let val = {
					"mobile": this.phone,
					"code": this.code
				}
				mobileVerify(val).then(res => {
					if (res.code == 20000) {
						uni.setStorageSync('checkToken', res.data)
						uni.redirectTo({
							url: '/childPage/facilitator/equity',
						})
						this.isClick = true;
					} else {
						this.isClick = true;
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.isClick = true;
					this.$api.msg('信息提交失败');
				})
				
						
			}
		}
	}
</script>

<style lang="less" scoped>
	.form-row {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  margin-bottom: 20px;
	}
	
	.key_cont {
		width: 100%;
		background-color: #FFFFFF;
		border-radius: 20upx;
		/* padding: 0upx 0 0 0; */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.title {
		font-weight: 500;
		font-size: 32upx;
		line-height: 48upx;
		color: #333;
		margin-bottom: 32upx;
	}
	
	.input_code {
		display: flex;
		width: 100%;
	}
	
	.add_img {
		width: 40%;
		height: 90upx;
		margin-left: 10upx;
	}
</style>