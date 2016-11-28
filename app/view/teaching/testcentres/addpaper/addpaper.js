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
		'text!tplUrl/common/paper.html',
		'text!tplUrl/teaching/testcentres/addpaper/Change.html',
		'text!tplUrl/teaching/testcentres/addpaper/ChangeContent.html',
		'text!tplUrl/common/login/popup.login.html',
		'text!tplUrl/common/noPermissions.html',
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
	          ChangeContentTpl,
	          popupLoginTpl,
	          noPermissionsTpl,
	          popupLogin,
	          common,api) {

		function createPage(page,childpage,pageType, exampPaperId) {
			document.title = "博学谷·院校-教师端考试中心-发布试卷-添加试卷";

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");


			/**
			 * 数据源
			 */
			var exampaperId = null;  //初始化试卷id名-----保存数据进不用传，更新数据时须要传递试卷id
			var teacherId = $(".home-user-name").data("id");//教师id
			var login_name = $(".home-user-name").data("name");//教师登录名
			var FindExamBasicInfoDB = {  //用于修改数据的初始化
				resultObject: {
					duration: "",
					difficulty: "",
					exampaperName: "",
					totalScore: "",
					courseId: ""
				}
			};
			if( teacherId != undefined){
				//查询该老师对应的课程下拉列表
				var findTeacherCoursesDB = findTeacherCourses(teacherId);

				//加载页面
				new FormPageClass().loadPage();
			}

			//选择下拉的课程得到课程的id
			var courseId = $("#paperselete option:checked").val(),
			    kpointIds = new Array(),
			    exam_range = new Array(),
				courseChapterPointTreeDB = courseChapterPointTree(courseId);
				new FormPageClass().zTreeDom(courseChapterPointTreeDB);


			$("#paperselete").change(function() {
				courseId = $("#paperselete option:checked").val();
				//重发请求
				courseChapterPointTreeDB = courseChapterPointTree(courseId);
				new FormPageClass().zTreeDom(courseChapterPointTreeDB);
			});


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
			new FormPageClass().scrollable();


			function FormPageClass(){

				/**
				 *  初始化加载页面
				 */
				this.loadPage = function(){
					$("#testcentresHtml").html(template.compile( addpaperTpl)({
						findTeacherCoursesDB: findTeacherCoursesDB,
						findExamBasicDB: FindExamBasicInfoDB
					}));
				};


				/**
				 * TAB下一步的交互
				 */
				this.scrollable = function(){
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
								var paperName = $.trim($("#papername").val()),
									duration = $.trim($("#paperwhenlong").val()),
									difficulty = $.trim($("#papertraits").val()),
									totalScore = $.trim($("#testScores").val());
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
								var daiXuanQuestions = $.trim($("#daiXuanQuestions").val()),
									daiXuanPortion = $.trim($("#daiXuanPortion").val()),
									duoXuanQuestions = $.trim($("#duoXuanQuestions").val()),
									duoXuanPortion = $.trim($("#duoXuanPortion").val()),
									panDuanQuestions = $.trim($("#panDuanQuestions").val()),
									panDuanPortion = $.trim($("#panDuanPortion").val()),
									tianKongQuestions = $.trim($("#tianKongQuestions").val()),
									tianKongPortion = $.trim($("#tianKongPortion").val()),
									jianDaQuestions = $.trim($("#jianDaQuestions").val()),
									jianDaPortion = $.trim($("#jianDaPortion").val());

								console.log("第二个数据是:",daiXuanQuestions,daiXuanPortion,
									duoXuanQuestions,duoXuanPortion,
									panDuanQuestions,panDuanPortion,
									tianKongQuestions, tianKongPortion,
									jianDaQuestions,jianDaPortion
								)

								if (daiXuanQuestions != '' && daiXuanPortion != ''
									|| duoXuanQuestions != '' && duoXuanPortion != ''
									|| panDuanQuestions!= '' && panDuanPortion != ''
									|| tianKongQuestions!= '' && tianKongPortion != ''
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
				};

				/**
				 * 获取树的值
				 */
				this.getZTreeName = function(){
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
				};


				/**
				 * 树型结构
				 */
				this.zTreeDom = function(data){
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
							},
							key : {
								checked: "checked"
							}
						},
						callback: {
							onCheck: this.getZTreeName
						}
					};
					if(data.success){
						var zNodes = data.resultObject;

						$(document).ready(function() {
							$.fn.zTree.init($("#tree-combined"), setting, zNodes);
						});
					}else {
						$("#tree-combined").html("<span class='error'>"+data.errorMessage  || "服务器出错！"+"</span>");
					}


				};

				/**
				 * page1 表单检验
				 */
				this.page1ValidataFun = function(){
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
				};

				/***
				 * pgae1----表单提交
				 *
				 *  MxamPaperType:　　bxg/examPaper/makeExamPaper　接口状态,新增 type=add,修改 type=update
				 */
				this.page1SaveFun = function(exampaperId ,MxamPaperType ){
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
						console.log("kpointIds值是:",kpointIds);
						console.log("考试名称",paperName,"，考试时长:",duration,"，考试难度:",difficulty,"，考试总分:",totalScore,"，课程ID:",courseId)
						if (paperName != '' && duration != '' && difficulty != '' && totalScore != '' && courseId != ''){

							saveDB = Page1saveExamPaperBasicInfo(exampaperId,courseId,difficulty,duration,kpointIds,exam_range,paperName,totalScore,login_name);
							if(saveDB.success){
								if(saveDB != undefined ){
									//提示
									if(saveDB.resultObject.msg != undefined ) {
										layer.alert(saveDB.resultObject.msg || "服务器出错！");
									};

									//保存page1后对可用题数进行展示
									var daiXuanUsable = saveDB.resultObject.danxuan, duoXuanUsable = saveDB.resultObject.duoxuan,
										panDuanUsable = saveDB.resultObject.panduan, tianKongUsable = saveDB.resultObject.tiankong,
										jianDaUsable = saveDB.resultObject.jianda;
									$("#daiXuanUsable").html(daiXuanUsable);
									$("#duoXuanUsable").html(duoXuanUsable);
									$("#panDuanUsable").html(panDuanUsable);
									$("#tianKongUsable").html(tianKongUsable);
									$("#jianDaUsable").html(jianDaUsable);

									if(pageType == 'edit'){
										//编辑时要显示的数据
										var daiXuanQuestions = saveDB.resultObject.danxuanType.questionNum,
											daiXuanPortion = saveDB.resultObject.danxuanType.score,
											daiXuanTotalScore = saveDB.resultObject.danxuanType.totalScore,

											duoXuanQuestions = saveDB.resultObject.duoxuanType.questionNum,
											duoXuanPortion = saveDB.resultObject.duoxuanType.score,
											duoXuanTotalScore = saveDB.resultObject.duoxuanType.totalScore,

											panDuanQuestions = saveDB.resultObject.panduanType.questionNum,
											panDuanPortion = saveDB.resultObject.panduanType.score,
											panDuanTotalScore = saveDB.resultObject.panduanType.totalScore,

											tianKongQuestions = saveDB.resultObject.tiankongType.questionNum,
											tianKongPortion = saveDB.resultObject.tiankongType.score,
											tianKongTotalScore = saveDB.resultObject.tiankongType.totalScore,

											jianDaQuestions = saveDB.resultObject.jiandaType.questionNum,
											jianDaPortion = saveDB.resultObject.jiandaType.score,
											jianDaTotalScore = saveDB.resultObject.jiandaType.totalScore;

										$("#daiXuanQuestions").val(daiXuanQuestions);
										$("#daiXuanPortion").val(daiXuanPortion);
										$("#daiXuanTotalScore").html("共"+daiXuanTotalScore+"分");

										$("#duoXuanQuestions").val(duoXuanQuestions);
										$("#duoXuanPortion").val(duoXuanPortion);
										$("#duoXuanTotalScore").html("共"+duoXuanTotalScore+"分");

										$("#panDuanQuestions").val(panDuanQuestions);
										$("#panDuanPortion").val(panDuanPortion);
										$("#panDuanTotalScore").html("共"+panDuanTotalScore+"分");

										$("#tianKongQuestions").val(tianKongQuestions);
										$("#tianKongPortion").val(tianKongPortion);
										$("#tianKongTotalScore").html("共"+tianKongTotalScore+"分");

										$("#jianDaQuestions").val(jianDaQuestions);
										$("#jianDaPortion").val(jianDaPortion);
										$("#jianDaTotalScore").html("共"+jianDaTotalScore+"分");
									}

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

										var daiXuanQuestions = $.trim($("#daiXuanQuestions").val()) || 0,
											daiXuanPortion = $.trim($("#daiXuanPortion").val()) || 0,
											duoXuanQuestions = $.trim($("#duoXuanQuestions").val()) || 0,
											duoXuanPortion = $.trim($("#duoXuanPortion").val()) || 0,
											panDuanQuestions = $.trim($("#panDuanQuestions").val()) || 0,
											panDuanPortion = $.trim($("#panDuanPortion").val()) || 0,
											tianKongQuestions = $.trim($("#tianKongQuestions").val()) || 0,
											tianKongPortion = $.trim($("#tianKongPortion").val()) || 0,
											jianDaQuestions = $.trim($("#jianDaQuestions").val()) || 0,
											jianDaPortion = $.trim($("#jianDaPortion").val()) || 0;


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
								layer.alert(saveDB.errorMessage  || "服务器出错!");
								return false;
							}

							$('#page2-form').on("submit",function() {
								//page2提交
								var daiXuanQuestions = $.trim($("#daiXuanQuestions").val()) || 0,
									daiXuanPortion = $.trim($("#daiXuanPortion").val()) || 0,
									duoXuanQuestions = $.trim($("#duoXuanQuestions").val()) || 0,
									duoXuanPortion = $.trim($("#duoXuanPortion").val()) || 0,
									panDuanQuestions = $.trim($("#panDuanQuestions").val()) || 0,
									panDuanPortion = $.trim($("#panDuanPortion").val()) || 0,
									tianKongQuestions = $.trim($("#tianKongQuestions").val()) || 0,
									tianKongPortion = $.trim($("#tianKongPortion").val()) || 0,
									jianDaQuestions = $.trim($("#jianDaQuestions").val()) || 0,
									jianDaPortion = $.trim($("#jianDaPortion").val()) || 0;


								var JSONArry = '';
								if( saveDB.success ){
									if(saveDB != undefined ) {
										//提示
										if(saveDB.resultObject.msg != undefined ) {
											layer.alert(saveDB.resultObject.msg);
										};

										exampaperId = saveDB.resultObject.exampaperId;
										if( exampaperId != undefined ){
											JSONArry = '[{"qType":0,"qNum":'+daiXuanQuestions+',"score":'+daiXuanPortion+'},{"qType":1,"qNum":'+duoXuanQuestions+',"score":'+duoXuanPortion +'},{"qType":2,"qNum":'+panDuanQuestions+',"score":'+panDuanPortion+'},{"qType":3,"qNum":'+tianKongQuestions+',"score":'+tianKongPortion+'},{"qType":4,"qNum":'+jianDaQuestions+',"score":'+jianDaPortion+'}]';
											var Page2DB = Page2makeExamPaper(login_name, exampaperId, JSONArry ,MxamPaperType);
											if(!Page2DB.success){
												layer.alert(Page2DB.errorMessage || "服务器出错！");
											}
											//生成试卷方法
											var GeneratedPaperDB = GeneratedPaper(exampaperId);
											if(!GeneratedPaperDB.success){
												layer.alert(GeneratedPaperDB.errorMessage || "服务器出错！");
											}

											$("#page3").html(template.compile( page3Tpl)({
												GeneratedPaper: GeneratedPaperDB,
												danXuan: GeneratedPaperDB.resultObject.danxuan.lists,
												duoXuan: GeneratedPaperDB.resultObject.duoxuan.lists,
												panDuan: GeneratedPaperDB.resultObject.panduan.lists,
												tianKong: GeneratedPaperDB.resultObject.tiankong.lists,
												jianDa: GeneratedPaperDB.resultObject.jianda.lists
											}));

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
												var ChangeThis = $(this);
												var questionType = ChangeThis.data("type");
												var ChangePageSize = 10,    //换题的每页显示多少条数据
													ChangeCkpointIds= new Array() || null,               //树的id   1，2，3
													difficulty = $("#difficultyChange  option:selected").val() || null,             //难度  ---""
													questionContent = $.trim($("#questionContent").val()) || null;       //搜索的内容

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
													//换题树
													var ChangeTreeDB = ChangeFindSelectedTree(exampaperId);
													if(ChangeTreeDB.success){
														var zNodes = ChangeTreeDB.resultObject;

														$(document).ready(function() {
															$.fn.zTree.init($("#Change-Ztree"), setting, zNodes);
														});
													}else {
														$("#tree-combined").html("<span class='error'>"+ChangeTreeDB.errorMessage  || "服务器出错！"+"</span>");
													}
													function onCheck(e, treeId, treeNode) {
														var treeObj = $.fn.zTree.getZTreeObj("Change-Ztree"),
															nodes = treeObj.getCheckedNodes(true),
															v = '';
														var kp = '';
														for(var i = 0; i < nodes.length; i++) {
															//v += nodes[i].name + ",";
															//获取kpointIds名字
															//exam_range.push(nodes[i].name);
															//获取kpointIds
															ChangeCkpointIds.push(nodes[i].id);
														}
														ChangeCkpointIds = ChangeCkpointIds.toString();
														//exam_range = exam_range.toString();
														console.log(ChangeCkpointIds)
													}
												}

												//换题的数据源
												var PaperChangeDB = ChangeQuestionPage(questionType,exampaperId, 1,ChangePageSize, ChangeCkpointIds,difficulty,questionContent);

												layer.open({
													type: 1,
													title: false,
													skin: 'layui-layer-rim', //加上边框
													area: ['920px','755px'], //宽高
													content: ChangeTpl
												});
												if(PaperChangeDB.success){
													$("#ChangeTpl").html(template.compile( ChangeContentTpl)({
														questionType: questionType,
														PaperChangeDB: PaperChangeDB,
														ChangeDB: PaperChangeDB.resultObject.items,
													}));
												}else {
													layer.alert(PaperChangeDB.errorMessage  || "服务器出错！");
												}
												//显示分页
												//计算总页数
												var totalpages = PaperChangeDB.resultObject.totalCount / ChangePageSize;
												laypage({
													cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
													pages: totalpages, //通过后台拿到的总页数
													curr: 1, //当前页
													skin: '#2cb82c', //配色方案
													jump: function(obj, first){ //触发分页后的回调
														console.log(obj)
														if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
															var PaperChangeDB = ChangeQuestionPage(questionType,exampaperId, obj.curr,ChangePageSize, ChangeCkpointIds,difficulty,questionContent);
															if(PaperChangeDB.success){
																$("#ChangeTpl").html(template.compile( ChangeContentTpl)({
																	questionType: questionType,
																	PaperChangeDB: PaperChangeDB,
																	ChangeDB: PaperChangeDB.resultObject.items,
																}));
															}else {
																layer.alert(PaperChangeDB.errorMessage  || "服务器出错！");
															}

														}
													}
												});

												//生成树结构
												ChangeZteer();
												//搜索提交
												$("#searchForm").on('submit', function(event){
													ChangeZteer();
													difficulty = $.trim($("#difficultyChange option:selected").val()),             //难度  ---""
														questionContent = $("#questionContent").val();       //搜索的内容
													console.log("搜索内容是:", questionContent, "难度是:",difficulty, "树结构值是:",ChangeCkpointIds);
													var PaperChangeDB = ChangeQuestionPage(questionType,exampaperId, 1,ChangePageSize, ChangeCkpointIds,difficulty,questionContent);
													if(PaperChangeDB.success){
														if(PaperChangeDB.resultObject.items == ''){
															layer.alert("没有数据!");
														}
														$("#ChangeTpl").html(template.compile( ChangeContentTpl)({
															questionType: questionType,
															PaperChangeDB: PaperChangeDB,
															ChangeDB: PaperChangeDB.resultObject.items,
														}));
													}else {
														layer.alert(PaperChangeDB.errorMessage  || "服务器出错！");
													}

													return false;  //阻止默认提交
													//event.preventDefault();     //阻止提交按钮的默认行为（提交表单）
												});

												//奇偶行色
												$("ul.Change-cont-ul:odd").addClass("odd");
												$("ul.Change-cont-ul:even").addClass("even");

												//换题树型结构
												$(".down-input").on('click',function(){
													$(".J-close-Ztree").show();
													$(".down-box").show();
												});
												$(".J-close-Ztree").on('click',function(){
													$(this).hide();
													$(".down-box").hide();
												});



												//操作展开
												$(".table-body").on('click', function(e){
													var btn = e.target;
													if($(btn).hasClass("J-btn-toggle")){
														$(this).find(".box").toggle();
													}
												});

												//开始换题
												$("#ChangeSave").on('submit', function(){
													//获取选中的哪条数据
													var oldQuestionId = ChangeThis.data("id"),  //旧题的id
														newQuestionId = $("input[name='subject']:checked").val();   //新题的id
													var ChangeSwitchQuestionDB =  ChangeSwitchQuestion(exampaperId,oldQuestionId,newQuestionId);
													if(ChangeSwitchQuestionDB.success){
														//if(ChangeSwitchQuestionDB.resultObject.status == '1'){
														//	layer.alert("换题成功!");
														//} else {
														//	layer.alert(ChangeSwitchQuestionDB.resultObject.message);
														//}
														layer.alert(ChangeSwitchQuestionDB.resultObject.message);
													}else {
														layer.alert(ChangeSwitchQuestionDB.errorMessage  || "服务器出错！");
													}
													return false; //阻止默认提交
												});



											});


											return false; //阻止表单默认提交---防止跳转
										}
									}
								} else {
									layer.alert(saveDB.errorMessage  || "服务器出错！");
									return false;
								}

								return false; //阻止表单默认提交
							});


						}else {
							return false;
						};
						return false; //阻止表单默认提交
					});

				};


			}


			var Fun = new FormPageClass();
			Fun.page1ValidataFun();
			Fun.page1SaveFun(null, 'add');



			/**
			 * 如果 pageType 不为 undefined 就是编辑页面
			 */
			if( pageType == 'edit' ){

				var FindExamBasicInfoDB = EditFindExamBasicInfo(exampPaperId, teacherId);
				if(FindExamBasicInfoDB.success){
					new FormPageClass().loadPage(); //加载页面
					var EditTreeDB;

					var newPagePaper = new FormPageClass();
					//加载树
					var courseId = $("#paperselete option:checked").val();
					$("#paperselete").change(function() {
						courseId = $("#paperselete option:checked").val();
						console.log("编辑---课程ID是:",courseId)
						//发送请求
						EditTreeDB = FindEditSelectedTree(courseId, exampPaperId);
						newPagePaper.zTreeDom(EditTreeDB);
					});
					EditTreeDB = FindEditSelectedTree(courseId, exampPaperId);


					newPagePaper.zTreeDom(EditTreeDB);
					newPagePaper.getZTreeName();
					//tab切换
					newPagePaper.scrollable();
					newPagePaper.page1ValidataFun();
					newPagePaper.page1SaveFun(exampPaperId, 'update');

					//显示page2的数据



				}else {
					layer.alert(FindExamBasicInfoDB.errorMessage  || "服务器出错！")
				}

			}
			////编辑页面end

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
			exampaperId, //试卷id   ---如果是新增试卷就传null ,更新操作必传
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
				exampaperId: exampaperId,
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


		var Page2makeExamPaper = function( login_name, exampaperId, JSONArry , type) {
			return common.requestService('bxg/examPaper/makeExamPaper','post', {
				login_name: login_name,
				exampaperId: exampaperId,
				JSONArry: JSONArry,
				type: type     //新增 type=add ，修改 type=update
			});
		};


		//获取生成的考试数据
		var GeneratedPaper = function(exampaperId) {
			return common.requestService('bxg/examPaper/viewExamPaper','get', {
				exampaperId: exampaperId
			});
		};

		//获取生成的考试数据--换题--树型结构
		var  ChangeFindSelectedTree = function( exampaperId ) {
			return common.requestService('bxg/examPaper/findSelectedTree','get', {
				exampaperId: exampaperId
			});
		};

		//获取生成的考试数据--换题--列表数据
		var  ChangeQuestionPage = function(questionType,exampaperId,pageNumber,pageSize, kpointIds, difficulty ,questionContent) {
			return common.requestService('bxg/examPaper/changeQuestionPage','post', {
				questionType: questionType,       //题型 ---  0(单选题),1（多选题）,2（判断题）,3(填空题),4(简答题)
				exampaperId: exampaperId,          //试卷id
				pageNumber: pageNumber,             //当前页
				pageSize: pageSize,                 //每页显示多少条
				kpointIds: kpointIds,               //树的id   1，2，3
				difficulty: difficulty,             //难度  ---""
				questionContent: questionContent   //题干  输入题干搜索
			});
		};


		//换题--提交换题申请
		var  ChangeSwitchQuestion = function(exampaperId,oldQuestionId,newQuestionId) {
			return common.requestService('bxg/examPaper/switchQuestion','post', {
				exampaperId: exampaperId,          //试卷id
				oldQuestionId: oldQuestionId,             //当前页
				newQuestionId: newQuestionId,                 //每页显示多少条
			});
		};


		/***
		 * 编辑发送的接口
		 *  edit
		 */
		var  EditFindExamBasicInfo = function( exampPaperId, teacherId) {
			return common.requestService('bxg/examPaper/findExamBasicInfo','get', {
				exampPaperId: exampPaperId ,           //试卷id
				teacherId: teacherId
			});
		};

		//编辑---查询课程对应的章节知识点树
		var FindEditSelectedTree = function(courseId, exampaperId) {
			return common.requestService('bxg/examPaper/findEditSelectedTree','get', {
				courseId: courseId,
				exampaperId: exampaperId
			});
		};

		return {
			createPage: createPage
		}
	});