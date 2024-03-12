<template>
	<view>
		<view class="top_cont">
			<view class="search_cont">
				<u-tabs :list="list" lineWidth='40' lineHeight='2' lineColor='#1f64ff'
					:activeStyle='{color: "#1F64FF","font-size":"26rpx"}' @change='tabsChange'
					:inactiveStyle='{"font-size":"26rpx"}'></u-tabs>
				<view class="right_text" @click="toTalk">聊天记录</view>
			</view>
			
		</view>
		
		<!-- 内容 -->
		<view class="chat_cont">
			<view style="padding: 10upx 20upx;">
				<view class="lists" @click="openInfo(tip)">
					<view class="txt" >{{ searchValue }}</view>
					<u-icon name="arrow-down" color="#666" size="16"></u-icon>
				</view>
			</view>
			
			<scroll-view class="list_ul" scroll-y="true" v-if="infoList.length > 0">
				<view class="ul_style" v-for="(item, index) in infoList" :key="index" >
					<view class="li_style" @click="toDetail(item)">
						
						<view class="li_cont">
							<view class="li_left">
								<image class="li_img" :src="item.character_avatar" v-if="item.character_avatar != ''"></image>
								<view class="li_avatar" v-else>{{ item.assistant_title.slice(0,1) }}</view>
								<view class="li_check" v-if="item.status == 0">正在审核</view>
								<view class="li_back" v-if="item.status == 2">审核驳回</view>
								<view class="li_pass" v-if="item.status == 1 || item.status == 3">审核通过</view>
							</view>
							
							<view class="cont_text">
								<view class="text_t">
								       <view class="t_left" v-if="item.character_avatar != ''">{{ item.character_name }}</view>
									   <view class="t_left" v-else>{{ item.assistant_title }}</view>
									   <view class="li_top">
											<!-- <text class="top_text">正在审核中，审核后将在平台展示</text> -->
											<view class="icon_text" @click.stop="checkTip(item.refuse_reason)" v-if="item.status == 2"><u-icon name="question-circle" font-size="30"></u-icon></view>
											<view class="icon_text" @click.stop="editChat(item.question_id)" v-if="item.status == 2"><u-icon name="edit-pen-fill" font-size="30"></u-icon></view>
											<view class="icon_text" @click.stop="delChat(item.question_id)"><u-icon name="trash" font-size="30"></u-icon></view>
									   </view>
								</view>
								<view class="text_c">
									<text class="text_b" v-if="item.character_avatar != ''">{{ item.character_greetings }}</text>
									<text class="text_b" v-else>{{ item.assistant_content }}</text>
								</view>
								
							</view>
						</view>
						
					</view>
				</view>
			</scroll-view>
			
			<view class="on_order" v-else>
				<image class="order_img" :src="backImg"></image>
			</view>
						
			<view class="on_order_list" v-if="loadingType == 1">没有更多内容了!</view>
		</view>
		
		<view class="bottom">
			<view class="bottom_cont">
				<view class="bottom_buy" @click="addRole">新增</view>
			</view>
		</view>
		
		<!-- 模块弹窗 -->
		<u-popup :show="selectDialog" mode="bottom" :round="10" :closeable="true" @close="selectDialog = false" @open="selectDialog = true">
			<view class="dia_cont">
				<view class="chat_text" style="padding-top:50rpx;">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">模块</text>
					</view>
					<view class="lists" @click="openIndustry">
						<view class="txt">{{ industryValue }}</view>
						<u-icon name="arrow-down" color="#666" size="16"></u-icon>
					</view>
				</view>
				
				<view class="chat_text" v-if="occupationList.length > 0">
					<view class="text_cont">
						<text class="text_l"></text>
						<text class="text_r">职业</text>
					</view>
					<view class="lists" @click="openOccupation">
						<view class="txt">{{ occupationValue }}</view>
						<u-icon name="arrow-down" color="#666" size="16"></u-icon>
					</view>
				</view>
				
				<view class="chat_text" v-if="secList.length > 0">
					<view class="text_cont">
						<text class="text_l"></text>
						<text class="text_r">子职业</text>
					</view>
					<view class="lists" @click="openSec">
						<view class="txt">{{ secValue }}</view>
						<u-icon name="arrow-down" color="#666" size="16"></u-icon>
					</view>
				</view>
				
				<view class="chat_text" v-if="durationList.length > 0">
					<view class="text_cont">
						<text class="text_l"></text>
						<text class="text_r">从业时间</text>
					</view>
					<view class="lists" @click="openDuration">
						<view class="txt">{{ durationValue }}</view>
						<u-icon name="arrow-down" color="#666" size="16"></u-icon>
					</view>
				</view>
				
				<view class="chat_text" v-if="expertiseList.length > 0">
					<view class="text_cont">
						<text class="text_l"></text>
						<text class="text_r">地位</text>
					</view>
					<view class="lists" @click="openExpertise">
						<view class="txt">{{ expertiseValue }}</view>
						<u-icon name="arrow-down" color="#666" size="16"></u-icon>
					</view>
				</view>
				
				<view class="chat_text" v-if="moudelList.length > 0">
					<view class="text_cont">
						<text class="text_l"></text>
						<text class="text_r">分类</text>
					</view>
					<view class="lists" @click="openMoudel">
						<view class="txt">{{ moudelValue }}</view>
						<u-icon name="arrow-down" color="#666" size="16"></u-icon>
					</view>
				</view>
				
				<view class="bottoms">
					<view class="bottom_cont" style="width: 100%;">
						<view class="bottom_buy" style="width: 100%;" @click="addSubmit">提交</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 模块选择 -->
		<u-picker :show="industryShow" :columns="industryList" v-model="industryIndex" keyName="label" @cancel="industryShow = false" @confirm="industrySubmit"></u-picker>
		
		<!-- 职业选择 -->
		<u-picker :show="occupationShow" :columns="occupationList" v-model="occupationIndex" keyName="name" @cancel="occupationShow = false" @confirm="occupationSubmit"></u-picker>
		
		<!-- 子职业选择 -->
		<u-picker :show="secShow" :columns="secList" v-model="secIndex" keyName="name" @cancel="secShow = false" @confirm="secSubmit"></u-picker>
		
		<!-- 从业时间选择 -->
		<u-picker :show="durationShow" :columns="durationList" v-model="durationIndex" keyName="emp_duration_name" @cancel="durationShow = false" @confirm="durationSubmit"></u-picker>
		
		<!-- 地位选择 -->
		<u-picker :show="expertiseShow" :columns="expertiseList" v-model="expertiseIndex" keyName="name" @cancel="expertiseShow = false" @confirm="expertiseSubmit"></u-picker>
		
		<!-- 分类选择 -->
		<u-picker :show="moudelShow" :columns="moudelList" v-model="moudelIndex" keyName="name" @cancel="moudelShow = false" @confirm="moudelSubmit"></u-picker>
		
		<!-- 搜索选择 -->
		<u-picker :show="infoShow" v-model="searchValue" :columns="searchList" keyName="label" @cancel="infoShow = false" @confirm="pickSelect"></u-picker>
		
	</view>
