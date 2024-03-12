<template>
	<view>
		<view class="head_index">
			<view class="head_cont">
				<view class="cont_tabs" style="width: 100%; background: #fff;">
					<u-tabs :list="list" lineWidth='50' lineHeight='3' lineColor='#1f64ff'
						:activeStyle='{"color": "#1F64FF","font-size":"26rpx"}' @change='version' :current='active'
						:inactiveStyle='{"font-size":"26rpx"}' :scrollable="false"></u-tabs>
				</view>
			</view>
		</view>
		<view class="cont_title">
			<text class="title_l">当前团队：{{ company_name }}</text>
			<text class="title_r" @click="toCompany">切换</text>
		</view>
		<!-- 知识库 -->
		<view v-if="active == 0">
			<addKnow ref="know" :companyCode="companyCode"></addKnow>
		</view>
		
		<!-- 员工 -->
		<view v-if="active == 1">
			<addStaff :companyCode="companyCode"></addStaff>
		</view>
		
		<!-- 成员管理 -->
		<view v-if="active == 2">
			<userManage :companyCode="companyCode"></userManage>
		</view>
		
		<!-- 企业设置 -->
		<view v-if="active == 3">
			<companySet :info="info"></companySet>
		</view>
	</view>
</template>

<script>
	
	import addKnow from '../company/add_know.vue'
	import addStaff from '../company/add_staff.vue'
	import userManage from '../company/user_manage.vue'
	import companySet from '../company/company_set.vue'
	export default {
		data() {
			return {
				active: 0,
				info: '',
				list: [
					{
						name:'知识库'
					},
					{
						name:'AI数字员工'
					},
					{
						name:'成员管理'
					},
					{
						name:'企业设置'
					},
				],
				companyCode: '0',
				company_name: '暂无关联团队'
			}
		},
		components: {
			addKnow,
            addStaff,
			userManage,
			companySet
		},
		onLoad(option) {
			if(option.item) {
				let list = JSON.parse(option.item)
				this.companyCode = list.company_code
				this.company_name = list.company_name
				this.info = option.item
			}
			
			if(option.company_code) {
				this.companyCode = option.company_code
			}
           
		   if(option.active) {
			   this.active = option.active
		   }
			
		},
		onShow() {
			// console.log(this.$refs.know,666)
            // this.getKnow()
		},
		methods: {
			
			version(val) {
				// console.log(val,5585)
				this.active = val.index;
				this.page_no = 1;
				this.loadingType = 0;
				// this.getChatList()
			},
			
			toCompany() {
				uni.navigateTo({
					url: '/childCont/company/company_list',
				})
			}
			

		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #f6f8fb;
	}
	
	.cont_title {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20upx 0;
		.title_l {
			font-size: 28upx;
			color: #000;
			margin-right: 20upx
		}
		.title_r {
			border-radius: 8upx;
			color: #fff;
			font-size: 28upx;
			background: #1F64FF;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 12upx 20upx;
		}
	}
	
</style>