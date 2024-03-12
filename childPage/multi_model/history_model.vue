<template>
	<view>
		<view class="top">
			<view class="search">
				<u-search placeholder="搜索内容" v-model="keyword" :showAction='false' @change="search"></u-search>
			</view>
			<view class="idea" style="margin-right: 32upx;" @click="toIdea">
				<image :src="ideaImg" mode=""></image>
				<view class="text">投诉及建议</view>
			</view>
		</view>
		<view class="main">
			<scroll-view class="list_ul" scroll-y="true" v-if="chatList.length > 0">
			   <view class="main_item" v-for="(item, index) in chatList" :key="index">
					<!-- <view class="title">记录1</view> -->
					<view class="content">
						<view class="cl">话题</view>
						<view class="cr">{{ item.subject }}</view>
					</view>
					<view class="content">
						<view class="cl">时间</view>
						<view class="cr">{{ item.create_time }}</view>
					</view>
					<view class="btn">
						<view style="width: 150rpx;margin-right: 32rpx;">
							<u-button :plain="true" @click="delPhoto(item.session_code)">删除</u-button>
						</view>
						<view style='width: 204rpx;'>
							<u-button :plain="true" @click="checkDetail(item.session_code)">查看详情</u-button>
						</view>
					</view>
			   </view>
			</scroll-view>
			<view class="on_order_list" v-else>
				暂无历史记录
			</view>
					
			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
		</view>
	</view>
</template>

<script>
	import {
		getChatList, delList
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				keyword: '',
				page_no: 1,
				page_count: 10,
				chatList: [],
				loadingType: 0,
			};
		},
		onShow() {
		    this.getChatList()	
		},
		methods: {
			search() {
				this.page_no = 1;
				this.loadingType = 0;
				// this.searchValue = '';
				this.getChatList()
			},
			
			// 获取对话列表
			getChatList() {
				let val = {
					page_size: this.page_count,
					title: this.keyword,
					page: this.page_no
				}
				getChatList(val).then(res => {
					if (res.code == 20000) {
						this.chatList = res.data.data;
			
						let total = res.data.total;
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						if (this.pageTotal == 1) {
							this.loadingType = 1;
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
					title: this.keyword,
					page: this.page_no
				}
				getChatList(val).then(res => {
					if (res.code == 20000) {
			
						let total = res.data.total;
						if (total == 0) return
						let List = res.data.data;
						let addList = this.chatList;
						List.forEach(item => {
							addList.push(item);
						});
			
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
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
					content: '确定删除该记录吗？',
					success(res) {
						if (res.confirm) {
							that.delCont(code)
						}
					}
				});
			},
			
			// 删除信息
			delCont(code) {
				// console.log(val,6666)
				delList(code).then(res => {
					if (res.code == 20000) {
						this.$api.msg('删除成功')
						this.getChatList()
					} else {
						this.$api.msg(res.msg)
					}
			
				})
			
			},
			
			checkDetail(code) {
				uni.navigateTo({
					url: '/childPage/multi_model/history_detail?session_code=' + code
				})
			},
			
			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			},
			
		}
	}
</script>

<style lang="less" scoped>
	.top {
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		width: 100%;
		background-color: #fff;
		justify-content: space-between;
		align-items: center;
		height: 110rpx;
		z-index: 10;

		.search {
			width: 580rpx;
			margin-left: 30rpx;
		}

		.idea {
			position: fixed;
			top: 10rpx;
			right: 0;
			text-align: center;
			align-items: center;

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

	.main {
		padding: 0 32upx;
		margin-top: 144upx;

		.main_item {
			padding: 32rpx;
			background: #fff;
			margin-top: 24rpx;
			margin-bottom: 24rpx;

			.title {
				color: #000;
				font-size: 32rpx;
				font-weight: 500;
				margin-bottom: 26upx;
			}

			.content {
				display: flex;
				justify-content: space-between;
				margin-bottom: 30rpx;

				.cl {
					color: #A4A4A4;
					font-size: 28rpx;
				}

				.cr {
					color: #000;
					text-align: right;
					font-size: 28rpx;
					width: 75%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}

			.btn {
				display: flex;
				justify-content: flex-end;
			}
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
		width: calc(100% - 64upx);
		color: #C0C4CC;
	}
</style>