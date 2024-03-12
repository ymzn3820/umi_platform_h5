<template>
	<view class="home">

		<view class="head_index">
			<view class="head_cont">
				<Title :title='"应用助理"' />
				<view class="cont_tabs"
					style="width: 100%; background-color: #fff; display: flex; align-items: center; justify-content: space-between;">
					<u-tabs :list="tabList" lineWidth='50' lineHeight='4' lineColor='#1f64ff'
						:activeStyle='{color: "#1F64FF","font-size":"30rpx","transform": "scale(1.05)"}'
						@change='tabsChange' :current='current'
						:inactiveStyle='{"font-size":"30rpx", "color": "#999"}'></u-tabs>
					<!-- <view class="right_text" @click="toCreate">创作中心</view> -->
				</view>
				<view class="tab_line line_select" v-if="current == 4">
					<view class="line" @click="selectType(1)">
						<text :class="[selectDone1 != -1 ? 'active_line_text' : 'line_text']">{{ hy_name }}</text>
						<image src="@/static/user/down.png" mode="" class="line_img">
						</image>
					</view>
					<view class="line" @click="selectType(2)">
						<text :class="[selectDone2 != -1 ? 'active_line_text' : 'line_text']">{{ zy_name }}</text>
						<image src="@/static/user/down.png" mode="" class="line_img">
						</image>
					</view>
					<view class="line" @click="selectType(3)">
						<text :class="[selectDone3 != -1 ? 'active_line_text' : 'line_text']">{{ lx_name }}</text>
						<image src="@/static/user/down.png" mode="" class="line_img">
						</image>
					</view>
					<view class="line" @click="selectType(4)">
						<text :class="[selectDone4 != -1 ? 'active_line_text' : 'line_text']">{{ sj_name }}</text>
						<image src="@/static/user/down.png" mode="" class="line_img">
						</image>
					</view>
					<view class="line" @click="selectType(5)">
						<text :class="[selectDone5 != -1 ? 'active_line_text' : 'line_text']">{{ dw_name }}</text>
						<image src="@/static/user/down.png" mode="" class="line_img">
						</image>
					</view>
				</view>

				<view class="tab_moudel" v-if="current > 0">
					<view class="line_moudel">
						<view v-for="(item, index) in swiperList" :key="index"
							:class="[tip == index ? 'active_l_select' : 'l_select']" @click="selectTip(index)">
							{{ item.name }}
						</view>
					</view>
					<view class="line_search" @click="toSearch">
						<u-icon name="search" color="#666" size="28"></u-icon>
						<text class="search_text">搜索</text>
					</view>
				</view>
			</view>
		</view>

		<view class="apply_cont" :style="{marginTop: keyHeight +'px'}">
			<view class="cont_text" v-if="current > 0">
				<view class="text_right" :style="{height: listHeight +'px'}">
					<scroll-view scroll-y="true" @scrolltolower="scrolltolower" :style="{height: listHeight +'px'}">
						<view class="hotWrods">
							<view v-if="promptsList.length > 0" class="hot_cont">
								<view v-for='item,index in promptsList' :key='index'
									style="width: 50%; display: flex; align-items: center; justify-content: center;">
									<view @click="eidtContent(item)" class="box">

										<view class="text">
											<view class="textInfo">
												<image :src="getImgUrl(item.character_avatar)" mode="" class="li_avatar"
													v-if="item.industry_id == '1003'" />
												<view class="li_avatar" style="background: #40DE9F;"
													v-else-if="item.industry_id == '1001'">{{ item.title.slice(0,1) }}
												</view>
												<view class="li_avatar" style="background: #7F48FF;"
													v-else-if="item.industry_id == '1000'">{{ item.title.slice(0,1) }}
												</view>
												<view class="li_avatar" style="background: #FF8E8E;"
													v-else-if="item.industry_id == '1005'">{{ item.title.slice(0,1) }}
												</view>
												<view class="li_avatar" style="background: #FFB833;" v-else>
													{{ item.title.slice(0,1) }}
												</view>
												<view class="li_text">{{item.title}}</view>
											</view>
											<view class="tips">

											</view>
										</view>
										<view class="text_cont">
											<text class="text_li">{{ item.content }}</text>
										</view>
										<image :src="backImg" mode="" class="back_img"></image>
									</view>
								</view>
							</view>

							<view class="on_order_list" v-if="promptsList.length == 0">
								暂无相关内容
							</view>

							<view class="on_order_list" v-if="loadingType == 1 && promptsList.length > 0">没有更多内容了!
							</view>
						</view>

					</scroll-view>
				</view>
			</view>

			<!-- 私享定制 -->
			<view v-if="current == 0">
				<view class="manage_info" v-if="isLogin">
					<!-- 我的信息 -->
					<view class="info_me"
						style="background: linear-gradient(161deg, #C0D3FE -58.8%, #FFF 45.69%); margin-bottom: 20rpx;">
						<view class="me_title">
							<view class="title_left">遇事不决问自己</view>
						</view>

						<view class="me_cont">
							<view class="cont_left" @click="mentorChat(meList.photo, meList.greeting,meList.me_id,'')">
								<image :src="getImgUrl(meList.photo)" mode="" class="left_img">
									<view class="left_text">我</view>
							</view>
							<view class="cont_right">
								<view class="cont_btn"
									@click="mentorChat(meList.photo, meList.greeting,meList.me_id,'')">
									问自己</view>
								<view class="cont_btn_b" @click="toDetail(meList.me_id)">编辑资料</view>
								<view class="cont_text">*补充完善资料，我将成为您的孪生数字人</view>
							</view>
						</view>
					</view>

					<view class="info_me" :style="meImg"
						@click="mentorChat(meList.photo, meList.greeting,meList.me_id,'')">
						<view class="info_title">
							<view class="title_l">
								<image :src="getImgUrl(meList.photo)" mode="" class="l_img">
							</view>
							<view class="title_r">Hi,{{ meList.name }}</view>
						</view>
						<view class="info_text">
							<text class="text_l">{{ time_text }}</text>
							<text class="text_l">,好久不见了呀，最近怎么样？</text>
						</view>
					</view>

					<view class="notice" v-if="messageList.length > 0">
						<u-notice-bar :text="messageList" color="#1E211F" bgColor="#EBF1FF" mode="link"
							direction="column" url="/childPage/notice/notice"></u-notice-bar>
					</view>
					<!-- 导师信息 -->
					<view class="info_me"
						style="background: linear-gradient(140deg, #C0EAFE -32.97%, #FFF 34.74%); margin-bottom: 0;">
						<view class="me_title" style="margin-bottom: 20upx;">
							<view class="title_left">私享AI顾问</view>
							<view class="title_right" @click="toManage">
								<text class="right_texts">导师管理</text>
								<u-icon size="14" name="arrow-right"></u-icon>
							</view>
						</view>

						<view class="other_cont">
							<view class="cont_left" v-for="(item, index) in otherList" :key="index"
								v-if="JSON.stringify(item) != '{}'">
								<image :src="getImgUrl(item.avatar)" mode="" class="left_img"
									@click="mentorChat(item.avatar, item.greeting,item.me_id,item.tutor_id)">
									<view class="left_text">{{ item.character_name }}</view>
									<view class="qh_img" @click="addMentor(meList.me_id,index,item.tutor_id)"></view>
							</view>
						</view>
					</view>

				</view>

				<view class="manage_info" v-if="!isLogin">

					<!-- 导师信息 -->
					<view class="info_me"
						style="background: linear-gradient(140deg, #C0EAFE -32.97%, #FFF 34.74%); margin-bottom: 0;">
						<view class="me_title" style="margin-bottom: 20upx;">
							<view class="title_left">AI导师助你成功</view>
							<view class="title_right" @click="toManage">
								<text class="right_texts">导师管理</text>
								<u-icon size="14" name="arrow-right"></u-icon>
							</view>
						</view>

						<view class="other_cont">
							<view class="cont_left" v-for="(item, index) in exArr1" :key="index"
								v-if="JSON.stringify(item) != '{}'">
								<image :src="getImgUrl(item.avatar)" mode="" class="left_img" @click="toLogin">
									<view class="left_text">{{ item.character_name }}</view>
							</view>
						</view>
					</view>
				</view>

				<view style="padding: 20upx;">
					<view class="mentor">
						<view class="mentor_title">热门AI顾问推荐</view>
						<view class="mentor_cont" v-for="(item, index) in mentorList" :key="index"
							@click="mentorChat(item.avatar, item.greeting,item.me_id,item.tutor_id)">
							<view class="cont_l">
								<image :src="getImgUrl(item.avatar)" mode="" class="l_img">
							</view>
							<view class="cont_r">
								<text class="r_top">{{ item.character_name }}</text>
								<text class="r_btn">{{ item.greeting }}</text>
							</view>
						</view>
					</view>
				</view>

			</view>

			<view v-if="current == 0" class="wz_tip" @click="toCreateList">
				<image :src="creatImg" mode="" class="creat_img"></image>
			</view>
			<view v-else class="wz_tip" @click="toCreate">
				<image :src="creatImg" mode="" class="creat_img"></image>
			</view>
		</view>

		<!-- 选择行业弹窗 -->
		<u-popup :show="selectShow" mode="top" overlayOpacity="0.3" :safeAreaInsetBottom="false" zIndex="11"
			:overlayStyle="{'z-index':'9'}" @close="selectShow = false" :customStyle="{marginTop: popHeight+'px'}">
			<view class="tab_line">
				<view class="line" @click="selectDialog(1)">
					<text :class="[type == 1 || selectDone1 != -1 ? 'active_line_text' : 'line_text']">行业</text>
					<image src="@/static/user/up.png" mode="" class="line_img" v-if="type == 1 || selectDone1 != -1">
					</image>
					<image src="@/static/user/down.png" mode="" class="line_img" v-else></image>
				</view>
				<view class="line" @click="selectDialog(2)">
					<text :class="[type == 2 || selectDone2 != -1 ? 'active_line_text' : 'line_text']">职业</text>
					<image src="@/static/user/up.png" mode="" class="line_img" v-if="type == 2 || selectDone2 != -1">
					</image>
					<image src="@/static/user/down.png" mode="" class="line_img" v-else></image>
				</view>
				<view class="line" @click="selectDialog(3)">
					<text :class="[type == 3 || selectDone3 != -1 ? 'active_line_text' : 'line_text']">类型</text>
					<image src="@/static/user/up.png" mode="" class="line_img" v-if="type == 3 || selectDone3 != -1">
					</image>
					<image src="@/static/user/down.png" mode="" class="line_img" v-else></image>
				</view>
				<view class="line" @click="selectDialog(4)">
					<text :class="[type == 4 || selectDone4 != -1 ? 'active_line_text' : 'line_text']">从业时间</text>
					<image src="@/static/user/up.png" mode="" class="line_img" v-if="type == 4 || selectDone4 != -1">
					</image>
					<image src="@/static/user/down.png" mode="" class="line_img" v-else></image>
				</view>
				<view class="line" @click="selectDialog(5)">
					<text :class="[type == 5 || selectDone5 != -1 ? 'active_line_text' : 'line_text']">地位</text>
					<image src="@/static/user/up.png" mode="" class="line_img" v-if="type == 5 || selectDone5 != -1">
					</image>
					<image src="@/static/user/down.png" mode="" class="line_img" v-else></image>
				</view>
			</view>

			<view class="cont_mid" v-for="(item,index) in hyList" :key="index"
				@click="selectHy(item.industry_id, item.name, index)" v-if="type == 1">
				<view class="mid_l">{{ item.name }}</view>
				<image class="mid_img" src="@/static/user/check.png" v-if="selectDone1 == index" />
			</view>

			<view class="cont_mid" v-for="(item,index) in zyList" :key="index"
				@click="selectZy(item.occu_id, item.name, index)" v-if="type == 2">
				<view class="mid_l">{{ item.name }}</view>
				<image class="mid_img" src="@/static/user/check.png" v-if="selectDone2 == index" />
			</view>

			<view class="cont_mid" v-for="(item,index) in lxList" :key="index"
				@click="selectLx(item.sub_occu_id, item.name, index)" v-if="type == 3">
				<view class="mid_l">{{ item.name }}</view>
				<image class="mid_img" src="@/static/user/check.png" v-if="selectDone3 == index" />
			</view>

			<view class="cont_mid" v-for="(item,index) in sjList" :key="index"
				@click="selectSj(item.emp_duration_id, item.emp_duration_name, index)" v-if="type == 4">
				<view class="mid_l">{{ item.emp_duration_name }}</view>
				<image class="mid_img" src="@/static/user/check.png" v-if="selectDone4 == index" />
			</view>

			<view class="cont_mid" v-for="(item,index) in dwList" :key="index"
				@click="selectDw(item.expertise_level_id, item.name, index)" v-if="type == 5">
				<view class="mid_l">{{ item.name }}</view>
				<image class="mid_img" src="@/static/user/check.png" v-if="selectDone5 == index" />
			</view>
			<view class="cont_mids">
				<view class="mid_btn" @click="clear">
					<image class="clear_img" src="@/static/user/clear.png" />
					<text class="clear_text">重置</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	// import { prompts } from '@/apis/chat.js'
	import {
		getIndustry,
		getOccupation,
		getSec,
		getDuration,
		getExpertise,
		getModules,
		getQuestions,
		getQrCode,
		getTab,
		getMessage,
		getTutor,
		getMe,
		getAllMe
	} from '@/apis/user.js'
	export default {
		components: {},
		data() {
			return {
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				current: 0, //助理切换
				tip: 0, // 宫格点击
				type: 1, // 行业类型
				selectDone1: -1,
				selectDone2: -1,
				selectDone3: -1,
				selectDone4: -1,
				selectDone5: -1,
				select_text: 0,
				select_text2: 0,
				select_text3: 0,
				select_text4: 0,
				select_text5: 0,
				hy_name: '行业',
				zy_name: '职业',
				lx_name: '类型',
				sj_name: '从业时间',
				dw_name: '地位',
				chatType: 'AI35',
				selectShow: false,

				loading: false,
				promptsList: [],
				instructName: [],
				show: false,
				content: "",
				loadingType: 0,
				page_no: 1,
				page_count: 15,
				pageTotal: 0,

				tabList: [],
				swiperList: [], // 操作指令
				hyList: [], //行业
				zyList: [], //职业
				lxList: [], //类型
				sjList: [], //时间
				dwList: [], //地位
				keyHeight: 40,
				topHeight: 0,
				popHeight: 0,
				msgListHeight: 0,
				listHeight: 0,
				applyInfo: '',
				backImg: global.baseImg + '/xcx/9cbaf339-29fe-47d1-9685-0dabe4d5a00d.jpg',
				creatImg: global.baseImg + '/xcx/f0785792-267f-472b-b9aa-8144328cf9a4.jpg',

				meImg: 'background-image: url("' + global.baseImg + '/xcx/com/message_center/heading.png")',
				messageList: [], // 消息公告
				exArr1: [],
				exArr2: [],
				allMentor: [],
				isLogin: false,
				meList: '',
				otherList: [],
				mentorList: [],
				time_text: '',
				me_id: ''
			}
		},

		watch: {
			select_text(val, oldVal) { // 监控行业改变
				// console.log("select_text = " + val + " , oldValue = " + oldVal)
				if (this.select_text != 0 && this.select_text != -1) {
					this.selectDone2 = -1
					this.selectDone3 = -1
					this.selectDone4 = -1
					this.selectDone5 = -1
					this.zy_name = '职业'
					this.lx_name = '类型'
					this.sj_name = '从业时间'
					this.dw_name = '地位'
					let data = {
						industry_id: val
					}
					this.getOccupation(data)
					this.getModules(data)
				}
			},

			select_text2(val, oldVal) { // 监控职业改变
				if (this.select_text2 != 0 && this.select_text2 != -1) {
					this.selectDone3 = -1
					this.selectDone4 = -1
					this.selectDone5 = -1
					if (this.current == 4) {
						this.lx_name = '类型'
						this.sj_name = '从业时间'
						this.dw_name = '地位'
						let data = {
							industry_id: this.select_text,
							occu_id: val
						}
						this.getSec(data)
						this.getModules(data)
					}

				}
			},

			select_text3(val, oldVal) { // 监控子职业改变
				if (this.select_text3 != 0 && this.select_text3 != -1) {
					this.selectDone4 = -1
					this.selectDone5 = -1
					if (this.current == 4) {
						this.sj_name = '从业时间'
						this.dw_name = '地位'
						let data = {
							industry_id: this.select_text,
							occu_id: this.select_text2,
							sub_occu_id: val
						}
						this.getDuration(data)
						this.getModules(data)
					}

				}


			},

			select_text4(val, oldVal) { // 监控从业时间改变
				if (this.select_text4 != 0 && this.select_text4 != -1) {
					this.selectDone5 = -1
					if (this.current == 4) {
						this.dw_name = '地位'
						let data = {
							industry_id: this.select_text,
							occu_id: this.select_text2,
							sub_occu_id: this.select_text3,
							emp_duration_id: val
						}
						this.getExpertise(data)
						this.getModules(data)
					}

				}
			},

			select_text5(val, oldVal) { // 监控专业水平改变
				if (this.select_text5 != 0) {
					if (this.current == 4) {
						let data = {
							industry_id: this.select_text,
							occu_id: this.select_text2,
							sub_occu_id: this.select_text3,
							emp_duration_id: this.select_text4,
							expertise_level_id: val
						}
						this.getModules(data)
					}

				}
			}
		},

		onShow() {
			this.getTab()
			// 获取屏幕高度
			uni.getSystemInfo({
				success: res => {
					// this.screenHeight = res.windowHeight
					// 100为底部输入栏高度，单位rpx，需要先转成px
					// this.msgListHeight = res.windowHeight - uni.upx2px(100)
					this.msgListHeight = res.windowHeight
					// console.log(this.msgListHeight,777);
				}
			})

			this.current = 0;
			this.getMessageList();
			this.getTutor();
			let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			if (userInfo.role == 'guess') {
				this.headImg = global.baseImg + '/xcx/com/message_center/Frame%20427320149.png'
				this.isLogin = false
			} else {
				this.getMe()
				this.isLogin = true
			}

			this.getTime()


			uni.showTabBar({
				// animation: true
			})

			// this.instructName = ['影视/音乐']
			// this.promptsFun()
			let that = this;
			this.keyHeight = 44;
			this.topHeight = 44;
			// uni.createSelectorQuery().select(".head_index").boundingClientRect(function(
			// 	res) { //定位到你要的class的位置
			
			// 	console.log(res.height,410)
			// 	that.keyHeight = res.height;
			// 	// that.topHeight = parseInt(that.keyHeight) - 40
			// 	that.topHeight = parseInt(that.keyHeight)
			// 	// that.popHeight = parseInt(that.keyHeight) - 84
			// 	that.popHeight = parseInt(that.keyHeight) - 44
			// 	that.listHeight = parseInt(that.msgListHeight)
			// 	if (that.current == 0) {
			// 		that.keyHeight = res.height;
			// 	}
			// 	if (that.current == 4) {
			// 		that.keyHeight = parseInt(that.topHeight) + 120;
			// 		// console.log(that.keyHeight,885)
			// 	}
			// }).exec()
		},
		

		onHide() {
			this.select_text = -1;
			this.current = 0;
		},
		methods: {
			getTime() {
				// 获取当前时间
				let timeNow = new Date();
				// 获取当前小时
				let hours = timeNow.getHours();
				// 判断当前时间段
				if (hours >= 0 && hours <= 10) {
					this.time_text = `早上好`;
				} else if (hours > 10 && hours <= 14) {
					this.time_text = `中午好`;
				} else if (hours > 14 && hours <= 18) {
					this.time_text = `下午好`;
				} else if (hours > 18 && hours <= 24) {
					this.time_text = `晚上好`;
				}
			},
			// 获取头部tab
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
						this.mentorList = res.data;
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
								this.me_id = item.me_id
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
			// 重置
			clear() {
				this.selectDone1 = -1
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

			//切换助理
			tabsChange(e) {
				let index = e.tab_id;
				// console.log(index, 111111111111111);
				this.tip = 0; //每次切换选中第一个
				if (index == 1006) {
					this.current = 4;
					this.keyHeight = parseInt(this.topHeight) + 80;
					this.listHeight = parseInt(this.msgListHeight) - parseInt(this.keyHeight)
					// this.select_text = this.hyList[0].industry_id;
					// this.hy_name = this.hyList[0].name
					this.getIndustry()
				} else if (index == 1000) {
					this.current = 3;
					this.keyHeight = parseInt(this.topHeight) + 40
					this.listHeight = parseInt(this.msgListHeight) - parseInt(this.keyHeight)
					this.select_text = '1000';
					this.select_text2 = 0;
					this.select_text3 = 0;
					this.select_text4 = 0;
					this.select_text5 = 0;
					this.zy_name = '职业'
					this.lx_name = '类型'
					this.sj_name = '从业时间'
					this.dw_name = '地位'
					this.zyList = []
					this.lxList = []
					this.sjList = []
					this.dwList = []
					// this.clear()
				} else if (index == 1001) {
					this.current = 2;
					this.keyHeight = parseInt(this.topHeight) + 40
					this.listHeight = parseInt(this.msgListHeight) - parseInt(this.keyHeight)
					this.select_text = '1001';
					this.select_text2 = 0;
					this.select_text3 = 0;
					this.select_text4 = 0;
					this.select_text5 = 0;
					this.zy_name = '职业'
					this.lx_name = '类型'
					this.sj_name = '从业时间'
					this.dw_name = '地位'
					this.zyList = []
					this.lxList = []
					this.sjList = []
					this.dwList = []
					// this.clear()
				} else if (index == 1003) {
					this.current = 1;
					this.keyHeight = parseInt(this.topHeight) + 40
					this.listHeight = parseInt(this.msgListHeight) - parseInt(this.keyHeight)
					this.select_text = '1003';
					this.select_text2 = 0;
					this.select_text3 = 0;
					this.select_text4 = 0;
					this.select_text5 = 0;
					this.zy_name = '职业'
					this.lx_name = '类型'
					this.sj_name = '从业时间'
					this.dw_name = '地位'
					this.zyList = []
					this.lxList = []
					this.sjList = []
					this.dwList = []
					// this.clear()
				} else {
					this.current = 0
					this.keyHeight = parseInt(this.topHeight)
					this.listHeight = parseInt(this.msgListHeight) - parseInt(this.keyHeight)
					this.select_text = '1003';
					this.select_text2 = 0;
					this.select_text3 = 0;
					this.select_text4 = 0;
					this.select_text5 = 0;
					this.zy_name = '职业'
					this.lx_name = '类型'
					this.sj_name = '从业时间'
					this.dw_name = '地位'
					this.zyList = []
					this.lxList = []
					this.sjList = []
					this.dwList = []
				}


			},

			// 获取行业
			getIndustry() {
				getIndustry().then(res => {
					if (res.code == 20000) {
						// console.log(res,4125)
						this.hyList = res.data;
						this.select_text = res.data[0].industry_id;
						this.hy_name = res.data[0].name;
						this.selectDone1 = 0;
					} else {
						this.$api.msg(res.msg)
					}

				})
			},

			// 获取职业
			getOccupation(data) {
				getOccupation(data).then(res => {
					if (res.code == 20000) {
						this.zyList = res.data;
					} else {
						this.$api.msg(res.msg)
					}
				})
			},

			// 获取子职业
			getSec(data) {
				getSec(data).then(res => {
					if (res.code == 20000) {
						this.lxList = res.data;
					} else {
						this.$api.msg(res.msg)
					}
				})
			},

			// 获取从业时间
			getDuration(data) {
				getDuration(data).then(res => {
					if (res.code == 20000) {
						this.sjList = res.data;
					} else {
						this.$api.msg(res.msg)
					}
				})
			},

			// 获取专业水平列表
			getExpertise(data) {
				getExpertise(data).then(res => {
					if (res.code == 20000) {
						this.dwList = res.data;
					} else {
						this.$api.msg(res.msg)
					}
				})
			},

			// 获取模块集合
			getModules(data) {
				getModules(data).then(res => {
					if (res.code == 20000) {
						if (res.data.length > 0) {
							this.swiperList = res.data;
							// console.log(this.applyInfo,4763)
							this.instructName = [];
							this.instructName.push(res.data[0].module_id)
							// this.tip = 0;
							this.promptsFun()
						} else {
							this.swiperList = res.data;
							this.promptsList = []
						}

					} else {
						this.$api.msg(res.msg)
					}

				})

			},

			//页面触底翻页
			scrolltolower() {
				// console.log('触发底部了')
				if (this.loadingType == 1) return
				this.page_no++
				let data = {
					'industry_id': this.select_text,
					'module_id': this.instructName,
					'page_index': this.page_no,
					'page_count': this.page_count
				}
				if (this.select_text2 != 0) {
					data.occupation_id = this.select_text2
				}

				if (this.select_text3 != 0) {
					data.sub_occu_id = this.select_text3
				}

				if (this.select_text4 != 0) {
					data.emp_duration_id = this.select_text4
				}

				if (this.select_text5 != 0) {
					data.expertise_level_id = this.select_text5
				}
				getQuestions(data).then(res => {
					if (res.code == 20000) {

						let total = res.total;
						if (total == 0) return
						let List = res.data;
						// console.log(List, 333)
						// let addList = this.promptsList;
						List.forEach(item => {
							this.promptsList.push(item);
						});

						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						// console.log(this.pageTotal, 1585)
						if (this.pageTotal <= this.page_no) {
							this.loadingType = 1
						}

						this.$forceUpdate()
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取信息失败');
				})
			},

			//编辑内容
			eidtContent(item) {
				if (item.industry_id != '1003') {
					uni.navigateTo({
						url: "/pages/apply/apply_ask?item=" + JSON.stringify(item)
					})
				} else {
					item.character_name = item.title
					item.character_greetings = item.content
					// const tip = item.character_avatar.slice(0, 1)
					// console.log(item.character_avatar);
					// if (tip != '/') {
					// 	item.character_avatar = global.baseImg + '/' + item.character_avatar
					// } else {
					// 	item.character_avatar = global.baseImg + item.character_avatar
					// }
					uni.navigateTo({
						url: '/childPage/role/user_chat?item=' + JSON.stringify(item)
					})
				}

			},

			selectTip(val) {
				this.tip = val;
				this.instructName = []
				this.instructName.push(this.swiperList[val].module_id);
				this.promptsFun()
			},

			selectType(val) {
				this.selectShow = true
				this.type = val
			},

			selectDialog(val) {
				this.type = val
			},

			selectHy(val, name, index) {
				this.select_text = val;
				this.selectDone1 = index;
				this.hy_name = name;
				this.selectShow = false;
			},

			selectZy(val, name, index) {
				this.select_text2 = val;
				this.selectDone2 = index;
				this.zy_name = name;
				this.selectShow = false;
			},

			selectLx(val, name, index) {
				this.select_text3 = val;
				this.selectDone3 = index;
				this.lx_name = name;
				this.selectShow = false;
			},

			selectSj(val, name, index) {
				this.select_text4 = val;
				this.selectDone4 = index;
				this.sj_name = name;
				this.selectShow = false;
			},

			selectDw(val, name, index) {
				this.select_text5 = val;
				this.selectDone5 = index;
				this.dw_name = name;
				this.selectShow = false;
			},

			promptsFun() {
				this.page_no = 1;
				this.loadingType = 0;
				if (this.select_text == 0) {
					this.select_text = 1001
				}
				let data = {
					'industry_id': this.select_text,
					'module_id': this.instructName,
					'page_index': this.page_no,
					'page_count': this.page_count
				}
				if (this.select_text2 != 0) {
					data.occupation_id = this.select_text2
				}

				if (this.select_text3 != 0) {
					data.sub_occu_id = this.select_text3
				}

				if (this.select_text4 != 0) {
					data.emp_duration_id = this.select_text4
				}

				if (this.select_text5 != 0) {
					data.expertise_level_id = this.select_text5
				}

				getQuestions(data).then(res => {

					if (res.code == 20000) {
						this.loading = false;
						this.promptsList = res.data
						let total = res.total;
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						if (this.pageTotal == 1) {
							this.loadingType = 1;
						}

						this.$forceUpdate()
					} else {
						this.$api.msg(res.msg)
						this.loading = false;
					}

				}).catch(err => {
					this.loading = false;
					// this.$api.msg('');
				})
			},

			//创建中心
			toCreate() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childPage/role/role',
					})
				}
			},
			toCreateList() {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if (userInfo.role == 'guess') {
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} else {
					uni.navigateTo({
						url: '/childPage/mentor/add_list?me_id='+ this.me_id,
					})
				}
			},

			getImgUrl(url) {
				// console.log(url);
				return global.baseImg + '/' + url;
			},

			toSearch() {
				uni.navigateTo({
					url: '/pages/apply/apply_search',
				})
			},

			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			}
		}
	}
