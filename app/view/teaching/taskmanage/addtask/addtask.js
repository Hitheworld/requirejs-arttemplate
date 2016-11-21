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
		'text!tplUrl/teaching/taskmanage/addtask/Change.html',
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
	          ChangeTpl,
	          popupLoginTpl,
	          popupLogin,
	          common,api) {

		function createPage(page,childpage,pagenumber) {
			document.title = "博学谷·院校-教师端考试中心-发布试卷-添加试卷";

			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.organizetask").addClass("testcentres-this");

			$(".teaching").css("position","relative");
			$(".teachingBox").css("background-color","#f6f6f6");
			$(".teachingBox").css("position","relative");
			$(".teaching-nav").show();
			$(".testcentres-nav").show();

			/**
			 * 数据源
			 */
			var teacherId = $(".home-user-name").data("id");
			if( teacherId == undefined ){
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


			//查询该老师对应的课程下拉列表
			var findTeacherCoursesDB = findTeacherCourses(teacherId);






			var GeneratedPaperDB = GeneratedPaper();
			var PaperChangeDB = PaperChange();
			console.log('添加数据是:',GeneratedPaperDB);

			$("#testcentresHtml").html(template.compile( addtaskTpl)({
				findTeacherCoursesDB: findTeacherCoursesDB,
				GeneratedPaper: GeneratedPaperDB,
				daiXuan: GeneratedPaperDB.resultObject.daiXuan.lists,
				duoXuan: GeneratedPaperDB.resultObject.duoXuan.lists,
				panDuan: GeneratedPaperDB.resultObject.panDuan.lists,
				tianKong: GeneratedPaperDB.resultObject.tianKong.lists,
				jianDa: GeneratedPaperDB.resultObject.jianDa.lists
			}));


			//选择下拉的课程得到课程的id
			var courseId = $("#paperselete option:checked").val(),
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
					data : {
						key:{
							name:"name"
						},
						simpleData : {
							enable : true,
							idKey:"id",
							pIdKey:"pId"
						}
					},
					async : {
						enable : true,
						type:"get",
						url : "./app/data/tree-combined.json",
						autoParam : [ "id", "pId" ],
						dataFilter : filter
						//异步返回后经过Filter
					},
					view: {
						selectedMulti: false
					},
					check: {
						enable: true
					},
					callback : {
						// beforeAsync: zTreeBeforeAsync, // 异步加载事件之前得到相应信息
						//OnAsyncSuccess : zTreeOnAsyncSuccess,//异步加载成功的fun
						//aOnAsyncError : zTreeOnAsyncError, //加载错误的fun
						//beforeClick : beforeClick,//捕获单击节点之前的事件回调函数
						//onRightClick: zTreeOnRightClick,
						onCheck:onCheck
					}
				};
				//treeId是treeDemo,异步加载完之后走这个方法
				function filter(treeId, parentNode, childNodes) {
					childNodes = childNodes.resultObject;
					//console.log("树数据是:",childNodes);
					if (!childNodes)
						return null;
					childNodes = eval(childNodes);
					return childNodes;
				}
				//点击节点触发事件
				function beforeClick(treeId, treeNode) {
					if (!treeNode.isParent) {
						alert("请选择父节点");
						return false;
					} else {
						return true;
					}
				}
				//异步加载失败走该方法
				function zTreeOnAsyncError(event, treeId, treeNode) {
					alert("异步加载失败!");
				}
				//异步加载成功走该方法
				function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
				}
				//右击事件
				function zTreeOnRightClick(){
					//alert("右击事件");
				}
				/**********当你点击父节点是,会异步访问controller,把id传过去*************/
				var zNodes = courseChapterPointTreeDB.resultObject;
				$.fn.zTree.init($("#tree-combined"), setting, zNodes);
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
							duoXuanQuestions = $("#duoXuanQuestions").val(),
							panDuanQuestions = $("#panDuanQuestions").val(),
							tianKongQuestions = $("#tianKongQuestions").val(),
							jianDaQuestions = $("#jianDaQuestions").val();

						console.log("第二个数据是:",daiXuanQuestions,
							duoXuanQuestions,
							panDuanQuestions,
							tianKongQuestions,
							jianDaQuestions
						)

						if (daiXuanQuestions != ''
							|| duoXuanQuestions != ''
							|| panDuanQuestions!= ''
							|| tianKongQuestions!= ''
							|| jianDaQuestions!= ''
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


			/**
			 * page1 表单检验
			 */
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
					papername : {required : '请输入作业名称'},
					paperselete : {required : '请选择选择课程'}
				},
				errorElement : "p"
			});



			//获取kpointIds
			//假设
			var kpointIds = '1,2,3';

			function onCheck(e,treeId,treeNode) {
				var treeObj = $.fn.zTree.getZTreeObj("#tree-combined");
				console.log(treeObj);
				var	nodes = treeObj.getCheckedNodes(true),
					v = "";
				for (var i = 0; i < nodes.length; i++) {
					v += nodes[i].name + ",";
					alert(nodes[i].id); //获取选中节点的值
				}
			}

			/***
			 * pgae1----表单提交
			 */
			//var difficulty = 'A',duration = '',kpointIds ='', paperName = '', totalScore = 10;

			$('#page1-form').on("submit",function() {
				/**
				 * Page1 各个表单的数据
				 */
				var paperName = $("#papername").val(),
					duration = $("#paperwhenlong").val(),
					difficulty = $("#papertraits").val(),
					totalScore = $("#testScores").val();
				console.log("考试名称",paperName,"，考试时长:",duration,"，考试难度:",difficulty,"，考试总分:",totalScore,"，课程ID:",courseId)
				if (paperName != '' && duration != '' && difficulty != '' && totalScore != '' && courseId!= ''){
					Page1saveExamPaperBasicInfo(
						courseId,
						difficulty,
						duration,
						kpointIds,
						paperName,
						totalScore,
						teacherId
					);
				}else {
					return false;
				};
				return false; //阻止表单默认提交
			});


			/**
			 * 表单2--检验
			 */
			$("#page2-form").validate({
				rules : {
					daiXuanQuestions : {
						digits: true,
						max: 25
					},
					daiXuanPortion : {digits: true},
					duoXuanQuestions : {
						digits: true,
						max: 25
					},
					duoXuanPortion : {digits: true},
					panDuanQuestions : {
						digits: true,
						max: 25
					},
					panDuanPortion : {digits: true},
					tianKongQuestions : {
						digits: true,
						max: 25
					},
					tianKongPortion : {digits: true},
					jianDaQuestions : {
						digits: true,
						max: 25
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
			//page2---计算总题数与总分数
			$("#daiXuanQuestions,#daiXuanPortion,#duoXuanQuestions,#duoXuanPortion,#panDuanQuestions,#panDuanPortion,#tianKongQuestions,#tianKongPortion,#jianDaQuestions,#jianDaPortion").on('keyup', function(){
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
				//总题数
				var totalQuestions = 0;
				if(isNaN(Number(daiXuanQuestions)+
						Number(duoXuanQuestions)+
						Number(panDuanQuestions)+
						Number(tianKongQuestions)+
						Number(jianDaQuestions))){
					return false;
				}else {
					totalQuestions = Number(daiXuanQuestions)+
						Number(duoXuanQuestions)+
						Number(panDuanQuestions)+
						Number(tianKongQuestions)+
						Number(jianDaQuestions);

					console.log(isNaN(Number(daiXuanQuestions)+
						Number(duoXuanQuestions)+
						Number(panDuanQuestions)+
						Number(tianKongQuestions)+
						Number(jianDaQuestions)));
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
					totalPortion = Number(daiXuanPortion)
						+Number(duoXuanPortion)
						+Number(panDuanPortion)
						+Number(tianKongPortion)
						+Number(jianDaPortion);
					$("#totalPortion").html("共"+totalPortion+"分");
				};

			});





			/**
			 * page3交互效果与数据交互
			 */
			//题库导航
			$('#sidebar').portamento({disableWorkaround: true});


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
			paperName,   //试卷名称
			totalScore,  //总分数
			teacherId    //教师id
		) {
			return common.requestService('bxg/examPaper/saveExamPaperBasicInfo','post', {
				courseId: courseId,
				difficulty: difficulty,
				duration: duration,
				kpointIds: kpointIds,
				paperName: paperName,
				totalScore: totalScore,
				teacherId: teacherId
			});
		};


		//获取生成的考试数据
		var GeneratedPaper = function() {
			return common.TextrequestService('app/data/teaching-add-gpaper.json','get', {});
		};

		//获取生成的考试数据--换题数据
		var  PaperChange = function(curr) {
			return common.TextrequestService('app/data/teaching-add-gpaper-change.json','get', {});
		};

		return {
			createPage: createPage
		}
	});