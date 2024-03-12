<template>
	<view style="background-color: #FEFEFE;">
		<view class="bigBox">
			<image class="bigImg" mode="aspectFit" :src="src"></image>
			<image class="upImg" @click="previewImage" :src="icon_img" mode="aspectFit"></image>
			<image class="downImg" @click="savePhoto(src)" :src="icon_img1" mode=""></image>
		</view>

		<view class="tips">
			<text class="tip_m">Tips:识别图片中包含的物体名称，获取百科信息。
			</text>
		</view>
		<view class="bottom">
			<view @click="mergeChange(0)" :class="active==0?'active_item':'item'">
				<img :src="defaultSrc" alt="" />
				<view class="btn_content">默认</view>
			</view>
			<view @click="mergeChange(1)" :class="active==1?'active_item':'item'">
				<img :src="clearSrc" alt="" />
				<view class="btn_content">识别物体</view>
			</view>
		</view>
		<view class="der_setting" v-if="getList!=''">
			<view class="bot_head">
				<view class="head_l">调用结果</view>
				<!-- <view class="head_r">复制</view> -->
			</view>
			<view>
				<view class="item" v-for="item,index in getList" :key="index">
					<view class="item_l">{{item.type}}</view>
					<view class="item_r">{{(item.score*100).toFixed(1)}}%</view>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="text">本次生成将消耗0.6w算力/次</view>
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
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				active: 0,
				blur: 0,
				src: global.baseImg + '/xcx/com/message_center/wtst.png', //大图
				origin_image: '/xcx/com/message_center/wtst.png',
				icon_img: global.baseImg + '/xcx/com/message_center/Frame%20427320251.png',
				icon_img1: global.baseImg + '/xcx/com/message_center/Frame%20427319637.png',
				default: global.baseImg + '/xcx/com/message_center/%E7%BE%8E%E5%A5%B31.png',
				defaultSrc: global.baseImg + '/xcx/com/message_center/默认.png',
				clearSrc: global.baseImg + '/xcx/com/message_center/物体识图.png',
				getList: [],

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
				} else {
					data = {
						"chat_type": '47',
						"action_type": 3,
						"prompt": '物体识别',
						"origin_image": this.origin_image,
					}
				}
				// console.log(data);
				if (index !== 0) {
					const res = await createImg(data)
					if (res.code == 20000) {
						// this.src = global.baseImg + '/' + res.data.results[0].result_image

						const typeMap = new Map()
						typeMap.set('human', '人体')
						typeMap.set('sneakers', '胶底运动鞋')
						typeMap.set('chair', '椅子')
						typeMap.set('hat', '帽子')
						typeMap.set('lamp', '灯')
						typeMap.set('cabinet/shelf', '橱柜/ 架子')
						typeMap.set('car', '汽车')
						typeMap.set('glasses', '眼镜')
						typeMap.set('picture/frame', '照片/图画')
						typeMap.set('street lights', '街灯')
						typeMap.set('helmet', '头盔')
						typeMap.set('pillow', '枕头')
						typeMap.set('glove', '手套')
						typeMap.set('potted plant', '盆栽植物')
						typeMap.set('flower', '花')
						typeMap.set('monitor', '显示屏')
						typeMap.set('plants pot/vase', '花盆')
						typeMap.set('boots', '靴子')
						typeMap.set('umbrella', '伞')
						typeMap.set('boat', '小船')
						typeMap.set('flag', '旗帜')
						typeMap.set('speaker', '扬声器/话筒')
						typeMap.set('trash bin/can', '垃圾桶')
						typeMap.set('backpack', ' 双肩背包')
						typeMap.set('sofa', '沙发')
						typeMap.set('belt', '腰带')
						typeMap.set('carpet', '地毯')
						typeMap.set('coffee table', '咖啡桌/茶几')
						typeMap.set('tie', '领带')
						typeMap.set('bed', '床')
						typeMap.set('traffic light', '红绿灯')
						typeMap.set('necklace', '项链')
						typeMap.set('mirror', '镜子')
						typeMap.set('bicycle', '自行车')
						typeMap.set('watch', '手表')
						typeMap.set('horse', '马')
						typeMap.set('traffic sign', '交通标志')
						typeMap.set('stuffed animal', '填充玩具动物')
						typeMap.set('motorbike/motorcycle', '摩托车')
						typeMap.set('wild bird', '鸟')
						typeMap.set('laptop', '笔记本电脑')
						typeMap.set('cow', '奶牛')
						typeMap.set('clock', '时钟')
						typeMap.set('bus', '公共汽车')
						typeMap.set('nightstand', '床头柜')
						typeMap.set('sheep', '绵羊')
						typeMap.set('traffic cone', '锥形交通路标')
						typeMap.set('keyboard', '键盘')
						typeMap.set('hockey stick', '曲棍球球棍')
						typeMap.set('fan', '电扇')
						typeMap.set('dog', '狗')
						typeMap.set('blackboard/whiteboard', '白板/黑板')
						typeMap.set('mouse', '鼠标')
						typeMap.set('telephone', '电话')
						typeMap.set('airplane', '飞机')
						typeMap.set('skis', '滑雪板')
						typeMap.set('soccer', '英式足球')
						typeMap.set('combine with glove', '棒球手套')
						typeMap.set('train', '火车')
						typeMap.set('tent', '帐篷')
						typeMap.set('sailboat', '帆船')
						typeMap.set('kite', '风筝')
						typeMap.set('computer box', '计算机主机机箱')
						typeMap.set('elephant', '大象')
						typeMap.set('stroller', '折叠式婴儿车')
						typeMap.set('baseball bat', '棒球棒')
						typeMap.set('skateboard', '溜冰板')
						typeMap.set('surfboard', '冲浪板')
						typeMap.set('cat', '猫')
						typeMap.set('zebra', '斑马')
						typeMap.set('sports car', '跑车')
						typeMap.set('giraffe', '长颈鹿')
						typeMap.set('radiator', '散热器')
						typeMap.set('tennis racket', '网球拍')
						typeMap.set('skating and skiing shoes', '溜冰鞋')
						typeMap.set('baseball', '棒球')
						typeMap.set('american football', '美式橄榄球')
						typeMap.set('basketball', '篮球')
						typeMap.set('printer', '打印机')
						typeMap.set('fire hydrant', '消防栓')
						typeMap.set('projector', '投影仪')
						typeMap.set('fire extinguisher', '灭火器')
						typeMap.set('tennis ball', '网球')
						typeMap.set('frisbee', '飞盘')
						typeMap.set('fire truck', '消防车')
						typeMap.set('helicopter', '直升飞机')
						typeMap.set('carriage', '四轮马车')
						typeMap.set('bear', '熊')
						typeMap.set('globe', '地球仪')
						typeMap.set('volleyball', '排球')

						this.getList = res.data.results[0].result_list
						this.getList.forEach(item => item.type = typeMap.get(item.type))
						console.log(this.getList, 'this.getList');

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
					url: '/childCont/chest/history_chest?chat_type=47'
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
		bottom: 0upx;
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