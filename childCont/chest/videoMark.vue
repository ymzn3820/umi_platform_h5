<template>
	<view style="background-color: #FEFEFE;height: 100vh;">
		<view class="bigBox">
			<video class="bigImg" :src="src"></video>
			<!-- <image class="upImg" @click="previewImage" :src="icon_img" mode="aspectFit"></image> -->
			<image class="downImg" @click="savePhoto(src)" :src="icon_img1" mode=""></image>
		</view>
		<view class="tips">
			<text class="tip_m">Tips:上传视频，对视频的整体质量、画质清晰度、颜色质量等进行客观评分
			</text>
		</view>
		<view class="bottom">
			<view class="bot_head">
				<view class="head_l">评分结果</view>
				<!-- <view class="head_r" @click="copyText(markArr)">复制</view> -->
			</view>
			<view>
				<view class="item" v-if="markArr.length>0" v-for="item,index in markArr" :key="index">
					<view class="item_l">{{item.name}}</view>
					<view class="item_r">{{item.num*100}}</view>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="text">本次生成将消耗24w算力/分钟</view>
			<view class="record" @click="historyText">历史记录</view>
			<button @click="toSlove" style="background-color: #1F64FF;color: #fff;" class="btn" size="default"
				type="default">上传视频</button>
		</view>
	</view>

</template>

