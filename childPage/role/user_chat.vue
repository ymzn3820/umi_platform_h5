<template>
	<view id="chat">
		<!-- <Title :title='"无忧秘书AI"' /> -->
		<!-- <u-tabs :list="list" lineWidth='85' lineHeight='2' lineColor='#1f64ff' :activeStyle='{color: "#1F64FF"}'
			@change='tabsChange' :current='current'></u-tabs> -->
		<view class="head_index">
			<view class="head_cont">
				<view class="cont_tabs">
					<view class="item_tabs" @click="tabsChange('ChatGLM')"
						:class="[listName == 'six' ? 'active_tabs' : '']">
						ChatGLM
						<u-badge type="error" value="免费" shape="horn" absolute :offset="[-10,-10]"></u-badge>
					</view>
					<view class="item_tabs" @click="tabsChange('文心一言')"
						:class="[listName == 'three' ? 'active_tabs' : '']">文心一言</view>
					<view class="item_tabs" @click="tabsChange('讯飞星火')"
						:class="[listName == 'four' ? 'active_tabs' : '']">讯飞星火</view>
					<view class="item_tabs" @click="tabsChange('通义千问')"
						:class="[listName == 'seven' ? 'active_tabs' : '']">通义千问</view>
					<view class="item_tabs" @click="tabsChange('商汤日日新')"
						:class="[listName == 'eight' ? 'active_tabs' : '']">商汤日日新</view>
				</view>
				<!-- <view class="right_text" @click="toHistory">历史对话</view> -->
			</view>
		</view>

		<!-- {{messageList}}{{listName}} -->
		<scroll-view ref="box" class="u-page" scroll-with-animation scroll-y="true" id="textadd"
			:style='{ height: msgListHeight}'>
			<view scroll-with-animation v-for="item,index in messageList[listName]" :key="index" class="listItem"
				:anchor="index">

				<u-row align="top" gutter="5">
					<u-col span="1.5" textAlign="center" align="top" justify="top">
						<image style="height: 38px;width: 38px; border-radius: 50%;"
							:src="item.type=='assistant'? gptImg :avatar">
						</image>
					</u-col>
					<u-col soan='9'>
						<view v-if="item.type=='assistant'">
							<!-- {{item.code}} -->
							<view class="tips" v-html='item.talk' v-if='index===0'></view>
							<!-- <view v-if="loading" class="talk">
								思考中
							</view> -->

							<view v-else>
								<span class="loadingTalk" v-if="item.talk.indexOf('思考中')!=-1">
									<view class="flexs">
										<image :src="waitImg" mode="" class="loadingImages"></image>
										<text style="vertical-align: top; word-break:break-all;"
											v-text="item.talk"></text>
									</view>

									<u-col span="4" v-if="index===messageList[listName].length-1"><u-button
											type='primary'
											:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
											size="mini" color="rgba(31, 100, 255, 0.1)" @click="stopStart">
											<image src="@/static/images/Remove_duotone.png"
												style="width: 40upx;height: 40upx;margin-right: 16upx;" />
											停止回答
										</u-button>
									</u-col>
								</span>

								<view class="tips" v-else-if="item.code==40022">
									<text style="font-size:17px; word-break:break-all;">{{item.talk}}</text>
									<view style="display: flex; justify-content: space-around;">
										<u-button type="error" color="#FF9B17" v-if="listName == 'one'"
											:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'48%'}"
											@click='goToVip'>升级会员</u-button>
										<u-button type="error" color="#1F64FF"
											:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'48%'}"
											@click='goToVip'>开通流量包</u-button>
									</view>
								</view>

								<view class="tips" v-else-if="item.code==40021">
									<text style="font-size:17px; word-break:break-all;">{{item.talk}}</text>
								</view>

								<view v-else>
									<view class="tips">

										<!-- <text style="font-size:32upx; word-break:break-all;" v-if="!item.loading">{{item.talk}}</text> -->
										<ua-markdown :source="item.talk" :showLine="false" />
										<!-- 时间 和 字数 -->
										<u-row class='edit'>
											<u-col span="6" style="font-size: 14px;">
												字数:{{item.textNumber}}
											</u-col>
											<u-col span="6" style="font-size: 14px;" v-if="item.loading">
												消耗:{{item.integral }}算力
											</u-col>

										</u-row>
										<u-row class='edit' v-if="item.loading && listName != 'six'">
											<u-col span="6" align="left" style="font-size: 14px;">
												上行:{{item.prompt_tokens}} token
											</u-col>
											<u-col span="6" align="left" style="font-size: 14px;">
												下行:{{item.completion_tokens}} token
											</u-col>
										</u-row>
										<u-row class='edit' v-if="item.loading && listName == 'six'">
											<u-col span="6" align="left" style="font-size: 14px;">
												消耗:{{item.all_tokens}} token
											</u-col>
										</u-row>
										<u-row class='edit'>
											<u-col span="7.5" v-if="item.history"></u-col>
											<u-col span="1" v-if="!item.history">
												<view>
													<image v-if="item.loading" src="@/static/images/time.png" mode=""
														width="16px" height="16px" style="vertical-align: top;"></image>
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
											<u-col span="3"></u-col>
											<u-col span="1" @click="copyFun(item.talk)">
												<image src="@/static/images/balckCopy.png" mode=""></image>
											</u-col>
										</u-row>
										<view class="btn_tab">
											<text
												class="tab_left">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉，已通过阿里云内容安全审核</text>
										</view>

									</view>
									<u-row gutter="20" style="flex-wrap: wrap;width: 100%;">
										<!-- <u-col span="3" textAlign="left" v-if="item.status=='length'"> <u-button type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px"}' size="mini"
												color="rgba(31, 100, 255, 0.1)" @click="continueFun">继续</u-button></u-col>
												
										<u-col span="4" v-if="index===messageList[listName].length-1 && item.loading" ><u-button
												type='primary' :customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)" @click="show=true">优化本次回答</u-button></u-col>
												 -->
										<u-col span="4"
											v-if="index===messageList[listName].length-1 && !item.history && !item.loading"><u-button
												type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)" @click="endController">
												<image src="@/static/images/Remove_duotone.png"
													style="width: 40upx;height: 40upx;margin-right: 16upx;" />
												停止回答
											</u-button>
										</u-col>

										<u-col span="4"
											v-if="index===messageList[listName].length-1 && !item.history && item.loading">
											<u-button type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)"
												@click="againQs(messageList[listName][messageList[listName].length - 2].talk)">
												<image src="@/static/images/ArrowsCounterClockwise.png"
													style="width: 40upx;height: 40upx;margin-right: 16upx" mode="">
												</image>
												重试
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

								<image src="@/static/images/copy.png" mode="" @click="copyFun(item.talk)"></image>
							</view>
							<view @click="againQs(item.talk)" class="reset-question"
								v-if="messageList[listName][messageList[listName].length - 1].loading && !item.history">
								<image src="@/static/images/ChatCircleDots.png" mode=""
									style="margin-right: 16upx;width: 40upx;height: 40upx;margin: 8upx;"></image>
								<view>
									重新提问
								</view>
							</view>

						</view>
					</u-col>
				</u-row>
			</view>
		</scroll-view>

		<view class="bottomInput" style="bottom: 0;">
			<u-row align='bottom' gutter="5">
				<u-col span="3.5" @click="newChatSpeak"
					v-if="messageList[listName].length > 2 && messageList[listName][messageList[listName].length - 1].loading">
					<u-button type='primary'
						:customStyle='{"color":"#1F64FF","height":"28px","margin-bottom": "8px","font-size":"14px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
						size="mini" color="rgba(31, 100, 255, 0.1)">
						开启新会话
					</u-button>
				</u-col>
				<u-col span="3.5" @click="toHistory">
					<u-button type='primary'
						:customStyle='{"color":"#1F64FF","height":"28px","margin-bottom": "8px","font-size":"14px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
						size="mini" color="rgba(31, 100, 255, 0.1)">
						历史会话
					</u-button>
				</u-col>
			</u-row>
			<view class="input_text">
				<u--textarea v-model="chatInputValue" placeholder="在此输入你想了解的内容" :maxlength="maxlength" autoHeight
					@confirm="sendInfo"></u--textarea>
				<view class="send_btn" @click="sendInfo">发送</view>
			</view>

		</view>
		<u-modal :show="show" @cancel="show = false" confirmText="确定" confirmColor="#1F64FF" :showCancelButton='true'
			@confirm="showFun">
			<view class="modal">
				<view class="edit">

					<view class="changes"></view> 优化本次回答
				</view>
				<view class="content">
					<u--textarea v-model="complete" placeholder="在此输入你想优化的内容" border="none"
						height='110px'></u--textarea>
					<!-- {{content.prompts_name}} -->
				</view>
			</view>
		</u-modal>

	</view>
