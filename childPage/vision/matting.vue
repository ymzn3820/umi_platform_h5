<template>
	<view>
		<view class="bigBox">
			<image class="bigImg" mode="aspectFit" :src="src"></image>
			<image class="upImg" @click="previewImage" :src="icon_img" mode="aspectFit"></image>
			<image class="downImg" @click="savePhoto(src)" :src="icon_img1" mode=""></image>
		</view>

		<!-- <view style="text-align: center;color: #888F9B;font-size: 24upx;margin: -80upx 0 0 -80upx;">请分别选择一张人物照和背景图
		</view> -->

		<view class="bottom">
			<view class="item" v-for="(item,index) in list" :key='index' @click="mergeChange(index)">
				<img :src="getImgUrl(item.src)" :style="[{border:(active == index ? '1rpx solid #1F64FF':'')}]"
					alt="" />
				<view :style="[{color:( active == index ? '#1F64FF':'#333')}]">{{item.name}}</view>

			</view>
		</view>
		<view class="bottom">
			<view class="item" v-for="(item,index) in picList" :key='index' @click="mergeChange_backdrop(index)">

				<img :src="getImgUrl(item.src)" :style="[{border:(active_backdrop == index ? '1rpx solid #1F64FF':'')}]"
					alt="" />
				<view :style="[{color:( active_backdrop == index ? '#1F64FF':'#333')}]">{{item.name}}</view>
			</view>
		</view>

		<view class="footer">
			<view class="text">本次生成将消耗12w算力</view>
			<view class="record" @click="historyText">历史记录</view>
			<button @click="toSlove" style="background-color: #1F64FF;color: #fff;" class="btn" size="default"
				type="default">一键生成</button>
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
				active: 1,
				active_backdrop: 1,
				blur: 0,
				src: global.baseImg + '/xcx/com/message_center/rect.png', //大图
				origin_image: 'xcx/com/message_center/rect.png', //人物图
				refer_image: 'xcx/com/message_center/Rectangle%2034625353333.png', //背景图
				icon_img: global.baseImg + '/xcx/com/message_center/Frame%20427320251.png',
				icon_img1: global.baseImg + '/xcx/com/message_center/Frame%20427319637.png',
				list: [{
						src: 'cxc/com/message_center/Frame%20427320254.png',
						name: '人物照'
					},
					{
						src: 'xcx/com/message_center/rect.png',
						name: '示例1'
					},
					{
						src: 'xcx/com/message_center/Vega%20AI%20%E5%88%9B%E4%BD%9C%E5%B9%B3%E5%8F%B0%201.png',
						name: '示例2'
					},
					{
						src: 'xcx/com/message_center/Vega%20AI%20%E5%88%9B%E4%BD%9C%E5%B9%B3%E5%8F%B0%202.png',
						name: '示例3'
					}
				],
				picList: [{
						src: 'cxc/com/message_center/Frame%20427320254.png',
						name: '背景图'
					},
					{
						src: 'xcx/com/message_center/白底.png',
						name: '示例1'
					},
					{
						src: 'xcx/com/message_center/Rectangle%203462535233.png',
						name: '示例2'
					},
					{
						src: 'xcx/com/message_center/Rectangle%2034625353333.png',
						name: '示例3'
					}
				],
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
										that.list[0].src = imgData.data.new_url
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
						}
					})
			
				} else {
					this.origin_image = this.list[index].src
					this.src = global.baseImg + '/' + this.list[index].src
			
				}
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
										that.picList[0].src = imgData.data.new_url
										that.refer_image = imgData.data.new_url
										console.log(imgData, 333)
										uni.hideLoading()
									} else {
										that.$api.msg(imgData.msg)
										uni.hideLoading()
									}
								}
							});
						}
					})
			
				} else {
					this.refer_image = this.list[index].src
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
			historyText() {
				uni.navigateTo({
					url: '/childPage/vision/history_text?chat_type=20'
				})
			},

			async toSlove() {
				uni.showLoading({
					title: '生成中...'
				})
				// console.log(this.origin_image,this.refer_image);
				if (this.origin_image == '') {
					return this.$api.msg('请上传人物照片')
				}

				if (this.refer_image == '') {
					return this.$api.msg('请上传背景照片')
				}
				let data = {
					"chat_type": '20',
					"action_type": 3,
					"prompt": '人像抠图',
					"quality": 1,
					"origin_image": this.origin_image,
					"refer_image": this.refer_image,
					"model": "human_segment"
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
					// this.active = 0;
					this.$api.msg(res.msg)
				}


				uni.hideLoading()
			},

			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},


		}
	}
</script>

<style lang="less">
	.bigBox {
		position: relative;
		text-align: center;
		width: 100%;
		padding-bottom: 40upx;

		.bigImg {
			width: 100%;
		}

		.downImg {
			width: 55upx;
			height: 55upx;
			position: absolute;
			bottom: 60upx;
			right: 20upx;
		}

		.upImg {
			width: 55upx;
			height: 55upx;
			position: absolute;
			bottom: 155upx;
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
		margin: 48upx;

		.item {
			margin-right: 55upx;
			text-align: center;

			img {
				width: 120upx;
				height: 120upx;
				border-radius: 4px;
			}
		}
	}

	.activeColor {
		color: '#1F64FF';
		z-index: 999;
	}

	.text {
		position: fixed;
		bottom: 172upx;
		left: 50%;
		transform: translate(-50%, -50%);
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