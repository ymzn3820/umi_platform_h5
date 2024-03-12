<template>
	<view>
		<view class="btn" >
			<u-icon name="checkbox-mark" color="#2979ff" size="28"></u-icon>
			<view style="display: flex;">验证结束，点击左上角返回首页</view>
		</view>
		<!-- <view class="btn" v-if="is_realName==2" @click="backmini">
			<u-icon name="close" color="#2979ff" size="28"></u-icon>
			<view style="display: flex;">验证失败，点击左上角返回首页</view>
		</view> -->
	</view>
</template>
<script>
	export default {
		data() {
			return {
				is_realName: 0,
				res: '',
				token:'',
				backUrl:''
			};
		},
		onLoad() {
			this.token
		},
		onshow() {
			this.getUrl()
		},
		methods: {
			getUrl() {
				// 获取code后自己的业务逻辑
				let that = this;
				let headers = {
					'content-type': 'application/x-www-form-urlencoded',
					'source': global.source,
					'Authorization': uni.getStorageSync('backToken')
				}
				val = {
					"verify_token": uni.getStorageSync('verify_token')
				}
				that.token==that.val.verify_token
				uni.request({
					url: global.loginUrl + '/api/user/real_name_authentication',
					data: val,
					header: headers,
					method: 'PUT',
					success: (res) => {
						that.res = res
						if (res.data.code == 20000) {
							let backUrl = uni.getStorageSync('backUrl')
							// window.location.href = backUrl
							if (res.data.data.success) {
								that.is_realName = 1
							} else {
								that.is_realName = 2
							}
						} else {
							that.is_realName = 2
						}
					}
				});
			},
			backmini() {
				let backUrl = uni.getStorageSync('backUrl')
				window.location.href = backUrl
			}
		}
	}
</script>

<style lang="less" scoped>
	.btn {
		margin-top: 42vh;
		    margin-left: 6%;
		    width: 88%;
		    background-color: ;
		    border-radius: 6rpx;
		    border: 0.5px solid #1F64FF;
		    padding: 48rpx 20rpx;
		    height: 22px;
		    color: #1F64FF;
		    font-size: 40rpx;
		    font-style: normal;
		    font-weight: 400;
		    line-height: 150%;
		    margin-bottom: 5px;
		    display: flex;
		    align-items: center;
		    flex-wrap: nowrap;
		}
</style>