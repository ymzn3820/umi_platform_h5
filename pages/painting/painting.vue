<template>
	<view>

		<view style="background: #fff;">

			<view :style="[{marginTop: topHeight +'px'}]">

				<!-- 图片示例  文生图-->
				<view class="ex_ul" v-if="askShow && sd_type == 1">
					<view class="ex_img">
						<image :src="billListOne.pic_url" mode="aspectFit" class="li_img"></image>
						<!-- <view class="ex_update" @click="getDrawRecommend"><u-icon name="reload" color="#fff"
								size="18"></u-icon></view> -->
					</view>
				</view>


				<!-- sd绘图 文生图-->
				<view class="ex_ul" v-for="(item,index) in StableDiffusionList" :key="index"
					v-if="!sd_msgLoad && !askShow && sd_photo_type == 2&&sd_type==1">
					<view class="ex_img">
						<image :src="getImgUrl(item.result_image)" alt="" @click.stop="checkImg(index)" mode="aspectFit"
							class="li_img">
						</image>

					</view>
				</view>



				<!-- sd绘图生成中 -->
				<view class="ex_ul" v-if="sd_msgLoad && !askShow && isuser ">
					<view class="ex_time">
						<u-loading-icon textSize="20"></u-loading-icon>
						<view class="wait_text">生成中,耗时{{ sd_timer}}秒</view>
						<u-button type='primary'
							:customStyle='{"color":"#1F64FF","height":"28px","width":"40%","font-size":"14px"}'
							size="mini" color="rgba(31, 100, 255, 0.1)" @click="stopStart">
							停止生成
						</u-button>
					</view>

				</view>

				<!-- sd充会员 -->
				<view class="ex_ul" v-if="!sd_msgLoad && !askShow && !isuser">
					<view class="ex_time">
						<view class="wait_text">{{ sd_desc }}</view>
						<view style="display: flex; justify-content: space-around;" v-if="draw_tip == true">
							<u-button type="warning" color="#FF9B17"
								:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'100%'}"
								@click='goMember'>购买算力包</u-button>
						</view>
					</view>
				</view>

			</view>

			<view class="page_cont">
				<view class="ex_btn"
					v-if="(StableDiffusionList.length > 0||picToPicList.length > 0) && (sd_type == 1||sd_type == 2) && !askShow && sd_photo_type == 2">
					<u-icon name="warning" color="#666" size="18"></u-icon>
					<text class="btn_text">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
				</view>
				<view class="tabs" v-if="askShow && sd_type == 1" style="padding-left: 30%;">
					<view class="copy" @click="toAsk(billListOne.pic_desc)">
						<view
							style="width: 64rpx;height: 64rpx;background-color: #F3F7FF;border-radius: 5rpx;display: flex;align-items: center;justify-content: center;">
							<image :src="copyImg" class="copyImg"></image>
						</view>
						<view class="copy_txt">做同款</view>
					</view>
					<view class="copy" style="margin-right: 380rpx;" @click="getDrawRecommend">
						<view
							style="width: 64rpx;height: 64rpx;background-color: #F3F7FF;border-radius: 5rpx;align-items: center;justify-content: center;display: flex;">
							<image :src="changeImg" style="width: 40rpx;height: 40rpx;"></image>
						</view>
						<view class="copy_txt">换一换</view>
					</view>

				</view>
				<view class="tabs" v-if="!askShow && sd_type == 1" style="justify-content: space-between;">
					<view class="copy" @click="toAsk(sameMsg)">
						<view
							style="width: 64rpx;height: 64rpx;background-color: #F3F7FF;border-radius: 5rpx;display: flex;align-items: center;justify-content: center;">
							<image :src="copyImg" class="copyImg"></image>
						</view>
						<view class="copy_txt">做同款</view>
					</view>
					<!-- 文生图 -->
					<view class="tabs_t" v-for="(item,index) in StableDiffusionList" :key="index"
						v-if="StableDiffusionList.length > 0 && sd_type == 1 && !askShow && sd_photo_type == 2">
						<view class="ex_like" @click="likeType(1,9)" v-if="item.is_like == 0 || item.is_like == 2">
							<u-icon name="thumb-up" color="#1F64FF" size="24"></u-icon>
						</view>
						<view class="ex_nlike" @click="likeType(0,9)" v-if="item.is_like == 1"><u-icon
								name="thumb-up-fill" color="#1F64FF" size="24"></u-icon></view>
						<view class="ex_like" @click="likeType(2,9)" v-if="item.is_like == 0 || item.is_like == 1">
							<u-icon name="thumb-down" color="#1F64FF" size="24"></u-icon>
						</view>
						<view class="ex_nlike" @click="likeType(0,9)" v-if="item.is_like == 2"><u-icon
								name="thumb-down-fill" color="#1F64FF" size="24"></u-icon></view>
						<view class="ex_like" @click="savePhoto(item.result_image)"><u-icon name="download"
								color="#1F64FF" size="24"></u-icon></view>
					</view>
				</view>
				<view class="tabs" style="display: flex; justify-content: space-between;">
					<view class="tab_photo" v-if="sd_type == 2">
						<view :class="sd_photo_type == 1 ? 'tabs_photo_active' : 'tabs_photo'" @click="photoType(1)"
							style="margin-right: 20upx;">参考图</view>
						<view :class="sd_photo_type == 2 ? 'tabs_photo_active' : 'tabs_photo'" @click="photoType(2)">生成图
						</view>
					</view>
					<view v-else></view>

					<!-- 图生图 -->
					<view class="tabs_t" v-for="(item,index) in picToPicList" :key="index"
						v-if="picToPicList.length > 0 && sd_type == 2 && !askShow&& sd_photo_type == 2">
						<view class="ex_like" @click="likeType(1,9)" v-if="item.is_like == 0 || item.is_like == 2">
							<u-icon name="thumb-up" color="#1F64FF" size="24"></u-icon>
						</view>
						<view class="ex_nlike" @click="likeType(0,9)" v-if="item.is_like == 1"><u-icon
								name="thumb-up-fill" color="#1F64FF" size="24"></u-icon></view>
						<view class="ex_like" @click="likeType(2,9)" v-if="item.is_like == 0 || item.is_like == 1">
							<u-icon name="thumb-down" color="#1F64FF" size="24"></u-icon>
						</view>
						<view class="ex_nlike" @click="likeType(0,9)" v-if="item.is_like == 2"><u-icon
								name="thumb-down-fill" color="#1F64FF" size="24"></u-icon></view>
						<view class="ex_like" @click="savePhoto(item.result_image)"><u-icon name="download"
								color="#1F64FF" size="24"></u-icon></view>
					</view>

				</view>


				<view style="padding: 0 32rpx;" v-if="sd_type==1||sd_photo_type==2">
					<view style="color: #333;font-size: 28rpx;font-weight: 500;">尺寸</view>
					<view class="query_li" style='margin-bottom: 48rpx;'>
						<view class="li_size" v-for="(val, index) in sdList" :key="index"
							:style="[{border:(sizeIndex == index ? '1px solid #1F64FF':'1px solid #999')}]"
							@click="selctSize(val.size,index)">
							<view class="size_back">
								<view class="size_zheng" v-if="val.type === 'zheng'"
									:style="[{background:(sizeIndex == index ? '#B2CAFF':'#DDD')}]"></view>
								<view class="size_gao" v-if="val.type === 'gao'"
									:style="[{background:(sizeIndex == index ? '#B2CAFF':'#DDD')}]"></view>
								<view class="size_chang" v-if="val.type === 'chang'"
									:style="[{background:(sizeIndex == index ? '#B2CAFF':'#DDD')}]"></view>
							</view>
							<view class="size_tip" :style="[{color:(sizeIndex == index ? '#1F64FF':'#999')}]">
								{{ val.size }}
							</view>
						</view>
					</view>
				</view>
				<view style="padding: 0 32rpx;" v-if="sd_type==1||sd_photo_type==2">
					<view style="display: flex;justify-content: space-between;">
						<view style="color: #333;font-size: 28rpx;font-weight: 500;">模型</view>
						<!-- <view @click="settingClick(1)" style="color: #1F64FF;font-size: 24rpx;">全部模型</view> -->
					</view>
					<view class="query_li" style="margin-bottom: 32rpx;">
						<view class="li_type" v-for="(val, index) in modelList.slice(0,8)" :key="index"
							@click="selctQuery(index)"
							:style="[{border:(queryIndex == index ? '4upx solid #1F64FF':'none')}]">
							<image :src="getImgUrl( val.pic_url)" mode="" class="type_img"></image>
							<view class="type_tip">{{ val.name }}</view>
						</view>
					</view>
				</view>

			</view>
			<view :style="[{height:placeHight}]"></view>

			<!-- 底部导航栏 -->
			<view class="flex-column-center" :class="{isPosition:isPosition}" :style="{bottom: keyHeight +'px'}">
				<view class="btn_link">

					<view class="link_l" style="width: 100%;justify-content: space-between;">
						<view style="display: flex;align-items: center;text-align: center;">
							<view class="l_chat" style="margin-right: 15rpx;" @click="addDraw3"
								v-if="!sd_msgLoad && !askShow &&StableDiffusionList.length>0 ">
								<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
								<text class="l_text">开启新绘画</text>
							</view>
							<view class="l_chat" @click="toHistory">
								<u-icon name="clock" color="#1F64FF" size="16"></u-icon>
								<text class="l_text">历史会话</text>
							</view>
							<view class="l_chat" @click="goShare" style="margin-left: 25rpx;"
								v-if="StableDiffusionList.length==0">
								<text class="l_text">分享赚算力</text>
							</view>
						</view>
						<view style="display: flex;align-items: center;">
							<!-- <text class="l_wait" v-if="chat_type == 9">排队中：{{ sd_wait }}人</text> -->
							<view class="l_chat" @click="goShare"
								v-if="!sd_msgLoad && !askShow &&StableDiffusionList.length>0">
								<text class="l_text">分享赚算力</text>
							</view>
							<view style="color: #F00;font-size: 32upx;margin-left: 20rpx;">免费</view>
						</view>
					</view>

				</view>
				<view class="bottom-dh-char" style="font-size: 55rpx;">

					<view class="bottom_cont">
						<!-- <input v-model="msg" class="dh-input" type="text" @confirm="msgLoad == false ? sendMsg() : sendMsg2()"
						confirm-type="search" placeholder-class="my-neirong-sm" @focus="focusTexts" @blur="getValue"
						:adjust-position="false" placeholder="在此输入你想了解的内容" />
				
					<image class="dh_img" src="@/static/images/send.png" @click="msgLoad == false ? sendMsg() : sendMsg2()" /> -->

						<u-row align='bottom' gutter="5">
							<u-col span="9.5">
								<u-textarea v-model="msg" placeholder="请在此输入绘画描述，我帮你生成"
									@confirm="sd_msgLoad == false ? sendMsg() : sendMsg2()" autoHeight
									:showConfirmBar='false' :adjustPosition='false' @focus="focusTexts" @blur="getValue"
									maxlength='-1' :disableDefaultPadding='true' @keyboardheightchange='keyboardheight'
									:focus="false">
								</u-textarea>
							</u-col>
							<u-col span="2.5" align="bottom">
								<u-button type="primary" color="#1F64FF"
									@click="sd_msgLoad == false ? sendMsg() : sendMsg2()">发送</u-button>
							</u-col>
						</u-row>

					</view>

				</view>


			</view>

		</view>


		<!-- 底部弹出层 -->
		<u-popup :show="setShow" mode="bottom" :round="10" @close="setShow = false">
			<view class="setting">
				<view @click="setShow = false"
					style="width: 120rpx;height: 10rpx;border-radius: 16rpx;background: #D9D9D9;margin: 14rpx 0 0 43%;">
				</view>
				<view class="query">

					<view v-if="query_type == 1" style="height: 474rpx;overflow: hidden;">
						<view style="color: #4E5969;font-size: 22rpx;text-align: center;">
							点击选择绘画模型，将在此模型基础上生成绘画</view>
						<scroll-view scroll-y="true" style="height: 100%;">
							<view class="query_li">
								<view class="li_type" v-for="(val, index) in modelList" :key="index"
									@click="selctQuery(index)"
									:style="[{border:(queryIndex == index ? '2px solid #1F64FF':'none')}]">
									<image :src="getImgUrl( val.pic_url)" mode="" class="type_img"></image>
									<view class="type_tip">{{ val.name }}</view>
								</view>
							</view>
						</scroll-view>
					</view>

				</view>
			</view>
		</u-popup>
        
		<!-- 图片下载 -->
		<Ssdownload ref="ssdownload" :fileUrl="fileUrl" :fileType="fileType"></Ssdownload>
	</view>
