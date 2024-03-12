<template>
	<view style="margin: 16rpx;">
		
		<u-search placeholder="搜索你想要的内容" v-model.trim="searchKeyword" shape="square" :showAction='false' bgColor='#fff'
			@change="searchTitle"></u-search>


		
		<view style="display: flex;justify-content: space-between;align-items: center;">
			<view class="tab" v-for="item,index in tabList" :key="index"
				:style="[{color:(tabActive==index?'#1F64FF':'#86909C')}]" @click="tabChange(index)">{{item}}</view>
				<view style="color: #1F64FF;font-size: 26rpx;line-height: 150%;text-align: right;" @click="toHis">历史记录</view>
		</view>
		<view class="grid" v-if="filterList==''&&tabActive==0">

			<view class='grid_item' v-for="item,index in contentList" :key="index" @click="toPages(item)">
				<image class='img' :src="item.vis" mode="widthFix"></image>
				<view class="title">{{item.name}}</view>
			</view>
		</view>
		<view class="grid" v-if="filterList">
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
				tabList: ['全部功能'],
				tabActive: 0,
				contentList: [{
						name: '视频降噪',
						chat_type: 36,
						vis: global.baseImg + '/xcx/com/message_center/bbxtyspsc.png',
					}, {
						name: '视频增强',
						chat_type: 37,
						vis: global.baseImg + '/xcx/com/message_center/face3.png',
					},
					{
						name: '视频人像卡通化',
						chat_type: 28,
						vis: global.baseImg + '/xcx/com/message_center/bbxrxkth.png',
					}, {
						name: '视频字幕擦除',
						chat_type: 31,
						vis: global.baseImg + '/xcx/com/message_center/bbxspqzm.png',
					},
					{
						name: '视频封面生成',
						chat_type: 38,
						vis: global.baseImg + '/xcx/com/message_center/face4.png',
					},
					{
						name: '视频标志擦除',
						chat_type: 30,
						vis: global.baseImg + '/xcx/com/message_center/bbxspqbz.png',
					},
					{
						name: '通用视频生成',
						chat_type: 29,
						vis: global.baseImg + '/xcx/com/message_center/bbxtyspsc.png',
					},
					// {
					// 	name: '视频人像增强',
					// 	chat_type: 102,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face.png',
					// },
					
					
					{
						name: '视频画质评分',
						chat_type: 46,
						vis: global.baseImg +
							'/xcx/com/message_center/face6.png',
					},
					
					// {
					// 	name: '视频图像微动',
					// 	chat_type: 34,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face2.png',

					// }
				],
				filterList: [], //过滤
				videoList: [], //视频

			}
		},

		methods: {
			toPages(item) {
				let chat_type = item.chat_type
				if (chat_type == 36) {
					uni.navigateTo({
						url: '/childCont/chest/denoise'
					})
				} else if (chat_type == 37) {
					uni.navigateTo({
						url: '/childCont/chest/enhance'
					})
				} else if (chat_type == 28) {
					uni.navigateTo({
						url: '/childCont/chest/cartoon'
					})
				} else if (chat_type == 31) {
					uni.navigateTo({
						url: '/childCont/chest/subtitles'
					})
				} else if (chat_type == 38) {
					uni.navigateTo({
						url: '/childCont/chest/cover'
					})
				} else if (chat_type == 30) {
					uni.navigateTo({
						url: '/childCont/chest/symbol'
					})
				} else if (chat_type == 29) {
					uni.navigateTo({
						url: '/childCont/chest/universal'
					})
				}  else if (chat_type == 46) {
					uni.navigateTo({
						url: '/childCont/chest/videoMark'
					})
				}else {
					this.$api.msg('开发中')
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
					url: '/childCont/chest/history_chest?chat_type=28'
				})
			},
			tabChange(index) {
				this.tabActive = index
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
				width: 72upx;
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
		margin: 22upx 36upx 24upx 0;
	}
</style>