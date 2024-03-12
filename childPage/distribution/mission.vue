<template>
	<view class="container">
		<scroll-view scroll-y="true" v-if="missionList.length > 0">
		    <view class="list" v-for="(item,index) in missionList" :key="index">
		    	<view class="list_top" >
		    		<view class="top_cont">
		    			<view class="top_l">
		    				<text class="l_name">购买人：</text>
		    				<text class="r_name">{{ item.nick_name }}</text>
		    			</view>
		    			<view class="top_r">
		    				<text class="r_text" v-if="active == index && showUp == true" @click="open(index)">详情</text>
		    				<text class="r_text" v-if="active == index && showUp == false" @click="close(index)">收起</text>
		    				<text class="r_text" v-if="active != index && showUp == true" @click="open(index)">详情</text>
		    				<text class="r_text" v-if="active != index && showUp == false" @click="open(index)">详情</text>
		    				<u-icon name="arrow-down" color="#bbb" size="12" v-if="active == index && showUp == true"></u-icon>
		    				<u-icon name="arrow-up" color="#bbb" size="12" v-if="active == index && showUp == false"></u-icon>
		    				<u-icon name="arrow-down" color="#bbb" size="12" v-if="active != index && showUp == true"></u-icon>
		    				<u-icon name="arrow-down" color="#bbb" size="12" v-if="active != index && showUp == false"></u-icon>
		    			</view>
		    		</view>
		    		<view class="top_text">
		    			<text class="text_l">佣金(元)：</text>
		    			<text class="text_r">￥{{ item.reward_commission }}</text>
		    		</view>
		    	</view>
		    	<view :class="active == index && showUp == false ? 'list_cont' : 'list_cont_close'">
		    		<view :class="active == index && showUp == false ? 'cont_text' : 'cont_text_close'">
		    			<text class="cont_name">订单编号：</text>
		    			<text class="cont_info">{{ item.order_no }}</text>
		    		</view>
		    		<view :class="active == index && showUp == false ? 'cont_text' : 'cont_text_close'">
		    			<text class="cont_name">购买金额：</text>
		    			<text class="cont_info">￥{{ item.amount }}</text>
		    		</view>
		    		<view :class="active == index && showUp == false ? 'cont_text' : 'cont_text_close'">
		    			<text class="cont_name">佣金比例：</text>
		    			<text class="cont_info">{{ item.commission_ratio }}</text>
		    		</view>
		    		<view :class="active == index && showUp == false ? 'cont_text' : 'cont_text_close'">
		    			<text class="cont_name">购买时间：</text>
		    			<text class="cont_info">{{ item.create_time }}</text>
		    		</view>
		    	</view>
		    </view>
		</scroll-view>
		
		<view class="on_order" v-else>
			<image class="order_img" :src="backImg"></image>
		</view>
		
		<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
	    
	</view>
</template>

<script>
	import { getMission } from '@/apis/user.js'

	export default {
		data() {
			return {
				rightImg: global.baseImg+'/avatar/user/9cfd1b8b-2305-4fad-8846-8db33fd32ac3.jpg',
				active: 0,
				showUp: true,
				page_no: 1,
				page_count: 10,
				pageTotal: 0,
				loadingType: 0,
				missionList: [],
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg'
			}
		},
		components: {
			
		},
		onLoad() {

		},
		onShow() {
			this.getMissionList()
		},
		methods: {
		   open(index) {
			   this.active = index;
			   this.showUp = false;
			   
		   },
		   close(index) {
			   this.active = index;
			   this.showUp = true
		   },
		   
		   // 获取人员列表
		   getMissionList() {
		   	let val = {
		   		page_size: this.page_count,
		   		page: this.page_no
		   	}
		   	getMission(val).then(res => {
		   		if (res.code == 20000) {
		   			this.missionList = res.data.data;
		   
		   			let total = res.data.total;
		   			if (total % this.page_count == 0) {
		   				this.pageTotal = total / this.page_count
		   			} else {
		   				this.pageTotal = parseInt(total / this.page_count) + 1
		   			}
		   			if (this.pageTotal == 1) {
		   				this.loadingType = 1;
		   			}
		   		} else {
		   			this.$api.msg(res.msg);
		   		}
		   	}).catch(err => {
		   		this.$api.msg('获取信息失败');
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
		   	getMission(val).then(res => {
		   		if (res.code == 20000) {
		   
		   			let total = res.data.total;
		   			if (total == 0) return
		   			let List = res.data.data;
		   			let addList = this.missionList;
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
		   		this.$api.msg('获取信息失败');
		   	})
		   },
		   
		}
	}
</script>

<style lang="less" scoped>
	.container {
		padding: 20upx;
	}
	.list {
		padding: 25upx;
		margin-bottom: 20upx;
		background: #fff;
		.list_top {
			display: flex;
			flex-direction: column;
			.top_cont {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.top_l {
					font-style: normal;
					font-weight: 400;
					font-size: 30upx;
					line-height: 150%;
					.l_name {
						color: #999;
					}
					.r_name {
						color: #333;
					}
				}
				.top_r {
					font-style: normal;
					font-weight: 400;
					font-size: 24upx;
					line-height: 150%;
					display: flex;
					.r_text {
						color: #1F64FF;
						padding-right: 10upx;
					}
				}
			}
			
			.top_text {
				font-style: normal;
				font-weight: 400;
				font-size: 30upx;
				line-height: 150%;
				padding: 10upx 0 15upx 0;
				.text_l {
					color: #999;
				}
				.text_r {
					color: #FB423F;
				}
			}
		}
		
		.list_cont {
			height: 274upx;
			padding: 25upx 20upx;
			border-top: 1upx solid #eee;
			transition: height 0.4s;
		}
		.list_cont_close {
			height: 0;
			transition: height 0.3s;
		}
		.cont_text {
			height: 56upx;
			display: flex;
			font-style: normal;
			font-weight: 400;
			font-size: 28upx;
			line-height: 56upx;
			padding: 10upx 0;
			transition: all 0.4s;
			.cont_name {
				color: #999;
			}
			.cont_info {
				color: #333;
			}
		}
		
		.cont_text_close {
			opacity: 0;
			height: 0;
		}
	}
	
	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 90vh;
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