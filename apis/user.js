import {
	data
} from '../uni_modules/uview-ui/libs/mixin/mixin.js'
import {
	get,
	post,
	put,
	JsomPost,
	del,
	JsomPut
} from './util.js'

// 商务合作
export function business(data) {
	return post({
		url: global.memberUrl + '/pay/contact/',
		data: data
	})
}

// 卡密兑换
export function cardChange(data) {
	return post({
		url: global.memberUrl + '/pay/activate_code_consume/',
		data: data
	})
}

// 获取历史会话
// export function chatList(data){
// 	return get({
// 		url: global.baseUrl + '/api/chat/chat_session?page_size='+ data.page_size +'&page='+ data.page + '&title=' +data.title + '&chat_type=' +data.chat_type,
// 		data: ''
// 	})
// }

export function chatList(data) {
	return get({
		url: global.baseUrl + '/api/chat/chat_session',
		data: data
	})
}


// 获取历史绘画
export function drawList(data) {
	return get({
		url: global.baseUrl + '/api/chat/image_list',
		data: data
	})
}
// 获取sd历史绘画
export function sdDrawList(data) {
	return get({
		url: global.baseUrl + '/api/chat/chat_image',
		data: data
	})
}

// 获取历史订单
export function orderList(data) {
	return JsomPost({
		url: global.memberUrl + '/pay/orders/',
		data: data
	})
}

//获取行业详情
export function getIndustry(data) {
	return get({
		url: global.memberUrl + '/pay/industry/',
		data: ''
	})
}
//获取职业详情
export function getOccupation(data) {
	return post({
		url: global.memberUrl + '/pay/occupation/',
		data: data
	})
}

//获取子职业详情
export function getSec(data) {
	return post({
		url: global.memberUrl + '/pay/sec_occupation/',
		data: data
	})
}

//获取从业时间
export function getDuration(data) {
	return post({
		url: global.memberUrl + '/pay/occu_duration/',
		data: data
	})
}

//获取专业水平
export function getExpertise(data) {
	return post({
		url: global.memberUrl + '/pay/expertise_level/',
		data: data
	})
}

//获取操作
export function getModules(data) {
	return post({
		url: global.memberUrl + '/pay/modules/',
		data: data
	})
}

//获取问题集
export function getQuestions(data) {
	return post({
		url: global.memberUrl + '/pay/questions_set/',
		data: data
	})
}

//获取单个问题集
export function getQuestion(data) {
	return get({
		url: global.memberUrl + '/pay/questions_set/?module_id=' + data.module_id + '&question_id=' + data
			.question_id,
		data: ''
	})
}

// 分销信息
export function getDistribution(data) {
	return get({
		url: global.loginUrl + '/api/user/distribution_details',
		data: ''
	})
}

// 我的成员
export function getStaff(data) {
	return get({
		url: global.loginUrl + '/api/user/my_members?page_size=' + data.page_size + '&page=' + data.page,
		data: ''
	})
}

// 分佣明细
export function getMission(data) {
	return get({
		url: global.loginUrl + '/api/user/commission_history?page_size=' + data.page_size + '&page=' + data
			.page,
		data: ''
	})
}

// 提现记录
export function getWithdrawal(data) {
	return get({
		url: global.loginUrl + '/api/user/withdrawal?page_size=' + data.page_size + '&page=' + data.page,
		data: ''
	})
}

//提现申请
export function applyCash(data) {
	return post({
		url: global.loginUrl + '/api/user/withdrawal',
		data: data
	})
}
// 兑换算力
export function exchange(data) {
	return post({
		url: global.loginUrl + '/api/user/balance_exchange',
		data: data
	})
}
//获取分享二维码
export function getQrCode(data) {
	return post({
		url: global.loginUrl + '/api/user/add_qr_code',
		data: data
	})
}

//银行卡列表
export function getBank(data) {
	return get({
		url: global.loginUrl + '/api/user/bank_card',
		data: ''
	})
}

//添加银行卡
export function addBank(data) {
	return post({
		url: global.loginUrl + '/api/user/bank_card',
		data: data
	})
}

//获取银行卡所属行
export function getBankSource(data) {
	return get({
		url: global.loginUrl + '/api/user/get_back?card_number=' + data.card_number,
		data: ''
	})
}

//消息列表
export function getMessage(data) {
	return post({
		url: global.memberUrl + '/pay/message_center/',
		data: data
	})
}

//获取消息详情
export function getMessageDetail(data) {
	return post({
		url: global.memberUrl + '/pay/message_center_content/',
		data: data
	})
}

// 变更已读
export function editMessage(data) {
	return put({
		url: global.memberUrl + '/pay/message_center/',
		data: data
	})
}

