<template>
	<view style="padding:30upx;">
		<view class="title">
			<text class="title_l">*</text>
			<text class="title_r">请选择问题类型</text>
		</view>
		<view class="ans_list" >
			<view class="ans_item"  v-for="(item,index) in list" :key="index" @click="question(index)" :style="[{background:(active==index ? 'rgba(31,100,255,0.15)':'#fff'),color:(active == index ? '#1F64FF':'#333')}]">
				{{item}}
			</view>
		</view>
		<view class="title">
			<text class="title_l">*</text>
			<text class="title_r">请描述你问到的问题</text>
		</view>
		<view class="qs_cont">
			<u-textarea v-model="qs_cont" height='100' autoHeight border="none" placeholder="请在此输入您目前遇到的问题,越清晰越利于我们为您解决,感谢您的反馈"></u-textarea>
			
		</view>
		<view class="title">
			<text class="title_r">请在此上传你所遇到问题的截图/视频</text>
		</view>
		<view class="qs_cont" style='background-color: none;'>
			<view class="qs_img">
				<view v-for="(val, index) in qsImg" :key="index">
					<img class="up_img" :src="val" alt="" />
				</view>
				<img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg"
					v-if="qsImg.length < 6" />
			</view>
		</view>

		<view class="title">
			<text class="title_r">联系方式</text>
		</view>

		<view class="qs_phone">
			<u--input :customStyle='{"background":"#fff","padding":"8px"}' v-model="phone" border="none"
				placeholder="请输入您的联系方式：手机号/邮箱" type="text"></u--input>
		</view>
		<view class="tips">Tips：您的反馈将用于改进我们的产品与服务，发送后请您耐心等待，我们会有专门的人员为您处理问题...</view>
		<view class="qs_btn">
			<view class="chat_btn" @click="submit">提交</view>
		</view>


	</view>
</template>

<script>
	import {
		feedback
	} from '@/apis/chat.js'
		export default {
		data() {
			return {
				qs_cont: '',
				phone: '',
				qsImg: [],
				upImg: [],
				list: ['使用问题', '产品错误', '产品建议', '不良内容', '购买问题', '其他问题'],
				active:0,
			
			}
		},
		components: {

		},
		onLoad() {

		},
		onShow() {

		},
		methods: {
		  question(index){
				this.active=index
			},
			uploadImg() {
				let that = this;
				uni.chooseImage({
					count: 1,
					mediaType: ['image'],
					sourceType: ['album', 'camera'],
					// maxDuration: 30,
					// camera: 'back',
					success(res) {
						// console.log(res.tempFilePaths)
						const tempFilePaths = res.tempFilePaths[0];
						uni.uploadFile({
							url: global.loginUrl + '/api/user/oss_upload',
							filePath: tempFilePaths,
							name: 'image',
							formData: {
								"image": tempFilePaths,
								"oss_dir": 'static',
								"cate": 'problem_picture'
							},
							success: (uploadFileRes) => {
								let imgData = JSON.parse(uploadFileRes.data)
								if (imgData.code == 20000) {
									// that.qsImg.push(imgData.data)
									let img_val = { picture_url: imgData.data.new_url }
									that.upImg.push(img_val)
									that.qsImg.push(global.baseImg+'/'+imgData.data.new_url)
								}

							}
						});
					}
				})
			},

			//提交信息
			submit() {
				if (this.qs_cont == '') {
					this.$api.msg('反馈内容不能为空！');
					return
				}

				if (this.isClick == false) {
					return false;
				}
				this.isClick = false;

				let val = {
					'picture_url_list': this.upImg,
					'contact': this.phone,
					'problem': this.qs_cont,
					'question_type':this.active+1
				}
				console.log(val, 336)
				feedback(val).then(res => {
					if (res.code == 20000) {
						// console.log(JSON.stringify(res.data),789);
						uni.showToast({
							title: '提交成功',
							icon: 'success',
							duration: 1500
						})
						this.qs_cont = '';
						this.phone = '';
						this.qsImg = [];
						this.upImg = [];
						this.isClick = true;
					} else {
						this.isClick = true;
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.isClick = true;
					this.$api.msg('内容提交失败');
				})
			}



		}
	}
</script>

<style scoped lang="less">
	page {
		background: #f6f8fb;
	}

	.qs_cont {
		background: #fff;
		border-radius: 16upx;
		padding: 10upx;
		margin-bottom: 30upx;
	}

	.title {
		display: flex;
		align-items: center;
		font-weight: 500;
		font-size: 30upx;
		line-height: 40upx;
		color: #333333;
		margin-bottom: 15upx;
	}

	
	.title_r {
		color: #333;
	}

	.ans_list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 20upx;
		margin: 32upx 0;

		.ans_item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding: 20upx 46upx;
			width: calc(25%-10upx);
			background: #fff;
			color: #333;
			border-radius: 8upx;
		}
	}

	.qs_img {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin: 20upx;
		flex-wrap: wrap;

		.up_img {
			width: 120rpx;
			height: 120rpx;
			padding: 10rpx;
		}
	}

	.qs_btn {
		position: fixed;
		bottom: 100upx;
		width: calc(100% - 60upx);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chat_btn {
		width: calc(100% - 60upx);
		display: flex;
		align-items: center;
		justify-content: center;
		background: #1F64FF;
		border-radius: 12upx;
		line-height: 90upx;
		font-style: normal;
		font-weight: 500;
		font-size: 34upx;
		color: #fff;
	}

	.chat_btn:active {
		opacity: 0.5;
	}

	.tips {
		color: #949494;
		font-size: 24upx;
		font-weight: 400;
		line-height: 150%;
		margin-top: 20upx;
	}
	
</style>