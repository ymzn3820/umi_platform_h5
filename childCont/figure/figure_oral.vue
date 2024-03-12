<template>
	<view>
		<view class="containar">
			<view class="edit_btn">
				<view class="btn_save" @click="submit">保存</view>
				<view class="btn_upload" @click="UploadVideo" v-if="isEdit">导出视频</view>
			</view>
			
			<view class="video_li">
				<!-- <video :src="spImg" objectFit='cover' class="sp_img"></video> -->
				<image class="sp_img" :src="getImgUrl(infoDetail.video_cover_url)" mode="aspectFit"></image>
				<view class="li_edit">
					<text class="li_title">{{ project_name }}</text>
					<u-icon name="edit-pen" color="#2979ff" size="24" @click="editTitle"></u-icon>
				</view>
			</view>
			
			<view class="video_add">
				<view class="add_li">
					<view class="li_l">
						<view class="link_l"><image :src="getImgUrl(infoDetail.video_cover_url)" alt="" mode="aspectFit" class="l_img"></image></view>
					</view>
					<view class="li_l" style="width: 60%; justify-content: center;">
						<view class="l_select" @click="selectType(typeIndex)">
							<text class="select_text">{{ typeValue }}</text>
							<u-icon name="arrow-down" color="#303030" size="16"></u-icon>
						</view>
						<view class="l_select" @click="addText" v-if="typeIndex == 1 && textList.length < 5">
							<u-icon name="edit-pen" color="#2979ff" size="20"></u-icon>
							<text class="add_text">添加</text>
						</view>
					</view>
				</view>
				
				<view class="voice_type" v-if="typeIndex == 1">
					<text class="type_l">选择声音模型</text>
					<text class="type_r" @click="getType">{{ voiceText }}</text>
				</view>
				
				<view v-for="(item, index) in textList" :key="index" v-if="typeIndex == 1">
					<view class="li_textare">
						<u--textarea v-model="item.live_script" placeholder="请输入内容" style="background: #F9F9F9;" maxlength='300'></u--textarea>
					</view>
				</view>
				
				<view class="li_textare" v-if="typeIndex == 2">
					<view class="li_voice" @click="saveVideo">
						<view class="voice_btn">上传录音</view>
						<view class="voice_text">支持上传mp3,wav,m4a格式音频文件，</view>
						<view class="voice_text">时长不超过10分钟，大小不超过10M</view>
					</view>
				</view>
				
				<view class="voice_list" v-for="(item, index) in voiceList" :key="index" v-if="typeIndex == 2">
					<view class="list_li">
						<Audio :audio="getImgUrl(item.live_sound_url)" :title="item.sound_name"></Audio>
						<view class="li_del">
							<text class="del_text" @click="voiceList.splice(index,1)">删除</text>
						</view>
					</view>
				</view>
				
			</view>
			
			<view class="select_btn">
				<view class="btn_cont" @click="figureShow = true">
					<image class="cont_img" :src="selectImg"></image>
					<text class="cont_text">选择数字人</text>
				</view>
			</view>
		</view>
		<!-- 更换数字人 -->
		<u-popup :show="figureShow" mode="bottom" :round="10" @close="figureShow=false">
			<view class="pop_top">
				<view class="top_l">
					<image class="cont_img" :src="selectImg"></image>
					<text class="cont_text">选择数字人</text>
				</view>
				<u-icon name="checkmark" color="#2979ff" size="28" @click="change"></u-icon>
			</view>
			
			<view class="select_tab">
				<view :class="select_type == 0 ? 'tabs_active' : 'tabs'" @click="getList(0)">全部</view>
				<view :class="select_type == 1 ? 'tabs_active' : 'tabs'" @click="getList(1)" >真人数字人</view>
				<view :class="select_type == 2 ? 'tabs_active' : 'tabs'" @click="getList(2)" >我的数字人</view>
			</view>
			
			<view class="chat_cont" >
				<scroll-view class="list_ul" scroll-y="true" v-if="infoList.length > 0">
				    <view class="ul_li">
						<view class="ul_style" v-for="(item, index) in infoList" :key="index">
							<view class="li_style" @click="toRoal(index)">
								<view class="li_wz">
									<image :class="select_index === index ? 'li_img_active' : 'li_img'" mode="aspectFit" :src="getImgUrl(item.video_cover_url)"></image>
								</view>
								<view class="li_text">{{ item.live_name }}</view>
							</view>
						</view>
					</view>
				</scroll-view>

				<view class="voice_info" v-if="infoList.length == 0">
					<image class="info_img" mode="aspectFit" :src="noImg"></image>
					<view class="info_text">
						<text class="text_l">暂无记录,</text>
						<text class="text_r" @click="toFigure">去形象克隆</text>
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 更换标题 -->
		<u-modal :show="showTitle" @cancel="showTitle = false" confirmText="确认" confirmColor="#1F64FF" :showCancelButton='true'
			@confirm="changeKey">
			<view class="key_cont" style="">
				<view class="title">修改标题</view>
				<u-input :customStyle='{"padding":"8px", "width":"100%"}' inputAlign="center" v-model="messageTitle"
					placeholder="请输入标题" type="text" ></u-input>
			</view>
		</u-modal>
		
		<!-- 驱动类型选择 -->
		<u-picker :show="typeShow" :columns="typeList" v-model="typeIndex" keyName="label" @cancel="typeShow = false" @confirm="typeSubmit"></u-picker>
		
		<!-- 声音模型类型选择 -->
		<u-picker :show="voiceShow" :columns="selectVoice" v-model="voiceIndex" keyName="voice_name" @cancel="voiceShow = false" @confirm="voiceSubmit"></u-picker>
		
		<u-popup :show="noVoiceShow" mode="bottom" :round="10" @close="noVoiceShow=false">
			<view class="voice_info">
				<image class="info_img" mode="aspectFit" :src="noImg"></image>
				<view class="info_text">
					<text class="text_l">暂无记录,</text>
					<text class="text_r">去声音克隆</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
    import Audio from '../components/audio/audio.vue'
	import { getHumanList, createProject, getProjectDetail, editProject,
	 getToken, getVoiceTime, getAmount, getVoiceList,getSpeechVoice } from '@/apis/user.js'
	import { wxpay, webpay, getProductList, getResult } from '@/apis/chat.js'
	export default {
		data() {
			return {
				spImg: global.baseImg+'/static/picture/28e20070-2755-427e-ad25-ba4e3d122198.mp4',
				peoImg: global.baseImg+'/xcx/com/message_center/Frame%20427320074.png',
				selectImg: global.baseImg+'/xcx/com/message_center/Frame%20427320046.png',
				noImg: global.baseImg+'/xcx/com/message_center/%E9%A6%96%E9%A1%B5%20-%20boardmix%201.png',
				showTitle: false,
				messageTitle: '',
				textList :[
					{ live_script: '' }
				],
				typeShow: false,
				typeIndex: 1,
				typeValue: '文本驱动',
				typeList: [
					[{
						label: '文本驱动',
						id: 1
					}, {
						label: '音频驱动',
						id: 2
					}]
				],
				voiceList: [],
				videoArr: [],
				figureShow: false,
				select_type: 0,
				select_index: '',
				infoList: [],
				live_type: '',
				infoDetail: '',
				changeInfo: '',
				project_name: '新项目',
				isClick: true,
				isEdit: false, // 是否编辑
				productInfo: [],
				pay_price: 0,
				selectVoice: [],
				voiceShow: false,
				voiceIndex: '',
				voiceText: '点击选择',
				noVoiceShow: false,
				timer: 0
			}
		},
		components: {
	       Audio
		},
		onLoad(option) {
           if(option.info) {
			   this.infoDetail = JSON.parse(option.info)
		   }
		   
		   if(option.project_code) {
			   this.getDetail(option.project_code)
			   this.isEdit = true
		   }
		   
		   // if(option.order_id) {
			  //  this.timer = setInterval(() => {
				 //   this.getPayResult(option.order_id)
			  //  },2000)
		   // }
		   
		   let ua = navigator.userAgent.toLowerCase();
		   if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
			   if (uni.getStorageSync('openid') == null || uni.getStorageSync('openid') == 'null'||uni.getStorageSync('openid') == '') {
				   this.getCode()
			   }
		   }
		},
		onShow() { 
			this.getRecord('')
			this.getVoiceList()
			let order_id = uni.getStorageSync('orderId')
			if(order_id != '') {
				this.timer = setInterval(() => {
					this.getPayResult(order_id)
				},2000)
			}
		},
		onUnload() {
			clearInterval(this.timer);
		},
		methods: {
			getList(tip) {
				this.select_type = tip
				let type = ''
				if(tip == 0) {
					type = ''
				} else if(tip == 1) {
					type = 0
				} else {
					type = 1
				}
				this.getRecord(type)
			},
			// 获取数字人列表
			getRecord(type) {
				this.live_type = type
				let val = {
					live_type: this.live_type
				}
				getHumanList(val).then(res => {
					if (res.code == 20000) {
						this.infoList = res.data.data;
						if(this.infoDetail == '') {
							this.infoDetail = this.infoList[0]
						}		
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取录音列表失败');
				})
				
			},
			
			// 获取声音模型
			getType() {
				if(this.selectVoice.length > 0) {
					this.voiceShow = true
				} else {
					this.noVoiceShow = true
				}
				
			},
			getVoiceList() {
				let val = {
					'engine_code': '1000010006',
					'voice_type': 2,
				}
				getSpeechVoice(val).then(res => {
					if (res.code == 20000) {
						this.selectVoice = []
						this.selectVoice.push(res.data);
						
						if(res.data.length > 0) {
							this.voiceIndex = res.data[0].voice_code
							this.voiceText = res.data[0].voice_name
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取失败');
				})
			},
			
			voiceSubmit(e) {
				this.voiceIndex = e.value[0].voice_code
				this.voiceText = e.value[0].voice_name
				this.voiceShow = false
			},
			
			// 获取数字人详情
			getDetail(code) {
				let val = {
					project_code: code
				}
				getProjectDetail(val).then(res => {
					if (res.code == 20000) {
						this.infoDetail = res.data
						if(this.infoDetail.sound_type == 1) {
							this.typeIndex = 1;
							this.typeValue = '文本驱动';
							this.voiceIndex = this.infoDetail.voice_code
							this.voiceText = this.infoDetail.voice_name
							this.textList = this.infoDetail.live_sound_list
						} else {
							this.typeIndex = 2;
							this.typeValue = '音频驱动';
							this.voiceList = this.infoDetail.live_sound_list
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取失败');
				})
				
			},
			
			editTitle() {
				this.showTitle = true
			},
			
			changeKey() {
				this.project_name = this.messageTitle
				this.showTitle = false
			},
			
			addText() {
				this.textList.push({ live_script: '' })
			},
			
			selectType(type) {
				let text = '';
				let that = this;
				if(type == 1) {
					text = '切换至音频驱动，将清空相关文本信息，是否继续'
				} else {
					text = '切换至文本驱动，将清空音频相关文件，是否继续'
				}
				uni.showModal({
					title: '提示',
					content: text,
					success(res) {
					  if (res.confirm) {
						  that.typeShow = true
						  if(type == 1) {
							  this.textList  = [{ live_script: '' }]
						  } else {
							  this.voiceList = []
						  }
					  }
					}
				});
			},
			
			typeSubmit(e) {
				this.typeIndex = e.value[0].id;
				this.typeValue = e.value[0].label;
				this.typeShow = false;
			},
			
			saveVideo() {
				let that = this;
				uni.chooseFile({
				  count: 1,
				  type: 'all',
				  extension:['.mp3','.wav', '.m4a'],//此处限制文件类型
				  success (res) {
					// tempFilePath可以作为img标签的src属性显示图片
					const size = res.tempFiles[0].size;
					const imageName = res.tempFiles[0].name;
					
					if(size > 20971520) { // 音频文件最大只能上传20M
						that.$api.msg('该文件已超过20M，不能上传')
						return
					}
					
					const tempFilePaths = res.tempFilePaths[0];
					uni.uploadFile({
						url: global.loginUrl + '/api/user/oss_upload', 
						filePath: tempFilePaths,
						name: 'image',
						formData: {
							"image": tempFilePaths,
							"image_name": imageName,
							"oss_dir": 'static',
							"cate": 'create_character'
						},
						success: (uploadFileRes) => {
							let imgData = JSON.parse(uploadFileRes.data)
							// console.log(imgData,1258)
							if(imgData.code == 20000) {
								let url = global.baseImg+'/'+imgData.data.new_url
								let name = imgData.data.name
								// let val = { videoUrl: url, fileName: name }
								// that.voiceList.push(val)
								let url_val = { live_sound_url: imgData.data.new_url, sound_name: name }
								that.voiceList.push(url_val)
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
			
			toRoal(index) {
				this.select_index = index
				this.changeInfo = this.infoList[index]
			},
			
			change() {
				this.infoDetail = this.changeInfo
				this.figureShow = false
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			//保存口播视频
			submit() {
				
				let type = 1
				let list = ''
				if(this.typeIndex == 1) {
					type = 1
					list = this.textList
					if(this.voiceIndex == '') {
						this.$api.msg('请选择声音模型')
						return
					}
					if(list[0].live_script == '') {
						this.$api.msg('请填写文本')
						return
					}
				} else {
					type = 0
					list = this.voiceList
					if(list.length == 0) {
						this.$api.msg('请上传音频')
						return
					}
				}

                if(this.isClick == false) {
					return
				}
				this.isClick = false
				let val = {
				  'live_code': this.infoDetail.live_code,
				  'project_name': this.project_name,
				  'sound_type': type,
				  'voice_code': this.voiceIndex,
				  'live_sound_list': list
				}
                if(!this.isEdit) {
					createProject(val).then(res => {
					  if (res.code == 20000) {
						   this.isClick = true
						   this.$api.msg('保存成功');
						   setTimeout( () => {
							   uni.navigateTo({
								  url: '/childCont/figure/my_video'
							   })
						   }, 1000)
					  } else {
						  this.$api.msg(res.msg);
						  this.isClick = true
					  }
					}).catch(err => {
						  this.$api.msg('保存失败');
						  this.isClick = true
					})
				} else {
					val.project_code = this.infoDetail.project_code
					val.voice_code = this.voiceIndex
					editProject(val).then(res => {
					  if (res.code == 20000) {
						   this.isClick = true
						   this.$api.msg('修改成功');
						   this.isEdit = false;
						   setTimeout( () => {
							   uni.navigateTo({
								  url: '/childCont/figure/my_video'
							   })
						   }, 1000)
					  } else {
						  this.$api.msg(res.msg);
						  this.isClick = true
					  }
					}).catch(err => {
						  this.$api.msg('保存失败');
						  this.isClick = true
					})
				}
				
			},
			
			// UploadVideo() { //获取token换取时长，只是后端用来生成数据，前端无用
			//     uni.showLoading({  
			// 		title:'获取信息中'  
			// 	}); 
			// 	getToken().then(res => {
			// 		if (res.code == 20000) {
			// 			this.getTime(res.data.token)	
			// 		} else {
			// 			this.$api.msg(res.msg);
			// 			uni.hideLoading()
			// 		}
			// 	}).catch(err => {
			// 		this.$api.msg('获取token失败');
			// 		uni.hideLoading()
			// 	})
			// },
			// UploadVideo(){
			// 	// #ifdef APP-PLUS
			// 	var showLoading = plus.nativeUI.showWaiting("正在下载"); //创建一个showWaiting对象 
			// 	// #endif
			// 	let task = uni.downloadFile({
			// 		url: url,
			// 		success: res => {
			// 			const {
			// 				statusCode,
			// 				tempFilePath
			// 			} = res
			// 			if (statusCode === 200) { // saveImageToPhotosAlbum  saveVideoToPhotosAlbum  
			// 				uni.saveImageToPhotosAlbum({ //此处也可用saveVideoToPhotosAlbum
			// 					filePath: tempFilePath,
			// 					success: data => {
			// 						console.log('data----------------->', data)
			// 						uni.showToast({
			// 							title: '下载成功,文件已保存到' + data.path,
			// 							icon: 'success',
			// 						})
			// 					},
			// 					complete: (msg) => {
			// 						// #ifdef APP-PLUS
			// 						plus.nativeUI.closeWaiting()
			// 						// #endif
			// 					}
			// 				});
			// 			} else {
			// 				uni.showToast({
			// 					title: '下载失败',
			// 					icon: 'none',
			// 				})
			// 				// #ifdef APP-PLUS
			// 				plus.nativeUI.closeWaiting()
			// 				// #endif
			// 			}
			// 		},
			// 		complete: () => {
				
			// 		}
			// 	})
			// 	task.onProgressUpdate((res => {
			// 		// console.log('上传进度' + res.progress);
			// 		// console.log('已经上传的数据长度' + res.totalBytesSent);
			// 		// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
			// 		showLoading.setTitle("  正在下载" + res.progress + "%  ");
			// 	}))
			// },
			UploadVideo() {
				let val = {
				  'project_code': this.infoDetail.project_code,
				  'voice_code': this.infoDetail.voice_code,
				  'engine_code': 1000010006
				  // 'token': token
				}
				getVoiceTime(val).then(res => {
					if (res.code == 20000) {
						this.getAmount()
					} else {
						this.$api.msg(res.msg);
						uni.hideLoading()
					}
				}).catch(err => {
					this.$api.msg('获取失败');
					uni.hideLoading()
				})
			},
			
			// 获取导出价格
			getAmount() {
				let val = {
				  'project_code': this.infoDetail.project_code
				}
				let that = this;
				getAmount(val).then(res => {
					if (res.code == 20000) {
						uni.hideLoading()
						let price = res.data[0].total_amount;
						let time = res.data[0].total_length;
						this.pay_price = res.data[0].total_amount;
						let text = '本次导出视频时长'+ time +'分钟,合计'+ price+'元，（口播视频导出按每分钟5元计算，不足1分钟按1分钟计算）需支付5元。'
						uni.showModal({
							title: '提示',
							content: text,
							cancelText: "保存草稿", // 取消按钮的文字  
							confirmText: "去支付", // 确认按钮的文字 
							confirmColor: '#1F64FF',
							cancelColor: '#838A9F',
							success(res) {
							  if (res.confirm) {
								  that.getProduct()
							  } else {
								  that.submit()
							  }
							}
						});	
					} else {
						this.$api.msg(res.msg);
						uni.hideLoading()
					}
				}).catch(err => {
					this.$api.msg('获取失败');
					uni.hideLoading()
				})
			},
			
			// 获取商品列表
			getProduct() {
				let val = {
					'prod_cate_id': [8]
				}
				
				getProductList(val).then(res => {
					if (res.code == 20000) {
						this.productInfo = res.data[8][0];
						this.wxPay()
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
			
			//发起微信支付
			wxPay() {
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					"user_id": userInfo.user_id,
					"prod_id": this.productInfo.prod_id,
					"prod_cate_id": this.productInfo.prod_cate_id,
					"prod_name": this.productInfo.prod_name,
					"total_amount": this.pay_price,
					"price": this.productInfo.prod_price,
					"model_name": this.project_name,
					"live_code": this.infoDetail.project_code,
					"quantity": 1
				}
				
				if (this.isClick == false) {
					return false
				}
				this.isClick = false;
				let that = this;
				// let oWindow = window.open('', '_blank');
				
				let ua = navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
					// console.log('微信环境')
					val.open_id = uni.getStorageSync('openid')
					wxpay(val).then(res => {
						// console.log(res, 548)
						if (res.code == 20000) {
							// console.log(res, 336);
							// let data = res.data[0].req_data;
							let order_id = res.data[0].order_id;
							WeixinJSBridge.invoke(
							  'getBrandWCPayRequest', {
								 "appId":res.data[0].req_data.app_id,     //公众号ID，由商户传入     
								 "timeStamp":res.data[0].req_data.time_stamp, //时间戳，自1970年以来的秒数     
								 "nonceStr":res.data[0].req_data.nonce_str, //随机串     
								 "package":res.data[0].req_data.package,     
								 "signType":res.data[0].req_data.sign_type,  //微信签名方式：     
								 "paySign":res.data[0].req_data.pay_sign //微信签名 
							  },
							  function(res){
								  // that.timer = setInterval(() => {
								  // 	that.getPayResult(order_id)
								  // },2000)
								  if(res.err_msg == "get_brand_wcpay_request:ok" ){
									// 使用以上方式判断前端返回,微信团队郑重提示：
									//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
									//查询支付是否成功
									  that.getPayResult(order_id)
									  that.isClick = true
								  }else if(res.err_msg == "get_brand_wcpay_request:fail" ){
									  console.log("支付失败")
									  that.isClick = true
								  }else{
									  console.log("取消支付")
									  that.isClick = true
									  //修改上面生成的预支付订单状态
									  // cancelPayMoney();
								  }
							});
					
							
						} else {
							// console.log(res.msg, 663);
							that.$api.msg(res.msg)
							that.isClick = true;
						}
					}).catch(err => {
						that.isClick = true;
						that.$api.msg('获取支付信息失败！')
					})
					
				} else {
					webpay(val).then(res => {
						if (res.code == 20000) {
							let order_id = res.data[0].order_id;
							uni.setStorageSync('orderId', order_id);
							that.isClick = true;
							let url = encodeURIComponent(global.url + '/#/childCont/figure/figure_oral?order_id='+ order_id);
							let href = res.data[0].req_data.mweb_url +'&redirect_url=' + url
							// oWindow.location = href;
							window.location.href = href;
						} else {
							that.$api.msg(res.msg)
							that.isClick = true;
						}
					}).catch(err => {
						that.isClick = true;
						that.$api.msg('获取支付信息失败！')
					})
				}
			},
			
			
			// 查询支付结果
			getPayResult(order_id) {
				let val = { 'order_id': order_id }
				getResult(val).then(res => {
					if (res.code == 20000) {
						if(res.data[0].status == 1) {
							this.$api.msg('支付成功');
							this.isClick = true;
							clearInterval(this.timer);
							uni.setStorageSync('orderId', '');
							uni.redirectTo({
								url: '/childCont/figure/pay_success',
							})
						} else if(res.data[0].status == 2) {
							this.isClick = true;
							clearInterval(this.timer);
							this.$api.msg('已退款');
							uni.setStorageSync('orderId', '');
						} else if(res.data[0].status == 3) {
							this.isClick = true;
							clearInterval(this.timer);  
							this.$api.msg('支付失败');
							uni.setStorageSync('orderId', '');
						} else if(res.data[0].status == 4) {
							this.isClick = true;
							clearInterval(this.timer);  
							this.$api.msg('支付失败');
							uni.setStorageSync('orderId', '');
						} else {
							// clearInterval(this.timer);
							uni.setStorageSync('orderId', '');
						}
					} else {
						clearInterval(this.timer); 
						this.isClick = true;
						this.$api.msg(res.msg)
						uni.setStorageSync('orderId', '');
					}
				}).catch(err => {
					clearInterval(this.timer); 
					this.isClick = true;
					this.$api.msg('获取支付结果失败！')
					uni.setStorageSync('orderId', '');
				})
			},
			
			getCode() { // 非静默授权，第一次有弹框
				let local = global.url + '/#/childCont/figure/figure_oral' //当前页面的地址
				//  const local = window.location.href;
				let appid = '' //公众号里有自己查，不会找的查一下百度
				this.code = this.getUrlCode().code // 截取code	
				// 判断地址栏参数有无code,如果没有code，页面地址就跳转到微信提供的获取code的链接
				if (this.code == null || this.code == '') {
					// console.log(1116666)
					let href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid +
						"&redirect_uri=" +
						encodeURIComponent(local) + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
						// console.log(href,9995)
						window.location.href = href
				} else {
					// 获取code后自己的业务逻辑
					let that = this;
					let headers = {
						'content-type': 'application/x-www-form-urlencoded',
						'source': global.source
					}
					let val = { code: this.code }
					uni.request({
						url: global.loginUrl + '/api/user/get_open_id',
						data: val,
						header: headers,
						method: 'POST',
						success: (res) => {
							if (res.data.code == 20000) {
								// that.openId = res.data.data
								uni.setStorageSync("openid", res.data.data);
							} else {
								console.log('获取openid失败')
							}
						}
					});
					
				}
			},
			// 截取url中的code方法
			getUrlCode() { 
				var url = location.search
				
				var theRequest = new Object()
				if (url.indexOf("?") != -1) {
					var str = url.substr(1)
					var strs = str.split("&")
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1])
					}
				}
				console.log(theRequest,'111')
				return theRequest
			},
			
			toFigure() {
				uni.navigateTo({
					url: '/childCont/figure/figure_video',
				})
			},
			paySuccess() {
				uni.navigateTo({
					url: '/childCont/figure/pay_success',
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page { background: #f6f6f6; }
	.containar {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.edit_btn {
		width: 100%;
		padding: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		.btn_save {
			border-radius: 6upx;
			border: 1upx solid #1F64FF;
			padding: 15upx 40upx;
			color: #1F64FF;
			font-size: 26upx;
			font-style: normal;
			font-weight: 600;
		}
		.btn_upload {
			border-radius: 6upx;
			border: 1upx solid #1F64FF;
			padding: 15upx 20upx;
			color: #fff;
			background: #1F64FF;
			font-size: 26upx;
			font-style: normal;
			font-weight: 600;
			margin-left: 30upx;
		}
	}
	
	.video_li {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.sp_img {
			width: 50%;
			border-radius: 15upx;
			background: #fff;
		}
		.li_edit {
			display: flex;
			margin: 20upx 0;
			.li_title {
				color: #000;
				font-size: 30upx;
				font-style: normal;
				font-weight: 500;
				line-height: 50upx;
				padding-right: 20upx;
			}
		}
	}
	
	.video_add {
		width: 100%;
		flex: 1;
		background: #fff;
		border-radius: 32upx 32upx 0px 0px;
		.add_li {
			display: flex;
			.li_l {
				width: 50%;
				padding: 15upx;
				display: flex;
				align-items: center;
				.link_l {
					width: 108upx;
					height: 108upx;
					border-radius: 6upx;
					border: 4upx solid #1F64FF;
					.l_img {
						width: 100upx;
						height: 100upx;
					}
				}
				
				.l_select {
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 6upx;
					background: #F9F9F9;
					padding: 0upx 20upx;
					height: 60upx;
					margin: 0 10upx;
					.select_text {
						color: #303030;
						font-size: 26upx;
						font-style: normal;
						font-weight: 500;
						line-height: 48upx;
						margin-right: 10upx;
					}
					
					.add_text {
						color: #1F64FF;
						font-size: 28upx;
						font-style: normal;
						font-weight: 500;
						line-height: 48upx;
					}
				}
			}
		}
		.li_textare {
			padding: 20upx;
		}
		.li_voice {
			border-radius: 8upx;
			background: #F9F9F9;
			padding: 20upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.voice_btn {
				border-radius: 40upx;
				border: 1px solid #C0C0C0;
				background: #FFF;
				padding: 10upx 30upx;
				color: #9C9C9C;
				font-size: 28upx;
				font-style: normal;
				font-weight: 500;
				line-height: 150%;
				margin-bottom: 10upx;
			}
			.voice_text {
				color: #838A9F;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 40upx;
			}
		}
	}
	
	
	.key_cont {
		width: 100%;
		background-color: #FFFFFF;
		border-radius: 20upx;
		/* padding: 0upx 0 0 0; */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.title {
			font-weight: 500;
			font-size: 32upx;
			line-height: 48upx;
			color: #333;
			margin-bottom: 32upx;
			text-align: center;
		}
	}
	
	.voice_list {
		width: 100%;
		padding: 0 20upx;
		.list_li {
			width: 100%;
			border-radius: 12upx;
			background: #FFF;
			margin: 20upx 0;
			padding: 20upx;
			border: 1px solid #E9E9E9;
		}
	}
	
	.li_del {
		width: 100%;
		text-align: right;
		.del_text {
			color: #1F64FF;
			font-size: 24upx;
			line-height: 40upx;
			padding-top: 20upx;
		}
	}
	.select_btn {
		width: 100%;
		height: 100upx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0 30upx;
		.btn_cont {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.cont_img {
				width: 38upx;
				height: 38upx;
			}
			.cont_text {
				color: #000;
				font-size: 24upx;
				font-weight: 500;
				line-height: 48upx;
			}
		}
	}
	
	.pop_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20upx;
		.top_l {
			display: flex;
			.cont_img {
				width: 38upx;
				height: 38upx;
			}
			.cont_text {
				color: #000;
				font-size: 24upx;
				font-weight: 500;
				line-height: 48upx;
				margin-left: 10upx;
			}
		}
		
	}
	.select_tab {
		display: flex;
		padding: 20upx;
		.tabs {
			border-radius: 40upx;
			border: 1upx solid #EEE;
			color: #6E6E6E;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
			line-height: 48upx;
			padding: 10upx 30upx;
			margin-right: 20upx;
		}
		
		.tabs_active {
			border-radius: 40upx;
			border: 1upx solid #1F64FF;
			color: #1F64FF;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
			line-height: 48upx;
			padding: 10upx 30upx;
			margin-right: 20upx;
		}
	}
	
	.chat_cont {
		margin-top: 20upx;
	}
	.list_ul {
		width: 100%;
		padding: 0 1.5%;
		.ul_li{
			display: flex;
			align-items: center;
			justify-content: flex-start;
			flex-wrap: wrap;
		}
	}
	
	.ul_style {
		width: 32%;
	}
	
	.li_style {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		
	}
	.li_style_active {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		border: 2upx solid #1F64FF;
		border-radius: 10upx;
	}
	
	.li_wz {
		padding: 10upx;
	}
	.li_img {
		width: 200upx;
		height: 200upx;
		border-radius: 20upx;
		border: 1upx solid #E9E9E9;
	}
	.li_img_active {
		width: 200upx;
		height: 200upx;
		border-radius: 20upx;
		border: 3upx solid #1F64FF;
	}
	.li_text {
		color: #000;
		font-size: 22upx;
		font-style: normal;
		font-weight: 400;
		line-height: 50upx;
	}
	
	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 20vh;
		width: 100vw;
		.on_order_list {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28upx;
			height: 100upx;
			line-height: 100upx;
			width: 100vw;
			color: #C0C4CC;
		}
	}
	.voice_type {
		width: 100%;
		display: flex;
		padding: 10upx 20upx;
		.type_l {
			color: #000;
			font-size: 24upx;
			font-weight: 400;
			line-height: 56upx; 
			padding-right: 30upx;
		}
		.type_r {
			border-radius: 40upx;
			background: #F9F9F9;
			color: #000;
			font-size: 24upx;
			font-weight: 400;
			line-height: 150%; 
			padding: 10upx 30upx;
		}
	}
	
	.voice_info {
		width: 100%;
		height: 30vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.info_img {
			width: 160upx;
			height: 160upx;
			margin-bottom: 20upx;
		}
		.info_text {
			display: flex;
			.text_l {
				color: #8D8C8F;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
			}
			
			.text_r {
				color: #1F64FF;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
			}
		}
	}
</style>