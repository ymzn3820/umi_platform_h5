<template>
	<view class="container">
		<view class="top">
			<view class="avatar">
				<image class="user_avatar" :src="avatarUrl" mode=""></image>
			</view>
			<view class="info">
				<view class="info_name">{{ userInfo.nick_name }}</view>
				<view class="info_phone" v-if="userInfo.mobile != ''">
					<image class="phone_img" src="@/static/user/phone.png" mode=""></image>
					<text class="phone">{{ userInfo.mobile }}</text>
				</view>
			</view>
		</view>
		
		<view class="cont">
			<image class="cont_img" :src="upbackgroundImg" mode=""></image>
			<view class="cont_top">
				<div class="top">
					<view class="top_type">
						<view class="type_l">
							<image class="type_img" :src= "topImg" mode=""></image>
							<text class="type_text" v-if="infoList.d_level == 1">普通分销</text>
							<text class="type_text" v-if="infoList.d_level == 2">金牌分销</text>
							<text class="type_text" v-if="infoList.d_level == 3">服务商</text>
						</view>
						<view class="type_r">我的成员(个)：{{ infoList.member }}</view>
					</view>
					
					<view class="cont_type">
						<view class="cont_l">
							<view class="l_top">
								<text class="l_icon">￥</text>
								<text class="l_price">{{ infoList.withdraw_balance }}</text>
							</view>
							<view class="l_btn">可提现佣金(元)</view>
						</view>
						<view class="cont_r">
							<view class="l_top">
								<text class="l_icon">￥</text>
								<text class="l_price">{{ infoList.count_balance }}</text>
							</view>
							<view class="l_btn">累计佣金(元)</view>
						</view>
					</view>
				</div>
			</view>
			
			<view class="link">
				
				<view class="link_cont" @click="toShare">
					<image class="link_img" :src= "linkImg2" mode=""></image>
					<text class="link_text">分享邀请</text>
				</view>
				
				<view class="link_cont" @click="toGrade">
					<image class="link_img" :src= "linkImg1" mode=""></image>
					<text class="link_text">升级分销</text>
				</view>
				
				<view class="link_cont" @click="toCash">
					<image class="link_img" :src= "linkImg3" mode=""></image>
					<text class="link_text">提现申请</text>
				</view>
				
				<view class="link_cont" @click="sloveShow = true">
					<image class="link_img" :src= "linkImg" mode=""></image>
					<text class="link_text">分佣说明</text>
				</view>
			</view>
		</view>
		
		<view class="member">
			<image class="member_img" :src= "memberImg" mode="" @click="toGrade"></image>
		</view>
		
		<view class="cont">
			<view class="lists" @click="myStaff">
				<image class="tip_img" :src='shareImg' />
				<view class="txt">我的成员</view>
				<image class="lists_img right_img" src='@/static/images/right.png' />
			</view>
			
			<view class="lists" @click="myMission">
				<image class="tip_img" :src='shareImg1' />
				<view class="txt">分佣明细</view>
				<image class="lists_img right_img" src='@/static/images/right.png' />
			</view>
			
			<view class="lists" @click="myCash">
				<image class="tip_img" :src='shareImg2' />
				<view class="txt">提现记录</view>
				<image class="lists_img right_img" src='@/static/images/right.png' />
			</view>
		</view>
		
		<u-popup :show="sloveShow" mode="bottom" :round="10" @close="sloveShow=false">
			<view class="popup_cont">
				<view class="cont_title">
					<image class="title_img" :src='sloveImg' />
					<text class="title_text">分佣说明</text>
				</view>
				
				<view style="padding: 0 15upx;">
					<!-- <view class="cont_text" style="background: rgba(31, 100, 255, 0.1);">
						<view class="cont_slove" style="background: #1F64FF; color: #fff;">普通用户</view>
						<view class="slove_text">注册完成后即为金牌分销，享受利润分佣。</view>
					</view> -->
					
					<view class="cont_text" style="background: rgba(255, 158, 75, 0.1);">
						<view class="cont_slove" style="background: linear-gradient(180deg, #FFC869 0%, #FF9545 100%); color: #fff;">金牌分销</view>
						<view class="slove_text">注册完成后即为金牌分销，享受利润分佣。成为金牌分销后，且成功邀请1位新人注册成为我的成员后，可享受成员充值分佣，您的成员充值您都将获得15%佣金。</view>
					</view>
					
					<view class="cont_text" style="background: #FFF9E6;">
						<view class="cont_slove" style="background: linear-gradient(138.05deg, #FBE363 0.23%, #FEBF37 99.7%);; color: #fff;">普通分销</view>
						<view class="slove_text">充值99元您将升级成为钻石分销，佣金由15%提升到30%，享有更高佣金福利。</view>
					</view>
					
					<view class="cont_text" style="background: rgba(103, 212, 189, 0.1);">
						<view class="cont_slove" style="background: linear-gradient(180deg, #73E6DD 0%, #5FC8A7 100%); color: #fff;">服务商</view>
						<view class="slove_text">申请升级为服务商，您将享有更高佣金和权利。</view>
					</view>
				</view>
				
				<view class="close_btn" @click="sloveShow=false">关闭</view>
				
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { getDistribution } from '@/apis/user.js'

	export default {
		data() {
			return {
				isClick: true,
				sloveShow: false,
				userInfo: JSON.parse(uni.getStorageSync('userInfo')),
				infoList: '',
				avatarUrl: '',
				upbackgroundImg: global.baseImg+'/xcx/4f306ab8-456a-4142-8f7a-7d7d8aff992a.jpg',
				topImg: global.baseImg+'/xcx/a55571de-632d-4304-b72d-33d1fbd60168.jpg',
				linkImg: global.baseImg+'/xcx/8e0c8983-daad-4187-b8bb-23d11bac7677.jpg',
				linkImg1: global.baseImg+'/xcx/9a8e0e98-8726-459c-b64e-892962e665a5.jpg',
				linkImg2: global.baseImg+'/xcx/de6d97cc-a80b-4cae-b0f9-7f608b50277a.jpg',
				linkImg3: global.baseImg+'/xcx/858d6a9f-fb00-4f09-850d-9c57c3f4d92b.jpg',
				memberImg: global.baseImg+'/xcx/com/message_center/fx.png',
				shareImg: global.baseImg+'/xcx/9cfc7355-5f8c-49c1-9159-8eb394411a5b.jpg',
				shareImg1: global.baseImg+'/xcx/d1930e48-083d-467a-836b-49d812996f0c.jpg',
				shareImg2: global.baseImg+'/xcx/c1514003-aeaa-44f8-b4df-942bddde95cd.jpg',
				sloveImg: global.baseImg+'/xcx/4112efd7-e766-4e67-acd6-8a89a0a0b32d.jpg',
				
			}
		},
		components: {
			
		},
		onLoad() {

		},
		onShow() {
			this.getDistribution()
			this.avatarUrl = global.baseImg+ '/'+ uni.getStorageSync("avatarUrl");

		},
		methods: {
			
			// 提现申请
			toCash() {
				uni.navigateTo({
					url: '/childPage/distribution/cash',
				})
			},
			// 升级分销
			toGrade() {
				uni.navigateTo({
					url: '/childPage/distribution/grade',
				})
			},
			//分享
			toShare() {
				uni.navigateTo({
					url: '/childPage/distribution/share',
				})
			},
			//我的成员
			myStaff() {
				uni.navigateTo({
					url: '/childPage/distribution/staff',
				})
			},
			//分佣明细
			myMission() {
				uni.navigateTo({
					url: '/childPage/distribution/mission',
				})
			},
			// 体现记录
			myCash() {
				uni.navigateTo({
					url: '/childPage/distribution/withdrawal',
				})
			},
			getDistribution() {
				getDistribution().then(res => {
					if (res.code == 20000) {
						this.infoList = res.data;
						uni.setStorageSync('distributionInfo', JSON.stringify(res.data));
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.container {
		padding: 30upx 24upx;
	}
	.top {
		display: flex;
		align-items: center;
		margin-bottom: 20upx;
		.avatar {
			padding-right: 10upx;
			.user_avatar {
				width:96upx;
				height: 96upx;
				border-radius: 50%;
			}
		}
		
		.info {
			padding-left: 10upx;
			.info_name {
				font-weight: 500;
				font-size: 32upx;
				line-height: 45upx;
				color: #000;
			}
			.info_phone {
				// display: flex;
				.phone_img {
					width: 16upx;
					height: 22upx;
				}
				.phone {
					font-weight: 400;
					font-size: 24upx;
					line-height: 40upx;
					color: #888;
					padding-left: 10upx;
				}
			}
		}
	}
	.cont {
		width: 100%;
		background: #fff;
		border-radius: 16upx;
		position: relative;
		.cont_img {
			width: 100%;
			height: 220upx;
		}
		.cont_top {
			width: 100%;
			height: 220upx;
			position: absolute;
			top:0;
			left: 0;
			.top {
				width: 100%;
				padding: 30upx 0;
				display: flex;
				flex-direction: column;
				.top_type {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 30upx;
					.type_l {
						display: flex;
						align-items: center;
						.type_img {
							width: 46upx;
							height: 40upx;
							margin-right: 10upx;
						}
						.type_text {
							font-weight: 500;
							font-size: 32upx;
							line-height: 48upx;
							color: #fff;
						}
					}
					.type_r {
						font-weight: 400;
						font-size: 24upx;
						line-height: 32upx;
						color: #fff
					}
				}
				
				.cont_type {
					display: flex;
					width: 100%;
					padding-top: 24upx;
					.cont_l {
						width: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						border-right: 1upx solid #d9d9d9;
					}
					.cont_r {
						width: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
					}
					.l_top {
						display: flex;
						align-items: flex-end;
						padding: 12upx 0;
						.l_icon {
							font-weight: 500;
							font-size: 22upx;
							line-height: 22upx;
							color: #fff;
							margin-bottom: 5upx;
						}
						.l_price {
							font-weight: 500;
							font-size: 40upx;
							line-height: 40upx;
							color: #fff;
						}
					}
					.l_btn {
						font-weight: 400;
						font-size: 24upx;
						line-height: 28upx;
						color: #fff;
					}
				}
				
			}
		}
		
		.link {
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding: 36upx 26upx 28upx 26upx;
			.link_cont {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				.link_img {
					width: 56upx;
					height: 56upx;
				}
				.link_text {
					font-weight: 400;
					font-size: 26upx;
					line-height: 56upx;
					color: #333;
				}
			}
		}
	}
	
	.member {
		width: 100%;
		padding: 20upx 0;
		.member_img {
			width: 100%;
			height: 236upx;
		}
	}
	
	.lists {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 20upx 20upx;
		// border-bottom: 1upx solid #f5f5f5;
	}
	
	.lists_img {
		width: 38upx;
		height: 38upx;
	}
	
	.txt {
		font-size: 34upx;
		margin-left: 20upx;
		flex: 1;
	}
	
	.tip_img {
		width: 42upx;
		height: 42upx;
	}
	
	.right_img {
		width: 24upx;
		height: 24upx;
		margin-right: 25upx;
	}
	
	.popup_cont {
		padding: 20upx 30upx;
		.cont_title {
			display: flex;
			align-items: center;
			padding-bottom: 10upx;
			.title_img {
				width: 42upx;
				height: 46upx;
			}
			.title_text {
				font-weight: 500;
				font-size: 32upx;
				line-height: 52upx;
				color: #333;
				padding-left: 18upx;
			}
		}
		
		.cont_text {
			margin-top: 46upx;
			padding: 50upx 24upx 30upx 24upx;
			position: relative;
			background: rgba(31, 100, 255, 0.1);
			border-radius: 8upx;
			.cont_slove {
				width: 140upx;
				height: 56upx;
				border-radius: 12px 0px;
				position: absolute;
				top: -28upx;
				left: 0;
				font-weight: 400;
				font-size: 28upx;
				line-height: 56upx;
				text-align: center;
			}
			.slove_text {
				font-style: normal;
				font-weight: 400;
				font-size: 28upx;
				line-height: 48upx;
				color: #434343;
			}
			
		}
		
		.close_btn {
			width: 100%;
			height: 75upx;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid #1F64FF;
			border-radius: 40px;
			margin: 20upx 0;
			font-style: normal;
			font-weight: 400;
			font-size: 32upx;
			line-height: 48upx;
			color: #1F64FF;
		}
	}
</style>