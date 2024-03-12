<template>
	<view>
		<view class="text_conts">
			<view class="text_u">
				<text class="text_r">企业设置</text>
			</view>
		</view>
		<view class="container">
			<view class="cont">
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">名称</text>
					</view>
					<u--input placeholder="请输入公司名称(20字内)"  border="surround" maxlength="20" v-model="company_name"></u--input>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_r">团队介绍</text>
					</view>
					<u-textarea v-model="company_desc" placeholder="请输入团队介绍" maxlength="100" ></u-textarea>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_r">团队图标</text>
					</view>
					<view class="qs_img">
						<view v-for="(val, index) in logoImg" :key="index" style="position: relative;">
							<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
							<img class="del_img" :src="delImg" alt="" @click="logoImg.splice(index,1)"/>
						</view>
						<img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg()" v-if="logoImg.length == 0"/>
					</view>
					<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
				</view>
				
			</view>
			
		</view>
		
		<view class="bottom">
			<view class="bottom_cont">
				<view class="bottom_buy" @click="addStaff">保存</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		companySet
	} from '@/apis/user.js'
	
	export default {
		props: {
			info: String
		},
		data() {
			return {
				company_name: '',
				company_code: '',
				logoImg: [],
				company_desc: '',
				isClick: true,
				delImg: global.baseImg+'/xcx/853ff4b9-283a-4917-b922-f2329cbcb562.jpg',
			}
		},
		components: {
			
		},
		onLoad(option) {
           
		},
		onShow() {
           
		},
		created() {
			 const info = JSON.parse(this.info);
			 this.company_name = info.company_name;
			 this.company_desc = info.company_desc;
			 this.company_code = info.company_code;
			 if(info.icon_url != '') {
			 	let img_url = { file_url: info.icon_url }
			 	this.logoImg = []
			 	this.logoImg.push(img_url)
			 }
			 
		},
		methods: {
		
           //添加
		   addStaff() {
			   if(this.company_name == '') {
				   this.$api.msg('名称不能为空')
				   return
			   }
			   let img_url = ''
			   if(this.logoImg.length > 0) {
			   	  img_url = this.logoImg[0].file_url
			   }
			   let edit = {
				   company_code: this.company_code,
				   company_name: this.company_name,
				   icon_url: img_url,
				   company_desc: this.company_desc
			   }
			   if(this.isClick == false) {
			   	   return
			   }
			   this.isClick = false
			   companySet(edit).then(res => {
					if (res.code == 20000) {
						this.$api.msg('修改成功');
						setTimeout(() => {
							uni.redirectTo({
								url: '/childCont/company/company_list'
							})
						}, 1500);
						this.isClick = true
					} else {
						this.$api.msg(res.msg);
						this.isClick = true
					}
			   }).catch(err => {
					this.$api.msg('添加失败');
					this.isClick = true
			   })
		   },
		   
		   // 上传图片
		   uploadImg(val, tip) {
		   	let that = this;
		   	uni.chooseImage({
		   	  count: 1,
		   	  // mediaType: ['image'],
		   	  sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		   	  sourceType: ['album', 'camera'],
		   	  success(res) {
		   	    // console.log(res.tempFiles)
		   		console.log(res,589)
		   		const tempFilePaths = res.tempFilePaths[0];
		   		const size = res.tempFiles[0].size;
		   		if(size > 5242880) { // 图片文件最大只能上传5M
		   			that.$api.msg('该文件已超过5M，不能上传')
		   			return
		   		}
		   		
		   		uni.uploadFile({
		   			url: global.loginUrl + '/api/user/oss_upload', 
		   			filePath: tempFilePaths,
		   			name: 'image',
		   			formData: {
		   				"image": tempFilePaths,
		   				"oss_dir": 'static',
		   				"cate": 'create_character'
		   			},
		   			success: (uploadFileRes) => {
		   				let imgData = JSON.parse(uploadFileRes.data)
		   				console.log(imgData,333)
		   				if(imgData.code == 20000) {
		   					// let url = global.baseImg + '/'+ imgData.data.new_url
		   					let url = imgData.data.new_url
		   					let data = {  file_url: url }
		   					that.logoImg.push(data)
		   				} else {
		   					that.$api.msg(imgData.msg)
		   				}
		   			}
		   		});
		   	  }
		   	})
		   },
		   
		   getImgUrl(url){
		      return global.baseImg+'/'+url;
		   },
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #f6f8fb;
	}
	.container {
		padding: 30upx;
		
		.cont {
			background: #fff;
			border-radius: 10upx;
			padding: 20upx;
		}
		.chat_text {
			width: 100%;
			padding: 20upx 0;
			/deep/.u-textarea {
				padding: 18upx;
				min-height: 100upx;
				max-height: 150upx;
				overflow-y: auto;
			}
			
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
			
			.lists {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 20upx;
				background: #fff;
				border-radius: 8upx;
				border: 0.5px solid  #dadbde;
				// margin-bottom: 25upx;
				
				.txt {
					font-size: 26upx;
					margin-left: 20upx;
					flex: 1;
				}
				
				
			}
			
		}
	}
	
	.text_conts {
		display: flex;
		width: 100%;
		padding: 20upx 30upx 0 30upx;
		.text_u {
			display: flex;
			align-items: center;
			.text_r {
				color: #000;
				font-size: 32upx;
				font-style: normal;
				font-weight: 500;
				line-height: 150%; 
			}
		}
	}
	
	.bottom {
		width: 100%;
		position: fixed;
		bottom: 0upx;
		background: #fff;
		padding: 20upx 0;
		.bottom_cont {
			width: 100%;
			display: flex;
			justify-content: center;
			flex-direction: column;
		}
		
		.bottom_buy {
			width: 80%;
			height: 80upx;
			background: #1F64FF;
			border-radius: 6px;
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 500;
			font-size: 14px;
			line-height: 20px;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: auto;
		}
		
		.bottom_buy:active {
			opacity: 0.6;
		}
	}
	
	.qs_img {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		// margin: 20upx;
		flex-wrap: wrap;
		.up_img {
			width: 120rpx;
			height: 120rpx;
			padding: 10rpx;
			margin: 0 5rpx;
		}
		.del_img {
			position: absolute;
			top: 0;
			right: 10rpx;
			width: 36upx;
			height: 36upx;
		}
	}
	
	.img_text {
		color: #9A9A9A;
		font-size: 24upx;
		font-style: normal;
		font-weight: 400;
	}
	
</style>