//获取定价规则
export function getBill(data) {
	return get({
		url: global.memberUrl + '/pay/billing_center/',
		data: ''
	})
}

//计费中心
export function getBillCenter(data) {
	return post({
		url: global.memberUrl + '/pay/billing_center/',
		data: data
	})
}

//获取对话问题集
export function getQuestionRecommend(data) {
	return get({
		url: global.memberUrl + '/pay/question_set_recommend/',
		data: ''
	})
}
//获取绘画问题集
export function getDrawRecommend(data) {
	return get({
		url: global.memberUrl + '/pay/drawing_set_recommend/',
		data: ''
	})
}

//公司行业/资讯/分类
export function getLabel() {
	return get({
		// url: global.baseUrl + '/api/se_enterprise/enterprise_label?label_type=' + data.label_type,
		url: global.baseUrl + '/api/se_enterprise/enterprise_label',
		data: ''
	})
}

//公司营销详情
export function getRetrieve(data) {
	return get({
		url: global.baseUrl + '/api/se_enterprise/retrieve',
		data: data
	})
}

//企业信息保存或修改
export function companyInfo(data) {
	return JsomPost({
		url: global.baseUrl + '/api/se_enterprise/company_create_or_update',
		data: data
	})
}

//项目信息创建或修改
export function projectInfo(data) {
	return JsomPost({
		url: global.baseUrl + '/api/se_enterprise/project_create_or_update',
		data: data
	})
}

//资讯信息创建或修改
export function informationInfo(data) {
	return JsomPost({
		url: global.baseUrl + '/api/se_enterprise/information_create_or_update',
		data: data
	})
}

//知识库创建或修改
export function knowledgeInfo(data) {
	return JsomPost({
		url: global.baseUrl + '/api/se_enterprise/knowledge_create_or_update',
		data: data
	})
}


//获取信息公开或私有信息列表
export function getUserModel(data) {
	return get({
		url: global.memberUrl + '/assistant/user_models/',
		data: data
	})
}

//创建信息
export function creatUserModel(data) {
	return JsomPost({
		url: global.memberUrl + '/assistant/user_models/',
		data: data
	})
}

//修改信息
export function editUserModel(data) {
	return JsomPut({
		url: global.memberUrl + '/assistant/user_models/',
		data: data
	})
}

//删除信息
export function delUserModel(data) {
	return del({
		url: global.memberUrl + '/assistant/user_models/',
		data: data
	})
}

//获取信息详情
export function getUserCont(data) {
	return get({
		url: global.memberUrl + '/assistant/user_models_content/',
		data: data
	})
}

//阿里实时语音保存文本结果
export function saveRecord(data) {
	return post({
		url: global.baseUrl + '/api/sv_voice/speech_recognition',
		data: data
	})
}

//阿里实时语音历史列表
export function getRecord(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/speech_recognition',
		data: data
	})
}

//语音历史修改
export function editRecord(data) {
	return put({
		url: global.baseUrl + '/api/sv_voice/speech_recognition/' + data.speech_code,
		data: data
	})
}

//语音历史删除
export function delRecord(data) {
	return del({
		url: global.baseUrl + '/api/sv_voice/speech_recognition/' + data,
		data: ''
	})
}


//创建识别语音任务
export function createFile(data) {
	return post({
		url: global.baseUrl + '/api/sv_voice/file_identifier',
		data: data
	})
}

//查询识别结果
export function getFile(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/file_identifier',
		data: data
	})
}

//创建数字人体验任务
export function createExperience(data) {
	return post({
		url: global.baseUrl + '/api/sv_voice/digital_human_experience',
		data: data
	})
}

//数字人资料上传
export function createDigital(data) {
	return post({
		url: global.baseUrl + '/api/sv_voice/digital_human_file',
		data: data
	})
}

//数字人获取列表
export function getDigital(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/digital_human_file',
		data: data
	})
}

//数字人删除列表
export function delDigital(data) {
	return del({
		url: global.baseUrl + '/api/sv_voice/digital_human_file/' + data,
	})
}

//获取最近浏览历史
export function getFootprint(data) {
	return get({
		url: global.loginUrl + '/api/user/footprint',
		data: data
	})
}

//保存最近浏览历史
export function saveFootprint(data) {
	return post({
		url: global.loginUrl + '/api/user/footprint',
		data: data
	})
}

//删除最近浏览历史
export function delFootprint(data) {
	return del({
		url: global.loginUrl + '/api/user/footprint?type_code=' + data.type_code + '&eid=' + data.eid
	})
}

