<template>
	<view>
		<view class="cont_top">
			<view class="top_l">
				<u-tabs :list="list" lineWidth='40' lineHeight='2' lineColor='#1f64ff'
					:activeStyle='{color: "#000","font-size":"30rpx"}' @change='tabsChange'
					:inactiveStyle='{"font-size":"30rpx", color: "#6F6F6F"}'></u-tabs>
			</view>
			<view class="top_r" @click="isEdit = true" v-if="!isEdit && video_type == 1">管理</view>
			<view class="top_r" @click="isEdit = false" v-if="isEdit && video_type == 1">取消</view>
		</view>
		
		<view v-if="video_type == 1">
			<scroll-view class="list_ul" scroll-y="true" v-if="infoList.length > 0">
				<view class="cont_list" v-for="(item, index) in infoList" :key="index">
					<view class="list_li" @click="toDetail(item.project_code)">
						<image class="li_img" mode="aspectFit" :src="getImgUrl(item.video_cover_url)"></image>
						<view class="li_text">
							<view class="text_l">
								<view class="li_title">{{ item.project_name }}</view>
								<view class="li_clock">
									<u-icon name="clock" color="#A5A6A8" size="14"></u-icon>
									<text class="li_time">{{ item.create_time }}</text>
								</view>
								<view class="li_source">本地草稿</view>
							</view>
							<view class="text_r" v-if="isEdit">
								<image class="r_img" :src="uncheckImg" v-if="!item.isCheck" @click.stop="selectDel(index)"></image>
								<image class="r_img" :src="checkImg" v-if="item.isCheck" @click.stop="unSelectDel(index)"></image>
							</view>
						</view>
						
					</view>
				</view>
			</scroll-view>
			
			<view class="on_order" v-if="infoList.length == 0">
				<view class="on_order_list">暂无相关内容</view>
			</view>
					
			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
			
		</view>
		
		<view v-if="video_type == 2">
			<view class="select_tab">
				<view :class="select_type == 0 ? 'tabs_active' : 'tabs'" @click="getList(0)">全部</view>
				<view :class="select_type == 1 ? 'tabs_active' : 'tabs'" @click="getList(1)" >队列中</view>
				<view :class="select_type == 2 ? 'tabs_active' : 'tabs'" @click="getList(2)" >制作中</view>
				<view :class="select_type == 3 ? 'tabs_active' : 'tabs'" @click="getList(3)" >制作成功</view>
				<view :class="select_type == 4 ? 'tabs_active' : 'tabs'" @click="getList(4)" >制作失败</view>
			</view>
			
			<scroll-view class="list_ul" scroll-y="true" v-if="makeList.length > 0">
				<view class="cont_list" v-for="(item, index) in makeList" :key="index">
					<view class="list_li">
						<image class="li_img" mode="aspectFit" :src="getImgUrl(item.video_cover_url)"></image>
						<view class="li_text">
							<view class="text_l">
								<view class="li_title">{{ item.video_name }}</view>
								<view class="li_clock">
									<u-icon name="clock" color="#A5A6A8" size="14"></u-icon>
									<text class="li_time">{{ item.create_time }}</text>
								</view>
								<view class="li_status" style="background: rgba(31, 100, 255, 0.10); color: #f9ae3d" v-if="item.make_status == 1">队列中</view>
								<view class="li_status" style="background: rgba(31, 100, 255, 0.10); color: #1F64FF" v-if="item.make_status == 2">制作中</view>
								<view class="li_status" style="background: rgba(50, 190, 72, 0.10); color: #32BE48" v-if="item.make_status == 3">制作成功</view>
								<view class="li_status" style="background: rgba(247, 68, 57, 0.10); color: #F74439" v-if="item.make_status == 4">制作失败</view>
							</view>
							<view class="text_r" v-if="item.make_status > 2">
								<image class="more_img" :src="moreImg" @click.stop="selectMake(index, item.make_status)"></image>
							</view>
						</view>
						
					</view>
				</view>
			</scroll-view>
			
			<view class="on_order" v-if="makeList.length == 0">
				<view class="on_order_list">暂无相关内容</view>
			</view>
					
			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
			
		</view>
		
		<view class="cont_btn" v-if="isEdit && video_type == 1">
			<view class="btn_del" @click="delSelect">删除</view>
		</view>
		
		<u-popup :show="voiceShow" mode="bottom" :round="10" @close="voiceShow=false">
			<view class="voice_info" v-if="makeType == 4">
				<view class="info_li" style="border-bottom: 1upx solid #e6e6e8;" @click="againSubmit">重新提交训练</view>
				<view class="info_li" @click="toPhone">联系客服</view>
			</view>
			
			<view class="voice_info" v-if="makeType == 3">
				<view class="info_li" style="border-bottom: 1upx solid #e6e6e8;" @click="checkVideo">导出视频</view>
			</view>
		</u-popup>
		
	</view>
