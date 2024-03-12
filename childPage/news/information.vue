<template>
	<view style="background-color: #F2F7FE; ">
		<view class="item_infor" @click='contentChange(item.message_id)' v-for="item in aiInforList"
			:key="item.message_id">
			<view class="left">
				<view class="content">
					{{item.title}}
				</view>
				<view class="bottom">
					<text class="time">{{item.create_time.slice(0,11)}}</text>
					<view class="right">
						<text class="page_view">阅读{{item.read_count}}</text>
						<text class="like">点赞{{item.like_count}}</text>
					</view>
				</view>
			</view>
			<view class="right" v-if="item.image">
				<image class="img" :src="item.image" mode="widthFix" />
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getapplication
	} from '@/apis/home.js'
	export default {
		data() {
			return {
				aiInforList: []
			};
		},
		onShow() {
			this.getapplication()
		},
		methods: {
			// 获取ai资讯列表
			async getapplication() {

				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));

				let data = {
					user_id: userInfo.user_id,
					message_type: 2
				}
				const res = await getapplication(data)
				this.aiInforList = res.data
				console.log(this.aiInforList);

			},
			// 跳转到内容详情
			contentChange(id) {
				uni.navigateTo({
					url: '/childPage/news/information_content?message_id=' + id,
				})
			},
			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},
		}
	}
</script>

<style lang="less">
	.item_infor {
		width: 100%;
		// height: 160upx;
		flex-shrink: 0;
		display: flex;
		justify-content: space-between;
		margin-top: 38upx;
		padding: 32upx;
		background-color: #fff;


		.left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			flex-grow: 1;
			margin-right: 60upx;

			.content {
				color: #333;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				/* 21px */
			}

			.bottom {
				margin-top: 50upx;
				color: #A6A6A6;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				display: flex;
				justify-content: space-between;

				/* 18px */
				.page_view {
					margin-right: 32upx;
				}
			}

		}

		.right {
			// width: 236upx;
			// height: 160upx;
			// margin-right: 32upx;
			z-index: 999;

			.img {
				width: 236upx;
				height: 160upx;

			}

		}
	}
</style>