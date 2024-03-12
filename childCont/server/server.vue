<template>
	<view class="server">
		<view class="heade">
			<image :src="serverBg" class="serverBg"></image>
			<view class="logo">
				<image :src="log" class="logo_img"></image>
				<view class="logo_text">无忧秘书智脑</view>
			</view>
			<view class="main_text">Stable Diffusion服务器</br>
				租赁&购买</view>
			<view class="bot_text">限时特价优惠</view>
		</view>
		<view class="main">
			<view class="plate" style="margin-top: -510rpx;">
				<view class="pal_tit"
					:style="{background: 'url('+ pal_tit_img +')', 'background-size': '432rpx 58rpx'}">
					1. AI绘画专用主机购买</view>
				<view class="price" style='display: flex;justify-content: space-between;align-items: baseline;'>
					<view class="price_l" style="display: flex;">
						<view style="color: #3F3F3F;font-size: 26rpx;">原价：</view>
						<del style="color: #3F3F3F;font-size: 30rpx;font-weight: 500;">￥9800</del>
					</view>
					<view class="price_r" style="display: flex;display: flex;align-items: baseline;">
						<view style="color: #000;font-size: 26rpx;">限时特价优惠:</view>
						<view style="color: #FF2727;font-size: 52rpx;">￥6980</view>
					</view>
				</view>
				<view class="table">
					<view class="tabal_tr">AIGC高性能算力主机</view>
					<view class="tabal_th">
						<view class="th_l">CPU</view>
						<view class="th_r">12核24线程</view>
					</view>
					<view class="tabal_th">
						<view class="th_l">内存</view>
						<view class="th_r">32G</view>
					</view>
					<view class="tabal_th">
						<view class="th_l">GPU</view>
						<view class="th_r" style="display: flex;">12G独立显存<view style="color: #1F64FF;">（RTX3060）</view>
						</view>
					</view>
					<view class="tabal_th">
						<view class="th_l">硬盘</view>
						<view class="th_r" style="display: flex;">
							<view style="color: #1F64FF;">1TB</view>高速固态SSD
						</view>
					</view>

					<view class="tabal_th">
						<view class="th_l">主板</view>
						<view class="th_r">intel芯片旗舰主板</view>
					</view>
					<view class="tabal_th">
						<view class="th_l">电源</view>
						<view class="th_r">650W高效能</view>
					</view>
					<view class="tabal_th">
						<view class="th_l">机箱</view>
						<view class="th_r">高品质商务机箱 结实耐用</view>
					</view>
					<view class="tabal_b">
						<view class="b_head">满足多场景的AIGC算力需求：</view>
						<view class="b_text">运行SD（stable Diffusion），3s出图；</br>
							高效率sd lora模型训练；</br>
							可运行AI大语言模型（chatglm3），离线对话；</br>
							可运行虚拟数字人，高性能直播数字人算力主机</br>
							跑分35万+，高性能光追显卡，畅玩吃鸡等3D大型游戏</view>
					</view>
				</view>
				<view class="tip">
					<view class="tip_top">买即送</view>
					<view class="tip_txt">商务键盘鼠标*1，21英寸高清显示器*1</view>
				</view>
				<view class="tip">
					<view class="tip_top">预安装</view>
					<view class="tip_txt">SD（stable Diffusion）软件，超过20个模型；</br>
						AI大语言模型chatglm3，离线对话，不用付第三方费用；</view>
				</view>
				<view class="tip">
					<view class="tip_top">送AIGC课程</view>
					<view class="tip_txt">1.超过32集AIGC课程，包含入门、初级、中级、进阶、高级，
						五个章节，后续持续更新；</br>
						2.SD课程16集，包含安装、工具介绍、使用技巧、实用设计、
						模型训练，后续持续更新；</view>
				</view>
				<view class="apply">
					<view class="apply_tit">
						<view style="width: 210rpx;height: 1.5rpx;background: #0378FE;"></view>
						<view style="width: 13rpx;height: 13rpx;border-radius: 50%;border: 1.5rpx solid #0378FE;">
						</view>
						<view style="font-size: 34rpx;color: #1F64FF;font-weight:500; margin: 0 24rpx;">报名购买</view>
						<view style="width: 13rpx;height: 13rpx;border-radius: 50%;border: 1.5rpx solid #0378FE;">
						</view>
						<view style="width: 210rpx;height: 1.5rpx;background: #0378FE;"></view>
					</view>
					<view class="information">
						<view class="title">
							<text class="title_l">*</text>
							<text class="title_r">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</text>
						</view>
						<u-input :customStyle='{"padding":"16rpx 28rpx","border-radius": "16rpx",