</template>

<script>
	import {
		creatDraw,
		baiduDraw,
		getbBaiduDraw,

		chat_likes,
		chat_image,
		getEnText,
		getSdQuery,
		getSdModel,
		sdDraw,
		getSdDraw,
		xfChat
	} from '@/apis/chat.js'
	import {
		getDrawRecommend,
		saveFootprint,
		createImg,
		likeList,
		getImgDetail,
		asyncImg,
		getTextImg
	} from "@/apis/user.js"
	import Title from "@/pages/title/index.vue"
	import * as TextEncoding from 'text-encoding-shim';
	import Ssdownload from '@/childPage/components/ss-download/ss-download.vue'
	export default {
		components: {
			Title,
			Ssdownload
		},
		data() {
			return {
				sameMsg: '',
				randomImg: global.baseImg + '/xcx/com/message_center/随机数生成 1.png',
				// 高级配置
				select1: false,
				select2: false,
				select3: false,
				select4: false,
				content1: "",
				content2: "",
				content3: "",
				content4: "",
				intValue2: '',
				intValue3: '',
				intValue4: '',

				configShow: false,
				log: global.baseImg + '/xcx/com/message_center/Frame%20427320411.png',
				billIndex: 0,
				tab_page: 1,
				dia_img: 'https://umi-intelligence.oss-cn-shenzhen.aliyuncs.com/xcx/com/message_center/绘画示例图.png',
				dia_text: '非常美女的女孩，背景蓝色的天空，迪士尼风格，分辨率1024x1536',
				scrollHeight: 0,
				scrollTop: 485,
				is_like: 0,
				icon_img: global.baseImg + '/xcx/com/message_center/绘画maximize-2.png',
				// prShow: false,
				prList: ['一辆粉红色的未来风格悬浮赛车', '可爱的微笑，人，亚洲美女', '侧目而视，白色毛衣，欧洲美女', '一座雪中的高大巨石城堡'],

				msg: "",
				keyboardHeight: 0,
				supplyValue: '',
				reply: '',
				isTime: false,
				isfinish: false,
				isDetail: false,
				isPosition: false,

				screenHeight: 0,
				msgListHeight: 0,
				keyHeight: 50,
				barHeight: 0,
				copyHeight: 0,

				draw_tip: false,
				type_tip: false,

				timer: 0,
				t_time: 0,
				bd_desc: '',
				msgLoad: false,
				chatList: [],

				sd_timer: 0,
				sd_t_time: 0,
				sd_desc: '',
				sd_draw_time: 0,
				sd_msgLoad: false,
				modelShow: false,
				modelList: [],
				modelValue: '',
				modelIndex: '<auto>',
				StableDiffusionList: [],
				picToPicList: [],
				sd_wait: 0,
				sd_complete: '', // 反向提示词
				sd_show: false,
				samplerShow: false,
				sdText: '',
				sdHideText: '',
				imgList: [], //用于图生图
				sd_type: 1, //用于选择画图类型
				sd_photo_type: 1,
				queryIndex: 0, //用于选中风格
				isSd: true, //防点击

				active: 0,
				chat_type: 13,
				chatType: 'Stable Diffusion',
				isuser: true,
				avatar: '',
				userInfo: "",
				dallshow: false,
				selectDone: 0,
				size: '1024*1024',
				sizeIndex: 0,
				query_type: 1,

				noticeList: [],

				sdList: [{
					id: '1024*1024',
					size: '1024*1024',
					type: 'zheng'
				}, {
					id: '720*1280',
					size: '720*1280',
					type: 'chang'
				}, {
					id: '1280*720',
					size: '1280*720',
					type: 'gao'
				}, ],

				show: false,
				isBtn: false,
				topHeight: 0,

				askShow: true,
				billList: [],
				billListOne: '',


				sdImg: global.baseImg + '/xcx/ca67317a-cbc1-4890-a3ce-c1b472785b0a.jpg',
				bdImg: global.baseImg + '/xcx/15087c8c-2bf9-47dd-9180-c808e9581b9d.jpg',
				mjImg: global.baseImg + '/xcx/8ab69c49-a00f-4b2b-8a92-b1424b61329b.jpg',
				dellImg: global.baseImg + '/xcx/ea8ddcf6-06aa-4938-96f6-3dac84dd21e6.jpg',
				waitImg: global.baseImg + '/xcx/c4a8054e-50bd-4790-a3cb-ec585412daa7.jpg',
				copyImg: global.baseImg + '/xcx/com/message_center/复制 1.png',
				changeImg: global.baseImg + '/xcx/com/message_center/换一换.png',

				pic_tem: '',
				tab_active: 0,
				hisImg: global.baseImg + '/xcx/com/message_center/clock.png',
				l_chatImg1: global.baseImg + '/xcx/com/message_center/绘画配置.png',
				l_chatImg2: global.baseImg + '/xcx/com/message_center/绘画灵感.png',
				setShow: false,
				tipShow: false,
				paintingShare: global.baseImg + '/xcx/com/message_center/chatShare.png',
				placeHight: 0,

				requestTask_three: '', //分流式传输,
				userRole: "",
				supplement: {
					// msg_list: []
				},
				messageList: [],
				imgList: [],
				askFields: '',
				
				fileUrl: '',
				fileType: '',


				wxTypeList: [{
						name: "默认",
						pic_url: "xcx/com/message_center/tong.png",
						value: '<auto>',
						bgcImg: '/xcx/com/message_center/bgcImg1.png'
					},
					{
						name: "扁平插画",
						pic_url: "xcx/com/message_center/%E6%89%81%E5%B9%B3%E6%8F%92%E7%94%BB.png",
						value: '<flat illustration>',
						bgcImg: '/xcx/com/message_center/bgcImg2.png'
					},
					{
						name: "中国画",
						pic_url: "xcx/com/message_center/%E4%B8%AD%E5%9B%BD%E7%94%BB.png",
						value: '<chinese painting>',
						bgcImg: '/xcx/com/message_center/bgcImg3.png'
					},
					{
						name: "素描",
						pic_url: "xcx/com/message_center/%E7%B4%A0%E6%8F%8F.png",
						value: '<sketch>',
						bgcImg: '/xcx/com/message_center/bgcImg4.png'
					},
					{
						name: "水彩",
						pic_url: "xcx/com/message_center/%E6%B0%B4%E5%BD%A9.png",
						value: '<watercolor>',
						bgcImg: '/xcx/com/message_center/bgcImg5.png'
					},
					{
						name: "油画",
						pic_url: "xcx/com/message_center/%E6%B2%B9%E7%94%BB.png",
						value: '<oil painting>',
						bgcImg: '/xcx/com/message_center/bgcImg6.png'
					},
					{
						name: "动画",
						pic_url: "xcx/com/message_center/%E5%8A%A8%E7%94%BB.png",
						value: '<anime>',
						bgcImg: '/xcx/com/message_center/bgcImg7.png'
					},
					{
						name: "3D卡通",
						pic_url: "xcx/com/message_center/3D%E5%8D%A1%E9%80%9A.png",
						value: '<3d cartoon>',
						bgcImg: '/xcx/com/message_center/bgcImg8.png'
					},
					// {
					// 	name: "人像写真",
					// 	pic_url: "xcx/com/message_center/%E4%BA%BA%E5%83%8F%E5%86%99%E7%9C%9F.png",
					// 	value: '<portrait>',
					// 	bgcImg: '/xcx/com/message_center/bgcImg9.png'
					// },
					// {
					// 	name: "摄影",
					// 	pic_url: "xcx/com/message_center/%E6%91%84%E5%BD%B1.png",
					// 	value: '<photography>',
					// 	bgcImg: '/xcx/com/message_center/bgcImg10.png'
					// }

				],

			}
		},

		onShow() {
			// this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			this.isuser = true; // 清空所有登录或升级会员提示
			this.msg = '';
			this.isPosition = false,
				this.keyHeight = 50
			this.modelList = this.wxTypeList



			if (uni.getStorageSync('history_code') != '') {
				this.historySession(uni.getStorageSync('history_code'))
				this.askShow = false;
			}

			this.getDrawRecommend() // 获取问题集

			// 获取相机信息
			// if (uni.getStorageSync('cameraInfo') != '') {
			// 	this.chat_type = 9
			// 	// this.active = 1
			// 	let sendInfo = uni.getStorageSync('cameraInfo')
			// 	this.msg = sendInfo.chatValue
			// 	this.imgList = sendInfo.imgList
			// 	// console.log(sendInfo,415866666)
			// 	this.sd_type = 2
			// 	this.sd_photo_type = 1
			// 	uni.setStorageSync('cameraInfo', '')

			// }
			if (uni.getStorageSync('cameraInfo') != '') {
				console.log('cameraInfo');
				let sendInfo = uni.getStorageSync('cameraInfo')
				// this.chatInputValue = sendInfo.chatValue
				this.origin_image = sendInfo.imgList[0]
				// console.log(sendInfo,415866666)
				uni.setStorageSync('cameraInfo', '')
			}

			this.heightBot()
			this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			let avatarUrl = global.baseImg + '/' + uni.getStorageSync("avatarUrl");
			this.avatar = avatarUrl;

			let that = this;
			uni.createSelectorQuery().select(".head_cont").boundingClientRect(function(
				res) { //定位到你要的class的位置

				// console.log(res.height,410)
				// that.topHeight = parseInt(res.height) + 20;
				that.topHeight = parseInt(res.height);
				that.msgListHeight = that.screenHeight - uni.upx2px(100) - res.height;
				// 获取公告
				// if(uni.getStorageSync('noticeInfo') != '') {
				// 	that.noticeList = uni.getStorageSync('noticeInfo')
				// 	that.topHeight = that.topHeight + 40;
				// }
			}).exec()
			if (uni.getStorageSync('paintingToPic') == 2) {
				this.selectType(2)
				uni.setStorageSync('paintingToPic', '')
			}
			// this.toBottom()
		},
		onLoad(option) {
			this.prSho = false
			this.scrollHeight = uni.getSystemInfoSync().windowHeight - uni.upx2px(80) - 56 - 44 - 44
			// this.getSdModel()
			let safeH = this.isPhoneX() ? 34 : 0;
			// 获取tabbar高度,单位px
			uni.getSystemInfo({
				success: (res) => {
					let bottom = res.screenHeight - res.windowHeight - res.statusBarHeight;
					this.barHeight = bottom / 2;
					// console.log(this.barHeight, 25)
				}
			});

			// 获取屏幕高度
			uni.getSystemInfo({
				success: res => {
					this.screenHeight = res.windowHeight
					// 100为底部输入栏高度，单位rpx，需要先转成px
					// this.msgListHeight = this.screenHeight - uni.upx2px(100)
					// console.log(this.msgListHeight,777);
				}
			})


		},
		onHide() {

		},
		methods: {
			// 获取距离底部高度
			heightBot() {
				uni.createSelectorQuery()
					.select('.flex-column-center')
					.boundingClientRect(rect => {
						const bottomHeight = rect.height;
						console.log(bottomHeight, 6666666666666666666);
						this.placeHight = bottomHeight + 10 + 'px';
					})
					.exec();
			},
			// 获取sd绘画排队人数
			getSdQuery() {
				getSdQuery().then(res => {
					if (res.code == 20000) {
						this.sd_wait = res.data.message_count;
					} else {
						// this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})
			},
			getEnText() {
				let data = {
					text: this.msg,

				}
				let data2 = {
					text: this.sd_complete
				}
				this.enText = '';
				this.sdText = '';

				if (this.msg) {
					getEnText(data).then(res => {
						if (res.code == 20000) {
							if (this.chat_type == 6) {
								this.enText = res.data.text
							} else {
								this.sdText = res.data.text
							}
							this.submit()
							console.log(this.enText, 888)
						} else {
							this.$api.msg('转译失败,请稍后重试')
						}
					})
				}
				if (this.sd_complete) {
					getEnText(data2).then(res => {
						if (res.code == 20000) {
							this.sdHideText = res.data.sd_complete;

							this.submit()
							console.log(this.enText, 888)
						} else {
							this.$api.msg('转译失败,请稍后重试')
						}
					})
				}

			},
			// 获取问题集
			getDrawRecommend() {
				// this.prShow = false
				getDrawRecommend().then(res => {
					if (res.code == 20000) {
						const that = this
						that.billList = res.data;
						that.billListOne = res.data[Math.floor(Math.random() * 23)];
						setTimeout(() => {
							if (that.msg != '' && uni.getStorageSync('history_code') == '') {
								that.toAsk(that.billListOne.pic_desc)
							}
						}, 100)
						this.heightBot()
						// if (this.tab_page == 1) {
						// 	const randomData = res.data[Math.floor(Math.random() * 6)]
						// 	const obj = {
						// 		"image_urls": [{
						// 			url: randomData.pic_url
						// 		}],
						// 		"is_like": 0,
						// 		"dia_text":randomData.pic_desc,
						// 		"tip_code":1
						// 	}
						// 	// this.StableDiffusionList.push(obj)
						// 	this.tipShow = false
						// }
						// this.prShow = true
						// this.toBottom()
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
					// this.prShow = true
				})

				// this.toBottom()
			},

			historySession(session) {

				let data = JSON.parse(session)

				if (data.type == 13) {
					this.chat_type = 13
					this.StableDiffusionList = [];
					this.picToPicList = []
				}

				this.askShow = false;
				this.$forceUpdate()
				if (data.type = 13 && data.type != 3) {
					chat_image(data.code).then(res => {
						if (res.code == 20000) {
							let arr = res.data;
							this.msg = arr[0].prompt
							console.log(this.msg, 'this.msg');
							if (arr[0].origin_image) {
								this.sd_type = 2
								this.sd_photo_type = 2
								// this.imgList = item.images

							} else {
								this.sd_type = 1
								this.sd_photo_type = 2
							}
							// let img_urls = [];
							// img_urls.push(url);
							let data = {
								result_image: arr[1].result_image,
								session_code: arr[0].image_code,
								// chat_group_code: item.chat_group_code,
								is_like: arr[1].is_likes
							}
							if (this.sd_type == 1) {
								this.StableDiffusionList = []
								this.StableDiffusionList.push(data);
							} else {
								this.picToPicList = []
								this.picToPicList.push(data);
								console.log(this.picToPicList, 'his.picToPicList');
							}
							uni.setStorageSync('history_code', '')
						} else {
							this.$api.msg(res.msg)
						}
					}).catch(err => {
						console.log('获取会话失败！', err);
						this.$api.msg('获取会话失败！')
					})
				} else {
					getImgDetail(data.code).then(res => {
						console.log(res, 8852)
						if (res.code == 20000) {
							let arr = res.data;
							arr.forEach((item, index) => {
								this.chat_type = item.chat_type
								if (index == arr.length - 2) {
									this.msg = item.prompt
									if (item.images == null) {
										item.images = []
									}
									this.sd_type = 1
									if (data.type == 13) {
										this.modelList = this.wxTypeList
									} else if (data.type == 14) {
										this.modelList = this.hsTypeList
									} else if (data.type == 3) {
										this.modelList = this.bdTypeList
									}
									this.modelList.forEach((res, tip) => { // 选中相应风格
										if (res.value == item.style) {
											this.queryIndex = tip
										}
									})
								}

								if (index == arr.length - 1) {
									let url = {
										url: global.baseImg + '/' + item.result_image
									};
									let img_urls = [];
									img_urls.push(url);
									let data = {
										image_urls: img_urls,
										session_code: item.image_code,
										is_like: item.is_likes
									}

									if (this.chat_type == 13) {
										this.wxList = [];
										this.wxList.push(data);
										this.modelList = this.wxTypeList
										this.modelValue = this.wxTypeList[0].name;
										this.modelIndex = this.wxTypeList[0].value
										this.query_type = 1;
									}

									if (this.chat_type == 14) {
										this.hsList = [];
										this.hsList.push(data);
										this.modelList = this.hsTypeList
										this.modelValue = this.hsTypeList[0].name;
										this.modelIndex = this.hsTypeList[0].value
										this.query_type = 1;
									}

									if (this.chat_type == 3) {
										this.baiduList = [];
										this.baiduList.push(data);
										this.modelList = this.bdTypeList
										this.modelValue = this.bdTypeList[0].name;
										this.modelIndex = this.bdTypeList[0].value
										this.query_type = 1;
									}

								}

							})
							// this.askShow = false;
							// this.toBottom();

							uni.setStorageSync('history_code', '')
						} else {
							this.$api.msg(res.msg)
						}
					}).catch(err => {
						this.$api.msg('获取会话失败！')
					})
				}

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


			isPhoneX() {
				const res = uni.getSystemInfoSync();
				let iphonex = false;
				let models = ['iphonex', 'iphonexr', 'iphonexsmax', 'iphone11', 'iphone11pro', 'iphone11promax']
				const model = res.model.replace(/\s/g, "").toLowerCase()
				if (models.includes(model)) {
					iphonex = true;
				}
				return iphonex;
			},
			keyboardheight(e) {
				// console.log(e, '键盘高度变化33');
				if (e.detail.height == 0) {
					this.keyHeight = 50
					// console.log(e);
					uni.showTabBar({
						// animation: true
					})
					// 定位到聊天最底部
					// this.toBottom();
					this.isBtn = false
				} else {
					this.isBtn = true
				}
			},

			savePhoto(url) {
				uni.showLoading({
					title: '下载中'
				});
				console.log(url, '我是下载URL');
				this.fileUrl = global.baseImg + '/' +url;
				this.fileType = '1';
				uni.hideLoading()
			},

			focusTexts(event) {
				if (this.isBtn) {
					uni.hideTabBar({
						// animation: true
					})
					this.isPosition = true;
					this.keyHeight = event.detail.height;
					console.log(event.detail.height, 'event.detail.height');
					let messageH = uni.createSelectorQuery().select(".textadd");
					this.$nextTick(() => {
						messageH.boundingClientRect(data => {
							// this.keyboardHeight = this.keyHeight - this.barHeight; //减去底部导航的高度
							this.keyboardHeight = this.keyHeight
							this.msgListHeight = this.screenHeight - this.keyboardHeight - uni.upx2px(110)
							// this.msgListHeight = this.screenHeight - this.keyboardHeight
						}).exec()
					})
					// this.toBottom()
				} else {
					this.isPosition = false;
					this.keyHeight = 50;
				}


			},
			getValue() {
				this.isPosition = false;
				this.keyboardHeight = 0;
				this.keyHeight = 50;
				// uni.hideKeyboard();
				// uni.showTabBar({
				// 	animation: true
				// })
				// console.log(this.chat_type,5621)

			},

			toBottom() {
				console.log('出发了')
				let that = this;
				this.$nextTick(() => {
					setTimeout(() => {
						uni.createSelectorQuery().select(".qwert").boundingClientRect(function(
							res) { //定位到你要的class的位置
							console.log(res, 330);
							uni.pageScrollTo({
								scrollTop: res.height,
								duration: 0
							});
						}).exec()
					}, 0)
				})
				// this.$nextTick(() => {
				// 	setTimeout(() => {
				// 		let query = uni.createSelectorQuery()
				// 		query.select('.qwert').boundingClientRect()
				// 		// query.select('#msglistview').boundingClientRect()
				// 		query.exec((res) => {

				// 			that.scrollTop = res[0].height + this.Height - 30;
				// 		})
				// 	}, 1500)

				// })
			},
			sendMsg() {
				this.sameMsg = this.msg
				this.setShow = false
				this.configShow = false
				let this_ = this
				this.isPosition = false;
				this.draw_tip = false;
				if (this.chat_type == 13) {
					this.getSdQuery()
				}
				// 消息为空不做任何操作
				if (this.msg.trim() == "") {
					this.$api.msg('请输入您要发送的内容')
					return;
				}

				this.askShow = false; // 关闭应用助理提示热词
				this.isuser = true;
				if (this.chat_type == 13) {
					this.getEnText()
				} else {
					this.submit()
				}


			},


			async submit() {
				// this.prShow = false
				uni.setStorageSync('drawInfo', '')
				if (this.chat_type == 13) {
					if (!this.isSd) {
						return
					}

					this.isSd = false;
					if (this.sd_type == 1) {
						this.StableDiffusionList = []
					} else {
						this.picToPicList = []
					}
					this.sd_photo_type = 2
					// 清除消息
					this.sd_msgLoad = true

					this.sdDraw()

				}

			},


			// sd绘画
			sdDraw() {
				// this.prShow = false
				// if (this.tab_page == 1) {
				// 	uni.showLoading({
				// 		content: '生成中，请稍等',
				// 		success() {

				// 		}
				// 	})
				// 	this.tipShow = true
				// }

				let data = {
					"chat_type": '13',
					"action_type": 3,
					"prompt": this.msg,
					"size": this.size,
					"n": 1,
					"style": this.modelIndex,
				}



				let that = this;
				that.sd_timer = 0;
				that.sd_t_time = setInterval(() => {
					that.sd_timer += 1;
				}, 1000)
				that.dia_text = that.msg
				//that.msg = ''; // 清空发送栏内容
				that.sd_complete = '';
				that.sdHideText = '';
				that.query_type = 1;
				// that.imgList = [];
				createImg(data).then(res => {
					if (res.code == 20000) {
						let img_urls = [];
						// let url_val = {
						// 	url: global.baseImg + '/' + res.data.results[0].result_image
						// }
						// img_urls.push(url_val);
						let obj = {
							"finish_reason": "stop",
							"size": res.data.results[0].size,
							"role": "assistant",
							"result_image": res.data.results[0].result_image,
							"time": that.sd_timer,
							"is_like": 0,
							"msg_code": res.data.results[0].msg_code,
							"image_code": res.data.image_code
						}

						let img_arr = [];
						img_arr.push(obj);

						// that.StableDiffusionList.push(obj);
						if (that.StableDiffusionList.length == 0) {
							that.StableDiffusionList = img_arr;
						}
						console.log(that.StableDiffusionList);

						// 定位到聊天最底部
						// that.toBottom();
						that.isuser = true;
						that.sd_msgLoad = false;
						clearInterval(that.sd_t_time);
						// let save_val = {
						// 	"type_name": "Midjourney",
						// 	"type_code": "image",
						// 	"title": data.content,
						// 	"eid": val.data[0].session_code,
						// 	"image_url": val.data[0].content
						// }

						// that.saveFootprint(save_val)


					} else if (res.code < 49999) {
						that.isuser = false;
						that.sd_msgLoad = false;
						that.isSd = true;
						// that.isTime = false;
						clearInterval(that.sd_t_time);
						// that.$api.msg(res.msg)
						that.sd_desc = res.msg;
						if (res.code == 40022) {
							that.draw_tip = true;
						} else {
							that.draw_tip = false;
						}
						uni.hideLoading()
					} else {
						that.sd_msgLoad = false;
						// that.isTime = false;
						clearInterval(that.sd_t_time);
						that.$api.msg(res.msg)
						that.askShow = true
						that.isSd = true;
					}
				}).catch(err => {
					console.log(err, 'err');
					that.sd_msgLoad = false;
					// that.isTime = false;
					clearInterval(that.sd_t_time);
					that.$api.msg('绘图失败')
					that.askShow = true
					that.isSd = true;
					uni.hideLoading()
				})

				// this.toBottom()
			},


			sendMsg2() {
				this.$api.msg('当前问题还没回答完毕，请稍后再提问！')
			},


			hideKey() {
				uni.hideKeyboard()
			},

			goMember() {
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
			goToLogin() {
				uni.navigateTo({
					url: '/pages/login/login',
				})
			},

			dallClose() {
				this.dallshow = false;
			},

			dallOpen() {
				this.dallshow = true;
			},
			selectSize(size, index) {
				this.size = size;
				this.selectDone = index;
			},
			selectTip(val) {
				this.type_tip = val
			},
			toHistory() {
				uni.navigateTo({
					url: '/pages/painting/painting_his'
				})
			},

			// 开启新会话
			addDraw1() {
				uni.setStorageSync('session_code3', '');
				uni.setStorageSync('chat_group_code3', '');
				this.baiduList = []
				this.askShow = true
				this.msg = ''
			},

			addDraw2() {
				uni.setStorageSync('session_code6', '');
				uni.setStorageSync('chat_group_code6', '');
				this.wxList = []
				this.askShow = true
				this.msg = ''
			},

			addDraw3() {
				this.hsList = []
				this.askShow = true
				// this.imgList=[]
				this.StableDiffusionList = []
				this.picToPicList = []
				this.msg = ''
				this.getDrawRecommend()
				this.origin_image = ''
			},

			// 前往提问
			toAsk(e, index) {
				this.billIndex = index,
					this.pic_url = global.baseImg + this.pic_tem
				this.billListOne = this.billList[index];
				this.msg = e
				this.heightBot()
			},


			//模型选择
			modelSubmit(e) {
				this.modelIndex = e.value[0].value;
				this.modelValue = e.value[0].name;
				this.modelShow = false;
			},

			// sd反向提示词
			showFun() {
				this.sd_show = false
				this.getHideText()
			},

			// 发送图片预览
			openImg(url) {
				let img_url = global.baseImg + '/' + url
				uni.previewImage({
					urls: [img_url],
					current: 0
				})
			},

			// 图片预览
			checkImg(index) {
				let url = ''
				if (this.chat_type == 9) {
					if (this.sd_type == 1) {
						url = global.baseImg + '/' + this.StableDiffusionList[index].result_image;
					} else {
						url = global.baseImg + '/' + this.picToPicList[index].result_image;
					}
					uni.setStorageSync('active', 0)
				}
				// let img_url = url[tip].url;
				// console.log(img_url,332)
				uni.previewImage({
					urls: [url],
					current: 0
				})

			},

			// 上传图片
			takePhoto() {
				uni.setStorageSync('active', this.active)
				uni.navigateTo({
					url: '/childPage/chat/camera?chatValue=' + this.msg + '&source=5'
				})
			},

			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},

			//sd选择类型
			selectType(val) {
				this.sd_type = val
				if ((this.StableDiffusionList.length == 0 || this.picToPicList.length == 0) && !this.sd_msgLoad) {
					this.askShow = true
				} else {
					this.askShow = false
					this.sd_photo_type = 2
				}

				if ((this.StableDiffusionList.length > 0 || this.picToPicList.length > 0) && this.imgList.length > 0) {
					this.askShow = true
				}

				if ((this.StableDiffusionList.length > 0 || this.picToPicList.length > 0) && this.imgList.length == 0) {
					this.askShow = false
					this.sd_photo_type = 2
				}
				if (val == 2) {
					this.sd_photo_type = 1
				}
			},
			photoType(val) {
				this.sd_photo_type = val
				if (this.StableDiffusionList.length > 0 || this.picToPicList.length > 0) {
					this.askShow = false
				}
			},

			//选择参数
			queryType(val) {
				this.query_type = val
			},

			// 查看提示
			checkTip() {
				let content = '选择效果: 将生成和效果封面类似的风格或主题图片'

				uni.showModal({
					content: content,
					confirmText: "知道了",
					showCancel: false,
				});
			},

			checkSelect(num) {
				if (num == 1) {
					this.content1 = '靠前的采样（Euler和DDIM）：适合动漫，细节简练，快速；\n靠后的采样（DPM系列）：适合写实，细节丰富，较慢'
					this.select1 = true
				} else if (num == 2) {
					this.content2 = '越低：细节简练，耗时更短\n越高：细节丰富，耗时变长\n注意：步数过高可能产生细节扭曲'
					this.select2 = true
				} else if (num == 3) {
					this.content3 = '越高：更严格遵循绘画描述，细节和清晰度更精确。\n越低：创作更自由，绘画描述的细节和清晰度可能降低最佳使用区间7-12，\n推荐不超过15'
					this.select3 = true
				} else if (num == 4) {
					this.content4 = '越高：更严格遵循绘画描述，细节和清晰度更精确。\n越低：创作更自由，绘画描述的细节和清晰度可能降低最佳使用区间7-12，\n推荐不超过15'
					this.select4 = true
				}

				// uni.showModal({
				// 	content: content,
				// 	confirmText: "知道了",
				// 	showCancel: false,
				// });
			},

			//sd选择参数
			selctQuery(index) {
				this.modelIndex = this.modelList[index].value;
				this.modelValue = this.modelList[index].name;
				this.queryIndex = index;
				this.pic_tem = this.modelList[index].bgcImg
				console.log(this.pic_tem);
			},

			selctSize(size, index) {
				console.log(size, index);
				this.size = size;
				this.sizeIndex = index
			},

			// 点赞点踩
			likeType(val, index) {
				// console.log(val,'islike');
				// console.log(index,'chattype');
				// console.log(this.baiduList,7778)
				let data = {
					is_likes: val
				}
				if (index == 9) {
					if (this.sd_type == 1) {
						data.session_code = this.StableDiffusionList[0].session_code
						data.chat_group_code = this.StableDiffusionList[0].chat_group_code
						this.StableDiffusionList[0].is_like = val
					} else {
						data.session_code = this.picToPicList[0].session_code
						data.chat_group_code = this.picToPicList[0].chat_group_code
						this.picToPicList[0].is_like = val
					}
				}
				if (index < 13) {
					chat_likes(data).then(res => {
						// uni.showToast({ //提示
						// 	title: '评价成功'
						// })
					})
				} else {
					likeList(data).then(res => {
						// uni.showToast({ //提示
						// 	title: '评价成功'
						// })
					})
				}

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
			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			},
			tabSubmit(item, index) {
				this.tab_active = index
				if (index == 0) {
					this.setObj.samplerValue = 'DPM++ 2M Karras'
				}
				// this.tab_page = index + 1
			},
			settingClick(num) {
				if (num == 1) {
					this.setShow = true
					this.configShow = false
				}
			},
			maskClick() {
				this.setShow = false
				this.configShow = false
			},
			// 获取sd模型
			// getSdModel() {
			// 	getSdModel().then(res => {
			// 		console.log('获得了');
			// 		if (res.code == 20000) {
			// 			this.modelList = []
			// 			this.modelList = res.data;
			// 			console.log(this.modelList,4587)
			// 			this.modelValue = res.data[0].name;
			// 			this.modelIndex = res.data[0].value
			// 		} else {
			// 			this.$api.msg(res.msg)
			// 		}
			// 	}).catch(err => {
			// 		this.$api.msg('获取模型失败！')
			// 	})
			// },
			fake(e) {
				this.msg = e
			},
			goShare() {
				uni.navigateTo({
					url: '/childPage/distribution/share'
				})

			},
			samplerChange() {
				this.samplerShow = true,
					this.configShow = false
			},
			selectNum() {
				this.setObj.seed = Math.floor(Math.random() * 4294967295)
			},
			setSave() {
				this.configShow = false
				// uni.setStorageSync('setObj', this.setObj)
			},
			stopStart() {
				clearInterval(this.sd_t_time)
				clearInterval(this.sd_draw_time)
				this.askShow = true
				this.sd_msgLoad = false
				this.isSd = true
			}

		}
	}
</script>

<style scoped lang="less">
	.head_index {
		width: 100%;
		// height: 188upx;
		position: fixed;
		top: -1upx;
		z-index: 999;
	}

	.head_cont {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// padding: 0upx 32upx;
	}

	.cont_title {
		font-style: normal;
		font-weight: 500;
		font-size: 34upx;
		line-height: 100upx;
		color: #000;
		width: 100%;
		text-align: center;
		// position: absolute;
		// top: 0upx;
		// left: 50%;
		// transform: translate(-50%, -50%);
	}


	.bottom-dh-char {
		background-color: #fff;
		width: calc(100% - 32upx);
		// height: 110upx;
		padding: 16upx;
	}

	.bottom_cont {
		background: #fff;
		width: 100%;

		/deep/.u-textarea {
			padding: 10px;
			max-height: 99px;
			overflow-y: auto;

		}
	}

	.isPosition {
		position: fixed;
		z-index: 99;
	}

	.flex-column-center {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		z-index: 9999;
		// padding: 0 15upx;
	}

	.put_text {
		font-style: normal;
		font-weight: 400;
		font-size: 24rpx;
		line-height: 200%;
		color: #AAB2C8;
		display: flex;
		align-items: center;
	}

	.btn_cont {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 10upx 16upx;
		background: #fff;

		.cont_l {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;

			.l_li {
				color: #333;
				font-size: 24upx;
				line-height: 35upx;
			}
		}

		.cont_r {
			display: flex;
			justify-content: space-around;

			.r_li {
				display: flex;
				height: 70upx;
				padding: 0px 30upx;
				justify-content: center;
				align-items: center;
				border-radius: 4px;
				border: 1px solid #DBDBDB;
				color: #999;

				font-size: 26upx;
				font-weight: 500;
			}

			.r_li_active {
				display: flex;
				height: 70upx;
				padding: 0px 30upx;
				justify-content: center;
				align-items: center;
				border-radius: 4px;
				border: 1px solid #DBDBDB;
				color: #fff;
				background: #1F64FF;
				font-size: 26upx;
				font-weight: 500;
			}

			.sd_li {
				display: flex;
				height: 50upx;
				padding: 0px 15upx;
				justify-content: center;
				align-items: center;
				border-radius: 4px;
				border: 1px solid #1F64FF;
				color: #1F64FF;

				font-size: 26upx;
				font-weight: 500;
			}

			.sd_width {
				max-width: 100upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-right: 10upx;
			}
		}
	}

	.right_text {
		font-weight: 400;
		font-size: 26upx;
		color: #1F64FF;
		width: 120upx;
		padding: 10upx 0upx;
		text-align: right;
		margin-right: 15upx;
		border-radius: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chat_input {
		border-radius: 6upx;
		border: 1upx solid #E5E6EB;
		padding-right: 10upx;

		.chat_camera {
			display: flex;
		}

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

	.ex_ul {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ex_time {
		width: calc(100% - 40upx);
		border-radius: 10upx;
		background: #fff;
		margin-top: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 500upx;

		.wait_text {
			color: #000;
			font-size: 28upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			padding: 15upx;
			word-break: break-all;
		}

		.upload_img {
			width: 160upx;
			height: 160upx;
		}

		.upload_text {
			color: #666;
			font-size: 26upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			padding: 20upx 0;
		}
	}

	.ex_img {
		width: calc(100% - 40upx);
		border-radius: 10upx;
		// padding: 10upx 0;
		position: relative;
		background: #fff;
		margin-top: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200upx;

		.li_img {
			width: 100%;
			height: 500upx;
			border-radius: 10upx;
		}



		.ex_use {
			position: absolute;
			bottom: 30upx;
			border-radius: 8upx;
			background: #1F64FF;
			padding: 15upx 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			font-weight: 500;
			color: #fff;
		}

		.ex_update {
			position: absolute;
			bottom: 0upx;
			right: 0upx;
			background: rgba(0, 0, 0, 0.3);
			border-radius: 10upx;
			padding: 15upx;
		}



	}

	.ex_btn {
		padding: 0 32rpx;
		display: flex;
		align-items: flex-start;
		margin-top: 16rpx;

		.btn_text {
			color: #666;
			font-size: 24upx;
			padding-left: 10upx;
		}
	}

	.query {
		padding: 30upx 20upx 20upx 20upx;
		background: #fff;
		margin-top: 20upx;

		.query_type {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 460rpx;
			height: 80rpx;
			border-radius: 16rpx;
			background: #F5F5F5;
			margin-left: 97rpx;
			padding: 0rpx 36rpx;

			.active_tabs {
				color: #FFF;
				font-size: 24rpx;
				line: height 44rpx;
				/* 183.333% */
				padding: 10rpx 30rpx;
				align-items: center;
				border-radius: 8rpx;
				background: #1F64FF;
			}

			.tabs {
				color: #4E5969;
				font-size: 24rpx;
				line-height: 22px;
				/* 183.333% */
				padding: 10rpx 30rpx;
				align-items: center;
				border-radius: 8rpx;
			}

		}

		.query_typetwo {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1upx solid #DBDBDB;

			.active_tabstwo {
				font-style: normal;
				font-weight: 500;
				font-size: 28upx;
				line-height: 50upx;
				color: #000;
				border-bottom: 4upx solid #1F64FF;
				padding: 7upx 0;
			}

			.tabstwo {
				font-style: normal;
				font-weight: 500;
				font-size: 28upx;
				line-height: 50upx;
				color: #000;
				padding: 7upx 0;
			}
		}
	}

	.query_li {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		// margin-bottom: 232upx;
	}

	.li_type {
		width: 22%;
		height: 160upx;
		border-radius: 10upx;
		position: relative;
		margin: 10upx 1.3%;
		display: flex;
		align-items: center;
		justify-content: center;

		.type_img {
			width: 100%;
			height: 152upx;
			border-radius: 10upx;
		}

		.type_tip {
			border-radius: 3upx;
			background: rgba(0, 0, 0, 0.50);
			color: #fff;
			font-size: 22upx;
			width: 80%;
			padding: 8upx;
			position: absolute;
			bottom: 4upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			text-align: center;
		}
	}

	.li_size {
		width: 19%;
		height: 126upx;
		border-radius: 10upx;
		position: relative;
		margin: 10upx 1%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.size_back {
			width: 100%;
			height: 80upx;
			display: flex;
			align-items: center;
			justify-content: center;

			.size_zheng {
				width: 40upx;
				height: 40upx;
			}

			.size_chang {
				width: 60upx;
				height: 40upx;
			}

			.size_gao {
				width: 40upx;
				height: 60upx;
			}
		}

		.size_tip {
			height: 40upx;
			text-align: center;
			font-size: 24upx;
			line-height: 40upx;
		}

	}

	.li_select {
		display: flex;
		flex-direction: column;
		padding: 20upx 0;
		width: calc(100% - 30upx);

		.select_cont {
			display: block;
			align-items: center;
			justify-content: flex-start;

			.select_left {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;

				.select_text {
					color: #000;
					font-size: 26upx;
					font-weight: 400;
					line-height: 150%;
				}
			}

			.select_right {
				width: 100%;
				display: flex;
				margin-bottom: 16rpx;
				position: relative;

				.sd_li {
					width: 100%;
					display: flex;
					height: 50upx;
					padding: 0px 15upx;
					justify-content: center;
					align-items: center;
					border-radius: 4px;
					border: 1px solid #CFCFCF;
					color: #333;
					font-size: 26upx;
					font-weight: 500;
				}

				.sd_width {
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-right: 10upx;
				}
			}

			.select_bot {
				color: #999;
				font-size: 22rpx;
				font-weight: 400;
			}
		}

	}


	.btn_link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: calc(100% - 30upx);
		background: #fff;
		border-top: 1px solid #ddd;
		padding: 10upx 15upx 0 15upx;

		.link_l {
			display: flex;
			align-items: center;

			.l_chat {
				border-radius: 6upx;
				border: 1upx solid #1F64FF;
				padding: 5upx 10upx;
				color: #1F64FF;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				display: flex;
				align-items: center;

			}

			.l_text {
				padding-left: 8upx;
				color: #1F64FF;
				font-size: 24upx;
			}

			.l_wait {
				padding-left: 8upx;
				color: #333;
				font-size: 24upx;
			}
		}
	}

	.tab {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 16rpx;
		width: 320rpx;
		height: 68rpx;
		border: 2rpx solid #E5E6EB;
		position: relative;

		.tab_item {
			width: 50%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.tab_active {
			border-radius: 12upx;
			background: #1F64FF;
			color: #fff;
		}
	}

	.history {
		text-align: center;

		.hisImg {
			width: 48rpx;
			height: 48rpx;
		}

		.history_text {
			color: #3F3F3F;
			font-size: 22rpx;
			white-space: nowrap;
		}
	}

	.headCard {
		width: 91%;
		padding: 46rpx 52rpx 32rpx 17rpx;
		border-radius: 0 16rpx 16rpx 16rpx;
		background: linear-gradient(161deg, #C0D3FE -58.8%, #FFF 45.69%);
		align-items: center;

		.head {
			display: flex;

			.head_content {
				color: #1F64FF;
				font-size: 36rpx;
				font-weight: 500;
				margin-right: 20rpx;
			}
		}

		.head_title {
			color: #242F49;
			font-size: 26rpx;
			margin-top: 14rpx;
			white-space: nowrap;
			margin-bottom: 8rpx;
		}

		.head_price {
			color: #F00;
			font-size: 26rpx;
		}
	}

	.setting {
		width: 100%;
		// height: 60vh;
		border-radius: 24px 24px 0 0;
		background: #FFF;
	}

	.maskLayer {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.60);
		z-index: 999;
	}

	.dialogue {
		width: 75%;
		border-radius: 16rpx;
		background: #FFF;
		padding: 32rpx;
		margin-top: 24rpx;

		.dia_pic {
			width: 100%;

		}

		.dia_text {
			color: #242F49;
			font-size: 32rpx;
			font-weight: 500;
			margin: 24rpx 0 16rpx 0;
		}

		.dia_btn {
			width: 100%;
			height: 64rpx;
			color: #1F64FF;
			font-size: 28rpx;
			font-weight: 500;
			border-radius: 8rpx;
			border: 3rpx solid #1F64FF;
			text-align: center;
			line-height: 200%;
		}

		.btn_text {
			color: #999;
			font-size: 24rpx;
			margin-top: 24rpx;
		}

		.dia_icon {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
		}

		.upImg {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.prompt {
		width: 75%;
		padding: 32rpx;
		border-radius: 0 16rpx 16rpx 16rpx;
		background: #FFF;
		margin-top: 24rpx;

		.pr_title {
			color: #242F49;
			font-size: 32rpx;
			font-weight: 500;
			line-height: 150%;
			/* 24px */
		}

		.pr_try {
			color: #242F49;
			font-size: 28rpx;
			line-height: 150%;
			/* 21px */
			margin: 16rpx 0 14rpx 0;
		}

		.pr_text {
			color: #666;
			text-align: center;
			font-size: 24rpx;
			width: 95%;
			height: 64rpx;
			border-radius: 8rpx;
			background: #F5F5F5;
			margin-bottom: 20rpx;
			display: flex;
			align-items: center;
			padding-left: 32rpx;
		}
	}

	.tabs {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20upx;

		.tabs_t {
			display: flex;
		}

		.tabs_l {
			color: #333;
			font-size: 26upx;
			line-height: 36upx;
			background: #fff;
			padding: 10upx 30upx;
			border-radius: 4px 0px 0px 4px;
			border: 1upx solid #E5E6EB;
		}

		.tabs_l_active {
			color: #fff;
			font-size: 26upx;
			line-height: 36upx;
			background: #1F64FF;
			padding: 10upx 30upx;
			border-radius: 4px 0px 0px 4px;
		}

		.tabs_r {
			color: #333;
			font-size: 26upx;
			line-height: 36upx;
			background: #fff;
			padding: 10upx 30upx;
			border-radius: 0px 4px 4px 0px;
			border: 1upx solid #E5E6EB;
		}

		.tabs_r_active {
			color: #fff;
			font-size: 26upx;
			line-height: 36upx;
			background: #1F64FF;
			padding: 10upx 30upx;
			border-radius: 0px 4px 4px 0px;
		}
	}

	.page_cont {
		width: 100%;
		background: #fff;


		.tab_photo {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 20upx;

			// margin-left: -40upx;
			.tabs_photo_active {
				color: #fff;
				font-size: 24upx;
				line-height: 36upx;
				background: #1F64FF;
				padding: 10upx 20upx;
				border-radius: 4px;
			}

			.tabs_photo {
				color: #333;
				font-size: 24upx;
				line-height: 36upx;
				background: #E0EEFF;
				padding: 10upx 20upx;
				border-radius: 4px;
			}
		}

		.ex_like {
			background: #F3F7FF;
			border-radius: 10upx;
			padding: 10upx;
			margin-right: 20upx;
		}

		.ex_nlike {
			background: #F3F7FF;
			border-radius: 10upx;
			padding: 10upx;
			margin-right: 20upx;
		}

	}

	.copy {
		display: flex;
		align-items: center;

		.copyImg {
			width: 50rpx;
			height: 50rpx;
		}

		.copy_txt {
			color: #1F64FF;
			font-size: 24rpx;
			margin-left: 10rpx;
			white-space: nowrap;
		}
	}


	.minus {
		width: 64rpx;
		height: 64rpx;
		border-radius: 8rpx;
		border: 2rpx solid #CFCFCF;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		right: 8%;
		top: 2%;
	}

	.plus {
		width: 64rpx;
		height: 64rpx;
		border-radius: 8rpx;
		border: 2rpx solid #CFCFCF;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		right: -4%;
		top: 2%;
	}


	.select_int {
		height: 64rpx;
		margin: 0 24rpx;
		border-radius: 8rpx;
		border: 2rpx solid #CFCFCF;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		// position: absolute;
		// top: 30%;
		// left: -3%;
	}

	.randomImg {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		top: 12rpx;
		right: 22%;
	}

	.select_btn {
		display: flex;
		width: 61%;
		padding: 20rpx 48rpx;
		justify-content: center;
		align-items: center;
		gap: 20rpx;
		border-radius: 12rpx;
		background: #1F64FF;
		color: var(--Text-text-white, #FFF);
		font-size: 34rpx;
		font-weight: 600;
	}
</style>