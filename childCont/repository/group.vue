<template>
	<view style="background: #f6f8fb; min-height: 100vh;">
		<u-tabs :list="list" lineWidth='50' lineHeight='2' lineColor='#1f64ff'
			:activeStyle='{color: "#1F64FF","font-size":"30rpx"}' @change='tabsChange' :current='current'
			:inactiveStyle='{"font-size":"30rpx"}'></u-tabs>
		<view class="main">
			<view v-if="current != 3">
				<view class="group" v-if="groupList[current]"
					v-for="(item,index) in groupList[current].children" :key="index">
					<view class="group_l" @click="toPage(current,item)">
						<view class="l_txt">{{item.name}}</view>
					</view>
					<view class="group_r">
						<view class="icons" @click="editGroup(item)">
							<image :src="edit" class="icon_l"></image>
							<view class="title">编辑</view>
						</view>
						<view class="icons" @click="delGroup(item)">
							<image :src="delImg" class="icon_l"></image>
							<view class="title">删除</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 智能体 -->
			<view class="group" v-if='current==3 && group' v-for="(item,index) in group" :key="index">
				<view class="group_l" @click="toPage(current,item)">
					<view class="l_txt">{{item[0].group_name}}</view>
					<!-- <view class="l_cont">分类</view> -->
				</view>
				<view class="group_r">
					<view class="icons" @click="editGroup(item)">
						<image :src="edit" class="icon_l"></image>
						<view class="title">编辑</view>
					</view>
					<view class="icons" @click="delGroup(item)">
						<image :src="delImg" class="icon_l"></image>
						<view class="title">删除</view>
					</view>
				</view>
			</view>


		</view>
		<view class="add" @click="showing = true">
			<image :src="addGroup"></image>
		</view>
		<u-popup :show="showing" @close="close" mode="center">
			<view style="padding: 60rpx 40rpx;">
				<view style="display: flex;margin-bottom: 50rpx;">
					<view class="name">分组名称：</view><input type="text" placeholder="请输入分组名称" v-model="group_name" />
				</view>

				<view style="display: flex;margin-bottom: 20rpx;">
					<view class="name ">描述：</view><input type="text" placeholder="请输入描述" v-model="group_desc" />
				</view>
				<!-- <view style="display: flex;margin-bottom: 20rpx;" v-if="isEdit==0">
					<view class="name ">分组排序：</view><input type="text" placeholder="请输入描述" v-model="group_order" />
				</view> -->
				<view class="li_edit" @click="showing=false">
					<view class="edit_l">取消</view>
					<view class="edit_r" @click="submit">确认</view>
				</view>
			</view>

		</u-popup>
	</view>
</template>

