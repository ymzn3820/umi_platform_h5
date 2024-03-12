<template>
	<view style="margin: 16rpx;">
		<u-search placeholder="搜索你想要的内容" v-model.trim="searchKeyword" shape="square" :showAction='false' bgColor='#fff'
			@change="searchTitle"></u-search>


		<view style="display: flex;justify-content: space-between;align-items: center;">
			<view style="display: flex">
				<view class="tab" v-for="item,index in tabList" :key="index"
					:style="[{color:(tabActive==index?'#1F64FF':'#86909C')}]" @click="tabChange(index)">{{item}}</view>
			</view>
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
		<view class="grid" v-if="tabActive==1">
			<view class='grid_item' v-for="item,index in faceList" :key="index" @click="toPages(item)">
				<image class='img' :src="item.vis" mode="widthFix"></image>
				<view class="title">{{item.name}}</view>
			</view>
		</view>
		<view class="grid" v-if="tabActive==2">
			<view class='grid_item' v-for="item,index in hospitalList" :key="index" @click="toPages(item)">
				<image class='img' :src="item.vis" mode="widthFix"></image>
				<view class="title">{{item.name}}</view>
			</view>
			<view class="on_order" v-if="hospitalList==''">
				<image class="order_img" :src="backImg"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				backImg: global.baseImg + '/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg',
				log: global.baseImg + '/xcx/com/message_center/Frame%20427320411.png',
				watchImg: global.baseImg + '/xcx/com/message_center/AI%E8%A7%86%E8%A7%89%E7%AE%A1.png',
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				// 视觉体验馆
				searchKeyword: '',
				tabList: ['全部功能', '人脸美颜', '医学能力'],
				tabActive: 0,
				contentList: [{
						name: '人脸修复',
						chat_type: 39,
						vis: global.baseImg + '/xcx/com/message_center/%E4%BA%BA%E8%84%B8%E8%9E%8D%E5%90%88.png',
					},
					{
						name: '人脸素描',
						chat_type: 40,
						vis: global.baseImg +
							'/xcx/com/message_center/%E5%B9%B4%E9%BE%84%E5%8F%98%E5%8C%96.png',
					},
					{
						name: '智能瘦脸',
						chat_type: 41,
						vis: global.baseImg +
							'/xcx/com/message_center/%E5%B9%B4%E9%BE%84%E5%8F%98%E5%8C%96.png',
					},
					{
						name: '智能美妆',
						chat_type: 42,
						vis: global.baseImg +
							'/xcx/com/message_center/%E4%BA%BA%E8%84%B8%E8%9E%8D%E5%90%88.png',
					},
					{
						name: '人脸滤镜',
						chat_type: 43,
						vis: global.baseImg +
							'/xcx/com/message_center/%E6%99%BA%E8%83%BD%E5%8F%98%E7%BE%8E.png',
					},
					{
						name: '人脸模糊',
						chat_type: 44,
						vis: global.baseImg +
							'/xcx/com/message_center/12.png',
					},
					// {
					// 	name: '智能儿科问诊',
					// 	chat_type: 109,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/face2.png',
					// },
					{
						name: '图片字幕擦除',
						chat_type: 45,
						vis: global.baseImg +
							'/xcx/com/message_center/%E6%8B%89%E4%BC%B8%E4%BF%AE%E5%A4%8D.png',
					},
					{
						name: '照图修图',
						chat_type: 32,
						vis: global.baseImg + '/xcx/com/message_center/%E8%B6%85%E5%88%86%E8%BE%A8%E7%8E%87.png',
					},
					{
						name: '图像风格转化',
						chat_type: 56,
						vis: global.baseImg +
							'/xcx/com/message_center/%E5%B9%B4%E9%BE%84%E5%8F%98%E5%8C%96.png',
					},
					{
						name: '黑白图像填色',
						chat_type: 55,
						vis: global.baseImg +
							'/xcx/com/message_center/%E4%BA%BA%E8%84%B8%E8%9E%8D%E5%90%88.png',
					},
					{
						name: '清晰度增强',
						chat_type: 57,
						vis: global.baseImg +
							'/xcx/com/message_center/%E6%8B%89%E4%BC%B8%E4%BF%AE%E5%A4%8D.png',
					},

					{
						name: '图像标志擦除',
						chat_type: 49,
						vis: global.baseImg +
							'/xcx/com/message_center/3D%E6%B8%B8%E6%88%8F%E9%A3%8E.png',
					},
					// {
					// 	name: '明星识别',
					// 	chat_type: 52,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/%E6%99%BA%E8%83%BD%E5%8F%98%E7%BE%8E.png',
					// },
					{
						name: '商品抠图',
						chat_type: 50,
						vis: global.baseImg +
							'/xcx/com/message_center/Frame%20427320263.png',
					},
					{
						name: '人体轮廓分割',
						chat_type: 51,
						vis: global.baseImg +
							'/xcx/com/message_center/12.png',
					},
					// {
					// 	name: '图像搜索',
					// 	chat_type: 1019,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/%E8%B6%85%E5%88%86%E8%BE%A8%E7%8E%87.png',
					// },

					{
						name: '面部信息识别',
						chat_type: 48,
						vis: global.baseImg +
							'/xcx/com/message_center/%E6%99%BA%E8%83%BD%E5%8F%98%E7%BE%8E.png',
					},
					{
						name: '皮肤病检测',
						chat_type: 35,
						vis: global.baseImg +
							'/xcx/com/message_center/%E5%B9%B4%E9%BE%84%E5%8F%98%E5%8C%96.png',
					},
					{
						name: '物体识别',
						chat_type: 47,
						vis: global.baseImg +
							'/xcx/com/message_center/%E4%BA%BA%E5%83%8F%E6%BC%AB%E7%94%BB.png',
					},
					{
						name: '车型识别',
						chat_type: 53,
						vis: global.baseImg +
							'/xcx/com/message_center/%E8%B6%85%E5%88%86%E8%BE%A8%E7%8E%87.png',
					},
					{
						name: '图像主体识别',
						chat_type: 54,
						vis: global.baseImg +
							'/xcx/com/message_center/%E8%B6%85%E5%88%86%E8%BE%A8%E7%8E%87.png',
					},
					{
						name: '图片裁剪',
						chat_type: 33,
						vis: global.baseImg + '/xcx/com/message_center/3D%E6%B8%B8%E6%88%8F%E9%A3%8E.png',
					},
					// {
					// 	name: '视频图像微动',
					// 	chat_type: 34,
					// 	vis: global.baseImg +
					// 		'/xcx/com/message_center/%E4%BA%BA%E5%83%8F%E6%BC%AB%E7%94%BB.png',

					// }
					{
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
						vis: global.baseImg + '/xcx/com/message_center/%E4%BA%BA%E8%84%B8%E8%9E%8D%E5%90%88.png',
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
				if (chat_type == 102) {
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
				} else if (chat_type == 44) {
					uni.navigateTo({
						url: '/childCont/chest/faceBlur'
					})
				} else if (chat_type == 109) {
					uni.navigateTo({
						url: '/childCont/chest/babyInterrogation'
					})
				} else if (chat_type == 45) {
					uni.navigateTo({
						url: '/childCont/chest/picSubtitles'
					})
				} else if (chat_type == 32) {
					uni.navigateTo({
						url: '/childCont/chest/retouch'
					})
				} else if (chat_type == 56) {
					uni.navigateTo({
						url: '/childCont/chest/picStyle'
					})
				} else if (chat_type == 55) {
					uni.navigateTo({
						url: '/childCont/chest/fillColor'
					})
				} else if (chat_type == 57) {
					uni.navigateTo({
						url: '/childCont/chest/sharpness'
					})
				} else if (chat_type == 49) {
					uni.navigateTo({
						url: '/childCont/chest/picSymbol'
					})
				} else if (chat_type == 52) {
					uni.navigateTo({
						url: '/childCont/chest/star'
					})
				} else if (chat_type == 50) {
					uni.navigateTo({
						url: '/childCont/chest/productMatting'
					})
				} else if (chat_type == 51) {
					uni.navigateTo({
						url: '/childCont/chest/partition'
					})
				} else if (chat_type == 1019) {
					uni.navigateTo({
						url: '/childCont/chest/picSearch'
					})
				} else if (chat_type == 48) {
					uni.navigateTo({
						url: '/childCont/chest/faceRecognize'
					})
				} else if (chat_type == 35) {
					uni.navigateTo({
						url: '/childCont/chest/dermatosis'
					})
				} else if (chat_type == 47) {
					uni.navigateTo({
						url: '/childCont/chest/objectRecognition'
					})
				} else if (chat_type == 53) {
					uni.navigateTo({
						url: '/childCont/chest/carRecognition'
					})
				} else if (chat_type == 54) {
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
				} else if (chat_type == 21) {
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
			searchTitle(e) {
				this.tabActive = 0
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
				if (index == 0) {
					this.contentList
				} else if (index == 1) {
					this.faceList = this.contentList.filter(item => item.chat_type == 41 || item.chat_type == 42 || item
						.chat_type == 39 || item.chat_type == 40 || item.chat_type == 43 || item.chat_type == 44 ||
						item.chat_type == 48 || item.chat_type == 16 || item.chat_type == 17 || item.chat_type == 18 ||
						item.chat_type == 20 || item.chat_type == 21 || item.chat_type == 22 || item.chat_type == 23 ||
						item.chat_type == 24 || item.chat_type == 26 || item.chat_type == 27)
				} else if (index == 2) {
					this.hospitalList = this.contentList.filter(item => item.chat_type == 35 || item.chat_type == 109)
				}
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
				width: 40upx;
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

	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 74vh;
		width: 100vw;
	}

	.order_img {
		width: 450upx;
		height: 450upx;

	}
</style>