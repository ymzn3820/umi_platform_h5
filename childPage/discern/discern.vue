<template>
	<view id="chat">
		
		<scroll-view ref="box" class="u-page" scroll-with-animation scroll-y="true" id="textadd" :style='{ height: msgListHeight}'>
			<view scroll-with-animation  v-for="item,index in messageList[listName]" :key="index" class="listItem" :anchor="index">

				<u-row align="top" gutter="5">
					<u-col span="1.5" textAlign="center" align="top" justify="top">
						
						<image style="height: 38px;width: 38px; border-radius: 50%;"
							:src="item.type=='assistant'? claudeImg : avatar">
						</image>
					</u-col>
					<u-col soan='9'>
						<view v-if="item.type=='assistant'">
							<!-- {{item.code}} -->
							<view class="tips" v-html='item.talk' v-if='index===0'></view>
							<view v-else>
								<span class="loadingTalk" v-if="item.talk.indexOf('思考中')!=-1">
									<view class="flexs">
										<image :src="waitImg" mode="" class="loadingImages"></image>
										<text style="vertical-align: top; word-break:break-all;" v-text="item.talk"></text>
									</view>
									
									<u-col span="4"  v-if="index===messageList[listName].length-1"><u-button
											type='primary' :customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
											size="mini" color="rgba(31, 100, 255, 0.1)" @click="stopStart">
											<image src="../../static/images/Remove_duotone.png" style="width: 40upx;height: 40upx;margin-right: 16upx;"/>
											停止回答
											</u-button>
									</u-col>
								</span>
								
								<view class="tips" v-else-if="item.code==40022">
									<text style="font-size:17px; word-break:break-all;">{{item.talk}}</text>
								</view>
								
								<view class="tips" v-else-if="item.code==40021">
									<text style="font-size:17px; word-break:break-all;">{{item.talk}}</text>
								</view>
								
								<view v-else>
									<view class="tips">

										<text style="font-size:32upx; word-break:break-all;">{{item.talk}}</text>
										
										<u-row class='edit'>
											<u-col span="7.5" v-if="item.history"></u-col>
											<u-col span="1" v-if="!item.history">
												<view>
													<image v-if="item.loading" src="../../static/images/time.png" mode="" width="16px"
														height="16px" style="vertical-align: top;"></image>
													<image v-else :src="waitImg" mode="" width="16px" height="16px"
														class="loadingImages">
													</image>
												</view>
											
											</u-col>
											<u-col span="6.5" style="font-size: 14px;" v-if="!item.history">
												<view>
													<text v-if="item.loading"> 耗时：{{item.time}}秒</text>
													<text v-else> 思考中:{{item.time}}秒</text>
												</view>
											
											</u-col>
											<u-col span="3.5"></u-col>
											
											<u-col span="1" @click="copyFun(item.talk)">
												<image src="../../static/images/balckCopy.png" mode=""></image>
											</u-col>
										</u-row>
										<view class="btn_tab">
											<text class="tab_left">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
										</view>
								
									</view>
									<u-row gutter="20" style="flex-wrap: wrap;width: 100%;">
		
										<u-col span="4" v-if="index===messageList[listName].length-1 && !item.history && !item.loading"><u-button
												type='primary' :customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)" @click="endController">
												<image src="../../static/images/Remove_duotone.png" style="width: 40upx;height: 40upx;margin-right: 16upx;"/>
												停止回答
												</u-button>
										</u-col>
										
									</u-row>
								</view>
							</view>
						</view>

						<view v-else>

							<!-- <text class="talk" style="background: #1F64FF;color:#fff">{{item.talk}}</text> -->
							<view class="talk" style="background: #1F64FF;color:#fff">

								<view style="word-break:break-all;">
									{{item.talk}}
								</view>
								
								<view v-if="item.images.length > 0">
									<image :src="getImgUrl(item.images[0])" style="height: 500rpx; width: 500rpx" mode="aspectFit" @click="checkImg(item.images[0])"></image>
								</view>


								<image src="@/static/images/copy.png" mode="" @click="copyFun(item.talk)"></image>
							</view>

						</view>
					</u-col>
				</u-row>
			</view>
		
		</scroll-view>

		
		<view class="bottomInput" style="bottom: 0">
           
			<view class="btn_link">
				<view class="link_l">
					<view class="l_chat" style="margin-right: 15rpx;"
					 @click="newChatSpeak" v-if="messageList[listName].length > 2 && messageList[listName][messageList[listName].length - 1].loading">
						 <u-icon name="plus" color="#1F64FF" size="14"></u-icon>
						 <text class="l_text">开启新会话</text>
					 </view>
				</view>
				<view class="link_l">
					<view class="l_chat" @click="takePhoto">
						<u-icon name="camera" color="#1F64FF" size="20"></u-icon>
						<text class="l_text">AI识图</text>
					</view>
				</view>
			</view>
			<u-row align='bottom' gutter="5">
				<u-col span="9.5">
					<view class="chat_input">
						<u-textarea v-model="chatInputValue" placeholder="在此输入您想了解的内容" @confirm="sendMessage" autoHeight
							:showConfirmBar='false' :adjustPosition='false' maxlength='-1'
							:disableDefaultPadding='true' @keyboardheightchange='keyboardheightchange' border='none' :focus="false">
						</u-textarea> 
						<view v-if="imgList.length > 0">
							<view class="input_right" v-for="(val, index) in imgList" :key="index" >
								<image :src="getImgUrl(val)" class="inputImg"></image>
								<text class="input_text"></text>
								<u-icon name="close" size="18" @click="imgList.splice(index,1)"></u-icon>
							</view>
						</view>
						
						
					</view>
					
				</u-col>
				<u-col span="2.5" align="bottom">
					<u-button type="primary" color="#1F64FF" @click="sendMessage">发送</u-button>
				</u-col>
			</u-row>
			
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				// scrollTop: '573',
				isfinish: true, // 会话中
				
				//识万物
				controller_nine: null, // 用于终止会话
				t_time_nine: null, // 计时器
				nine_shi: null,
				
				selectDone: "",
				msgListHeight: 0,
				// barHeight: 50,
				userInfo: '',

				current: 0,
				key: 0,
				radioValue: true,
				
				chatInputValue: "",
				chatType: '识万物',
				loading: true,
				session_code: "",
				chat_group_code: "",
				supplement: {}, // 请求参数
				listName: 'nine',
				avatar: "",
				imgList: [],
				messageList: {
					'nine': [{
						talk: `<span style="font-size: 17px">我可以识别图片中的各种物体、场景或人物方便用户从图片中提取需要信息</span>`,
						type: 'assistant'
					}]
				},
				
				claudeImg: global.baseImg+'/xcx/ca67317a-cbc1-4890-a3ce-c1b472785b0a.jpg',
				waitImg: global.baseImg+'/xcx/c4a8054e-50bd-4790-a3cb-ec585412daa7.jpg',
			}
		},
		components: {
			// Title
		},
		onLoad(option) {

			// 获取屏幕高度
			uni.getSystemInfo({
				success: res => {
					this.screenHeight = res.windowHeight
					// 100为底部输入栏高度，单位rpx，需要先转成px
					this.msgListHeight = this.screenHeight - uni.upx2px(100)
					
				}
			})
			
		},
		
		onShow() {
			let nine_code = this.messageList.nine[this.messageList.nine.length - 1].code;
			
			if(nine_code == 40022) {  // 去除登录或升级vip提示
				this.messageList.nine.pop()
			}
			
			this.chatType = '识万物'
			this.listName = 'nine'
			
			this.chatInputValue = '请描述一下这张图片的内容'

			let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			let avatarUrl = global.baseImg+ '/'+ uni.getStorageSync("avatarUrl");
			this.avatar = avatarUrl;
			
			if(this.messageList[this.listName].length == 1) {
				uni.setStorageSync('imgUrl', '')
				uni.setStorageSync('discern_code','')
			}
			
			document.title = '无忧秘书AI是一款人工智能聊天机器-能进行AI绘画-适用于多个场景进行AI对话-商务合作-源码定制等'
			let metaKeywords = document.createElement('meta')
			metaKeywords.id = 'chat-meta-keywords'
			metaKeywords.name = 'keywords'
			metaKeywords.content = '无忧秘书AI,Ai聊天,ChatGpt3.5,ChatGpt4.0中文版,OpenAi,chatgpt国内版,AI智能软件,源码定制,API接口GPT4.0,API接口百度AI绘画'
			document.getElementsByTagName('head')[0].appendChild(metaKeywords)
					
			let metaDescription = document.createElement('meta')
			metaDescription.id = 'chat-meta-description'
			metaDescription.name = 'description'
			metaDescription.content = '无忧秘书AI是人工智能聊天工具,相当于国内版的chatgpt4.0.拥有语言理解能力和文本生成能力,能撰写视频脚本,文案,翻译,代码,写论文邮件,诗词歌赋等任务.职场上升职.写工作报告,企业管理,市场营销等能助你一臂之力.它上知天文下知地理,在任何场景都能和你像人类一样进行交流,互动.'
			document.getElementsByTagName('head')[0].appendChild(metaDescription)
		},
		
		onHide() {

		   document.getElementById('chat-meta-keywords').remove()
		   document.getElementById('chat-meta-description').remove()
		},
		

		methods: {
			
			copyFun(val) {
				uni.setClipboardData({
					data: val, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							title: '复制成功'
						})
					}
				})

			},
			
			//信息回调方法
			async creatChatFun(data, state) {
				if(this.listName == 'nine') {
					var num_nine = 0
					this.messageList[this.listName].push({
						talk: `思考中,耗时${num_nine}秒`,
						type: 'assistant'
					})
					this.nine_shi = setInterval(() => {
						num_nine++
					}, 1000)
					this.t_time_nine = setInterval(() => {
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
							talk: `思考中,耗时${num_nine}秒`,
							type: 'assistant',
							is_time: true
						}
						this.$forceUpdate()
					}, 1000)
					// ==========================================
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.controller_nine = new AbortController()
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					const response_nine = await fetch(global.baseUrl+'/api/chat/async_chat_completion', { 
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': global.source
						},
						body: JSON.stringify(data),
						signal: this.controller_nine.signal
					}).catch(err => {
						// console.log(err);
					});
					// console.log(response, response == undefined);
					if (response_nine.status == '400') {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_nine);
						clearInterval(this.nine_shi);
						response_nine.json().then((res) => {
							// console.log(res, 777);
							// console.log(res.code,666);
							if(res.code < 49999) {
								let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
								// console.log(userInfo.role == 'guess' ,'panduan');
																	
								if(res.code == 40013) {
									this.$api.msg('登录信息已过期，请重新登录')
									this.messageList[this.listName].pop()
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login',
										})
									}, 1500)
									
								} else {
									this.userRole = userInfo.role
									this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
										talk: res.msg,
										type: 'assistant',
										time: 0,
										code: res.code == 40022 ? res.code : 40021,
										status: "stop",
										textNumber: 0,
										history: false,
										loading: true
									}
								}		
								this.$forceUpdate()
								this.toBottom()
							} else if(res.code > 49999) {
								this.messageList[this.listName].pop()
								this.$api.msg('网络异常，请稍后重试')
								// this.$api.msg(res.msg)
							} else {
								this.messageList[this.listName].pop()
								this.$api.msg(res.msg)
							}
						})
						return;
						
					}
					
					if (response_nine == undefined) {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_nine);
						clearInterval(this.nine_shi);
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
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
				
				
				
					if (!response_nine.ok) {
						// this.isfinish = true
						this.$message.error(response_nine.statusText);
						return;
					}
				
					const reader = response_nine.body.getReader();
					const decoder = new TextDecoder("utf-8");
					let info = '';
					let status = '';
					let integral = 0
					let completion_tokens = 0
					let prompt_tokens = 0
					let tabType = this.listName
					while (true) {
						// console.log(7895);
				
						// this.scrollBottom();
						const { value, done } = await reader.read();
						if(done) {
							this.messageList[tabType][this.messageList[tabType].length - 1].loading = true;
							this.$forceUpdate()
							break;
						}
						if (value) {
				
							let chat = decoder.decode(value);
							// console.log(chat,880);
							let chatArr = chat.split('\r\n');
							
							chatArr.forEach( val => {
								if(val != '') {
									let res = JSON.parse(val);
									
									if(res.code) {
										if(res.code < 49999) {
											let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
											// console.log(userInfo.role == 'guess' ,'panduan');								
											this.userRole = userInfo.role
											this.messageList[this.listName][this.messageList[tabType].length - 1] = {
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
											clearInterval(this.t_time_nine);
											clearInterval(this.nine_shi);
											// console.log(this.messageList[this.listName],1258)
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
										if(res.content != '' && res.content != null) {
											info += res.content;
										}
										if(res.session_code != '' && res.content != null) {
											this.session_code = res.session_code;
											uni.setStorageSync('discern_code', this.session_code)
										}
										
										if(res.chat_group_code != '' && res.chat_group_code != null) {
											// localStorage.setItem('chat_group_code', res.chat_group_code);
											this.chat_group_code = res.chat_group_code
										}
										if(res.finish_reason != '' && res.finish_reason != null) {
											status = res.finish_reason
										}
										
										integral = res.integral
										completion_tokens = res.completion_tokens
										prompt_tokens = res.prompt_tokens
										let load_state = false
										
										if(status == true) {
											load_state = true
										} else {
											load_state = false
										}
										
										if (state == 'first') {
											this.supplement = {
												chat_type: 4,
												// action_type: 3,
												session_code: this.session_code,
												chat_group_code: this.chat_group_code,
												// stream_str: 1,
												// is_decode: 1,
												msg_list: [{
														role: 'user',
														content: this.chatInputValue,
													},
													{
														role: 'assistant',
														content: info,
														// is_time: true,
													}
												]
											}
										}
														
															
										//继续提问和补充
										if (state == 'continue') {
											//把数据变成Array
											// console.log(this.supplement.msg_list,5689)
											// console.log(typeof(this.supplement.msg_list),315)
														
											// 
											if(typeof(this.supplement.msg_list)=='string') {
												this.supplement.msg_list = JSON.parse(this.supplement.msg_list)
											}
											// 
											// console.log(this.supplement.msg_list,330)
											this.supplement.msg_list.push({
												role: 'assistant',
												content: info,
												// is_time: true,
											})
										}
										clearInterval(this.t_time_nine)
														
										// 	//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num_nine,
											code: 200,
											is_time: true,
											history: false,
											status,
											integral,
											completion_tokens,
											prompt_tokens,
											textNumber: info.replace(/[\r\n]/g, "").length,
											loading: load_state,
											session_code: this.session_code,
											chat_group_code: this.chat_group_code,
										}
														
									}
									
								}
								
							})
							
						}  

						this.$forceUpdate();
						this.toBottom();
					}
				}

			},
			
			sendMessage(message) {
				let send_talk = this.messageList[this.listName][this.messageList[this.listName].length - 1].talk;
				let send_loading = this.messageList[this.listName][this.messageList[this.listName].length - 1].loading;
				let send_time = this.messageList[this.listName][this.messageList[this.listName].length - 1].time;
				let history = this.messageList[this.listName][this.messageList[this.listName].length - 1].history;
				
				console.log(this.messageList[this.listName][this.messageList[this.listName].length - 1], 8871);
				if (send_talk.indexOf('思考中') != -1 && send_time > 0) {

					this.$api.msg('当前问题还没回答完毕，请稍后再提问！')
					return
				}

				if (send_loading == false && send_time > 0) {

					this.$api.msg('当前问题还没回答完毕，请稍后再提问！')
					return
				}
				if(send_time == 0 && !history) {
					this.messageList[this.listName].pop()
				}
				if (this.chatInputValue.trim() == '') return this.$api.msg('请输入您要发送的内容')

				let img_url = uni.getStorageSync('imgUrl')
				if(this.imgList.length == 0 && img_url == '') {
					return this.$api.msg('请上传需要识别的图片')
				}
				
				if(img_url == '' || img_url == null) {
					this.messageList[this.listName].push({
						talk: this.chatInputValue,
						type: 'user',
						images: this.imgList
					})
					uni.setStorageSync('imgUrl', this.imgList[0])
				} else {
					this.messageList[this.listName].push({
						talk: this.chatInputValue,
						type: 'user',
						images: []
					})
				}

				// const hide_cont = '(回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字)';
				let chat_cont = this.chatInputValue
				
				let data = {
					chat_type: '1002',
					session_code: uni.getStorageSync('discern_code'),
					chat_group_code: "",
					content: chat_cont,
					msg_list: [],
					model:'v2.1'
				}
				
				this.messageList[this.listName].map((item, tip) => {
					if(tip > 0) {
						let val = { role: item.type, content: item.talk ,origin_image: uni.getStorageSync('imgUrl')}
						data.msg_list.push(val)
					}
				})
				data.msg_list = JSON.stringify(data.msg_list)
				
				this.creatChatFun(data, 'first')
				
				this.chatInputValue = ''
				this.imgList = []

			},

			toBottom() {
				
				// 定位到当前聊天地点
				this.$nextTick(()=>{
					setTimeout(() => {
						var scrollTop = document.getElementById("textadd")
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
			
			goToVip() {
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
			
			goLogin() {
				uni.navigateTo({
					url: '/pages/login/login',
				})
			},
			
			// 停止会话
			endController() {
				if (this.controller_nine != null) {
					this.controller_nine.abort()
				}
				this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
				clearInterval(this.t_time_nine)
				clearInterval(this.nine_shi)
				this.$forceUpdate()
			},
			
			// 停止开始回答
			stopStart() {
				if (this.controller_nine != null) {
					this.controller_nine.abort()
				}
				clearInterval(this.t_time_nine)
				clearInterval(this.nine_shi)
				this.messageList.nine.pop()
				this.$forceUpdate()
			},
			
			newChatSpeak() {
				let send_talk = this.messageList[this.listName][this.messageList[this.listName].length - 1].talk;
				let send_loading = this.messageList[this.listName][this.messageList[this.listName].length - 1].loading;
				let send_time = this.messageList[this.listName][this.messageList[this.listName].length - 1].time;
				
				// console.log(this.messageList[this.listName][this.messageList[this.listName].length - 1].time, 888);
				if (send_talk.indexOf('思考中') != -1 && send_time > 0) {
				
					this.$api.msg('当前问题还没回答完毕，请稍后再操作！')
					return
				}
				
				if (send_loading == false && send_time > 0) {
				
					this.$api.msg('当前问题还没回答完毕，请稍后再操作！')
					return
				}
				this.askShow = true; // 显示热搜提问
				this.messageList[this.listName].splice(1, this.messageList[this.listName].length - 1);
				this.session_code = '';
				this.chat_group_code = '';
				this.chatInputValue = '请描述一下这张图片的内容';
				this.imgList = []
				uni.setStorageSync('imgUrl', '')
				uni.setStorageSync('discern_code','')
			},
			
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			// 图片预览
			checkImg(url) {
				let img_url = global.baseImg+'/'+url
				uni.previewImage({
					urls:[img_url],
					current:0
				})
			},
			
			// AI识图
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
							// console.log(imgData,333)
							if(imgData.code == 20000) {
								// let url = global.baseImg + '/'+ imgData.data.new_url
								if(that.messageList[that.listName].length > 1) {
									that.newChatSpeak() // 重新传图片要开启新会话
								}
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
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "@/static/css/chat.less";
	.u-page {
		margin-top: 0upx !important;
	}
	.btn_link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		.link_l {
			display: flex;
			.l_chat {
				border-radius: 6upx;
				border: 1upx solid #1F64FF;
				padding: 5upx 10upx;
				color: #1F64FF;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				margin-bottom: 10upx;
				display: flex;
				align-items: center;
				.l_text {
					padding-left: 8upx;
				}
			}
		}
	}
	
	.chat_input {
		border-radius: 6upx;
		border: 1upx solid #E5E6EB;
		/* padding: 10upx; */
		.input_right {
			display: flex;
			align-items: center;
			border-radius: 6upx;
			border: 1upx solid #E5E5E5;
			padding-right: 20upx;
			width: 148rpx;
			margin: 0 0 10upx 10upx;
			.inputImg {
				width: 90upx;
				height: 90upx;
				border-radius: 6upx 0 0 6upx;
			}
			.input_text {
				height: 90upx;
				width: 20upx;
				border-left: 1upx solid #E5E5E5;
			}
		}
	}
</style>
<style>
	page {
		background: #f6f8fb;
	}
</style>