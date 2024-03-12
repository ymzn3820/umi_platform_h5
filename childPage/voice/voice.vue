<template>
	<view>
	  <view class="voice_cont">
		  <view class="cont_top">
			  <view class="top_left">
				  <image class="icon_img" :src='stStart ? blueImg : gradeImg' />
				  <text :class="[stStart ? 'start_text' : 'end_text']">{{showRecordTime}}</text>
			  </view>
			  <!-- <view class="top_right" @click="toHistory">
				  <text class="history_text">历史记录</text>
				  <u-icon name="arrow-right" color=" #1F64FF" size="14"></u-icon>
			  </view> -->
		  </view>
		  <view class="cont_ul">
			  <view class="start_cont" v-if="!stStart && stResult == '' && recordFiles.length == 0">
			  			  <view class="tip">
			  				  <text class="tip_text">点击下方</text>
			  				  <image class="tip_img" :src='centerImg' />
			  				  <text class="tip_text">点击下方</text>
			  			  </view>
			  			  <view class="tip">
			  				  <text class="tip_text">靠近手机讲话，生成效果更佳哦</text>
			  			  </view>
			  		  </view>
			  		  
			  		  <view class="list_ul" v-if="recordFiles.length > 0">
			  			  <view class="ul_li" v-for="(item,index) in recordFiles" :key="index">
			  				  <view class="li_title">{{ index*10 }} - {{ (index+1)*10 }} 分钟</view>
			  				  <view class="li_cont">{{ item.value }}</view>
			  			  </view>
			  		  </view>
			  		  
			  		  <view class="record_cont" v-if="(stResult != '' || message != '') && stStart">
			  			  <veiw class="record_ul">
			  				  <view class="cont_title">
			  				     <text>{{ messageTitle }}</text>
			  				     <image class="icon_img" :src='editImg' @click="showTitle = true" />
			  				  </view>
			  				  <view class="cont_text">
			  				  	  <text class="text_l"> {{ stResult }} </text>
			  				      <text class="text_r"> {{ message }} </text>
			  				  </view>
			  			  </veiw>
			  		  </view>
			  		  
			  		  <view class="btn" v-if="!stStart">
			  			  <view class="btn_cont">
			  				    <view class="btn_text" @click="readyGO"><image class="btn_img" :src='startImg'></view>
			  			  </view>
			  		  </view>
			  		  
			  		  <view class="btn" v-if="stStart">
			  			  <view class="btn_cont">
			  				  <view class="btn_text"></view>
			  				  <view class="btn_text" @click="breakRecord" v-if="!pause_status"><image class="btn_img" :src='endImg'></view>
			  				  <view class="btn_text" @click="pauseRecord" v-if="pause_status"><image class="btn_img" :src='startImg'></view>
			  				  <view class="btn_text" @click="endRecord"><image class="btn_img" :src='saveImg'></view>
			  			  </view>
			  		  </view>
			  </view>
		  </view>
	  
	  <!-- 更换标题 -->
	  <u-modal :show="showTitle" @cancel="closeKey" confirmText="确认" confirmColor="#1F64FF;" :showCancelButton='true'
	  	@confirm="changeKey">
	  	<view class="key_cont" style="">
	  		<view class="title">录音标题</view>
	  		<u-input :customStyle='{"padding":"8px", "width":"100%"}' inputAlign="center" v-model="messageTitle"
	  			placeholder="请输入标题" type="text" ></u-input>
	  	</view>
	  </u-modal>
	</view>
</template>

