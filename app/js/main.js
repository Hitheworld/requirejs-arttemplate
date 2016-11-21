/**
 * Created by Elvis on 16/2/25.
 */
require.config({
    baseUrl: '/js/lib',
    shim: {
        //common: {
        //    deps: ['jquery'],
        //    exports: 'excommon'
        //}
    	"ajaxFileUpload":["jquery"],
        "pagination":["jquery"],
        'picupload':["jquery",'cropbox'],
        'nicescroll':["jquery"],
        'lazyloadingimg':["jquery"]
    },
    paths: {
        handlebars: './handlebars',
        jquery:'./jquery',
        text: './text',
        modules: '../../modules',
        template: '../../modules',
        'ajaxFileUpload':"../../common/js/ajaxfileupload",
        css: './css',
        'cropbox':"../preson/corpbox/cropbox",
        'picupload':"../../common/js/picupload",
        'pagination': '../../common/js/pagination/pagination',
        'nicescroll':'../jquery.nicescroll',
        'lazyloadingimg':'./lazyLoadingImg'
    }
});
//--------------------------------------------

//overrideJAax();


var myclass = function () {
    //alert("myclass");
    layer.msg('加载中', {icon: 16,shade: [0.1,'#fff'],time : 0,offset : ['200px' , '40%']});
    require( ['modules/class/myclass'], function (m) {
        m.createPage();
    });
};
var classDiaries = function () {
    layer.msg('加载中', {icon: 16,shade: [0.1,'#fff'],time : 0,offset : ['200px' , '40%']});
    require( ['modules/diary/diary'], function (m) {
        m.createPage();
    });
};

var classActive = function () {
    layer.msg('加载中', {icon: 16,shade: [0.1,'#fff'],time : 0,offset : ['200px' , '40%']});
    require( ['modules/class_active/classActive'], function (m) {
        m.createPage();
    });
};


/**班级活动详情**/
var activeDetail = function (id) {
    require( ['modules/class_active/activeDetail'], function (m) {
        m.createPage(id);
    });
};

/**日记详情也**/
var diaryDetail = function (id,person) {
    require(['modules/diary/detail'], function (m) {
        m.createPage(id,person);
    });
};


//var person = {create:false};
/**个人中心**/
var personalPage = function (type,uid, pagetype) {
    layer.msg('加载中', {icon: 16,shade: [0.1,'#fff'],time : 0,offset : ['200px' , '40%']});
	    require( ['modules/Personal_page/personal'], function (m) {
	        m.createPage(type,uid);
            m.rightContent(type,uid, pagetype);
	    });
};


/**他的主页**/
var taPage = function (type,uid) {
    require( ['modules/Ta_page/personal'], function (m) {
        m.createPage(type,uid);
        m.rightContent(type,uid);
    });
};


var books = function () { console.log("books"); };
var viewBook = function (bookId) {
    console.log("viewBook: bookId is populated: " + bookId);
};
var group = function(id){
    /*if($.trim(id)){
        if(isNaN(parseInt(id))){
            id = null;

            return;
        }
    }*/

    layer.msg('加载中', {icon: 16,shade: [0.1,'#fff'],time : 0,offset : ['200px' , '40%']});
	require(['modules/class/group'], function (m) {
        m.createPage(id);

    });
}
var routes = {
	'/group/?([^\/]*)/?': group,
    '/myclass': myclass,
    '/diary' : classDiaries,
    '/class/active':classActive,
    '/active/detail/:id':activeDetail,
    '/books/view/:bookId': viewBook,
    '/diary/detail/:id/:person':diaryDetail,
    '/personal/?([^\/]*)\/([^\/]*)/?': personalPage,
    '/personal/:type/:uid/:pagetype' : personalPage,
    '/ta/?([^\/]*)\/([^\/]*)/?': taPage


};
var router = new Router(routes);
router.init();
router.configure({
    on: function (data) {

    }
});

//-----------------------公用helper