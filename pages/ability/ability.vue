<template>
	<view :class="[selectShow ? 'home' : '']" id="pag_top" style="background:#F6F8FB;">

		<view class="head_index">
			<view class="head_cont">
				<Title :title='"无忧秘书智脑"' />
			</view>
		</view>
		<view class="back_top" :style="{marginTop: keyHeight +'px'}">
			<view class="back_cont" :style="backImg">
			</view>
			<view class="web">电脑端访问ai.umi6.com 效率更高</view>
			<!-- 登录显示 -->
			<view class="manage_info">


				<view class="head_card">
					<image :src="log" mode="aspectFit" class="head_log"></image>
					<view class="head_r">
						<view class="head_rup">
							<view class="rup_title">AI能力</view>
							<view class="head_rb">一站式链接优质AIGC大模型</view>
						</view>
						<view class="rup_text" @click="toCoop"
							:style='{backgroundImage:`url(${headCardBgc})`,backgroundSize: "cover"}'>
							<view>商务合作</view>
							<view style="margin-top:6rpx;"><u-icon name="arrow-right" color="#666666"
									size="12"></u-icon></view>
						</view>
					</view>
				</view>
			</view>

		</view>

		<view class="notice" v-if="messageList.length > 0">
			<u-notice-bar :text="messageList" color="#1E211F" bgColor="#EBF1FF" mode="closable" direction="column"
				url="/childPage/notice/notice"></u-notice-bar>
		</view>
		<scroll-view scroll-y="true">
			<view style="padding: 20rpx;">
				<view class="chief">
					<view class="chief_item" @click="toChat"
						:style="{backgroundImage:`url(${chiefImg1})`,backgroundSize:'cover'}">
						<view style='margin-left: 24rpx;'>
							<view class="chief_title">问一问</view>
							<view class="chief_text">我将为你解答</view>
						</view>
					</view>
					<view class="chief_item" @click="toPainting"
						:style="{backgroundImage:`url(${chiefImg2})`,backgroundSize:'cover'}">
						<view style='margin-left: 24rpx;'>
							<view class="chief_title">画一画</view>
							<view class="chief_text">关键词生图</view>
						</view>
					</view>
					<view class="chief_item" @click='moreChange'
						:style="{backgroundImage:`url(${chiefImg3})`,backgroundSize:'cover'}">
						<view style='margin-left: 24rpx;'>
							<view class="chief_title">AI资讯</view>
							<view class="chief_text">精选AI资讯</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cont_chat">
				<view class="cont_ul">
					<view style="padding: 0 32rpx;">
						<view class="information_header">
							<view class="left">
								优选能力
							</view>
							<view class="right">
								<text @click='toMoreAbility()'>更多</text>
								<u-icon size="20upx" name="arrow-right"></u-icon>
							</view>
						</view>
					</view>
					<view class="user_icon">
						<view class="icon_list" @click="toModel">
							<image class="icon_img" :src='drawImg7' />
							<text class="icon_title">多模型对话</text>
						</view>
						<view class="icon_list" @click="toFigure">
							<image class="icon_img" :src='drawImg1' />
							<text class="icon_title">数字人</text>
						</view>
						<view class="icon_list" @click="toCamera">
							<image class="icon_img" :src='drawImg2' />
							<text class="icon_title">文本识别</text>
						</view>
						<view class="icon_list" @click="toDocument">
							<image class="icon_img" :src='drawImg3' />
							<text class="icon_title">文档对话</text>
						</view>
						<view class="icon_list" @click="toMatting">
							<image class="icon_img" :src='drawImg4' />
							<text class="icon_title">看图说话</text>
						</view>
						<view class="icon_list" @click="toMerge">
							<image class="icon_img" :src='drawImg5' />
							<text class="icon_title">人像融合</text>
						</view>
						<view class="icon_list" @click="toPayServer">
							<image class="icon_img" :src='drawImg5' />
							<text class="icon_title">服务器购买</text>
						</view>
						<view class="icon_list" @click="toRepository">
							<image class="icon_img" :src='drawImg17' />
							<text class="icon_title">AI智能体</text>
						</view>
					</view>


					<!-- <view class="banner" @click="myDistribution">
						<image class="banner_img" :src='bannerImg' />
					</view> -->
				</view>
			</view>


			<!-- 产品入口 -->
			<view class="prod">
				<!-- ai对话 -->
				<view class="prod_chat">
					<view class="information_header">
						<view class="left">
							对话中心
						</view>
						<view class="right">
							<text @click='toMoreChat()'>更多</text>
							<u-icon size="20upx" name="arrow-right"></u-icon>
						</view>
					</view>
					<view class="chat_cont">
						<!-- 无忧秘书 -->
						<view class="cont_li" @click="toChat">
							<view class="li_left">
								<image class="li_img" :src='wyImg' />
							</view>
							<view class="li_right">
								<text class="right_t">无忧秘书</text>
								<text class="right_b">先进AI，无限创意</text>
							</view>
						</view>
						<!-- 文心一言 -->
						<view class="cont_li" @click="goToChat(4)">
							<view class="li_left">
								<image class="li_img" :src='wenxinImg' />
							</view>
							<view class="li_right">
								<text class="right_t">文心一言</text>
								<text class="right_b">百度新一代语言大模型</text>
							</view>
						</view>
						<!-- 讯飞星火-->
						<view class="cont_li" @click="goToChat(5)">
							<view class="li_left">
								<image class="li_img" :src='xunfeiImg' />
							</view>
							<view class="li_right">
								<text class="right_t">讯飞星火</text>
								<text class="right_b">科大讯飞推出的新一代认知智能大模型</text>
							</view>
						</view>
						<!-- 通义千问-->
						<view class="cont_li" @click="goToChat(10)">
							<view class="li_left">
								<image class="li_img" :src='qianwenImg' />
							</view>
							<view class="li_right">
								<text class="right_t">通义千问</text>
								<text class="right_b">阿里巴巴集团推出的大语言模型</text>
							</view>
						</view>
						<!-- 360智脑-->
						<view class="cont_li" @click="goToChat(12)">
							<view class="li_left">
								<image class="li_img" :src='zhinaoImg' />
							</view>
							<view class="li_right">
								<text class="right_t">360智脑</text>
								<text class="right_b">由360集团推出的认知型通用大模型</text>
							</view>
						</view>
						<!-- ChatGLM-->
						<view class="cont_li" @click="goToChat(8)">
							<view class="li_left">
								<image class="li_img" :src='zhipuImg' />
							</view>
							<view class="li_right">
								<text class="right_t">ChatGLM</text>
								<text class="right_b">由智谱AI推出的千亿参赛对话大模型</text>
							</view>
						</view>

					</view>
				</view>

				<!-- ai绘画 -->
				<view class="prod_chat">
					<view class="information_header">
						<view class="left">
							绘画中心
						</view>
						<view class="right">
							<text @click='toMoreDraw'>更多</text>
							<u-icon size="20upx" name="arrow-right"></u-icon>
						</view>
					</view>
					<view class="chat_cont">
						<!-- 无忧秘书 -->
						<view class="cont_li" @click="toPainting">
							<view class="li_left">
								<image class="li_img" :src='wyImg' />
							</view>
							<view class="li_right">
								<text class="right_t">无忧秘书</text>
								<text class="right_b">先进AI，无限创意</text>
							</view>
						</view>
						<!-- 通义万相 -->
						<view class="cont_li" @click="goToDraw(13)">
							<view class="li_left">
								<image class="li_img" :src='qianwenImg' />
							</view>
							<view class="li_right">
								<text class="right_t">通义万相</text>
								<text class="right_b">一个不断进化的AI艺术创作大模型</text>
							</view>
						</view>
						<!-- 百度绘画-->
						<view class="cont_li" @click="goToDraw(3)">
							<view class="li_left">
								<image class="li_img" :src='wenxinImg' />
							</view>
							<view class="li_right">
								<text class="right_t">百度绘画</text>
								<text class="right_b">AI一下，文字成画将创意变成创作</text>
							</view>
						</view>
						<!-- 火山引擎-->
						<view class="cont_li" @click="goToDraw(14)">
							<view class="li_left">
								<image class="li_img" :src='huoshanImg' />
							</view>
							<view class="li_right">
								<text class="right_t">火山引擎</text>
								<text class="right_b">火山方舟推出的大模型服务，文生图</text>
							</view>
						</view>

					</view>
				</view>

				<!-- AI工具集 -->
				<view class="prod_chat">
					<view class="information_header">
						<view class="left">
							AI工具集
						</view>
						<view class="right">
							<text @click='toAssemble'>更多</text>
							<u-icon size="20upx" name="arrow-right"></u-icon>
						</view>
					</view>
					<view class="chat_cont">
						<!-- 对话模型 -->
						<view class="cont_li" @click="toMoreChat">
							<view class="li_left">
								<image class="li_img" :src='tool1' />
							</view>
							<view class="li_right">
								<text class="right_t">对话模型</text>
								<text class="right_b">多种对话模型任意选择</text>
							</view>
						</view>
						<!-- 绘画模型 -->
						<view class="cont_li" @click="toMoreDraw">
							<view class="li_left">
								<image class="li_img" :src='tool2' />
							</view>
							<view class="li_right">
								<text class="right_t">绘画模型</text>
								<text class="right_b">多种绘画模型任意选择</text>
							</view>
						</view>
						<!-- 图片处理-->
						<view class="cont_li" @click="goToMorePic">
							<view class="li_left">
								<image class="li_img" :src='chest1' />
							</view>
							<view class="li_right">
								<text class="right_t">图片处理</text>
								<text class="right_b">高效处理图片能力合集</text>
							</view>
						</view>
						<!-- 视频处理-->
						<view class="cont_li" @click="goToMoreVideo">
							<view class="li_left">
								<image class="li_img" :src='chest3' />
							</view>
							<view class="li_right">
								<text class="right_t">视频处理</text>
								<text class="right_b">高效处理视频能力合集</text>
							</view>
						</view>

						<!-- 语音合成-->
						<!-- <view class="cont_li" @click="toSpeech">
							<view class="li_left">
								<image class="li_img" :src='tool3' />
							</view>
							<view class="li_right">
								<text class="right_t">语音合成</text>
								<text class="right_b">根据文字合成语音</text>
							</view>
						</view> -->
						<!-- 文档对话-->
						<view class="cont_li" @click="toDocument">
							<view class="li_left">
								<image class="li_img" :src='tool4' />
							</view>
							<view class="li_right">
								<text class="right_t">文档对话</text>
								<text class="right_b">上传文档进行文档知识对话</text>
							</view>
						</view>

					</view>
				</view>

				<!-- 其他工具 -->
				<view class="prod_chat" id="chat_opa">
					<view class="information_header">
						<view class="left">
							AI超级能力
						</view>
						<view class="right">
							<text @click='toMoreTool()'>更多</text>
							<u-icon size="20upx" name="arrow-right"></u-icon>
						</view>
					</view>

					<view class="chat_cont">
						<!-- 多模型对话 -->
						<view class="cont_li" @click="toModel">
							<view class="li_left">
								<image class="li_img" :src='drawImg7' />
							</view>
							<view class="li_right">
								<text class="right_t">多模型对话</text>
								<text class="right_b">沉浸式体验群聊场景</text>
							</view>
						</view>
						<!-- 语音对讲 -->
						<!-- <view class="cont_li" @click="toIntercom">
							<view class="li_left">
								<image class="li_img" :src='drawImg6' />
							</view>
							<view class="li_right">
								<text class="right_t">语音对讲</text>
								<text class="right_b">智能语音你问我答</text>
							</view>
						</view> -->
						<!-- 声音克隆 -->
						<view class="cont_li" @click="toClone">
							<view class="li_left">
								<image class="li_img" :src='drawImg16' />
							</view>
							<view class="li_right">
								<text class="right_t">声音克隆</text>
								<text class="right_b">根据需求定制专属声音</text>
							</view>
						</view>
						<!-- 数字人-->
						<view class="cont_li" @click="toFigure">
							<view class="li_left">
								<image class="li_img" :src='otherImg6' />
							</view>
							<view class="li_right">
								<text class="right_t">虚拟数字人</text>
								<text class="right_b">定制属于你的专属形象</text>
							</view>
						</view>
						<!-- 音视频转文字 -->
						<view class="cont_li" @click="toVoice">
							<view class="li_left">
								<image class="li_img" :src='otherImg1' />
							</view>
							<view class="li_right">
								<text class="right_t">音视频转写</text>
								<text class="right_b">音频、视频快速转写文字</text>
							</view>
						</view>

						<!-- 看图说话-->
						<view class="cont_li" @click="toDiscern">
							<view class="li_left">
								<image class="li_img" :src='otherImg2' />
							</view>
							<view class="li_right">
								<text class="right_t">看图说话</text>
								<text class="right_b">识别图片中的内容信息</text>
							</view>
						</view>

					</view>
				</view>

				<!-- ai实验室 -->
				<view class="prod_chat">
					<view class="information_header">
						<view class="left">
							实验能力
						</view>
						<view class="right">
							<text @click='toMoreExperiment()'>更多</text>
							<u-icon size="20upx" name="arrow-right"></u-icon>
						</view>
					</view>
					<view class="chat_cont">
						<!-- AI35 -->
						<view class="cont_li" @click="goToLab(0)">
							<view class="li_left">
								<image class="li_img" :src='labImg1' />
							</view>
							<view class="li_right">
								<text class="right_t">AI35</text>
								<text class="right_b">语言大模型3.5版本，语义理解不错</text>
							</view>
						</view>
						<!-- AI40-->
						<view class="cont_li" @click="goToLab(1)">
							<view class="li_left">
								<image class="li_img" :src='labImg2' />
							</view>
							<view class="li_right">
								<text class="right_t">AI40</text>
								<text class="right_b">语言大模型4.0版本语义理解升级版</text>
							</view>
						</view>
						<!-- Claude-->
						<view class="cont_li" @click="goToLab(7)">
							<view class="li_left">
								<image class="li_img" :src='labImg3' />
							</view>
							<view class="li_right">
								<text class="right_t">Claude</text>
								<text class="right_b">大语言模型Claude语言理解一般</text>
							</view>
						</view>
						<!-- Stable Diffusion -->
						<view class="cont_li" @click="goDrawLab(9)">
							<view class="li_left">
								<image class="li_img" :src='labImg5' />
							</view>
							<view class="li_right">
								<text class="right_t">Stable Diffusion</text>
								<text class="right_b">SD大模型，较强的文生图、图生图能力</text>
							</view>
						</view>
						<!-- Midjouney-->
						<view class="cont_li" @click="goDrawLab(6)">
							<view class="li_left">
								<image class="li_img" :src='labImg4' />
							</view>
							<view class="li_right">
								<text class="right_t">Midjourney</text>
								<text class="right_b">支持文生图，具有较好语言理解能力</text>
							</view>
						</view>
						<!-- DALL.E-3-->
						<view class="cont_li" @click="goDrawLab(15)">
							<view class="li_left">
								<image class="li_img" :src='labImg1' />
							</view>
							<view class="li_right">
								<text class="right_t">DALL.E-3</text>
								<text class="right_b">可以通过文字来完美展示和控制画面</text>
							</view>
						</view>

					</view>
				</view>

				<!-- ai资讯 -->
				<view class="information" v-if="aiInforList.length > 0">
					<view class="information_header">
						<view class="left">
							AI资讯
						</view>
						<view class="right">
							<text @click='moreChange'>更多</text>
							<u-icon size="20upx" name="arrow-right"></u-icon>
						</view>
					</view>
					<view v-for="(item, index) in aiInforList" @click='contentChange(item.message_id)'
						:key="item.message_id">
						<view class="item_infor" v-if="index < 3">
							<view class="left">
								<view class="content">
									{{item.title}}
								</view>
								<view class="bottom">
									<text class="time">{{ item.create_time ? item.create_time.slice(0,10) : '' }}</text>
									<view class="right">
										<text class="page_view">阅读{{item.read_count}}</text>
										<text class="like">点赞{{item.like_count}}</text>
									</view>
								</view>
							</view>
							<view class="right" v-if="item.image">
								<image class="img" :src="item.image" mode="widthFix" />
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="top_btn" v-if="isCreat" @click="toTop">
				<image class="icon_img" :src='topImg' />
			</view>
		</scroll-view>

	</view>
