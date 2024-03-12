import {get, post,put, JsomPost,del, JsomPut} from './util.js'
// 获取消息列表
export function getapplication(data) {
	return JsomPost( {
		url:global.memberUrl+'/pay/message_center/',
		data:data
	})
}
// 获取列表详情
export function getapplicationContent(data) {
	return JsomPost( {
		url:global.memberUrl+'/pay/message_center_content/',
		data:data
	})
}

// 创建声音
export function creatVoice(data) {
	return JsomPost({
		url:global.baseUrl+'/api/sv_voice/volcengine_voice_train',
		data:data
	})
}

// 训练记录
export function getVoiceList(data) {
	return get({
		url:global.baseUrl+'/api/sv_voice/volcengine_voice_train',
		data:data
	})
}

// 重新训练
export function againVoice(data) {
	return JsomPut({
		url:global.baseUrl+'/api/sv_voice/volcengine_voice_train',
		data:data
	})
}

// 启用音色
export function openVoice(data) {
	return put({
		url:global.baseUrl+'/api/sv_voice/enable_voice',
		data:data
	})
}

// 声音id余量查询
export function getVoiceIdQuery(data) {
	return get({
		url:global.baseUrl+'/api/sv_voice/VoiceIdQuery',
		data:data
	})
}

// 声音训练可用次数
export function getVoiceCount(data) {
	return get({
		url:global.baseUrl+'/api/sv_voice/get_vid_number',
		data:data
	})
}
