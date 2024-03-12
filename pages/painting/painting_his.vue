<template>
	<view>
		<view class="top_cont">
			<view class="search_cont">
				<view class="search">
					<image class="search_img" src="@/static/user/search.png"></image>
					<input v-model="searchValue" placeholder="请输入搜索内容" type="text" class="search_input"
						@input="search" />
				</view>
			</view>
		</view>

		<!-- 绘画历史 -->
		<view class="chat_cont">
			<scroll-view class="list_ul" scroll-y="true" v-if="chatList.length > 0"
				:style="[{marginTop: '126rpx'}]">
				<!-- <scroll-view class="list_ul" scroll-y="true" v-if="chatList.length > 0" style="margin-top: 268rpx;"> -->
				<view class="ul_style" v-for="(item, index) in chatList" :key="index"
					@click="checkDetail(item.image_code)">
					<view class="li_style">
						<view class="li_left">
							<image class="li_img"
								:src="getImgUrl(item.result_image)"></image>
						</view>
						<view class="li_right">
							<view class="li_top">
								<text class="top_l">{{ item.title }}</text>

							</view>
							<view class="li_btn">创作时间：{{ item.create_time }}</view>
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
		sdDrawList,
		getImgList
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				active: 13,
				searchValue: '',
				loadingType: 0,
				page_no: 1,
				page_count: 10,
				chatList: [],
				pageTotal: 0,
				backImg: global.baseImg + '/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg'
			}
		},
		components: {

		},
		onLoad(option) {
			console.log(option)
			// this.version_top()
			// this.version()
			// if (option.active != undefined) {
			// 	this.active_top = option.active

			// 	this.active = 9

			// 	this.page_no = 1;
			// 	this.loadingType = 0;
			// 	this.searchValue = '';
			// 	this.getChatList()
			// }

		},
		onShow() {
			this.getChatList();
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
					chat_type: this.active,
					title: this.searchValue,
					page_size: this.page_count,
					page: this.page_no
				}
				
				if (this.active < 13) {
					sdDrawList(val).then(res => {
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
					getImgList(val).then(res => {
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


			},

			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
					chat_type: this.active,
					title: this.searchValue,
					page_size: this.page_count,
					page: this.page_no
				}
				if (this.active < 13) {
					sdDrawList(val).then(res => {
						if (res.code == 20000) {

							let total = res.data.total;
							if (total == 0) return
							let List = res.data.data;
							let addList = this.chatList;
							List.forEach(item => {
								if (item.title.indexOf('(回答内容') != -1) {
									let val = item.title.indexOf('(回答内容')
									item.title = item.title.slice(0, val)
								}
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
				} else {
					getImgList(val).then(res => {
						if (res.code == 20000) {

							let total = res.data.total;
							if (total == 0) return
							let List = res.data.data;
							let addList = this.chatList;
							List.forEach(item => {
								if (item.title.indexOf('(回答内容') != -1) {
									let val = item.title.indexOf('(回答内容')
									item.title = item.title.slice(0, val)
								}
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
				}


			},


			checkDetail(code) {
				let that = this
				uni.showModal({
					// title: '模态弹窗标题',
					content: '是否延续当前对话',
					success: function(res) {
						if (res.confirm) {
							console.log(that.active, 'code');

							uni.setStorageSync('history_code', JSON.stringify({
								code,
								type: that.active
							}))
							uni.setStorageSync('tabStatus', that.active)
							uni.switchTab({
								url: '/pages/painting/painting'
							})
						} else if (res.cancel) {
							console.log('您点击了取消');
						}
					}
				});
			},

			getImgUrl(url) {
				return global.baseImg + '/' + url;
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #f6f8fb;
	}

	.top_cont {
		width: 100%;
		height: 102upx;
		position: fixed;
		top: 0;
		z-index: 10;
	}

	.search_cont {
		width: calc(100%);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20upx 25upx 0 25upx;
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
		padding: 25upx 10upx;
		// margin-top: 238upx;
		margin-bottom: 30upx;
		width: calc(100% );
	}

	.ul_style {
		display: flex;
		flex-direction: column;
		padding: 0 15upx
	}

	.li_style {
		display: flex;
		// flex-direction: column;
		align-items: center;
		background: #fff;
		/* border: 1px solid #C0C4CC; */
		box-shadow: 0upx 0upx 10upx rgba(0, 0, 0, 0.14);
		border-radius: 15upx;
		padding: 20upx;
		margin-bottom: 25upx;
		width: calc(100%);
	}



	.li_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 18upx;
	}

	.top_l {
		ont-weight: 400;
		font-size: 28upx;
		line-height: 42upx;
		color: #333;
		width: 300upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.top_r {
		ont-weight: 400;
		font-size: 24upx;
		line-height: 30upx;
		color: #6E7480;
	}

	.li_btn {
		font-weight: 400;
		font-size: 24upx;
		line-height: 35upx;
		color: #6E7480;
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


	.li_left {
		padding-right: 10upx;

		.li_img {
			width: 110upx;
			height: 110upx;
			border-radius: 50%;
		}
	}

	.li_right {
		flex: 1;
		// width: calc(100% - 160upx);
	}
</style>