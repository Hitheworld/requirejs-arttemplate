/**
 *   创建考试
 *   datatable中文文档:http://datatables.club/manual/data.html
 *
 *    https://datatables.net/extensions/select/examples/initialisation/checkbox.html
 *
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'laypage',
		'text!tplUrl/teaching/testcentres/createtest/createtest.html',
		'text!tplUrl/teaching/testcentres/createtest/addTestPaper.html',
		'text!tplUrl/teaching/testcentres/createtest/addTestPaper-Table.html',
		'text!tplUrl/teaching/testcentres/createtest/PacketSend.html',
		'common',
		'api',
		'xvCalendar',
		'jquery.validate',
		'jquery.validate.zh',
		'css!font-awesome',
		'css!cssUrl/teaching.testcentres.createtest'
	],
	function (template,$,layui,layer,laypage,
	          createtestTpl,
	          addTestPaperTpl,
	          addTestPaperTableTpl,
	          packetSendTpl,
	          common,api,Chinese) {

		function createPage(page,childpage,pageType, exampPaperId) {
			document.title = "博学谷·院校-教师端考试中心-发布试卷";
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.releasepapers").addClass("testcentres-this");

			var login_name = $(".home-user-name").data("name");//教师登录名
			var teacherId = $(".home-user-name").data("id");//教师登录名

			//查询该老师对应的课程下拉列表
			var findTeacherCoursesDB = findTeacherCourses(teacherId);
			//查询班级
			var findClassDB = findClass(teacherId);
			var squadId = '', courseId = null,difficulty = null, pageNumber = 1, pageSize = 9;
			//弹出层的试卷数据源
			var TestPaperDB = TestPaper(login_name, difficulty, courseId, pageNumber, pageSize);

			//修改时的数据
			var EditLoadDB = {
				resultObject: {
					squadId: "",
					courseId: "",
					paperTplName: "",
					groups: ""
				}
			};
			if( pageType == 'edit'){
				//修改加载的数据
				EditLoadDB = EditLoad(exampPaperId);
				if (!EditLoadDB.success){
					layer.alert(EditLoadDB.errorMessage  || "服务器出错！");
				}
			}



			$("#testcentresHtml").html(template.compile( createtestTpl)({
				Courses: findTeacherCoursesDB,   //课程
				Class:findClassDB,   //班级
				EditLoad: EditLoadDB,   //加载的修改数据
				pageType: pageType  //判断是否显示
			}));

			//初始化当前的分组，获取班级id
			squadId = $("#squadId option:checked").val();

			//发送当前班级的分组
			var getGroupListDB = getGroupList(squadId);


			var groups = "";
			if( pageType == 'edit') {
				groups = (EditLoadDB.resultObject.groups).split(",");
			}
			//初始化当前班级的分组
			$("#PacketSend").html(template.compile( packetSendTpl)({
				GroupList:getGroupListDB ,  //分组数据
				EditLoad: EditLoadDB ,  //加载的修改数据
				groups: groups   //加载的修改数据
			}));


			//根据下拉的班级调用显示不同的数据
			$("#squadId").change(function() {
				squadId = $("#squadId option:checked").val();
				//重发请求
				//根据班级查询该班级的分组数据
				getGroupListDB = getGroupList(squadId);
				if(!getGroupListDB.success){
					layer.alert(getGroupListDB.errorMessage || "服务器出错！");
				}
				$("#PacketSend").html(template.compile( packetSendTpl)({
					GroupList:getGroupListDB,
					EditLoad: EditLoadDB ,  //加载的修改数据
					groups: groups   //加载的修改数据
				}));
				//把所有的checked 置为空,判断是否选择下拉的班级来显示cheched是否置空
				console.log(EditLoadDB.resultObject.squadId ,squadId)
				if( EditLoadDB.resultObject.squadId != squadId ){
					$("input[type='checkbox']").attr("checked", false);
				};


			});



			//日历控件---开始时间
			var startTimeDate = {//example 1 opts
					'targetId':'startTime',//时间写入对象的id
					'triggerId': 'startTime',//触发事件的对象id
					'alignId':'startTime',//日历对齐对象
					'format':'-',//时间格式 默认'YYYY-MM-DD HH:MM:SS'
					'hms':'on'
				};
			xvDate(startTimeDate);

			//分组发送交互
			if($("input:radio[checked='checked']").is(':checked')){
				$(".PacketSend").show();
			};
			$("input[type='radio']").on('click', function(){
				if($("input:radio[value='grouping']").is(':checked')){
					$(".PacketSend").show();
					return true;
				}else{
					$(".PacketSend").hide();
					return true;
				}
			});

			$("#createtestForm").validate({
				rules : {
					squadId : {
						required : true
					},
					courseId : {
						required : true,
						digits: true
					},
					paperTplId : {
						required : true
					},
					startTime : {
						required : true,
						date: true
					},
					groups : {
						required : true
					}
				},
				messages : {
					squadId : {required : '请选择班级'},
					courseId : {required : '请选择课程'},
					paperTplId : {required : '请选择试卷'},
					startTime : {required : '请选择设置开始时间'},
					groups : {required : '请选择发送范围'}
				},
				errorElement : "p"
			});

			//保存数据
			$("#createtestForm").on('submit', function(){
				var squadId =  $.trim($("#squadId").val()),  //班级：
					courseId =  $.trim($("#courseId").val()),    //课程：
					paperTplId =  $.trim($("#paperTplId").val()),  //试卷：
					startTime =  $.trim($("#startTime").val()),  //开始时间：
					groups = ""; //发送对象：
				if(pageType == 'edit'){
					//编辑时获取分组的信息
					$('input[name=groups]:checked').each(function(i){
						if(0==i){
							groups = $(this).val();
						}else{
							groups += (","+$(this).val());
						}
					});
				}else {
					if($('#sendgroups').is(':checked')){
						groups = $('input[name=groups]:checked').val() || '';
					}else {
						$('input[name=groups]:checked').each(function(i){
							if(0==i){
								groups = $(this).val();
							}else{
								groups += (","+$(this).val());
							}
						});
					}
				}
				console.log("发送对象",groups);

				if(login_name != '' && squadId != '' && courseId != '' && paperTplId != '' && startTime != ''){
					var saveCreateTestDB = saveCreateTest(exampPaperId ,login_name,squadId, courseId, paperTplId,startTime , groups);
					if(saveCreateTestDB.success){
						var index = layer.alert("提交成功!",function(){
							layer.close(index);
							setTimeout(function(){
								location.href = "#/teaching/testcentres/releasepapers";
							},1000);
						});
					}else {
						layer.alert(saveCreateTestDB.errorMessage || '服务器出错!');
						return false; //阻止默认提交
					}
				}

				return false; //阻止默认提交
			});



			//添加试卷
			$(".J-add-testpaper").on('click', function(){
				var seft = $(this);
				var index = layer.open({  //获取窗口索引
					type: 1,
					title: "选择试卷 课程名称课程名称",
					skin: 'layui-layer-rim', //加上边框
					area: ['925px','820px'], //宽高
					content: template.compile( addTestPaperTpl)({

					}),
					//btn: ["确定","消息"]
				});

				var LayerThickClass = new LayerThickness();
				LayerThickClass.init(TestPaperDB);
				/**
				 * 弹出层对象方法
				 * @constructor
				 */
				function LayerThickness(){
					var LayerThis = this;

					/**
					 * 初始化全部方法
					 * @param data
					 */
					this.init = function(data){
						LayerThis.PageTpl(data);
						LayerThis.ToValueOf();
						LayerThis.Paging();
					};

					this.PageTpl = function(data){
						//生成表格
						var PaperDB = data.resultObject.items;
						$("#addTestPaperTable").html(template.compile( addTestPaperTableTpl)({
							TestPaperDB: data,
							TestPager: PaperDB
						}));
						//奇偶行色
						$(".table-tr:odd").addClass("odd");
						$(".table-tr:even").addClass("even");
						LayerThis.Paging();
					};

					/**
					 * 给父页面传值
					 * @constructor
					 */
					this.ToValueOf = function(){
						$('#transmit').on('click', function(){
							//获取弹出层的试卷id和试卷名称
							var paperTplId = $(".paperTplId:checked ").val(),
								paperName = $(".paperTplId:checked").data('name');
							console.log(paperTplId,paperName);
							if(paperTplId != undefined || paperName != undefined){
								//如果有选择试卷就修改状态
								$("#parentIframe").html('<span class="testName"></span>');
								seft.html('修改试卷');
								parent.$('.testName').text(paperName);
								parent.$('#paperTplId').val(paperTplId);
								//parent.layer.tips('Look here', '#parentIframe', {time: 5000});
								parent.layer.close(index);
							}else {
								layer.alert("请选择试卷");
							}

						});
					};

					/**
					 * 分页方法
					 * @constructor
					 */
					this.Paging = function(){
						laypage({
							cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
							pages: TestPaperDB.resultObject.totalPageCount, //通过后台拿到的总页数
							curr: 1, //当前页
							skin: '#2cb82c', //配色方案
							jump: function(obj, first){ //触发分页后的回调
								if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
									//数据源
									var TestPaperDB = TestPaper(login_name, difficulty, courseId, obj.curr, pageSize);
									var data = TestPaperDB.resultObject.items;
									$("#addTestPaperTable").html(template.compile( addTestPaperTableTpl)({
										TestPaperDB: TestPaperDB,
										TestPager: data
									}));
									//奇偶行色
									$(".table-tr:odd").addClass("odd");
									$(".table-tr:even").addClass("even");
								}
							}
						});
					};
				};







				//弹出层--选择难度来选择数据
				$("#organizepaper-peper-difficulty").change(function() {
					difficulty = $("#organizepaper-peper-difficulty option:checked").val();
					//重发请求
					var TestPaperDB = TestPaper(login_name, difficulty, courseId, pageNumber, pageSize);
					//调用类中的初始化方法
					LayerThickClass.init(TestPaperDB);
					if(!TestPaperDB.success){
						layer.alert(TestPaperDB.errorMessage || "服务器出错！")
					}else {

					}
				});





			});




		}


		//查询该老师对应的班级下拉列表
		var findClass = function(teacherId) {
			return common.requestService('bxg/teaching/squad/noGraduateSquad','get', {
				teacherId: teacherId
			});
		};

		//查询该老师对应的课程下拉列表
		var findTeacherCourses = function(teacherId) {
			return common.requestService('bxg/examPaper/findTeacherCourses','get', {
				teacherId: teacherId
			});
		};

		//查询某班级对应的分组数据
		var getGroupList = function(squadId) {
			return common.requestService('bxg/teaching/squad/squadGroupList','get', {
				squadId: squadId
			});
		};

		//保存发布试卷数据
		var saveCreateTest = function(id,createPerson, squadId, courseId, paperTplId,startTime , groups) {
			return common.requestService('bxg/exam/save','post', {
				id: id,  //试卷id
				createPerson: createPerson,
				squadId: squadId , //班级：
				courseId: courseId, //课程：
				paperTplId: paperTplId, //试卷：
				startTime: startTime, //开始时间：
				groups: groups //发送对象：
			});
		};

		//获取考试试卷数据
		var TestPaper = function(login_name, difficulty, courseId, pageNumber, pageSize) {
			return common.requestService('bxg/examPaper/findExamPaperPage','get', {
				login_name: login_name,
				difficulty: difficulty,
				courseId: courseId,
				pageNumber: pageNumber,
				pageSize: pageSize
			});
		};


		//获取加载的修改数据
		var EditLoad = function(id) {
			return common.requestService('bxg/exam/load','get', {
				id: id
			});
		};



		return {
			createPage: createPage
		}
	});