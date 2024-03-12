<template>
	<view class="heads">
		<!-- 2.0.19支持autoBack，默认为false -->
		<u-navbar :title="title" :titleStyle="{'font-weight':'550', 'height': '100upx','font-size':'34upx'}" bgColor="#fff"
			:placeholder='true'>
			<view class="u-nav-slot" slot="left"></view>
		</u-navbar>

<!-- <u--text text="dakdhjkqwhiudasdaioudioqwudoiqudoqipduqodiquwqoip1233333333333333333333333333333333333333333333333"></u--text> -->
		<!-- <uni-nav-bar height="500rpx" title="自定义高度" /> -->

		<!-- <uni-nav-bar title="导航栏组件" height="100rpx"></uni-nav-bar> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// bgColor:require('@/static/images/title.jpg')
			}
		},
		props: {
			title: String
		},
		methods: {
			rightClick() {
				console.log('rightClick');
			},
			leftClick() {
				console.log('leftClick');
			}
		}
	}
</script>


<style lang="less" scoped>
	.heads {
		/* position: fixed; */
		/* background-color: #bfa; */
		/* background: transparent; */
		/* height: 516upx; */
		/* position: absolute; */
		/* width: 375px; */
	

		/deep/.u-navbar {
			// background-color: #bfa;
			// background-image: url("https://bkimg.cdn.bcebos.com/pic/eaf81a4c510fd9f9d72a2d09cd60c32a2834349b0e37");
			// background-size: 100%;
			// background-image: url("@/static/images/title.jpg");
			
			// background-size: 100% 100%;
		}
	}
	
</style>
