<template>
	<view style="background: #F5F7FA">
		<view class="top_cont" :style="backImg">
			<view class="top_text">
				<view class="title_li">我是企业AI定制管理师</view>
				<view class="title_text">用AI驱动企业发展，提高人效，企业级AI工作台系统，
					内置营销，创作绘画等各类AI应用，是企业提高效率、降本增效的利器
				</view>
			</view>
		</view>
		<!-- 内容 -->
		<view class="chat_cont chatTop">
			
			<view class="cont_li">
				<view class="tabs">
					<view class="tabs_index" @click="changeTab(1)">
						<view :class="[current == 1 ? 'index_title_active' : 'index_title']">1</view>
						<view :class="[current == 1 ? 'index_text_active' : 'index_text']">填写企业</view>
						<view :class="[current == 1 ? 'index_text_active' : 'index_text']">信息</view>
					</view>
					<view class="tabs_line" :class="[current == 2? 'tabs_line_active' : 'tabs_line']"></view>
					<view class="tabs_index" @click="changeTab(2)">
						<view :class="[current == 2? 'index_title_active' : 'index_title']">2</view>
						<view :class="[current == 2? 'index_text_active' : 'index_text']">填写项目</view>
						<view :class="[current == 2? 'index_text_active' : 'index_text']">或产品信息</view>
					</view>
					<view class="tabs_line" :class="[current == 3? 'tabs_line_active' : 'tabs_line']"></view>
					<view class="tabs_index" @click="changeTab(3)">
						<view :class="[current == 3 ? 'index_title_active' : 'index_title']">3</view>
						<view :class="[current == 3 ? 'index_text_active' : 'index_text']">填写资讯</view>
						<view :class="[current == 3 ? 'index_text_active' : 'index_text']">信息</view>
					</view>
					<view class="tabs_line" :class="[current == 4? 'tabs_line_active' : 'tabs_line']"></view>
					<view class="tabs_index" @click="changeTab(4)">
						<view :class="[current == 4 ? 'index_title_active' : 'index_title']">4</view>
						<view :class="[current == 4 ? 'index_text_active' : 'index_text']">填写企业</view>
						<view :class="[current == 4 ? 'index_text_active' : 'index_text']">专属知识库</view>
					</view>
				</view>
	<!-- ------------------第一步----------------------- -->
				<view  v-if="current == 1">
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_l">*</text>
							<text class="text_r">公司名称</text>
						</view>
						<u--input placeholder="请输入公司名称"  border="surround" maxlength="50" v-model="companyName"></u--input>
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_l"></text>
							<text class="text_r">公司简称</text>
						</view>
						<u--input placeholder="请输入公司简称" border="surround" maxlength="20" v-model="sortName"></u--input>
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_l"></text>
							<text class="text_r">职位</text>
						</view>
						<u--input placeholder="请输入职位" border="surround" maxlength="20" v-model="job"></u--input>
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_l"></text>
							<text class="text_r">行业</text>
						</view>
						<view class="lists" @click="openIndustry">
							<view class="txt">{{ industryValue }}</view>
							<u-icon name="arrow-down" color="#666" size="16"></u-icon>
						</view>
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_l"></text>
							<text class="text_r">注册地址</text>
						</view>
						<u--input placeholder="请输入所属的注册地址" border="surround" v-model="registeredAddress"></u--input>
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_r">公司描述</text>
						</view>
						<u-textarea v-model="companyDesc" placeholder="请描述下公司发展阶段500字内" maxlength="500" ></u-textarea>
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_r">企业网址</text>
						</view>
						<u--input placeholder="请输入企业网址" border="surround" v-model="companyWebsite"></u--input>
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_r">ICP备案号</text>
						</view>
						<u--input placeholder="请输入ICP备案号" border="surround" v-model="companyIcp"></u--input>
					</view>
					
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_r">小程序二维码</text>
						</view>
						<view class="qs_img">
							<view v-for="(val, index) in wxImg" :key="index" style="position: relative;">
								<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
								<img class="del_img" :src="delImg" alt="" @click="wxImg.splice(index,1)"/>
							</view>
							<img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(1,1)" v-if="wxImg.length == 0"/>
						</view>
						<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
						
					</view>
					
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_r">公众号二维码</text>
						</view>
						<view class="qs_img">
							<view v-for="(val, index) in gzhImg" :key="index" style="position: relative;">
								<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
								<img class="del_img" :src="delImg" alt="" @click="gzhImg.splice(index,1)"/>
							</view>
							<img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(2,1)" v-if="gzhImg.length == 0"/>
						</view>
						<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
						
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_r">公司logo</text>
						</view>
						<view class="qs_img">
							<view v-for="(val, index) in logoImg" :key="index" style="position: relative;">
								<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
								<img class="del_img" :src="delImg" alt="" @click="logoImg.splice(index,1)"/>
							</view>
							<img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(3,1)" v-if="logoImg.length == 0"/>
						</view>
						<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_r">公司图片</text>
						</view>
						<view class="qs_img">
							<view v-for="(val, index) in companyImg" :key="index" style='position: relative;'>
								<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
								<img class="del_img" :src="delImg" alt="" @click="companyImg.splice(index,1)"/>
							</view>
							<img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(4,1)" v-if="companyImg.length < 10"/>
						</view>
						<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
					</view>
					
					<view class="cont_title">
						<view class="title_li">
							<text class="title_l"></text>
							<text class="title_r">联系方式</text>
						</view>
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_l"></text>
							<text class="text_r">联系电话</text>
						</view>
						<u--input placeholder="请输入联系电话" border="surround" v-model="companyPhone"></u--input>
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_l"></text>
							<text class="text_r">联系邮箱</text>
						</view>
						<u--input placeholder="请输入联系邮箱" border="surround" v-model="companyEmail"></u--input>
					</view>
					
					<view class="chat_text">
						<view class="text_cont">
							<text class="text_l"></text>
							<text class="text_r">公司地址</text>
						</view>
						<u--input placeholder="请输入公司地址" border="surround" v-model="companyAddress"></u--input>
					</view>
					
					<view class="cont_title">
						<view class="title_li">
							<text class="title_l"></text>
							<text class="title_r">资料文件</text>
						</view>
					</view>
					
					<view class="chat_text">
						<view class="text_conts">
							<text class="text_r">文档</text>
							<view class="text_u" @click="uploadFile(1)" v-if="fileList.length < 10">
								<text class="u_li">上传文档</text>
								<image class="right_img" src='@/static/images/right.png' />
							</view>
						</view>
						<view class="qs_img" style="border-top: 1upx solid #E8E9EB;" v-if="fileList.length > 0">
							<view v-for="(val, index) in fileList" :key="index" class="file_li">
								<view class="li_text">
									<view class="li_ul">
										<img class="l_img" :src="leftImg" alt=""/>
										<view class="file_text">
											<text class="file_url">{{ val.file_name }}</text>
										</view>
									</view>
									<u-icon name="trash" size="20" @click="fileList.splice(index,1)"></u-icon>
								</view>
							</view>
							
						</view>
						<view class="img_text">文件资料上传可包含，DOC、XISX、PPT、TXT文件</view>
						
					</view>
					
					<view class="chat_text">
						<view class="text_conts">
							<text class="text_r">图片</text>
							<view class="text_u" @click="uploadImg(5,1)" v-if="fileImg.length < 10">
								<text class="u_li">上传图片</text>
								<image class="right_img" src='@/static/images/right.png' />
							</view>
						</view>
						<view class="qs_img" v-if="fileImg.length > 0">
							<view v-for="(val, index) in fileImg" :key="index" style="position: relative;">
								<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
								<img class="del_img" :src="delImg" alt="" @click="fileImg.splice(index,1)"/>
							</view>
							<!-- <img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(2)" v-if="fileImg.length < 10"/> -->
						</view>
						<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
						
					</view>
					
					<view class="chat_text">
						<view class="text_conts">
							<text class="text_r">视频</text>
							<view class="text_u" @click="uploadVideo(1)" v-if="vidioList.length < 10">
								<text class="u_li">上传视频</text>
								<image class="right_img" src='@/static/images/right.png' />
							</view>
						</view>
						<view class="qs_img" v-if="vidioList.length > 0">
							<view v-for="(val, index) in vidioList" :key="index" style="position: relative;">
								<video :src="getImgUrl(val.file_url)" class="up_img"></video>
								<img class="del_img" :src="delImg" alt="" @click="vidioList.splice(index,1)"/>
							</view>
							<!-- <img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(3)" v-if="vidioList.length < 10"/> -->
						</view>
						<view class="img_text">文件资料上传可包含，FLV、RMVB、MP4、MVB文件</view>
					</view>
					
					<view class="chat_text">
						<view class="text_conts">
							<text class="text_r">网址</text>
							<view class="text_u" @click="addCompanyWebsite" v-if="company_website.length < 10">
								<image class="add_img" :src='addImg'/>
								<text class="add_li">添加</text>
							</view>
						</view>
						<view v-for="(item, index) in company_website" :key="index">
							<view style="margin-top: 10upx; display: flex;">
								<u--input placeholder="请输入网址" border="surround" v-model="item.file_url"></u--input>
								<u-icon name="trash" size="20" v-if="index > 0" @click="company_website.splice(index,1)"></u-icon>
							</view>
							
						</view>
						
					</view>
				</view>
	<!-- ------------------第二步----------------------- -->
				<view v-if="current == 2">
					<view  v-for="(item, tip) in project_list" :key="tip">
						<!-- <view class="current_title">产品{{ tip+1 }}</view> -->
						<view class="cont_title">
							<view class="title_li">
								<text class="title_l"></text>
								<text class="title_r">产品{{ tip+1 }}</text>
							</view>
							<u-icon name="trash" size="20" v-if="tip > 0" @click="project_list.splice(tip,1)"></u-icon>
						</view>
						<view class="chat_text">
							<view class="text_cont">
								<text class="text_r">类目名称</text>
							</view>
							<u--input placeholder="用于对产品进行分类和归类" border="surround" maxlength="10" v-model="item.category_name"></u--input>
						</view>
						
						<view class="chat_text">
							<view class="text_cont">
								<text class="text_l">*</text>
								<text class="text_r">项目或产品名称</text>
							</view>
							<u--input placeholder="请输入项目或产品名称" border="surround" maxlength="50" v-model="item.project_name"></u--input>
						</view>
						
						<view class="chat_text">
							<view class="text_cont">
								<text class="text_l">*</text>
								<text class="text_r">产品简介</text>
							</view>
							<u-textarea v-model="item.brief_introduction" placeholder="请用描述您的产品或项目(100字内)。尽力简洁有力" maxlength="100" ></u-textarea>
						</view>
						
						<view class="chat_text">
							<view class="text_cont">
								<text class="text_r">产品图片</text>
							</view>
							<view class="qs_img">
								<view v-for="(val, index) in item.project_image_list" :key="index" style="position: relative;">
									<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
									<img class="del_img" :src="delImg" alt="" @click="project_list[tip].project_image_list.splice(index,1)"/>
								</view>
								<img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(1, tip)" v-if="item.project_image_list.length < 10"/>
							</view>
							<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
						</view>
						
						<view class="cont_title">
							<view class="title_li">
								<text class="title_l"></text>
								<text class="title_r">资料文件</text>
							</view>
						</view>
						
						<view class="chat_text">
							<view class="text_conts">
								<text class="text_r">文档</text>
								<view class="text_u" @click="uploadFile(tip)" v-if="item.file_list.length < 10">
									<text class="u_li">上传文档</text>
									<image class="right_img" src='@/static/images/right.png' />
								</view>
							</view>
							<view class="qs_img" style="border-top: 1upx solid #E8E9EB;" v-if="item.file_list.length > 0">
								<view v-for="(val, index) in item.file_list" :key="index" class="file_li">
									<view class="li_text">
										<view class="li_ul">
											<img class="l_img" :src="leftImg" alt=""/>
											<view class="file_text">
												<text class="file_url">{{ val.file_name }}</text>
											</view>
										</view>
										<u-icon name="trash" size="20" @click="project_list[tip].file_list.splice(index,1)"></u-icon>
									</view>
								</view>
								
							</view>
							<view class="img_text">文件资料上传可包含，DOC、XISX、PPT、TXT文件</view>
							
						</view>
						
						<view class="chat_text">
							<view class="text_conts">
								<text class="text_r">图片</text>
								<view class="text_u" @click="uploadImg(2, tip)" v-if="item.image_list.length < 10">
									<text class="u_li">上传图片</text>
									<image class="right_img" src='@/static/images/right.png' />
								</view>
							</view>
							<view class="qs_img" v-if="item.image_list.length > 0">
								<view v-for="(val, index) in item.image_list" :key="index" style="position: relative;">
									<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
									<img class="del_img" :src="delImg" alt="" @click="project_list[tip].image_list.splice(index,1)"/>
								</view>
								<!-- <img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(2)" v-if="fileImg.length < 10"/> -->
							</view>
							<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
							
						</view>
						
						<view class="chat_text">
							<view class="text_conts">
								<text class="text_r">视频</text>
								<view class="text_u" @click="uploadVideo(tip)" v-if="item.vlog_list.length < 10">
									<text class="u_li">上传视频</text>
									<image class="right_img" src='@/static/images/right.png' />
								</view>
							</view>
							<view class="qs_img" v-if="item.vlog_list.length > 0">
								<view v-for="(val, index) in item.vlog_list" :key="index" style="position: relative;">
									<video :src="getImgUrl(val.file_url)" class="up_img"></video>
									<img class="del_img" :src="delImg" alt="" @click="project_list[tip].vlog_list.splice(index,1)"/>
								</view>
								<!-- <img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(3)" v-if="vidioList.length < 10"/> -->
							</view>
							<view class="img_text">文件资料上传可包含，FLV、RMVB、MP4、MVB文件</view>
							
						</view>
						
						<view class="chat_text">
							<view class="text_conts">
								<text class="text_r">产品网址</text>
								<view class="text_u" @click="addWebsite(tip)" v-if="item.website_list.length < 10">
									<image class="add_img" :src='addImg'/>
									<text class="add_li">添加</text>
								</view>
							</view>
							<view v-for="(res, index) in item.website_list" :key="index">
								<view style="margin-top: 10upx; display: flex;">
									<u--input placeholder="请输入网址" border="surround" v-model="res.file_url"></u--input>
									<u-icon name="trash" size="20" v-if="index > 0" @click="project_list[tip].website_list.splice(index,1)"></u-icon>
								</view>
								
							</view>
							
						</view>
						
					</view>
					
					<view class="add_btn">
						<view class="btn_cont" @click="addProduct">
							<image class="add_img" :src='addImg' />
							<text class="add_text">新增产品</text>
						</view>
					</view>
				</view>	
						
	<!-- ------------------第三步----------------------- -->
				<view v-if="current == 3">
					<view class="chat_text">
						<!-- <view class="text_cont">
							<text class="text_r">咨询名称</text>
						</view> -->
						<view class="text_tip">支持以下模块：资讯信息/活动信息/案例信息/新闻信息/服务项目/工程项目</view>
					</view>
					<view  v-for="(item, tip) in info" :key="tip">
						
						<view class="cont_title">
							<view class="title_li">
								<text class="title_l"></text>
								<text class="title_r">资讯{{ tip+1 }}</text>
							</view>
							<u-icon name="trash" size="20" v-if="tip > 0" @click="info.splice(tip,1)"></u-icon>
						</view>
						
						<view class="chat_text">
							<view class="text_cont">
								<text class="text_l"></text>
								<text class="text_r">资讯模块</text>
							</view>
							<view class="lists" @click="openInfo(tip)">
								<view class="txt" v-if="item.label != ''" >{{ item.label }}</view>
								<view class="txt" v-else>请选择资讯模块</view>
								<u-icon name="arrow-down" color="#666" size="16"></u-icon>
							</view>
						</view>
						
						<view class="chat_text">
							<view class="text_cont">
								<text class="text_l">*</text>
								<text class="text_r">资讯名称</text>
							</view>
							<u--input placeholder="请输入资讯名称(20字内)" border="surround" maxlength="20" v-model="item.information_name"></u--input>
						</view>
						
						<view class="chat_text">
							<view class="text_cont">
								<text class="text_l">*</text>
								<text class="text_r">描述内容</text>
							</view>
							<u-textarea v-model="item.content_desc" placeholder="请用描述下您的内容(500字内)" maxlength="500" ></u-textarea>
						</view>
						
						<view class="chat_text">
							<view class="text_cont">
								<text class="text_r">资讯图片</text>
							</view>
							<view class="qs_img">
								<view v-for="(val, index) in item.information_image_list" :key="index" style="position: relative;">
									<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
									<img class="del_img" :src="delImg" alt="" @click="info[tip].information_image_list.splice(index,1)"/>
								</view>
								<img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(1,tip)" v-if="item.information_image_list.length < 10"/>
							</view>
							<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
						</view>
						
						<view class="cont_title">
							<view class="title_li">
								<text class="title_l"></text>
								<text class="title_r">资料文件</text>
							</view>
						</view>
						
						<view class="chat_text">
							<view class="text_conts">
								<text class="text_r">文档</text>
								<view class="text_u" @click="uploadFile(tip)" v-if="item.file_list.length < 10">
									<text class="u_li">上传文档</text>
									<image class="right_img" src='@/static/images/right.png' />
								</view>
							</view>
							<view class="qs_img" style="border-top: 1upx solid #E8E9EB;" v-if="item.file_list.length > 0">
								<view v-for="(val, index) in item.file_list" :key="index" class="file_li">
									<view class="li_text">
										<view class="li_ul">
											<img class="l_img" :src="leftImg" alt=""/>
											<view class="file_text">
												<text class="file_url">{{ val.file_name }}</text>
											</view>
										</view>
										<u-icon name="trash" size="20" @click="info[tip].file_list.splice(index,1)"></u-icon>
									</view>
								</view>
								
							</view>
							<view class="img_text">文件资料上传可包含，DOC、XISX、PPT、TXT文件</view>
							
						</view>
						
						<view class="chat_text">
							<view class="text_conts">
								<text class="text_r">图片</text>
								<view class="text_u" @click="uploadImg(2,tip)" v-if="item.image_list.length < 10">
									<text class="u_li">上传图片</text>
									<image class="right_img" src='@/static/images/right.png' />
								</view>
							</view>
							<view class="qs_img" v-if="item.image_list.length > 0">
								<view v-for="(val, index) in item.image_list" :key="index" style="position: relative;">
									<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
									<img class="del_img" :src="delImg" alt="" @click="info[tip].image_list.splice(index,1)"/>
								</view>
								<!-- <img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(2)" v-if="fileImg.length < 10"/> -->
							</view>
							<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
							
						</view>
						
						<view class="chat_text">
							<view class="text_conts">
								<text class="text_r">视频</text>
								<view class="text_u" @click="uploadVideo(tip)" v-if="item.vlog_list.length < 10">
									<text class="u_li">上传视频</text>
									<image class="right_img" src='@/static/images/right.png' />
								</view>
							</view>
							<view class="qs_img" v-if="item.vlog_list.length > 0" style="position: relative;">
								<view v-for="(val, index) in item.vlog_list" :key="index">
									<video :src="getImgUrl(val.file_url)" class="up_img"></video>
									<img class="del_img" :src="delImg" alt="" @click="info[tip].vlog_list.splice(index,1)"/>
								</view>
								<!-- <img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(3)" v-if="vidioList.length < 10"/> -->
							</view>
							<view class="img_text">文件资料上传可包含，FLV、RMVB、MP4、MVB文件</view>
							
						</view>
						
						<view class="chat_text">
							<view class="text_conts">
								<text class="text_r">资讯网址</text>
								<view class="text_u" @click="addInfoWebsite(tip)"  v-if="item.website_list.length < 10">
									<image class="add_img" :src='addImg'/>
									<text class="add_li">添加</text>
								</view>
							</view>
							<view v-for="(res, index) in item.website_list" :key="index">
								<view style="margin-top: 10upx; display: flex;">
									<u--input placeholder="请输入网址" border="surround" v-model="res.file_url"></u--input>
									<u-icon name="trash" size="20" v-if="index > 0" @click="info[tip].website_list.splice(index,1)"></u-icon>
								</view>
								
								
							</view>
							
						</view>
						
						<u-picker :show="item.infoShow" v-model="item.label" :columns="infoList" keyName="label" @cancel="closePick(tip)" @confirm="pickSelect"></u-picker>
					</view>
					
					<view class="add_btn">
						<view class="btn_cont" @click="addInfo">
							<image class="add_img" :src='addImg' />
							<text class="add_text">新增资讯</text>
						</view>
					</view>
					
				</view>	
	<!-- ------------------第四步----------------------- -->
				<view v-if="current == 4">
					<view v-for="(item, tip) in knowInfo" :key="tip">
						
						<view class="cont_title">
							<view class="title_li">
								<text class="title_l"></text>
								<text class="title_r">知识库{{ tip+1 }}</text>
							</view>
							<u-icon name="trash" size="20" v-if="tip > 0" @click="knowInfo.splice(tip,1)"></u-icon>
						</view>
						<view class="chat_text">
							<view class="text_cont">
								<text class="text_l">*</text>
								<text class="text_r">知识库名称</text>
							</view>
							<u--input placeholder="请输入名称(10字内)" border="surround" maxlength="10" v-model="item.title"></u--input>
						</view>
						
						<view class="chat_text">
							<view class="text_cont">
								<text class="text_l">*</text>
								<text class="text_r">类型</text>
							</view>
							<view class="cont_tab">

								<view v-for="(val, index) in typeList" :key="index" :class="[item.typeIndex == index ? 'tab_active' : 'tab_li']" @click="selectType(index, tip)">{{ val.label }}</view>
								
								<view class="tab_add" @click="addType">添加</view>
							</view>
						</view>
						
						<view class="chat_text">
							<view class="text_cont">
								<!-- <text class="text_l">*</text> -->
								<text class="text_r">描述内容</text>
							</view>
							<u-textarea v-model="item.content_desc" placeholder="请用描述下您的内容(500字内)" maxlength="500" ></u-textarea>
						</view>
						
						<view class="chat_text">
							<view class="text_cont">
								<text class="text_r">用途</text>
							</view>
							<u-textarea v-model="item.purpose" placeholder="例如：需要达到什么目的或效果(500字内）" maxlength="500" ></u-textarea>
						</view>
						
						<view class="cont_title">
							<view class="title_li">
								<text class="title_l"></text>
								<text class="title_r">资料文件</text>
							</view>
						</view>
						
						<view class="chat_text">
							<view class="text_conts">
								<text class="text_r">文档</text>
								<view class="text_u" @click="uploadFile(tip)" v-if="item.file_list.length < 10">
									<text class="u_li">上传文档</text>
									<image class="right_img" src='@/static/images/right.png' />
								</view>
							</view>
							<view class="qs_img" style="border-top: 1upx solid #E8E9EB;" v-if="item.file_list.length > 0">
								<view v-for="(val, index) in item.file_list" :key="index" class="file_li">
									<view class="li_text">
										<view class="li_ul">
											<img class="l_img" :src="leftImg" alt=""/>
											<view class="file_text">
												<text class="file_url">{{ val.file_name }}</text>
											</view>
										</view>
										<u-icon name="trash" size="20" @click="knowInfo[tip].file_list.splice(index,1)"></u-icon>
									</view>
								</view>
								
							</view>
							<view class="img_text">文件资料可上传docx,doc,ppt,pptx, xlsx, xlx,txt,md,pdf文件</view>
							
						</view>
						
						<view class="chat_text">
							<view class="text_conts">
								<text class="text_r">图片</text>
								<view class="text_u" @click="uploadImg(1, tip)" v-if="item.image_list.length < 10">
									<text class="u_li">上传图片</text>
									<image class="right_img" src='@/static/images/right.png' />
								</view>
							</view>
							<view class="qs_img" v-if="item.image_list.length > 0">
								<view v-for="(val, index) in item.image_list" :key="index" style="position: relative;">
									<img class="up_img" :src="getImgUrl(val.file_url)" alt=""/>
									<img class="del_img" :src="delImg" alt="" @click="item.image_list.splice(index,1)"/>
								</view>
								<!-- <img class="up_img" src="@/static/user/upload.png" mode="aspectFit" @click="uploadImg(2)" v-if="fileImg.length < 10"/> -->
							</view>
							<view class="img_text">请上传jpg/png文件，文件大小不超过5MB，尽量为正方形</view>
							
						</view>
						
						<!-- <view class="chat_text">
							<view class="text_conts">
								<text class="text_r">视频</text>
								<view class="text_u" @click="uploadVideo(tip)" v-if="item.vlog_list.length < 10">
									<text class="u_li">上传视频</text>
									<image class="right_img" src='@/static/images/right.png' />
								</view>
							</view>
							<view class="qs_img" v-if="item.vlog_list.length > 0">
								<view v-for="(val, index) in item.vlog_list" :key="index" style="position: relative;">
									<video :src="getImgUrl(val.file_url)" class="up_img"></video>
									<img class="del_img" :src="delImg" alt="" @click="knowInfo[tip].vlog_list.splice(index,1)"/>
								</view>
							</view>
							<view class="img_text">文件资料上传可包含，FLV、RMVB、MP4、MVB文件</view>
							
						</view> -->
						
						<view class="chat_text">
							<view class="text_conts">
								<text class="text_r">知识库网址</text>
								<view class="text_u" @click="addKonwWebsite(tip)" v-if="item.website_list.length < 10">
									<image class="add_img" :src='addImg'/>
									<text class="add_li">添加</text>
								</view>
							</view>
							<view v-for="(res, index) in item.website_list" :key="index">
								<view style="margin-top: 10upx; display: flex;">
									<u--input placeholder="请输入网址" border="surround" v-model="res.file_url"></u--input>
									<u-icon name="trash" size="20" v-if="index > 0" @click="knowInfo[tip].website_list.splice(index,1)"></u-icon>
								</view>
							</view>
							
						</view>
					</view>
					
					
					<view class="add_btn">
						<view class="btn_cont" @click="addKnowInfo">
							<image class="add_img" :src='addImg' />
							<text class="add_text">新增知识库</text>
						</view>
					</view>
					
				</view>			
							
				
			</view>
			
			<!-- 添加标签 -->
			<u-modal :show="tagShow" @cancel="closeTag" confirmText="添加" confirmColor="#1F64FF" :showCancelButton='true'
				@confirm="confirmTag">
				<view class="key_cont" style="">
					<view class="title">添加类型</view>
					<u-input :customStyle='{"padding":"8px", "width":"100%"}' inputAlign="center" v-model="tagName"
						placeholder="请输入类型名称" type="text" maxlength="10"></u-input>
				</view>
			</u-modal>
			
			<!-- 行业选择 -->
			<u-picker :show="industryShow" :columns="industryList" v-model="industryIndex" keyName="label" @cancel="industryShow = false" @confirm="industrySubmit"></u-picker>
			
		</view>
		
		<view class="bottom">
			<view class="bottom_cont">
				
				<view class="bottom_buy" style="width: 30%;" @click="prevStep" v-if="current > 1">上一步</view>
				<view class="bottom_buy" style="width: 30%;" @click="nextStep" v-if="current < 4">下一步</view>
				<view class="bottom_submit" :style="[{width:(current == 1 || current == 4  ? '60%':'30%')}]" @click="addSave">保存</view>
				<!-- <view class="bottom_buy" style="width: 33%;" @click="addSumbit" v-if="current == 4">提交</view> -->
			</view>
		</view>
		
		<view class="chat_cont" style="margin-top: 10rpx">
			<view class="cont_li" style="margin-bottom: 110rpx;">
				<view class="cont_title">
					<view class="title_li">
						<text class="title_l"></text>
						<text class="title_r">商务合作</text>
					</view>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_r">城市运营商</text>
					</view>
					<view class="text_tip">诚招城市有能力的合作伙伴，一起拓展市场</view>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_r">源码定制开发</text>
					</view>
					<view class="text_tip">定制开发Al智能软件：PC、H5、公众号、小程序</view>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_r">API接口</text>
					</view>
					<view class="text_tip">ChatGLM、文心一言、讯飞星火、Stable Diffusion、Midjourney、百度绘画</view>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">合作类型</text>
					</view>
					<view class="lists" @click="openShow">
						<view class="txt" v-if="hzValue != ''" >{{ hzValue }}</view>
						<view class="txt" v-else>请选择合作类型</view>
						<u-icon name="arrow-down" color="#666" size="16"></u-icon>
					</view>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">姓名</text>
					</view>
					<u--input placeholder="请输入您的姓名" border="surround" maxlength="20" v-model="userName"></u--input>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l">*</text>
						<text class="text_r">手机号</text>
					</view>
					<u--input placeholder="请输入您的手机号" border="surround" maxlength="11" v-model="phone"></u--input>
				</view>
				
				<view class="chat_text">
					<view class="text_cont">
						<text class="text_l"></text>
						<text class="text_r">合作意向</text>
					</view>
					<u-textarea v-model="remark" placeholder="请输入内容" maxlength="500" ></u-textarea>
				</view>
				
				<view class="bottom_no">
					<view class="bottom_cont">
						<view class="bottom_submit" style="width: 80%;" @click="addSumbit">提交</view>
					</view>
				</view>
				
			</view>
			<!-- 合作类型选择 -->
			<u-picker :show="hzShow" :columns="hzList" v-model="hzIndex" keyName="label" @cancel="hzShow = false" @confirm="hzSubmit"></u-picker>
		</view>
		
		
	</view>
