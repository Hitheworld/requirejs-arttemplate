/**
 * 视频相关api ：http://www.ckplayer.com/manual/15/20.htm
 * 接口: bxg/course/teacherJoinStatus
 *       -1; //没有传入课程ID
 *       0//没有教师用户  --没有登录
 *       1; //非认证教师
 *       2; //认证待审核教师
 *       3; //已认证
 *       4; //合作成功
 *       5: //合作成功
 *
 *       非认证为提交  1
 *       非认证待审核 2
 *       已认证 	     3 post提交数据 成功之后按钮按成文字“正在审核中。。。”
 *       已合作成功  4 按钮变成文字“已合作”
 *       1、判断用户是否登录
 *       --true(立即合作)
 *       --false(弹出登录框)
 *       2、非合作教师
 *       ---非认证未提交资料（你需要先完成教师资格认证）
 *       ---非认证已提交资料（教师资格审核中工作人员会在2日之内给出审核结果）
 *       ---已认证--访问接口（参数：教师ID，课程ID）--success弹（合作信息提交成功！我们的服务人员会在2天之内联系你
 *
 *  b 合作模式 不是个人中心 ----------
 *  a和c 合作模式 是从个人中心进来的---    addTeacherToCourse接口要传合作模式
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/course/course.del.html',
		'text!tplUrl/course/course.del.module/course.del.info.html',
		'text!tplUrl/course/course.del.module/course.del.btn.type.html',
		'text!tplUrl/course/course.del.module/course.del.teacherJoinStatus.html',
		'text!tplUrl/course/course.del.module/course.del.tab.html',
		'text!tplUrl/course/course.del.module/course.del.adsense.html',
		'text!tplUrl/course/course.del.module/course.del.relevant.html',
		'text!tplUrl/course/course.del.module/popup.video.html',
		'text!tplUrl/course/course.del.module/popup.faill.html',
		'text!tplUrl/course/course.del.module/popup.review.html',
		'text!tplUrl/course/course.del.module/popup.successful.html',
		'text!tplUrl/common/login/popup.login.html',
		'popupLogin',
		'ckplayer',
		'common',
		'api',
		'json2',
		'jquerySession',
		'jquery.validate',
		'jquery.validate.zh',
		'css!cssUrl/course.details',
		'css!cssUrl/popup.login'
],
	function (template,$,layui,layer,
	          courseDelTpl,infoTpl,typeTpl,teacherJoinStatusTpl,tabTpl,adsenseTpl,relevantTpl,videoTpl,faillTpl,reviewTpl,successfulTpl,popupLoginTpl,
	          popupLogin,ckplayer,common,api,JSON) {

		function createPage(pagination, courseId) {
			document.title = "博学谷·院校-教师端课程详情页";
			console.log("课程详情",courseId,"合作模式:",pagination);
			$("#content").html(template.compile( courseDelTpl)());
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.course").addClass("active");

			//课程详情信息
			courseDetail(courseId, pagination);

			//广告信息
			adsense(courseId);

			//教学扩展资源
			relationCourseList(courseId);

		}

		//获取教师
		var teacherId = $(".home-user-name").data("id");
		console.log("教师ID是:",teacherId);

		//进入课程详情页的时候调用
		var teacherJoinStatus = function(teacherId,courseId) {
			return common.ajaxRequest('bxg/course/teacherJoinStatus', "GET", {
				teacherId: teacherId,  //教师id
				courseId: courseId //课程ID
			});
		};

		//课程详情信息
		var courseDetail = function(courseId, pagination) {
			common.ajaxRequest('bxg/course/courseDetail', "GET", {
				courseId: courseId //课程ID
			}, function (data, state) {
				var resource_url = api.RESOURCESURL;  //配套资源地址
				var success = data.success;
				console.log(data.success)
				if(data.success){
					$("#course-del-info").html(template.compile( infoTpl)({
						success: success,
						data: data,
						resource_url: resource_url
					}));
					$("#btn-type").html(template.compile(typeTpl)({
						teacher: teacherId
					}));
					//如果没有登录
					var isTpl,window;
					if(teacherId == undefined){
						isTpl =  popupLoginTpl;   //登录
						window = ['500px', '500px'];
						//成功按钮弹出窗口
						$(".J-btn-popup").on('click', function(){
							//页面层
							layer.open({
								type: 1,
								title: false,
								skin: 'layui-layer-rim', //加上边框
								area: window, //宽高
								content: isTpl
							});

							//加载弹窗登录js文件;
							popupLogin.popupLogin();
						});
					}

					//登录后判断
					if(teacherId != undefined){
						common.ajaxRequest('bxg/course/teacherJoinStatus', "GET", {
							teacherId: teacherId,  //教师id
							courseId: courseId //课程ID
						},function(teacherJoinStatus){
							$("#teacherJoinStatus").html(template.compile(teacherJoinStatusTpl)({
								teacherJoinStatus: teacherJoinStatus
							}));

							var isStyle =  teacherJoinStatus.resultObject;
							if(isStyle == -1){
								isTpl = popupLoginTpl;  //没传递课程id
								window = ['500px', '500px'];
								btnPopup();
							} else if(isStyle == 0){    //0 没有教师用户  --没有登录
								isTpl = popupLoginTpl;
								window = ['500px', '500px'];
								btnPopup();
							}else if(isStyle == 1){     //1; //非认证教师
								isTpl = popupLoginTpl;
								window = ['500px', '500px'];
								btnPopup();
							} else if(isStyle == 2){   //发请求---- 合作请求
								isTpl = faillTpl;  //认证待审核教师--[]
								window = ['500px', '250px'];
								btnPopup();
							} else if(isStyle == 3) {    //已认证
								$('#addTeacherToCourse').on('click', function(){
									//发送请求
									//新增教师合作课程
									common.ajaxRequest('bxg/course/addTeacherToCourse', "POST", {
										course_id: courseId,
										model: pagination
									}, function (data, state) {
										if(data.success){
											$("#addtypehtml").html("<span>正在审核中…</span>");
											//弹出层
											isTpl = successfulTpl;
											window = ['500px', '250px'];
											btnPopup();
										} else {
											layer.alert("接口出错了!<br />"+data.errorMessage);
										}

									});
									//重新刷新页面
									//history.go(0); //刷新当面页
									//$("#teacherJoinStatus").html(template.compile(teacherJoinStatusTpl)({
									//	teacherJoinStatus: teacherJoinStatus
									//}));
								});
							}else if(isStyle == 4) {    //合作成功
								isTpl = reviewTpl;  //认证待审核教师--[]
								window = ['500px', '250px'];
								btnPopup();
							}else if(isStyle == 5) {    //已认证且合作成功
								return false;
							}else {
								return false;
							}

							//成功按钮弹出窗口
							var btnPopup = function (){
								$(".J-btn-popup").on('click', function(){
									//页面层
									layer.open({
										type: 1,
										title: false,
										skin: 'layui-layer-rim', //加上边框
										area: window, //宽高
										content: isTpl
									});
									//加载弹窗登录js文件;
									popupLogin.popupLogin();
								});
							};



						});
					}

				} else {
					var nodata = '<div class="course-list-nodata">暂无数据</div>\
					<div class="error">{{errorMessage}}</div>';
					$("#course-del-info").html(nodata);
				}
				$("#course-del-tab").html(template.compile( tabTpl)(data));
				var namehtml = '<cite>{{resultObject[0].name}}</cite>';
				$("#course-del-name").html(template.compile( namehtml)(data));
				//截取字符串
				$('.ellipsis').each(function(){
					var maxwidth= 110;
					if($(this).text().length>maxwidth){
						$(this).text($(this).text().substring(0,maxwidth));
						$(this).html($(this).html()+'...');
					}
				});
				//视频弹出窗口
				$(".J-btn-video").on('click', function(){
					//页面层
					var index = layer.open({
						type: 1,
						title: false,
						scrollbar: false,  //禁浏览器滚动
						maxmin: true,  //弹出即全屏
						skin: 'layui-layer-rim', //加上边框
						area: ['1200px', '100%'], //宽高
						content: template.compile( videoTpl)({
							video: data
						})
					});
					layer.full(index);
				});


				//分享按钮
				$(".J-btn-fx").on('click', function(){
					$(".fx-box").toggle();
				});

			});
		};


		//广告信息
		var adsense = function(courseId){
			common.TextajaxRequest('./app/data/course.del.adsense.json', "GET", {
				courseId: courseId
			}, function (data, state) {
				$("#course-del-adsense").html(template.compile( adsenseTpl)(data));
			});
		};

		//教学扩展资源
		var relationCourseList = function(courseId){
			common.ajaxRequest('bxg/course/relationCourseList', "GET", {
				courseId: courseId //课程ID
			}, function (data, state) {
				$("#course-del-items").html(template.compile( relevantTpl)(data));
				common.index_banner2("course-del-lists-box","course-del-relevant-prev","course-del-relevant-next","",4500);
			});
		};

		return {
			createPage: createPage
		}
	});