//获取首页应用助理tab栏
export function getTab(data) {
	return get({
		url: global.memberUrl + '/pay/tab/',
		data: data
	})
}

//助理中心全局搜索
export function searchList(data) {
	return post({
		url: global.memberUrl + '/pay/questions_set_search/',
		data: data
	})
}

//获取企业、团体列表
export function getCompanyList(data) {
	return get({
		url: global.baseUrl + '/api/se_enterprise/list',
		data: data
	})
}

//获取知识库列表
export function getKnowList(data) {
	return get({
		url: global.baseUrl + '/api/se_enterprise/knowledge_list',
		data: data
	})
}


//获取企业数字员工列表
export function getClerk(data) {
	return get({
		url: global.baseUrl + '/api/se_enterprise/digital_clerk',
		data: data
	})
}

//创建企业数字员工
export function addClerk(data) {
	return post({
		url: global.baseUrl + '/api/se_enterprise/digital_clerk',
		data: data
	})
}

//编辑企业数字员工
export function editClerk(data) {
	return put({
		url: global.baseUrl + '/api/se_enterprise/digital_clerk/' + data.clerk_code,
		data: data
	})
}


//删除企业数字员工
export function delClerk(data) {
	return del({
		url: global.baseUrl + '/api/se_enterprise/digital_clerk/' + data.clerk_code,
		data: ''
	})
}

//获取成员列表
export function getMember(data) {
	return get({
		url: global.baseUrl + '/api/se_enterprise/enterprise_member',
		data: data
	})
}

//被邀请人员同意加入
export function joinMember(data) {
	return post({
		url: global.baseUrl + '/api/se_enterprise/enterprise_member',
		data: data
	})
}

//审批成员加入
export function verifyMember(data) {
	return put({
		url: global.baseUrl + '/api/se_enterprise/enterprise_member/' + data.member_code,
		data: ''
	})
}

//删除成员
export function delMember(data) {
	return del({
		url: global.baseUrl + '/api/se_enterprise/enterprise_member/' + data.member_code,
		data: ''
	})
}

//企业设置
export function companySet(data) {
	return post({
		url: global.baseUrl + '/api/se_enterprise/company_update',
		data: data
	})
}

//企业机器人对话
export function getChat(data) {
	return post({
		url: global.chatUrl + '/digital_employee/match_context_ce/',
		data: data
	})
}

//应用助理机器人对话
export function applyChat(data) {
	return post({
		url: global.chatUrl + '/digital_employee/match_context_assistant/',
		data: data
	})
}

//生成数字人
export function addFigure(data) {
	return JsomPost({
		url: global.baseUrl + '/api/sv_voice/digital_human_clone',
		data: data
	})
}

//获取数字人信息列表
// export function getFigureList(data){
// 	return get({
// 		url: global.baseUrl + '/api/sv_voice/digital_human_clone',
// 		data: data
// 	})
// }

//获取详情
export function getFigureDetail(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/digital_human_clone/' + data.live_code,
		data: ''
	})
}

//我的数字人列表
export function getHumanList(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/my_digital_human',
		data: data
	})
}

//获取封面图片
export function getCover(data) {
	return post({
		url: global.baseUrl + '/api/sv_voice/GgetVideoCover',
		data: data
	})
}

//创建口播视频
export function createProject(data) {
	return JsomPost({
		url: global.baseUrl + '/api/sv_voice/digital_human_project',
		data: data
	})
}

//获取口播视频草稿列表
export function getPrevProject(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/DigitalHumanProjectView',
		data: data
	})
}

//获取口播视频导出列表
export function getEndProject(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/my_live_video',
		data: data
	})
}

//获取口播视频详情
export function getProjectDetail(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/digital_human_project/' + data.project_code,
		data: ''
	})
}

//修改信息
export function editProject(data) {
	return JsomPut({
		url: global.baseUrl + '/api/sv_voice/digital_human_project/' + data.project_code,
		data: data
	})
}

//获取阿里token
export function getToken(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/ali_token',
		data: ''
	})
}

//获取声音时长
export function getVoiceTime(data) {
	return post({
		url: global.baseUrl + '/api/sv_voice/get_duration',
		data: data
	})
}

//我的声音列表
export function getVoiceList(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/customized_voice_view',
		data: data
	})
}

//获取口播视频导出价格
export function getAmount(data) {
	return post({
		url: global.memberUrl + '/pay/get_total_amount/',
		data: data
	})
}

//口播视频草稿批量删除
export function delProject(data) {
	return del({
		url: global.baseUrl + '/api/sv_voice/digital_human_project',
		data: data
	})
}