</template>

<script>
	import { getUserModel,delUserModel, getIndustry, getOccupation, getSec, getDuration, getExpertise, getModules, getMessage,getQrCode, applyChat } from '@/apis/user.js'
	export default {
		data() {
			return {
				is_public: 1,
				loadingType: 0,
				page_no: 1,
				page_count: 10,
				infoList: [],
				pageTotal: 0,
				backImg: global.baseImg+'/xcx/8a3fda0a-67b9-4545-a297-2b516055f560.jpg',
				list: [{
					id: 1,
					name: '公开'
				},{
					id: 0,
					name: '私有'
				}],
				
				//搜索
				infoShow: false,
				searchValue:'全部',
				searchIndex: '5',
				searchList: [
					[
						{ label: '全部',id: 5 },
						{ label: '人物互动',id: 3 },
						{ label: '角色扮演',id: 1 },
						{ label: '生活助理',id: 2 },
						{ label: '工作助理',id: 4 },
						
					]
				],
				
				
				// 模块
				industryValue: '人物互动',
				industryIndex: '1003',
				industryShow: false,
				industryList: [
					[
						{ label: '人物互动',id: 1003 },
						{ label: '角色扮演',id: 1001 },
						{ label: '生活助理',id: 1000 },
						{ label: '工作助理',id: 4 },
					]
				],
				
				industry_id: '1003', //行业id
				
				// 职业
				occupationValue: '',
				occupationIndex: '',
				occupationShow: false,
				occupationList: [],
				
				// 子职业
				secValue: '',
				secIndex: '',
				secShow: false,
				secList: [],
				
				// 从业时间
				durationValue: '',
				durationIndex: '',
				durationShow: false,
				durationList: [],
				
				// 地位
				expertiseValue: '',
				expertiseIndex: '',
				expertiseShow: false,
				expertiseList: [],
				
				// 分类
				moudelValue: '',
				moudelIndex: '',
				moudelShow: false,
				moudelList: [],
				selectDialog: false,
				
				url_code: null
			}
		},
		components: {
			
		},
		onLoad() {
			
		},
		onShow() {
			this.page_no = 1;
			this.getInfoList();
			
			// 获取二维码链接
			if(this.url_code == null) {
				this.getQrCode()
			}
		},
		methods: {
			getQrCode() {
				let val = { "q_type": "2" }
				getQrCode(val).then(res => {
					if (res.code == 20000) {
						let scene = decodeURIComponent(res.data);
						this.url_code = this.getUrlDataFN(scene);
						// console.log(url_code,123)
					} else {
						// this.$api.msg(res.msg);
					}
				}).catch(err => {
					// this.$api.msg('获取信息失败');
				})
			},
			
			//截取url参数
			getUrlDataFN(urlStr) {
			  // 定义一个空对象以储存数据
			  const urlObj = {}
			  // 检查url中是否携带数据
			  if (urlStr.indexOf('?') === -1) return null
			  // 找到 '?' 对应的下标
			  const index = urlStr.indexOf('?') // index = 31
			  // 截取 '?' 后的内容
			  const dataStr = urlStr.substr(index + 1) // dataStr = a=1&b=2&c=&d=xxx&e
			  // 通过 '&' 将字符串分割成数组
			  const dataArr = dataStr.split('&') // ['a=1', 'b=2', 'c=', 'd=xxx', 'e']
			  // 遍历字符串分割后的数组
			  dataArr.forEach(str => {
				// 判断数组内的字符串是否有 '='
				if (str.indexOf('=') === -1) {
				  // 如没有 '=' , 则将此字符串作为对象内键值对的键, 键值对的值为 undefined
				  urlObj[str] = undefined // { e: undefined }
				} else {
				  // 如果有 '='
				  // 通过 '=' 将此字符串截取成两段字符串（不推荐使用 split 分割, 因为数据中可能携带多个 '=' ）
				  const innerArrIndex = str.indexOf('=')
				  const key = str.substring(0, innerArrIndex)
				  const value = str.substr(innerArrIndex + 1)
				  // 以截取后的两段字符串作为对象的键值对
				  urlObj[key] = value // {a: '1', b: '2', c: '', d: 'xxx'}
				}
			  })
			  // 返回对象
			  console.log(urlObj)
			  return urlObj
			},
			// 选择公开/私有
			tabsChange(e) {
				// console.log(e, 335)
				this.page_no = 1;
				this.loadingType = 0;
				this.is_public = e.id;
				this.searchValue = '全部';
				this.searchIndex = '5'
				this.getInfoList()
			},
			
			// 获取对话列表
			getInfoList() {
			  let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			  let val = {
				  'user_id': userInfo.user_id,
				  // 'user_id': '12345678',
				  'is_public': this.is_public,
				  'industry_id': this.searchIndex,
				  'page_index': this.page_no,
				  'page_count': this.page_count
			  }
			  getUserModel(val).then(res => {
				  if (res.code == 20000) {
					   res.data.forEach(item => {
					   	   if(item.character_avatar != '') {
							   item.character_avatar = global.baseImg+'/'+item.character_avatar
						   }
					   });
					   this.infoList = res.data;
					 
					  let total = res.total;
					  if(total%this.page_count == 0) {
						   this.pageTotal = total/this.page_count
					  } else {
						   this.pageTotal = parseInt(total/this.page_count) + 1
					  }
					  if(this.pageTotal == 1) {
						  this.loadingType = 1;
					  }
				  } else {
					  this.$api.msg(res.msg);
				  }
			  }).catch(err => {
				  this.$api.msg('获取订单信息失败');
			  })
			},
			
			//页面触底事件
			onReachBottom() {
				if (this.loadingType == 1) return
				this.page_no++
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				let val = {
				  'user_id': userInfo.user_id,
				  // 'user_id': '12345678',
				  'is_public': this.is_public,
				  'industry_id': this.searchIndex,
				  'page_index': this.page_no,
				  'page_count': this.page_count
				}
				getUserModel(val).then(res => {
				  if (res.code == 20000) {

					  let total = res.total;
					  if (total == 0) return
					  let List = res.data;
					  let addList = this.infoList;
					  List.forEach(item => {
						  if(item.character_avatar != '') {
						  	  item.character_avatar = global.baseImg+'/'+item.character_avatar
						  }
					  	  addList.push(item);
					  });
					  
					  if(total%this.page_count == 0) {
						   this.pageTotal = total/this.page_count
					  } else {
						   this.pageTotal = parseInt(total/this.page_count) + 1
					  }
					  // console.log(this.pageTotal,158)
					  if (this.pageTotal <= this.page_no) {
					  	this.loadingType = 1
					  }
				  } else {
					  this.$api.msg(res.msg);
				  }
				}).catch(err => {
					  this.$api.msg('获取订单信息失败');
				})
			},
			
			//前往聊天记录
			toDetail(item) {
				console.log(item)
				if(item.status == 1 || item.status == 3) {
					if(item.character_avatar == '') {
						item.title = item.assistant_title;
						item.content = item.assistant_content;
						
						if(this.is_public == 1) {
							uni.navigateTo({
								url: "/pages/apply/apply_ask?module_id="+ item.module_id +'&question_id=' +item.question_id +'&parent_user_code='+ this.url_code.parent_user_code +'&role='+ this.url_code.role
							})
						} else {
							uni.navigateTo({
								url: "/pages/apply/apply_ask?item="+ JSON.stringify(item) 
							})
						}
						
					} else {
						uni.navigateTo({
							url: '/childPage/role/user_chat?item='+ JSON.stringify(item)
						})
					}
					
				} else {
					this.$api.msg('该创作暂未通过审核，无法进行对话操作')
				}
				
			},
			
			// 打开创作中心
			addRole() {
				let data = { industry_id: '1003' };
				this.industryValue = '人物互动';
				this.occupationList = [];
				this.secList = [];
				this.durationList = [];
				this.expertiseList = [];
				this.getModules(data);
				this.selectDialog = true;
			},
			
			//提交模块信息
			addSubmit() {
				let data = {
					industry_id: this.industry_id,
					module_id: this.moudelIndex,
					industryIndex: this.industryIndex
				}
				if(this.occupationIndex != '') {
					data.occu_id = this.occupationIndex
				} else {
					data.occu_id = ''
				}
				
				if(this.secIndex != '') {
					data.sub_occu_id = this.secIndex
				} else {
					data.sub_occu_id = ''
				}
				
				if(this.durationIndex != '') {
					data.emp_duration_id = this.durationIndex
				} else {
					data.emp_duration_id = ''
				}
				
				if(this.expertiseIndex != '') {
					data.expertise_level_id = this.expertiseIndex
				} else {
					data.expertise_level_id = ''
				}
				uni.navigateTo({
					url: '/childPage/role/add_role?item='+ JSON.stringify(data)
				})
				this.selectDialog = false;
			},
			
			toTalk() {
				uni.navigateTo({
					url: '/childPage/role/talk'
				})
			},
			// 查看提示
			checkTip(content) {
				uni.showModal({
					title: '驳回原因',
					content: content,
					confirmText: "知道了",
					showCancel: false,
				});
			},
			
			// 打开模块弹窗
			openIndustry() {
				this.industryShow = true;
			},
			industrySubmit(e) {
				console.log(e,1456)
				this.industryIndex = e.value[0].id;
				this.industryValue = e.value[0].label;
				this.industryShow = false;
				
				if(this.industryIndex == 4) {
					this.getIndustry()
				} else {
					this.occupationList = []
					this.secList = []
					this.durationList = []
					this.expertiseList = []
					this.moudelList = []
					this.industry_id = this.industryIndex;
					let data = { industry_id: this.industryIndex }
					this.getModules(data)
				}
			},
			
			// 打开职业弹窗
			openOccupation() {
				this.occupationShow = true;
			},
			occupationSubmit(e) {
				
				this.occupationIndex = e.value[0].occu_id;
				this.occupationValue = e.value[0].name;
				this.occupationShow = false;
				let data = { industry_id: this.industry_id, occu_id: this.occupationIndex }
				this.getSec(data)
			},
			
			// 打开子职业弹窗
			openSec() {
				this.secShow = true;
			},
			secSubmit(e) {
				this.secIndex = e.value[0].sub_occu_id;
				this.secValue = e.value[0].name;
				this.secShow = false;
				let data = { industry_id: this.industry_id, occu_id: this.occupationIndex, sub_occu_id: this.secIndex }
				this.getDuration(data)
			},
			
			// 打开从业时间弹窗
			openDuration() {
				this.durationShow = true;
			},
			durationSubmit(e) {
				this.durationIndex = e.value[0].emp_duration_id;
				this.durationValue = e.value[0].emp_duration_name;
				this.durationShow = false;
				let data = { industry_id: this.industry_id, occu_id: this.occupationIndex, sub_occu_id: this.secIndex, emp_duration_id: this.durationIndex }
				this.getExpertise(data)
			},
			
			// 打开地位弹窗
			openExpertise() {
				this.expertiseShow = true;
			},
			expertiseSubmit(e) {
				this.expertiseIndex = e.value[0].expertise_level_id;
				this.expertiseValue = e.value[0].name;
				this.expertiseShow = false;
				let data = { industry_id: this.industry_id, occu_id: this.occupationIndex, sub_occu_id: this.secIndex, emp_duration_id: this.durationIndex,expertise_level_id: this.expertiseIndex }
				this.getModules(data)
			},
			
			// 打开分类弹窗
			openMoudel() {
				this.moudelShow = true;
			},
			moudelSubmit(e) {
				this.moudelIndex = e.value[0].module_id;
				this.moudelValue = e.value[0].name;
				this.moudelShow = false;
			},
			
			// 获取行业
			getIndustry() {
				getIndustry().then(res => {
					if(res.code == 20000) {
						if(res.data.length > 0) {
							this.industry_id = res.data[0].industry_id;
							let data = { industry_id: this.industry_id }
							
							this.getOccupation(data) //第一次默认职业
						}
						
					} else {
						this.$api.msg(res.msg)
					}
							
				})
			},
			
			// 获取职业
			getOccupation(data) {
				getOccupation(data).then(res => {	
					if(res.code == 20000) {
						if(res.data.length > 0) {
							this.occupationList = []
							this.occupationList.push(res.data) 
							this.occupationIndex = res.data[0].occu_id
							this.occupationValue = res.data[0].name
							let data = { industry_id: this.industry_id, occu_id: this.occupationIndex }
							this.getModules(data)
						}else{
							this.occupationList = []
						}
						
					} else {
						this.$api.msg(res.msg)
					}
				})
			},
			
			// 获取子职业
			getSec(data) {
				getSec(data).then(res => {	
					if(res.code == 20000) {
						if(res.data.length > 0) {
							this.secList = []
							this.secList.push(res.data) 
							this.secIndex = res.data[0].sub_occu_id
							this.secValue = res.data[0].name
							let data = { industry_id: this.industry_id, occu_id: this.occupationIndex, sub_occu_id: this.secIndex }
							// this.getDuration(data)
							this.getModules(data)
						} else {
							this.secList = []
						}
						
					} else {
						this.$api.msg(res.msg)
					}
				})
			},
			
			// 获取从业时间
			getDuration(data) {
				getDuration(data).then(res => {	
					if(res.code == 20000) {
						if(res.data.length > 0) {
							this.durationList = []
							this.durationList.push(res.data) 
							this.durationIndex = res.data[0].emp_duration_id
							this.durationValue = res.data[0].emp_duration_name
							let data = { industry_id: this.industry_id, occu_id: this.occupationIndex, sub_occu_id: this.secIndex, emp_duration_id: this.durationIndex }
							// this.getExpertise(data)
							this.getModules(data)
						} else {
							this.durationList = []
						}
						
					} else {
						this.$api.msg(res.msg)
					}
				})
			},
			
			// 获取地位
			getExpertise(data) {
				getExpertise(data).then(res => {	
					if(res.code == 20000) {
						if(res.data.length > 0) {
							this.expertiseList = []
							this.expertiseList.push(res.data);
							this.expertiseIndex = res.data[0].expertise_level_id
							this.expertiseValue = res.data[0].name
							let data = { industry_id: this.industry_id, occu_id: this.occupationIndex, sub_occu_id: this.secIndex, emp_duration_id: this.durationIndex,expertise_level_id: this.expertiseIndex }
							this.getModules(data)
						} else {
							this.expertiseList = []
						}
						
					} else {
						this.$api.msg(res.msg)
					}
				})
			},
			
			// 获取模块集合
			getModules(data) {
				getModules(data).then(res => {
					if(res.code == 20000) {
						if(res.data.length > 0) {
							this.moudelList = []
							this.moudelList.push(res.data)
							this.moudelIndex = res.data[0].module_id
							this.moudelValue = res.data[0].name
						} else {
							this.moudelList = []
						}
						
					} else {
						this.$api.msg(res.msg)
					}
					
				})
				
			},
			
			pickSelect(e) {
				this.searchValue = e.value[0].label;
				this.searchIndex = e.value[0].id;
				this.infoShow = false;
				this.getInfoList()
			},
		
			openInfo(index) {
				this.infoShow = true;
			},
			
			editChat(id) {
				uni.navigateTo({
					url: '/childPage/role/add_role?question_id='+ id
				})
			},
			
			delChat(id) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定删除该信息吗？',
					success(res) {
					  if (res.confirm) {
						  that.delCont(id)
					  }
					}
				});
			},
			
			// 删除信息
			delCont(id) {
				let data = { question_id: id }
				delUserModel(data).then(res => {
					if(res.code == 20000) {
						this.$api.msg('删除成功')
						this.getInfoList()
					} else {
						this.$api.msg(res.msg)
					}
					
				})
				
			},
			
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #f6f8fb;
	}
	.top_cont {
		width: 100%;
		height: 80upx;
		background: #fff;
		position: fixed;
		top: 0;
		z-index: 10;
		.search_cont {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 25upx;
			.right_text {
				font-weight: 400;
				font-size: 26upx;
				color: #1F64FF;
				margin-right: 15upx;
			}
		}
	}
	
	.list_ul {
		padding: 25upx 10upx;
		// margin-bottom: 50upx;
		width: 100%;
		
		.ul_style {
			display: flex;
			flex-direction: column;
			padding: 0 15upx;
			
			.li_style {
				display: flex;
				background: #fff;
				flex-direction: column;
				box-shadow:0upx 0upx 10upx rgba(0, 0, 0, 0.14);
				border-radius: 15upx;
				padding: 30upx;
				margin-bottom: 25upx;
				
				.li_top {
					display: flex;
					justify-content: flex-end;
					.icon_text {
						padding: 0 12upx;
					}
					.top_text {
						border-radius: 0 15upx;
						background: #DDE8FF;
						color: #1F64FF;
						font-family: PingFang SC;
						font-size: 20upx;
						font-style: normal;
						font-weight: 400;
						padding: 5upx 10upx;
						line-height: 30upx;
					}
				}
				.li_cont {
					display: flex;
					align-items: flex-start;
					.li_left {
						display: flex;
						flex-direction: column;
						width: 110upx;
						justify-content: center;
						align-items: center;
						.li_img {
							width: 110upx;
							height: 110upx;
							border-radius: 50%;
						}
						.li_avatar {
							width: 110upx;
							height: 110upx;
							line-height: 110upx;
							text-align: center;
							border-radius: 50%;
							background: #DFEBFE;
							color: #5F9BF8;
							font-size: 40upx;
							font-weight: 550;
						}
						
						.li_check {
							color: #1F64FF;
							font-size: 22upx;
							font-weight: 400;
							line-height: 36upx;
							border-radius: 6upx;
							background: #DDE8FF;
							margin-top: -10upx;
							padding: 0 6upx;
						}
						
						.li_back {
							color: #ED6A5D;
							font-size: 22upx;
							font-weight: 400;
							line-height: 36upx;
							border-radius: 6upx;
							background: #FBE1DF;
							margin-top: -10upx;
							padding: 0 6upx;
						}
						
						.li_pass {
							color: #52C41A;
							font-size: 22upx;
							font-weight: 400;
							line-height: 36upx;
							border-radius: 6upx;
							background:rgba(82, 196, 26, 0.20);
							margin-top: -10upx;
							padding: 0 6upx;
						}
					}
					
					.cont_text{
						display: flex;
						flex-direction: column;
						padding: 0 0upx 0 15upx;
						flex: 1;
						.text_t {
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 15upx;
							.t_left {
								color: #333;
								font-size: 30upx;
								font-style: normal;
								font-weight: 500;
								line-height: 150%;
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
								width: 60%;
							}
						}
						.text_c {
							height: 70upx;
							.text_b {
								color: #666;
								font-size: 26upx;
								font-style: normal;
								font-weight: 400;
								line-height: 35upx;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 2; // 控制多行的行数
								-webkit-box-orient: vertical;
							}
						}
					}
				}
			}
		}
	}
	
	.bottom {
		width: 100%;
		background: #ffffff;
		position: fixed;
		bottom: 0;
	}
	
	.bottoms {
		width: 100%;
		background: #ffffff;
	}
	
	.bottom_cont {
		display: flex;
		justify-content: center;
		flex-direction: column;
		padding-bottom: 25upx;
	}
	
	.bottom_buy {
		width: 90%;
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
		margin: 20upx auto 0;
	}
	
	.dia_cont {
		padding: 25upx;
		align-items: center;
		justify-content: center;
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
			
			.right_img {
				width: 24upx;
				height: 24upx;
				margin-right: 25upx;
			}
			
			.lists {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 15upx;
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
		margin-bottom: 110upx;
	}
	.chat_cont{
		.lists {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 15rpx 20upx;
			background: #fff;
			border-radius: 50upx;
			border: 0.5px solid  #dadbde;
			// margin-bottom: 25upx;
			margin-top: 90upx;
			.txt {
				font-size: 26upx;
				margin-left: 20upx;
				flex: 1;
			}
			
		}
	}
	
	
</style>