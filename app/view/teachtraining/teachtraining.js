/**
 *  师资培训专题页
 */
define(['template',
		'jquery',
		'layer',
		'text!tplUrl/teachtraining/teachtraining.html',
		'text!tplUrl/teachtraining/teachbox.html',
		'text!tplUrl/teachtraining/video.html',
		'common',
		'jquery.validate',
		'jquery.validate.zh',
		'css!cssUrl/teachtraining'
	],
	function (template,$,layer,teachtrainingTpl,teachboxTpl,videoTpl,common) {

		function createPage() {
			document.title = "博学谷·院校-师资培训专题页";
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teacrise").addClass("active");


			//数据源
			var UserDB = MyUser();
			if(!UserDB.success){
				layer.alert(UserDB.errorMessage || "服务器异常!")
			};

			$("#content").html(template.compile( teachtrainingTpl)({
			}));

			// 课程
			$('.type-pic').on('click', function(){
				$('.type-pic').removeClass('avite');
				$(this).addClass('avite');

				var type = $(this).data('type');

				$('.type-cont').removeClass('avite');
				$('.type-course-'+type).addClass('avite');
			});


			// 视频与图片
			$('.environment-btn li a').on('click', function(){
				$('.environment-btn li a').removeClass('active');
				$(this).addClass('active');

				var type = $(this).data('etype');

				$('.en-cont').removeClass('active');
				$('.en-'+type).addClass('active');
			});

			//  视频播放
			$('.J-play').on('click', function(){
				layer.open({
					type: 1,
					title: false,
					skin: 'layui-layer-rim', //加上边框
					area: ['680px','480px'], //宽高
					content: videoTpl
				});
				var videoType = $(this).data('type');
				$(".video").children().eq($('.video-'+videoType).index()).show().siblings("li").hide();
			});

			$('.ToSignup').on('click', function(){
				var index = layer.open({
					type: 1,
					title: false,
					skin: 'layui-layer-rim', //加上边框
					area: ['500px','600px'], //宽高
					content:  template.compile( teachboxTpl)({
									user: UserDB
								})
				});

				// 监听学校输入框
				$("#collegeName").on("input propertychange", function (e) {
					// 显示出框
					$('.college-box').show();
					if($.trim($("#collegeName").val())) {
						// 获取学校的名字
						var collegeName = $.trim($("#collegeName").val());
						var collegesListDB = collegesList(collegeName);
						if(!collegesListDB.success){
							layer.alert(collegesListDB.errorMessage || "服务器异常!")
						};

						for (var i = 0; i < collegesListDB.resultObject.length; i++) {
							$("#J-college").append("<li data-id=" + collegesListDB.resultObject[i].id + " title="+collegesListDB.resultObject[i].collegeName+">" + collegesListDB.resultObject[i].collegeName + "</li>")
						}

						$("#J-college li").on("click",function(){
							$("#J-college").empty();
							$(".college-box").css("display", "none");
							$("#collegeName").val($(this).text());
						});
					}else {
						$("#J-college").html('');
					}
				});
				// 监听退格事件  ASCII码
				$("#collegeName").on("input keydown", function (e) {
					if(e.keyCode==8){
						$("#J-college").html('');
					}
					if (e.keyCode >= 72 || e.keyCode <= 122) {

					}
				});




				$("#ToSignupForm").validate({
					rules: {
						name: {
							required: true
						},
						subject: {
							required: true
						},
						mobile: {
							required: true,
							isPhone: true
						},
						collegeName: {
							required: true
						},
						email: {
							required: true,
							email: true
						}
					},
					messages: {
						name: {required: '请输入真实姓名'},
						subject: {required: '请选择研修方向'},
						mobile: {required: '请输入联系方式'},
						collegeName: {required: '请输入所在高校'},
						email: {required: '请输入邮箱地址' }
					},
					errorElement: "p",
					submitHandler: function () {
						var SignupName = $('.SignupName').val();
						var SignupType = $('.SignupType').val();
						var SignupPhone = $('.SignupPhone').val();
						var SignupSoole = $('.SignupSoole').val();
						var email = $('.SignupEmail').val();
						var duty = $('.SignupDuty').val();
						var TeacherTrainedApplyDB = TeacherTrainedApply(SignupName,SignupType,SignupPhone,SignupSoole,email, duty);
						if( !TeacherTrainedApplyDB.success ){
							layer.alert( TeacherTrainedApplyDB.errorMessage || '服务器异常!');
							return false;
						};
						layer.close(index);
						return false;
					}
				});
			});

		};


		/**
		 * 个人中心
		 * 正式 sessionUser
		 * 本地测试  localLogin?username=18911268384
		 */
		var MyUser = function() {
			return common.requestService('bxg_anon/user/sessionUser','get', {});
		};


		// 学校搜索接口
		var collegesList = function(collegeName ) {
			return common.requestService('bxg_anon/common/collegesList','post', {
				collegeName: collegeName
			});
		};


		// 师资培训申请接口
		var TeacherTrainedApply = function(name,subject,mobile,collegeName, email, duty) {
			return common.requestService('bxg_anon/home/teacherTrainedApply','post', {
				name: name,    //真实姓名
				subject: subject,   // 研修方向
				mobile: mobile,     // 联系方式
				collegeName: collegeName ,   //所在高校
				email: email,   // 邮箱
				duty: duty  //职务
			});
		};


		return {
			createPage: createPage
		}
	});