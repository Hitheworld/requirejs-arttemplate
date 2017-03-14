require.config({
	baseUrl: './app/js/lib',
	paths: {
		'text': './requirejs-text/text',
		'css': './require-css/css',
		'json': './requirejs-json/json',
		'route': './path.min',
		'font-awesome':'./font-awesome-4.7.0/css/font-awesome.min',
		'jquery':'./jquery-1.12.4.min',
		'json2':'./json2',
		'audiojs' : './audiojs/audiojs/audio.min',
		'xvCalendar':'./xvCalendar/src/js/calendar',
		'xvCalendarCss':'./xvCalendar/src/css/calendar',
		'jquery-ui-timepicker': './jquery-ui-timepicker/js/jquery-ui-1.10.4.custom.min',
		'jquery.ui.datepicker-zh-CN': './jquery-ui-timepicker/js/jquery.ui.datepicker-zh-CN',
		'jquery-ui-timepicker-addon': './jquery-ui-timepicker/js/jquery-ui-timepicker-addon',
		'jquery-ui-timepicker-zh-CN': './jquery-ui-timepicker/js/jquery-ui-timepicker-zh-CN',
		'jquery-ui-timepicker-css': './jquery-ui-timepicker/css/jquery-ui',
		'datatables.net': './DataTables-1.10.13/media/js/jquery.dataTables.min',
		'dataTables.select': './DataTables-1.10.13/media/js/dataTables.select.min',
		'dataTables.selectCss': './DataTables-1.10.13/media/css/select.dataTables.min',
		'datatables.net.Css': './DataTables-1.10.13/media/css/jquery.dataTables.min',
		'shCore': './DataTables-1.10.13/examples/resources/syntax/shCore',
		'shCoreCss': './DataTables-1.10.13/examples/resources/syntax/shCore',
		'dataTables.jqueryui': './DataTables-1.10.13/media/js/dataTables.jqueryui',
		'dataTables.Chinese': 'json!DataTables-1.10.13/i18n/Chinese.json',
		'jquery-cookie': './jquery-cookie-v1.4.1/jquery.cookie',
		'jquerySession':'./jquerySession',
		'jquery.tools': './scrollable',
		'jquery.cityselect': './city/jquery.cityselect',
		'city': './city/city.min',
		'radialIndicator': './radialIndicator.js-v1.0.0/js/radialIndicator.min',
		'portamento': './portamento.js-v1.1.1/portamento-min',
		'jquery.hovertreescroll': './jquery.hovertreescroll',
		'jquery.fs.boxer': './boxer/jquery.fs.boxer.min',
		'viewer': './imageviewer/viewer.min',
		'viewerCss': './imageviewer/viewer.min',
		'boxerCss': './boxer/jquery.fs.boxer',
		'jquery.ztree': './zTree_v3/js/jquery.ztree.all.min',
		'jquery.ztree.zTreeStyle': './zTree_v3/css/zTreeStyle/zTreeStyle',
		'jquery.aciTree': './aciTree-v4.5.0/js/jquery.aciTree.min',
		'jquery.aciTreeCss': './aciTree-v4.5.0/css/aciTree',
		'jquery.aciPlugin': './aciTree-v4.5.0/js/jquery.aciPlugin.min',
		'jquery.aciTree.dom': './aciTree-v4.5.0/js/jquery.aciTree.dom',
		'jquery.aciTree.core': './aciTree-v4.5.0/js/jquery.aciTree.core',
		'jquery.aciTree.selectable': './aciTree-v4.5.0/js/jquery.aciTree.selectable',
		'jquery.aciTree.checkbox': './aciTree-v4.5.0/js/jquery.aciTree.checkbox',
		'jquery.aciTree.radio': './aciTree-v4.5.0/js/jquery.aciTree.radio',
		'jquery.easing': './jquery.easing-v1.3/jquery.easing.min',
		'jquery.validate': './jquery-validation/dist/jquery.validate',
		'jquery.validate.zh': '../../../app/js/common/messages',
		'jquery.validate.unobtrusive': './jquery.validate.unobtrusive.min',
		'jquery.form': './jquery.form-3.51.0/jquery.form',
		'jquery.placeholder':'./jquery-placeholder/jquery.placeholder.min',
		'jquery.ellipsis': './jquery-ellipsis-1.1.1/dist/jquery.ellipsis.min',
		'jquery.ellipsis.unobtrusive': './jquery-ellipsis-1.1.1/jquery.ellipsis.unobtrusive',
		'ckplayer': './ckplayer6.8/ckplayer/ckplayer',
		'fetch':'./fetch-1.0.0/fetch',
		'template': './template',
		'layer': './layer-v2.4/layer/layer',
		'layerCss': './layer-v2.4/layer/skin/layer',
		'laypage': './laypage-v1.3/laypage/laypage',
		'laypageCss': './laypage-v1.3/laypage/skin/laypage',
		'layui':'./layui-v1.0.2/layui/lay/dest/layui.all',
		'layuiCss': './layui-v1.0.2/layui/css/layui',
		'mobileCss': './layui-v1.0.2/layui/css/mobile',
		'upload': './layui-v1.0.2/layui/lay/modules/upload',
		'layedit': './layui-v1.0.2/layui/lay/modules/layedit',
		'form': './layui-v1.0.2/layui/lay/modules/form',
		'laydate': './layui-v1.0.2/layui/lay/modules/laydate',
		'element': './layui-v1.0.2/layui/lay/modules/element',
		'flow': './layui-v1.0.2/layui/lay/modules/flow',
		'laytpl': './layui-v1.0.2/layui/lay/modules/laytpl',
		'tree': './layui-v1.0.2/layui/lay/modules/tree',
		'util': './layui-v1.0.2/layui/lay/modules/util',
		'code': './layui-v1.0.2/layui/lay/modules/code',
		'common': '../../../app/js/common/common',
		'popupLogin': '../../view/common/login/popup.login',
		'popupLoginCss': '../../less/popup.login',
		'tplUrl': '../../view',
		'cssUrl': '../../less',
		'api': '../common/ServiceConfig',
		'index': '../common/index'
	},
	shim: {
		'route' : {
			exports: 'Path'
		},
		'layer': ['jquery','css!layerCss'],
		'popupLogin': ['jquery','css!popupLoginCss'],
		'laypage': ['jquery','css!laypageCss'],
		'layui': {
			deps: ['jquery','css!layuiCss'],
			exports:'layui'//exports的值为jqueryPlaceholder提供的 对外接口的名称
		},
		'json2': {
			deps: ['jquery','css!layuiCss'],
			exports:'parse'//exports的值为jqueryPlaceholder提供的 对外接口的名称
		},
		'ckplayer': {
			deps: ['jquery'],
			exports:'CKobject'
		},
		'datatables.net': ['jquery','css!datatables.net.Css','shCore','css!shCore'],
		'dataTables.select': ['jquery','css!dataTables.selectCss'],
		'jquery-cookie': ['jquery'],
		'jquerySession': ['jquery'],
		'xvCalendar':{
			deps: ['jquery','css!xvCalendarCss'],
			exports:'xvDate'
		},
		'jquery-ui-timepicker-zh-CN': {
			deps: ['jquery','jquery-ui-timepicker','jquery.ui.datepicker-zh-CN','jquery-ui-timepicker-addon','css!jquery-ui-timepicker-css'],
			exports:'datetimepicker'
		},
		'audiojs': {
			deps: ['jquery'],
			exports:'audiojs'
		},
		'viewer': {
			deps: ['jquery','css!viewerCss'],
			exports:'viewer'
		},
		'jquery.hovertreescroll': ['jquery'],
		'jquery.fs.boxer': ['jquery','css!boxerCss'],
		'jquery.tools': ['jquery'],
		'jquery.cityselect': ['jquery'],
		'radialIndicator': ['jquery'],
		'portamento': ['jquery'],
		'jquery.ztree': ['jquery', 'css!jquery.ztree.zTreeStyle'],
		'jquery.aciTree': ['jquery', 'css!jquery.aciTreeCss','jquery.aciPlugin','jquery.aciTree.dom','jquery.aciTree.core',
			'jquery.aciTree.selectable','jquery.aciTree.checkbox','jquery.aciTree.radio'],
		'jquery.easing': ['jquery'],
		'jquery.validate.zh': ['jquery'],
		'jquery.validate': {
			deps: ['jquery'],
			exports: 'messages'//exports的值为jqueryPlaceholder提供的 对外接口的名称
		},
		'jquery.form': ['jquery'],
		'jquery.ellipsis.unobtrusive': ['jquery','jquery.ellipsis'],
		'jquery.ellipsis': ['jquery'],
		'jquery.placeholder':{
			deps: ['jquery'],
			exports:'placeholder'//exports的值为jqueryPlaceholder提供的 对外接口的名称
		}
	},
	packages: [
		{
			name: 'less',
			location: './require-less',
			main: 'less'
		}
	]

});

