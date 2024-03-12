<template>
	<view style="margin: 16rpx;">
		
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

				contentList: [{
						name: '对话模型',
						id:1,
						vis: global.baseImg + '/xcx/com/message_center/对话模型.png',
					},
					{
						name: '绘画模型',
						id:2,
						vis: global.baseImg + '/xcx/com/message_center/绘画模型.png',
					},
					{
						name: '图片处理',
						id:3,
						vis: global.baseImg + '/xcx/com/message_center/bbxztxt.png',
					},
					{
						name: '视频处理',
						id:4,
						vis: global.baseImg + '/xcx/com/message_center/bbxtyspsc.png',
					},
					{
						name: '文字识别',
						id:5,
						vis: global.baseImg + '/xcx/com/message_center/文字识别能力.png',
					},
					{
						name: '语音合成',
						id:6,
						vis: global.baseImg + '/xcx/com/message_center/语音合成.png',
					},
					{
						name: '文档对话',
						id:7,
						vis: global.baseImg + '/xcx/com/message_center/文档对话能力.png',
					},

				],
				filterList: []
			}
		},

		methods: {
			toPages(item){
				let id=item.id
				if(id==1){
					uni.navigateTo({
						url: '/childCont/more_function/more_chat'
					})
				}else if(id==2){
					uni.navigateTo({
						url: '/childCont/more_function/more_draw',
					})
				}else if(id==3){
					uni.navigateTo({
						url: '/childCont/more_function/more_pic',
					})
				}else if(id==4){
					uni.navigateTo({
						url: '/childCont/more_function/more_video',
					})
				}else if(id==5){
					uni.navigateTo({
						url: '/childPage/vision/textRecognize'
					})
				}else if(id==6){
					uni.navigateTo({
						url: '/childPage/speech/speech_merge',
					})
				}else if(id==7){
					uni.navigateTo({
						url: '/childPage/document/document_chat'
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