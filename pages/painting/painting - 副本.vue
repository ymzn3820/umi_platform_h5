<template>
	<view>
		<view class="head_index">
			<view class="head_cont">
				<view class="history" @click="goShare">
					<image :src="paintingShare" class="hisImg"></image>
					<view class="history_text" style="color: #1F64FF;">分享好友赚算力</view>
				</view>
				<view class="tab" style="margin-left: -9%;">
					<view class="tab_item" v-for="(item, index) in tabList" :key="index"
						:class="{ tab_active: tab_active == index }" @click="tabSubmit(item,index)">
						{{ item.label }}
					</view>
				</view>
				<view class="history" @click="toHistory">
					<image :src="hisImg" class="hisImg"></image>
					<view class="history_text">历史记录</view>
				</view>
			</view>
		</view>
		<view class="tabs">
			<view class="tabs_t"
				style="position: fixed;top: 108rpx;left: 0%;background: #fff;width: 100%;justify-content: center;z-index:999;">
				<view :class="sd_type == 1 ? 'tabs_l_active' : 'tabs_l'" @click="selectType(1)">文生图</view>
				<view :class="sd_type == 1 ? 'tabs_r' : 'tabs_r_active'" @click="selectType(2)">图生图</view>
			</view>
		</view>

		<view style="margin-top: 146rpx;background: #fff;">
			<view :style="[{marginTop: topHeight +'px'}]">

				<!-- 图片示例  文生图-->
				<view class="ex_ul" v-if="askShow && sd_type == 1">
					<view class="ex_img">
						<image :src="billListOne.pic_url" mode="aspectFit" class="li_img"></image>
						<!-- <view class="ex_update" @click="getDrawRecommend"><u-icon name="reload" color="#fff"
								size="18"></u-icon></view> -->
					</view>
				</view>

				<!-- 图片示例  参考图-->
				<view class="ex_ul" v-if="sd_type == 2 && sd_photo_type == 1 && chat_type == 9">
					<view class="ex_time" v-if="origin_image == ''">
						<image src="@/static/user/upload.png" mode="aspectFit" class="upload_img" @click="takePhoto">
						</image>
						<view class="upload_text">上传参考图</view>
					</view>

					<view class="ex_img" v-else>
						<image :src="getImgUrl(origin_image)" alt="" @click="takePhoto" mode="aspectFit" class="li_img">
						</image>
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
				<!-- sd绘图 图生图-->
				<view class="ex_ul" v-for="(item,index) in picToPicList" :key="index"
					v-if="!sd_msgLoad && !askShow && sd_photo_type == 2&&sd_type==2">
					<view class="ex_img">
						<image :src="getImgUrl(item.result_image)" alt="" @click.stop="checkImg(index)" mode="aspectFit"
							class="li_img">
						</image>

					</view>
				</view>

				<!-- sd绘图生成中 -->
				<view class="ex_ul" v-if="sd_msgLoad && !askShow && isuser && sd_photo_type == 2">
					<view class="ex_time">
						<u-loading-icon textSize="20"></u-loading-icon>
						<view class="wait_text">生成中,耗时{{ sd_timer+num_three }}秒</view>
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
					<u-icon name="warning" color="#fff" size="18"></u-icon>
					<text class="btn_text">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
				</view>
				<view class="tabs" v-if="askShow && sd_type == 1">
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
				<view class="tabs" v-if="!askShow && sd_type == 1">
					<view class="copy" @click="toAsk(sameMsg)">
						<view
							style="width: 64rpx;height: 64rpx;background-color: #F3F7FF;border-radius: 5rpx;display: flex;align-items: center;justify-content: center;">
							<image :src="copyImg" class="copyImg"></image>
						</view>
						<view class="copy_txt">做同款</view>
					</view>
				</view>
				<view class="tabs">
					<view class="tab_photo" v-if="sd_type == 2">
						<view :class="sd_photo_type == 1 ? 'tabs_photo_active' : 'tabs_photo'" @click="photoType(1)"
							style="margin-right: 20upx;">参考图</view>
						<view :class="sd_photo_type == 2 ? 'tabs_photo_active' : 'tabs_photo'" @click="photoType(2)">生成图
						</view>
					</view>
					<!-- 文生图 -->
					<view class="tabs_t" v-for="(item,index) in StableDiffusionList" :key="index"
						v-if="StableDiffusionList.length > 0 && sd_type == 2 && !askShow && sd_photo_type == 2">
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
						<view class="ex_like" @click="savePhoto(item.image_urls[0].url)"><u-icon name="download"
								color="#1F64FF" size="24"></u-icon></view>
					</view>
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
						<view class="ex_like" @click="savePhoto(item.image_urls[0].url)"><u-icon name="download"
								color="#1F64FF" size="24"></u-icon></view>
					</view>
				</view>

				<view style="padding: 0 32rpx;">
					<view style="width: 100%;height: 2rpx;background: #EFEFEF;margin-bottom: 32rpx;"></view>
				</view>

				<view class="optimize">
					<view class="opt_head">
						<view class="opt_l">
							<text>无忧灵感改写</text>
							<!-- <u-icon name="question-circle" color="#666" size="16"></u-icon> -->
						</view>
						<view class="opt_r">
							<text v-if="optShow">已启用</text>
							<text v-else>已关闭</text>
							<u-switch v-model="optShow" size="18"></u-switch>
						</view>
					</view>
					<view class="opt_b" v-if="optShow">
						你只需输入最关键主体，无需输入任何画风、修辞和艺术家等描述，
						我们将用无忧秘书AI自动优化您的绘画描述，实现更佳效果。
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
						<view @click="settingClick(1)" style="color: #1F64FF;font-size: 24rpx;">全部模型</view>
					</view>
					<view class="query_li" style="margin-bottom: 32rpx;">
						<view class="li_type" v-for="(val, index) in modelList.slice(0,8)" :key="index"
							@click="selctQuery(index)"
							:style="[{border:(queryIndex == index ? '2px solid #1F64FF':'none')}]">
							<image :src="getImgUrl( val.pic_url)" mode="" class="type_img"></image>
							<view class="type_tip">{{ val.name }}</view>
						</view>
					</view>
				</view>


				<view class="query_li" v-if="tab_active == 1">

					<view class="li_textarea">
						<view class="text_title">反向提示词</view>
						<u--textarea v-model="sd_complete" @blur="getHideText()"
							placeholder="反向提示词可以屏蔽你不想生成的内容，可以输入(低画质、缺失的手指等)" maxlength='200' count></u--textarea>
					</view>
				</view>
			</view>
			<view :style="[{height:placeHight}]"></view>

			<!-- 底部导航栏 -->
			<view class="flex-column-center" :class="{isPosition:isPosition}" :style="{bottom: keyHeight +'px'}">
				<view class="btn_link">

					<view class="link_l" style="width: 100%;justify-content: space-between;"
						v-if="!sd_msgLoad && chat_type == 9">
						<view style="display: flex;align-items: center;text-align: center;">
							<view class="l_chat" style="margin-right: 15rpx;" @click="addDraw3">
								<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
								<text class="l_text">新绘画</text>
							</view>
							<view v-if="tab_active==1" class="l_chat"
								style="margin-right: 15rpx;background-color: #1F64FF;width: 260rpx;justify-content: center;"
								@click="settingClick(2)">
								<image :src="l_chatImg1" style="width: 20rpx;height: 20rpx;"></image>
								<text class="l_text" style="color: #fff">高级配置</text>
							</view>
						</view>
						<view style="display: flex;">
							<text class="l_wait" v-if="chat_type == 9">排队中：{{ sd_wait }}人</text>
							<view style="color: #F00;font-size: 26upx;margin-left: 20rpx;">免费</view>
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
		<!-- 采样器选择 -->
		<u-picker :show="samplerShow" :columns="samplerList" v-model="setObj.samplerValue" keyName="label"
			@cancel="samplerShow = false" @confirm="samplerSubmit"></u-picker>

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
		<!-- 高级弹出层 -->
		<u-popup :show="configShow" mode="bottom" :round="10" @close="configShow = false">
			<view class="setting">
				<scroll-view scroll-y="true" style="height: 60%;">
					<view @click="configShow = false"
						style="width: 120rpx;height: 10rpx;border-radius: 16rpx;background: #D9D9D9;margin: 14rpx 0 0 43%;">
					</view>
					<view class="query" style='height: 79vh;'>
						<view style="color: #333;font-size: 28rpx;font-weight: 500;">高级设置</view>
						<view class="li_select">
							<view class="select_cont">
								<view class="select_left">
									<text class="select_text">采集器</text>
									<u-icon name="question-circle" color="#A1A1A1" size="16"
										@click="checkSelect(1)"></u-icon>
								</view>
								<view class="select_right" style="width: 101%;margin-left: 3%;">
									<view class="sd_li" style="padding-right: 8upx;" @click="samplerChange">
										<text class="sd_width">{{ setObj.samplerValue }}</text>
										<u-icon name="arrow-down" color="#DBDBDB" size="14"></u-icon>
									</view>

								</view>
								<text class="select_bot" v-if="select1">{{content1,66666666666}}</text>
							</view>
						</view>

						<view class="li_select">
							<view class="select_cont">
								<view class="select_left">
									<text class="select_text">迭代次数</text>
									<u-icon name="question-circle" color="#A1A1A1" size="16"
										@click="checkSelect(2)"></u-icon>
								</view>
								<view class="select_right">
									<u-number-box v-model="setObj.steps" button-size="36" color="#ffffff"
										bgColor="#2979ff" :min="10" :max="50" iconStyle="color: #fff">

										<input v-model="setObj.steps" slot="input"
											style="width: 500rpx;text-align: center;" class="select_int"
											placeholder="选填数字，范围：10~50"
											placeholder-style="color: #CFCFCF;font-size:24rpx">{{setObj.steps}}</input>
										<view slot="minus" class="minus"><u-icon name="minus" size="20"></u-icon></view>
										<view slot="plus" class="plus"><u-icon name="plus" size="20"></u-icon></view>
									</u-number-box>
								</view>
								<text class="select_bot" v-if="select2">{{content2}}</text>
							</view>
						</view>

						<view class="li_select">
							<view class="select_cont">
								<view class="select_left">
									<text class="select_text">提示语相关</text>
									<u-icon name="question-circle" color="#A1A1A1" size="16"
										@click="checkSelect(3)"></u-icon>
								</view>
								<view class="select_right">
									<u-number-box v-model="setObj.cfg_scale" button-size="36" color="#ffffff"
										bgColor="#2979ff" :min="0" :max="35" iconStyle="color: #fff">
										<view slot="minus" class="minus"><u-icon name="minus" size="20"></u-icon></view>
										<input v-model="setObj.cfg_scale" slot="input"
											style="width: 500rpx;text-align: center;" class="select_int"
											placeholder="选填数字，范围：0~35"
											placeholder-style="color: #CFCFCF;font-size:24rpx">{{setObj.cfg_scale}}</input>
										<view slot="plus" class="plus"><u-icon name="plus" size="20"></u-icon></view>
									</u-number-box>
								</view>
								<text class="select_bot" v-if="select3">{{content3}}</text>
							</view>
						</view>
						<view class="li_select">
							<view class="select_cont">
								<view class="select_left">
									<text class="select_text">随机种子</text>
									<u-icon name="question-circle" color="#A1A1A1" size="16"
										@click="checkSelect(4)"></u-icon>
								</view>
								<view class="select_right" style="position: relative;">
									<u-number-box v-model="setObj.seed" button-size="36" color="#ffffff"
										bgColor="#2979ff" :min="0" :max="4294967295" iconStyle="color: #fff">
										<view slot="minus" class="minus"><u-icon name="minus" size="20"></u-icon></view>
										<input v-model="setObj.seed" slot="input"
											style="width: 500rpx;text-align: center;" class="select_int"
											placeholder="选填数字，范围0~4294967295"
											placeholder-style="color: #CFCFCF;font-size:24rpx">{{setObj.seed}}</input>
										<view slot="plus" class="plus"><u-icon name="plus" size="20"></u-icon></view>
									</u-number-box>
									<image :src="randomImg" class="randomImg" @click="selectNum"></image>
								</view>
								<text class="select_bot" style="padding-bottom: 150rpx;"
									v-if="select4">{{content4}}</text>
							</view>
						</view>
						<view
							style="width: 100%;display: flex;justify-content: center;position: fixed;bottom: 0;left: 0%;z-index: 99;background: #fff;"
							@click="setSave">
							<view class="select_btn">保存并返回</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import {
		creatDraw,
		baiduDraw,
		getbBaiduDraw,
		mjDraw,
		getMjDraw,
		getQuery,
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
	export default {
		components: {
			Title
		},
		data() {
			return {
				optShow: false,
				configShow: false,

				paintingShare: global.baseImg + '/xcx/com/message_center/chatShare.png',
				placeHight: 0,

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
				modelIndex: '',
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
				samplerList: [
					[{
							label: 'Euler a',
							id: 1
						},
						{
							label: 'Euler',
							id: 2
						},
						{
							label: 'LMS',
							id: 3
						},
						{
							label: 'LMS Karras',
							id: 4
						},
						{
							label: 'DDIM',
							id: 5
						},
						{
							label: 'Heun',
							id: 6
						},
						{
							label: 'DPM fast',
							id: 7
						},
						{
							label: 'DPM adaptive',
							id: 8
						},
						{
							label: 'DPM2',
							id: 9
						},
						{
							label: 'DPM2 aDPM2 Karras',
							id: 10
						},
						{
							label: 'DPM2 a Karras',
							id: 11
						},
						{
							label: 'DPM++ 2S a',
							id: 12
						},
						{
							label: 'DPM++ 2M',
							id: 13
						},
						{
							label: 'DPM++ SDE',
							id: 14
						},
						{
							label: 'DPM++ 2S a Karras',
							id: 15
						},
						{
							label: 'DPM++ 2M Karras',
							id: 16
						},
						{
							label: 'DPM++ SDE Karras',
							id: 17
						},
						{
							label: 'DPM++ 2M SDE Karras',
							id: 18
						}
					]

				],

				samplerValue: 'Euler a',

				active: 0,
				chat_type: 9,
				chatType: 'Stable Diffusion',
				isuser: true,
				avatar: '',
				userInfo: "",
				dallshow: false,
				selectDone: 0,
				size: '512*512',
				sizeIndex: 0,
				query_type: 1,

				noticeList: [],

				sdList: [{
					id: '512*512',
					size: '512*512',
					type: 'zheng'
				}, {
					id: '512*768',
					size: '512*768',
					type: 'gao'
				}, {
					id: '768*512',
					size: '768*512',
					type: 'chang'
				}],

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

				tabList: [{
					label: '极简'
				}, {
					label: '专家'
				}],
				tab_active: 0,
				hisImg: global.baseImg + '/xcx/com/message_center/clock.png',
				l_chatImg1: global.baseImg + '/xcx/com/message_center/绘画配置.png',
				l_chatImg2: global.baseImg + '/xcx/com/message_center/绘画灵感.png',
				setShow: false,
				tipShow: false,

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
				
				//glm
				controller_three: null, // 用于终止会话
				t_time_three: null, // 计时器
				three_shi: null,
				
				userRole: "",
				supplement: {
					// msg_list: []
				},
				messageList: [],
				imgList: [],
				askFields: '',

				num_three: 0,

				origin_image: "", //图生图
				setObj: {
					samplerValue: 'Euler a',
					steps: '', //迭代次数
					seed: '', //随机种子
					cfg_scale: '', //提示语相关
				},
				three_num: 0,

				txt1: "# Stable Diffusion prompt 助理你来充当一位有艺术气息的Stable Diffusion prompt 助理。## 任务我用自然语言告诉你要生成的prompt的主题，你的任务是根据这个主题想象一幅完整的画面，然后转化成一份详细的、高质量的prompt，让Stable Diffusion可以生成高质量的图像。## 背景介绍Stable Diffusion是一款利用深度学习的文生图模型，支持通过使用 prompt 来产生新的图像，描述要包含或省略的元素。## prompt 概念- 完整的prompt包含“**Prompt:**”这单一部分。- prompt 用来描述图像，由普通常见的单词构成，使用英文半角\",\"做为分隔符。- 以\",\"分隔的每个单词或词组称为 tag。所以prompt是由系列由\",\"分隔的tag组成的。## () 和 [] 语法调整关键字强度的等效方法是使用 () 和 []。 (keyword) 将tag的强度增加 1.1 倍，与 (keyword:1.1) 相同，最多可加三层。",
				txt2: "[keyword]将强度降低 0.9 倍，与 (keyword:0.9) 相同。## Prompt 格式要求### 1. prompt 要求- 你输出的 Stable Diffusion prompt 以“**Prompt:**”开头。- prompt 内容包含画面主体、材质、附加细节、图像质量、艺术风格、色彩色调、灯光等部分，但你输出的 prompt 不能分段，例如类似\"medium:\"这样的分段描述是不需要的，也不能包含\":\"和\".\"。- 画面主体：不简短的英文描述画面主体, 如 A girl in a garden，主体细节概括（主体可以是人、事、物、景）画面核心内容。这部分根据我每次给你的主题来生成。你可以添加更多主题相关的合理的细节。",
				txt3: "  - 对于人物主题，你必须描述人物的眼睛、鼻子、嘴唇，例如'beautiful detailed eyes,beautiful detailed lips,extremely detailed eyes and face,longeyelashes'，以免Stable Diffusion随机生成变形的面部五官，这点非常重要。你还可以描述人物的外表、情绪、衣服、姿势、视角、动作、背景等。人物属性中，1girl表示一个女孩，2girls表示两个女孩。- 材质：用来制作艺术品的材料。 例如：插图、油画、3D 渲染和摄影。 Medium 有很强的效果，因为一个关键字就可以极大地改变风格。- 附加细节：画面场景细节，或人物细节，描述画面细节内容，让图像看起来更充实和合理。这部分是可选的，要注意画面的整体和谐，不能与主题冲突。",
				txt4: "- 图像质量：这部分内容开头永远要加上“(best quality,4k,8k,highres,masterpiece:1.2),ultra-detailed,(realistic,photorealistic,photo-realistic:1.37)”， 这是高质量的标志。其它常用的提高质量的tag还有，你可以根据主题的需求添加：HDR,UHD,studio lighting,ultra-fine painting,sharp focus,physically-based rendering,extreme detail description,professional,vivid colors,bokeh。- 艺术风格：这部分描述图像的风格。加入恰当的艺术风格，能提升生成的图像效果。常用的艺术风格例如：portraits,landscape,horror,anime,sci-fi,photography,concept artists等。 -色彩色调： 颜色， 通过添加颜色来控制画面的整体颜色。 -灯光： 整体画面的光线效果。",
				txt5: "# # # 2. 限制： -tag 内容用英语单词或短语来描述， 并不局限于我给你的单词。 注意只能包含关键词或词组。 -注意不要输出句子， 不要有任何解释。 -tag数量限制40个以内， 单词数量限制在60个以内。-tag不要带引号(\"\")。 -使用英文半角 \",\"做分隔符。 -tag 按重要性从高到低的顺序排列。 -我给你的主题可能是用中文描述， 你给出的prompt只用英文。 -直接输出prompt内容， 不要带任何前缀和标题（ 包括 \"prompt:\"）我的第一个主题是： ",

			}
		},

		onShow() {
			// this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			this.isuser = true; // 清空所有登录或升级会员提示
			this.msg = '';
			this.isPosition = false,
				this.keyHeight = 50

			if (this.tab_active == 0) {
				this.samplerValue = 'DPM++ 2M Karras'
			}

			if (uni.getStorageSync('history_code') != '') {
				this.historySession(uni.getStorageSync('history_code'))
				this.askShow = false;
			} else {

				this.getDrawRecommend() // 获取问题集
			}


			// 获取相机信息
			if (uni.getStorageSync('cameraInfo') != '') {
				this.chat_type = 9
				// this.active = 1
				let sendInfo = uni.getStorageSync('cameraInfo')
				// this.msg = sendInfo.chatValue
				this.origin_image = sendInfo.imgList
				// console.log(sendInfo,415866666)
				this.sd_type = 2
				this.sd_photo_type = 1
				uni.setStorageSync('cameraInfo', '')

			}

			this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			let avatarUrl = global.baseImg + '/' + uni.getStorageSync("avatarUrl");
			this.avatar = avatarUrl;

		},
		onReady() {
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
			this.toBottom()
		},
		onLoad(option) {
			this.prSho = false
			this.scrollHeight = uni.getSystemInfoSync().windowHeight - uni.upx2px(80) - 56 - 44 - 44
			this.getSdModel()
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
						that.billList = res.data[Math.floor(Math.random() * 23)];
						that.billListOne = that.billList;
						console.log(that.billListOne, 'that.billListOne');
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

				this.toBottom()
			},

			historySession(session) {

				let data = JSON.parse(session)

				if (data.type == 9) {
					this.chat_type = 9
					this.StableDiffusionList = [];
					this.picToPicList = []
				}

				this.askShow = false;
				this.$forceUpdate()

				if (data.type < 13 && data.type != 3) {
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
					// uni.showTabBar({
					// 	// animation: true
					// })
					// 定位到聊天最底部
					this.toBottom();
					this.isBtn = false
				} else {
					this.isBtn = true
				}
			},
			// 选择版本
			version(val) {
				this.isuser = true;
				if (val.name == '百度绘画') {
					this.active = 1
					this.chat_type = 3
					this.chatType = '百度'
					this.size = '1024*1024';
					this.sizeIndex = 0;
					this.sd_type = 1;
					this.query_type = 1;
					this.modelList = this.bdTypeList;
					this.modelValue = this.bdTypeList[0].name;
					this.modelIndex = this.bdTypeList[0].value;
					if (this.baiduList.length == 0) {
						this.askShow = true
					} else {
						this.askShow = false
					}
					if (this.bd_timer > 0) {
						if (this.baiduList[this.baiduList.length - 1].time == undefined) {
							this.bd_msgLoad = true
						} else {
							this.bd_msgLoad = false
						}

					} else {
						this.bd_msgLoad = false
					}


				} else if (val.name == '通义万相') {
					this.active = 0
					this.chat_type = 13
					this.chatType = '通义万相'
					this.size = '1024*1024';
					this.sizeIndex = 0;
					this.query_type = 1;
					this.modelList = this.wxTypeList;
					this.modelValue = this.wxTypeList[0].name;
					this.modelIndex = this.wxTypeList[0].value;
					if (this.wxList.length == 0) {
						this.askShow = true
					} else {
						this.askShow = false
					}
					// console.log(this.mj_timer,9995)
					if (this.wx_timer > 0) {
						if (this.wxList[this.wxList.length - 1].time == undefined) {
							this.wx_msgLoad = true
						} else {
							this.wx_msgLoad = false
						}

					} else {
						this.wx_msgLoad = false
					}

				} else if (val.name == '火山引擎') {
					this.active = 2
					this.chat_type = 14
					this.chatType = '火山引擎'
					this.size = '';
					this.sizeIndex = 0;
					this.query_type = 1;
					this.modelList = this.hsTypeList;
					this.modelValue = this.hsTypeList[0].name;
					this.modelIndex = this.hsTypeList[0].value;
					if (this.hsList.length == 0) {
						this.askShow = true
					} else {
						this.askShow = false
					}
					// console.log(this.mj_timer,9995)
					if (this.hs_timer > 0) {
						if (this.hsList[this.hsList.length - 1].time == undefined) {
							this.hs_msgLoad = true
						} else {
							this.hs_msgLoad = false
						}

					} else {
						this.hs_msgLoad = false
					}

				}

			},

			savePhoto(url) {
				uni.showLoading({
					mask: true,
					title: '下载中...'
				})
				uni.downloadFile({
					url: url, //仅为示例，并非真实的资源
					success: (res) => {
						// console.log(res)
						if (res.statusCode === 200) {
							// console.log('下载成功');
							var oA = document.createElement("a");
							oA.download = ''; // 设置下载的文件名，默认是'下载'
							oA.href = res.tempFilePath; //临时路径再保存到本地
							document.body.appendChild(oA);
							oA.click();
							oA.remove(); // 下载之后把创建的元素删除
							uni.hideLoading()
						} else {
							uni.hideLoading()
						}
					},
					fail: (req) => {
						console.log(req);
						uni.hideLoading()
					}
				});
			},

			focusTexts(event) {
				if (this.isBtn) {
					// uni.hideTabBar({
					// 	// animation: true
					// })
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
					this.toBottom()
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
				// 	// animation: true
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
				this.setShow = false
				let this_ = this
				this.isPosition = false;
				this.draw_tip = false;
				if (this.chat_type == 9) {
					this.getSdQuery()
				}
				// 消息为空不做任何操作
				if (this.msg.trim() == "") {
					this.$api.msg('请输入您要发送的内容')
					return;
				}

				this.askShow = false; // 关闭应用助理提示热词
				this.isuser = true;
				if (this.chat_type == 9) {
					this.getEnText()
				} else {
					this.submit()
				}


			},


			async submit() {
				// this.prShow = false
				uni.setStorageSync('drawInfo', '')
				if (this.chat_type == 9) {
					if (!this.isSd) {
						return
					}
					const txt = this.txt1 + this.txt2 + this.txt3 + this.txt4 + this.txt5 + this.msg
					this.supplement = {
						msg_list: []
					};
					this.supplement.msg_list.push({
						role: 'user',
						// covert_content: `回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字\n以下是我的问题：`, 
						convert_content: '',
						content: txt
					})
					this.supplement.msg_list = JSON.stringify(this.supplement.msg_list)
					let data = {
						chat_type: 8,
						action_type: '3',
						session_code: this.session_code,
						chat_group_code: "",
						content: txt,
						// stream_str: 1,小程序用的
						// is_decode: 1,小程序用的
						msg_list: this.supplement.msg_list
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

					if (!this.optShow) {
						this.sdDraw()
					} else {
						this.creatChatFun(data, 'first')
					}
				}

			},


			// sd绘画
			sdDraw() {
				if (this.setObj.steps == "") {
					this.setObj.steps = 20
				}
				if (this.setObj.seed == "") {
					this.setObj.seed = -1
				}
				if (this.setObj.cfg_scale == "") {
					this.setObj.cfg_scale = 7
				}
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
					"chat_type": '9',
					"action_type": '3',
					"app_type": '1',
					"prompt": this.msg,
					"prompt_en": this.sdText,
					"negative_prompt": this.sd_complete,
					"negative_prompt_en": this.sdHideText,
					"sd_model_checkpoint": this.modelIndex,
					"sampler_index": this.setObj.samplerValue,
					"size": this.size,
					"cfg_scale": this.setObj.cfg_scale,
					"steps": this.setObj.steps,
					"seed": this.setObj.seed,
					"origin_image": this.origin_image,
				}
				if (this.optShow) {
					data.prompt_en = this.askFields.substring(7)
					// console.log(this.askFields.substring(7), 'msg');
				}
				if (this.imgList.length > 0) {
					if (this.sd_type == 2) {
						data.action_type = '5',
							data.images = this.imgList
					} else {
						data.action_type = '3'
						data.images = []
						this.imgList = [];
					}

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
				sdDraw(data).then(res => {

					if (res.code == 20000) {
						let datas = {
							"tag": res.data.tag,
						};
						let request_count = 0;
						that.sd_draw_time = setInterval(() => {
							if (request_count < 101) { // 最多轮询100次
								getSdDraw(datas).then(val => {
									// console.log(resposne);
									if (val.code == 20000) {
										request_count += 1;

										if (val.data != null) {
											that.isSd = true;
											if (val.data[0].is_mod == 1) {
												that.$api.msg('您的输入涉及不良内容，请勿发布违规信息，请注意文明用语。')
											}

											if (val.data[0].status == 0) {

												let img_urls = [];
												let url_val = {
													url: global.baseImg + '/' + val.data[0]
														.content
												}
												img_urls.push(url_val);
												// console.log(img_urls,886)
												// console.log(val.data[0].content, 885)
												let obj = {
													"create_time": val.data[0].create_time,
													"finish_reason": "stop",
													"session_code": val.data[0].session_code,
													"chat_group_code": val.data[0]
														.chat_group_code,
													"size": val.data[0].size,
													"role": "assistant",
													"image_urls": img_urls,
													"time": that.sd_timer,
													"is_mod": val.data[0].is_mod,
													"is_like": 0,
													"dia_text": that.dia_text,
													"result_image": val.data[0].result_image
												}

												let img_arr = [];
												img_arr.push(obj);

												if (this.sd_type == 1) {
													that.StableDiffusionList.push(obj);
													console.log(that.StableDiffusionList, 'sd数组');
												} else {
													that.picToPicList.push(obj);
													console.log(that.picToPicList, 'sdtu数组');
												}
												this.prShow = true
												// if (that.StableDiffusionList.length == 0) {
												// 	that.StableDiffusionList = img_arr;
												// }


												// 定位到聊天最底部
												// that.toBottom();
												that.isuser = true;
												that.sd_msgLoad = false;
												clearInterval(that.sd_t_time);
												clearInterval(that.sd_draw_time);

												uni.setStorageSync('session_code9', val.data[0]
													.session_code);
												uni.setStorageSync('chat_group_code9', val.data[0]
													.chat_group_code);
												let save_val = {
													"type_name": "Stable Diffusion",
													"type_code": "image",
													"title": data.content_zh,
													"eid": val.data[0].session_code,
													"image_url": val.data[0].content
												}

												that.saveFootprint(save_val)
												uni.hideLoading()
											} else if (val.data[0].status == 1) {
												that.sd_msgLoad = false;
												clearInterval(that.sd_t_time);
												clearInterval(that.sd_draw_time);
												that.$api.msg('生成失败，本次不消耗绘画次数')
												that.askShow = true
												that.isSd = true;
											}
										}

									} else {
										that.sd_msgLoad = false;
										// that.isTime = false;
										clearInterval(that.sd_t_time);
										clearInterval(that.sd_draw_time);
										that.$api.msg(res.msg)
										that.askShow = true
										that.isSd = true;
									}
								})
							} else {
								that.sd_msgLoad = false;
								// that.isTime = false;
								clearInterval(that.sd_t_time);
								clearInterval(that.sd_draw_time);
								that.$api.msg('等待时间过长，请稍后前往历史记录查看')
								that.askShow = true
								that.isSd = true;
							}

						}, 2000)

					} else if (res.code < 49999) {
						that.isuser = false;
						that.sd_msgLoad = false;
						that.isSd = true;
						// that.isTime = false;
						clearInterval(that.sd_t_time);
						clearInterval(that.sd_draw_time);
						// that.$api.msg(res.msg)
						that.sd_desc = res.msg;
						if (res.code == 40022) {
							that.draw_tip = true;
						} else {
							that.draw_tip = false;
						}

					} else {
						that.sd_msgLoad = false;
						// that.isTime = false;
						clearInterval(that.sd_t_time);
						clearInterval(that.sd_draw_time);
						that.$api.msg(res.msg)
						that.askShow = true
						that.isSd = true;
					}
				}).catch(err => {
					that.sd_msgLoad = false;
					// that.isTime = false;
					clearInterval(that.sd_t_time);
					clearInterval(that.sd_draw_time);
					that.$api.msg('绘图失败')
					that.askShow = true
					that.isSd = true;
				})

				this.toBottom()
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

			},

			// 前往提问
			toAsk(e) {
				this.pic_url = global.baseImg + this.pic_tem
				this.billListOne = this.billList;
				this.msg = e
				// console.log(this.billList,6666666666666);
			},

			//采样选择器
			samplerSubmit(e) {
				this.setObj.samplerValue = e.value[0].label;
				this.samplerShow = false;
				this.configShow = true
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
			async takePhoto() {
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
									that.origin_image = imgData.data.new_url

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
					this.samplerValue = 'DPM++ 2M Karras'
				}
				// this.tab_page = index + 1
			},
			settingClick(num) {
				if (num == 1) {
					this.setShow = true
					this.configShow = false
				} else if (num == 2) {
					this.setShow = false
					this.configShow = true
				}
			},
			maskClick() {
				this.setShow = false
				this.configShow = false
			},
			// 获取sd模型
			getSdModel() {
				getSdModel().then(res => {
					console.log('获得了');
					if (res.code == 20000) {
						this.modelList = []
						this.modelList = res.data;
						// console.log(this.modelList,4587)
						this.modelValue = res.data[0].name;
						this.modelIndex = res.data[0].value
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取模型失败！')
				})
			},
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
			
			//信息回调方法
			async creatChatFun(data, state) {
				this.num_three = 0

				this.three_shi = setInterval(() => {
					this.num_three++
				}, 1000)
				this.t_time_three = setInterval(() => {
					this.messageList[this.messageList.length - 1] = {
						talk: `思考中,耗时${this.num_three}秒`,
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

				data.model = 'chatglm_turbo';
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
							// this.toBottom()
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
										console.log(this.messageList, 1258)
										this.$forceUpdate()
										// this.toBottom()
										clearInterval(this.t_time_three);
										clearInterval(this.three_shi);
										return
									} else {
										this.$api.msg('网络异常，请稍后重试')
									}
								} else {
									if (res.content != '' && res.content != null) {
										info += res.content;
										this.askFields = info
										// console.log(info,'info');
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
											this.sdDraw()
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
										time: this.num_three,
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
										// this.saveFootprint(save_val)
										this.send_val = ''
									}

								}

							}

						})

					}

					this.$forceUpdate();
					// this.toBottom();
				}


			},
			setSave() {
				this.configShow = false
				// uni.setStorageSync('setObj', this.setObj)
			},

			stopStart() {
				// 图片生成
				clearInterval(this.sd_t_time)
				clearInterval(this.sd_draw_time)
				this.askShow = true
				this.sd_msgLoad = false
				this.isSd = true
				// 文案优化
				if (this.controller_three != null) {
					this.controller_three.abort()
				}
				this.messageList[this.messageList.length - 1].loading = true
				clearInterval(this.t_time_three)
				clearInterval(this.three_shi)
				this.$forceUpdate()
			}

		}
	}