"border": "2rpx solid #D7D9DF"}' v-model="userName" border="none" placeholder="请输入您的姓名" type="text"></u-input>
					</view>

					<view class="information">
						<view class="title">
							<text class="title_l">*</text>
							<text class="title_r">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话</text>
						</view>
						<u--input :customStyle='{"padding":"16rpx 28rpx","border-radius": "16rpx",
"border": "2rpx solid #D7D9DF"}' v-model="phone" border="none" placeholder="请输入您的电话" type="text"></u--input>
					</view>
					<view class="btn" @click="submit(1)">提交</view>
					<view class="qrcode">
						<image :src="qrcode"></image>
					</view>
					<view class="info" style="margin-bottom: 24rpx;">
						<view class="info_text">扫码添加客服微信:{{content}}</view>
						<view class="info_r" @click="copyText(content)">点击复制</view>
					</view>
					<view class="info">
						<view class="info_text">客服电话: 19075692560</view>
						<view class="info_r" @click="call">立即拨打</view>
					</view>
				</view>
			</view>
			<view class="plate">
				<view class="pal_tit"
					:style="{background: 'url('+ pal_tit_img +')', 'background-size': '432rpx 58rpx'}">
					2. 云服务器租赁</view>
				<view class="rent_tip">
					<view class="tip_top" style="background: linear-gradient(90deg, #0B83FF 0.01%, #A5D0FF 110.8%);