//初始化---公用方式;
requirejs([
	'./app/js/common/route.js',
	'jquery',
	'template',
	'common',
	'api',
	'text!tplUrl/index/user.header.html',
	'css!cssUrl/normalize',
	'css!cssUrl/index'
],function(route,$,template,common,api,userTpl){
	//开始路由文件的执行
	route.Route();

	//返回头部
	$(window).scroll(function(){
		var sc=$(window).scrollTop();
		var rwidth=$(window).width();
		if(sc>0){
			$("#home-top").css("display","block");
			$("#home-top").css("left",(rwidth-36)+"px")
		}else{
			$("#home-top").css("display","none");
		}
	})
	$("#home-top").click(function(){
		var sc=$(window).scrollTop();
		$('body,html').animate({scrollTop:0},500);
	});


	/**
	 * 禁用ctrl+滚轮，防止页面放大缩小
	 * @param e
	 */
	var scrollFunc=function(e){
		e=e || window.event;
		if(e.wheelDelta && event.ctrlKey){//IE/Opera/Chrome
			event.returnValue=false;
		}else if(e.detail){//Firefox
			event.returnValue=false;
		}
	}
	/*注册事件*/
	if(document.addEventListener){
		document.addEventListener('DOMMouseScroll',scrollFunc,false);
	}//W3C
	window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome/Safari

});