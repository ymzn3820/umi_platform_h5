<template>
	<view class="cooperate">
		<u-list :height="scrollHeight">
			<view class="info">
				<u-row gutter="10">
					<u-col span="2" align="center" textAlign="center">
						<image :src="tipImg" mode=""></image>
					</u-col>
					<u-col span="10">
						<view class="infoTitle">
							城市运营商
						</view>
						<view class="content">
							诚招各城市有能力的合作伙伴，一起拓展市场
						</view>
					</u-col>
				</u-row>
			</view>
			<view class="info">
				<u-row gutter="10">
					<u-col span="2" align="center" textAlign="center">
						<image :src="tipImg1" mode=""></image>
					</u-col>
					<u-col span="10">
						<view class="infoTitle">
							源码定制开发
						</view>
						<view class="content">
							定制开发 Al智能软件：PC、H5、公众号、小程序
						</view>
					</u-col>
				</u-row>
			</view>
			<view class="info">
				<u-row gutter="10">
					<u-col span="2" align="center" textAlign="center">
						<image :src="tipImg2" mode=""></image>
					</u-col>
					<u-col span="10">
						<view class="infoTitle">
							API接口
						</view>
						<view class="content">
							ChatGLM、文心一言、讯飞星火、Stable Diffusion、Midjourney、百度绘画
						</view>
					</u-col>
				</u-row>
			</view>

			<view class="information">
				<u-row>
					<u-col span="3">
						<view class="title">
							<text class="title_l">*&nbsp;</text>
							<text class="title_r">合作类型</text>
						</view>
					</u-col>
					<u-col span="9" @click="inputClick">
						<u-input :customStyle='{"background":"#F6F8FB","padding":"8px"}' v-model="type" border="none"
							placeholder="请选择合作类型" type="text" disabled>
							<template slot="suffix">
								<image class="lists_img right_img" src='@/static/images/right.png' />
							</template>
						</u-input>
					</u-col>
				</u-row>
			</view>

			<view class="information">
				<u-row>
					<u-col span="3">
						<view class="title">
							<text class="title_l">*&nbsp;</text>
							<text class="title_r">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</text>
						</view>
					</u-col>
					<u-col span="9">
						<u--input :customStyle='{"background":"#F6F8FB","padding":"8px"}' v-model="userName" border="none"
							placeholder="请输入您的姓名" type="text"></u--input>
					</u-col>
				</u-row>
			</view>

			<view class="information">
				<u-row>
					<u-col span="3">
						<view class="title">
							<text class="title_l">*&nbsp;</text>
							<text class="title_r">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话</text>
						</view>
					</u-col>
					<u-col span="9">
						<u--input :customStyle='{"background":"#F6F8FB","padding":"8px"}' v-model="phone" border="none"
							placeholder="请输入您的电话" type="text"></u--input>
					</u-col>
				</u-row>
			</view>
			<view class="information">
				<u-row align="top">
					<u-col span="3">
						<view class="title">

							<text class="title_r">&nbsp;&nbsp;合作意向</text>
						</view>
					</u-col>
					<u-col span="9">
						<u--textarea :customStyle='{"background":"#F6F8FB","padding":"8px"}' v-model="remark" border="none"
							placeholder="请输入您的合作意向" type="text"></u--textarea>
					</u-col>
				</u-row>
			</view>

           <!-- <view class="btn"> -->
				<u-button @click="submit()" color="#1F64FF" class="btn_cont">提交</u-button>
			<!-- </view> -->
			
		</u-list>


		<!-- <view class="btn">
			<view class="btn_cont" @click="submit()">提交</view>
		</view> -->

		<u-popup :show="show" :round="10">
			<view class="popupBox">
				<view class="box" v-for='item,index in list' :key="index" @click="boxClick(item)">
					{{item.name}}
				</view>

				<view class="box" @click="show = false">
					取消
				</view>
			</view>

		</u-popup>
	</view>
</template>