</template>

<script>
	// import { type_list, prompts } from '@/apis/chat.js'
	import {
		getIndustry,
		getOccupation,
		getSec,
		getDuration,
		getExpertise,
		getModules,
		getMessage,
		getTab,
		getTutor,
		getMe,
		getAllMe
	} from '@/apis/user.js'
	import {
		getapplication
	} from '@/apis/home.js'
	// import Title from "@/pages/title/index.vue"
	export default {
		// components: {
		// 	Title,

		// },
		data() {
			return {
				drawImg17: global.baseImg + '/xcx/com/message_center/AI知识库icon.png',
				chiefImg1: global.baseImg + '/xcx/com/message_center/问一问.png',
				chiefImg2: global.baseImg + '/xcx/com/message_center/画一画.png',
				chiefImg3: global.baseImg + '/xcx/com/message_center/AI资讯.png',

				messageList: [], // 消息公告
				isRead: false,
				active: 8, // 会话切换
				inputValue: '',
				current: 0, //助理切换
				chatType: 'ChatGLM',
				selectShow: false,
				placeValue: '输入你想问的问题',
				AiList: [{
					id: 1,
					name: '对话'
				}, {
					id: 2,
					name: '绘画'
				}, ],

				loading: false,
				promptsList: [],
				instructName: [],
				show: false,
				content: "",
				loadingType: 0,
				page_no: 1,
				page_count: 10,
				pageTotal: 0,

				keyHeight: 0,
				// topHeight: 0,
				isTop: false,

				AiSelect: 0,
				isLoad: false,
				tabList: [],

				infoImg: global.baseImg + '/xcx/a18146ee-df32-4ecd-94d4-779dc78e47ab.jpg',
				productImg: global.baseImg + '/xcx/0f78ff2c-ef4e-44a7-9874-8ed66533f18c.jpg',
				newsImg: global.baseImg + '/xcx/086158e9-d48d-4e7d-80d5-98b10d68837d.jpg',
				knowImg: global.baseImg + '/xcx/6322b018-c738-42dd-82ab-c68dcb699e72.jpg',
				companyInfoImg: 'background-image: url("' + global.baseImg +
					'/xcx/86a3d5f4-1184-4a31-8012-85fa8ce84d0a.jpg")',

				companyName: '',
				phone: '',
				job: '',

				chatImg: global.baseImg + '/xcx/com/message_center/AI%E5%AF%B9%E8%AF%9D.png',
				drawImg1: global.baseImg + '/xcx/com/message_center/功能数字人定制.png',
				drawImg2: global.baseImg + '/xcx/com/message_center/功能视觉智能馆.png',
				drawImg3: global.baseImg + '/xcx/com/message_center/功能文档对话.png',
				drawImg4: global.baseImg + '/xcx/com/message_center/功能人像抠图.png',
				drawImg5: global.baseImg + '/xcx/com/message_center/功能人像融合.png',


				drawImg6: global.baseImg + '/xcx/com/message_center/speak.png',
				drawImg7: global.baseImg + '/xcx/com/message_center/model.png',
				drawImg8: global.baseImg + '/xcx/com/message_center/语言对讲.png',
				drawImg16: global.baseImg + '/xcx/com/message_center/nl声音克隆.png',

				//AI工具集
				tool1: global.baseImg + '/xcx/com/message_center/对话模型.png',
				tool2: global.baseImg + '/xcx/com/message_center/绘画模型.png',
				tool3: global.baseImg + '/xcx/com/message_center/语音合成.png',
				tool4: global.baseImg + '/xcx/com/message_center/文档对话能力.png',


				// AI百宝箱
				chest1: global.baseImg + '/xcx/com/message_center/bbxztxt.png',
				chest2: global.baseImg + '/xcx/com/message_center/bbxrxkth.png',
				chest3: global.baseImg + '/xcx/com/message_center/bbxtyspsc.png',
				chest4: global.baseImg + '/xcx/com/message_center/bbxspqzm.png',
				chest5: global.baseImg + '/xcx/com/message_center/bbxspqbz.png',
				chest6: global.baseImg + '/xcx/com/message_center/bbxtpcj.png',

				voiceImg: global.baseImg + '/xcx/bea21e5b-66d2-44ec-a2c3-20349bb7f2db.jpg',
				photoImg: global.baseImg + '/xcx/95c9c620-7748-4db3-b40e-69d9c2503eb6.jpg',
				cameraImg: global.baseImg + '/xcx/c7ecda32-d1f4-422a-96dc-e6c960898877.jpg',
				babyImg: global.baseImg + '/xcx/5e617b80-a054-4a3e-9305-4d74366d5405.jpg',
				figureImg: global.baseImg + '/xcx/aca1e358-dd34-4c65-b9cb-e57da931cc27.jpg',
				roomImg: global.baseImg + '/xcx/com/message_center/AI%E8%AF%86%E4%B8%87%E7%89%A9.png',

				userImg: global.baseImg + '/xcx/68a7d60b-3ef7-46c1-86f7-1eac0d21e814.jpg',
				roleImg: global.baseImg + '/xcx/92b66bbe-9fa6-4cb1-b1d2-8df39e2e4d0a.jpg',
				lifeImg: global.baseImg + '/xcx/1205c8fe-a2ab-44ef-ac5e-ca031aad4df9.jpg',
				workImg: global.baseImg + '/xcx/37bcc337-b8a0-48aa-8e5c-6db9771b7645.jpg',
				pcrImg: global.baseImg + '/xcx/7e716da2-d4f8-410b-a57f-aba7d7ad403e.jpg',

				bannerImg: global.baseImg + '/xcx/3c3c6be3-990e-46f6-8e10-7910451e3c3f.jpg',

				backImg: 'background-image: url("' + global.baseImg + '/xcx/com/message_center/banner.png")',
				xzImg: 'background-image: url("' + global.baseImg +
					'/xcx/com/message_center/%E9%81%87%E4%BA%8B%E4%B8%8D%E5%86%B3%E9%97%AE%E8%87%AA%E5%B7%B1.png")',
				headImg: global.baseImg + '/xcx/com/message_center/AI%E5%9B%BE%E6%A0%87.png',
				creatImg: global.baseImg + '/xcx/com/message_center/%E5%88%9B%E5%BB%BA.png',
				addImg: global.baseImg + '/xcx/com/message_center/Frame%20427320149.png',
				glImg: global.baseImg + '/xcx/com/message_center/%E7%AE%A1%E7%90%86.png',
				editImg: global.baseImg + '/xcx/com/message_center/edit.png',
				tipImg: global.baseImg + '/xcx/com/message_center/Frame%20427320201.png',
				changeImg: global.baseImg + '/xcx/com/message_center/%E7%BC%96%E8%BE%91.png',

				isCreat: false,
				exArr1: [],
				exArr2: [],
				allMentor: [],
				isLogin: false,
				meList: '',
				otherList: [],

				// ai资讯
				aiInforList: [],
				wenxinImg: global.baseImg + '/xcx/com/message_center/%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80.png',
				xunfeiImg: global.baseImg + '/xcx/com/message_center/%E8%AE%AF%E9%A3%9E.png',
				qianwenImg: global.baseImg + '/xcx/com/message_center/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE1.png',
				zhinaoImg: global.baseImg + '/xcx/com/message_center/360%E6%99%BA%E8%84%91.png',
				huoshanImg: global.baseImg + '/xcx/com/message_center/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE.png',
				zhipuImg: global.baseImg + '/xcx/com/message_center/%E6%99%BA%E6%99%AE.png',
				wyImg: global.baseImg + '/xcx/com/message_center/能力log.png',

				// AI实验室
				labImg1: global.baseImg + '/xcx/com/message_center/30.png',
				labImg2: global.baseImg + '/xcx/com/message_center/40.png',
				labImg3: global.baseImg + '/xcx/com/message_center/%E5%85%8B%E9%B2%81%E5%BE%B7.png',
				labImg4: global.baseImg + '/xcx/com/message_center/%E6%99%BA%E6%99%AEAI.png',
				labImg5: global.baseImg + '/xcx/com/message_center/%E6%99%BA%E6%99%AEI.png',

				// 视觉体验馆
				vis1: global.baseImg + '/xcx/com/message_center/face.png',
				vis2: global.baseImg + '/xcx/com/message_center/face2.png',
				vis3: global.baseImg + '/xcx/com/message_center/face3.png',
				vis4: global.baseImg + '/xcx/com/message_center/face4.png',
				vis5: global.baseImg + '/xcx/com/message_center/face5.png',
				vis6: global.baseImg + '/xcx/com/message_center/face6.png',

				otherImg1: global.baseImg + '/xcx/com/message_center/445.png',
				otherImg2: global.baseImg + '/xcx/com/message_center/555.png',
				otherImg3: global.baseImg + '/xcx/com/message_center/%E5%9B%BE%E7%94%9F.png',
				otherImg4: global.baseImg + '/xcx/com/message_center/%E6%96%87%E6%9C%AC%E8%AF%86%E5%88%AB.png',
				otherImg5: global.baseImg + '/xcx/com/message_center/%E5%BD%A9%E8%B6%85%E5%AE%9D%E5%AE%9D.png',
				otherImg6: global.baseImg + '/xcx/com/message_center/%E6%95%B0%E5%AD%97%E4%BA%BA%E5%AE%9A%E5%88%B6.png',
				otherImg7: global.baseImg + '/xcx/com/message_center/%E6%96%87%E6%A1%A3%E5%AF%B9%E8%AF%9D.png',
				qhImg: global.baseImg + '/xcx/com/message_center/Frame%20427320305.png',
				topImg: global.baseImg + '/xcx/com/message_center/dingbu.png',
				meImg: 'background-image: url("' + global.baseImg + '/xcx/com/message_center/bg1.png")',

				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				log: global.baseImg + '/xcx/com/message_center/Frame%20427320411.png',
				headCardBgc: global.baseImg + '/xcx/com/message_center/商务合作.png'
			}
		},

		onLoad(query) {

			if (query.q) {
				let scene = decodeURIComponent(query.q);
				let val = this.getUrlDataFN(scene);
				// console.log(val)
				uni.setStorageSync('loginCode', val);
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				}
			}
			// console.log(uni.getStorageSync('loginCode'),885)
		},

		onShow() {

			setTimeout(() => {
				this.getTab()
				this.getapplication();
				this.getMessageList();
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					this.headImg = global.baseImg + '/xcx/com/message_center/Frame%20427320149.png'
					this.isLogin = false
					this.getTutor();
				} else {
					this.getMe()
					this.isLogin = true
				}
			}, 800)



			let that = this;
			const head_index = uni.createSelectorQuery().select(".head_index")
			that.$nextTick(() => {
				head_index.boundingClientRect(function(
					res) { //定位到你要的class的位置

					// console.log(res.height, 410)
					that.keyHeight = res.height;
					// that.topHeight = res.height + 40
				}).exec()
			})
		},

		onHide() {
			this.select_text = 0;
			this.current = 0;
		},

		onPageScroll(e) {
			if (e.scrollTop > 650) {
				this.isCreat = true
			} else {
				this.isCreat = false
			}
		},

		methods: {
			toRepository() {
				uni.navigateTo({
					url: '/childCont/repository/repository'
				})
			},
			// 获取ai资讯列表
			async getapplication() {

				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));

				let data = {
					user_id: userInfo.user_id,
					message_type: 2
				}
				const res = await getapplication(data)
				this.aiInforList = res.data
				// console.log(11111111111111111111111111111111111,this.aiInforList);

			},
			moreChange() {
				uni.navigateTo({
					url: '/childPage/news/information'
				})
			},
			contentChange(id) {
				uni.navigateTo({
					url: '/childPage/news/information_content?message_id=' + id,
				})
			},

			// 获取内荐导师列表
			getTutor() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let val = {
					// 'user_id': userInfo.user_id,
					'is_built_in': '1',
				}
				getTutor(val).then(res => {
					if (res.code == 20000) {
						this.exArr1 = [];
						this.exArr2 = [];
						if (res.data.length > 0) {
							res.data.map((item, index) => {
								if (index < 8) {
									this.exArr1.push(item);
								} else {
									this.exArr2.push(item);
								}
							})
						}
						// console.log(this.exArr1,222)
						// console.log(this.exArr2,333)
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取导师失败');
				})
			},

			// 获取我的信息列表
			getMe() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let val = {
					'user_id': userInfo.user_id,
				}
				getMe(val).then(res => {
					if (res.code == 20000) {
						if (res.data.length > 0) {
							let meArr = []
							res.data.map((item, index) => {
								meArr.push(item.me_id)
							})
							this.getAllMe(meArr)
						} else {
							this.$api.msg('登录信息已过期，请重新登录')
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/login/login',
								})
							}, 800)
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取导师失败');
				})
			},

			//获取我的所有信息
			getAllMe(arr) {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let val = {
					'me_ids': JSON.stringify(arr),
				}
				getAllMe(val).then(res => {
					if (res.code == 20000) {
						if (res.data.length > 0) {
							let newrr = [{}, {}, {}, {}, {}, {}, {}, {}]
							res.data.forEach(str => {
								str.tutor.forEach(item => {
									if (JSON.stringify(item) != '{}') {
										let sort = item.sort;
										newrr[sort] = item
									}
								})
								str.tutor = newrr
							})
							this.allMentor = res.data
							this.meList = res.data[0].me;
							this.otherList = res.data[0].tutor
							// console.log(this.allMentor, 5556)
							// console.log(this.meList,3333)
							// console.log(this.otherList,5652)
						} else {
							this.$api.msg('登录信息已过期，请重新登录')
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/login/login',
								})
							}, 800)
						}

					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取导师失败');
				})
			},


			// 获取公告列表
			getMessageList() {
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
								this.messageList.push(ele.title)

							}
							uni.setStorageSync('noticeInfo', this.messageList)
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
				// console.log(urlObj)
				return urlObj
			},

			//切换对话
			version(num) {
				this.active = num;
				if (num == 0) {
					this.chatType = 'AI35';
					// this.placeValue = '我是领先的AI35大语言AI模型，现在为您服务！'
					this.placeValue = '输入你想问的问题'
				} else if (num == 1) {
					this.chatType = 'AI40';
					// this.placeValue = '我是前沿的AI40大语言AI模型，为您提供专业便捷的启智服务！'
					this.placeValue = '输入你想问的问题'
				} else if (num == 2) {
					this.chatType = 'DALL·E2';
					// this.placeValue = '我是DALL·E2以智能为笔，以创意为墨现在为您服务！'
					this.placeValue = '输入你绘图的内容'
				} else if (num == 3) {
					this.chatType = '百度绘画';
					// this.placeValue = '我是百度绘画将最前沿科技与艺术的完美融合。现在为您服务'
					this.placeValue = '输入你绘图的内容'
				} else if (num == 4) {
					this.chatType = '文心一言';
					// this.placeValue = '我是百度全新一代知识增强大语言模型，文心一言大模型'
					this.placeValue = '输入你想问的问题'
				} else if (num == 5) {
					this.chatType = '讯飞星火';
					// this.placeValue = '我是讯飞星火大模型以中文为核心的，新一代认知智能大模型'
					this.placeValue = '输入你想问的问题'
				} else if (num == 6) {
					this.chatType = 'Midjourney';
					// this.placeValue = '我是Midjourney，现在为您服务！为确保更高的准确性，请使用英文输入。'
					this.placeValue = '输入你绘图的内容'
				} else if (num == 7) {
					this.chatType = 'Claude';
					// this.placeValue = '我是Claude大型语言模型。'
					this.placeValue = '输入你想问的问题'
				} else if (num == 8) {
					this.chatType = 'ChatGLM';
					// this.placeValue = '我是ChatGLM千亿对话模型。'
					this.placeValue = '输入你想问的问题'
				} else if (num == 9) {
					this.chatType = 'Stable Diffusion';
					// this.placeValue = '我是Stable Diffusion探索新的思想媒介，扩展人类的想象力'
					this.placeValue = '输入你绘图的内容'
				} else if (num == 10) {
					this.chatType = '通义千问';
					// this.placeValue = '我是Claude大型语言模型。'
					this.placeValue = '输入你想问的问题'
				} else if (num == 11) {
					this.chatType = '商汤日日新';
					// this.placeValue = '我是Claude大型语言模型。'
					this.placeValue = '输入你想问的问题'
				}

			},

			// 重置
			clear() {
				this.selectDone1 = 0
				this.selectDone2 = -1
				this.selectDone3 = -1
				this.selectDone4 = -1
				this.selectDone5 = -1
				this.zyList = []
				this.lxList = []
				this.sjList = []
				this.dwList = []
				this.select_text2 = 0
				this.select_text3 = 0
				this.select_text4 = 0
				this.select_text5 = 0
				this.selectShow = false

				this.zy_name = '职业'
				this.lx_name = '类型'
				this.sj_name = '从业时间'
				this.dw_name = '地位'
				if (this.select_text == this.hyList[0].industry_id) {
					let data = {
						industry_id: this.hyList[0].industry_id
					}
					this.getOccupation(data)
					this.getModules(data)
				} else {
					this.select_text = this.hyList[0].industry_id
					this.hy_name = this.hyList[0].name
				}
			},

			// 切换顶部对话
			AiChange(e) {
				let id = e.id;
				if (id == 1) {
					this.AiSelect = 0
					this.active = 8 // 默认选中文心一言
					this.chatType = 'ChatGLM';
					this.placeValue = '输入你想问的问题'
				} else {
					this.AiSelect = 1
					this.active = 9 // 默认选中Stable Diffusion绘画
					this.chatType = 'Stable Diffusion';
					this.placeValue = '输入你绘图的内容'
				}
			},

			//AI一下
			goToChat(num) {
				uni.setStorageSync('tabStatus', num)
				uni.navigateTo({
					url: "/childPage/chat/chat"
				})

			},

			// AI实验室
			goToLab(num) {

				uni.setStorageSync('tabStatus', num)
				uni.navigateTo({
					url: "/childPage/laboratory/laboratory"
				})

			},
			goDrawLab(num) {
				uni.setStorageSync('labActive', num)
				uni.navigateTo({
					url: "/childPage/laboratory/labDraw"
				})
			},

			goToDraw(num) {
				uni.setStorageSync('active', num)
				uni.navigateTo({
					url: "/childPage/draw/draw"
				})

			},

			selectTip(val) {

				let data = {
					'current': val,
				}

				uni.setStorageSync('applyInfo', data);
				uni.switchTab({
					url: "/pages/apply/apply"
				})
			},

			// toAd() {
			// 	uni.navigateTo({
			// 		url: '/pages/notice/notice'
			// 	})
			// },

			// 进入资产体验中心
			goCompany() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/company/add_info?companyName=' + this.companyName + '&phone=' + this
							.phone + '&job=' + this.job,
					})
				}
			},

			toChat() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			toPainting() {
				uni.switchTab({
					url: '/pages/painting/painting'
				})
			},
			toDraw() {
				uni.navigateTo({
					url: '/pages/draw/draw'
				})
			},
			toApply() {
				uni.switchTab({
					url: '/pages/apply/apply'
				})
			},

			toVoice() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childPage/voice/voice_index',
					})
				}
			},

			toPhoto() {
				uni.navigateTo({
					url: '/pages/chat/camera?chatValue=' + '' + '&source=2'
				})
			},
			async toCamera() {
				let that = this;
				uni.chooseImage({
					count: 1,
					// mediaType: ['image'],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'],
					success(res) {
						// console.log(res.tempFiles)
						console.log(res, 589)
						const tempFilePaths = res.tempFilePaths[0];
						const size = res.tempFiles[0].size;
						if (size > 5242880) { // 图片文件最大只能上传5M
							that.$api.msg('该文件已超过5M，不能上传')
							return
						}
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
								if (imgData.code == 20000) {
									let url = imgData.data.new_url
									// that.imgList.push(url)
									let val = {
										'chatValue': that.chatValue,
										'imgList': that.imgList
									}
									// console.log(val,555557)
									uni.setStorageSync('cameraInfo', val)
									uni.switchTab({
										url: '/pages/index/index'
									})
									that.isClick = true
								} else {
									that.isClick = true
									that.$api.msg(imgData.msg)
								}
							},
							fail: (res) => {
								that.isClick = true
								that.$api.msg('上传失败')
							}
						});
					}
				})
			},

			toDoppler() {

				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childPage/doppler/doppler',
					})
				}
			},

			toFigure() {
				uni.navigateTo({
					url: '/childCont/figure/figure',
				})
				// let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				// if (userInfo.role == 'guess') {
				// 	uni.navigateTo({
				// 		url: '/pages/login/login',
				// 	})
				// } else {
				// 	uni.navigateTo({
				// 		url: '/childCont/figure/figure',
				// 	})
				// }
			},

			toDiscern() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childPage/discern/discern',
					})
				}
			},

			toRoom() {
				uni.navigateTo({
					url: '/childPage/laboratory/laboratory'
				})
			},
			//视觉体验馆
			toVision() {
				uni.navigateTo({
					url: '/childPage/vision/vision'
				})
			},

			//人脸识别
			toFace() {
				uni.navigateTo({
					url: '/childPage/vision/merge'
				})
			},

			toAge() {
				uni.navigateTo({
					url: '/childPage/vision/myEge'
				})
			},

			toBeauty() {
				uni.navigateTo({
					url: '/childPage/vision/beauty'
				})
			},

			toCaricature() {
				uni.navigateTo({
					url: '/childPage/vision/caricature'
				})
			},

			toMatting() {
				uni.navigateTo({
					url: '/childPage/vision/matting'
				})
			},

			toText() {
				uni.navigateTo({
					url: '/childPage/vision/textRecognize'
				})
			},

			toOldphoto() {
				uni.navigateTo({
					url: '/childPage/vision/oldphoto'
				})
			},
			toImgemax() {
				uni.navigateTo({
					url: '/childPage/vision/imgemax'
				})
			},
			toGames3d() {
				uni.navigateTo({
					url: '/childPage/vision/games3d'
				})
			},
			toPeoplevfx() {
				uni.navigateTo({
					url: '/childPage/vision/peoplevfx'
				})
			},
			toFacemax() {
				uni.navigateTo({
					url: '/childPage/vision/facemax'
				})
			},
			toHair() {
				uni.navigateTo({
					url: '/childPage/vision/hair'
				})
			},

			myDistribution() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childPage/distribution/distribution',
					})
				}

			},
			// AI百宝箱
			toRetouch() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/chest/retouch'
					})
				}

			},

			toCartoon() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/chest/cartoon'
					})
				}

			},
			toUniversal() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/chest/universal'
					})
				}

			},
			toSubtitles() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/chest/subtitles'
					})
				}

			},
			toSymbol() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/chest/symbol'
					})
				}

			},
			toTailor() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/chest/tailor'
					})
				}

			},

			// 获取助理列表
			getTab() {
				getTab().then(res => {
					if (res.code == 20000) {
						this.tabList = res.data
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取失败');
				})
			},

			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},

			addMentor(id, index, tutor_id) {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childPage/mentor/mentor_list?sort=' + index + '&me_id=' + id + '&tutor_id=' +
							tutor_id,
					})
				}

			},

			toCreate() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childPage/mentor/add_mentor',
					})
				}

			},

			toManage() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childPage/mentor/manage_list',
					})
				}
			},

			getAddress(index) {
				let className = '';
				switch (index) {
					case 0:
						className = 'circle1';
						break;
					case 1:
						className = 'circle2';
						break;
					case 2:
						className = 'circle3';
						break;
					case 3:
						className = 'circle4';
						break;
					case 4:
						className = 'circle5';
						break;
					case 5:
						className = 'circle6';
						break;
					case 6:
						className = 'circle7';
						break;
					case 7:
						className = 'circle8';
						break;
					default:
						className = ''
				}
				return className;
			},

			getCount(index) {
				let className = '';
				switch (index) {
					case 0:
						className = 'cont1';
						break;
					case 1:
						className = 'cont2';
						break;
					case 2:
						className = 'cont3';
						break;
					case 3:
						className = 'cont4';
						break;
					case 4:
						className = 'cont5';
						break;
					case 5:
						className = 'cont6';
						break;
					case 6:
						className = 'cont7';
						break;
					case 7:
						className = 'cont8';
						break;
					default:
						className = ''
				}
				return className;
			},

			mentorChat(url, text, me_id, tutor_id) {
				uni.navigateTo({
					url: '/childPage/mentor/mentor_chat?imgUrl=' + url + '&greet=' + text + '&me_id=' + me_id +
						'&tutor_id=' + tutor_id,
				})
			},

			//修改我的信息
			toDetail(id) {
				uni.navigateTo({
					url: '/childPage/mentor/add_mentor?me_id=' + id,
				})
			},

			//登录
			toLogin() {
				this.$api.msg('请登录后继续体验')
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				}, 800)

			},
			toSlove() {
				this.$api.msg('开发中')
			},

			toBottom() {
				//从当前位置到达目标位置
				uni.createSelectorQuery().select("#chat_opa").boundingClientRect(data => { //目标位置的节点：类或者id
					uni.createSelectorQuery().select("#pag_top").boundingClientRect(res => { //最外层盒子的节点：类或者id
						uni.pageScrollTo({
							duration: 100, //过渡时间
							scrollTop: data.top - res.top, //到达距离顶部的top值
						})
					}).exec()
				}).exec();
			},

			//回到顶部
			toTop() {
				uni.createSelectorQuery().select("#pag_top").boundingClientRect(res => { //最外层盒子的节点：类或者id
					uni.pageScrollTo({
						duration: 100, //过渡时间
						scrollTop: 0, //到达距离顶部的top值
					})
				}).exec()
			},

			toDocument() {
				uni.navigateTo({
					url: '/childPage/document/document_chat',
				})
			},
			toCoop() {
				uni.navigateTo({
					url: '/childPage/cooperate/cooperate'
				})
			},
			toChest() {
				this.$api.msg('开发中')
			},

			toMoreAbility() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/more_function/more_ability'
					})
				}
			},
			toMoreChat() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/more_function/more_chat'
					})
				}
			},
			toMoreDraw() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/more_function/more_draw'
					})
				}
			},
			toMoreChest() {
				uni.navigateTo({
					url: '/childCont/more_function/more_chest'
				})
				// let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				// if (userInfo.role == 'guess') {
				// 	uni.navigateTo({
				// 		url: '/pages/login/login',
				// 	})
				// } else {
				// uni.navigateTo({
				// 	url: '/childCont/more_function/more_chest'
				// })
				// }
			},
			toMoreExperiment() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/more_function/more_experiment'
					})
				}
			},
			toMoreTool() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/more_function/more_tool'
					})
				}
			},

			toMerge() {
				uni.navigateTo({
					url: '/childPage/vision/merge'
				})
			},
			toPayServer() {
				uni.navigateTo({
					url: '/childCont/server/server'
				})
			},

			toModel() {
				uni.navigateTo({
					url: '/childPage/multi_model/multi_model_next'
				})
			},

			goToMoreVideo() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/more_function/more_video'
					})
				}
			},
			goToMorePic() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childCont/more_function/more_pic'
					})
				}
			},

		}
	}
