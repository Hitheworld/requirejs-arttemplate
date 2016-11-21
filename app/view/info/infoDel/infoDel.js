/**
 * 资讯详情
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'laypage',
		'text!tplUrl/info/infoDel/infoDel.html',
		'common',
		'api',
		'css!cssUrl/infoDel'
	],
	function (template,$,layui,layer,laypage,
	          infoDelTpl,
	          common,api) {

		function createPage(infoId) {
			document.title = "博学谷·院校-教师端扩展资源";
			//设置导航的active
			//$(".home-header .home-nav .home-nav-li a").removeClass("active");
			//$(".home-header .home-nav .home-nav-li a.course").addClass("active");


			//数据源

			common.ajaxRequest('bxg/home/findAffiche', "POST", {
				afficheId:infoId
			},function(data){
				console.log(data)
				$("#content").html(template.compile(infoDelTpl)(data));
			});
		}

		//获取扩展资源资源分类数据
		var resourcesNavs = function() {
			return common.requestService('../app/data/resourcesNav.json','get', {});
		};

		//获取扩展资源列表数据
		var resourcesLists = function(curr,sort,style) {
			return common.requestService('../app/data/resourcesList.json','get', {});
		};


		return {
			createPage: createPage
		}
	});