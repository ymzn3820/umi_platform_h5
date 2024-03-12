<template>
	<view id="chat">
		<!-- <Title :title='"AI实验室"' /> -->
		<view
			style="width: 100%; background-color: #fff; display: flex; align-items: center; justify-content: space-between;">
			<u-tabs :list="tabList" lineWidth='60' lineHeight='3' lineColor='#1f64ff'
				:activeStyle='{color: "#1F64FF","font-size":"30rpx"}' @change='listChage' :current='tabIndex'
				:inactiveStyle='{"font-size":"30rpx"}'></u-tabs>
		</view>
		<view
			style="width: 100%; background-color: #fff; display: flex; align-items: center; justify-content: space-between;">
			<u-tabs :list="list" lineWidth='60' lineHeight='3' lineColor='#1f64ff'
				:activeStyle='{color: "#1F64FF","font-size":"30rpx"}' @change='tabsChange' :current='current'
				:inactiveStyle='{"font-size":"30rpx"}'></u-tabs>
		</view>

		<scroll-view ref="box" class="u-page" scroll-with-animation scroll-y="true" id="textadd"
			:style='{ height: msgListHeight}'>
			<view scroll-with-animation v-for="item,index in messageList[listName]" :key="index" class="listItem"
				:anchor="index">

				<u-row align="top" gutter="5">
					<u-col span="1.5" textAlign="center" align="top" justify="top">
						<image style="height: 38px;width: 38px; border-radius: 50%;"
							:src="item.type=='assistant'? gptImg :avatar" v-if="listName == 'one'">
						</image>
						<image style="height: 38px;width: 38px; border-radius: 50%;"
							:src="item.type=='assistant'? aiImg :avatar" v-if="listName == 'two'">
						</image>
						<image style="height: 38px;width: 38px; border-radius: 50%;"
							:src="item.type=='assistant'? claudeImg : avatar" v-if="listName == 'five'">
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
									<!-- <u-col span="5" v-if="index===messageList[listName].length-1">
										<u-button type='primary'
											:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","font-size":"14px"}'
											size="mini" color="rgba(31, 100, 255, 0.1)" @click="stopStart">
											停止回答
										</u-button>
									</u-col> -->
									<u-col span="4" v-if="index===messageList[listName].length-1"><u-button
											type='primary'
											:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
											size="mini" color="rgba(31, 100, 255, 0.1)" @click="stopStart">
											<image src="../../static/images/Remove_duotone.png"
												style="width: 40upx;height: 40upx;margin-right: 16upx;" />
											停止回答
										</u-button>
									</u-col>
								</span>

								<view class="tips" v-else-if="item.code==40022">
									<text style="font-size:17px; word-break:break-all;">{{item.talk}}</text>
									<view style="display: flex; justify-content: space-around;">
										<!-- <u-button type="error" color="#FF9B17" v-if="listName == 'one'"
											:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'48%'}"
											@click='goToVip'>升级会员</u-button> -->
										<u-button type="error" color="#1F64FF"
											:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'48%'}"
											@click='goToVip'>购买算力包</u-button>
									</view>
								</view>

								<view class="tips" v-else-if="item.code==40021">
									<text style="font-size:17px; word-break:break-all;">{{item.talk}}</text>
								</view>

								<view v-else>
									<view class="tips">

										<!-- <text style="font-size:32upx; word-break:break-all;" v-if="!item.loading">{{item.talk}}</text> -->
										<!-- <ua-markdown :source="item.talk" :showLine="false" v-if="item.loading" /> -->
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
													<image v-if="item.loading" src="../../static/images/time.png"
														mode="" width="16px" height="16px" style="vertical-align: top;">
													</image>
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
											<u-col span="1.5">
												<view @click="likeType(1,index,listName)"
													v-if="item.is_like == 0 || item.is_like == 2"><u-icon
														name="thumb-up" color="#999" size="24"></u-icon></view>
												<view @click="likeType(0,index,listName)" v-if="item.is_like == 1">
													<u-icon name="thumb-up-fill" color="#1f64ff" size="24"></u-icon>
												</view>
											</u-col>
											<u-col span="2">
												<view @click="likeType(2,index,listName)"
													v-if="item.is_like == 0 || item.is_like == 1"><u-icon
														name="thumb-down" color="#999" size="24"></u-icon></view>
												<view @click="likeType(0,index,listName)" v-if="item.is_like == 2">
													<u-icon name="thumb-down-fill" color="#1f64ff" size="24"></u-icon>
												</view>
											</u-col>
											<u-col span="1" @click="copyFun(item.talk)">
												<image src="../../static/images/balckCopy.png" mode=""></image>
											</u-col>
										</u-row>
										<view class="btn_tab">
											<text
												class="tab_left">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
										</view>

									</view>
									<u-row gutter="20" style="flex-wrap: wrap;width: 100%;">
										<u-col span="3" textAlign="left" v-if="item.status=='length'"> <u-button
												type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px"}'
												size="mini" color="rgba(31, 100, 255, 0.1)"
												@click="continueFun">继续</u-button></u-col>

										<!-- {{item.history}} -->
										<u-col span="4"
											v-if="index===messageList[listName].length-1 && item.loading"><u-button
												type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)"
												@click="show=true">优化本次回答</u-button></u-col>

										<u-col span="4"
											v-if="index===messageList[listName].length-1 && !item.history && !item.loading"><u-button
												type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)" @click="endController">
												<image src="../../static/images/Remove_duotone.png"
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
												<image src="../../static/images/ArrowsCounterClockwise.png"
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

								<view v-if="item.images.length > 0">
									<image :src="getImgUrl(item.images[0])" style="height: 500rpx; width: 500rpx"
										mode="aspectFit" @click="checkImg(item.images[0])"></image>
								</view>


								<image src="@/static/images/copy.png" mode="" @click="copyFun(item.talk)"></image>
							</view>
							<!-- <view @click="againQs(item.talk)" class="reset-question"
								v-if="messageList[listName][messageList[listName].length - 1].loading && !item.history">
								<image src="../../static/images/ChatCircleDots.png" mode=""
									style="margin-right: 16upx;width: 40upx;height: 40upx;margin: 8upx;"></image>
								<view>
									重新提问
								</view>
							</view> -->
							<u-col span="3"
								v-if="messageList[listName][messageList[listName].length - 1].loading && !item.history">
								<u-button type='primary'
									:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
									size="mini" color="rgba(31, 100, 255, 0.1)" @click="againQs(item.talk)">
									<image src="../../static/images/ChatCircleDots.png" mode=""
										style="margin-right: 16upx;width: 40upx;height: 40upx;margin: 8upx;"></image>
									</image>
									重新提问
								</u-button>
							</u-col>

						</view>
					</u-col>
				</u-row>
			</view>

			<view class="apply" v-if="askShow">
				<view class="apply_title" @click="getQuestionRecommend">
					<text class="title_l">您可以这样问</text>
					<image src="@/static/images/change.png" mode="" class="title_m" />
					<text class="title_r">换一批</text>
				</view>
				<view class="apply_cont">
					<view class="cont_li" v-for="(item, index) in billList" :key="index" @click="toAsk(item.content)">
						<text class="li_text">{{ item.content }}</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="bottomInput" ref="textInput" :style="{bottom:Height+'px'}">
			<view class="btn_link">
				<view class="link_l">
					<view class="l_chat" style="margin-right: 15rpx;" @click="addChat"
						v-if="messageList[listName].length > 2 && messageList[listName][messageList[listName].length - 1].loading">
						<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
						<text class="l_text">开启新会话</text>
					</view>
					<view class="l_chat" @click="toHistory">
						<u-icon name="clock" color="#1F64FF" size="16"></u-icon>
						<text class="l_text">历史会话</text>
					</view>
				</view>
				<!-- <view class="link_l">
					<view class="l_chat" @click="takePhoto">
						<u-icon name="camera" color="#1F64FF" size="20"></u-icon>
						<text class="l_text">AI识别</text>
					</view>
				</view> -->
			</view>

			<u-row align='bottom' gutter="5">
				<u-col span="9.5">
					<view class="chat_input">
						<u-textarea v-model="chatInputValue" placeholder="在此输入您想了解的内容" @confirm="sendMessage" autoHeight
							:showConfirmBar='false' :adjustPosition='false' @focus='inputFocus' @blur='inputBlur'
							maxlength='-1' :disableDefaultPadding='true' @keyboardheightchange='keyboardheightchange'
							border='none' :focus="false">
						</u-textarea>
						<view v-if="imgList.length > 0">
							<view class="input_right" v-for="(val, index) in imgList" :key="index">
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
		<u-modal :show="show" @cancel="show = false" confirmText="确定" confirmColor="#1F64FF;" :showCancelButton='true'
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
		<u-popup :show="transitionShow" mode="bottom" :round="10" :closeOnClickOverlay="false"
			@close="transitionShow=false">
			<view class="pop_cont">
				<view class="cont_top">
					<view class="top_l">是否关联上下文</view>
					<!-- <image class="close_img" src="@/static/user/close.png" @click="transitionShow=false" /> -->
				</view>
				<view class="cont_mid" @click="radioChange(false)">
					<view class="mid_l">是</view>
					<!-- <image class="mid_img" src="@/static/user/done.png" v-if="selectDone == '有'" /> -->
				</view>
				<view class="cont_mid" @click="radioChange(true)">
					<view class="mid_l">否</view>
					<!-- <image class="mid_img" src="@/static/user/done.png" v-if="selectDone == '没有'" /> -->
				</view>

				<!-- <view class="cont_btn">
					<view class="btn_sub" @click="radioChange(selectDone=='没有'?true:false)">确定</view>
				</view> -->
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		creatChat,
		chat_likes,
		chat_session,
		xfChat
	} from "@/apis/chat.js"
	import {
		getQuestionRecommend
	} from "@/apis/user.js"
	// import Title from "@/childPage/components/title.vue"
	import * as TextEncoding from 'text-encoding-shim';
	import uaMarkdown from '../../components/ua2-markdown/ua-markdown.vue'

	export default {
		data() {
			return {
				src: '',
				scrollHeight: 0,
				selectDone: "",
				Height: 0,
				scrollTop: 593,
				key: 0,
				checkboxValue1: [],
				upDownText: false,
				show: false,
				transitionShow: false,
				complete: "",

				radioValue: true,
				list: [{
					name: 'AI35'
				}, {
					name: 'AI40'
				}, {
					name: 'Claude'
				}, ],
				chatInputValue: "",
				chatType: 'AI35',
				loading: true,
				session_code: "",
				chat_group_code: "",
				supplement: {
					msg_list: []
				},

				current: 0,
				listName: 'one',
				avatar: "",
				isBtn: false,
				msgListHeight: 0,
				//40
				stop_two: false,
				two_shi: 0,
				two_time: 0,
				requestTask_two: '',
				// 35
				stop_one: false,
				one_shi: 0,
				one_time: 0,
				requestTask: '',

				//Claude
				stop_five: false,
				five_shi: 0,
				five_time: 0,
				requestTask_five: '',

				platform: '',
				noticeList: [],

				userRole: "",
				askShow: true,
				billList: [],
				imgList: [],
				messageList: {
					'one': [{
						talk: `<span style="font-size: 17px">我是领先的AI35大语言AI模型，现在为您服务！</span>`,
						type: 'assistant'
					}],
					'two': [{
						talk: `<span style="font-size: 17px">我是前沿的AI40大语言AI模型，为您提供专业便捷的启智服务！</span>`,
						type: 'assistant'
					}],

					'five': [{
						talk: `<span style="font-size: 17px">我是Claude大型语言模型</span>`,
						type: 'assistant'
					}]
				},

				wxImg: global.baseImg + '/xcx/45cbd4e5-474e-4782-a31e-1efd2a48d664.jpg',
				xfImg: global.baseImg + '/xcx/19e4def0-7866-4c1b-82f6-a78a5d591b17.jpg',
				claudeImg: global.baseImg + '/xcx/22a0d319-6aa3-425a-94bb-5c57884db842.jpg',
				glmImg: global.baseImg + '/xcx/9b91253a-59c2-4ab8-9e38-af7c6464823c.jpg',
				gptImg: global.baseImg + '/xcx/8d2bd289-ff24-4f3c-b6d2-a4cbbd7ca737.jpg',
				aiImg: global.baseImg + '/xcx/6ddf8a53-52d1-40ec-9430-ec92a2f429f0.jpg',
				waitImg: global.baseImg + '/xcx/c4a8054e-50bd-4790-a3cb-ec585412daa7.jpg',

				tabList: [{
						name: 'AI对话'
					},
					{
						name: 'AI绘画'
					},
				],
				tabIndex: 0
			}
		},
		components: {
			// Title,
			uaMarkdown
		},
		onLoad() {
			// 获取屏幕高度
			uni.getSystemInfo({
				success: res => {
					this.screenHeight = res.windowHeight
					// 100为底部输入栏高度，单位rpx，需要先转成px
					this.msgListHeight = this.screenHeight - uni.upx2px(100)

				}
			})
		},
		watch: {

		},
		onShow() {
			let one_code = this.messageList.one[this.messageList.one.length - 1].code;
			let two_code = this.messageList.two[this.messageList.two.length - 1].code;
			let five_code = this.messageList.five[this.messageList.five.length - 1].code;

			if (one_code == 40022) { // 去除登录或升级vip提示
				this.messageList.one.pop()
			}

			if (two_code == 40022) { // 去除登录或升级vip提示
				this.messageList.two.pop()
			}

			if (five_code == 40022) { // 去除登录或升级vip提示
				this.messageList.five.pop()
			}

			this.getQuestionRecommend() // 获取问题集

			let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			// console.log(userInfo,548)
			let avatarUrl = global.baseImg + '/' + uni.getStorageSync("avatarUrl");
			this.avatar = avatarUrl;

			this.chatInputValue = uni.getStorageSync('talkInfo')
			// uni.getStorageSync('tabStatus') == '' ? (this.chatType = 'AI35') : (this.chatType = uni.getStorageSync(
			// 	'tabStatus'))

			// 获取相机信息
			if (uni.getStorageSync('cameraInfo') != '') {
				let sendInfo = uni.getStorageSync('cameraInfo')
				this.chatInputValue = sendInfo.chatValue
				this.imgList = sendInfo.imgList
				// console.log(sendInfo,415866666)
				uni.setStorageSync('cameraInfo', '')
			}

			if (uni.getStorageSync('tabStatus') == 0) {
				this.chatType = 'AI35'
				this.listName = 'one'
				this.current = 0
			} else if (uni.getStorageSync('tabStatus') == 1) {
				this.chatType = 'AI40'
				this.listName = 'two'
				this.current = 1
			} else if (uni.getStorageSync('tabStatus') == 7) {
				this.chatType = 'Claude'
				this.listName = 'five'
				this.current = 2
			} else {
				this.chatType = 'AI35'
				this.listName = 'one'
				this.current = 0
			}

			// this.tabIndex = 0;
			console.log(this.tabIndex, 888)
			// console.log(this.chatType, 'this.chatTypesdadada');

			// console.log('加载', uni.getStorageSync('history_code'));
			if (uni.getStorageSync('history_code') != '') {
				this.historySession(uni.getStorageSync('history_code'))
			}

			if (this.chatInputValue.trim() != '' && this.imgList.length == 0) { // 应用助理直接回答
				this.session_code = '';
				this.chat_group_code = '';
				let chat_tip = 0;
				if (this.listName == 'one') {
					chat_tip = 0
				} else if (this.listName == 'two') {
					chat_tip = 1
				} else if (this.listName == 'five') {
					chat_tip = 7
				}
				// console.log(chat_tip,7854)
				this.supplement = {
					chat_group_code: '',
					chat_type: chat_tip,
					msg_list: [],
					session_code: ''
				}
				this.transitionShow = false
				if (this.listName == 'one') {
					this.messageList[this.listName] = [{
						talk: `<span style="font-size: 17px">
								我是领先的AI35大语言AI模型，现在为您服务！</span>`,
						type: 'assistant'
					}]
				} else if (this.listName == 'two') {
					this.messageList[this.listName] = [{
						talk: `<span style="font-size: 17px">
								我是前沿的AI40大语言AI模型，为您提供专业便捷的启智服务！</span>`,
						type: 'assistant'
					}]
				} else if (this.listName == 'five') {
					this.messageList[this.listName] = [{
						talk: `<span style="font-size: 17px">
								我是Claude 大型语言模型</span>`,
						type: 'assistant'
					}]
				}

				this.sendMessage(this.chatInputValue)
			}

			if (userInfo.role == 'guess') {
				this.messageList.one[0] = {
					talk: `<span style="font-size: 17px">我是领先的AI35大语言AI模型，现在为您服务！</span>`,
					type: 'assistant'
				}
				this.messageList.two[0] = {
					talk: `<span style="font-size: 17px">我是前沿的AI40大语言AI模型，为您提供专业便捷的启智服务！</span>`,
					type: 'assistant'
				}

				this.messageList.five[0] = {
					talk: `<span style="font-size: 17px">我是Claude大型语言模型</span>`,
					type: 'assistant'
				}

			} else {
				this.messageList.one[0] = {
					talk: `<span style="font-size: 17px">我是领先的AI35大语言AI模型，现在为您服务！</span>`,
					type: 'assistant'
				}
				this.messageList.two[0] = {
					talk: `<span style="font-size: 17px">我是前沿的AI40大语言AI模型，为您提供专业便捷的启智服务！</span>`,
					type: 'assistant'
				}

				this.messageList.five[0] = {
					talk: `<span style="font-size: 17px">我是Claude大型语言模型</span>`,
					type: 'assistant'
				}
			}

			if (this.messageList[this.listName].length > 1) {
				this.askShow = false
			} else {
				this.askShow = true
			}
			this.Height = 0;
			this.$forceUpdate()
			// let userInfo = JSON.parse(uni.getStorageSync('userInfo'));

		},
		onHide() {
			this.radioValue = true

			// this.Height = 0;
			//          console.log(this.Height,885);
			// uni.hideTabBar({
			// 	// animation: true
			// })
		},
		methods: {

			// 获取问题集
			getQuestionRecommend() {
				this.billList = []
				getQuestionRecommend().then(res => {
					if (res.code == 20000) {
						this.billList = this.billList.concat(res.data[0]);
						this.billList = this.billList.concat(res.data[1]);
						// console.log(this.billList,778)
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},

			keyboardheightchange(e) {
				// console.log(e, '键盘高度变化');
				if (e.detail.height == 0) {

					// console.log(e);
					// uni.showTabBar({
					// 	// animation: true
					// })
					this.Height = 0
					this.isBtn = false
				} else {
					this.isBtn = true
				}
				// this.toBottom()
			},

			inputFocus(e) {

				// console.log(e, "eeeeeeeeee7");
				// console.log(this.isBtn,995)
				if (this.isBtn) {
					// uni.hideTabBar({
					// 	// animation: true
					// })
					this.$nextTick(() => {
						this.Height = e.detail.height
						this.toBottom()
					})
				} else {
					this.Height = 0
				}



			},
			goToLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			inputBlur(e) {
				// uni.showTabBar({
				// 	// animation: true
				// })
				this.$nextTick(() => {
					this.Height = 0
				})
				uni.setStorageSync('talkInfo', '')

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
			historySession(session) {

				// console.log(session);
				let send_talk = this.messageList[this.listName][this.messageList[this.listName].length - 1].talk;
				let send_loading = this.messageList[this.listName][this.messageList[this.listName].length - 1].loading;
				let send_time = this.messageList[this.listName][this.messageList[this.listName].length - 1].time;

				// console.log(this.messageList[this.listName][this.messageList[this.listName].length - 1].time, 888);
				if (send_talk.indexOf('思考中') != -1 && send_time > 0) {

					this.$api.msg('当前问题还没回答完毕，请稍后再查看！')
					return
				}

				if (send_loading == false && send_time > 0) {

					this.$api.msg('当前问题还没回答完毕，请稍后再查看！')
					return
				}
				let data = JSON.parse(session)
				let chat_tip = ''; // 对话类型
				// console.log(data.tpye, 995)
				if (data.tpye == 0) {
					this.listName = 'one';
					this.current = 0;
					chat_tip = 0;
				} else if (data.tpye == 1) {
					this.listName = 'two';
					this.current = 1;
					chat_tip = 1;
				} else if (data.tpye == 7) {
					this.listName = 'five';
					this.current = 2;
					chat_tip = 7;
				}
				// console.log(data.tpye, 'typetype');
				this.messageList[this.listName].splice(1, this.messageList[this.listName].length - 1)

				console.log('this.current', this.current, '改变状态');
				this.$forceUpdate()

				// let chat_group_code = ''
				// let session_code = ''
				chat_session(data.code).then(res => {
					//初始化信息
					this.supplement = {
						chat_type: chat_tip,
						// action_type: 3,
						// session_code: this.session_code,
						// chat_group_code: this.chat_group_code,
						// stream_str: 1,
						// is_decode: 1,
						msg_list: []
					}
				
					res.data.map((item, tip) => {
						this.supplement.session_code = item.session_code
						this.supplement.chat_group_code = item.chat_group_code
						// if (item.content.indexOf(
						// 		'(回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字)') !=
						// 	-1) {
						// 	item.content = item.content.replace(
						// 		'(回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字)',
						// 		'')
						// }
						if (item.images == null) {
							item.images = []
						}
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
							all_tokens: item.total_tokens,
							textNumber: item.content.replace(/[\r\n]/g, "").length,
							history: true,
							session_code: item.session_code,
							chat_group_code: item.chat_group_code,
							images: item.images,
							is_like: item.is_likes
						})
						this.supplement.msg_list.push({
							role: item.role,
							content: item.content
						})
				
						this.askShow = false;
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
				this.radioValue = false;
				this.selectDone = '有';
				// this.transitionShow = false;
				this.sendMessage(this.chatInputValue)
			},

			// 停止回答
			stopChat() {

				if (this.listName == 'one') {
					this.stop_one = true
					this.requestTask.abort();
					clearInterval(this.one_shi)
					clearInterval(this.one_time)
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
				} else if (this.listName == 'two') {
					this.stop_two = true
					this.requestTask_two.abort();
					clearInterval(this.two_shi)
					clearInterval(this.two_time)
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
					console.log(this.messageList[this.listName][this.messageList[this.listName].length - 1], 999)
				} else if (this.listName == 'five') {
					this.stop_five = true
					this.requestTask_five.abort();
					clearInterval(this.five_shi)
					clearInterval(this.five_time)
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
				}
				this.$forceUpdate()
			},

			// 停止开始回答
			stopStart() {
				if (this.listName == 'one') {
					this.stop_one = true
					this.requestTask.abort();
					clearInterval(this.one_shi)
					clearInterval(this.one_time)
					this.messageList.one.pop()
				} else if (this.listName == 'two') {
					this.stop_two = true
					this.requestTask_two.abort();
					clearInterval(this.two_shi)
					clearInterval(this.two_time)
					this.messageList.two.pop()
				} else if (this.listName == 'five') {
					this.stop_five = true
					this.requestTask_five.abort();
					clearInterval(this.five_shi)
					clearInterval(this.five_time)
					this.messageList.five.pop()
				}
				this.$forceUpdate()
			},

			// 开启新会话 
			addChat() {
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

			radioChange(e) {

				if (e) {
					this.upDownText = false
					this.selectDone = true
					this.messageList[this.listName].splice(1, this.messageList[this.listName].length - 1)
					this.sendMessage(this.chatInputValue)
				} else {
					let arr = []
					this.messageList[this.listName].map((item, index) => {
						if (index > 0) {
							arr.push({
								role: item.type,
								content: item.talk,
								images: item.images
							})
						}

					})
					this.supplement.msg_list = arr
					this.supplement.chat_group_code = ''
					this.upDownText = true
					this.selectDone = true
					this.sendMessage(this.chatInputValue)
				}
				this.transitionShow = false
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

			//信息回调方法
			async creatChatFun(data, state) {
				if (this.listName == 'one') {
					let num = 0
					this.messageList[this.listName].push({
						talk: `思考中,耗时${num}秒`,
						type: 'assistant'
					})
					this.one_shi = setInterval(() => {
						num++
					}, 1000)
					this.one_time = setInterval(() => {
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
							talk: `思考中,耗时${num}秒`,
							type: 'assistant',
							is_time: true
						}
						this.$forceUpdate()
					}, 1000)
					// ==========================================
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.requestTask = new AbortController()
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					const response_one = await fetch(global.baseUrl + '/api/chat/async_chat_session', {
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': global.source
						},
						body: JSON.stringify(data),
						signal: this.requestTask.signal
					}).catch(err => {
						// console.log(err);
					});
					if (response_one.status == '400') {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.one_time);
						clearInterval(this.one_shi);
						response_one.json().then((res) => {
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
					
					if (response_one == undefined) {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.one_time);
						clearInterval(this.one_shi);
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
					
					
					
					if (!response_one.ok) {
						// this.isfinish = true
						this.$message.error(response_one.statusText);
						return;
					}
					
					const reader = response_one.body.getReader();
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
											clearInterval(this.one_time);
											clearInterval(this.one_shi);
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
												chat_type: 0,
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
										clearInterval(this.one_time)
					
										// 	//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num,
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
											is_like: 0
										}
					
									}
					
								}
					
							})
					
						}
					
						this.$forceUpdate();
						this.toBottom();
					}

				} else if (this.listName == 'two') {
					let num_two = 0
					this.messageList[this.listName].push({
						talk: `思考中,耗时${num_two}秒`,
						type: 'assistant'
					})
					this.two_shi = setInterval(() => {
						num_two++
					}, 1000)
					this.two_time = setInterval(() => {
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
							talk: `思考中,耗时${num_two}秒`,
							type: 'assistant',
							is_time: true
						}
						this.$forceUpdate()
					}, 1000)
					// ==========================================
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.requestTask_two = new AbortController()
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					const response_two = await fetch(global.baseUrl + '/api/chat/async_chat_session', {
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': global.source
						},
						body: JSON.stringify(data),
						signal: this.requestTask_two.signal
					}).catch(err => {
						// console.log(err);
					});
					if (response_two.status == '400') {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.two_time);
						clearInterval(this.two_shi);
						response_two.json().then((res) => {
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
					
					if (response_two == undefined) {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.two_time);
						clearInterval(this.two_shi);
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
					
					
					
					if (!response_two.ok) {
						// this.isfinish = true
						this.$message.error(response_two.statusText);
						return;
					}
					
					const reader = response_two.body.getReader();
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
											clearInterval(this.two_time);
											clearInterval(this.two_shi);
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
												chat_type: 0,
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
										clearInterval(this.two_time)
					
										// 	//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num_two,
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
											is_like: 0
										}
					
									}
					
								}
					
							})
					
						}
					
						this.$forceUpdate();
						this.toBottom();
					}
				} else if (this.listName == 'five') {
					let num_five = 0
					this.messageList[this.listName].push({
						talk: `思考中,耗时${num_five}秒`,
						type: 'assistant'
					})
					this.five_shi = setInterval(() => {
						num_five++
					}, 1000)
					this.five_time = setInterval(() => {
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
							talk: `思考中,耗时${num_five}秒`,
							type: 'assistant',
							is_time: true
						}
						this.$forceUpdate()
					}, 1000)
					// ==========================================
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.requestTask_five = new AbortController()
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					const response_five = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': global.source
						},
						body: JSON.stringify(data),
						signal: this.requestTask_five.signal
					}).catch(err => {
						// console.log(err);
					});
					if (response_five.status == '400') {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.five_time);
						clearInterval(this.five_shi);
						response_five.json().then((res) => {
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
					
					if (response_five == undefined) {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.five_time);
						clearInterval(this.five_shi);
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
					
					
					
					if (!response_five.ok) {
						// this.isfinish = true
						this.$message.error(response_five.statusText);
						return;
					}
					
					const reader = response_five.body.getReader();
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
											clearInterval(this.five_time);
											clearInterval(this.five_shi);
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
												chat_type: 0,
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
										clearInterval(this.five_time)
					
										// 	//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num_five,
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
											is_like: 0
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
			async showFun() {
				if (this.complete.trim() == '') {
					this.$api.msg('补充内容不能为空')
					return false;
				}
				// this.supplement.msg_list.push({
				// 	role: 'user',
				// 	content: this.complete
				// })
				if (this.listName == 'three' || this.listName == 'five' || this.listName == 'six') {
					this.supplement.msg_list = [{
							role: 'user',
							content: this.messageList[this.listName][this.messageList[this.listName].length - 2]
								.talk,
							images: this.messageList[this.listName][this.messageList[this.listName].length - 2]
								.images
						},
						{
							role: 'assistant',
							content: this.messageList[this.listName][this.messageList[this.listName].length - 1]
								.talk
						},
						{
							role: 'user',
							content: this.complete
						}
					]
				} else {
					this.supplement.msg_list = [{
							role: 'assistant',
							content: this.messageList[this.listName][this.messageList[this.listName].length - 1]
								.talk
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
				this.show = false


				this.complete = ""

				await this.creatChatFun(this.supplement, 'continue')
				this.$forceUpdate()

			},
			async sendMessage(message) {
				let send_talk = this.messageList[this.listName][this.messageList[this.listName].length - 1].talk;
				let send_loading = this.messageList[this.listName][this.messageList[this.listName].length - 1].loading;
				let send_time = this.messageList[this.listName][this.messageList[this.listName].length - 1].time;
				let history = this.messageList[this.listName][this.messageList[this.listName].length - 1].history;

				// console.log(this.messageList[this.listName][this.messageList[this.listName].length - 1], 8871);
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

				// if(message.length)
				switch (this.chatType) {
					case 'AI35':
						if (this.chatInputValue.length > 900) return this.$api.msg('文字不得超过900字')
						break;
					case 'AI40':
						if (this.chatInputValue.length > 2000) return this.$api.msg('文字不得超过2000字')
						break;
				}

				this.askShow = false; // 隐藏热搜提问


				//判断是否是第一条提问

				// console.log(this.selectDone, 'this.messageList[this.listName].length');
				this.stop_one = false; // 重置手动停止按钮
				this.stop_two = false; // 重置手动停止按钮
				this.stop_five = false; // 重置手动停止按钮

				if (this.messageList[this.listName].length > 2 && !this.selectDone) {
					console.log('关联上下文')
					this.transitionShow = true //询问是否关联上下文
					return
				}

				uni.setStorageSync('talkInfo', '')

				let img_url = ''
				if (this.imgList.length > 0) {
					img_url = this.imgList
				} else {
					img_url = ''
				}
				this.messageList[this.listName].push({
					talk: this.chatInputValue,
					type: 'user',
					images: img_url
				})

				// const hide_cont = '(回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字)';
				let chat_cont = this.chatInputValue
				let chat_tip = '';
				if (this.chatType == 'AI35') {
					chat_tip = 0
				} else if (this.chatType == 'AI40') {
					chat_tip = 1
				} else if (this.chatType == 'Claude') {
					chat_tip = 7
				}
				let data = {
					chat_type: chat_tip,
					action_type: '3',
					session_code: this.session_code,
					chat_group_code: "",
					content: chat_cont,
					// stream_str: 1,
					// is_decode: 1,
					msg_list: [{
						role: 'user',
						// covert_content: `回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字\n以下是我的问题：`, 
						convert_content: '',
						content: chat_cont
					}]
				}
				if (this.imgList.length > 0) {
					data.msg_list[0].images = this.imgList
				}
				data.msg_list = JSON.stringify(data.msg_list)
				// console.log(data.msg_list,4725)

				uni.setStorageSync('hideItme', '');

				if (this.upDownText) {
					this.supplement.msg_list.push({
						role: 'user',
						content: this.chatInputValue,
						images: this.imgList
					})
					this.supplement.msg_list = JSON.stringify(this.supplement.msg_list)
					this.radioValue = true
					this.upDownText = false
					this.chatInputValue = ''
					await this.creatChatFun(this.supplement, 'continue')
				} else {
					this.chatInputValue = ''
					await this.creatChatFun(data, 'first')
				}


				this.selectDone = false
				this.chatInputValue = ''
				this.imgList = []

			},

			tabsChange(e) {
				// if (this.messageList[this.listName][this.messageList[this.listName].length - 1].talk.indexOf('思考中') != -
				// 	1) {
				// 	// e.name == 'AI35' ? this.current = 1 : this.current = 0
				// 	this.$api.msg(
				// 		'当前问题还没回答完毕，请等待！')
				// 	return
				// }

				console.log(e.name, 'gaib');
				this.radioValue = true
				this.chatType = e.name
				let chat_num = 0
				if (this.chatType == 'AI35') {
					this.listName = 'one';
					this.current = 0
					chat_num = 0
					uni.setStorageSync('tabStatus', 0)

				} else if (this.chatType == 'AI40') {
					this.listName = 'two';
					this.current = 1
					chat_num = 1
					uni.setStorageSync('tabStatus', 1)
				} else if (this.chatType == 'Claude') {
					this.listName = 'five';
					this.current = 2
					chat_num = 7
					uni.setStorageSync('tabStatus', 7)
				}

				this.supplement = {
					chat_group_code: '',
					chat_type: chat_num,
					msg_list: [],
					session_code: ''
				}
				// this.listName = e.name == 'AI35' ? 'one' : 'two'
				// e.name == 'AI35' ? this.current = 0 : this.current = 1
				// this.talkOneInfo(this.chatType)
				// console.log(this.messageList['one'], 'this.messageList[this.listName]', this.messageList['two']);
				this.transitionShow = false
				this.selectDone = ''

				// console.log(e.name,'名称');
				if (this.messageList[this.listName].length > 1) {
					this.askShow = false
				} else {
					this.askShow = true
				}
				this.toBottom()
				this.$forceUpdate()
			},

			toHistory() {
				uni.navigateTo({
					url: '/childPage/laboratory/lab_history?active=0'
				})
			},

			// 前往提问
			toAsk(val) {
				this.chatInputValue = val;
				// this.askShow = false;
			},

			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},

			// 图片预览
			checkImg(url) {
				let img_url = global.baseImg + '/' + url
				uni.previewImage({
					urls: [img_url],
					current: 0
				})
			},
			// 上传图片
			takePhoto() {
				uni.setStorageSync('tabStatus', this.listName)
				uni.navigateTo({
					url: '/pages/chat/camera?chatValue=' + this.chatInputValue
				})
			},

			listChage(e) {
				// console.log(e.name)
				if (e.name == "AI对话") {
					this.tabIndex = 0
					uni.navigateTo({
						url: '/childPage/laboratory/laboratory'
					})
				} else {
					this.tabIndex = 1
					uni.navigateTo({
						url: '/childPage/laboratory/labDraw'
					})
				}
			},

			// 点赞点踩
			likeType(val, index, tip) {

				let data = {
					is_likes: val,
					session_code: this.session_code,
					chat_group_code: this.chat_group_code
				}
				this.messageList[tip][index].is_like = val
				this.$forceUpdate()

				chat_likes(data).then(res => {
					// uni.showToast({ //提示
					// 	title: '评价成功'
					// })
				})

			},
			decodeHexString(hexString) {
				let hex = hexString.trim();
				let result = "";
				for (let i = 0; i < hex.length / 2; i++) {
					let code = parseInt(hex.substr(i * 2, 2), 16);
					result += String.fromCharCode(code);
				}
				return result;
			}

		}
	}
</script>

<style lang="less" scoped>
	@import "@/static/css/chat.less";
    page {
		background: #f6f8fb;
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

		// padding: 10upx;
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