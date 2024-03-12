<template>
	<view>
		<view style="padding: 32upx;">
			<view style="padding:32upx;background-color: #fff;">
				<view class="title">
					<view class="left"></view>
					<view class="right">平整的绿幕背景</view>
				</view>
				<view style="display: flex;">
					<view style="margin-right: 24upx;">
						<image :src="greenImg" mode="" style='width:216upx;height: 384upx;'></image>
					</view>
					<image :src="greenImg" mode="" style='width:216upx;height: 384upx;'></image>
				</view>
				<view class="title">
					<view class="left"></view>
					<view class="right">1分钟长度的话术</view>
				</view>
				<view style="width: 596upx;">
					<image :src="talkImg" mode="" style="width: 596upx;height: 250upx;"></image>
				</view>
				<view class="title">
					<view class="left"></view>
					<view class="right">尽量避免偏绿色服装和装饰品</view>
				</view>
				<view class="content">
					<view class="left"></view>
					<view class="right">视频分辨推荐1080P，尺寸1080x1920，30帧/分钟</view>
				</view>
				<view class="content">
					<view class="left"></view>
					<view class="right">视频格式要求MP4</view>
				</view>
				<view class="title">
					<view class="left"></view>
					<view class="right">均匀打光</view>
				</view>
				<view>
					<image :src="polishImg" mode="" style="width: 610upx;height: 506upx;"></image>
				</view>
				<view class="title">
					<view class="left"></view>
					<view class="right">尽量避免偏绿色服装和装饰品</view>
				</view>
				<view class="content">
					<view class="left"></view>
					<view class="right">说话时需吐字清晰</view>
				</view>
				<view class="content">
					<view class="left"></view>
					<view class="right">手势动作不要出现在面部、嘴巴、脖子附近</view>
				</view>
				<view >
					<image :src="faceImg" mode="" style="width: 582upx; height: 310upx;"></image>
				</view>
				<view class="title">
					<view class="left"></view>
					<view class="right">背景与模特的位置关系</view>
				</view>
				<view class="content">
					<view class="left"></view>
					<view class="right">推荐人物与绿幕保持1.8m以上距离，保证不让背景的绿色反射到人物身上</view>
				</view>
				<view >
					<image :src="positionImg" mode="" style="width: 582upx; height: 310upx;"></image>
				</view>
				<view class="title">
					<view class="left"></view>
					<view class="right">避免佩戴会晃动的耳坠</view>
				</view>
				<view class="content">
					<view class="left"></view>
					<view class="right">耳坠晃动会影响口型学习，可佩戴固定耳钉</view>
				</view>
				<view style="display: flex;">
					<view style="margin-right: 34upx;">
						<image :src="fixationImg" mode="" style="width: 260upx;height: 180upx;"></image>
					</view>
					<image :src="swayImg" mode="" style="width: 260upx;height: 180upx;"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				greenImg:global.baseImg+'/xcx/com/message_center/%E5%9D%90%E5%A7%BF%E5%8F%82%E8%80%83.png',
				talkImg:global.baseImg+'/xcx/com/message_center/%E8%AF%9D%E6%9C%AF.png',
				polishImg:global.baseImg+'/xcx/com/message_center/%E6%89%93%E5%85%89.png',
				faceImg:global.baseImg+'/xcx/com/message_center/%E8%A1%A8%E6%83%85%E8%87%AA%E7%84%B6.png',
				positionImg:global.baseImg+'/xcx/com/message_center/%E4%BD%8D%E7%BD%AE%E5%85%B3%E7%B3%BB.png',
				fixationImg:global.baseImg+'/xcx/com/message_center/%E6%99%83%E5%8A%A8%E8%80%B3%E5%9D%A0.png',
				swayImg:global.baseImg+'/xcx/com/message_center/%E5%9B%BA%E5%AE%9A%E8%80%B3%E5%9D%A0.png',
			};
		}
	}
</script>

<style lang="less" scoped>
.title{
	display: flex;
	align-items: center;
	margin: 32upx 0;
	.left{
		width: 6upx;
		height: 32upx;
		background-color: #1F64FF;
		margin-right: 20upx;
		}
		.right{
			color: #393E45;
			font-size: 32upx;
			font-weight: 600;
			line-height: 150%;
		}
}
.content{
	display: flex;
	margin: 26upx 0;
	.left
	{
		width: 10upx;
		height: 10upx;
		border-radius: 50%;
		background-color: #333;
		margin: 18upx 20upx 0 0;
	}
	.right{
		color: #393E45;
		font-size: 28upx;
		font-weight: 400;
		line-height: 150%;
	}
}
</style>