<script>
	import {
		asyncImg,
		getTextImg,
		getImgDetail
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				active: 0,
				blur: 0,
				src: global.baseImg + '/xcx/com/message_center/百宝箱视频降噪.mp4', //大图
				origin_image: '/xcx/com/message_center/%E4%BA%BA%E7%89%A912.png',
				icon_img: global.baseImg + '/xcx/com/message_center/Frame%20427320251.png',
				icon_img1: global.baseImg + '/xcx/com/message_center/Frame%20427319637.png',
				default: global.baseImg + '/xcx/com/message_center/%E7%BE%8E%E5%A5%B31.png',
				defaultSrc: global.baseImg + '/xcx/com/message_center/默认.png',
				clearSrc: global.baseImg + '/xcx/com/message_center/百宝箱示例.png',
				markList: {},
				markArr: [],

			};
		},
		onShow() {
			if (uni.getStorageSync('vison_code') != '') {
				this.historySession(uni.getStorageSync('vison_code'))
			}
		},
		methods: {
			historySession(code) {
				getImgDetail(code).then(res => {
					if (res.code == 20000) {
						let arr = res.data;
						arr.forEach((item, index) => {
							if (index == arr.length - 2) {
								if (item.style == 'hkcartoon') {
									this.active = 2
								}
								if (item.style == 'jpcartoon') {
									this.active = 1
								}
							}
							if (index == arr.length - 1) {
								this.src = global.baseImg + '/' + item.result_image
							}

						})
						uni.setStorageSync('vison_code', '')
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取历史记录失败！')
				})

			},
			async mergeChange() {
				uni.showLoading({
					title: '生成中...'
				})
				let data = {
					"chat_type": '46',
					"action_type": 6,
					"file_extension": "mp4",
					"prompt": '视频评分',
					"origin_image": this.origin_image,
					"model": 'general'
				}
				// console.log(data);
				try {
					const id = await asyncImg(data)
					if (id.code == 20000) {
						let request_count = 0
						let stopTime = setInterval(async () => {
							if (request_count < 51) {
								const res = await getTextImg(id.data)
								if (res.code === 20000) {
									request_count += 1
									if (res.data != null) {
										if (res.data[0].status != 1) {

											let arr = res.data[0].result_list[0].videoQualityInfo
											this.markArr = [{
														name: '压缩程度',
														num: arr.compressiveStrength
													},
													{
														name: '噪声程度',
														num: arr.noiseIntensity
													},
													{
														name: '模糊程度',
														num: arr.blurriness
													},
													{
														name: '对比度',
														num: arr.colorContrast
													},
													{
														name: '饱和度',
														num: arr.colorSaturation
													},
													{
														name: '亮度',
														num: arr.luminance
													},
													{
														name: '颜色丰富度',
														num: arr.colorfulness
													},
													{
														name: '表示主观质量评分',
														num: arr.mosScore
													},
												],
												clearInterval(stopTime)

											uni.hideLoading()
										} else {
											clearInterval(stopTime)
											that.$api.msg('生成评分失败，稍后重试')
											uni.hideLoading()
										}
									}
								} else if (res.code == 40022) {
									clearInterval(stopTime)
									uni.hideLoading()
									uni.showModal({
										content: res.msg,
										confirmText: '购买算力',
										success: function(res) {
											if (res.confirm) {
												uni.navigateTo({
													url: '/pages/user/vip/vip'
												})
												uni.hideLoading()
											} else if (res.cancel) {
												console.log('用户点击取消');
												uni.hideLoading()
											}
										}
									})
								} else {
									clearInterval(stopTime)
									this.active = 0;
									this.$api.msg(res.msg)
									uni.hideLoading()
								}
							} else {
								this.$api.msg('请到历史记录查询')
								uni.hideLoading()
							}
						}, 2000)
					} else {
						this.$api.msg(id.msg)
						uni.hideLoading()
					}
				} catch (e) {
					console.log(e, 6666666666666666);
					uni.hideLoading()
				}
			},

			savePhoto(url) {
				uni.showLoading({
					mask: true,
					title: '下载中...'
				})
				uni.downloadFile({
					url: url, //仅为示例，并非真实的资源
					success: (res) => {
						// console.log(res)
						if (res.statusCode === 200) {
							// console.log('下载成功');
							var oA = document.createElement("a");
							oA.download = ''; // 设置下载的文件名，默认是'下载'
							oA.href = res.tempFilePath; //临时路径再保存到本地
							document.body.appendChild(oA);
							oA.click();
							oA.remove(); // 下载之后把创建的元素删除
							uni.hideLoading()
						} else {
							uni.hideLoading()
						}
					},
					fail: (req) => {
						console.log(req);
						uni.hideLoading()
					}
				});
			},
			previewImage() {
				uni.previewImage({
					urls: [this.src],
					current: this.src,
					loop: true
				});
			},

			copyText(arr) {
				const copiedArr = arr.flatMap(obj => Object.values(obj));
				const content = JSON.stringify(...copiedArr)
				console.log(copiedArr, content, 'content');
				wx.setClipboardData({
					data: content, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功'
						})
					}
				})
			},
			historyText() {
				uni.navigateTo({
					url: '/childCont/chest/history_chest?chat_type=46'
				})
			},
			toSlove() {
				let that = this;
				uni.chooseImage({
					count: 1,
					mediaType: ['image'],
					sourceType: ['album', 'camera'],
					maxDuration: 30,
					camera: 'back',
					success(res) {
						const tempFilePaths = res.tempFilePaths[0];
						const fileExtension = res.tempFiles[0].name.substring(res.tempFiles[0].name
							.lastIndexOf('.') + 1)
						const size = res.tempFiles[0].size;
						if (size > 3145728) { // 图片文件最大只能上传5M
							that.$api.msg('该文件已超过3M，不能上传')
							return
						}
						if (fileExtension === 'jpg' || fileExtension === 'jpeg' ||
							fileExtension === 'png'||fileExtension === 'bmp') {
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
									if (imgData.code == 20000) {
										that.src = global.baseImg + '/' + imgData.data.new_url
										that.origin_image = imgData.data.new_url
										that.active = 0;
										// console.log(imgData, 333)
										uni.hideLoading()
									} else {
										that.$api.msg(imgData.msg)
										uni.hideLoading()
									}
								}
							});
						} else {
							that.$api.msg('只允许上传 .jpg、.png、.jpeg、.bmp格式的图片')
						}
					}
				})
			},
			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.bigBox {
		position: relative;
		text-align: center;
		width: 100%;
		height: 512rpx;
		background: #000;
		padding: 32rpx 0;

		.bigImg {
			height: 512rpx;
			width: 100%;
		}

		.downImg {
			width: 55upx;
			height: 55upx;
			position: absolute;
			top: -4rpx;
			right: 4rpx;
		}

		.upImg {
			width: 55upx;
			height: 55upx;
			position: absolute;
			bottom: 95upx;
			right: 20upx;
		}
	}

	.bottom {
		padding: 32rpx;
		padding-bottom: 220rpx;

		.bot_head {
			display: flex;
			justify-content: space-between;

			.head_l {
				color: #000;
				font-size: 32rpx;
				font-weight: 500;
				line-height: 150%;
				/* 24px */
			}

			.head_r {
				color: #1F64FF;
				font-size: 26rpx;
				font-weight: 400;
				line-height: 150%;
				/* 19.5px */
			}
		}

		.item {
			display: flex;
			justify-content: space-between;
			margin-top: 24rpx;

			.item_l {
				color: #A4A4A4;
				font-size: 28rpx;
				line-height: 150%;
				/* 21px */
			}

			.item_r {
				color: #000;
				font-size: 28rpx;
				line-height: 150%;
				/* 21px */
			}
		}
	}

	.slider {
		width: 80%;
		margin-top: 40upx;
		margin-left: 80upx;
	}


	.activeColor {
		color: '#1F64FF';
		z-index: 999;
	}

	.footer {
		position: fixed;
		bottom: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		background-color: #fff;

		.text {
			font-size: 30upx;
			color: #333;
			line-height: 50upx;
		}

		.record {
			font-size: 26upx;
			color: #0E39DE;
			width: 80%;
			text-align: right;
			line-height: 50upx;
		}

		.btn {
			width: 80%;
			height: 75upx;
			line-height: 75upx;
		}
	}

	.tips {
		padding: 10rpx 39rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 91%;
		margin-bottom: 20rpx;
		margin-top: 60rpx;
	}

	.tip_m {
		flex: 1;
		color: #999;
		font-size: 24upx;
	}
</style>