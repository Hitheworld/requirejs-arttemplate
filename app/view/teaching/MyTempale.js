'use strict'
var __PARSE__ = (function(){

	/**
	 * 默认的过滤器
	 */
	const defaultFilter = {
		//some code
	};

	/**
	 * 解析模板
	 */
	let doParseTemplate(content,data,filter){
		//some code
	};

	return function (content,data,filter){
		try{
			data = data || {};
			filter = object.assign({}, defaultFilter, filter);
			return f(data, filter);
		}catch (ex){
			return ex.stack;
		}
	}

})();

if(typeof  module != 'undefined' && typeof exports === 'object'){
	module.exports = __PARSE__;
}else {
	window.parse = __PARSE__;
}



function (DATA, FILTER){
	try{
		var OUT = [];
		//处理变量
		//some code
		//处理过滤器
		//some code
		//处理内容
		//other code
		return OUT.join('');
	}eatch(e){
		throw  new Error('parse template error!');
	}
}



let doParseTemplate = function(content, data, filter){
	content = content.replace(/\\t/g,'').replace(/\\n/g,'\\\\n').replace(/\\r/g,'\\\\r');

	//初始化模块生成器占位符
	var struct = [
		'try{ var OUT = [];',
		'', //放置模块生成器占位符
		'return OUT.join(\\'\\'); }catch(e){throw new Error("parse template error!"); }'
	];


	//come code

	return new Function('DATA', 'FILTER',struct.join(''));
}


