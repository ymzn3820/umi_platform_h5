<template>
	<view>
		<view class="top_cont">
			<view class="search_cont">
				<view class="search">
					<image class="search_img" src="@/static/user/search.png"></image>
					<input v-model="searchValue" placeholder="请输入搜索内容" type="text" class="search_input"
						@input="search" />
				</view>
				<view class="cont_tabs">
					<view class="tabs_l">
						<view @click="version_top(0)" :class="[active_top == 0 ? 'active_tabs_top' : 'tabs_top']">对话
						</view>
					</view>
					<view class="tabs_l">
						<view @click="version_top(1)" :class="[active_top == 1 ? 'active_tabs_top' : 'tabs_top']">绘画
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="active_top == 0" class="chat_cont" style="margin-top: 126rpx;">
			<scroll-view class="list_ul" scroll-y="true" v-if="chatList.length > 0">
				<view class="ul_style" v-for="(item, index) in chatList" :key="index">
					<view class="li_style">
						<view class="ul_right">
							<view class="li_top">
								<text class="top_l">{{ item.title }}</text>
							</view>
							<view class="li_btn">
								<view class="btn_l">提问者</view>
								<view class="btn_r">{{ item.nick_name }}</view>
							</view>

							<view class="li_btn">
								<view class="btn_l">创建时间</view>
								<view class="btn_r">{{ item.create_time }}</view>
							</view>

							<view class="li_edit">
								<view class="edit_l" @click.stop="delPhoto(item.session_code)">删除</view>
								<view class="edit_r" @click="checkDetail(item.session_code)">继续对话</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

			<view class="on_order" v-else>
				<image class="order_img" :src="backImg"></image>
			</view>

			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
		</view>

		<!-- 绘画历史 -->
		<view v-else class="chat_cont" style="margin-top: 126rpx;">
			<scroll-view class="list_ul" scroll-y="true" v-if="chatList.length > 0">
				<view class="ul_style" v-for="(item, index) in chatList" :key="index"
					@click="checkDetail(item.chat_type < 13 ? item.session_code : item.image_code)">
					<view class="li_style">
						<view class="liLeft" v-if="active_top == 1">
							<image class="liImg"
								:src="getImgUrl(item.chat_type < 13 ? item.content : item.result_image)"></image>
						</view>
						<view class="liRight">
							<view class="liTop">
								<text class="topL">{{ item.title }}</text>

							</view>
							<view class="liBtn">提问时间：{{ item.create_time }}</view>
						</view>
					</view>
				</view>
			</scroll-view>

			<view class="on_order" v-else>
				<image class="order_img" :src="backImg"></image>
			</view>

			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
		</view>
	</view>
</template>