</script>
<style>
	page {
		background: #f6f8fB;
	}
</style>
<style lang="less" scoped>
	.home {
		height: 100vh;
		overflow: hidden;
	}

	.head_index {
		width: 100%;
		// height: 100upx;
		position: fixed;
		top: 0upx;
		background: rgba(239, 245, 255, 1);
		z-index: 999;
	}

	.head_cont {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// padding: 0upx 32upx;
	}

	.chat {
		padding: 0upx 30upx;
		// background: #fff;
		display: flex;
		align-items: center;
		flex-direction: column;

		// margin-bottom: 20upx;
		.chat_type {
			display: flex;
			align-items: center;
			// justify-content: space-around;
			flex-wrap: wrap;
			width: 100%;

			.tabs {
				width: 22%;
				background: #E0EEFF;
				border-radius: 6upx;
				padding: 8upx 0;
				font-style: normal;
				font-weight: 500;
				font-size: 28upx;
				line-height: 150%;
				color: #333;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 10upx 1.5%;
			}

			.active_tabs {
				width: 22%;
				background: #1F64FF;
				border-radius: 6upx;
				padding: 8upx 0;
				font-style: normal;
				font-weight: 500;
				font-size: 28upx;
				line-height: 150%;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 10upx 1.5%;
			}
		}

		.chat_text {
			width: 100%;
			padding: 10upx;
			border-radius: 12upx;
			background: #FFF;
			box-shadow: 0px 2px 10px 0px rgba(51, 51, 51, 0.10);
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 10upx 0;

			/deep/.u-input {
				padding: 12upx;
				width: 80%;
			}

			.chat_btns {
				width: 20%;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #1F64FF;
				border-radius: 12upx;
				line-height: 80upx;
				font-style: normal;
				font-weight: 500;
				font-size: 34upx;
				color: #fff;
			}

			.chat_btns:active {
				opacity: 0.5;
			}
		}


	}

	.select {
		padding: 10upx 0;
		background: #fff;

		.select_tab {
			padding: 0 10px;
		}

		.tab_tip {
			padding: 20upx;

			.tip_img {
				width: 56upx;
				height: 56upx;
			}

			.swiper {
				height: 270rpx;
			}

			.grid-text {
				font-size: 26upx;
				color: #333;
				padding: 10rpx 0 20rpx 0rpx;
				/* #ifndef APP-PLUS */
				box-sizing: border-box;
				/* #endif */
			}

			.active-grid-text {
				font-size: 26upx;
				color: #1F64FF;
				padding: 10rpx 0 20rpx 0rpx;
				/* #ifndef APP-PLUS */
				box-sizing: border-box;
				/* #endif */
			}
		}
	}

	.tab_line {
		padding: 20upx 0upx;
		border-bottom: 1upx solid #E6E6E8;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #fff;

		.line {
			display: flex;
			align-items: center;
			line-height: 40upx;
			padding: 10upx;

			.line_text {
				font-style: normal;
				font-weight: 400;
				font-size: 26upx;
				line-height: 40upx;
				color: #333;
			}

			.active_line_text {
				font-style: normal;
				font-weight: 400;
				font-size: 26upx;
				line-height: 40upx;
				color: #1F64FF;
				max-width: 100upx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				display: inline-block;
			}

			.line_img {
				width: 30upx;
				height: 30upx;
				// padding-left: 6upx;
			}
		}
	}

	.cont_mid {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15upx 30upx;
		height: 40px;
	}

	.cont_mids {
		display: flex;
		align-items: center;
		justify-content: space-between;
		// padding: 15upx 30upx;
		box-shadow: 0px -2px 10px rgba(51, 51, 51, 0.05);
		height: 40px;
		background: #fff;
	}

	.mid_btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		border-radius: 12upx;
		line-height: 40px;

	}

	.clear_img {
		width: 40upx;
		height: 40upx;
	}

	.clear_text {
		font-style: normal;
		font-weight: 500;
		font-size: 28upx;
		color: #999;
		margin-left: 10upx;
	}

	.mid_l {
		font-style: normal;
		font-weight: 400;
		font-size: 26upx;
		color: #333;
		/* line-height: 24px; */
	}

	.active_mid_l {
		font-style: normal;
		font-weight: 400;
		font-size: 26upx;
		color: #1F64FF;
		/* line-height: 24px; */
	}

	.mid_img {
		width: 40upx;
		height: 40upx;
		// padding-right: 10upx;
	}

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

	.top {
		width: 80upx;
		height: 80upx;
		position: fixed;
		bottom: 120upx;
		right: 70upx;

		.top_img {
			width: 80upx;
			height: 80upx;
		}
	}

	.top_type {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		padding: 10upx 0 20upx 0;

		.type_l {
			color: #333;
			font-size: 26upx;
			font-weight: 500;
			display: flex;
		}

		.type_m {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.type_r {
			color: #1F64FF;
			font-size: 26upx;
		}
	}

	.chat_btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #1F64FF;
		border-radius: 12upx;
		line-height: 90upx;
		font-style: normal;
		font-weight: 500;
		font-size: 34upx;
		color: #fff;
	}

	.chat_btn:active {
		opacity: 0.5;
	}

	.cont_chat {

		// padding: 30upx 0;
		// margin-bottom: 16upx;
		padding: 20upx 20upx 0 20upx;

		.cont_ul {
			padding: 22upx 0;
			background: #fff;
			border-radius: 14upx;

			.user_tit {
				color: #333;
				font-size: 30upx;
				font-style: normal;
				font-weight: 520;
				line-height: 150%;
				// margin-bottom: 15upx;
			}

			.user_icon {
				display: flex;
				// justify-content: space-around;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				padding: 0 30upx;

				.icon_list {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					margin: 10upx 0 20upx 0;
					width: 25%;

					.icon_img {
						width: 90upx;
						height: 90upx;
					}

					.icon_title {
						color: #000;
						font-size: 24upx;
						font-style: normal;
						font-weight: 400;
						line-height: 36upx;
						// margin-top: 12upx;
					}
				}
			}
		}

		.banner {
			padding: 20upx 30upx 0 30upx;

			.banner_img {
				width: 100%;
				height: 200upx;
			}
		}

	}

	.notice {
		padding: 20upx 20upx 0 20upx;
		border-radius: 10upx;
	}

	.back_top {

		.back_cont {
			width: 100%;
			height: 170upx;
			background-repeat: no-repeat;
			background-size: 100% 100%;
		}
	}

	.surround-box {
		position: absolute;
		top: 40%;
		left: 45%;
		width: 100upx;
		height: 100upx;
		// margin-left: -12upx;
		// margin-top: -20upx;
		border-radius: 50%;
		// background-color: #000;
	}

	.edit_img {
		width: 45upx;
		height: 45upx;
		position: absolute;
		top: -20upx;
		left: 75%;
		z-index: 10;
	}

	.center-point {
		position: absolute;
		top: 40%;
		left: 45%;
		width: 100upx;
		height: 100upx;
		margin-left: -20upx;
		margin-top: -40upx;
		border-radius: 50%;
		z-index: 99;
		// background-color: #000;
	}

	.circle {
		/* 这里一定要绝对定位，这样位置才能铺开来 */
		position: absolute;
		top: -40upx;
		left: -20upx;
		width: 100upx;
		height: 100upx;
		// line-height: 180upx;
		border-radius: 50%;
		text-align: center;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.circle1 {
		/* rotateZ控制方向，每个元素旋转45度，8个元素刚好360度。translateY控制每个元素距中心点的距离 */
		transform: rotateZ(45deg) translateY(220upx);
	}

	.cont1 {
		transform: rotateZ(-45deg);
		width: 90upx;
		height: 130upx;
	}

	.circle2 {
		transform: rotateZ(90deg) translateY(220upx);
	}

	.cont2 {
		transform: rotateZ(-90deg);
		width: 90upx;
		height: 130upx;
	}

	.circle3 {
		transform: rotateZ(135deg) translateY(220upx);
	}

	.cont3 {
		transform: rotateZ(-135deg);
		width: 90upx;
		height: 130upx;
	}

	.circle4 {
		transform: rotateZ(180deg) translateY(220upx);
	}

	.cont4 {
		transform: rotateZ(-180deg);
		width: 90upx;
		height: 130upx;
	}

	.circle5 {
		transform: rotateZ(225deg) translateY(220upx);
	}

	.cont5 {
		transform: rotateZ(-225deg);
		width: 90upx;
		height: 130upx;
	}

	.circle6 {
		transform: rotateZ(270deg) translateY(220upx);
	}

	.cont6 {
		transform: rotateZ(-270deg);
		width: 90upx;
		height: 130upx;
	}

	.circle7 {
		transform: rotateZ(315deg) translateY(220upx);
	}

	.cont7 {
		transform: rotateZ(-315deg);
		width: 90upx;
		height: 130upx;
	}

	.circle8 {
		transform: rotateZ(360deg) translateY(220upx);
	}

	.cont8 {
		transform: rotateZ(-360deg);
		width: 90upx;
		height: 130upx;
	}

	.cont_title {
		border-radius: 3upx;
		padding: 0upx 5upx;
		font-size: 22upx;
		color: #1F64FF;
		font-weight: 500;
		line-height: 30upx;
		max-width: 100upx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.cont_img {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}

	.add_btn {
		position: fixed;
		right: 10upx;
		top: 570upx;
		z-index: 10;

		.add_img {
			width: 100upx;
			height: 100upx;
		}
	}

	.gl_btn {
		position: fixed;
		right: 15upx;
		top: 200upx;
		z-index: 10;

		.add_img {
			width: 100upx;
			height: 100upx;
		}
	}

	.information_header {

		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1upx solid #F4F5F9;
		padding-bottom: 10upx;

		.left {
			color: #000;
			font-size: 28upx;
			font-style: normal;
			font-weight: 530;
			line-height: 150%;
		}

		.right {
			display: flex;
			color: #9B9B9B;
			font-size: 28upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			/* 21px */
		}
	}

	// ai资讯
	.information {
		padding: 15upx 20upx;
		background: #fff;
		margin-top: 20upx;
		border-radius: 10upx;



		.item_infor {
			width: 100%;
			// height: 160upx;
			flex-shrink: 0;
			display: flex;
			justify-content: space-between;
			margin-top: 38upx;

			.left {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				flex-grow: 1;
				margin-right: 20upx;

				.content {
					color: #333;
					font-size: 28upx;
					font-style: normal;
					font-weight: 400;
					line-height: 150%;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 3; // 控制多行的行数
					-webkit-box-orient: vertical;
					/* 21px */
				}

				.bottom {
					margin-top: 50upx;
					color: #A6A6A6;
					font-size: 24upx;
					font-style: normal;
					font-weight: 400;
					line-height: 150%;
					display: flex;
					justify-content: space-between;
					margin-bottom: 10upx;

					/* 18px */
					.page_view {
						margin-right: 15upx;
					}
				}

			}

			.right {
				.img {
					width: 200upx;
					height: 120upx;
					border-radius: 10upx;
				}

			}
		}
	}

	.prod {
		padding: 20upx;


		.prod_chat {
			width: calc(100% - 40upx);
			background: #fff;
			border-radius: 10upx;
			padding: 20upx;
			margin-bottom: 20upx;

			.information_header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1upx solid #F4F5F9;
				padding-bottom: 10upx;

				.left {
					color: #000;
					font-size: 28upx;
					font-style: normal;
					font-weight: 530;
					line-height: 150%;
				}

				.right {
					display: flex;
					color: #9B9B9B;
					font-size: 28upx;
					font-style: normal;
					font-weight: 400;
					line-height: 150%;
					/* 21px */
				}
			}

			.chat_title {
				color: #000;
				font-size: 28upx;
				font-style: normal;
				font-weight: 530;
				line-height: 56upx;
				border-bottom: 1upx solid #F4F5F9;
			}

			.chat_cont {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;

				.cont_li {
					width: 48%;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					padding: 20upx 0;

					.li_left {
						width: 92upx;
						height: 92upx;
						display: flex;
						align-items: center;
						justify-content: center;

						.li_img {
							width: 92upx;
							height: 92upx;
						}

						.vis_img {
							width: 46upx;
							height: 46upx;
						}
					}

					.li_right {
						display: flex;
						flex-direction: column;
						padding-left: 10upx;

						.right_t {
							color: #000;
							font-size: 24upx;
							font-style: normal;
							font-weight: 500;
							line-height: 38upx;
						}

						.right_b {
							color: #5A5A5A;
							font-size: 22upx;
							font-style: normal;
							font-weight: 400;
							line-height: 27upx;
						}
					}
				}
			}
		}

		.apply_cont {
			display: flex;
			// justify-content: space-around;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			padding-top: 10upx;

			.cont_uls {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				width: calc(100% - 20upx);

				.ul_list {
					width: 46%;
					padding: 10upx 0;
				}

				.ul_li {
					padding: 10upx 10upx 0 10upx;
					border-radius: 12upx;
					background: linear-gradient(223deg, #EFF5FF 0%, #DEEAFF 100%);
					width: 100%;

					.li_t {
						color: #33363C;
						font-size: 24upx;
						font-style: normal;
						font-weight: 500;
						line-height: 150%;
					}

					.li_b {
						display: flex;
						align-items: flex-end;
						justify-content: space-between;

						.li_m {
							color: #999;
							font-size: 22upx;
							font-style: normal;
							font-weight: 400;
							line-height: 35upx;
							margin-right: 10upx;
						}

						.li_img {
							width: 60upx;
							height: 50upx;
							// margin-top: -10upx;
						}
					}
				}
			}
		}
	}

	.web {
		width: 100%;
		font-size: 20upx;
		line-height: 40upx;
		color: #1F64FF;
		margin-top: -110upx;
		margin-left: 30upx;
	}

	.manage_info {
		padding: 0 20upx;

		// margin-top: -70upx;
		.info_me {
			width: calc(100% - 40upx);
			height: 300upx;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			margin-bottom: 20upx;
			padding: 20upx;
			border-radius: 16upx;

			.me_title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 30upx;

				.title_left {
					color: #000;
					font-size: 28upx;
					font-weight: 530;
					line-height: 50upx;
				}

				.title_right {
					display: flex;

					.right_text {
						padding-right: 8upx;
						color: #9B9B9B;
						font-size: 26upx;
						font-style: normal;
						font-weight: 400;
						line-height: 150%;

					}
				}

			}

			.other_cont {
				display: flex;
				width: 100%;
				// height: 210upx;
				white-space: nowrap;
				overflow-x: scroll;

				.cont_left {
					width: 210upx;
					height: 210upx;
					border-radius: 8upx;
					padding: 10upx;
					position: relative;

					.left_img {
						width: 200upx;
						height: 200upx;
						border-radius: 8upx;
					}

					.left_text {
						width: 200upx;
						height: 50upx;
						border-radius: 0 0 8upx 8upx;
						background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #000 123.81%);
						position: absolute;
						bottom: 0;
						text-align: center;
						line-height: 50upx;
						color: #fff;
						font-size: 26upx;
					}

					.qh_img {
						width: 46upx;
						height: 46upx;
						position: absolute;
						top: 10upx;
						right: 10upx;
					}
				}
			}

			.me_cont {
				display: flex;

				.cont_left {
					width: 200upx;
					height: 200upx;
					border-radius: 8upx;
					position: relative;

					.left_img {
						width: 200upx;
						height: 200upx;
						border-radius: 8upx;
					}

					.left_text {
						width: 200upx;
						height: 50upx;
						border-radius: 0 0 8upx 8upx;
						background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #000 123.81%);
						position: absolute;
						bottom: 0;
						text-align: center;
						line-height: 50upx;
						color: #fff;
						font-size: 26upx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.cont_right {
					padding: 20upx 0 0 40upx;
					display: flex;
					flex-direction: column;
					flex: 1;

					.cont_btn {
						flex: 1;
						color: #FFF;
						font-size: 28upx;
						line-height: 60upx;
						text-align: center;
						background: #1F64FF;
						border-radius: 10upx;
						margin-bottom: 30upx;
					}

					.cont_btn_b {
						flex: 1;
						color: #1F64FF;
						font-size: 28upx;
						line-height: 60upx;
						text-align: center;
						border-radius: 10upx;
						border: 1upx solid #1F64FF;
					}

					.cont_text {
						color: #9B9B9B;
						font-size: 20upx;
						font-style: normal;
						font-weight: 400;
						line-height: 40upx;
					}
				}
			}
		}
	}

	.top_btn {
		position: fixed;
		bottom: 100upx;
		right: 20upx;
		z-index: 99;

		.icon_img {
			width: 100upx;
			height: 100upx;
		}
	}

	.head_card {
		padding: 32rpx;
		width: calc(100%);
		border-radius: 0 16rpx 16rpx 16rpx;
		background: linear-gradient(161deg, #C0D3FE -29.31%, #FFF 45.69%);
		display: flex;

		.head_log {
			width: 96rpx;
			height: 96rpx;
			fill: #FFF;
			stroke-width: 2rpx;
			stroke: #F9F9F9;
		}

		.head_r {
			display: flex;
			justify-content: space-between;
			width: 100%;
			margin-left: 14rpx;

			.head_rup {
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.rup_title {
					color: #1F64FF;
					font-size: 36rpx;
					font-weight: 500;
				}
			}

			.head_rb {
				color: #242F49;
				font-size: 24rpx;
				line-height: 150%;
				/* 18px */
			}

			.rup_text {
				display: flex;
				color: #666;
				font-size: 24rpx;
				line-height: 16px;

			}
		}
	}

	.chief {
		width: calc(100%-72rpx);
		padding: 24rpx 32rpx;
		display: flex;
		justify-content: space-between;
		border-radius: 16rpx;
		background: #FFF;

		.chief_item {
			display: flex;
			width: 200rpx;
			height: 148rpx;
			align-items: center;

			.chief_title {
				color: #2C2E30;
				font-size: 26rpx;
				font-weight: 500;
				line-height: 150%;
				/* 19.5px */
			}

			.chief_text {
				color: #767A81;
				font-size: 24rpx;
				line-height: 150%;
				/* 18px */
			}
		}
	}
</style>
<style lang="less" scoped>
	.home {
		height: 100vh;
		overflow: hidden;
	}

	.head_index {
		width: 100%;
		// height: 100upx;
		position: fixed;
		top: 0upx;
		background: rgba(239, 245, 255, 1);
		z-index: 999;
	}

	.head_cont {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// padding: 0upx 32upx;
	}

	.chat {
		padding: 0upx 30upx;
		// background: #fff;
		display: flex;
		align-items: center;
		flex-direction: column;

		// margin-bottom: 20upx;
		.chat_type {
			display: flex;
			align-items: center;
			// justify-content: space-around;
			flex-wrap: wrap;
			width: 100%;

			.tabs {
				width: 22%;
				background: #E0EEFF;
				border-radius: 6upx;
				padding: 8upx 0;
				font-style: normal;
				font-weight: 500;
				font-size: 28upx;
				line-height: 150%;
				color: #333;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 10upx 1.5%;
			}

			.active_tabs {
				width: 22%;
				background: #1F64FF;
				border-radius: 6upx;
				padding: 8upx 0;
				font-style: normal;
				font-weight: 500;
				font-size: 28upx;
				line-height: 150%;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 10upx 1.5%;
			}
		}

		.chat_text {
			width: 100%;
			padding: 10upx;
			border-radius: 12upx;
			background: #FFF;
			box-shadow: 0px 2px 10px 0px rgba(51, 51, 51, 0.10);
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 10upx 0;

			/deep/.u-input {
				padding: 12upx;
				width: 80%;
			}

			.chat_btns {
				width: 20%;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #1F64FF;
				border-radius: 12upx;
				line-height: 80upx;
				font-style: normal;
				font-weight: 500;
				font-size: 34upx;
				color: #fff;
			}

			.chat_btns:active {
				opacity: 0.5;
			}
		}


	}

	.select {
		padding: 10upx 0;
		background: #fff;

		.select_tab {
			padding: 0 10px;
		}

		.tab_tip {
			padding: 20upx;

			.tip_img {
				width: 56upx;
				height: 56upx;
			}

			.swiper {
				height: 270rpx;
			}

			.grid-text {
				font-size: 26upx;
				color: #333;
				padding: 10rpx 0 20rpx 0rpx;
				/* #ifndef APP-PLUS */
				box-sizing: border-box;
				/* #endif */
			}

			.active-grid-text {
				font-size: 26upx;
				color: #1F64FF;
				padding: 10rpx 0 20rpx 0rpx;
				/* #ifndef APP-PLUS */
				box-sizing: border-box;
				/* #endif */
			}
		}
	}

	.tab_line {
		padding: 20upx 0upx;
		border-bottom: 1upx solid #E6E6E8;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #fff;

		.line {
			display: flex;
			align-items: center;
			line-height: 40upx;
			padding: 10upx;

			.line_text {
				font-style: normal;
				font-weight: 400;
				font-size: 26upx;
				line-height: 40upx;
				color: #333;
			}

			.active_line_text {
				font-style: normal;
				font-weight: 400;
				font-size: 26upx;
				line-height: 40upx;
				color: #1F64FF;
				max-width: 100upx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				display: inline-block;
			}

			.line_img {
				width: 30upx;
				height: 30upx;
				// padding-left: 6upx;
			}
		}
	}

	.cont_mid {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15upx 30upx;
		height: 40px;
	}

	.cont_mids {
		display: flex;
		align-items: center;
		justify-content: space-between;
		// padding: 15upx 30upx;
		box-shadow: 0px -2px 10px rgba(51, 51, 51, 0.05);
		height: 40px;
		background: #fff;
	}

	.mid_btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		border-radius: 12upx;
		line-height: 40px;

	}

	.clear_img {
		width: 40upx;
		height: 40upx;
	}

	.clear_text {
		font-style: normal;
		font-weight: 500;
		font-size: 28upx;
		color: #999;
		margin-left: 10upx;
	}

	.mid_l {
		font-style: normal;
		font-weight: 400;
		font-size: 26upx;
		color: #333;
		/* line-height: 24px; */
	}

	.active_mid_l {
		font-style: normal;
		font-weight: 400;
		font-size: 26upx;
		color: #1F64FF;
		/* line-height: 24px; */
	}

	.mid_img {
		width: 40upx;
		height: 40upx;
		// padding-right: 10upx;
	}

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

	.top {
		width: 80upx;
		height: 80upx;
		position: fixed;
		bottom: 120upx;
		right: 70upx;

		.top_img {
			width: 80upx;
			height: 80upx;
		}
	}

	.top_type {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		padding: 10upx 0 20upx 0;

		.type_l {
			color: #333;
			font-size: 26upx;
			font-weight: 500;
			display: flex;
		}

		.type_m {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.type_r {
			color: #1F64FF;
			font-size: 26upx;
		}
	}

	.company_info {
		width: 100%;
		height: 800upx;
		background-size: 100% 100%;
		padding-top: 200upx;
		margin-bottom: 220upx;

		// margin-top: 30upx;
		.chat_text {
			width: 100%;
			padding: 20upx 0;

			.text_cont {
				display: flex;
				align-items: center;
				margin-bottom: 10upx;
				width: 100%;

				.text_l {
					color: #FF0101;
					font-size: 22upx;
					font-style: normal;
					font-weight: 400;
					line-height: 26upx;
					margin-right: 5upx;
				}

				.text_r {
					color: #333;
					text-align: center;
					font-size: 24upx;
					font-style: normal;
					font-weight: 530;
					line-height: 26upx;
				}
			}
		}

		.cont_user {
			padding: 0upx 32upx;
			margin-bottom: 16upx;

			.cont_ul {
				padding: 22upx;
				background: #fff;
				border-radius: 14upx;

				.user_tit {
					color: #333;
					font-size: 30upx;
					font-style: normal;
					font-weight: 520;
					line-height: 150%;
					// margin-bottom: 15upx;
				}

				.user_icon {
					display: flex;
					// justify-content: space-around;
					justify-content: flex-start;
					align-items: center;
					flex-wrap: wrap;

					.icon_list {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						margin: 10upx 0;
						width: 25%;

						.icon_img {
							width: 48upx;
							height: 48upx;
						}

						.icon_title {
							color: #333;
							font-size: 24upx;
							font-style: normal;
							font-weight: 400;
							line-height: 36upx;
							margin-top: 12upx;
						}
					}
				}
			}

		}

	}

	.chat_btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #1F64FF;
		border-radius: 12upx;
		line-height: 90upx;
		font-style: normal;
		font-weight: 500;
		font-size: 34upx;
		color: #fff;
	}

	.chat_btn:active {
		opacity: 0.5;
	}

	.cont_chat {

		// padding: 30upx 0;
		// margin-bottom: 16upx;
		padding: 20upx 20upx 0 20upx;

		.cont_ul {
			padding: 22upx 0;
			background: #fff;
			border-radius: 14upx;

			.user_tit {
				color: #333;
				font-size: 30upx;
				font-style: normal;
				font-weight: 520;
				line-height: 150%;
				// margin-bottom: 15upx;
			}

			.user_icon {
				display: flex;
				// justify-content: space-around;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				padding: 0 30upx;

				.icon_list {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					margin: 10upx 0 20upx 0;
					width: 25%;

					.icon_img {
						width: 90upx;
						height: 90upx;
					}

					.icon_title {
						color: #000;
						font-size: 24upx;
						font-style: normal;
						font-weight: 400;
						line-height: 36upx;
						// margin-top: 12upx;
					}
				}
			}
		}

		.banner {
			padding: 20upx 30upx 0 30upx;

			.banner_img {
				width: 100%;
				height: 200upx;
			}
		}

	}

	.notice {
		padding: 20upx 20upx 0 20upx;
		border-radius: 10upx;
	}

	.back_top {

		.back_cont {
			width: 100%;
			height: 170upx;
			background-repeat: no-repeat;
			background-size: 100% 100%;
		}
	}

	.surround-box {
		position: absolute;
		top: 40%;
		left: 45%;
		width: 100upx;
		height: 100upx;
		// margin-left: -12upx;
		// margin-top: -20upx;
		border-radius: 50%;
		// background-color: #000;
	}

	.edit_img {
		width: 45upx;
		height: 45upx;
		position: absolute;
		top: -20upx;
		left: 75%;
		z-index: 10;
	}

	.center-point {
		position: absolute;
		top: 40%;
		left: 45%;
		width: 100upx;
		height: 100upx;
		margin-left: -20upx;
		margin-top: -40upx;
		border-radius: 50%;
		z-index: 99;
		// background-color: #000;
	}

	.circle {
		/* 这里一定要绝对定位，这样位置才能铺开来 */
		position: absolute;
		top: -40upx;
		left: -20upx;
		width: 100upx;
		height: 100upx;
		// line-height: 180upx;
		border-radius: 50%;
		text-align: center;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.circle1 {
		/* rotateZ控制方向，每个元素旋转45度，8个元素刚好360度。translateY控制每个元素距中心点的距离 */
		transform: rotateZ(45deg) translateY(220upx);
	}

	.cont1 {
		transform: rotateZ(-45deg);
		width: 90upx;
		height: 130upx;
	}

	.circle2 {
		transform: rotateZ(90deg) translateY(220upx);
	}

	.cont2 {
		transform: rotateZ(-90deg);
		width: 90upx;
		height: 130upx;
	}

	.circle3 {
		transform: rotateZ(135deg) translateY(220upx);
	}

	.cont3 {
		transform: rotateZ(-135deg);
		width: 90upx;
		height: 130upx;
	}

	.circle4 {
		transform: rotateZ(180deg) translateY(220upx);
	}

	.cont4 {
		transform: rotateZ(-180deg);
		width: 90upx;
		height: 130upx;
	}

	.circle5 {
		transform: rotateZ(225deg) translateY(220upx);
	}

	.cont5 {
		transform: rotateZ(-225deg);
		width: 90upx;
		height: 130upx;
	}

	.circle6 {
		transform: rotateZ(270deg) translateY(220upx);
	}

	.cont6 {
		transform: rotateZ(-270deg);
		width: 90upx;
		height: 130upx;
	}

	.circle7 {
		transform: rotateZ(315deg) translateY(220upx);
	}

	.cont7 {
		transform: rotateZ(-315deg);
		width: 90upx;
		height: 130upx;
	}

	.circle8 {
		transform: rotateZ(360deg) translateY(220upx);
	}

	.cont8 {
		transform: rotateZ(-360deg);
		width: 90upx;
		height: 130upx;
	}

	.cont_title {
		border-radius: 3upx;
		padding: 0upx 5upx;
		font-size: 22upx;
		color: #1F64FF;
		font-weight: 500;
		line-height: 30upx;
		max-width: 100upx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.cont_img {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}

	.add_btn {
		position: fixed;
		right: 10upx;
		top: 570upx;
		z-index: 10;

		.add_img {
			width: 100upx;
			height: 100upx;
		}
	}

	.gl_btn {
		position: fixed;
		right: 15upx;
		top: 200upx;
		z-index: 10;

		.add_img {
			width: 100upx;
			height: 100upx;
		}
	}

	// ai资讯
	.information {
		padding: 15upx 20upx;
		background: #fff;
		margin-top: 20upx;
		border-radius: 10upx;

		.information_header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1upx solid #F4F5F9;
			padding-bottom: 10upx;

			.left {
				color: #000;
				font-size: 28upx;
				font-style: normal;
				font-weight: 530;
				line-height: 150%;
			}

			.right {
				display: flex;
				color: #9B9B9B;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				/* 21px */
			}
		}

		.item_infor {
			width: 100%;
			// height: 160upx;
			flex-shrink: 0;
			display: flex;
			justify-content: space-between;
			margin-top: 38upx;

			.left {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				flex-grow: 1;
				margin-right: 20upx;

				.content {
					color: #333;
					font-size: 28upx;
					font-style: normal;
					font-weight: 400;
					line-height: 150%;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 3; // 控制多行的行数
					-webkit-box-orient: vertical;
					/* 21px */
				}

				.bottom {
					margin-top: 50upx;
					color: #A6A6A6;
					font-size: 24upx;
					font-style: normal;
					font-weight: 400;
					line-height: 150%;
					display: flex;
					justify-content: space-between;
					margin-bottom: 10upx;

					/* 18px */
					.page_view {
						margin-right: 15upx;
					}
				}

			}

			.right {
				.img {
					width: 200upx;
					height: 120upx;
					border-radius: 10upx;
				}

			}
		}
	}

	.prod {
		padding: 20upx;

		.prod_chat {
			width: calc(100%);
			background: #fff;
			border-radius: 10upx;
			padding: 20upx;
			margin-bottom: 20upx;

			.information_header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1upx solid #F4F5F9;
				padding-bottom: 10upx;

				.left {
					color: #000;
					font-size: 28upx;
					font-style: normal;
					font-weight: 530;
					line-height: 150%;
				}

				.right {
					display: flex;
					color: #9B9B9B;
					font-size: 28upx;
					font-style: normal;
					font-weight: 400;
					line-height: 150%;
					/* 21px */
				}
			}

			.chat_title {
				color: #000;
				font-size: 28upx;
				font-style: normal;
				font-weight: 530;
				line-height: 56upx;
				border-bottom: 1upx solid #F4F5F9;
			}

			.chat_cont {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;

				.cont_li {
					width: 48%;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					padding: 20upx 0;

					.li_left {
						width: 92upx;
						height: 92upx;
						display: flex;
						align-items: center;
						justify-content: center;

						.li_img {
							width: 92upx;
							height: 92upx;
						}

						.vis_img {
							width: 46upx;
							height: 46upx;
						}
					}

					.li_right {
						display: flex;
						flex-direction: column;
						padding-left: 10upx;

						.right_t {
							color: #000;
							font-size: 24upx;
							font-style: normal;
							font-weight: 500;
							line-height: 38upx;
						}

						.right_b {
							color: #5A5A5A;
							font-size: 22upx;
							font-style: normal;
							font-weight: 400;
							line-height: 27upx;
						}
					}
				}
			}
		}

		.apply_cont {
			display: flex;
			// justify-content: space-around;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			padding-top: 10upx;

			.cont_uls {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				width: calc(100% - 20upx);

				.ul_list {
					width: 46%;
					padding: 10upx 0;
				}

				.ul_li {
					padding: 10upx 10upx 0 10upx;
					border-radius: 12upx;
					background: linear-gradient(223deg, #EFF5FF 0%, #DEEAFF 100%);
					width: 100%;

					.li_t {
						color: #33363C;
						font-size: 24upx;
						font-style: normal;
						font-weight: 500;
						line-height: 150%;
					}

					.li_b {
						display: flex;
						align-items: flex-end;
						justify-content: space-between;

						.li_m {
							color: #999;
							font-size: 22upx;
							font-style: normal;
							font-weight: 400;
							line-height: 35upx;
							margin-right: 10upx;
						}

						.li_img {
							width: 60upx;
							height: 50upx;
							// margin-top: -10upx;
						}
					}
				}
			}
		}
	}

	.web {
		width: 100%;
		font-size: 30upx;
		line-height: 40upx;
		color: #1F64FF;
		margin-top: -110upx;
		margin-left: 30upx;
	}

	.manage_info {
		padding: 0 20upx;
		// margin-top: -70upx;

		.info_me {
			width: calc(100%);
			height: 340upx;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			margin-bottom: 20upx;
			padding: 20upx;
			border-radius: 16upx;

			.me_title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 30upx;

				.title_left {
					color: #000;
					font-size: 28upx;
					font-weight: 530;
					line-height: 50upx;
				}

				.title_right {
					display: flex;

					.right_text {
						padding-right: 8upx;
						color: #9B9B9B;
						font-size: 26upx;
						font-style: normal;
						font-weight: 400;
						line-height: 150%;

					}
				}

			}

			.other_cont {
				display: flex;
				width: 100%;
				// height: 210upx;
				white-space: nowrap;
				overflow-x: scroll;

				.cont_left {
					width: 210upx;
					height: 210upx;
					border-radius: 8upx;
					padding: 10upx;
					position: relative;

					.left_img {
						width: 200upx;
						height: 200upx;
						border-radius: 8upx;
					}

					.left_text {
						width: 200upx;
						height: 50upx;
						border-radius: 0 0 8upx 8upx;
						background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #000 123.81%);
						position: absolute;
						bottom: 0;
						text-align: center;
						line-height: 50upx;
						color: #fff;
						font-size: 26upx;
					}

					.qh_img {
						width: 46upx;
						height: 46upx;
						position: absolute;
						top: 10upx;
						right: 10upx;
					}
				}
			}

			.me_cont {
				display: flex;

				.cont_left {
					width: 200upx;
					height: 200upx;
					border-radius: 8upx;
					position: relative;

					.left_img {
						width: 200upx;
						height: 200upx;
						border-radius: 8upx;
					}

					.left_text {
						width: 200upx;
						height: 50upx;
						border-radius: 0 0 8upx 8upx;
						background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #000 123.81%);
						position: absolute;
						bottom: 0;
						text-align: center;
						line-height: 50upx;
						color: #fff;
						font-size: 26upx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.cont_right {
					padding: 20upx 0 0 40upx;
					display: flex;
					flex-direction: column;
					flex: 1;

					.cont_btn {
						flex: 1;
						color: #FFF;
						font-size: 28upx;
						line-height: 60upx;
						text-align: center;
						background: #1F64FF;
						border-radius: 10upx;
						margin-bottom: 30upx;
					}

					.cont_btn_b {
						flex: 1;
						color: #1F64FF;
						font-size: 28upx;
						line-height: 60upx;
						text-align: center;
						border-radius: 10upx;
						border: 1upx solid #1F64FF;
					}

					.cont_text {
						color: #9B9B9B;
						font-size: 20upx;
						font-style: normal;
						font-weight: 400;
						line-height: 40upx;
					}
				}
			}
		}
	}

	.top_btn {
		position: fixed;
		bottom: 180upx;
		right: 20upx;
		z-index: 99;

		.icon_img {
			width: 100upx;
			height: 100upx;
		}
	}
</style>