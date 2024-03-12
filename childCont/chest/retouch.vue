<template>
	<view style="background-color: #FEFEFE;height: 100vh;padding-bottom: 190rpx;">
		<view class="bigBox" v-if="src != '' ">
			<image class="bigImg" mode='aspectFit' :src="src"></image>
			<image class="smallImg" mode='aspectFit' :src="small_src"></image>
			<image class="upImg" @click="previewImage" :src="icon_img" mode="aspectFit"></image>
			<image class="downImg" @click="savePhoto(src)" :src="icon_img1" mode=""></image>
		</view>
		<view class="noImg" v-else>
			<image class='defaultImg' :src="backImg" mode="aspectFit"></image>
			<view class="img_text">暂无融合图</view>
		</view>

		<view class="material">
			<!-- <view class="tips">
				<image class="tip_l" :src="tipImg" mode="aspectFit"></image>
				<text class="tip_m">选择融合图＞选择模板图＞一键生成融合图</text>
			</view> -->
			<!-- <view class="tip_select">请选择包含人脸的融合图和模板图</view> -->

			<view class="select">
				<!-- <view class="top">
					<text class="text1">融合图选择</text>
				</view> -->
				<view class="bottom">
					<view class="item" v-for="(item,index) in picList" :key='index'
						@click="mergeChange_backdrop(index)">
						<img :src="getImgUrl(item.src)"
							:style="[{border:(active_backdrop == index ? '1rpx solid #1F64FF':'')}]" alt="" />
						<view class="activeColor" :style="[{color:( active_backdrop == index ? '#1F64FF':'#333')}]">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>

			<view class="select">
				<!-- <view class="top">
					<text class="text1">模板图选择</text>
				</view> -->
				<view class="bottom">
					<view class="item" v-for="(item,index) in list" :key='index' @click="mergeChange(index)">
						<img :src="getImgUrl(item.src)" :style="[{border:(active == index ? '1rpx solid #1F64FF':'')}]"
							alt="" />
						<view class="activeColor" :style="[{color:( active == index ? '#1F64FF':'#333')}]">{{item.name}}
						</view>
					</view>
				</view>
			</view>

			<view class="footer">
				<view class="text">本次生成将消耗6w算力/次</view>
				<view class="record" @click="historyText">历史记录</view>
				<button @click="toSlove" style="background-color: #1F64FF;color: #fff;" class="btn" size="default"
					type="default">一键生成</button>
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

				show: true,
				src: global.baseImg + '/' + 'xcx/com/message_center/bbxspscPic.png',
				small_src: global.baseImg + '/' + 'xcx/com/message_center/retouchstyle1.png',
				origin_image: 'xcx/com/message_center/bbxspscPic.png',
				refer_image: 'xcx/com/message_center/retouchstyle1.png',
				tipImg: global.baseImg + '/xcx/com/message_center/alert-circle.png',
				backImg: global.baseImg + '/xcx/com/message_center/%E7%BC%BA%E7%9C%81%E9%A1%B5.png',
				icon_img: global.baseImg + '/xcx/com/message_center/Frame%20427320251.png',
				icon_img1: global.baseImg + '/xcx/com/message_center/Frame%20427319637.png',

				picList: [{
						src: 'cxc/com/message_center/Frame%20427320254.png',
						name: '内容图'
					},
					{
						src: 'xcx/com/message_center/bbxspscPic.png',
						name: '示例1'
					},
					{
						src: 'xcx/com/message_center/bbxspscPic2.png',
						name: '示例2'
					},
					{
						src: 'xcx/com/message_center/bbxspscPic3.png',
						name: '示例3'
					},
				],
				list: [{
						src: 'cxc/com/message_center/Frame%20427320254.png',
						name: '风格图'
					},
					{
						src: 'xcx/com/message_center/retouchstyle1.png',
						name: '图例1'
					},
					{
						src: 'xcx/com/message_center/Rectangle%203462535233.png',
						name: '图例2'
					},
					{
						src: 'xcx/com/message_center/Rectangle%2034625353333.png',
						name: '图例3'
					},
				],

				active: 1,
				video_name: '',
				img_name: '',


				active_backdrop: 1,
			}
		},
		onLoad() {
			this.video_url = this.src.substring(54)
			this.video_name = this.src.substring(77)
			this.img_url = this.list[1].src
			this.img_name = this.list[1].src.substring(23)

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
								this.active = 0
								this.active_backdrop = 0
								this.list[0].src = item.origin_image
								this.origin_image = item.origin_image
								this.picList[0].src = item.refer_image
								this.refer_image = item.refer_image
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
			mergeChange_backdrop(index) {
				this.active_backdrop = index
				if (index === 0) {
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
							const fileExtension = res.tempFiles[0].name.substring(res.tempFiles[0].name
								.lastIndexOf('.') + 1) //后缀
							console.log(fileExtension, 'fileExtension');
							if (size > 3145728) { // 图片文件最大只能上传5M
								that.$api.msg('该文件已超过3M，不能上传')
								return
							}
							if (fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'png') {
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
											that.picList[0].src = imgData.data.new_url
											that.src = global.baseImg + '/' + imgData.data.new_url
											that.origin_image = imgData.data.new_url
											console.log(imgData, 333)
											uni.hideLoading()
										} else {
											that.$api.msg(imgData.msg)
											uni.hideLoading()
										}
									}
								});
							} else {
								that.$api.msg('只允许上传 .jpg、.jpeg、.png、格式的图片')
							}
						}
					})

				} else {
					this.src = global.baseImg + '/' + this.picList[index].src
					this.origin_image = this.picList[index].src
				}

			},

			mergeChange(index) {
				this.active = index
				if (index === 0) {
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
							const fileExtension = res.tempFiles[0].name.substring(res.tempFiles[0].name
								.lastIndexOf('.') + 1)
							const size = res.tempFiles[0].size;
							if (size > 3145728) { // 图片文件最大只能上传5M
								that.$api.msg('该文件已超过3M，不能上传')
								return
							}
							if (fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'png') {
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
											that.list[0].src = imgData.data.new_url
											that.small_src = global.baseImg + '/' + imgData.data
												.new_url
											that.refer_image = imgData.data.new_url
											console.log(imgData, 333)
											uni.hideLoading()
										} else {
											that.$api.msg(imgData.msg)
											uni.hideLoading()
										}
									}
								});
							} else {
								that.$api.msg('只允许上传 .jpg、.jpeg、.png、格式的图片')
							}
						}
					})

				} else {
					this.small_src = global.baseImg + '/' + this.list[index].src
					this.refer_image = this.list[index].src
				}

			},


			historyText() {
				uni.navigateTo({
					url: '/childCont/chest/history_chest?chat_type=32'
				})
			},

			async toSlove() {
				uni.showLoading({
					title: '生成中...'
				})

				let data = {
					"chat_type": '32',
					"action_type": 3,
					"prompt": '照片修图',
					"size": "1024*1024",
					"origin_image": this.origin_image,
					"refer_image": this.refer_image,
				}
				const res = await createImg(data)
				if (res.code == 20000) {
					this.src = global.baseImg + '/' + res.data.results[0].result_image
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

				uni.hideLoading()
			},

			getImgUrl(url) {
				return global.baseImg + '/' + url;
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
			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			},
			quesChange() {
				uni.showModal({
					content: '视频素材总时长不超过3分钟，超过部分会被自动截断丢弃（按输入视频顺序保留前3分钟)',
					success() {}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #fff;
	}

	.bigBox {
		position: relative;
		text-align: center;
		width: 100%;
		height: 512rpx;
		background: #000;
		padding: 32rpx 0;
		position: relative;

		.bigImg {
			height: 450rpx;

		}

		.smallImg {
			position: absolute;
			top: 32rpx;
			right: 0;
			width: 312rpx;
			height: 212rpx;
		}

		.downImg {
			width: 55upx;
			height: 55upx;
			position: absolute;
			bottom: 145rpx;
			right: 15rpx;
		}

		.upImg {
			width: 55upx;
			height: 55upx;
			position: absolute;
			bottom: 65upx;
			right: 15upx;
		}

	}

	.noImg {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 70upx 0;

		.defaultImg {
			width: 200upx;
			height: 200upx;
		}

		.img_text {
			color: #9E9E9E;
			font-size: 28upx;
			padding: 20upx 0;
		}
	}

	.material {
		margin-top: 86rpx;

		.tips {
			width: 100%;
			padding: 10upx 30upx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #E8F3FF;
			width: 100%;

			.tip_l {
				width: 42upx;
				height: 42upx;
			}

			.tip_m {
				flex: 1;
				color: #1D2129;
				font-size: 24upx;
				padding-left: 20upx;
			}
		}

		.tip_select {
			color: #86909C;
			font-size: 24upx;
			padding: 20upx 0;
		}

		.select {
			margin-top: 40upx;
			padding-left: 32upx;

			.top {
				margin-bottom: 20upx;

				.text1 {
					color: #1D2129;
					text-align: center;
					font-size: 30upx;
					font-weight: 500;
					margin-right: 32upx;
				}
			}

			.bottom {
				display: flex;
				color: #86909C;
				font-size: 24upx;

				.item {
					margin-right: 50upx;
					text-align: center;

					img {
						width: 120upx;
						height: 120upx;
						border-radius: 4px;
					}
				}
			}
		}
	}

	.activeColor {
		font-size: 24upx;
	}

	.footer {
		position: fixed;
		bottom: 0upx;
		padding-bottom: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		background: #fff;

		.text {
			font-size: 30upx;
			color: #333;
			line-height: 50upx;
			display: flex;
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
</style>