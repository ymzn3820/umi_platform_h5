<template>
	<view class="head_index">
		<view class="top_cont">
			<view class="search_cont">
				<view class="search">
					<u-icon name="search" color="#ccc" size="28"></u-icon>
					<input v-model="searchValue" placeholder="请输入搜索内容" type="text" class="search_input" @input="search" />
					<u-icon name="close-circle" color="#666" size="24" v-if="searchValue != ''" @click="clearInput"></u-icon>
				</view>
			</view>
		</view>
		
		<!-- 绘画历史 -->
		<view class="chat_cont" style="margin-top: 100rpx;">
			<scroll-view class="list_ul" scroll-y="true" v-if="promptsList.length > 0" style="margin-top: 100rpx;" >
				<view class="hotWrods">
					<view v-if="promptsList.length > 0" class="hot_cont">
						<view @click="eidtContent(item)" class="box" v-for='item,index in promptsList' :key='index'>
						    
						    <view class="text">
						    	<view class="textInfo">
									<image :src="getImgUrl(item.character_avatar)" mode="" class="li_avatar" v-if="item.industry_id == '1003'" />
									<view class="li_avatar" style="background: #40DE9F;" v-else-if="item.industry_id == '1001'">{{ item.title.slice(0,1) }}</view>
									<view class="li_avatar" style="background: #7F48FF;" v-else-if="item.industry_id == '1000'">{{ item.title.slice(0,1) }}</view>
									<view class="li_avatar" style="background: #FF8E8E;" v-else-if="item.industry_id == '1005'">{{ item.title.slice(0,1) }}</view>
									<view class="li_avatar" style="background: #FFB833;" v-else>{{ item.title.slice(0,1) }}</view>
						    		<view class="li_text">{{item.title}}</view>
						    	</view>
								<view class="tips">
									<!-- <image src="@/static/user/edit.png" mode="" style="width:30upx; height:30upx;"/>
									<text class="content">
										编辑内容
									</text> -->
								</view>
						    </view>
						    <view class="text_cont">
								<text class="text_li">{{ item.content }}</text>
							</view>
							<image :src="backImg" mode="" class="back_img"></image>
						</view>
					</view>
					
				</view>
			</scroll-view>
			<view class="on_order_list" v-if="promptsList.length == 0">
				暂无相关内容
			</view>
			
			<view class="on_order_list" v-if="loadingType == 1 && promptsList.length > 0">没有更多内容了!</view>
		</view>

	</view>
</template>

