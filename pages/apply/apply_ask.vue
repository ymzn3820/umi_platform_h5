<template>
	<view class="containar">
		
		 <u-navbar
			leftText="返回"
			title='助理中心'
			:placeholder="true"
			@leftClick="backIndex"
		>  </u-navbar>
		<view class="apply_cont">
			<view class="cont_title">{{ content.title }}</view>
			<view class="cont_text">
				<text class="text_li">{{ content.content }}</text>
			</view>
		</view>
		
		<view class="send">
			<view class="chat_type">
				<view class="type_text">引擎：</view>
				<view class="type_r">
					<view @click="version(8)" :class="[active == 8 ? 'active_tabs' : 'tabs']" style="position: relative">
						ChatGLM
						<u-badge type="error" value="免费" shape="horn" absolute :offset="[-10,-10]"></u-badge>
					</view>
					<view @click="version(4)" :class="[active == 4 ? 'active_tabs' : 'tabs']">文心一言</view>
					<view @click="version(5)" :class="[active == 5 ? 'active_tabs' : 'tabs']">讯飞星火</view>
					<view @click="version(10)" :class="[active == 10 ? 'active_tabs' : 'tabs']">通义千问</view>
					<view @click="version(11)" :class="[active == 11 ? 'active_tabs' : 'tabs']">商汤日日新</view>
				</view>
				
			</view>
			<view class="chat_qs">
				<view v-for="(item, index) in questionList" :key="index">
					<view class="chat_text" v-if="item.info_type_name == 'Input'">
						<view class="text_cont">
							<text class="text_l" v-if="item.is_required == 1">*</text>
							<text class="text_r">{{ item.title }}</text>
						</view>
						<u--input :placeholder="item.placeholder" border="surround" v-model="item.modelValue"></u--input>
					</view>
					
					<!-- <view class="chat_text" v-if="item.info_type_name == 'Switch'">
						<view class="text_cont">
							<text class="text_l" v-if="item.is_required == 1">*</text>
							<text class="text_r">{{ item.title }}</text>
							<view style="margin-left: 20upx;"><u-switch v-model="item.modelState" size="20"></u-switch></view>
						</view>
					</view> -->
					
					<view class="chat_text" v-if="item.info_type_name == 'CheckBox'">
						<view class="text_cont">
							<text class="text_l" v-if="item.is_required == 1">*</text>
							<text class="text_r">{{ item.title }}</text>
						</view>
						
						<u-checkbox-group v-model="item.modelValue" @change="checkboxChange" placement="row">
							<view style="display: flex; flex-wrap: wrap; width: 100%">
								<u-checkbox activeColor="#1F64FF" :label="opt.value" :name="opt.value" :checked="item.modelValue.includes(opt.value) ?  true : false "
								:customStyle="{marginBottom: '10px',marginRight: '10px',width: '30%'}"  v-for="(opt, index2) in item.options"  :key="index2">
								</u-checkbox>
							</view>
						</u-checkbox-group>
					</view>
					
					<view class="chat_text" v-if="item.info_type_name == 'Tag'">
						<view class="text_cont" style="width: 100%;">
							<text class="text_l" v-if="item.is_required == 1">*</text>
							<text class="text_r">{{ item.title }}</text>
						</view>
						<view style="display: flex; flex-wrap: wrap; align-items: center;"  >
							<view class="u-page__tag-item" v-for="(tip, index1) in item.tagList" :key="index1">
								<u-tag :text="tip" size="mini" plain closable @close="delTag(index1)"></u-tag>
							</view>
							<view class="u-page__tag-item" style="margin-top: 10px;">
								<u-tag text="添加" size="mini" @click="addTag(index)"></u-tag>
							</view>
						</view>
					</view>
					
					
					<view class="chat_text" v-if="item.info_type_name == 'Select'">
						<view class="text_cont" style="width: 100%;">
							<text class="text_l" v-if="item.is_required == 1">*</text>
							<text class="text_r">{{ item.title }}</text>
						</view>
						<view class="lists" @click="openDialog(index)">
							<view class="txt" v-if="item.modelValue != ''">{{ item.modelValue }}</view>
							<view class="txt" v-else>{{ item.placeholder }}</view>
							<image class="lists_img right_img" src='@/static/images/right.png' />
						</view>
					</view>
					
					<view class="chat_text" v-if="item.info_type_name == 'Textarea'">
						<view class="text_cont">
							<text class="text_l" v-if="item.is_required == 1">*</text>
							<text class="text_r">{{ item.title }}</text>
						</view>
						<u-textarea v-model="item.modelValue" :placeholder="item.placeholder" maxlength="-1" ></u-textarea>
					</view>
					<u-picker :show="item.modelShow" v-model="item.modelValue" :columns="item.optionArr" keyName="option_value" @cancel="closePick(index)" @confirm="pickSelect" v-if="item.info_type_name == 'Select'"></u-picker>
				</view>
				
			</view>
			
			<view class="chat_btn" @click="sendMessage">AI一下</view>
		</view>
		
		<view style="margin-bottom: 400upx;">
			<view class="asw_cont" v-if="isPosition">
				<view class="asw_title">
					<text class="title_text"></text>
					<text class="title_text">AI分析结果</text>
					<!-- <text class="title_right" @click="shareQs">分享到问答广场</text> -->
					<text class="title_right" v-if="isShare" @click="shareQs">分享到问答广场</text>
					<text class="title_text" v-if="!isShare"></text>
				</view>
				<view v-for="(item,index) in messageList[listName]" :key="index" style="width: 100%;">
					<view class="asw_text" id="chat_cont">
						
						<view v-if="item.type=='assistant'">
							<view class="loadingTalk" v-if="item.talk.indexOf('思考中')!=-1">
								<view class="flexs">
									<image :src="waitImg" mode="" class="loadingImages">
									</image>
									<text style="vertical-align: top; word-break:break-all;" v-text="item.talk"></text>
								</view>
								<u-col span="5" v-if="index===messageList[listName].length-1">
									<u-button type='primary'
										:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","font-size":"14px"}'
										size="mini" color="rgba(31, 100, 255, 0.1)" @click="stopStart">
										停止回答
									</u-button>
								</u-col>
							</view>
							
							<view class="tips" v-else-if="item.code==40022">
								<text style="font-size:17px; word-break:break-all;">{{item.talk}}</text>
								<view style="display: flex; justify-content: space-around;">
									<u-button type="error" color="#FF9B17"
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
								<!-- <view class="tips" style="font-size:17px;width: 100%; word-break:break-all;">
								    {{item.talk}}
								</view> -->
								<!-- <text class="tips" style="font-size:17px;width: 100%; word-break:break-all;" v-if="!item.loading">{{item.talk}}</text> -->
								<ua-markdown :source="item.talk" :showLine="false"/>
								<view class='edit'>
									<u-row>
										<u-col span="6">
											字数:{{item.textNumber}}
										</u-col>
										<u-col span="6" v-if="item.loading">
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
										<u-col span="12">
											当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉，已通过阿里云内容安全审核
										</u-col>
									</u-row>
									
									
									<u-row class='edit'>
										<u-col span="7.5" v-if="item.history"></u-col>
										<u-col span="1" v-if="!item.history">
											<view>
												<image v-if="item.loading" src="../../static/images/time.png" mode="" class="opaImg"  style="vertical-align: top;"></image>
												<image v-else :src="waitImg" mode="" width="16px" height="16px"
													class="loadingImages">
												</image>
											</view>
										
										</u-col>
										<u-col span="6.5" v-if="!item.history">
											<view>
												<text v-if="item.loading"> 耗时：{{item.time}}秒</text>
												<text v-else> 思考中:{{item.time}}秒</text>
											</view>
										
										</u-col>
										
										<u-col span="1.5" @click="evaluate2(1,index)" v-if="listName == 'three'" >
											<image :src="require(`../../static/images/Icon(${evaluateType2[index]}).png`) " mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate2(2,index)" v-if="listName == 'three'">
											<image :src="require(`../../static/images/like(${evaluateType2[index]}).png`) " mode="" class="opaImg">
											</image>
										</u-col>
										
										<u-col span="1.5" @click="evaluate3(1,index)" v-if="listName == 'four'">
											<image :src="require(`../../static/images/Icon(${evaluateType3[index]}).png`) " mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate3(2,index)" v-if="listName == 'four'">
											<image :src="require(`../../static/images/like(${evaluateType3[index]}).png`) " mode="" class="opaImg">
											</image>
										</u-col>
										
										<u-col span="1.5" @click="evaluate5(1,index)" v-if="listName == 'six'">
											<image :src="require(`../../static/images/Icon(${evaluateType5[index]}).png`) " mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate5(2,index)" v-if="listName == 'six'">
											<image :src="require(`../../static/images/like(${evaluateType5[index]}).png`) " mode="" class="opaImg">
											</image>
										</u-col>
										
										<u-col span="1.5" @click="evaluate6(1,index)" v-if="listName == 'seven'">
											<image :src="require(`../../static/images/Icon(${evaluateType6[index]}).png`) " mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate6(2,index)" v-if="listName == 'seven'">
											<image :src="require(`../../static/images/like(${evaluateType6[index]}).png`) " mode="" class="opaImg">
											</image>
										</u-col>
										
										<u-col span="1.5" @click="evaluate7(1,index)" v-if="listName == 'eight'">
											<image :src="require(`../../static/images/Icon(${evaluateType7[index]}).png`) " mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate7(2,index)" v-if="listName == 'eight'">
											<image :src="require(`../../static/images/like(${evaluateType7[index]}).png`) " mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="1" @click="copyFun(item.talk)">
											<image src="../../static/images/balckCopy.png" mode="" class="opaImg"></image>
										</u-col>
									</u-row>
								</view>
								<u-row gutter="20">
									
									<u-col span="6" v-if="index===messageList[listName].length-1 && item.loading">
										<u-button type='primary'
											:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","font-size":"14px"}'
											size="mini" color="rgba(31, 100, 255, 0.1)" @click="show=true">
											优化本次回答
										</u-button>
									</u-col>
									
									<u-col span="5" v-if="index===messageList[listName].length-1 && !item.history && !item.loading">
										<u-button type='primary'
											:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","font-size":"14px"}'
											size="mini" color="rgba(31, 100, 255, 0.1)" @click="stopChat">
											停止回答
										</u-button>
									</u-col>
									
									<!-- <u-col span="3" v-if="index===messageList[listName].length-1 && !item.history && item.loading">
										<u-button type='primary'
											:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","font-size":"14px"}'
											size="mini" color="rgba(31, 100, 255, 0.1)" @click="againQs(messageList[listName][messageList[listName].length - 2].talk)">
											重试
										</u-button>
									</u-col> -->
								</u-row>
								
							</view>
							
						</view>
						
					</view>
					
				</view>
				
			</view>
			
			<!-- 问题集 -->
			<view class="qs_cont">
				<view class="cont_top">
					<!-- <image src="@/static/images/hot.png" mode="" class="hot_img"></image> -->
					<text class="top_mid">问答广场</text>
					<text class="top_right">其他人都在问什么?</text>
				</view>
				<view class="cont_right" @click="getSquareList">
					<text class="right_text">换一批</text>
					<image src="@/static/images/change.png" mode="" class="hot_img"></image>
				</view>
			</view>
			<view class="qs">
				
				<view class="loading" v-if='loading'>
					<text class="load_text">正在获取场景内容</text>
					<image :src="waitImg" mode="" class="load_img">
					</image>
				</view>
				
				<view class="hotWrods">
					<view v-if="squareList.length > 0">
						<view @click="eidtContent(item.session_code)" class="box" v-for='(item,index) in squareList' :key='index'>
							
							<view class="text">
								<view class="textInfo">
									{{item.session_data[0].content}}
								</view>
							</view>
							<view class="text_cont">
								<text class="text_li">{{ item.session_data[1].content }}</text>
							</view>
						</view>
					</view>
					
					<view class="on_order_list" v-if="squareList.length == 0">
						暂无相关推荐
					</view>
				</view>
			</view>
			
			<view class="code">
				<view class="code_img" v-if="content.contact_qr_code != ''">
					<image :src="content.contact_qr_code" show-menu-by-longpress="true" @click="checkImg(content.contact_qr_code)"  class="img_cont"></image>
					<text class="img_tip">{{ content.contact_qr_code_desc }}</text>
				</view>
				<view class="code_img" v-if="content.interest_group_code != ''">
					<image :src="content.interest_group_code" show-menu-by-longpress="true" @click="checkImg(content.interest_group_code)"  class="img_cont"></image>
					<text class="img_tip">{{ content.interest_group_code_desc }}</text>
				</view>
			</view>
			
			<u-modal :show="show" @cancel="show = false" confirmText="确定" confirmColor="#1F64FF"
				:showCancelButton='true' @confirm="showFun">
				<view class="modal">
					<view class="edit">
			
						<view class="changes"></view> 优化本次回答
					</view>
					<view class="content">
						<u--textarea v-model="complete" placeholder="在此输入你想优化的内容" border="none" height='110px'></u--textarea>
						<!-- {{content.prompts_name}} -->
					</view>
				</view>
			</u-modal>
			
			<!-- 添加标签 -->
			<u-modal :show="tagShow" @cancel="closeTag" confirmText="添加" confirmColor="#1F64FF;" :showCancelButton='true'
				@confirm="confirmTag">
				<view class="key_cont" style="">
					<view class="title">添加标签</view>
					<u-input :customStyle='{"padding":"8px", "width":"100%"}' inputAlign="center" v-model="tagName"
						placeholder="请输入标签" type="text" ></u-input>
				</view>
			</u-modal>
		</view>
		
	</view>