">初级版</view>
					<view class="tip_b">
						<view class="b_l">RTX<view style="color: #1F64FF;">12G</view>独立显卡</view>
						<view class="b_r">
							<view style="color: #0378FE;font-size: 42rpx;font-weight: 700;">￥0.08</view>
							<view style="color: #000;font-size: 28rpx;font-weight: 500;">/分钟</view>
						</view>
					</view>
				</view>
				<view class="rent_tip">
					<view class="tip_top" style="background: linear-gradient(270deg, #FFC177 18.57%, #FFE3B5 129.47%);color: #C7751B;
								">中级版</view>
					<view class="tip_b">
						<view class="b_l">RTX<view style="color: #1F64FF;">16G</view>独立显卡</view>
						<view class="b_r">
							<view style="color: #0378FE;font-size: 42rpx;font-weight: 700;">￥0.12</view>
							<view style="color: #000;font-size: 28rpx;font-weight: 500;">/分钟</view>
						</view>
					</view>
				</view>
				<view class="rent_tip">
					<view class="tip_top" style="background: linear-gradient(270deg, #171614 18.57%, #5D4B36 129.47%);color: #F8C587;
																">高级版</view>
					<view class="tip_b">
						<view class="b_l">RTX<view style="color: #1F64FF;">24G</view>独立显卡</view>
						<view class="b_r">
							<view style="color: #0378FE;font-size: 42rpx;font-weight: 700;">￥0.2</view>
							<view style="color: #000;font-size: 28rpx;font-weight: 500;">/分钟</view>
						</view>
					</view>
				</view>

				<view class="apply">
					<view class="apply_tit">
						<view style="width: 210rpx;height: 1.5rpx;background: #0378FE;"></view>
						<view style="width: 13rpx;height: 13rpx;border-radius: 50%;border: 1.5rpx solid #0378FE;">
						</view>
						<view style="font-size: 34rpx;color: #1F64FF;font-weight:500; margin: 0 24rpx;">报名租赁</view>
						<view style="width: 13rpx;height: 13rpx;border-radius: 50%;border: 1.5rpx solid #0378FE;">
						</view>
						<view style="width: 210rpx;height: 1.5rpx;background: #0378FE;"></view>
					</view>
					<view class="information">
						<view class="title">
							<text class="title_l">*</text>
							<text class="title_r">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</text>
						</view>
						<u-input :customStyle='{"padding":"16rpx 28rpx","border-radius": "16rpx",
			"border": "2rpx solid #D7D9DF"}' v-model="userName" border="none" placeholder="请输入您的姓名" type="text"></u-input>
					</view>

					<view class="information">
						<view class="title">
							<text class="title_l">*</text>
							<text class="title_r">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话</text>
						</view>
						<u--input :customStyle='{"padding":"16rpx 28rpx","border-radius": "16rpx",
			"border": "2rpx solid #D7D9DF"}' v-model="phone" border="none" placeholder="请输入您的电话" type="text"></u--input>
					</view>
					<view class="btn" @click="submit(2)">提交</view>
					<view class="qrcode">
						<image :src="qrcode"></image>
					</view>
					<view class="info" style="margin-bottom: 24rpx;">
						<view class="info_text">扫码添加客服微信:{{content}}</view>
						<view class="info_r" @click="copyText(content)">点击复制</view>
					</view>
					<view class="info">
						<view class="info_text">客服电话: 19075692560</view>
						<view class="info_r" @click="call">立即拨打</view>
					</view>
				</view>
			</view>
			<view class="plate">
				<view class="pal_tit"
					:style="{background: 'url('+ pal_tit_img +')', 'background-size': '432rpx 58rpx'}">
					3. AI绘画训练营</view>
				<view class="draw_head">
					<view class="head_l">先导课免费听</view>
					<view class="head_r">你能获得什么？</view>
				</view>
				<view class="draw_gird">
					<view class="gird_item" v-for="item,index in girdList" :key="index">
						<view class="item_t">{{item.title}}</view>
						<view class="item_b">{{item.content1}}</view>
						<view class="item_b">{{item.content2}}</view>
					</view>
				</view>
				<view class="apply">
					<view class="apply_tit">
						<view style="width: 210rpx;height: 1.5rpx;background: #0378FE;"></view>
						<view style="width: 13rpx;height: 13rpx;border-radius: 50%;border: 1.5rpx solid #0378FE;">
						</view>
						<view style="font-size: 34rpx;color: #1F64FF;font-weight:500; margin: 0 24rpx;">立即报名</view>
						<view style="width: 13rpx;height: 13rpx;border-radius: 50%;border: 1.5rpx solid #0378FE;">
						</view>
						<view style="width: 210rpx;height: 1.5rpx;background: #0378FE;"></view>
					</view>
					<view class="information">
						<view class="title">
							<text class="title_l">*</text>
							<text class="title_r">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</text>
						</view>
						<u-input :customStyle='{"padding":"16rpx 28rpx","border-radius": "16rpx",
						"border": "2rpx solid #D7D9DF"}' v-model="userName" border="none" placeholder="请输入您的姓名" type="text"></u-input>
					</view>

					<view class="information">
						<view class="title">
							<text class="title_l">*</text>
							<text class="title_r">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话</text>
						</view>
						<u--input :customStyle='{"padding":"16rpx 28rpx","border-radius": "16rpx",
						"border": "2rpx solid #D7D9DF"}' v-model="phone" border="none" placeholder="请输入您的电话" type="text"></u--input>
					</view>
					<view class="btn" @click="submit(3)">提交</view>
					<view class="qrcode">
						<image :src="qrcode"></image>
					</view>
					<view class="info" style="margin-bottom: 24rpx;">
						<view class="info_text">扫码添加客服微信:{{content}}</view>
						<view class="info_r" @click="copyText(content)">点击复制</view>
					</view>
					<view class="info">
						<view class="info_text">客服电话: 19075692560</view>
						<view class="info_r" @click="call">立即拨打</view>
					</view>
					<view class="copyright">版权所有© 深圳优秘智能科技有限公司 |粤ICP备2023094291号-1|</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer_item" @click="toConsult">
				<image :src="footer1"></image>
				<view class="item_txt">咨询</view>
			</view>
			<view class="footer_item" @click="toWx">
				<image :src="footer2"></image>
				<view class="item_txt">微信</view>
			</view>
			<view class="footer_item" @click="call">
				<image :src="footer3"></image>
				<view class="item_txt">电话</view>
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
				serverBg: global.baseImg + '/xcx/com/message_center/serverbg.png',
				log: global.baseImg + '/xcx/com/message_center/Frame%20427320411.png',
				pal_tit_img: global.baseImg + '/xcx/com/message_center/servertit.png',
				qrcode: global.baseImg + '/xcx/com/message_center/serverqrcode.png',
				footer1: global.baseImg + '/xcx/com/message_center/serverzx.png',
				footer2: global.baseImg + '/xcx/com/message_center/serverwx.png',
				footer3: global.baseImg + '/xcx/com/message_center/serverdh.png',
				userName: '',
				phone: '',
				content: 'youmikf8',
				girdList: [{
						title: '高效学习',
						content1: '无需下载安装软件',
						content2: '边学边练，一站式学习'
					},
					{
						title: '资源提供',
						content1: '学完提供兼职渠道',
						content2: '渠道有保障'
					}, {
						title: '优质服务',
						content1: '随时解答学习问题',
						content2: '的1V1教务团队'
					}, {
						title: 'AI绘画',
						content1: '基础参数，风格变化',
						content2: '人物模型，动画设计'
					}, {
						title: '应用落地',
						content1: '自媒体/工作转换/',
						content2: '兴趣增收'
					}, {
						title: '专业名师',
						content1: '专业且有实战经验',
						content2: '的老师教学指导'
					},
				]
			};
		},
		methods: {
			copyText(content) {
				wx.setClipboardData({
					data: content, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功'
						})
					}
				})
			},
			submit(num) {
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
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val
				if (num == 1) {
					val = {
						"user_id": userInfo.user_id,
						'name': this.userName,
						'phone': this.phone,
						'details': this.remark,
						"type": 21,
					}
				} else if (num == 2) {
					val = {
						"user_id": userInfo.user_id,
						'name': this.userName,
						'phone': this.phone,
						'details': this.remark,
						"type": 22,
					}
				} else {
					val = {
						"user_id": userInfo.user_id,
						'name': this.userName,
						'phone': this.phone,
						'details': this.remark,
						"type": 23,
					}
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
			},
			call() {
				uni.makePhoneCall({
					phoneNumber: '19075692560',
					success: function() {
						console.log('拨打电话成功')
					},
					fail: function(err) {
						console.log('拨打电话失败:', err)
					}
				})
			},
			toConsult() {
				window.location.href =
					'https://affim.baidu.com/unique_50346956/mobile/chat?siteId=19677608&userId=50346956&siteToken=be21aa4f1401846bc61db57d7aa6743b'
			},
			toWx() {
				wx.setClipboardData({
					data: 'youmikf8', //要被复制的内容
				})
				uni.showModal({
					title: '复制微信号成功',
					content: '点击确定加微信好友，详细了解服务器',
					success: function(res) {
						if (res.confirm) {
							window.location.href = 'weixin://';
							// 在 2 秒后检查是否成功打开微信，若不成功提醒用户
							setTimeout(function() {
								if (document.hidden) {
									// alert('未能成功打开微信，请确保已经安装微信并尝试再次打开');
								}
							}, 2000);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}

				})

			},
		}
	}