</template>

<script>
	import {
		getLabel,getRetrieve,companyInfo,projectInfo,informationInfo,knowledgeInfo,business
	} from '@/apis/user.js'
	export default {
		data() {
			return {
				current: 1,
				// 第一步
				company_code: '',
                companyName: '',
			    sortName: '',
				job: '',
				registeredAddress: '',
				companyDesc: '',
				companyWebsite: '',
				companyIcp: '',
				companyPhone: '',
				companyEmail: '',
				companyAddress: '',
				industryValue: '',
				industryIndex: '',
				industryShow: false,
				industryList: [],
				wxImg: [], //小程序二维码
				gzhImg: [], // 公众号二维码
				logoImg: [], // logo图片
				companyImg: [], // 公司图片
				fileImg: [], //文件图片
				vidioList: [], // 视频文件
				fileList: [], //文件
				company_website: [
					{file_url: ''}
				],
				
				// 第二步
				 project_list: [	
					{
					  project_code: '',		// 项目唯一编号，不传为创建，传了为修改，删除时将此字典删除
					  category_name: '',	// 类目名称
					  project_name: '',		// 项目名称
					  brief_introduction: '',	// 简介
					  project_image_list: [],	// 项目产品图，字段内容同上
					  file_list: [], //文件图片
					  vlog_list: [], // 视频文件
					  image_list: [], //文件
					  website_list: [
					  	{file_url: ''}
					  ],
					}
				],
				
				
				//第三步
				info: [
					{
						information_code: '',	//资讯编号，不传为创建，传了为修改，删除时将此字典删除
						label: '',
						label_code: '',  //资讯信息编号，下拉获取
						information_name: '',	//资讯名称
						content_desc: '',	//内容描述
						information_image_list: [] ,//资讯产品图，字段内容同上
						selectIndex: 0,
						infoShow: false,
						file_list: [], //文件图片
						vlog_list: [], // 视频文件
						image_list: [], //文件
						website_list: [
							{file_url: ''}
						],
					}
				],
				infoList: [],
				
				
				//第四步
				knowInfo: [
					{
						knowledge_code: '',
						category: '',
						category_name: '',
						title: '',
						content_desc: '',
						purpose: '',
						typeIndex: 0,
						file_list: [], //文件图片
						vlog_list: [], // 视频文件
						image_list: [], //文件
						website_list: [
							{file_url: ''}
						],
					}
				],
				tagName: '',
				tagShow: false,
				typeList: [],
				copyTypeList: [], // 复制分类列表
				
				// 商务合作
				hzShow: false,
				hzValue: '城市运营商',
				hzIndex: 0,
				userName: '',
				phone: '',
				remark: '',
				hzList: [
					[
					 { label: "城市运营商",id: 1 },
					 { label: "源码定制开发",id: 2 },
					 { label: "API 接口",id: 3}
					]
				],
				leftImg: global.baseImg+'/xcx/24487314-1f72-473d-9886-57f8dbcb493a.jpg',
				rightImg: global.baseImg+'/xcx/3cf875c1-422f-43a0-88c9-ea9aa063f69e.jpg',
				backImg: 'background-image: url("'+global.baseImg+'/xcx/b98957ec-aba4-4bf5-88ca-c57d4255440b.jpg")',
				addImg: global.baseImg+'/xcx/01fece57-06c7-4eff-ab60-671230d86f80.jpg',
				delImg: global.baseImg+'/xcx/853ff4b9-283a-4917-b922-f2329cbcb562.jpg',
				isClick: true
			}
		},
		components: {
			
		},
		onLoad(option) {
			if(Object.keys(option).length > 0) {
				
				if(option.companyName) {
					this.companyName = option.companyName
				}
				if(option.phone) {
					this.companyPhone = option.phone
				}
				if(option.job) {
					this.job = option.job
				}
				if(option.company_code && option.company_code != '0') {
					this.company_code = option.company_code
					this.current = 4
				}
			}
			// this.getRetrieve()
			this.getLabel()
			
		},
		onShow() {
			
		},
		methods: {
			// 获取行业、资讯、分类
			getLabel(index) {
				// let data = { label_type: index }
				getLabel().then(res => {
					if (res.code == 20000) {
						
						this.industryList = []
						this.industryList.push(res.data.industry)
						if(this.company_code == '') {
							this.industryValue = res.data.industry[0].label,
							this.industryIndex = res.data.industry[0].label_code
						}
						
						this.infoList = []
						this.infoList.push(res.data.information)
						if(this.info[0].information_code == '') {
							this.info[0].label = res.data.information[0].label
							this.info[0].label_code = res.data.information[0].label_code
						}
						
						this.typeList = []
						this.typeList = res.data.category
						this.copyTypeList = res.data.category
						
						if(this.company_code != '') {
							this.getRetrieve(this.company_code)
						}
						
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
			
			// 获取详情
			getRetrieve(code) {
				let val = { company_code: code }
				getRetrieve(val).then(res => {
					if (res.code == 20000) {
						// 第一步
						if(res.data != null) {
							this.company_code = res.data.company_code;
							this.companyName = res.data.company_name;
							this.sortName = res.data.company_abbreviation;
							this.job = res.data.position;
							this.industryIndex = res.data.industry_code;
							this.industryValue = res.data.label;
							this.registeredAddress = res.data.registered_address;
							this.companyDesc = res.data.company_desc;
							this.companyWebsite = res.data.company_url;
							this.companyIcp = res.data.ipc_code;
							this.companyEmail = res.data.company_mailbox;
							this.companyAddress = res.data.company_address;
							this.companyPhone = res.data.company_mobile;
							this.wxImg = res.data.company_applet_list;
							this.gzhImg = res.data.company_official_account_list;
							this.logoImg = res.data.company_log_list;
							this.companyImg = res.data.company_image_list;
							this.fileList = res.data.file_list;
							this.fileImg = res.data.image_list;
							this.vidioList = res.data.vlog_list;
							if(res.data.website_list.length > 0) {
								this.company_website = res.data.website_list;
							} else {
								this.company_website = [{ file_url: '' }];
							}
							
							// 第二步
							this.project_list = res.data.project_list; // 项目信息
							
							if(this.project_list.length > 0) {
								this.project_list.forEach((val,index)=>{
									// this.project_list[index].product_fileList = val.file_list;
									// this.project_list[index].product_fileImg = val.image_list;
									// this.project_list[index].product_vidioList = val.vlog_list;
									if(val.website_list.length > 0) {
										this.project_list[index].website_list = val.website_list;
									} else {
										this.project_list[index].website_list = [{ file_url: '' }];
									}
								})
							} else {
								this.project_list = [
									{
									  project_code: '',		// 项目唯一编号，不传为创建，传了为修改，删除时将此字典删除
									  category_name: '',	// 类目名称
									  project_name: '',		// 项目名称
									  brief_introduction: '',	// 简介
									  project_image_list: [],	// 项目产品图，字段内容同上
									  file_list: [], //文件图片
									  vlog_list: [], // 视频文件
									  image_list: [], //文件
									  website_list: [{ file_url: '' }]
									}
								]
							}
							
							// 第三步
							this.info = res.data.information_list; // 项目信息
							if(this.info.length > 0) {
								this.info.forEach((val, index)=>{
									val.infoShow = false
									// this.info[index].info_fileList = val.file_list;
									// this.info[index].info_fileImg = val.image_list;
									// this.info[index].info_vidioList = val.vlog_list;
									if(val.website_list.length > 0) {
										this.info[index].website_list = val.website_list;
									} else {
										this.info[index].website_list = [{ file_url: '' }];
									}
								})
							} else {
								this.info = [
									{
										information_code: '',	//资讯编号，不传为创建，传了为修改，删除时将此字典删除
										label: '',
										label_code: '',  //资讯信息编号，下拉获取
										information_name: '',	//资讯名称
										content_desc: '',	//内容描述
										information_image_list: [] ,//资讯产品图，字段内容同上
										infoShow: false,
										file_list: [], //文件图片
										vlog_list: [], // 视频文件
										image_list: [], //文件
										website_list: [{ file_url: '' }]
									}
								]
							}
							
							// 第四步
							
							this.knowInfo = res.data.knowledge_list;
							if(this.knowInfo.length > 0) {
								this.knowInfo.forEach((item, tip)=>{
									if(item.website_list.length > 0) {
										this.knowInfo[tip].website_list = item.website_list;
									} else {
										this.knowInfo[tip].website_list = [{ file_url: '' }];
									}
									if(item.category != '') {
										this.typeList.forEach((val, index)=>{
											if(val.label == item.category_name) {
												this.knowInfo[tip].typeIndex = index
											}
										})
									} else {
										let data = { 'label_code': '', 'label': item.category_name }
										this.typeList.push(data)
										this.knowInfo[tip].typeIndex = this.typeList.length - 1
									}
								})
									
							} else {
								this.knowInfo = [
									{
										knowledge_code: '',
										category: '',
										category_name: '',
										title: '',
										content_desc: '',
										purpose: '',
										typeIndex: 0,
										file_list: [], //文件图片
										vlog_list: [], // 视频文件
										image_list: [], //文件
										website_list: [
											{file_url: ''}
										]
									}
								]
							}
											
						}
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('获取失败！')
				})
			},
			// 切换步骤
			changeTab(val) {
				// console.log(this.company_code,3325)
				if(this.company_code == '') {
					this.$api.msg('填写公司名称并保存后才可以操作后续步骤')
				} else {
					this.current = val
				}
				
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				
			},
			
			prevStep() {
				this.current -= 1
				uni.pageScrollTo({// 回到页面顶部
					scrollTop: 0,
					duration: 0
				});
			},
			
			nextStep() {
				
				if(this.current == 1) {
					if(this.companyName == '') {
						this.$api.msg('请上传公司名称')
						return
					}
					this.saveCompanyInfo()
					
				} else if(this.current == 2) {
					if(this.project_list[0].project_name == '') {
						this.$api.msg('请输入产品名称')
						return
					}
					if(this.project_list[0].brief_introduction == '') {
						this.$api.msg('请输入产品描述')
						return
					}
					
					this.saveProductInfo()
				} else if(this.current == 3) {
					if(this.info[0].infoName == '') {
						this.$api.msg('请输入资讯名称')
						return
					}
					if(this.info[0].infoDesc == '') {
						this.$api.msg('请输入资讯描述')
						return
					}
					
					this.saveInfo()
					
				}
				
				this.current += 1
				
				uni.pageScrollTo({// 回到页面顶部
					scrollTop: 0,
					duration: 0
				});
			},
			getImgUrl(url){
			   return global.baseImg+'/'+url;
			},
// -----------------------------第一步--------------------------------------------------			
			
			// 打开行业弹窗
			openIndustry() {
				this.industryShow = true;
			},
			industrySubmit(e) {
				this.industryIndex = e.value[0].label_code;
				this.industryValue = e.value[0].label;
				this.industryShow = false;
			},
			
			// 新增网址
			addCompanyWebsite() {
				this.company_website.push({ file_url: '' })
			},
			
			// 第一步保存
			saveCompanyInfo() {
				let webArr = [];
				if(this.company_website[0].file_url == '') {
					webArr = []
				} else {
					webArr = this.company_website
				}
				let data = { 
					"action": "save",
					"company_code": this.company_code,
					"company_name": this.companyName, // 公司名称
					"company_abbreviation": this.sortName, //公司简称
					"position": this.job, //职位
					"industry_code": this.industryIndex, // 行业编号
					"registered_address": this.registeredAddress, //注册地址
					"company_desc": this.companyDesc, //公司描述
					"company_url": this.companyWebsite, // 公司网址
					"ipc_code": this.companyIcp, // 公司icp
					"company_mailbox": this.companyEmail, // 公司邮箱
					"company_address": this.companyAddress, //公司地址
					"company_mobile": this.companyPhone, // 公司电话
					"company_applet_list": this.wxImg, // 公司小程序图片列表
					"company_official_account_list": this.gzhImg,//公司公众号
					"company_log_list": this.logoImg,//公司log
					"company_image_list": this.companyImg,//公司图片
					"file_list": this.fileList,
					"image_list": this.fileImg,
					"vlog_list": this.vidioList,
					"website_list": webArr
				}
				companyInfo(data).then(res => {
					console.log(res,66666666)
					if(res.code == 20000) {
						this.getRetrieve(res.data)
						this.$api.msg('保存成功')
						
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('保存失败')
				})
			},
// -----------------------------第二步--------------------------------------------------		
			// 新增产品
			addProduct() {
				let val = {
					project_code: '',		// 项目唯一编号，不传为创建，传了为修改，删除时将此字典删除
					category_name: '',	// 类目名称
					project_name: '',		// 项目名称
					brief_introduction: '',	// 简介
					project_image_list: [],
					file_list: [],    // 项目资料文件
					image_list: [],   //项目资料图片
					vlog_list: [],    //项目资料视频
					website_list: [{ file_url: '' }]    //项目资料网址
				}
				this.project_list.push(val)
			},
			
			// 新增网址
			addWebsite(tip) {
				this.project_list[tip].website_list.push({ file_url: '' })
			},
			
			// 第二步保存
			saveProductInfo() {
				// console.log(this.project_list,9956)
				this.project_list.forEach((val, index) => {
					if(val.website_list[0].file_url == '') {
						val.website_list = []
					}
				})
				let data = { 
					"company_code": this.company_code,
					"project_list": this.project_list
				}
				projectInfo(data).then(res => {
					if (res.code == 20000) {
						this.getRetrieve(this.company_code)
						this.$api.msg('保存成功')
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('保存失败')
				})
			},
// -----------------------------第三步--------------------------------------------------				
			pickSelect(e) {
				this.info[this.selectIndex].label_code = e.value[0].label_code;
				this.info[this.selectIndex].label = e.value[0].label;
				this.info[this.selectIndex].infoShow = false;
				this.$forceUpdate()
			},
			
			closePick(index) {
				this.info[index].infoShow = false;
				this.$forceUpdate()
			},
			
			openInfo(index) {
				this.info[index].infoShow = true;
				this.selectIndex = index;
				this.$forceUpdate()
			},

			// 新增资讯
			addInfo() {
			   let val = {
					information_code: '',	//资讯编号，不传为创建，传了为修改，删除时将此字典删除
					label: '',
					label_code: '',  //资讯信息编号，下拉获取
					information_name: '',	//资讯名称
					content_desc: '',	//内容描述
					information_image_list: [], //资讯产品图，字段内容同上
					infoShow: false,
					selectIndex: 0,
					file_list: [], //文件图片
					vlog_list: [], // 视频文件
					image_list: [], //文件
					website_list: [
						{file_url: ''}
					],
				}
				this.info.push(val)
			},
			
			// 新增网址
			addInfoWebsite(tip) {
				this.info[tip].website_list.push({ file_url: '' })
			},
			
			// 第三步保存
			saveInfo() {
				
				this.info.forEach((val, index) => {
					if(val.website_list[0].file_url == '') {
						val.website_list = []
					}
				})
				let data = { 
					"company_code": this.company_code,
					"information_list": this.info
				}
				informationInfo(data).then(res => {
					if (res.code == 20000) {
						this.getRetrieve(this.company_code)
						this.$api.msg('保存成功')
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('保存失败')
				})
			},
			
// -----------------------------第四步--------------------------------------------------			
            addKnowInfo() {
               let val = {
            		knowledge_code: '',//知识库编号，不传为创建，传了为修改，删除时将此字典删除
					category: '',//分类编号下拉获取
					category_name: '',//分类名称下拉获取
            		title: '',//名称
            		content_desc: '',//描述
            		purpose: '',// 用途
					typeIndex: 0,
					file_list: [], //文件图片
					vlog_list: [], // 视频文件
					image_list: [], //文件
					website_list: [
						{file_url: ''}
					],
            	}
            	this.knowInfo.push(val)
            },
			selectType(index, tip) {
				// console.log(index,2589)
				this.knowInfo[tip].typeIndex = index
				this.knowInfo[tip].category = this.typeList[index].label_code
				this.knowInfo[tip].category_name = this.typeList[index].label
				console.log(this.knowInfo[tip],8548)
				this.$forceUpdate()
			},
			
			addType() {
				this.tagShow = true
			},
			
			closeTag() {
				this.tagName = ''
				this.tagShow = false
			},
			
			confirmTag() {
				if(this.tagName.trim() == '') {
					this.$api.msg('请输入类型名称')
					return
				}
				let data = { 'label': this.tagName, 'label_code': '' }
				this.typeList.push(data)
				this.tagShow = false;
				this.tagName = '';
				this.$forceUpdate()
			},
			
			// 新增网址
			addKonwWebsite(tip) {
				this.knowInfo[tip].website_list.push({ file_url: '' })
			},
			
			// 第四步保存
			saveKnow() {
				let isFile = false;
				this.knowInfo.forEach((val, index) => {
					if(val.file_list.length == 0) {
						isFile = true
					}
					if(val.website_list.length == 0) {
						val.website_list = []
					}
					if(val.category_name == '' || val.category_name == 'undefined') {
						val.category_name = this.typeList[val.typeIndex].label
						val.category = this.typeList[val.typeIndex].label_code
					}
				})
				if(isFile) {
					this.$api.msg('请上传知识库相关文档')
					return
				}
				let data = { 
					"company_code": this.company_code,
					"knowledge_list": this.knowInfo
				}
				knowledgeInfo(data).then(res => {
					if (res.code == 20000) {
						this.typeList = this.copyTypeList;
						// this.getRetrieve(this.company_code)
						this.$api.msg('保存成功')
						setTimeout(() => {
						   uni.navigateTo({
						   	  url: '/pages/user/company/company_list',
						   })
						}, 1000);
					} else {
						this.$api.msg(res.msg)
					}
				}).catch(err => {
					this.$api.msg('保存失败')
				})
			},
			
// --------------------商务合作--------------------------------------------------
			openShow() {
				this.hzShow = true
			},
			hzSubmit(e) {
				this.hzIndex = e.value[0].id;
				this.hzValue = e.value[0].label;
				this.hzShow = false;
			},
			
			addSumbit() {
				if (this.userName == "") {
					this.$api.msg('姓名不能为空！');
					return
				}
				
				if (this.phone == "") {
					this.$api.msg('手机号不能为空！');
					return
				}
				
				var TEL_REGEXP = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
				if (!TEL_REGEXP.test(this.phone)) {
					this.$api.msg('手机号格式不正确！');
					return
				}
				
				if (this.isClick == false) {
					return false;
				}
				this.isClick = false;
				
				let val = {
					'name': this.userName,
					'phone': this.phone,
					'details': this.remark,
					"type": this.hzIndex
				}
				
				business(val).then(res => {
					if (res.code == 20000) {
						// console.log(JSON.stringify(res.data),789);
						uni.showToast({
							title: '提交成功',
							icon: 'success',
							duration: 1500
						})
						this.userName = '';
						this.phone = '';
						this.remark = '';
						this.isClick = true;
						this.type = ''
					} else {
						this.isClick = true;
						this.$api.msg(res.msg);
					}
				}).catch(err => {
					this.isClick = true;
					this.$api.msg('信息提交失败');
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
					uni.showLoading({ title: '上传中' });
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
								uni.hideLoading()
								if(that.current == 1) {
									if(val == 1) {
										that.wxImg.push(data)
									} else if(val == 2) {
										that.gzhImg.push(data)
									} else if(val == 3) {
										that.logoImg.push(data)
									} else if(val == 4) {
										that.companyImg.push(data)
									} else if(val == 5) {
										that.fileImg.push(data)
									}

								} else if(that.current == 2) {
									if(val == 1) {
										that.project_list[tip].project_image_list.push(data)
									} else if(val == 2) {
										that.project_list[tip].image_list.push(data)
									}
								} else if(that.current == 3) {
									if(val == 1) {
										that.info[tip].information_image_list.push(data)
									} else if(val == 2) {
										that.info[tip].image_list.push(data)
									}
								} else if(that.current == 4) {
									if(val == 1) {
										that.knowInfo[tip].image_list.push(data)
									}
								}
							} else {
								that.$api.msg(imgData.msg)
								uni.hideLoading()
							}
						}
					});
				  }
				})
			},
			
			// 上传视频
			uploadVideo(tip) {
				let that = this;
				uni.chooseVideo({
				  // count: 1,
				  // mediaType: ['video'],
				  sourceType: ['album', 'camera'],
				  maxDuration: 30,
				  camera: 'back',
				  success(res) {
				    // console.log(res.tempFiles)
					console.log(res,589)
					const tempFilePaths = res.tempFilePath;
					const size = res.size;
					if(size > 1073741824) { // 视频文件最大只能上传1GB
						that.$api.msg('该文件已超过1GB，不能上传')
						return
					}
					uni.showLoading({ title: '上传中' });
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
							// console.log(imgData,333)
							uni.hideLoading()
							if(imgData.code == 20000) {
								// let url = global.baseImg + '/'+ imgData.data.new_url
								let url = imgData.data.new_url
								let data = {  file_url: url }
								if(that.current == 1) {
									that.vidioList.push(data)
								} else if(that.current == 2) {
									that.project_list[tip].vlog_list.push(data)
								} else if(that.current == 3) {
									that.info[tip].vlog_list.push(data)
								} else if(that.current == 4) {
									that.knowInfo[tip].vlog_list.push(data)
								}
							} else {
								that.$api.msg(imgData.msg)
								uni.hideLoading()
							}
						}
					});
				  }
				})
			},
			
			// 上传文件
			uploadFile(tip) {
				let that = this;
				uni.chooseFile({
				  count: 9,
				  type: 'file',
				  extension: ["docx", "doc", "ppt", "pptx", "xlsx", "xlx","txt", "md","pdf"],
				  success (res) {
				    // tempFilePath可以作为img标签的src属性显示图片
					// console.log(res,7458)
				    const tempFilePaths = res.tempFiles[0].path
					const image_name = res.tempFiles[0].name
					// console.log(image_name,774)
					uni.showLoading({ title: '上传中' });
					uni.uploadFile({
						url: global.loginUrl + '/api/user/oss_upload', 
						filePath: tempFilePaths,
						name: 'image',
						formData: {
							"image": tempFilePaths,
							"image_name": image_name,
							"oss_dir": 'static',
							"cate": 'create_character'
						},
						success: (uploadFileRes) => {
							let imgData = JSON.parse(uploadFileRes.data)
							console.log(imgData,1258)
							uni.hideLoading()
							if(imgData.code == 20000) {
								let name = imgData.data.name
								let url = imgData.data.new_url
								let data = {
									file_url: url,
									file_name: name
								}
								if(that.current == 1) {
									that.fileList.push(data)
								} else if(that.current == 2) {
                                    that.project_list[tip].file_list.push(data)
								} else if(that.current == 3) {
									that.info[tip].file_list.push(data)
								} else if(that.current == 4) {
									that.knowInfo[tip].file_list.push(data)
								} 
							} else {
								that.$api.msg(imgData.msg)
								uni.hideLoading()
							}
						}
					});
				  }
				})
			},
			
			
			// 保存
			addSave() {
				if(this.current == 1) {
					if(this.companyName == '') {
						this.$api.msg('请上传公司名称')
						return
					}
					this.saveCompanyInfo()
				} else if(this.current == 2) {
					if(this.project_list[0].project_name == '') {
						this.$api.msg('请输入产品名称')
						return
					}
					if(this.project_list[0].brief_introduction == '') {
						this.$api.msg('请输入产品描述')
						return
					}
					this.saveProductInfo()
				} else if(this.current == 3) {
					if(this.info[0].infoName == '') {
						this.$api.msg('请输入资讯名称')
						return
					}
					if(this.info[0].infoDesc == '') {
						this.$api.msg('请输入资讯描述')
						return
					}
					this.saveInfo()
				} else {
					if(this.knowInfo[0].title == '') {
						this.$api.msg('请输入知识库名称')
						return
					}
					if(this.knowInfo[0].knowDesc == '') {
						this.$api.msg('请输入描述信息')
						return
					}
					this.saveKnow()
				}
			}
			
		}
	}
