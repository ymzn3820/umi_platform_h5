<template>
	<view id="chat">
		<scroll-view ref="box" class="u-page" scroll-with-animation scroll-y="true" id="textadd"
			:style='{ height: msgListHeight}'>
			<view>
				<view class="headCard">
					<view class="head_chat" :style="backImg">
						<view class="head">
							<image :src="log" class="head_img"></image>
							<view class="head_content">Hi，我是您的专属无忧秘书-小秘</view>
						</view>
						<view class="head_tip">基于先进的AI语言大模型，为您提供全方位的支持与服务</view>
						<view style="display: flex;margin-top: 8rpx;align-items: center;">
							<view class="head_price">(免费)</view>
							<view style="display: flex;margin-left: 32rpx;align-items: center;" @click="goShare">
								<image :src="share" style="width: 28rpx;height: 28rpx;"></image>
								<view style="color: #1F64FF;font-size: 24rpx;margin-left: 5rpx;font-weight: 600;">
									分享好友赚算力</view>
							</view>
						</view>
					</view>

					<!-- <view class="head_grid" v-if="isShow">
						<view class="grid_item" @click="toAsk(billList[0].content)">
							<text class="item_li">{{ billList[0].content }}</text>
							<u-icon name="arrow-right" color="#424242" size="12"></u-icon>
						</view>
						<view class="grid_item" @click="toAsk(billList[1].content)">
							<text class="item_li">{{ billList[1].content }}</text>
							<u-icon name="arrow-right" color="#424242" size="12"></u-icon>
						</view>
						<view class="grid_item" @click="isQs = true">
							<text class="item_li_l">尝试更多功能</text>
							<u-icon name="arrow-right" color="#424242" size="12"></u-icon>
						</view>
						<view class="grid_item" @click="toMore">
							<text class="item_li_l">更多能力</text>
							<u-icon name="arrow-right" color="#424242" size="12"></u-icon>
						</view>
					</view> -->
				</view>
				<view class="notice" v-if="noticeList.length > 0">
					<u-notice-bar :text="noticeList" color="#1E211F" bgColor="#EBF1FF" mode="closable"
						direction="column" @click="toNotice"></u-notice-bar>
				</view>
				<view class="headCard" style="margin-top: 20upx; margin-bottom: 50upx; padding: 20upx; width: 100%;"
					v-if="isQs">
					<view class="head_title">
						<view class="title_l">您可以这样问</view>
						<view class="title_r" @click="getQuestionRecommend">
							<image src="@/static/images/change.png" mode="" class="r_img" />
							<text class="r_text">换一批</text>
						</view>
					</view>

					<view class="grid_items" v-for="(item, index) in billList" :key="index" @click="toAsk(item.content)"
						v-if="index > 1">
						<text class="item_li">{{ item.content }}</text>
						<u-icon name="arrow-right" color="#424242" size="12"></u-icon>
					</view>
				</view>
				<view class="head_grid_two" v-if="isQs">
					<view class="title">
						<view class="title_l">
							体验更多能力
						</view>
						<view class="title_r" @click="getAbility">
							<image src="@/static/images/change.png"></image>
							<text class="r_txt">换一换</text>
						</view>
					</view>
					<view class="grid_item_two" v-for="item,index in abilityList" @click="toAbility(item.num)">
						<text class="item_li_two">{{ item.content }}</text>
						<u-icon name="arrow-right" color="#424242" size="12"></u-icon>
					</view>
				</view>
			</view>
			<view scroll-with-animation v-for="item,index in messageList" :key="index" class="listItem" :anchor="index">

				<u-row align="top" gutter="5">
					<u-col span="1.5" textAlign="center" align="top" justify="top">
						<image style="height: 38px;width: 38px; border-radius: 50%;"
							:src="item.type=='assistant'? log :avatar">
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

									<u-col span="4" v-if="index===messageList.length-1"><u-button type='primary'
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
										<u-row class='edit' v-if="item.loading">
											<u-col span="6" align="left" style="font-size: 14px;">
												上行:{{item.prompt_tokens}} token
											</u-col>
											<u-col span="6" align="left" style="font-size: 14px;">
												下行:{{item.completion_tokens}} token
											</u-col>
										</u-row>
										<!-- <u-row class='edit' v-if="item.loading">
											<u-col span="6" align="left" style="font-size: 14px;">
												消耗:{{item.all_tokens}} token
											</u-col>

										</u-row> -->
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
												<view @click="likeType(1,index)"
													v-if="item.is_like == 0 || item.is_like == 2"><u-icon
														name="thumb-up" color="#999" size="24"></u-icon></view>
												<view @click="likeType(0,index)" v-if="item.is_like == 1">
													<u-icon name="thumb-up-fill" color="#1f64ff" size="24"></u-icon>
												</view>
											</u-col>
											<u-col span="2">
												<view @click="likeType(2,index)"
													v-if="item.is_like == 0 || item.is_like == 1"><u-icon
														name="thumb-down" color="#999" size="24"></u-icon></view>
												<view @click="likeType(0,index)" v-if="item.is_like == 2">
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
										<u-col span="3" v-if="index===messageList.length-1 && item.loading"><u-button
												type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)"
												@click="show=true">优化回答</u-button></u-col>

										<u-col span="4"
											v-if="index===messageList.length-1 && !item.history && !item.loading"><u-button
												type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)" @click="endController">
												<!-- <image src="../../static/images/Remove_duotone.png"
													style="width: 40upx;height: 40upx;margin-right: 16upx;" /> -->
												停止回答
											</u-button>
										</u-col>

										<!-- <u-col span="3"
											v-if="index===messageList.length-1 && !item.history && item.loading && chat_li == 1">
											<u-button type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)"
												@click="againQs(messageList[messageList.length - 2].talk, 4)">
												
												</image>
												重试
											</u-button>
										</u-col> -->

										<!-- <u-col span="3"
											v-if="index===messageList.length-1 && !item.history && item.loading && chat_li == 2">
											<u-button type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)"
												@click="againQs(messageList[messageList.length - 2].talk, 5)">
												
												重试
											</u-button>
										</u-col> -->

										<!-- <u-col span="3"
											v-if="index===messageList.length-1 && !item.history && item.loading && chat_li == 3">
											<u-button type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)"
												@click="againQs(messageList[messageList.length - 2].talk, 8)">
												
												重试
											</u-button>
										</u-col> -->

										<u-col span="3"
											v-if="index===messageList.length-1 && !item.history && item.loading">
											<u-button type='primary'
												:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
												size="mini" color="rgba(31, 100, 255, 0.1)" @click="toIdea">

												意见反馈
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
							<!-- <u-col span="3"
								v-if="messageList[messageList.length - 1].loading && !item.history">
								<u-button type='primary'
									:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","background-color": "#fff","color": "#1F64FF","border": "1px solid #1F64FF"}'
									size="mini" color="rgba(31, 100, 255, 0.1)"
									@click="againQs(item.talk)">
									<image src="../../static/images/ChatCircleDots.png" mode=""
										style="margin-right: 16upx;width: 40upx;height: 40upx;margin: 8upx;"></image>
									</image>
									重新提问
								</u-button>
							</u-col> -->

						</view>
					</u-col>
				</u-row>
			</view>


		</scroll-view>


		<view class="bottomInput" :style="{bottom:botHeight+'px'}">

			<view class="btn_link">
				<view class="link_l">
					<view class="l_chat" style="margin-right: 15rpx;background: #1f64ff;
    color: #fff;" @click="newChatSpeak" v-if="messageList.length > 1 && messageList[messageList.length - 1].loading">
						<u-icon name="plus" color="#fff" size="14"></u-icon>
						<text class="l_text">新会话</text>
					</view>
					<view class="l_chat" @click="toHistory">
						<u-icon name="clock" color="#1F64FF" size="16"></u-icon>
						<text class="l_text">历史会话</text>
					</view>
				</view>
				<view class="link_l">
					<view class="l_chat" @click="takePhoto">
						<u-icon name="camera" color="#1F64FF" size="20"></u-icon>
						<text class="l_text">看图说话</text>
					</view>
				</view>
			</view>
			<u-row align='bottom' gutter="5">
				<u-col span="9.5">
					<view class="chat_input">
						<u-textarea v-model="chatInputValue" placeholder="在此输入您想了解的内容" @confirm="sendMessage" autoHeight
							:showConfirmBar='false' :adjustPosition='false' maxlength='-1' :disableDefaultPadding='true'
							@keyboardheightchange='keyboardheightchange' border='none' :focus="false">
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

		<u-popup :show="transitionShow" mode="bottom" :round="10" :closeOnClickOverlay="false"
			@close="transitionShow=false">
			<view class="pop_cont">
				<view class="cont_top">
					<view class="top_l">是否关联上下文</view>
					<!-- <image class="close_img" src="@/static/user/close.png" @click="transitionShow=false" /> -->
				</view>
				<view class="cont_mid" @click="radioChange(false)">
					<view class="mid_l">是</view>
				</view>
				<view class="cont_mid" @click="radioChange(true)">
					<view class="mid_l">否</view>
				</view>
			</view>
		</u-popup>
		<view class="serverImg" v-if="showServer">
			<image :src="serverClose" class='serverClose' @click.stop="showServer=false"></image>
			<image :src="serverIcon" class='serverIcon' @click="toServer"></image>
			
		</view>
	</view>
