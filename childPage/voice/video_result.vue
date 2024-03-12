<template>
	<view style="height: 100vh;">
		<view style="padding: 30upx; margin-bottom: 100upx;">
			<view class="voice_title">音频标题</view>
			<view class="voice_cont">
				<u--input placeholder="请输入录音标题" border="surround" maxlength="50" v-model="messageTitle"></u--input>
			</view>
				
			<view class="voice_title">音频内容</view>
			<view class="voice_cont">
					<u-textarea v-model="stResult" placeholder="在此输入您想了解的内容" autoHeight :showConfirmBar='false' :adjustPosition='false'
					maxlength='-1' :disableDefaultPadding='true'></u-textarea>
			</view>
		</view>
	  
	    <view class="bottom">
		    <view class="bottom_cont">
			    <view class="bottom_buy" @click="save">保存</view>
		    </view>
	    </view>
	</view>
</template>

<script>
	import {
		getFile,saveRecord,saveFootprint
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				stResult: '', //录音转文字最终结果
				messageTitle:'',
				timer: 0,
				voice_url: '',
				recordTime: 0, //时长
				file_type: 1,// 文件类型
				isClick: true
			}
		},
		
		components: {
			
		},
		onLoad(options) {
			// console.log(options,666)
			let task_id = options.task_id
			this.voice_url = options.voice_url
			this.file_type = options.file_type
			this.getResult(task_id)
			this.getTime()
		},
		onShow() {
            
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
			
			getResult(id) {
				let val = {
					task_id: id
				}
				let that = this;
				uni.showLoading({ title: '识别中...' });
				that.timer = setInterval(() => { //5秒查询一次
					getFile(val).then(res => {
						if (res.code == 20000) {
							if(res.data.StatusCode == '21050000') {
								clearInterval(that.timer);
								const resultArr = res.data.Result.Sentences;
								resultArr.forEach((ele)=>{
									that.stResult += ele.Text
								})
								this.recordTime = res.data.BizDuration;
								uni.hideLoading()
								that.$api.msg('识别完成')
							} else if(res.data.StatusCode == '21050000' || res.data.StatusCode == '21050000') {
								
							} else {
								clearInterval(that.timer);
								uni.hideLoading()
								that.$api.msg('识别失败')
							}
							
						} else {
							clearInterval(that.timer);
							uni.hideLoading()
							that.$api.msg(res.msg);
						}
					}).catch(err => {
						clearInterval(that.timer);
						uni.hideLoading()
						that.$api.msg('获取结果失败');
					})
				},5000)
			},
			
			save() {
				let recordTime = Math.floor(this.recordTime/1000);
				let val = {
					"title": this.messageTitle, //标题
					"audio_url": this.voice_url, //录音文件地址
					"speech_text": this.stResult,  //识别结果文本
					"r_status": 2,   //状态，默认1。1:录音中，2完成
					"r_type": 2,    //类型，1：实时语音，2：音视频撰写
					"biz_duration": recordTime,  //时长
					"file_type": this.file_type
				}
				if(!this.isClick) {
					return
				}
				this.isClick = false
				saveRecord(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('保存成功');
						setTimeout(() => {
							uni.redirectTo({
								url: '/childPage/voice/voice_index'
							})
						}, 1500)
						this.isClick = true
						let save_val = {
							"type_name": "录音文件",
							"type_code": "real_file",
							"title": res.data.title,
							"eid": res.data.speech_code
						}
						
						this.saveFootprint(save_val)
					} else {
						this.isClick = true
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.isClick = true
					this.$api.msg('保存失败');
				})
				
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

<style>
	
	
</style>

<style lang="less" scoped>
	page {
		// background: #000;
	}
	
	.voice_cont {
		background: #fff;
	}
	
	.bottom {
		width: 100%;
		background: #ffffff;
		position: fixed;
		bottom: 0;
	}
	
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
	
	.voice_title {
		color: #333;
		text-align: center;
		font-size: 26upx;
		font-style: normal;
		font-weight: 530;
		line-height: 60upx;
		text-align: left;
	}
	
	
</style>