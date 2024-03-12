<template>
	<view>
		<view class="cont_top">
			<view class="top_l">
				<u-tabs :list="list" lineWidth='40' lineHeight='2' lineColor='#1f64ff'
					:activeStyle='{color: "#000","font-size":"30rpx"}' @change='tabsChange'
					:inactiveStyle='{"font-size":"30rpx", color: "#6F6F6F"}'></u-tabs>
			</view>
		</view>
		
		<view v-if="me_type == 1">
			<scroll-view class="list_ul" scroll-y="true" v-if="infoList.length > 0">
				<view class="cont_list" v-for="(item, index) in infoList" :key="index">
					<view class="list_li">
						<view class="li_line">
							<image class="li_img" mode="aspectFit" :src="getImgUrl(item.avatar)"></image>
							<text class="li_title">{{ item.character_name }}</text>
						</view>
						<view class="li_cont">{{ item.introduction }}</view>
						
						<view class="li_edit">
							<view class="edit_l" @click.stop="mentorChat(item.avatar, item.greeting,item.me_id,item.tutor_id)">对话</view>
						</view>
						
					</view>
				</view>
			</scroll-view>
			
			<view class="on_order" v-if="infoList.length == 0">
				<view class="on_order_list">暂无相关内容</view>
			</view>
					
		</view>
		
		<view v-if="me_type == 2">
			<scroll-view class="list_ul" scroll-y="true" v-if="myList.length > 0">
			    <view class="ul_li" v-for="(res, tip) in myList" :key="tip">
					<view class="li_me">{{ res.me.name }}</view>
			    	<view class="cont_list" v-for="(item, index) in res.tutor" :key="index" v-if="JSON.stringify(item) != '{}'">
			    		<view class="list_li">
			    			<view class="li_lines">
			    				<view class="line_l">
			    					<image class="li_img" mode="aspectFit" :src="getImgUrl(item.avatar)"></image>
			    					<text class="li_title">{{ item.character_name }}</text>
			    				</view>
			    				<view @click.stop="delMentor(item.tutor_id, item.me_id)"><u-icon name="trash" size="20" ></u-icon></view>
			    			</view>
			    			<view class="li_cont">{{ item.introduction }}</view>
			    			
			    			<view class="li_edit">
								<view class="edit_l" @click.stop="toDetail(item.tutor_id)">编辑</view>
			    				<view class="edit_r" @click.stop="mentorChat(item.avatar, item.greeting,item.me_id,item.tutor_id)">对话</view>
			    			</view>
			    			
			    		</view>
			    	</view>
			    </view>
				
			</scroll-view>
			
			<view class="on_order" v-if="myList.length == 0">
				<view class="on_order_list">暂无相关内容</view>
			</view>
			
			<view class="add_pic" @click="toAdd">
				<image class="add_img" :src="addPic" mode=""></image>
			</view>
					
		</view>
		
		
		<view v-if="me_type == 3">
			<scroll-view class="list_ul" scroll-y="true" v-if="owerList.length > 0">
				<view class="cont_list" v-for="(item, index) in owerList" :key="index">
					<view class="list_li">
						<view class="li_lines">
							<view class="line_l">
								<image class="li_img" mode="aspectFit" :src="getImgUrl(item.photo)"></image>
								<text class="li_title">{{ item.name }}</text>
							</view>
							<!-- <view @click.stop="delMe(item.me_id)"><u-icon name="trash" size="20" ></u-icon></view> -->
						</view>
						<view class="li_cont">{{ item.greeting }}</view>
						
						<view class="li_edit">
							<view class="edit_l" @click.stop="toOwerDetail(item.me_id)">编辑</view>
							<view class="edit_r" @click.stop="mentorChat(item.photo, item.greeting,item.me_id,'')">对话</view>
						</view>
						
					</view>
				</view>
			</scroll-view>
			
			<view class="on_order" v-if="owerList.length == 0">
				<view class="on_order_list">暂无相关内容</view>
			</view>
					
		</view>
		
		<!-- <view class="wz_tip"  @click="toCreate"><image :src="creatImg" mode="" class="creat_img"></image></view> -->
	</view>
