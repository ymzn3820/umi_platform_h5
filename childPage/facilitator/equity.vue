<template>
	<view style="padding: 32upx;">
		<view style="padding: 32upx;background-color: #fff;height: 1400upx;">
			<view class="top">
				<view class="nav">升级服务商，您将尊享以下更多权益</view>
				<view class="btn_top" @click="toMessage">申请服务商</view>

			</view>
			<view style="border-top: 4upx solid #F4F4F4;margin-top: 32upx;"></view>
			<view class="main">
				<view class="item" v-for="(item,index) in list" :key="index">
					<view style="display: flex;">
						<view class="icon"></view>
						<text class="title">{{item.title}}</text>
					</view>
					<ua-markdown style="color: #666;line-height: 42upx;" :source="item.content" :showLine="false" />
				</view>
			</view>
			<view class='btn' @click="toMessage">申请服务商</view>
		</view>
	</view>
</template>

<script>
	import uaMarkdown from '@/components/ua2-markdown/ua-markdown.vue'
	export default {
		components: {
			uaMarkdown
		},
		data() {
			return {
				list: [{
						title: '获得成员升级金牌分销的充值金额',
						content: '你的成员升级成为金牌分销的充值金额99元都将归您所有'
					},
					{
						title: '分佣比例升为50%',
						content: '您的分销团队成员充值的金额您都将获得最高50%的佣金比例1.您的分销团队成员若为普通用户（他没有下级分销成员），您将获得他所充值金额的50%的分佣比例；2.您的分销团队成员若为普通分销（假设他有1个下级分销成员A），您将获得他的分销成员A所充值金额的35%的分佣比例，他（您的团队成员）将获得A所充值金额的15%的分佣比例；3.您的分销团队成员若为金牌分销（假设他有1个下级分销成员B），您将获得他的分销成员B所充值金额的20%的分佣比例，他（您的团队成员）将获得B所充值金额的30%的分佣比例'
					},
					{
						title: '更加尊贵的身份标识',
						content: '享有专属服务商身份标识'
					},
					{
						title: '拥有属于自己的专属分销团队',
						content: '您将畅享拥有自己的分销团队成员'
					},
				]
			};
		},
		methods:{
			toMessage(){
				uni.navigateTo({
					url:'/childPage/facilitator/message'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.top {
		text-align: center;
		display: flex;
		justify-content: space-between;

		.nav {
			font-size: 26upx;
			font-weight: 500;
			color: #1D2129;
		}

		.btn_top {
			width: 182upx;
			height: 56upx;
			color: #fff;
			font-size: 26upx;
			border-radius: 8upx;
			background-color: #1F64FF;
			line-height: 50upx;
		}
	}

	.main {
		.item {
			margin-bottom: 24upx;

			.icon {
				background-color: #1F64FF;
				width: 16upx;
				height: 16upx;
				border-radius: 50%;
				margin-top: 24upx;
				margin-right: 20upx;
			}

			.title {
				line-height: 60upx;
			}
		}
	}

	.btn {
		border-radius: 12upx;
		background: #1F64FF;
		color: #F6F8FB;
		text-align: center;
		font-size: 30upx;
		width: 636upx;
		height: 92upx;
		line-height: 92upx;
		position: fixed;
		bottom: 0;
	}
</style>