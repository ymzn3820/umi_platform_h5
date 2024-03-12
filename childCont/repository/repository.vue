<template>
	<view style="padding: 32upx;">
		<view class="main">
			<view class="main_title">
				<view class="top">
					<view class="left"></view>
					<view class="middle">AI智能体</view>
				</view>
				<view style="color: #B7B9C0;font-size: 24upx;margin-top: 8rpx;">
					点击AI智能体开启对话，帮助您工作学习提高效率
				</view>
			</view>
			<view class="group">

				<view class="card" @click="toAddAgent" style="align-items: center;">
					<view style="width: 30%;">
						<view class="avatar"
							style="display: flex;justify-content: center;align-items: center;background-color: #fff;">
							<u-icon name="plus" size="21"></u-icon>
						</view>
					</view>
					<view class="right">
						<view class="txt">创建AI智能体</view>
					</view>
				</view>
			</view>
			<view class="top" style="display: flex;justify-content: space-between;">
				<view style="display: flex;">
					<view class="txt" style="margin-right: 15rpx;">{{group_name}} </view>
					<u-icon name="arrow-down" color="#000" size="18" @click="chatShow=true"></u-icon>
					<!-- <u-icon name="arrow-up" color="#000" size="28"></u-icon> -->
				</view>
				<view class="tag" @click="toGroup">分组管理</view>
			</view>
			<view>
				<view class="group"  v-for="item,index in groupList" :key="index">
					<view class="top">
						<view class="txt">{{item.name}}</view>
					</view>
					<view class="card" v-if="curr<displayLimit" v-for="val,curr in item.values" :key="curr">
						<view @click="toAgent(val)">
							<image :src="getImgUrl(val.avatar_url)" class="avatar"></image>
						</view>
						<view class="right">
							<view class="right_top">
								<view class="txt" @click="toAgent(val)">{{val.agent_name}}</view>
								<view class="icon">
									<image :src="edit" class="icon_l" @click="toAddAgent(val)"></image>
									<image :src="delImg" class="icon_l" @click="delAgentAi(val)"></image>
								</view>
							</view>
							<view class="cont">{{val.agent_desc}}</view>
						</view>
					</view>
					<view class="unfold" v-if="displayLimit<3&&groupList[index].values.length>2"
						@click="openMoer(groupList[index].values)">展开更多
						<u-icon name="arrow-down" color="#1F64FF" size="20"></u-icon>
					</view>
					<view class="unfold" v-if='displayLimit>2' @click="packUp">收起
						<u-icon name="arrow-up" color="#1F64FF" size="20"></u-icon>
					</view>
				</view>
			</view>
			<view v-if="groupList==''" style='width: 100%;text-align: center;color: #999;font-size: 28rpx;'> 暂无数据
			</view>
		</view>
		<view class="main">
			<view class="main_title">
				<view class="top" style="justify-content: space-between;">
					<view style="display: flex;align-items: center;">
						<view class="left"></view>
						<view class="middle">知识库</view>
					</view>
					<view style="color: #B7B9C0;font-size: 24upx;margin-top: 8rpx;">API文档</view>
				</view>
				<view style="color: #B7B9C0;font-size: 24upx;margin-top: 8rpx;">
					知识库内容会被AI智能体应用，并用于回答问题
				</view>
			</view>
			<view class="bank" @click="toPhoto">
				<view class="left">
					<view class="left_t">图片库</view>
					<view class="left_b">上传图片，编辑图片标签</view>
				</view>
				<image :src="image" class="bankIcon"></image>
			</view>
			<view class="bank" @click="toDocument" style="background: rgba(0, 199, 119, 0.10);">
				<view class="left">
					<view class="left_t">文档库</view>
					<view class="left_b">上传docx、pdf、xlsx、ppt、txt、md文件</view>
				</view>
				<image :src="file" class="bankIcon"></image>
			</view>
			<view class="bank" @click="toWebsite" style="background: #FFF9E6;">
				<view class="left">
					<view class="left_t">网址库</view>
					<view class="left_b">导入网站网址</view>
				</view>
				<image :src="globe" class="bankIcon"></image>
			</view>
		</view>
		<!-- 选择分组 -->
		<u-picker :show="chatShow" :columns="groupcolumns" :closeOnClickOverlay="true" @close="chatShow = false"
			v-model="group_name" @cancel="chatShow = false" @confirm="version"></u-picker>
	</view>
</template>

