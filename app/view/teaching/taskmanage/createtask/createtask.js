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
		'text!tplUrl/teaching/taskmanage/createtask/createtask.html',
		'text!tplUrl/teaching/taskmanage/createtask/createtaskCourses.html',
		'text!tplUrl/teaching/taskmanage/createtask/createAddTask.html',
		'text!tplUrl/teaching/taskmanage/createtask/createAddTask-Table.html',
		'text!tplUrl/teaching/taskmanage/createtask/createAddTaskPacketSend.html',
		'common',
		'jquery-ui-timepicker-zh-CN',
		'jquery.validate',
		'jquery.validate.zh',
		'css!font-awesome',
		'css!cssUrl/taskmanage.createtask'
	],
	function (template,$,layui,layer,laypage,
	          createTaskTpl,
	          createtaskCoursesTpl,
	          createAddTaskTpl,
	          createAddTaskTableTpl,
	          createAddTaskPacketSendTpl,
	          common) {

		function createPage(page,childpage,pageType, exampPaperId) {
			document.title = "博学谷·院校-教师端考试中心-发布试卷";
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teaching").addClass("active");

			//设置头部导航
			$(".testcentres-tab-title li").removeClass("testcentres-this");
			$(".testcentres-tab-title li.releasetask").addClass("testcentres-this");

			var login_name = $(".home-user-name").data("name");//教师登录名
			var teacherId = $(".home-user-name").data("id");//教师登录名

			//查询班级
			var findClassDB = findClass(teacherId);
			var pageNumber = 1, pageSize = 5;
			//查询该老师对应的课程下拉列表
			var findTeacherCoursesDB = "";
			var findHomeworkTplPageDB = "";

			//修改时的数据
			var EditLoadDB = {
				resultObject: {
					squadId: "",
					courseId: "",
					paperTplName: "",
					groups: ""
				}
			};
			if( pageType == 'edit' || pageType == 'updateEndTime'){
				//修改加载的数据
				EditLoadDB = EditLoad(exampPaperId);
				if (!EditLoadDB.success){
					layer.alert(EditLoadDB.errorMessage  || "服务器出错！");
				}
			};


			$("#testcentresHtml").html(template.compile( createTaskTpl)({
				Class:findClassDB,   //班级
				EditLoad: EditLoadDB,   //加载的修改数据
				pageType: pageType  //判断是否显示
			}));

			//初始化当前的分组，获取班级id
			var squadId = $("#squadId option:checked").val();
			//查询该老师对应的课程下拉列表
			findTeacherCoursesDB = findTeacherCourses(teacherId, squadId);
			if(!findTeacherCoursesDB.success){
				layer.alert(findTeacherCoursesDB.errorMessage ||"服务出错啦!")
				return false;
			}
			$("#createtaskCourses").html(template.compile( createtaskCoursesTpl)({
				Courses: findTeacherCoursesDB,  //课程
				EditLoad: EditLoadDB,   //加载的修改数据
				pageType: pageType  //判断是否显示
			}));

			var courseId = $("#courseId option:checked").val();
			//班级选择与课程联动
			$("#squadId").change(function() {
				var squadId = $("#squadId option:checked").val();
				//更新课程----查询该老师对应的课程下拉列表  --- or -- 弹出层的试卷数据源
				findTeacherCoursesDB = findTeacherCourses(teacherId, squadId);
				//更新课程
				$("#createtaskCourses").html(template.compile( createtaskCoursesTpl)({
					Courses: findTeacherCoursesDB,  //课程
					EditLoad: EditLoadDB,   //加载的修改数据
					pageType: pageType  //判断是否显示
				}));
			});


			//发送当前班级的分组
			var getGroupListDB = getGroupList(squadId);

			var groups = "";
			if( pageType == 'edit') {
				groups = (EditLoadDB.resultObject.groups).split(",");
			}
			//初始化当前班级的分组
			$("#PacketSend").html(template.compile( createAddTaskPacketSendTpl)({
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
				$("#PacketSend").html(template.compile( createAddTaskPacketSendTpl)({
					GroupList:getGroupListDB,
					EditLoad: EditLoadDB ,  //加载的修改数据
					groups: groups   //加载的修改数据
				}));
				//把所有的checked 置为空,判断是否选择下拉的班级来显示cheched是否置空
				if( EditLoadDB.resultObject.squadId != squadId ){
					$("input[type='checkbox']").attr("checked", false);
				};


			});



			//日历控件---开始时间
			$( "#startTime" ).datetimepicker({
				timeFormat: 'HH:mm'
			});


			//分组发送交互
			$("input[type='radio']").on('click', function(){
				if($("input:radio[value='grouping']").is(':checked')){
					$(".PacketSend").show();
					return true;
				}else{
					$(".PacketSend").hide();
					return true;
				}
			});



			//添加试卷
			$(".J-add-testpaper").on('click', function(){
				var courseId = $("#courseId option:checked").val();
				var paperTplId = $("#paperTplId").val() || '';
				findHomeworkTplPageDB = findHomeworkTplPage(login_name, courseId, pageNumber, pageSize, paperTplId);
				if(!findHomeworkTplPageDB.resultObject.items.length ){
					layer.alert("没有作业试卷!");
					return false;
				}else {
					var courseId = $("#courseId option:checked").val();
					if(courseId != ""){
						var seft = $(this);
						var index = layer.open({  //获取窗口索引
							type: 1,
							shade: [0.6, '#000'],
							title: "选择试卷 课程名称课程名称",
							skin: 'layui-layer-rim', //加上边框
							area: ['925px','560px'], //宽高
							content: template.compile( createAddTaskTpl)({

							}),
							//btn: ["确定","消息"]
						});

						var LayerThickClass = new LayerThickness();
						LayerThickClass.init(findHomeworkTplPageDB);
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
								$("#addTestPaperTable").html(template.compile( createAddTaskTableTpl)({
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
										seft.html('重新选择练习卷');
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
									pages: findHomeworkTplPageDB.resultObject.totalPageCount, //通过后台拿到的总页数
									curr: 1, //当前页
									skin: '#2cb82c', //配色方案
									jump: function(obj, first){ //触发分页后的回调
										if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
											var paperTplId = $("#paperTplId").val() || '';
											//数据源
											var findHomeworkTplPageDB = findHomeworkTplPage(login_name, courseId, obj.curr, pageSize, paperTplId);
											var data = findHomeworkTplPageDB.resultObject.items;
											$("#addTestPaperTable").html(template.compile( createAddTaskTableTpl)({
												TestPaperDB: findHomeworkTplPageDB,
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
							var difficulty = $("#organizepaper-peper-difficulty option:checked").val();
							var paperTplId = $("#paperTplId").val() || '';
							//重发请求
							var findHomeworkTplPageDB = findHomeworkTplPage(login_name, courseId, pageNumber, pageSize, paperTplId);
							//调用类中的初始化方法
							LayerThickClass.init(findHomeworkTplPageDB);
							if(!findHomeworkTplPageDB.success){
								layer.alert(findHomeworkTplPageDB.errorMessage || "服务器出错！")
							}else {

							}
						});

					}else {
						layer.alert("请选择课程!");
						return false;
					};
				};
			});


			//修改时间
			if(pageType == 'updateEndTime'){
				$(".submit").hide();
				$(".J-add-testpaper").hide();
				$("#squadId,#courseId,#sendgroups,input:checkbox,.sendList").attr("disabled","disabled");
				$("#squadId,#courseId,#sendgroups,input:checkbox,.sendList").css({"background-color":"#F5F5F5","color":"#ACA899"});
			};
			//保存数据
			$("#createtestForm").validate({
				rules : {
					squadId : {
						required : true
					},
					courseId : {
						required : true
					},
					paperTplId : {
						required : true
					},
					startTime : {
						required : true
						//,date: true
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
				errorElement : "p",
				submitHandler: function(){
					$('.submit,.primary').attr("disabled","disabled");//按钮不可用
					var squadId =  $.trim($("#squadId").val()),  //班级：
						courseId =  $.trim($("#courseId").val()),    //课程：
						paperTplId =  $.trim($("#paperTplId").val()),  //试卷：
						startTime =  $.trim($("#startTime").val());  //开始时间：
						var starte = startTime.replace('/','-');
						startTime = starte.replace('/','-');
						groups = ""; //发送对象
					//获取是否保存还是发布
					var publish = $("#publish").val();  // 0---保存 /1---发布
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
					};
					console.log("发送对象",groups);

					if( $("#paperTplId").val() == ""){
						layer.alert("你还没有选择试卷!")
					};

					if(pageType == undefined || pageType  == 'edit'){
						if(login_name != '' && squadId != '' && courseId != '' && paperTplId != '' && startTime != ''){
							var saveCreateTaskDB = saveCreateTask(exampPaperId,login_name,squadId,courseId, paperTplId, startTime , groups ,publish);
							if(saveCreateTaskDB.success){
								var index = layer.alert("提交成功!",function(){
									layer.close(index);
									setTimeout(function(){
										location.href = "#/teaching/taskmanage/releasetask";
									},1000);
								});
							}else {
								layer.alert(saveCreateTaskDB.errorMessage || '服务器出错!');
								return false; //阻止默认提交
							};
						};
					}else {
						//只能修改结束时间
						if(pageType == 'updateEndTime'){
							var endTime =  $.trim($("#startTime").val());
							var updateEndTimeDB = updateEndTime(exampPaperId, endTime);
							if(updateEndTimeDB.success){
								var index = layer.alert("提交成功!",function(){
									layer.close(index);
									setTimeout(function(){
										location.href = "#/teaching/taskmanage/releasetask";
									},1000);
								});
							}else {
								layer.alert(updateEndTimeDB.errorMessage || '服务器出错!');
								return false; //阻止默认提交
							};
						};
					};
					return false; //阻止默认提交
				}
			});


		}


		//查询该老师对应的班级下拉列表
		var findClass = function(teacherId) {
			return common.requestService('bxg/teaching/squad/noGraduateSquad','get', {
				teacherId: teacherId
			});
		};

		//查询该老师对应的课程下拉列表
		var findTeacherCourses = function(teacherId, squadId) {
			return common.requestService('bxg/teaching/squad/findCourse','get', {
				teacherId: teacherId,
				squadId:squadId
			});
		};

		//查询某班级对应的分组数据
		var getGroupList = function(squadId) {
			return common.requestService('bxg/teaching/squad/squadGroupList','get', {
				squadId: squadId
			});
		};

		/**
		 * 保存发布试卷数据  ---作业
		 * @param id
		 * @param createPerson
		 * @param squadId
		 * @param courseId
		 * @param paperTplId
		 * @param endTime
		 * @param groups
		 * @returns {*}
		 */
		var saveCreateTask = function(id, createPerson, squadId, courseId, homeworkTplId,endTime , groups, publish) {
			return common.requestService('bxg/homework/save','post', {
				id: id,    //作业id
				createPerson: createPerson,  //创建人
				squadId: squadId , //班级：
				courseId: courseId, //课程：
				homeworkTplId: homeworkTplId,  //试卷id
				endTime: endTime, //开始时间：
				groups: groups ,//发送对象：
				publish: publish //是否发布   0---保存 /1---发布
			});
		};

		/**
		 * 获取考试试卷数据 -- 作业
		 * @param login_name
		 * @param difficulty
		 * @param courseId
		 * @param pageNumber
		 * @param pageSize
		 * @returns {*}
		 * @constructor
		 */
		var findHomeworkTplPage = function(login_name, courseId, pageNumber, pageSize, homeworkTplId) {
			return common.requestService('bxg/homeworkTpl/findHomeworkTplPage2','get', {
				login_name: login_name,
				courseId: courseId,
				pageNumber: pageNumber,
				pageSize: pageSize,
				homeworkTplId: homeworkTplId
			});
		};


		//获取加载的修改数据
		var EditLoad = function(id) {
			return common.requestService('bxg/homework/load','get', {
				id: id
			});
		};


		//修改结束时间数据
		var updateEndTime = function(id, endTime){
			return common.requestService('bxg/homework/updateEndTime','post', {
				id: id,
				endTime : endTime
			});
		}



		return {
			createPage: createPage
		}
	});