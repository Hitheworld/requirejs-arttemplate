/**
 * 服务器接口路径和资源路径
 */
define([
		'jquery'
],
	function ($) {
		//  http://univ-dev.boxuegu.com:58000/  研发环境   //黄兴: http://192.168.1.190:8081/  付老师  http://192.168.1.55/univ-teacher/
		var PROJECTNAME = "";
		var DEVELOPPATH = "";  //开发地址
		var PRODUCTPATH = "http://univ-dev.boxuegu.com:58000/";  //正式地址---部署代码时请置为空
		var RESOURCESURL = "http://univ-test.boxuegu.com/univ-manager/rei/";  //配置资源地址

		var BATHPATH = PRODUCTPATH + PROJECTNAME;
		var ATTACHMENTPATH = '';


		return {
			BATHPATH : BATHPATH,
			RESOURCESURL: RESOURCESURL,
			ATTACHMENTPATH: ATTACHMENTPATH
		}
});