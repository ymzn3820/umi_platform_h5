<template>
	<view style='padding: 30upx;'>
		<view style="padding: 40upx;width: calc(100% - 60upx);background-color: #fff; border-radius: 10upx;">
			<u-form ref='uForm'>
				<u-form-item label-width='150upx' label="姓名" prop="name" label-position="top" required='true'>
					<u-input v-model="name" placeholder="请输入您的姓名" />
				</u-form-item>
				<u-form-item label-width='150upx' label="手机号码" prop="mobile" label-position="top" required='true'>
					<u-input v-model="mobile" placeholder="请输入您的手机号码" />
				</u-form-item>
				<u-form-item label-width='150upx' label="合作意向" label-position="top">
					<u-input v-model="content" placeholder="请输入内容" />
				</u-form-item>
			</u-form>
			<view style="margin-top: 30upx;">
				<u-button @click="submit" type="primary" :customStyle="{background: '#1F64FF'}">提交</u-button>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		business
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				isClick: true,
				name: '',
				mobile: '',
				content: '',

			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			// this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				
				if (this.name == "") {
					this.$api.msg('姓名不能为空！');
					return
				}

				if (this.mobile == "") {
					this.$api.msg('手机号不能为空！');
					return
				}

				let TEL_REGEXP = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
				if (!TEL_REGEXP.test(this.mobile)) {
					this.$api.msg('手机号格式不正确！');
					return
				}
				
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let val = {
					"user_id": userInfo.user_id,
					'name': this.name,
					'phone': this.mobile,
					'details': this.content,
					"type": 20,
				}
				
				if (this.isClick == false) {
					return false;
				}
				this.isClick = false
				business(val).then(res => {
					if (res.code == 20000) {
						// console.log(JSON.stringify(res.data),789);
						uni.showToast({
							title: '提交成功',
							icon: 'success',
							duration: 1500
						})
						this.isClick = true;
						setTimeout(() => {
							uni.navigateTo({
								url: '/childPage/facilitator/service',
							})
						}, 1500)
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

<style lang="less">

</style>