</script>

<style lang="less" scoped>
	.heade {
		width: 100%;
		height: 1150rpx;

		.serverBg {
			width: 100%;
			height: 100%;
			position: relative;
		}

		.logo {
			position: absolute;
			left: 37rpx;
			top: 37rpx;
			display: flex;
			align-items: center;

			.logo_img {
				width: 40rpx;
				height: 40rpx;
			}

			.logo_text {
				color: #FFF;
				font-size: 24rpx;
				font-weight: 500;
				line-height: 150%;
				margin-left: 5rpx;
			}
		}

		.main_text {
			text-align: center;
			font-size: 62rpx;
			font-weight: 700;
			background: linear-gradient(90deg, #C7F8FD 1.9%, #E2FAFF 23.59%, #FFF 66.5%, #C6F9FC 101.21%);
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			position: absolute;
			left: 60rpx;
			top: 82rpx;
		}

		.bot_text {
			color: #3DF6FE;
			text-align: center;
			font-size: 32rpx;
			font-weight: 700;
			width: 248rpx;
			height: 51rpx;
			border-radius: 30rpx;
			background: #0011A5;
			position: absolute;
			left: 35%;
			top: 252rpx;
		}
	}

	.main {
		width: 100%;
		background: #141E92;
		padding: 0 24rpx;
		padding-bottom: 100rpx;

		.plate {
			width: 100%;
			border-radius: 16rpx;
			background: #FFF;
			position: relative;
			padding: 36rpx 24rpx;

			margin-bottom: 69rpx;

			.pal_tit {

				height: 58rpx;
				position: absolute;
				top: -29rpx;
				left: 50%;
				transform: translateX(-50%);
				color: #FFF;
				font-size: 40rpx;
				font-weight: 500;
				display: block;
				align-items: center;
				padding-left: 20rpx;
			}
		}

		.table {
			width: 100%;
			border-radius: 10rpx;
			background: #E4F5FF;
			padding-bottom: 35rpx;
			margin-top: 14rpx;

			.tabal_tr {
				width: 100%;
				height: 75rpx;
				border-radius: 10rpx 10rpx 0px 0px;
				background: #6BC8FF;
				color: #FFF;
				font-size: 32rpx;
				font-weight: 500;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.tabal_th {
				height: 62rpx;
				display: flex;
				align-items: center;
				text-align: center;
				color: #3E3E3E;
				font-size: 28rpx;
				font-weight: 400;
				border-bottom: 2rpx solid #ACE0FF;

				.th_l {
					width: 202rpx;
					text-align: center;
				}

				.th_r {
					color: #000;
					border-left: 2rpx solid #ACE0FF;
					padding-left: 60rpx;
					line-height: 215%;
				}
			}

			.tabal_b {
				margin-top: 35rpx;
				padding-left: 20rpx;

				.b_head {
					color: #3E3E3E;
					font-size: 26rpx;
					font-weight: 500;
					margin-bottom: 12rpx;
				}

				.b_text {
					color: #3E3E3E;
					font-size: 24rpx;
					font-weight: 400;
				}
			}
		}

		.tip {
			margin-top: 43rpx;

			.tip_top {
				height: 54rpx;

				border-radius: 40rpx;
				background: #78CFF9;
				color: #FFF;
				font-size: 34rpx;
				font-weight: 500;
				display: inline-block;
				align-items: center;
				justify-content: center;
				padding: 0 23rpx;
			}

			.tip_txt {
				margin-top: 10rpx;
				color: #000;
				font-size: 24rpx;
				font-weight: 400;
			}
		}

		.apply {
			margin-top: 40rpx;

			.apply_tit {
				display: flex;
				align-items: center;
			}

			.information {
				margin-bottom: 30rpx;
			}


			.title {
				display: flex;
				align-items: center;
				font-weight: 500;
				font-size: 34upx;
				line-height: 40upx;
				// padding: 20upx 41upx;
				color: #333333;
				margin-bottom: 10rpx;
			}

			.title_l {
				color: #EB504B;
			}

			.title_r {
				color: #333;
				font-size: 28upx;
				font-weight: 500;
			}

			.btn {
				display: flex;
				width: 654rpx;
				height: 88rpx;
				padding: 20rpx 48rpx;
				justify-content: center;
				align-items: center;
				gap: 20rpx;
				border-radius: 12rpx;
				background: #1F64FF;
				text-align: center;
				font-size: 34rpx;
				font-weight: 600;
				line-height: 48rpx;
				color: var(--Text-text-white, #FFF);
			}

			.qrcode {
				text-align: center;
				margin: 40rpx 0 9rpx 0;

				image {
					width: 200rpx;
					height: 200rpx;
				}
			}

			.info {
				display: flex;
				color: #000;
				font-size: 26rpx;
				padding-left: 163rpx;

				.info_r {
					color: #1F64FF;
					margin-left: 20rpx;
				}
			}
		}
	}

	.rent_tip {
		margin-bottom: 43rpx;

		.tip_top {
			height: 54rpx;
			border-radius: 40rpx;
			background: #78CFF9;
			color: #FFF;
			font-size: 34rpx;
			font-weight: 500;
			display: inline-block;
			align-items: center;
			justify-content: center;
			padding: 0 23rpx;
		}

		.tip_b {
			margin-top: 18rpx;
			width: 100%;
			height: 108rpx;
			border-radius: 10rpx;
			background: #E4F5FF;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.b_l {
				display: flex;
				align-items: center;
			}

			.b_r {
				display: flex;
				align-items: baseline;
			}
		}
	}

	.draw_head {
		display: inline-flex;
		padding-right: 206rpx;
		align-items: center;
		gap: 30rpx;
		border-radius: 30rpx;
		background: #E4F5FF;

		.head_l {
			display: flex;
			padding: 3rpx 23rpx;
			justify-content: center;
			align-items: center;
			gap: 10rpx;
			border-radius: 40rpx;
			background: #78CFF9;
			color: #FFF;
			font-size: 34rpx;
			font-weight: 500;
		}

		.head_r {
			color: #000;
			font-size: 24rpx;
			font-weight: 500;
		}
	}

	.draw_gird {
		display: flex;
		overflow: hidden;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 43rpx;

		.gird_item {
			width: 314rpx;
			height: 177rpx;
			border-radius: 10rpx;
			background: #E4F5FF;
			text-align: center;
			margin-bottom: 20rpx;

			.item_t {
				color: #0378FE;
				font-size: 36rpx;
				font-weight: 700;
				padding: 20rpx 0 14rpx 0;
			}

			.item_b {
				color: #4B4E54;
				text-align: center;
				font-size: 24rpx;
				font-weight: 400;
				line-height: 150%;
			}
		}
	}

	.copyright {
		color: #6B6B6B;
		font-size: 22rpx;
		font-weight: 400;
		line-height: 150%;
		margin-top: 40rpx;
	}

	.footer {
		width: 100%;
		display: flex;
		justify-content: space-between;
		background: #FFF;
		padding: 12rpx 24rpx;
		position: fixed;
		bottom: 0;
		left: 0;

		.footer_item {
			width: 216rpx;
			height: 96rpx;
			border-radius: 8rpx;
			background: #1F64FF;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 40rpx;
				height: 40rpx;
			}

			.item_txt {
				color: #FFF;
				font-size: 34rpx;
				font-weight: 500;
				margin-left: 16rpx;

			}
		}
	}
</style>