</template>

<script>
    import { getTutor, delTutor, creatTutor, getMe, getAllMe, delMe } from '@/apis/user.js'
	export default {
		data() {
			return {
				list: [{
					id: 1,
					name: '推荐导师'
				},{
					id: 2,
					name: '我的专属导师'
				},{
					id: 3,
					name: '我'
				}],
				infoList: [],// 内荐导师
				myList: [],//自荐导师
				owerList: [],//自荐导师
				me_type: 1,
				
				creatImg: global.baseImg+'/xcx/f0785792-267f-472b-b9aa-8144328cf9a4.jpg',
				addPic:global.baseImg+'/xcx/com/message_center/%E5%88%9B%E5%BB%BA.png',
				sort: 0,
				me_id: 0
			}
		},
		components: {
	      
		},
		onLoad(option) {
           if(option.sort) {
			   this.sort = option.sort
			   this.me_id = option.me_id
		   }
		},
		onShow() {
			this.getTutor()
		},
		methods: {
			// 获取导师列表
			getTutor() {
			  let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			  let val = ''
			  if(this.me_type == 1) {
				  val = {
				  	  'is_built_in': '1',
				  }
				  
				  getTutor(val).then(res => {
					  if (res.code == 20000) {
						  this.infoList = res.data
					  } else {
						  this.$api.msg(res.msg);
					  }
				  }).catch(err => {
				  	  this.$api.msg('获取导师失败');
				  })
			  } else if(this.me_type == 2) {
				  val = {
					  'user_id': userInfo.user_id,
				  }

				  getMe(val).then(res => {
					  if (res.code == 20000) {
						  if(res.data.length > 0) {
							 let meArr = []
							 res.data.map((item, index)=>{
								 meArr.push(item.me_id)
							 })
							 this.getAllMe(meArr)
						  }
					  } else {
						  this.$api.msg(res.msg);
					  }
				  }).catch(err => {
				  		  this.$api.msg('获取导师失败');
				  })
			  } else {
				  val = {
				  	  'user_id': userInfo.user_id,
				  }
				  
				  getMe(val).then(res => {
					  if (res.code == 20000) {
						 this.owerList = res.data
					  } else {
						  this.$api.msg(res.msg);
					  }
				  }).catch(err => {
				  		  this.$api.msg('获取导师失败');
				  })
			  }

			},
			
			//获取我的所有信息
			getAllMe(arr) {
			  let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			  let val = {
				  'me_ids': JSON.stringify(arr),
			  }
			  getAllMe(val).then(res => {
				  if (res.code == 20000) {
					  if(res.data.length > 0) {
						 this.myList = res.data
					  }
					  
				  } else {
					  this.$api.msg(res.msg);
				  }
			  }).catch(err => {
				  this.$api.msg('获取导师失败');
			  })
			},
			
			toDetail(code) {
				uni.navigateTo({
					url: '/childPage/mentor/add_list?tutor_id='+ code,
				})
			},
			
			toOwerDetail(id) {
				uni.navigateTo({
					url: '/childPage/mentor/add_mentor?me_id='+ id,
				})
			},
			
			tabsChange(e) {
				console.log(e,66666666);
				this.me_type = e.id
				this.getTutor()
			},

			toCreate() {
				uni.navigateTo({
					url: '/childPage/mentor/add_list?me_id='+ this.me_id+ '&sort='+ this.sort,
				})
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			//删除导师
			delMentor(tutor_id, me_id) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该导师吗？',
					success(res) {
					  if (res.confirm) {
						  that.delCont(tutor_id, me_id)
					  }
					}
				});
			},
			
			// 删除信息
			delCont(tutor_id, me_id) {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
                let val = {
					'user_id': userInfo.user_id,
					'tutor_id': tutor_id,
					'me_id': me_id
				}
				delTutor(val).then(res => {
					if(res.code == 20000) {
						this.$api.msg('删除成功')
						this.getTutor()
					} else {
						this.$api.msg(res.msg)
					}
					
				})
				
			},
			
			//删除我
			delMe(me_id) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '删除“我”时，对应的导师也会一并被删除,你确定要删除吗？',
					success(res) {
					  if (res.confirm) {
						  that.delMeCont(me_id)
					  }
					}
				});
			},
			
			// 删除信息
			delMeCont(me_id) {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			    let val = {
					'user_id': userInfo.user_id,
					'me_id': me_id
				}
				delMe(val).then(res => {
					if(res.code == 20000) {
						this.$api.msg('删除成功')
						this.getTutor()
					} else {
						this.$api.msg(res.msg)
					}
					
				})
				
			},
			
			//添加、修改导师
			addRole(item) {
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let data = {
					'user_id': userInfo.user_id,
					'avatar': item.avatar, // 头像
					'character_name': item.character_name,//人物名称
					'greeting': item.greeting,//人物问候语
					'implicit_hint': item.implicit_hint ,//隐性提示词
					'introduction': item.introduction,//人物描述
					'influence': item.influence,//人物描述
			        'document': item.document,
					'image': item.image,
					'website': item.website,
					'me_id': this.me_id,
					'sort': this.sort,
					'extend': item.extend
				}
					
				//添加
				creatTutor(data).then(res => {
				  if (res.code == 20000) {
					 this.$api.msg('选择成功')
					 setTimeout(() => {
						uni.switchTab({
							url: '/pages/apply/apply'
						})
					 }, 1500)
					 
				  } else {
					  this.$api.msg(res.msg);
				  }
				}).catch(err => {
					 this.$api.msg('选择失败');
				})
				
			},
			
			mentorChat(url, text, me_id, tutor_id) {
				uni.navigateTo({
					url: '/childPage/mentor/mentor_chat?imgUrl='+ url + '&greet='+ text + '&me_id='+ me_id + '&tutor_id='+ tutor_id,
				})
			},
			toAdd(){
				uni.navigateTo({
					url:'/childPage/mentor/add_list?me_id='+ this.me_id
				})
			}
			
			
		}
	}
