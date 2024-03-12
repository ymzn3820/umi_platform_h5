<template>
	<view>
		<view class="containar">
			<scroll-view class="list_ul" scroll-y="true" v-if="videoList.length > 0">
				<view class="voice_list" v-for="(item, index) in videoList" :key="index">
					<view class="list_li">
						<Audio :audio="getImgUrl(item.live_sound_url)" :title="item.live_script"></Audio>
						<!-- <view class="li_del">
							<text class="del_text">删除</text>
						</view> -->
					</view>
					<view class="li_edit">
						<view class="edit_r" @click="downVoice(item.live_sound_url)">下载</view>
					</view>
				</view>
			</scroll-view>
			
			<view class="on_order" v-else>
				<text class="on_order_list">暂无合成语音</text>
			</view>
			
			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
		</view>
		<Ssdownload ref="ssdownload" :fileUrl="fileUrl" :fileType="fileType"></Ssdownload>
	</view>
</template>

<script>
	import Audio from '../components/audio/audio.vue'
	import Ssdownload from '../components/ss-download/ss-download.vue'
	import { getVoiceHistory } from '@/apis/user.js'
	export default {
		data() {
			return {
                loadingType: 0,
				page_no: 1,
				page_count: 10,
				videoList: [],
				pageTotal: 0,
				voice_code: '',
				fileUrl: '',
				fileType: ''
			}
		},
		components: {
	      Audio,
		  Ssdownload
		},
		onLoad(option) {
           if(option.code) {
			   this.voice_code = option.code
		   }
		},
		onShow() {
			this.getVoiceList()
		},
		methods: {
			// 获取知识库列表
			getVoiceList() {
				let val = {
					voice_code: this.voice_code,
					page_size: this.page_count,
					page: this.page_no
				}
				getVoiceHistory(val).then(res => {
					if (res.code == 20000) {
						this.videoList = res.data.data;
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
					this.$api.msg('获取失败');
				})
			},
			
			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let val = {
					voice_code: this.voice_code,
					page_size: this.page_count,
					page: this.page_no
				}
				getVoiceHistory(val).then(res => {
					if (res.code == 20000) {
			
						let total = res.data.total;
						if (total == 0) return
						let List = res.data.data;
						let addList = this.videoList;
						List.forEach(item => {
							addList.push(item);
						});
			
						if (total % this.page_count == 0) {
							this.pageTotal = total / this.page_count
						} else {
							this.pageTotal = parseInt(total / this.page_count) + 1
						}
						console.log(this.pageTotal, 158)
						if (this.pageTotal <= this.page_no) {
							this.loadingType = 1
						}
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取失败');
				})
			},
			
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
			
			downVoice(url) {
				console.log(url,1254)
				this.fileUrl = global.baseImg+'/'+url;
				this.fileType = '2';
			}
			
		}
	}
</script>

<style lang="less" scoped>
	page { background: #f6f8fb; }
	.containar {
		width: 100%;
		padding: 30upx;
	}
	
	.voice_list {
		width: 100%;
		background: #fff;
		padding: 20upx;
		border-radius: 12upx;
		margin-bottom: 15upx;
		.list_li {
			width: 100%;
			border-radius: 12upx;
			background: #FFF;
		}
	}
	
	.li_del {
		width: 100%;
		text-align: right;
		.del_text {
			color: #1F64FF;
			font-size: 24upx;
			line-height: 40upx;
			padding-top: 20upx;
		}
	}
	
	.on_order {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50vh;
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
	
	.li_edit {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-top: 10upx;
		
		.edit_r {
			padding: 10upx 30upx;
			border-radius: 8upx;
			background:  #1F64FF;
			color: #fff;
			text-align: center;
			font-size: 28upx;
			font-style: normal;
			font-weight: 600; 
		}
	}
	
</style>