<script>
	import {
		agentGroups,
		models,
		delAgentModels,
		groups
	} from '@/apis/chat.js'
	export default {
		data() {
			return {
				edit: global.baseImg + '/xcx/com/message_center/edit-3.png',
				delImg: global.baseImg + '/xcx/com/message_center/智能体trash.png',
				file: global.baseImg + '/xcx/com/message_center/智能体file.png',
				globe: global.baseImg + '/xcx/com/message_center/智能体globe.png',
				image: global.baseImg + '/xcx/com/message_center/智能体image.png',
				userInfo: JSON.parse(uni.getStorageSync('userInfo')),
				group_id: '',
				group_order: '',
				group_name: '',
				groupList: [],
				group: [],
				group_data: [],
				chatShow: false,
				group_index: 0,
				displayLimit: 2,
				groupData: [],
				groupcolumns:[],
			};
		},
		onLoad(option) {
			if (option.obj) {
				console.log(option.obj, 555);
				let obj = JSON.parse(option.obj)
				this.group_id = obj[0].group_id
				this.group_order = obj[0].group_order
				this.group_name = obj[0].group_name
				this.getmodels()
			}
		},
		onShow() {
			this.getGroups()
			this.getGroupsUser()
		},
		methods: {
			version(e) {
				console.log(e, 'e');
				this.group_name = e.value[0]
				this.chatShow = false
				this.group_index = e.indexs[0]
				this.getmodels()
			},

			// 获取智能体组
			getGroups() {
				agentGroups(this.userInfo.user_id).then(res => {
					// console.log(res, 9999);
					if (res.code == 20000) {
						this.group_data = res.data.agent
						if (uni.getStorageSync('gro')) {
							let groArr = uni.getStorageSync('gro')
							// const isAllMatched = Object.values(this.group_data).every(item => item.id ===
							// 	groArr.id);
							// if (!isAllMatched) {
								let data = [{
									group_name: groArr.name,
									group_id: groArr.id,
									status: 1,
								}]
								console.log(groArr, data);
								this.group_data[groArr.name] = data;
							// }
						}
						this.group[0] = Object.keys(this.group_data)
						this.groupcolumns=this.group
						if (this.group_name == '') {
							this.group_name = this.group_data[this.group[0][0]][0].group_name
						}
						this.getmodels()
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					console.log(err);
				})
			},

			getGroupsUser() {
				this.groupData = []
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

							this.groupData.push(groupNode)


						}
						// console.log(this.groupData, 1015);
						let data
						if (this.current == 0 && uni.getStorageSync('pictures')) {
							let picArr = uni.getStorageSync('pictures')
							// const isAllMatched = this.groupData[0].children.every(item => item.id ===
							// 	picArr.id);
							// if (!isAllMatched || this.groupData[0].children == '') {
								data = {
									name: picArr.name,
									id: picArr.id,
									status: 1,
									children: [{
										group_desc: this.group_desc
									}]
								}
								this.groupData[0].children.push(data)
							// }
						} else if (this.current == 1 && uni.getStorageSync('documents')) {
							let docArr = uni.getStorageSync('documents')
							// const isAllMatched = this.groupData[1].children.every(item => item.id ===
							// 	docArr.id);
							// if (!isAllMatched) {
								data = {
									name: docArr.name,
									id: docArr.id,
									status: 1,
									children: [{
										group_desc: this.group_desc
									}]
								}
								this.groupData[1].children.push(data)
							// }
						} else if (this.current == 2 && uni.getStorageSync('urls')) {
							let urlArr = uni.getStorageSync('urls')
							// const isAllMatched = this.groupData[2].children.every(item => item.id ===
							// 	urlArr.id);
							// if (!isAllMatched) {
								data = {
									name: urlArr.name,
									id: urlArr.id,
									status: 1,
									children: [{
										group_desc: this.group_desc
									}]
								}
								this.groupData[2].children.push(data)
							// }
						}

					}
					this.group_desc = ''
					// this.group_name = ''
					this.group_order = ''
				}).catch(err => {
					console.log(err);
					this.$api.msg('数据请求失败')
				})
			},

			// 获取智能体信息
			getmodels() {
				this.groupList = []
				this.group_id = this.group_data[this.group_name][0].group_id
				this.group_order = this.group_data[this.group_name][0].group_order
				let val = {
					group_id: this.group_id,
					group_order: this.group_order,
					user_id: this.userInfo.user_id
				}
				models(val).then(res => {
					if (res.code == 20000) {
						Object.keys(res.data).forEach(key => {
							const category = res.data[key];
							const values = Object.values(category).map(item => {
								return item;
							});
							this.groupList.push({
								name: key,
								values: values
							});
						});
						console.log(this.groupList, 999);
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					console.log(err);
				})
			},
			delAgentAi(val) {
				console.log(val, 12630);
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该项吗？',
					success(res) {
						if (res.confirm) {
							let val2 = {
								user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id,
								group_id: val.group_id,
								agent_id: val.agent_id
							}
							delAgentModels(val2).then(res => {
								if (res.code === 20000) {
									that.$api.msg('删除成功')
									that.getGroups()
								} else {
									that.$api.msg(res.msg)
								}
							}).catch(err => {
								that.$api.msg('删除失败')
							})
						}
					},
				})
			},

			toAddAgent(val) {
				if (this.groupData[0].children == '' || this.groupData[1].children == '' || this.groupData[2].children ==
					'') {
					uni.showModal({
						content: '创建AI智能体需要先添加知识库内容，点击确定进行添加',
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/childCont/repository/group'
								})
							}
						}
					})
					return
				}
				if (val) {
					uni.navigateTo({
						url: '/childCont/repository/add_agent?val=' + JSON.stringify(val)
					})
				} else {
					uni.navigateTo({
						url: '/childCont/repository/add_agent'
					})
				}
			},
			toDocument() {
				uni.navigateTo({
					url: '/childCont/repository/document'
				})
			},
			toWebsite() {
				uni.navigateTo({
					url: '/childCont/repository/website'
				})
			},
			toPhoto() {
				uni.navigateTo({
					url: '/childCont/repository/photo'
				})
			},
			toAgent(item) {
				uni.navigateTo({
					url: '/childCont/repository/agent?item=' + JSON.stringify(item)
				})
			},
			toGroup() {
				uni.setStorageSync('resposNum',3)
				uni.navigateTo({
					url: '/childCont/repository/group'
				})
			},
			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},
			openMoer(arr) {
				console.log(arr, 678);
				this.displayLimit = arr.length
			},
			packUp() {
				this.displayLimit = 2
			}
		},
	}
