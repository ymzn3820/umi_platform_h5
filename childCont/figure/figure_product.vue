<template>
	<view>
		<view class="chat_cont">
			
			<scroll-view class="list_ul" scroll-y="true" v-if="figureList.length > 0">
				<view class="ul_style" v-for="(item, index) in figureList" :key="index">
					<view class="li_style">
						<view class="ul_right" @click="toDetail(item.live_code)">
							<view class="li_top">
								<text class="top_l">{{ item.live_name }}</text>
							</view>
							<view class="li_btn">
								<view class="btn_l">价格</view>
								<view class="btn_r">￥1999</view>
							</view>
							
							<view class="li_btn">
								<view class="btn_l">状态</view>
								<view class="btn_r">
									<text style="color: #f9ae4d" v-if="item.make_status == 1">待支付</text>
									<text style="color: #32BE48" v-if="item.make_status == 0">支付完成</text>
								</view>
							</view>
							<view class="li_btn">
								<view class="btn_l">创建时间</view>
								<view class="btn_r">{{ item.create_time }}</view>
							</view>
							
							<view class="li_edit" v-if="item.make_status == 1">
								<!-- <view class="edit_l">删除</view> -->
								<view class="edit_r" @click.stop="editInfo(item.live_code)">编辑</view>
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

	</view>
</template>

<script>
	import {
		getHumanList
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				loadingType: 0,
				page_no: 1,
				page_count: 10,
				figureList: [],
				pageTotal: 0,
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg',
				addImg: global.baseImg+'/xcx/01fece57-06c7-4eff-ab60-671230d86f80.jpg'
			}
		},
		
		components: {
		},
		onLoad(option) {
         
		},
		onShow() {
			
		},
		created() {
			this.getHumanList()
		},
		methods: {
			
			// 获取数字人列表
			getHumanList() {
				let val = {
					page_size: this.page_count,
					page: this.page_no,
					live_type: 1
				}
				getHumanList(val).then(res => {
					if (res.code == 20000) {
						this.figureList = res.data.data;
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
					this.$api.msg('获取失败');
				})
			},

			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
					page_size: this.page_count,
					page: this.page_no,
					live_type: 1
				}
				getHumanList(val).then(res => {
					if (res.code == 20000) {

						let total = res.data.total;
						if (total == 0) return
						let List = res.data.data;
						let addList = this.figureList;
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
					this.$api.msg('获取失败');
				})
			},
			
			toDetail(code) {
				uni.navigateTo({
					url: '/childCont/figure/video_detail?live_code='+ code,
				})
			},
			
			editInfo(code) {
				uni.navigateTo({
					url: '/childCont/figure/figure_file?live_code='+ code,
				})
			}
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
		height: 80vh;
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
			background:  #1F64FF;
			color: #fff;
			text-align: center;
			font-size: 28upx;
			font-style: normal;
			font-weight: 600; 
		}
	}
	
</style>