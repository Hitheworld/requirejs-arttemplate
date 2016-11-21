/**
 *   组织试卷---添加试卷
 *
 *   dome: http://www.html5tricks.com/demo/jiaoben1041/index.html
 *
 *   http://127.0.0.1:3000/app/js/lib/jquery.easing-v1.3/index.html
 *
 *   树型结构示例:http://127.0.0.1:3000/app/js/lib/aciTree-v4.5.0/aciTree-checkbox.html
 *
 *   aciTree--API文档：http://acoderinsights.ro/en/aciTree-tree-view-with-jQuery
 *
 *   zTree 示例:http://127.0.0.1:3000/app/js/lib/zTree_v3/demo/cn/
 *         官网API文档:http://www.treejs.cn/v3/api.php
 *
 *   datatable中文文档:http://datatables.club/manual/data.html
 *
 *   TAB滑动API文档:http://jquerytools.github.io/documentation/scrollable/#demos
 *
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'laypage',
		'text!tplUrl/teaching/testcentres/addpaper/addpaper.html',
		'text!tplUrl/teaching/testcentres/addpaper/page3.html',
		'text!tplUrl/teaching/testcentres/addpaper/Change.html',
		'text!tplUrl/common/login/popup.login.html',
		'popupLogin',
		'common',
		'api',
		'jquery.hovertreescroll',
		'portamento',
		'datatables.net',
		'jquery.tools',
		'jquery.easing',
		'jquery.ztree',
		'datatables.net',
		'jquery.validate',
		'jquery.validate.zh',
		'jquery.form',
		'jquery.fs.boxer',
		'css!font-awesome',
		'css!cssUrl/teaching.testcentres.organizepaper.addpaper',
		'css!cssUrl/tree.checkbox'
	],
	function (template,$,layui,layer,laypage,
	          addpaperTpl,
	          page3Tpl,
	          ChangeTpl,
	          popupLoginTpl,
	          popupLogin,
	          common,api) {

		function createPage(page,childpage,pagenumber) {
			document.title = "博学谷·院校-教师端考试中心-发布试卷-添加试卷";

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			$(".teaching").css("position","relative");
			$(".teachingBox").css("background-color","#f6f6f6");
			$(".teachingBox").css("position","relative");
			$(".teaching-nav").show();
			$(".testcentres-nav").show();

			/**
			 * 数据源
			 */
			var exampaperId;
			var teacherId = $(".home-user-name").data("id");//教师id
			var login_name = $(".home-user-name").data("name");//教师登录名
			console.log(teacherId, login_name)
			if( teacherId != undefined){
				//查询该老师对应的课程下拉列表
				var findTeacherCoursesDB = findTeacherCourses(teacherId);

			}else {
				//页面层--加载弹窗
				layer.open({
					type: 1,
					title: false,
					skin: 'layui-layer-rim', //加上边框
					area: ['500px', '500px'], //宽高
					content: popupLoginTpl
				});
				//加载弹窗登录js文件;
				popupLogin.popupLogin();
				//layer.alert("没有权限访问!");
				//window.location.href= "#/home";
			}

			$("#testcentresHtml").html(template.compile( addpaperTpl)({
				findTeacherCoursesDB: findTeacherCoursesDB
			}));


			//选择下拉的课程得到课程的id
			var courseId = $("#paperselete option:checked").val(),
			    kpointIds = new Array(),
			    exam_range = new Array(),
				courseChapterPointTreeDB = courseChapterPointTree(courseId);
				zTreeDom();

			console.log("初始化的课程ID是:",courseId)
			$("#paperselete").change(function() {
				courseId = $("#paperselete option:checked").val();
				console.log("课程ID是:",courseId)
				//发送请求
				courseChapterPointTreeDB = courseChapterPointTree(courseId);
				zTreeDom();
			});



			function zTreeDom(){
				/**
				 *
				 *  page1-  STEP2
				 * 树型结构
				 *
				 *异步加载的意思就是： 当点击展开树节点时，
				 *才去请求后台action返回点击节点的子节点
				 *数据并加载。
				 */
				var setting = {
					check: {
						enable: true
					},
					/*data: {
					 simpleData: {
					 enable: true
					 }
					 }*/
					data: {
						simpleData: {
							enable: true
						}
					},
					callback: {
						onCheck: onCheck
					}
				};
				if(courseChapterPointTreeDB.success){
					var zNodes = courseChapterPointTreeDB.resultObject;

					$(document).ready(function() {
						$.fn.zTree.init($("#tree-combined"), setting, zNodes);
					});
				}else {
					$("#tree-combined").html("<span class='error'>"+courseChapterPointTreeDB.errorMessage+"</span>");
				}


				function onCheck(e, treeId, treeNode) {
					var treeObj = $.fn.zTree.getZTreeObj("tree-combined"),
						nodes = treeObj.getCheckedNodes(true),
						v = '';
					var kp = '';
					for(var i = 0; i < nodes.length; i++) {
						//v += nodes[i].name + ",";
						//获取kpointIds名字
						exam_range.push(nodes[i].name);
						//获取kpointIds
						kpointIds.push(nodes[i].id);
					}
					kpointIds = kpointIds.toString();
					exam_range = exam_range.toString();
					console.log(exam_range)
				}
			}


			//获取page1的高度
			var TopHeight = (90 +57+80);
			var page1Height = $(".page1").height();
			var page2Height = $(".page2").height();
			var page3Height = $(".page3").height();
			var page1height = page1Height + TopHeight;
			var page2height = page2Height + TopHeight;
			var page3height = page3Height + TopHeight;
			//初始化
			//$(".addpaper").height(page1height+"px");
			console.log("page1",page1height,page2height,page3height )

			//tab切换
			scrollable();
			function scrollable(){
				$("#sliding-form").scrollable({
					onSeek: function(event,i){
						$("#status li").removeClass("active").eq(i).addClass("active");
					},
					onBeforeSeek:function(event,i){
						console.log(event)
						console.log(i)
						if(i==1){
							//$(".addpaper").height(page2height+"px");
							$(".state").addClass("ac");
							/**
							 * Page1 各个表单的数据
							 */
							var paperName = $("#papername").val(),
								duration = $("#paperwhenlong").val(),
								difficulty = $("#papertraits").val(),
								totalScore = $("#testScores").val();
							if (paperName != '' && duration != '' && difficulty != '' && totalScore != '' && courseId!= ''){
								return true;
							}else {
								return false;
							}
						}
						if (i==2) {
							//$(".addpaper").height(page3height+"px");
							$(".state").addClass("ac");
							$(".border").addClass("ac");
							var daiXuanQuestions = $("#daiXuanQuestions").val(),
								daiXuanPortion = $("#daiXuanPortion").val(),
								duoXuanQuestions = $("#duoXuanQuestions").val(),
								duoXuanPortion = $("#duoXuanPortion").val(),
								panDuanQuestions = $("#panDuanQuestions").val(),
								panDuanPortion = $("#panDuanPortion").val(),
								tianKongQuestions = $("#tianKongQuestions").val(),
								tianKongPortion = $("#tianKongPortion").val(),
								jianDaQuestions = $("#jianDaQuestions").val(),
								jianDaPortion = $("#jianDaPortion").val();

							console.log("第二个数据是:",daiXuanQuestions,daiXuanPortion,
								duoXuanQuestions,duoXuanPortion,
								panDuanQuestions,panDuanPortion,
								tianKongQuestions, tianKongPortion,
								jianDaQuestions,jianDaPortion
							)

							if (daiXuanQuestions != '' && daiXuanPortion != ''
								|| duoXuanQuestions != '' && duoXuanPortion != ''
								|| panDuanQuestions!= '' && panDuanPortion != ''
								|| tianKongQuestions!= '' && tianKongQuestions != ''
								|| jianDaQuestions!= '' && jianDaPortion != ''
							){
								return true;
							}else {
								return false;
							}
						}
						if (i==3) {
							$(".state").addClass("ac");
							$(".border").addClass("ac");
							$(".end").addClass("ac");
						}
					},
					onAddItem: function(event,i) {
						console.log(event)
						console.log("onadditem:")
						console.log(i)
					}
				});
			}



			/**
			 * page1 表单检验
			 */
			$("#page1-form").validate({
				rules : {
					papername : {
						required : true
					},
					paperwhenlong : {
						required : true,
						digits: true
					},
					papertraits : {
						required : true
					},
					testScores : {
						required : true,
						digits: true
					},
					paperselete : {
						required : true
					}
				},
				messages : {
					papername : {required : '请输入试卷名称'},
					paperwhenlong : {required : '请输入试卷时长'},
					papertraits : {required : '请选择试卷难度'},
					testScores : {required : '请输入试卷分数'},
					paperselete : {required : '请选择选择课程'}
				},
				errorElement : "p"
			});







			/***
			 * pgae1----表单提交
			 */
			//var difficulty = 'A',duration = '',kpointIds ='', paperName = '', totalScore = 10;
			var saveDB;
			var totalScore = 0;
			$('#page1-form').on("submit",function() {
				/**
				 * Page1 各个表单的数据
				 */
				var paperName = $("#papername").val(),
					duration = $("#paperwhenlong").val(),
					difficulty = $("#papertraits").val();
				totalScore = $("#testScores").val();
				console.log("kpointIds值是:",kpointIds)
				console.log("考试名称",paperName,"，考试时长:",duration,"，考试难度:",difficulty,"，考试总分:",totalScore,"，课程ID:",courseId)
				if (paperName != '' && duration != '' && difficulty != '' && totalScore != '' && courseId != ''){
					saveDB = Page1saveExamPaperBasicInfo(
						courseId,
						difficulty,
						duration,
						kpointIds,
						exam_range,
						paperName,
						totalScore,
						teacherId
					);
					if(saveDB != undefined ){
						//保存page1后对可用题数进行展示
						var daiXuanUsable = saveDB.resultObject.danxuan, duoXuanUsable = saveDB.resultObject.duoxuan,
							panDuanUsable = saveDB.resultObject.panduan, tianKongUsable = saveDB.resultObject.tiankong,
							jianDaUsable = saveDB.resultObject.jianda;
						$("#daiXuanUsable").html(daiXuanUsable);
						$("#duoXuanUsable").html(duoXuanUsable);
						$("#panDuanUsable").html(panDuanUsable);
						$("#tianKongUsable").html(tianKongUsable);
						$("#jianDaUsable").html(jianDaUsable);


						/**
						 * 表单2--检验
						 */
						$("#page2-form").validate({
							rules : {
								daiXuanQuestions : {
									digits: true,
									max: daiXuanUsable
								},
								daiXuanPortion : {digits: true},
								duoXuanQuestions : {
									digits: true,
									max: duoXuanUsable
								},
								duoXuanPortion : {digits: true},
								panDuanQuestions : {
									digits: true,
									max: panDuanUsable
								},
								panDuanPortion : {digits: true},
								tianKongQuestions : {
									digits: true,
									max: tianKongUsable
								},
								tianKongPortion : {digits: true},
								jianDaQuestions : {
									digits: true,
									max: jianDaUsable
								},
								jianDaPortion : {digits: true}
							},
							messages : {
								daiXuanQuestions : {
									required : '请输入题数',
									max: "不能大于可用题数"
								},
								daiXuanPortion : {required : '请输入分数'},
								duoXuanQuestions : {
									required : '请输入题数',
									max: "不能大于可用题数"
								},
								duoXuanPortion : {required : '请输入分数'},
								panDuanQuestions : {
									required : '请输入题数',
									max: "不能大于可用题数"
								},
								panDuanPortion : {required : '请输入分数'},
								tianKongQuestions : {
									required : '请输入题数',
									max: "不能大于可用题数"
								},
								tianKongPortion : {required : '请输入分数'},
								jianDaQuestions : {
									required : '请输入题数',
									max: "不能大于可用题数"
								},
								jianDaPortion : {required : '请输入分数'},
							},
							errorElement : "p"
						});
						$("#page2-form").validate({
							rules : {
								daiXuanQuestions : {max: true},
								daiXuanPortion : {max: true},
								duoXuanQuestions : {max: true},
								duoXuanPortion : {max: true},
								panDuanQuestions : {max: true},
								panDuanPortion : {max: true},
								tianKongQuestions : {max: true},
								tianKongPortion : {max: true},
								jianDaQuestions : {max: true},
								jianDaPortion : {max: true}
							},
							errorElement : "p"
						});
						//计算剩余分数;
						var residual = 0;
						//计算剩余分数--初始化;
						var residualtalScore = $("#residualtalScore").html("剩余"+totalScore+"分未分配");
						//page2---计算总题数与总分数
						$("#daiXuanQuestions,#daiXuanPortion,#duoXuanQuestions,#duoXuanPortion,#panDuanQuestions,#panDuanPortion,#tianKongQuestions,#tianKongPortion,#jianDaQuestions,#jianDaPortion").on('keyup', function(){

							var daiXuanQuestions = $("#daiXuanQuestions").val() || 0,
								daiXuanPortion = $("#daiXuanPortion").val() || 0,
								duoXuanQuestions = $("#duoXuanQuestions").val() || 0,
								duoXuanPortion = $("#duoXuanPortion").val() || 0,
								panDuanQuestions = $("#panDuanQuestions").val() || 0,
								panDuanPortion = $("#panDuanPortion").val() || 0,
								tianKongQuestions = $("#tianKongQuestions").val() || 0,
								tianKongPortion = $("#tianKongPortion").val() || 0,
								jianDaQuestions = $("#jianDaQuestions").val() || 0,
								jianDaPortion = $("#jianDaPortion").val() || 0;


							residual = Number(totalScore- (daiXuanQuestions*daiXuanPortion) - (duoXuanQuestions*duoXuanPortion) -
								(panDuanQuestions*panDuanPortion) - (tianKongQuestions*tianKongPortion) - (jianDaQuestions*jianDaPortion));
							//剩余分数显示到页面上
							residualtalScore = $("#residualtalScore").html("剩余"+residual+"分未分配");

							//总题数
							var totalQuestions = 0;
							if(isNaN(Number(daiXuanQuestions)+
									Number(duoXuanQuestions)+
									Number(panDuanQuestions)+
									Number(tianKongQuestions)+
									Number(jianDaQuestions))){
								return false;
							}else {
								totalQuestions =Number(daiXuanQuestions)+
									Number(duoXuanQuestions)+
									Number(panDuanQuestions)+
									Number(tianKongQuestions)+
									Number(jianDaQuestions);
								$("#totalQuestions").html("总计"+totalQuestions+"题");
							};
							//总分数
							var totalPortion = 0;
							if(isNaN(Number(daiXuanPortion)
									+Number(duoXuanPortion)
									+Number(panDuanPortion)
									+Number(tianKongPortion)
									+Number(jianDaPortion))){
								return false;
							}else {
								totalPortion = Number(((daiXuanQuestions*daiXuanPortion)+(duoXuanQuestions*duoXuanPortion)
									+(panDuanQuestions*panDuanPortion)+(tianKongQuestions*tianKongPortion)+(jianDaQuestions*jianDaPortion)
								));
								$("#totalPortion").html("共"+totalPortion+"分");
							};

							//计算每个题型的总分数
							var daiXuanTotalScore = 0, duoXuanTotalScore = 0, panDuanTotalScore = 0, tianKongTotalScore = 0, jianDaTotalScore = 0;
							if(isNaN(Number(daiXuanPortion)
									+Number(duoXuanPortion)
									+Number(panDuanPortion)
									+Number(tianKongPortion)
									+Number(jianDaPortion)
									+Number(daiXuanQuestions)
									+Number(duoXuanQuestions)
									+Number(panDuanQuestions)
									+Number(tianKongQuestions)
									+Number(jianDaQuestions)
								)){
								return false;
							}else {
								daiXuanTotalScore = Number(daiXuanPortion)* Number(daiXuanQuestions),
									duoXuanTotalScore = Number(duoXuanPortion)* Number(duoXuanQuestions),
									panDuanTotalScore = Number(panDuanPortion)* Number(panDuanQuestions),
									tianKongTotalScore = Number(tianKongPortion)* Number(tianKongQuestions),
									jianDaTotalScore = Number(jianDaPortion)* Number(jianDaQuestions);
								$("#daiXuanTotalScore").html("共"+daiXuanTotalScore+"分");
								$("#duoXuanTotalScore").html("共"+duoXuanTotalScore+"分");
								$("#panDuanTotalScore").html("共"+panDuanTotalScore+"分");
								$("#tianKongTotalScore").html("共"+tianKongTotalScore+"分");
								$("#jianDaTotalScore").html("共"+jianDaTotalScore+"分");
							};
						});
					}


				}else {
					return false;
				};
				return false; //阻止表单默认提交
			});



			$('#page2-form').on("submit",function() {
				//page2提交
				var daiXuanQuestions = $("#daiXuanQuestions").val() || 0,
					daiXuanPortion = $("#daiXuanPortion").val() || 0,
					duoXuanQuestions = $("#duoXuanQuestions").val() || 0,
					duoXuanPortion = $("#duoXuanPortion").val() || 0,
					panDuanQuestions = $("#panDuanQuestions").val() || 0,
					panDuanPortion = $("#panDuanPortion").val() || 0,
					tianKongQuestions = $("#tianKongQuestions").val() || 0,
					tianKongPortion = $("#tianKongPortion").val() || 0,
					jianDaQuestions = $("#jianDaQuestions").val() || 0,
					jianDaPortion = $("#jianDaPortion").val() || 0;


				var JSONArry = '';
				if(saveDB != undefined ) {
					exampaperId = saveDB.resultObject.exampaperId;
					if( exampaperId != undefined ){
						JSONArry = '[{"qType":0,"qNum":'+daiXuanQuestions+',"score":'+daiXuanPortion+'},{"qType":1,"qNum":'+duoXuanQuestions+',"score":'+duoXuanPortion +'},{"qType":2,"qNum":'+panDuanQuestions+',"score":'+panDuanPortion+'},{"qType":3,"qNum":'+tianKongQuestions+',"score":'+tianKongPortion+'},{"qType":4,"qNum":'+jianDaQuestions+',"score":'+jianDaPortion+'}]';
						var Page2DB = Page2makeExamPaper(login_name, exampaperId, JSONArry);
						if(!Page2DB.success){
							layer.alert(Page2DB.errorMessage);
						}
						//生成试卷方法
						var GeneratedPaperDB = GeneratedPaper(exampaperId);
						if(!GeneratedPaperDB.success){
							layer.alert(GeneratedPaperDB.errorMessage);
						}

						//换题的数源
						var PaperChangeDB = PaperChange(exampaperId, 1);

						$("#page3").html(template.compile( page3Tpl)({
							GeneratedPaper: GeneratedPaperDB,
							danXuan: GeneratedPaperDB.resultObject.danxuan.lists,
							duoXuan: GeneratedPaperDB.resultObject.duoxuan.lists,
							panDuan: GeneratedPaperDB.resultObject.panduan.lists,
							tianKong: GeneratedPaperDB.resultObject.tiankong.lists,
							jianDa: GeneratedPaperDB.resultObject.jianda.lists
						}));

						return false; //阻止表单默认提交---防止跳转

						console.log("判断题是否为空",( GeneratedPaperDB.resultObject.jianda.lists != undefined) )
						//处理试卷中的图片
						$('.J-pic-click .J-boxer').boxer({
							requestKey: 'abc123'
						});
						$('.J-pic-click img').boxer({
							requestKey: 'abc123'
						});


						/**
						 * page3交互效果与数据交互
						 */
						//题库导航
						//$('#sidebar').portamento({disableWorkaround: true});
						t = $('.fixed').offset().top;
						mh = $('.paper-main').height();
						fh = $('.fixed').height();
						$(window).scroll(function(e){
							s = $(document).scrollTop();
							if(s > t - 10){
								$('.fixed').css({'position':'fixed','top':'10px'});
								if(s + fh > mh){
									$('.fixed').css('top',mh-s-fh+'px');
								}
							}else{
								$('.fixed').css('position','');
							}
						});


							//page3---换题
						$(".J-btn-Change").on('click', function(){
							layer.open({
								type: 1,
								title: false,
								skin: 'layui-layer-rim', //加上边框
								area: ['920px','755px'], //宽高
								content: template.compile( ChangeTpl)({
									PaperChangeDB: PaperChangeDB,
									daiXuan: PaperChangeDB.resultObject.daiXuan.lists,
									duoXuan: PaperChangeDB.resultObject.duoXuan.lists,
									panDuan: PaperChangeDB.resultObject.panDuan.lists,
									tianKong: PaperChangeDB.resultObject.tianKong.lists,
									jianDa: PaperChangeDB.resultObject.jianDa.lists
								})
							});

							//奇偶行色
							$("ul.Change-cont-ul:odd").addClass("odd");
							$("ul.Change-cont-ul:even").addClass("even");

							//换题树型结构
							$(".down-input").on('click',function(){
								$(".down-box").show();
							});
							$(".J-close-Ztree").on('click',function(){
								$(".down-box").hide();
							});
							ChangeZteer();
							function ChangeZteer(){
								var setting = {
									check: {
										enable: true
									},
									/*data: {
									 simpleData: {
									 enable: true
									 }
									 }*/
									data: {
										simpleData: {
											enable: true
										}
									},
									callback: {
										onCheck: onCheck
									}
								};
								if(courseChapterPointTreeDB.success){
									var zNodes = courseChapterPointTreeDB.resultObject;

									$(document).ready(function() {
										$.fn.zTree.init($("#Change-Ztree"), setting, zNodes);
									});
								}else {
									$("#tree-combined").html("<span class='error'>"+courseChapterPointTreeDB.errorMessage+"</span>");
								}
								function onCheck(e, treeId, treeNode) {
									var treeObj = $.fn.zTree.getZTreeObj("Change-Ztree"),
										nodes = treeObj.getCheckedNodes(true),
										v = '';
									var kp = '';
									for(var i = 0; i < nodes.length; i++) {
										//v += nodes[i].name + ",";
										//获取kpointIds名字
										exam_range.push(nodes[i].name);
										//获取kpointIds
										kpointIds.push(nodes[i].id);
									}
									kpointIds = kpointIds.toString();
									exam_range = exam_range.toString();
									console.log(exam_range)
								}
							}

							//操作展开
							$(".table-body").on('click', function(e){
								var btn = e.target;
								if($(btn).hasClass("J-btn-toggle")){
									$(this).find(".box").toggle();
								}
							});

							//显示分页
							laypage({
								cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
								pages: PaperChangeDB.resultObject.totalpages, //通过后台拿到的总页数
								curr: 1, //当前页
								skin: '#2cb82c', //配色方案
								jump: function(obj, first){ //触发分页后的回调
									console.log(obj)
									if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
										PaperChange(obj.curr);
									}
								}
							});

						});


					}
				}
				return false; //阻止表单默认提交
			});

		}

		/**
		 * pgge1
		 * @returns {*}
		 * @constructor
		 */
		//查询该老师对应的课程下拉列表
		var findTeacherCourses = function(teacherId) {
			return common.requestService('bxg/examPaper/findTeacherCourses','get', {
				teacherId: teacherId
			});
		};

		//查询课程对应的章节知识点树
		var courseChapterPointTree = function(courseId) {
			return common.requestService('bxg/examPaper/courseChapterPointTree','get', {
				courseId: courseId
			});
		};

		//page1----提交申请
		var Page1saveExamPaperBasicInfo = function(
			courseId,    //课程ID
			difficulty,  //试卷难度 'A ,B,C,D
			duration,    // 时长   200
			kpointIds,   // 知识点  参考格式：  1,2,3,4,5
			exam_range,   // 知识点--中文名字  参考格式：  1,2,3,4,5
			paperName,   //试卷名称
			totalScore,  //总分数
			login_name    //教师登录名
		) {
			return common.requestService('bxg/examPaper/saveExamPaperBasicInfo','post', {
				courseId: courseId,
				difficulty: difficulty,
				duration: duration,
				kpointIds: kpointIds,
				exam_range: exam_range,
				paperName: paperName,
				totalScore: totalScore,
				login_name: login_name
			});
		};


		var Page2makeExamPaper = function( login_name, exampaperId, JSONArry) {
			return common.requestService('bxg/examPaper/makeExamPaper','post', {
				login_name: login_name,
				exampaperId: exampaperId,
				JSONArry: JSONArry
			});
		};


		//获取生成的考试数据
		var GeneratedPaper = function(exampaperId) {
			return common.requestService('bxg/examPaper/viewExamPaper','get', {
				exampaperId: exampaperId
			});
		};

		//获取生成的考试数据--换题--列表数据
		var  PaperChange = function(exampaperId,curr) {
			return common.TextrequestService('app/data/teaching-add-gpaper-change.json','get', {
				exampaperId: exampaperId,
				curr: curr
			});
		};

		return {
			createPage: createPage
		}
	});