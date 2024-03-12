// import Store from '@/store'

import loginVue from "../pages/login/login.vue";
let that = this;

export function put(o){
	return new Promise(function(resolve, reject) {
		{
			let headers = {
				'content-type': 'application/x-www-form-urlencoded',
				'source': global.source,
			}
			const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			if (userInfo.token) headers.Authorization = userInfo.token;
			if (userInfo.role) headers.role = userInfo.role
			uni.request({
				url: o.url,
				data: o.data,
				header: headers,
				method:'PUT',
				success: (res) => {
					let code = res.data.code
					if (code == 20000) {
						resolve(res.data)
					} else if (code == 40013) {
						uni.showModal({
							title: '提示',
							content: '登录信息已过期，请重新登录',
							showCancel: false,
							success(res) {
							  if (res.confirm) {
								uni.setStorageSync("userInfo", '');
								uni.navigateTo({
									url: '/pages/login/login',
								})
							  }
							}
						});
					} else {
						resolve(res.data)
					}
				},
				fail: (error) => {
					reject(error)
				}
			});
		}
	})
}

export function get(o) {
	return new Promise(function(resolve, reject) {
		{
			let headers = {
				'content-type': 'application/x-www-form-urlencoded',
				'source': global.source,
			}
			const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			if (userInfo.token) headers.Authorization = userInfo.token;
			if (userInfo.role) headers.role = userInfo.role
			uni.request({
				url: o.url,
				data: o.data,
				header: headers,
				success: (res) => {
					let code = res.data.code
					if (code == 20000) {
						resolve(res.data)
					} else if (code == 40013) {
						uni.showModal({
							title: '提示',
							content: '登录信息已过期，请重新登录',
							showCancel: false,
							success(res) {
							  if (res.confirm) {
								uni.setStorageSync("userInfo", '');
								uni.navigateTo({
									url: '/pages/login/login',
								})
							  }
							}
						});
						
					} else {
						resolve(res.data)
					}
				},
				fail: (error) => {
					reject(error)
				}
			});
		}
	})
}

export function post(o) {

	return new Promise(function(resolve, reject) {
		{
			let headers = {
				'content-type': 'application/x-www-form-urlencoded',
				'source': global.source,
			}
			const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			if (userInfo.token) headers.Authorization = userInfo.token;
			if (userInfo.role) headers.role = userInfo.role
			uni.request({
				url: o.url,
				data: o.data,
				header: headers,
				method: 'POST',
				success: (res) => {
					// console.log(res.statusCode, '接口状态吗');
					// if (res.statusCode !== 200) {
					// 	console.log('有咩有返回');
					// 	return resolve(res.data)
					// }
					let code = res.data.code;
					// console.log(code,'utilscode');


					// resolve(res.data)
					if (code == 20000) {
						resolve(res.data)
					} else if (code == 40013) {
						uni.showModal({
							title: '提示',
							content: '登录信息已过期，请重新登录',
							showCancel: false,
							success(res) {
							  if (res.confirm) {
								uni.setStorageSync("userInfo", '');
								uni.navigateTo({
									url: '/pages/login/login',
								})
							  }
							}
						});
					} else {
						resolve(res.data)
					}

				},
				fail: (error) => {
					reject(error)
				}
			});
		}
	})
}

export function JsomPost(o) {

	return new Promise(function(resolve, reject) {
		{
			let headers = {
				'content-type': 'application/json',
				'source': global.source,
			}
			const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			if (userInfo.token) headers.Authorization = userInfo.token;
			if (userInfo.role) headers.role = userInfo.role
			uni.request({
				url: o.url,
				data: o.data,
				header: headers,
				method: 'POST',
				success: (res) => {
					// console.log(res.statusCode, '接口状态吗');
					// if (res.statusCode !== 200) {
					// 	console.log('有咩有返回');
					// 	return resolve(res.data)
					// }
					let code = res.data.code;
					// console.log(code,'utilscode');


					// resolve(res.data)
					if (code == 20000) {
						resolve(res.data)
					} else if (code == 40013) {
						uni.showModal({
							title: '提示',
							content: '登录信息已过期，请重新登录',
							showCancel: false,
							success(res) {
							  if (res.confirm) {
								uni.setStorageSync("userInfo", '');
								uni.navigateTo({
									url: '/pages/login/login',
								})
							  }
							}
						});
					} else {
						resolve(res.data)
					}

				},
				fail: (error) => {
					reject(error)
				}
			});
		}
	})
}

export function JsomPut(o) {

	return new Promise(function(resolve, reject) {
		{
			let headers = {
				'content-type': 'application/json',
				'source': global.source,
				// 'ngrok-skip-browser-warning': true
			}
			const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			if (userInfo.token) headers.Authorization = userInfo.token;
			if (userInfo.role) headers.role = userInfo.role
			uni.request({
				url: o.url,
				data: o.data,
				header: headers,
				method: 'PUT',
				success: (res) => {
					// console.log(res.statusCode, '接口状态吗');
					// if (res.statusCode !== 200) {
					// 	console.log('有咩有返回');
					// 	return resolve(res.data)
					// }
					let code = res.data.code;
					console.log(code,'utilscode');


					// resolve(res.data)
					if (code == 20000) {
						resolve(res.data)
					} else if (code == 40013) {
						uni.showModal({
							title: '提示',
							content: '登录信息已过期，请重新登录',
							showCancel: false,
							success(res) {
							  if (res.confirm) {
								uni.setStorageSync("userInfo", '');
								uni.navigateTo({
									url: '/pages/login/login',
								})
							  }
							}
						});
					} else {
						resolve(res.data)
					}

				},
				fail: (error) => {
					reject(error)
				}
			});
		}
	})
}

export function del(o){
	return new Promise(function(resolve, reject) {
		{
			let headers = {
				'content-type': 'application/json',
				'source': global.source,
				// 'ngrok-skip-browser-warning': true
			}
			const userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			if (userInfo.token) headers.Authorization = userInfo.token;
			if (userInfo.role) headers.role = userInfo.role
			uni.request({
				url: o.url,
				data: o.data,
				header: headers,
				method:'DELETE',
				success: (res) => {
					let code = res.data.code
					if (code == 20000) {
						resolve(res.data)
					} else if (code == 40013) {
						uni.showModal({
							title: '提示',
							content: '登录信息已过期，请重新登录',
							showCancel: false,
							success(res) {
							  if (res.confirm) {
								uni.setStorageSync("userInfo", '');
								uni.navigateTo({
									url: '/pages/login/login',
								})
							  }
							}
						});
					} else {
						resolve(res.data)
					}
				},
				fail: (error) => {
					reject(error)
				}
			});
		}
	})
}