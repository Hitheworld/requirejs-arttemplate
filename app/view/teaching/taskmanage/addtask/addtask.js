/**
 *   添加作业---添加试卷
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
		'text!tplUrl/teaching/taskmanage/addtask/addtask.html',
		'text!tplUrl/teaching/taskmanage/addtask/TaskPage3.html',
		'text!tplUrl/teaching/taskmanage/addtask/ChangeTask.html',
		'text!tplUrl/teaching/taskmanage/addtask/ChangeContentTask.html',
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
		'css!font-awesome',
		'css!cssUrl/taskmanage.addtask',
		'css!cssUrl/tree.checkbox'
	],
	function (template,$,layui,layer,laypage,
	          addtaskTpl,
	          page3Tpl,
	          ChangeTpl,
	          ChangeContentTpl,
	          popupLoginTpl,
	          popupLogin,
	          common) {

		function createPage(page,childpage,pageType, exampPaperId) {
			document.title = "博学谷·院校-教师端考试中心-发布试卷-添加试卷";

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.organizetask").addClass("testcentres-this");


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
					homeworkTplName: "",
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
			//$(".addtask").height(page1height+"px");
			console.log("page1",page1height,page2height,page3height )

			//tab切换
			new FormPageClass().scrollable();


			function FormPageClass(){
				var seftFormThis = this;
				/**
				 *  初始化加载页面
				 */
				this.loadPage = function(){
					$("#testcentresHtml").html(template.compile( addtaskTpl)({
						findTeacherCoursesDB: findTeacherCoursesDB,
						findExamBasicDB: FindExamBasicInfoDB
					}));



					// 获取试卷名称 -- 判断是否用重名
					$("#papername").on("blur", function (e) {
						var TmpName = $('#papername').val();
						var TmpNameDB = isExamTmpName(TmpName ,exampPaperId || '');
						if( TmpNameDB.resultObject.isHas){
							$("#isNamePaper").html('试卷名称重复!').show();
						}else {
							$("#isNamePaper").hide();
						}
					});
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

								$(".state").addClass("ac");


								// 返回按钮隐藏掉
								$(".return").hide();

								$(window).scroll(function(){
									$('.page3-btn-box').css({"position": ""});
								});

								// 获取试卷名称 -- 判断是否用重名
								var TmpName = $('#papername').val();
								if( pageType == undefined ){
									var id = $("#homeworkTplId").val();
									var TmpNameDB = isExamTmpName(TmpName ,id || '');
								};
								if( pageType == 'edit' ) {
									var TmpNameDB = isExamTmpName(TmpName, exampPaperId || '');
								};
								if( TmpNameDB.resultObject.isHas){
									// 设置每一屏的高度
									$('.addtask').height('1035px');
									return false;
								}


								/**
								 * Page1 各个表单的数据
								 */
								var paperName = $.trim($("#papername").val());
								if (paperName != ''&& courseId!= ''){
									var ki = seftFormThis.getZTreeName();
									if(ki){
										return true;
									};
								}else {
									return false;
								}
								return false;
							}
							if (i==2) {
								$(".addtask").height("auto");
								$(".state").addClass("ac");
								$(".border").addClass("ac");

								// 返回按钮隐藏掉
								$(".return").hide();

								$(window).scroll(function(){
									$('.page3-btn-box').css({"position": ""});
								});

								var daiXuanQuestions = $.trim($("#daiXuanQuestions").val()) || 0,
									duoXuanQuestions = $.trim($("#duoXuanQuestions").val()) || 0,
									panDuanQuestions = $.trim($("#panDuanQuestions").val()) || 0,
									tianKongQuestions = $.trim($("#tianKongQuestions").val()) || 0,
									jianDaQuestions = $.trim($("#jianDaQuestions").val()) || 0;

								console.log("第二个数据是:",daiXuanQuestions,
									duoXuanQuestions,
									panDuanQuestions,
									tianKongQuestions,
									jianDaQuestions
								)

								var daiXuanUsable = $("#daiXuanUsable").text(),
									duoXuanUsable = $("#duoXuanUsable").text(),
									panDuanUsable = $("#panDuanUsable").text();
								if( Number(daiXuanUsable) <  Number(daiXuanQuestions) ||  Number(duoXuanUsable) <  Number(duoXuanQuestions) ||  Number(panDuanUsable) <  Number(panDuanQuestions) ){
									layer.alert("请修改输入的题数!");
									return false;
								}


								if (daiXuanQuestions != ''
									|| duoXuanQuestions != ''
									|| panDuanQuestions!= ''
									|| tianKongQuestions!= ''
									|| jianDaQuestions!= ''
								){
									var ta =  Number(daiXuanQuestions) + Number(duoXuanQuestions) + Number(panDuanQuestions);
									if(ta > 0){
										return true;
									}else {
										return false;
									}
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
						nodes = treeObj.getCheckedNodes(true);
						exam_range = [];
						kpointIds = [];
					for(var i = 0; i < nodes.length; i++) {
						//获取kpointIds名字
						exam_range.push(nodes[i].name);
						//获取kpointIds
						kpointIds.push(nodes[i].id);
					}
					kpointIds = kpointIds.toString();
					exam_range = exam_range.toString();
					console.log(exam_range,"树ID：",kpointIds);

					//判断是否选中了
					for(var node in treeObj.transformToArray(nodes)){ //转换成数组
						var checked = node.checked; //检查每一个节点的选中状态
						console.log(checked + "是否选中")
						if(checked){
							//未选中
							console.log("未选中")
							return false;
							//result =result+"1 ";
						}else{
							//选中了
							console.log("选中了")
							return true;
							//result=result+"0 ";
						}
					};
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
						$("#tree-combined").html("<span class='error'>"+data.errorMessage || "服务器出错！"+"</span>");
					}


				};

				/**
				 * page1 表单检验
				 */
				var saveDB = "";
				this.page1ValidataFun = function(exampaperId ,MxamPaperType){
					$("#page1-form").validate({
						rules : {
							papername : {
								required : true
							},
							paperselete : {
								required : true
							}
						},
						messages : {
							papername : {required : '请输入练习名称'},
							paperselete : {required : '请选择选择课程'}
						},
						errorElement : "p",
						submitHandler: function(){


							// 获取试卷名称 -- 判断是否用重名
							var TmpName = $('#papername').val();
							var TmpNameDB = isExamTmpName(TmpName, exampPaperId || '');
							if( !TmpNameDB.resultObject.isHas){
								$(".addtask").height("600px");
							}




							var totalScore = 0;
							/**
							 * Page1 各个表单的数据
							 */
							var paperName = $("#papername").val();
							console.log("kpointIds值是:",kpointIds, "树字段:", exam_range);
							console.log("作业名称",paperName,"课程ID:",courseId)
							if (paperName != '' && courseId != ''){
								var ki = seftFormThis.getZTreeName();
								if(ki == undefined ){
									layer.alert("还没有选择对应的课程哦！");
									$('.addtask').height('1035px');
									return false;
								};
								if(ki){
									var type = $("#isType").val();
									if( pageType == 'edit' ){
										type = 'update';
										saveDB = Page1saveExamPaperBasicInfo(exampPaperId,courseId,kpointIds,exam_range,paperName,login_name,type);
									} else {
										if( type == 'add' ){
											saveDB = Page1saveExamPaperBasicInfo(exampaperId,courseId,kpointIds,exam_range,paperName,login_name,type);
											$("#homeworkTplId").val(saveDB.resultObject.homeworkTplId);
										};
										if( type == 'update'){
											var exampaperId = saveDB.resultObject.homeworkTplId;
											saveDB = Page1saveExamPaperBasicInfo(exampaperId,courseId,kpointIds,exam_range,paperName,login_name,type);
										};
									};
								}else {
									return false;
								};
								if(saveDB.success){
									if(saveDB != undefined ){
										//提示
										if(saveDB.resultObject.msg != undefined ) {
											layer.alert(saveDB.resultObject.msg || "服务器出错!");
										};

										//保存page1后对可用题数进行展示
										var daiXuanUsable = saveDB.resultObject.danxuan, duoXuanUsable = saveDB.resultObject.duoxuan,
											panDuanUsable = saveDB.resultObject.panduan;
										$("#daiXuanUsable").html(daiXuanUsable);
										$("#duoXuanUsable").html(duoXuanUsable);
										$("#panDuanUsable").html(panDuanUsable);

										if(pageType == 'edit'){
											//编辑时要显示的数据
											var daiXuanQuestions = saveDB.resultObject.danxuanType.questionNum,
												duoXuanQuestions = saveDB.resultObject.duoxuanType.questionNum,
												panDuanQuestions = saveDB.resultObject.panduanType.questionNum;
											$("#daiXuanQuestions").val(daiXuanQuestions);
											$("#duoXuanQuestions").val(duoXuanQuestions);
											$("#panDuanQuestions").val(panDuanQuestions);
										}

										/**
										 * 表单2--检验
										 */
										$("#page2-form").validate({
											rules : {
												daiXuanQuestions : {
													digits: true
												},
												duoXuanQuestions : {
													digits: true
												},
												panDuanQuestions : {
													digits: true
												}
											},
											messages : {
												daiXuanQuestions : {
													required : '请输入题数'
												},
												duoXuanQuestions : {
													required : '请输入题数'
												},
												panDuanQuestions : {
													required : '请输入题数'
												}
											},
											errorElement : "p",
											submitHandler: function(){
												//page2提交
												var daiXuanQuestions =  $.trim($("#daiXuanQuestions").val()) || 0,
													duoXuanQuestions =  $.trim($("#duoXuanQuestions").val()) || 0,
													panDuanQuestions =  $.trim($("#panDuanQuestions").val()) || 0;


												var JSONArry = '';
												if( saveDB.success ){
													if(saveDB != undefined ) {
														//提示
														if(saveDB.resultObject.msg != undefined ) {
															layer.alert(saveDB.resultObject.msg);
														};

														exampaperId = saveDB.resultObject.homeworkTplId;
														if( exampaperId != undefined ){
															JSONArry = '[{"qType":0,"qNum":'+daiXuanQuestions+'},{"qType":1,"qNum":'+duoXuanQuestions+'},{"qType":2,"qNum":'+panDuanQuestions+'}]';
															var daiXuanQuestions = $.trim($("#daiXuanQuestions").val()),
																duoXuanQuestions = $.trim($("#duoXuanQuestions").val()),
																panDuanQuestions = $.trim($("#panDuanQuestions").val());
															if( daiXuanQuestions != "" ||  duoXuanQuestions != ""
																|| panDuanQuestions != "" ){
																var ta =  Number(daiXuanQuestions) + Number(duoXuanQuestions) + Number(panDuanQuestions);
																if( ta > 0 ){
																	var Page2DB = Page2makeExamPaper(login_name, exampaperId, JSONArry ,MxamPaperType);
																}else {
																	layer.alert("没有填写完数据!");
																	return false;
																}
															}else {
																layer.alert("你还没有填写题数!")
																return false;
															}

															if(!Page2DB.success){
																layer.alert(Page2DB.errorMessage || "服务器出错！");
															}
															//生成试卷方法
															var GeneratedPaperDB = GeneratedPaper(exampaperId);
															if(!GeneratedPaperDB.success){
																layer.alert(GeneratedPaperDB.errorMessage  || "服务器出错！");
																return false; //阻止默认提交数据;
															}

															$("#page3").html(template.compile( page3Tpl)({
																GeneratedPaper: GeneratedPaperDB,
																danXuan: GeneratedPaperDB.resultObject.danxuan.lists,
																duoXuan: GeneratedPaperDB.resultObject.duoxuan.lists,
																panDuan: GeneratedPaperDB.resultObject.panduan.lists
															}));

															//处理试卷中的图片
															common.initImageViewer($('.pagePaper-content'));


															/**
															 * page3交互效果与数据交互
															 */
															var t = $('.fixed').offset().top;
															var mh = $('.paper-main').height();
															var fh = $('.fixed').height();
															$(window).scroll(function(e){
																var s = $(document).scrollTop();
																if(s > t - 10){
																	$('.fixed').css({'position':'fixed','top':'10px'});
																	//if(s + fh > mh){
																	//	$('.fixed').css('top',mh-s-fh+'px');
																	//}
																}else{
																	$('.fixed').css('position','');
																}
															});



															/**
															 * 解决底部浮动
															 * @type {*|jQuery}
															 */
															$(window).scroll(function(e){
																// 滚动时按钮组，就浮动
																$('.page3-btn-box').css({"position": "fixed","bottom":"0px","box-shadow":"0px 0px 20px rgba(0, 0, 0, 0.25)","-ms-filter":"progid:DXImageTransform.Microsoft.Shadow(Strength=4,Direction=135, Color='#000000')","filter":"progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000')"});
																var scrollTop = $(this).scrollTop();
																var scrollHeight = $(document).height();
																var windowHeight = $(this).height();
																if(scrollTop + windowHeight == scrollHeight){
																	// 滚动到底部时,按钮组就变成相对位置
																	$('.page3-btn-box').css({"position": "","box-shadow":"","-ms-filter":"","filter":""});
																}
															});


															//page3---换题
															ChangeTheTopic();
															function ChangeTheTopic(){
																$(".J-btn-Change").on('click', function(){
																	var ChangeThis = $(this);
																	var questionType = ChangeThis.data("type");
																	var ChangePageSize = 5,    //换题的每页显示多少条数据
																		ChangeCkpointIds= new Array() || null,               //树的id   1，2，3            //难度  ---""
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
																				nodes = treeObj.getCheckedNodes(true);
																			ChangeCkpointIds = [];
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
																	var PaperChangeDB = ChangeQuestionPage(questionType,exampaperId, 1,ChangePageSize, ChangeCkpointIds ,"");

																	var ChangeIndex = layer.open({
																		type: 1,
																		title: false,
																		scrollbar: false, // 禁止滚动
																		shade: [0.6, '#000'],
																		skin: 'layui-layer-rim', //加上边框
																		area: ['920px','650px'], //宽高
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
																				var PaperChangeDB = ChangeQuestionPage(questionType,exampaperId, obj.curr,ChangePageSize, ChangeCkpointIds, "");
																				if(PaperChangeDB.success){
																					$("#ChangeTpl").html(template.compile( ChangeContentTpl)({
																						questionType: questionType,
																						PaperChangeDB: PaperChangeDB,
																						ChangeDB: PaperChangeDB.resultObject.items,
																					}));
																					ShowHide();
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
																		questionContent = $.trim($("#questionContent").val());       //搜索的内容
																		console.log("搜索内容是:", questionContent, "树结构值是:",ChangeCkpointIds);
																		var PaperChangeDB = ChangeQuestionPage(questionType,exampaperId, 1,ChangePageSize, ChangeCkpointIds, questionContent);
																		if(PaperChangeDB.success){
																			if(PaperChangeDB.resultObject.items == ''){
																				layer.alert("没有数据!");
																			}
																			$("#ChangeTpl").html(template.compile( ChangeContentTpl)({
																				questionType: questionType,
																				PaperChangeDB: PaperChangeDB,
																				ChangeDB: PaperChangeDB.resultObject.items,
																			}));

																			//奇偶行色
																			$("ul.Change-cont-ul:odd").addClass("odd");
																			$("ul.Change-cont-ul:even").addClass("even");
																			totalpages = PaperChangeDB.resultObject.totalCount / ChangePageSize;
																			laypage({
																				cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
																				pages: totalpages, //通过后台拿到的总页数
																				curr: 1, //当前页
																				skin: '#2cb82c', //配色方案
																				jump: function(obj, first){ //触发分页后的回调
																					console.log(obj)
																					if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
																						var PaperChangeDB = ChangeQuestionPage(questionType,exampaperId, obj.curr,ChangePageSize, ChangeCkpointIds, "");
																						if(PaperChangeDB.success){
																							$("#ChangeTpl").html(template.compile( ChangeContentTpl)({
																								questionType: questionType,
																								PaperChangeDB: PaperChangeDB,
																								ChangeDB: PaperChangeDB.resultObject.items,
																							}));
																							ShowHide();
																						}else {
																							layer.alert(PaperChangeDB.errorMessage  || "服务器出错！");
																						}

																					}
																				}
																			});
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
																	ShowHide();
																	function ShowHide() {
																		$(".table-body").on('click', function(e){
																			var btn = e.target;
																			//if($(btn).hasClass("J-btn-toggle")){
																			//	$(this).find(".box").toggle();
																			//}

																			$(".table-body").on('click', function(e){
																				var btn = e.target;
																				if($(btn).hasClass("J-btn-toggle")){
																					$(".box").hide();
																					$(this).find(".box").toggle();
																				}
																			});
																		});
																	}


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
																			//
																			layer.alert(ChangeSwitchQuestionDB.resultObject.message || "换题成功!");
																			//生成试卷方法
																			var GeneratedPaperDB = GeneratedPaper(exampaperId);
																			if(!GeneratedPaperDB.success){
																				layer.alert(GeneratedPaperDB.errorMessage  || "服务器出错！");
																			};
																			$("#page3").html(template.compile( page3Tpl)({
																				GeneratedPaper: GeneratedPaperDB,
																				danXuan: GeneratedPaperDB.resultObject.danxuan.lists,
																				duoXuan: GeneratedPaperDB.resultObject.duoxuan.lists,
																				panDuan: GeneratedPaperDB.resultObject.panduan.lists
																			}));
																			ChangeTheTopic();
																		}else {
																			layer.alert(ChangeSwitchQuestionDB.errorMessage  || "服务器出错！");
																		}
																		layer.close(ChangeIndex);
																		return false; //阻止默认提交
																	});



																});
															};



															return false; //阻止表单默认提交---防止跳转
														}
													}
												} else {
													layer.alert(saveDB.errorMessage  || "服务器出错！");
													return false;
												}

												return false; //阻止表单默认提交
											}
										});

										/**
										 * 表单2--检验
										 */
										$("#daiXuanQuestions").rules("remove","max" );
										$("#daiXuanQuestions").rules("add", {
											max: daiXuanUsable,
											messages: {
												max: "不能大于可用题数"
											}
										});
										$("#duoXuanQuestions").rules("remove","max" );
										$("#duoXuanQuestions").rules("add", {
											max: duoXuanUsable,
											messages: {
												max: "不能大于可用题数"
											}
										});
										$("#panDuanQuestions").rules("remove","max" );
										$("#panDuanQuestions").rules("add", {
											max: panDuanUsable,
											messages: {
												max: "不能大于可用题数"
											}
										});

										//计算剩余分数;
										var residual = 0;
										//page2---计算总题数
										//编辑时初始化
										if(pageType == 'edit'){
											var daiXuanQuestions = $.trim($("#daiXuanQuestions").val()) || 0,
												duoXuanQuestions = $.trim($("#duoXuanQuestions").val()) || 0,
												panDuanQuestions = $.trim($("#panDuanQuestions").val()) || 0;

											//总题数
											var totalQuestions = 0;
											if(isNaN(Number(daiXuanQuestions)+
													Number(duoXuanQuestions)+
													Number(panDuanQuestions))){
												return false;
											}else {
												totalQuestions =Number(daiXuanQuestions)+
													Number(duoXuanQuestions)+
													Number(panDuanQuestions);
												$("#totalQuestions").html("总计"+totalQuestions+"题");
											};
										}
										//输入时计算总题数
										$("#daiXuanQuestions,#daiXuanPortion,#duoXuanQuestions,#duoXuanPortion,#panDuanQuestions,#panDuanPortion,#tianKongQuestions,#tianKongPortion,#jianDaQuestions,#jianDaPortion").on('keyup', function(){

											var daiXuanQuestions = $.trim($("#daiXuanQuestions").val()) || 0,
												duoXuanQuestions = $.trim($("#duoXuanQuestions").val()) || 0,
												panDuanQuestions = $.trim($("#panDuanQuestions").val()) || 0;

											//总题数
											var totalQuestions = 0;
											if(isNaN(Number(daiXuanQuestions)+
													Number(duoXuanQuestions)+
													Number(panDuanQuestions))){
												return false;
											}else {
												totalQuestions =Number(daiXuanQuestions)+
													Number(duoXuanQuestions)+
													Number(panDuanQuestions);
												$("#totalQuestions").html("总计"+totalQuestions+"题");
											};
										});
									}
								}else {
									layer.alert(saveDB.errorMessage || "服务器出错!");
									return false;
								}
							}else {
								return false;
							};
							return false; //阻止表单默认提交
						}
					});
				};
			}


			var Fun = new FormPageClass();
			Fun.page1ValidataFun(null, 'add');



			/**
			 * 如果 pageType 不为 undefined 就是编辑页面
			 */
			if( pageType == 'edit' ){
				var FindExamBasicInfoDB = EditFindExamBasicInfo(exampPaperId);
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
					newPagePaper.page1ValidataFun(exampPaperId, 'update');

					//显示page2的数据



				}else {
					layer.alert(FindExamBasicInfoDB.errorMessage  || "服务器出错！")
				}

				$('#title-edit').html('编辑练习');

			}
			////编辑页面end

		}


		//查询该练习是否重名
		var isExamTmpName = function(paperName, homeworkTplId) {
			return common.requestService('bxg/homeworkTpl/valiHomeworkTmpName','get', {
				paperName: paperName,
				homeworkTplId: homeworkTplId
			});
		};

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

		//page1----提交---作业
		var Page1saveExamPaperBasicInfo = function(
			homeworkTplId, //作业试卷id   ---如果是新增试卷就传null ,更新操作必传
			courseId,    //课程ID
			kpointIds,   // 知识点  参考格式：  1,2,3,4,5
			homework_range,   // 知识点--中文名字  参考格式：  1,2,3,4,5
			name,   //试卷名称
			login_name,    //教师登录名
			type   //新增 type=add ，修改 type=update
		) {
			return common.requestService('bxg/homeworkTpl/saveHomeworkTplBasicInfo','post', {
				homeworkTplId: homeworkTplId,
				courseId: courseId,
				kpointIds: kpointIds,
				homework_range: homework_range,
				name: name,
				login_name: login_name,
				type: type //新增 type=add ，修改 type=update
			});
		};


		/**
		 * 作业page2保存
		 * @param login_name
		 * @param homeworkTplId
		 * @param JSONArry
		 * @param type
		 * @returns {*}
		 * @constructor
		 */
		var Page2makeExamPaper = function( login_name, homeworkTplId, JSONArry , type) {
			return common.requestService('bxg/homeworkTpl/makeHomeworkTpl','post', {
				login_name: login_name,
				homeworkTplId: homeworkTplId,
				JSONArry: JSONArry,
				type: type     //新增 type=add ，修改 type=update
			});
		};


		/**
		 * 获取生成的考试数据--作业
		 * @param homeworkTplId
		 * @returns {*}
		 * @constructor
		 */
		var GeneratedPaper = function(homeworkTplId) {
			return common.requestService('bxg/homeworkTpl/viewHomeworkTpl','get', {
				homeworkTplId: homeworkTplId
			});
		};

		/**
		 * 获取生成的考试数据--换题--树型结构
		 * @param homeworkTplId
		 * @returns {*}
		 * @constructor
		 */
		var  ChangeFindSelectedTree = function( homeworkTplId ) {
			return common.requestService('bxg/homeworkTpl/findSelectedTree','get', {
				homeworkTplId: homeworkTplId
			});
		};

		//获取生成的考试数据--换题--列表数据
		var  ChangeQuestionPage = function(questionType,homeworkTplId,pageNumber,pageSize, kpointIds, questionContent) {
			return common.requestService('bxg/homeworkTpl/changeQuestionPage','get', {
				questionType: questionType,       //题型 ---  0(单选题),1（多选题）,2（判断题）,3(填空题),4(简答题)
				homeworkTplId: homeworkTplId,          // 作业卷ID
				pageNumber: pageNumber,             //当前页
				pageSize: pageSize,                 //每页显示多少条
				kpointIds: kpointIds ,             //树的id   1，2，3
				questionContent: questionContent
			});
		};


		/**
		 * 换题--提交换题申请
		 * @param homeworkTplId
		 * @param oldQuestionId
		 * @param newQuestionId
		 * @returns {*}
		 * @constructor
		 */
		var  ChangeSwitchQuestion = function(homeworkTplId,oldQuestionId,newQuestionId) {
			return common.requestService('bxg/homeworkTpl/switchQuestion','post', {
				homeworkTplId: homeworkTplId,          //试卷id
				oldQuestionId: oldQuestionId,             //旧题ID
				newQuestionId: newQuestionId,             //新题ID
			});
		};


		/***
		 * 编辑发送的接口
		 *  edit
		 */
		var  EditFindExamBasicInfo = function( homeworkTplId) {
			return common.requestService('bxg/homeworkTpl/findHomeworkTplBasicInfo','get', {
				homeworkTplId: homeworkTplId            //试卷id
			});
		};

		//编辑---查询课程对应的章节知识点树
		var FindEditSelectedTree = function(courseId, homeworkTplId) {
			return common.requestService('bxg/homeworkTpl/findEditSelectedTree','get', {
				courseId: courseId,
				homeworkTplId: homeworkTplId
			});
		};


		return {
			createPage: createPage
		}
	});