</template>

<script>
	import {
		creatChat,
		chat_likes,
		chat_session,

	} from "@/apis/chat.js"
	import {
		saveFootprint,
		applyChat
	} from "@/apis/user.js"
	import uaMarkdown from '@/components/ua2-markdown/ua-markdown.vue'
	// import Title from "@/pages/title/index.vue"
	// import * as TextEncoding from 'text-encoding-shim';

	export default {
		data() {
			return {
				// scrollTop: '573',
				isfinish: true, // 会话中

				//文心一言
				controller_three: null, // 用于终止会话
				t_time_three: null, // 计时器
				three_shi: null,

				//讯飞星火
				controller_four: null, // 用于终止会话
				t_time_four: null, // 计时器
				four_shi: null,

				//ChatGLM
				controller_six: null, // 用于终止会话
				t_time_six: null, // 计时器
				six_shi: null,

				//通义千问
				controller_seven: null, // 用于终止会话
				t_time_seven: null, // 计时器
				seven_shi: null,

				//商汤日日新
				controller_eight: null, // 用于终止会话
				t_time_eight: null, // 计时器
				eight_shi: null,

				// msgCode: '', // 当前会话的唯一标识

				selectDone: "",
				msgListHeight: 0,
				// barHeight: 50,
				userInfo: '',

				current: 0,
				key: 0,
				checkboxValue1: [],
				upDownText: false,
				show: false,
				transitionShow: false,
				complete: "",
				radioValue: true,
				maxlength: 901,

				chatInputValue: "",
				oldChatInputValue: "",
				chatType: 'ChatGLM',
				loading: true,
				session_code: "",
				chat_group_code: "",
				supplement: {}, // 请求参数
				listName: 'six',
				avatar: "",
				billList: [],
				messageList: {
					'three': [],
					'four': [],
					'six': [],
					'seven': [],
					'eight': []
				},

				content: '',
				message_covert: '',

				gptImg: global.baseImg + '/xcx/8d2bd289-ff24-4f3c-b6d2-a4cbbd7ca737.jpg',
				waitImg: global.baseImg + '/xcx/c4a8054e-50bd-4790-a3cb-ec585412daa7.jpg',
			}
		},
		components: {
			uaMarkdown
		},
		onLoad(option) {
			this.content = JSON.parse(option.item);
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

			let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			let avatarUrl = global.baseImg + '/' + uni.getStorageSync("avatarUrl");
			this.avatar = avatarUrl;

			if (this.content.session_code) {
				this.historySession()
			}

			let chat_val = {
				talk: `<span style="font-size: 17px">${this.content.character_name}</span><br/>
				<span style="font-size: 15px;">${this.content.character_greetings}</span>`,
				type: 'assistant'
			}
			console.log(this.content.character_avatar, 7458)
			this.gptImg = global.baseImg +'/'+ this.content.character_avatar
			this.messageList.three[0] = chat_val
			this.messageList.four[0] = chat_val
			this.messageList.six[0] = chat_val
			this.messageList.seven[0] = chat_val
			this.messageList.eight[0] = chat_val


			document.title = '无忧秘书AI是一款人工智能聊天机器-能进行AI绘画-适用于多个场景进行AI对话-商务合作-源码定制等'
			let metaKeywords = document.createElement('meta')
			metaKeywords.id = 'chat-meta-keywords'
			metaKeywords.name = 'keywords'
			metaKeywords.content =
				'无忧秘书AI,Ai聊天,ChatGpt3.5,ChatGpt4.0中文版,OpenAi,chatgpt国内版,AI智能软件,源码定制,API接口GPT4.0,API接口百度AI绘画'
			document.getElementsByTagName('head')[0].appendChild(metaKeywords)

			let metaDescription = document.createElement('meta')
			metaDescription.id = 'chat-meta-description'
			metaDescription.name = 'description'
			metaDescription.content =
				'无忧秘书AI是人工智能聊天工具,相当于国内版的chatgpt4.0.拥有语言理解能力和文本生成能力,能撰写视频脚本,文案,翻译,代码,写论文邮件,诗词歌赋等任务.职场上升职.写工作报告,企业管理,市场营销等能助你一臂之力.它上知天文下知地理,在任何场景都能和你像人类一样进行交流,互动.'
			document.getElementsByTagName('head')[0].appendChild(metaDescription)
		},

		onHide() {

			document.getElementById('chat-meta-keywords').remove()
			document.getElementById('chat-meta-description').remove()
		},


		methods: {


			historySession(session) {
				// let send_talk = this.messageList[this.listName][this.messageList[this.listName].length - 1].talk;
				// let send_loading = this.messageList[this.listName][this.messageList[this.listName].length - 1].loading;
				// let send_time = this.messageList[this.listName][this.messageList[this.listName].length - 1].time;

				// // console.log(this.messageList[this.listName][this.messageList[this.listName].length - 1].time, 888);
				// if (send_talk.indexOf('思考中') != -1 && send_time > 0) {

				// 	this.$api.msg('当前问题还没回答完毕，请稍后再查看！')
				// 	return
				// }

				// if (send_loading == false && send_time > 0) {

				// 	this.$api.msg('当前问题还没回答完毕，请稍后再查看！')
				// 	return
				// }
				let chatType = this.content.chat_type;
				if (chatType == 4) {
					this.listName = 'three';
				} else if (chatType == 5) {
					this.listName = 'four';
				} else if (chatType == 8) {
					this.listName = 'six';
				} else if (chatType == 10) {
					this.listName = 'seven';
				} else if (chatType == 11) {
					this.listName = 'eight';
				}
				this.messageList[this.listName].splice(1, this.messageList[this.listName].length - 1)
				this.$forceUpdate()

				let data_code = this.content.session_code
				chat_session(data_code).then(res => {
					//初始化信息
					this.supplement = {
						chat_type: chatType,
						// action_type: 3,
						// session_code: this.session_code,
						// chat_group_code: this.chat_group_code,
						// stream_str: 1,
						// is_decode: 1,
						msg_list: []
					}

					res.data.map((item, index) => {
						this.supplement.session_code = item.session_code
						this.supplement.chat_group_code = item.chat_group_code
						this.messageList[this.listName].push({
							talk: item.content,
							type: item.role,
							integral: item.integral,
							completion_tokens: item.completion_tokens,
							prompt_tokens: item.prompt_tokens,
							time: 0,
							code: 200,
							// status,
							loading: true,
							textNumber: item.content.replace(/[\r\n]/g, "").length,
							history: true,
							session_code: item.session_code,
							chat_group_code: item.chat_group_code
						})
						this.supplement.msg_list.push({
							role: item.role,
							content: item.content
						})

						this.toBottom()
						this.$forceUpdate()
					})

					uni.setStorageSync('history_code', '')
				})
			},

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

			//重新提问
			againQs(val) {
				// console.log(val,662)
				let send_talk = this.messageList[this.listName][this.messageList[this.listName].length - 1].talk;
				let send_loading = this.messageList[this.listName][this.messageList[this.listName].length - 1].loading;
				let send_time = this.messageList[this.listName][this.messageList[this.listName].length - 1].time;

				// console.log(this.messageList[this.listName][this.messageList[this.listName].length - 1].time, 888);
				if (send_talk.indexOf('思考中') != -1 && send_time > 0) {

					this.$api.msg('当前问题还没回答完毕，请稍后提问！')
					return
				}

				if (send_loading == false && send_time > 0) {

					this.$api.msg('当前问题还没回答完毕，请稍后再提问！')
					return
				}
				this.chatInputValue = val;
				this.sendMessage(this.chatInputValue)
			},
			//继续回调
			continueFun() {
				this.supplement.msg_list.push({
					role: 'user',
					content: '继续'
				})
				this.supplement.msg_list = JSON.stringify(this.supplement.msg_list)
				this.creatChatFun(this.supplement, 'continue')
				this.supplement.msg_list = JSON.parse(this.supplement.msg_list)
				//删除继续的数据
				this.supplement.msg_list.pop()
			},

			//信息回调方法
			async creatChatFun(data, state) {
				if (this.listName == 'three') {
					var num_three = 0
					this.messageList[this.listName].push({
						talk: `思考中,耗时${num_three}秒`,
						type: 'assistant'
					})
					this.three_shi = setInterval(() => {
						num_three++
					}, 1000)
					this.t_time_three = setInterval(() => {
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
							talk: `思考中,耗时${num_three}秒`,
							type: 'assistant',
							is_time: true
						}
						this.$forceUpdate()
					}, 1000)
					// ==========================================
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.controller_three = new AbortController()
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					const response_three = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
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
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_three);
						clearInterval(this.three_shi);
						response_three.json().then((res) => {
							// console.log(res, 777);
							// console.log(res.code,666);
							if (res.code < 49999) {
								let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
								// console.log(userInfo.role == 'guess' ,'panduan');

								if (res.code == 40013) {
									this.$api.msg('登录信息已过期，请重新登录')
									this.messageList[this.listName].pop()
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login',
										})
									}, 1500)

								} else {
									this.userRole = userInfo.role
									this.messageList[this.listName][this.messageList[this.listName].length -
										1] = {
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
							} else if (res.code > 49999) {
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

					if (response_three == undefined) {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_three);
						clearInterval(this.three_shi);
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
					let tabType = this.listName
					while (true) {
						// console.log(7895);

						// this.scrollBottom();
						const {
							value,
							done
						} = await reader.read();
						if (done) {
							this.messageList[tabType][this.messageList[tabType].length - 1].loading = true;
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

									if (res.code) {
										if (res.code < 49999) {
											let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
											// console.log(userInfo.role == 'guess' ,'panduan');								
											this.userRole = userInfo.role
											this.messageList[this.listName][this.messageList[tabType].length -
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
											clearInterval(this.t_time_three);
											clearInterval(this.three_shi);
											// console.log(this.messageList[this.listName],1258)
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
										if (res.content != '' && res.content != null) {
											info += res.content;
										}
										if (res.session_code != '' && res.content != null) {
											this.session_code = res.session_code;
										}

										if (res.chat_group_code != '' && res.chat_group_code != null) {
											// localStorage.setItem('chat_group_code', res.chat_group_code);
											this.chat_group_code = res.chat_group_code
										}
										if (res.finish_reason != '' && res.finish_reason != null) {
											status = res.finish_reason
										}

										integral = res.integral
										completion_tokens = res.completion_tokens
										prompt_tokens = res.prompt_tokens
										let load_state = false

										if (status == true) {
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
											if (typeof(this.supplement.msg_list) == 'string') {
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
										clearInterval(this.t_time_three)

										// 	//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num_three,
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
										if (load_state) { //保存记录
											let save_val = {
												"type_name": "文心一言",
												"type_code": "celebrity",
												"title": data.content,
												"eid": this.session_code
											}

											this.saveFootprint(save_val)
										}
									}

								}

							})

						}

						this.$forceUpdate();
						this.toBottom();
					}
				} else if (this.listName == 'four') {
					var num_four = 0
					this.messageList[this.listName].push({
						talk: `思考中,耗时${num_four}秒`,
						type: 'assistant'
					})
					this.four_shi = setInterval(() => {
						num_four++
					}, 1000)
					this.t_time_four = setInterval(() => {
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
							talk: `思考中,耗时${num_four}秒`,
							type: 'assistant',
							is_time: true
						}
						this.$forceUpdate()
					}, 1000)
					// ==========================================
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.controller_four = new AbortController()
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					const response_four = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': global.source
						},
						body: JSON.stringify(data),
						signal: this.controller_four.signal
					}).catch(err => {
						// console.log(err);
					});
					// console.log(response, response == undefined);
					if (response_four.status == '400') {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_four);
						clearInterval(this.four_shi);
						response_four.json().then((res) => {
							// console.log(res, 777);
							// console.log(res.code,666);
							if (res.code < 49999) {
								let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
								// console.log(userInfo.role == 'guess' ,'panduan');
								if (res.code == 40013) {
									this.$api.msg('登录信息已过期，请重新登录')
									this.messageList[this.listName].pop()
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login',
										})
									}, 1500)

								} else {
									this.userRole = userInfo.role
									this.messageList[this.listName][this.messageList[this.listName].length -
										1] = {
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
							} else if (res.code > 49999) {
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

					if (response_four == undefined) {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_four);
						clearInterval(this.four_shi);
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



					if (!response_four.ok) {
						// this.isfinish = true
						this.$message.error(response_four.statusText);
						return;
					}

					const reader = response_four.body.getReader();
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
						const {
							value,
							done
						} = await reader.read();
						if (done) {
							this.messageList[tabType][this.messageList[tabType].length - 1].loading = true;
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

									if (res.code) {
										if (res.code < 49999) {
											let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
											// console.log(userInfo.role == 'guess' ,'panduan');								
											this.userRole = userInfo.role
											this.messageList[this.listName][this.messageList[tabType].length -
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
											clearInterval(this.t_time_four);
											clearInterval(this.four_shi);
											// console.log(this.messageList[this.listName],1258)
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
										if (res.content != '' && res.content != null) {
											info += res.content;
										}
										if (res.session_code != '' && res.content != null) {
											this.session_code = res.session_code;
										}

										if (res.chat_group_code != '' && res.chat_group_code != null) {
											// localStorage.setItem('chat_group_code', res.chat_group_code);
											this.chat_group_code = res.chat_group_code
										}
										if (res.finish_reason != '' && res.finish_reason != null) {
											status = res.finish_reason
										}

										integral = res.integral
										completion_tokens = res.completion_tokens
										prompt_tokens = res.prompt_tokens
										let load_state = false

										if (status == 2) {
											load_state = true
										} else {
											load_state = false
										}

										if (state == 'first') {
											this.supplement = {
												chat_type: 5,
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
											if (typeof(this.supplement.msg_list) == 'string') {
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
										clearInterval(this.t_time_four)

										// 	//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num_four,
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

										if (load_state) { //保存记录
											let save_val = {
												"type_name": "讯飞星火",
												"type_code": "celebrity",
												"title": data.content,
												"eid": this.session_code
											}

											this.saveFootprint(save_val)
										}
									}

								}

							})

						}

						this.$forceUpdate();
						this.toBottom();
					}
				} else if (this.listName == 'six') {
					var num_six = 0
					this.messageList[this.listName].push({
						talk: `思考中,耗时${num_six}秒`,
						type: 'assistant'
					})
					this.six_shi = setInterval(() => {
						num_six++
					}, 1000)
					this.t_time_six = setInterval(() => {
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
							talk: `思考中,耗时${num_six}秒`,
							type: 'assistant',
							is_time: true
						}
						this.$forceUpdate()
					}, 1000)
					// ==========================================
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.controller_six = new AbortController()
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					data.model = 'chatglm_pro'; // ChatGLM必传参数
					const response_six = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': global.source
						},
						body: JSON.stringify(data),
						signal: this.controller_six.signal
					}).catch(err => {
						// console.log(err);
					});
					if (response_six.status == '400') {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_six);
						clearInterval(this.six_shi);
						response_six.json().then((res) => {
							// console.log(res, 777);
							// console.log(res.code,666);
							if (res.code < 49999) {
								let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
								// console.log(userInfo.role == 'guess' ,'panduan');
								if (res.code == 40013) {
									this.$api.msg('登录信息已过期，请重新登录')
									this.messageList[this.listName].pop()
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login',
										})
									}, 1500)

								} else {
									this.userRole = userInfo.role
									this.messageList[this.listName][this.messageList[this.listName].length -
										1] = {
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
							} else if (res.code > 49999) {
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

					if (response_six == undefined) {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_six);
						clearInterval(this.six_shi);
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



					if (!response_six.ok) {
						// this.isfinish = true
						this.$message.error(response_six.statusText);
						return;
					}

					const reader = response_six.body.getReader();
					const decoder = new TextDecoder("utf-8");
					let info = '';
					let status = '';
					let integral = 0
					let completion_tokens = 0
					let prompt_tokens = 0
					let all_tokens = 0
					let tabType = this.listName
					while (true) {
						// console.log(7895);

						// this.scrollBottom();
						const {
							value,
							done
						} = await reader.read();
						if (done) {
							this.messageList[tabType][this.messageList[tabType].length - 1].loading = true;
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

									if (res.code) {
										if (res.code < 49999) {
											let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
											// console.log(userInfo.role == 'guess' ,'panduan');								
											this.userRole = userInfo.role
											this.messageList[this.listName][this.messageList[tabType].length -
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
											clearInterval(this.t_time_six);
											clearInterval(this.six_shi);
											// console.log(this.messageList[this.listName],1258)
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
										if (res.content != '' && res.content != null) {
											info += res.content;
										}
										if (res.session_code != '' && res.content != null) {
											this.session_code = res.session_code;
										}

										if (res.chat_group_code != '' && res.chat_group_code != null) {
											// localStorage.setItem('chat_group_code', res.chat_group_code);
											this.chat_group_code = res.chat_group_code
										}
										if (res.finish_reason != '' && res.finish_reason != null) {
											status = res.finish_reason
										}

										integral = res.integral
										completion_tokens = res.completion_tokens
										prompt_tokens = res.prompt_tokens
										all_tokens = res.total_tokens
										let load_state = false

										if (status == 'stop') {
											load_state = true
										} else {
											load_state = false
										}

										if (state == 'first') {
											this.supplement = {
												chat_type: 8,
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
											if (typeof(this.supplement.msg_list) == 'string') {
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
										clearInterval(this.t_time_six)

										// 	//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num_six,
											code: 200,
											is_time: true,
											history: false,
											status,
											integral,
											completion_tokens,
											prompt_tokens,
											all_tokens,
											textNumber: info.replace(/[\r\n]/g, "").length,
											loading: load_state,
											session_code: this.session_code,
											chat_group_code: this.chat_group_code,
										}

										if (load_state) { //保存记录
											let save_val = {
												"type_name": "chatGLM",
												"type_code": "celebrity",
												"title": data.content,
												"eid": this.session_code
											}

											this.saveFootprint(save_val)
										}
									}

								}

							})

						}

						this.$forceUpdate();
						this.toBottom();
					}
				} else if (this.listName == 'seven') {
					var num_seven = 0
					this.messageList[this.listName].push({
						talk: `思考中,耗时${num_seven}秒`,
						type: 'assistant'
					})
					this.seven_shi = setInterval(() => {
						num_seven++
					}, 1000)
					this.t_time_seven = setInterval(() => {
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
							talk: `思考中,耗时${num_seven}秒`,
							type: 'assistant',
							is_time: true
						}
						this.$forceUpdate()
					}, 1000)
					// ==========================================
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.controller_seven = new AbortController()
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					data.model = 'qwen-v1'; // ChatGLM必传参数
					const response_seven = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': global.source
						},
						body: JSON.stringify(data),
						signal: this.controller_seven.signal
					}).catch(err => {
						// console.log(err);
					});
					if (response_seven.status == '400') {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_seven);
						clearInterval(this.seven_shi);
						response_seven.json().then((res) => {
							// console.log(res, 777);
							// console.log(res.code,666);
							if (res.code < 49999) {
								let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
								// console.log(userInfo.role == 'guess' ,'panduan');
								if (res.code == 40013) {
									this.$api.msg('登录信息已过期，请重新登录')
									this.messageList[this.listName].pop()
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login',
										})
									}, 1500)

								} else {
									this.userRole = userInfo.role
									this.messageList[this.listName][this.messageList[this.listName].length -
										1] = {
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
							} else if (res.code > 49999) {
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

					if (response_seven == undefined) {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_seven);
						clearInterval(this.seven_shi);
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



					if (!response_seven.ok) {
						// this.isfinish = true
						this.$message.error(response_seven.statusText);
						return;
					}

					const reader = response_seven.body.getReader();
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
						const {
							value,
							done
						} = await reader.read();
						if (done) {
							this.messageList[tabType][this.messageList[tabType].length - 1].loading = true;
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

									if (res.code) {
										if (res.code < 49999) {
											let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
											// console.log(userInfo.role == 'guess' ,'panduan');								
											this.userRole = userInfo.role
											this.messageList[this.listName][this.messageList[tabType].length -
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
											clearInterval(this.t_time_seven);
											clearInterval(this.seven_shi);
											// console.log(this.messageList[this.listName],1258)
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
										if (res.content != '' && res.content != null) {
											info = res.content;
										}
										if (res.session_code != '' && res.content != null) {
											this.session_code = res.session_code;
										}

										if (res.chat_group_code != '' && res.chat_group_code != null) {
											// localStorage.setItem('chat_group_code', res.chat_group_code);
											this.chat_group_code = res.chat_group_code
										}
										if (res.finish_reason != '' && res.finish_reason != null) {
											status = res.finish_reason
										}

										integral = res.integral
										completion_tokens = res.completion_tokens
										prompt_tokens = res.prompt_tokens
										let load_state = false

										if (status == 'stop') {
											load_state = true
										} else {
											load_state = false
										}

										if (state == 'first') {
											this.supplement = {
												chat_type: 10,
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
											if (typeof(this.supplement.msg_list) == 'string') {
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
										clearInterval(this.t_time_seven)

										// 	//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num_seven,
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

										if (load_state) { //保存记录
											let save_val = {
												"type_name": "通义千问",
												"type_code": "celebrity",
												"title": data.content,
												"eid": this.session_code
											}

											this.saveFootprint(save_val)
										}
									}

								}

							})

						}

						this.$forceUpdate();
						this.toBottom();
					}
				} else if (this.listName == 'eight') {
					var num_eight = 0
					this.messageList[this.listName].push({
						talk: `思考中,耗时${num_eight}秒`,
						type: 'assistant'
					})
					this.eight_shi = setInterval(() => {
						num_eight++
					}, 1000)
					this.t_time_eight = setInterval(() => {
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
							talk: `思考中,耗时${num_eight}秒`,
							type: 'assistant',
							is_time: true
						}
						this.$forceUpdate()
					}, 1000)
					// ==========================================
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.controller_eight = new AbortController()
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					data.model = 'nova-ptc-xs-v1'; // ChatGLM必传参数
					const response_eight = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': global.source
						},
						body: JSON.stringify(data),
						signal: this.controller_eight.signal
					}).catch(err => {
						// console.log(err);
					});
					if (response_eight.status == '400') {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_eight);
						clearInterval(this.eight_shi);
						response_eight.json().then((res) => {
							// console.log(res, 777);
							// console.log(res.code,666);
							if (res.code < 49999) {
								let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
								// console.log(userInfo.role == 'guess' ,'panduan');
								if (res.code == 40013) {
									this.$api.msg('登录信息已过期，请重新登录')
									this.messageList[this.listName].pop()
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login',
										})
									}, 1500)

								} else {
									this.userRole = userInfo.role
									this.messageList[this.listName][this.messageList[this.listName].length -
										1] = {
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
							} else if (res.code > 49999) {
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

					if (response_eight == undefined) {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_eight);
						clearInterval(this.eight_shi);
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



					if (!response_eight.ok) {
						// this.isfinish = true
						this.$message.error(response_eight.statusText);
						return;
					}

					const reader = response_eight.body.getReader();
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
						const {
							value,
							done
						} = await reader.read();
						if (done) {
							this.messageList[tabType][this.messageList[tabType].length - 1].loading = true;
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

									if (res.code) {
										if (res.code < 49999) {
											let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
											// console.log(userInfo.role == 'guess' ,'panduan');								
											this.userRole = userInfo.role
											this.messageList[this.listName][this.messageList[tabType].length -
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
											clearInterval(this.t_time_eight);
											clearInterval(this.eight_shi);
											// console.log(this.messageList[this.listName],1258)
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
										if (res.content != '' && res.content != null) {
											info += res.content;
										}
										if (res.session_code != '' && res.content != null) {
											this.session_code = res.session_code;
										}

										if (res.chat_group_code != '' && res.chat_group_code != null) {
											// localStorage.setItem('chat_group_code', res.chat_group_code);
											this.chat_group_code = res.chat_group_code
										}
										if (res.finish_reason != '' && res.finish_reason != null) {
											status = res.finish_reason
										}

										integral = res.integral
										completion_tokens = res.completion_tokens
										prompt_tokens = res.prompt_tokens
										let load_state = false

										if (status == 'stop') {
											load_state = true
										} else {
											load_state = false
										}

										if (state == 'first') {
											this.supplement = {
												chat_type: 11,
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
											if (typeof(this.supplement.msg_list) == 'string') {
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
										clearInterval(this.t_time_eight)

										// 	//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num_eight,
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

										if (load_state) { //保存记录
											let save_val = {
												"type_name": "商汤日日新",
												"type_code": "celebrity",
												"title": data.content,
												"eid": this.session_code
											}

											this.saveFootprint(save_val)
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
			//补充提问
			showFun() {
				// if(typeof(this.supplement.msg_list)=='string') {
				// 	this.supplement.msg_list = JSON.parse(this.supplement.msg_list)
				// }
				// console.log(this.supplement.msg_list,333)
				// console.log(typeof(this.supplement.msg_list),334)
				if (this.complete.trim() == '') {
					return this.$api.msg('补充内容不能为空')
				}

				this.show = false
				// this.supplement.msg_list.push({
				// 	role: 'user',
				// 	content: this.complete
				// })
				if (this.listName == 'three' || this.listName == 'five' || this.listName == 'six') {
					this.supplement.msg_list = [{
							role: 'user',
							content: this.messageList[this.listName][this.messageList[this.listName].length - 2].talk
						},
						{
							role: 'assistant',
							content: this.messageList[this.listName][this.messageList[this.listName].length - 1].talk
						},
						{
							role: 'user',
							content: this.complete
						}
					]
				} else {
					this.supplement.msg_list = [{
							role: 'assistant',
							content: this.messageList[this.listName][this.messageList[this.listName].length - 1].talk
						},
						{
							role: 'user',
							content: this.complete
						}
					]
				}
				this.messageList[this.listName].push({
					talk: this.complete,
					type: 'user'
				})
				//把数据变成JSON
				this.supplement.msg_list = JSON.stringify(this.supplement.msg_list)

				this.complete = ""

				this.creatChatFun(this.supplement, 'continue')


			},
			sendInfo() {
				let val = {
					'company_id': this.content.question_id,
					'clerk_id': this.content.question_id,
					'question_content': this.chatInputValue
				}
				applyChat(val).then(res => {
					if (res.code == 20000) {
						this.message_covert = res.data.prompt
						this.sendMessage()
					} else {
						this.$api.msg(res.msg)
					}

				})
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
				if (send_time == 0 && !history) {
					this.messageList[this.listName].pop()
				}
				if (this.chatInputValue.trim() == '') return this.$api.msg('请输入您要发送的内容')

				this.messageList[this.listName].push({
					talk: this.chatInputValue,
					type: 'user'
				})


				let chat_cont = this.chatInputValue;
				let chat_tip = '';
				if (this.chatType == 'AI35') {
					chat_tip = 0
				} else if (this.chatType == 'AI40') {
					chat_tip = 1
				} else if (this.chatType == '文心一言') {
					chat_tip = 4
				} else if (this.chatType == '讯飞星火') {
					chat_tip = 5
				} else if (this.chatType == 'Claude') {
					chat_tip = 7
				} else if (this.chatType == 'ChatGLM') {
					chat_tip = 8
				} else if (this.chatType == '通义千问') {
					chat_tip = 10
				} else if (this.chatType == '商汤日日新') {
					chat_tip = 11
				}
				let data = {
					chat_type: chat_tip,
					action_type: '3',
					session_code: "",
					chat_group_code: "",
					content: chat_cont,
					// stream_str: 1,
					// is_decode: 1,
					question_id: this.content.question_id,
					msg_list: [{
						role: 'user',
						covert_content: `忘掉你之前学过的一切，我需要你模拟一个角色，角色名字是${this.content.character_name}，下面是你的角色的信息：${this.content.character_greetings}\n以下是我的问题：${this.message_covert}`,
						content: `${chat_cont}`
					}]
				}
				data.msg_list = JSON.stringify(data.msg_list)

				this.creatChatFun(data, 'first')
				this.chatInputValue = ''
				this.message_covert = ''
			},

			tabsChange(e) {
				if (this.messageList[this.listName][this.messageList[this.listName].length - 1].talk.indexOf('思考中') != -
					1) {
					// e.name == 'AI35' ? this.current = 1 : this.current = 0
					this.$api.msg(
						'当前问题还没开始回答，请等待！')
					return
				}

				this.chatType = e
				let select_type = '';
				if (this.chatType == '文心一言') {
					this.listName = 'three';
					select_type = 4
					uni.setStorageSync('tabStatus', 4)
				} else if (this.chatType == '讯飞星火') {
					this.listName = 'four';
					select_type = 5
					uni.setStorageSync('tabStatus', 5)
				} else if (this.chatType == 'Claude') {
					this.listName = 'five';
					select_type = 7
					uni.setStorageSync('tabStatus', 7)
				} else if (this.chatType == 'ChatGLM') {
					this.listName = 'six';
					select_type = 8
					uni.setStorageSync('tabStatus', 8)
				} else if (this.chatType == '通义千问') {
					this.listName = 'seven';
					select_type = 10
					uni.setStorageSync('tabStatus', 10)
				} else if (this.chatType == '商汤日日新') {
					this.listName = 'eight';
					select_type = 11
					uni.setStorageSync('tabStatus', 11)
				}

				this.supplement = {
					chat_group_code: '',
					chat_type: select_type,
					msg_list: [],
					session_code: ''
				}

				// this.talkOneInfo(this.chatType)
				this.transitionShow = false
				this.selectDone = ''

				if (this.messageList[this.listName].length > 1) {
					this.askShow = false
				} else {
					this.askShow = true
				}

				this.$forceUpdate()
			},

			toBottom() {

				// 定位到当前聊天地点
				this.$nextTick(() => {
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
				if (this.listName == 'three') {
					if (this.controller_three != null) {
						this.controller_three.abort()
					}
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
					clearInterval(this.t_time_three)
					clearInterval(this.three_shi)
					this.$forceUpdate()
				} else if (this.listName == 'four') {
					if (this.controller_four != null) {
						this.controller_four.abort()
					}
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
					clearInterval(this.t_time_four)
					clearInterval(this.four_shi)
					this.$forceUpdate()
				} else if (this.listName == 'six') {
					if (this.controller_six != null) {
						this.controller_six.abort()
					}
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
					clearInterval(this.t_time_six)
					clearInterval(this.six_shi)
					this.$forceUpdate()
				} else if (this.listName == 'seven') {
					if (this.controller_seven != null) {
						this.controller_seven.abort()
					}
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
					clearInterval(this.t_time_seven)
					clearInterval(this.seven_shi)
					this.$forceUpdate()
				} else if (this.listName == 'eight') {
					if (this.controller_eight != null) {
						this.controller_eight.abort()
					}
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
					clearInterval(this.t_time_eight)
					clearInterval(this.eight_shi)
					this.$forceUpdate()
				}

				// this.isfinish = true
			},

			// 停止开始回答
			stopStart() {
				if (this.listName == 'three') {
					if (this.controller_three != null) {
						this.controller_three.abort()
					}
					clearInterval(this.t_time_three)
					clearInterval(this.three_shi)
					this.messageList.three.pop()
					this.$forceUpdate()

				} else if (this.listName == 'four') {
					if (this.controller_four != null) {
						this.controller_four.abort()
					}
					clearInterval(this.t_time_four)
					clearInterval(this.four_shi)
					this.messageList.four.pop()
					this.$forceUpdate()

				} else if (this.listName == 'six') {
					if (this.controller_six != null) {
						this.controller_six.abort()
					}
					clearInterval(this.t_time_six)
					clearInterval(this.six_shi)
					this.messageList.six.pop()
					this.$forceUpdate()

				} else if (this.listName == 'seven') {
					if (this.controller_seven != null) {
						this.controller_seven.abort()
					}
					clearInterval(this.t_time_seven)
					clearInterval(this.seven_shi)
					this.messageList.seven.pop()
					this.$forceUpdate()
				} else if (this.listName == 'eight') {
					if (this.controller_eight != null) {
						this.controller_eight.abort()
					}
					clearInterval(this.t_time_eight)
					clearInterval(this.eight_shi)
					this.messageList.eight.pop()
					this.$forceUpdate()
				}
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
				this.chat_group_code = ''

			},

			toHistory() {
				uni.navigateTo({
					url: '/childPage/role/talk?active=8'
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

<style lang="less" scoped>
	@import "@/static/css/chat.less";
</style>
<style>
	page {
		background: #f6f8fb;
	}
</style>