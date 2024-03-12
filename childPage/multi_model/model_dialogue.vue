<template>
	<view>
		<view class="robot">
			<view class="robot_text">
				<view class="title">{{ chat_cont }}</view>
				<view class="title_b">我们来聊聊</view>
			</view>
			<view class="tips">
				<view class="item" style="margin-right: 30upx;" @click='toHis'>
					<image :src="hisImg"></image>
					<view class="text">历史记录</view>
				</view>
				<view class="item" @click="toIdea">
					<image :src="ideaImg"></image>
					<view class="text">投诉及建议</view>
				</view>
			</view>
		</view>
		<view class="main">
			<view class="main_title">
				<view class="top">
					<view class="left"></view>
					<view class="middle">参与角色</view>
					<view class="top_li">(当前设定算力为{{ count }}w)</view>
				</view>
				<view class="title_cont">
					<text class="cont_li"  v-for="(item, index) in roleList" :key="index">{{ item.role_name }}</text>
				</view>
			</view>
			<!-- 对话 -->
			<view class="dialogue" id="dialogue">
				<scroll-view scroll-y="true">
					<view v-for="(item,index) in messageList" :key="index">
						<view class="dialog_item" v-if="index == 0">
							<view class="pic">
								<image class="logo_img" :src="log" mode=""></image>
							</view>
							<!-- <view class="content">{{ item.content }}</view> -->
							<view style="width: 100%">
								<view class="content_text">无忧秘书智脑</view>
								<view class="content">
									<ua-markdown :source="item.content" :showLine="false" />
								</view>
							</view>
							
						</view>
						<view class="dialog_item" v-if="item.role == 'assistant'">
							<view class="pic">
								<image class="logo_img" :src="getImgUrl(item.role_logo)" mode=""></image>
							</view>
							<!-- <view class="content">{{ item.content }}</view> -->
							
							<view style="width: 100%">
								<view class="content_text">{{ item.role_name }}</view>
								<view class="content">
									<ua-markdown :source="item.content" :showLine="false" />
								</view>
							</view>
							
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="stopBtn" v-if="loading">
			<view style="width: 36rpx;height: 36rpx; background-color: #1F64FF;border-radius: 4rpx;"></view>
			<view class="tsb" @click="stopChat">停止回答</view>
		</view>
		<view class="bottom">
			<!-- <view class="tb">当前消耗算力：12w算力，剩余38w算力</view> -->
			<view class="btn">
				<view style='width:80%'><u-button type="primary" text="开启新对话" :plain="true" @click="newSpeak"></u-button></view>
				<!-- <view style='width:40%'><u-button type="primary" text="继续下一轮"></u-button></view> -->
			</view>
		</view>
		
		<!-- 补充算力 -->
		<u-modal :show="addCont" @cancel="closeCount" confirmText="确认" confirmColor="#1F64FF;" :showCancelButton='true'
			@confirm="submit">
			<view class="key_cont" >
				<view class="cont_title">补充算力提醒</view>
				<view class="cont_tip">本轮互动算力耗尽，需补充算力可继续对话</view>
				<view class="cont_input">
					<text class="input_text">补充算力</text>
					<u--input placeholder="请输入内算力" border="surround" v-model="value" @focus="focusTab" @change="change" 
					:style="[{border:(active == 4 ? '2rpx solid #1F64FF':'2rpx solid #DBDBDB')}]"></u--input>
					<text class="input_text">w算力</text>
				</view>
				<view class="cpt">
					<view class="cpt_item" @click="getCount(100, 1)" :style="[{border:(active == 1 ? '2rpx solid #1F64FF':'2rpx solid #DBDBDB')}]">
						<view class="cpt_t">100w</view>
						<view class="cpt_b">算力</view>
					</view>
					<view class="cpt_item" @click="getCount(200, 2)" :style="[{border:(active == 2 ? '2rpx solid #1F64FF':'2rpx solid #DBDBDB')}]">
						<view class="cpt_t">200w</view>
						<view class="cpt_b">算力</view>
					</view>
					<view class="cpt_item" @click="getCount(300, 3)" :style="[{border:(active == 3 ? '2rpx solid #1F64FF':'2rpx solid #DBDBDB')}]">
						<view class="cpt_t">300w</view>
						<view class="cpt_b">算力</view>
					</view>
				</view>
			</view>
		</u-modal>
		
		<!-- 算力不足 -->
		<u-modal :show="buyCont" @close="closeBuy"  :showCancelButton='false' :showConfirmButton='false' :closeOnClickOverlay="true">
			<view class="key_cont" >
				<view class="cont_title">算力不足提醒</view>
				<view class="cont_tip">您好，尊敬的用户！</view>
				<view class="cont_tip">您目前所剩余的算力（1w）不足以使用该功能，请您进行前往购买或分享新人获得算力！</view>
				<view class="cont_btn">
					<view class="btn_left" @click="toShare">分享好友</view>
					<view class="btn_right" @click="toBuy">购买算力</view>
				</view>
			</view>
		</u-modal>
		
	</view>
