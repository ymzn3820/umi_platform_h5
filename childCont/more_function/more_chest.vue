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

		<view style="color: #1F64FF;font-size: 26rpx;line-height: 150%;text-align: right;" @click="toHis">历史记录</view>

		<view style="display: flex">
			<view class="tab" v-for="item,index in tabList" :key="index"
				:style="[{color:(tabActive==index?'#1F64FF':'#86909C')}]" @click="tabChange(index)">{{item}}</view>
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
		<view class="grid" v-if="tabActive==1">
			<view class='grid_item' v-for="item,index in picList" :key="index" @click="toPages(item)">
				<image class='img' :src="item.vis" mode="widthFix"></image>
				<view class="title">{{item.name}}</view>
			</view>
		</view>
		<view class="grid" v-if="tabActive==2">
			<view class='grid_item' v-for="item,index in videoList" :key="index" @click="toPages(item)">
				<image class='img' :src="item.vis" mode="widthFix"></image>
				<view class="title">{{item.name}}</view>
			</view>
		</view>
		<view class="grid" v-if="tabActive==3">
			<view class='grid_item' v-for="item,index in faceList" :key="index" @click="toPages(item)">
				<image class='img' :src="item.vis" mode="widthFix"></image>
				<view class="title">{{item.name}}</view>
			</view>
		</view>
		<view class="grid" v-if="tabActive==4">
			<view class='grid_item' v-for="item,index in hospitalList" :key="index" @click="toPages(item)">
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
				// tabList: ['全部功能', '图像处理', '视频处理', '美颜', '医学'],
				contentList: [
					{
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
						name: '人脸修复',
						chat_type: 39,
						vis: global.baseImg +'/xcx/com/message_center/face3.png',
					},
					{
						name: '人脸素描',
						chat_type: 40,
						vis: global.baseImg +
							'/xcx/com/message_center/face6.png',
					},
					{
						name: '智能瘦脸',
						chat_type: 41,
						vis: global.baseImg +
							'/xcx/com/message_center/bbxspqbz.png',
					},
					{
						name: '智能美妆',
						chat_type: 42,
						vis: global.baseImg +
							'/xcx/com/message_center/bbxtyspsc.png',
					},
					{
						name: '人脸滤镜',
						chat_type: 43,
						vis: global.baseImg +
							'/xcx/com/message_center/face.png',
					},
					// {
					// 	name: '人脸模糊',
					// 	chat_type: 108,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/bbxrxkth.png',
					// },
					// {
					// 	name: '智能儿科问诊',
					// 	chat_type: 109,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face2.png',
					// },
					// {
					// 	name: '图片字幕擦除',
					// 	chat_type: 1010,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face5.png',
					// },
					{
						name: '照图修图',
						chat_type: 32,
						vis: global.baseImg + '/xcx/com/message_center/bbxztxt.png',
					},
					// {
					// 	name: '图像风格转化',
					// 	chat_type: 1012,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/bbxrxkth.png',
					// },
					// {
					// 	name: '黑白填充色',
					// 	chat_type: 1013,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/bbxspqbz.png',
					// },
					// {
					// 	name: '清晰度增强',
					// 	chat_type: 1014,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face.png',
					// },
				
					// {
					// 	name: '图像标志擦除',
					// 	chat_type: 1015,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/bbxspqzm.png',
					// },
					// {
					// 	name: '明星识别',
					// 	chat_type: 1016,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face2.png',
					// },
					// {
					// 	name: '商品抠图',
					// 	chat_type: 1017,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face.png',
					// },
					// {
					// 	name: '人体轮廓分割',
					// 	chat_type: 1018,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face2.png',
					// },
					// {
					// 	name: '图像搜索',
					// 	chat_type: 1019,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/bbxspqzm.png',
					// },
					// {
					// 	name: '视频画质评分',
					// 	chat_type: 1020,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face6.png',
					// },
					// {
					// 	name: '面部信息识别',
					// 	chat_type: 1021,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/bbxrxkth.png',
					// },
					{
						name: '皮肤病检测',
						chat_type: 35,
						vis: global.baseImg +
							'/xcx/com/message_center/face.png',
					},
					// {
					// 	name: '物体识别',
					// 	chat_type: 1023,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face3.png',
					// },
					// {
					// 	name: '车型识别',
					// 	chat_type: 1024,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/bbxtyspsc.png',
					// },
					// {
					// 	name: '图像主体识别',
					// 	chat_type: 1025,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face5.png',
					// },
					{
						name: '图片裁剪',
						chat_type: 33,
						vis: global.baseImg + '/xcx/com/message_center/bbxtpcj.png',
					},
					// {
					// 	name: '视频图像微动',
					// 	chat_type: 34,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face2.png',
				
					// }
				],
				tabActive: 0,
				filterList: [], //过滤
				picList: [], //图片
				videoList: [], //视频
				faceList: [], //美颜
				hospitalList: [] //医学
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
				} else if (chat_type == 102) {
					uni.navigateTo({
						url: '/childCont/chest/figureMax'
					})
				} else if (chat_type == 39) {
					uni.navigateTo({
						url: '/childCont/chest/faceRepair'
					})
				} else if (chat_type == 40) {
					uni.navigateTo({
						url: '/childCont/chest/faceSketch'
					})
				} else if (chat_type == 41) {
					uni.navigateTo({
						url: '/childCont/chest/thinFace'
					})
				} else if (chat_type == 42) {
					uni.navigateTo({
						url: '/childCont/chest/beautyMakeup'
					})
				} else if (chat_type == 43) {
					uni.navigateTo({
						url: '/childCont/chest/faceFilter'
					})
				} else if (chat_type == 108) {
					uni.navigateTo({
						url: '/childCont/chest/faceBlur'
					})
				} else if (chat_type == 109) {
					uni.navigateTo({
						url: '/childCont/chest/babyInterrogation'
					})
				} else if (chat_type == 1010) {
					uni.navigateTo({
						url: '/childCont/chest/picSubtitles'
					})
				} else if (chat_type == 32) {
					uni.navigateTo({
						url: '/childCont/chest/retouch'
					})
				} else if (chat_type == 1012) {
					uni.navigateTo({
						url: '/childCont/chest/picStyle'
					})
				} else if (chat_type == 1013) {
					uni.navigateTo({
						url: '/childCont/chest/fillColor'
					})
				} else if (chat_type == 1014) {
					uni.navigateTo({
						url: '/childCont/chest/sharpness'
					})
				} else if (chat_type == 1015) {
					uni.navigateTo({
						url: '/childCont/chest/picSymbol'
					})
				} else if (chat_type == 1016) {
					uni.navigateTo({
						url: '/childCont/chest/star'
					})
				} else if (chat_type == 1017) {
					uni.navigateTo({
						url: '/childCont/chest/productMatting'
					})
				} else if (chat_type == 1018) {
					uni.navigateTo({
						url: '/childCont/chest/partition'
					})
				} else if (chat_type == 1019) {
					uni.navigateTo({
						url: '/childCont/chest/picSearch'
					})
				} else if (chat_type == 1020) {
					uni.navigateTo({
						url: '/childCont/chest/videoMark'
					})
				} else if (chat_type == 1021) {
					uni.navigateTo({
						url: '/childCont/chest/faceRecognize'
					})
				} else if (chat_type == 35) {
					uni.navigateTo({
						url: '/childCont/chest/dermatosis'
					})
				} else if (chat_type == 1023) {
					uni.navigateTo({
						url: '/childCont/chest/objectRecognition'
					})
				} else if (chat_type == 1024) {
					uni.navigateTo({
						url: '/childCont/chest/carRecognition'
					})
				} else if (chat_type == 1025) {
					uni.navigateTo({
						url: '/childCont/chest/picBodyRecognition'
					})
				} else if (chat_type == 33) {
					uni.navigateTo({
						url: '/childCont/chest/tailor'
					})
				} else if (chat_type == 34) {
					uni.navigateTo({
						url: '/childCont/chest/video_pic_inching'
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
			},
			tabChange(index) {
				this.tabActive = index
				if (index == 0) {
					this.contentList
				} else if (index == 1) {
					this.picList = this.contentList.filter(item => item.chat_type == 1012 || item.chat_type == 1015 || item
						.chat_type == 1019 || item.chat_type == 1025 || item.chat_type == 34 || item.chat_type ==
						37 || item.chat_type == 1023 || item.chat_type == 1024 || item.chat_type == 1025)
				} else if (index == 2) {
					this.videoList = this.contentList.filter(item => item.chat_type == 36 || item.chat_type == 1026 ||
						item.chat_type == 28 || item.chat_type == 31 || item.chat_type == 38 || item.chat_type ==
						30 || item.chat_type == 29 || item.chat_type == 102 || item.chat_type == 1020)
				} else if (index == 3) {
					this.faceList = this.contentList.filter(item => item.chat_type == 105 || item.chat_type == 106 || item
						.chat_type == 103 || item.chat_type == 104 || item.chat_type == 107 || item.chat_type == 108)
				} else if (index == 4) {
					this.hospitalList = this.contentList.filter(item => item.chat_type == 35 || item.chat_type == 109)
				}
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
		margin: 48upx 36upx 24upx 0;
	}
</style>