<script>
	import {
		websites,
		groups,
		putDocuments,
		putPictures,
		putWebsites,
		delDocuments,
		delPictures,
		delWebsites,
		agentGroups,
		delAgentModels,
		editAgent
	} from '@/apis/chat.js'
	export default {
		data() {
			return {
				current: 0,
				list: [{
						name: '图片库'
					},
					{
						name: '文档库'
					},
					{
						name: '网址库'
					}, {
						name: '智能体'
					},
				],
				edit: global.baseImg + '/xcx/com/message_center/edit-3.png',
				delImg: global.baseImg + '/xcx/com/message_center/智能体trash.png',
				addGroup: global.baseImg + '/xcx/com/message_center/新建分组.png',
				showing: false,
				group_name: '',
				group_desc: '',
				group_order: 1,
				group_id: '',
				documents: {},
				pictures: {},
				urls: {},
				gro: {},
				userInfo: JSON.parse(uni.getStorageSync('userInfo')),
				groupList: [],
				isEdit: 0,
				status: 0,
				group: []
			};
		},
		onShow() {
			this.getGroups()
			this.getGroupsznt()
			if (uni.getStorageSync('resposNum') == 3) {
				this.current = 3
			} else if (uni.getStorageSync('resposNum') == 0) {
				this.current = 0
			} else if (uni.getStorageSync('resposNum') == 1) {
				this.current = 1
			} else if (uni.getStorageSync('resposNum') == 2) {
				this.current = 2
			}
			uni.setStorageSync('resposNum', '')
		},
		methods: {
			addChange() {
				this.show = true
			},
			tabsChange(e) {
				this.current = e.index
				console.log(this.current, 1113);
				if (this.current == 3) {
					this.getGroupsznt()
				} else {
					this.getGroups()
				}
			},

			getGroupsznt() {
				this.group = []
				agentGroups(this.userInfo.user_id).then(res => {
					// console.log(res, 9999);
					if (res.code == 20000) {
						this.group = res.data.agent
						console.log(this.group, 777);
						if (this.current == 3 && uni.getStorageSync('gro')) {
							let groArr = uni.getStorageSync('gro')
							const isAllMatched = Object.values(this.group).every(item => item[0].id ===
								groArr.id);
							// if (!isAllMatched) {
							let data = [{
								group_name: groArr.name,
								group_id: groArr.id,
								status: 1,
								group_desc: this.group_desc
							}]
							console.log(groArr, data, 1050);
							this.group[groArr.name] = data;
							console.log(this.group, groArr.name, 1713);
							// }
						}

						this.group_desc = ''
						this.group_name = ''
						this.group_order = ''
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					console.log(err);
				})
			},
			submit() {
				if (this.isEdit == 1) {
					let val
					val = {
						user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id,
						group_id: this.group_id,
						group_name: this.group_name,
						group_desc: this.group_desc
					}
					if (this.current == 0 && this.status != 1) {

						putPictures(val).then(res => {
							if (res.code == 20000) {
								this.$api.msg('修改成功')
							} else {
								this.$api.msg(res.msg)
							}
						})
					} else if (this.current == 1 && this.status != 1) {

						putDocuments(val).then(res => {
							if (res.code == 20000) {
								this.$api.msg('修改成功')
							} else {
								this.$api.msg(res.msg)
							}
						})
					} else if (this.current == 2 && this.status != 1) {

						putWebsites(val).then(res => {
							if (res.code == 20000) {
								this.$api.msg('修改成功')
							} else {
								this.$api.msg(res.msg)
							}
						})
					} else if (this.current == 3) {
						let val = {
							group_desc: this.group_desc,
							user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id,
							group_id: this.group_id,
							group_name: this.group_name,
						}
						console.log(val, 126);
						editAgent(val).then(res => {
							if (res.code == 20000) {
								this.$api.msg('修改成功')
								this.getGroupsznt()

							} else {
								this.$api.msg(res.msg)
							}
						}).catch()
					} else {
						let data = {
							name: this.group_id,
							id: this.group_name,
							status: 1,
							children: [{
								group_desc: this.group_desc
							}]
						}
						if (this.current == 0) {
							uni.setStorageSync('pictures', data)
						} else if (this.current == 1) {
							uni.setStorageSync('documents', data)
						} else if (this.current == 2) {
							uni.setStorageSync('urls', data)
						} else if (this.current == 3) {
							uni.setStorageSync('gro', data)
						}
					}
					this.isEdit = 0
					this.getGroups()
				} else {
					if (this.current == 0) {
						this.pictures = {
							name: this.group_name,
							id: new Date().getTime()
						}
						uni.setStorageSync('pictures', this.pictures)
						this.getGroups()
					} else if (this.current == 1) {
						this.documents = {
							name: this.group_name,
							id: new Date().getTime()
						}
						uni.setStorageSync('documents', this.documents)
						this.getGroups()
					} else if (this.current == 2) {
						this.urls = {
							name: this.group_name,
							id: new Date().getTime()
						}
						uni.setStorageSync('urls', this.urls)
						this.getGroups()

					} else if (this.current == 3) {
						this.gro = {
							name: this.group_name,
							id: new Date().getTime()
						}
						uni.setStorageSync('gro', this.gro)
						this.getGroupsznt()
					}
					console.log(this.pictures, this.documents, this.urls, this.gro, 936);
					uni.showModal({
						content: '添加成功，请点击分组添加内容，否则下次新建分组时将替换此前无内容的分组！'
					})
				}
				this.showing = false
				this.$forceUpdate()

			},
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
						this.groupList = []
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

						console.log(this.groupList, 1015);
						let data
						if (this.current == 0 && uni.getStorageSync('pictures')) {
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
						} else if (this.current == 1 && uni.getStorageSync('documents')) {
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
						} else if (this.current == 2 && uni.getStorageSync('urls')) {
							let urlArr = uni.getStorageSync('urls')
							const isAllMatched = this.groupList[2].children.every(item => item.id ===
								urlArr.id);
							if (!isAllMatched || this.groupList[2].children == '') {
								data = {
									name: urlArr.name,
									id: urlArr.id,
									status: 1,
									children: [{
										group_desc: this.group_desc
									}],
									group_order: 1
								}
								this.groupList[2].children.push(data)
							}
						}

					}
					this.group_desc = ''
					this.group_name = ''
					this.group_order = ''
				}).catch(err => {
					console.log(err);
					this.$api.msg('数据请求失败')
				})
			},

			toPage(index, obj) {
				if (index == 0) {
					uni.navigateTo({
						url: '/childCont/repository/photo?obj=' + JSON.stringify(obj)
					})
				} else if (index == 1) {
					uni.navigateTo({
						url: '/childCont/repository/document?obj=' + JSON.stringify(obj)
					})
				} else if (index == 2) {
					uni.navigateTo({
						url: '/childCont/repository/website?obj=' + JSON.stringify(obj)
					})
				} else if (index == 3) {
					uni.navigateTo({
						url: '/childCont/repository/repository?obj=' + JSON.stringify(obj)
					})
				}
			},
			editGroup(item) {
				console.log(item, 'edit');
				this.isEdit = 1
				this.showing = true

				if (this.current == 3) {
					this.group_id = item[0].group_id
					this.group_name = item[0].name
					this.group_desc = item[0].group_desc
				} else {
					this.group_name = item.name
					this.group_desc = item.children[0].group_desc
					if (this.group_desc == 'None') {
						this.group_desc = ''
					}
					this.group_id = item.id
					this.status = item.status
				}

			},
			delGroup(item) {
				console.log(item, 'del');
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该项吗？',
					success(res) {
						if (res.confirm) {


							let val = {
								user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id,
								group_id: item.id
							}
							if (that.current == 0 && item.status != 1) {
								delPictures(val).then(res => {
									if (res.code === 20000) {
										that.$api.msg('删除成功')
										that.getGroups()
									} else {
										that.$api.msg(res.msg)
									}
								}).catch(err => {
									that.$api.msg('删除失败')
								})
							} else if (that.current == 1 && item.status != 1) {
								delDocuments(val).then(res => {
									if (res.code === 20000) {
										that.$api.msg('删除成功')
										that.getGroups()
									} else {
										that.$api.msg(res.msg)
									}
								}).catch(err => {
									that.$api.msg('删除失败')
								})
							} else if (that.current == 2 && item.status != 1) {
								delWebsites(val).then(res => {
									if (res.code === 20000) {
										that.$api.msg('删除成功')
										that.getGroups()
									} else {
										that.$api.msg(res.msg)
									}
								}).catch(err => {
									that.$api.msg('删除失败')
								})
							} else if (that.current == 3 && item[0].status != 1) {
								let val2 = {
									user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id,
									group_id: item[0].group_id
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
							} else {
								if (that.current == 0) {
									console.log(11111);
									that.groupList[0].children.pop()
									uni.setStorageSync('pictures', '')
								} else if (that.current == 1) {
									that.groupList[1].children.pop()
									uni.setStorageSync('documents', '')
								} else if (that.current == 2) {
									that.groupList[2].children.pop()
									uni.setStorageSync('urls', '')
								} else if (that.current == 3) {
									const keys = Object.keys(that.group);
									const lastKey = keys[keys.length - 1];
									delete that.group[lastKey];
									uni.setStorageSync('pro', '')
									that.getGroupsznt()
								}
								that.$api.msg('删除成功')
							}

						}
						that.isEdit = 0
					}
				});
			},
			close() {
				this.showing = false
				this.isEdit = 0
			}

		}
	}
</script>

<style lang="less" scoped>
	.main {
		padding: 32rpx;
	}

	.group {
		border-radius: 8rpx;
		background: #FFF;
		padding: 40rpx 32rpx;
		display: flex;
		justify-content: space-between;
		margin-bottom: 24rpx;
	}

	.group_l {
		width: 66%;

		.l_txt {
			color: #3D3D3D;
			font-size: 28rpx;
			font-weight: 500;
		}

		.l_cont {
			color: #3D3D3D;
			font-size: 26rpx;
			font-weight: 400;
			margin-top: 16rpx;
		}
	}

	.group_r {
		display: flex;

		.icons {
			margin-left: 48rpx;

			.icon_l {
				width: 40rpx;
				height: 40rpx;
			}

			.title {
				color: #3F3F3F;
				font-size: 22rpx;
				font-weight: 400;
			}
		}

	}

	.add {
		position: fixed;
		right: 32rpx;
		bottom: 80rpx;
		z-index: 9999;

		image {
			width: 120rpx;
			height: 120rpx;
		}
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

	/deep/.u-popup {
		z-index: 9999;
	}
</style>