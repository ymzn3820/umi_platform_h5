<template>
	<view id="phone">
		<view class="hello">您好,</view>
		<view class="title">欢迎来到无忧秘书AI</view>
		<view class="loginInput">
			<u-input placeholder="请输入手机号码" border="bottom" v-model="phone" color='#000'>
				<u--text text="手机号" slot="prefix" margin="0 3px 0 0" type="info"></u--text>
			</u-input>
			<u-input placeholder="请输入验证码" border="bottom" v-model="code" color='#000'
				:customStyle="{'padding-right':'0px'}">
				<u--text text="验证码" color='#333333' slot="prefix" margin="0 3px 0 0" type="info"></u--text>
				<template slot="suffix">
					<u-toast ref="uToast"></u-toast>
					<u-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange"
						changeText='X秒'></u-code>
					<u-button @tap="getCode">{{tips}}</u-button>
				</template>
			</u-input>
		</view>
		<u-button color="#1F64FF" :customStyle="{'height':'48px'}" @click="goToLogin">登录</u-button>
		<!-- <button open-type='chooseAvatar' @chooseavatar="onChooseavatar">获取头像和昵称</button> -->

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
<!-- 动态引入验证码JS示例 -->
<script>
	import {
		send_code,
		mobile_login,
		create_temp_user,
		image_code
	} from '@/apis/chat.js'
	import {
		batchTutor,
		creatMe
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				phone: "",
				code: "",
				tips: '',
				// refCode: null,
				seconds: 60,
				selectCheck: 0,
				user_code: "",
				invite_user_code: '',
				company_code: '',
				imageCode: '',
				imageId: '',
				imgUrl: '',
				show: false,
				isClick: true,
				ticket: '',
				randstr:''
			}
		},
		onLoad(option) {
			console.log(option)
			if (option.company_code) { //企业别邀请成员第一次登录会执行以下代码
				this.invite_user_code = option.user_code
				this.company_code = option.company_code
			}

		},
		onShow() {

			if (uni.getStorageSync('userInfo') == null || uni.getStorageSync('userInfo') == '') {
				// console.log(999);
				this.guessLogin()
			}

		},
		mounted() {
			let userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			if (userInfo) {
				this.user_code = userInfo.user_code
			}


		},
		methods: {
			callback(res) {
				console.log(res,'res');
				// 用户操作验证码或者关闭刷新腾讯返回的内容 
				let that = this
				if (res.ret === 0) {
					that.ticket=res.ticket
					that.randstr=res.randstr
					that.changeKey()
					//成功，传递数据给后台进行验证
					// 这里后台会给一个借口,把后台需要的参数传过去

				} else {
					console.log("验证失败")
					// 提示用户完成验证
				}
			},
			varify() {
				let appid = '193069182'; // 腾讯云控制台中对应这个项目的 appid
				//生成一个滑块验证码对象
				let captcha = new TencentCaptcha(appid, this.callback);
				// 滑块显示
				captcha.show();
			},
			goToLogin() {
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
				if (this.selectCheck == 0) {
					return uni.showModal({
						title: '请选择同意用户协议和隐私政策',
						showCancel: false,
						success() {
							console.log('dianji');
						}
					})
				}
				let query = uni.getStorageSync('loginCode');
				// console.log(query,411)
				let val = {
					mobile: this.phone,
					code: this.code,
					user_code: this.user_code
				}
				if (query) {
					if (query.role == 'user') {
						val.parent_user_code = query.parent_user_code
					}
				}
				uni.showLoading({
					title: '登录中...'
				});
				mobile_login(val).then(res => {
					if (res.code != 20000) {
						uni.hideLoading()
						return this.$api.msg(res.msg)
					}
					uni.setStorageSync("userInfo", JSON.stringify(res.data));
					uni.setStorageSync('loginCode', '');
					if (res.data.is_tutor == 1) { //是否已经绑定导师 1是0否
						if (this.company_code == '') {
							uni.navigateBack({ // 返回上一页
								delta: 1
							})
						} else {
							uni.redirectTo({
								url: '/pages/user/company/company_list?user_code=' + this
									.invite_user_code + '&company_code=' + this.company_code
							})
						}
					} else {
						this.creatMe(res.data.user_id, res.data.nick_name, res.data.avatar_url)
					}


				})
				// console.log(this.selectCheck, '勾选状态');
			},
			radioChange(evt) {
				this.selectCheck = evt.detail.value[0]
			},
			onChooseavatar(e) {
				console.log(e, 'bindchooseavatar');
			},
			//获取手机号码
			getPhoneNumber(e) {
				console.log(e.detail.code, 'console.log(e.detail.code)')
			},

			//按钮文字提示
			codeChange(text) {
				this.tips = text;
			},

			//获取图片验证码
			getImgCode() {
				image_code({
					image_id: this.imageId
				}).then(res => {
					if (res.code == 20000) {
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
				this.varify()
				// this.changeKey()
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
							this.user_code = res.data.data.user_code
						} else {
							console.log('登录失败')
						}
					}
				});
			},

			creatMe(user_id, name, imgUrl) {
				let data = {
					'user_id': user_id,
					'photo': imgUrl,
					'name': name,
					'greeting': '我是您的孪生数字人，遇事不决的时候，您可以问我，我会给您回答，供您参考，现在开始问我吧！'
				}

				creatMe(data).then(res => {
					if (res.code == 20000) {
						this.batchTutor(user_id, res.data.me_id)
					} else {
						this.$api.msg(res.msg);
						uni.hideLoading()
					}
				}).catch(err => {
					this.$api.msg('创建失败');
					uni.hideLoading()
				})
			},

			//批量绑定导师
			batchTutor(user_id, me_id) {
				batchTutor({
					user_id,
					me_id
				}).then(res => {
					if (res.code == 20000) {
						uni.hideLoading()
						if (this.company_code == '') {
							uni.navigateBack({ // 返回上一页
								delta: 1
							})
						} else {
							uni.redirectTo({
								url: '/pages/user/company/company_list?user_code=' + this
									.invite_user_code + '&company_code=' + this.company_code
							})
						}
					} else {
						uni.hideLoading()
						this.$api.msg(res.msg);
					}
				})
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
			},

			closeKey() {
				this.imageCode = ''
				this.imageId = ''
				this.show = false
			},

			changeKey() {
				// 	if (this.imageCode == '') {
				// 		this.$api.msg('图片验证码不能为空');
				// 		return
				// 	}

				// 	if (this.isClick == false) {
				// 		return false;
				// 	}
				// 	this.isClick = false;

				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: '正在获取验证码'
					})
					this.show = false
					this.isClick = true
					send_code({
						mobile: this.phone,
						Ticket: this.ticket,
						action: 'web',
						Randstr:this.randstr
					}).then(res => {
						if (res.code == 20000) {
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							uni.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
							this.imageId = ''
							this.imageCode = ''
						} else {
							this.$api.msg(res.msg);
						}

					})
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
		}
	}
</script>



<style>
	page {
		background: #fff;
	}
</style>

<style scoped lang="scss">
	#phone {
		padding: 32px;

		.hello {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 32px;
			line-height: 45px;
		}

		.title {
			font-weight: 400;
			font-size: 16px;
			line-height: 22px;
			margin-bottom: 35px;
		}

		.loginInput {
			margin-bottom: 61px;

			/deep/.u-input {

				// width: 312px;
				height: 48px;
				// border-radius: 10px;

				padding-right: 1px;
				margin-bottom: 12px;

			}

			/deep/.u-text__value--info {
				color: #333;
			}

			/deep/.u-button {
				width: 100px;
				height: 46px;
				// border-radius: 10px;
				// border: 1px solid #1F64FF;
				border: none;
				color: #1F64FF;
				font-style: normal;
				font-weight: 500;
				font-size: 14px;
			}
		}

		.agree {
			// text-align: center;

			position: fixed;
			bottom: 80upx;
			left: 0;
			right: 0;

			.agree_text {
				font-style: normal;
				font-weight: 500;
				font-size: 26upx;
				color: #222;
			}

			.agree_text_right {
				font-style: normal;
				font-weight: 500;
				font-size: 26upx;
				color: #1F64FF;
			}
		}
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