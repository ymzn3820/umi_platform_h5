<template>
	<view>
		<!-- 内容 -->
		<view class="chat_cont">
			<view class="cont_li">
				<view class="cont_title">
					<view class="title_li">
						<text class="title_l"></text>
						<text class="title_r">基础设置</text>
					</view>
				</view>
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">分组</text>
					</view>
					<view class="lists" @click="roleShow=true">
						<view class="txt">{{ roleValue }}</view>
						<u-icon name="arrow-down" color="#666" size="16"></u-icon>
					</view>
				</view>
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">分类</text>
					</view>
					<view class="lists" @click="sortShow=true">
						<view class="txt">{{ sortValue }}</view>
						<u-icon name="arrow-down" color="#666" size="16"></u-icon>
					</view>
				</view>

				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">形象</text>
					</view>
					<view class="qs_img">
						<view v-for="(val, index) in qsImg" :key="index" style="position: relative;">
							<img class="up_img" :src="getImgUrl(val)" alt="" />
							<img class="del_img" :src="delImg" alt="" @click="qsImg.splice(index,1)" />
						</view>
						<img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(1)" />
					</view>
					<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
				</view>

				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">名称</text>
					</view>
					<u--input placeholder="例如:埃隆马斯克" border="surround" maxlength="30" v-model="nameValue"></u--input>
				</view>

				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">描述</text>
					</view>
					<u-textarea v-model="sloveValue"
						placeholder="例如，“阿尔伯特·爱因斯坦”可能会说：“大家好，我是阿尔伯特·爱因斯坦。我生于 1879 年3月14日，我提出了狭义相对论和广义相对论。”"
						maxlength="-1"></u-textarea>
				</view>

				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">智能体设定</text>
					</view>
					<u-textarea v-model="setValue"
						placeholder="例如，“阿尔伯特·爱因斯坦”可能会说：“大家好，我是阿尔伯特·爱因斯坦。我生于 1879 年3月14日，我提出了狭义相对论和广义相对论。”"
						maxlength="-1"></u-textarea>
				</view>

				<view class="cont_title">
					<view class="title_li">
						<text class="title_l"></text>
						<text class="title_r">高级设置</text>
					</view>
				</view>

				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">提示词</text>
					</view>
					<u-textarea v-model="hideValue" placeholder="例如，我是“阿尔伯特·爱因斯坦”：用户问我问题请以阿尔伯特·爱因斯坦口吻回复用户"
						maxlength="-1"></u-textarea>
				</view>

				<view class="img_text">隐性提示词不会显示在平台上，用于大模型训练完善聊天质量</view>



				<view class="cont_title">
					<view class="title_li">
						<text class="title_l"></text>
						<text class="title_r">更多高级设置</text>
					</view>
				</view>
				<view style="display: flex;justify-content: space-between;margin: 17rpx 0 16rpx 0;">
					<view style="display: flex;">
						<view class="img_text" style="color: #000;">示例</view>
						<view class="img_text" style="color: #000;margin-left: 16rpx;">可添加不同的对话示例</view>
					</view>
					<view class="img_text" style="color: #1F64FF;" @click="examShow=true">查看示例</view>
				</view>

				<view class="text_u" @click="addForm">
					<image class="add_img" :src='addImg' />
					<text class="add_li">添加</text>
				</view>

				<view v-if="formList.length > 0">
					<view class="form_list" v-for="(item, index) in formList" :key="index">

						<view class="form_li">
							<view class="list_title">
								<view class="title_l">类型</view>
								<view class="title_r">
									<image class="add_img" :src='editImg' @click="editForm(index)" />
									<image class="add_img" :src='trashImg' @click="formList.splice(index, 1)" />
								</view>
							</view>
						</view>

						<view class="form_li">
							<view class="list_title">
								<view class="title_l">标题</view>
							</view>
							<view class="list_cont">{{ item.title }}</view>
						</view>

						<view class="form_li">
							<view class="list_title">
								<view class="title_l">内容</view>
							</view>
							<view class="list_cont">{{ item.placeholder }}</view>
						</view>

					</view>
				</view>



				<view class="cont_title">
					<view class="title_li">
						<text class="title_l"></text>
						<text class="title_r">选择知识库</text>
					</view>
				</view>

				<view class="img_text">根据已配置的个人知识库，选择当前AI智能体使用的知识库内容</view>

				<view class="choose" @click="showCate">选择知识库</view>

				<view class="on_order_list" v-if="formList.length == 0 && industryIndex != '1003'">暂无相关内容!</view>
			</view>

			<!-- 选择知识库 -->
			<ba-tree-picker ref="treePicker" :multiple='true' :selectParent='false' @select-change="selectChange"
				title="选择知识库" confirmColor='#1F64FF' :localdata="listData" valueKey="id" textKey="name"
				childrenKey="children" />


			<!-- 分组选择 -->
			<u-picker :show="roleShow" :columns="roleListcolumns" v-model="roleIndex" keyName="label"
				@cancel="roleShow = false" @confirm="roleSubmit"></u-picker>
			<!-- 分类选择 -->
			<u-picker :show="sortShow" :columns="sortListcolumns" v-model="sortIndex" keyName="label"
				@cancel="sortShow = false" @confirm="sortSubmit"></u-picker>

			<!-- form弹窗 -->
			<u-popup :show="formShow" mode="bottom" :round="10" zIndex="10000" :overlayStyle="{'z-index': '9999'}"
				@close="closePopup" @open="formShow = true">
				<view class="dia_cont">
					<view class="chat_text" style="padding-top: 50rpx;">
						<view class="text_cont">
							<text class="text_l">*</text>
							<text class="text_r">类型</text>
						</view>
						<view class="type_r">
							<view @click="version(438600126748678)"
								:class="[active == '438600126748678' ? 'active_tabs' : 'tabs']">文本框</view>
							<view @click="version(438257565440006)"
								:class="[active == '438257565440006' ? 'active_tabs' : 'tabs']">输入框</view>
							<view @click="version(438260526168070)"
								:class="[active == '438260526168070' ? 'active_tabs' : 'tabs']">标签</view>
							<view @click="version(438257788905478)"
								:class="[active == '438257788905478' ? 'active_tabs' : 'tabs']">单选</view>
							<view @click="version(438257535715334)"
								:class="[active == '438257535715334' ? 'active_tabs' : 'tabs']">多选</view>
						</view>
					</view>

					<view class="chat_text">
						<view class="text_cont">
							<text class="text_l">*</text>
							<text class="text_r">标题</text>
						</view>
						<u--input placeholder="请输入标题" border="surround" maxlength="15" v-model="formTitle"></u--input>
					</view>

					<view class="chat_text" v-if="active != '438260526168070'">
						<view class="text_cont">
							<text class="text_l">*</text>
							<text class="text_r">提示语</text>
						</view>
						<u--input placeholder="请输入提示语" border="surround" maxlength="15" v-model="formText"></u--input>
					</view>

					<view class="chat_text"
						v-if="active == '438260526168070' || active == '438257788905478' || active == '438257535715334'">
						<view class="text_cont">
							<text class="text_l"
								v-if="active == '438257788905478' || active == '438257535715334'">*</text>
							<text class="text_r"
								v-if="active == '438257788905478' || active == '438257535715334'">选项内容</text>
							<text class="text_r" v-else>标签内容</text>
						</view>
						<view style="display: flex; flex-wrap: wrap; align-items: center;">
							<view class="u-page__tag-item" v-for="(tip, index1) in tagList" :key="index1">
								<u-tag :text="tip.value" size="mini" plain closable @close="delTag(index1)"></u-tag>
							</view>
							<view class="u-page__tag-item" style="margin-top: 10px;">
								<u-tag text="添加" size="mini" @click="addTag()"></u-tag>
							</view>
						</view>
					</view>

					<view class="chat_text">
						<view class="text_cont">
							<text class="text_l">*</text>
							<text class="text_r">是否必填</text>
						</view>
						<u-radio-group v-model="radioValue" placement="row" @change="radioChange">
							<u-radio label="否" name="0"></u-radio>
							<text style="margin-right: 20px;"></text>
							<u-radio label="是" name="1"></u-radio>
						</u-radio-group>
					</view>


					<view class="bottoms">
						<view class="bottom_cont" style="width: 100%;">
							<view class="bottom_buy" style="width: 100%;" @click="addList">添加</view>
						</view>
					</view>
				</view>
			</u-popup>

			<!-- 添加标签 -->
			<u-modal :show="tagShow" @cancel="closeTag" confirmText="添加" confirmColor="#1F64FF;"
				:showCancelButton='true' @confirm="confirmTag">
				<view class="key_cont" style="">
					<view class="title">添加标签</view>
					<u-input :customStyle='{"padding":"8px", "width":"100%"}' inputAlign="center" v-model="tagName"
						maxlength="10" aceholder="请输入标签" type="text"></u-input>
				</view>
			</u-modal>
			<!-- 查看示例 -->
			<u-popup :show="examShow" @close="examShow=false">
				<view @click="examShow=false" style="width: 75%;">
					<image :src="examImg" class="examImg" style="width: 75%;" mode="aspectFit"></image>
				</view>
			</u-popup>


		</view>

		<view class="bottom">
			<view class="bottom_text">以上信息越完善，能够更好地分析问题，增强问题解决的能力。</view>
			<view class="bottom_cont">
				<view class="bottom_buy" @click="submit()">提交</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		creatUserModel,
		getUserCont,
		editUserModel
	} from '@/apis/user.js'
	import {
		agentModels,
		groups_model,
		groups
	} from '@/apis/chat.js'
	import baTreePicker from "@/childCont/components/ba-tree-picker/ba-tree-picker.vue"
	export default {

		data() {
			return {
				examShow: false,
				listData: [],
				agent_id: '',




				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				question_id: '',
				industryIndex: '',
				info: {
					industry_id: '',
					module_id: '',
					occu_id: '',
					sub_occu_id: '',
					emp_duration_id: '',
					expertise_level_id: ''
				},
				// 角色权限
				roleValue: '',
				roleIndex: 1,
				roleShow: false,
				roleList: [],
				sortValue: '',
				sortIndex: 1,
				sortShow: false,
				sortList: [],
				sortListcolumns: [],
				roleListcolumns: [],

				greetValue: '', //问候语
				nameValue: '', // 角色姓名 
				hideValue: '', //隐性词
				setValue: '', //智能体设定
				sloveValue: '', // 人物介绍
				importValue: '', //主要影响
				product_website: [{
					file_url: '',
					file_name: ''
				}], //网址

				titleValue: '', //标题
				contentValue: '', //内容

				formShow: false,
				active: '438600126748678',
				formList: [],
				tagList: [],
				formTitle: '',
				formText: '',
				tagName: '',
				tagShow: false,
				radioValue: '0',
				editIndex: '', // 是否处于编辑状态

				qsImg: [], // 头像图片
				fileImg: [], //文件图片
				vidioList: [], // 视频文件
				fileList: [], //文件
				fileUrl: [],
				leftImg: global.baseImg + '/xcx/24487314-1f72-473d-9886-57f8dbcb493a.jpg',
				rightImg: global.baseImg + '/xcx/3cf875c1-422f-43a0-88c9-ea9aa063f69e.jpg',
				delImg: global.baseImg + '/xcx/853ff4b9-283a-4917-b922-f2329cbcb562.jpg',
				addImg: global.baseImg + '/xcx/01fece57-06c7-4eff-ab60-671230d86f80.jpg',
				editImg: global.baseImg + '/xcx/3a697e5b-5fcc-4e83-a5c5-233b944e1e2b.jpg',
				trashImg: global.baseImg + '/xcx/c5ef20da-a969-4cfd-9906-f00658f14e94.jpg',

				examImg: global.baseImg + '/xcx/com/message_center/查看示例.png',
				userInfo: JSON.parse(uni.getStorageSync('userInfo')),
				file_ids: []

			}
		},
		components: {
			baTreePicker
		},
		onLoad(option) {
			if (option.item) {
				this.info = JSON.parse(option.item);
				this.industryIndex = this.info.industryIndex;
			}
			if (option.question_id) {
				this.question_id = option.question_id
			} else {
				this.question_id = ''
			}
			let agent = ''
			if (option.val) {
				agent = JSON.parse(option.val)
			}

			if (agent) {
				console.log(agent,1448);
				this.agent_id = agent.agent_id
				if (agent.avatar_url) {
					this.qsImg[0] = agent.avatar_url
				}
				this.roleValue = agent.group_name
				this.sortValue = agent.agent_type_name
				this.nameValue = agent.agent_name
				this.sloveValue = agent.agent_desc
				this.setValue = agent.agent_character
				this.hideValue=agent.agent_prompt
				if(agent.options){
					const option = agent.options.options[0]
					const val2 = {
						type_id: option.info_type_id,
						title: option.title,
						placeholder: option.placeholder,
						info_options: [{
							value: option.options[0].value
						}],
						is_required: option.is_required,
						weight: option.weight
					}
					this.formList.push(val2)
				}
				
			}

		},
		onHide() {
			this.agent_id = ''
		},
		onShow() {
			if (this.question_id != '') {
				this.getUserCont()
			}

			this.getGroups()
			this.getGroupsModel()

		},
		methods: {
			// 获取用户所有分组
			getGroups() {
				let val = {
					user_id: this.userInfo.user_id
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

			// 获取用户的创建分组信息
			getGroupsModel() {
				let val = {
					user_id: this.userInfo.user_id
				}
				groups_model(val).then(res => {
					console.log(res, 699);
					let group_tree = res.data.group_tree
					let type_tree = res.data.type_tree
					if (res.code == 20000) {
						if (uni.getStorageSync('gro')) {
							let groArr = uni.getStorageSync('gro')

							let data = [{
								group_name: groArr.name,
								group_id: groArr.id,
								status: 1,
							}]
							group_tree[groArr.name] = data;
						}
						this.roleList[0] = Object.keys(group_tree)
						this.roleListcolumns = this.roleList
						this.sortList[0] = Object.keys(type_tree)
						this.sortListcolumns = this.sortList
						this.roleValue = this.roleList[0][0]
						this.sortValue = this.sortList[0][0]

					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					console.log(err);
					this.$api.msg('数据请求失败')
				})
			},
			showCate() {

				this.$refs.treePicker._show();

			},
			selectChange(ids, names) {
				this.file_ids = []
				console.log(ids, 'ids');
				this.file_ids = ids
				console.log(this.file_ids, 123);
			},
			submit() {
				if (this.qsImg.length == 0) {
					this.$api.msg('请添加形象图片')
					return
				}
				if (this.nameValue == '') {
					this.$api.msg('请填写名称')
					return
				}
				if (this.sloveValue == '') {
					this.$api.msg('请填写描述')
					return
				}
				if (this.setValue == '') {
					this.$api.msg('请填写智能体设定')
					return
				}
				if (this.hideValue == '') {
					this.$api.msg('请填写提示词')
					return
				}
				if (this.file_ids == '') {
					this.$api.msg('请选择知识库')
					return
				}


				let avatar_url = this.qsImg[0];

				if (this.formList.length == 0) {
					const val = {
						type_id: '438600126748678',
						title: '内容',
						placeholder: '请输入内容',
						info_options: [{
							value: ''
						}],
						is_required: 1,
						weight: 0
					}
					this.formList.push(val)
				}
				let agent_prompt = [this.hideValue]
				let val
				if (this.agent_id) {
					val = {
						"is_edit": 1,
						"agent_id": this.agent_id, //编辑id
						"user_id": this.userInfo.user_id,
						"group_name": this.roleValue,
						"group_order": 1,
						"agent_type": this.sortValue,
						"avatar_url": avatar_url,
						"agent_name": this.nameValue,
						"agent_desc": this.sloveValue,
						"agent_character": this.setValue,
						"file_ids": this.file_ids,
						"info_agent": this.formList,
						"agent_prompt": agent_prompt
					}
				} else {
					val = {
						"is_edit": 0,
						//"agent_id": "string",//编辑id
						"user_id": this.userInfo.user_id,
						"group_name": this.roleValue,
						"group_order": 1,
						"agent_type": this.sortValue,
						"avatar_url": avatar_url,
						"agent_name": this.nameValue,
						"agent_desc": this.sloveValue,
						"agent_character": this.setValue,
						"file_ids": this.file_ids,
						"info_agent": this.formList,
						"agent_prompt": agent_prompt
					}
				}

				agentModels(val).then(res => {
					if (res.code == 20000) {
						let data = {
							agent_id: 507334639537798,
							group_id: "507016304291462",
							group_order: 1
						}
						this.$api.msg('添加成功')
						uni.navigateTo({
							url: '/childCont/repository/repository'
						})


					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					console.log(err);
					this.$api.msg('添加失败')
				})
			},

			addAgentModels() {
				let data = {
					user_id: '',
					group_name: '',
					group_order: '',
					agent_type: '',
				}
				agentModels(data).then(res => {
					console.log(res, 6666);
				}).catch(err => {
					console.log(err);
				})
			},




			roleSubmit(e) {
				console.log(e, 1456)
				this.roleIndex = e.value[0].id;
				this.roleValue = e.value[0];
				this.roleShow = false;
			},
			sortSubmit(e) {
				console.log(e, 1456)
				this.sortIndex = e.value[0].id;
				this.sortValue = e.value[0];
				this.sortShow = false;
			},


			// 上传图片
			uploadImg() {
				let that = this;
				uni.chooseImage({
					count: 1,
					mediaType: ['image'],
					sourceType: ['album', 'camera'],
					// maxDuration: 30,
					// camera: 'back',
					success(res) {
						uni.showLoading({
							title: '上传中'
						});
						// console.log(res.tempFilePaths)
						const tempFilePaths = res.tempFilePaths[0];
						uni.uploadFile({
							url: global.loginUrl + '/api/user/oss_upload',
							filePath: tempFilePaths,
							name: 'image',
							formData: {
								"image": tempFilePaths,
								"oss_dir": 'static',
								"cate": 'problem_picture'
							},
							success: (uploadFileRes) => {
								let imgData = JSON.parse(uploadFileRes.data)
								if (imgData.code == 20000) {
									let url = imgData.data.new_url
									that.qsImg[0] = url
									uni.hideLoading()
									that.$forceUpdate()
								}
							}
						});
					}
				})
			},

			// 上传文件
			uploadFile() {
				let that = this;
				wx.chooseMessageFile({
					count: 9,
					type: 'file',
					success(res) {
						// tempFilePath可以作为img标签的src属性显示图片
						const tempFilePaths = res.tempFiles[0].path
						const image_name = res.tempFiles[0].name
						// console.log(tempFilePaths,774)
						uni.uploadFile({
							url: global.loginUrl + '/api/user/oss_upload',
							filePath: tempFilePaths,
							name: 'image',
							formData: {
								"image": tempFilePaths,
								"image_name": image_name,
								"oss_dir": 'static',
								"cate": 'create_character'
							},
							success: (uploadFileRes) => {
								let imgData = JSON.parse(uploadFileRes.data)
								console.log(imgData, 1258)
								if (imgData.code == 20000) {
									let name = imgData.data.name
									let url = imgData.data.new_url
									let data = {
										file_url: url,
										file_name: name
									}
									that.fileList.push(data)
									// that.fileUrl.push(url)
									console.log(that.fileList)
								} else {
									that.$api.msg(imgData.msg)
								}
							},
							fail: (res) => {
								that.$api.msg('上传失败')
							}
						});
					}
				})
			},

			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},



			// 添加表单
			addForm() {
				this.formShow = true;
				//初始化表单
				this.active = '438600126748678';
				this.formTitle = '';
				this.formText = '';
				this.tagList = [];
				this.radioValue = '0'
			},

			// 切换标签
			version(index) {
				this.active = index
			},
			//添加标签
			addTag(index) {
				// this.tagIndex = index;
				this.tagShow = true
			},

			closeTag() {
				this.tagName = ''
				this.tagShow = false
			},

			confirmTag() {
				if (this.tagName.trim() == '') {
					this.$api.msg('请输入标签名称')
					return
				}
				let data = {
					'value': this.tagName
				}
				this.tagList.push(data)
				this.tagShow = false;
				this.tagName = '';
				// console.log(this.tagList,666)
			},

			//删除标签
			delTag(index) {
				this.tagList.splice(index, 1)
				this.$forceUpdate()
			},

			//是否必选
			radioChange(e) {
				console.log(e, 885)
				this.radioValue = e
			},

			//增加form列表内容
			addList() {
				if (this.formTitle == '') {
					this.$api.msg('请输入标题')
					return
				}

				if (this.formText == '' && this.active != "438260526168070") {
					this.$api.msg('请输入提示语')
					return
				}

				if (this.tagList.length == 0 && (this.active == '438257788905478' || this.active == '438257535715334')) {
					this.$api.msg('请填写选项内容')
					return
				}

				if (this.tagList.length == 0) {
					const tag = {
						value: ''
					}
					this.tagList.push(tag)
				}

				// this.formList = []
				let data = {
					type_id: this.active,
					title: this.formTitle,
					placeholder: this.formText,
					info_options: this.tagList,
					is_required: this.radioValue,
					weight: 0
				}

				// console.log(data,1245)

				if ((this.editIndex != '' && this.editIndex != null) || this.editIndex === 0) {
					this.formList[this.editIndex].type_id = this.active
					this.formList[this.editIndex].title = this.formTitle
					this.formList[this.editIndex].placeholder = this.formText
					this.formList[this.editIndex].info_options = this.tagList
					this.formList[this.editIndex].is_required = this.radioValue
					this.editIndex = ''
					this.$forceUpdate()
				} else {
					this.formList.push(data);
					this.$forceUpdate()

				}

				this.formShow = false;
			},

			//编辑form
			editForm(index) {
				this.active = this.formList[index].type_id
				this.formTitle = this.formList[index].title
				this.formText = this.formList[index].placeholder
				this.tagList = this.formList[index].info_options
				this.radioValue = this.formList[index].is_required
				this.editIndex = index;
				// console.log(this.editIndex,2564)
				this.formShow = true;
			},

			//关闭弹窗
			closePopup() {
				this.editIndex = ''
				this.formShow = false
			},

			//提交角色
			addRole() {
				if (this.industryIndex == '1003') {
					if (this.qsImg.length == 0) {
						this.$api.msg('请选择头像图片')
						return
					}
					if (this.nameValue == '') {
						this.$api.msg('请输入人物名称')
						return
					}
					if (this.greetValue == '') {
						this.$api.msg('请输入人物问候语')
						return
					}

				} else {

					if (this.titleValue == '') {
						this.$api.msg('请输入标题')
						return
					}
					if (this.contentValue == '') {
						this.$api.msg('请输入内容')
						return
					}
				}
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let avatar_url = '';
				if (this.qsImg.length == 0) {
					avatar_url = ''
				} else {
					avatar_url = this.qsImg[0].file_url
				}
				if (this.formList.length == 0) {
					const val = {
						type_id: '438600126748678',
						title: '内容',
						placeholder: '请输入内容',
						info_options: [{
							value: ''
						}],
						is_required: 1,
						weight: 0
					}
					this.formList.push(val)
				}
				let data = {
					'user_id': userInfo.user_id,
					'industry_id': this.info.industry_id,
					'module_id': this.info.module_id,
					'occu_id': this.info.occu_id,
					'sub_occu_id': this.info.sub_occu_id,
					'emp_duration_id': this.info.emp_duration_id,
					'expertise_level_id': this.info.expertise_level_id,
					'character_avatar': avatar_url, // 头像
					'character_name': this.nameValue, //人物名称
					'character_greetings': this.greetValue, //人物问候语
					'is_public': this.roleIndex, //是否公开
					'hint': this.hideValue, //隐性提示词
					'character_desc': this.sloveValue, //人物描述
					'character_achievements': this.importValue, //人物描述

					'assistant_title': this.titleValue, //助手标题
					'assistant_content': this.contentValue, //助手提示语
					'related_document': {
						'file': this.fileList,
						'video': this.vidioList,
						'pics': this.fileImg,
						'url': this.product_website
					},
					'info_questions': this.formList
				}

				if (this.question_id == '') {

					//添加
					creatUserModel(data).then(res => {
						if (res.code == 20000) {
							this.$api.msg('创建成功')
							setTimeout(() => {
								uni.redirectTo({
									url: '/childCont/repository/repository'
								})
							}, 1500)

						} else {
							this.$api.msg(res.msg);
						}
					}).catch(err => {
						this.$api.msg('创建失败');
					})
				} else {
					//修改
					data.question_id = this.question_id;
					editUserModel(data).then(res => {
						if (res.code == 20000) {
							this.$api.msg('修改成功')
							setTimeout(() => {
								uni.redirectTo({
									url: '/childPage/role/role'
								})
							}, 1500)
							// this.getUserCont()
						} else {
							this.$api.msg(res.msg);
						}
					}).catch(err => {
						this.$api.msg('创建失败');
					})
				}

			},
			toIdea() {
				uni.navigateTo({
					url: '/childPage/answer/answer'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.chat_cont {
		padding: 30upx;

		.cont_li {
			padding: 25upx;
			background: #fff;
			border-radius: 15upx;
			margin-bottom: 150upx;

			.chat_text {
				width: 100%;
				padding: 20upx 0;

				/deep/.u-textarea {
					padding: 18upx;
					min-height: 100upx;
					max-height: 150upx;
					overflow-y: auto;
				}

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

				.text_conts {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 10upx;
					width: 100%;


				}

				.text_r {
					color: #000;
					text-align: center;
					font-size: 28upx;
					font-style: normal;
					font-weight: 530;
					line-height: 26upx;
					margin-bottom: 10rpx;
				}

				.right_img {
					width: 24upx;
					height: 24upx;
					margin-right: 25upx;
				}

				.lists {
					display: flex;
					flex-direction: row;
					align-items: center;
					padding: 20upx;
					background: #fff;
					border-radius: 8upx;
					border: 0.5px solid #dadbde;
					// margin-bottom: 25upx;

					.txt {
						font-size: 26upx;
						margin-left: 20upx;
						flex: 1;
					}

				}
			}
		}
	}

	.text_u {
		display: flex;
		align-items: center;
		margin: 16rpx 0 20rpx 0;

		.u_li {
			color: #9A9A9A;
			text-align: center;
			font-size: 22upx;
			font-style: normal;
			font-weight: 400;
			margin-right: 10upx;
		}

		.add_img {
			width: 28upx;
			height: 28upx;
		}

		.add_li {
			color: #1F64FF;
			font-size: 26upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			padding-left: 10upx;
		}
	}

	.qs_img {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		// margin: 20upx;
		flex-wrap: wrap;

		// border-top: 1upx solid #E8E9EB;
		.up_img {
			width: 120rpx;
			height: 120rpx;
			padding: 10rpx;
		}

		.del_img {
			position: absolute;
			top: 0;
			right: 0;
			width: 36upx;
			height: 36upx;
		}
	}

	.file_li {
		display: flex;
		flex-direction: column;
		padding: 20upx 0;
		width: 100%;

		.li_text {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.li_ul {
				display: flex;
				width: 80%;
			}

			.file_text {
				display: flex;
				width: 80%;

				.file_url {
					color: #666;
					font-size: 22upx;
					font-style: normal;
					font-weight: 400;
					padding: 10upx 15upx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 100%;
				}

			}

			.l_img {
				width: 40upx;
				height: 40upx;
			}

			.r_img {
				width: 36upx;
				height: 36upx;
			}
		}

	}

	.img_text {
		color: #9A9A9A;
		font-size: 24upx;
		font-style: normal;
		font-weight: 400;
	}

	.bottom {
		width: 100%;
		background: #ffffff;
		position: fixed;
		bottom: 0;
		z-index: 999;
	}

	.bottoms {
		width: 100%;
		background: #fff;
	}

	.bottom_text {
		color: #9A9A9A;
		font-size: 22upx;
		text-align: center;
		font-style: normal;
		font-weight: 400;
		line-height: 36upx;
		padding-top: 10upx;
	}

	.bottom_cont {
		display: flex;
		justify-content: center;
		flex-direction: column;
		padding-bottom: 25upx;
	}

	.bottom_buy {
		width: 90%;
		height: 80upx;
		background: #1F64FF;
		border-radius: 6px;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 20px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 10upx auto 0;
	}

	.cont_title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20upx 0;
		margin-left: -15rpx;

		.title_li {
			display: flex;
			align-items: center;
		}

		.title_l {
			width: 20px;
			height: 4px;
			background: #1F64FF;
			border-radius: 10px;
			transform: rotate(-90deg);
		}

		.title-r {
			font-weight: 550;
			font-size: 26upx;
			line-height: 150%;
			color: #333;
		}

		.text_u {
			display: flex;
			align-items: center;

			.add_img {
				width: 28upx;
				height: 28upx;
			}

			.add_li {
				color: #1F64FF;
				font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
				padding-left: 10upx;
			}
		}
	}

	.dia_cont {
		padding: 25upx;
		align-items: center;
		justify-content: center;

		.type_r {
			display: flex;
			align-items: center;
			// justify-content: space-around;
			flex-wrap: wrap;
			flex: 1;
		}

		.tabs {
			width: 22%;
			background: #f6f8fb;
			border-radius: 6upx;
			padding: 10upx 0;
			font-style: normal;
			font-weight: 500;
			font-size: 24upx;
			line-height: 150%;
			color: #333;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 10upx 1.5%;
		}

		.active_tabs {
			width: 22%;
			background: rgba(31, 100, 255, 0.15);
			;
			border-radius: 6upx;
			padding: 10upx 0;
			font-style: normal;
			font-weight: 500;
			font-size: 24upx;
			line-height: 150%;
			color: #1F64FF;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 10upx 1.5%;
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

		.u-page__tag-item {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			margin: 0 10upx 0 0;
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

		.title {
			font-weight: 500;
			font-size: 32upx;
			line-height: 48upx;
			color: #333;
			margin-bottom: 32upx;
		}
	}

	.form_list {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: column;
		background: #f6f8fb;
		border-radius: 8upx;
		padding: 20upx;
		margin-bottom: 15upx;
		width: calc(100% - 40upx);

		.form_li {
			padding: 10upx 0;
			width: 100%;
		}

		.list_title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;

			.title_l {
				color: #333;
				font-size: 26upx;
				font-weight: 500;
				line-height: 150%;
			}

			.title_r {
				display: flex;

				.add_img {
					width: 36upx;
					height: 36upx;
					margin-right: 15upx;
				}
			}
		}

		.list_cont {
			color: #9A9A9A;
			font-size: 26upx;
			font-style: normal;
			font-weight: 400;
			line-height: 150%;
			text-align: left;
			width: 100%;
		}
	}

	.on_order_list {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28upx;
		height: 100upx;
		line-height: 100upx;
		width: 100%;
		color: #C0C4CC;
	}

	.choose {
		border-radius: 4px;
		background: #1F64FF;
		padding: 12rpx 46rpx;
		color: #FFF;
		font-size: 28rpx;
		font-weight: 600;
		width: 38%;
	}
</style>