/**
 * 扩展资源列表
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'laypage',
		'text!tplUrl/resources/resourcesLists/resourcesLists.html',
		'text!tplUrl/resources/resourcesLists/resourcesItem.html',
		'common',
		'api',
		'css!font-awesome',
		'css!cssUrl/resourcesLists'
	],
	function (template,$,layui,layer,laypage,
	          resourcesListsTpl,
	          resourcesItemTpl,
	          common,api) {

		function createPage(pagenumber) {
			document.title = "博学谷·院校-教师端扩展资源";
			//设置导航的active
			//$(".home-header .home-nav .home-nav-li a").removeClass("active");
			//$(".home-header .home-nav .home-nav-li a.course").addClass("active");
			var type= null,
				seq = null;

			//数据源
			var resourcesNavsDB = resourcesNavs();

			var resourcesListsDB = resourcesLists(type,seq,1,20);
			var itemResource = resourcesListsDB.resultObject.items;

			$("#content").html(template.compile( resourcesListsTpl)({
				resourcesNavs: resourcesNavsDB
			}));
			$("#resourcesLists-item").html(template.compile( resourcesItemTpl)({
				resourcesNavs: resourcesNavsDB,
				resourcesListsDB: resourcesListsDB,
				itemResource: itemResource
			}));

			//默认显示全部的内容
			$("#style-html a:first-child").addClass("active");
			$("#sort-html a:first-child").addClass("active");

			$("#style-html a").on('click',function(){
				$("#style-html a").removeClass("active");
				$(this).addClass("active");

				//获取分类
				type = $(this).data("courseid");
				console.log("分类--style:",type);
				resourcesListsDB = resourcesLists(type,seq,1,20);
				itemResource = resourcesListsDB.resultObject.items;
				//window.location.href= "#/resources/"+obj.curr;
				$("#resourcesLists-item").html(template.compile( resourcesItemTpl)({
					resourcesListsDB: resourcesListsDB,
					itemResource: itemResource
				}));
				//判断是否显示分页
				pageGet();

			});

			$("#sort-html a").on('click',function(){
				$("#sort-html a").removeClass("active");
				$(this).addClass("active");

				//获取最排序
				seq = $(this).data("sort");
				console.log("排序---sort:",seq);
				resourcesListsDB = resourcesLists(type,seq,1,20);
				itemResource = resourcesListsDB.resultObject.items;
				//window.location.href= "#/resources/"+obj.curr;
				$("#resourcesLists-item").html(template.compile( resourcesItemTpl)({
					resourcesListsDB: resourcesListsDB,
					itemResource: itemResource
				}));
				//判断是否显示分页
				pageGet();
			});

			console.log("课程页数"+pagenumber)


			pageGet();
			function  pageGet(){
				//判断是否显示分页
				if(resourcesListsDB.success){
					//显示分页
					laypage({
						cont:  $('#page'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
						pages: resourcesListsDB.resultObject.totalPageCount, //通过后台拿到的总页数
						curr: resourcesListsDB.resultObject.currentPage || 1, //当前页
						skin: '#2cb82c', //配色方案
						jump: function(obj, first){ //触发分页后的回调
							console.log(obj)
							if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
								//获取分类
								type = $("#style-html a.active").data("courseid");
								//获取最排序
								seq = $("#sort-html a.active").data("sort");
								resourcesListsDB = resourcesLists(type,seq,obj.curr,20);
								itemResource = resourcesListsDB.resultObject.items;
								//window.location.href= "#/resources/"+obj.curr;
								$("#resourcesLists-item").html(template.compile( resourcesItemTpl)({
									resourcesListsDB: resourcesListsDB,
									itemResource: itemResource
								}));
							}
						}
					});
				}
			}




		}

		//获取扩展资源资源分类数据
		var resourcesNavs = function() {
			return common.requestService('bxg/home/typeList','get', {});
		};

		//获取扩展资源列表数据
		var resourcesLists = function(type,seq,pageNumber,pageSize) {
			return common.requestService('bxg/home/extendResourceList','post', {
				type: type,
				seq : seq,
				pageNumber: pageNumber,
				pageSize: pageSize
			});
		};


		return {
			createPage: createPage
		}
	});