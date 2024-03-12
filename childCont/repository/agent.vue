<template>
	<view style="padding: 32rpx;">
		<view class="main">
			<view style="text-align: center;">
				<image class="avatar" :src="getImgUrl(userData.avatar_url)">
				</image>
				<view class="name">{{userData.agent_name}}</view>
				<view class="txt">请说出你的需求，之后我会根据你的需求生成对应的宣传文案</view>
			</view>
			<view class="headBtn">
				<view class="headBtn_i" @click="showCate">
					<image class="icon" :src="link"></image>
					<view class="title">关联知识库管理</view>
				</view>
				<view class="headBtn_i" style="background-color: #E5EDFF;" @click="back">
					<image class="icon" :src="change"></image>
					<view class="title" style="color: #1F64FF;">切换AI智能体</view>
				</view>
			</view>


			<view v-for="item,index in options" :key="index">
				<view class="chat_text" v-if="item.info_type_name=='Input'">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">{{item.title}}</text>
					</view>
					<u--input :placeholder="item.placeholder" border="surround"
						v-model="item.options[0].value"></u--input>
				</view>

				<view class="chat_text" v-if="item.info_type_name=='Textarea'">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">{{item.title}}</text>
					</view>
					<u-textarea v-model="item.options[0].value" :placeholder="item.placeholder"
						maxlength="-1"></u-textarea>
				</view>
				<view class="chat_text" v-if="item.info_type_name=='Tag'">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">{{item.title}}</text>
					</view>
					<view class='surround'>
						<view class="u-page__tag-item" v-for="(tip, index1) in tagList" :key="index1">
							<u-tag :text="tip" size="mini" plain closable @close="delTag(index1)"></u-tag>
						</view>
						<view class="u-page__tag-item">
							<u-tag text="添加" size="mini" icon="plus" plain @click="addTag()"></u-tag>
						</view>
					</view>
				</view>
				<view class="chat_text" v-if="item.info_type_name == 'CheckBox'">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">{{item.title}}</text>
					</view>
					<u-checkbox-group v-model="item.options" @change="checkboxChange" placement="row">
						<view style="display: flex; flex-wrap: wrap; width: 100%">
							<u-checkbox activeColor="#1F64FF" :label="opt.value" :name="opt.value"
								:checked="item.options[index2].value.includes(opt.value) ?  true : false "
								:customStyle="{marginBottom: '10px',marginRight: '10px',width: '30%'}"
								v-for="(opt, index2) in item.options" :key="index2">
							</u-checkbox>
						</view>
					</u-checkbox-group>

				</view>
				<view class="chat_text" v-if="item.info_type_name == 'Select'">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">{{item.title}}</text>
					</view>
					<view class="lists" @click="openDialog(index)">
						<view class="txt" v-if="item.options[0].value != ''">{{ item.options[0].value }}</view>
						<view class="txt" v-else>{{ item.placeholder }}</view>
						<image class="lists_img right_img" src='@/static/images/right.png' />
					</view>

				</view>
				<u-picker :show="modelShow" v-model="item.options[0].value" :columns="selectArr" keyName="value"
					@cancel="closePick(index)" @confirm="pickSelect" v-if="item.info_type_name == 'Select'"></u-picker>
			</view>


			<!-- <view class="chat_text">
				<view class="text_cont">
					<text class="text_l">*</text>
					<text class="text_r">以特定性别视角</text>
				</view>
				<u--input placeholder="男性" border="surround" maxlength="30" v-model="nameValue"></u--input>
			</view> -->
			<view class="tab_model">
				<view class="l_chat" @click="chatShow = true">
					<text class="l_text" style="margin-right: 10upx;">{{ samChatType }}</text>
					<u-icon name="arrow-down" color="#DBDBDB" size="14"></u-icon>
				</view>
				<view class="l_chat" @click="toHis">历史记录</view>
			</view>
			<view class="chat_btn" @click="sendMessage">AI一下</view>
		</view>
		<view class="chat_cont" style="margin-bottom: 30upx;">
			<view class="asw_cont" v-if="isPosition">
				<view class="asw_title">
					<text class="title_text">AI分析结果</text>
					<!-- <text class="title_right" @click="shareQs">分享到问答广场</text> -->
					<!-- <text class="title_right" v-if="isShare" @click="shareQs">分享到问答广场</text> -->
					<!-- <text class="title_text" v-if="!isShare"></text> -->
				</view>
				<view v-for="(item,index) in messageList[listName]" :key="index" style="width: 100%;">
					<view class="asw_text">
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
									<u-button type="error" color="#FF9B17" v-if="listName == 'one'"
										:customStyle="{'border-radius':'8px','margin-top':'10px', 'flex':'1', 'margin-right':'10px'}"
										@click='goToVip'>升级会员</u-button>
									<u-button type="error" color="#1F64FF"
										:customStyle="{'border-radius':'8px','margin-top':'10px', 'flex':'1'}"
										@click='goToVip'>开通流量包</u-button>
								</view>
							</view>

							<view class="tips" v-else-if="item.code==40021">
								<text style="font-size:17px; word-break:break-all;">{{item.talk}}</text>
							</view>
							<view v-else>
								<view class="tips">
									<!-- <text style="font-size:17px;width: 100%; word-break:break-all;" v-if="!item.loading">{{item.talk}}</text> -->
									<ua-markdown :source="item.talk" :showLine="false" />
								</view>
								<view class='edit'>
									<u-row>
										<u-col span="6" align="center">
											字数:{{item.textNumber}}
										</u-col>
										<u-col span="6" align="center" v-if="item.loading">
											消耗:{{item.integral }}w算力
										</u-col>

									</u-row>
									<u-row class='edit' v-if="item.loading && listName != 'six'">
										<u-col span="6" align="center" style="font-size: 14px;">
											上行:{{item.prompt_tokens}} token
										</u-col>
										<u-col span="6" align="center" style="font-size: 14px;">
											下行:{{item.completion_tokens}} token
										</u-col>
									</u-row>
									<u-row class='edit' v-if="item.loading && listName == 'six'">
										<u-col span="6" align="center" style="font-size: 14px;">
											消耗:{{item.all_tokens}} token
										</u-col>

									</u-row>

									<u-row class='edit'>
										<u-col span="12" align="center">
											当前内容为AI生成，不做任何决策使用！由此引发的一切后果，需自行承担，请知悉,已通过阿里云内容安全审核
										</u-col>
									</u-row>


									<u-row class='edit' align="center">
										<u-col span="7.5" v-if="item.history"></u-col>
										<u-col span="1" align="center" v-if="!item.history">
											<view>
												<image v-if="item.loading" src="../../static/images/time.png" mode=""
													class="opaImg" style="vertical-align: top;"></image>
												<image v-else :src="waitImg" mode="" width="16px" height="16px"
													class="loadingImages">
												</image>
											</view>

										</u-col>
										<u-col span="6.5" align="center" v-if="!item.history">
											<view>
												<text v-if="item.loading"> 耗时：{{item.time}}秒</text>
												<text v-else> 思考中:{{item.time}}秒</text>
											</view>

										</u-col>

										<u-col span="1.5" @click="evaluate2(1,index)" v-if="listName == 'three'">
											<image
												:src="require(`../../static/images/Icon(${evaluateType2[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate2(2,index)" v-if="listName == 'three'">
											<image
												:src="require(`../../static/images/like(${evaluateType2[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>

										<u-col span="1.5" @click="evaluate3(1,index)" v-if="listName == 'four'">
											<image
												:src="require(`../../static/images/Icon(${evaluateType3[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate3(2,index)" v-if="listName == 'four'">
											<image
												:src="require(`../../static/images/like(${evaluateType3[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>

										<u-col span="1.5" @click="evaluate5(1,index)" v-if="listName == 'six'">
											<image
												:src="require(`../../static/images/Icon(${evaluateType5[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate5(2,index)" v-if="listName == 'six'">
											<image
												:src="require(`../../static/images/like(${evaluateType5[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>

										<u-col span="1.5" @click="evaluate6(1,index)" v-if="listName == 'seven'">
											<image
												:src="require(`../../static/images/Icon(${evaluateType6[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate6(2,index)" v-if="listName == 'seven'">
											<image
												:src="require(`../../static/images/like(${evaluateType6[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>

										<u-col span="1.5" @click="evaluate7(1,index)" v-if="listName == 'eight'">
											<image
												:src="require(`../../static/images/Icon(${evaluateType7[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate7(2,index)" v-if="listName == 'eight'">
											<image
												:src="require(`../../static/images/like(${evaluateType7[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="1.5" @click="evaluate7(1,index)" v-if="listName == 'eleven'">
											<image
												:src="require(`../../static/images/Icon(${evaluateType7[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate7(2,index)" v-if="listName == 'eleven'">
											<image
												:src="require(`../../static/images/like(${evaluateType7[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="1.5" @click="evaluate7(1,index)" v-if="listName == 'twelve'">
											<image
												:src="require(`../../static/images/Icon(${evaluateType7[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="2" @click="evaluate7(2,index)" v-if="listName == 'twelve'">
											<image
												:src="require(`../../static/images/like(${evaluateType7[index]}).png`) "
												mode="" class="opaImg">
											</image>
										</u-col>
										<u-col span="1" @click="copyFun(item.talk)">
											<image src="../../static/images/balckCopy.png" mode="" class="opaImg">
											</image>
										</u-col>
									</u-row>
								</view>
								<u-row gutter="20">
									<u-col span="3" textAlign="left" v-if="item.status=='length'">
										<u-button type='primary'
											:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px", "margin-bottom": "50px","font-size": "14px"}'
											size="mini" color="rgba(31, 100, 255, 0.1)" @click="continueFun">继续
										</u-button>
									</u-col>

									<!-- {{item.history}} -->
									<u-col span="4" v-if="index===messageList.length-1 && item.loading">
										<u-button type='primary'
											:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px", "margin-bottom": "50px","font-size":"13px"}'
											size="mini" color="rgba(31, 100, 255, 0.1)" @click="show=true">
											继续提问
										</u-button>
									</u-col>

									<u-col span="4"
										v-if="index===messageList.length-1 && !item.history && !item.loading">
										<u-button type='primary'
											:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px", "margin-bottom": "50px","font-size":"13px"}'
											size="mini" color="rgba(31, 100, 255, 0.1)" @click="stopChat">
											停止回答
										</u-button>
									</u-col>


									<u-col span="4" v-if="index===messageList.length-1 && item.loading">
										<u-button type='primary'
											:customStyle='{"color":"#1F64FF","height":"28px","margin-top": "10px","width":"100px", "margin-bottom": "50px","font-size":"14px"}'
											size="mini" color="rgba(31, 100, 255, 0.1)" @click="toIdea">
											投诉及建议
										</u-button>
									</u-col>

								</u-row>

							</view>

						</view>

					</view>

				</view>

			</view>
		</view>
		<!-- 模型选择器 -->
		<u-picker :show="chatShow" :columns="samplerList" :closeOnClickOverlay="true" @close="chatShow = false"
			v-model="samChatType" keyName="label" @cancel="chatShow = false" @confirm="version"></u-picker>
		<!-- 添加标签 -->
		<u-modal :show="tagShow" @cancel="closeTag" confirmText="添加" confirmColor="#1F64FF;" :showCancelButton='true'
			@confirm="confirmTag">
			<view class="key_cont" style="">
				<view class="title">添加标签</view>
				<u-input :customStyle='{"padding":"8px", "width":"100%"}' inputAlign="center" v-model="tagName"
					maxlength="10" aceholder="请输入标签" type="text"></u-input>
			</view>
		</u-modal>
		<!-- 选择知识库 -->
		<ba-tree-picker ref="treePicker" :multiple='true' :selectParent='false' @select-change="selectChange"
			title="选择知识库" confirmColor='#1F64FF' :localdata="listData" valueKey="id" textKey="name"
			childrenKey="children" />

	</view>