</script>

<style lang="less" scoped>
	.main {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 32upx;
		margin-bottom: 32rpx;

		.main_title {
			margin-bottom: 34upx;

			.top {
				display: flex;
				align-items: center;


				.left {
					width: 3px;
					height: 18px;
					background: #1F64FF;
				}

				.middle {
					color: #393E45;
					font-size: 32upx;
					font-weight: 600;
					margin: 0 20upx 0 16upx;
				}

				image {
					width: 32upx;
					height: 32upx;
				}
			}
		}

		.group {
			margin-top: 32rpx;

			.top {
				display: flex;
				justify-content: space-between;
				margin-bottom: 24rpx;


			}
		}
	}

	.tag {
		color: #1F64FF;
		font-size: 26rpx;
		font-weight: 400;
	}

	.txt {
		color: #202123;
		font-size: 28rpx;
		font-weight: 500;
	}

	.card {
		margin-bottom: 20rpx;
		padding: 32rpx 32rpx 44rpx 32rpx;
		display: flex;
		border-radius: 20rpx;
		background: #F5F5F5;

		.avatar {
			width: 108rpx;
			height: 108rpx;
			border-radius: 50%;
		}

		.right {
			margin-left: 32rpx;
			width: 100%;

		}

		.right_top {
			display: flex;
			justify-content: space-between;

			.icon {
				display: flex;
				justify-content: space-between;
				width: 20%;

				.icon_l {
					width: 32rpx;
					height: 32rpx;
				}
			}
		}
	}

	.cont {
		color: #2C2C2E;
		font-size: 24rpx;
		font-weight: 400;
		width: 75%;
		margin-top: 8rpx;
	}

	.unfold {
		color: #1F64FF;
		font-size: 24rpx;
		font-weight: 400;
		display: flex;
		justify-content: center;
	}

	.bank {
		padding: 37rpx 32rpx;
		display: flex;
		justify-content: space-between;
		border-radius: 16rpx;
		background: #E5EDFF;
		margin-bottom: 20rpx;
		align-items: center;

		.left_t {
			color: #333;
			font-size: 30rpx;
			font-weight: 500;
		}

		.left_b {
			color: #666;
			font-size: 26rpx;
			font-weight: 400;
			margin-top: 8rpx;
		}
	}

	.bankIcon {
		width: 64rpx;
		height: 64rpx;
	}
</style>