<script>
	// const recorderManager = uni.getRecorderManager();
	// const innerAudioContext = uni.createInnerAudioContext();
	const SpeechTranscription = require("../../utils/st")
	const sleep = require("../../utils/util").sleep
	
	import {
		getToken,saveRecord,
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				message: '未开始识别语音', //录音转文字初步结果
				stResult: '', //录音转文字最终结果
				stStart : false, //是否开启录音
				pause_status: false,// 是否继续录音1是0否
				showTitle: false, // 更改标题
				
				recordFiles:[], // 录音片段
				recordTime:0,//录音时长 毫秒
				messageTitle: '', // 文本记录时间
				timer_li: 0, //录音计时器
				token: '',
				
				startImg: global.baseImg+'/xcx/d3c43cc5-bb3e-4914-b2bd-5d305e2e9771.jpg',
				bfImg: global.baseImg+'/xcx/e47bc10b-bb4c-43a1-8d5a-1bda0b917003.jpg',
				centerImg: global.baseImg+'/xcx/32342a2a-00bd-41c9-a809-c3180ee64713.jpg',
				endImg: global.baseImg+'/xcx/90a9be00-0c42-440e-9ea9-267e52d7808b.jpg',
				gradeImg: global.baseImg+'/xcx/cb470639-4f41-4dc6-aa95-701d10b6d3ec.jpg',
				blueImg: global.baseImg+'/xcx/3a34e5c7-c73f-4193-afb7-adc7301b7dbd.jpg',
				saveImg: global.baseImg+'/xcx/720a629d-8e4a-4ea4-bcda-db4b2146252c.jpg',
				editImg: global.baseImg+'/xcx/4a6dcc63-9e07-448b-a088-1f98d9dcac54.jpg',
			}
		},
		
		computed: {
			showRecordTime() {
				
				var recordTime = Math.floor(this.recordTime/1000);
				
				var h = Math.floor(recordTime/3600);
				if(h<10) h = "0"+h;
				
				var m = Math.floor((recordTime%3600)/60);
				if(m<10) m = "0"+m;
				
				var s = recordTime%60;
				if(s<10) s= "0"+s
				
				return h+':'+m+':'+s
			},
		},
		components: {
			
		},
		
		onLoad: async function (options) {
			wx.getRecorderManager().onFrameRecorded((res)=>{
				// console.log(res,66665)
				console.log(this.st,5869)
				console.log(this.stStart,63214)
				if (res.isLastFrame) {
					console.log("record done")
				}
				if (this.st && this.stStart) {
					console.log("send " + res.frameBuffer.byteLength)
					this.st.sendAudio(res.frameBuffer)
				}
			})
			wx.getRecorderManager().onStart(()=>{
				console.log("start recording...")
			})
			wx.getRecorderManager().onStop((res) => {
				console.log(res,"stop recording...")
				this.uploadVoice(res.tempFilePath);
				
				// if (res.tempFilePath) {
				// 	wx.removeSavedFile({
				// 		filePath:res.tempFilePath
				// 	})
				// }
			})
			wx.getRecorderManager().onError((res) => {
				console.log("recording failed:" + res)
			})
	
			try {
				await this.getRcordToken()
			} catch (e) {
				console.log("error on get token:", JSON.stringify(e))
				return
			}
			console.log(this.token,8854)
			let st = new SpeechTranscription({
				url : 'wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1',
				appkey: 'ccR3tWBwNilIBRKL',
				token: this.token
				// token: '9468efe7f4c84778a398d70f0d910c27'
			})
	
			st.on("started", (msg)=> {
				console.log("Client recv started")
				// this.stResult = msg
			}),
	
			st.on("changed", (msg)=>{
				console.log("Client recv changed:", msg)
				let result = JSON.parse(msg)
				console.log(result,4158)
				if(result.header.name == 'TranscriptionResultChanged'){
					this.message = result.payload.result;
					this.toBottom()
				}
				
			}),
		  
			st.on("completed", (msg)=>{
				console.log("Client recv completed:", msg)
				// this.testValue = JSON.stringify(msg)
			}),
	
			st.on("begin", (msg)=>{
				console.log("Client recv sentenceBegin:", msg)
				let result = JSON.parse(msg)
				console.log(result,4158)
				if(result.header.name == 'SentenceBegin') {
					this.message = ''
					// this.$forceUpdate()
				}
				// this.stResult = msg
			})
	  
			st.on("end", (msg)=>{
				console.log("Client recv sentenceEnd:", msg)
				let result = JSON.parse(msg)
				// console.log(result,4158)
				if(result.header.name == 'SentenceEnd') {
					this.message = ''
					this.stResult = this.stResult + result.payload.result + '\n';
					this.$forceUpdate()
					// console.log(this.stResult,9958)
				}
			})
		
			st.on("closed", () => {
				console.log("Client recv closed")
				if(this.stStart) {
					console.log('出现close')
					// clearInterval(this.timer_li);
					// this.continueRecord()// 如果没有主动停止则继续录音
				} else {
					clearInterval(this.timer_li);
					this.endRecord()
					if (this.st) {
						this.st.shutdown()
					} else {
						console.log("st is null")
					}
					// this.$api.msg('录音失败，请退出重试')
				}
			})
		
			st.on("failed", (msg)=>{
				console.log("Client recv failed:", msg)
				let result = JSON.parse(msg)
				if(result.header.status == '40000004' && this.stStart) {
					console.log('出现错误了')
					clearInterval(this.timer_li);
					this.continueRecord()// 如果没有主动停止则继续录音
				} else {
					clearInterval(this.timer_li);
					this.endRecord()
					if (this.st) {
						this.st.shutdown()
					} else {
						console.log("st is null")
					}
					// this.$api.msg('录音失败，请退出重试')
				}
				
				
			})
	
			this.st = st
		},
		onShow() {
           wx.setKeepScreenOn({ // 屏幕保持不息屏
             keepScreenOn: true
           })
		},
		onHide() {
			if(this.stResult != '') {
				this.endRecord()
				if (this.st) {
					this.st.shutdown()
				} else {
					console.log("st is null")
				}
			}
		},
		
		onUnload: function () {
			if(this.stResult != '') {
				this.endRecord()
				if (this.st) {
					this.st.shutdown()
				} else {
					console.log("st is null")
				}
			}
		},
		methods: {
				
			getTime() {
				let getDate = new Date();
				let getFullYear = getDate.getFullYear();
				let getMonth = getDate.getMonth() + 1;
				let getDay = getDate.getDate();
				let month = (getMonth > 9) ? getMonth : ("0" + getMonth);
				let day = (getDay < 10) ? ("0" + getDay) : getDay;
				this.messageTitle = getFullYear+ '年'+ month+'月'+ day + '记录';
			},
			
			async readyGO(){
				//获取录音权限
				uni.authorize({
					scope: 'scope.record',
					fail:()=>{
						uni.showToast({
							icon:'none',
							title:'请在小程序设置中启用麦克风权限'
						})
					},
					success:()=> {
						// console.log('开启成功')
						this.startRecord()
					}
				})
			},
			
			startRecord: async function() {
				
				if (!this.st) {
					console.log("st is null")
					return
				}
						
				if (this.stStart) {
					console.log("st is started!")
					return
				}
				let st = this.st
				let that = this;
				try {
					await st.start(st.defaultStartParams())
					this.stStart = true
					this.getTime();
					this.recordFiles = []
					this.stResult = ''
					this.recordTime = 0;
					that.timer_li = setInterval(()=> {
						if(that.stStart){
							that.recordTime += 1000;
						}
					},1000);
					console.log('录音开始')
				} catch (e) {
					console.log("start failed:" + e)
					return
				}
				wx.getRecorderManager().start({
					duration: 600000,
					numberOfChannels: 1,
					sampleRate: 16000,
					format: "PCM",
					frameSize: 4
				})
				
			},
			
			// 时间到后继续录音
			continueRecord: async function() {
				
				let st = this.st
				let that = this;
				try {
					await st.start(st.defaultStartParams())
					that.timer_li = setInterval(()=> {
						if(that.stStart){
							that.recordTime += 1000;
						}
					},1000);
					console.log('录音继续')
				} catch (e) {
					console.log("start failed:" + e)
					return
				}
				wx.getRecorderManager().start({
					duration: 600000,
					numberOfChannels: 1,
					sampleRate: 16000,
					format: "PCM",
					frameSize: 4
				})
			},
					
		    // 结束录音
			endRecord: async function() {
				wx.getRecorderManager().stop()
				this.stStart = false
				await sleep(500)
				if (this.stStart && this.st) {
					try {
						console.log("prepare close st")
						await this.st.close()
						clearInterval(this.timer_li);
						
					} catch(e) {
						clearInterval(this.timer_li);
						console.log("close st failed:" + e)
					}
				}
			},
			
			// 上传录音文件
			uploadVoice(tempFilePaths) {
				this.testValue = tempFilePaths;
				let that = this;
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
							let voice_url = imgData.data.new_url;
							that.saveRecord(voice_url)
						} else {
							that.$api.msg(imgData.msg)
						}
					},
					fail: (res) => {
						that.$api.msg('上传失败')
					}
				});
			},
			
			//保存录音文件
			saveRecord(voice_url) {
				let val = {
					"title": this.messageTitle, //标题
					"audio_url": voice_url, //录音文件地址
					"speech_text": this.stResult,  //识别结果文本
					"r_status": 2,   //状态，默认1。1:录音中，2完成
					"r_type": 1,    //类型，1：实时语音，2：音视频撰写
					"biz_duration": this.recordTime/1000  ,//时长
					"file_type": 2
				}
				// console.log(val,6621)
				saveRecord(val).then(res => {
					// console.log(res,4589)
					if (res.code == 20000) {
						if(this.stResult != '') {
							const data = {  value: this.stResult }
							this.recordFiles.push(data);
							this.toBottom()
						}
						
						if(!this.stStart) {
							this.stResult = ''
							this.recordTime = 0;
							this.$api.msg('当前录音保存成功,可前往历史记录查看');	
							setTimeout(() => {
								uni.redirectTo({
									url: '/childPage/voice/voice_index',
								})
							}, 1500)
							
						} else {
							this.recordTime = 0;
							this.stResult = ''
							clearInterval(this.timer_li);
							this.continueRecord()// 如果没有主动停止则继续录音
							this.$api.msg('当前录音保存成功');	
						}
									
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('保存录音失败');
				})
			},
			
			// 暂停录音
			breakRecord() {
				wx.getRecorderManager().pause();
				this.pause_status = true;
				clearInterval(this.timer_li);
				console.log('录音暂停')
			},
			
			// 继续录音
			pauseRecord() {
				wx.getRecorderManager().resume()
				// console.log(this.stStart,5589)
				// console.log(this.st,9952)
				let that = this;
				if (that.stStart && that.st) {
					try {
						that.pause_status = false;
						that.timer_li = setInterval(()=> {
							if(that.stStart){
								that.recordTime += 1000;
							}
						},1000);
						console.log('录音继续')
					} catch(e) {
						console.log("close st failed:" + e)
					}
				}
			},
			
			// 获取token
			async getRcordToken() {
				await getToken().then(res => {
					if (res.code == 20000) {
						this.token = res.data.token
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取token失败');
				})
			},
			
			//查看历史记录
			// toHistory() {
			// 	uni.navigateTo({
			// 		url: '/pages/voice/voice_history',
			// 	})
			// },
			
			closeKey() {
				this.messageTitle = ''
				this.showTitle = false
			},
			
			changeKey() {
				if (this.messageTitle == '') {
					this.$api.msg('标题不能为空');
					return
				}
				this.showTitle = false;
			
				
			},
			
			toBottom() {
				// console.log('出发了')
				let that = this;
				this.$nextTick(() => {
					setTimeout(() => {
						uni.createSelectorQuery().select(".cont_ul").boundingClientRect(function(
							res) { //定位到你要的class的位置
							// console.log(res,330);
							// console.log(res.height,410)
							uni.pageScrollTo({
								scrollTop: res.height,
								duration: 0
							});
						}).exec()
					}, 1500)
				})
			},
			
		}
	}
