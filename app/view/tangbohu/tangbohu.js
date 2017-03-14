/**
 *  堂播虎下载
 */
define(['template',
		'jquery',
		'text!tplUrl/tangbohu/tangbohu.html',
		'common',
		'css!cssUrl/tangbohu'
	],
	function (template,$,tangbohuTpl,common,api) {

		function createPage() {
			document.title = "博学谷·院校-教师端首页";
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.tangbohu").addClass("active");



			$("#content").html(template.compile( tangbohuTpl)({}));

		};


		return {
			createPage: createPage
		}
	});