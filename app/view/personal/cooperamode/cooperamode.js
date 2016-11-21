define(['template',
		'jquery',
		'text!tplUrl/personal/cooperamode/cooperamode.html',
		'text!tplUrl/personal/cooperamode/cooperamode1.html',
		'text!tplUrl/personal/cooperamode/cooperamode2.html',
		'common',
		'layer',
		'layui',
		'laypage',
		'api',
		'css!layerCss',
		'css!layuiCss',
		'css!cssUrl/personal'],
	function (template,$,cooperamodeTpl,cooperamode1,cooperamode2,common,layer,layui,laypage,api) {
		function createPage(type, pageNumber) {
			$(".personal_ul li").attr("class","").each(function(){
				if ($(this).text() == "合作课程") {
					$(this).attr("class","personal_this")
				}
			});
			var teacherId =  $(".home-user-name").attr("data-id");
			var waitCourseData = waitCourse(teacherId,1,6);
			var passCourseData = passCourse(teacherId,1,6);


			$("#personal").html(template.compile(cooperamodeTpl)());
			$("#pageHtml1").html(template.compile(cooperamode1)({
				waitCourse: waitCourseData,
				waitData: waitCourseData.resultObject.items
			}));
			$("#pageHtml2").html(template.compile(cooperamode2)({
				passCourse:passCourseData,
				passData: passCourseData.resultObject.items
			}));
			$(".layui-tab-title li").on("click",function(e){
				var eve = e || window.event;
				if ($(eve.target).text() == "正在审核的课程"){
					$(".cooperamode2").css("display","none");
					$(".cooperamode1").css("display","block");
				} else {
					$(".cooperamode1").css("display","none");
					$(".cooperamode2").css("display","block");
				}
			});


			//判断是否显示分页
			if(waitCourseData.success){
				//显示分页
				laypage({
					cont:  $('#page1'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
					pages: waitCourseData.resultObject.totalPageCount, //通过后台拿到的总页数
					curr: waitCourseData.resultObject.currentPage || 1, //当前页
					skin: '#2cb82c', //配色方案
					jump: function(obj, first){ //触发分页后的回调
						if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
							waitCourseData = waitCourse(teacherId,obj.curr,6);
							$("#pageHtml1").html(template.compile(cooperamode1)({
								waitCourse: waitCourseData,
								waitData: waitCourseData.resultObject.items
							}));
						}
					}
				});


			}
			if(passCourseData.success){
				//显示分页
				laypage({
					cont:  $('#page2'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
					pages: passCourseData.resultObject.totalPageCount, //通过后台拿到的总页数
					curr: passCourseData.resultObject.currentPage || 1, //当前页
					skin: '#2cb82c', //配色方案
					jump: function(obj, first){ //触发分页后的回调
						if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
							passCourseData = passCourse(teacherId,obj.curr,6);
							$("#pageHtml2").html(template.compile(cooperamode2)({
								passCourse:passCourseData,
								passData: passCourseData.resultObject.items
							}));
						}
					}
				});
			}

			//$(".layui-tab-title li:eq(0)").click();
		}




		//获取扩展资源申请资源数据
		var waitCourse = function(teacherId,Number,page) {
			return common.requestService('bxg/user/waitCourse','GET', {
				teacherId: teacherId,
				pageNumber:Number,
				pageSize:page
			});
		};

		//获取扩展资源成功资源数据
		var passCourse = function(teacherId,Number,page) {
			return common.requestService('bxg/user/passCourse','GET', {
				teacherId: teacherId,
				pageNumber:Number,
				pageSize:page
			});
		};

		return {
			createPage: createPage
		}
	});