</script>

<style>
	
	
</style>

<style lang="less" scoped>
	page {
		// background: #000;
	}
	
	.voice_cont {
		// margin-top: 10upx;
		background: #fff;
		min-height: calc(100vh - 200upx);
		.cont_top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20upx 15upx;
			border-bottom: 1upx solid #F2F2F2;
			background: #fff;
			width: 100%;
			position: fixed;
			top: 0;
			
			.top_left {
				display: flex;
				align-items: center;
				.icon_img {
					width: 34upx;
					height: 20upx;
					margin-right: 10upx;
				}
				.end_text {
					color: #9D9FA5;
					font-size: 28upx;
					font-style: normal;
					font-weight: 500;
				}
			}
			
			.top_right {
				display: flex;
				align-items: center;
				.history_text {
					color: #1F64FF;
					font-size: 26upx;
					font-style: normal;
					font-weight: 500;
					margin-right: 8upx;
				}
				
			}
		}
		
		.start_cont {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			width: 100%;
			height: 70vh;
			.tip {
				display: flex;
				padding: 8upx 0;
				.tip_text {
					color: #8F8F93;
					font-size: 28upx;
					font-style: normal;
					font-weight: 400;
				}
				.tip_img {
					width: 40upx;
					height: 40upx;
					margin: 0 8upx;
				}
			}
		}
	}
	.cont_ul {
		padding-top: 80upx;
		padding-bottom: 200upx;
		background: #fff;
		// min-height: calc(100% - 200upx)
	}
	
	.btn {
		padding: 0 20upx 20upx 20upx;
		background: #fff;
		position: fixed;
		bottom: 0;
		width: 100%;
		.btn_cont {
			border-radius: 100upx;
			background: #FFF;
			box-shadow: 0 4upx 20upx 0 rgba(51, 51, 51, 0.10);
			display: flex;
			align-items: center;
			justify-content: center;
			width: calc(100% - 40upx);
			padding: 15upx 0;
			.btn_text {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				.btn_img {
					width: 100upx;
					height: 100upx;
				}
			}
			

		}
	}
	
	.record_cont {
		width: calc(100% - 40upx);
		padding: 20upx;
		.record_ul {
			width: calc(100% - 40upx);
			background: #fff;
			border-radius: 10upx;
			margin-top: 140upx;
		}
		.cont_title {
			color: #000;
			font-size: 36upx;
			font-weight: 500;
			padding: 15upx 0;
			.icon_img {
				width: 42upx;
				height: 42upx;
				margin-left: 12upx;
			}
		}
		.cont_text {
			
			font-size: 32upx;
			font-weight: 400;
			line-height: 60upx;
			margin-bottom: 180upx;
			.text_l {
				color: #272C3D;
			}
			.text_r {
				color: #999;
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
		}
	}
	
	.list_ul {
		width: 100%;
		padding: 20upx;
		.ul_li {
			width: calc(100% - 40upx);
			.li_title {
				color: #999;
				text-align: center;
				font-size: 24upx;
				font-style: normal;
				font-weight: 500;
				line-height: 60upx;
				text-align: left;
			}
			
			.li_cont {
				color: #fff;
				background: #1F64FF;
				text-align: center;
				font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: 50upx;
				border-radius: 10upx;
				padding: 10upx;
				text-align: left;
			}
		}
	}
	
</style>