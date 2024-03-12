<template>
	<view style="padding: 32upx;">
		
		<view class="robot">
			<view class="title">当前角色:{{role_name}}</view>
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
					<view class="middle">角色名称</view>
				</view>
			</view>
			<view style="margin-bottom: 20upx;">
				<u--input placeholder="请输入内容" border="surround" v-model="roleName"></u--input>
			</view>
			
			<view class="main_title">
				<view class="top">
					<view class="left"></view>
					<view class="middle">当前角色提示词</view>
				</view>
			</view>
			<u-textarea v-model="content" cols="30" :placeholder="placeholder"></u-textarea>
			<!-- <view style="color: #393E45;font-size: 28upx;font-weight: 500; margin-bottom: 44upx;">发言顺序: 第{{ index }}位</view> -->
			<view class="main_title">
				<view class="top">
					<view class="left"></view>
					<view class="middle">更换角色</view>
				</view>
				<view style="color: #B7B9C0;font-size: 24upx;">
					当前选择的是{{ model }}，{{ count }}w算力/{{ untils }}
				</view>
			</view>
			<view class="roleList">
				<view class="roleItem" v-for="item,index in roleList" :key="index"
					:style="[{border:(active== index ? '2rpx solid #1F64FF':'2rpx solid #DBDBDB')}]"
					@click="roleChange(index)">

					<view style="margin-top: 40upx;">
						<image :src="getImgUrl(item.logo)"></image>
					</view>
					<view class="role_name">{{item.model}}</view>
					<view class="role_remark">{{item.consume_points}}w算力/{{ item.unit }}</view>
				</view>
			</view>

		</view>
		<view class="bottom" v-if="role_type == 2">
			<u-button type="primary" text="确认" @click="submit"></u-button>
		</view>
	</view>
</template>

<script>
	import {
		editChatRole, getModel, getRoleDetail
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				log: global.baseImg + '/xcx/com/message_center/Frame%20427320411.png',
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				hisImg: global.baseImg + '/xcx/com/message_center/clock.png',
				role_code: '',
				content: '',
				placeholder: '在此给当前角色一个指令，你可以这样填：现在我们在模拟参加一个群聊，其中你扮演的角色是小文，请不要出现关于小文字样的内容，你是理性且稳重的。',
				active: 0,
				roleList: [],
				roleName: '',
				role_type: 0,
				role_name: '',

                model: '文心一言',
				count: 3.6,
				untils: '1k token'
			};
		},
		onLoad(option) {
			if(option.role_code) {
				this.role_code = option.role_code
			}
			
			if(option.content) {
				this.chat_cont = option.content
			}
		},
		onShow() {
			this.getModel()
		},
		methods: {
			//获取角色详情
			getRoleDetail() {
				let code = this.role_code
				getRoleDetail(code).then(res => {
					if (res.code == 20000) {
						this.roleList.forEach( (val, index) => {
							this.content = res.data.covert_content
							this.roleName = res.data.role_name
							this.role_name = res.data.role_name
							this.role_type = res.data.role_type
							if(val.model_name == res.data.model) {
								this.active = index
								this.model = this.roleList[index].model
								this.count = this.roleList[index].consume_points
								this.untils = this.roleList[index].unit
							}
						})
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})
				
			},
			//获取对话模型
			getModel() {
				getModel().then(res => {
					if (res.code == 20000) {
					  this.roleList = res.data;
					  this.getRoleDetail()
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
			roleChange(index) {
				this.active = index
				this.model = this.roleList[index].model
				this.count = this.roleList[index].consume_points
				this.untils = this.roleList[index].unit
			},
			toHis(){
				uni.navigateTo({
					url:'/childPage/multi_model/history_model'
				})
			},
			submit() {
				if(this.roleName == '') {
					 return this.$api.msg('请填写角色名称')
				}
				
				if(this.content == '') {
					 return this.$api.msg('请填写角色提示词')
				}
				let val = { 
					"role_name": this.roleName,        //# 角色名称
					"chat_type": this.roleList[this.active].chat_type,    //# 对话类型，必传，具体说明见下方模型对话接口文档
					"model": this.roleList[this.active].model_name,        //# 对话模型，必传，具体说明见下方模型对话接口文档 
					"role_logo": this.roleList[this.active].logo,    //# 角色头像
					"covert_content": this.content,
					"role_code": this.role_code
				}
				editChatRole(val).then(res => {
					if (res.code == 20000) {
					   this.$api.msg('修改成功');
					   setTimeout(() => {
					   	uni.navigateTo({
					   		url: '/childPage/multi_model/multi_model_next?content='+ this.chat_cont
					   	})
					   }, 1500)
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})
				
			},
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
		}
	}
</script>

<style lang="less" scoped>
	.robot {
		display: flex;
	    align-items: center;
		justify-content: space-between;
		.title {
			color: #242F49;
			font-size: 40upx;
			font-weight: 500;
			line-height: 150%;
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
	
	textarea {
		padding: 24rpx 32rpx;
		border: 2rpx solid #D7D9DF;
		border-radius: 8px;
		margin-bottom: 20rpx;
	}

	.main {
		background-color: #fff;
		padding: 30upx 20upx 130upx 20upx;
		margin-top: 20upx;

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

		.roleList {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
            padding: 20upx;
			.roleItem {
				width: 190upx;
				height: 220upx;
				border-radius: 14.5upx;
				border: 2upx solid #DBDBDB;
				background: #FFF;
				text-align: center;
				margin-bottom: 26upx;

				image {
					width: 73upx;
					height: 79upx;
				}

				.role_name {
					color: #000;
					font-size: 24upx;
				}

				.role_remark {
					color: #999;
					font-size: 20upx;
				}
			}
		}
	}

	.bottom {
		position: fixed;
		width: 82%;
		bottom: 0;
		background-color: #FFF;
		padding: 40upx;

	}
</style>