//口播视频制作失败重新提交
export function againProject(data) {
	return JsomPut({
		url: global.baseUrl + '/api/sv_voice/my_live_video',
		data: data
	})
}

//修改数字人
export function editFigure(data) {
	return put({
		url: global.baseUrl + '/api/sv_voice/digital_human_clone/' + data.live_code,
		data: data
	})
}

//获取声音朗读文字
export function getText(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/customized_voice',
		data: data
	})
}

//音频检测
export function checkText(data) {
	return JsomPost({
		url: global.baseUrl + '/api/sv_voice/customized_voice',
		data: data
	})
}

//保存声音模型
export function saveVoice(data) {
	return post({
		url: global.baseUrl + '/api/sv_voice/customized_voice_view',
		data: data
	})
}

//获取声音模型详情
export function voiceDetail(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/customized_voice_view/' + data.id,
		data: ''
	})
}

//生成克隆声音
export function makeVoice(data) {
	return JsomPost({
		url: global.baseUrl + '/api/sv_voice/voice_generate_history',
		data: data
	})
}

//获取声音列表
export function getVoiceHistory(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/voice_generate_history',
		data: data
	})
}

//声音格式转换
export function changeAudio(data) {
	return post({
		url: global.baseUrl + '/api/sv_voice/audio_conversion',
		data: data
	})
}

//获取地区
export function getRegions(data) {
	return post({
		url: global.memberUrl + '/assistant/regions/',
		data: data
	})
}

//获取我
export function getMe(data) {
	return get({
		url: global.memberUrl + '/assistant/sva_me/',
		data: data
	})
}

//获取所有的我
export function getAllMe(data) {
	return JsomPost({
		url: global.memberUrl + '/assistant/batch_me_tutor/',
		data: data
	})
}

//创建我
export function creatMe(data) {
	return post({
		url: global.memberUrl + '/assistant/sva_me/',
		data: data
	})
}

//修改我
export function editMe(data) {
	return put({
		url: global.memberUrl + '/assistant/sva_me/',
		data: data
	})
}

//删除我
export function delMe(data) {
	return del({
		url: global.memberUrl + '/assistant/sva_me/',
		data: data
	})
}

//获取我的导师
export function getTutor(data) {
	return get({
		url: global.memberUrl + '/assistant/sva_tutor/',
		data: data
	})
}

//创建我的导师
export function creatTutor(data) {
	return post({
		url: global.memberUrl + '/assistant/sva_tutor/',
		data: data
	})
}

//修改我的导师
export function editTutor(data) {
	return put({
		url: global.memberUrl + '/assistant/sva_tutor/',
		data: data
	})
}

//删除我的导师
export function delTutor(data) {
	return del({
		url: global.memberUrl + '/assistant/sva_tutor/',
		data: data
	})
}

//获取对话上下文（旧）
export function getContext(data) {
	return post({
		url: global.chatUrl + '/digital_employee/match_context_tutor/',
		data: data
	})
}

//获取对话上下文（新）
export function getTextContext(data) {
	return post({
		url: global.memberUrl + '/assistant/match_context/',
		data: data
	})
}


//批量绑定导师
export function batchTutor(data) {
	return post({
		url: global.memberUrl + '/assistant/batch_bind_tutor/',
		data: data
	})
}

//通义万相生成图片
export function createImg(data) {
	return JsomPost({
		url: global.baseUrl + '/api/chat/text_to_image',
		data: data
	})
}

//通义万相历史列表
export function getImgList(data) {
	return get({
		url: global.baseUrl + '/api/chat/chat_image',
		data: data
	})
}

//通义万相点赞点踩
export function likeList(data) {
	return put({
		url: global.baseUrl + '/api/chat/chat_image',
		data: data
	})
}

//通义万相获取详情
export function getImgDetail(data) {
	return get({
		url: global.baseUrl + '/api/chat/chat_image/' + data,
		data: ''
	})
}

//文档对话上传文件
export function upDocument(data) {
	return post({
		url: global.memberUrl + '/kb/upload_document/',
		data: data
	})
}

//文档对话获取文件
export function getDocument(data) {
	return get({
		url: global.memberUrl + '/kb/upload_document/',
		data: data
	})
}

//文档对话获取答案
export function getAnswer(data) {
	return post({
		url: global.memberUrl + '/kb/match_context_kb/',
		data: data
	})
}

//文档对话删除文件
export function delDocument(data) {
	return del({
		url: global.memberUrl + '/kb/upload_document/',
		data: data
	})
}

//百度异步文生图
export function asyncImg(data) {
	return JsomPost({
		url: global.baseUrl + '/api/chat/async_text_to_image',
		data: data
	})
}

