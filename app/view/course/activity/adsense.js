/**
 *  师资培训专题页
 */
define(['template',
		'jquery',
		'layer',
		'text!tplUrl/course/activity/adsense.html',
		'common',
		'css!cssUrl/activityIT'
	],
	function (template,$,layer,activityTpl,common) {

		function createPage() {
			document.title = "博学谷·院校-IT资源共享群";
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.teacrise").addClass("active");


			$("#content").html(template.compile( activityTpl)({
			}));




		};




		return {
			createPage: createPage
		}
	});