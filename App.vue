<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')

			// console.log(uni.getStorageSync('userInfo'))
			let url = location.href; // 获取分享路径
			let scene = decodeURIComponent(url);
			let val = this.getUrlDataFN(scene);
			// console.log(val,265)
			if (val != null && val.parent_user_code != undefined) {
				uni.setStorageSync('loginCode', val);
				// uni.navigateTo({
				// 	url: '/pages/login/login',
				// })
			} else {
				if (uni.getStorageSync('userInfo') == null || uni.getStorageSync('userInfo') == 'null' || uni
					.getStorageSync('userInfo') == '') {
					this.guessLogin();
				} else {

					let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
					// uni.switchTab({
					// 	url: '/pages/index/index'
					// });
				}
			}

			// uni.setInnerAudioOption({obeyMuteSwitch: false});// 兼容ios,音频播放无声音问题

			// 滑块验证码
			// #ifdef H5
			var script = document.createElement('script');
			script.src = "https://turing.captcha.qcloud.com/TCaptcha.js";
			document.body.appendChild(script);
			// #endif

		},
		onShow: function() {
			console.log('App Show');

			// #ifdef H5
			// uni.hideTabBar({});
			// #endif

		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 游客登录
			guessLogin() {
				let headers = {
					'content-type': 'application/x-www-form-urlencoded',
					'source': global.source
				}

				let val = {
					time: new Date().getTime()
				};
				uni.request({
					url: global.loginUrl + '/api/user/create_temp_user',
					data: val,
					header: headers,
					method: 'POST',
					success: (res) => {
						if (res.data.code == 20000) {
							// console.log(res.data, 741);
							uni.setStorageSync("userInfo", JSON.stringify(res.data.data));
							uni.setStorageSync("avatarUrl", res.data.data.avatar_url);
							uni.switchTab({
								url: '/pages/index/index'
							});
						} else {
							console.log('登录失败')
						}
					}
				});
			},
			//截取url参数
			getUrlDataFN(urlStr) {
				// 定义一个空对象以储存数据
				const urlObj = {}
				// 检查url中是否携带数据
				if (urlStr.indexOf('?') === -1) return null
				// 找到 '?' 对应的下标
				const index = urlStr.indexOf('?') // index = 31
				// 截取 '?' 后的内容
				const dataStr = urlStr.substr(index + 1) // dataStr = a=1&b=2&c=&d=xxx&e
				// 通过 '&' 将字符串分割成数组
				const dataArr = dataStr.split('&') // ['a=1', 'b=2', 'c=', 'd=xxx', 'e']
				// 遍历字符串分割后的数组
				dataArr.forEach(str => {
					// 判断数组内的字符串是否有 '='
					if (str.indexOf('=') === -1) {
						// 如没有 '=' , 则将此字符串作为对象内键值对的键, 键值对的值为 undefined
						urlObj[str] = undefined // { e: undefined }
					} else {
						// 如果有 '='
						// 通过 '=' 将此字符串截取成两段字符串（不推荐使用 split 分割, 因为数据中可能携带多个 '=' ）
						const innerArrIndex = str.indexOf('=')
						const key = str.substring(0, innerArrIndex)
						const value = str.substr(innerArrIndex + 1)
						// 以截取后的两段字符串作为对象的键值对
						urlObj[key] = value // {a: '1', b: '2', c: '', d: 'xxx'}
					}
				})
				// 返回对象
				// console.log(urlObj)
				return urlObj
			},
		}
	}
</script>

<style lang='scss'>
	/*每个页面公共css */
	/*每个页面公共css */
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "static/css/index-app.css";

	page {
		background: #f6f8fb;
		/* background: #eff5ff; */
		/* background: linear-gradient(to bottom, rgba(239, 245, 255, 1), rgba(246, 248, 251, 1)) */
	}
</style>