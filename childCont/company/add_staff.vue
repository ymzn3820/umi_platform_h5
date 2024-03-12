<template>
	<view>
		<view class="chat_cont">
			<view class="text_conts">
				<view class="text_u">
					<text class="text_r">企业AI数字员工</text>
				</view>
				
				<view class="text_u" @click="addStaff">
					<image class="add_img" :src='addImg'/>
					<text class="add_li">企业AI数字员工</text>
				</view>
			</view>
			
			<view class="text_tip">创建一个属于企业的AI数字员工，来精准解决实际业务场景的问题，
            并且可添加多个企业AI数字员工</view>
			
			<view class="tabs">
				<view class="tabs_ul">
					<view class="tabs_index">
						<view class="index_title">1</view>
						<view class="index_text" style="color: #000; font-weight: 500;">上传知识库</view>
						<view class="index_text_active" @click="changeTab()">去上传</view>
					</view>
					<view class="tabs_line"></view>
					<view class="tabs_index">
						<view class="index_title">2</view>
						<view class="index_text">填写项目</view>
						<view class="index_texts"></view>
					</view>
					<view class="tabs_line"></view>
					<view class="tabs_index">
						<view class="index_title">3</view>
						<view class="index_text">填写资讯</view>
						<view class="index_texts"></view>
					</view>
				</view>
				
			</view>
			
			<scroll-view class="list_ul" scroll-y="true" v-if="memberList.length > 0">
				<view class="ul_style" v-for="(item, index) in memberList" :key="index">
					<view class="li_style">
						<view class="ul_right">
							<view class="li_btn">
								<view class="btn_l">
									<view class="l_img" v-if="item.avatar_url != ''"><image class="avatar_img" :src="getImgUrl(item.icon_url)"></image></view>
									<view class="l_img" v-else><view class="text_img">{{ item.clerk_name.trim().slice(0,1) }}</view></view>
									<view class="l_title">{{ item.clerk_name }}</view>
								</view>
								<view @click.stop="delPhoto(item.clerk_code)" ><u-icon name="trash" color="#666" size="20"></u-icon></view>
							</view>
							
							<view class="li_edit">
								<view class="edit_l" @click="checkDetail(item)">编辑</view>
								<view class="edit_r" @click="addChat(item)" v-if="item.d_status == 2">开始对话</view>
								<view class="edit_r" v-if="item.d_status == 1">训练中...</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

			<view class="on_order_list" v-else>暂无相关企业数字员工</view>

			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
		</view>

	</view>
</template>