<script>
	import {
		chatList,
		drawList,
		getImgList
	} from '@/apis/user.js'
	import {
		del_session
	} from '@/apis/chat.js'
	export default {
		data() {
			return {
				active_top: 0,
				searchValue: '',
				loadingType: 0,
				page_no: 1,
				page_count: 10,
				content: '',
				chatList: [],
				pageTotal: 0,
				searchValue: '',
				backImg: global.baseImg + '/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg',
			}
		},
		components: {

		},
		onShow() {
			this.getChatList();
		},
		methods: {
			// 选择版本
			version_top(val) {
				this.active_top = val;

				if (val == 1) {
					this.active = 9
				}

				this.page_no = 1;
				this.loadingType = 0;
				this.searchValue = '';
				this.getChatList()
			},

			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			},
			search() {
				this.page_no = 1;
				this.loadingType = 0;
				// this.searchValue = '';
				this.getChatList()
			},

			// 获取对话列表
			getChatList() {
				if (this.active_top == 0) {
					let val = {
						scenario_type: 'chat',
						page_size: this.page_count,
						title: this.searchValue,
						page: this.page_no
					}
					chatList(val).then(res => {
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
				} else if (this.active_top == 1) {
					let val = {
						chat_type: this.active,
						title: this.searchValue,
						page_size: this.page_count,
						page: this.page_no
					}
					if (this.active_top == 0) {
						chatList(val).then(res => {
							if (res.code == 20000) {
								res.data.data.map((item, index) => {
									if (item.title.indexOf('(回答内容') != -1) {
										let val = item.title.indexOf('(回答内容')
										item.title = item.title.slice(0, val)
									}
								})
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
					} else {
						if (this.active < 13) {
							drawList(val).then(res => {
								if (res.code == 20000) {
									res.data.data.map((item, index) => {
										if (item.title.indexOf('(回答内容') != -1) {
											let val = item.title.indexOf('(回答内容')
											item.title = item.title.slice(0, val)
										}
									})
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
						}
					}
				}
			},

			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
					scenario_type: 'chat',
					page_size: this.page_count,
					title: this.searchValue,
					page: this.page_no
				}
				chatList(val).then(res => {
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

			checkDetail(code) {
				let that = this
				uni.showModal({
					// title: '模态弹窗标题',
					content: '是否延续当前对话',
					success: function(res) {

						if (res.confirm) {
							if (that.active_top == 0) {

								uni.setStorageSync('page_code', code)
								uni.switchTab({
									url: '/pages/index/index'
								})
							} else {
								uni.setStorageSync('history_code', JSON.stringify({
									code,
									type: that.active
								}))
								uni.setStorageSync('tabStatus', that.active)
								uni.switchTab({
									url: '/pages/painting/painting'
								})
							}
						} else if (res.cancel) {
							console.log('您点击了取消');
						}
					}
				});
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
				let data = [];
				data.push(code)
				let val = {
					'session_codes': JSON.stringify(data)
				}
				// console.log(val,6666)
				del_session(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('删除成功')
						this.getChatList()
					} else {
						this.$api.msg(res.msg)
					}

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

	.top_cont {
		width: 100%;
		height: 142upx;
		background: #fff;
		position: fixed;
		top: 0;
		z-index: 10;
	}

	.search_cont {
		width: calc(100% - 50upx);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 25upx;
		background: #fff;
	}

	.search {
		width: calc(100% - 64upx);
		height: 72upx;
		background: #F6F6F6;
		border-radius: 100upx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 32upx;
		margin-bottom: 20upx;
	}

	.search_input {
		flex: 1;
	}

	.search_img {
		width: 36upx;
		height: 36upx;
	}

	.cont_tabs {
		width: 100%;
		display: flex;

	}

	.tabs_l {
		width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.active_tabs_top {
		font-style: normal;
		font-weight: 500;
		font-size: 28upx;
		line-height: 50upx;
		color: #1F64FF;
		border-bottom: 5upx solid #1F64FF;
	}

	.tabs_top {
		font-style: normal;
		font-weight: 500;
		font-size: 28upx;
		line-height: 50upx;
		color: #999;
	}

	.list_ul {
		padding: 15upx 10upx;
		margin-bottom: 30upx;
		width: calc(100% - 20upx);
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
		width: calc(102%);
		background: #fff;

		.ul_right {
			width: 100%;
		}

		.ul_img {
			padding: 10upx;

			.avatar_img {
				width: 80upx;
				height: 80upx;
				border-radius: 8upx;
			}
		}
	}

	.li_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 18upx;
		width: 80%;
	}

	.top_l {
		font-weight: 500;
		font-size: 30upx;
		line-height: 42upx;
		color: #000;
		width: 80%;
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
		font-size: 28upx;
		line-height: 35upx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.btn_l {
			color: #A4A4A4;
			font-size: 28upx;
			font-weight: 400;
			line-height: 150%;
			padding: 5upx 0upx;
			line-height: 48upx;
		}

		.btn_r {
			color: #000;
			font-size: 28upx;
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
		height: 100upx;
		line-height: 100upx;
		width: 100vw;
		color: #C0C4CC;
	}

	.li_edit {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 10upx;

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
		}

		.edit_r {
			padding: 10upx 30upx;
			border-radius: 8upx;
			background: #1F64FF;
			color: #fff;
			text-align: center;
			font-size: 28upx;
			font-style: normal;
			font-weight: 600;
		}
	}


	.top_cont {
		width: 100%;
		height: 142upx;
		background: #fff;
		position: fixed;
		top: 0;
		z-index: 10;
	}

	.listUl {
		padding: 25upx 10upx;
		// margin-top: 238upx;
		margin-bottom: 30upx;
		width: calc(100% - 20upx);
	}

	.ulStyle {
		display: flex;
		flex-direction: column;
		padding: 0 15upx
	}

	.liStyle {
		display: flex;
		// flex-direction: column;
		align-items: center;
		background: #fff;
		/* border: 1px solid #C0C4CC; */
		box-shadow: 0upx 0upx 10upx rgba(0, 0, 0, 0.14);
		border-radius: 15upx;
		padding: 20upx;
		margin-bottom: 25upx;
		width: calc(100% - 40upx);
	}



	.liTop {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 18upx;
	}

	.topL {
		ont-weight: 400;
		font-size: 28upx;
		line-height: 42upx;
		color: #333;
		width: 300upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.topR {
		ont-weight: 400;
		font-size: 24upx;
		line-height: 30upx;
		color: #6E7480;
	}

	.liBtn {
		font-weight: 400;
		font-size: 24upx;
		line-height: 35upx;
		color: #6E7480;
	}

	.liLeft {
		padding-right: 10upx;

		.liImg {
			width: 110upx;
			height: 110upx;
			border-radius: 50%;
		}
	}

	.liRight {
		flex: 1;
		// width: calc(100% - 160upx);
	}
</style>