</template>

<script>
    import { getPrevProject, getEndProject,delProject,againProject } from '@/apis/user.js'
	export default {
		data() {
			return {
				list: [{
					id: 1,
					name: '草稿箱'
				},{
					id: 2,
					name: '已导出视频'
				}],
				infoList: [],
				endList: [],
				checkImg: global.baseImg+'/xcx/com/message_center/Frame%20427320067.png',
				uncheckImg: global.baseImg+'/xcx/com/message_center/Rectangle%2034625192.png',
				moreImg: global.baseImg+'/xcx/com/message_center/Frame%20427320062.png',
				isEdit: false,
				video_type: 1,
				page_no: 1,
				page_count: 10,
				pageTotal: 0,
				loadingType: 0,
				
				//导出视频
				make_status: '',
				makeList: [],
				voiceShow: false,
				makeType: '',
				makeTip: '',
				select_type:0,
			}
		},
		components: {
	      
		},
		onLoad(option) {
           
		},
		onShow() {
			this.getRecord()
		},
		methods: {
			// 获取草稿列表
			getRecord() {
				let val = {
					page_size: this.page_count,
					page: this.page_no,
					project_status: 1
				}
				getPrevProject(val).then(res => {
					if (res.code == 20000) {
						this.infoList = res.data.data;	
						this.infoList.forEach((ele)=>{
							ele.isCheck = false
						})
						let total = res.data.total;
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						if (this.pageTotal == 1) {
							this.loadingType = 1;
						}
						if(this.infoList.length == 0) {
							this.loadingType = 0
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取列表失败');
				})
				
			},
			
			//切换tabs
			getList(tip) {
				this.select_type = tip
				let type = ''
				if(tip == 0) {
					this.make_status = ''
				} else {
					this.make_status = tip
				} 
				this.getEndList()
			},
			
			// 获取导出列表
			getEndList() {
				let val = {
					page_size: this.page_count,
					page: this.page_no,
					make_status: this.make_status
				}
				getEndProject(val).then(res => {
					if (res.code == 20000) {
						this.makeList = res.data.data;	
						console.log((this.makeList,663))
						let total = res.data.total;
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						if (this.pageTotal == 1) {
							this.loadingType = 1;
						}
						if(this.makeList.length == 0) {
							this.loadingType = 0
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取列表失败');
				})
				
			},
			
			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				if(this.video_type == 1) {
					let val = {
						page_size: this.page_count,
						page: this.page_no,
						project_status: 1
					}
					getHumanList(val).then(res => {
						if (res.code == 20000) {
								
							let total = res.data.total;
							if (total == 0) return
							let List = res.data.data;
							let addList = this.infoList;
							List.forEach(item => {
								item.isCheck = false
								addList.push(item);
							});
								
							if (total % this.page_count == 0) {
								this.pageTotal = total / this.page_count
							} else {
								this.pageTotal = parseInt(total / this.page_count) + 1
							}
							// console.log(this.pageTotal, 158)
							if (this.pageTotal <= this.page_no) {
								this.loadingType = 1 
							}
						} else {
							this.$api.msg(res.msg);
						}
					}).catch(err => {
						this.$api.msg('获取列表失败');
					})
				} else {
					let val = {
						page_size: this.page_count,
						page: this.page_no,
						make_status: this.make_status
					}
					getEndProject(val).then(res => {
						if (res.code == 20000) {
								
							let total = res.data.total;
							if (total == 0) return
							let List = res.data.data;
							let endList = this.makeList;
							List.forEach(item => {
								endList.push(item);
							});
								
							if (total % this.page_count == 0) {
								this.pageTotal = total / this.page_count
							} else {
								this.pageTotal = parseInt(total / this.page_count) + 1
							}
							// console.log(this.pageTotal, 158)
							if (this.pageTotal <= this.page_no) {
								this.loadingType = 1 
							}
						} else {
							this.$api.msg(res.msg);
						}
					}).catch(err => {
						this.$api.msg('获取列表失败');
					})
				}
				
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			toDetail(code) {
				uni.navigateTo({
					url: '/childCont/figure/figure_oral?project_code='+ code,
				})
			},
			
			selectDel(index) {
				this.infoList[index].isCheck = true
				this.$forceUpdate()
			},
			
			unSelectDel(index) {
				this.infoList[index].isCheck = false
				this.$forceUpdate()
			},
			
			//删除
			delSelect() {
				let arr = []
				this.infoList.forEach((ele)=>{
					if(ele.isCheck == true) {
						arr.push(ele.project_code)
					}
				})
				let val = {
					project_code_list: arr
				}
				delProject(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('删除成功')
						this.getRecord()
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('删除失败');
				})
			},
			
			tabsChange(e) {
				if(e.id == 1) {
					this.page_no = 1;
					this.loadingType = 0
					this.video_type = 1
					this.getRecord()
				} else {
					this.page_no = 1;
					this.loadingType = 0
					this.video_type = 2
					this.getEndList()
				}
			},
			
			selectMake(index, tip) {
				this.voiceShow = true;
				this.makeType = tip
				this.makeTip = index
			},
			
			toPhone() {
				uni.makePhoneCall({
					phoneNumber: '18312403087'
				});
			},
			
			//重新提交训练
			againSubmit() {
				let val = {
					live_dtl_code: this.makeList[this.makeTip].live_dtl_code
				}
				againProject(val).then(res => {
					if (res.code == 20000) {
						this.$api.msg('提交成功')
						this.page_no = 1;
						this.loadingType = 0
						this.video_type = 2
						this.voiceShow = false
						this.getEndList()
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('提交失败');
				})
			},
			
			//查看视频
			checkVideo() {
				this.voiceShow = false
				let video_url = this.makeList[this.makeTip].complete_url
				uni.navigateTo({
					url: '/childCont/figure/play?video_url=' + video_url,
				})
			}
			
		}
	}
</script>

<style lang="less" scoped>
	page { background: #fff }
	.cont_top { 
		width: 100%;
		padding: 20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1upx solid #e6e6e8;
		.top_r {
			color: #6C6C6C;
			font-size: 30upx;
			font-weight: 400;
			line-height: 48upx;
		}
	}
	
	.cont_list {
		width: 100%;
		padding: 20upx;
		display: flex;
		flex-direction: column;
		.list_li {
			display: flex;
			background: #fff;
			border-radius: 6upx;
			.li_img {
				border-radius: 6upx;
				width: 180upx;
				height: 140upx;
			}
			.li_text {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 20upx;
				flex: 1;
				.text_l {
					display: flex;
					flex-direction: column;
					.li_title {
						color: #000;
						font-size: 34upx;
						font-style: normal;
						font-weight: 600;
						line-height: 48upx;
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.li_clock {
						display: flex;
						align-items: center;
						.li_time {
							color: #A5A6A8;
							font-size: 24upx;
							font-style: normal;
							font-weight: 400;
							line-height: 48upx;
							padding-left: 6upx;
							margin-top: 5upx;
						}
					}
					.li_status {
						border-radius: 4upx;
						padding: 10upx;
						font-size: 24upx;
						font-style: normal;
						font-weight: 400;
						line-height: 150%;
						text-align: center;
						width: 120upx;
					}
				}
				
				.text_r {
					.r_img {
						width:28upx;
						height: 28upx;
					}
					.more_img {
						width:5upx;
						height: 30upx;
					}
				}
				
			}
		}
	}
	
	.cont_btn {
		width: 100%;
		height:100upx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		.btn_del {
			width: 80%;
			border-radius: 10upx;
			background: #FF4533;
			padding: 20upx;
			font-size: 32upx;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	
	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80vh;
		width: 100vw;
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
	.voice_info {
		width: 100%;
		height: 15vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 20upx;
		.info_li {
			width: 100%;
			font-size: 30upx;
			color: #1F64FF;
			line-height: 90upx;
			text-align: center;
		}
	}
	
	.select_tab {
		display: flex;
		padding: 15upx;
		.tabs {
			border-radius: 10upx;
			background: #F6F6F6;
			color: #747474;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
			line-height: 48upx;
			padding: 10upx 20upx;
			margin-right: 15upx;
		}
		
		.tabs_active {
			border-radius: 10upx;
			background: #1F64FF;
			color: #fff;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
			line-height: 48upx;
			padding: 10upx 20upx;
			margin-right: 15upx;
		}
	}
</style>