/**
 *  编辑试卷
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'laypage',
		'text!tplUrl/teaching/testcentres/editpaper/editpaper.html',
		'text!tplUrl/common/paper.html',
		'text!tplUrl/teaching/testcentres/addpaper/Change.html',
		'text!tplUrl/teaching/testcentres/addpaper/ChangeContent.html',
		'common',
		'jquery.hovertreescroll',
		'portamento',
		'jquery.validate',
		'jquery.validate.zh',
		'jquery.ztree',
		'css!font-awesome',
		'css!cssUrl/teaching.testcentres.organizepaper.addpaper',
		'css!cssUrl/testcentres.editpaper',
		'css!cssUrl/tree.checkbox'
	],
	function (template,$,layui,layer,laypage,
	          editpaperTpl,
	          page3Tpl,
	          ChangeTpl,
	          ChangeContentTpl,
	          common) {

		function createPage(page,childpage,pageType, exampPaperId) {
			document.title = "博学谷·院校-编辑试卷";
			//设置导航的active
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.organizepaper").addClass("testcentres-this");

			//生成试卷方法
			var GeneratedPaperDB = GeneratedPaper(exampPaperId);
			if(!GeneratedPaperDB.success){
				layer.alert(GeneratedPaperDB.errorMessage || "服务器出错！");
				return false; //阻止默认提交
			}

			//判断图片是否存在
			template.helper('isHasImg', function (data, format) {
				format = data.replace(/<.*?>/ig,function (tag) {
					if (tag.indexOf('<img ') === 0) {
						return '';
					} else {
						return '';
					}
				});
				return format;
			});

			//过滤图片信息
			template.helper('noImg', function (data, format) {
				format = data.replace(/<.*?>/ig,function (tag) {
					if (tag.indexOf('<img ') === 0) {
						return '';
					} else {
						return '';
					}
				});
				return format;
			});

			$("#testcentresHtml").html(template.compile( editpaperTpl)({
				GeneratedPaper: GeneratedPaperDB
			}));

			// 修改试卷名称
			$('#editPaperForm').on('submit', function(){
				var paperName = $('.paperName').val();
				var Name = UpdateExampaperName(exampPaperId, paperName);
				if ( Name == '' || paperName == "") {
					layer.alert('考试名称不能为空!');
					return false;
				}
				if(Name.resultObject.repeatStatus == 1 ){
					layer.alert('考试名称重复，请修改试卷名称!');
					return false;
				}
				if(Name.success) {
					var index = layer.alert(Name.resultObject.msg || "提交成功!",function(){
						layer.close(index);
						setTimeout(function(){
							location.href = "#/teaching/testcentres/organizepaper";
						},1000);
					});
				}
				if(paperName==""){
					layer.alert('考试名称不能为空');
				}
				return false; //阻止默认提交
			});

			Page3View(exampPaperId);

			/**
			 * 生成试卷
			 */
			function Page3View(exampaperId){

				$("#page3").html(template.compile( page3Tpl)({
					GeneratedPaper: GeneratedPaperDB,
					danXuan: GeneratedPaperDB.resultObject.danxuan.lists,
					duoXuan: GeneratedPaperDB.resultObject.duoxuan.lists,
					panDuan: GeneratedPaperDB.resultObject.panduan.lists,
					tianKong: GeneratedPaperDB.resultObject.tiankong.lists,
					jianDa: GeneratedPaperDB.resultObject.jianda.lists
				}));

				console.log("判断题是否为空",( GeneratedPaperDB.resultObject.jianda.lists != undefined) )



				/**
				 * page3交互效果与数据交互
				 */
				//题库导航
				//$('#sidebar').portamento({disableWorkaround: true});
				var t = $('.fixed').offset().top;
				var mh = $('.paper-main').height();
				$(window).scroll(function(e){
					var s = $(document).scrollTop();
					var fh = $('.fixed').height();
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
					$('.J-edit-fixed-btn').css({"position": "fixed","box-shadow":"0px 0px 20px rgba(0, 0, 0, 0.25)","-ms-filter":"progid:DXImageTransform.Microsoft.Shadow(Strength=4,Direction=135, Color='#000000')","filter":"progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000')"});
					var windowHeight = $(this).height();
					var scrollTop = $(this).scrollTop();
					var scrollHeight = $(document).height();
					console.log("当前高度:"+ windowHeight, "sroll高度"+scrollTop,"总高度:",scrollHeight)
					if(scrollTop + windowHeight == scrollHeight ){
						// 滚动到底部时,按钮组就变成相对位置
						$('.J-edit-fixed-btn').css({"position": "","box-shadow":"","-ms-filter":"","filter":""});

					}
				});


				//page3---换题
				ChangeTheTopic();
				function ChangeTheTopic(){
					$(".J-btn-Change").on('click', function(){
						var ChangeThis = $(this);
						var questionType = ChangeThis.data("type");
						var ChangePageSize = 5,    //换题的每页显示多少条数据
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
						var PaperChangeDB = ChangeQuestionPage(questionType,exampaperId, 1,ChangePageSize, ChangeCkpointIds,difficulty,questionContent);

						var ChangeIndex = layer.open({
							type: 1,
							title: false,
							scrollbar: false, // 禁止滚动
							shade: [0.6, '#000'],
							skin: 'layui-layer-rim', //加上边框
							area: ['920px','650px'], //宽高
							content:  template.compile( ChangeTpl)({
								PaperChangeDB: PaperChangeDB
							})
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
										//奇偶行色
										$("ul.Change-cont-ul:odd").addClass("odd");
										$("ul.Change-cont-ul:even").addClass("even");
										ShowHide();
									}else {
										layer.alert(PaperChangeDB.errorMessage  || "服务器出错！");
									}

								}
							}
						});


						//生成树结构
						ChangeZteer();
						//选择难度来选择数据
						$("#difficultyChange").change(function() {
							var difficulty = $("#difficultyChange option:checked").val() || '';
							var PaperChangeDB = ChangeQuestionPage(questionType,exampaperId, 1,ChangePageSize, ChangeCkpointIds,difficulty,questionContent);
							if(PaperChangeDB.success){
								if(PaperChangeDB.resultObject.items == ''){
									//layer.alert("没有数据!");
								}
								$("#ChangeTpl").html(template.compile( ChangeContentTpl)({
									questionType: questionType,
									PaperChangeDB: PaperChangeDB,
									ChangeDB: PaperChangeDB.resultObject.items,
								}));

								ShowHide();
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
											var PaperChangeDB = ChangeQuestionPage(questionType,exampaperId, obj.curr,ChangePageSize, ChangeCkpointIds,difficulty,questionContent);
											if(PaperChangeDB.success){
												$("#ChangeTpl").html(template.compile( ChangeContentTpl)({
													questionType: questionType,
													PaperChangeDB: PaperChangeDB,
													ChangeDB: PaperChangeDB.resultObject.items,
												}));
												//奇偶行色
												$("ul.Change-cont-ul:odd").addClass("odd");
												$("ul.Change-cont-ul:even").addClass("even");
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

						});

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

								ShowHide();
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
											var PaperChangeDB = ChangeQuestionPage(questionType,exampaperId, obj.curr,ChangePageSize, ChangeCkpointIds,difficulty,questionContent);
											if(PaperChangeDB.success){
												$("#ChangeTpl").html(template.compile( ChangeContentTpl)({
													questionType: questionType,
													PaperChangeDB: PaperChangeDB,
													ChangeDB: PaperChangeDB.resultObject.items,
												}));
												//奇偶行色
												$("ul.Change-cont-ul:odd").addClass("odd");
												$("ul.Change-cont-ul:even").addClass("even");
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
						function ShowHide(){
							$(".down-input").on('click',function(){
								$(".J-close-Ztree").show();
								$(".down-box").show();
							});
							$(".J-close-Ztree").on('click',function(){
								$(this).hide();
								$(".down-box").hide();
							});
						};
						ShowHide();




						//操作展开
						function ShowHide(){
							$(".table-body").on('click', function(e){
								var btn = e.target;
								if($(btn).hasClass("J-btn-toggle")){
									$(".box").hide();
									$(this).find(".box").toggle();
								}
							});
						};
						ShowHide();


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
								//换题成功后执行
								layer.alert(ChangeSwitchQuestionDB.resultObject.message || "换题成功!");
								//生成试卷方法
								var GeneratedPaperDB = GeneratedPaper(exampaperId);
								if(!GeneratedPaperDB.success){
									layer.alert(GeneratedPaperDB.errorMessage || "服务器出错！");
								};
								$("#page3").html(template.compile( page3Tpl)({
									GeneratedPaper: GeneratedPaperDB,
									danXuan: GeneratedPaperDB.resultObject.danxuan.lists,
									duoXuan: GeneratedPaperDB.resultObject.duoxuan.lists,
									panDuan: GeneratedPaperDB.resultObject.panduan.lists,
									tianKong: GeneratedPaperDB.resultObject.tiankong.lists,
									jianDa: GeneratedPaperDB.resultObject.jianda.lists
								}));
								ChangeTheTopic();
							}else {
								layer.alert(ChangeSwitchQuestionDB.errorMessage  || "服务器出错！");
							}
							//换题成功后关闭弹层
							layer.close(ChangeIndex);
							return false; //阻止默认提交
						});



					});

				};
			}

			//处理试卷中的图片
			common.initImageViewer($('.pagePaper-content-questions'));

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
		var  UpdateExampaperName = function( exampPaperId, paperName) {
			return common.requestService('bxg/examPaper/updateExampaperName','post', {
				exampaperId: exampPaperId ,           //试卷id
				paperName: paperName
			});
		};


		return {
			createPage: createPage
		}
	});