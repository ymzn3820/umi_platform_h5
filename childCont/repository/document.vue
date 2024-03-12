<template>
	<view>
		<view class="chat_cont">
			<view class="cont_li">
				<view class="top">
					<view style="display: flex;">
						<view class="txt" style="margin-right: 15rpx;">{{name}} </view>
						<u-icon name="arrow-down" color="#000" size="18" @click="chatShow=true"></u-icon>
						<!-- <u-icon name="arrow-up" color="#000" size="28"></u-icon> -->
					</view>
					<view class="tag" @click="toGroup">分组管理</view>
				</view>
				<view class="qs_img" @click="uploadFile">
					<!-- <view v-for="(val, index) in qsImg" :key="index" style="position: relative;">
						<img class="up_img" :src="getImgUrl(val.file_url)" alt="" />
						<img class="del_img" :src="delImg" alt="" @click="qsImg.splice(index,1)" />
					</view> -->
					<img class="up_pic" :src="up_pic" mode="aspectFit" />
					<view class="up_txt">点击上传</view>
				</view>
				<view class="img_text">文件资料上传可包含docx、pdf、xlsx、ppt、txt、md文件</view>
			</view>
			<view class="headline">已上传文档</view>
			<!-- <u-search placeholder="搜索你想要的内容" v-model.trim="searchKeyword" shape="square" :showAction='false'
				bgColor='#fff' @change="searchTitle"></u-search> -->

			<view>
				<scroll-view class="list_ul" scroll-y="true">
					<view class="ul_style" v-for="item,index in fileList" :key="index">
						<view class="li_style">
							<view class="ul_right">
								<view class="li_top">
									<text class="top_l">{{item.file_name}}</text>
								</view>
								<view class="li_btn">
									<view class="btn_l">描述</view>
									<view class="btn_r">{{item.file_desc}}</view>
								</view>

								<view class="li_btn">
									<view class="btn_l">类型</view>
									<view class="btn_r">{{item.file_type}}</view>
								</view>
								<view class="li_btn">
									<view class="btn_l">使用次数</view>
									<view class="btn_r">{{item.times_used}}</view>
								</view>
								<!-- <view class="li_btn">
										<view class="btn_l">上传时间</view>
										<view class="btn_r">2023-08-31 10:20:21</view>
									</view> -->
								<view class="li_edit">
									<view class="edit_l" @click="delDocuments(item.file_id)">删除</view>
									<view class="edit_r" @click="editDocuments(item)">编辑</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>

				<!-- <view class="on_order">
					<image class="order_img" :src="backImg"></image>
				</view> -->

				<!-- <view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view> -->
			</view>
		</view>
		<u-popup :show="show" @close="show=false" mode="center">
			<view style="padding: 60rpx 40rpx;">
				<view style="display: flex;margin-bottom: 20rpx;">
					<view class="name">网址名称：</view><input type="text" disabled="true" placeholder="请输入分组名称"
						v-model="file_name" />
				</view>

				<view style="display: flex;margin-bottom: 20rpx;">
					<view class="name ">描述：</view><input type="text" placeholder="请输入描述" v-model="file_desc" />
				</view>
				<view class="li_edit" @click="show=false">
					<view class="edit_l">取消</view>
					<view class="edit_r" @click="submit">确认</view>
				</view>
			</view>

		</u-popup>
		<!-- 选择分组 -->
		<u-picker :show="chatShow" :columns="groupcolumns" :closeOnClickOverlay="true" @close="chatShow = false"
			v-model="group_name" @cancel="chatShow = false" keyName='name' @confirm="version"></u-picker>
	</view>
</template>

