<template>
	<view style="height: 100vh; background: #fff;padding-top: 54%;">
		<view class="ex_time">
			<image src="@/static/user/upload.png" mode="aspectFit" class="upload_img" @click="toSlove">
			</image>
			<view class="upload_text">上传参考图</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				wxImg: global.baseImg + '/xcx/afbae4f5-b6b0-4174-872f-30637bfb3c73.jpg',
				photoImg: global.baseImg + '/xcx/7808c484-4c8d-4b17-94d7-c284748b6189.jpg',
				fileImg: global.baseImg + '/xcx/bed3b318-839a-4840-8ae2-77af77bdddcc.jpg',
				chatValue: '',
				imgList: [],
				isClick: true,
				source: 1
			}
		},
		components: {

		},
		onLoad(option) {
			if (option) {
				console.log(option, 789)
				this.chatValue = option.chatValue
				this.source = option.source
			}
		},
		onShow() {

		},
		mounted() {
			if (this.source == 1 || this.source == 4) {
				uni.setNavigationBarTitle({
					title: 'AI识图'
				})
			} else if (this.source == 2 || this.source == 5) {
				uni.setNavigationBarTitle({
					title: '图生图'
				})
			} else {
				uni.setNavigationBarTitle({
					title: '识万物'
				})
			}

		},
		methods: {

			// 微信上传
			async toSlove() {
				let that = this;
				uni.chooseImage({
					count: 1,
					// mediaType: ['image'],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'],
					success(res) {
						// console.log(res.tempFiles)
						console.log(res, 589)
						const tempFilePaths = res.tempFilePaths[0];
						const size = res.tempFiles[0].size;
						if (size > 5242880) { // 图片文件最大只能上传5M
							that.$api.msg('该文件已超过5M，不能上传')
							return
						}
						uni.showLoading({
							title: '上传中'
						});
						uni.uploadFile({
							url: global.loginUrl + '/api/user/oss_upload',
							filePath: tempFilePaths,
							name: 'image',
							formData: {
								"image": tempFilePaths,
								"oss_dir": 'static',
								"cate": 'create_character'
							},
							success: (uploadFileRes) => {
								let imgData = JSON.parse(uploadFileRes.data)
								if(imgData.code == 20000) {
									let url = imgData.data.new_url
									that.imgList.push(url)
									let val = { 'chatValue': that.chatValue, 'imgList': that.imgList }
									// console.log(val,555557)
									uni.setStorageSync('cameraInfo', val)
									if(that.source == 1) {
										uni.switchTab({
											url: '/pages/index/index'
										})
									} else if(that.source == 2) {
										uni.navigateTo({
											url: '/childPage/draw/draw'
										})
									} else if(that.source == 3) {
										uni.switchTab({
											url: '/pages/index/index'
										})
									}  else {
										uni.navigateTo({
											url: '/childPage/discern/discern'
										})
									}
									that.isClick = true
								} else {
									that.isClick = true
									that.$api.msg(imgData.msg)
								}
							},
							fail: (res) => {
								that.isClick = true
								that.$api.msg('上传失败')
							}
						});
					}
				})
			},
			// 微信上传
			
			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			}
		}
	}
</script>

<style>


</style>

<style lang="less" scoped>
	.ex_time{
		text-align: center;
	}
	.ex_ul {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.upload_img {
		width: 240upx;
		height: 240upx;
	}
	
	.upload_text {
		color: #666;
		font-size: 26upx;
		font-style: normal;
		font-weight: 400;
		line-height: 150%;
		padding: 20upx 0;
	}
</style>