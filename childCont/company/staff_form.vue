<template>
	<view>
		<view class="container">
			<view class="cont">
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">名称</text>
					</view>
					<u--input placeholder="请输入企业AI数字员工名称(20字内）"  border="surround" maxlength="20" v-model="staff_name"></u--input>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
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
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">欢迎语设置</text>
					</view>
					<u-textarea v-model="welcomMessage" placeholder="请输入欢迎语" maxlength="100" ></u-textarea>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">绑定知识库</text>
					</view>
					<view class="lists" @click="openRole" v-if="clerk_code == ''">
						<view class="txt">{{ roleValue }}</view>
						<u-icon name="arrow-down" color="#666" size="16"></u-icon>
					</view>
					<view v-else>
						<u--input border="surround" v-model="roleValue" :disabled="true"></u--input>
					</view>
				</view>
			</view>
			
		</view>
		
		<!--知识库选择 -->
		<u-picker :show="roleShow" :columns="roleList" v-model="roleIndex" keyName="title" @cancel="roleShow = false" @confirm="roleSubmit"></u-picker>
		
		
		<view class="bottom">
			<view class="bottom_cont">
				<view class="bottom_buy" @click="addStaff">保存</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getKnowList,addClerk,editClerk
	} from '@/apis/user.js'
	
	export default {
		data() {
			return {
				staff_name: '',
				logoImg: [],
				welcomMessage: '',
				roleShow: false,
				roleIndex: 0,
				roleValue: 0,
				roleList: [],
				company_code: '',
				clerk_code: '',
				isClick: true,
				delImg: global.baseImg+'/xcx/853ff4b9-283a-4917-b922-f2329cbcb562.jpg',
			}
		},
		components: {
			
		},
		onLoad(option) {
			if(option.company_code) {
				this.company_code = option.company_code
			}
			
			if(option.item) {
				const list = JSON.parse(option.item)
                this.staff_name = list.clerk_name;
				this.welcomMessage = list.welcome_msg;
				this.roleIndex = list.knowledge_code;
				this.clerk_code = list.clerk_code;
				this.company_code = list.company_code;
				if(list.icon_url != '') {
					let img_url = { file_url: list.icon_url }
					this.logoImg = []
					this.logoImg.push(img_url)
				}
			}
           
		},
		onShow() {
            this.getKnowList()
		},
		methods: {
			
			// 获取知识库列表
			getKnowList() {
				let val = {
					company_code: this.company_code,
				}
				getKnowList(val).then(res => {
					if (res.code == 20000) {
						this.roleList = [];
						this.roleList.push(res.data.data);
						if(this.roleIndex != 0) {
							res.data.data.forEach( (val, index) => {
								if(val.knowledge_code == this.roleIndex) {
									this.roleValue = val.title
								}
							})
						} else {
							this.roleIndex = res.data.data[0].knowledge_code;
							this.roleValue = res.data.data[0].title;
						}
						
					} else {
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.$api.msg('获取对话信息失败');
				})
			},
		
           //添加、编辑
		   addStaff() {
			   if(this.staff_name == '') {
				   this.$api.msg('名称不能为空');
				   return;
			   }
			   
			   if(this.logoImg.length == 0) {
				   this.$api.msg('请上传团队图标');
				   return;
			   }
			   
			   if(this.welcomMessage == '') {
				   this.$api.msg('欢迎语不能为空');
				   return;
			   }
			   let img_url = ''
			   if(this.logoImg.length > 0) {
				   img_url = this.logoImg[0].file_url
			   }
			   
			   if(this.isClick == false) {
			   	   return
			   }
			   this.isClick = false
			   
			   if(this.clerk_code != '') { //编辑
				   let edit = {
					   clerk_code: this.clerk_code,
					   clerk_name: this.staff_name,
					   icon_url: img_url,
					   welcome_msg: this.welcomMessage
				   }
				   editClerk(edit).then(res => {
						if (res.code == 20000) {
							this.$api.msg('修改成功');
							setTimeout(() => {
								uni.redirectTo({
									url: '/childCont/company/know_list?company_code='+ this.company_code+ '&active=1'
								})
							}, 1500);
							this.isClick = true
						} else {
							this.$api.msg(res.msg);
							this.isClick = true
						}
				   }).catch(err => {
						this.$api.msg('修改失败');
						this.isClick = true
				   })
			   } else {//添加
				   let val = {
				   	   company_code: this.company_code,
					   knowledge_code: this.roleIndex,
					   clerk_name: this.staff_name,
					   icon_url: img_url,
					   welcome_msg: this.welcomMessage
				   }
				   addClerk(val).then(res => {
						if (res.code == 20000) {
							this.$api.msg('添加成功');
							setTimeout(() => {
								uni.redirectTo({
									url: '/childCont/company/know_list?company_code='+ this.company_code+ '&active=1'
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
			   }
			   
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
		   
		   // 打开角色弹窗
		   openRole() {
		   	this.roleShow = true;
		   },
		   roleSubmit(e) {
		   	console.log(e,1456)
		   	this.roleIndex = e.value[0].knowledge_code;
		   	this.roleValue = e.value[0].title;
		   	this.roleShow = false;
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
			.text_tip {
				color: #B7B9C0;
				font-size: 24upx;
				font-style: normal;
				font-weight: 400;
				line-height: 150%;
			}
			.text_conts {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 10upx;
				width: 100%;
				.text_u {
					display: flex;
					align-items: center;
					.u_li{
						color: #9A9A9A;
						text-align: center;
						font-size: 22upx;
						font-style: normal;
						font-weight: 400;
						margin-right: 10upx;
					}
					.add_img {
						width: 28upx;
						height: 28upx;
					}
					.add_li {
						color: #1F64FF;
						font-size: 26upx;
						font-style: normal;
						font-weight: 400;
						line-height: 150%;
						padding-left: 10upx;
					}
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
			
			.right_img {
				width: 24upx;
				height: 24upx;
				margin-right: 25upx;
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