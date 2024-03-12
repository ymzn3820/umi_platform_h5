<template>
	<view class="container">
		<view class="logo">
			<img class="logo_img" src="/static/images/logo.png" alt="">

			<text class="logo_text">慧远-AI为你提供有帮助的建议和见解</text>

			<view class="logo_btn" @click="toLogin">

				<!-- <text class="btn_text" ></text> -->
				<u-button @getphonenumber="getphonenumber" :open-type="getPhoneNumber" color='#51B13E' shape="circle" :customStyle="{'height':'48px'}">
					<img class="btn_img"
						src="/static/images/wx.png" alt="">微信一键登录</u-button>
			</view>
			<view class="phoneLogin" @click="phoneLogin">
				手机验证码登陆
			</view>

			<view class="agree">
				<view style="display: flex; align-items: center; justify-content: center;">
					<checkbox-group @change="radioChange">
						<label>
							<checkbox value="1" style="transform:scale(0.7)" />
						</label>
					</checkbox-group>

					<text class="agree_text">登录代表同意</text>
					<text class="agree_text_right" @click="checkAgree">《用户协议》</text>
					<text class="agree_text">和</text>
					<text class="agree_text_right" @click="checkSecret">《隐私协议》</text>
				</view>

			</view>

		</view>
	</view>
</template>
<script>
	import {
		wxLogin
	} from '../../apis/chat.js'
	export default {
		data() {
			return {
				selectCheck: 0,
				getPhoneNumber:''
			}
		},
		onShow() {

		  if (uni.getStorageSync('userInfo') == null || uni.getStorageSync('userInfo') == '') {
			console.log(999);
			this.guessLogin()
		  } 

		},
		methods: {
			phoneLogin() {
				// console.log('手机登陆');
				uni.navigateTo({
					url: '/pages/login/phoneLogin'
				})
			},
			getphonenumber(e){
				console.log(e.detail,'获取手机号码');
				
				if(e.detail.errMsg=='getPhoneNumber:ok'){
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							// let code = loginRes.code;
							// that.wxLogin(code);
							let val = {
								'code': loginRes.code,
								'user_code': userInfo.user_code
							}
							wxLogin(val).then(res => {
								if (res.code == 20000) {
									uni.setStorageSync("userInfo", JSON.stringify(res.data));
									uni.switchTab({
										url: '/pages/index/index'
									});
									// uni.navigateTo({
									// 	url:'/subPagesA/home/index'
									// })
									uni.getUserInfo({
										provider: "weixin",
										success: res => {
											const userWeiXinAccInfo = res.userInfo;
											console.log(res);
										},
										fail: err => {
											console.log("获取用户信息失败");
										}
									})
								} else {
									this.$api.msg(res.msg)
								}
							}).catch(err => {
								this.$api.msg('登录失败！')
							})
						}
					});
					
				}
				
			
			},
			toLogin() {
				console.log(this.selectCheck, 339)

				if (this.selectCheck == 1) {
					let that = this;
					
				} else {
					this.$api.msg('请选择同意用户协议和隐私政策')
				}

			},

			radioChange(evt) {
				this.selectCheck = evt.detail.value[0]
				// console.log(evt);
				this.selectCheck==1?this.getPhoneNumber='getPhoneNumber':this.getPhoneNumber='1'
			},

			// 游客登录
			guessLogin() {
				let headers = {
					'content-type': 'application/x-www-form-urlencoded',
					'source': 'xcx'
				}
			
				let val = {
					time: new Date().getTime()
				};
				uni.request({
					url: global.loginUrl + '/api/user/create_temp_user',
					data: val,
					header: headers,
					method: 'POST',
					success: (res) => {
						if (res.data.code == 20000) {
							uni.setStorageSync("userInfo", JSON.stringify(res.data.data));
						} else {
							console.log('登录失败')
						}
					}
				});
			},

			checkAgree() {
				uni.navigateTo({
					url: '/pages/agree/agree?agree_type=4',
				})
			},
			checkSecret() {
				uni.navigateTo({
					url: '/pages/agree/agree?agree_type=1',
				})
			}

		}
	}
</script>
<style lang='scss' scoped>
	.container {
		background: #fff;
		width: 100%;
		height: 100vh;
		padding: 100upx 60upx;
	}

	.phoneLogin {
		margin-top: 20px;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 20px;
		/* identical to box height, or 143% */

		text-align: center;

		color: #333333;
	}

	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo_img {
		width: 140upx;
		height: 140upx;
	}

	.logo_text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 150%;
		color: #333;
		padding: 40upx 0 100upx 0;
	}

	.logo_btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #51B13E;
		border-radius: 48upx;
		width: calc(100% - 80upx);

		.btn_img {
			width: 58upx;
			height: 58upx;
			margin-right: 13px;
		}

		.btn_text {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 32upx;
			line-height: 96upx;
			padding-left: 20upx;
			color: #fff;
		}
	}

	.agree {
		position: fixed;
		bottom: 25upx;
	}

	.agree_text {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 26upx;
		color: #222;
	}

	.agree_text_right {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 26upx;
		color: #1F64FF;
	}
</style>