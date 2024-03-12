<template>
	<view>
		<view class="head_index">
			<view class="head_cont">
				<!-- <view class="cont_title">AI绘画</view> -->
				<Title :title='"绘画"' />
				<view class="cont_tabs"
					style="width: 100%; background-color: #fff; display: flex; align-items: center; justify-content: space-between;">
					<u-tabs :list="list" lineWidth='50' lineHeight='2' lineColor='#1f64ff'
						:activeStyle='{color: "#1F64FF","font-size":"26rpx"}' @change='version' :current='active'
						:inactiveStyle='{"font-size":"26rpx"}'></u-tabs>
					<view class="right_text" @click="toHistory">历史对话</view>
				</view>
			</view>
		</view>

		<view :style="[{marginTop: topHeight +'px'},{marginBottom:'100rpx'}]">
			<!-- 图片示例  文生图-->
			<view class="ex_ul" v-if="askShow && sd_type == 1">
				<view class="ex_img">
					<image :src="pic_url" mode="aspectFit" class="li_img"></image>
					<view class="ex_tip">示例图片</view>
					<view class="ex_use" @click="toAsk()">使用案例</view>
					<!-- <view class="ex_update" @click="getDrawRecommend"><u-icon name="reload" color="#fff"
							size="18"></u-icon></view> -->
				</view>
			</view>
			<!-- 万相绘图 -->
			<view class="ex_ul" v-for="(item,index) in wxList" :key="index"
				v-if="!mj_msgLoad && chat_type == 13 && !askShow">
				<view class="ex_img" v-for="(val, tip) in item.image_urls" :key="tip">
					<image :src="val.url" @click.stop="checkImg(index,tip)" mode="aspectFit" class="li_img"></image>
					<view class="ex_like like_up" @click="likeType(1,13)" v-if="item.is_like == 0 || item.is_like == 2">
						<u-icon name="thumb-up" color="#fff" size="28"></u-icon>
					</view>
					<view class="ex_nlike like_up" @click="likeType(0,13)" v-if="item.is_like == 1"><u-icon
							name="thumb-up" color="#fff" size="28"></u-icon></view>
					<view class="ex_like like_down" @click="likeType(2,13)"
						v-if="item.is_like == 0 || item.is_like == 1"><u-icon name="thumb-down" color="#fff"
							size="28"></u-icon></view>
					<view class="ex_nlike like_down" @click="likeType(0,13)" v-if="item.is_like == 2"><u-icon
							name="thumb-down" color="#fff" size="28"></u-icon></view>
					<view class="ex_like ex_upload" @click="savePhoto(item.image_urls[0].url)"><u-icon name="download"
							color="#fff" size="28"></u-icon></view>
					<view class="ex_btn">
						<u-icon name="warning" color="#fff" size="18"></u-icon>
						<text class="btn_text">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
					</view>
				</view>
			</view>

			<!-- 万相绘图生成中 -->
			<view class="ex_ul" v-if="wx_msgLoad && chat_type == 13 && !askShow && isuser">
				<view class="ex_time">
					<u-loading-icon textSize="20"></u-loading-icon>
					<view class="wait_text">生成中,耗时{{ wx_timer }}秒</view>
				</view>
			</view>

			<!-- 万相充会员 -->
			<view class="ex_ul" v-if="!wx_msgLoad && chat_type == 13 && !askShow && !isuser">
				<view class="ex_time">
					<view class="wait_text" v-if="chat_type == 13">{{ wx_desc }}</view>
					<view style="display: flex; justify-content: space-around;" v-if="draw_tip == true">
						<u-button type="warning" color="#FF9B17"
							:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'100%'}"
							@click='goMember'>开通流量包</u-button>
					</view>
				</view>
			</view>

			<!-- 火山引擎绘图 -->
			<view class="ex_ul" v-for="(item,index) in hsList" :key="index"
				v-if="!hs_msgLoad && chat_type == 14 && !askShow">
				<view class="ex_img" v-for="(val, tip) in item.image_urls" :key="tip">
					<image :src="val.url" @click.stop="checkImg(index,tip)" mode="aspectFit" class="li_img"></image>
					<view class="ex_like like_up" @click="likeType(1,14)" v-if="item.is_like == 0 || item.is_like == 2">
						<u-icon name="thumb-up" color="#fff" size="28"></u-icon>
					</view>
					<view class="ex_nlike like_up" @click="likeType(0,14)" v-if="item.is_like == 1"><u-icon
							name="thumb-up" color="#fff" size="28"></u-icon></view>
					<view class="ex_like like_down" @click="likeType(2,14)"
						v-if="item.is_like == 0 || item.is_like == 1"><u-icon name="thumb-down" color="#fff"
							size="28"></u-icon></view>
					<view class="ex_nlike like_down" @click="likeType(0,14)" v-if="item.is_like == 2"><u-icon
							name="thumb-down" color="#fff" size="28"></u-icon></view>
					<view class="ex_like ex_upload" @click="savePhoto(item.image_urls[0].url)"><u-icon name="download"
							color="#fff" size="28"></u-icon></view>
					<view class="ex_btn">
						<u-icon name="warning" color="#fff" size="18"></u-icon>
						<text class="btn_text">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
					</view>
				</view>
			</view>

			<!-- 火山引擎生成中 -->
			<view class="ex_ul" v-if="hs_msgLoad && chat_type == 14 && !askShow && isuser">
				<view class="ex_time">
					<u-loading-icon textSize="20"></u-loading-icon>
					<view class="wait_text">生成中,耗时{{ hs_timer }}秒</view>
				</view>
			</view>

			<!-- 火山引擎充会员 -->
			<view class="ex_ul" v-if="!hs_msgLoad && chat_type == 14 && !askShow && !isuser">
				<view class="ex_time">
					<view class="wait_text" v-if="chat_type == 14">{{ hs_desc }}</view>
					<view style="display: flex; justify-content: space-around;" v-if="draw_tip == true">
						<u-button type="warning" color="#FF9B17"
							:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'100%'}"
							@click='goMember'>开通流量包</u-button>
					</view>
				</view>
			</view>

			<!-- bd绘图 -->
			<view class="ex_ul" v-for="(item,index) in baiduList" :key="index"
				v-if="!bd_msgLoad && chat_type == 3 && !askShow && isuser">
				<view class="ex_img" v-for="(val, tip) in item.image_urls" :key="tip">
					<image :src="val.url" @click.stop="checkImg(index,tip)" mode="aspectFit" class="li_img"></image>
					<view class="ex_like like_up" @click="likeType(1,3)" v-if="item.is_like == 0 || item.is_like == 2">
						<u-icon name="thumb-up" color="#fff" size="28"></u-icon>
					</view>
					<view class="ex_nlike like_up" @click="likeType(0,3)" v-if="item.is_like == 1"><u-icon
							name="thumb-up" color="#fff" size="28"></u-icon></view>
					<view class="ex_like like_down" @click="likeType(2,3)"
						v-if="item.is_like == 0 || item.is_like == 1"><u-icon name="thumb-down" color="#fff"
							size="28"></u-icon></view>
					<view class="ex_nlike like_down" @click="likeType(0,3)" v-if="item.is_like == 2"><u-icon
							name="thumb-down" color="#fff" size="28"></u-icon></view>
					<view class="ex_like ex_upload" @click="savePhoto(item.image_urls[0].url)"><u-icon name="download"
							color="#fff" size="28"></u-icon></view>
					<view class="ex_btn">
						<u-icon name="warning" color="#fff" size="18"></u-icon>
						<text class="btn_text">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
					</view>
				</view>
			</view>

			<!-- bd绘图生成中 -->
			<view class="ex_ul" v-if="bd_msgLoad && chat_type == 3 && !askShow && isuser">
				<view class="ex_time">
					<u-loading-icon textSize="20"></u-loading-icon>
					<view class="wait_text">生成中,耗时{{ bd_timer }}秒</view>
				</view>
			</view>

			<!-- bd充会员 -->
			<view class="ex_ul" v-if="!bd_msgLoad && chat_type == 3 && !askShow && !isuser">
				<view class="ex_time">
					<view class="wait_text" v-if="chat_type == 3">{{ bd_desc }}</view>
					<view style="display: flex; justify-content: space-around;" v-if="draw_tip == true">
						<u-button type="warning" color="#FF9B17"
							:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'100%'}"
							@click='goMember'>开通流量包</u-button>
					</view>
				</view>
			</view>

			<view class="query">
				<view class="query_type">
					<view @click="queryType(1)" :class="[query_type == 1 ? 'active_tabs' : 'tabs']"
						style="display: flex;">
						<text style="margin-right: 10upx;">风格</text>
						<u-icon name="question-circle" color="#A1A1A1" size="20" @click="checkTip"></u-icon>
					</view>
					<view @click="queryType(2)" :class="[query_type == 2 ? 'active_tabs' : 'tabs']"
						v-if="chat_type != 14">参数</view>
					<view @click="queryType(3)" :class="[query_type == 3 ? 'active_tabs' : 'tabs']"
						v-if="chat_type == 9">高级设置</view>
					<view class="tabs" v-if="chat_type != 9"></view>
				</view>

				<view class="query_li" v-if="query_type == 1">
					<view class="li_type" v-for="(val, index) in modelList" :key="index" @click="selctQuery(index)"
						:style="[{border:(queryIndex == index ? '2px solid #1F64FF':'none')}]">
						<image :src="getImgUrl( val.pic_url)" mode="" class="type_img"></image>
						<view class="type_tip">{{ val.name }}</view>
					</view>
				</view>

				<view class="query_li" v-if="query_type == 2 && chat_type == 9">
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
						<view class="size_tip" :style="[{color:(sizeIndex == index ? '#1F64FF':'#999')}]">{{ val.size }}
						</view>
					</view>
				</view>

				<view class="query_li" v-if="query_type == 2 && chat_type == 3">
					<view class="li_size" v-for="(val, index) in bdList" :key="index"
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
						<view class="size_tip" :style="[{color:(sizeIndex == index ? '#1F64FF':'#999')}]">{{ val.size }}
						</view>
					</view>
				</view>

				<view class="query_li" v-if="query_type == 2 && chat_type == 13">
					<view class="li_size" v-for="(val, index) in tyList" :key="index"
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
						<view class="size_tip" :style="[{color:(sizeIndex == index ? '#1F64FF':'#999')}]">{{ val.size }}
						</view>
					</view>
				</view>

				<view class="query_li" v-if="query_type == 3">
					<view class="li_select">
						<view class="select_cont">
							<view class="select_left">
								<text class="select_text">采集器</text>
								<u-icon name="question-circle" color="#A1A1A1" size="20" @click="checkSelect"></u-icon>
							</view>
							<view class="select_right">
								<view class="sd_li" style="padding-right: 8upx;" @click="samplerShow = true">
									<text class="sd_width">{{ samplerValue }}</text>
									<u-icon name="arrow-down" color="#DBDBDB" size="14"></u-icon>
								</view>
							</view>
						</view>
					</view>

					<view class="li_textarea">
						<view class="text_title">反向提示词</view>
						<u--textarea v-model="sd_complete" @blur="getHideText()"
							placeholder="反向提示词可以屏蔽你不想生成的内容，可以输入(低画质、缺失的手指等)" maxlength='200' count></u--textarea>
					</view>
				</view>
			</view>
		</view>


		<!-- 底部导航栏 -->
		<view class="flex-column-center" :class="{isPosition:isPosition}" :style="{bottom: keyHeight +'px'}">
			<view class="btn_link" v-if="!wx_msgLoad && chat_type == 13">
				<view class="link_l">
					<view class="l_chat" style="margin-right: 20rpx;" @click="addDraw2">
						<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
						<text class="l_text">新绘画</text>
					</view>
					<!-- <view style="font-size: 24rpx;">排队中: 1人</view> -->
				</view>
				<view style="color: #1F64FF;font-size: 26upx;">(每张图消耗48w算力)</view>
			</view>
			<view class="btn_link" v-if="!bd_msgLoad && chat_type == 3">
				<view class="link_l">
					<view class="l_chat" style="margin-right: 20rpx;" @click="addDraw1">
						<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
						<text class="l_text">新绘画</text>
					</view>
					<!-- <view style="font-size: 24rpx;">排队中: 1人</view> -->
				</view>
				<view style="color: #1F64FF;font-size: 26upx;">(每张图消耗90w算力)</view>
			</view>
			<view class="btn_link" v-if="!hs_msgLoad && chat_type == 14">
				<view class="link_l">
					<view class="l_chat" style="margin-right: 20rpx;" @click="addDraw3">
						<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
						<text class="l_text">新绘画</text>
					</view>
					<!-- <view style="font-size: 24rpx;">排队中: 1人</view> -->
				</view>
				<view style="color: #1F64FF;font-size: 26upx;">(每张图消耗18w算力)</view>
			</view>
			<!-- <view class="l_chat" style="margin-right: 15rpx;" @click="addDraw1"
						v-if="!bd_msgLoad && chat_type == 3 && baiduList.length > 0">
						<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
						<text class="l_text">新绘画</text>
					</view>

					<view class="l_chat" style="margin-right: 15rpx;" @click="addDraw2"
						v-if="!wx_msgLoad && chat_type == 13 && wxList.length > 0">
						<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
						<text class="l_text">新绘画</text>
					</view>

					<view class="l_chat" style="margin-right: 15rpx;" @click="addDraw3"
						v-if="!hs_msgLoad && chat_type == 14 && hsList.length > 0">
						<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
						<text class="l_text">新绘画</text>
					</view> -->


			<view class="bottom-dh-char" style="font-size: 55rpx;">

				<view class="bottom_cont">
					<u-row align='bottom' gutter="5" v-if="chat_type == 2">
						<u-col span="9.5">
							<u-textarea v-model="msg" placeholder="请在此输入绘画描述，我来帮你生成"
								@confirm="msgLoad == false ? sendMsg() : sendMsg2()" autoHeight :showConfirmBar='false'
								:adjustPosition='false' @focus="focusTexts" @blur="getValue" maxlength='-1'
								:disableDefaultPadding='true' @keyboardheightchange='keyboardheight' :focus="false">

							</u-textarea> </u-col>
						<u-col span="2.5" align="bottom">
							<u-button type="primary" color="#1F64FF"
								@click="msgLoad == false ? sendMsg() : sendMsg2()">发送</u-button>
						</u-col>
					</u-row>

					<u-row align='bottom' gutter="5" v-if="chat_type == 3">
						<u-col span="9.5">
							<u-textarea v-model="msg" placeholder="请在此输入绘画描述，我来帮你生成"
								@confirm="bd_msgLoad == false ? sendMsg() : sendMsg2()" autoHeight
								:showConfirmBar='false' :adjustPosition='false' @focus="focusTexts" @blur="getValue"
								maxlength='-1' :disableDefaultPadding='true' @keyboardheightchange='keyboardheight'
								:focus="false">

							</u-textarea> </u-col>
						<u-col span="2.5" align="bottom">
							<u-button type="primary" color="#1F64FF"
								@click="bd_msgLoad == false ? sendMsg() : sendMsg2()">发送</u-button>
						</u-col>
					</u-row>

					<u-row align='bottom' gutter="5" v-if="chat_type == 14">
						<u-col span="9.5">
							<u-textarea v-model="msg" placeholder="请在此输入绘画描述，我来帮你生成"
								@confirm="hs_msgLoad == false ? sendMsg() : sendMsg2()" autoHeight
								:showConfirmBar='false' :adjustPosition='false' @focus="focusTexts" @blur="getValue"
								maxlength='-1' :disableDefaultPadding='true' @keyboardheightchange='keyboardheight'
								:focus="false">
							</u-textarea>
						</u-col>
						<u-col span="2.5" align="bottom">
							<u-button type="primary" color="#1F64FF"
								@click="hs_msgLoad == false ? sendMsg() : sendMsg2()">发送</u-button>
						</u-col>
					</u-row>

					<u-row align='bottom' gutter="5" v-if="chat_type == 13">
						<u-col span="9.5">
							<u-textarea v-model="msg" placeholder="请在此输入绘画描述，我来帮你生成"
								@confirm="wx_msgLoad == false ? sendMsg() : sendMsg2()" autoHeight
								:showConfirmBar='false' :adjustPosition='false' @focus="focusTexts" @blur="getValue"
								maxlength='-1' :disableDefaultPadding='true' @keyboardheightchange='keyboardheight'
								:focus="false">

							</u-textarea> </u-col>
						<u-col span="2.5" align="bottom">
							<u-button type="primary" color="#1F64FF"
								@click="wx_msgLoad == false ? sendMsg() : sendMsg2()">发送</u-button>
						</u-col>
					</u-row>
				</view>

			</view>


		</view>

		<!-- 采样器选择 -->
		<u-picker :show="samplerShow" :columns="samplerList" v-model="samplerValue" keyName="label"
			@cancel="samplerShow = false" @confirm="samplerSubmit"></u-picker>


		<Ssdownload ref="ssdownload" :fileUrl="fileUrl" :fileType="fileType"></Ssdownload>
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
		chat_session,
		getEnText,
		getSdQuery,
		getSdModel,
		sdDraw,
		getSdDraw
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
	// import Title from "@/pages/title/index.vue"
	import Ssdownload from '@/childPage/components/ss-download/ss-download.vue'
	export default {
		components: {
			// Title
			Ssdownload
		},
		data() {
			return {
				pic_url:global.baseImg+'/案例图/b9f9ac52-7183-4870-aaf0-602f652057a1.jpg',
				pic_desc:'',
				pic_tem:'',
				list: [{
						name: '通义万相',

					},

					// {
					// 	name: 'DALL·E2'
					// },
					{
						name: '百度绘画'
					},
					{
						name: '火山引擎'
					},
				],

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
				keyHeight: 0,
				barHeight: 0,
				copyHeight: 0,

				draw_tip: false,
				type_tip: false,

				timer: 0,
				t_time: 0,
				bd_desc: '',
				msgLoad: false,
				chatList: [],



				mj_timer: 0,
				mj_t_time: 0,
				mj_desc: '',
				mj_draw_time: 0,
				mj_msgLoad: false,
				MidjourneyList: [],
				enText: '',
				wait_time: 1,
				wait_jd: 0,
				isMj: true,
				mjTypeList: [{
						name: "通用风格",
						pic_url: "xcx/1ca14e65-17a1-427c-9c0f-c35b1c68090d.jpg",
						value: false,
					},
					{
						name: "二次元",
						pic_url: "xcx/fdf209db-55b0-4318-9544-a47e39869fc4.jpg",
						value: true,
					}
				],

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
				size: '',
				sizeIndex: 0,
				query_type: 1,

				noticeList: [],
				dallList: [{
					id: '256x256',
					size: '256x256',
					type: 'zheng'
				}, {
					id: '512x512',
					size: '512x512',
					type: 'zheng'
				}, {
					id: '1024x1024',
					size: '1024x1024',
					type: 'zheng'
				}],
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
				bdList: [{
					id: '1024*1024',
					size: '1024*1024',
					type: 'zheng'
				}, {
					id: '1024*1536',
					size: '1024*1536',
					type: 'gao'
				}, {
					id: '1536*1024',
					size: '1536*1024',
					type: 'chang'
				}],
				mjList: [{
					id: '1:1',
					size: '1:1',
					type: 'zheng'
				}, {
					id: '4:3',
					size: '4:3',
					type: 'chang'
				}, {
					id: '3:4',
					size: '3:4',
					type: 'gao'
				}, {
					id: '16:9',
					size: '16:9',
					type: 'chang'
				}, {
					id: '9:16',
					size: '9:16',
					type: 'gao'
				}],
				tyList: [{
					id: '1024*1024',
					size: '1024*1024',
					type: 'zheng'
				}, {
					id: '1280*720',
					size: '1280*720',
					type: 'chang'
				}, {
					id: '720*1280',
					size: '720*1280',
					type: 'gao'
				}],

				show: false,
				isBtn: false,
				topHeight: 50,


				askShow: true,
				billList: '',

				sdImg: global.baseImg + '/xcx/ca67317a-cbc1-4890-a3ce-c1b472785b0a.jpg',
				bdImg: global.baseImg + '/xcx/15087c8c-2bf9-47dd-9180-c808e9581b9d.jpg',
				mjImg: global.baseImg + '/xcx/8ab69c49-a00f-4b2b-8a92-b1424b61329b.jpg',
				dellImg: global.baseImg + '/xcx/ea8ddcf6-06aa-4938-96f6-3dac84dd21e6.jpg',
				waitImg: global.baseImg + '/xcx/c4a8054e-50bd-4790-a3cb-ec585412daa7.jpg',

				wx_timer: 0,
				wx_t_time: 0,
				wx_desc: '',
				wx_msgLoad: false,
				wxList: [],
				isWx: true,
				wxTypeList: [{
						name: "默认",
							pic_url: "xcx/com/message_center/tong.png",
							value: '<auto>',
							bgcImg:'/xcx/com/message_center/bgcImg1.png'
						},
						{
							name: "扁平插画",
							pic_url: "xcx/com/message_center/%E6%89%81%E5%B9%B3%E6%8F%92%E7%94%BB.png",
							value: '<flat illustration>',
							bgcImg:'/xcx/com/message_center/bgcImg2.png'
						},
						{
							name: "中国画",
							pic_url: "xcx/com/message_center/%E4%B8%AD%E5%9B%BD%E7%94%BB.png",
							value: '<chinese painting>',
							bgcImg:'/xcx/com/message_center/bgcImg3.png'
						},
						{
							name: "素描",
							pic_url: "xcx/com/message_center/%E7%B4%A0%E6%8F%8F.png",
							value: '<sketch>',
							bgcImg:'/xcx/com/message_center/bgcImg4.png'
						},
						{
							name: "水彩",
							pic_url: "xcx/com/message_center/%E6%B0%B4%E5%BD%A9.png",
							value: '<watercolor>',
							bgcImg:'/xcx/com/message_center/bgcImg5.png'
						},
						{
							name: "油画",
							pic_url: "xcx/com/message_center/%E6%B2%B9%E7%94%BB.png",
							value: '<oil painting>',
							bgcImg:'/xcx/com/message_center/bgcImg6.png'
						},
						{
							name: "动画",
							pic_url: "xcx/com/message_center/%E5%8A%A8%E7%94%BB.png",
							value: '<anime>',
							bgcImg:'/xcx/com/message_center/bgcImg7.png'
						},
						{
							name: "3D卡通",
							pic_url: "xcx/com/message_center/3D%E5%8D%A1%E9%80%9A.png",
							value: '<3d cartoon>',
							bgcImg:'/xcx/com/message_center/bgcImg8.png'
						},
						{
							name: "人像写真",
							pic_url: "xcx/com/message_center/%E4%BA%BA%E5%83%8F%E5%86%99%E7%9C%9F.png",
							value: '<portrait>',
							bgcImg:'/xcx/com/message_center/bgcImg9.png'
						},
						{
							name: "摄影",
							pic_url: "xcx/com/message_center/%E6%91%84%E5%BD%B1.png",
							value: '<photography>',
							bgcImg:'/xcx/com/message_center/bgcImg10.png'
					}

				],


				hs_timer: 0,
				hs_t_time: 0,
				hs_desc: '',
				hs_msgLoad: false,
				hsList: [],
				isHs: true,
				hsTypeList: [{
						name: "立体风",
							pic_url: "xcx/com/message_center/%E7%AB%8B%E4%BD%93%E9%A3%8E.png",
							bgcImg:'/xcx/com/message_center/hsbgcImg1.png',
							value: 'cubism',
						},
						{
							name: "现代风",
							pic_url: "xcx/com/message_center/%E7%8E%B0%E4%BB%A3%E9%A3%8E.png",
							bgcImg:'/xcx/com/message_center/hsbgcImg2.png',
							value: 'contemporary',
						},
						{
							name: "卡通风",
							pic_url: "xcx/com/message_center/3D%E5%8D%A1%E9%80%9A.png",
							bgcImg:'/xcx/com/message_center/hsbgcImg3.png',
							value: 'cartoon',
						},
						{
							name: "铅笔画风",
							pic_url: "xcx/com/message_center/%E9%93%85%E7%AC%94%E7%94%BB%E9%A3%8E.png",
							bgcImg:'/xcx/com/message_center/hsbgcImg4.png',
							value: 'pencil',
					}
				],


				bd_timer: 0,
				bd_t_time: 0,
				draw_time: 0,
				dell_desc: '',
				bd_msgLoad: false,
				baiduList: [],
				isBd: true,
				bdTypeList: [{
						name: "探索无限",
							pic_url: "xcx/com/message_center/%E6%8E%A2%E7%B4%A2%E6%97%A0%E9%99%90.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg1.png',
							value: '探索无限',
						},
						{
							name: "古风",
							pic_url: "xcx/com/message_center/%E5%8F%A4%E9%A3%8E.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg2.png',
							value: '古风',
						},
						{
							name: "二次元",
							pic_url: "xcx/com/message_center/%E4%BA%8C%E6%AC%A1%E5%85%83.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg3.png',
							value: '二次元',
						},
						{
							name: "浮世绘",
							pic_url: "xcx/com/message_center/%E6%B5%AE%E4%B8%96%E7%BB%98.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg4.png',
							value: '浮世绘',
						},
						{
							name: "low poly",
							pic_url: "xcx/com/message_center/low%20polw.png",
							bgcImg:'/xcx/com/message_center/bdBgcImg5.png',
							alue: 'low poly',
						},
						{
							name: "未来主义",
							pic_url: "xcx/com/message_center/%E6%9C%AA%E6%9D%A5%E4%B8%BB%E4%B9%89.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg6.png',
							value: '未来主义',
						},
						{
							name: "概念艺术",
							pic_url: "xcx/com/message_center/%E6%A6%82%E5%BF%B5%E8%89%BA%E6%9C%AF.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg7.png',
							value: '概念艺术',
						},
						{
							name: "像素风格",
							pic_url: "xcx/com/message_center/%E5%83%8F%E7%B4%A0%E9%A3%8E%E6%A0%BC.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg8.png',
							value: '像素风格',
						},
						{
							name: "赛博朋克",
							pic_url: "xcx/com/message_center/%E8%B5%9B%E5%8D%9A%E6%9C%8B%E5%85%8B.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg9.png',
							value: '赛博朋克',
						},
						{
							name: "洛丽塔风格",
							pic_url: "xcx/com/message_center/%E6%B4%9B%E4%B8%BD%E5%A1%94.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg10.png',
							value: '洛丽塔风格',
						},
						{
							name: "巴洛克风格",
							pic_url: "xcx/com/message_center/%E5%B7%B4%E6%B4%9B%E5%85%8B.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg11.png',
							value: '巴洛克风格',
						},
						{
							name: "超现实主义",
							pic_url: "xcx/com/message_center/%E8%B6%85%E7%8E%B0%E5%AE%9E%E4%B8%BB%E4%B9%89.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg12.png',
							value: '超现实主义',
						},
						{
							name: "水彩画",
							pic_url: "xcx/com/message_center/%E6%B0%B4%E5%BD%A9%E7%94%BB.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg13.png',
							value: '水彩画',
						},
						{
							name: "蒸汽波艺术",
							pic_url: "xcx/com/message_center/%E8%92%B8%E6%B1%BD%E6%B3%A2%E8%89%BA%E6%9C%AF.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg14.png',
							value: '蒸汽波艺术',
						},
						{
							name: "油画",
							pic_url: "xcx/com/message_center/%E6%B2%B9%E7%94%BB.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg15.png',
							value: '油画',
						},
						{
							name: "卡通画",
							pic_url: "xcx/com/message_center/%E5%8D%A1%E9%80%9A%E7%94%BB.png",
							bgcImg:'/xcx/com/message_center/bdbgcImg16.png',
							value: '卡通画',
					},
				],


				fileUrl: '',
				fileType: ''
			}
		},

		onShow() {
			// this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			this.isuser = true; // 清空所有登录或升级会员提示
			this.msg = '';
			this.isPosition = false,
				this.keyHeight = 0

			uni.setStorageSync('session_code2', '');
			uni.setStorageSync('chat_group_code2', '');
			uni.setStorageSync('session_code3', '');
			uni.setStorageSync('chat_group_code3', '');
			uni.setStorageSync('session_code6', '');
			uni.setStorageSync('chat_group_code6', '');
			uni.setStorageSync('session_code9', '');
			uni.setStorageSync('chat_group_code9', '');

			let index = uni.getStorageSync('active')
			// console.log(index, 333)
			if (index == 3) {
				this.active = 1
				this.chat_type = 3
				this.chatType = '百度'
				this.msg = uni.getStorageSync('drawInfo')
				this.modelList = this.bdTypeList
				this.modelValue = this.bdTypeList[0].name;
				this.modelIndex = this.bdTypeList[0].value
				this.sd_type = 1

			} else if (index == 14) {
				this.active = 2
				this.chat_type = 14
				this.chatType = '火山引擎'
				this.msg = uni.getStorageSync('drawInfo')
				this.modelList = this.hsTypeList
				this.modelValue = this.hsTypeList[0].name;
				this.modelIndex = this.hsTypeList[0].value
				this.sd_type = 1
			} else if (index == 13 || index == '') {
				this.active = 0
				this.chat_type = 13
				this.chatType = '通义万相'
				this.msg = uni.getStorageSync('drawInfo')
				this.modelList = this.wxTypeList
				this.modelValue = this.wxTypeList[0].name;
				this.modelIndex = this.wxTypeList[0].value
				this.sd_type = 1

			}

			if (this.chat_type == 3) {
				if (this.baiduList.length == 0) {
					this.askShow = true
				} else {
					this.askShow = false
				}
				this.size = '1024*1024';
			} else if (this.chat_type == 13) {
				if (this.wxList.length == 0) {
					this.askShow = true
				} else {
					this.askShow = false
				}
				this.size = '1024*1024';
			} else if (this.chat_type == 14) {
				if (this.hsList.length == 0) {
					this.askShow = true
				} else {
					this.askShow = false
				}
				this.size = '';
			}

			if (uni.getStorageSync('history_code') != '') {
				this.historySession(uni.getStorageSync('history_code'))
				this.askShow = false;
			}

			this.getDrawRecommend() // 获取问题集

			this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			let avatarUrl = global.baseImg + '/' + uni.getStorageSync("avatarUrl");
			this.avatar = avatarUrl;

		},
		onLoad(option) {
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
			// 获取问题集
			getDrawRecommend() {
				getDrawRecommend().then(res => {
					if (res.code == 20000) {
						this.billList = res.data[Math.floor(Math.random() * 23)];
						this.pic_desc=this.billList.pic_desc
						this.pic_url=this.billList.pic_url
						if(this.msg!=''){
							this.toAsk()
						}
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},

			// 获取sd模型
			getSdModel() {
				getSdModel().then(res => {

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
			// 获取mj绘画排队时间
			getQuery() {
				getQuery().then(res => {
					if (res.code == 20000) {
						let wait_member = res.data.data;
						if (wait_member > 2) {
							this.wait_time = (wait_member * 30) / 60
						} else {
							this.wait_time = 1
						}
					} else {
						// this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})
			},

			historySession(session) {

				let data = JSON.parse(session)

				if (data.type == 3) {
					this.active = 1;
					this.chat_type = 3
					this.baiduList = [];
				} else if (data.type == 13) {
					this.active = 0;
					this.chat_type = 13
					this.wxList = [];
				} else if (data.type == 14) {
					this.active = 2;
					this.chat_type = 14;
					this.hsList = []
				}

				this.askShow = false;
				this.$forceUpdate()

				if (data.type < 13) {
					chat_session(data.code).then(res => {
						if (res.code == 20000) {
							let arr = res.data;
							arr.forEach((item, index) => {
								this.chat_type = item.chat_type
								if (index == arr.length - 2) {
									this.msg = item.content
									if (item.images == null) {
										item.images = []
									}
									this.sd_type = 1
									if (data.type == 3) {
										this.modelList = this.bdTypeList
										this.modelList.forEach((res, tip) => { // 选中相应风格
											if (res.value == item.style) {
												this.queryIndex = tip
											}
										})
									}

								}

								if (index == arr.length - 1) {
									let url = {
										url: global.baseImg + '/' + item.content
									};
									let img_urls = [];
									img_urls.push(url);
									let data = {
										image_urls: img_urls,
										session_code: item.session_code,
										chat_group_code: item.chat_group_code,
										is_like: item.is_likes
									}

									if (this.chat_type == 3) {
										this.baiduList = [];
										this.baiduList.push(data);
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
				} else {
					getImgDetail(data.code).then(res => {
						console.log(res, 8852)
						if (res.code == 20000) {
							let arr = res.data;
							arr.forEach((item, index) => {
								this.chat_type = item.chat_type
								if (index == arr.length - 2) {
									this.msg = item.content
									if (item.images == null) {
										item.images = []
									}
									this.sd_type = 1
									if (data.type == 13) {
										this.modelList = this.wxTypeList
									} else {
										this.modelList = this.hsTypeList
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
					this.keyHeight = 0
					// console.log(e);
					uni.showTabBar({
						// animation: true
					})
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
					title: '下载中'
				});
				// console.log(url, '我是下载URL');
				let that = this;
				that.fileUrl = url;
				that.fileType = '1';
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
					this.toBottom()
				} else {
					this.isPosition = false;
					this.keyHeight = 0;
				}


			},
			getValue() {
				this.isPosition = false;
				this.keyboardHeight = 0;
				this.keyHeight = 0;
				// uni.hideKeyboard();
				uni.showTabBar({
					// animation: true
				})
				// console.log(this.chat_type,5621)

			},

			getEnText() {
				let data = {
					text: this.msg
				}
				this.enText = '';
				this.sdText = '';
				getEnText(data).then(res => {
					if (res.code == 20000) {
						if (this.chat_type == 6) {
							this.enText = res.data.text
						} else {
							this.sdText = res.data.text
						}
						this.submit()
					} else {
						this.$api.msg('转译失败,请稍后重试')
					}
				})
			},

			getHideText() {
				let data = {
					text: this.sd_complete
				}
				this.sdHideText = ''
				getEnText(data).then(res => {
					if (res.code == 20000) {
						this.sdHideText = res.data.text
					}
				})
			},
			toBottom() {
				console.log('出发了')
				let that = this;
				this.$nextTick(() => {
					setTimeout(() => {
						uni.createSelectorQuery().select(".textadd").boundingClientRect(function(
							res) { //定位到你要的class的位置
							// console.log(res,330);
							console.log(res.height, 410)
							uni.pageScrollTo({
								scrollTop: res.height,
								duration: 0
							});
						}).exec()
					}, 0)
				})
			},
			sendMsg() {
				let this_ = this
				this.isPosition = false;
				this.draw_tip = false;
				this.wait_time = 1;
				this.wait_jd = 0;
				if (this.chat_type == 6) {
					this.getQuery()
				}

				if (this.chat_type == 9) {
					this.getSdQuery()
				}
				// 消息为空不做任何操作
				if (this.msg.trim() == "") {
					this.$api.msg('请输入您要发送的内容')
					return;
				}

				// if (this.msg.length < 10) {
				// 	this.$api.msg('输入内容不能少于10个文字!')
				// 	return;
				// }

				// if (this.msg.length > 800 && this.chat_type == 2) {
				// 	this.$api.msg('输入内容不能多于800个文字!')
				// 	return;
				// }

				// if (this.msg.length > 100 && this.chat_type == 3) {
				// 	this.$api.msg('输入内容不能多于100个文字!')
				// 	return;
				// }

				this.askShow = false; // 关闭应用助理提示热词
				this.isuser = true;

				if (this.chat_type == 6 || this.chat_type == 9) {
					this.getEnText()
					if (this.chat_type == 9) {
						this.StableDiffusionList = []
					}
				} else {
					this.submit()
				}


			},

			submit() {
				uni.setStorageSync('drawInfo', '')
				if (this.chat_type == 3) {
					if (!this.isBd) {
						return
					}
					this.isBd = false;
					this.baiduList = []
					// 清除消息
					this.bd_msgLoad = true
					this.baiduDraw()
				} else if (this.chat_type == 13) {
					if (!this.isWx) {
						return
					}
					this.isWx = false;
					this.wxList = []

					// 清除消息
					this.wx_msgLoad = true
					this.wxDraw()
				} else if (this.chat_type == 14) {
					if (!this.isHs) {
						return
					}
					this.isHs = false;
					this.hsList = []

					// 清除消息
					this.hs_msgLoad = true
					this.hsDraw()
				}
			},

			// 百度绘画
			baiduDraw() {
				let data = {
					"chat_type": '3',
					"action_type": 3,
					"prompt": this.msg,
					"n": 1,
					"size": this.size,
					"style": this.modelIndex,
					"model": 'txt2img'
				}

				this.isTime = true; // 思考中
				this.bd_timer = 0;
				this.bd_t_time = setInterval(() => {
					this.bd_timer += 1;
				}, 1000)
				this.msg = ''; // 清空发送栏内容
				this.query_type = 1;
				asyncImg(data).then(res => {
					let that = this;
					console.log(res, 489)
					if (res.code == 20000) {
						let datas = {
							"task_id": res.data.task_id,
						};
						let request_count = 0;
						that.draw_time = setInterval(() => {
							if (request_count < 51) { // 最多轮询50次
								getTextImg(datas).then(val => {
									// console.log(resposne);
									if (val.code == 20000) {
										request_count += 1;
										if (val.data != null) {
											if (val.data[0].status != 1) {
												that.isuser = true;
												let img_urls = [];
												let url_val = {
													url: global.baseImg + '/' + val.data[0]
														.result_image
												}
												img_urls.push(url_val);
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
													"time": that.bd_timer,
													"is_like": 0
												}

												let img_arr = [];
												img_arr.push(obj);
												if (that.baiduList.length == 0) {
													that.baiduList = img_arr;
												}
												// that.baiduList.push(obj);
												that.bd_msgLoad = false;
												that.isTime = false;
												that.isBd = true;
												clearInterval(that.bd_t_time);
												clearInterval(that.draw_time);
												// 定位到聊天最底部
												// that.toBottom();

												uni.setStorageSync('session_code3', val.data[0]
													.session_code);
												uni.setStorageSync('chat_group_code3', val.data[0]
													.chat_group_code);
												// let save_val = {
												// 	"type_name": "百度绘画",
												// 	"type_code": "image",
												// 	"title": data.content,
												// 	"eid": val.data[0].image_code,
												// 	"image_url": val.data[0].result_image
												// }

												// that.saveFootprint(save_val)
											} else {
												that.bd_msgLoad = false;
												that.isTime = false;
												clearInterval(that.bd_t_time);
												clearInterval(that.draw_time);
												that.$api.msg('生成图片失败，稍后重试')
												that.askShow = true
												that.isBd = true;
											}

										}

									} else {
										that.bd_msgLoad = false;
										that.isTime = false;
										clearInterval(that.bd_t_time);
										clearInterval(that.draw_time);
										that.$api.msg(res.msg)
										that.askShow = true
										that.isBd = true;
									}
								})
							} else {
								that.bd_msgLoad = false;
								that.isTime = false;
								clearInterval(that.bd_t_time);
								clearInterval(that.draw_time);
								that.$api.msg('请求超时，稍后继续')
								that.askShow = true
								that.isBd = true;
							}

						}, 2000)

					} else if (res.code < 49999) {
						that.isuser = false;
						that.bd_msgLoad = false;
						that.isBd = true;
						// that.isTime = false;
						clearInterval(that.bd_t_time);
						clearInterval(that.draw_time);
						// that.$api.msg(res.msg)
						that.bd_desc = res.msg;
						if (res.code == 40022) {
							that.draw_tip = true;
						} else {
							that.draw_tip = false;
						}

					} else {
						that.bd_msgLoad = false;
						that.isTime = false;
						clearInterval(that.bd_t_time);
						clearInterval(that.draw_time);
						that.$api.msg(res.msg)
						that.askShow = true
						that.isBd = true;
					}
				}).catch(err => {
					that.bd_msgLoad = false;
					that.isTime = false;
					clearInterval(that.bd_t_time);
					clearInterval(that.draw_time);
					that.$api.msg('绘图失败')
					that.askShow = true
					that.isBd = true;
				})
			},
			// 万相绘画
			wxDraw() {
				let data = {
					"chat_type": '13',
					"action_type": 3,
					"prompt": this.msg,
					"size": this.size,
					"n": 1,
					"style": this.modelIndex,
				}
				let that = this;
				that.wx_timer = 0;
				that.wx_t_time = setInterval(() => {
					that.wx_timer += 1;
				}, 1000)
				that.msg = ''; // 清空发送栏内容
				that.query_type = 1;
				// uni.showLoading({
				// 	title: '生成中...'
				// })
				createImg(data).then(res => {
console.log(data,13);
					if (res.code == 20000) {
						let img_urls = [];
						let url_val = {
							url: global.baseImg + '/' + res.data.results[0].result_image
						}
						img_urls.push(url_val);
						let obj = {
							"finish_reason": "stop",
							"size": res.data.results[0].size,
							"role": "assistant",
							"image_urls": img_urls,
							"time": that.wx_timer,
							"is_like": 0,
							"msg_code": res.data.results[0].msg_code,
							"image_code": res.data.image_code
						}

						let img_arr = [];
						img_arr.push(obj);

						// that.StableDiffusionList.push(obj);
						if (that.wxList.length == 0) {
							that.wxList = img_arr;
						}


						// 定位到聊天最底部
						// that.toBottom();
						that.isuser = true;
						that.wx_msgLoad = false;
						clearInterval(that.wx_t_time);
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
						that.wx_msgLoad = false;
						that.isWx = true;
						// that.isTime = false;
						clearInterval(that.wx_t_time);
						// that.$api.msg(res.msg)
						that.wx_desc = res.msg;
						if (res.code == 40022) {
							that.draw_tip = true;
						} else {
							that.draw_tip = false;
						}
						uni.hideLoading()
					} else {
						that.wx_msgLoad = false;
						// that.isTime = false;
						clearInterval(that.wx_t_time);
						that.$api.msg(res.msg)
						that.askShow = true
						that.isWx = true;
					}
				}).catch(err => {
					that.wx_msgLoad = false;
					// that.isTime = false;
					clearInterval(that.wx_t_time);
					that.$api.msg('绘图失败')
					that.askShow = true
					that.isWx = true;
					uni.hideLoading()
				})
			},

			// 火山引擎
			hsDraw() {
				let data = {
					"chat_type": '14',
					"action_type": 3,
					"prompt": this.msg,
					"size": '',
					"n": 1,
					"style": this.modelIndex,
				}
				let that = this;
				that.hs_timer = 0;
				that.hs_t_time = setInterval(() => {
					that.hs_timer += 1;
				}, 1000)
				that.msg = ''; // 清空发送栏内容
				that.query_type = 1;

				createImg(data).then(res => {

					if (res.code == 20000) {
						let img_urls = [];
						let url_val = {
							url: global.baseImg + '/' + res.data.results[0].result_image
						}
						img_urls.push(url_val);
						let obj = {
							"finish_reason": "stop",
							"size": res.data.results[0].size,
							"role": "assistant",
							"image_urls": img_urls,
							"time": that.hs_timer,
							"is_like": 0,
							"msg_code": res.data.results[0].msg_code,
							"image_code": res.data.image_code
						}

						let img_arr = [];
						img_arr.push(obj);

						// that.StableDiffusionList.push(obj);
						if (that.hsList.length == 0) {
							that.hsList = img_arr;
						}


						// 定位到聊天最底部
						// that.toBottom();
						that.isuser = true;
						that.hs_msgLoad = false;
						clearInterval(that.hs_t_time);
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
						that.hs_msgLoad = false;
						that.isHs = true;
						// that.isTime = false;
						clearInterval(that.hs_t_time);
						// that.$api.msg(res.msg)
						that.hs_desc = res.msg;
						if (res.code == 40022) {
							that.draw_tip = true;
						} else {
							that.draw_tip = false;
						}
					} else {
						that.hs_msgLoad = false;
						// that.isTime = false;
						clearInterval(that.hs_t_time);
						that.$api.msg(res.msg)
						that.askShow = true
						that.isHs = true;
					}
				}).catch(err => {
					that.hs_msgLoad = false;
					// that.isTime = false;
					clearInterval(that.hs_t_time);
					that.$api.msg('绘图失败')
					that.askShow = true
					that.isHs = true;
				})
			},

			// mj绘画
			mjDraw() {
				let data = {
					"chat_type": '6',
					"action_type": '3',
					"content": this.msg,
					"content_en": this.enText,
					"size": this.size,
					"is_niji": this.modelIndex,
					"session_code": '',
				}
				let that = this;
				that.mj_timer = 0;
				that.mj_t_time = setInterval(() => {
					that.mj_timer += 1;
				}, 1000)
				that.msg = ''; // 清空发送栏内容
				that.enText = '';
				that.query_type = 1;
				mjDraw(data).then(res => {

					if (res.code == 20000) {
						let datas = {
							"tag": res.data.tag,
						};
						let request_count = 0;
						that.mj_draw_time = setInterval(() => {
							if (request_count < 101) { // 最多轮询100次
								getMjDraw(datas).then(val => {
									// console.log(resposne);
									if (val.code == 20000) {
										request_count += 1;
										if (val.data[0].progress > 0) {
											that.wait_jd = val.data[0].progress
										}

										if (val.data[0].status == 2) {
											that.$api.msg('您的输入涉及不良内容，请勿发布违规信息，请注意文明用语。')
										}

										if (val.data[0].progress == 100) {

											let img_urls = [];
											let url_val = {
												url: global.baseImg + '/' + val.data[0].content
											}
											img_urls.push(url_val);
											// console.log(img_urls,886)
											// console.log(val.data[0].content, 885)
											let obj = {
												"create_time": val.data[0].create_time,
												"finish_reason": "stop",
												"session_code": val.data[0].session_code,
												"chat_group_code": val.data[0].chat_group_code,
												"size": val.data[0].size,
												"role": "assistant",
												"image_urls": img_urls,
												"time": that.mj_timer,
												"is_like": 0
											}

											let img_arr = [];
											img_arr.push(obj);
											if (that.MidjourneyList.length == 0) {
												that.MidjourneyList = img_arr;
											}

											// that.MidjourneyList.push(obj);

											// 定位到聊天最底部
											// that.toBottom();
											that.isuser = true;
											that.mj_msgLoad = false;
											that.isMj = true;
											clearInterval(that.mj_t_time);
											clearInterval(that.mj_draw_time);

											uni.setStorageSync('session_code6', val.data[0]
												.session_code);
											uni.setStorageSync('chat_group_code6', val.data[0]
												.chat_group_code);
											let save_val = {
												"type_name": "Midjourney",
												"type_code": "image",
												"title": data.content,
												"eid": val.data[0].session_code,
												"image_url": val.data[0].content
											}

											that.saveFootprint(save_val)
										}

									} else {
										that.mj_msgLoad = false;
										// that.isTime = false;
										clearInterval(that.mj_t_time);
										clearInterval(that.mj_draw_time);
										that.$api.msg(res.msg)
										that.askShow = true
										that.isMj = true;
									}
								})
							} else {
								that.mj_msgLoad = false;
								// that.isTime = false;
								clearInterval(that.mj_t_time);
								clearInterval(that.mj_draw_time);
								that.$api.msg('等待时间过长，请稍后前往历史记录查看')
								that.askShow = true
								that.isMj = true;
							}

						}, 2000)

					} else if (res.code < 49999) {
						that.isuser = false;
						that.mj_msgLoad = false;
						that.isMj = true;
						// that.isTime = false;
						clearInterval(that.mj_t_time);
						clearInterval(that.mj_draw_time);
						// that.$api.msg(res.msg)
						that.mj_desc = res.msg;
						if (res.code == 40022) {
							that.draw_tip = true;
						} else {
							that.draw_tip = false;
						}

					} else {
						that.mj_msgLoad = false;
						// that.isTime = false;
						clearInterval(that.mj_t_time);
						clearInterval(that.mj_draw_time);
						that.$api.msg(res.msg)
						that.askShow = true
						that.isMj = true;
					}
				}).catch(err => {
					that.mj_msgLoad = false;
					// that.isTime = false;
					clearInterval(that.mj_t_time);
					clearInterval(that.mj_draw_time);
					that.$api.msg('绘图失败')
					that.askShow = true
					that.isMj = true;
				})
			},

			// sd绘画
			sdDraw() {
				let data = {
					"chat_type": '9',
					"action_type": '3',
					"content": this.sdText,
					"content_zh": this.msg,
					"negative_prompt": this.sdHideText,
					"negative_prompt_zh": this.sd_complete,
					"sd_model_checkpoint": this.modelIndex,
					"sampler_index": this.samplerValue,
					"size": this.size,
					"session_code": '',
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
				that.msg = ''; // 清空发送栏内容
				that.sd_complete = '';
				that.sdHideText = '';
				that.query_type = 1;
				// that.imgList = [];
				sdDraw(data).then(res => {

					// console.log(res, 489)
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
													"is_like": 0
												}

												let img_arr = [];
												img_arr.push(obj);

												// that.StableDiffusionList.push(obj);
												if (that.StableDiffusionList.length == 0) {
													that.StableDiffusionList = img_arr;
												}


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
					url: '/pages/user/history/history?active=1'
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
				this.MidjourneyList = []
				this.askShow = true
				this.msg = ''
			},

			addDraw3() {
				uni.setStorageSync('session_code9', '');
				uni.setStorageSync('chat_group_code9', '');
				this.StableDiffusionList = []
				this.sd_type = 1;
				this.sd_photo_type = 1;
				this.imgList = []
				this.askShow = true
				this.msg = ''
			},

			// 前往提问
			toAsk() {
				// this.pic_url=global.baseImg+this.pic_tem
				this.msg=this.pic_desc
			},

			//采样选择器
			samplerSubmit(e) {
				this.samplerValue = e.value[0].label;
				this.samplerShow = false;
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
			checkImg(index, tip) {
				let url = ''
				if (this.chat_type == 3) {
					url = this.baiduList[index].image_urls;
					uni.setStorageSync('active', 1)
				} else if (this.chat_type == 13) {
					url = this.wxList[index].image_urls;
					uni.setStorageSync('active', 0)
				}
				let img_url = url[tip].url;
				// console.log(img_url,332)
				uni.previewImage({
					urls: [img_url],
					current: 0
				})

			},

			// 上传图片
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

			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},

			//sd选择类型
			selectType(val) {
				this.sd_type = val
				if (this.StableDiffusionList.length == 0 && !this.sd_msgLoad) {
					this.askShow = true
				} else {
					this.askShow = false
					this.sd_photo_type = 2
				}

				if (this.StableDiffusionList.length > 0 && this.imgList.length > 0) {
					this.askShow = true
				}

				if (this.StableDiffusionList.length > 0 && this.imgList.length == 0) {
					this.askShow = false
					this.sd_photo_type = 2
				}
				if (val == 2) {
					this.sd_photo_type = 1
				}
			},
			photoType(val) {
				this.sd_photo_type = val
				if (this.StableDiffusionList.length > 0) {
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

			checkSelect() {
				let content = '采样器就是一种图像自动化工具,可以对用户生成的图片进行相似风格处理优化'

				uni.showModal({
					content: content,
					confirmText: "知道了",
					showCancel: false,
				});
			},

			//sd选择参数
			selctQuery(index) {
				this.modelIndex = this.modelList[index].value;
				this.modelValue = this.modelList[index].name;
				this.queryIndex = index;
				this.pic_tem=this.modelList[index].bgcImg
			},

			selctSize(size, index) {
				this.size = size;
				this.sizeIndex = index
			},

			// 点赞点踩
			likeType(val, index) {
				console.log(val, 'islike');
				console.log(index, 'chattype');
				console.log(this.baiduList, 7778)
				let data = {
					is_likes: val
				}
				if (index == 3) {
					data.session_code = this.baiduList[0].session_code
					data.chat_group_code = this.baiduList[0].chat_group_code
					this.baiduList[0].is_like = val
				} else if (index == 13) {
					data.msg_code = this.wxList[0].msg_code
					this.wxList[0].is_like = val
				} else if (index == 14) {
					data.msg_code = this.hsList[0].msg_code
					this.hsList[0].is_like = val
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
		}
	}
</script>

<style scoped lang="less">
	.head_index {
		width: 100%;
		// height: 188upx;
		position: fixed;
		top: 0upx;
		background: rgba(239, 245, 255, 1);
		z-index: 9999;
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

	.cont_tabs {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		// border-bottom: 1px solid #E5E6EB;
		background: #fff;
		height: 44px;
		line-height: 44px;
		font-size: 14px;
		// padding-left: 32upx;

	}

	.bottom-dh-char {
		background-color: #fff;
		// width: calc(100% - 32upx);
		width: 100%;
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

	.tabs {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30upx 0 10upx 0;

		.tabs_l {
			color: #333;
			font-size: 26upx;
			line-height: 40upx;
			background: #fff;
			padding: 10upx 30upx;
			border-radius: 4px 0px 0px 4px;
		}

		.tabs_l_active {
			color: #fff;
			font-size: 26upx;
			line-height: 40upx;
			background: #1F64FF;
			padding: 10upx 30upx;
			border-radius: 4px 0px 0px 4px;
		}

		.tabs_r {
			color: #333;
			font-size: 26upx;
			line-height: 40upx;
			background: #fff;
			padding: 10upx 30upx;
			border-radius: 0px 4px 4px 0px;
		}

		.tabs_r_active {
			color: #fff;
			font-size: 26upx;
			line-height: 40upx;
			background: #1F64FF;
			padding: 10upx 30upx;
			border-radius: 0px 4px 4px 0px;
		}
	}

	.tab_photo {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20upx 0;

		// margin-left: -40upx;
		.tabs_photo_active {
			color: #fff;
			font-size: 24upx;
			line-height: 40upx;
			background: #1F64FF;
			padding: 10upx 20upx;
			border-radius: 4px;
		}

		.tabs_photo {
			color: #333;
			font-size: 24upx;
			line-height: 40upx;
			background: #E0EEFF;
			padding: 10upx 20upx;
			border-radius: 4px;
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
		box-shadow: 0px 2px 10px 0px rgba(51, 51, 51, 0.1);
		border-radius: 10upx;
		// padding: 10upx 0;
		position: relative;
		background: #fff;
		margin-top: 20upx;
		display: flex;
		align-items: center;
		justify-content: center;

		.li_img {
			width: 100%;
			height: 500upx;
			border-radius: 10upx;
		}

		.ex_tip {
			position: absolute;
			top: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.3);
			border-radius: 0 10upx 0 10upx;
			color: #FFF;
			font-size: 22upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			padding: 5upx 10upx;
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

		.ex_btn {
			position: absolute;
			bottom: 0upx;
			right: 0upx;
			background: rgba(0, 0, 0, 0.3);
			border-radius: 10upx;
			padding: 15upx;
			display: flex;
			align-items: flex-start;

			.btn_text {
				color: #fff;
				font-size: 22upx;
				padding-left: 10upx;
			}
		}

		.ex_like {

			background: rgba(0, 0, 0, 0.3);
			border-radius: 10upx;
			padding: 10upx;
		}

		.ex_nlike {
			background: rgba(31, 100, 255, 0.3);
			border-radius: 10upx;
			padding: 10upx;
		}

		.like_up {
			position: absolute;
			top: 20upx;
			right: 20upx;
		}

		.like_down {
			position: absolute;
			top: 100upx;
			right: 20upx;
		}

		.ex_upload {
			position: absolute;
			top: 180upx;
			right: 20upx;
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
			border-bottom: 1upx solid #DBDBDB;

			.active_tabs {
				font-style: normal;
				font-weight: 500;
				font-size: 28upx;
				line-height: 50upx;
				color: #000;
				border-bottom: 4upx solid #1F64FF;
				padding: 7upx 0;
			}

			.tabs {
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
		margin-bottom: 180upx;
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
		width: 100%;

		.select_cont {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.select_left {
				display: flex;
				align-items: center;

				.select_text {
					color: #000;
					font-size: 26upx;
					font-weight: 400;
					line-height: 150%;
					margin-right: 10upx;
				}
			}

			.select_right {
				width: 60%;

				.sd_li {
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
		width: calc(100% - 30upx);
		background: #fff;
		border-top: 1px solid #ddd;
		padding: 10upx 15upx 0 15upx;

		.link_l {
			display: flex;
			align-items: center;
			justify-content: space-between;

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
</style>