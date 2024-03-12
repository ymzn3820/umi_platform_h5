<template>
	<view style="height: 100vh;">
		<view class="cont_title">
			<view class="title_t">使用场景</view>
			<view class="title_b">会议记录、课堂笔记、采访调研 专业领域一键生稿</view>
			
			<view class="cont_link">
				<!-- <view class="link_l"><image :src="voiceImg" alt="" @click="toVoice" mode="aspectFit" class="l_img"></image></view> -->
				<view class="link_l">
					<!-- <image :src="spImg" alt="" @click="toWchat" mode="aspectFit" class="r_img" style="margin-top: 10upx;"></image> -->
					<image :src="wxImg" alt="" @click="toVido" mode="aspectFit" class="r_img"></image>
				</view>
			</view>
			
			<view class="cont_history">
				<view class="history_title">历史记录</view>
				<scroll-view class="list_ul" scroll-y="true" v-if="recordList.length > 0">
					<view class="ul_li" v-for="(item, index) in recordList" :key="index" @click.stop="checkDetail(item)">
						<view class="ul_style">
							<view class="li_title">{{ item.title }}</view>
							<view class="li_time">{{ item.create_time }}</view>
							<view class="li_btn">
								<view class="btn_l">
									<u-icon name="clock" color="#8e99a8" size="16"></u-icon>
									<text class="btn_text">{{ showRecordTime(item.biz_duration) }}</text>
								</view>
								<view class="btn_r" @click.stop="delChat(item.speech_code)">
									<u-icon name="trash" color="#8e99a8" size="20"></u-icon>
								</view>
							</view>
								
						</view>
					</view>
					
				</scroll-view>
				
				<view class="on_order_list" v-else>
					暂无相关记录
				</view>
				
				<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getRecord,delRecord,createFile
	} from '@/apis/user.js'
	// const recorderManager = uni.getRecorderManager();
	export default {
		data() {
			return {
				voiceImg: global.baseImg+'/xcx/f6854c16-7e46-4e42-aad1-a2246a5af259.jpg',
				spImg: global.baseImg+'/xcx/8abed785-a5fb-45f7-9afa-97d20f32f042.jpg',
				wxImg: global.baseImg+'/xcx/2b5b0950-3a86-41fd-990b-3f81c158e219.jpg',
				file_type: 1,// 上传文件类型
			    
				// 历史记录
				page_no: 1,
				page_count: 10,
				recordList: [],
				pageTotal: 0,
				loadingType: 0,
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg',
			}
		},
		
		components: {

		},
		onLoad(options) {
			
		},
		onShow() {
          this.page_no = 1;
          this.loadingType = 0;
          this.getRecord()
		},
		methods: {
			// 前往实时录音
			toVoice() {
				uni.navigateTo({
					url: '/childPage/voice/voice',
				})
			},
			
			//微信文件转写
			toWchat() {
				let that = this;
				wx.chooseMessageFile({
				  count: 1,
				  type: 'all',
                  extension:['.mp3','.mp4','.wav','.m4a','.wma','.aac','.ogg','.amr','.flac'],//此处限制文件类型
				  success (res) {
					// tempFilePath可以作为img标签的src属性显示图片
					const size = res.tempFiles[0].size;
					const type = res.tempFiles[0].type;
					if(type == 'file') {
						this.file_type = 2
					} else if(type == 'video') {
						this.file_type = 3
					} else {
						this.file_type = 1
					}
					if(size > 536870912 && this.file_type == 2) { // 音频文件最大只能上传512M
						that.$api.msg('该文件已超过512M，不能上传')
						return
					}
					
					if(type > 2147483648 && this.file_type == 3 ) { // 视频文件最大只能上传2G
						that.$api.msg('该视频已超过2Gb，不能上传')
						return
					}
					const tempFilePaths = res.tempFiles[0].path
					const image_name = res.tempFiles[0].name
					// console.log(image_name,774)
					// console.log(this.file_type,'进来了')
					uni.uploadFile({
						url: global.loginUrl + '/api/user/oss_upload', 
						filePath: tempFilePaths,
						name: 'image',
						formData: {
							"image": tempFilePaths,
							"image_name": image_name,
							"oss_dir": 'static',
							"cate": 'create_character'
						},
						success: (uploadFileRes) => {
							let imgData = JSON.parse(uploadFileRes.data)
							console.log(imgData,1258)
							if(imgData.code == 20000) {
								let url = imgData.data.new_url
								that.createFile(url, this.file_type) // 创建识别任务
							} else {
								that.$api.msg(imgData.msg)
							}
						},
						fail: (res) => {
							that.$api.msg('上传失败')
						}
					});
				  }
				})
			},
			
			//手机音频文件上传
			toVido() {
				let that = this;
				uni.chooseFile({
				  count: 1,
				  type: 'all',
				  success(res) {
				    console.log(res, 6666)
					const size = res.tempFiles[0].size;
					const type = res.tempFiles[0].type;
					// console.log(type,955555)
					if(type.indexOf('audio') != -1) {
						this.file_type = 2
					} else if(type.indexOf('video') != -1) {
						this.file_type = 3
					} else {
						this.file_type = 1
					}
					if(size > 536870912 && this.file_type == 2) { // 音频文件最大只能上传512M
						that.$api.msg('该文件已超过512M，不能上传')
						return
					}
					
					if(type > 2147483648 && this.file_type == 3 ) { // 视频文件最大只能上传2G
						that.$api.msg('该视频已超过2Gb，不能上传')
						return
					}
					const tempFilePaths = res.tempFilePaths[0];
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
							// console.log(imgData,333)
							if(imgData.code == 20000) {
								// let url = global.baseImg + '/'+ imgData.data.new_url
								let url = imgData.data.new_url
								that.createFile(url,this.file_type) // 创建识别任务
							} else {
								that.$api.msg(imgData.msg)
							}
						},
						fail: (res) => {
							that.$api.msg('上传失败')
						}
					});
				  }
				})
			},
			
			// 创建音频转写任务
			createFile(url, type) {
				let val = { 'file_link': url }
				let that = this
				createFile(val).then(res => {
					if (res.code == 20000) {
						uni.navigateTo({
							url: '/childPage/voice/video_result?task_id='+ res.data.task_id + '&voice_url=' + url+ '&file_type=' + type,
						})
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
			
			// 获取历史列表
			getRecord() {
				let val = {
					page_size: this.page_count,
					page: this.page_no
				}
				getRecord(val).then(res => {
					if (res.code == 20000) {
						this.recordList = res.data.data;
											
						let total = res.data.total;
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						if (this.pageTotal == 1) {
							this.loadingType = 1;
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取录音列表失败');
				})
				
			},
			
			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
					page_size: this.page_count,
					page: this.page_no
				}
				getRecord(val).then(res => {
					if (res.code == 20000) {
			
						let total = res.data.total;
						if (total == 0) return
						let List = res.data.data;
						let addList = this.recordList;
						List.forEach(item => {
							addList.push(item);
						});
			
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						// console.log(this.pageTotal, 158)
						if (this.pageTotal <= this.page_no) {
							this.loadingType = 1
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取录音列表失败');
				})
			},
			
			showRecordTime(send_time) {
				
				let recordTime = Math.floor(send_time);
				
				let h = Math.floor(recordTime/3600);
				if(h<10) h = "0"+h;
				
				let m = Math.floor((recordTime%3600)/60);
				if(m<10) m = "0"+m;
				
				let s = recordTime%60;
				if(s<10) s= "0"+s
				
				return h+':'+m+':'+s
			},
			
			delChat(id) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该录音记录吗？',
					success(res) {
					  if (res.confirm) {
						  that.delCont(id)
					  }
					}
				});
			},
			
			// 删除信息
			delCont(id) {
				delRecord(id).then(res => {
					if(res.code == 20000) {
						this.$api.msg('删除成功')
						this.page_no = 1;
						this.loadingType = 0;
						this.getRecord()
					} else {
						this.$api.msg(res.msg)
					}
					
				})
				
			},
			
			// 查看详情
			checkDetail(item) {
				uni.navigateTo({
					url: '/childPage/voice/voice_detail?info='+ JSON.stringify(item),
				})
				// uni.navigateTo({
				// 	url: '/pages/gw-audiott/index',
				// })
			}

		
		}
	}
</script>

<style>
	
	
</style>

<style lang="less" scoped>
	.cont_title {
		padding: 35upx 30upx 30upx 30upx;
		display: flex;
		flex-direction: column;
		
		.title_t {
			color: #000;
			font-size: 32upx;
			font-style: normal;
			font-weight: 500;
			line-height: 42upx; 
		}
		.title_b {
			color: #666;
			font-size: 26upx;
			font-style: normal;
			font-weight: 400;
			line-height: 42upx;
		}
	}
	
	.cont_link {
		width: 100%;
		background: #fff;
		border-radius: 10upx;
		background: #FFF;
		padding: 20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20upx;
		.link_l {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			.l_img {
				width: 320upx;
				height: 310upx;
			}
			.r_img {
				width: 320upx;
				height: 150upx;
			}
		}
	}
	
	// 历史记录
	.cont_history {
		// padding: 20upx;
		.history_title {
			color: #000;
			font-size: 32upx;
			font-style: normal;
			font-weight: 500;
			line-height: 60upx;
		}
	}
	.ul_li {
		margin-bottom: 10upx;
	}
	.ul_style {
		width: 100%;
	    background: #fff;
		border-radius: 10upx;
		padding: 15upx;
		.li_title {
			color: #000;
			font-size: 28upx;
			font-weight: 500;
			line-height: 40upx;
		}
		
		.li_time {
			color: #8E99A8;
			font-size: 24upx;
			font-weight: 500;
			line-height: 40upx;
			padding: 10upx 0;
		}
		.li_btn {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.btn_l {
				display: flex;
				.btn_text {
					color: #8E99A8;
					font-size: 24upx;
					font-style: normal;
					font-weight: 400;
					line-height: 40upx;
					padding-left: 8upx;
				}
			}
			
		}
	}
	
	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		// height: 100vh;
		// width: 100vw;
	}
	.order_img {
		width: 450upx;
		height: 450upx;
		
	}
	.on_order_list {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28upx;
		height: 100upx;
		line-height: 100upx;
		// width: 100vw;
		color: #C0C4CC;
		margin-bottom: 110upx;
	}
	
</style>