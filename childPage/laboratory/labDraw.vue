<template>
	<view>
		<view class="head_index">
			<view class="head_cont">
				<!-- <view class="cont_title">AI绘画</view> -->
				<!-- <Title :title='"AI实验室"' /> -->
				<view class="cont_tabs"
					style="width: 100%; background-color: #fff; display: flex; align-items: center; justify-content: space-between;">
					<u-tabs :list="tabList" lineWidth='60' lineHeight='3' lineColor='#1f64ff'
						:activeStyle='{color: "#1F64FF","font-size":"30rpx"}' @change='listChage' :current='tabIndex'
						:inactiveStyle='{"font-size":"30rpx"}'></u-tabs>
					<view class="right_text" @click="toHistory">历史对话</view>
				</view>
				<view class="cont_tabs"
					style="width: 100%; background-color: #fff; display: flex; align-items: center; justify-content: space-between;">
					<u-tabs :list="list" lineWidth='60' lineHeight='3' lineColor='#1f64ff'
						:activeStyle='{color: "#1F64FF","font-size":"30rpx"}' @change='version' :current='active'
						:inactiveStyle='{"font-size":"30rpx"}'></u-tabs>
				</view>
			</view>

		</view>

		<view :style="[{marginTop: topHeight +'px'},{marginBottom:'100rpx'}]">
			<view class="tabs" v-if="chat_type == 9">
				<view :class="sd_type == 1 ? 'tabs_l_active' : 'tabs_l'" @click="selectType(1)">文生图</view>
				<view :class="sd_type == 1 ? 'tabs_r' : 'tabs_r_active'" @click="selectType(2)">图生图</view>
			</view>

			<view class="tab_photo" v-if="sd_type == 2">
				<view :class="sd_photo_type == 1 ? 'tabs_photo_active' : 'tabs_photo'" @click="photoType(1)"
					style="margin-right: 20upx;">参考图</view>
				<view :class="sd_photo_type == 2 ? 'tabs_photo_active' : 'tabs_photo'" @click="photoType(2)">生成图</view>
			</view>

			<!-- 图片示例  文生图-->
			<view class="ex_ul" v-if="askShow && sd_type == 1">
				<view class="ex_img">
					<image :src="billList.pic_url" mode="aspectFit" class="li_img"></image>
					<view class="ex_tip">示例图片</view>
					<view class="ex_use" @click="toAsk(billList.pic_desc)">使用案例</view>
					<view class="ex_update" @click="getDrawRecommend"><u-icon name="reload" color="#fff"
							size="18"></u-icon></view>
				</view>
			</view>

			<!-- 图片示例  参考图-->
			<view class="ex_ul" v-if="sd_type == 2 && sd_photo_type == 1 && chat_type == 9">
				<view class="ex_time" v-if="imgList.length == 0">
					<image src="@/static/user/upload.png" mode="aspectFit" class="upload_img" @click="takePhoto">
					</image>
					<view class="upload_text">上传参考图</view>
				</view>

				<view class="ex_img" v-for="(val, index) in imgList" :key="index" v-if="imgList.length > 0">
					<image :src="getImgUrl(val)" alt="" @click="takePhoto" mode="aspectFit" class="li_img"></image>
				</view>
			</view>

			<!-- sd绘图 -->
			<view class="ex_ul" v-for="(item,index) in StableDiffusionList" :key="index"
				v-if="!sd_msgLoad && chat_type == 9 && !askShow && sd_photo_type == 2">
				<view class="ex_img" v-for="(val, tip) in item.image_urls" :key="tip">
					<image :src="val.url" alt="" @click.stop="checkImg(index,tip)" mode="aspectFit" class="li_img">
					</image>
					<view class="ex_like like_up" @click="likeType(1,9)" v-if="item.is_like == 0 || item.is_like == 2">
						<u-icon name="thumb-up" color="#fff" size="28"></u-icon>
					</view>
					<view class="ex_nlike like_up" @click="likeType(0,9)" v-if="item.is_like == 1"><u-icon
							name="thumb-up" color="#fff" size="28"></u-icon></view>
					<view class="ex_like like_down" @click="likeType(2,9)"
						v-if="item.is_like == 0 || item.is_like == 1"><u-icon name="thumb-down" color="#fff"
							size="28"></u-icon></view>
					<view class="ex_nlike like_down" @click="likeType(0,9)" v-if="item.is_like == 2"><u-icon
							name="thumb-down" color="#fff" size="28"></u-icon></view>
					<view class="ex_like ex_upload" @click="savePhoto(item.image_urls[0].url)"><u-icon name="download"
							color="#fff" size="28"></u-icon></view>
					<view class="ex_btn">
						<u-icon name="warning" color="#fff" size="18"></u-icon>
						<text class="btn_text">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
					</view>
				</view>
			</view>

			<!-- sd绘图生成中 -->
			<view class="ex_ul" v-if="sd_msgLoad && chat_type == 9 && !askShow && isuser && sd_photo_type == 2">
				<view class="ex_time">
					<u-loading-icon textSize="20"></u-loading-icon>
					<view class="wait_text">生成中,耗时{{ sd_timer }}秒</view>
				</view>
			</view>

			<!-- sd充会员 -->
			<view class="ex_ul" v-if="!sd_msgLoad && chat_type == 9 && !askShow && !isuser">
				<view class="ex_time">
					<view class="wait_text" v-if="chat_type == 9">{{ sd_desc }}</view>
					<view style="display: flex; justify-content: space-around;" v-if="draw_tip == true">
						<u-button type="warning" color="#FF9B17"
							:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'100%'}"
							@click='goMember'>开通流量包</u-button>
					</view>
				</view>
			</view>

			<!-- mj绘图 -->
			<view class="ex_ul" v-for="(item,index) in MidjourneyList" :key="index"
				v-if="!mj_msgLoad && chat_type == 6 && !askShow">
				<view class="ex_img" v-for="(val, tip) in item.image_urls" :key="tip">
					<image :src="val.url" @click.stop="checkImg(index,tip)" mode="aspectFit" class="li_img"></image>
					<view class="ex_like like_up" @click="likeType(1,6)" v-if="item.is_like == 0 || item.is_like == 2">
						<u-icon name="thumb-up" color="#fff" size="28"></u-icon>
					</view>
					<view class="ex_nlike like_up" @click="likeType(0,6)" v-if="item.is_like == 1"><u-icon
							name="thumb-up" color="#fff" size="28"></u-icon></view>
					<view class="ex_like like_down" @click="likeType(2,6)"
						v-if="item.is_like == 0 || item.is_like == 1"><u-icon name="thumb-down" color="#fff"
							size="28"></u-icon></view>
					<view class="ex_nlike like_down" @click="likeType(0,6)" v-if="item.is_like == 2"><u-icon
							name="thumb-down" color="#fff" size="28"></u-icon></view>
					<view class="ex_like ex_upload" @click="savePhoto(item.image_urls[0].url)"><u-icon name="download"
							color="#fff" size="28"></u-icon></view>
					<view class="ex_btn">
						<u-icon name="warning" color="#fff" size="18"></u-icon>
						<text class="btn_text">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
					</view>
				</view>
			</view>

			<!-- mj绘图生成中 -->
			<view class="ex_ul" v-if="mj_msgLoad && chat_type == 6 && !askShow && isuser">
				<view class="ex_time">
					<u-loading-icon textSize="20"></u-loading-icon>
					<view class="wait_text">生成中,耗时{{ mj_timer }}秒</view>
					<view class="wait_text" v-if="wait_jd > 0">加载进度：{{ wait_jd }}%</view>
				</view>
			</view>

			<!-- mj充会员 -->
			<view class="ex_ul" v-if="!mj_msgLoad && chat_type == 6 && !askShow && !isuser">
				<view class="ex_time">
					<view class="wait_text" v-if="chat_type == 6">{{ mj_desc }}</view>
					<view style="display: flex; justify-content: space-around;" v-if="draw_tip == true">
						<u-button type="warning" color="#FF9B17"
							:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'100%'}"
							@click='goMember'>开通流量包</u-button>
					</view>
				</view>
			</view>

			<!-- dell绘图 -->
			<view class="ex_ul" v-for="(item,index) in chatList" :key="index"
				v-if="!msgLoad && chat_type == 2 && !askShow && isuser">
				<view class="ex_img" v-for="(val, tip) in item.image_urls" :key="tip">
					<image :src="val.url" @click.stop="checkImg(index,tip)" mode="aspectFit" class="li_img"></image>
					<view class="ex_like like_up" @click="likeType(1,2)" v-if="item.is_like == 0 || item.is_like == 2">
						<u-icon name="thumb-up" color="#fff" size="28"></u-icon>
					</view>
					<view class="ex_nlike like_up" @click="likeType(0,2)" v-if="item.is_like == 1"><u-icon
							name="thumb-up" color="#fff" size="28"></u-icon></view>
					<view class="ex_like like_down" @click="likeType(2,2)"
						v-if="item.is_like == 0 || item.is_like == 1"><u-icon name="thumb-down" color="#fff"
							size="28"></u-icon></view>
					<view class="ex_nlike like_down" @click="likeType(0,2)" v-if="item.is_like == 2"><u-icon
							name="thumb-down" color="#fff" size="28"></u-icon></view>
					<view class="ex_like ex_upload" @click="savePhoto(item.image_urls[0].url)"><u-icon name="download"
							color="#fff" size="28"></u-icon></view>
					<view class="ex_btn">
						<u-icon name="warning" color="#fff" size="18"></u-icon>
						<text class="btn_text">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
					</view>
				</view>
			</view>

			<!-- dell绘图生成中 -->
			<view class="ex_ul" v-if="msgLoad && chat_type == 2 && !askShow && isuser">
				<view class="ex_time">
					<u-loading-icon textSize="20"></u-loading-icon>
					<view class="wait_text">生成中,耗时{{ timer }}秒</view>
				</view>
			</view>

			<!-- dell充会员 -->
			<view class="ex_ul" v-if="!msgLoad && chat_type == 2 && !askShow && !isuser">
				<view class="ex_time">
					<view class="wait_text" v-if="chat_type == 2">{{ dell_desc }}</view>
					<view style="display: flex; justify-content: space-around;" v-if="draw_tip == true">
						<u-button type="warning" color="#FF9B17"
							:customStyle="{'border-radius':'8px','margin-top':'10px', 'width':'100%'}"
							@click='goMember'>开通流量包</u-button>
					</view>
				</view>
			</view>

			<!-- dell3绘图 -->
			<view class="ex_ul" v-for="(item,index) in dellList" :key="index"
				v-if="!e_msgLoad && chat_type == 15 && !askShow">
				<view class="ex_img" v-for="(val, tip) in item.image_urls" :key="tip">
					<image :src="val.url" @click.stop="checkImg(index,tip)" mode="aspectFit" class="li_img"></image>
					<view class="ex_like like_up" @click="likeType(1,15)" v-if="item.is_like == 0 || item.is_like == 2">
						<u-icon name="thumb-up" color="#fff" size="28"></u-icon>
					</view>
					<view class="ex_nlike like_up" @click="likeType(0,15)" v-if="item.is_like == 1"><u-icon
							name="thumb-up" color="#fff" size="28"></u-icon></view>
					<view class="ex_like like_down" @click="likeType(2,15)"
						v-if="item.is_like == 0 || item.is_like == 1"><u-icon name="thumb-down" color="#fff"
							size="28"></u-icon></view>
					<view class="ex_nlike like_down" @click="likeType(0,15)" v-if="item.is_like == 2"><u-icon
							name="thumb-down" color="#fff" size="28"></u-icon></view>
					<view class="ex_like ex_upload" @click="savePhoto(item.image_urls[0].url)"><u-icon name="download"
							color="#fff" size="28"></u-icon></view>
					<view class="ex_btn">
						<u-icon name="warning" color="#fff" size="18"></u-icon>
						<text class="btn_text">当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核</text>
					</view>
				</view>
			</view>

			<!-- dell3生成中 -->
			<view class="ex_ul" v-if="e_msgLoad && chat_type == 15 && !askShow && isuser">
				<view class="ex_time">
					<u-loading-icon textSize="20"></u-loading-icon>
					<view class="wait_text">生成中,耗时{{ e_timer }}秒</view>
				</view>
			</view>

			<!-- dell3充会员 -->
			<view class="ex_ul" v-if="!e_msgLoad && chat_type == 15 && !askShow && !isuser">
				<view class="ex_time">
					<view class="wait_text" v-if="chat_type == 15">{{ e_desc }}</view>
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
						style="display: flex;" v-if="chat_type != 2">
						<text style="margin-right: 10upx;">风格</text>
						<u-icon name="question-circle" color="#A1A1A1" size="20" @click="checkTip"></u-icon>
					</view>
					<view @click="queryType(2)" :class="[query_type == 2 ? 'active_tabs' : 'tabs']">参数</view>
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

				<view class="query_li" v-if="query_type == 2 && chat_type == 2">
					<view class="li_size" v-for="(val, index) in dallList" :key="index"
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

				<view class="query_li" v-if="query_type == 2 && chat_type == 15">
					<view class="li_size" v-for="(val, index) in sizeList" :key="index"
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

				<view class="query_li" v-if="query_type == 2 && chat_type == 6">
					<view class="li_size" v-for="(val, index) in mjList" :key="index"
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
			<view class="btn_link">
				<view class="link_l" v-if="!msgLoad && chat_type == 2 ">
					<view class="l_chat" style="margin-right: 15rpx;" @click="addDraw1">
						<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
						<text class="l_text">新绘画</text>
					</view>
					<view style="color: #1F64FF;font-size: 26upx;">(每张图消耗42w算力)</view>
				</view>
				<view class="link_l" v-if="!e_msgLoad && chat_type == 15 ">
					<view class="l_chat" style="margin-right: 15rpx;" @click="addDraw4">
						<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
						<text class="l_text">新绘画</text>
					</view>
					<view style="color: #1F64FF;font-size: 26upx;">(每张图消耗100w算力)</view>
				</view>
				<view class="link_l" v-if="!mj_msgLoad && chat_type == 6 ">
					<view style="display: flex;align-items: center;text-align: center;">
						<view class="l_chat" style="margin-right: 15rpx;" @click="addDraw2">
							<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
							<text class="l_text">新绘画</text>
						</view>
						<text class="l_wait" v-if="chat_type == 6">预计时间：{{ wait_time }}分钟内</text>
					</view>
					<view style="color: #1F64FF;font-size: 26upx;">(每张图消耗50w算力)</view>
				</view>
				<view class="link_l" v-if="!sd_msgLoad && chat_type == 9 ">
					<view style="display: flex;align-items: center;text-align: center;">
						<view class="l_chat" style="margin-right: 15rpx;" @click="addDraw3">
							<u-icon name="plus" color="#1F64FF" size="14"></u-icon>
							<text class="l_text">新绘画</text>
						</view>
						<text class="l_wait" v-if="chat_type == 9">排队中：{{ sd_wait }}人</text>
					</view>
					<view style="color: #1F64FF;font-size: 26upx;">(每张图消耗5w算力)</view>
				</view>
				<!-- <view class="l_chat" @click="toHistory">
						<u-icon name="clock" color="#1F64FF" size="16"></u-icon>
						<text class="l_text">历史会话</text>
					</view> -->
				<!-- </view> -->
				<!-- <view class="link_l">
					<text class="l_text" v-if="chat_type == 9">(每张图消耗5算力)</text>
					<text class="l_text" v-if="chat_type == 3">(每张图消耗35算力)</text>
					<text class="l_text" v-if="chat_type == 6">(每张图消耗50算力)</text>
				</view> -->
			</view>
			<view class="bottom-dh-char" style="font-size: 55rpx;">

				<view class="bottom_cont">
					<!-- <input v-model="msg" class="dh-input" type="text" @confirm="msgLoad == false ? sendMsg() : sendMsg2()"
						confirm-type="search" placeholder-class="my-neirong-sm" @focus="focusTexts" @blur="getValue"
						:adjust-position="false" placeholder="在此输入你想了解的内容" />
				
					<image class="dh_img" src="@/static/images/send.png" @click="msgLoad == false ? sendMsg() : sendMsg2()" /> -->

					<u-row align='bottom' gutter="5" v-if="chat_type == 2">
						<u-col span="9.5">
							<u-textarea v-model="msg" placeholder="请在此输入绘画描述，我帮你生成"
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
							<u-textarea v-model="msg" placeholder="请在此输入绘画描述，我帮你生成"
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

					<u-row align='bottom' gutter="5" v-if="chat_type == 9">
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

					<u-row align='bottom' gutter="5" v-if="chat_type == 6">
						<u-col span="9.5">
							<u-textarea v-model="msg" placeholder="请在此输入绘画描述，我帮你生成"
								@confirm="mj_msgLoad == false ? sendMsg() : sendMsg2()" autoHeight
								:showConfirmBar='false' :adjustPosition='false' @focus="focusTexts" @blur="getValue"
								maxlength='-1' :disableDefaultPadding='true' @keyboardheightchange='keyboardheight'
								:focus="false">

							</u-textarea> </u-col>
						<u-col span="2.5" align="bottom">
							<u-button type="primary" color="#1F64FF"
								@click="mj_msgLoad == false ? sendMsg() : sendMsg2()">发送</u-button>
						</u-col>
					</u-row>

					<u-row align='bottom' gutter="5" v-if="chat_type == 15">
						<u-col span="9.5">
							<u-textarea v-model="msg" placeholder="请在此输入绘画描述，我帮你生成"
								@confirm="e_msgLoad == false ? sendMsg() : sendMsg2()" autoHeight
								:showConfirmBar='false' :adjustPosition='false' @focus="focusTexts" @blur="getValue"
								maxlength='-1' :disableDefaultPadding='true' @keyboardheightchange='keyboardheight'
								:focus="false">
							</u-textarea>
						</u-col>
						<u-col span="2.5" align="bottom">
							<u-button type="primary" color="#1F64FF"
								@click="e_msgLoad == false ? sendMsg() : sendMsg2()">发送</u-button>
						</u-col>
					</u-row>
				</view>

			</view>


		</view>

		<!-- 采样器选择 -->
		<u-picker :show="samplerShow" :columns="samplerList" v-model="samplerValue" keyName="label"
			@cancel="samplerShow = false" @confirm="samplerSubmit"></u-picker>

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
		getImgDetail
	} from "@/apis/user.js"
	// import Title from "@/childPage/components/title.vue"
	export default {
		// components: {
		// 	Title
		// },
		data() {
			return {
				list: [{
						name: 'DALL·E3'
					},
					{
						name: 'Stable Diffusion'
					},
					{
						name: 'Midjourney'
					},
					{
						name: 'DALL·E2'
					}
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
				dell_desc: '',
				msgLoad: false,
				chatList: [],
				isDell: true,

				bd_timer: 0,
				bd_t_time: 0,
				draw_time: 0,
				bd_desc: '',
				bd_msgLoad: false,
				baiduList: [],
				isBd: true,

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

				e_timer: 0,
				e_t_time: 0,
				e_desc: '',
				e_msgLoad: false,
				dellList: [],
				isE: true,
				eTypeList: [{
						name: "生动",
						pic_url: "xcx/com/message_center/card-image%204.png",
						value: 'vivid',
					},
					{
						name: "自然",
						pic_url: "xcx/com/message_center/card-image%205.png",
						value: 'natural',
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
				chat_type: 15,
				chatType: 'DALL·E3',
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
				sizeList: [{
					id: '1024x1024',
					size: '1024x1024',
					type: 'zheng'
				}, {
					id: '1024x1792',
					size: '1024x1792',
					type: 'gao'
				}, {
					id: '1792x1024',
					size: '1792x1024',
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

				show: false,
				isBtn: false,
				topHeight: 0,


				askShow: true,
				billList: '',

				sdImg: global.baseImg + '/xcx/ca67317a-cbc1-4890-a3ce-c1b472785b0a.jpg',
				bdImg: global.baseImg + '/xcx/15087c8c-2bf9-47dd-9180-c808e9581b9d.jpg',
				mjImg: global.baseImg + '/xcx/8ab69c49-a00f-4b2b-8a92-b1424b61329b.jpg',
				dellImg: global.baseImg + '/xcx/ea8ddcf6-06aa-4938-96f6-3dac84dd21e6.jpg',
				waitImg: global.baseImg + '/xcx/c4a8054e-50bd-4790-a3cb-ec585412daa7.jpg',

				tabList: [{
						name: 'AI对话'
					},
					{
						name: 'AI绘画'
					},
				],
				tabIndex: 1
			}
		},

		onShow() {
			// this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			this.isuser = true; // 清空所有登录或升级会员提示
			this.msg = '';
			this.isPosition = false,
				this.keyHeight = 0
			this.tabIndex = 1
			// console.log(this.keyHeight,78888)
			// uni.showTabBar({
			// 	// animation: true
			// })

			uni.setStorageSync('session_code2', '');
			uni.setStorageSync('chat_group_code2', '');
			uni.setStorageSync('session_code3', '');
			uni.setStorageSync('chat_group_code3', '');
			uni.setStorageSync('session_code6', '');
			uni.setStorageSync('chat_group_code6', '');
			uni.setStorageSync('session_code9', '');
			uni.setStorageSync('chat_group_code9', '');

			let index = uni.getStorageSync('labActive')
			// console.log(index,333)
			if (index == 9) {
				this.active = 1
				this.chat_type = 9
				this.chatType = 'Stable DiffusionList'
				this.msg = uni.getStorageSync('drawInfo')
				this.getSdQuery()
				this.getSdModel() //获取sd模型
			} else if (index == 6) {
				this.active = 2
				this.chat_type = 6
				this.chatType = 'Midjourney'
				this.msg = uni.getStorageSync('drawInfo')
				this.getQuery()
				this.modelList = this.mjTypeList
				this.modelValue = this.mjTypeList[0].name;
				this.modelIndex = this.mjTypeList[0].value
				this.sd_type = 1

			} else if (index == 15 || index == '') {
				this.active = 0
				this.chat_type = 15
				this.chatType = 'DALL·E3'
				this.msg = uni.getStorageSync('drawInfo')
				this.modelList = this.eTypeList
				this.modelValue = this.eTypeList[0].name;
				this.modelIndex = this.eTypeList[0].value
				this.sd_type = 1

			}

			// 获取相机信息
			if (uni.getStorageSync('cameraInfo') != '') {
				this.chat_type = 9
				this.active = 1
				let sendInfo = uni.getStorageSync('cameraInfo')
				this.msg = sendInfo.chatValue
				this.imgList = sendInfo.imgList
				// console.log(sendInfo,415866666)
				this.sd_type = 2
				this.sd_photo_type = 1
				uni.setStorageSync('cameraInfo', '')

			}

			if (this.chat_type == 2) {
				if (this.chatList.length == 0) {
					this.askShow = true
				} else {
					this.askShow = false
				}
			} else if (this.chat_type == 3) {
				if (this.baiduList.length == 0) {
					this.askShow = true
				} else {
					this.askShow = false
				}
				this.size = '1024*1024';
			} else if (this.chat_type == 6) {
				if (this.MidjourneyList.length == 0) {
					this.askShow = true
				} else {
					this.askShow = false
				}
				this.size = '1:1';
			} else if (this.chat_type == 9) {
				if (this.StableDiffusionList.length == 0) {
					this.askShow = true
				} else {
					this.askShow = false
				}
				this.size = '512*512';
			} else if (this.chat_type == 15) {
				if (this.dellList.length == 0) {
					this.askShow = true
				} else {
					this.askShow = false
				}
				this.size = '1024x1024';
			}

			if (uni.getStorageSync('history_code') != '') {
				this.historySession(uni.getStorageSync('history_code'))
				this.askShow = false;
			}

			this.getDrawRecommend() // 获取问题集

			this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			let avatarUrl = global.baseImg + '/' + uni.getStorageSync("avatarUrl");
			this.avatar = avatarUrl;

			let that = this;
			const head_cont = uni.createSelectorQuery().select(".head_cont")
			that.$nextTick(() => {
				head_cont.boundingClientRect(function(
					res) { //定位到你要的class的位置

					// console.log(res.height,410)
					// that.topHeight = parseInt(res.height) + 20;
					that.topHeight = parseInt(res.height);
					that.msgListHeight = that.screenHeight - res.height;
					// 获取公告
					// if(uni.getStorageSync('noticeInfo') != '') {
					// 	that.noticeList = uni.getStorageSync('noticeInfo')
					// 	that.topHeight = that.topHeight + 40;
					// }
				}).exec()
			})


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
						this.billList = res.data[0];
						// console.log(this.billList,778)
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
				// console.log(data,741)

				if (data.type == 2) {
					this.active = 3;
					this.chat_type = 2
					this.chatList = [];
				} else if (data.type == 6) {
					this.active = 2;
					this.chat_type = 6
					this.MidjourneyList = [];
				} else if (data.type == 9) {
					this.active = 1;
					this.chat_type = 9
					this.StableDiffusionList = [];
				} else if (data.type == 15) {
					this.active = 0;
					this.chat_type = 15
					this.dellList = [];
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
									if (item.chat_type == 9) {
										if (item.images.length > 0) {
											this.sd_type = 2
											this.sd_photo_type = 2
											this.imgList = item.images

										} else {
											this.sd_type = 1
											this.sd_photo_type = 2
										}

									} else {
										this.sd_type = 1
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

									if (this.chat_type == 2) {
										this.chatList = [];
										this.chatList.push(data);
									}

									if (this.chat_type == 3) {
										this.baiduList = [];
										this.baiduList.push(data);
										this.query_type = 2;
									}

									if (this.chat_type == 6) {
										this.MidjourneyList = [];
										this.MidjourneyList.push(data);
										this.modelList = this.mjTypeList
										this.modelValue = this.mjTypeList[0].name;
										this.modelIndex = this.mjTypeList[0].value
									}

									if (this.chat_type == 9) {
										this.StableDiffusionList = []
										this.StableDiffusionList.push(data);
									}

								}
								// console.log(this.StableDiffusionList,3332)

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
									// if(data.type == 13) {
									//  this.modelList = this.wxTypeList
									// } else {
									//  this.modelList = this.hsTypeList
									// }
									this.modelList = this.eTypeList
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

									this.dellList = [];
									this.dellList.push(data);
									this.modelList = this.eTypeList
									this.modelValue = this.eTypeList[0].name;
									this.modelIndex = this.eTypeList[0].value
									this.query_type = 1;

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
				if (val.name == 'DALL·E2') {
					this.active = 3
					this.chat_type = 2
					this.chatType = 'DALL·E2'
					if (this.chatList.length == 0) {
						this.askShow = true
					} else {
						this.askShow = false
					}
					if (this.timer > 0) {
						// console.log(this.chatList[this.chatList.length - 1].time,659)
						if (this.chatList[this.chatList.length - 1].time == undefined) {
							this.msgLoad = true
						} else {
							this.msgLoad = false
						}

					} else {
						this.msgLoad = false
					}

					this.size = '256x256';
					this.sizeIndex = 0;
					this.query_type = 2;

				} else if (val.name == 'Midjourney') {
					this.active = 2
					this.chat_type = 6
					this.chatType = 'Midjourney'
					this.getQuery()
					this.size = '1:1';
					this.sizeIndex = 0;
					this.query_type = 1;
					this.modelList = this.mjTypeList;
					this.modelValue = this.mjTypeList[0].name;
					this.modelIndex = this.mjTypeList[0].value;
					this.sd_type = 1
					// console.log(this.MidjourneyList.length,1025)
					if (this.MidjourneyList.length == 0) {
						this.askShow = true
					} else {
						this.askShow = false
					}
					// console.log(this.mj_timer,9995)
					if (this.mj_timer > 0) {
						if (this.MidjourneyList[this.MidjourneyList.length - 1].time == undefined) {
							this.mj_msgLoad = true
						} else {
							this.mj_msgLoad = false
						}

					} else {
						this.mj_msgLoad = false
					}


				} else if (val.name == 'Stable Diffusion') {
					this.active = 1
					this.chat_type = 9
					this.chatType = 'Stable Diffusion'
					this.getSdQuery()
					this.getSdModel()
					this.size = '512*512';
					this.sizeIndex = 0;
					this.query_type = 1;
					this.getSdModel()
					// console.log(this.StableDiffusionList.length,1025)
					if (this.StableDiffusionList.length == 0) {
						this.askShow = true
					} else {
						this.askShow = false
					}
					if (this.sd_timer > 0) {
						if (this.StableDiffusionList[this.StableDiffusionList.length - 1].time == undefined) {
							this.sd_msgLoad = true
						} else {
							this.sd_msgLoad = false
						}

					} else {
						this.sd_msgLoad = false
					}

				} else if (val.name == 'DALL·E3') {
					console.log(8888);
					this.active = 0
					this.chat_type = 15
					this.chatType = 'DALL·E3'
					this.size = '';
					this.sizeIndex = 0;
					this.query_type = 1;
					this.sd_type = 1;
					this.modelList = this.eTypeList;
					this.modelValue = this.eTypeList[0].name;
					this.modelIndex = this.eTypeList[0].value;
					if (this.dellList.length == 0) {
						this.askShow = true
					} else {
						this.askShow = false
					}
					// console.log(this.mj_timer,9995)
					this.size = '1024x1024';
					if (this.e_timer > 0) {
						if (this.dellList[this.dellList.length - 1].time == undefined) {
							this.e_msgLoad = true
						} else {
							this.e_msgLoad = false
						}

					} else {
						this.e_msgLoad = false
					}

				}

			},

			savePhoto(url) {
				uni.showLoading({
					title: '下载中'
				});
				console.log(url, '我是下载URL');
				let that = this;
				uni.downloadFile({
					url: url, //下载地址接口，注意：这里的图片的下载链接可直接在浏览器打开下载的
					success: (data) => {
						if (data.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: data.tempFilePath,
								success: () => {
									//提示保存成功
									console.log('成功了')
									uni.hideLoading();
									setTimeout(function() {
										uni.showToast({
											title: '保存成功',
											duration: 2000
										})
									}, 500);
								},
								fail: (res) => {
									//失败关闭提示信息！！！
									uni.hideLoading();
									setTimeout(function() {
										uni.showToast({
											icon: 'none',
											title: '下载失败',
											duration: 2000
										})
									}, 500);

									console.log("下载失败", res);
								},
								complete: function(res) {
									//隐藏提示
									uni.hideLoading();
									// uni.showToast({
									// 	icon: 'none',
									// 	title: '下载失败',
									// 	duration: 2000
									// })
								}
							})
						}
					},
					fail: (err) => {
						console.log(err, 'err')
						uni.showToast({
							icon: 'none',
							mask: true,
							title: '失败请重新下载',
						});
					},
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
					this.keyHeight = 0;
				}


			},
			getValue() {
				this.isPosition = false;
				this.keyboardHeight = 0;
				this.keyHeight = 0;
				// uni.hideKeyboard();
				// uni.showTabBar({
				// 	// animation: true
				// })
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
						console.log(this.enText, 888)
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
				} else {
					this.submit()
				}


			},

			submit() {
				uni.setStorageSync('drawInfo', '')
				if (this.chat_type == 2) {
					if (!this.isDell) {
						return
					}
					this.isDell = false;
					this.chatList = []
					// 清除消息
					this.msgLoad = true
					this.dallDraw()
				} else if (this.chat_type == 3) {
					if (!this.isBd) {
						return
					}
					this.isBd = false;
					this.baiduList = []
					// 清除消息
					this.bd_msgLoad = true
					this.baiduDraw()
				} else if (this.chat_type == 6) {
					if (!this.isMj) {
						return
					}
					this.isMj = false;
					this.MidjourneyList = []

					// 清除消息
					this.mj_msgLoad = true
					this.mjDraw()
				} else if (this.chat_type == 9) {
					if (!this.isSd) {
						return
					}
					this.isSd = false;
					this.StableDiffusionList = []
					this.sd_photo_type = 2
					// 清除消息
					this.sd_msgLoad = true
					this.sdDraw()
				} else if (this.chat_type == 15) {
					if (!this.isE) {
						return
					}
					this.isE = false;
					this.dellList = []

					// 清除消息
					this.e_msgLoad = true
					this.eDraw()
				}
			},

			// dell3
			eDraw() {
				let data = {
					"chat_type": '15',
					"action_type": 3,
					"prompt": this.msg,
					"size": this.size,
					"n": 1,
					"style": this.modelIndex,
				}
				let that = this;
				that.e_timer = 0;
				that.e_t_time = setInterval(() => {
					that.e_timer += 1;
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
							"time": that.e_timer,
							"is_like": 0,
							"msg_code": res.data.results[0].msg_code,
							"image_code": res.data.image_code
						}

						let img_arr = [];
						img_arr.push(obj);

						// that.StableDiffusionList.push(obj);
						if (that.dellList.length == 0) {
							that.dellList = img_arr;
						}


						// 定位到聊天最底部
						// that.toBottom();
						that.isuser = true;
						that.e_msgLoad = false;
						clearInterval(that.e_t_time);
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
						that.e_msgLoad = false;
						that.isE = true;
						// that.isTime = false;
						clearInterval(that.e_t_time);
						// that.$api.msg(res.msg)
						that.e_desc = res.msg;
						if (res.code == 40022) {
							that.draw_tip = true;
						} else {
							that.draw_tip = false;
						}
					} else {
						that.e_msgLoad = false;
						// that.isTime = false;
						clearInterval(that.e_t_time);
						that.$api.msg(res.msg)
						that.askShow = true
						that.isHs = true;
					}
				}).catch(err => {
					that.e_msgLoad = false;
					// that.isTime = false;
					clearInterval(that.e_t_time);
					that.$api.msg('绘图失败')
					that.askShow = true
					that.isE = true;
				})
			},


			// dall绘画
			dallDraw() {
				let val = {
					"action_type": 3,
					"content": this.msg,
					"n": 1,
					"size": this.size,
					"image": '',
					"mask": '',
					"session_code": '',
				}

				this.isTime = true; // 思考中
				this.timer = 0;
				this.t_time = setInterval(() => {
					this.timer += 1;
				}, 1000)
				this.msg = ''; // 清空发送栏内容
				this.query_type = 2;
				creatDraw(val).then(res => {

					if (res.code == 20000) {
						// this.msgLoad = false;
						this.isuser = true;
						let img_urls = [];
						let url_val = {
							url: global.baseImg + '/' + res.data.image_urls[0].sso_url
						}
						img_urls.push(url_val);
						let obj = {
							"create_time": res.data.create_time,
							"finish_reason": "stop",
							"session_code": res.data.session_code,
							"chat_group_code": res.data.chat_group_code,
							"size": res.data.size,
							"role": "assistant",
							"image_urls": img_urls,
							"time": this.timer,
							"is_like": 0
						}

						let img_arr = [];
						img_arr.push(obj);
						if (this.chatList.length == 0) {
							this.chatList = img_arr;
						}
						// this.chatList.push(res.data);
						this.msgLoad = false;
						this.isTime = false;
						clearInterval(this.t_time);
						this.isDell = true;

					} else if (res.code < 49999) {
						this.isuser = false;
						this.msgLoad = false;
						this.isTime = false;
						clearInterval(this.t_time);
						this.dell_desc = res.msg;
						if (res.code == 40022) {
							this.draw_tip = true;
						} else {
							this.draw_tip = false;
						}
						this.isDell = true;

					} else {
						this.msgLoad = false;
						this.isTime = false;
						clearInterval(this.t_time);
						this.$api.msg(res.msg)
						this.isDell = true;
					}
				}).catch(err => {
					this.msgLoad = false;
					this.isTime = false;
					clearInterval(this.t_time);
					this.$api.msg('发送消息失败！')
					this.isDell = true;
				})
			},

			// 百度绘画
			baiduDraw() {
				let data = {
					"action_type": 3,
					"content": this.msg,
					"n": 1,
					"size": this.size,
					"image": '',
					"mask": '',
					"session_code": '',
				}

				this.isTime = true; // 思考中
				this.bd_timer = 0;
				this.bd_t_time = setInterval(() => {
					this.bd_timer += 1;
				}, 1000)
				this.msg = ''; // 清空发送栏内容
				this.query_type = 2;
				baiduDraw(data).then(res => {
					let that = this;
					console.log(res, 489)
					if (res.code == 20000) {
						let datas = {
							"task_id": res.data.task_id,
							"action_type": 3,
						};
						let request_count = 0;
						that.draw_time = setInterval(() => {
							if (request_count < 51) { // 最多轮询50次
								getbBaiduDraw(datas).then(val => {
									// console.log(resposne);
									if (val.code == 20000) {
										request_count += 1;
										if (val.data != null) {
											if (val.data[0].content != '') {
												that.isuser = true;
												let img_urls = [];
												let url_val = {
													url: global.baseImg + '/' + val.data[0]
														.content
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
												let save_val = {
													"type_name": "百度绘画",
													"type_code": "image",
													"title": data.content,
													"eid": val.data[0].session_code,
													"image_url": val.data[0].content
												}

												that.saveFootprint(save_val)
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
					url: '/childPage/laboratory/lab_history?active=1'
				})
			},

			// 开启新会话
			addDraw1() {
				// uni.setStorageSync('session_code3', '');
				// uni.setStorageSync('chat_group_code3', '');
				this.chatList = []
				this.askShow = true
				this.msg = ''
			},

			// 开启新会话
			addDraw4() {
				this.dellList = []
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
			toAsk(val) {
				this.msg = val;
				console.log(this.chat_type, 995)
				// if(this.chat_type == 6 || this.chat_type == 9) {
				// 	this.getEnText()
				// 	if(this.sd_complete != '') {
				// 		this.getHideText()
				// 	}
				// }
				// this.askShow = false;
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
					uni.setStorageSync('active', 2)
				} else if (this.chat_type == 6) {
					url = this.MidjourneyList[index].image_urls;
					uni.setStorageSync('active', 1)
				} else if (this.chat_type == 9) {
					url = this.StableDiffusionList[index].image_urls;
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
				uni.setStorageSync('active', this.active)
				uni.navigateTo({
					url: '/pages/chat/camera?chatValue=' + this.msg + '&source=2'
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
			},

			selctSize(size, index) {
				this.size = size;
				this.sizeIndex = index
			},

			// 点赞点踩
			likeType(val, index) {
				let data = {
					is_likes: val
				}
				if (index == 2) {
					data.session_code = this.chatList[0].session_code
					data.chat_group_code = this.chatList[0].chat_group_code
					this.chatList[0].is_like = val
				} else if (index == 3) {
					data.session_code = this.baiduList[0].session_code
					data.chat_group_code = this.baiduList[0].chat_group_code
					this.baiduList[0].is_like = val
				} else if (index == 6) {
					data.session_code = this.MidjourneyList[0].session_code
					data.chat_group_code = this.MidjourneyList[0].chat_group_code
					this.MidjourneyList[0].is_like = val
				} else if (index == 9) {
					data.session_code = this.StableDiffusionList[0].session_code
					data.chat_group_code = this.StableDiffusionList[0].chat_group_code
					this.StableDiffusionList[0].is_like = val
				} else if (index == 15) {
					data.msg_code = this.dellList[0].msg_code
					this.dellList[0].is_like = val
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
			}
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
		width: 100%;
		// width: calc(100% - 32upx);
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
			height: 155upx;
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
			width: 100%;

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