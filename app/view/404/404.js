define(['../../js/lib/template.js',
		'text!tplUrl/404/404.html',
		'../../js/common/common.js'],
	function (template,error404Tpl,common) {

		function createPage() {
			$("#content").html(error404Tpl);
		}

		return {
			createPage: createPage
		}
	});