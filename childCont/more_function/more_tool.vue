<template>
	<view style="margin: 16rpx;">
		<u-search placeholder="搜索你想要的内容" v-model.trim="searchKeyword" shape="square" :showAction='false' bgColor='#fff'
			@change="searchTitle"></u-search>



		<view style="display: flex;justify-content: space-between;">
			<view class="tab">全部功能</view>
			<!-- <view style="color: #1F64FF;font-size: 26rpx;line-height: 500%;" @click="toHis">历史记录</view> -->
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
						name: '多模型对话',
						vis: global.baseImg + '/xcx/com/message_center/model.png',
						chatId: 88
					},
					// {
					// 	name: '语音对讲',
					// 	vis: global.baseImg + '/xcx/com/message_center/speak.png',
					// 	chatId: 9
					// },
					{
						name: '声音克隆',
						vis: global.baseImg + '/xcx/com/message_center/nl声音克隆.png',
						chatId: 93
					},
					{
						name: '虚拟数字人',
						vis: global.baseImg +
							'/xcx/com/message_center/%E6%95%B0%E5%AD%97%E4%BA%BA%E5%AE%9A%E5%88%B6.png',
						chatId: 92
					},
					{
						name: '音视频转写',
						vis: global.baseImg + '/xcx/com/message_center/445.png',
						chatId: 89
					},

					{
						name: '看图说话',
						vis: global.baseImg + '/xcx/com/message_center/555.png',
						chatId: 91
					}, {
						name: '彩超宝宝',
						vis: global.baseImg + '/xcx/com/message_center/%E5%BD%A9%E8%B6%85%E5%AE%9D%E5%AE%9D.png',
						chatId: 90
					},



				],
				filterList: []
			}
		},

		methods: {
			goToLab(num) {
				if (num == 88) {
					uni.navigateTo({
						url: '/childPage/multi_model/multi_model_next',
					})
				} else if (num == 9) {
					uni.navigateTo({
						url: "/childPage/voice/voice_page"
					})
				} else if (num == 89) {
					uni.navigateTo({
						url: '/childPage/voice/voice_index'
					})
				} else if (num == 90) {
					uni.navigateTo({
						url: '/childPage/doppler/doppler',
					})
				} else if (num == 91) {
					uni.navigateTo({
						url: '/childPage/discern/discern',
					})
				} else if (num == 92) {
					uni.navigateTo({
						url: '/childCont/figure/figure',
					})
				} else if (num == 93) {
					uni.navigateTo({
						url: '/childCont/figure/figure_voice',
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
					url: '/childPage/vision/history_text?chat_type=21'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	

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