</script>

<style lang="less" scoped>
	.top_cont {
		width: 100%;
		height: 350upx;
		background-size: 100% 100%;
		.top_text {
			padding: 40upx 70upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.title_li {
				color: #333;
				font-size: 32upx;
				font-style: normal;
				font-weight: 500;
				line-height: 48upx;
				margin-bottom: 20upx;
			}
			.title_text {
				color: #333;
				text-align: center;
				font-size: 28upx;
				font-style: normal;
				font-weight: 400;
				line-height: 42upx;
			}
		}
	}
	
	.chat_cont {
		margin-top: -80upx;
		padding: 0 30upx 30upx 30upx;

		.cont_li {
			padding: 25upx;
			background: #fff;
			border-radius: 15upx;
			// margin-bottom: 110upx;
			margin-bottom: 30upx;
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
	}
	
	.tabs {
		display: flex;
		align-items: center;
		justify-content: space-around;
		.tabs_index{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 20upx;
			.index_title {
				width: 40upx;
				height: 40upx;
				border-radius: 50%;
				background: #F2F3F5;
				color: #4E5969;
				font-size: 30upx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.index_title_active {
				width: 40upx;
				height: 40upx;
				border-radius: 50%;
				background: #1F64FF;
				color: #fff;
				font-size: 30upx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.index_text {
				color: #4E5969;
  		        font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: 36upx;
				padding-top: 5upx;
			}
			.index_text_active {
				color: #1F64FF;
			    font-size: 26upx;
				font-style: normal;
				font-weight: 400;
				line-height: 36upx;
				padding-top: 5upx;
			}
		}
		.tabs_line {
			width: 32upx;
			height: 5upx;
			background: #E5E6EB;
			margin: 0 15upx;
		}
		.tabs_line_active {
			width: 32upx;
			height: 5upx;
			background: #1F64FF;
			margin: 0 15upx;
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
	
	.file_li {
		display: flex;
		flex-direction: column;
		padding: 10upx 0;
		width: 100%;
		.li_text {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.li_ul {
				display: flex;
				width: 80%;
			}
			.file_text {
				display: flex;
				width: 80%;
				.file_url {
					color: #666;
					font-size: 22upx;
					font-style: normal;
					font-weight: 400;
					padding: 10upx 15upx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 100%;
					margin: 0 5upx;
				}
				
			}
			.l_img {
				width: 40upx;
				height: 40upx;
			}
			.r_img {
				width: 36upx;
				height: 36upx;
			}
		}
		
	}
	
	.img_text {
		color: #9A9A9A;
		font-size: 24upx;
		font-style: normal;
		font-weight: 400;
	}
	
	.bottom {
		width: 100%;
		background: #ffffff;
		position: fixed;
		bottom: 0;
		z-index: 999;
	}
	
	.bottom_no {
		width: 100%;
		background: #ffffff;
		
	}
	
	.bottom_cont {
		display: flex;
		justify-content: center;
		padding-bottom: 25upx;
	}
	.bottom_submit {
		width: 25%;
		height: 80upx;
		background: #1F64FF;
		border-radius: 6px;
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 20px;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20upx auto 0;
	}
	
	.bottom_buy {
		width: 65%;
		height: 80upx;
		background: #fff;
		border-radius: 6px;
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 20px;
		color: #1F64FF;
		border: 1upx solid #1F64FF;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20upx auto 0;
	}
	
	.cont_title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20upx 0;
		.title_li {
			display: flex;
			align-items: center;
		}
		.title_l {
			width: 20px;
			height: 4px;
			background: #1F64FF;
			border-radius: 10px;
			transform: rotate(-90deg);
		}
		.title-r {
			font-weight: 550;
			font-size: 26upx;
			line-height: 150%;
			color: #333;
		}
	}
	
	.add_btn {
		width: 100%;
		padding: 25upx;
		display: flex;
		align-items: center;
		justify-content: center;
		.btn_cont {
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 10upx;
			background: #DDE8FF;
			width: 80%;
			padding: 15upx;
			.add_img {
				width: 28upx;
				height: 28upx;
				// padding: 0 15upx;
			}
			.add_text {
				color: #1F64FF;
				font-size: 28upx;
				font-style: normal;
				font-weight: 500;
				padding-left: 15upx;
			}
		}
	}
	
	.cont_tab {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		.tab_li {
			border-radius: 8upx;
			border: 1upx solid #DCDFE6;
			width: 22%;
			height: 70upx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #9A9A9A;
			font-size: 28upx;
			margin: 10upx 1%;
		}
		.tab_active {
			border-radius: 8upx;
			border: 1upx solid #1F64FF;
			width: 22%;
			height: 70upx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #1F64FF;
			font-size: 28upx;
			margin: 10upx 1%;
		}
		.tab_add {
			border-radius: 8upx;
			border: 1upx dotted #1F64FF;
			width: 22%;
			height: 70upx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #1F64FF;
			font-size: 28upx;
			margin: 10upx 1%;
		}
	}
	
	.key_cont {
		width: 100%;
		background-color: #FFFFFF;
		border-radius: 20upx;
		/* padding: 0upx 0 0 0; */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.title {
			font-weight: 500;
			font-size: 32upx;
			line-height: 48upx;
			color: #333;
			margin-bottom: 32upx;
		}
	}
	
	
	
</style>