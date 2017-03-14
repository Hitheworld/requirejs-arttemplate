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
		'text!tplUrl/course/details/course.del.html',
		'text!tplUrl/course/details/popup.video.html',
		'text!tplUrl/course/details/popup.faill.html',
		'text!tplUrl/course/details/popup.review.html',
		'text!tplUrl/course/details/popup.successful.html',
		'text!tplUrl/course/details/ApplyResource.html',
		'text!tplUrl/common/login/popup.login.html',
		'popupLogin',
		'ckplayer',
		'common',
		'api',
		'jquery.cityselect',
		'jquery.validate',
		'jquery.validate.zh',
		'css!cssUrl/course.details',
		'css!cssUrl/popup.login'
],
	function (template,$,layui,layer,
	          courseDelTpl,videoTpl,faillTpl,reviewTpl,successfulTpl,ApplyResourceTpl,popupLoginTpl,
	          popupLogin,ckplayer,common,api) {

		function createPage(pagination, courseId) {
			document.title = "博学谷·院校-教师端课程详情页";
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.course").addClass("active");

			console.log("课程详情",courseId,"合作模式:",pagination);

			//获取教师
			var teacherId = $(".home-user-name").data("id");
			console.log("教师ID是:",teacherId);

			//课程详情信息 -- 数据源
			var courseDetailDB = courseDetail(courseId);

			// 判断按钮--- 数据源
			var teacherJoinStatusDB = teacherJoinStatus(teacherId, courseId);

			// 教学扩展资源--- 数据源
			var relationCourseListDB = relationCourseList(courseId);

			var resource_url = api.RESOURCESURL;  //配套资源地址

			//判断扩展资源的状态
			var StatusDB = resourcesDelCheckApplyStatus(courseId);
			//  0  ---没有登录
			//  1  ---非认证教师
			//  2; ----资源待审核中
			// 3;  ----可以申请资源

			$("#content").html(template.compile( courseDelTpl)({
				courseDetail: courseDetailDB,
				teacher: teacherId,
				teacherJoinStatus: teacherJoinStatusDB,
				relationCourseList: relationCourseListDB,
				resource_url: resource_url,
				StatusDB: StatusDB
			}));

			//分享按钮
			$(".J-btn-fx").on('mouseover', function(){
				$(".fx-box").show();
			});

			$(".fx-box").on('mouseleave', function(){
				$(".fx-box").hide();
			});

			// 申请样书
			//登录
			$(".J-apply-resource").on('click', function(){
				//判断扩展资源的状态
				var StatusDB = resourcesDelCheckApplyStatus(courseId);
				if(StatusDB.resultObject != undefined &&  StatusDB.resultObject == 0){
					layer.open({
						type: 1,
						title: false,
						skin: 'layui-layer-rim', //加上边框
						area: ['500px', '500px'], //宽高
						content: popupLoginTpl
					});
					//加载弹窗登录js文件;
					popupLogin.popupLogin();
				} else if (StatusDB.resultObject == 1) {  //非认证教师去认证
					//页面层
					layer.open({
						type: 1,
						title: false,
						skin: 'layui-layer-rim', //加上边框
						area:['500px', '250px'], //宽高
						content: faillTpl
					});
				} else if (StatusDB.resultObject == 3) {
					//申请
					addResource();
				}
			});

			//如果没有登录
			var isTpl,window;

			//成功按钮弹出窗口
			var btnPopup = function (window,isTpl ){
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
			var isStyle =  teacherJoinStatusDB.resultObject;
			if(isStyle == -1){
				isTpl = popupLoginTpl;  //没传递课程id
				window = ['500px', '500px'];
				btnPopup(window,isTpl);
			} else if(isStyle == 0){    //0 没有教师用户  --没有登录
				isTpl = popupLoginTpl;
				window = ['500px', '500px'];
				btnPopup(window,isTpl);
			}else if(isStyle == 1){     //1; //非认证教师
				isTpl = faillTpl;
				window = ['500px', '250px'];
				btnPopup(window,isTpl);
			} else if(isStyle == 2){   //发请求---- 合作请求
				isTpl = reviewTpl;  //认证待审核教师--[]
				window = ['500px', '250px'];
				btnPopup(window,isTpl);
			} else if(isStyle == 3) {    //已认证
				$('#addTeacherToCourse').on('click', function(){
					//发送请求
					//新增教师合作课程
					common.ajaxRequest('bxg/course/addTeacherToCourse', "POST", {
						course_id: courseId,
						model: pagination
					}, function (data, state) {
						if(data.success){
							$("#addtypehtml").html('<span class="left-btn">正在审核中…<div class="link"></div></span>');
							//弹出层
							isTpl = successfulTpl;
							window = ['500px', '250px'];
							btnPopup(window,isTpl);
						} else {
							layer.alert(data.errorMessage);
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


			//截取字符串
			$('.ellipsis').each(function(){
				var maxwidth= 120;
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
						video: courseDetailDB
					})
				});
				layer.full(index);
			});





			// 相关课程
			common.UpDownShuffling("course-del-lists-box","course-del-relevant-prev","course-del-relevant-next","",4500);

			//统计点击率接口
			CourseHits(courseId);







			//申请
			function addResource(){
				layer.open({
					type: 1,
					title: "申请样书",
					skin: 'layui-layer-rim', //加上边框
					area: ['738px','734px'], //宽高
					content: template.compile( ApplyResourceTpl)({
						courseDetail: courseDetailDB
					})
				});
				//$("#resourceName").val(resourcesDelDB.resultObject.name);
				//初始化三级省市区
				$("#citybox").citySelect({prov:"江苏", city:"南京", dist:"玄武区南京"});
				//加减交互
				$(".J-add").click(function(){
					var t=$(this).parent().find('input[class*=btn-input]');
					t.val(parseInt(t.val())+1)
					setTotal();
				})
				$(".J-min").click(function(){
					var t=$(this).parent().find('input[class*=btn-input]');
					t.val(parseInt(t.val())-1)
					if(parseInt(t.val())<0){
						t.val(0);
					}
					setTotal();
				})
				function setTotal(){
					var s=0;
					$("#tab td").each(function(){
						s+=parseInt($(this).find('input[class*=btn-input]').val())
							*parseFloat($(this).find('span[class*=price]').text());
					});
				}
				setTotal();

				//检验
				var number = $("#number").val(),   //申请数量
					province,  //地址---省
					city,   //地址---市
					area,   //地址---区
					address = $("#address").val(),   //地址---详细地址
					postalcode = $("#postalcode").val(),  //编码
					consigneeName = $("#consigneeName").val(),  //收货人
					phone = $("#phone").val(),   //手机号
					reason = $("#reason").val();  //申请理由

				$("#province").change(function() {   //地址---省
					province = $("#province option:checked").val();
				});
				$("#city").change(function() {       //地址---市
					city = $("#city option:checked").val();
				});
				$("#area").change(function() {      //地址---区
					area = $("#area option:checked").val();
				});

				$("#ApplyResourceForm").validate({
					rules : {
						number : {
							required : true,
							digits: true,
							min: 1
						},
						province : {
							required : true
						},
						city : {
							required : true
						},
						area : {
							required : true
						},
						address : {
							required : true
						},
						postalcode : {
							required : true,
							isZipCode: true
						},
						consigneeName : {
							required : true
						},
						phone : {
							required : true,
							isMobile: true
						},
						reason : {
							required : true
						}

					},
					messages : {
						number : {
							required : "请填写申请数量"
						},
						province : {
							required : "请选择省份"
						},
						city : {
							required :  "请选择市"
						},
						area : {
							required :  "请选择区"
						},
						address : {
							required :  "请填写详情地址"
						},
						postalcode : {
							required :  "请填写编码"
						},
						consigneeName : {
							required : "请填写姓名"
						},
						phone : {
							required : "请填写手机号"
						},
						reason : {
							required : "请填写申请理由"
						}
					},
					errorElement : "p",
					submitHandler: function(){
						$('.ApplyResource-btn').attr("disabled","disabled");//按钮不可用
						var number = $("#number").val(),   //申请数量
							province,  //地址---省
							city,   //地址---市
							area,   //地址---区
							address = $("#address").val(),   //地址---详细地址
							postalcode = $("#postalcode").val(),  //编码
							consigneeName = $("#consigneeName").val(),  //收货人
							phone = $("#phone").val(),   //手机号
							reason = $("#reason").val();  //申请理由


						province = $("#province option:checked").val();  //地址---省
						city = $("#city option:checked").val();   //地址---市
						area = $("#area option:checked").val() || "";   //地址---区
						var mail_address = (province + city + area + address).toString();
						if (number != '' && mail_address != ''&& postalcode!= ''
							&& consigneeName!= ''&& phone!= ''&& reason!= ''
						){
							var mail_address = (province + city + area + address).toString();
							console.log("地址:",mail_address,"数量:",number,"编码",postalcode,"收货人:",consigneeName,"手机号:",phone,"理由",reason);
							var ToTeacherDB = resourcesDelAddResourceToTeacher(courseId,number, mail_address, postalcode,consigneeName, phone, reason);

							if (ToTeacherDB.success) {
								//资源待审核中
								layer.msg('提交成功！我们将在2日内回馈审核结果！');
								setTimeout(function(){
									history.go(0);
								},2000);
							} else {
								layer.alert(ToTeacherDB.errorMessage);
								return false; //阻止表单默认提交
							}

						}else {
							return false;
						};


						return false; //阻止表单默认提交
					}
				});
			};



		}


		// 课程详情接口
		var courseDetail = function(courseId) {
			return common.requestService('bxg_anon/course/courseDetail','get', {
				courseId: courseId //课程ID
			});
		};

		//登录后判断
		var teacherJoinStatus = function(teacherId, courseId) {
			return common.requestService('bxg_anon/course/teacherJoinStatus','get', {
				teacherId: teacherId,  //教师id
				courseId: courseId //课程ID
			});
		};


		//广告信息
		var adsense = function(courseId) {
			return common.requestService('','get', {
				courseId: courseId //课程ID
			});
		};

		//教学扩展资源
		var relationCourseList = function(courseId) {
			return common.requestService('bxg_anon/course/relationCourseList','get', {
				courseId: courseId //课程ID
			});
		};


		//统计点击率接口
		var CourseHits = function(courseId) {
			return common.requestService('bxg_anon/course/hits','get', {
				courseId: courseId //课程ID
			});
		};


		/***
		 *
		 * 申请样书
		 * @param resourceId
		 * @returns {*}
		 */


		//获取判断扩展资源的状态
		var resourcesDelCheckApplyStatus = function(resourceId ) {
			return common.requestService('bxg_anon/home/checkApplyStatus','get', {
				resourceId: resourceId
			});
		};


		//申请扩展资源
		var resourcesDelAddResourceToTeacher = function(extend_resource_id, num, mail_address, post_code, receiver, receiver_mobile,apply_reason ) {
			return common.requestService('bxg/home/addResourceToTeacher','post', {
				extend_resource_id: extend_resource_id,  //资源ID
				num: num,                                   //申请数量
				mail_address: mail_address,                //邮寄地址
				post_code: post_code,                       //邮编
				receiver: receiver,                         //收件人
				receiver_mobile: receiver_mobile,           //收件人手机号，
				apply_reason: apply_reason                  //申请原因
			});
		};

		return {
			createPage: createPage
		}
	});