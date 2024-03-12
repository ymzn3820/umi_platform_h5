<template>
	<view style="padding: 32upx;">
		<view class="robot">
			<view class="robot_text">
				<image class="pic" :src="log" mode="widthFix"></image>
				<view class="title">Hi，你想要聊些什么？</view>
			</view>
			<view class="tips">
				<view class="item" style="margin-right: 42upx;" @click="toHis">
					<image :src="hisImg" mode=""></image>
					<view class="text">历史记录</view>
				</view>
				<view class="item" @click="toIdea">
					<image :src="ideaImg" mode=""></image>
					<view class="text">投诉及建议</view>
				</view>
			</view>
		</view>

		<view class="main">
			<view class="main_title">
				<view class="top">
					<view class="left"></view>
					<view class="middle">创建话题</view>
					<!-- <image @click="roleShow = true" :src="helpImg" mode=""></image> -->
				</view>
			</view>
			<textarea v-model="chat_cont" class="textarea" :placeholder="placeholder"></textarea>
			<view class="main_title">
				<view class="top">
					<view class="left"></view>
					<view class="middle">参与角色</view>
					<image @click="roleShow = true" :src="helpImg" mode=""></image>
				</view>
				<view style="color: #B7B9C0;font-size: 24upx;">
					点击下方模型可进入编辑详情，左上角数字代表发言顺序
				</view>
			</view>
			<u-scroll-list :indicator='false' style="height: 224upx;margin-bottom: 56upx;">
				<view class='roleItem' v-for="(item, index) in roleList" :key="index" @click='editRole(item.role_code)'>
					<view class="roleItem_icon">
						<view class="roleNum">{{index+1}}</view>
						<view class="roleDel" @click.stop="delRole(item.role_code)" v-if="item.role_type != 1">
							<image :src="delImg"></image>
						</view>
						<view class="roleLogo">
							<image :src="getImgUrl(item.role_logo)"></image>
						</view>
					</view>
					<view class="role_content">{{item.role_name}}</view>
				</view>
				<view class="roleLast" @click="addRole">
					<image src="/static/user/upload.png" mode=""></image>
					<view class="role_content">绑定模型</view>
				</view>
			</u-scroll-list>
			<view class="main_title">
				<view class="top">
					<view class="left"></view>
					<view class="middle">设定算力</view>
					<image :src="helpImg" mode="" @click="cptShow=true"></image>
				</view>
				<!-- <view style="color: #B7B9C0;font-size: 24upx;">
					本次互动中3个角色预计投入总算力：20.8w算力/1k token
				</view> -->
			</view>
			<!-- <view v-if="value==''" class="int">
				<view class="int_l">自定义</view>
				<u--input placeholder="请输入算力(单位w)" border="none" v-model="value" @change="change"
					color='#1F64FF'></u--input>
			</view> -->
			<view class="int" :style="[{border:(active == 4 ? '2rpx solid #1F64FF':'2rpx solid #DBDBDB')}]">
				<view class="int_l">自定义</view>
				<u--input placeholder="请输入算力(单位w)" border="none" v-model="value" @focus="focusTab" @change="change"
					color='#1F64FF'></u--input>
				<view @click="intDel" v-if="value !=''">
					<image style="width: 48upx;height: 48upx;" :src="del_xImg"></image>
				</view>
			</view>
			<view class="cpt">
				<view class="cpt_item" @click="getCount(100, 1)"
					:style="[{border:(active == 1 ? '2rpx solid #1F64FF':'2rpx solid #DBDBDB')}]">
					<view class="cpt_t">100w</view>
					<view class="cpt_b">算力</view>
				</view>
				<view class="cpt_item" @click="getCount(200, 2)"
					:style="[{border:(active == 2 ? '2rpx solid #1F64FF':'2rpx solid #DBDBDB')}]">
					<view class="cpt_t">200w</view>
					<view class="cpt_b">算力</view>
				</view>
				<view class="cpt_item" @click="getCount(300, 3)"
					:style="[{border:(active == 3 ? '2rpx solid #1F64FF':'2rpx solid #DBDBDB')}]">
					<view class="cpt_t">300w</view>
					<view class="cpt_b">算力</view>
				</view>
			</view>
			<view class="bottom">
				<u-button @click="todialogue"
					:customStyle='{"background":"#1F64FF","height":"80rpx", "border": "1rpx solid #1f64ff"}'
					type="primary" text="开始发言"></u-button>
			</view>
		</view>
		<u-modal :show="roleShow" :title="title" :content='content' :closeOnClickOverlay="true" width="592upx"
			confirmText='我知道了' confirmColor='#1F64FF' confirmButtonShape='square' @confirm='roleShow=false'
			@cancel="roleShow=false" @close="roleShow=false"></u-modal>
		<u-modal :show="cptShow" :title="cptTitle" :content='cptContent' :closeOnClickOverlay="true" width="592upx"
			confirmText='我知道了' confirmColor='#1F64FF' confirmButtonShape='square' @confirm='cptShow=false'
			@cancel="cptShow=false" @close="cptShow=false"></u-modal>
	</view>
