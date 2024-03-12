<template>
	<view style="background-color: #FEFEFE;height: 100vh;">
		<view class="bigBox">
			<video class="bigImg" object-fit='contain' :src="src"></video>
			<!-- <image class="upImg" @click="previewImage" :src="icon_img" mode="aspectFit"></image> -->
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
			<view class="text">本次生成将消耗12w算力/分钟</view>
			<view class="record" @click="historyText">历史记录</view>
			<button @click="toSlove" style="background-color: #1F64FF;color: #fff;" class="btn" size="default"
				type="default">上传视频</button>
		</view>
	</view>

</template>

<script>
	import {
		getImgDetail,
		asyncImg,
		getTextImg
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				active: 0,
				blur: 0,
				src: global.baseImg + '/xcx/com/message_center/bbxspfmsc.mp4', //大图
				origin_image: '/xcx/com/message_center/bbxspfmsc.mp4',
				icon_img: global.baseImg + '/xcx/com/message_center/Frame%20427320251.png',
				icon_img1: global.baseImg + '/xcx/com/message_center/Frame%20427319637.png',
				default: global.baseImg + '/xcx/com/message_center/%E7%BE%8E%E5%A5%B31.png',
				list: [{
						src: global.baseImg + '/xcx/com/message_center/默认.png',
						name: '默认'
					},
					{
						src: global.baseImg + '/xcx/com/message_center/百宝箱示例.png',
						name: '图片封面'
					},
					{
						src: global.baseImg + '/xcx/com/message_center/百宝箱示例.png',
						name: 'GIF封面'
					},
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
					uni.hideLoading()
				} else if (index == 1) {
					data = {
						"chat_type": '36',
						"action_type": 6,
						"file_extension": "mp4",
						"prompt": '视频降噪',
						"origin_image": this.origin_image,
						"style":'False',
					}
				} else {
					data = {
						"chat_type": '36',
						"action_type": 6,
						"file_extension": "mp4",
						"prompt": '视频降噪',
						"origin_image": this.origin_image,
						"style":'True',
					}
				}
				// console.log(data);
				if (index !== 0) {
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
											this.src = global.baseImg + '/' + res.data[0].result_image
											clearInterval(stopTime)
											uni.hideLoading()
										} else {
											clearInterval(stopTime)
											that.$api.msg('生成图片失败，稍后重试')
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
											} else if (res.cancel) {
												console.log('用户点击取消');
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
								clearInterval(stopTime)
							}
						}, 2000)
					} else {
						console.log(id.msg);
						uni.hideLoading()
						clearInterval(stopTime)
					}
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
					url: '/childCont/chest/history_chest?chat_type=38'
				})
			},
			async toSlove() {
			  let that = this; 
			  uni.chooseVideo({
				sourceType: ['album'],
				extension:['.mp4','.flv','.ts','.rmvb'],//此处限制文件类型
				success(res) {
				  // console.log(res, 6666)
					const size = res.size;
					
					if(size > 1073741824) { // 视频文件最大只能上传100M
						that.$api.msg('该视频已超过1GB，不能上传')
						return
					}
					const tempFilePaths = res.tempFilePath;
					uni.showLoading({
						title:'上传中'  
					});
					uni.uploadFile({
						url: global.loginUrl + '/api/user/oss_upload', 
						filePath: tempFilePaths,
						name: 'image',
						formData: {
							"image": tempFilePaths,
							"image_name": '视频',
							"oss_dir": 'static',
							"cate": 'create_character'
						},
						success: (uploadFileRes) => {
							let imgData = JSON.parse(uploadFileRes.data)
							console.log(imgData,333)
							uni.hideLoading()
							if(imgData.code == 20000) {
								that.src =global.baseImg+'/'+ imgData.data.new_url
								console.log(that.src)
							} else {
								that.$api.msg(imgData.msg)
								uni.hideLoading()
							}
						},
						fail: (res) => {
							that.$api.msg('上传失败')
							uni.hideLoading()
						}
					});
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

		.item {
			margin-right: 32upx;
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
			line-height: 75upx;
		}
	}
</style>