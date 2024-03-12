<template>
	<view>
		<!-- 内容 -->
		<view class="chat_cont">
			
			<view class="cont_li">
				
				<view class="chat_text" v-if="industryIndex == '1003'">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">头像</text>
					</view>
					<view class="qs_img">
						<view v-for="(val, index) in qsImg" :key="index" style="position: relative;">
							<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
							<img class="del_img" :src="delImg" alt="" @click="qsImg.splice(index,1)"/>
						</view>
						<img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(1)" v-if="qsImg.length == 0"/>
					</view>
					<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
					
				</view>
				
				<view class="chat_text" v-if="industryIndex == '1003'">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">人物名称</text>
					</view>
					<u--input placeholder="例如，阿尔伯特·爱因斯坦" border="surround" maxlength="30" v-model="nameValue"></u--input>
				</view>
				
				<view class="chat_text" v-if="industryIndex == '1003'">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">人物问候语</text>
					</view>
					<u-textarea v-model="greetValue" placeholder="例如，“阿尔伯特·爱因斯坦”可能会说：“大家好，我是阿尔伯特·爱因斯坦。我生于 1879 年 3 月 14 日，我提出了狭义相对论和广义相对论。”" maxlength="-1" ></u-textarea>
				</view>
				
				<view class="chat_text" v-if="industryIndex != '1003'">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">标题</text>
					</view>
					<u--input placeholder="例如，机器学习工程师" border="surround" maxlength="30" v-model="titleValue"></u--input>
				</view>
				
				<view class="chat_text" v-if="industryIndex != '1003'">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">内容</text>
					</view>
					<u-textarea v-model="contentValue" placeholder="我是机器学习工程师。我会写一些机器学习的概念，你遇到那些问题可以直接问我:" maxlength="-1" ></u-textarea>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">是否公开</text>
					</view>
					<view class="lists" @click="openRole">
						<view class="txt">{{ roleValue }}</view>
						<!-- <image class="right_img" src='@/static/images/right.png' /> -->
						<u-icon name="arrow-down" color="#666" size="16"></u-icon>
					</view>
				</view>
				
				<view class="cont_title">
					<view class="title_li">
						<text class="title_l"></text>
						<text class="title_r">高级设置</text>
					</view>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_r">隐性词</text>
					</view>
					<u-textarea v-model="hideValue" placeholder="例如，我是“阿尔伯特·爱因斯坦”：用户问我问题请以阿尔伯特·爱因斯坦口吻回复用户" maxlength="-1" ></u-textarea>
					<view style="color: #9A9A9A; font-size: 22upx; padding: 10upx;">隐性提示词不会显示在平台上，用于大模型训练完善聊天质量</view>
				</view>
				
				<view class="chat_text" v-if="industryIndex == '1003'">
					<view class="text_cont">
						<text class="text_r">人物介绍</text>
					</view>
					<u-textarea v-model="sloveValue" placeholder="请输入人物介绍" maxlength="-1" ></u-textarea>
				</view>
				
				<view class="chat_text" v-if="industryIndex == '1003'">
					<view class="text_cont">
						<text class="text_r">主要影响</text>
					</view>
					<u-textarea v-model="importValue" placeholder="输入相关内容" maxlength="-1" ></u-textarea>
				</view>
				
				<view class="cont_title" v-if="industryIndex != '1003'">
					<view class="title_li">
						<text class="title_l"></text>
						<text class="title_r">对话相关</text>
					</view>
					<view class="text_u" @click="addForm">
						<image class="add_img" :src='addImg'/>
						<text class="add_li">添加</text>
					</view>
				</view>
				
				<view v-if="formList.length > 0 && industryIndex != '1003'">
					<view class="form_list" v-for="(item, index) in formList" :key="index">
						<view class="form_li">
							<view class="list_title">
								<view class="title_l">类型</view>
								<view class="title_r">
									<image class="add_img" :src='editImg' @click="editForm(index)"/>
									<image class="add_img" :src='trashImg' @click="formList.splice(index, 1)"/>
								</view>
							</view>
							<view class="list_cont" v-if="item.type_id == '438600126748678'">文本框</view>
							<view class="list_cont" v-if="item.type_id == '438257565440006'">输入框</view>
							<view class="list_cont" v-if="item.type_id == '438260526168070'">标签</view>
							<view class="list_cont" v-if="item.type_id == '438257788905478'">单选</view>
							<view class="list_cont" v-if="item.type_id == '438257535715334'">多选</view>
						</view>
						
						<view class="form_li">
							<view class="list_title">
								<view class="title_l">标题</view>
							</view>
							<view class="list_cont">{{ item.title }}</view>
						</view>
						
						<view class="form_li" v-if="item.type_id  != '438260526168070'">
							<view class="list_title">
								<view class="title_l">提示语</view>
							</view>
							<view class="list_cont">{{ item.placeholder }}</view>
						</view>
						
						<view class="form_li" v-if="(item.type_id  == '438260526168070' || item.type_id  == '438257788905478' || item.type_id  == '438257535715334') && item.info_options.length > 0">
							<view class="list_title">
								<view class="title_l" v-if="item.type_id  == '438257788905478' || item.type_id  == '438257535715334'">选项</view>
								<view class="title_l" v-else>标签</view>
							</view>
							<view class="list_cont">
								<text style="padding: 10upx;" v-for="(tip, index1) in item.info_options" :key="index1">{{ tip.value }}</text>
							</view>
						</view>
						
					</view>
				</view>
				<view class="on_order_list" v-if="formList.length == 0 && industryIndex != '1003'">暂无相关内容!</view>
				
				
				<view class="cont_title" v-if="industryIndex == '1003'">
					<view class="title_li">
						<text class="title_l"></text>
						<text class="title_r">人物知识库</text>
					</view>
				</view>
				
				<view class="cont_title" v-else>
					<view class="title_li">
						<text class="title_l"></text>
						<text class="title_r">人物知识库</text>
					</view>
				</view>
				
				<view class="chat_text">
					<view class="text_conts">
						<text class="text_r">文档</text>
						<view class="text_u" @click="uploadFile" v-if="fileList.length < 10">
							<text class="u_li">上传文档</text>
							<image class="right_img" src='@/static/images/right.png' />
						</view>
					</view>
					<view class="qs_img" style="border-top: 1upx solid #E8E9EB;" v-if="fileList.length > 0">
						<view v-for="(val, index) in fileList" :key="index" class="file_li">
							<view class="li_text">
								<img class="l_img" :src="leftImg" alt=""/>
								<view class="file_text">
									<text class="file_url">{{ val.file_name }}</text>
								</view>
								<u-icon name="trash" size="20" @click="fileList.splice(index,1)"></u-icon>
							</view>
						</view>
						
					</view>
					<view class="img_text">文档资料上传可包含，DOC、XISX、PPT、TXT文档</view>
					
				</view>
				
				<view class="chat_text">
					<view class="text_conts">
						<text class="text_r">图片</text>
						<view class="text_u" @click="uploadImg(2)" v-if="fileImg.length < 10">
							<text class="u_li">上传图片</text>
							<image class="right_img" src='@/static/images/right.png' />
						</view>
					</view>
					<view class="qs_img" v-if="fileImg.length > 0">
						<view v-for="(val, index) in fileImg" :key="index" style="position: relative">
							<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
							<img class="del_img" :src="delImg" alt="" @click="fileImg.splice(index,1)"/>
						</view>
						<!-- <img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(2)" v-if="fileImg.length < 10"/> -->
					</view>
					<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
					
				</view>
				
				<!-- <view class="chat_text">
					<view class="text_conts">
						<text class="text_r">视频</text>
						<view class="text_u" @click="uploadVideo(3)" v-if="vidioList.length < 10">
							<text class="u_li">上传视频</text>
							<image class="right_img" src='@/static/images/right.png' />
						</view>
					</view>
					<view class="qs_img" v-if="vidioList.length > 0">
						<view v-for="(val, index) in vidioList" :key="index" style="position: relative;">
							<video :src="getImgUrl(val.file_url)" class="up_img"></video>
							<img class="del_img" :src="delImg" alt="" @click="vidioList.splice(index,1)"/>
						</view>
					</view>
					<view class="img_text">文件资料上传可包含，FLV、RMVB、MP4、MVB文件</view>
					
				</view> -->
				
				<view class="chat_text">
					<view class="text_conts">
						<text class="text_r">网址</text>
						<view class="text_u" @click="addWebsite">
							<image class="add_img" :src='addImg'/>
							<text class="add_li">添加</text>
						</view>
					</view>
					<view v-for="(item, index) in product_website" :key="index">
						<view style="margin-top: 10upx; display: flex;">
							<u--input placeholder="请输入网址" border="surround" v-model="item.file_url"></u--input>
							<u-icon name="trash" size="20" v-if="index > 0" @click="product_website.splice(index,1)"></u-icon>
						</view>
						
					</view>
					
				</view>
			</view>
			
			
			<!-- 角色权限选择 -->
			<u-picker :show="roleShow" :columns="roleList" v-model="roleIndex" keyName="label" @cancel="roleShow = false" @confirm="roleSubmit"></u-picker>
			
			<!-- form弹窗 -->
			<u-popup :show="formShow" mode="bottom" :round="10" :closeable="true" zIndex="10000" :overlayStyle="{'z-index': '9999'}" @close="closePopup" @open="formShow = true">
				<view class="dia_cont">
					<view class="chat_text" style="padding-top: 50rpx;">
						<view class="text_cont">
							<text class="text_l">*</text>
							<text class="text_r">类型</text>
						</view>
						<view class="type_r">
							<view @click="version(438600126748678)" :class="[active == '438600126748678' ? 'active_tabs' : 'tabs']">文本框</view>
							<view @click="version(438257565440006)" :class="[active == '438257565440006' ? 'active_tabs' : 'tabs']">输入框</view>
							<view @click="version(438260526168070)" :class="[active == '438260526168070' ? 'active_tabs' : 'tabs']">标签</view>
							<view @click="version(438257788905478)" :class="[active == '438257788905478' ? 'active_tabs' : 'tabs']">单选</view>
							<view @click="version(438257535715334)" :class="[active == '438257535715334' ? 'active_tabs' : 'tabs']">多选</view>
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
					
					<view class="chat_text" v-if="active == '438260526168070' || active == '438257788905478' || active == '438257535715334'">
						<view class="text_cont">
							<text class="text_l" v-if="active == '438257788905478' || active == '438257535715334'">*</text>
							<text class="text_r" v-if="active == '438257788905478' || active == '438257535715334'">选项内容</text>
							<text class="text_r" v-else>标签内容</text>
						</view>
						<view style="display: flex; flex-wrap: wrap; align-items: center;"  >
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
						<u-radio-group 
						    v-model="radioValue"
						    placement="row"
							@change="radioChange">
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
			<u-modal :show="tagShow" @cancel="closeTag" confirmText="添加" confirmColor="#1F64FF;" :showCancelButton='true'
				@confirm="confirmTag">
				<view class="key_cont" style="">
					<view class="title">添加标签</view>
					<u-input :customStyle='{"padding":"8px", "width":"100%"}' inputAlign="center" v-model="tagName" 
						maxlength="10"aceholder="请输入标签" type="text" ></u-input>
				</view>
			</u-modal>
			
			
		</view>
		
		<view class="bottom">
			<view class="bottom_text">以上信息越完善，能够更好地分析问题，增强问题解决的能力。</view>
			<view class="bottom_cont">
				<view class="bottom_buy" @click="addRole">提交</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { creatUserModel, getUserCont, editUserModel } from '@/apis/user.js'
	export default {
		data() {
			return {
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
				roleValue: '公开: 任何人都可以聊天',
				roleIndex: 1,
				roleShow: false,
				roleList: [
					[{
						label: '公开: 任何人都可以聊天',
						id: 1

					}, {
						label: '私有: 只有您可以聊天',
						id: 0
					}]
				],
				
				
				greetValue: '', //问候语
				nameValue: '', // 角色姓名 
				hideValue: '', //隐性词
				sloveValue: '', // 人物介绍
				importValue: '', //主要影响
				product_website: [{file_url: '', file_name: ''}], //网址
				
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
				editIndex: '',// 是否处于编辑状态
				
				qsImg: [], // 头像图片
				fileImg: [], //文件图片
				vidioList: [], // 视频文件
				fileList: [], //文件
				fileUrl: [],
				leftImg: global.baseImg+'/xcx/24487314-1f72-473d-9886-57f8dbcb493a.jpg',
				rightImg: global.baseImg+'/xcx/3cf875c1-422f-43a0-88c9-ea9aa063f69e.jpg',
				delImg: global.baseImg+'/xcx/853ff4b9-283a-4917-b922-f2329cbcb562.jpg',
				addImg: global.baseImg+'/xcx/01fece57-06c7-4eff-ab60-671230d86f80.jpg',
				editImg: global.baseImg+'/xcx/3a697e5b-5fcc-4e83-a5c5-233b944e1e2b.jpg',
				trashImg: global.baseImg+'/xcx/c5ef20da-a969-4cfd-9906-f00658f14e94.jpg',
			}
		},
		components: {
			
		},
		onLoad(option) {
			// console.log(JSON.parse(option.item),774)
			if(option.item) {
				this.info = JSON.parse(option.item);
				this.industryIndex = this.info.industryIndex;
			}
			if(option.question_id) {
				this.question_id = option.question_id
			} else {
				this.question_id = ''
			}
			
		},
		onShow() {
			if(this.question_id != '') {
				this.getUserCont()
			}
			
		},
		methods: {
			
			// 获取详情
			getUserCont() {
			  let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			  let val = {
				  'user_id': userInfo.user_id,
				  'question_id': this.question_id,
			  }
			  getUserCont(val).then(res => {
				  if (res.code == 20000) {
					  let data = res.data[0];
					  this.question_id = data.question_id
					  this.info.industry_id = data.industry_id
					  this.info.module_id = data.module_id
					  this.info.occu_id = data.occu_id
					  this.info.sub_occu_id = data.sub_occu_id
					  this.info.emp_duration_id = data.emp_duration_id
					  this.info.expertise_level_id = data.expertise_level_id
					  
					  this.nameValue = data.character_name//人物名称
					  this.greetValue = data.character_greetings//人物问候语
					  this.roleIndex = data.is_public//是否公开
					  this.hideValue = data.hint//隐性提示词
					  this.sloveValue = data.character_desc//人物描述
					  this.importValue = data.character_achievements//人物描述
					  
					  this.titleValue = data.assistant_title//助手标题
					  this.contentValue = data.assistant_content//助手提示语
					  this.fileList = data.files.file
					  this.vidioList = data.files.video
					  this.fileImg = data.files.pics
					  this.product_website = data.files.url
					  this.formList = data.question_data
					  
					  if(this.formList.length > 0) {
						  this.industryIndex = 4
					  } else {
						  this.industryIndex = data.industry_id
					  }
					  if(data.character_avatar != '') {
						  this.qsImg = []
						  let val = { 'file_url': data.character_avatar, 'file_name':'' }
						  this.qsImg.push(val)
					  }
					  
					  if(this.roleIndex == 1) {
						  this.roleValue = '公开: 任何人都可以聊天'
					  } else {
						  this.roleValue = '私有: 只有您可以聊天'
					  }
				  } else {
					  this.$api.msg(res.msg);
				  }
			  }).catch(err => {
				  this.$api.msg('获取详情失败');
			  })
			},
			
			// 打开角色弹窗
			openRole() {
				this.roleShow = true;
			},
			roleSubmit(e) {
				this.roleIndex = e.value[0].id;
				this.roleValue = e.value[0].label;
				this.roleShow = false;
			},
			
			
			// 上传图片
			uploadImg(val) {
				let that = this;
				uni.chooseImage({
				  count: 1,
                  sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				  sourceType: ['album', 'camera'],
				  success(res) {
				    // console.log(res.tempFiles)
					const tempFilePaths = res.tempFilePaths[0];
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
							console.log(imgData,333)
							if(imgData.code == 20000) {
								let name = imgData.data.name
								let url = imgData.data.new_url
								let data = {
									file_url: url,
									file_name: name
								}
								if(val == 1) {
									that.qsImg.push(data)
								} else if(val == 2) {
									that.fileImg.push(data)
								} else {
									that.vidioList.push(data)
								}
								
							} else {
								that.$api.msg(imgData.msg)
							}
						}
					});
				  }
				})
			},
			
			// 上传视频
			uploadVideo(val) {
				let that = this;
				uni.chooseVideo({
				  sourceType: ['album', 'camera'],
				  maxDuration: 30,
				  camera: 'back',
				  success(res) {
				    // console.log(res.tempFiles)
					const tempFilePaths = res.tempFilePath;
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
							console.log(imgData,333)
							if(imgData.code == 20000) {
								let name = imgData.data.name
								let url = imgData.data.new_url
								let data = {
									file_url: url,
									file_name: name
								}
								if(val == 1) {
									that.qsImg.push(data)
								} else if(val == 2) {
									that.fileImg.push(data)
								} else {
									that.vidioList.push(data)
								}
								
							} else {
								that.$api.msg(imgData.msg)
							}
						}
					});
				  }
				})
			},
			
			// 上传文件
			uploadFile() {
				let that = this;
				wx.chooseFile({
				  count: 9,
				  type: 'file',
				  success (res) {
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
							console.log(imgData,1258)
							if(imgData.code == 20000) {
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
						}
					});
				  }
				})
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			// 新增网址
			addWebsite() {
				this.product_website.push({ file_url: '', file_name: ''})
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
				if(this.tagName.trim() == '') {
					this.$api.msg('请输入标签名称')
					return
				}
				let data = { 'value': this.tagName }
				this.tagList.push(data)
				this.tagShow = false;
				this.tagName = '';
				// console.log(this.tagList,666)
			},
			
			//删除标签
			delTag(index) {
				this.tagList.splice(index,1)
				this.$forceUpdate()
			},
			
			//是否必选
			radioChange(e) {
				console.log(e,885)
				this.radioValue = e
			},
			
			//增加form列表内容
			addList() {
				if(this.formTitle == '') {
					this.$api.msg('请输入标题')
					return
				}
				
				if(this.formText == '' && this.active != "438260526168070") {
					this.$api.msg('请输入提示语')
					return
				}
				
				if(this.tagList.length == 0 && (this.active == '438257788905478' || this.active == '438257535715334')) {
					this.$api.msg('请填写选项内容')
					return
				}
				
				if(this.tagList.length == 0) {
					const tag = { value: '' }
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
				
				if((this.editIndex != '' && this.editIndex != null) || this.editIndex === 0) {
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
				if(this.industryIndex == '1003') {
					if(this.qsImg.length == 0) {
						this.$api.msg('请选择头像图片')
						return
					}
					if(this.nameValue == '') {
						this.$api.msg('请输入人物名称')
						return
					}
					if(this.greetValue == '') {
						this.$api.msg('请输入人物问候语')
						return
					}
					
				} else {
					
					if(this.titleValue == '') {
						this.$api.msg('请输入标题')
						return
					}
					if(this.contentValue == '') {
						this.$api.msg('请输入内容')
						return
					}
				}
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let avatar_url = '';
				if(this.qsImg.length == 0) {
					avatar_url = ''
				} else {
					avatar_url = this.qsImg[0].file_url
				}
				
				if(this.formList.length == 0) {
					const val = {
						type_id: '438600126748678',
						title: '内容',
						placeholder: '请输入内容',
						info_options: [{ value: '' }],
						is_required: 0,
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
					'character_name': this.nameValue,//人物名称
					'character_greetings': this.greetValue,//人物问候语
					'is_public': this.roleIndex ,//是否公开
					'hint': this.hideValue ,//隐性提示词
					'character_desc': this.sloveValue,//人物描述
					'character_achievements': this.importValue,//人物描述
					
					'assistant_title': this.titleValue,//助手标题
					'assistant_content': this.contentValue,//助手提示语
					'related_document': {
						'file': this.fileList,
						'video': this.vidioList,
						'pics': this.fileImg,
						'url': this.product_website
					},
					'info_questions': this.formList
				}
				
				if(this.question_id == '') {
					
					//添加
					creatUserModel(data).then(res => {
					  if (res.code == 20000) {
						 this.$api.msg('创建成功')
						 setTimeout(() => {
						 	uni.redirectTo({
						 		url: '/childPage/role/role'
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
					.text_u {
						display: flex;
						align-items: center;
						.u_li{
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
				}
				.text_r {
					color: #333;
					text-align: center;
					font-size: 24upx;
					font-style: normal;
					font-weight: 530;
					line-height: 26upx;
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
					border: 0.5px solid  #dadbde;
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
			margin: 0 5rpx;
		}
		.del_img {
			position: absolute;
			top: 0;
			right: 10rpx;
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
		.active_tabs{
			width: 22%;
			background: rgba(31, 100, 255, 0.15);;
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
	
</style>