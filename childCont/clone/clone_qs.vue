<template>
	<view>
		<view style="padding: 32upx;">
			<view style="padding: 32upx;background-color: #fff;">
				<view class="title">
					<view class="left"></view>
					<view class="right">录制流程及要求</view>
				</view>
				<view class="title2">01.录音准备</view>
				<view class="content">
					<!-- <view class="left"></view> -->
					<view class="right" style="margin-left: 10rpx;">
						录音环境的选择主要考虑降低噪音和混响,
						建议使用10平方米以内的小房间进行录音,
						有吸音装置的房间是理想环境。可使用价格低廉的吸音棉对房间进行改造,
						目的是为了改变声波的平面反射为漫反射,降低混响。
					</view>
				</view>
				
				<view class="title2">02.开始录音</view>
				<view class="content">
					<view class="left"></view>
					<view class="right">无背景音和杂音情况下开始收音；</view>
				</view>
				<view class="content">
					<view class="left"></view>
					<view class="right">发音、吐字注意清晰句与句之间停顿好。</view>
				</view>
				<view class="title2">03.录音结束并提交</view>
				<view class="content">
					<view class="left"></view>
					<view class="right">录音结束后可在线上传文件或把源文件提供给工作人员。</view>
				</view>
				
				<view class="title">
					<view class="left"></view>
					<view class="right">录制流程及要求</view>
				</view>
				<view class="requireItem">
					<view class="top">音频时长</view>
					<view class="bottom">建议为10s~30s的音频。</view>
				</view>
				<view class="requireItem">
					<view class="top">录音环境</view>
					<view class="bottom">
						录音环境的选择主要考虑降低噪音和混响,建议使用10平方米以内的小房间进行录音,有吸音装置的房间是理想环境。
						可使用价格低廉的吸音棉对房间进行改造,目的是为了改变声波的平面反射为漫反射,降低混响。
						1.尽量在同一声学环境下录制,避免过于喧哗的背景音和噪音,音频非拼接而成。
						2.避免远场环境下录制,建议离麦克风50cm之内,并需要保持位置、距离稳定,
						防止音量大小不一致。不要让讲话的气流正对麦克风,防止喷麦造成的噪音。
						3.尽量在自然对话状态下录制,对比刻意压低声线获得的音色会更贴合本人
					</view>
				</view>
				<view class="requireItem">
					<view class="top">音频质量</view>
					<view class="bottom">1.必须仅含有一个人在说话,避免多个人同时说话。
					2.说话人发音及音质越清晰、复刻质量越高。如说话人喉音/声音底噪严重,则复刻音频喉音和底噪将会较为严重。
					3.录音时需要保持音量大小、语速稳定、注意断句、避免口腔噪音(如口水声)、杂音、混响等情况。
					结合最终使用场景与人设加入适当演绎,避免朗读风格过于严重,并保持整体风格一致。
					4.录音时尽量保持姿态稳定,减少不必要的肢体动作,
					椅子的响声、衣物的摩擦音、鼠标键盘的敲击声都是常见的人为噪声,需要格外注意细节。
					5.如口误无需终止录音,可停顿1~2秒后,继续录制即可。
					</view>
				</view>
				<view class="requireItem">
					<view class="top">录制参数</view>
					<view class="bottom">
						建议在录音前熟悉文案,并确定好人设及演绎风格。
					    尽量贴近复刻内容和主题,避免说话人韵律过于平淡,否则将得到较平的复刻效果。
					    如需要复刻情绪韵律起伏较强的音频,请尽量输入表现力强的prompt。
					</view>
				</view>
				<view class="requireItem">
					<view class="top">录音和录音参数</view>
					<view class="bottom">目前支持wav、mp3、ogg、m4a、aac、pcm格式,当格式为pcm时,保证采样率为24k</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
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
.title2{
	color: #1F64FF;
	font-size: 28upx;
	font-weight: 600;
	line-height: 150%;
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
		font-size: 24upx;
		font-weight: 400;
		line-height: 150%;
	}
}
.requireItem{
	padding: 32upx;
	border:3upx solid #f0f0f0;
	display: flex;
	 flex-direction: column;
	 justify-content: space-between;
	 border-radius: 20upx;
	 margin-bottom: 20upx;
	 .top{
		 margin-bottom: 24upx;
		 color: #262626;
		 font-size: 28upx;
		 font-weight: 600;
		 line-height: 150%; 
	 }
	 .bottom{
		 color: #262626;
		 font-size: 12px;
		 font-weight: 400;
		 line-height: 150%; 
	 }
}
</style>