</template>

<script>
	import {
		creatChat,
		chat_likes,
		chat_session,
		xfChat,
		getSquare,
		shareChat,
		squareDetail,
		getConfig,
		agentChat,
		groups
	} from "@/apis/chat.js"
	import {
		saveFootprint
	} from "@/apis/user.js"
	import * as TextEncoding from 'text-encoding-shim';
	import uaMarkdown from '../../components/ua2-markdown/ua-markdown.vue'
	import baTreePicker from "@/childCont/components/ba-tree-picker/ba-tree-picker.vue"
	// import {
	// 	data
	// } from "../../share";
	export default {
		components: {
			uaMarkdown,
			baTreePicker
		},
		data() {
			return {
				prompt: '人格设定:你是优秘智能公司开发的umibot',
				link: global.baseImg + '/xcx/com/message_center/关联link.png',
				change: global.baseImg + '/xcx/com/message_center/智能体切换 4.png',
				chatShow: false,
				samChatType: '文心一言',
				samplerList: [
					[{
							label: '文心一言',
							chat_type: 4
						},
						{
							label: '通义千问',
							chat_type: 10
						},
					]
				],
				tagShow: false,
				tagIndex: 0,
				tagName: '',
				placeValue: '',
				isPosition: false,
				listName: 'three',
				messageList: {
					'three': [],
					'four': [],
					'six': [],
					'seven': [],
					'eight': [],
					'eleven': [],
					'twelve': []
				},

				sessionList: {
					'three': [],
					'four': [],
					'six': [],
					'seven': [],
					'eight': [],
					'eleven': [],
					'twelve': []
				},

				//通义千问
				stop_seven: false,
				seven_shi: 0,
				seven_time: 0,
				requestTask_seven: '',
				evaluateType6: [],

				//文心一言
				stop_three: false,
				three_shi: 0,
				three_time: 0,
				requestTask_three: '',
				evaluateType2: [],
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
				waitImg: global.baseImg + '/xcx/c4a8054e-50bd-4790-a3cb-ec585412daa7.jpg',
				tagList: [],
				userData: [],
				options: [],
				agent_id: '',
				modelShow: false,
				selectArr: [],
				listData: [],
				file_ids: [],
				item:''

			};
		},

		onLoad(option) {
			this.item = option.item
			this.userData = JSON.parse(option.item)
			// console.log(this.userData,778);
			this.options = this.userData.options.options
			this.agent_id = this.userData.agent_id
			let arr = this.options.find(obj => obj.info_type_name == "Tag")
			if (arr) {
				this.tagList = arr.options.map(item => item.value)
			}
			let arr1 = this.options.find(obj => obj.info_type_name == 'Select')
			if (arr1) {
				this.selectArr[0] = arr1.options
			}

		},
		onShow() {
			this.getGroups()
			if (uni.getStorageSync('history_code') != '') {
				this.historySession(uni.getStorageSync('history_code'))
			}
		},
		methods: {
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
			
				const sessionData = JSON.parse(session)
				this.messageList = {
					'three': [],
					'four': [],
					'six': [],
					'seven': [],
					'eight': [],
					'eleven': [],
					'twelve': []
				}
				if (sessionData.type == 4) {
					this.listName = 'three'
				} else {
			
					this.listName = 'seven'
				}
				this.isPosition = true
				chat_session(sessionData.code).then(res => {
					// console.log(res, '初始化信息');
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
					let chatArr = []
					res.data.map((item, tip) => {
						this.supplement.session_code = item.session_code
						this.supplement.chat_group_code = item.chat_group_code
						// if(item.content.indexOf('(回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字)') != -1) {
						// 	item.content = item.content.replace('(回答内容中不能出现：chatgpt、gpt、openai、Generative Pre-trained Transformer等文字)', '')
						// }
						if (item.images == null) {
							item.images = []
						}
						// console.log(this.messageList,this.messageList[this.listName],1533);
						chatArr.push({
							talk: item.content,
							type: item.role,
							integral: item.integral,
							completion_tokens: item.completion_tokens,
							prompt_tokens: item.prompt_tokens,
							time: 0,
							code: 20000,
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
					this.messageList[this.listName][0] = chatArr[1]
					console.log(this.messageList[this.listName], 1558);
					this.toBottom()
					this.$forceUpdate()
					uni.setStorageSync('history_code', '')
			
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
			pickSelect(e) {
				console.log('confirm', e)
				let val = e.value[0].value;
				this.options[this.selectIndex].options[0].value = val;
				this.modelShow = false;
				this.$forceUpdate()
				// console.log(this.questionList,689)
			},

			closePick(index) {
				console.log(index);
				this.modelShow = false;
				this.$forceUpdate()
			},

			openDialog(index) {
				console.log(index);
				this.modelShow = true;
				this.selectIndex = index;
				this.$forceUpdate()
			},
			getGroups() {
				let val = {
					user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id
				}
				groups(val).then(res => {
					// console.log(res, 999);
					if (res.code == 20000) {
						const name = new Map()
						name.set('documents', '文档库')
						name.set('pictures', '图片库')
						name.set('urls', '网址库')
						this.listData = []
						for (const key in res.data) {
							const childNodes = res.data[key];

							const listArr = [];
							for (const childKey in childNodes) {
								const childGroup = childNodes[childKey];
								const childArr = []
								for (const child of childGroup) {
									childArr.push({
										id: child.pic_id || child.file_id || child.url_id,
										name: child.pic_name || child.file_name || child.url_name
									})
								}
								const node = {
									name: childKey,
									id: childGroup[0].group_id,
									children: childArr,
								};
								listArr.push(node);
							}
							const groupNode = {
								id: new Date().getTime(),
								name: name.get(key),
								children: listArr,
							};
							this.listData.push(groupNode)
							console.log(this.listData, 999);
						}
					}
				}).catch(err => {
					console.log(err);
					this.$api.msg('数据请求失败')
				})
			},

			checkboxChange(e) {
				console.log('change', e);
				// console.log(this.questionList,663)
			},
			version(e) {
				console.log(e, 'e');
				this.chatShow = false;
				let num = e.value[0].chat_type
				console.log(num);
				if (num == 4) {
					this.samChatType = '文心一言';
					this.placeValue = '我是百度全新一代知识增强大语言模型，文心一言大模型'
					this.listName = 'three'
				} else if (num == 10) {
					this.samChatType = '通义千问';
					this.placeValue = '我是通义千问，一个专门响应人类指令的大模型'
					this.listName = 'seven'
				}
			},
			showCate() {
				this.$refs.treePicker._show();
			},
			selectChange(ids, names) {
				console.log(ids, 'ids');
				this.file_ids.push(ids)
				console.log(this.file_ids, 123);
			},
			addTag(index) {
				console.log(index);
				this.tagIndex = index;
				this.tagShow = true
			},
			//删除标签
			delTag(index) {
				this.tagList.splice(index, 1)
				this.$forceUpdate()
			},
			confirmTag() {
				if (this.tagName.trim() == '') {
					this.$api.msg('请输入标签名称')
					return
				}
				let data = this.tagName
				this.tagList.push(data)
				this.tagShow = false;
				this.tagName = '';
				// console.log(this.tagList,666)
			},
			sendMessage(message) {
				if (this.messageList[this.listName].length > 0) {
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
					// if(send_time == 0 && !history) {
					// 	this.messageList[this.listName].pop()
					// }
				}

				// if (this.chatInputValue.trim() == '') return this.$api.msg('请输入您要发送的内容')

				this.chatInputValue = this.userData.agent_desc;
				let flag = true;
				this.question_data = [];
				this.isShare = true;
				let that = this
				that.options.forEach((val, index) => {
					if (flag) {
						// console.log(val,148)
						if (val.info_type_name == 'Input') {
							if (val.is_required == 1 && val.options[0].value == '') {
								let text = '请输入' + val.title;
								that.$api.msg(text)
								flag = false
							} else {
								let content = val.title + ':' + val.options[0].value + ';'
								that.chatInputValue += content
								that.question_data.push({
									option_title: val.title,
									option_value: val.options[0].value,
								})
								flag = true
							}
						}

						if (val.info_type_name == 'Textarea') {
							if (val.is_required == 1 && val.options[0].value == '') {
								let text = '请输入' + val.title;
								that.$api.msg(text)
								flag = false
							} else {
								let content = val.title + ':' + val.options[0].value + ';'
								that.chatInputValue += content
								that.question_data.push({
									option_title: val.title,
									option_value: val.options[0].value,
								})
								flag = true
							}
						}

						if (val.info_type_name == 'CheckBox') {
							if (val.is_required == 1 && val.options[0].value == '') {
								let text = '请选择' + val.title;
								that.$api.msg(text)
								flag = false
							} else if (val.is_required == 1 && val.options[0].value.length == 0) {
								let text = '请选择' + val.title;
								that.$api.msg(text)
								flag = false
							} else if (val.options[0].value.length > 0) {
								let str = val.options[0].value.toLocaleString(',');
								let content = val.title + ':' + str + ';'
								let check = val.options.map(item => item.value)
								that.chatInputValue += content

								that.question_data.push({
									option_title: val.title,
									option_value: check.join(','),
								})
								flag = true
							}
						}

						if (val.info_type_name == 'Select') {
							if (val.is_required == 1 && val.options[0].value == '') {
								let text = '请选择' + val.title;
								that.$api.msg(text)
								flag = false
							} else {
								let content = val.title + ':' + val.options[0].value + ';'
								that.chatInputValue += content
								let check = val.options.map(item => item.value)
								that.question_data.push({
									option_title: val.title,
									option_value: val.options[0].value,

								})
								flag = true
							}
						}

						if (val.info_type_name == 'Tag') {
							if (val.is_required == 1 && that.tagList.length == 0) {
								let text = '请添加' + val.title;
								that.$api.msg(text)
								flag = false
							} else if (that.tagList.length > 0) {
								let content = val.title + ':' + that.tagList.toLocaleString(',') + ';'
								that.chatInputValue += content
								that.question_data.push({
									option_title: val.title,
									option_value: that.tagList.join(','),
								})
								flag = true
							}
						}
					}

				})

				const data = {
					agent_id: that.agent_id,
					options: that.question_data
				}
				console.log(data, 996);

				agentChat(data).then(res => {
					console.log(res, 111);
					if (res.code == 20000) {} else {
						throw new Error(res.msg)
					}
				}).catch(err => {
					throw new Error(err.msg)
				})

				if (flag) {
					// console.log(that.chatInputValue,666)
					that.messageList[that.listName] = [];
					that.sessionList[that.listName] = [];
					that.session_code = '';
					that.chat_group_code = '';

					// if(message.length)
					// switch (that.chatType) {
					// 	case 'AI35':
					// 		if (that.chatInputValue.length > 900) return that.$api.msg('文字不得超过900字')
					// 		break;
					// 	case 'AI40':
					// 		if (that.chatInputValue.length > 2000) return that.$api.msg('文字不得超过2000字')
					// 		break;

					// }

					that.isPosition = true


					//判断是否是第一条提问

					// console.log(that.selectDone, 'that.messageList[that.listName].length');
					that.stop_three = false; // 重置手动停止按钮
					that.stop_four = false; // 重置手动停止按钮
					that.stop_six = false; // 重置手动停止按钮
					that.stop_seven = false; // 重置手动停止按钮
					that.stop_eight = false; // 重置手动停止按钮
					that.stop_twelve = false; // 重置手动停止按钮
					that.stop_eleven = false; // 重置手动停止按钮

					that.sessionList[that.listName].push({
						talk: that.chatInputValue,
						type: 'user'
					})

					let chat_tip = '';
					if (that.samChatType == '文心一言') {
						chat_tip = 4
					} else if (that.samChatType == '讯飞星火') {
						chat_tip = 5
					} else if (that.samChatType == 'ChatGLM') {
						chat_tip = 8
					} else if (that.samChatType == '通义千问') {
						chat_tip = 10
					} else if (that.samChatType == '火山云雀') {
						chat_tip = 1000
					} else if (that.samChatType == '腾讯混元') {
						chat_tip = 1001
					} else if (that.samChatType == '360智脑') {
						chat_tip = 12
					}
					let data = {
						chat_type: chat_tip,
						action_type: '3',
						session_code: "",
						chat_group_code: "",
						content: that.chatInputValue,
						stream_str: 1,
						scenario_type: 'agent',
						// is_decode: 1,
						msg_list: [{
							role: 'user',
							content: that.chatInputValue,
							covert_content: that.prompt,
							agent_id: that.agent_id
						}]
					}
					data.msg_list = JSON.stringify(data.msg_list)


					that.creatChatFun(data, 'first')

					that.selectDone = ''
					that.chatInputValue = ''

				}


			},

			async creatChatFun(data, state) {
				this.isClick = true;
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
					data.model = 'eb-instant';
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					const response_three = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
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
										1] = {
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
							// console.log(chat,'内容');
							let chatArr = chat.split('\r\n');

							chatArr.forEach(val => {
								if (val != '') {
									let res = JSON.parse(val);

									if (res.code) {
										if (res.code < 49999) {
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
										if (res.content != '' && res.content != null) {
											info += res.content;
											// console.log('内容',info);
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

										if (load_state) { //保存记录
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
					data.model = 'v1.1'
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					const response_four = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
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
										1] = {
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
											textNumber: info.replace(/[\r\n]/g, "").length,
											loading: load_state
										}

										if (load_state) { //保存记录
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
					data.model = 'chatglm_pro'; // ChatGLM必传参数
					const response_six = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
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
										1] = {
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
											completion_tokens,
											prompt_tokens,
											all_tokens,
											textNumber: info.replace(/[\r\n]/g, "").length,
											loading: load_state
										}

										if (load_state) { //保存记录
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
					data.model = 'qwen-turbo';
					const response_seven = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
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
										1] = {
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
							console.log(chat, 880);
							let chatArr = chat.split('\r\n');

							chatArr.forEach(val => {
								if (val != '') {
									let res = JSON.parse(val);

									if (res.code) {
										if (res.code < 49999) {
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
											loading: load_state
										}

										if (load_state) { //保存记录
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
					data.model = '360GPT_S2_V9'; // ChatGLM必传参数
					const response_eight = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
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
										1] = {
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
												chat_type: -5,
												action_type: 2,
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
											loading: load_state
										}

										if (load_state) { //保存记录
											let save_val = {
												"type_name": "360智脑",
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
				if (this.listName == 'eleven') {
					var num_eleven = 0
					this.messageList[this.listName].push({
						talk: `思考中,耗时${num_eleven}秒`,
						type: 'assistant'
					})
					this.eleven_shi = setInterval(() => {
						num_eleven++
					}, 1000)
					this.t_time_eleven = setInterval(() => {
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
							talk: `思考中,耗时${num_eleven}秒`,
							type: 'assistant',
							is_time: true
						}
						this.$forceUpdate()
					}, 1000)
					// ==========================================
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.controller_eleven = new AbortController()
					data.model = 'ChatStd'
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					const response_eleven = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': 'h5'
						},
						body: JSON.stringify(data),
						signal: this.controller_eleven.signal
					}).catch(err => {
						// console.log(err);
					});
					// console.log(response, response == undefined);
					if (response_eleven.status == '400') {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_eleven);
						clearInterval(this.eleven_shi);
						response_eleven.json().then((res) => {
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
										1] = {
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

					if (response_eleven == undefined) {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_eleven);
						clearInterval(this.eleven_shi);
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



					if (!response_eleven.ok) {
						// this.isfinish = true
						this.$message.error(response_eleven.statusText);
						return;
					}

					const reader = response_eleven.body.getReader();
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
										clearInterval(this.t_time_eleven)

										//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num_eleven,
											code: 200,
											is_time: true,
											history: false,
											status,
											textNumber: info.replace(/[\r\n]/g, "").length,
											loading: load_state
										}

										if (load_state) { //保存记录
											let save_val = {
												"type_name": "腾讯混元",
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
				if (this.listName == 'twelve') {
					var num_twelve = 0
					this.messageList[this.listName].push({
						talk: `思考中,耗时${num_twelve}秒`,
						type: 'assistant'
					})
					this.twelve_shi = setInterval(() => {
						num_twelve++
					}, 1000)
					this.t_time_twelve = setInterval(() => {
						this.messageList[this.listName][this.messageList[this.listName].length - 1] = {
							talk: `思考中,耗时${num_twelve}秒`,
							type: 'assistant',
							is_time: true
						}
						this.$forceUpdate()
					}, 1000)
					// ==========================================
					const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
					this.controller_twelve = new AbortController()
					data.model = 'skylark-chat'
					// const response = await fetch(global.baseUrl+'/api/chat/chat_session', { 
					const response_twelve = await fetch(global.baseUrl + '/api/chat/async_chat_completion', {
						method: "POST",
						headers: {
							"Content-Type": 'application/json',
							'Accept': '*/*',
							'authorization': userInfo.token,
							'role': userInfo.role,
							'source': 'h5'
						},
						body: JSON.stringify(data),
						signal: this.controller_twelve.signal
					}).catch(err => {
						// console.log(err);
					});
					// console.log(response, response == undefined);
					if (response_twelve.status == '400') {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_twelve);
						clearInterval(this.twelve_shi);
						response_twelve.json().then((res) => {
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
										1] = {
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

					if (response_twelve == undefined) {
						// this.isfinish = true // 结束
						// fetch请求错误时的body内容
						clearInterval(this.t_time_twelve);
						clearInterval(this.twelve_shi);
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



					if (!response_twelve.ok) {
						// this.isfinish = true
						this.$message.error(response_twelve.statusText);
						return;
					}

					const reader = response_twelve.body.getReader();
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
										clearInterval(this.t_time_twelve)

										//重置最后一条信息
										this.messageList[tabType][this.messageList[tabType].length - 1] = {
											talk: info,
											type: 'assistant',
											time: num_twelve,
											code: 200,
											is_time: true,
											history: false,
											status,
											textNumber: info.replace(/[\r\n]/g, "").length,
											loading: load_state
										}

										if (load_state) { //保存记录
											let save_val = {
												"type_name": "火山云雀",
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


			// 停止回答
			stopChat() {

				if (this.listName == 'three') {
					this.stop_three = true
					this.requestTask_three.abort();
					clearInterval(this.three_shi)
					clearInterval(this.three_time)
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
				} else if (this.listName == 'four') {
					this.stop_four = true
					this.requestTask_four.abort();
					clearInterval(this.four_shi)
					clearInterval(this.four_time)
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
				} else if (this.listName == 'six') {
					this.stop_six = true
					this.requestTask_six.abort();
					clearInterval(this.six_shi)
					clearInterval(this.six_time)
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
				} else if (this.listName == 'seven') {
					this.stop_seven = true
					this.requestTask_seven.abort();
					clearInterval(this.seven_shi)
					clearInterval(this.seven_time)
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
				} else if (this.listName == 'eight') {
					this.stop_eight = true
					this.requestTask_eight.abort();
					clearInterval(this.eight_shi)
					clearInterval(this.eight_time)
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
				} else if (this.listName == 'eleven') {
					this.stop_eleven = true
					this.requestTask_eleven.abort();
					clearInterval(this.eleven_shi)
					clearInterval(this.eleven_time)
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
				} else if (this.listName == 'twelve') {
					this.stop_twelve = true
					this.requestTask_twelve.abort();
					clearInterval(this.twelve_shi)
					clearInterval(this.twelve_time)
					this.messageList[this.listName][this.messageList[this.listName].length - 1].loading = true
				}

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

			// 停止开始回答
			stopStart() {
				if (this.listName == 'three') {
					this.stop_three = true
					this.requestTask_three.abort();
					clearInterval(this.three_shi)
					clearInterval(this.three_time)
					this.messageList.three.pop()
				} else if (this.listName == 'four') {
					this.stop_four = true
					this.requestTask_four.abort();
					clearInterval(this.four_shi)
					clearInterval(this.four_time)
					this.messageList.four.pop()
				} else if (this.listName == 'six') {
					this.stop_six = true
					this.requestTask_six.abort();
					clearInterval(this.six_shi)
					clearInterval(this.six_time)
					this.messageList.six.pop()
				} else if (this.listName == 'seven') {
					this.stop_seven = true
					this.requestTask_seven.abort();
					clearInterval(this.seven_shi)
					clearInterval(this.seven_time)
					this.messageList.seven.pop()
				} else if (this.listName == 'eight') {
					this.stop_eight = true
					this.requestTask_eight.abort();
					clearInterval(this.eight_shi)
					clearInterval(this.eight_time)
					this.messageList.eight.pop()
				} else if (this.listName == 'twelve') {
					this.stop_twelve = true
					this.requestTask_twelve.abort();
					clearInterval(this.twelve_shi)
					clearInterval(this.twelve_time)
					this.messageList.twelve.pop()
				} else if (this.listName == 'eleven') {
					this.stop_eleven = true
					this.requestTask_eleven.abort();
					clearInterval(this.eleven_shi)
					clearInterval(this.eleven_time)
					this.messageList.eleven.pop()
				}
				this.isPosition = false
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
				if (this.listName == 'three' || this.listName == 'five' || this.listName == 'six' || this.listName ==
					'seven' || this.listName == 'eight' || this.listName == 'twelve' || this.listName == 'eleven') {
					this.supplement.msg_list = [{
							role: 'user',
							content: this.sessionList[this.listName][this.sessionList[this.listName].length - 1]
								.talk
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

				this.sessionList[this.listName] = []
				this.sessionList[this.listName].push({
					talk: this.complete,
					type: 'user'
				})
				this.messageList[this.listName] = [];
				//把数据变成JSON
				this.supplement.msg_list = JSON.stringify(this.supplement.msg_list)
				this.show = false


				this.complete = ""

				await this.creatChatFun(this.supplement, 'continue')
				this.$forceUpdate()

			},
			back() {
				uni.navigateBack(1)
			},
			toBottom() {
				// console.log('出发了')
				let that = this;
				this.$nextTick(() => {
					setTimeout(() => {
						uni.createSelectorQuery().select(".chat_cont").boundingClientRect(function(
							res) { //定位到你要的class的位置
							// console.log(res,330);
							// console.log(res.height,410)
							uni.pageScrollTo({
								scrollTop: res.height,
								duration: 0
							});
						}).exec()
					}, 1500)
				})
			},
			addTag(index) {
				this.tagIndex = index;
				this.tagShow = true
			},



			closeTag() {
				this.tagName = ''
				this.tagShow = false
			},

			confirmTag() {
				if (this.tagName == '') {
					this.$api.msg('请输入标签名称')
				}
				// this.options[this.tagIndex].tagList.push(this.tagName)
				this.tagList.push(this.tagName)
				this.tagShow = false;
				this.tagName = '';
				this.$forceUpdate()
			},

			//删除标签
			delTag(index) {
				// this.options[index].tagList.splice(index, 1)
				this.tagList.splice(index, 1)
				this.$forceUpdate()
			},
			//评价回调文心一言
			evaluate2(type, index) {

				if (this.evaluateType2[index] == type) {
					this.evaluateType2[index] = undefined
					type = 0
				} else {
					this.evaluateType2[index] = type
				}


				// console.log('dian', this.evaluateType2)
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
			//评价回调通义千问
			evaluate6(type, index) {

				if (this.evaluateType6[index] == type) {
					this.evaluateType6[index] = undefined
					type = 0
				} else {
					this.evaluateType6[index] = type
				}


				// console.log('dian', this.evaluateType5)
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
			toHis() {
				uni.navigateTo({
					url: '/childCont/repository/agent_his?item=' + this.item
				})
			},
			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},
		}
	}
</script>

<style lang="less" scoped>
	.main {
		padding: 32rpx;
		border-radius: 16rpx;
		background: #FFF;
	}

	.avatar {
		width: 216rpx;
		height: 216rpx;
		border-radius: 50%;
	}

	.name {
		color: #000;
		font-size: 40rpx;
		font-weight: 500;
		margin-top: 24rpx;
	}

	.txt {
		color: #666;
		font-size: 24rpx;
		font-weight: 400;
		margin: 8rpx 0 24rpx 0;
	}

	.surround {
		border-radius: 16rx;
		border: 2rpx solid #D7D9DF;
		padding: 24rpx;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
	}

	.headBtn {
		display: flex;
		justify-content: center;
		margin-bottom: 64rpx;
	}

	.headBtn_i {
		margin-left: 24rpx;
		padding: 16rpx;
		display: flex;
		align-items: center;
		border-radius: 8rpx;
		background: #1F64FF;

		.icon {
			width: 32rpx;
			height: 32rpx;
		}
	}

	.title {
		color: #FFF;
		font-size: 24rpx;
		font-weight: 400;
		margin-left: 8rpx;
	}

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

	.tab_model {
		display: flex;
		margin-top: 96rpx;
	}

	.l_chat {
		border-radius: 6upx;
		border: 1upx solid #DCDCDC;
		padding: 5upx 10upx;
		color: #000;
		font-size: 24upx;
		font-style: normal;
		font-weight: 400;
		line-height: 150%;
		margin-bottom: 10upx;
		display: flex;
		align-items: center;
		margin-right: 24rpx;

		.l_text {
			padding-left: 8upx;
		}
	}

	.u-page__tag-item {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin: 0 10upx 0 0;
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
		word-break: break-all;
		color: #333;

	}

	.edit {
		word-break: break-all;
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

	.lists {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 20upx;
		background: #fff;
		border-radius: 8upx;
		border: 1upx solid #dadbde;
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
</style>