<script>
	import {
		getClerk,delClerk
	} from '@/apis/user.js'
	export default {
		props: {
			companyCode: String
		},
		data() {
			return {
				loadingType: 0,
				page_no: 1,
				page_count: 10,
				memberList: [],
				pageTotal: 0,
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg',
				addImg: global.baseImg+'/xcx/01fece57-06c7-4eff-ab60-671230d86f80.jpg'
			}
		},
		components: {
		},
		onLoad(option) {
            console.log(option)
			
			
		},
		onShow() {
		
		},
		created() {
			this.getMember()
		},
		methods: {
			// 获取成员列表
			getMember() {
				let val = {
					company_code: this.companyCode,
					page_size: this.page_count,
					page: this.page_no
				}
				getClerk(val).then(res => {
					if (res.code == 20000) {
						
						this.memberList = res.data.data;

						let total = res.data.total;
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						if (this.pageTotal == 1) {
							this.loadingType = 1;
						} else {
							this.loadingType = 0
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取对话信息失败');
				})
			},

			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
					page_size: this.page_count,
					page: this.page_no
				}
				getClerk(val).then(res => {
					if (res.code == 20000) {

						let total = res.data.total;
						if (total == 0) return
						let List = res.data.data;
						let addList = this.memberList;
						List.forEach(item => {
							addList.push(item);
						});

						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						console.log(this.pageTotal, 158)
						if (this.pageTotal <= this.page_no) {
							this.loadingType = 1
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取对话信息失败');
				})
			},

			delPhoto(code) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该数字员工吗？',
					success(res) {
					  if (res.confirm) {
						  that.delCont(code)
					  }
					}
				});
			},
			
			// 删除信息
			delCont(code) {
				let val = { 'clerk_code': code }
				console.log(val,6666)
				delClerk(val).then(res => {
					if(res.code == 20000) {
						this.$api.msg('删除成功')
						setTimeout(() => {
						   this.getMember()
						}, 1500);
					} else {
						this.$api.msg(res.msg)
					}
					
				})
				
			},
			
			//添加员工
			addStaff() {
				if(this.companyCode != 0) {
					uni.navigateTo({
						url: '/childCont/company/staff_form?company_code='+ this.companyCode,
					})
				} else {
					this.$api.msg('请点击切换更新团队或公司信息')
				}
				
			},
			
			//编辑员工
			checkDetail(item) {
				uni.navigateTo({
					url: '/childCont/company/staff_form?item='+ JSON.stringify(item),
				})
			},
			
			//上传知识库
			changeTab() {
				uni.navigateTo({
					url: '/childCont/company/add_info?company_code='+ this.companyCode,
				})
			},
			
			addChat(item) {
				uni.navigateTo({
					url: '/childCont/company/user_chat?item='+JSON.stringify(item),
				})
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
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
		padding: 15upx 10upx;
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
		padding: 25upx;
		width: 100%;
		background: #fff;
		.ul_right { flex: 1; }
	}

	.li_btn {
		font-weight: 400;
		font-size: 24upx;
		line-height: 35upx;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		width: 100%;
		.btn_l {
			display: flex;
			align-items: center;
			.l_img {
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
			.l_title {
				color: #000;
				font-size: 32upx;
				font-weight: 500;
				line-height: 150%;
				width: 70%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
		.btn_r {
			color: #000;
			font-size: 24upx;
			font-weight: 400;
			line-height: 150%;
			padding: 5upx 0upx;
			line-height: 48upx;
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
		height: 200upx;
		line-height: 200upx;
		width: 100vw;
		color: #C0C4CC;
	}
	
	.text_conts {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 20upx 30upx 0 30upx;
		.text_u {
			display: flex;
			align-items: center;
			.u_li{
				color: #9A9A9A;
				text-align: center;
				font-size: 22upx;
				font-style: normal;
				font-weight: 400;
				margin-right: 10upx;
			}
			.add_img {
				width: 38upx;
				height: 38upx;
			}
			.add_li {
				color: #1F64FF;
				font-size: 28upx;
				font-style: normal;
				font-weight: 500;
				line-height: 150%;
				padding-left: 10upx;
			}
			.qs_img {
				width: 40upx;
				height: 40upx;
				margin-left: 20upx;
			}
			.text_r {
				color: #000;
				font-size: 32upx;
				font-weight: 500;
				line-height: 50upx;
				margin-right: 10upx;
			}
		}
	}
	
	.text_tip {
		color: #666;
		font-size: 24upx;
		font-style: normal;
		font-weight: 400;
		line-height: 150%;
		width: 100%;
		padding: 20upx 30upx 0 30upx;
	}
	.li_edit {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-top: 10upx;
		width: 100%;
		.edit_l {
			padding: 10upx 30upx;
			border-radius: 8upx;
			border: 1upx solid #1F64FF;
			color: #1F64FF;
			text-align: center;
			font-size: 28upx;
			font-style: normal;
			font-weight: 600; 
			margin-right: 20upx;
			width: 46%;
		}
		.edit_r {
			padding: 10upx 30upx;
			border-radius: 8upx;
			background:  #1F64FF;
			color: #fff;
			text-align: center;
			font-size: 28upx;
			font-style: normal;
			font-weight: 600; 
			width: 46%;
		}
	}
	
	.tabs {
		
		width: 100%;
		padding: 20upx 30upx 0 30upx;
		.tabs_ul {
			display: flex;
			align-items: center;
			justify-content: space-around;
			background: #fff;
			padding: 28upx;
		}
		.tabs_index{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 20upx;
			.index_title {
				width: 40upx;
				height: 40upx;
				border-radius: 50%;
				background: #F2F3F5;
				color: #4E5969;
				font-size: 30upx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.index_text {
				color: #4E5969;
		        font-size: 26upx;
				font-weight: 400;
				line-height: 36upx;
				padding-top: 5upx;
			}
			.index_texts {
				width: 20upx;
				height: 36upx;
			}
			.index_text_active {
				color: #1F64FF;
			    font-size: 26upx;
				font-weight: 400;
				line-height: 36upx;
				padding-top: 5upx;
			}
		}
		.tabs_line {
			width: 64upx;
			height: 5upx;
			background: #E5E6EB;
			margin: 0 15upx;
		}
	}
	
	
</style>