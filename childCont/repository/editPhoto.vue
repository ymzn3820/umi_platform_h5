<template>
	<view style='padding: 32rpx;'>
		<view class="head">
			<image :src="getImgUrl(userUrl)" class="pic"></image>
			<view class="txt">{{userName}}</view>
		</view>
		<view class="main">
			<view class="chat_text">
				<view class="text_cont">
					<text class="text_l">*</text>
					<text class="text_r">编辑标签</text>
				</view>
				<view class='surround'>
					<view class="u-page__tag-item" v-for="(tip, index1) in tagList" :key="index1">
						<u-tag :text="tip" size="mini" plain closable @close="delTag(index1)"></u-tag>
					</view>
					<view class="u-page__tag-item">
						<u-tag text="添加" size="mini" icon="plus" plain @click="addTag()"></u-tag>
					</view>
				</view>
			</view>
			<view class="li_edit">
				<view class="edit_l" @click="back">取消</view>
				<view class="edit_r" @click="submit">保存</view>
			</view>
		</view>
		<!-- 添加标签 -->
		<u-modal :show="tagShow" @cancel="closeTag" confirmText="添加" confirmColor="#1F64FF;" :showCancelButton='true'
			@confirm="confirmTag">
			<view class="key_cont" style="">
				<view class="title">添加标签</view>
				<u-input :customStyle='{"padding":"8px", "width":"100%"}' inputAlign="center" v-model="tagName"
					maxlength="10" aceholder="请输入标签" type="text"></u-input>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		putPictures
	} from '@/apis/chat.js'
	export default {
		data() {
			return {
				pic: 'https://umi-intelligence.oss-cn-shenzhen.aliyuncs.com/static/model/714bfc4b-ca04-4999-8a4c-2edb5ce4c9cb.png',
				tagList: [],
				tagShow: false,
				tagName: '',
				userName: '',
				userUrl: '',
				pic_id: '',
				pic_tags: []
			};
		},
		onLoad(option) {
			if (option.arr) {
				let arr = JSON.parse(option.arr)
				this.userName = arr.pic_name
				this.userUrl = arr.pic_url
				this.pic_id = arr.pic_id
				if(arr.pic_tags!=''){
				this.tagList = arr.pic_tags
				console.log(this.tagList);
				}
			}
		},
		methods: {
			closeTag() {
				this.tagName = ''
				this.tagShow = false
			},
			back() {
				uni.navigateBack(1)
			},
			submit() {
				let val = {
					user_id: JSON.parse(uni.getStorageSync('userInfo')).user_id,
					pic_id: this.pic_id,
					pic_tags: this.tagList
				}
				putPictures(val).then(res => {
					console.log(res, 996);
					if (res.code == 20000) {
						this.$api.msg('保存成功')
						this.back()
					} else {
						this.$api.msg(res.msg)
					}
				})
			},
			//删除标签
			delTag(index) {
				this.tagList.splice(index, 1)
				this.$forceUpdate()
			},
			addTag(index) {
				console.log(index);
				this.tagIndex = index;
				this.tagShow = true
			},
			confirmTag() {
				if (this.tagName.trim() == '') {
					this.$api.msg('请输入标签名称')
					return
				}

				let data = this.tagName

				this.tagList.push(data)
				this.tagShow = false;
				this.tagName = '';
				console.log(this.tagList, 666)
			},
			getImgUrl(url) {
				return global.baseImg + '/' + url;
			},
		}
	}
</script>

<style lang="less" scoped>
	.head {
		text-align: center;
		padding: 40rpx 0;

		.pic {
			width: 480rpx;
			height: 480rpx;
			border-radius: 12rpx;
		}

		.txt {
			color: #393E45;
			font-size: 32rpx;
			font-weight: 400;
		}
	}

	.main {
		padding: 32rpx;
		border-radius: 16rpx;
		background: #FFF;
		height: 50vh;
	}

	.chat_text {
		width: 100%;
		padding: 20upx 0;

		.text_cont {
			display: flex;
			align-items: center;
			margin-bottom: 10upx;
			width: 100%;

			.text_l {
				color: #FF0101;
				font-size: 22upx;
				font-style: normal;
				font-weight: 400;
				line-height: 26upx;
				margin-right: 5upx;
			}
		}

		.text_r {
			color: #333;
			text-align: center;
			font-size: 24upx;
			font-style: normal;
			font-weight: 530;
			line-height: 26upx;
		}
	}

	.surround {
		border-radius: 16rx;
		border: 2rpx solid #D7D9DF;
		padding: 24rpx;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
	}

	.u-page__tag-item {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin: 0 10upx 0 0;
	}

	.li_edit {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		left: 32rpx;
		background-color: #fff;
		width: 83%;
		padding: 40rpx 32rpx;

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
</style>