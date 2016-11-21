define(['jquery'], function ($) {

	function courseNav(pagination,sort,style) {
		//默认显示全部的内容
		$("#style-html a:first-child").addClass("active");
		$("#sort-html a:first-child").addClass("active");

		$("#style-html a").on('click',function(){
			$("#style-html a").removeClass("active");
			$(this).addClass("active");

			//获取分类
			style = $(this).data("courseid");
			console.log("分类--style:",style);
			itemList(pagination,sort,style);

		});

		$("#sort-html a").on('click',function(){
			$("#sort-html a").removeClass("active");
			$(this).addClass("active");

			//获取最排序
			sort = $(this).data("sort");
			console.log("排序---sort:",sort);
			itemList(pagination,sort,style);
		});
	}

	return {
		courseNav: courseNav
	}

});