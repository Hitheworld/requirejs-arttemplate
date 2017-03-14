define(['template',
		'jquery',
		'layui',
		'layer',
	    'laypage',
		'text!tplUrl/course/home/course.html',
		'text!tplUrl/course/home/course.item.html',
		'text!tplUrl/course/home/course.style.html',
		'common',
		'api',
		'css!cssUrl/course.lists',
		'css!font-awesome'
],
	function (template,$,layui,layer,laypage,courseTpl,courseItemTpl,courseStyleTpl,common,api) {

		function createPage(pagination,pagenumber) {
			document.title = "博学谷·院校-教师端课程中心";
			$("#content").html(courseTpl);
			console.log("课程页数"+pagenumber)
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.course").addClass("active");
			var style= null,
				sort = null;

			//课程导航
			common.ajaxRequest('bxg_anon/course/categoryList', "GET", {}, function (data, state) {
				$("#style-html").html(template.compile(courseStyleTpl)(data));

				//默认显示全部的内容
				$("#style-html a:first-child").addClass("active");
				$("#sort-html a:first-child").addClass("active");

				$("#style-html a").on('click',function(){
					$("#style-html a").removeClass("active");
					$(this).addClass("active");

					//获取分类
					style = $(this).data("courseid");
					console.log("分类--style:",style);
					//window.location.href= "#/course/"+pagination+"/1";
					itemList(1,sort,style,pagination);

				});

				$("#sort-html a").on('click',function(){
					$("#sort-html a").removeClass("active");
					$(this).addClass("active");

					//获取最排序
					sort = $(this).data("sort");
					console.log("排序---sort:",sort);
					//window.location.href= "#/course/"+pagination+"/1";
					itemList(1,sort,style,pagination);
				});
			});

			//课程列表
			itemList(pagenumber,sort,style,pagination);

		}


		//课程列表
		var itemList = function(curr,sort,style,pagination){
			common.ajaxRequest('bxg_anon/course/courseList', "POST", {
				pageNumber: curr || 1,//（当前是第几页）,
				pageSize: 16,//(每页显示多少记录)
				sort: sort || '', //（排序字段 ）
				categoryId: style || ''//（课程分类ID）
			}, function (data, state) {
				$("#course-item").html(template.compile(courseItemTpl)({
					item: data,
					pagination: pagination
				}));

				//判断是否显示分页
				if(data.success){
					//显示分页
					laypage({
						cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
						pages: data.resultObject.totalPageCount, //通过后台拿到的总页数
						curr: curr || 1, //当前页
						skin: '#2cb82c', //配色方案
						jump: function(obj, first){ //触发分页后的回调
							console.log(obj);
							//获取当前取中的id
							//获取分类
							style = $("#style-html a.active").data("courseid");
							//获取最排序
							sort = $("#sort-html a.active").data("sort");

							if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
								itemList(obj.curr,sort,style,pagination);
								//window.location.href= "#/course/"+pagination+"/"+obj.curr;
							}
						}
					});
				}

			});
		};

		return {
			createPage: createPage
		}
	});