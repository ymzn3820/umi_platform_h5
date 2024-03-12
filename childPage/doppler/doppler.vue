<template>
	<view>
		
		<view>
			<view class="cont_title">
				<view class="title_t">
					<text class="t_left">给我一张</text>
					<text class="t_right">四维彩超</text>
				</view>
				<view class="title_t">
					<text class="t_left">我能给你宝宝预测出未来模样</text>
				</view>
			</view>
			<!-- 图片示例  参考图-->
			<view class="ex_ul" v-if="!sd_msgLoad && StableDiffusionList.length == 0 && isuser">
				<view class="ex_time" v-if="imgList.length == 0">
					<image src="@/static/user/upload.png" mode="aspectFit" class="upload_img" @click="takePhoto"></image>
					<view class="upload_text">点击上传小宝宝的四维彩超图</view>
				</view>
				
				<view class="ex_img" v-for="(val, index) in imgList" :key="index" v-if="imgList.length > 0" style="position: relative;">
					<image :src="getImgUrl(val)" alt="" mode="aspectFit" class="li_img"></image>
					<img class="del_img" :src="delImg" alt="" @click="imgList.splice(index,1)"/>
				</view>
			</view>
			
			<!-- sd绘图 -->
			<view class="ex_ul" v-for="(item,index) in StableDiffusionList" :key="index" v-if="!sd_msgLoad && StableDiffusionList.length > 0 && isuser">
				<view class="ex_img" v-for="(val, tip) in item.image_urls" :key="tip">
					<image :src="val.url" alt="" @click.stop="checkImg(index,tip)" mode="aspectFit" class="li_img"></image>
					<view class="ex_btn">
						<u-icon name="warning" color="#fff" size="18"></u-icon>
						<text class="btn_text">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
					</view>
				</view>
			</view>
			
			<!-- sd绘图生成中 -->
			<view class="ex_ul" v-if="sd_msgLoad">
				<view class="ex_time">
					<u-loading-icon  textSize="20"></u-loading-icon>
					<view class="wait_text">生成中,耗时{{ sd_timer }}秒</view>
				</view>
			</view>
			
			<!-- sd充会员 -->
			<view class="ex_ul" v-if="!sd_msgLoad && !isuser">
				<view class="ex_time">
					<view class="wait_text">{{ sd_desc }}</view>
					<view style="display: flex; justify-content: space-around;" v-if="draw_tip == true">
						<u-button type="warning" color="#FF9B17"
							:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'100%'}"
							@click='goMember'>开通流量包</u-button>
					</view>
				</view>
			</view>
			
			<view class="query">
				<view class="query_type">
					<view class="tabs">参数</view>
				</view>
				
				<view class="query_li">
					<view class="li_size" v-for="(val, index) in sdList" :key="index" :style="[{border:(sizeIndex == index ? '1px solid #1F64FF':'1px solid #999')}]" 
					 @click="selctSize(val.size,index)">
						<view class="size_back">
							<view class="size_zheng" v-if="val.type === 'zheng'" :style="[{background:(sizeIndex == index ? '#B2CAFF':'#DDD')}]"></view>
							<view class="size_gao" v-if="val.type === 'gao'" :style="[{background:(sizeIndex == index ? '#B2CAFF':'#DDD')}]"></view>
							<view class="size_chang" v-if="val.type === 'chang'" :style="[{background:(sizeIndex == index ? '#B2CAFF':'#DDD')}]"></view>
						</view>
						<view class="size_tip" :style="[{color:(sizeIndex == index ? '#1F64FF':'#999')}]">{{ val.size }}</view>
					</view>
				</view>
				
			</view>
		</view>
		

		<!-- 底部导航栏 -->
		<view class="flex-column-center">
			<view class="btn_link">
				<view class="link_l">
					  <view class="l_chat" style="margin-right: 15rpx;"
					 @click="addDraw" v-if="StableDiffusionList.length > 0">
					  	 <u-icon name="plus" color="#1F64FF" size="14"></u-icon>
					  	 <text class="l_text">新绘画</text>
					   </view>
				</view>
				<view class="link_l">
					<text class="l_text" @click="toHistory">历史记录</text>
				</view>
			</view>
			<view class="bottom-dh-char" style="font-size: 55rpx;">
				<view class="bottom_cont">
					<view class="bottom_cont">
						<view class="bottom_buy" @click="submit">AI生成</view>
					</view>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	import {
		chat_session,
		getEnText,
		sdDraw,
		getSdDraw
	} from '@/apis/chat.js'
    import { saveFootprint } from "@/apis/user.js"
	export default {
		components: {
			
		},
		data() {
			return {
				
				draw_tip: false,
				
				sd_timer: 0,
				sd_t_time: 0,
				sd_desc: '',
				sd_draw_time: 0,
				sd_msgLoad: false,
				modelShow: false,
				modelList: [],
				modelValue: '',
				modelIndex: '',
				StableDiffusionList: [],
				sd_wait: 0,
				sd_complete: '', // 反向提示词
				sd_show: false,
				samplerShow: false,
				sdText: '',
				sdHideText: '',
				imgList: [],//用于图生图
				sd_type: 1, //用于选择画图类型
				sd_photo_type: 1,
				queryIndex: 0, //用于选中风格
				isSd: true, //防点击
				
				active: 0,
				chat_type: 9,
				chatType: 'Stable Diffusion',
				isuser: true,
				avatar: '',
				userInfo: "",
				dallshow: false,
				selectDone: 0,
				size: '512*768',
				sizeIndex: 0,
				query_type: 1,
				
				
				sdList: [ {
					id: '512*768',
					size: '512*768',
					type: 'gao'
				},{
					id: '512*512',
					size: '512*512',
					type: 'zheng'
				}, {
					id: '768*512',
					size: '768*512',
					type: 'chang'
				}],
				
				delImg: global.baseImg+'/xcx/853ff4b9-283a-4917-b922-f2329cbcb562.jpg',
			}
		},

		onShow() {
			// this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			this.isuser = true; // 清空所有登录或升级会员提示
           
		},
		onLoad(option) {
			
			
		},
		onHide() {
			
		},
		methods: {
			submit() {
				if(!this.isSd) {
					return
				}
				if(this.imgList.length == 0) {
					this.$api.msg('请上传四维彩超图')
					return
				}
				this.isuser = true;
				this.draw_tip = false;
				this.isSd = false;
				this.StableDiffusionList = []
				// 清除消息
				this.sd_msgLoad = true
				this.sdDraw()
			},

			// sd绘画
			sdDraw() {
				let data = {
					"chat_type": '-1',
					"action_type": '5',
					"images": this.imgList,
					"content": 'masterpiece, 8k, great job, hd, baby, {1 year old baby}, {Wearing cute clothes},cute, indoors, realistic skin, detailed skin texture, light on face, eyes open, asian baby, real,Full body or half body',
					"content_zh": '',
					"negative_prompt": 'Low resolution, fake skin, rough skin texture, open eyes, non-Asian baby, deformed fingers, deformed body, deformed face, brightness,naked',
					"negative_prompt_zh": '',
					"sd_model_checkpoint": '儿童摄影WFChild_v1.0',
					"sampler_index": 'DPM++ 2M Karras',
					"size": this.size,
					"app_type": 2,
					"session_code": '',
				}
				let that = this;
				that.sd_timer = 0;
				that.sd_t_time = setInterval(() => {
					that.sd_timer += 1;
				}, 1000)

				that.imgList = [];
				sdDraw(data).then(res => {
					
					// console.log(res, 489)
					if (res.code == 20000) {
						let data = {
							"tag": res.data.tag,
						};
						let request_count = 0;
						that.sd_draw_time = setInterval(() => {
							if (request_count < 101) { // 最多轮询100次
								getSdDraw(data).then(val => {
									// console.log(resposne);
									if (val.code == 20000) {
										request_count += 1;
										
										if(val.data != null) {
											that.isSd = true;
											if(val.data[0].is_mod == 1) {
												that.$api.msg('图片内容涉及敏感请重新提问。')
											}
											
											if (val.data[0].status == 0) {
												
												let img_urls = [];
												let url_val = {
													url: global.baseImg +'/'+ val.data[0].content
												}
												img_urls.push(url_val);
												// console.log(img_urls,886)
												// console.log(val.data[0].content, 885)
												let obj = {
													"create_time": val.data[0].create_time,
													"finish_reason": "stop",
													"session_code": val.data[0].session_code,
													"chat_group_code": val.data[0].chat_group_code,
													"size": val.data[0].size,
													"role": "assistant",
													"image_urls": img_urls,
													"time": that.sd_timer,
													"is_mod": val.data[0].is_mod,
													"is_like": 0
												}
												
												let img_arr = [];
												img_arr.push(obj);
														
												// that.StableDiffusionList.push(obj);
												if(that.StableDiffusionList.length == 0) {
													that.StableDiffusionList = img_arr;
												}
												
												
												that.isuser = true;
												that.sd_msgLoad = false;
												clearInterval(that.sd_t_time);
												clearInterval(that.sd_draw_time);
												let save_val = {
													"type_name": "彩超宝宝",
													"type_code": "cdu",
													"title": '彩超宝宝',
													"eid": val.data[0].session_code,
													"image_url": val.data[0].content
												}
												
												that.saveFootprint(save_val)
											} else if(val.data[0].status == 1) {
												that.sd_msgLoad = false;
												clearInterval(that.sd_t_time);
												clearInterval(that.sd_draw_time);
												that.$api.msg('生成失败，本次不消耗绘画次数')
												that.isSd = true;
											}
										}
										
									} else {
										that.sd_msgLoad = false;
										// that.isTime = false;
										clearInterval(that.sd_t_time);
										clearInterval(that.sd_draw_time);
										that.$api.msg(res.msg)
										that.isSd = true;
									}
								})
							} else {
								that.sd_msgLoad = false;
								// that.isTime = false;
								clearInterval(that.sd_t_time);
								clearInterval(that.sd_draw_time);
								that.$api.msg('等待时间过长，请稍后前往历史记录查看')
								that.isSd = true;
							}
			
						}, 2000)
			
					} else if (res.code < 49999) {
						that.isuser = false;
						that.sd_msgLoad = false;
						that.isSd = true;
						// that.isTime = false;
						clearInterval(that.sd_t_time);
						clearInterval(that.sd_draw_time);
						// that.$api.msg(res.msg)
						that.sd_desc = res.msg;
						if(res.code == 40022) {
							that.draw_tip = true;
						} else {
							that.draw_tip = false;
						}
						
					} else {
						that.sd_msgLoad = false;
						// that.isTime = false;
						clearInterval(that.sd_t_time);
						clearInterval(that.sd_draw_time);
						that.$api.msg(res.msg)
						that.isSd = true;
					}
				}).catch(err => {
					that.sd_msgLoad = false;
					// that.isTime = false;
					clearInterval(that.sd_t_time);
					clearInterval(that.sd_draw_time);
					that.$api.msg('绘图失败')
					that.isSd = true;
				})
			},
			

			goMember() {
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/pages/user/vip/vip',
					})
				}
			},
			goToLogin() {
				uni.navigateTo({
					url: '/pages/login/login',
				})
			},

			toHistory() {
				uni.navigateTo({
					url: '/childPage/doppler/doppler_history'
				})
			},
			
			addDraw() {
				this.StableDiffusionList = []
				this.imgList = []
			},
			
			
			// 图片预览
			checkImg(index,tip) {
				let url = ''
				url = this.StableDiffusionList[index].image_urls;
				let img_url = url[tip].url;
				// console.log(img_url,332)
				uni.previewImage({
					urls:[img_url],
					current:0
				})
				
			},
			
			// 上传图片
			takePhoto() {
				let that = this;
				uni.chooseImage({
				  count: 1,
				  // mediaType: ['image'],
				  sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				  sourceType: ['album', 'camera'],
				  success(res) {
				    // console.log(res.tempFiles)
					// console.log(res,589)
					const tempFilePaths = res.tempFilePaths[0];
					that.imgList = []
					uni.showLoading({ title: '上传中' });
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
							console.log(imgData,333)
							if(imgData.code == 20000) {
								// let url = global.baseImg + '/'+ imgData.data.new_url
								let url = imgData.data.new_url
								that.imgList.push(url)
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
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			
			selctSize(size, index) {
				this.size = size;
				this.sizeIndex = index
			},
			
			// 保存到最近打开
			saveFootprint(data) {
				saveFootprint(data).then(res => {
					if (res.code == 20000) {
						
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('保存失败！')
				})
			},
			
		}
	}
</script>

<style scoped lang="less">

	.bottom-dh-char {
		background-color: #fff;
		width: calc(100% - 32upx);
		// height: 110upx;
		padding: 16upx;
	}

	.bottom_cont {
		background: #fff;
		width: 100%;
        .bottom_cont {
        	display: flex;
        	justify-content: center;
        	flex-direction: column;
        	padding-bottom: 25upx;
        }
        .bottom_buy {
        	width: 90%;
        	height: 80upx;
        	background: #1F64FF;
        	border-radius: 6px;
        	font-style: normal;
        	font-weight: 500;
        	font-size: 14px;
        	line-height: 20px;
        	color: #FFFFFF;
        	display: flex;
        	justify-content: center;
        	align-items: center;
        	margin: 20upx auto 0;
        }
		
	}

	.isPosition {
		position: fixed;
		z-index: 99;
	}

	.flex-column-center {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		// padding: 0 15upx;
	}
	
	.ex_ul {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.ex_time {
		width: calc(100% - 40upx);
		box-shadow: 0px 2px 10px 0px rgba(51, 51, 51, 0.1);
		border-radius: 10upx;
		background: #fff;
		margin-top: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 500upx;
		.wait_text {
			color: #000;
			font-size: 28upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			padding: 15upx;
			word-break:break-all;
		}
		.upload_img {
			width: 160upx;
			height: 160upx;
		}
		.upload_text {
			color: #666;
			font-size: 26upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%; 
			padding: 20upx 0;
		}
	}
	.ex_img {
		width: calc(100% - 40upx);
		box-shadow: 0px 2px 10px 0px rgba(51, 51, 51, 0.1);
        border-radius: 10upx;
		// padding: 10upx 0;
		position: relative;
		background: #fff;
		margin-top: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
		.li_img {
			width: 100%;
			height: 500upx;
			border-radius: 10upx;
		}
		.del_img {
			position: absolute;
			top: 0;
			right: 0;
			width: 36upx;
			height: 36upx;
		}
		.ex_tip {
			position: absolute;
			top: 0;
			right: 0;
			background: rgba(0,0,0,0.3);
			border-radius: 0 10upx 0 10upx;
			color: #FFF;
			font-size: 22upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			padding: 5upx 10upx;
		}
		.ex_use {
			position: absolute;
			bottom: 30upx;
			border-radius: 8upx;
			background: #1F64FF;
			padding: 15upx 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			font-weight: 500;
			color: #fff;
		}
		
		.ex_update {
			position: absolute;
			bottom: 0upx;
			right: 0upx;
			background: rgba(0,0,0,0.3);
			border-radius:10upx;
			padding: 15upx;
		}
		
		.ex_btn {
			position: absolute;
			bottom: 0upx;
			right: 0upx;
			background: rgba(0,0,0,0.3);
			border-radius:10upx;
			padding: 15upx;
			display: flex;
			align-items: flex-start;
			.btn_text {
				color: #fff;
				font-size: 22upx;
				padding-left: 10upx;
			}
		}
		
		.ex_like {
			
			background: rgba(0,0,0,0.3);
			border-radius:10upx;
			padding: 10upx;
		}
		.ex_nlike {
			background: rgba(31, 100, 255,0.3);
			border-radius:10upx;
			padding: 10upx;
		}
		.like_up {
			position: absolute;
			top: 20upx;
			right: 20upx;
		}
		
		.like_down {
			position: absolute;
			top: 100upx;
			right: 20upx;
		}
		.ex_upload {
			position: absolute;
			top: 180upx;
			right: 20upx;
		}
	}
	
	.query {
		padding: 30upx 20upx 20upx 20upx;
		background: #fff;
		margin-top: 20upx;
		.query_type {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1upx solid #DBDBDB;
			.active_tabs {
				font-style: normal;
				font-weight: 500;
				font-size: 28upx;
				line-height: 50upx;
				color: #000;
				border-bottom: 4upx solid #1F64FF;
				padding: 7upx 0;
			}
			
			.tabs {
				font-style: normal;
				font-weight: 500;
				font-size: 28upx;
				line-height: 50upx;
				color: #000;
				padding: 7upx 0;
			}
		}
	}
	
	.query_li {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin-bottom: 180upx;
	}
	
	.li_size {
		width:17%;
		height: 120upx;
		border-radius: 10upx;
		position: relative;
		margin: 10upx 1%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.size_back {
			width: 100%;
			height: 80upx;
			display: flex;
			align-items: center;
			justify-content: center;
			.size_zheng {
				width: 40upx;
				height: 40upx;
			}
			.size_chang {
				width: 60upx;
				height: 40upx;
			}
			.size_gao {
				width: 40upx;
				height: 60upx;
			}
		}
		.size_tip {
			height: 40upx;
			text-align: center;
			font-size: 24upx;
			line-height: 40upx;
		}
		
	}
	
	.btn_link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: calc(100% - 30upx);
		background: #fff;
		border-top: 1px solid #DBDBDB;
		padding: 10upx 15upx 0 15upx;
		.link_l {
			display: flex;
			align-items: center;
			.l_chat {
				border-radius: 6upx;
				border: 1upx solid #1F64FF;
				padding: 5upx 10upx;
				color: #1F64FF;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				display: flex;
				align-items: center;
				
			}
			.l_text {
				padding-left: 8upx;
				color: #1F64FF;
				font-size: 24upx;
			}
			.l_wait {
				padding-left: 8upx;
				color: #333;
				font-size: 24upx;
			}
		}
	}
	
	.cont_title {
		padding: 25upx 0 0 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.title_t {
			display: flex;
			.t_left {
				color: #000;
				text-align: center;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 40upx;
			}
			.t_right {
				color: #1F64FF;
				text-align: center;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 40upx;
			}
		}
	}
	
</style>