</script>

<style scoped lang="less">
	.head_index {
		width: 100%;
		position: fixed;
		top: 0;
		background: #fff;
		z-index: 999;
		padding: 10px 0;
	}

	.head_cont {
		display: flex;
		justify-content: space-around;
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
		width: 100%;
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
		width: 100%;
		box-shadow: 0px 2px 10px 0px rgba(51, 51, 51, 0.1);
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
		margin-bottom: 232upx;
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
			height: 160upx;
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
			bottom: 20upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			text-align: center;
		}
	}

	.li_size {
		width: 17%;
		height: 120upx;
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

	.li_textarea {
		padding: 20upx 0;
		width: 100%;

		.text_title {
			color: #000;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			padding-bottom: 10upx;
		}
	}

	.btn_link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
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

	.optimize {
		padding: 0 32rpx;
		margin-bottom: 48rpx;

		.opt_head {
			display: flex;
			justify-content: space-between;
			margin-bottom: 16rpx;

			.opt_l {
				display: flex;
				align-items: center;

				text {
					color: #333;
					font-size: 28rpx;
					font-weight: 500;
				}
			}

			.opt_r {
				display: flex;

				text {
					margin-right: 16rpx;
					color: #666;
					font-size: 24rpx;
					font-weight: 400;
				}
			}
		}

		.opt_b {
			color: #666;
			font-size: 24rpx;
			font-weight: 400;
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
		right: 28%;
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