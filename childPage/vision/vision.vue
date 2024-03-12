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
		<u-search placeholder="搜索你想要的内容" v-model="searchKeyword" shape="square" :showAction='false' bgColor='#fff'
			@change="searchTitle"></u-search>



		<view style="display: flex;">
			<view style="display: flex;justify-content: space-between;width:100%">
				<view class="tab">全部功能</view>
				<view style="color: #1F64FF;font-size: 26rpx;line-height: 500%;" @click="toHis">历史记录</view>
			</view>
		</view>
		<view class="grid" v-if="filterList==''">
			
			<view  class='grid_item' v-for="item,index in contentList" :key="index"
				@click="toPages(item)">
				<image class='img' :src="item.vis" mode="widthFix"></image>
				<view class="title">{{item.name}}</view>
			</view>
		</view>
		<view class="grid" v-else>
			
			<view  class='grid_item' v-for="item,index in filterList" :key="index"
				@click="toPages(item)">
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
				active: 0,

				contentList: [{
						name: '人像融合',
						chat_type: 21,
						vis: global.baseImg + '/xcx/com/message_center/%E4%BA%BA%E8%84%B8%E8%9E%8D%E5%90%88.png',
					}, {
						name: '人像年龄变化',
						chat_type: 16,
						vis: global.baseImg + '/xcx/com/message_center/%E5%B9%B4%E9%BE%84%E5%8F%98%E5%8C%96.png',
					}, {
						name: '智能变美',
						chat_type: 17,
						vis: global.baseImg + '/xcx/com/message_center/%E6%99%BA%E8%83%BD%E5%8F%98%E7%BE%8E.png',
					}, {
						name: '人像漫画',
						chat_type: 18,
						vis: global.baseImg + '/xcx/com/message_center/%E4%BA%BA%E5%83%8F%E6%BC%AB%E7%94%BB.png',
					}, {
						name: '人像抠图',
						chat_type: 20,
						vis: global.baseImg + '/xcx/com/message_center/%E4%BA%BA%E5%83%8F%E6%8A%A0%E5%9B%BE.png',
					}, {
						name: '通用文字识别',
						chat_type: 19,
						vis: global.baseImg + '/xcx/com/message_center/%E6%96%87%E5%AD%97%E8%AF%86%E5%88%AB.png',
					},
					{
						name: '老照片修复',
						chat_type: '',
						vis: global.baseImg +
							'/xcx/com/message_center/%E8%80%81%E7%85%A7%E7%89%87%E4%BF%AE%E5%A4%8D.png',
					},
					{
						name: '图像增强',
						chat_type: 27,
						vis: global.baseImg + '/xcx/com/message_center/%E5%9B%BE%E5%83%8F%E5%A2%9E%E5%BC%BA.png',
					}, {
						name: '人像特效',
						chat_type: 22,
						vis: global.baseImg + '/xcx/com/message_center/Frame%20427320419.png',
					}, {
						name: '表情增强',
						chat_type: 26,
						vis: global.baseImg + '/xcx/com/message_center/Frame%20427320263.png',
					}, {
						name: '发型编辑',
						chat_type: 23,
						vis: global.baseImg + '/xcx/com/message_center/12.png',
					}, {
						name: '3D游戏风',
						chat_type: 24,
						vis: global.baseImg + '/xcx/com/message_center/3D%E6%B8%B8%E6%88%8F%E9%A3%8E.png',
					},
					{
						name: '活体照片',
						chat_type: '',
						vis: global.baseImg + '/xcx/com/message_center/%E6%B4%BB%E4%BD%93%E7%85%A7%E7%89%87.png',
					}, {
						name: '头发分割',
						chat_type: '',
						vis: global.baseImg + '/xcx/com/message_center/%E5%A4%B4%E5%8F%91%E5%88%86%E5%89%B2.png',
					}, {
						name: '拉伸修复',
						chat_type: '',
						vis: global.baseImg + '/xcx/com/message_center/%E6%8B%89%E4%BC%B8%E4%BF%AE%E5%A4%8D.png',
					}, {
						name: '图片配文',
						chat_type: 25,
						vis: global.baseImg + '/xcx/com/message_center/%E5%9B%BE%E7%89%87%E9%85%8D%E6%96%87.png',
					}, {
						name: '图片超分辨率',
						chat_type: '',
						vis: global.baseImg + '/xcx/com/message_center/%E8%B6%85%E5%88%86%E8%BE%A8%E7%8E%87.png',
					}, {
						name: '图片方向矫正',
						chat_type: '',
						vis: global.baseImg + '/xcx/com/message_center/%E6%96%B9%E5%90%91%E7%9F%AB%E6%AD%A3.png',
					}
				],
				filterList: []
			}
		},

		methods: {
			toPages(item) {
				let chat_type = item.chat_type
				if (chat_type == 21) {
					uni.navigateTo({
						url: '/childPage/vision/merge'
					})
				} else if (chat_type == 16) {
					uni.navigateTo({
						url: '/childPage/vision/myEge'
					})
				} else if (chat_type == 17) {
					uni.navigateTo({
						url: '/childPage/vision/beauty'
					})
				} else if (chat_type == 18) {
					uni.navigateTo({
						url: '/childPage/vision/caricature'
					})
				} else if (chat_type == 20) {
					uni.navigateTo({
						url: '/childPage/vision/matting'
					})
				} else if (chat_type == 19) {
					uni.navigateTo({
						url: '/childPage/vision/textRecognize'
					})
				} else if (chat_type == 27) {
					uni.navigateTo({
						url: '/childPage/vision/imgemax'
					})
				} else if (chat_type == 22) {
					uni.navigateTo({
						url: '/childPage/vision/peoplevfx'
					})
				} else if (chat_type == 26) {
					uni.navigateTo({
						url: '/childPage/vision/facemax'
					})
				} else if (chat_type == 23) {
					uni.navigateTo({
						url: '/childPage/vision/hair'
					})
				} else if (chat_type == 24) {
					uni.navigateTo({
						url: '/childPage/vision/games3d'
					})

				} else if (chat_type == 25) {
					uni.navigateTo({
						url: '/childPage/vision/pic_text'
					})
				} else {
					this.$api.msg('开发中')
				}

			},
			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			},
			tabClick(i) {
				this.active = i
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
				width: 46upx;
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
		color: #86909C;
		text-align: center;
		font-size: 26upx;
		font-weight: 400;
		margin: 48upx 36upx 24upx 0;
	}
</style>