//百度异步文生图获取图片
export function getTextImg(data) {
	return get({
		url: global.baseUrl + '/api/chat/async_text_to_image?task_id=' + data.task_id,
		data: ''
	})
}
//服务商验证码校验
export function mobileVerify(data) {
	return post({
		url: global.loginUrl + '/api/user/MobileVerify',
		data: data
	})
}

//服务商验证token
export function checkToken(data) {
	return post({
		url: global.loginUrl + '/api/user/OperatorStatistics',
		data: data
	})
}

//服务商成员列表
export function myMember(data) {
	return get({
		url: global.loginUrl + '/api/user/top_my_members',
		data: data
	})
}

//服务商统计
export function OperatorStatistics(data) {
	return get({
		url: global.loginUrl + '/api/user/OperatorStatistics',
		data: data
	})
}
//语音对讲获取音色
export function getSpeech(data) {
	return get({
		url: global.memberUrl + '/speech/text_to_speech/',
		data: data
	})
}

//语音对讲文字转语音
export function textSpeech(data) {
	return post({
		url: global.memberUrl + '/speech/text_to_speech/',
		data: data
	})
}

//多模型对话获取模型
export function getModel(data) {
	return get({
		url: global.baseUrl + '/api/chat/get_model',
		data: data
	})
}

//多模型对话获取角色
export function getChatRole(data) {
	return get({
		url: global.baseUrl + '/api/chat/chat_role_view',
		data: data
	})
}

//多模型对话创建角色
export function getRoleDetail(data) {
	return get({
		url: global.baseUrl + '/api/chat/chat_role_view/' + data,
		data: ''
	})
}

//多模型对话获取角色详情
export function addChatRole(data) {
	return JsomPost({
		url: global.baseUrl + '/api/chat/chat_role_view',
		data: data
	})
}

//多模型对话修改角色
export function editChatRole(data) {
	return JsomPut({
		url: global.baseUrl + '/api/chat/chat_role_view/' + data.role_code,
		data: data
	})
}

//多模型对话删除角色
export function delChatRole(data) {
	return del({
		url: global.baseUrl + '/api/chat/chat_role_view/' + data,
		data: ''
	})
}

//多模型对话话题创建
export function addChat(data) {
	return JsomPost({
		url: global.baseUrl + '/api/chat/group_chat',
		data: data
	})
}

//多模型对话获取历史列表
export function getChatList(data) {
	return get({
		url: global.baseUrl + '/api/chat/group_chat',
		data: data
	})
}

//多模型对话历史详情
export function getOneList(data) {
	return get({
		url: global.baseUrl + '/api/chat/group_chat/' + data,
		data: ''
	})
}

//多模型对话删除历史
export function delList(data) {
	return del({
		url: global.baseUrl + '/api/chat/group_chat/' + data,
		data: ''
	})
}

//多模型对话补充算力值
export function addCount(data) {
	return JsomPut({
		url: global.baseUrl + '/api/chat/group_chat/' + data.session_code,
		data: data
	})
}

//多模型对话
export function groupChat(data) {
	return JsomPost({
		url: global.baseUrl + '/api/chat/async_group_chat_completion',
		data: data
	})
}
//获取h5跳转回小程序链接
export function getRealNameAuthentication(data) {
	return get({
		url: global.loginUrl + '/api/user/real_name_authentication',
		data: data
	})
}
//语音合成获取引擎
export function getSpeechEngine(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/get_speech_engine',
		data: data
	})
}

//实名认证
export function realNameAuthentication(data) {
	return post({
		url: global.loginUrl + '/api/user/real_name_authentication',
		data: data
	})
}
//语音合成获取音色
export function getSpeechVoice(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/get_speech_voice',
		data: data
	})
}

//实名结果查询
export function putRealName(data) {
	return put({
		url: global.loginUrl + '/api/user/real_name_authentication',
		data: data
	})
}
//语音合成获取合成历史
export function getTextSpeech(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/text_to_speech',
		data: data
	})
}

//语音合成操作
export function goTextSpeech(data) {
	return JsomPost({
		url: global.baseUrl + '/api/sv_voice/text_to_speech',
		data: data
	})
}

//语音合成结果查询
export function getSpeechResult(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/get_speech_result',
		data: data
	})
}

//语音合成获取合成详情
export function getSpeechDetail(data) {
	return get({
		url: global.baseUrl + '/api/sv_voice/text_to_speech/' + data,
		data: ''
	})
}

//语音合成删除历史
export function delSpeechDetail(data) {
	return del({
		url: global.baseUrl + '/api/sv_voice/text_to_speech/' + data,
		data: ''
	})
}