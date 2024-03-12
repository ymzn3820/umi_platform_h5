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
		</view>
		<view class="grid" v-if="filterList==''">

			<view class='grid_item' v-for="item,index in contentList" :key="index" @click="toPages(item)">
				<image class='img' :src="item.vis" mode="widthFix"></image>
				<view class="title">{{item.name}}</view>
			</view>
		</view>
		<view class="grid" v-else>

			<view class='grid_item' v-for="item,index in filterList" :key="index" @click="toPages(item)">
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

				contentList: [
					{
						name: '数字人',
						id:4,
						vis: global.baseImg + '/xcx/com/message_center/功能数字人定制.png',
					},
					{
						name: '文本识别',
						id:5,
						vis: global.baseImg + '/xcx/com/message_center/功能视觉智能馆.png',
					},
					{
						name: '文档对话',
						id:6,
						vis: global.baseImg + '/xcx/com/message_center/功能文档对话.png',
					},
					{
						name: '人像抠图',
						id:7,
						vis: global.baseImg + '/xcx/com/message_center/功能人像抠图.png',
					},
					{
						name: '人像融合',
						id:8,
						vis: global.baseImg + '/xcx/com/message_center/功能人像融合.png',
					},

				],
				filterList: []
			}
		},

		methods: {
			toPages(item){
				let id=item.id
				 if(id==4){
					uni.navigateTo({
						url: '/childCont/figure/figure',
					})
				}else if(id==5){
					uni.navigateTo({
						url: '/childPage/chat/camera?chatValue=' + '' + '&source=1'
					})
				}else if(id==6){
					uni.navigateTo({
						url: '/childPage/document/document_chat',
					})
				}else if(id==7){
					uni.navigateTo({
						url: '/childPage/vision/matting'
					})
				}else if(id==8){
					uni.navigateTo({
						url: '/childPage/vision/merge'
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
				width: 78upx;
				height: 40upx;
				margin: 0 11upx;
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