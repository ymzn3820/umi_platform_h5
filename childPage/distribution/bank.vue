<template>
	<view class="container">
		
		<view class="bank_title">添加银行卡</view>
		<view class="lists">
			<view class="list_cont">
				<view class="require">*</view>
				<view class="title">真实姓名</view>
				<view class="list_input">
					<u-input :customStyle='{"background":"#fff","padding":"8px"}' fontSize="14" v-model="userName" border="none"
						placeholder="请输入姓名" type="text" ></u-input>
				</view>
			</view>
			
			<view class="list_cont">
				<view class="require">*</view>
				<view class="title">银行卡号</view>
				<view class="list_input">
					<u-input :customStyle='{"background":"#fff","padding":"8px"}' fontSize="14" v-model="cardNum" border="none"
						placeholder="请输入银行卡号" type="number" @blur="checkBank(cardNum)"></u-input>
				</view>
			</view>
			
			<view class="list_cont">
				<view class="require">*</view>
				<view class="title">所属银行</view>
				<view class="list_input">
					<u-input :customStyle='{"background":"#fff","padding":"8px"}' fontSize="14" v-model="bankName" border="none"
						placeholder="请输入所属银行" type="text"></u-input>
				</view>
				<!-- <image class="right_img_bank" src='@/static/images/right.png' /> -->
			</view>
			<view class="list_cont">
				<view class="require">*</view>
				<view class="title">支行名称</view>
				<view class="list_input">
					<u-input :customStyle='{"background":"#fff","padding":"8px"}' fontSize="14" v-model="branchName" border="none"
						placeholder="请输入支行名称" type="text" ></u-input>
				</view>
			</view>
			<view class="list_cont">
				<view class="require">*</view>
				<view class="title">手机号码</view>
				<view class="list_input">
					<u-input :customStyle='{"background":"#fff","padding":"8px"}' fontSize="14" v-model="phone" border="none"
						placeholder="请输入手机号码" type="number" ></u-input>
				</view>
			</view>
		</view>
		
		<view class="footer">
			<view class="btn" @click="submit">确定添加</view>
		</view>

	</view>
</template>

<script>
	import { addBank, getBankSource } from '@/apis/user.js'

	export default {
		data() {
			return {
				isClick: true,
				userName: '',
				cardNum: '',
				bankName: '',
				branchName: '',
				phone: '',
				selectDone: 0,
				bank_no: ''
				
			}
		},
		components: {
			
		},
		onLoad() {

		},
		onShow() {
			

		},
		methods: {
			// 获取所属银行
			checkBank(num) {
				if(num != '') {
					let val = {
						card_number: num
					}
					getBankSource(val).then(res => {
						if (res.code == 20000) {
							this.bankName = res.data.bank;
							this.bank_no = res.data.bank_no;
						} else {
							// this.$api.msg(res.msg);
						}
					}).catch(err => {
						// this.$api.msg('获取信息失败');
					})
				}
			},
			
			// 提交信息
			submit() {
				if(this.userName == '') {
					return this.$api.msg('请输入真实名称')
				}
				if(this.cardNum == '') {
					return this.$api.msg('请输入银行卡号')
				}
				if(this.bankName == '') {
					return this.$api.msg('请输入所属银行')
				}
				if(this.branchName == '') {
					return this.$api.msg('请输入所属支行')
				}
				if(this.phone == '') {
					return this.$api.msg('请输入手机号')
				}
				let val = {
					"name": this.userName,
					"card_number": this.cardNum,
					"bank": this.bankName,
					"bank_name": this.branchName,
					"mobile": this.phone,
					"bank_no": this.bank_no
				}
				addBank(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('添加成功');
						setTimeout(() => {
						    uni.redirectTo({
						    	url: '/pages/distribution/cash',
						    })
						}, 1500);
						
					} else {
						// this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.container {
		padding: 40upx 24upx;
	}
	.bank_title {
		font-weight: 400;
		font-size: 26upx;
		line-height: 32upx;
		color: #333;
		padding: 24upx 0 12upx 20upx;
	}
	
	.lists {
		display: flex;
		flex-direction: column;
        justify-content: flex-start;
		padding: 30upx 20upx;
		background: #fff;
		border-radius: 8upx;
		margin-bottom: 25upx;
		.list_cont {
			display: flex;
			align-items: center;
			padding: 15upx 0;
			.require {
				color:#FB423F;
				font-weight: 400;
				font-size: 26upx;
				line-height: 48upx;
			}
			.title {
				color:#888;
				font-weight: 400;
				font-size: 26upx;
				line-height: 48upx;
				padding: 0 40upx 0 10upx;
			}
			.list_input {
				flex: 1;
			}
			.right_img_bank {
				width: 24upx;
				height: 24upx;
				margin-right: 15upx;
			}
		}
	}
	
	.footer {
		width: calc(100% - 48upx);
		position: fixed;
		bottom: 80upx;
		.btn {
			width: 100%;
			background: linear-gradient(301.23deg, #1F64FF 0%, #5589FF 100%);
			border-radius: 10upx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 500;
			font-size: 32upx;
			line-height: 48upx;
			color: #fff;
			padding: 20upx 0;
		}
		.btn:active {
			opacity: 0.5;
		}
	}
	
	
</style>