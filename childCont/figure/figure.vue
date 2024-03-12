<template>
	<view class="containar">
		<view class="ad_back">
			<image class="banner_img" :src='backImg' />
			<view class="ad_btn" @click="showInfo = true">
				<text class="ad_text">立即体验</text>
				<u-icon name="arrow-right" color=" #1F64FF" size="16" :bold="true"></u-icon>
			</view>
		</view>
		
		<view class="cont_link">
			<view class="link_l"><image :src="peoImg" alt="" @click="toVoice" mode="aspectFit" class="l_img"></image></view>
			<view class="link_l">
				<image :src="speakImg" alt="" @click="addFigure" mode="aspectFit" class="r_img" style="margin-top: 10upx;"></image>
				<image :src="wxImg" alt="" @click="addVoice" mode="aspectFit" class="r_img"></image>
			</view>
		</view>
		
		<view class="cont_user">
			<view class="cont_ul">
				<view class="user_icon">
					
					<view class="icon_list" @click="myVideo">
						<view class="list_li">
							<image class="icon_img" :src='adImg' />
							<text class="icon_title">我的视频</text>
						</view>
					</view>
					
					<view class="icon_list" @click="myFigure">
						<view class="list_li">
							<image class="icon_img" :src='fgImg' />
							<text class="icon_title">我的形象</text>
						</view>
					</view>
					
					<view class="icon_list" @click="myVoice">
						<view class="list_li">
							<image class="icon_img" :src='qsImg' />
							<text class="icon_title">我的声音</text>
						</view>
					</view>
					
					<view class="icon_list">
						<view class="list_li" @click="toOrder">
							<image class="icon_img" :src='versionImg' />
							<text class="icon_title">订单记录</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="tab_ul">
			<u-tabs :list="list" lineWidth='40' lineHeight='2' lineColor='#1f64ff'
				:activeStyle='{color: "#000","font-size":"30rpx"}' @change='tabsChange'
				:inactiveStyle='{"font-size":"30rpx", color: "#6F6F6F"}'></u-tabs>
		</view>
		
		<view class="chat_cont" >
			<scroll-view class="list_ul" scroll-y="true" v-if="infoList.length > 0">
			    <view class="ul_li">
					<view class="ul_style" v-for="(item, index) in infoList" :key="index">
						<view class="li_style" @click="toRoal(item)">
							<view class="li_wz">
								<image class="li_img" :src="getImgUrl(item.video_cover_url)" mode="aspectFit"></image>
							</view>
							<view class="li_text">{{ item.live_name }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="on_order" v-if="infoList.length == 0">
				<view class="on_order_list">暂无相关内容</view>
			</view>
		
			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
		</view>
		
		<!-- <view class="slove" @click="toProduct">
			<text class="slove_text">查看定制</text>
			<u-icon name="arrow-right" color="#000" size="18"></u-icon>
		</view> -->
		
		<!-- 立即体验 -->
		<u-modal :show="showInfo" @cancel="closeInfo" confirmText="提交" confirmColor="#1F64FF" :showCancelButton='true'
			@confirm="changeInfo">
			<view class="key_cont" style="">
				<view class="title">输入信息</view>
				<view class="cont_ul">
					<text class="ul_text">姓&nbsp;&nbsp;名</text>
					<u-input :customStyle='{"padding":"8px", "width":"100%"}' inputAlign="center" v-model="userName"
						placeholder="请输入用户名" type="text" ></u-input>
				</view>
				<view class="cont_ul">
					<text class="ul_text">手机号</text>
					<u-input :customStyle='{"padding":"8px", "width":"100%"}' inputAlign="center" v-model="phone"
						placeholder="请输入手机号" type="text" ></u-input>
				</view>
				
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		getDigital,createExperience,getHumanList
	} from '@/apis/user.js'

	export default {
		data() {
			return {
				backImg: global.baseImg+'/xcx/82e232fa-bd85-4c6d-ba56-3f5e51021f57.jpg',
				
				//立即体验
				showInfo: false,
				userName: '',
				phone: '',
				isClick: true,
				kfInfo: false,
				
				list: [{
					id: 0,
					name: '真人数字人'
				},{
					id: 1,
					name: '我的数字人'
				}],
				
				// 历史记录
				page_no: 1,
				page_count: 10,
				recordList: [],
				pageTotal: 0,
				loadingType: 0,
				peoImg: global.baseImg+'/xcx/com/message_center/Frame%20427320074.png',
				speakImg: global.baseImg+'/xcx/com/message_center/Frame%20427320033.png',
				wxImg: global.baseImg+'/xcx/com/message_center/Frame%20427320034.png',
				
				adImg: global.baseImg+'/xcx/com/message_center/film.png',
				fgImg: global.baseImg+'/xcx/com/message_center/数字人形象icon.png',
				qsImg: global.baseImg+'/xcx/com/message_center/Frame%20427320061.png',
				versionImg: global.baseImg+'/xcx/0fbfb940-6e78-4e77-951f-8bb33839406b.jpg',
				live_type: 0,
				infoList: []
			}
		},
		components: {

		},
		onLoad(option) {
			// this.init()
		},
		onShow() {
			this.page_no = 1;
			this.loadingType = 0;
			this.getRecord()
		},
		methods: {
			
			// 获取数字人列表
			getRecord() {
				let val = {
					page_size: this.page_count,
					page: this.page_no,
					// live_type: this.live_type
				}
				getHumanList(val).then(res => {
					if (res.code == 20000) {
						this.infoList = res.data.data;			
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
					this.$api.msg('获取失败');
				})
				
			},
			
			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
					page_size: this.page_count,
					page: this.page_no
				}
				getHumanList(val).then(res => {
					if (res.code == 20000) {
			
						let total = res.data.total;
						if (total == 0) return
						let List = res.data.data;
						let addList = this.infoList;
						List.forEach(item => {
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
			},
			
			// 关闭体验弹窗
			closeInfo() {
				this.showInfo = false
			},
			
			changeInfo() {
				if (this.userName == "") {
					this.$api.msg('用户名不能为空！');
					return
				}
			
				if (this.phone == "") {
					this.$api.msg('手机号不能为空！');
					return
				}
			
				var TEL_REGEXP = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
				if (!TEL_REGEXP.test(this.phone)) {
					this.$api.msg('手机号格式不正确！');
					return
				}
			
				if (this.isClick == false) {
					return false;
				}
				this.isClick = false;
			
				let val = {
					'name': this.userName,
					'mobile': this.phone,
				}
			
				createExperience(val).then(res => {
					if (res.code == 20000) {
						// console.log(JSON.stringify(res.data),789);
						uni.showToast({
							title: '提交成功',
							icon: 'success',
							duration: 1500
						})
						this.userName = '';
						this.phone = '';
						this.isClick = true;
						this.showInfo = false
					} else {
						this.isClick = true;
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.isClick = true;
					this.$api.msg('信息提交失败');
				})
			},
			
			
			addFigure() {
				uni.navigateTo({
					url: '/childCont/figure/figure_video',
				})
			},
			
			addVoice() {
				uni.navigateTo({
					url: '/childCont/clone/my_voice'
				})
				// uni.navigateTo({
				// 	url: '/childCont/figure/figure_voice',
				// })
			},
			
			toProduct() {
				uni.navigateTo({
					url: '/childCont/figure/figure_product',
				})
			},
			
			toRoal(item) {
				uni.navigateTo({
					url: '/childCont/figure/figure_oral?info='+ JSON.stringify(item),
				})
			},
			
			toVoice() {
				uni.navigateTo({
					url: '/childCont/figure/figure_oral',
				})
			},
			
			myVideo() {
				uni.navigateTo({
					url: '/childCont/figure/my_video',
				})
			},
			
			myFigure() {
				uni.navigateTo({
					url: '/childCont/figure/figure_product',
				})
			},
			
			myVoice() {
				uni.navigateTo({
					url: '/childCont/clone/my_voice'
				})
				// uni.navigateTo({
				// 	url: '/childCont/figure/my_voice',
				// })
			},
			
			toOrder() {
				uni.navigateTo({
					url: '/childCont/figure/figure_order',
				})
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			tabsChange(e) {
				this.live_type = e.id;
				this.getRecord()
			}
			
		}
	}
</script>

<style lang="less" scoped>
	page { background: #fff; }
	.containar { padding: 25upx; }
	.ad_back {
		width: 100%;
		height: 280upx;
		position: relative;
		margin-bottom: 20upx;
		.banner_img {
			width: 100%;
			height: 280upx;
		}
		.ad_btn {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #fff;
			border-radius: 8upx;
			width: 190upx;
			height: 64upx;
			position: absolute;
			top: 180upx;
			left: 36upx;
			.ad_text {
				color: #1F64FF;
				font-size: 26upx;
				font-style: normal;
				font-weight: 500;
				line-height: 150%;
				margin-left: 20upx;
			}
		}
		
	}
	.ad_btn:active {
		opacity: 0.5;
	}
	
	.cont_link {
		width: 100%;
		background: #fff;
		border-radius: 10upx;
		background: #FFF;
		padding: 20upx 0upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20upx;
		.link_l {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			.l_img {
				width: 340upx;
				height: 310upx;
			}
			.r_img {
				width: 340upx;
				height: 150upx;
			}
		}
	}
	
	.cont_user {
		// padding: 0upx 32upx;
		margin: 20upx 0;
		.cont_ul {
			background: #fff;
			border-radius: 14upx;
			.user_icon {
				display: flex;
				// justify-content: space-around;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: wrap;
				padding: 0 20upx;
				.icon_list {
					display: flex;
					justify-content: flex-start;
					align-items: flex-start;
					margin: 10upx 0;
					width: 25%;
					.list_li {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						.icon_img {
							width:48upx;
							height: 48upx;
						}
						.icon_title {
							color: #333;
							font-size: 24upx;
							font-style: normal;
							font-weight: 400;
							line-height: 36upx;
							margin-top: 12upx;
						}
					}
					
				}
			}
		}
		
	}
	
	.chat_cont {
		margin-top: 20upx;
	}
	.list_ul {
		width: 100%;
		.ul_li{
			display: flex;
			align-items: center;
			justify-content: flex-start;
			flex-wrap: wrap;
		}
	}
	
	.ul_style {
		width: 50%;
	}
	
	.li_style {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		width:95%;
		.li_wz {
			position: relative;
			// padding: 10upx;
		}
		.li_img {
			width: 320upx;
			height: 320upx;
			border-radius: 30upx;
			border: 1px solid #E9E9E9;
			background: #FFF;
		}
		.li_text {
			color: #000;
			font-size: 22upx;
			font-style: normal;
			font-weight: 400;
			line-height: 50upx;
		}
		
	}
	
	
	
	.li_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 18upx;
	}
	
	.top_l {
		ont-weight: 400;
		font-size: 28upx;
		line-height: 42upx;
		color: #333;
		width: 90%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.top_r {
		ont-weight: 400;
		font-size: 24upx;
		line-height: 30upx;
		color: #6E7480;
		;
	}
	
	.li_btn {
		font-weight: 400;
		font-size: 24upx;
		line-height: 35upx;
		color: #6E7480;
	}
	
	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 30vh;
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
</style>