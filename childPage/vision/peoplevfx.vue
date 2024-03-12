<template>
	<view style="background-color: #FEFEFE;">
		<view class="bigBox">
			<image class="bigImg" mode="aspectFit" :src="src"></image>
			<image class="upImg" @click="previewImage" :src="icon_img" mode="aspectFit"></image>
			<image class="downImg" @click="savePhoto(src)" :src="icon_img1" mode=""></image>
		</view>

		<view class="bottom">
			<view class="item" v-for="(item,index) in list" :key='index' @click="mergeChange(index)">
				<img :src="item.src" :style="[{border:(active == index ? '1rpx solid #1F64FF':'3rpx solid #F3F3F3')}]"
					alt="" />
				<view :style="[{color:( active == index ? '#1F64FF':'#333')}]">{{item.name}}</view>
			</view>
		</view>

		<view class="footer">
			<view class="text">本次生成将消耗30w算力</view>
			<view class="record" @click="historyText">历史记录</view>
			<button @click="toSlove" style="background-color: #1F64FF;color: #fff;" class="btn" size="default"
				type="default">上传图片</button>
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
				active: 0,
				blur: 0,
				src: global.baseImg + '/xcx/com/message_center/%E4%BA%BA%E7%89%A912.png', //大图
				origin_image: '/xcx/com/message_center/%E4%BA%BA%E7%89%A912.png',
				icon_img: global.baseImg + '/xcx/com/message_center/Frame%20427320251.png',
				icon_img1: global.baseImg + '/xcx/com/message_center/Frame%20427319637.png',
				default: global.baseImg + '/xcx/com/message_center/%E7%BE%8E%E5%A5%B31.png',
				list: [{
						src: global.baseImg + '/xcx/com/message_center/默认.png',
						name: '关闭特效'
					},
					{
						src: global.baseImg + '/xcx/com/message_center/%E5%8F%98%E5%B9%B4%E8%BD%BB.png',
						name: '皮尔斯'
					},
					{
						src: global.baseImg + '/xcx/com/message_center/%E5%8F%98%E5%B9%B4%E8%BD%BB.png',
						name: '3D卡通风'
					},
					{
						src: global.baseImg + '/xcx/com/message_center/%E5%8F%98%E5%B9%B4%E8%BD%BB.png',
						name: '天使'
					},
					{
						src: global.baseImg + '/xcx/com/message_center/%E5%8F%98%E5%B9%B4%E8%BD%BB.png',
						name: '恶魔'
					},
					{
						src: global.baseImg + '/xcx/com/message_center/%E5%8F%98%E5%B9%B4%E8%BD%BB.png',
						name: '浮世绘'
					},
					{
						src: global.baseImg + '/xcx/com/message_center/%E5%8F%98%E5%B9%B4%E8%BD%BB.png',
						name: '波普风'
					},
					{
						src: global.baseImg + '/xcx/com/message_center/%E5%8F%98%E5%B9%B4%E8%BD%BB.png',
						name: '美漫风'
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
			async mergeChange(index) {
				this.active = index
				uni.showLoading({
					title: '生成中...'
				})
				let data
				if (index === 0) {
					this.src = global.baseImg + '/' + this.origin_image
				} else if (index === 1) {
					data = {
						"chat_type": '22',
						"action_type": 3,
						"prompt": '人像特效',
						"origin_image": this.origin_image,
						"model": "potrait_effect",
						"style": 'pixar'
					}
				} else if (index === 2) {
					data = {
						"chat_type": '22',
						"action_type": 3,
						"prompt": '人像特效',
						"origin_image": this.origin_image,
						"model": "potrait_effect",
						"style": '3d_cartoon'
					}
				} else if (index === 3) {
					data = {
						"chat_type": '22',
						"action_type": 3,
						"prompt": '人像特效',
						"origin_image": this.origin_image,
						"model": "potrait_effect",
						"style": 'angel'
					}
				} else if (index === 4) {
					data = {
						"chat_type": '22',
						"action_type": 3,
						"prompt": '人像特效',
						"origin_image": this.origin_image,
						"model": "potrait_effect",
						"style": 'demon'
					}
				} else if (index === 5) {
					data = {
						"chat_type": '22',
						"action_type": 3,
						"prompt": '人像特效',
						"origin_image": this.origin_image,
						"model": "potrait_effect",
						"style": 'ukiyoe_cartoon'
					}
				} else if (index === 6) {
					data = {
						"chat_type": '22',
						"action_type": 3,
						"prompt": '人像特效',
						"origin_image": this.origin_image,
						"model": "potrait_effect",
						"style": 'bopu_cartoon'
					}
				} else {
					data = {
						"chat_type": '22',
						"action_type": 3,
						"prompt": '人像特效',
						"origin_image": this.origin_image,
						"model": "potrait_effect",
						"style": 'amcartoon'
					}
				}

				// console.log(data);
				if (index !== 0) {
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
					url: '/childPage/vision/history_text?chat_type=22'
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
									that.list[0].src = global.baseImg + '/' + imgData.data.new_url
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
			},


		}
	}
</script>

<style lang="less">
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
		margin-top: 50upx;
		flex-wrap: wrap;

		.item {
			margin-right: 32upx;
			margin-bottom: 10upx;
			text-align: center;

			img {
				width: 134upx;
				height: 134upx;

				border-radius: 4px;
			}
		}
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