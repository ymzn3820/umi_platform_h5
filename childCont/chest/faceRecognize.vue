<template>
	<view style="background-color: #FEFEFE;height: 100%;">
		<view class="bigBox">
			<image class="bigImg" mode="aspectFit" :src="src"></image>
			<image class="upImg" @click="previewImage" :src="icon_img" mode="aspectFit"></image>
			<image class="downImg" @click="savePhoto(src)" :src="icon_img1" mode=""></image>
		</view>
		<view class="tips">
			<text class="tip_m">Tips:检测图像中信息，包含人脸数量，性别、年龄等多种属性，实现高性能的属性识别。
			</text>
		</view>
		<view class="bottom">
			<view class="item" v-for="(item,index) in list" :key='index' @click="mergeChange(index)">
				<img :src="item.src" :style="[{border:(active == index ? '1rpx solid #1F64FF':'3rpx solid #F3F3F3')}]"
					alt="" />
				<view :style="[{color:( active == index ? '#1F64FF':'#333')}]">{{item.name}}</view>
			</view>
		</view>

		<view class="footer">
			<view class="text">本次生成将消耗0.48w算力/次</view>
			<view class="record" @click="historyText">历史记录</view>
			<button @click="toSlove" style="background-color: #1F64FF;color: #fff;" class="btn" size="default"
				type="default">上传图片</button>
		</view>
		<view class="der_setting" v-if="setList!=''">
			<view class="bot_head">
				<view class="head_l">调用结果</view>
				<!-- <view class="head_r">复制</view> -->
			</view>
			<view>
				<view class="item">
					<view class="item_l">人脸个数</view>
					<view class="item_r">{{num}}</view>
				</view>
				<view v-for="item,index in setList" :key="index">
					<view class="item" v-if="setList.length>1">
						<view class="item_l">{{index+1}}</view>
					</view>
					<view class="item">
						<view class="item_l">人脸概率</view>
						<view class="item_r">{{item.face_probability_list}}</view>
					</view>
					<view class="item">
						<view class="item_l">性别</view>
						<view class="item_r">{{item.gender_list}}</view>
					</view>
					<view class="item">
						<view class="item_l">年龄</view>
						<view class="item_r">{{item.age_list}}</view>
					</view>
					<view class="item">
						<view class="item_l">表情</view>
						<view class="item_r">{{item.expressions}}</view>
					</view>
					<view class="item">
						<view class="item_l">是否戴眼镜</view>
						<view class="item_r">{{item.glasses}}</view>
					</view>
					<view class="item">
						<view class="item_l">是否佩戴口罩</view>
						<view class="item_r">{{item.masks}}</view>
					</view>
					<view class="item">
						<view class="item_l">是否佩戴帽子</view>
						<view class="item_r">{{item.hat_list}}</view>
					</view>
				</view>
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
				setList: [],
				num: 1,
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				active: 0,
				blur: 0,
				src: global.baseImg + '/xcx/com/message_center/bbxmbxxsc.png', //大图
				origin_image: '/xcx/com/message_center/bbxmbxxsc.png',
				icon_img: global.baseImg + '/xcx/com/message_center/Frame%20427320251.png',
				icon_img1: global.baseImg + '/xcx/com/message_center/Frame%20427319637.png',
				default: global.baseImg + '/xcx/com/message_center/%E7%BE%8E%E5%A5%B31.png',
				list: [{
						src: global.baseImg + '/xcx/com/message_center/默认.png',
						name: '默认'
					},
					{
						src: global.baseImg + '/xcx/com/message_center/面部信息生成示例.png',
						name: '识别面部信息'
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
				this.setList = []
				this.active = index
				uni.showLoading({
					title: '生成中...'
				})
				let data
				if (index === 0) {
					this.src = global.baseImg + '/' + this.origin_image
					this.setList = {}
				} else {
					data = {
						"chat_type": '48',
						"action_type": 3,
						"prompt": '面部信息识别',
						"origin_image": this.origin_image,
					}
				}
				// console.log(data);
				if (index !== 0) {
					const res = await createImg(data)
					if (res.code == 20000) {
						const data = res.data.results[0].result_list
						this.num = data.face_count
						let arr = {}
						for (let i = 0; i < data.face_count; i++) {
							arr = {
								face_probability_list: data.face_probability_list[i] * 100 + '%',
								gender_list: data.gender_list[i] === 0 ? '女' : '男',
								age_list: data.age_list[i],
								expressions: data.expressions[i] === 0 ? '中性' : '微笑',
								glasses: data.glasses[i] === 0 ? '未戴眼镜' : '戴眼镜',
								masks: data.masks[i] === 0 ? '未戴口罩' : '戴口罩',
								hat_list: data.hat_list[i] === 0 ? '未戴帽子' : '戴帽子',

							}
							this.setList.push(arr)
							console.log(this.setList, 'this.setList');
						}

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
					url: '/childCont/chest/history_chest?chat_type=48'
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
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		background-color: #fff;
		padding-bottom: 30rpx;

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