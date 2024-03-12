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
				<view class="picList">
					<view class="item" @click="uploadImg">
						<view class="pic">
							<image :src="upload" class="avatar"></image>
						</view>
						<view class="txt">支持JPG、PNG格式</view>

					</view>
					<view class="item" v-for="item,index in qsImg" :key="index">
						<view class="pic">
							<image :src="getImgUrl(item.pic_url)" class="avatar"></image>
							<view class="del" @click="delPictures(item.pic_id)">
								<image :src="del" class="delicon"></image>
							</view>
						</view>
						<view class="txt">{{item.pic_name}}</view>
						<view class="editTag" @click="toEditPhoto(item)">编辑标签</view>
					</view>


				</view>

			</view>
		</view>
		<!-- 选择分组 -->
		<u-picker :show="chatShow" :columns="groupcolumns" :closeOnClickOverlay="true" @close="chatShow = false"
			v-model="group_name" @cancel="chatShow = false" keyName='name' @confirm="version"></u-picker>
	</view>
</template>

<script>
	import {
		pictures,
		getPictures,
		delPictures,
		groups
	} from '@/apis/chat.js'
	import {
		get
	} from '../../apis/util';
	export default {
		data() {
			return {
				group_name:'',
				del: global.baseImg + '/xcx/com/message_center/智能体del.png',
				upload: global.baseImg + '/xcx/com/message_center/upload-trigger.png',
				qsImg: [],
				group_id: '',
				group_order: 1,
				name: '',
				chatShow: false,
				groupList: [],
				group: [],
				groupcolumns: [
				],
			};
		},
		onLoad(option) {
			this.getGroups()
			if (option.obj) {
				let obj = JSON.parse(option.obj)
				this.group_id = obj.id
				this.group_order = obj.group_order
				this.name = obj.name
			}
				this.getPictures()
		},
		onshow() {},
		methods: {
			version(e) {
				console.log(e, 'e');
				this.group_name = e.value[0].name
				this.name = e.value[0].name
				this.chatShow = false
				this.group_index = e.indexs[0]
				this.group_id = e.value[0].id

				this.getPictures()
			},
			toEditPhoto(arr) {
				uni.navigateTo({
					url: '/childCont/repository/editPhoto?arr=' + JSON.stringify(arr)
				})
			},
			toGroup() {
				uni.setStorageSync('resposNum',0)
				uni.navigateTo({
					url: '/childCont/repository/group'
				})
			},
			// 获取图片列表
			getPictures() {
				if (this.group_id == '' || this.group_order == '') {
					return
				}
				let val = {
					group_id: this.group_id,
					group_order: this.group_order,
					user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id
				}
				console.log(val, 1346);
				getPictures(val).then(res => {
					if (res.code == 20000) {
						this.qsImg = res.data
					} else {
						this.$api.msg(res.msg)
					}

				}).catch(err => {
					console.log(err);
				})
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
						// console.log( res,1452)
						const tempFilePaths = res.tempFilePaths[0];
						const fileExtension = res.tempFiles[0].name
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
										let data = {
											group_name: that.name,
											pic_name: fileExtension,
											pic_url: url,
											user_id: JSON.parse(uni.getStorageSync('userInfo'))
												.user_id,
											group_order: that.group_order
							
										}
										pictures(data).then(
											res => {
												// console.log('res',res);
							
												if (res.code == 20000) {
													that.getGroups()
													
													uni.hideLoading()
												} else {
													that.$api.msg(res.msg)
													uni.hideLoading()
												}
											}
										).catch(err => {
											console.log(err);
											uni.hideLoading()
										})
							
									}
									uni.hideLoading()
								},
							
						});
					}
				})
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
						name.set('pictures', '图片库')

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
						if (uni.getStorageSync('pictures')) {
							let picArr = uni.getStorageSync('pictures')
							const isAllMatched = this.groupList[0].children.every(item => item.id ===
								picArr.id);
							if (!isAllMatched || this.groupList[0].children == '') {
								data = {
									name: picArr.name,
									id: picArr.id,
									status: 1,
									children: [{
										group_desc: this.group_desc
									}],
									group_order: 1
								}
								this.groupList[0].children.push(data)
							}
						}
						this.group[0] = this.groupList[0].children;
						this.groupcolumns=this.group
						if(this.name==''){
							this.name=this.group[0][0].name
							this.group_id=this.group[0][0].id
							this.group_order=this.group[0][0].group_order
						}
						console.log(this.groupList[0],999);
						let length = this.group[0].length
						if (this.name == this.group[0][length - 1].name) {
							this.name = this.group[0][length - 1].name
							this.group_id = this.group[0][length - 1].id
							uni.setStorageSync('pictures', '')
						}
						this.getPictures()
					}

				}).catch(err => {
					console.log(err);
					this.$api.msg('数据请求失败')
				})
			},


			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},
			delPictures(id) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该图片吗？',
					success(res) {
						if (res.confirm) {


							let val = {
								user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id,
								pic_id: id
							}
							delPictures(val).then(res => {
								if (res.code === 20000) {
									that.$api.msg('删除成功')
									that.getPictures()
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

	.picList {
		display: flex;
		flex-wrap: wrap;

	}

	.item {
		margin-bottom: 32rpx;
		width: 33%;

		.pic {
			width: 160rpx;
			height: 160rpx;
			position: relative;

			.avatar {
				width: 100%;
				height: 100%;
			}
		}

		.txt {
			color: #666;
			font-size: 24rpx;
			font-weight: 400;
			margin: 16rpx 0 20rpx 0;
		}

		.del {
			position: absolute;
			right: 0;
			top: 0;
			width: 40rpx;
			height: 40rpx;

			.delicon {
				width: 100%;
				height: 100%;
			}
		}
	}

	.editTag {
		width: 144rpx;
		height: 48rpx;
		border-radius: 6rpx;
		border: 2rpx solid #1F64FF;
		color: #1F64FF;
		font-size: 24rpx;
		font-weight: 400;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>