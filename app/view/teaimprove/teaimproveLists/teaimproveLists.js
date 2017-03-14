define(['template',
		'jquery',
		'layui',
		'layer',
	    'laypage',
		'text!tplUrl/teaimprove/teaimproveLists/teaimproveList.html',
		'text!tplUrl/teaimprove/teaimproveLists/teaimprove.item.html',
		'common',
		'api',
		'css!cssUrl/teaimprove.lists',
		'css!font-awesome'
],
	function (template,$,layui,layer,laypage,teaimproveListsTpl,teaimproveItemTpl,common) {

		function createPage(pagenumber) {
			document.title = "博学谷·院校-教师端课程中心";
			$("#content").html(teaimproveListsTpl);
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teacrise").addClass("active");
			var PAGESIZE_NUMBER = 16;


			//课程列表-- 数据源
			var itemDB = itemList(pagenumber, PAGESIZE_NUMBER);

			// 初始化
			$("#course-item").html(template.compile(teaimproveItemTpl)({
				item: itemDB
			}));

			//显示分页
			laypage({
				cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
				pages: itemDB.resultObject.totalPageCount, //通过后台拿到的总页数
				curr: 1, //当前页
				skin: '#2cb82c', //配色方案
				jump: function(obj, first){ //触发分页后的回调
					if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
						var itemDB = itemList(obj.curr,PAGESIZE_NUMBER);
						$("#course-item").html(template.compile(teaimproveItemTpl)({
							item: itemDB
						}));
					}
				}
			});

		};



		//课程列表数据
		var itemList = function(pageNumber,pageSize) {
			return common.requestService('bxg_anon/teachImprove/list','POST', {
				pageNumber: pageNumber,
				pageSize: pageSize
			});
		};

		return {
			createPage: createPage
		}
	});