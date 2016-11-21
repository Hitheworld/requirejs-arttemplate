define(['../../js/lib/template.js',
		'text!tplUrl/cooperate/cooperate.html',
		'../../js/common/common.js'],
	function (template,cooperateTpl,common) {

		function createPage() {
			$("#content").html(cooperateTpl);

		}

		return {
			createPage: createPage
		}
	});