<template>
	<view style="margin: 16rpx;">
		<view class="robot">
			<image class="pic" :src="log" mode="widthFix"></image>
			<view class="title">
				<view class="title_top">Hi，你好，我是小秘</view>
				<view class="title_bot">全新功能，即刻体验</view>
			</view>
			<view>
				<image class="watchImg" :src="watchImg" mode=""></image>
			</view>
		</view>
		<u-search placeholder="搜索你想要的内容" v-model.trim="searchKeyword" shape="square" :showAction='false' bgColor='#fff'
			@change="searchTitle"></u-search>



		<view style="display: flex;justify-content: space-between;">
			<view class="tab">全部功能</view>
			<view style="color: #1F64FF;font-size: 26rpx;line-height: 500%;" @click="toHis">历史记录</view>
		</view>
		<view class="grid" v-if="filterList==''">

			<view class='grid_item' v-for="item,index in contentList" :key="index" @click="goToLab(item.chatId)">
				<image class='img' :src="item.vis" mode="widthFix"></image>
				<view class="title">{{item.name}}</view>
			</view>
		</view>
		<view class="grid" v-else>

			<view class='grid_item' v-for="item,index in filterList" :key="index" @click="goToLab(item.chatId)">
				<image class='img' :src="item.vis" mode="widthFix"></image>
				<view class="title">{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				log: global.baseImg + '/xcx/com/message_center/Frame%20427320411.png',
				watchImg: global.baseImg + '/xcx/com/message_center/AI%E8%A7%86%E8%A7%89%E7%AE%A1.png',
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				// 视觉体验馆
				searchKeyword: '',

				contentList: [{
						name: 'AI35',
						vis: global.baseImg + '/xcx/com/message_center/30.png',
						chatId: 0
					},
					{
						name: 'AI40',
						vis: global.baseImg + '/xcx/com/message_center/40.png',
						chatId: 1
					},
					{
						name: 'Claude',
						vis: global.baseImg + '/xcx/com/message_center/%E5%85%8B%E9%B2%81%E5%BE%B7.png',
						chatId: 7
					},
					{
						name: 'Stable Diffusion',
						vis: global.baseImg + '/xcx/com/message_center/%E6%99%BA%E6%99%AEI.png',
						chatId: 9
					},
					{
						name: 'Midjourney',
						vis: global.baseImg + '/xcx/com/message_center/%E6%99%BA%E6%99%AEAI.png',
						chatId: 6
					},
					{
						name: 'DALL.E-3',
						vis: global.baseImg + '/xcx/com/message_center/30.png',
						chatId: 15
					},

				],
				filterList: []
			}
		},

		methods: {
			goToLab(num) {

				if (num === 0 || num === 1 || num === 7) {
					uni.setStorageSync('tabStatus', num)
					uni.navigateTo({
						url: "/childPage/laboratory/laboratory"
					})
				} else {
					uni.setStorageSync('labActive', num)
					uni.navigateTo({
						url: "/childPage/laboratory/labDraw"
					})
				}

			},
			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			},
			searchTitle(e) {
				if (e) {
					const keyword = this.searchKeyword.toLowerCase();
					this.filterList = this.contentList.filter(item => item.name.toLowerCase().includes(keyword));

				} else {
					this.filterList = this.contentList
					this.$forceUpdate()
				}

			},
			toHis() {
				uni.navigateTo({
					url: '/childPage/laboratory/lab_history'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.robot {
		display: flex;
		margin-bottom: 48upx;

		.pic {
			width: 96upx;
			margin-right: 24upx;
		}

		.title {
			margin-right: 100upx;

			.title_top {
				color: #242F49;
				font-size: 40upx;
				font-weight: 500;
				line-height: 150%;
			}

			.title_bot {
				color: #242F49;
				font-size: 26upx;
				line-height: 150%;
			}
		}

		.watchImg {
			width: 136upx;
			height: 115upx;
		}

	}


	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr); // 创建两列，每列占满可用空间
		grid-template-rows: repeat(3, 1fr); // 创建三行，每行占满可用空间
		grid-gap: 10px; // 设置格子之间的间距


		.grid_item {
			width: 348upx;
			height: 120upx;
			border-radius: 8upx;
			background: #FFF;
			text-align: center;
			display: flex;
			align-items: center;


			.img {
				width: 82upx;
				height: 40upx;
				margin: 0 24upx;
			}

			.title {
				color: #1D2129;
				text-align: center;
				font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
		}
	}

	.idea {
		display: flex;
		position: fixed;
		top: 0%;
		right: 4%;
		text-align: center;
		align-items: center;

		image {

			width: 28rpx;
			height: 28rpx;
			margin-right: 6rpx;
		}
	}


	.tab {
		color: #1F64FF;
		text-align: center;
		font-size: 26upx;
		font-weight: 400;
		margin: 48upx 36upx 24upx 0;
	}
</style>