</template>
<script>
	import {
		creatChat,
		chat_likes,
		chat_session,
	    xfChat,
		getSquare, shareChat,squareDetail,getConfig
	} from "@/apis/chat.js"
	import { getQuestion, saveFootprint, applyChat } from '@/apis/user.js'
	import * as TextEncoding from 'text-encoding-shim';
	import uaMarkdown from '../../components/ua2-markdown/ua-markdown.vue'
	export default {
		data() {
			return {
				content: '',
				active: 8,
				chatInputValue: '',
				inputValue: '',
				checkBox: [],
				tagValue: true,
				tagShow: false,
				tagList: ['标签一','标签二'],
				tagName: '',
				pickShow: false,
				pickValue: '',
				
				placeValue: '我是领先的AI35大语言AI模型，现在为您服务！',
				isPosition: false,
				
				chatType: 'ChatGLM',
				session_code: "",
				chat_group_code: "",
				supplement: {
					msg_list: []
				},
				
				listName: 'six',
				 
				//文心一言
				controller_three: null, // 用于终止会话
				t_time_three: null, // 计时器
				three_shi: null,
				evaluateType2: [],
				
				//讯飞星火
				controller_four: null, // 用于终止会话
				t_time_four: null, // 计时器
				four_shi: null,
				evaluateType3: [],
				
				keyHeight: 0,
				module_id: 0,
				question_id: 0,
				
				//ChatGLM
				controller_five: null, // 用于终止会话
				t_time_five: null, // 计时器
				five_shi: null,
				evaluateType5: [],
				
				//通义千问
				controller_seven: null, // 用于终止会话
				t_time_seven: null, // 计时器
				seven_shi: null,
				evaluateType6: [],
				
				//商汤日日新
				controller_eight: null, // 用于终止会话
				t_time_eight: null, // 计时器
				eight_shi: null,
				evaluateType7: [],
				
				messageList: {
					'three': [],
					'four': [],
					'five': [],
					'six': [],
					'seven': [],
					'eight': []
				},
				
				sessionList: {
					'three': [],
					'four': [],
					'five': [],
					'six': [],
					'seven': [],
					'eight': []
				},
				
				question_data: [],
				qsData: '',
				
				keyHeight: 0,
				show: false,
				complete: '',
				loading: false,
				questionList: [],
				squareList: [],
				tagIndex: 0,
				selectIndex: 0,
				checkList: [],
				isShare: true,
				isClick: true,
				waitImg: global.baseImg+'/xcx/c4a8054e-50bd-4790-a3cb-ec585412daa7.jpg',
				
			};
		},
		components: {
			uaMarkdown
		},
		onLoad(option) {
			// console.log(option,4125)
			if(option) {
				
				if(option.parent_user_code) {
					this.module_id = option.module_id
					this.question_id = option.question_id
					this.promptsFun()
				} else {
					this.content = JSON.parse(option.item);
					if(this.content.title.indexOf('AI') == -1) {
						this.content.title = 'AI ' + this.content.title
					}
					this.module_id = this.content.module_id
					this.question_id = this.content.question_id
				}
				
			}
		},
			
		onShow() {
			
			this.getConfig()
			this.getSquareList()
			
		},
		
		onHide() {
		   document.getElementById('chat-meta-keywords').remove()
		   document.getElementById('chat-meta-description').remove()
		},
		methods: {
			
			// 获取自定义问题集
			getConfig() {
				// const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let val = {
					'question_id': this.question_id
					// 'question_id': '429041824077766'
				}
			
				getConfig(val).then(res => {
					if (res.code == 20000) {
						// console.log(res,74)
						this.questionList = res.data;
						this.questionList.forEach((val)=>{
							val.modelValue = '';
							val.modelState = false;
							val.modelShow = false;
							val.optionArr = [],
							val.optionArr.push(val.options),
							val.tagList = []
							// if(val.info_type_name == 'CheckBox') {
							// 	this.checkList = val.options
							// }
						})
						this.$forceUpdate()
						// console.log(this.questionList,663)
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
			
			// 获取问题广场问题
			getSquareList() {
				let vals = {
					'question_id': this.question_id,
					'module_id': this.module_id
				}
				this.loading = true;
				getSquare(vals).then(res => {
					if (res.code == 20000) {
						this.squareList = res.data;
						if(this.squareList == null) {
							this.squareList = []
						}
						this.loading = false;
						// console.log(this.squareList,878)
					} else {
						this.loading = true;
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.loading = true;
					this.$api.msg('获取失败');
				})
				
			},

			promptsFun() {
				let data = {
					'module_id': this.module_id,
					'question_id': this.question_id
				}
				
				getQuestion(data).then(res => {
						
					if(res.code == 20000) {
						this.content = res.data[0];
						if(this.content.title.indexOf('AI') == -1) {
							this.content.title = 'AI ' + this.content.title
						}
						
						document.title = this.content.title
						let metaKeywords = document.createElement('meta')
						metaKeywords.id = 'chat-meta-keywords'
						metaKeywords.name = 'keywords'
						metaKeywords.content = this.content.title
						document.getElementsByTagName('head')[0].appendChild(metaKeywords)
								
						let metaDescription = document.createElement('meta')
						metaDescription.id = 'chat-meta-description'
						metaDescription.name = 'description'
						metaDescription.content = this.content.content
						document.getElementsByTagName('head')[0].appendChild(metaDescription)
						this.$forceUpdate()
					} else {
						this.$api.msg(res.msg)
					}
					
				}).catch(err => {
					// this.$api.msg('');
				})
			},
			
			sendMessage(message) {
				if(!this.isClick) { return }
				this.isClick = false
				if(this.messageList[this.listName].length > 0) {
					let send_talk = this.messageList[this.listName][this.messageList[this.listName].length - 1].talk;
					let send_loading = this.messageList[this.listName][this.messageList[this.listName].length - 1].loading;
					let send_time = this.messageList[this.listName][this.messageList[this.listName].length - 1].time;
					let history = this.messageList[this.listName][this.messageList[this.listName].length - 1].history;
					
					// console.log(this.messageList[this.listName][this.messageList[this.listName].length - 1], 8871);
					if (send_talk.indexOf('思考中') != -1) {
								
						this.$api.msg('当前问题还没回答完毕，请稍后再提问！')
						return
					}
								
					if (send_loading == false) {	
						this.$api.msg('当前问题还没回答完毕，请稍后再提问！')
						return
					}
					
				}
				
				this.chatInputValue = this.content.content;
				let flag = true;
				this.question_data = [];
				this.isShare = true;
				this.questionList.forEach((val, index)=>{
					if(flag) {
						if(val.info_type_name == 'Input') {
							if(val.is_required == 1 && val.modelValue == '') {
								let text = '请输入'+ val.title;
								this.$api.msg(text)
								flag = false
							} else {
								let content = val.title + ':' + val.modelValue+';'
								this.chatInputValue +=content
								this.question_data.push({
									'info_type_name': 'Input',
									'title': val.title,
									'content':  val.modelValue,
									'is_required': val.is_required
								})
								flag = true
							}
						}
						
						if(val.info_type_name == 'Textarea') {
							if(val.is_required == 1 && val.modelValue == '') {
								let text = '请输入'+ val.title;
								this.$api.msg(text)
								flag = false
							} else {
								let content = val.title + ':' + val.modelValue+';'
								this.chatInputValue +=content
								this.question_data.push({
									'info_type_name': 'Textarea',
									'title': val.title,
									'content':  val.modelValue,
									'is_required': val.is_required
								})
								flag = true
							}
						}
						
						if(val.info_type_name == 'CheckBox') {
							if(val.is_required == 1 && val.modelValue == '') {
								let text = '请选择'+ val.title;
								this.$api.msg(text)
								flag = false
							} else if (val.is_required == 1 && val.modelValue.length == 0){
								let text = '请选择'+ val.title;
								this.$api.msg(text)
								flag = false
							} else if(val.modelValue.length > 0) {
								let str = val.modelValue.toLocaleString(',');
								let content = val.title + ':' + str +';'
								this.chatInputValue +=content
								this.question_data.push({
									'info_type_name': 'CheckBox',
									'title': val.title,
									'content':  val.modelValue,
									'is_required': val.is_required,
									'options': val.options
								})
								flag = true
							}
						}
						
						if(val.info_type_name == 'Select') {
							if(val.is_required == 1 && val.modelValue == '') {
								let text = '请选择'+ val.title;
								this.$api.msg(text)
								flag = false
							} else {
								let content = val.title + ':' + val.modelValue+';'
								this.chatInputValue +=content
								this.question_data.push({
									'info_type_name': 'Select',
									'title': val.title,
									'content':  val.modelValue,
									'is_required': val.is_required,
									'options': val.options,
									'modelShow': false,
									
								})
								flag = true
							}
						}
						
						if(val.info_type_name == 'Tag') {
							if(val.is_required == 1 && val.tagList.length == 0) {
								let text = '请添加'+ val.title;
								this.$api.msg(text)
								flag = false
							} else if(val.tagList.length > 0) {
								let content = val.title + ':' + val.tagList.toLocaleString(',')+';'
								this.chatInputValue +=content
								this.question_data.push({
									'info_type_name': 'Tag',
									'title': val.title,
									'content':  val.tagList,
									'is_required': val.is_required
								})
								flag = true
							}
						}
					}
					
				})
					
				if(flag) {
					// console.log(this.chatInputValue,666)
					this.messageList[this.listName] = [];
					this.sessionList[this.listName] = [];
					this.session_code = '';
					this.chat_group_code = '';
								
					// if(message.length)
					
					this.isPosition = true
					
					this.sessionList[this.listName].push({
						talk: this.chatInputValue,
						type: 'user'
					})
					
					this.sendInfo(this.chatInputValue)
								
					
				}
			
			},
			
			sendInfo(send_val) {
				let val = { 
					'company_id': this.content.question_id,
					'clerk_id': this.content.question_id,
					'question_content': send_val
				}
				applyChat(val).then(res => {
					if(res.code == 20000) {
						this.message_covert = res.data.prompt
						let chat_tip = '';
						if(this.chatType == '文心一言') {
							chat_tip = 4
						} else if(this.chatType == '讯飞星火') {
							chat_tip = 5
						} else if(this.chatType == 'Claude') {
							chat_tip = 7
						} else if(this.chatType == 'ChatGLM') {
							chat_tip = 8
						} else if(this.chatType == '通义千问') {
							chat_tip = 10
						} else if(this.chatType == '商汤日日新') {
							chat_tip = 11
						}
						let data = {
							chat_type: chat_tip,
							action_type: '3',
							session_code: "",
							chat_group_code: "",
							content: send_val,
							msg_list: [{
								role: 'user',
								covert_content: this.message_covert,
								content: send_val
							}]
						}
						data.msg_list = JSON.stringify(data.msg_list)
							
						this.creatChatFun(data, 'first')
						this.chatInputValue = ''
						this.message_covert = ''
					} else {
						this.$api.msg(res.msg)
						this.isClick = true;
					}
					
				})
			},
			
			//信息回调方法
			async creatChatFun(data, state) {
				this.isClick = true;
				if(this.listName == 'three') {
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
					const response_three = await fetch(global.baseUrl+'/api/chat/async_chat_completion', { 
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': 'h5'
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
							if(res.code < 49999) {
								let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
								// console.log(userInfo.role == 'guess' ,'panduan');
																	
								if(res.code == 40013) {
									this.$api.msg('登录信息已过期，请重新登录')
									this.messageList[this.listName].pop()
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login',
										})
									}, 1500)
									
								} else {
									this.userRole = userInfo.role
									this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
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
							} else if(res.code > 49999) {
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
						const { value, done } = await reader.read();
						if(done) {
							this.messageList[tabType][this.messageList[tabType].length - 1].loading = true;
							this.$forceUpdate()
							break;
						}
						if (value) {
				
							let chat = decoder.decode(value);
							// console.log(chat,880);
							let chatArr = chat.split('\r\n');
							
							chatArr.forEach( val => {
								if(val != '') {
									let res = JSON.parse(val);
									
									if(res.code) {
										if(res.code < 49999) {
											let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
											// console.log(userInfo.role == 'guess' ,'panduan');								
											this.userRole = userInfo.role
											this.messageList[this.listName].push({
												talk: res.msg,
												type: 'assistant',
												time: 0,
												code: res.code == 40022 ? res.code : 40021,
												status: "stop",
												textNumber: 0,
												history: false,
												loading: true
											})
											this.$forceUpdate()
											this.toBottom()
											// console.log(this.messageList[this.listName],1258)
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
										if(res.content != '' && res.content != null) {
											info += res.content;
										}
										if(res.session_code != '' && res.content != null) {
											this.session_code = res.session_code;
										}
										
										if(res.chat_group_code != '' && res.chat_group_code != null) {
											// localStorage.setItem('chat_group_code', res.chat_group_code);
											this.chat_group_code = res.chat_group_code
										}
										if(res.finish_reason != '' && res.finish_reason != null) {
											status = res.finish_reason
										}
										
										integral = res.integral
										completion_tokens = res.completion_tokens
										prompt_tokens = res.prompt_tokens
										let load_state = false
										
										if(status == true) {
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
											if(typeof(this.supplement.msg_list)=='string') {
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
														
										//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num_three,
											code: 200,
											is_time: true,
											history: false,
											status,
											textNumber: info.replace(/[\r\n]/g, "").length,
											loading: load_state
										}
										
										if(load_state) { //保存记录
											let save_val = {
												"type_name": "文心一言",
												"type_code": "assistant",
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
				}else if(this.listName == 'four') {
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
					const response_four = await fetch(global.baseUrl+'/api/chat/async_chat_completion', { 
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': 'h5'
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
							if(res.code < 49999) {
								let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
								// console.log(userInfo.role == 'guess' ,'panduan');
								if(res.code == 40013) {
									this.$api.msg('登录信息已过期，请重新登录')
									this.messageList[this.listName].pop()
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login',
										})
									}, 1500)
									
								} else {
									this.userRole = userInfo.role
									this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
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
							} else if(res.code > 49999) {
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
						const { value, done } = await reader.read();
						if(done) {
							this.messageList[tabType][this.messageList[tabType].length - 1].loading = true;
							this.$forceUpdate()
							break;
						}
						if (value) {
				
							let chat = decoder.decode(value);
							// console.log(chat,880);
							let chatArr = chat.split('\r\n');
							
							chatArr.forEach( val => {
								if(val != '') {
									let res = JSON.parse(val);
									
									if(res.code) {
										if(res.code < 49999) {
											let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
											// console.log(userInfo.role == 'guess' ,'panduan');								
											this.userRole = userInfo.role
											this.messageList[this.listName].push({
												talk: res.msg,
												type: 'assistant',
												time: 0,
												code: res.code == 40022 ? res.code : 40021,
												status: "stop",
												textNumber: 0,
												history: false,
												loading: true
											})
											this.$forceUpdate()
											this.toBottom()
											// console.log(this.messageList[this.listName],1258)
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
										if(res.content != '' && res.content != null) {
											info += res.content;
										}
										if(res.session_code != '' && res.content != null) {
											this.session_code = res.session_code;
										}
										
										if(res.chat_group_code != '' && res.chat_group_code != null) {
											// localStorage.setItem('chat_group_code', res.chat_group_code);
											this.chat_group_code = res.chat_group_code
										}
										if(res.finish_reason != '' && res.finish_reason != null) {
											status = res.finish_reason
										}
										
										integral = res.integral
										completion_tokens = res.completion_tokens
										prompt_tokens = res.prompt_tokens
										let load_state = false
										
										if(status == 2) {
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
											if(typeof(this.supplement.msg_list)=='string') {
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
											textNumber: info.replace(/[\r\n]/g, "").length,
											loading: load_state
										}
														
										if(load_state) { //保存记录
											let save_val = {
												"type_name": "讯飞星火",
												"type_code": "assistant",
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
				} else if(this.listName == 'six') {
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
					const response_six = await fetch(global.baseUrl+'/api/chat/async_chat_completion', { 
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': 'h5'
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
							if(res.code < 49999) {
								let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
								// console.log(userInfo.role == 'guess' ,'panduan');
								if(res.code == 40013) {
									this.$api.msg('登录信息已过期，请重新登录')
									this.messageList[this.listName].pop()
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login',
										})
									}, 1500)
									
								} else {
									this.userRole = userInfo.role
									this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
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
							} else if(res.code > 49999) {
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
						const { value, done } = await reader.read();
						if(done) {
							this.messageList[tabType][this.messageList[tabType].length - 1].loading = true;
							this.$forceUpdate()
							break;
						}
						if (value) {
				
							let chat = decoder.decode(value);
							// console.log(chat,880);
							let chatArr = chat.split('\r\n');
							
							chatArr.forEach( val => {
								if(val != '') {
									let res = JSON.parse(val);
									
									if(res.code) {
										if(res.code < 49999) {
											let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
											// console.log(userInfo.role == 'guess' ,'panduan');								
											this.userRole = userInfo.role
											this.messageList[this.listName].push({
												talk: res.msg,
												type: 'assistant',
												time: 0,
												code: res.code == 40022 ? res.code : 40021,
												status: "stop",
												textNumber: 0,
												history: false,
												loading: true
											})
											this.$forceUpdate()
											this.toBottom()
											// console.log(this.messageList[this.listName],1258)
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
										if(res.content != '' && res.content != null) {
											info += res.content;
										}
										if(res.session_code != '' && res.content != null) {
											this.session_code = res.session_code;
										}
										
										if(res.chat_group_code != '' && res.chat_group_code != null) {
											// localStorage.setItem('chat_group_code', res.chat_group_code);
											this.chat_group_code = res.chat_group_code
										}
										if(res.finish_reason != '' && res.finish_reason != null) {
											status = res.finish_reason
										}
										
										integral = res.integral
										completion_tokens = res.completion_tokens
										prompt_tokens = res.prompt_tokens
										all_tokens = res.total_tokens
										let load_state = false
										
										if(status == 'stop') {
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
											if(typeof(this.supplement.msg_list)=='string') {
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
											loading: load_state
										}
														
										if(load_state) { //保存记录
											let save_val = {
												"type_name": "chatGLM",
												"type_code": "assistant",
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
				} else if(this.listName == 'seven') {
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
				    data.model = 'qwen-v1'; //必传参数
					const response_seven = await fetch(global.baseUrl+'/api/chat/async_chat_completion', { 
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': 'h5'
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
							if(res.code < 49999) {
								let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
								// console.log(userInfo.role == 'guess' ,'panduan');
								if(res.code == 40013) {
									this.$api.msg('登录信息已过期，请重新登录')
									this.messageList[this.listName].pop()
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login',
										})
									}, 1500)
									
								} else {
									this.userRole = userInfo.role
									this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
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
							} else if(res.code > 49999) {
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
						const { value, done } = await reader.read();
						if(done) {
							this.messageList[tabType][this.messageList[tabType].length - 1].loading = true;
							this.$forceUpdate()
							break;
						}
						if (value) {
				
							let chat = decoder.decode(value);
							console.log(chat,880);
							let chatArr = chat.split('\r\n');
							
							chatArr.forEach( val => {
								if(val != '') {
									let res = JSON.parse(val);
									
									if(res.code) {
										if(res.code < 49999) {
											let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
											// console.log(userInfo.role == 'guess' ,'panduan');								
											this.userRole = userInfo.role
											this.messageList[this.listName].push({
												talk: res.msg,
												type: 'assistant',
												time: 0,
												code: res.code == 40022 ? res.code : 40021,
												status: "stop",
												textNumber: 0,
												history: false,
												loading: true
											})
											this.$forceUpdate()
											this.toBottom()
											// console.log(this.messageList[this.listName],1258)
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
										if(res.content != '' && res.content != null) {
											info = res.content;
										}
										if(res.session_code != '' && res.content != null) {
											this.session_code = res.session_code;
										}
										
										if(res.chat_group_code != '' && res.chat_group_code != null) {
											// localStorage.setItem('chat_group_code', res.chat_group_code);
											this.chat_group_code = res.chat_group_code
										}
										if(res.finish_reason != '' && res.finish_reason != null) {
											status = res.finish_reason
										}
										
										integral = res.integral
										completion_tokens = res.completion_tokens
										prompt_tokens = res.prompt_tokens
										let load_state = false
										
										if(status == 'stop') {
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
											if(typeof(this.supplement.msg_list)=='string') {
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
											loading: load_state
										}
														
										if(load_state) { //保存记录
											let save_val = {
												"type_name": "通义千问",
												"type_code": "assistant",
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
				} else if(this.listName == 'eight') {
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
					const response_eight = await fetch(global.baseUrl+'/api/chat/async_chat_completion', { 
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': 'h5'
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
							if(res.code < 49999) {
								let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
								// console.log(userInfo.role == 'guess' ,'panduan');
								if(res.code == 40013) {
									this.$api.msg('登录信息已过期，请重新登录')
									this.messageList[this.listName].pop()
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/login/login',
										})
									}, 1500)
									
								} else {
									this.userRole = userInfo.role
									this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
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
							} else if(res.code > 49999) {
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
						const { value, done } = await reader.read();
						if(done) {
							this.messageList[tabType][this.messageList[tabType].length - 1].loading = true;
							this.$forceUpdate()
							break;
						}
						if (value) {
				
							let chat = decoder.decode(value);
							// console.log(chat,880);
							let chatArr = chat.split('\r\n');
							
							chatArr.forEach( val => {
								if(val != '') {
									let res = JSON.parse(val);
									
									if(res.code) {
										if(res.code < 49999) {
											let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
											// console.log(userInfo.role == 'guess' ,'panduan');								
											this.userRole = userInfo.role
											this.messageList[this.listName].push({
												talk: res.msg,
												type: 'assistant',
												time: 0,
												code: res.code == 40022 ? res.code : 40021,
												status: "stop",
												textNumber: 0,
												history: false,
												loading: true
											})
											this.$forceUpdate()
											this.toBottom()
											// console.log(this.messageList[this.listName],1258)
											return
										} else {
											this.$api.msg('网络异常，请稍后重试')
										}
									} else {
										if(res.content != '' && res.content != null) {
											info += res.content;
										}
										if(res.session_code != '' && res.content != null) {
											this.session_code = res.session_code;
										}
										
										if(res.chat_group_code != '' && res.chat_group_code != null) {
											// localStorage.setItem('chat_group_code', res.chat_group_code);
											this.chat_group_code = res.chat_group_code
										}
										if(res.finish_reason != '' && res.finish_reason != null) {
											status = res.finish_reason
										}
										
										integral = res.integral
										completion_tokens = res.completion_tokens
										prompt_tokens = res.prompt_tokens
										let load_state = false
										
										if(status == 'stop') {
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
											if(typeof(this.supplement.msg_list)=='string') {
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
											loading: load_state
										}
														
										if(load_state) { //保存记录
											let save_val = {
												"type_name": "商汤日日新",
												"type_code": "assistant",
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
		    //切换对话
		    version(num) {
		    	this.active = num;
		    	if(num == 4) {
		    		this.chatType = '文心一言';
		    		this.placeValue = '我是百度全新一代知识增强大语言模型，文心一言大模型'
					this.listName = 'three'
		    	} else if(num == 5) {
		    		this.chatType = '讯飞星火';
		    		this.placeValue = '我是讯飞星火大模型以中文为核心的，新一代认知智能大模型'
					this.listName = 'four'
		    	} else if(num == 8) {
					this.chatType = 'ChatGLM';
					this.placeValue = '我是ChatGLM千亿对话模型。'
					this.listName = 'six'
				} else if(num == 10) {
					this.chatType = '通义千问';
					this.placeValue = '我是通义千问，一个专门响应人类指令的大模型'
					this.listName = 'seven'
				} else if(num == 11) {
					this.chatType = '商汤日日新';
					this.placeValue = '我是商汤日日新大模型'
					this.listName = 'eight'
				}
		    },
			
			checkImg(url) {
				uni.previewImage({
					urls:[url],
					current:0
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
				if(this.listName == 'three') {
					if (this.controller_three != null) {
						this.controller_three.abort()
					}
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
					clearInterval(this.t_time_three)
					clearInterval(this.three_shi)
					this.$forceUpdate()
				} else if(this.listName == 'four') {
					if (this.controller_four != null) {
						this.controller_four.abort()
					}
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
					clearInterval(this.t_time_four)
					clearInterval(this.four_shi)
					this.$forceUpdate()
				} else if(this.listName == 'six') {
					if (this.controller_six != null) {
						this.controller_six.abort()
					}
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
					clearInterval(this.t_time_six)
					clearInterval(this.six_shi)
					this.$forceUpdate()
				} else if(this.listName == 'seven') {
					if (this.controller_seven != null) {
						this.controller_seven.abort()
					}
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
					clearInterval(this.t_time_seven)
					clearInterval(this.seven_shi)
					this.$forceUpdate()
				} else if(this.listName == 'eight') {
					if (this.controller_eight != null) {
						this.controller_eight.abort()
					}
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
					clearInterval(this.t_time_eight)
					clearInterval(this.eight_shi)
					this.$forceUpdate()
				}
			},
			
			//评价回调文心一言
			evaluate2(type, index) {
			
				if (this.evaluateType2[index] == type) {
					this.evaluateType2[index] = undefined
					type = 0
				} else {
					this.evaluateType2[index] = type
				}
			
			
				console.log('dian', this.evaluateType2)
				let data = {
					is_likes: type,
					session_code: this.session_code,
					chat_group_code: this.chat_group_code
				}
				chat_likes(data).then(res => {
					// uni.showToast({ //提示
					// 	title: '评价成功'
					// })
				})
				this.$forceUpdate()
			},
			
			//评价回调讯飞星火
			evaluate3(type, index) {
			
				if (this.evaluateType3[index] == type) {
					this.evaluateType3[index] = undefined
					type = 0
				} else {
					this.evaluateType3[index] = type
				}
			
			
				console.log('dian', this.evaluateType3)
				let data = {
					is_likes: type,
					session_code: this.session_code,
					chat_group_code: this.chat_group_code
				}
				chat_likes(data).then(res => {
					// uni.showToast({ //提示
					// 	title: '评价成功'
					// })
				})
				this.$forceUpdate()
			},
			
			//评价回调ChatGLM
			evaluate5(type, index) {
			
				if (this.evaluateType5[index] == type) {
					this.evaluateType5[index] = undefined
					type = 0
				} else {
					this.evaluateType5[index] = type
				}
			
				let data = {
					is_likes: type,
					session_code: this.session_code,
					chat_group_code: this.chat_group_code
				}
				chat_likes(data).then(res => {
					// uni.showToast({ //提示
					// 	title: '评价成功'
					// })
				})
				this.$forceUpdate()
			},
			
			//通义千问
			evaluate6(type, index) {
			
				if (this.evaluateType6[index] == type) {
					this.evaluateType6[index] = undefined
					type = 0
				} else {
					this.evaluateType6[index] = type
				}

				let data = {
					is_likes: type,
					session_code: this.session_code,
					chat_group_code: this.chat_group_code
				}
				chat_likes(data).then(res => {
					// uni.showToast({ //提示
					// 	title: '评价成功'
					// })
				})
				this.$forceUpdate()
			},
			
			//商汤日日新
			evaluate7(type, index) {
			
				if (this.evaluateType7[index] == type) {
					this.evaluateType7[index] = undefined
					type = 0
				} else {
					this.evaluateType7[index] = type
				}
			
				let data = {
					is_likes: type,
					session_code: this.session_code,
					chat_group_code: this.chat_group_code
				}
				chat_likes(data).then(res => {
					// uni.showToast({ //提示
					// 	title: '评价成功'
					// })
				})
				this.$forceUpdate()
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
			
			stopStart() {
				if(this.listName == 'three') {
					if (this.controller_three != null) {
						this.controller_three.abort()
					}
					clearInterval(this.t_time_three)
					clearInterval(this.three_shi)
					this.messageList.three.pop()
					this.$forceUpdate()
					
				} else if(this.listName == 'four') {
					if (this.controller_four != null) {
						this.controller_four.abort()
					}
					clearInterval(this.t_time_four)
					clearInterval(this.four_shi)
					this.messageList.four.pop()
					this.$forceUpdate()
					
				} else if(this.listName == 'six') {
					if (this.controller_six != null) {
						this.controller_six.abort()
					}
					clearInterval(this.t_time_six)
					clearInterval(this.six_shi)
					this.messageList.six.pop()
					this.$forceUpdate()
					
				} else if(this.listName == 'seven') {
					if (this.controller_seven != null) {
						this.controller_seven.abort()
					}
					clearInterval(this.t_time_seven)
					clearInterval(this.seven_shi)
					this.messageList.seven.pop()
					this.$forceUpdate()
					
				} else if(this.listName == 'eight') {
					if (this.controller_eight != null) {
						this.controller_eight.abort()
					}
					clearInterval(this.t_time_eight)
					clearInterval(this.eight_shi)
					this.messageList.eight.pop()
					this.$forceUpdate()
					
				}
			},
			
			//补充提问
			async showFun() {
				if(this.complete.trim() == '') {
					this.$api.msg('补充内容不能为空')
					return false;
				}
				// this.supplement.msg_list.push({
				// 	role: 'user',
				// 	content: this.complete
				// })
				// console.log(this.sessionList[this.listName],366999)
				if(this.listName == 'three' || this.listName == 'five' || this.listName == 'six' || this.listName == 'seven') {
					this.supplement.msg_list = [
						{
							role: 'user',
							content: this.sessionList[this.listName][this.messageList[this.listName].length - 1].talk
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
					this.supplement.msg_list = [
						{
							role: 'assistant',
							content: this.messageList[this.listName][this.messageList[this.listName].length - 1].talk
						},
						{
							role: 'user',
							content: this.complete
						}
					]
				}
				
				this.sessionList[this.listName] = []
				this.sessionList[this.listName].push({
					talk: this.complete,
					type: 'user'
				})
				//把数据变成JSON
				this.supplement.msg_list = JSON.stringify(this.supplement.msg_list)
				this.show = false
			
			
				this.complete = ""
			    this.messageList[this.listName] = []
				await this.creatChatFun(this.supplement, 'continue')
				this.$forceUpdate()
			
			},
			
			toBottom() {
				
				// 定位到当前聊天地点
				this.$nextTick(()=>{
					setTimeout(() => {
						var scrollTop = document.getElementById("chat_cont")
						uni.pageScrollTo({
							scrollTop: scrollTop.scrollHeight,
							duration: 1,
							complete: (err) => {
								// console.log(err,333);
							}
						});
					}, 1500)
			
				})
			},
			
			keyboardheightchange(e) {
				console.log(e, '键盘高度变化33');
				if (e.detail.height == 0) {
					this.keyHeight = 0
					this.toBottom();
					
				} else {
					this.keyHeight = e.detail.height
				}
			},
			
			pickSelect(e) {
				console.log('confirm', e)
				let val = e.value[0].option_value;
				this.questionList[this.selectIndex].modelValue = val;
				this.questionList[this.selectIndex].modelShow = false;
				this.$forceUpdate()
				console.log(this.questionList,689)
			},
			
			closePick(index) {
				this.questionList[index].modelShow = false;
				this.$forceUpdate()
			},
			
			openDialog(index) {
				this.questionList[index].modelShow = true;
				this.selectIndex = index;
				this.$forceUpdate()
			},
			
			//添加标签
			addTag(index) {
				this.tagIndex = index;
				this.tagShow = true
			},
			
			checkboxChange(e) {
				 console.log('change', e);
				 console.log(this.questionList,663)
			},
			
			closeTag() {
				this.tagName = ''
				this.tagShow = false
			},
			
			confirmTag() {
				if(this.tagName == '') {
					this.$api.msg('请输入标签名称')
				}
				this.questionList[this.tagIndex].tagList.push(this.tagName)
				this.tagShow = false;
				this.tagName = '';
				this.$forceUpdate()
			},
			
			//删除标签
			delTag(index) {
				this.questionList[index].tagList.splice(index,1)
				this.$forceUpdate()
			},
			
			// 分享到问答广场
			shareQs() {
				let session_data = [];
				// console.log(this.listName,885)
				// console.log(this.sessionList,886)
				// console.log(this.messageList,887)
				let user_data = [{'role': 'user', 'content': this.sessionList[this.listName][this.sessionList[this.listName].length - 1].talk}]
				let assistant_data = [{ 'role': 'assistant', 'content': this.messageList[this.listName][this.messageList[this.listName].length - 1].talk }]
				session_data = session_data.concat(user_data);
				session_data = session_data.concat(assistant_data);
				console.log(session_data,895)
				let vals = {
					'question_id': this.content.question_id,
					'module_id': this.content.module_id,
					'session_code': this.session_code,
					'chat_group_code': this.chat_group_code,
					'question_data': this.question_data,
					'session_data': session_data
				}
				
				shareChat(vals).then(res => {
					if (res.code == 20000) {
						this.$api.msg('分享成功');
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取失败');
				})
				
			},
			
			// 获取详情
			eidtContent(session_code) {
				let vals = {
					'session_code': session_code,
				}
				squareDetail(vals).then(res => {
					if (res.code == 20000) {
						// this.$api.msg('分享成功');
						// this.qsData = res.data;
						this.isShare = false;
						res.data.question_data.forEach((val)=>{
							if(val.info_type_name == 'Tag') {
								val.tagList = val.content
							} else {
								val.modelValue = val.content
							}
							
							if(val.info_type_name == 'Select') {
								val.optionArr = []
								val.optionArr.push(val.options)
							}
							
						})
						
						res.data.session_data.forEach((val)=>{
							val.talk = val.content
							val.type = val.role
							val.loading = false
							val.history = true
							val.textNumber = val.content.replace(/[\r\n]/g, "").length
						})
						this.questionList = res.data.question_data;
						// this.question_data = res.data.question_data;
						// console.log(this.questionList,8956)
						// this.sessionList[this.listName] = res.data.session_data.slice(0,1)
						this.messageList[this.listName] = res.data.session_data.slice(1);
						// console.log(this.messageList[this.listName],8957)
						// console.log(this.sessionList[this.listName],4589)
						// console.log(this.messageList[this.listName],4511)
						this.isPosition = true
						this.$forceUpdate()
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取失败');
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
			// 返回首页
			backIndex() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		},
		
		
	}
</script>
<style lang="scss" scoped>
	.containar {
		padding: 30upx 0;
	}
	.apply_cont {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 0 30upx;
		.cont_title {
			color: #333;
			font-size: 30upx;
			font-style: normal;
			font-weight: 500;
			line-height: 60upx;
		}
		.cont_text {
			background: #fff;
			border-radius: 10upx;
			padding: 20upx;
			width: 100%;
			height: 154upx;
			
			.text_li {
				color: #666;
				font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: 38upx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3; // 控制多行的行数
				-webkit-box-orient: vertical;
			}
		}
	}
	
	.send {
		padding: 25upx 30upx;
		// background: #fff;
		display: flex;
		align-items: center;
		flex-direction: column;
		// margin-bottom: 20upx;
		.type_text {
			color: #333;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
		}
		.chat_type {
			display: flex;
			align-items: flex-start;
			// justify-content: space-around;
			// flex-wrap: wrap;
			width: 100%;
			.type_r {
				display: flex;
				align-items: center;
				// justify-content: space-around;
				flex-wrap: wrap;
				flex: 1;
			}
			.tabs {
				width: 22%;
				background: #E4E7ED;
				border-radius: 6upx;
				padding: 16upx 0;
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
			.active_tabs{
				width: 22%;
				background: rgba(31, 100, 255, 0.15);;
				border-radius: 6upx;
				padding: 16upx 0;
				font-style: normal;
				font-weight: 500;
				font-size: 28upx;
				line-height: 150%;
				color: #1F64FF;
	            display: flex;
				align-items: center;
				justify-content: center;
				margin: 10upx 1.5%;
			}
		}
		.chat_text {
			width: 100%;
			padding: 20upx 0;
			/deep/.u-textarea {
				padding: 18upx;
				min-height: 100upx;
				max-height: 150upx;
				overflow-y: auto;
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
	}
	
	.code {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 50upx;
		padding: 0 30upx;
		.code_img {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			.img_cont {
				width: 220upx;
				height: 220upx;
			}
			.img_tip {
				color: #000;
				text-align: center;
				font-size: 28upx;
				font-style: normal;
				font-weight: 500;
				line-height: 50upx;
			}
		}
	}
	.asw_cont {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 40upx;
		padding: 0 30upx;
		
		.asw_title {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			.title_text {
				color: #333;
				font-size: 30upx;
				font-weight: 500;
				line-height: 150%;
				flex: 1;
				text-align: center;
			}
			.title_right {
				flex: 1;
				color: #1F64FF;
				font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%; 
				text-align: right;
			}
			
		}
		.asw_cont {
			color: #333;
			font-size: 30upx;
			font-weight: 500;
			line-height: 150%;
		}
		.asw_text {
			padding: 15upx;
			background: #fff;
			border-radius: 10upx;
			min-height: 100upx;
			width: 100%;
			margin-top: 30upx;
		}
	}
	
	.loadingTalk {
		
		.flexs {
			display: flex;
			align-items: center;
			background: #fff;
			padding: 10px;
			color: #AAB2C8;
			font-size: 12px;
			font-weight: 400;
			display: inline-block;
			border-radius: 5px;
		}
	}
	
	.tips {
	    word-break:break-all;
	    color: #333;
		
	}
	
	.edit {
	    word-break:break-all;
	    color: #AAB2C8;
		/deep/.u-row {
			font-weight: 400;
			font-size: 14px;
			color: #AAB2C8;
			margin-bottom: 0;
			margin-top: 10px;
		}
		
	}
	
	.loadingImages {
		width: 16px;
		height: 16px;
		opacity: 0.5;
		margin-right: 5px;
	}
	
	.opaImg {
		width: 20px;
		height: 20px;
	}
	
	.isPosition {
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 99;
		background-color: #fff;
	}
	
	.modal {
		padding: 0 10px;
	
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
			height: 153px;
			background: #F5F6FA;
			border-radius: 8px;
			padding: 20px;
			font-weight: 400;
			// font-size: 13px;
			margin-top: 18px;
	
			/deep/.u-textarea {
				padding: 0;
				background-color: #F5F6FA;
			}
		}
	}
	
	
	.chat_qs {
		background: #fff;
		padding: 20upx;
		border-radius: 8upx;
		margin-bottom: 20upx;
		width: 100%;
	}
	
	.chat_text {
		width: 100%;
		padding: 20upx 0;
		
		/deep/.u-textarea {
			padding: 18upx;
			min-height: 100upx;
			max-height: 150upx;
			overflow-y: auto;
		}
	}
	.chat_texts {
		padding: 20upx 0;
		display: flex;
		flex-direction: column;
	}
	
	.text_cont {
		display: flex;
		align-items: center;
		margin-bottom: 10upx;
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
			font-weight: 400;
			line-height: 26upx;
		}
	}
	
	.qs_cont {
	padding: 20upx;
	// background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	.cont_top {
		display: flex;
		align-items: flex-end;
		
		.top_mid {
			font-style: normal;
			font-weight: 600;
			font-size: 30upx;
			line-height: 150%;
			color: #333;
		}
		.top_right {
			font-style: normal;
			font-weight: 400;
			font-size: 24upx;
			line-height: 150%;
			color: #999;
			padding-left: 10upx;
		}
	}
	
	.cont_right {
		display: flex;
		align-items: center;
		.right_text {
			color: #1F64FF;
			font-size: 24upx;
			font-weight: 400;
			line-height: 150%; 
		}
		.hot_img {
			width: 36upx;
			height: 36upx;
			margin: 0 15upx;
		}
	}
}

.qs {
	padding: 0 20upx;
	// margin-top: 20upx;
	
	.hotWrods {
		background: #fff;
		border-radius: 8px;
		box-shadow: 0px 2.23993px 7.83975px rgba(51, 51, 51, 0.1);
		margin-bottom: 10px;
		padding: 25upx 22upx;
		height: auto;
	
		.box {
			// height: 80px;
			background: #FFFFFF;
			border-bottom: 1upx solid #E6E9ED;
			.text {
				display: flex;
				align-items: center;
				justify-content: space-between;
				
			}
			
			.text_cont {
				padding: 10upx;
				height: 100upx;
				overflow: hidden;
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
				max-width: 80%;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				display: inline-block;
				color: #333;
				font-size: 15px;
				font-weight: 550;
				padding-left: 10px;
			}
	
			.tips {
	
				display: flex;
				background: #F2FAFF;
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
	}
	.loading {
				display: flex;
		justify-content: center;
		background: #fff;
		padding: 20upx 0;
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

.u-page__tag-item {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin: 0 10upx 0 0;
}

.lists {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 20upx;
	background: #fff;
	border-radius: 8upx;
	border: 1upx solid  #dadbde;
	margin-bottom: 25upx;
	
	.txt {
		font-size: 26upx;
		margin-left: 20upx;
		flex: 1;
	}
	
	.right_img {
		width: 24upx;
		height: 24upx;
		margin-right: 25upx;
	}
}

.key_cont {
	width: 100%;
	background-color: #FFFFFF;
	border-radius: 20upx;
	/* padding: 0upx 0 0 0; */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.title {
	font-weight: 500;
	font-size: 32upx;
	line-height: 48upx;
	color: #333;
	margin-bottom: 32upx;
}

.on_order_list {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28upx;
	height:70upx;
	line-height: 70upx;
	color: #C0C4CC;
	margin-bottom: 40upx;
}
	
</style>
<style>
	page {
		background: #f6f8fB;
	}
</style>