</template>

<script>
	import {
		getChatRole,
		delChatRole
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				log: global.baseImg + '/xcx/com/message_center/Frame%20427320411.png',
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				hisImg: global.baseImg + '/xcx/com/message_center/clock.png',
				helpImg: global.baseImg + '/xcx/com/message_center/help-circle.png',
				del_xImg: global.baseImg + '/xcx/com/message_center/del_x.png',
				delImg: global.baseImg + '/xcx/com/message_center/del.png',
				value: '',
				roleShow: false,
				title: '关于发言顺序',
				content: 'Tips：发言顺序的不同将决定每个角色的发言次序不同。某个角色发言时，其他角色将停止发言，等待该角色发言完毕后，进入下一角色的发言环节，所有角色发言完毕后，该次发言结束。',
				cptShow: false,
				cptTitle: '关于算力规则',
				cptContent: '一次多模型对话的计价将根据您所选择的模型数量结合该模型的单价进行计算。每次讨论将根据您所设定的总算力进行分配，当每个角色所消耗的算力达到上限时，该模型发言自动停止，',
				roleList: [],
				count: 0,
				active: 0,
				chat_cont: '',
				txtcontent: '',
				placeholder: '请输入你想发布讨论的话题，例如:AI的前景、人工智能的优劣势...',
			};
		},
		onLoad(option) {
			if (option.content) {
				this.chat_cont = option.content
			}
		},
		onShow() {
			this.getChatRole()
		},
		methods: {
			getChatRole() {
				getChatRole().then(res => {
					if (res.code == 20000) {
						this.roleList = res.data.data;
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})

			},
			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			},

			delRole(code) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该角色吗？',
					success(res) {
						if (res.confirm) {
							that.roleDelClick(code)
						}
					}
				});
			},
			roleDelClick(code) {

				delChatRole(code).then(res => {
					if (res.code == 20000) {
						this.getChatRole()
						this.$api.msg('删除成功')
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})
			},
			intDel() {
				this.value = ''
			},
			editRole(code) {
				uni.navigateTo({
					url: `/childPage/multi_model/editRole?role_code=${code}` + '&content=' + this.chat_cont
				})
			},
			addRole() {
				// let length = this.roleList.length + 1
				uni.navigateTo({
					// url: '/childPage/multi_model/addRole?index='+length
					url: '/childPage/multi_model/addRole?content=' + this.chat_cont
				})
			},
			focusTab() {
				this.active = 4
			},
			change(e) {
				this.count = this.value
			},
			getCount(val, tip) {
				this.count = val
				this.active = tip
			},
			toHis() {
				uni.navigateTo({
					url: '/childPage/multi_model/history_model'
				})
			},
			todialogue() {
				if (this.roleList.length == 0) {
					return this.$api.msg('请先设定参与角色')
				}
				if (this.count == 0) {
					return this.$api.msg('请先设定算力')
				}
				uni.navigateTo({
					url: '/childPage/multi_model/model_dialogue?content=' + this.chat_cont + '&count=' + this.count
				})
			},
			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},
		}
	}