</template>

<script>
	import {
		creatChat,
		chat_likes,
		chat_session,

	} from "@/apis/chat.js"
	import {
		getQuestionRecommend,
		saveFootprint,
		getMessage
	} from "@/apis/user.js"
	import uaMarkdown from '../../components/ua2-markdown/ua-markdown.vue'
	// import Title from "@/pages/title/index.vue"
	// import * as TextEncoding from 'text-encoding-shim';

	export default {
		data() {
			return {
				share: global.baseImg + '/xcx/com/message_center/chatShare.png',

				noticeList: [], // 消息公告
				page_no: 1,
				page_count: 10,
				pageTotal: 0,

				log: global.baseImg + '/xcx/com/message_center/Frame%20427320411.png',
				backImg: 'background-image: url("' + global.baseImg + '/xcx/com/message_center/Rectangle.png")',
				serverIcon: global.baseImg + '/xcx/com/message_center/payservericon.png',
				serverClose: global.baseImg + '/xcx/com/message_center/serveclose.png',
				isQs: true,
				isShow: true,
				showServer: true,

				//文心一言
				controller_three: null, // 用于终止会话
				t_time_three: null, // 计时器
				three_shi: null,

				selectDone: "",
				msgListHeight: 0,
				// barHeight: 50,
				userInfo: '',

				current: 0,
				key: 0,
				upDownText: false,
				show: false,
				transitionShow: false,
				complete: "",
				displayInfo1: "",
				displayInfo2: "",
				radioValue: true,

				chatInputValue: "",
				chatType: 'chatGLM',
				chat_type: 8, //4文心一言5讯飞星火8chatGlm
				chat_li: 1, //用来展示哪个重试按钮
				loading: true,
				session_code: "",
				chat_group_code: "",
				supplement: {}, // 请求参数
				avatar: "",
				billList: [],
				imgList: [],
				messageList: [],

				waitImg: global.baseImg + '/xcx/c4a8054e-50bd-4790-a3cb-ec585412daa7.jpg',

				send_val: '',
				botHeight: 50,
				platform: '',
				abilityList: []
			}
		},
		components: {
			uaMarkdown
		},
		onLoad(option) { 
			// 获取屏幕高度
			uni.getSystemInfo({
				success: res => {
					this.screenHeight = res.windowHeight
					// 100为底部输入栏高度，单位rpx，需要先转成px
					this.msgListHeight = this.screenHeight - uni.upx2px(100)
					this.platform = res.platform;
					let ua = window.navigator.userAgent.toLowerCase();
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
					  // 微信浏览器的处理逻辑
					  if(this.platform == 'ios') {
						  this.botHeight = 85
					  } else {
						  this.botHeight = 50
					  }
					  
					} else {
						this.botHeight = 50
					}

				}
			})
			
			
		},

		onShow() {
			if (this.messageList.length > 0) {
				let three_code = this.messageList[this.messageList.length - 1].code;

				if (three_code == 40022) { // 去除登录或升级vip提示
					this.messageList.pop()
				}
			}

			let url = location.href; // 获取分享路径
			let scene = decodeURIComponent(url);
			let val = this.getUrlDataFN(scene);

			if (uni.getStorageSync('page_code') != '') {
				this.historySession(uni.getStorageSync('page_code'))
			}

			this.chatInputValue = uni.getStorageSync('talkInfo')
			// this.talkOneInfo(this.chatType)

			this.getQuestionRecommend() // 获取问题集
			this.getAbility()
			setTimeout(() => {
				this.getNoticeList()
			}, 800)
			let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			let avatarUrl = global.baseImg + '/' + uni.getStorageSync("avatarUrl");
			this.avatar = avatarUrl;

			// document.title = '无忧秘书AI是一款人工智能聊天机器-能进行AI绘画-适用于多个场景进行AI对话-商务合作-源码定制等'
			// let metaKeywords = document.createElement('meta')
			// metaKeywords.id = 'chat-meta-keywords'
			// metaKeywords.name = 'keywords'
			// metaKeywords.content =
			// 	'无忧秘书AI,Ai聊天,ChatGpt3.5,ChatGpt4.0中文版,OpenAi,chatgpt国内版,AI智能软件,源码定制,API接口GPT4.0,API接口百度AI绘画'
			// document.getElementsByTagName('head')[0].appendChild(metaKeywords)

			// let metaDescription = document.createElement('meta')
			// metaDescription.id = 'chat-meta-description'
			// metaDescription.name = 'description'
			// metaDescription.content =
			// 	'无忧秘书AI是人工智能聊天工具,相当于国内版的chatgpt4.0.拥有语言理解能力和文本生成能力,能撰写视频脚本,文案,翻译,代码,写论文邮件,诗词歌赋等任务.职场上升职.写工作报告,企业管理,市场营销等能助你一臂之力.它上知天文下知地理,在任何场景都能和你像人类一样进行交流,互动.'
			// document.getElementsByTagName('head')[0].appendChild(metaDescription)
		},

		onHide() {
			// uni.setStorageSync('tabStatus', '')
			// uni.setStorageSync('talkInfo', '')
			// document.getElementById('chat-meta-keywords').remove()
			// document.getElementById('chat-meta-description').remove()
		},


		methods: {

			//截取url参数
			getUrlDataFN(urlStr) {
				// 定义一个空对象以储存数据
				const urlObj = {}
				// 检查url中是否携带数据
				if (urlStr.indexOf('?') === -1) return null
				// 找到 '?' 对应的下标
				const index = urlStr.indexOf('?') // index = 31
				// 截取 '?' 后的内容
				const dataStr = urlStr.substr(index + 1) // dataStr = a=1&b=2&c=&d=xxx&e
				// 通过 '&' 将字符串分割成数组
				const dataArr = dataStr.split('&') // ['a=1', 'b=2', 'c=', 'd=xxx', 'e']
				// 遍历字符串分割后的数组
				dataArr.forEach(str => {
					// 判断数组内的字符串是否有 '='
					if (str.indexOf('=') === -1) {
						// 如没有 '=' , 则将此字符串作为对象内键值对的键, 键值对的值为 undefined
						urlObj[str] = undefined // { e: undefined }
					} else {
						// 如果有 '='
						// 通过 '=' 将此字符串截取成两段字符串（不推荐使用 split 分割, 因为数据中可能携带多个 '=' ）
						const innerArrIndex = str.indexOf('=')
						const key = str.substring(0, innerArrIndex)
						const value = str.substr(innerArrIndex + 1)
						// 以截取后的两段字符串作为对象的键值对
						urlObj[key] = value // {a: '1', b: '2', c: '', d: 'xxx'}
					}
				})
				// 返回对象
				console.log(urlObj)
				return urlObj
			},
			// 获取公告列表
			getNoticeList() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let val = {
					'user_id': userInfo.user_id,
					'is_arousel': '1',
					'page_index': this.page_no,
					'page_count': this.page_count
				}
				this.isRead = false;
				getMessage(val).then(res => {
					if (res.code == 20000) {
						res.data.forEach((ele, index) => {
							if (index < 5) {
								this.noticeList.push(ele.title)

							}
							uni.setStorageSync('noticeInfo', this.noticeList)
							if (ele.is_read == 0) {
								this.isRead = true
							}
						})

					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取公告失败');
				})
			},

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

			historySession(session) {

				// console.log(session);
				if (this.messageList.length > 0) {
					let send_talk = this.messageList[this.messageList.length - 1].talk;
					let send_loading = this.messageList[this.messageList.length - 1].loading;
					let send_time = this.messageList[this.messageList.length - 1].time;

					// console.log(this.messageList[this.messageList.length - 1].time, 888);
					if (send_talk.indexOf('思考中') != -1 && send_time > 0) {

						this.$api.msg('当前问题还没回答完毕，请稍后再查看！')
						return
					}

					if (send_loading == false && send_time > 0) {

						this.$api.msg('当前问题还没回答完毕，请稍后再查看！')
						return
					}
				}

				this.messageList = [];
				chat_session(session).then(res => {
					console.log(res, '初始化信息');
					//初始化信息
					this.supplement = {
						chat_type: this.chat_type,
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
						// if(item.content.indexOf('(回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字)') != -1) {
						// 	item.content = item.content.replace('(回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字)', '')
						// }
						if (item.images == null) {
							item.images = []
						}
						this.messageList.push({
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
							model: item.model,
							is_like: item.is_likes
						})
						this.supplement.msg_list.push({
							role: item.role,
							content: item.content
						})

						this.isShow = false
						this.isQs = false

					})
					console.log(this.messageList[this.listName], 1542);

					this.toBottom()
					this.$forceUpdate()
					uni.setStorageSync('page_code', '')

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

			radioChange(e) {
				if (e) {
					this.upDownText = false
					this.selectDone = true
					this.messageList.splice(1, this.messageList.length - 1)
					this.sendMessage(this.chatInputValue)
				} else {
					let arr = []
					this.messageList.map((item, index) => {
						arr.push({
							role: item.type,
							content: item.talk,
							images: item.images
						})

					})
					this.supplement.msg_list = arr
					this.supplement.chat_group_code = ''
					this.upDownText = true
					this.selectDone = true
					this.sendMessage(this.chatInputValue)
				}
				this.transitionShow = false
			},

			//重新提问
			againQs(val, type) {
				// console.log(val, 662)
				if (type == 4) {
					this.chat_li = 2
				} else if (type == 5) {
					this.chat_li = 3
				} else {
					this.chat_li = 1
				}
				if (this.messageList.length > 0) {
					let send_talk = this.messageList[this.messageList.length - 1].talk;
					let send_loading = this.messageList[this.messageList.length - 1].loading;
					let send_time = this.messageList[this.messageList.length - 1].time;

					// console.log(this.messageList[this.messageList.length - 1].time, 888);
					if (send_talk.indexOf('思考中') != -1 && send_time > 0) {

						this.$api.msg('当前问题还没回答完毕，请稍后提问！')
						return
					}

					if (send_loading == false && send_time > 0) {

						this.$api.msg('当前问题还没回答完毕，请稍后再提问！')
						return
					}
				}

				this.chatInputValue = val;
				this.selectDone = true
				// this.transitionShow = false;
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
				let num_three = 0
				this.messageList.push({
					talk: `思考中,耗时${num_three}秒`,
					type: 'assistant'
				})
				this.three_shi = setInterval(() => {
					num_three++
				}, 1000)
				this.t_time_three = setInterval(() => {
					this.messageList[this.messageList.length - 1] = {
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
				data.scenario_type = 'chat'
				if (this.chat_type == 4) {
					data.model = 'completions'
				} else if (this.chat_type == 5) {
					data.model = 'v2.1'
				} else {
					data.model = 'chatglm_turbo';
				}
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
								this.messageList.pop()
								setTimeout(() => {
									uni.navigateTo({
										url: '/pages/login/login',
									})
								}, 1500)

							} else {
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
							}
							this.$forceUpdate()
							this.toBottom()
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

									if (this.chat_type == 4) {
										if (status == true) {
											load_state = true
										} else {
											load_state = false
										}
									} else if (this.chat_type == 5) {
										if (status == 2) {
											load_state = true
										} else {
											load_state = false
										}
									} else {
										if (status == 'stop') {
											load_state = true
										} else {
											load_state = false
										}
									}

									if (state == 'first') {
										this.supplement = {
											chat_type: this.chat_type,
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
									this.messageList[this.messageList.length - 1] = {
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
										is_like: 0
									}

									if (load_state) { //保存记录
										let save_val = {
											"type_name": "对话",
											"type_code": "chat",
											"title": this.send_val,
											"eid": this.session_code
										}
										this.saveFootprint(save_val)
										this.send_val = ''
									}

								}

							}

						})

					}

					this.$forceUpdate();
					this.toBottom();
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
				if (this.chat_type == 4 || this.chat_type == 5 || this.chat_type == 8) {
					this.supplement.msg_list = [{
							role: 'user',
							content: this.messageList[this.messageList.length - 2].talk,
							images: []
						},
						{
							role: 'assistant',
							content: this.messageList[this.messageList.length - 1].talk,
							images: []
						},
						{
							role: 'user',
							content: this.complete,
							images: []
						}
					]
				} else {
					this.supplement.msg_list = [{
							role: 'assistant',
							content: this.messageList[this.messageList.length - 1].talk,
							images: []
						},
						{
							role: 'user',
							content: this.complete,
							images: []
						}
					]
				}
				this.messageList.push({
					talk: this.complete,
					type: 'user',
					images: []
				})
				//把数据变成JSON
				this.supplement.msg_list = JSON.stringify(this.supplement.msg_list)

				this.complete = ""

				this.creatChatFun(this.supplement, 'continue')


			},
			sendMessage(message) {
				if (this.messageList.length > 0) {
					let send_talk = this.messageList[this.messageList.length - 1].talk;
					let send_loading = this.messageList[this.messageList.length - 1].loading;
					let send_time = this.messageList[this.messageList.length - 1].time;
					let history = this.messageList[this.messageList.length - 1].history;

					// console.log(this.messageList[this.messageList.length - 1], 8871);
					if (send_talk.indexOf('思考中') != -1) {

						this.$api.msg('当前问题还没回答完毕，请稍后再提问！')
						return
					}

					if (send_loading == false && send_time > 0) {

						this.$api.msg('当前问题还没回答完毕，请稍后再提问！')
						return
					}
					if (send_time == 0 && !history) {
						this.messageList.pop()
					}
				}

				if (this.chatInputValue.trim() == '') return this.$api.msg('请输入您要发送的内容')


				this.isShow = false; // 隐藏热搜提问
				this.isQs = false;


				if (this.messageList.length > 1 && !this.selectDone) {
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
				this.messageList.push({
					talk: this.chatInputValue,
					type: 'user',
					images: img_url
				})

				// const hide_cont = '(回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字)';
				this.send_val = this.chatInputValue
				let chat_cont = this.chatInputValue
				let data = {
					chat_type: this.chat_type,
					action_type: '3',
					session_code: "",
					chat_group_code: "",
					content: chat_cont,
					// stream_str: 1,
					// is_decode: 1,
					msg_list: [{
						role: 'user',
						covert_content: `回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字\n以下是我的问题：`,
						content: chat_cont
					}]
				}
				if (this.imgList.length > 0) {
					data.msg_list[0].images = this.imgList
				}
				data.msg_list = JSON.stringify(data.msg_list)

				if (this.upDownText) {
					this.supplement.msg_list.push({
						role: 'user',
						content: this.chatInputValue,
						images: this.imgList
					})
					this.supplement.msg_list = JSON.stringify(this.supplement.msg_list)
					this.radioValue = true
					this.upDownText = false
					this.creatChatFun(this.supplement, 'continue')
				} else {

					this.creatChatFun(data, 'first')

				}

				this.selectDone = false
				this.chatInputValue = ''
				this.imgList = []

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
				if (this.controller_three != null) {
					this.controller_three.abort()
				}
				this.messageList[this.messageList.length - 1].loading = true
				clearInterval(this.t_time_three)
				clearInterval(this.three_shi)
				this.$forceUpdate()
			},

			// 停止开始回答
			stopStart() {
				if (this.controller_three != null) {
					this.controller_three.abort()
				}
				clearInterval(this.t_time_three)
				clearInterval(this.three_shi)
				this.messageList.splice(this.messageList.length - 2, 2)
				this.$forceUpdate()

			},

			newChatSpeak() {
				if (this.messageList.length > 0) {
					let send_talk = this.messageList[this.messageList.length - 1].talk;
					let send_loading = this.messageList[this.messageList.length - 1].loading;
					let send_time = this.messageList[this.messageList.length - 1].time;

					// console.log(this.messageList[this.messageList.length - 1].time, 888);
					if (send_talk.indexOf('思考中') != -1 && send_time > 0) {

						this.$api.msg('当前问题还没回答完毕，请稍后再操作！')
						return
					}

					if (send_loading == false && send_time > 0) {

						this.$api.msg('当前问题还没回答完毕，请稍后再操作！')
						return
					}
				}

				this.isQs = false; // 显示热搜提问
				this.isShow = true
				this.messageList = [];
				this.session_code = '';
				this.chat_group_code = ''
				this.imgList = []

			},

			toHistory() {
				uni.navigateTo({
					url: '/pages/index/chat_history'
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
						uni.showLoading({
							title: '上传中'
						});
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
								console.log(imgData, 333)
								if (imgData.code == 20000) {
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

			// 点赞点踩
			likeType(val, index) {

				let data = {
					is_likes: val,
					session_code: this.session_code,
					chat_group_code: this.chat_group_code
				}
				this.messageList[index].is_like = val
				this.$forceUpdate()

				chat_likes(data).then(res => {
					// uni.showToast({ //提示
					// 	title: '评价成功'
					// })
				})

			},

			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			},
			toServer() {
				uni.navigateTo({
					url: '/childCont/server/server'
				})
			},
			// 随机能力
			getAbility() {
				const list = [{
					content: '优选能力',
					num: 1
				}, {
					content: '对话中心',
					num: 2
				}, {
					content: '绘画中心',
					num: 3
				}, {
					content: 'AI百宝箱',
					num: 4
				}, {
					content: 'AI视觉馆',
					num: 5
				}, {
					content: '实验能力',
					num: 6
				}, {
					content: '智能工具',
					num: 7
				}, {
					content: 'AI资讯',
					num: 8
				}];

				// 随机打乱数组中元素的顺序
				list.sort(() => Math.random() - 0.5);

				// 选取前6个元素，形成一个新的数组
				this.abilityList = list.slice(0, 8);

			},
			toAbility(num) {
				if (num == 1) {
					uni.navigateTo({
						url: '/childCont/more_function/more_ability'
					})
				} else if (num == 2) {
					uni.navigateTo({
						url: '/childCont/more_function/more_chat'
					})
				} else if (num == 3) {
					uni.navigateTo({
						url: '/childCont/more_function/more_draw'
					})
				} else if (num == 4) {
					uni.navigateTo({
						url: '/childCont/more_function/more_chest'
					})
				} else if (num == 5) {
					uni.navigateTo({
						url: '/childPage/vision/vision'
					})
				} else if (num == 6) {
					uni.navigateTo({
						url: '/childCont/more_function/more_experiment'
					})
				} else if (num == 7) {
					uni.navigateTo({
						url: '/childCont/more_function/more_tool'
					})
				} else if (num == 8) {
					uni.navigateTo({
						url: '/childPage/news/information'
					})
				}
			},
			toNotice() {
				uni.navigateTo({
					url: "/childPage/notice/notice"
				})
			},
			goShare() {
				uni.navigateTo({
					url: '/childPage/distribution/share'
				})

			},
		}
	}
</script>

<style lang="less" scoped>
	@import "@/static/css/chat.less";

	.btn_link {
		display: flex;
		align-items: center;
		width: 100%;

		.link_l {
			margin-right: 20rpx;
			display: flex;

			.l_chat {
				border-radius: 6upx;
				border: 1upx solid #1F64FF;
				padding: 0rpx 10rpx;
				height: 45rpx;
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

	.cont_tabs_li {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f6f8fb;
		margin-top: 102upx;

		.tabs_l {
			// width: 25%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20upx;
			position: relative;
		}

		.active_tabs {
			font-style: normal;
			font-weight: 500;
			font-size: 28upx;
			line-height: 50upx;
			color: #fff;
			background: #1F64FF;
			border-radius: 8upx;
			padding: 0 15upx;
		}

		.tabs {
			font-style: normal;
			font-weight: 500;
			font-size: 28upx;
			line-height: 50upx;
			color: #999;
			border-radius: 8upx;
			background: #FFF;
			padding: 0 15upx;
		}
	}

	.cont_active {
		width: 100%;
		text-align: center;
		color: #4E5969;
		font-size: 24upx;
		font-style: normal;
		font-weight: 400;
		line-height: 50upx;
		// background: #fff;
	}

	.headCard {
		width: 100%;
		border-radius: 10upx;
		// padding: 20upx;
		background: #fff;
		margin-bottom: 20upx;

		.head_chat {
			width: 100%;
			height: 180upx;
			padding: 20upx;
			border-radius: 10upx;

			.head {
				display: flex;
				align-items: center;

				.head_img {
					width: 80upx;
					height: 80upx;
				}

				.head_content {
					color: #1F64FF;
					font-size: 36upx;
					font-style: normal;
					font-weight: 500;
					line-height: 80upx;
					padding-left: 10upx;
				}
			}

			.head_tip {
				color: #242F49;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 40upx;
			}

			.head_price {
				// color: #7EA6FC;
				color: #f00;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 40upx;
			}
		}

		.head_grid {
			display: flex;
			align-items: center;
			justify-content: space-around;
			flex-wrap: wrap;
			padding: 20upx 20upx 10upx 20upx;

			.grid_item {
				width: 42%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-radius: 10upx;
				background: #F7F7F9;
				padding: 10upx 20upx;
				margin: 10upx 0;

				.item_li {
					color: #26244B;
					font-size: 28upx;
					font-style: normal;
					font-weight: 400;
					line-height: 40upx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2; // 控制多行的行数
					-webkit-box-orient: vertical;
					padding-right: 10upx;
				}

				.item_li_l {
					color: #26244B;
					font-size: 28upx;
					font-style: normal;
					font-weight: 400;
					line-height: 40upx;
					flex: 1;
					text-align: center;
				}
			}
		}

		.head_title {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.title_l {
				color: #000;
				font-size: 30upx;
				font-weight: 500;
				line-height: 50upx;
			}

			.title_r {
				display: flex;

				.r_img {
					width: 40upx;
					height: 40upx;
				}

				.r_text {
					color: #1F64FF;
					font-size: 26upx;
					font-style: normal;
					font-weight: 400;
					line-height: 50upx;
				}
			}

		}

		.grid_items {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-radius: 10upx;
			background: #F7F7F9;
			padding: 10upx 20upx;
			margin: 20upx 0;

			.item_li {
				color: #26244B;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 40upx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2; // 控制多行的行数
				-webkit-box-orient: vertical;
			}
		}
	}

	.u-page {
		margin-top: 0 !important;
	}

	.serverImg {
		width: 248rpx;
		height: 248rpx;
		position: fixed;
		bottom: 350rpx;
		right: 0;
		z-index: 99;
		.serverIcon {
			width: 100%;
			height: 100%;
		}

		.serverClose {
			width: 32rpx;
			height: 32rpx;
			position: absolute;
			top: 18rpx;
			right: 28rpx;
			z-index: 100;
		}
	}

	.head_grid_two {
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		padding: 20upx 20upx 10upx 20upx;
		background-color: #fff;
		margin-bottom: 80rpx;
		margin-top: 24rpx;

		.grid_item_two {
			width: 44%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-radius: 10rpx;
			background: #F7F7F9;
			padding: 28rpx 32rpx;
			margin: 10rpx 0;

			.item_li_two {
				color: #26244B;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 40upx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2; // 控制多行的行数
				-webkit-box-orient: vertical;
				padding-right: 10upx;
			}

			.item_li_l_two {
				color: #26244B;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 40upx;
				flex: 1;
				text-align: center;
			}
		}
	}

	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 32rpx;
		width: 100%;

		.title_l {
			color: #000;
			font-size: 32rpx;
			font-weight: 500;
		}

		.title_r {
			display: flex;
			align-items: center;

			image {
				width: 40rpx;
				height: 40rpx;
			}

			.r_txt {
				color: #1F64FF;
				font-size: 26rpx;
			}
		}
	}
</style>
<style>
	page {
		background: #f6f8fb;
	}
</style>