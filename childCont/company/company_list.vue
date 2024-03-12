<template>
	<view>
		<u-navbar leftText="返回" title='个人/团队列表' :placeholder="true" @leftClick="backIndex"> </u-navbar>
		<view class="cont_title" v-if="companyList.length > 0">点击切换个人或/团队/企业</view>
		<!-- 内容 -->
		<view class="chat_cont">
			<scroll-view class="list_ul" scroll-y="true" v-if="companyList.length > 0">
				<view class="ul_style" v-for="(item, index) in companyList" :key="index"
					@click="checkDetail(item, index)">
					<view class="li_style">
						<view class="ul_img" v-if="item.icon_url != ''">
							<image class="avatar_img" :src="getImgUrl(item.icon_url)"></image>
						</view>
						<view class="ul_img" v-else>
							<view class="text_img">{{ item.company_name.trim().slice(0,1) }}</view>
						</view>
						<view class="ul_right">
							<view class="li_top">
								<text class="top_l">{{ item.company_name }}</text>
							</view>
							<view class="li_btn">
								<view class="btn_color" v-if="index == 0">个人</view>
								<view class="btn_color" v-if="index > 0">团队/企业</view>
								<!-- <view @click.stop="delPhoto(item.session_code)" ><u-icon name="trash" color="#666" size="20"></u-icon></view> -->
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

			<view class="on_order_list" v-else>暂无相关团队/企业</view>

			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
		</view>

		<view class="bottom">
			<view class="bottom_cont">
				<view class="bottom_buy" @click="addCompany">新增团队/企业</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getCompanyList,
		joinMember
	} from '@/apis/user.js'
	export default {
		data() {
			return {

				loadingType: 0,
				page_no: 1,
				page_count: 10,
				companyList: [],
				pageTotal: 0,
				backImg: global.baseImg + '/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg'
			}
		},
		components: {

		},
		onLoad(option) {
			// console.log(option)
			if (option.company_code) { //企业别邀请成员第一次进来会执行以下代码
				let invite_user_code = option.user_code
				let company_code = option.company_code
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				if (userInfo.role == 'user') {
					this.join(invite_user_code, company_code)
				} else {
					uni.redirectTo({
						url: '/pages/login/login?user_code=' + invite_user_code + '&company_code=' + company_code
					})
				}
			}

		},
		onShow() {
			this.getCompanyList();
		},
		methods: {

			join(invite_user_code, company_code) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确认加入邀请吗？',
					confirmText: "加入",
					success(res) {
						if (res.confirm) {
							that.joinCont(invite_user_code, company_code)
						}
					}
				});
			},

			// 加入邀请
			joinCont(invite_user_code, company_code) {
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					'company_code': company_code,
					'invite_user_code': invite_user_code,
					'user_code': userInfo.user_code
				}
				joinMember(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('您已同意加入,请等待复核通过')
						setTimeout(() => {
							uni.redirectTo({
								url: '/childCont/company/company_list'
							})
						}, 1500);
					} else {
						this.$api.msg(res.msg)
					}

				})

			},


			// 获取团队列表
			getCompanyList() {

				getCompanyList().then(res => {
					if (res.code == 20000) {
						if (res.data != null) {
							this.companyList = [{
								company_code: "0",
								company_name: "个人",
								icon_url: ""
							}]
							if (res.data.length > 0) {
								this.companyList = this.companyList.concat(res.data);
							}
						}

					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取团队信息失败');
				})
			},

			checkDetail(item, index) {
				if (index > 0) {
					uni.navigateTo({
						url: '/childCont/company/know_list?item=' + JSON.stringify(item),
					})
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}

			},

			//添加公司团队信息
			addCompany() {
				uni.navigateTo({
					url: '/childCont/company/add_info',
				})
			},

			// 返回个人中心
			backIndex() {
				uni.switchTab({
					url: '/pages/user/user'
				})
			},

			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #f6f8fb;
	}

	.cont_title {
		color: #000;
		font-size: 30upx;
		font-style: normal;
		font-weight: 500;
		text-align: center;
		padding: 20upx 0;
	}

	.list_ul {
		padding: 25upx 10upx 120upx 10upx;
		margin-bottom: 30upx;
	}

	.ul_style {
		display: flex;
		flex-direction: column;
		padding: 15upx 20upx;
	}

	.li_style {
		display: flex;
		align-items: center;
		box-shadow: 0upx 0upx 10upx rgba(0, 0, 0, 0.14);
		border-radius: 10upx;
		padding: 20upx;
		width: 100%;

		.ul_right {
			flex: 1;
		}

		.ul_img {
			padding: 10upx;

			.avatar_img {
				width: 80upx;
				height: 80upx;
				border-radius: 8upx;
			}

			.text_img {
				width: 80upx;
				height: 80upx;
				border-radius: 8upx;
				color: #fff;
				font-size: 32upx;
				background: #1F64FF;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.li_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8upx;
	}

	.top_l {
		font-weight: 400;
		font-size: 28upx;
		line-height: 42upx;
		color: #000;
		width: 70%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.top_r {
		font-weight: 400;
		font-size: 24upx;
		line-height: 30upx;
		color: #6E7480;
	}

	.li_btn {
		font-weight: 400;
		font-size: 24upx;
		line-height: 35upx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.btn_color {
			color: #1F64FF;
			font-size: 24upx;
			font-weight: 400;
			line-height: 150%;
			border-radius: 8upx;
			background: #E5EDFF;
			padding: 2upx 10upx;

		}
	}

	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100vw;
	}

	.order_img {
		width: 450upx;
		height: 450upx;

	}

	.on_order_list {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28upx;
		height: 100upx;
		line-height: 100upx;
		width: 100vw;
		color: #C0C4CC;
	}

	.bottom {
		width: 100%;
		position: fixed;
		bottom: 0upx;
		background: #fff;
		padding: 20upx 0;

		.bottom_cont {
			width: 100%;
			display: flex;
			justify-content: center;
			flex-direction: column;
		}

		.bottom_buy {
			width: 80%;
			height: 80upx;
			background: #1F64FF;
			border-radius: 6px;
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 14px;
			line-height: 20px;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: auto;
		}
	}
</style>