</script>
<style>
	page {
		background: #f6f8fB;
	}
</style>
<style lang="less" scoped>
	.head_index {
		width: 100%;
		// height: 268upx;
		position: fixed;
		top: 0upx;
		background: #fff;
		z-index: 10;
	}

	.head_cont {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// padding: 0upx 32upx;
	}

	.cont_tabs {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		height: 44px;
		// border-bottom: 1px solid #E5E6EB;
		background: #fff;
		// position: absolute;
		// top: 100upx;
		// left: 0;
		line-height: 44px;
		font-size: 14px;
		// padding-left: 32upx;

	}

	// .apply_cont { margin-top: 88upx; }
	// .line_select { position: fixed; top: 108px; left: 0; z-index: 10; }
	.line_select {
		z-index: 10;
	}

	.tab_line {
		// padding: 20upx 0upx;
		// border-bottom: 1upx solid #E6E6E8;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #fff;
		width: 100%;
		height: 40px;

		.line {
			display: flex;
			align-items: center;

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

	.cont_text {
		display: flex;
		justify-content: space-between;

		.text_right {
			width: 100%;
			display: flex;
			overflow: auto;

			.hotWrods {
				padding: 30upx 18upx 18upx 18upx;

				.hot_cont {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					flex-wrap: wrap;
				}

				.box {
					background: #FFFFFF;
					// box-shadow: 0px 3px 8px rgba(51, 51, 51, 0.1);					
					box-shadow: 0px 2.23993px 7.83975px rgba(51, 51, 51, 0.1);
					border-radius: 8px;
					margin-bottom: 10px;
					width: 90%;
					padding: 12upx;
					position: relative;

					// line-height: 40px;
					.text {
						display: flex;
						align-items: center;
						justify-content: space-between;

					}

					.text_cont {
						padding: 10upx;
						max-height: 140upx;

						.text_li {
							font-size: 26upx;
							color: #888;
							line-height: 40upx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2; // 控制多行的行数
							-webkit-box-orient: vertical;
						}
					}

					.textInfo {
						display: flex;
						align-items: center;

						.li_avatar {
							width: 80upx;
							height: 80upx;
							border-radius: 7upx;
							color: #fff;
							display: flex;
							align-items: center;
							justify-content: center;
						}

						.li_text {
							max-width: 200upx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							display: inline-block;
							color: #333;
							font-size: 15px;
							font-weight: 550;
							padding-left: 10px;
						}

					}

					.tips {

						display: flex;
						// background: #F2FAFF;
						border-radius: 0px 8px;
						width: 108px;
						height: 33px;
						font-size: 13px;
						color: #1F64FF;
						line-height: 26px;
						text-align: center;
						justify-content: center;
						align-items: center;

						.content {
							margin-left: 5px;
						}
					}
				}

				.back_img {
					width: 110upx;
					height: 110upx;
					position: absolute;
					top: 0upx;
					right: 0upx;
				}
			}

			.loading {
				display: flex;
				justify-content: center;
				margin-top: 100upx;
			}

			.load_text {
				font-style: normal;
				font-weight: 400;
				font-size: 30upx;
				line-height: 150%;
				color: #AAB2C8;
			}

			.load_img {
				width: 40upx;
				height: 40upx;
				opacity: 0.5;
			}
		}
	}

	.modal {

		// padding: 30px;
		.edit {
			font-weight: 500;
			font-size: 18px;
			line-height: 26px;

			color: #303133;
			position: relative;

			.changes {

				position: absolute;
				height: 5px;
				width: 70px;
				bottom: 3px;
				background: linear-gradient(to right, rgba(31, 100, 255, 1), rgba(31, 100, 255, 0.5), rgba(255, 255, 255, 0.5));
				border-radius: 5px;
			}

		}

		.content {
			width: 272px;
			min-height: 153px;
			// height: 153px;
			background: #F5F6FA;
			border-radius: 8px;
			padding: 20px;
			font-size: 15px;
			color: #606266;
			// font-size: 13px;
			margin-top: 18px;

			/deep/.u-textarea {
				padding: 0;
				background-color: #F5F6FA;
			}

			textarea {
				margin-top: 18px;
				background: #F5F6FA;
				width: 232px;
				// padding: 20px;
				margin: 0 auto;
				font-size: 15px;
				color: #606266;
			}
		}
	}

	.on_order_list {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28upx;
		height: 100upx;
		line-height: 100upx;
		color: #C0C4CC;
		margin-bottom: 80upx;
	}

	.qs_tip {
		font-weight: 500;
		font-size: 26upx;
		color: #EB504B;
		padding: 20upx 0;
	}

	.right_text {
		font-weight: 400;
		font-size: 26upx;
		color: #1F64FF;
		border: 1upx solid #1F64FF;
		width: 120upx;
		padding: 10upx;
		text-align: right;
		margin-right: 15upx;
		border-radius: 8upx;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 40rpx;
	}

	.tab_moudel {
		background: #fff;
		height: 80upx;
		width: 100%;
		display: flex;
		align-items: center;
		position: relative;

		.line_moudel {
			display: flex;
			align-items: center;
			justify-content: space-between;
			overflow-x: scroll;
			white-space: nowrap;
			width: 85%;
			padding: 0 20upx;
			margin-right: 40upx;

			.l_select {
				background: #F5F6F7;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 400;
				font-size: 26upx;
				line-height: 30upx;
				color: #333;
				padding: 15upx 24upx;
				border-radius: 8upx;
				margin-right: 15upx;
			}

			.active_l_select {
				background: #1F64FF;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 400;
				font-size: 26upx;
				line-height: 30upx;
				color: #fff;
				padding: 15upx 24upx;
				border-radius: 8upx;
				margin-right: 15upx;
			}
		}

		.line_search {
			display: flex;
			align-items: center;
			padding: 15upx 10upx;
			background: #fff;
			position: absolute;
			top: 0;
			right: 0;
			z-index: 10;
			opacity: 0.9;

			.search_text {
				color: #666;
				font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: 30upx;
				padding-left: 15upx;
			}
		}
	}

	.wz_tip {
		position: fixed;
		bottom: 150upx;
		right: 50upx;
		z-index: 10;

		.creat_img {
			width: 100upx;
			height: 100upx;
		}
	}

	.manage_info {
		padding: 25upx 20upx 0 20upx;

		// margin-top: -70upx;
		.info_me {
			width: calc(100%);
			// height: 300upx;
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

					.right_texts {
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
						opacity: 0;
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

		.info_title {
			display: flex;
			align-items: center;
			padding-top: 10upx;

			.title_l {
				.l_img {
					width: 60upx;
					height: 60upx;
					border-radius: 50%;
				}
			}

			.title_r {
				color: #1F64FF;
				font-size: 30upx;
				font-style: normal;
				font-weight: 500;
				line-height: 150%;
				padding-left: 20upx;
			}
		}

		.info_text {
			display: flex;
			align-items: center;
			padding-top: 10upx;

			.text_l {
				color: #242F49;
				font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
			}
		}
	}

	.notice {
		padding: 0upx 0upx 20upx 0upx;
		border-radius: 10upx;
	}

	.mentor {
		padding: 20upx;
		background: #fff;
		border-radius: 10upx;

		.mentor_title {
			color: #242F49;
			font-size: 30upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			padding-bottom: 20upx;
		}

		.mentor_cont {
			display: flex;
			border-radius: 10upx;
			background: #F7F7F9;
			padding: 20upx;
			margin-bottom: 15upx;

			.cont_l {
				.l_img {
					width: 100upx;
					height: 100upx;
					border-radius: 10upx;
				}
			}

			.cont_r {
				display: flex;
				flex-direction: column;
				padding-left: 20upx;

				.r_top {
					color: #000;
					font-size: 28upx;
					font-style: normal;
					font-weight: 530;
					line-height: 35upx;
				}

				.r_btn {
					color: #24252B;
					font-size: 24upx;
					font-style: normal;
					font-weight: 400;
					line-height: 32upx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2; // 控制多行的行数
					-webkit-box-orient: vertical;
				}
			}
		}
	}
</style>