</script>

<style lang="less" scoped>
	.robot {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.robot_text {
			display: flex;
			align-items: center;
			justify-content: center;

			.pic {
				width: 60upx;
				height: 60upx;
			}

			.title {
				color: #242F49;
				font-size: 36upx;
				font-weight: 500;
				line-height: 150%;
			}
		}

		.tips {
			display: flex;
			align-items: center;
			justify-content: center;

			.item {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				image {
					width: 48upx;
					height: 48upx;
				}

				.text {
					color: #3F3F3F;
					font-size: 22upx;
					font-weight: 400;
					line-height: 150%;
				}
			}

		}
	}

	.main {
		padding: 40upx;
		background-color: #fff;
		height: 90vh;
		margin-top: 52rpx;

		.main_title {
			margin-bottom: 34upx;

			.top {
				display: flex;
				align-items: center;

				.left {
					width: 3px;
					height: 18px;
					background: #1F64FF;
				}

				.middle {
					color: #393E45;
					font-size: 32upx;
					font-weight: 600;
					margin: 0 20upx 0 16upx;
				}

				image {
					width: 32upx;
					height: 32upx;
				}
			}
		}

		.roleItem {
			margin-right: 32upx;
			text-align: center;

			.roleItem_icon {
				width: 150upx;
				height: 150upx;
				border-radius: 14.5upx;
				border: 2upx solid #DBDBDB;
				background: #FFF;
				position: relative;
				text-align: center;

				.roleNum {
					width: 37rpx;
					height: 37rpx;
					background: #1F64FF;
					border-radius: 50%;
					color: #FFF;
					font-size: 26rpx;
					font-weight: 500;
					position: absolute;
					top: 10rpx;
					left: 10rpx;
				}

				.roleDel {
					position: absolute;
					right: -6upx;
					top: -6upx;

					image {
						width: 40upx;
						height: 40upx;
					}
				}

				.roleLogo {
					position: absolute;
					top: 28%;
					left: 23%;

					image {
						width: 80upx;
						height: 80upx;
						border-radius: 50%;
					}
				}
			}


		}

		.role_content {
			color: #000;
			font-size: 24upx;
			font-weight: 400;
			line-height: 150%;
		}

		.roleLast {
			text-align: center;

			image {
				width: 150upx;
				height: 150upx;
			}
		}

		.int {
			display: flex;
			padding: 36rpx 48rpx;
			border: 3rpx solid #E8EAEC;
			border-radius: 17upx;

			.int_l {
				margin-right: 144rpx;
				color: #222;
				font-size: 28upx;
				font-weight: 400;
			}
		}

		.int2 {
			display: flex;
			padding: 36rpx 48rpx;
			border: 3rpx solid #1F64FF;
			border-radius: 17upx;

			.int_l {
				margin-right: 144rpx;
				color: #222;
				font-size: 28upx;
				font-weight: 400;
			}
		}
	}

	.cpt {
		display: flex;
		margin-top: 26rpx;
		justify-content: space-between;

		.cpt_item {
			width: 180upx;
			height: 180upx;
			border-radius: 17upx;
			border: 2upx solid #E8EAEC;
			text-align: center;
			align-items: center;

			.cpt_t {
				color: #1F64FF;
				font-size: 44rpx;
				font-weight: 700;
				margin-top: 50upx;
			}

			.cpt_b {
				color: #999;
				font-size: 24upx;
			}
		}
	}

	.bottom {
		position: fixed;
		width: 82%;
		bottom: 21rpx;
	}

	.textarea {
		width: 90%;
		height: 170rpx;
		padding: 24rpx 34rpx;
		border: 2rpx solid #D7D9DF;
		border-radius: 8px;
		margin-bottom: 20rpx;
	}
</style>