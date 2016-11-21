define(['template',
		'jquery',
		'layui',
		'layer',
		'text!tplUrl/course/resource/resource.html',
		'common',
		'css!layuiCss',
		'css!layerCss',
		'css!cssUrl/course.resource',
	],
	function (template,$,layui,layer,resourceTpl,common) {

		function createPage(resourceId) {
			document.title = "博学谷·院校-教师端课程配置资源页";
			console.log("课程配置资源"+resourceId)
			//$("#content").html(resourceTpl);
			//设置导航的active
			$(".home-header .home-nav .home-nav-li a").removeClass("active");
			$(".home-header .home-nav .home-nav-li a.course").addClass("active");

			common.ajaxRequest('./app/data/course.del.json', "GET", {}, function (data, state) {
				$("#content").html(template.compile( resourceTpl)(data));
			});


		}

		return {
			createPage: createPage
		}
	});