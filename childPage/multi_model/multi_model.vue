<template>
	<view style="padding: 32upx;">
		<view class="robot">
			<view class="robot_text">
				<image class="pic" :src="log" mode="widthFix"></image>
				<view class="title">Hi，你想要聊些什么？</view>
			</view>
			<view class="tips">
				<view class="item" style="margin-right: 30upx;" @click='toHis'>
					<image :src="hisImg" mode=""></image>
					<view class="text">历史记录</view>
				</view>
				<view class="item" @click="toIdea">
					<image :src="ideaImg" mode=""></image>
					<view class="text">投诉及建议</view>
				</view>
			</view>
		</view>
		

		<view class="main">
			<view class="top">
				<view style="margin-bottom: 10upx;">
					<text class="top_l">*</text>
					<text class="top_r">创建话题</text>
				</view>

				<textarea v-model="content" cols="30" rows="6" :placeholder="placeholder" style="width: 89%;"></textarea>
				<view class="bottom_tip">
					<view class="top">
						<image :src="log" mode=""></image>
						<view class="top_content">小秘提醒您：</view>
					</view>
					<view class="content">
						创建好话题后，点击下一步，去添加角色吧！
					</view>
				</view>
			</view>
			<view class="bottom">
				<u-button type="primary" :customStyle='{"background":"#1F64FF","height":"80rpx", "border": "1rpx solid #1f64ff"}' text="下一步" @click="toModelNext"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				log: global.baseImg + '/xcx/com/message_center/Frame%20427320411.png',
				ideaImg: global.baseImg + '/xcx/com/message_center/%E6%84%8F%E8%A7%81%E5%8F%8D%E9%A6%88.png',
				hisImg: global.baseImg + '/xcx/com/message_center/clock.png',
				content: '',
				placeholder: '请输入你想发布讨论的话题，例如:AI的前景、人工智能的优劣势...'
			};
		},
		methods:{
			toIdea(){
				uni.navigateTo({
					url:'/childPage/answer/answer'
				})
			},
			toModelNext(){
				if(this.content == '') {
					return this.$api.msg('请填写需要讨论的问题')
				}
				uni.navigateTo({
					url:'/childPage/multi_model/multi_model_next?content='+ this.content
				})
			},
			toHis(){
				uni.navigateTo({
					url:'/childPage/multi_model/history_model'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.robot {
		display: flex;
	    align-items: center;
		justify-content: space-between;
		.robot_text {
			display: flex;
			align-items: center;
			justify-content: center;
			.pic {
				width: 60upx;
				height: 60upx;
			}
			.title {
				color: #242F49;
				font-size: 36upx;
				font-weight: 500;
				line-height: 150%;
			}
		}
		
		
		.tips {
			display: flex;
			align-items: center;
			justify-content: center;
		    .item {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				
				image {
					width: 48upx;
					height: 48upx;
				}
						
				.text {
					color: #3F3F3F;
					font-size: 22upx;
					font-weight: 400;
					line-height: 150%;
				}
			}
			
		}
	}

	.main {
		padding: 40upx;
		background-color: #fff;
		height: 90vh;
		margin-top: 52rpx;

		.top {
			.top_l {
				color: #F00;
				font-size: 28upx;
			}

			.top_r {
				color: #000;
				font-size: 28upx;
				font-weight: 600;
				line-height: 150%;
				
			}

			textarea {
				padding: 24rpx 34rpx;
				border: 2rpx solid #D7D9DF;
				border-radius: 8px;
				margin-bottom: 20rpx;
			}

			.bottom_tip {
				.top{
					display: flex;
					margin-bottom: 15upx;
					align-items: center;
					image{
						width: 62upx;
						height: 62upx;
					}
					.top_content{
						color: #1F64FF;
						font-size: 34upx;
						line-height: 150%;
						margin-left: 20upx;
					}
				}
				.content{
					color: #1F64FF;
					font-size: 28upx;
					line-height: 150%;
					margin-left: 88upx;
				}
			}
		}
	}

	.bottom {
		position: fixed;
		width: 100%;
		bottom: 21rpx;
	}

</style>