</template>

<script>
	import {
		getChatRole, addChat,addCount,groupChat
	} from '@/apis/user.js'
	// import * as TextEncoding from 'text-encoding-shim';
	import uaMarkdown from '../../components/ua2-markdown/ua-markdown.vue'
	export default {
		data() {
			return {
				log: global.baseImg + '/xcx/com/message_center/Frame%20427320411.png',
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				hisImg: global.baseImg + '/xcx/com/message_center/clock.png',
				roleList: [],
				chat_cont: '',
				count: 0,
				model_list: [],
				messageList: [],
				showList: [],
				chat_list: [],
				session_code: '',
				stop_three: false,
				// three_shi: 0,
				// three_time: 0,
				controller_three: '',
				tip: 0,
				loading: false,
				addCont:false,
				active: 1,
				value: '',
				newCount: 100,
				buyCont: false,
				isClick: true
			};
		},
		components: {
			uaMarkdown
		},
		onLoad(option) {
		    if(option.content) {
				this.chat_cont = option.content
			}
			if(option.count) {
				this.count = option.count
			}
		},
		onShow() {
			this.getChatRole()
		},
		methods: {
			getChatRole() {
				getChatRole().then(res => {
					if (res.code == 20000) {
					  this.roleList = res.data.data;
					  this.model_list = []
					  this.roleList.forEach((item, index) => {
						  let val = {}
						  val.role_code = item.role_code
						  val.sort_no = index
						  this.model_list.push(val)
					  })
					  this.addChat()
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})
			},
			
			addChat() {
				let val = {
					"total_integral": this.count,
					"subject": this.chat_cont,
					"model_list": this.model_list
				}
				addChat(val).then(res => {
					if (res.code == 20000) {
					  this.chat_list = res.data.model_list
					  this.session_code  = res.data.session_code
					  this.sendMessage(0)
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})
			},
			async sendMessage(index) {
			    let content = ''
				this.tip = index
				if(this.messageList.length == 0) {
					content = this.chat_cont
				} else {
					content = this.messageList[this.messageList.length - 1].content
				}
				this.messageList.push({
					role: 'user',
					content: content,
					covert_content: this.chat_list[index].covert_content,
					role_logo:  this.chat_list[index].role_logo,
					role_name:  this.chat_list[index].role_name
				})
				
				this.showList.push({
					role: 'user',
					content: content,
					covert_content: this.chat_list[index].covert_content
				})
				let data = {
					session_code: this.session_code,
					group_role_code: this.chat_list[index].group_role_code,
					msg_list: this.showList
				}
				
				// data.msg_list = JSON.stringify(data.msg_list)
				// console.log(data.msg_list,4725)
		
			
			   await this.creatChatFun(data)
			},
			async creatChatFun(data) {
				// let three_num = 0;
				this.messageList.push({
					content: `思考中...`,
					role: 'assistant',
					role_logo:  this.chat_list[this.tip].role_logo,
					role_name:  this.chat_list[this.tip].role_name
				})
				
				this.toBottom()
				// ==========================================
				const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				this.controller_three = new AbortController()
				const response_three = await fetch(global.baseUrl + '/api/chat/async_group_chat_completion', {
					method: "POST",
					headers: {
						"Content-Type": 'application/json',
						'Accept': '*/*',
						'authorization': userInfo.token,
						'role': userInfo.role,
						'source': global.source
					},
					body: JSON.stringify(data),
					signal: this.controller_three.signal
				}).catch(err => {
					// console.log(err);
				});
				// console.log(response, response == undefined);
				if (response_three.status == '400') {
					// fetch请求错误时的body内容
					response_three.json().then((res) => {
						if (res.code < 49999) {
							let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
							if (res.code == 40028) {
								this.addCont = true
							} else if(res.code == 40022) {
								this.buyCont = true
							} else {
								this.$api.msg(res.msg)
							}
							this.messageList.pop()
						} else if (res.code > 49999) {
							this.messageList.pop()
							this.$api.msg('网络异常，请稍后重试')
							// this.$api.msg(res.msg)
						} else {
							this.messageList.pop()
							this.$api.msg(res.msg)
						}
					})
					return;
				
				}
				
				if (response_three == undefined) {
					// this.isfinish = true // 结束
					// fetch请求错误时的body内容
					clearInterval(this.t_time_three);
					clearInterval(this.three_shi);
					this.messageList[this.messageList.length - 1] = {
						talk: '网络异常，请稍后重试',
						type: 'assistant',
						time: 0,
						code: 40021,
						status: "stop",
						textNumber: 12,
						history: false,
						loading: true
					}
					return
				}
				
				
				
				if (!response_three.ok) {
					// this.isfinish = true
					this.$message.error(response_three.statusText);
					return;
				}
				
				const reader = response_three.body.getReader();
				const decoder = new TextDecoder("utf-8");
				let info = '';
				let status = '';
				let integral = 0
				let completion_tokens = 0
				let prompt_tokens = 0
				while (true) {
					// console.log(7895);
				
					// this.scrollBottom();
					const {
						value,
						done
					} = await reader.read();
					if (done) {
						this.messageList[this.messageList.length - 1].loading = true;
						this.$forceUpdate()
						break;
					}
					if (value) {
				
						let chat = decoder.decode(value);
						// console.log(chat,880);
						let chatArr = chat.split('\r\n');
				
						chatArr.forEach(val => {
							if (val != '') {
								let res = JSON.parse(val);
								console.log(res, res.code, res.msg, 'res');
								if (res.code) {
									if (res.code < 49999) {
										let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
										// console.log(userInfo.role == 'guess' ,'panduan');								
										this.userRole = userInfo.role
										this.messageList[this.messageList.length -
											1
										] = {
											talk: res.msg,
											type: 'assistant',
											time: 0,
											code: res.code == 40022 ? res.code : 40021,
											status: "stop",
											textNumber: 0,
											history: false,
											loading: true
										}
										this.$forceUpdate()
										this.toBottom()
										
										// console.log(this.messageList[this.listName],1258)
										return
									} else {
										this.$api.msg('网络异常，请稍后重试')
									}
								} else {
									if (res.content != '' && res.content != null) {
										info += res.content;
										if(this.chat_list[this.tip].chat_type == 10) {
											info = res.content;
										} else {
											info += res.content;
										}
									}
									
									if (res.code) {
										if (res.code < 49999) {
											//重置最后一条信息
											this.messageList[this.messageList.length - 1] = {
												role: 'assistant',
												content: res.msg,
												role_logo:  this.chat_list[this.tip].role_logo,
												role_name:  this.chat_list[this.tip].role_name
											}
											this.$forceUpdate()
											this.toBottom()
											
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
													
										// clearInterval(this.three_time)
													
													
										//重置最后一条信息
										this.messageList[this.messageList.length - 1] = {
											role: 'assistant',
											content: info,
											role_logo:  this.chat_list[this.tip].role_logo,
											role_name:  this.chat_list[this.tip].role_name
										}
										
										status = res.finish_reason
										if(status == 'stop') {
											this.showList.push({
												role: 'assistant',
												content: info
											}) 
											if(this.tip < this.chat_list.length -1) {
												this.tip = this.tip + 1
												this.sendMessage(this.tip)
											} else {
												this.tip = 0
												this.sendMessage(this.tip)
											}
											
											this.loading = false
										} else {
											this.loading = true
										
										}
													
									
									}
									this.toBottom()
									this.$forceUpdate()
				
								}
				
							}
				
						})
				
					}
				}
			},
			base64ToString(encodedString) {
				// console.log(encodedString,'encodedString');
				// Convert the Base64 string to a Uint8Array
				var decodedData = Uint8Array.from(this.atob(encodedString), c => c.charCodeAt(0));
			
				// Create a TextDecoder instance with the appropriate character encoding
				var decoder = new TextEncoding.TextDecoder('utf8');
			
				// Decode the Uint8Array to a string
				var decodedString = decoder.decode(decodedData);
			
				// console.log(decodedString, 'decodedStringdecodedString');
				// console.log(decodedString, 'decodedStringdecodedString');
				return decodedString;
			},
			
			//解码
			atob(string) {
				string = String(string).replace(/[\t\n\f\r ]+/g, "");
				var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
				var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
				if (!b64re.test(string))
					throw new TypeError(
						"Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
				string += "==".slice(2 - (string.length & 3));
				var bitmap, result = "",
					r1, r2, i = 0;
				for (; i < string.length;) {
					bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12 |
						(r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)));
					result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
						r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
						String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
				}
				return result;
			
			},
			toBottom() {
				// console.log('出发了')
				
				this.$nextTick(() => {
					setTimeout(() => {
						var scrollTop = document.getElementById("dialogue")
						// console.log(scrollTop.scrollHeight,2569);
						this.msgListHeight = scrollTop.scrollHeight;
						// console.log(this.msgListHeight,154)
						uni.pageScrollTo({
							scrollTop: scrollTop.scrollHeight,
							duration: 1,
							complete: (err) => {
								// console.log(err,333);
							}
						});
					}, 100)
				
				})
			},
			
			stopChat() {
				if (this.controller_three != null) {
					this.controller_three.abort()
				}
			   this.stop_three = true
			   this.loading = false
			},
			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			},
			toHis() {
				uni.navigateTo({
					url: '/childPage/multi_model/history_model'
				})
			},
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			newSpeak() {
				this.stopChat()
				this.messageList = []
				this.showList = []
				uni.navigateTo({
					url: '/childPage/multi_model/multi_model'
				})
			},
			focusTab() {
				this.active = 4
			},
			change(e) {
			    this.newCount = this.value
			},
			getCount(val, tip) {
				this.newCount = val
				this.active = tip
			},
			closeCount() {
				this.addCont = false
			},
			submit() {
				if(this.isClick == false) {
					return
				}
				this.isClick = false
				this.count = parseInt(this.count) + parseInt(this.newCount)
				let val = {
					"use_integral": parseInt(this.newCount),
					"session_code": this.session_code,
				}
				addCount(val).then(res => {
					if (res.code == 20000) {
						this.addCont = false
						this.isClick = true
						this.showList.pop()
						this.messageList.slice(this.messageList - 2, 2)
					    this.sendMessage(this.tip)
					} else {
						this.showList.pop()
						this.messageList.slice(this.messageList - 2, 2)
						this.$api.msg(res.msg);
						this.isClick = true
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
					this.$api.msg(res.msg);
				})
			},
			toShare() {
				uni.navigateTo({
					url: '/childPage/distribution/share'
				})
			},
			toBuy() {
				uni.navigateTo({
					url: '/pages/user/vip/vip'
				})
			},
			closeBuy() {
				this.buyCont = false
			}
		}
	}
</script>

<style lang="less" scoped>

	
    .robot {
		display: flex;
	    align-items: center;
		justify-content: space-between;
		padding: 32upx;
		width: calc(100% - 64upx);
		.robot_text {
			display: flex;
			flex-direction: column;
			width: 65%;
			.title {
				color: #242F49;
				font-size: 36upx;
				font-weight: 500;
				line-height: 150%;
				width: 80%;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.title_b {
				color: #242F49;
				font-size: 30upx;
				font-weight: 500;
				line-height: 150%;
			}
		}
		
		
		.tips {
			display: flex;
			align-items: center;
			justify-content: center;
		    .item {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				
				image {
					width: 48upx;
					height: 48upx;
				}
						
				.text {
					color: #3F3F3F;
					font-size: 22upx;
					font-weight: 400;
					line-height: 150%;
				}
			}
			
		}
	}

	.main {
		height: 90vh;

		// margin-top: 52rpx;
        padding: 32rpx;
		.main_title {
			margin-bottom: 34upx;

			.top {
				display: flex;
				align-items: center;

				.left {
					width: 3px;
					height: 18px;
					background: #1F64FF;
				}

				.middle {
					color: #393E45;
					font-size: 32upx;
					font-weight: 600;
					margin: 0 20upx 0 16upx;
				}
				.top_li {
					color: #B7B9C0;
					font-size: 24upx;
					padding-left: 10upx;
				}

				image {
					width: 32upx;
					height: 32upx;
				}
			}
		}

		.dialogue {
			padding-bottom: 180upx;
			.dialog_item {
				display: flex;
				margin-bottom: 24rpx;

				.pic {
					margin-right: 26rpx;

					image {
						width: 63rpx;
						height: 63rpx;
						border-radius: 50%;
					}
				}

				.content {
					display: flex;
					width: 90%;
					padding: 25rpx;
					flex-direction: column;
					align-items: flex-start;
					background-color: #fff;
					gap: 10px;
					flex-shrink: 0;
					color: #484848;
					text-align: justify;
					font-size: 32rpx;
					font-weight: 500;
					border-radius: 20rpx;
					
				}
				.content_text {
					color: #484848;
					font-size: 28upx;
					font-weight: 520;
					padding-bottom: 10upx;
				}
			}
		}
	}

	.bottom {
		text-align: center;
		position: fixed;
		width: 100%;
		bottom: 0;
		background-color: #FFF;
		padding: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;

		.tb {
			color: #1F64FF;
			font-size: 22rpx;
			font-weight: 500;
			margin-bottom: 20rpx;
		}

		.btn {
			display: flex;
			justify-content: center;
            width: 100%;
		}
	}

	.stopBtn {
		position: fixed;
		bottom: 198rpx;
		left: 37%;
		border-radius: 16rpx;
		border: 2rpx solid #1F64FF;
		background: #E5EDFF;
		padding: 18rpx 24rpx;
		display: flex;
		justify-content: space-between;

		.tsb {
			margin-left: 18rpx;
			color: #1F64FF;
			text-align: center;
			font-weight: 500;
		}
	}
	.title_cont {
		display: flex;
		.cont_li {
			color: #B7B9C0;
			font-size: 24upx;
			padding-right: 10upx;
			padding-top: 5upx;
		}
	}
	
	.key_cont {
		padding: 25upx;
		.cont_title {
			color: #000;
			font-size: 36upx;
			font-style: normal;
			font-weight: 530;
			padding-bottom: 15upx;
		}
			
		.cont_tip {
			color: #545454;
			font-size: 28upx;
			font-weight: 400;
			padding-bottom: 15upx;
		}
		.cont_input {
			display: flex;
			align-items: center;
			.input_text {
				color: #545454;
				font-size: 28upx;
				font-weight: 400;
				padding: 0 10upx;
			}
		}
		
		.cpt {
			display: flex;
			margin-top: 26rpx;
			justify-content: space-around;
		
			.cpt_item {
				width: 140upx;
				height: 140upx;
				border-radius: 17upx;
				border: 2upx solid #E8EAEC;
                display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
		
				.cpt_t {
					color: #1F64FF;
					font-size: 36rpx;
					font-weight: 600;
				}
		
				.cpt_b {
					color: #999;
					font-size: 22upx;
				}
			}
		}
		
		.cont_btn {
			display: flex;
			padding-top: 30upx;
			align-items: center;
			justify-content: space-around;
			.btn_left {
				border-radius: 10upx;
				border: 2upx solid #1F64FF;
				color: #1F64FF;
				font-size: 30upx;
				font-weight: 500;
				line-height: 60upx;
				padding: 0 30upx;
			}
			
			.btn_right {
				border-radius: 10upx;
				background: #1F64FF;
				color: #fff;
				font-size: 30upx;
				font-weight: 500;
				line-height: 60upx;
				padding: 0 30upx;
			}
		}
	}
</style>