<script>
	import { searchList } from '@/apis/user.js'
	export default {
		data() {
			return {
				searchValue: '',
				loadingType: 0,
				page_no: 1,
				page_count: 15,
				promptsList: [],
				pageTotal: 0,
				backImg: global.baseImg+'/xcx/9cbaf339-29fe-47d1-9685-0dabe4d5a00d.jpg',
			}
		},
		components: {

		},
		onLoad(option) {
			
		},
		onShow() {
			this.search()
		},
		methods: {

			search() {
				// this.page_no = 1;
				this.loadingType = 0;
				this.getQuestions()
			},
			
			getQuestions() {
				// this.page_no = 1;
				// this.loadingType = 0;
				
				let data = {
					"keywords": this.searchValue
					// 'page_index': this.page_no,
					// 'page_count': this.page_count
				}
				
				searchList(data).then(res => {
						
					if(res.code == 20000) {
						// this.loading = false;
						this.promptsList = res.data
						// let total = res.total;
						// if (total % this.page_count == 0) {
						// 	this.pageTotal = total / this.page_count
						// } else { 
						// 	this.pageTotal = parseInt(total / this.page_count) + 1
						// }
						// if (this.pageTotal == 1) {
						// 	this.loadingType = 1;
						// }
						
						this.$forceUpdate()
					} else {
						this.$api.msg(res.msg)
						this.loading = false;
					}
					
				}).catch(err => {
					this.loading = false;
					// this.$api.msg('');
				})
			},

			//页面触底翻页
			// onReachBottom() {
			// 	console.log('触发底部了')
			// 	if (this.loadingType == 1) return
			// 	this.page_no++
			// 	let data = {
			// 		'industry_id': 1003,
			// 		'module_id': '444978922251526',
			// 		'page_index': this.page_no,
			// 		'page_count': this.page_count
			// 	}
				
			// 	getQuestions(data).then(res => {
			// 		if (res.code == 20000) {
			
			// 			let total = res.total;
			// 			if (total == 0) return
			// 			let List = res.data;
			// 			console.log(List,333)
			// 			// let addList = this.promptsList;
			// 			List.forEach(item => {
			// 				this.promptsList.push(item);
			// 			});
			
			// 			if (total % this.page_count == 0) {
			// 				this.pageTotal = total / this.page_count
			// 			} else {
			// 				this.pageTotal = parseInt(total / this.page_count) + 1
			// 			}
			// 			// console.log(this.pageTotal, 1585)
			// 			if (this.pageTotal <= this.page_no) {
			// 				this.loadingType = 1
			// 			}
						
			// 			this.$forceUpdate()
			// 		} else {
			// 			this.$api.msg(res.msg);
			// 		}
			// 	}).catch(err => {
			// 		this.$api.msg('获取信息失败');
			// 	})
			// },
			eidtContent(item) {
				
				if(item.industry_id != '1003') {
					uni.navigateTo({
						url: "/pages/apply/apply_ask?item="+ JSON.stringify(item) 
					})
				} else {
					let items = item;
					items.character_name = items.title
					items.character_greetings = items.content
					const tip = items.character_avatar.slice(0,1)
					if(tip != '/') {
						items.character_avatar = global.baseImg+'/'+items.character_avatar
					} else {
						items.character_avatar = global.baseImg+items.character_avatar
					}
					uni.navigateTo({
						url: '/pages/user/role/user_chat?item='+ JSON.stringify(items)
					})
				}
			
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			clearInput() {
				this.searchValue = ''
				this.getQuestions()
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #f6f8fb;
	}
	
	.top_cont {
		width: 100%;
		height: 100upx;
		background: #fff;
		position: fixed;
		top: 0;
		z-index: 10;
	}
	
	.search_cont {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0 25upx;
		background: #fff;
	}
	
	.search {
		width: 100%;
		height: 72upx;
		border-radius: 8px;
		border: 1px solid #1F64FF;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 25upx;
		margin-bottom: 20upx;
		margin-top: 20upx;
	}
	
	.search_input {
		flex: 1;
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
		margin-top: 150rpx;
	}
	
	.hotWrods {
		padding: 30upx 18upx 18upx 18upx;
	    .hot_cont {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
		}
		.box {
			background: #FFFFFF;
			// box-shadow: 0px 3px 8px rgba(51, 51, 51, 0.1);					
			box-shadow: 0px 2.23993px 7.83975px rgba(51, 51, 51, 0.1);
			border-radius: 8px;
			margin-bottom: 10px;
	        width: 48%;
			padding: 12upx;
			position: relative;
	
			// line-height: 40px;
			.text {
	            display: flex;
				align-items: center;
				justify-content: space-between;
				
			}
			
			.text_cont {
				padding: 10upx;
				max-height: 140upx;
				.text_li {
					font-size: 26upx;
					color: #888;
					line-height: 40upx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2; // 控制多行的行数
					-webkit-box-orient: vertical;
				}
			}
			
			.textInfo {
				display: flex;
				align-items: center;
				.li_avatar {
					width: 80upx;
					height: 80upx;
					border-radius: 7upx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.li_text{
					max-width: 200upx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					display: inline-block;
					color: #333;
					font-size: 15px;
					font-weight: 550;
					padding-left: 10px;
				}
				
			}
	
			.tips {
	
				display: flex;
				// background: #F2FAFF;
				border-radius: 0px 8px;
				width: 108px;
				height: 33px;
				font-size: 13px;
				color: #1F64FF;
				line-height: 26px;
				text-align: center;
				justify-content: center;
				align-items: center;
	
				.content {
					margin-left: 5px;
				}
			}
		}
		
		.back_img {
			width: 110upx;
			height: 110upx;
			position: absolute;
			top: 0upx;
			right: 0upx;
		}
	}
</style>