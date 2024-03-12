<template>
	<view style="background-color: #FEFEFE;height: 100%;">
		<view class="bigBox">
			<image class="bigImg" mode="aspectFit" :src="src"></image>
			<image class="upImg" @click="previewImage" :src="icon_img" mode="aspectFit"></image>
			<image class="downImg" @click="savePhoto(src)" :src="icon_img1" mode=""></image>
		</view>
		<view class="tips">
			<text class="tip_m">Tips:识别图片中包含的车辆，获取车辆品牌型号及车型百科信息。</text>
		</view>

		<view class="bottom">
			<view @click="mergeChange(0)" :class="active==0?'active_item':'item'">
				<img :src="defaultSrc" alt="" />
				<view class="btn_content">默认</view>
			</view>
			<view @click="mergeChange(1)" :class="active==1?'activeClearItem':'clearItem'">
				<img :src="clearSrc" alt="" />
				<view class="btn_content">识别车体</view>
			</view>
		</view>

		<view class="footer">
			<view class="text">本次生成将消耗0.9w算力/次</view>
			<view class="record" @click="historyText">历史记录</view>
			<button @click="toSlove" style="background-color: #1F64FF;color: #fff;" class="btn" size="default"
				type="default">上传图片</button>
		</view>

		<view class="der_setting" v-if="setList!=''">
			<view class="bot_head">
				<view class="head_l">调用结果</view>
				<!-- <view class="head_r">复制</view> -->
			</view>
			<view class="item" v-for="item,index in setList" :key="index">
				<view class="item_r">车型名称：{{item.name}}</view>
				<view class="item_r">年份：{{item.year}}</view>
				<!-- <view class="item_r">占比{{item.score}}</view> -->
			</view>

		</view>

	</view>
</template>

<script>
	import {
		createImg,
		getImgDetail
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				active: 0,
				blur: 0,
				src: global.baseImg + '/xcx/com/message_center/bbxcxsb.png', //大图
				origin_image: '/xcx/com/message_center/bbxcxsb.png',
				icon_img: global.baseImg + '/xcx/com/message_center/Frame%20427320251.png',
				icon_img1: global.baseImg + '/xcx/com/message_center/Frame%20427319637.png',
				default: global.baseImg + '/xcx/com/message_center/%E7%BE%8E%E5%A5%B31.png',
				defaultSrc: global.baseImg + '/xcx/com/message_center/默认.png',
				clearSrc: global.baseImg + '/xcx/com/message_center/bbxcxsb.png',

				setList: [],

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
								this.src = global.baseImg + '/' + item.origin_image
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
			async mergeChange(index) {
				this.active = index
				uni.showLoading({
					title: '生成中...'
				})
				let data
				if (index === 0) {
					this.src = global.baseImg + '/' + this.origin_image
				} else {
					data = {
						"chat_type": '53',
						"action_type": 3,
						"prompt": '车型识别',
						"origin_image": this.origin_image,
					}
				}
				// console.log(data);
				if (index !== 0) {
					const res = await createImg(data)
					if (res.code == 20000) {
						this.setList = res.data.results[0].result_list.result
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
						this.active = 0;
						this.$api.msg(res.msg)
					}
				}

				uni.hideLoading()
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
			historyText() {
				uni.navigateTo({
					url: '/childCont/chest/history_chest?chat_type=53'
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

<style lang="less">
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
			bottom: 40upx;
			right: 20upx;
		}

		.upImg {
			width: 55upx;
			height: 55upx;
			position: absolute;
			bottom: 125upx;
			right: 20upx;
		}

	}

	.slider {
		width: 80%;
		margin-top: 40upx;
		margin-left: 80upx;
	}

	.bottom {
		display: flex;
		color: '#86909C';
		font-size: 24upx;
		margin-left: 40upx;

		.item {
			margin-right: 32upx;
			text-align: center;

			img {
				width: 134upx;
				height: 134upx;
				border-radius: 8rpx;
				border: 1rpx solid #F3F3F3;
			}

			.btn_content {
				color: #888F9B;
				font-size: 24rpx;
			}
		}

		.active_item {
			margin-right: 32upx;
			text-align: center;

			img {
				width: 134upx;
				height: 134upx;
				border-radius: 8rpx;
				border: 1rpx solid #1F64FF;
			}

			.btn_content {
				color: #1F64FF;
				font-size: 24rpx;
			}
		}

		.clearItem {
			margin-right: 32upx;
			text-align: center;

			img {
				width: 310upx;
				height: 134upx;
				border-radius: 8rpx;
				border: 1rpx solid #F3F3F3;
			}

			.btn_content {
				color: #888F9B;
				font-size: 24rpx;
			}
		}

		.activeClearItem {
			margin-right: 32upx;
			text-align: center;

			img {
				width: 310upx;
				height: 134upx;
				border-radius: 8rpx;
				border: 1rpx solid #1F64FF;
			}

			.btn_content {
				color: #1F64FF;
				font-size: 24rpx;
			}
		}
	}

	.activeColor {
		color: '#1F64FF';
		z-index: 999;
	}

	.footer {
		position: fixed;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		padding-bottom: 30rpx;
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

	.der_setting {
		padding: 32rpx 32rpx 210rpx 32rpx;
		margin-top: 44rpx;

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