</script>

<style lang="less" scoped>
	page { background: #f6f8fb; }
	.cont_top { 
		width: 100%;
		padding: 20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1upx solid #e6e6e8;
		position: fixed;
		top: 0;
		z-index: 9;
		background: #fff;
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
			flex-direction: column;
			padding: 20upx;
			.li_line {
				display: flex;
				align-items: center;
			}
			.li_lines {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.line_l {
					display: flex;
					align-items: center;
				}
				.del_img {
					width: 40upx;
					height: 40upx;
				}
			}
			.li_img {
				width: 48upx;
				height: 48upx;
				border-radius: 50%;
			}
			.li_title {
				color: #000;
				font-size: 32upx;
				font-style: normal;
				font-weight: 500;
				line-height: 48upx;
				width: 70%;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-left: 15upx;
			}
			.li_cont {
				color: #6D7191;
				font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: 52upx;
				padding: 15upx 0;
				border-bottom: 1upx solid #EDEEF7;
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
	
	.li_edit {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-top: 20upx;
		.edit_l {
			color: #1F64FF;
			font-size: 28upx;
			line-height: 45upx;
			font-style: normal;
			font-weight: 500; 
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 1;
		}
		.edit_r {
			color: #1F64FF;
			font-size: 28upx;
			line-height: 45upx;
			font-style: normal;
			font-weight: 500; 
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 1;
			border-left: 1upx solid #EDEEF7;
		}
	}
	
	.wz_tip {
		position: fixed;
		bottom: 100upx;
		right:50upx;
		z-index: 10;
		.creat_img {
			width: 100upx;
			height: 100upx;
		}
	}
	
	.ul_li { 
		padding: 20upx 0;
		border-bottom: 2upx solid #EDEEF7;
		.li_me {
			padding-left: 20upx;
			color: #000;
			font-size: 32upx;
			font-style: normal;
			font-weight: 500;
			line-height: 150%;
			border-bottom: 2upx solid #EDEEF7;
		}
	}
	.list_ul {
		padding: 130upx 0 50upx 0;
	}
	.add_pic{
		width: 150upx;
		height: 150upx;
		position: fixed;
		right: 40upx;
		bottom:160upx;
		.add_img{
			width: 100%;
			height: 100%;
		}
	}
</style>