<template>
	<view style="padding-top:30upx;">
		<view class="info">
			<view class="cont" style='border-bottom: 1upx solid #e6e6e8;' @click="toEdit">
				<text class="cont_l">昵称</text>
				<text class="cont_r">{{ userInfo.nick_name}}</text>
			</view>
			<view class="cont">
				<text class="cont_l">手机号</text>
				<text class="cont_r">{{ userInfo.mobile}}</text>
			</view>
		</view>
		
		<view class="info" style="margin-top: 20upx;">
			<view class="cont" style='border-bottom: 1upx solid #e6e6e8;' @click="checkSecret">
				<text class="cont_l">隐私政策</text>
				<image class="right_img" src='@/static/images/right.png' />
			</view>
			<view class="cont" style='border-bottom: 1upx solid #e6e6e8;' @click="checkAgree">
				<text class="cont_l">用户协议</text>
				<image class="right_img" src='@/static/images/right.png' />
			</view>
			<view class="cont" @click="checkMz">
				<text class="cont_l">免责声明</text>
				<image class="right_img" src='@/static/images/right.png' />
			</view>
		</view>
		
		<view class="btn" @click="logout" v-if="userInfo.role == 'user'">
			<view class="btn_cont">退出登录</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: ''
			}
		},
		components: {
			
		},
		onLoad() {
			
		},
		onShow() {
            this.userInfo = JSON.parse(uni.getStorageSync('memberInfo'));
			console.log(this.userInfo,4589)
		},
		methods: {
			logout() {
				uni.setStorageSync("userInfo", null);
				uni.redirectTo({
					url: '/pages/login/login',
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
			
			checkMz() {
				uni.navigateTo({
					url: '/pages/agree/agree?agree_type=3',
				})
			},
			
			toEdit() {
				
				if (this.userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/pages/user/info/info',
					})
				}
			}
		}
	}
</script>

<style scoped>
	page {
		background: #f6f8fb;
	}
	.info {
		width: 100%;
		padding: 0 25upx;
		background: #fff;
	}
	.cont {
		width: 100%;
		height: 110upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.cont_l {
		font-weight: 400;
		font-size: 32upx;
		line-height: 48upx;
		color: #333;
	}
	
	.cont_r {
		font-weight: 400;
		font-size: 28upx;
		line-height: 48upx;
		color: #333;
	}
	
	.right_img {
		width: 24upx;
		height: 24upx;
		margin-right: 25upx;
	}
	
	.btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		margin-top: 25upx;
	}
	
	.btn_cont {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32upx;
		line-height: 50upx;
		color: #1F64FF;
		padding: 25upx 0;
	}
	
</style>