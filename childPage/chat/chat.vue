<template>
	<view id="chat">
		<!-- <Title :title='"无忧秘书AI"' /> -->
		<!-- <u-tabs :list="list" lineWidth='85' lineHeight='2' lineColor='#1f64ff' :activeStyle='{color: "#1F64FF"}'
			@change='tabsChange' :current='current'></u-tabs> -->
		<view class="head_index">
			<view class="head_cont">
				<view class="cont_tabs">
					<view class="item_tabs" @click="tabsChange('文心一言')"
						:class="[listName == 'three' ? 'active_tabs' : '']">文心一言</view>
					<view class="item_tabs" @click="tabsChange('讯飞星火')"
						:class="[listName == 'four' ? 'active_tabs' : '']">讯飞星火</view>
					<view class="item_tabs" @click="tabsChange('通义千问')"
						:class="[listName == 'seven' ? 'active_tabs' : '']">通义千问</view>
					<view class="item_tabs" @click="tabsChange('ChatGLM')"
						:class="[listName == 'six' ? 'active_tabs' : '']">ChatGLM</view>
					<view class="item_tabs" @click="tabsChange('360智脑')"
						:class="[listName == 'eight' ? 'active_tabs' : '']">360智脑</view>
				</view>
				<!-- <view class="right_text" @click="toHistory">历史对话</view> -->
			</view>
		</view>

		<view class="cont_tabs_li">
			<view class="tabs_l" v-if="listName == 'three'">
				<view @click="version(1)" :class="[chat_active == 1 ? 'active_tabs' : 'tabs']">文心一言_Turbo</view>
			</view>
			<view class="tabs_l" v-if="listName == 'three'">
				<view @click="version(2)" :class="[chat_active == 2 ? 'active_tabs' : 'tabs']">文心一言</view>
			</view>
			<view class="tabs_l" v-if="listName == 'three'">
				<view @click="version(3)" :class="[chat_active == 3 ? 'active_tabs' : 'tabs']">
					文心一言-4
					<!-- <u-badge type="error" value="推荐" shape="horn" absolute :offset="[0,-10]"></u-badge> -->
				</view>
			</view>

			<view class="tabs_l" v-if="listName == 'four'">
				<view @click="version(4)" :class="[chat_active == 4 ? 'active_tabs' : 'tabs']">v1.1</view>
			</view>
			<view class="tabs_l" v-if="listName == 'four'">
				<view @click="version(5)" :class="[chat_active == 5 ? 'active_tabs' : 'tabs']">v2.1</view>
			</view>
			<view class="tabs_l" v-if="listName == 'four'">
				<view @click="version(6)" :class="[chat_active == 6 ? 'active_tabs' : 'tabs']">v3.1</view>
			</view>

			<view class="tabs_l" v-if="listName == 'seven'">
				<view @click="version(7)" :class="[chat_active == 7 ? 'active_tabs' : 'tabs']">qwen-turbo</view>
			</view>
			<view class="tabs_l" v-if="listName == 'seven'">
				<view @click="version(8)" :class="[chat_active == 8 ? 'active_tabs' : 'tabs']">qwen-plus</view>
			</view>

		</view>
		<view class="cont_active">{{ active_text }}</view>

		<!-- {{messageList}}{{listName}} -->
		<scroll-view ref="box" class="u-page page-li" scroll-with-animation scroll-y="true" id="textadd"
			:style='{ height: msgListHeight}'>
			<view scroll-with-animation v-for="item,index in messageList[listName]" :key="index" class="listItem"
				:anchor="index">

				<u-row align="top" gutter="5">
					<u-col span="1.5" textAlign="center" align="top" justify="top">
						<image style="height: 38px;width: 38px; border-radius: 50%;"
							:src="item.type=='assistant'? wxImg :avatar" v-if="listName == 'three'">
						</image>
						<image style="height: 38px;width: 38px;  border-radius: 50%;"
							:src="item.type=='assistant'? xfImg :avatar" v-if="listName == 'four'">
						</image>

						<image style="height: 38px;width: 38px;  border-radius: 50%;"
							:src="item.type=='assistant'? claudeImg : avatar" v-if="listName == 'five'">
						</image>
						<image style="height: 38px;width: 38px;  border-radius: 50%;"
							:src="item.type=='assistant'? glmImg :avatar" v-if="listName == 'six'">
						</image>
						<image style="height: 38px;width: 38px; border-radius: 50%;"
							:src="item.type=='assistant'? qwImg : avatar" v-if="listName == 'seven'">
						</image>
						<image style="height: 38px;width: 38px; border-radius: 50%;"
							:src="item.type=='assistant'? stImg :avatar" v-if="listName == 'eight'">
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
									size="mini" color="rgba(31, 100, 255, 0.1)"
									@click="againQs(item.talk)">
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


		<view class="bottomInput" style="bottom: 0;">

			<view class="btn_link">
				<view class="link_l">
					<view class="l_chat" style="margin-right: 15rpx;" @click="newChatSpeak"
						v-if="messageList[listName].length > 2 && messageList[listName][messageList[listName].length - 1].loading">
						<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
						<text class="l_text">开启新会话</text>
					</view>
					<view class="l_chat" @click="toHistory">
						<u-icon name="clock" color="#1F64FF" size="16"></u-icon>
						<text class="l_text">历史会话</text>
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
		saveFootprint
	} from "@/apis/user.js"
	import uaMarkdown from '../../components/ua2-markdown/ua-markdown.vue'
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
				wx_one: [{
					talk: `<span style="font-size: 17px">我是百度新一代大型语言模型，文心一言-Turbo版本，在文心家族里，我的速度更快，价格相对优惠哦</span>`,
					type: 'assistant'
				}],
				wx_two: [{
					talk: `<span style="font-size: 17px">我是百度新一代大型语言模型，文心一言，在文心家族里，我推理能力更强，价格适中哦</span>`,
					type: 'assistant'
				}],
				wx_three: [{
					talk: `<span style="font-size: 17px">我是百度新一代大型语言模型，文心家族4.0版本，是文心家族最强的语言模型，我能力较强，但是价格也比较贵哦</span>`,
					type: 'assistant'
				}],

				//讯飞星火
				controller_four: null, // 用于终止会话
				t_time_four: null, // 计时器
				four_shi: null,
				xf_one: [{
					talk: `<span style="font-size: 17px">我是讯飞科大推出的新一代认知智能大模型，讯飞星火-1.1版本，V1.1版本能力一般，价格也相对较便宜哦</span>`,
					type: 'assistant'
				}],
				xf_two: [{
					talk: `<span style="font-size: 17px">我是讯飞科大推出的新一代认知智能大模型，讯飞星火-2.1版本，V2.1版本能力较强，价格也相对适中哦</span>`,
					type: 'assistant'
				}],
				xf_three: [{
					talk: `<span style="font-size: 17px">我是讯飞科大推出的新一代认知智能大模型，讯飞星火-3.1版本，V3.1版本能力更强，价格也相对更贵哦</span>`,
					type: 'assistant'
				}],

				//ChatGLM
				controller_six: null, // 用于终止会话
				t_time_six: null, // 计时器
				six_shi: null,


				//通义千问
				controller_seven: null, // 用于终止会话
				t_time_seven: null, // 计时器
				seven_shi: null,
				qw_one: [{
					talk: `<span style="font-size: 17px">我是阿里巴巴集团推出的大型语言模型，是通义大模型家族的一员，通义千问Turbo版本,Turbo版本速度更快，价格也比较便宜哦</span>`,
					type: 'assistant'
				}],
				qw_two: [{
					talk: `<span style="font-size: 17px">我是阿里巴巴集团推出的大型语言模型，是通义大模型家族的一员，通义千问Plus版本,Plus版本能力更强，价格也比较贵哦</span>`,
					type: 'assistant'
				}],

				//360智脑
				controller_eight: null, // 用于终止会话
				t_time_eight: null, // 计时器
				eight_shi: null,

				// msgCode: '', // 当前会话的唯一标识

				chat_active: 1,
				active_text: '能力较强，3.6w算力/1000token',
				chat_pro: 'completions_pro',

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
				displayInfo1: "",
				displayInfo2: "",
				radioValue: true,
				maxlength: 901,

				chatInputValue: "",
				oldChatInputValue: "",
				chatType: '文心一言',
				loading: true,
				session_code: "",
				chat_group_code: "",
				supplement: {}, // 请求参数
				listName: 'three',
				avatar: "",
				askShow: true,
				billList: [],
				imgList: [],
				messageList: {
					'three': [{
						talk: `<span style="font-size: 17px">我是百度新一代大型语言模型，文心一言-Turbo版本，在文心家族里，我的速度更快，价格相对优惠哦</span>`,
						type: 'assistant'
					}],
					'four': [{
						talk: `<span style="font-size: 17px">我是讯飞科大推出的新一代认知智能大模型，讯飞星火-1.1版本，V1.1版本能力一般，价格也相对较便宜哦</span>`,
						type: 'assistant'
					}],
					'six': [{
						talk: `<span style="font-size: 17px">我是智普.AI推出的千亿参数对话语言模型，chatGLM-Turbo版本，,Turbo版本速度更快，价格也比较便宜哦</span>`,
						type: 'assistant'
					}],
					'seven': [{
						talk: `<span style="font-size: 17px">我是阿里巴巴集团推出的大型语言模型，是通义大模型家族的一员，通义千问Turbo版本,Turbo版本速度更快，价格也比较便宜哦</span>`,
						type: 'assistant'
					}],
					'eight': [{
						talk: `<span style="font-size: 17px">我是360集团推出的认知型通用大模型，360智脑V9版本，V9版本速度较快，价格适中哦</span>`,
						type: 'assistant'
					}]
				},

				wxImg: global.baseImg + '/xcx/45cbd4e5-474e-4782-a31e-1efd2a48d664.jpg',
				xfImg: global.baseImg + '/xcx/19e4def0-7866-4c1b-82f6-a78a5d591b17.jpg',
				claudeImg: global.baseImg + '/xcx/22a0d319-6aa3-425a-94bb-5c57884db842.jpg',
				glmImg: global.baseImg + '/xcx/9b91253a-59c2-4ab8-9e38-af7c6464823c.jpg',
				gptImg: global.baseImg + '/xcx/8d2bd289-ff24-4f3c-b6d2-a4cbbd7ca737.jpg',
				qwImg: global.baseImg + '/xcx/32ef66a5-1c72-4b83-9713-436f970db434.jpg',
				stImg: global.baseImg + '/xcx/244751fa-1bbb-4a95-bafb-76b4c8f4f88a.jpg',
				aiImg: global.baseImg + '/xcx/6ddf8a53-52d1-40ec-9430-ec92a2f429f0.jpg',
				waitImg: global.baseImg + '/xcx/c4a8054e-50bd-4790-a3cb-ec585412daa7.jpg',

				send_val: ''
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

				}
			})
		},

		onShow() {
			let three_code = this.messageList.three[this.messageList.three.length - 1].code;
			let four_code = this.messageList.four[this.messageList.four.length - 1].code;
			let six_code = this.messageList.six[this.messageList.six.length - 1].code;
			let seven_code = this.messageList.seven[this.messageList.seven.length - 1].code;
			let eight_code = this.messageList.eight[this.messageList.eight.length - 1].code;

			if (three_code == 40022) { // 去除登录或升级vip提示
				this.messageList.three.pop()
			}

			if (four_code == 40022) { // 去除登录或升级vip提示
				this.messageList.four.pop()
			}

			if (six_code == 40022) { // 去除登录或升级vip提示
				this.messageList.six.pop()
			}

			if (seven_code == 40022) { // 去除登录或升级vip提示
				this.messageList.seven.pop()
			}

			if (eight_code == 40022) { // 去除登录或升级vip提示
				this.messageList.eight.pop()
			}

			let url = location.href; // 获取分享路径
			let scene = decodeURIComponent(url);
			let val = this.getUrlDataFN(scene);
			if (val != null) {
				if (val.current == 4) {
					this.chatType = '文心一言'
					this.listName = 'three'
				} else if (val.current == 5) {
					this.chatType = '讯飞星火'
					this.listName = 'four'
				} else if (val.current == 8) {
					this.chatType = 'ChatGLM'
					this.listName = 'six'
				} else if (val.current == 10) {
					this.chatType = '通义千问'
					this.listName = 'seven'
				} else if (val.current == 12) {
					this.chatType = '360智脑'
					this.listName = 'eight'
				} else {
					this.chatType = '文心一言'
					this.listName = 'three'
				}
			} else {
				if (uni.getStorageSync('tabStatus') == 4) {
					this.chatType = '文心一言'
					this.listName = 'three'
					this.current = 0
					this.chat_active = 1
					this.chat_pro = 'eb-instant';
					this.active_text = '2.4w算力/1000token'
				} else if (uni.getStorageSync('tabStatus') == 5) {
					this.chatType = '讯飞星火'
					this.listName = 'four'
					this.current = 1
					this.chat_active = 4
					this.chat_pro = 'v1.1';
					this.active_text = '5.4w算力/1000token'
				} else if (uni.getStorageSync('tabStatus') == 8) {
					this.chatType = 'ChatGLM'
					this.listName = 'six'
					this.current = 3
					this.active_text = '1.5w算力/1000token'
				} else if (uni.getStorageSync('tabStatus') == 10) {
					this.chatType = '通义千问'
					this.listName = 'seven'
					this.current = 2
					this.chat_active = 7
					this.chat_pro = 'qwen-turbo';
					this.active_text = '2.4w算力/1000token'
				} else if (uni.getStorageSync('tabStatus') == 12) {
					this.chatType = '360智脑'
					this.listName = 'eight'
					this.current = 4
					this.active_text = '3.6w算力/1000token'
				} else {
					this.chatType = '文心一言'
					this.listName = 'three'
					this.current = 0
					this.chat_active = 1
					this.chat_pro = 'eb-instant';
					this.active_text = '2.4w算力/1000token'
				}
			}


			// console.log('加载1121', uni.getStorageSync('history_code'));
			if (uni.getStorageSync('history_code') != '') {
				// console.log('获取到了')
				this.historySession(uni.getStorageSync('history_code'))

			}

			this.chatInputValue = uni.getStorageSync('talkInfo')
			// this.talkOneInfo(this.chatType)

			this.getQuestionRecommend() // 获取问题集

			let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			let avatarUrl = global.baseImg + '/' + uni.getStorageSync("avatarUrl");
			this.avatar = avatarUrl;

			if (this.chatInputValue.trim() != '') { // 应用助理直接回答
				this.session_code = '';
				this.chat_group_code = ''
				let chat_tip = 0;
				if (this.listName == 'three') {
					chat_tip = 4
				} else if (this.listName == 'four') {
					chat_tip = 5
				} else if (this.listName == 'six') {
					chat_tip = 8
				} else if (this.listName == 'seven') {
					chat_tip = 10
				} else if (this.listName == 'eight') {
					chat_tip = 12
				}
				this.supplement = {
					chat_group_code: '',
					chat_type: chat_tip,
					msg_list: [],
					session_code: ''
				}
				this.endController()
				this.oldChatInputValue = ''
				this.transitionShow = false
				if (this.listName == 'three') {
					this.messageList[this.listName] = [{
						talk: `<span style="font-size: 17px">
												我是百度新一代大型语言模型，文心一言-Turbo版本，在文心家族里，我的速度更快，价格相对优惠哦</span>`,
						type: 'assistant'
					}]
				} else if (this.listName == 'four') {
					this.messageList[this.listName] = [{
						talk: `<span style="font-size: 17px">
												我是讯飞科大推出的新一代认知智能大模型，讯飞星火-1.1版本，V1.1版本能力一般，价格也相对较便宜哦</span>`,
						type: 'assistant'
					}]
				} else if (this.listName == 'six') {
					this.messageList[this.listName] = [{
						talk: `<span style="font-size: 17px">
												我是智普.AI推出的千亿参数对话语言模型，chatGLM-Turbo版本，,Turbo版本速度更快，价格也比较便宜哦</span>`,
						type: 'assistant'
					}]
				} else if (this.listName == 'seven') {
					this.messageList[this.listName] = [{
						talk: `<span style="font-size: 17px">
												我是阿里巴巴集团推出的大型语言模型，是通义大模型家族的一员，通义千问Turbo版本,Turbo版本速度更快，价格也比较便宜哦</span>`,
						type: 'assistant'
					}]
				} else if (this.listName == 'eight') {
					this.messageList[this.listName] = [{
						talk: `<span style="font-size: 17px">
												我是360集团推出的认知型通用大模型，360智脑V9版本，V9版本速度较快，价格适中哦</span>`,
						type: 'assistant'
					}]
				}
				this.sendMessage(this.chatInputValue)
			}

			if (this.messageList[this.listName].length > 1) {
				this.askShow = false
			} else {
				this.askShow = true
			}

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
			uni.setStorageSync('tabStatus', '')
			uni.setStorageSync('talkInfo', '')
			document.getElementById('chat-meta-keywords').remove()
			document.getElementById('chat-meta-description').remove()
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
				if (data.type == 4) {
					this.listName = 'three';
					chat_tip = 4
				} else if (data.type == 5) {
					this.listName = 'four';
					chat_tip = 5
				} else if (data.type == 8) {
					this.listName = 'six';
					chat_tip = 8
				} else if (data.type == 10) {
					this.listName = 'seven';
					chat_tip = 10
				} else if (data.type == 11) {
					this.listName = 'eight';
					chat_tip = 11
				}
				this.messageList[this.listName].splice(1, this.messageList[this.listName].length - 1)
				this.$forceUpdate()


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
						// console.log(this.messageList[this.listName],7777777)
						if (data.type == 4) {
							if (this.messageList[this.listName][1].model == 'completions_pro') {
								this.chat_active = 3
								this.wx_one = this.messageList[this.listName]
							} else if (this.messageList[this.listName][1].model == 'completions') {
								this.chat_active = 2
								this.wx_two = this.messageList[this.listName]
							} else if (this.messageList[this.listName][1].model == 'eb-instant') {
								this.chat_active = 1
								this.wx_three = this.messageList[this.listName]
							} else {
								this.chat_active = 2
								this.wx_two = this.messageList[this.listName]
							}
						} else if (data.type == 5) {
							if (this.messageList[this.listName][1].model == 'v3.1') {
								this.chat_active = 6
								this.xf_one = this.messageList[this.listName]
							} else if (this.messageList[this.listName][1].model == 'v2.1') {
								this.chat_active = 5
								this.xf_two = this.messageList[this.listName]
							} else if (this.messageList[this.listName][1].model == 'v1.1') {
								this.chat_active = 4
								this.xf_three = this.messageList[this.listName]
							} else {
								this.chat_active = 4
								this.xf_three = this.messageList[this.listName]
							}
						} else if (data.type == 10) {
							if (this.messageList[this.listName][1].model == 'qwen-plus') {
								this.chat_active = 8
								this.qw_one = this.messageList[this.listName]
							} else if (this.messageList[this.listName][1].model == 'qwen-turbo') {
								this.chat_active = 7
								this.qw_two = this.messageList[this.listName]
							} else {
								this.chat_active = 8
								this.qw_one = this.messageList[this.listName]
							}
						}

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
			checkboxChange(e) {

				let arr = []
				e.detail.value.map(item => {
					arr.push({
						role: JSON.parse(item).type,
						content: JSON.parse(item).talk
					})
				})
				// console.log(e, 'arrrrrrreee');
				this.supplement.msg_list = arr
				this.supplement.chat_group_code = ''
				//  =  JSON.stringify(arr) 
				// this.upDownText = 
				//判断是否有选择
				arr.length > 0 ? this.upDownText = true : this.upDownText = false
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

			//重新提问
			againQs(val) {
				// console.log(val, 662)
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
					data.model = this.chat_pro;
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
											is_like: 0
										}

										if (this.chat_active == 1) { //三个modle存值
											this.wx_one = this.messageList[tabType]
										} else if (this.chat_active == 2) {
											this.wx_two = this.messageList[tabType]
										} else if (this.chat_active == 3) {
											this.wx_three = this.messageList[tabType]
										}

										if (load_state) { //保存记录
											let save_val = {
												"type_name": "文心一言",
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
					data.model = this.chat_pro;
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
											is_like: 0
										}

										if (this.chat_active == 4) { //三个modle存值
											this.xf_one = this.messageList[tabType]
										} else if (this.chat_active == 5) {
											this.xf_two = this.messageList[tabType]
										} else if (this.chat_active == 6) {
											this.xf_three = this.messageList[tabType]
										}

										if (load_state) { //保存记录
											let save_val = {
												"type_name": "讯飞星火",
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
					data.model = 'chatglm_turbo'; // ChatGLM必传参数
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
											all_tokens,
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
												"type_name": "chatGLM",
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
					data.model = this.chat_pro; // 必传参数
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
											is_like: 0
										}

										if (this.chat_active == 7) { //两个modle存值
											this.qw_one = this.messageList[tabType]
										} else if (this.chat_active == 8) {
											this.qw_two = this.messageList[tabType]
										}

										if (load_state) { //保存记录
											let save_val = {
												"type_name": "通义千问",
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
					data.model = '360GPT_S2_V9'; // 必传参数
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
												chat_type: 12,
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
											is_like: 0
										}

										if (load_state) { //保存记录
											let save_val = {
												"type_name": "360智脑",
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
				if (this.listName == 'three' || this.listName == 'five' || this.listName == 'six' || this.listName ==
					'seven') {
					this.supplement.msg_list = [{
							role: 'user',
							content: this.messageList[this.listName][this.messageList[this.listName].length - 2].talk,
							images: []
						},
						{
							role: 'assistant',
							content: this.messageList[this.listName][this.messageList[this.listName].length - 1].talk,
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
							content: this.messageList[this.listName][this.messageList[this.listName].length - 1].talk,
							images: []
						},
						{
							role: 'user',
							content: this.complete,
							images: []
						}
					]
				}
				this.messageList[this.listName].push({
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
				let send_talk = this.messageList[this.listName][this.messageList[this.listName].length - 1].talk;
				let send_loading = this.messageList[this.listName][this.messageList[this.listName].length - 1].loading;
				let send_time = this.messageList[this.listName][this.messageList[this.listName].length - 1].time;
				let history = this.messageList[this.listName][this.messageList[this.listName].length - 1].history;

				// console.log(this.messageList[this.listName][this.messageList[this.listName].length - 1], 8871);
				if (send_talk.indexOf('思考中') != -1) {

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


				this.askShow = false; // 隐藏热搜提问

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
				this.send_val = this.chatInputValue
				let chat_cont = this.chatInputValue
				let chat_tip = '';
				if (this.chatType == '文心一言') {
					chat_tip = 4
				} else if (this.chatType == '讯飞星火') {
					chat_tip = 5
				} else if (this.chatType == 'ChatGLM') {
					chat_tip = 8
				} else if (this.chatType == '通义千问') {
					chat_tip = 10
				} else if (this.chatType == '360智脑') {
					chat_tip = 12
				}
				let data = {
					chat_type: chat_tip,
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

			tabsChange(e) {
				if (this.messageList[this.listName][this.messageList[this.listName].length - 1].talk.indexOf('思考中') != -
					1) {
					// e.name == 'AI35' ? this.current = 1 : this.current = 0
					this.$api.msg(
						'当前问题还没开始回答，请等待！')
					return
				}

				this.chatType = e
				let chat_num = 0
				if (this.chatType == '文心一言') {
					this.listName = 'three';
					this.current = 0
					chat_num = 4
					uni.setStorageSync('tabStatus', 4)
					this.chat_active = 1
					this.chat_pro = 'eb-instant';
					this.active_text = '2.4w算力/1000token'
					this.messageList[this.listName] = this.wx_one
				} else if (this.chatType == '讯飞星火') {
					this.listName = 'four';
					this.current = 1
					chat_num = 5
					uni.setStorageSync('tabStatus', 5)

					this.chat_active = 4
					this.chat_pro = 'v1.1';
					this.active_text = '5.4w算力/1000token'
					this.messageList[this.listName] = this.xf_one
				} else if (this.chatType == 'ChatGLM') {
					this.listName = 'six';
					this.current = 3
					chat_num = 8
					uni.setStorageSync('tabStatus', 8)
					this.active_text = '1.5w算力/1000token'
				} else if (this.chatType == '通义千问') {
					this.listName = 'seven';
					this.current = 2
					chat_num = 10
					uni.setStorageSync('tabStatus', 10)
					this.chat_active = 7
					this.chat_pro = 'qwen-turbo';
					this.active_text = '2.4w算力/1000token'
					this.messageList[this.listName] = this.qw_one
				} else if (this.chatType == '360智脑') {
					this.listName = 'eight';
					this.current = 4
					chat_num = 12
					uni.setStorageSync('tabStatus', 12)
					this.active_text = '3.6w算力/1000token'
				}

				this.supplement = {
					chat_group_code: '',
					chat_type: chat_num,
					msg_list: [],
					session_code: ''
				}
				// console.log(e, 'gaib');
				this.radioValue = true

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
				this.imgList = []

			},

			toHistory() {
				uni.navigateTo({
					url: '/pages/user/history/history?active=0'
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
			
			version(index) {
				this.chat_active = index
				if(index == 1) {
					this.chat_pro = 'eb-instant';
					this.active_text = '2.4w算力/1000token'
					this.messageList[this.listName] = this.wx_one
				} else if(index == 2) {
					this.chat_pro = 'completions';
					this.active_text = '3.6w算力/1000token'
					this.messageList[this.listName] = this.wx_two
				} else if(index == 3) {
					this.chat_pro = 'completions_pro';
					this.active_text = '能力较强，36w算力/1000token'
					this.messageList[this.listName] = this.wx_three
				} else if(index == 4) {
					this.chat_pro = 'v1.1';
					this.active_text = '5.4w算力/1000token'
					this.messageList[this.listName] = this.xf_one
				} else if(index == 5) {
					this.chat_pro = 'v2.1';
					this.active_text = '10.8w算力/1000token'
					this.messageList[this.listName] = this.xf_two
				} else if(index == 6) {
					this.chat_pro = 'v3.1';
					this.active_text = '10.8w算力/1000token'
					this.messageList[this.listName] = this.xf_three
				} else if(index == 7) {
					this.chat_pro = 'qwen-turbo';
					this.active_text = '2.4w算力/1000token'
					this.messageList[this.listName] = this.qw_one
				} else if(index == 8) {
					this.chat_pro = 'qwen-plus';
					this.active_text = '6w算力/1000token'
					this.messageList[this.listName] = this.qw_two
				}
				
				if(this.messageList[this.listName].length > 1) {
					this.askShow = false
					this.session_code = this.messageList[this.listName][this.messageList[this.listName].length - 1].session_code
					this.chat_group_code = this.messageList[this.listName][this.messageList[this.listName].length - 1].chat_group_code
				} else {
					this.askShow = true
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
		}
	}
</script>

<style lang="less" scoped>
	@import "@/static/css/chat.less";

	.page-li {
		margin-top: 36upx !important;
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
</style>
<style>
	page {
		background: #f6f8fb;
	}
</style>