<script>
	import {
		business
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				list: [{
						name: "城市运营商",
						id: '1'
					},
					{
						name: "源码定制开发",
						id: '2'
					},
					{
						name: "API 接口",
						id: '3'
					},
				],
				scrollHeight: 0,
				userName: '',
				type: "",
				typeId: "",
				phone: '',
				remark: '',
				isClick: true,
				show: false,
				tipImg: global.baseImg+'/xcx/fe335c4b-832e-4ed8-92ad-de0001176c82.jpg',
				tipImg1: global.baseImg+'/xcx/a734d928-48a6-41de-ae8e-41cbc8f355b7.jpg',
				tipImg2: global.baseImg+'/xcx/c1635dc1-ff1f-4bdf-aeb4-64da573f86a5.jpg',
			}
		},
		components: {

		},
		onLoad() {
			console.log(uni.getSystemInfoSync().windowHeight - uni.upx2px(80),
				'uni.getSystemInfoSync().windowHeight');

			this.scrollHeight = uni.getSystemInfoSync().windowHeight - uni.upx2px(80)
		},
		onShow() {
            document.title = '无忧秘书AI商务合作承接业务有：源码定制开发，API接口接入和城市运营等，一起开拓市场。'
			let metaKeywords = document.createElement('meta')
			metaKeywords.id = 'chat-meta-keywords'
			metaKeywords.name = 'keywords'
			metaKeywords.content = '源码钉钉，源码开发，AI智能软件开发，定制AI源码，API接口，API接入'
			document.getElementsByTagName('head')[0].appendChild(metaKeywords)
					
			let metaDescription = document.createElement('meta')
			metaDescription.id = 'chat-meta-description'
			metaDescription.name = 'description'
			metaDescription.content = '"无忧秘书AI商务合作目前涉及的项目有城市运营商的AI智能实现，承接中小微企业的源码定制需求，还承接API接口业务，目前可以承接的接口有：GPT3.5、GPT4.0、 dall-e2、百度AI绘画、通义千问、讯飞星火、文心一言等。欢迎前来合作共赢！"'
			document.getElementsByTagName('head')[0].appendChild(metaDescription)
		},
		
		onHide() {
			document.getElementById('chat-meta-keywords').remove()
			document.getElementById('chat-meta-description').remove()
		},
		methods: {
			inputClick() {
				console.log(123);
				this.show = true
			},
			boxClick(item) {
				console.log(item, 'item');
				this.type = item.name
				this.typeId = item.id
				this.show = false
			},
			submit() {
				if (this.userName == "") {
					this.$api.msg('姓名不能为空！');
					return
				}

				if (this.phone == "") {
					this.$api.msg('手机号不能为空！');
					return
				}

				var TEL_REGEXP = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
				if (!TEL_REGEXP.test(this.phone)) {
					this.$api.msg('手机号格式不正确！');
					return
				}

				if (this.isClick == false) {
					return false;
				}
				this.isClick = false;

				let val = {
					'name': this.userName,
					'phone': this.phone,
					'details': this.remark,
					"type": this.typeId
				}

				business(val).then(res => {
					if (res.code == 20000) {
						// console.log(JSON.stringify(res.data),789);
						uni.showToast({
							title: '提交成功',
							icon: 'success',
							duration: 1500
						})
						this.userName = '';
						this.phone = '';
						this.remark = '';
						this.isClick = true;
						this.type = ''
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
<style>
	page {
		background: #fff;

	}
</style>
<style scoped lang="less">
	.cooperate {
		padding: 16px;
	}

	.popupBox {
		height: 220px;
		font-size: 17px;

		.box {
			height: 56px;
			text-align: center;
			line-height: 56px;
			border-bottom: 1px solid #e3e5e7;

			&:nth-last-child(2) {
				border-bottom: 5px solid #e3e5e7;
			}

			&:last-child {
				border: none;
			}
		}
	}

	.info {
		// height: 84px;
		width: 100%;
		background: #F6F8FB;
		font-size: 32upx;
		border-radius: 12upx;
		padding: 32upx;
		margin-bottom: 20upx;

		.infoTitle {
			font-weight: 550;
			color: #303030;
		}

		.content {
			color: #51565D;
			font-size: 28upx;
		}

		image {
			width: 80upx;
			height: 72upx;
		}
	}

	.information {
		/deep/.u-row {
			margin-bottom: 20px;
		}
	}

	.title {
		display: flex;
		align-items: center;
		font-weight: 500;
		// font-size: 34upx;
		line-height: 40upx;
		// padding: 20upx 41upx;
		color: #333333;
	}

	.title_l {
		color: #EB504B;
	}

	.title_r {
		color: #333;
		font-size: 28upx;
		// margin-left: 5upx;
	}

	.cont {
		background: #fff;
		height: 90upx;
		padding: 0 32upx;
		display: flex;
		align-items: cener;

	}

	.conts {
		background: #fff;
		height: 200upx;
		padding: 20upx 32upx;
		/* display: flex; */
		/* align-items: cener; */

	}

	.btn {
		position: fixed;
		bottom: 100upx;
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.btn_cont {
		width: 80%;
		height: 80upx;
		background: #1F64FF;
		border-radius: 12upx;
		color: #fff;
		font-weight: 500;
		font-size: 26upx;
		line-height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.right_img {
		width: 24upx;
		height: 24upx;
		// margin-right: 25upx;
	}
</style>