<script>
	import {
		documents,
		getDocuments,
		delDocuments,
		putDocuments,
		groups
	} from '@/apis/chat.js'
	export default {
		data() {
			return {
				group_name: '',
				show: false,
				searchKeyword: '',
				qsImg: [],
				up_pic: global.baseImg + '/xcx/com/message_center/upload.png',
				group_url: '',
				group_id: '',
				group_order: '',
				name: '',
				fileList: [],
				file_name: '',
				file_desc: '',
				file_id: '',
				group_index: 0,
				groupList: [],
				groupcolumns: [
				],
				group: [],
				chatShow: false,

			};
		},
		onLoad(option) {
			if (option.obj) {
				let obj = JSON.parse(option.obj)
				this.group_id = obj.id
				this.group_order = obj.group_order
				this.name = obj.name
			}
		},
		onShow() {
			this.getGroups()
			this.getDocuments()
		},
		methods: {
			version(e) {
				console.log(e, 'e');
				this.group_name = e.value[0].name
				this.name = e.value[0].name
				this.chatShow = false
				this.group_index = e.indexs[0]
				this.group_id = e.value[0].id

				this.getDocuments()
			},
			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},
			toGroup() {
				uni.setStorageSync('resposNum', 1)
				uni.navigateTo({
					url: '/childCont/repository/group'
				})
			},
			searchTitle() {

			},
			// 获取文档列表
			getDocuments() {
				if (this.group_id == '' || this.group_order == '') {
					return
				}
				let val = {
					group_id: this.group_id,
					group_order: this.group_order,
					user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id
				}
				getDocuments(val).then(res => {
					if (res.code == 20000) {
						this.fileList = res.data
					} else {
						this.$api.msg(res.msg)
					}

				}).catch(err => {
					console.log(err);
				})
			},
			// 上传文档
			uploadFile() {
				let that = this;
				uni.chooseFile({
					count: 9,
					type: 'file',
					extension: ['docx', 'pdf', 'xlsx', 'ppt', 'txt', 'md'],
					success(res) {
						// tempFilePath可以作为img标签的src属性显示图片
						// console.log(res,7458)
						const tempFilePaths = res.tempFiles[0].path
						const image_name = res.tempFiles[0].name
						// console.log(image_name,774)
						uni.showLoading({
							title: '上传中'
						});
						uni.uploadFile({
							url: global.loginUrl + '/api/user/oss_upload',
							filePath: tempFilePaths,
							name: 'image',
							formData: {
								"image": tempFilePaths,
								"image_name": image_name,
								"oss_dir": 'static',
								"cate": 'create_character',

							},
							success: (uploadFileRes) => {
								let imgData = JSON.parse(uploadFileRes.data)
								console.log(imgData, 1258)

								if (imgData.code == 20000) {
									let name = imgData.data.name
									let url = imgData.data.new_url
									let type = url.substring(url.lastIndexOf('.') + 1)
									let arr = {
										name: name,
										url: url,
										type: type
									}
									that.upDocument(arr)

								} else {
									that.$api.msg(imgData.msg)
									uni.hideLoading()
								}
							}
						});
					}
				})
			},



			//上传文档
			upDocument(arr) {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let val = {
					group_name: this.name,
					file_name: arr.name,
					file_url: arr.url,
					file_type: arr.type,
					user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id,
					group_order: this.group_order
				}

				documents(val).then(res => {
					if (res.code == 20000) {
						this.getGroups()
						this.$api.msg('上传成功');
						uni.hideLoading()
					} else {
						this.$api.msg(res.msg);
						uni.hideLoading()
					}
				}).catch(err => {
					this.$api.msg('上传失败了');
					uni.hideLoading()
				})
			},
			delDocuments(id) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该文档吗？',
					success(res) {
						if (res.confirm) {
							let val = {
								user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id,
								file_id: id
							}
							delDocuments(val).then(res => {
								if (res.code === 20000) {
									that.$api.msg('删除成功')
									that.getDocuments()
								} else {
									that.$api.msg(res.msg)
								}
							}).catch(err => {
								that.$api.msg('删除失败')
							})
						}
					}
				});
			},
			editDocuments(arr) {
				this.show = true
				this.file_name = arr.file_name
				this.file_desc = arr.file_desc
				this.file_id = arr.file_id

			},
			submit() {
				let val = {
					user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id,
					file_id: this.file_id,
					file_desc: this.file_desc
				}
				putDocuments(val).then(res => {
					console.log(res);
					if (res.code == 20000) {
						this.$api.msg('修改成功')
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('修改失败')
				})
				this.show = false
			},
			// 获取用户所有分组
			getGroups() {
				this.groupList = []
				let val = {
					user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id
				}
				groups(val).then(res => {
					// console.log(res, 999);
					if (res.code == 20000) {
						const name = new Map()
						name.set('documents', '文档库')

						for (const key in res.data) {
							const childNodes = res.data[key];

							const listArr = [];
							for (const childKey in childNodes) {
								const childGroup = childNodes[childKey];
								const childArr = []
								for (const child of childGroup) {
									childArr.push(child)
								}
								const node = {
									name: childKey,
									id: childGroup[0].group_id,
									group_order: childGroup[0].group_order,
									children: childArr,
								};
								listArr.push(node);
							}
							const groupNode = {
								id: new Date().getTime(),
								name: name.get(key),
								children: listArr,
							};

							this.groupList.push(groupNode)


						}



						let data

						if (uni.getStorageSync('documents')) {
							let docArr = uni.getStorageSync('documents')
							const isAllMatched = this.groupList[1].children.every(item => item.id ===
								docArr.id);
							if (!isAllMatched || this.groupList[1].children == '') {
								data = {
									name: docArr.name,
									id: docArr.id,
									status: 1,
									children: [{
										group_desc: this.group_desc
									}],
									group_order: 1
								}
								this.groupList[1].children.push(data)
							}
						}

						this.group[0] = this.groupList[1].children;
						this.groupcolumns=this.group
						console.log(this.group, 66);
						let length = this.group[0].length
						if (this.name == '') {
							this.name = this.group[0][0].name
							this.group_id = this.group[0][0].id
							this.group_order = this.group[0][0].group_order
						}
						if (this.name == this.group[0][length - 1].name) {
							this.name = this.group[0][length - 1].name
							this.group_id = this.group[0][length - 1].id
							uni.setStorageSync('documents', '')
						}
						this.getDocuments()
					}

				}).catch(err => {
					console.log(err);
					this.$api.msg('数据请求失败')
				})
			},



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
		}
	}

	.top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24rpx;

		.tag {
			color: #1F64FF;
			font-size: 26rpx;
			font-weight: 400;
		}
	}

	.txt {
		color: #202123;
		font-size: 28rpx;
		font-weight: 500;
	}

	.qs_img {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 10rpx 32rpx;
		gap: 16rpx;
		border-radius: 4rpx;
		background: #1F64FF;
		width: 36%;
		margin-bottom: 16rpx;

		// border-top: 1upx solid #E8E9EB;
		.up_txt {
			color: #FFF;
			font-size: 28rpx;
			font-weight: 400;
		}
	}

	.img_text {
		color: #9A9A9A;
		font-size: 24upx;
		font-style: normal;
		font-weight: 400;
	}

	.headline {
		color: #000;
		font-size: 32rpx;
		font-weight: 500;
		margin: 40rpx 0 24rpx 0;
	}

	.list_ul {
		// padding: 15upx 10upx;
		margin-bottom: 30upx;
		width: calc(100%);
	}

	.ul_style {
		display: flex;
		flex-direction: column;
		// padding: 15upx 20upx;
	}

	.li_style {
		display: flex;
		align-items: center;
		box-shadow: 0upx 0upx 10upx rgba(0, 0, 0, 0.14);
		border-radius: 10upx;
		padding: 25upx;
		width: calc(100%);
		background: #fff;
		margin-top: 24rpx;

		.ul_right {
			width: 100%;
		}

		.ul_img {
			padding: 10upx;

			.avatar_img {
				width: 80upx;
				height: 80upx;
				border-radius: 8upx;
			}
		}
	}

	.li_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 18upx;
		width: 80%;
	}

	.top_l {
		font-weight: 500;
		font-size: 30upx;
		line-height: 42upx;
		color: #000;
		width: 80%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.top_r {
		font-weight: 400;
		font-size: 24upx;
		line-height: 30upx;
		color: #6E7480;
	}

	.li_btn {
		font-weight: 400;
		font-size: 28upx;
		line-height: 35upx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.btn_l {
			color: #A4A4A4;
			font-size: 28upx;
			font-weight: 400;
			line-height: 150%;
			padding: 5upx 0upx;
			line-height: 48upx;
		}

		.btn_r {
			color: #000;
			font-size: 28upx;
			font-weight: 400;
			line-height: 150%;
			padding: 5upx 0upx;
			line-height: 48upx;
		}
	}

	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100vw;
	}

	.order_img {
		width: 450upx;
		height: 450upx;

	}

	.on_order_list {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28upx;
		height: 100upx;
		line-height: 100upx;
		width: 100vw;
		color: #C0C4CC;
	}

	.li_edit {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 10upx;

		.edit_l {
			padding: 10upx 30upx;
			border-radius: 8upx;
			border: 1upx solid #1F64FF;
			color: #1F64FF;
			text-align: center;
			font-size: 28upx;
			font-style: normal;
			font-weight: 600;
			margin-right: 20upx;
		}

		.edit_r {
			padding: 18upx 30upx;
			border-radius: 8upx;
			background: #1F64FF;
			color: #fff;
			text-align: center;
			font-size: 28upx;
			font-style: normal;
			font-weight: 600;
		}
	}

	.up_pic {
		width: 28rpx;
		height: 28rpx;
	}

	.li_edit {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 83%;
		padding: 0rpx 32rpx;
		margin-top: 70rpx;

		.edit_l {
			padding: 18upx 30upx;
			border-radius: 12upx;
			border: 1upx solid #1F64FF;
			color: #1F64FF;
			text-align: center;
			font-size: 28upx;
			font-style: normal;
			font-weight: 600;
			margin-right: 20upx;
			width: 42%;
		}

	}

	.edit_r {
		padding: 20upx 30upx;
		border-radius: 12upx;
		background: #1F64FF;
		color: #fff;
		text-align: center;
		font-size: 28upx;
		font-style: normal;
		font-weight: 600;
		width: 42%;
	}

	.name {
		width: 34%;
		font-size: 30rpx;
	}
</style>