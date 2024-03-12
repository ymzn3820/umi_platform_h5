<template>
	<view>
		<view class="bigBox">
			<image class="bigImg" mode="aspectFit" :src="src"></image>
			<image class="upImg" @click="previewImage" :src="icon_img" mode="aspectFit"></image>
			<image class="downImg" @click="savePhoto(src)" :src="icon_img1" mode=""></image>
		</view>

		<view class="title">识别结果</view>
		<view class="main">
			<text class="main_cont">{{ content }}</text>
		</view>
		<view class="copy" @click="copyText(content)">复制文本</view>

		<view class="footer">
			<view class="text">本次生成将消耗1.5w算力</view>
			<view class="record" @click="historyText">历史记录</view>
			<button style="background-color: #1F64FF;color: #fff;" class="btn" size="default" type="default"
				@click="toSlove">上传图片</button>
		</view>

	</view>
</template>
<script>
	import {
		createImg,
		getImgDetail
	} from '@/apis/user.js'
	export default {
		components: {

		},
		data() {
			return {
				src: global.baseImg + '/xcx/com/message_center/%E6%A1%88%E4%BE%8B%E5%9B%BE.png',
				icon_img: global.baseImg + '/xcx/com/message_center/Frame%20427320251.png',
				icon_img1: global.baseImg + '/xcx/com/message_center/Frame%20427319637.png',
				content: '视觉智能体验馆，领先的视觉智能技术，孵化AI产品新玩法',
				origin_image: '/xcx/com/message_center/%E6%A1%88%E4%BE%8B%E5%9B%BE.png'
			}
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
								this.src = global.baseImg + '/' + item.origin_image
								this.origin_image = item.origin_image
							}
							if (index == arr.length - 1) {
								this.content = item.result_list
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
								if (imgData.code == 20000) {
									that.src = global.baseImg + '/' + imgData.data.new_url
									that.origin_image = imgData.data.new_url
									console.log(imgData, 333)
									uni.hideLoading()
									that.mergeChange()
								} else {
									that.$api.msg(imgData.msg)
									uni.hideLoading()
								}
							}
						});
					}
				})
			},


			async mergeChange() {
				uni.showLoading({
					title: '识别中...'
				})
				let data = {
					"chat_type": '19',
					"action_type": 3,
					"prompt": '文字识别',
					"origin_image": this.origin_image,
					"model": "ocr_normal"
				}

				const res = await createImg(data)
				if (res.code == 20000) {
					this.content = [...res.data.results[0].result_list]
				} else if (res.code == 40022) {
					uni.showModal({
						content: res.msg,
						confirmText: '购买算力',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/user/vip/vip'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					})

				} else {
					this.$api.msg(res.msg)
				}
				uni.hideLoading()
			},

			previewImage() {
				uni.previewImage({
					urls: [this.src],
					current: this.src,
					loop: true
				});
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
			historyText() {
				uni.navigateTo({
					url: '/childPage/vision/history_text?chat_type=19'
				})
			},

			copyText(content) {
				wx.setClipboardData({
					data: content, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功'
						})
					}
				})
			}
		}
	}
</script>
<style lang="less">
	page {
		background: #fff;
	}

	.bigBox {
		position: relative;
		text-align: center;
		width: 100%;

		.bigImg {
			width: 100%;
		}

		.downImg {
			width: 55upx;
			height: 55upx;
			position: absolute;
			bottom: 20upx;
			right: 20upx;
		}

		.upImg {
			width: 55upx;
			height: 55upx;
			position: absolute;
			bottom: 95upx;
			right: 20upx;
		}

	}

	.title {
		color: #1D2129;
		font-size: 30upx;
		font-weight: 500;
		padding: 20upx;
	}

	.copy {
		font-size: 26upx;
		color: #0E39DE;
		text-align: right;
		line-height: 70upx;
		padding-right: 35upx;
	}

	.main {
		padding: 10upx 20upx;
		max-height: 350upx;
		overflow: auto;
		background: #f6f8fb;

		.main_cont {
			color: #000;
			font-size: 26upx;
			font-weight: 400;
			max-height: 350upx;
			// border-radius: 10upx;
			padding: 15upx;
			line-height: 50upx;
		}
	}

	.footer {
		position: fixed;
		bottom: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;

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
			line-height: 200%;
		}
	}
</style>