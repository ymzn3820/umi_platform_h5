<template>
	<view class="container" style="padding-bottom: 170upx;">
		
		<view class="top">
			<text class="top_left">剩余全部算力：</text>
			<text class="top_right">{{ coutList.total}}w</text>
		</view>
		
		<view class="cont_tj">
			<view class="tj_top">
				<view class="tj_li">
					<text class="t_left"></text>
					<text class="t_right">已购买算力优惠包</text>
				</view>
				<view class="tj_r"></view>
			</view>
			
			
			<view class="cont_ll" v-if="coutList.AI35">
				<view class="cont_sy">AI35剩余算力: {{ coutList.AI35 }}</view>
				<view class="tj_r">仅对AI35使用</view>
			</view>
			<view class="cont_ll" v-if="coutList.AI40">
				<view class="cont_sy">AI40剩余算力: {{ coutList.AI40 }}</view>
				<view class="tj_r">仅对AI40使用</view>
			</view>
			<view class="cont_ll" v-if="coutList.wenxin">
				<view class="cont_sy">文心一言剩余算力: {{ coutList.wenxin }}</view>
				<view class="tj_r">仅对文心一言使用</view>
			</view>
			<view class="cont_ll" v-if="coutList.xunfei">
				<view class="cont_sy">讯飞星火剩余算力: {{ coutList.xunfei }}</view>
				<view class="tj_r">仅对讯飞星火使用</view>
			</view>
			<view class="cont_ll" v-if="coutList.DALLE2">
				<view class="cont_sy">DALL·E2剩余算力: {{ coutList.DALLE2 }}</view>
				<view class="tj_r">仅对DALL·E2使用</view>
			</view>
			<view class="cont_ll" v-if="coutList.baidu_drawing">
				<view class="cont_sy">百度绘画剩余算力: {{ coutList.baidu_drawing }}</view>
				<view class="tj_r">仅对百度绘画使用</view>
			</view>
			<view class="cont_ll" v-if="coutList.mj">
				<view class="cont_sy">Midjourney剩余算力: {{ coutList.mj }}</view>
				<view class="tj_r">仅对Midjourney使用</view>
			</view>
			<view class="cont_ll" v-if="coutList.claude">
				<view class="cont_sy">Claude剩余算力: {{ coutList.claude }}</view>
				<view class="tj_r">仅对Claude使用</view>
			</view>
			<view class="cont_ll" v-if="coutList.chatglm">
				<view class="cont_sy">ChatGLM剩余算力: {{ coutList.chatglm }}</view>
				<view class="tj_r">仅对ChatGLM使用</view>
			</view>
			<view class="cont_ll" v-if="coutList.sd">
				<view class="cont_sy">Stable Diffusion剩余算力: {{ coutList.sd }}</view>
				<view class="tj_r">仅对Stable Diffusion使用</view>
			</view>
			<view class="cont_ll" v-if="coutList.qianwen">
				<view class="cont_sy">通义千问剩余算力: {{ coutList.qianwen }}</view>
				<view class="tj_r">仅对通义千问使用</view>
			</view>
			<view class="cont_ll" v-if="coutList.senseCore">
				<view class="cont_sy">商汤日日新剩余算力: {{ coutList.senseCore }}</view>
				<view class="tj_r">仅对商汤日日新使用</view>
			</view>
			
			<view class="cont_ll" v-if="coutList.member_total">
				<view class="cont_sy">剩余总算力: {{ coutList.member_total }}w</view>
				<view class="tj_r">（总算力中，其中保留50%用于AI对话功能，剩余最高50%用于所有功能，例如：2000万算力中，至少1000万算力用于AI对话，若该用户1500万用于AI对话，则只有500万可用于对话之外的功能）</view>
			</view>
			
			<view class="cont_ll" v-if="coutList.universa">
				<view class="cont_sy">剩余通用算力: {{ coutList.universa }}w</view>
				<view class="tj_r">(在各功能上均可使用)</view>
			</view>
			
			<view class="cont_ll" v-if="coutList.directed">
				<view class="cont_sy">剩余定向算力: {{ coutList.directed }}w</view>
				<view class="tj_r">(仅限于AI对话功能)</view>
			</view>
		</view>
		
		
		<view class="top_cont">
			<view class="cont_title">
				<text class="head">购买时间</text>
				<text class="head">套餐</text>
				<text class="head">金额(元)</text>
				<!-- <text class="head">算力</text> -->
				<text class="head">过期时间</text>
				<text class="heads">详情</text>
			</view>
			<view v-if="otherList.length >0">
				<view v-for="(item, index) in otherList" :key="index">
					<view class="cont_list" v-if="index < 5">
						<text class="list_li">{{ item.created_at.slice(0,10) }}</text>
						<text class="list_li">{{ item.prod_name }}</text>
						<text class="list_li">{{ item.total_amount }}</text>
						<!-- <text class="list_li">{{ item.points }}w</text> -->
						<text class="list_li">{{ item.expire_at.slice(0,10) }}</text>
						<text class="list_lis" style="color: #1F64FF;" @click="toDetail(item.order_id)">查看</text>
					</view>
				</view>
			</view>
			<view class="on_order_list" v-else>暂无购买的优惠包!</view>
			
		</view>
		
		<view class="cont_tj">
			<view class="tj_top">
				<view class="tj_li">
					<text class="t_left"></text>
					<text class="t_right">已购买通用包</text>
				</view>
				<view class="tj_r">在各模型上均可使用</view>
			</view>
			<view class="cont_sy">剩余通用算力: {{ cout_ty }}w</view>
		</view>
		<view class="top_cont">
			<view class="cont_title">
				<text class="head">购买时间</text>
				<text class="head">套餐</text>
				<text class="head">金额(元)</text>
				<!-- <text class="head">算力</text> -->
				<text class="head">过期时间</text>
				<text class="heads">详情</text>
			</view>
			<view v-if="centerList.length >0">
				<view v-for="(item, index) in centerList" :key="index">
					<view class="cont_list" v-if="index < 5">
						<text class="list_li">{{ item.created_at.slice(0,10) }}</text>
						<text class="list_li">{{ item.prod_name }}</text>
						<text class="list_li">{{ item.total_amount }}</text>
						<!-- <text class="list_li">{{ item.points }}w</text> -->
						<text class="list_li">{{ item.expire_at.slice(0,10) }}</text>
						<text class="list_lis" style="color: #1F64FF;" @click="toDetail(item.order_id)">查看</text>
					</view>
				</view>
			</view>
			<view class="on_order_list" v-else>暂无购买的通用包!</view>
			
		</view>

		<view class="cont_tj">
			<view class="tj_top">
				<view class="tj_li">
					<text class="t_left"></text>
					<text class="t_right">系统赠送通用算力包记录</text>
				</view>
				<!-- <view class="tj_r"></view> -->
			</view>
		</view>
		
		<view class="top_cont">
			<view class="cont_title">
				<text class="head">赠送时间</text>
				<text class="head">赠送算力</text>
				<text class="head" style="max-width: 200upx;">赠送来源</text>
				<text class="head">过期时间</text>
			</view>
			<view v-if="sendList.length >0">
				<view v-for="(item, index) in sendList" :key="index">
					<view class="cont_list" v-if="index < 5">
						<text class="list_li">{{ item.created_at.slice(0,10) }}</text>
						<text class="list_li">{{ item.hash_rates }}</text>
						<text class="list_li" style="max-width: 200upx; text-align: left;">{{ item.reason }}</text>
						<text class="list_li">{{ item.expire_at.slice(0,10) }}</text>
					</view>
				</view>
			</view>
			<view class="on_order_list" v-else>暂无赠送的通用包!</view>
			
		</view>
		
		<view class="cont_tj">
			<view class="tj_top">
				<view class="tj_li">
					<text class="t_left"></text>
					<text class="t_right">算力使用规则</text>
				</view>
				<view class="tj_r"></view>
			</view>
		</view>
		<view class="top_cont">
			<view class="cont_title">
				<text class="head">模型</text>
				<text class="head">单位</text>
				<text class="head">消耗算力</text>
			</view>
			<view v-if="billList.length >0">
				<view v-for="(item, index) in billList" :key="index">
					<view class="cont_list">
						<text class="list_li">{{ item.model }}</text>
						<text class="list_li">{{ item.unit }}</text>
						<text class="list_li">{{ item.consume_points }}w</text>
					</view>
				</view>
			</view>
			<view class="on_order_list" v-else>暂无相关数据!</view>
		</view>
		
		<view class="btn">
			<view class="btn_cont" @click="toOrder">
				<view class="btn_l">查看订单</view>
			</view>
			<view class="btn_cont" @click="toHistory">
				<view class="btn_r">查看历史对话</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getBill,
		getBillCenter
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				userInfo: { member: { status: false } },
				billList: [],
				centerList: [],
				otherList: [],
				cout_ty: 0,
				coutList: '',
				sendList: []
			}
		},
		components: {
			
		},
		onLoad() {
			
		},
		onShow() {
            this.userInfo = JSON.parse(uni.getStorageSync('memberInfo'));
			this.getBillCenter()
			// this.getBill()
				
			
		},
		methods: {
			// 获取计费列表
			getBill() {
				getBill().then(res => {
					if (res.code == 20000) {
						this.billList = res.data;
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
			
			// 获取计费中心列表
			getBillCenter() {
				let data = { user_id: this.userInfo.user_id }
				getBillCenter(data).then(res => {
					if (res.code == 20000) {
						if(res.data[6]) {
							this.centerList = res.data[6];
						}
						if(res.data[3]) {
							this.otherList = res.data[3];
						}
						if(res.data[9]) {
							this.sendList = res.data[9];
						}
						
						if(res.data.rules) {
							this.billList = res.data.rules;
						}
						this.coutList = res.data.hash_rates;
						// console.log(this.otherList, 556898)
						// 统计通用包算力
						this.cout_ty = res.data.hash_rates.package;
						
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
			toOrder() {
				uni.navigateTo({
					url: '/pages/user/order/order',
				})
			},
			toHistory() {
				uni.navigateTo({
					url: '/pages/user/history/history',
				})
			},
			//查看详情
			toDetail(order_id) {
				uni.navigateTo({
					url: '/pages/user/order/order_detail?order_id=' + order_id,
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #f6f8fb;
	}
	.top {
		padding: 15upx;
		background: #fff;
		.top_left {
            color: #333;
            font-size: 30upx;
            line-height: 48upx;			
		}
		.top_right {
		    color: #EB504B;;
		    font-size: 30upx;
		    line-height: 48upx;	
			font-weight: 500;
		}
		.top_text {
			color: #808080;
			text-align: center;
			font-size: 24upx;
			font-style: normal;
			font-weight: 400;
		}
	}
	.top_cont {
		background-color: #fff;
		width: calc(100%);
		padding: 18upx 26upx;
		.cont_title {
			display: flex;
			padding-bottom: 18upx;
			.head {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				color: #333;
				text-align: center;
				font-size: 28upx;
				font-weight: 500;
				line-height: 40upx;
			}
			.heads {
				// flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				color: #333;
				text-align: center;
				font-size: 28upx;
				font-weight: 500;
				line-height: 40upx;
			}
		}
		
		.cont_list {
			display: flex;
			padding: 15upx 0;
			border-bottom: 1upx solid #e6e6e8;
			.list_li {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				color: #333;
				text-align: center;
				font-size: 28upx;
				font-weight: 500;
				line-height: 40upx;
			}
			.list_li {
				// flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				color: #333;
				text-align: center;
				font-size: 28upx;
				font-weight: 500;
				line-height: 40upx;
			}
		}
	}
	.btn {
		width: 100%;
		position: fixed;
		bottom: 0upx;
		display: flex;
		background: #fff;
		padding: 30upx;
		.btn_cont{
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.btn_l {
			width: 90%;
			height: 80upx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #1F64FF;
			border: 1upx solid #1F64FF;
			background: #fff;
			border-radius: 8upx;
		}
		
		.btn_r {
			width: 90%;
			height: 80upx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			background: #1F64FF;
			border-radius: 8upx;
		}
	}
	
	.cont_tj {
		padding: 20upx 15upx;
		background: #f6f8fb;
		.tj_top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.tj_li {
				display: flex;
				align-items: center;
				.t_left {
					width: 20px;
					height: 4px;
					background: #1F64FF;
					border-radius: 10px;
					transform: rotate(-90deg);
				}
				.t_right {
					color: #333;
					font-size: 28upx;
					font-style: normal;
					font-weight: 500;
					line-height: 150%;
				}
			}
			
		}
		
	}
	
	.cont_ll {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5upx 0;
	}
	
	.cont_sy {
		color: #1F64FF;
		font-size: 24upx;
		font-style: normal;
		font-weight: 400;
		line-height: 28upx;
		padding-left: 20px;
		// padding-top: 20upx;
		width: 40%;
	}
	
	.tj_r {
		color: #878788;
		font-size: 20upx;
		font-style: normal;
		font-weight: 400;
		line-height: 28upx;
		width: 60%;
	}
	
	.on_order_list {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28upx;
		height: 100upx;
		line-height: 100upx;
		width: 100%;
		color: #C0C4CC;
	}
</style>