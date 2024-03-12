<template>
	<view class="recording-audio">
		<view style="position: relative;height:100%;width: 100%;">
			<view class="text_box" v-if="showText">
				<input class="search_input" type="text" confirm-type="search"
				v-model="searchText" 
				placeholder="请输入要搜索的关键词"
				@confirm="search"
				placeholder-style="font-size:28rpx;color:#999999;" />
				
				<scroll-view 
					:scroll-anchoring="true" 
					:scroll-y="true" :scroll-into-view="textScrollTarget"
					:style="{height:textPanelHeight+'px','min-height':'450rpx'}">
					<view
						class="item" 
						:id="'item'+index" 
						@click="seek(item.startTime/1000)" :key="index"
						v-for="(item, index) in textList"
						:style="item.role === rightRoleName ? 'display:flex;justify-content: flex-end' : ''">
						<view v-if="item.role === rightRoleName" style="display:flex;">
							<view
								:class="[item.role !== rightRoleName ? 'left' : 'right',textIndex === index ? 'highlight' : '']">
								<view>
									<text>{{ item.text }}</text>
								</view>
							</view>
							<view class="avatar_right">{{item.role}}</view>
						</view>
						<view v-else style="display:flex;">
							<view class="avatar_left">{{item.role}}</view>
							<view
								:class="[item.role !== rightRoleName ? 'left' : 'right',textIndex === index ? 'highlight' : '']">
								<view>
									<text>{{ item.text }}</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			
				<view class="search_result" v-if="showFoundWords">
					<view class="search_result_warpper">
						<button @click="prev" class="iconfont">
							&#xe601;
						</button>
						<view class="num">
							{{ searchReulst.curRow + 1 }} / {{ searchReulst.rows.length }}
						</view>
						<button @click="next" class="iconfont" style="transform: rotate(180deg);">
							&#xe601;
						</button>
					</view>
				</view>
			</view>
			<view class="audio">
				<view class="audio-wrapper">
					<view class="audio-number">{{format(current)}}</view>
					<slider class="audio-slider" step="1" :activeColor="color" block-size="16" :value="current"
						:max="duration" @changing="[status.seeking = true,current=$event.detail.value]" @change="seek($event.detail.value)"></slider>
					<view class="audio-number">{{format(duration)}}</view>
				</view>
				<view class="audio-control-wrapper iconfont" :style="{color}">
					<view class="audio-control audio-control-prev" @click="seek(current-5)"
						:style="{borderColor:color}">&#xe601;</view>
					<view class="audio-control audio-control-switch" :class="{audioLoading:(status.playing && status.waiting)}"
						:style="{borderColor:color}" @click="!status.playing?play():pausePlay()">
						{{status.playing && status.waiting?'&#xe600;':(!status.playing?'&#xe865;':'&#xe612;')}}</view>
					<view class="audio-control audio-control-next" @click="seek(current+5)"
						:style="{borderColor:color}">&#xe601;</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name:"gw-audiott",
		props: {
			src: String, //url
			startTime: { //播放起点
				type: Number,
				default: 0,
			},
			showText: { //是否显示对话
				type: Boolean,
				default: false
			},
			rightRole:{//显示在右边的对话的role 默认为第一条的role showText=true时生效
				type: String,
				require: false
			},
			list:{//文本集合 showText=true时生效
				type: Array,
				default () {
					// 如下 属性名可以通过fields映射
					// return [{
					// 	startTime: 111,
					// 	endTime: 222,
					// 	role: 'kefu',
					// 	text: '你好吗'
					// },
					// {
					// 	startTime: 333,
					// 	endTime: 444,
					// 	role: 'kehu',
					// 	text: '我很好'
					// }]
					return [];
				}
			},
			fields:{//属性映射 showText=true时生效
				type:Object,
				default () {
					return {
						startTime: 'startTime',
						endTime: 'endTime',
						role: 'role',
						text: 'text'
					}
				}
			},
			autoplay: { //是否自动播放
				type: Boolean,
				default: false
			}, //是否自动播放
			color: {
				type: String,
				default: '#1F64FF'
			}, //主色调
			debug:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isIOS:'',//手机系统
				audio: null,
				current: 0, //当前进度(s)
				duration: 0, //总时长(s)
				/**逻辑状态**/
				status:{
					playing:false,//只有点击控制面板和播放结束可修改此状态
					seeking: false, //是否处于拖动状态
					waiting: false, //等待加载数据
				},
				
				textPanelHeight: 0, //对话框高度
				textScrollTarget: null, //滚动到当前说话位置
				textList: [], //对话信息
				rightRoleName:'',//显示在右边的人
				textIndex: -1,//当前高亮的文本
		
				searchText: '',
				showFoundWords: false,
				searchReulst: {
					curRow: -1,
					rows: []
				},
			}
		},
		methods: {
			calcTextPosition() {
				if (this.status.seeking) {
					return;
				}
				if (!this.showText) {
					return;
				}
				if (!this.textList || this.textList.length <= 0) {
					return;
				}
				const curTime = new Date().getTime();
				if ((this.duration - this.current > 1) &&
					(this.lastCalcTime && curTime - this.lastCalcTime <= 300)) {
					return;
				}
				this.lastCalcTime = curTime;
				const that = this;
				const _current = parseInt((this.current * 1000).toFixed(0))
				const _duration = parseInt((this.duration * 1000).toFixed(0))
				const _len = this.textList.length;
				let result = -1;
				let nearest = -1;
				if (this.textIndex > -1) {
					for (let i = this.textIndex; i < _len; i++) {
						const item = this.textList[i];
						if (_current >= item.startTime && _current <= item.endTime) { //符合时间区
							result = i;
							break;
						}
						if (_current < item.startTime && _current < item.endTime) {
							break;
						}
					}
				}
				if (result < 0) {
					for (let i = 0; i < _len; i++) {
						const item = this.textList[i];
						if (_current >= item.startTime && _current <= item.endTime) { //符合时间区
							result = i;
							break;
						}
						if (_current <= item.startTime) {
							nearest = (i > 0 ? i - 1 : i);
							break;
						}
					}
				}
				if (result < 0 && nearest > -1) {
					result = nearest;
				}
				if (result > -1 && result !== this.textIndex) { //不要改变这个代码的顺序
					this.textScrollTarget = 'item' + result;
				}
				if (result > -1) {
					this.textIndex = result;
				}
			},
			seek(value){
				if(value<=0){
					value=0
				}
				if(value>=this.duration){
					value=this.duration;
				}
				this.debug && console.log('调用Seek，当前audio状态='+this.audio.paused+',value='+value);
				this.status.afterseek=true;
				this.status.seeking = true;
				this.status.playing=true;
				this.current = value;
				if(!this.audio.paused){//暂停事件里调用this.audio.seek
					this.audio.pause()
				}else{//已经是停止状态 必须先播放后再调用this.seek
					this.status.afterseek=true;
					if(!this.status.waiting){
						this.play();
						this.audio.obeyMuteSwitch = false;
					}
				}
			},
			//点击播放按钮
			play() {
				this.debug && console.log('调用播放，当前audio状态='+this.audio.paused);
				console.log(this.audio.duration,5555555555)
				this.status.playing=true;
				if(this.audio.paused){
					if(this.isIOS){
						console.log('开始播放123')
						this.audio.play();
						this.audio.obeyMuteSwitch = false;
					}else{
						console.log('开始播放')
						this.audio.play();
						this.audio.obeyMuteSwitch = false;
						//兼容
						this.audio.autoplay = true;
					}
				}
			},
			pausePlay(){
				this.debug && console.log('调用暂停，当前audio状态='+this.audio.paused);
				this.status.playing=false;
				if(!this.audio.paused){
					if(this.isIOS){
						this.audio.pause();
					}else{
						this.audio.pause();
						//兼容
						this.audio.autoplay = false;
					}
				}
			},
			prev() {
				if (this.searchReulst.curRow <= 0) {
					this.showFoundWords = false;
					this.searchReulst = {
						curRow: -1,
						rows: []
					}
					return;
				}
				if (this.searchReulst.rows.length <= 0) {
					this.showFoundWords = false;
					this.searchReulst = {
						curRow: -1,
						rows: []
					}
					return;
				}
				const index = this.searchReulst.curRow - 1;
				this.searchReulst.curRow = index;
				this.seek(this.textList[this.searchReulst.rows[index].row].startTime/1000);
			},
			next() {
				if (this.searchReulst.curRow >= this.searchReulst.rows.length) {
					this.showFoundWords = false;
					this.searchReulst = {
						curRow: -1,
						rows: []
					}
					return;
				}
				if (this.searchReulst.rows.length <= 0) {
					this.showFoundWords = false;
					this.searchReulst = {
						curRow: -1,
						rows: []
					}
					return;
				}
				const index = this.searchReulst.curRow + 1;
				if (index >= this.searchReulst.rows.length) {
					this.showFoundWords = false;
					this.searchReulst = {
						curRow: -1,
						rows: []
					}
					return;
				}
				this.searchReulst.curRow = index;
				this.seek(this.textList[this.searchReulst.rows[index].row].startTime/1000);
			},
			search() {
				this.showFoundWords = false
				let result = [];
				this.textList.forEach(v => {
					v.__FF__ = [{
						value: [],
						indexList: []
					}];
				});
				if (!this.searchText) {
					return (this.searchReulst = {
						curRow: -1,
						rows: []
					});
				}
				this.textList.forEach((v, i) => {
					if (v.text.includes(this.searchText)) {
						let b = [...v.text.matchAll(new RegExp(this.searchText, 'ig'))];
						b.forEach(v => {
							let length = v[0].length;
							let start = v.index;
							v.index = [];
							for (let i = start; i < start + length; i++) {
								v.index.push(i);
							}
						});
						let indexs = [];
						b.map(v => v.index).forEach(v => {
							v.forEach(o => indexs.push(o));
						});
						result.push({
							row: i,
							value: b,
							indexList: indexs
						});
					}
				});
				if (result.length > 0) {
					this.showFoundWords = true
					this.searchReulst = {
						curRow: -1,
						rows: result
					};
					this.next()
				} else {
					this.showFoundWords = false
					this.searchReulst = {
						curRow: -1,
						rows: []
					}
				}
				console.log(result, '搜索结果');
				this.textList.forEach((v, i) => {
					result.forEach(o => {
						if (i == o.row) {
							v.__FF__ = o;
						}
					});
				});
			},
			mappedFields(){
				this.textScrollTarget=null; //滚动到当前说话位置
				this.textList=[];//对话信息
				this.textIndex=-1;//当前高亮的文本
				this.searchText=''
				this.showFoundWords=false
				this.searchReulst={curRow: -1,rows: []}
				this.rightRoleName=this.rightRole;
				if(!this.showText){
					return;
				}
				if(this.list.length<=0){
					return;
				}
				if(this.rightRoleName==null){//默认取第一条
					this.rightRoleName=this.list[0][this.fields.role || 'role']||'';
				}
				this.list.forEach(v => {
					this.textList.push({
						startTime: parseInt(v[this.fields.startTime || 'startTime'] || '0'),
						endTime: parseInt(v[this.fields.endTime || 'endTime'] || '0'),
						role: v[this.fields.role || 'role'] || '',
						text: v[this.fields.text || 'text']|| ''
					});
				});
			},
			init(){
				if(this.audio){
					this.audio.destroy();
				}
				this.resetStatus();
				this.audio = uni.createInnerAudioContext();
				this.audio.obeyMuteSwitch = false;
				this.audio.startTime=this.startTime;
				this.audio.autoplay=this.autoplay;
				this.duration=0;
				this.mappedFields();
				this.audio.src=this.src;
				// console.log(this.audio.src,54895)
				if(this.autoplay){
					this.status.playing=true;
				}
				//音频进度更新事件
				this.audio.onTimeUpdate(() => {
					if (!this.duration) {
						this.duration = this.audio.duration
					}
					if (!this.status.seeking) {
						this.current = this.audio.currentTime
						this.calcTextPosition()
						this.$emit('current',this.current);
					}
				})
				//音频播放事件
				this.audio.onPlay(() => {
					this.debug && console.log('开始播放,当前播放器状态='+this.audio.paused);
					// console.log(this.audio.duration,55555555)
					this.status.waiting = false;
					if(this.status.seeking && this.status.afterseek){
						this.status.afterseek=false;
						this.seek(this.current);
					}else{
						this.status.seeking=false;
						this.status.afterseek=false;
					}
				})
				//音频暂停事件
				this.audio.onPause(() => {
					this.debug && console.log('暂停播放,当前播放器状态='+this.audio.paused);
					
					//seek必须要在暂停播放后调用 否则没效果
					if(this.status.seeking && this.status.playing){
						this.audio.seek(this.current);
					}else{
						this.status.seeking=false;
						this.status.afterseek=false;
					}
				})
				this.audio.onStop(() => {
					this.debug && console.log('停止播放,当前播放器状态='+this.audio.paused);
				})
				//音频等待
				this.audio.onWaiting(() => {
					this.debug && console.log('等待音频数据,当前播放器状态='+this.audio.paused)
					this.status.waiting = true;
					if(!this.audio.paused){
						this.audio.pause()
					}
				})
				this.audio.onCanplay((res) => {
					this.debug && console.log('数据准备就绪,当前播放器状态='+this.audio.paused)
					this.status.waiting = false;
					if(this.status.playing && !this.status.seeking && !this.status.afterseek) {
						this.play()
						this.audio.obeyMuteSwitch = false;
					}
				})
				
				//音频完成更改进度事件
				this.audio.onSeeked(() => {
					if(this.status.seeking){//这个事件触发可能不对 自己控制下
						this.debug && console.log('Seeked,当前播放器状态='+this.audio.paused)
						this.status.seeking = false
						if(this.status.playing && !this.status.waiting){
							this.play()
							this.audio.obeyMuteSwitch = false;
						}
					}
				})
				
				//音频结束事件
				this.audio.onEnded(() => {
					this.debug && console.log('播放结束,当前播放器状态='+this.audio.paused)
					this.resetStatus();
					this.$emit('end');
				})
				
				this.audio.onError((err) => {
					this.debug && console.log('播放出错,当前播放器状态='+this.audio.paused)
					this.debug && console.error(err)
					this.pausePlay();
					this.resetStatus();
					this.$emit('error',err);
				})
			},
			resetStatus(){
				this.status.playing = false;
				this.status.seeking=false;
				this.status.waiting = false;
				this.current = 0;
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 -
					String(Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
		},
		created() {
			const that=this;
			uni.getSystemInfo({
				success(res) {
					that.isIOS=(res.system || '').startsWith('iOS')
				}
			});
			this.init();
		},
		beforeDestroy() {
			this.audio.destroy()
		},
		watch: {
			src(src, old) {
				console.log('改变了')
				this.init();
			},
			list(list, old) {
				this.init();
			},
		},
		mounted() {
			//计算内容高度
			if (!this.showText) {
				return;
			}
			const that = this;
			this.$nextTick(function() {
				const query = uni.createSelectorQuery().in(that);
				query.select('.recording-audio').boundingClientRect()
					.exec(res1 => {
						if (res1) {
							query.select('.audio').boundingClientRect()
								.exec(res2 => {
									if (res2) {
										query.select('.search_input')
											.boundingClientRect()
											.exec(res3 => {
												if (res3) {
													that.textPanelHeight = res3[0].height - res3[1]
														.height - res3[2].height
												}
											})
									}
								})
						}
					})
			})
		},
	}
</script>

<style lang="less" scoped>
	@font-face {
		font-family: 'icon';
		src: url('//at.alicdn.com/t/font_1104838_fxzimc34xw.eot');
		src: url('//at.alicdn.com/t/font_1104838_fxzimc34xw.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.woff') format('woff'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.svg#iconfont') format('svg');
	}
	.recording-audio{
		height: 100%;
		width: 100%;
	}
	.audio {
		width: 100%;
		padding: 30upx 0;
		background: #fff;
		margin-top: 2px;
	}
	.audio-wrapper {
		display: flex;
		align-items: center;
	}
	.audio-number {
		width: 120upx;
		font-size: 24upx;
		line-height: 1;
		color: #333;
		text-align: center;
	}
	.audio-slider {
		flex: 1;
		margin: 0;
	}
	.iconfont{
		font-family: "icon" !important;
	}
	.audio-control-wrapper {
		margin-top: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.audio-control {
		font-size: 32upx;
		line-height: 1;
		border: 4upx solid;
		border-radius: 50%;
		padding: 16upx;
	}
	.audio-control-next {
		transform: rotate(180deg);
	}
	.audio-control-switch {
		font-size: 40upx;
		margin: 0 100upx;
	}
	.audioLoading {
		animation: loading 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
	@keyframes loading {
		to {
			transform: rotate(360deg);
		}
	}

	.text_box {
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	.search_input {
		margin: 20upx 0;
		padding: 0 20upx;
		width:100%;
		height: 70upx;
		border-radius: 10upx;
		color: #8c8c8c;
		background-color: #edeeef;
	}
	
	.item {
		overflow: hidden;
		display: flex;
		margin: 10upx 20upx;
		
		.left,
		.right {
			flex: 1;
		}

		.left {
			float: left;
			padding: 20upx 20upx;
			background-color: #0299f9;
			color: #FFFFFF;
			border-radius: 10upx;
		}

		.right {
			float: right;
			padding: 20upx 20upx;
			background-color: #f8f0d7;
			color: #666666;
			border-radius: 10upx;
		}
		.avatar_right {
			width: 85upx;
			height: 85upx;
			background-color: #fae4b8;
			color: #bf7900;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			margin-left: 20upx;
			overflow: hidden;
		}

		.avatar_left {
			width: 85upx;
			height: 85upx;
			background-color: #027cfe;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			margin-right: 20upx;
			overflow: hidden;
		}
		
		.highlight {
			color: red;
		}
	}

	.search_result {
		width: 100%;
		height: auto;
		position: absolute;
		left:0;
		bottom: 30rpx;
		
		display: flex;
		align-items: center;
		justify-content: center;
		
		.search_result_warpper {
			width: 45%;
			height: 80upx;
			background-color: #545454;
			border-radius: 100upx;
			box-sizing: border-box;
			padding: 14upx;
			display: flex;
		
			button {
				width: 52upx;
				height: 52upx;
				background-color: #67686a;
				color: #d9d8dc;
				border-radius: 100upx;
				padding: 0;
				line-height: 52upx;
				display: flex;
				align-items: center;
				justify-content: center;
		
				&::after {
					content: " ";
					border: 0;
					border-radius: 100upx;
				}
			}
		}
		
		.num {
			flex: 1;
			height: 52upx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #d9d8dc;
		}
	}
</style>