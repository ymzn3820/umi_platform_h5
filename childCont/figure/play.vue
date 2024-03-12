<template>
	<view class="container">
		<video :src="video_url" objectFit='cover' type="video/mp4" class="sp_img"></video>
		
		<view class="btn_cont" @click="toDownload">
			<view class="cont_text">导出视频</view>
		</view>
		
		<Ssdownload ref="ssdownload" :fileUrl="video_url" :fileType="fileType"></Ssdownload>
	</view>
</template>

<script>
	import Ssdownload from '../components/ss-download/ss-download.vue'
	export default {
		data() {
			return {
				video_url: '',
				fileUrl: '',
				fileType: ''
			}
		},
		components: {
	      Ssdownload
		},
		onLoad(option) {
	       if(option.video_url) {
			   this.video_url = global.baseImg+'/'+ option.video_url
			   this.$forceUpdate()
		   }
		},
		onShow() {

		},

		methods: {
			toDownload() {
				this.fileUrl = this.video_url
				this.fileType = '3'
			}
		}
	}
</script>

<style  lang="less" scoped>
	.container{
		width: 100%;
		height: 100vh;
		padding: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.sp_img {
			width: 100%;
		}
		.li_text {
			font-size: 24upx;
			color: #F74439;
			padding: 30upx;
		}
	}
	
	.btn_cont {
		width: 100%;
		height: 150upx;
		border-top: 1upx solid #E7E7E7;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		background: #fff;
		.cont_text {
			width: 80%;
			border-radius: 10upx;
			background: linear-gradient(301deg, #1F64FF 0%, #5589FF 100%);
			color: #FFF;
			font-size: 30upx;
			font-style: normal;
			font-weight: 500;
			line-height: 50upx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20upx 0;
		}
	}
</style>