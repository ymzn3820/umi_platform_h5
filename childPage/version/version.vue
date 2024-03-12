<template>
	<view style="padding: 30upx 40upx;">
		<u-steps current="16" direction="column" dot>
			<u-steps-item title="V6.5.2 2023/12/29" :desc="tip25">
			</u-steps-item>
			<u-steps-item title="V6.5.1 2023/12/25" :desc="tip24">
			</u-steps-item>
			<u-steps-item title="V6.5  2023/12/23" :desc="tip23">
			</u-steps-item>
			<u-steps-item title="V6.4.2 2023/12/12" :desc="tip22">
			</u-steps-item>
			<u-steps-item title="V6.4.1 2023/12/8" :desc="tip21">
			</u-steps-item>
			<u-steps-item title="V6.4.0 2023/12/6" :desc="tip20">
			</u-steps-item>
			<u-steps-item title="V6.3.5 2023/11/30" :desc="tip19">
			</u-steps-item>
			<u-steps-item title="V6.3.4 2023/11/25" :desc="tip18">
			</u-steps-item>
			<u-steps-item title="V6.3.3 2023/11/21" :desc="tip17">
			</u-steps-item>
			<u-steps-item title="V6.3.2 2023/11/20" :desc="tip16">
			</u-steps-item>
			<u-steps-item title="V6.3.1 2023/11/18" :desc="tip15">
			</u-steps-item>
			<u-steps-item title="V6.3.0 2023/11/16" :desc="tip14">
			</u-steps-item>
			<u-steps-item title="V6.2.2 2023/11/14" :desc="tip13">
			</u-steps-item>
			<u-steps-item title="V6.2.1 2023/11/11" :desc="tip12">
			</u-steps-item>
			<u-steps-item title="V6.2.0 2023/11/10" :desc="tip11">
			</u-steps-item>
			<u-steps-item title="V6.0.0 2023/11/4" :desc="tip10">
			</u-steps-item>
			<u-steps-item title="V5.1.0 2023/8/18" :desc="tip9">
			</u-steps-item>
			<u-steps-item title="V5.0.0 2023/8/11" :desc="tip8">
			</u-steps-item>
			<u-steps-item title="V3.2.0 2023/7/31" :desc="tip7">
			</u-steps-item>
			<u-steps-item title="V3.1.0 2023/7/14" :desc="tip6">
			</u-steps-item>
			<u-steps-item title="V3.0.0 2023/7/7" :desc="tip5">
			</u-steps-item>
			<u-steps-item title="V2.2.2 2023/6/30" :desc="tip4">
			</u-steps-item>
			<u-steps-item title="V2.2.1 2023/6/27" :desc="tip3">
			</u-steps-item>
			<u-steps-item title="V2.2.0 2023/6/25" :desc="tip2">
			</u-steps-item>
			<u-steps-item title="V2.1.1 2023/6/20" desc="优化流量包数量价格用量联动，新增有效期时间、剩余次数优化，新增流量加购等超链接。">
			</u-steps-item>
			<u-steps-item title="V2.1.0 2023/6/19" :desc="tip1">
			</u-steps-item>
			<u-steps-item title="V2.1 2023/6/14" desc="1、更改应用助理ios端不兼容问题\n2、修改部分模块提示语\n3、修正停止回答无法重新提问问题">
			</u-steps-item>
			<u-steps-item title="V2.0 2023/6/13" desc="1、首页改版\n2、添加应用助理功能模块">
			</u-steps-item>
			<u-steps-item title="V1.3 2023/6/6" desc="1、添加2天2.9会员卡逻辑功能\n2、修复一些问题 ">
			</u-steps-item>
			<u-steps-item title="V1.2 2023/6/5"
				desc="1、添加对话中‘重新提问’、‘重新回答’、‘停止回答’按钮，引导跳转到40回答文案功能\n2、优化首页每次进来都需要请求问题\n3、解决试两个两程序导致微信一键登录出现冲突问题\n4、绘画增加点赞点踩功能">
			</u-steps-item>
			<u-steps-item title="V1.1 2023/5/31"
				desc="1、优化对话、绘画、首页主流程\n2、VIP支付成功绑定手机号功能\n3、添加游客注册注册登录功能\n4、添加商务合作页面及逻辑功能 ">
			</u-steps-item>
			<u-steps-item title="V1.0 2023/5/28" desc="首页、个人中心、卡密兑换、订单记录、回答历史、对话、绘画、升级会员主流程功能 ">
			</u-steps-item>
		</u-steps>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: '',
				tip1: "1、增加流量包功能\n我们对（GPT35、GPT40、百度绘画、DALL E2)产品单独推出流量包购买服务，用户单独购买无限制使用流量包。\n" +
					"2、增加流量包详情展示\n优化套餐类型（VIP订单、流量包订单），新增订单详情页，可查看订单详情。\n" +
					"3、增加订单详情重新发起付款功能\n优化（GPT35、GPT40、百度绘画、DALL E2)图标，新增本次回答(优化按钮)、修改618结束活动价格等",
				tip2: "1、新增分销模块包含\n新增营销入口（用户通过营销入口进入到营销页面)" +
					"升级钻石分销功能\n佣金统计记录功能（包含统计全部佣金总和，分销用户成员统计，可提现金额统计）\n" +
					"提现功能（包含绑定银行卡功能，提现金额申请，提现历史记录）\n" +
					"我的成员功能（展示分销用户头像、昵称、分销时间）\n" +
					"我的订单列表和订单明细功能\n" +
					"分销分享功能（分销二维码或分销链接两种分销方式）\n" +
					"2、分享功能\n" +
					"分销二维码或分销链接两种分销方式",
				tip3: "1、新增通用包功能\n购买通用包全平台通用包，各模型均可使用\n" +
					"2、优化一些问题\n" +
					"钻石分销展示有效期时间等信息\n" +
					"分销邀请提示登入\n" +
					"次数用尽提示语优化\n" +
					"剩余次数模块优化等问题",
				tip4: "1、新增文心一言、讯飞火星、Midjourney功能\n" +
					"2、优化一些问题\n" +
					"新增AI绘画历史记录\n" +
					"新增首页模型入口\n" +
					"个人中心菜单栏优化\n" +
					"订单记录显示优化\n" +
					"剩余次数显示优化\n" +
					"3、修复一些体验bug",
				tip5: "1、公告管理\n" +
					"2、AI对话新增问题集词库\n" +
					"3、AI绘画新增图片案例\n" +
					"4、用户助理新增详情功能\n" +
					"4、优化计费中心页面\n" +
					"5、新增算力换算功能\n" +
					"6、优化一些问题\n",

				tip6: "1、新增Claude、chatGLM模型\n" +
					"2、优化应用助理场景模块功能\n" +
					"3、新增问答广场功能\n" +
					"4、优化一些问题\n" +
					"5、修复一些bug\n",

				tip7: "1、新增企业营销资产模块\n" +
					"2、新增名人互动模块\n" +
					"3、新增用户创建问题集模块\n" +
					"4、新增Stable Diffusion模型\n" +
					"5、优化一些问题（阿里云敏感词过滤、绘画图片预览等）\n" +
					"6、修复一些bug\n",
				tip8: "1、新增SD图生图功能\n" +
					"2、新增AI识图功能\n" +
					"3、新增通义千问、商汤日日新模型\n" +
					"4、首页优化、AI对话优化、AI绘画优化、用户信息修改等\n" +
					"5、修复一些bug\n",
				tip9: "1、音视频转写（实时录音、文件转写、微信转写）\n" +
					"2、四维彩超\n" +
					"3、数字人定制（形象克隆、声音克隆）\n" +
					"4、修复一些bug\n",
				tip10: "1、首页增加导师模块\n" +
					"2、对话模块文心一言、讯飞星火、通义前问加入不同模型对话\n",
				tip11: "1、首页视觉全新升级\n" +
					"2、新增AI实验室功能\n" +
					"3、导师模块优化\n" +
					"4、AI对话新增360智脑模型\n" +
					"5、AI绘画新增通义万相、火山引擎模型\n" +
					"6、计费中心优化\n" +
					"7、问题修复及性能优化，改进用户体验",
				tip12: "1、增加视觉体验馆\n" +
					"2、我们进行了一些小更新，修复已知Bug，多项细节优化\n",
				tip13: "1、增加文档对话\n" +
					"2、修复已知Bug,多项细节优化\n",
				tip14: "1、视觉体验馆能力丰富\n" +
					"2、个人中心新增关注公众号入口\n" +
					"3、首页导师及AI实验室页面优化\n" +
					"4、分享海报体验优化 切换更流畅\n" +
					"5、优化更多细节，提升用户体验\n" +
					"6、修复了一些已知的Bug，提升了系统的稳定性和安全性\n",
				tip15: "1、新增功能服务商 全新身份畅享权益\n" +
					"2、修复了已知的bug，改善使用体验\n" +
					"3、优化了多项细节，提升了性能\n",
				tip16: "1、新增语音对讲功能\n" +
					"2、修复了已知的bug，改善使用体验",
				tip17: "1、优化语音对讲功能\n" +
					"2、修复原来的问题，提升使用体验\n" +
					"3、多项细节优化",
				tip18: "1、新增语音对讲播放和分享功能\n" +
					"2、优化AI视觉馆功能\n" +
					"3、优化意见反馈入口 提升体验\n" +
					"4、修复以前的bug，提升易用性",
				tip19: "1、新增多模型对话功能\n" +
					"2、修复原有的问题\n" +
					"3、优化多项细节，提升产品体验",

				tip20: "1、首页视觉全新设计 让AI更懂你\n" +
					"2、新增语音合成功能 文本一键转语音！\n" +
					"3、优化多模型对话功能，提升体验\n" +
					"4、修复了以前的问题 优化使用",
				tip21: "1、修复了部分问题 优化使用",
				tip22: "1、新增AI百宝箱功能 让想象力成为创作力！\n" +
					"2、优化绘画页面\n" +
					"3、修复了若干bug，优化体验",
				tip23: "1、优化对话功能 沉浸式体验AI聊天\n" +
					"2、优化绘画功能 为您的创意提供多种选择\n" +
					"3、修改了若干问题 带给您更佳的使用体验",
				tip24: "1、完善了绘画功能的相关细节\n" +
					"2、优化了其他的一些bug，改善您的体验",
				tip25: "1、新增AI百宝箱功能种类，丰富趣味玩法\n" +
					"2、优化AI资讯分类，AI时事即时送达\n" +
					"3、提升了绘画的生图速度，专注您的效率\n" +
					"4、修复了以前的问题，优化体验",
				

			}
		},
		components: {

		},
		onLoad() {

		},
		onShow() {

		},
		methods: {

		}
	}
</script>

<style>
	page {
		background: #fff;
	}
</style>