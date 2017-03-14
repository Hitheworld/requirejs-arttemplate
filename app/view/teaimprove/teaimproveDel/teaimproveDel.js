define(['template',
        'jquery',
        'layui',
        'layer',
        'laypage',
        'text!tplUrl/teaimprove/teaimproveDel/teaimproveDel.html',
        'text!tplUrl/teaimprove/teaimproveLists/teaimprove.item.html',
        'text!tplUrl/course/details/popup.faill.html',
        'text!tplUrl/common/login/popup.login.html',
        'popupLogin',
        'common',
        'api',
        'css!cssUrl/course.details',
        'css!cssUrl/popup.login'
    ],
    function (template,$,layui,layer,laypage,
              teaimproveDelTpl,teaimproveItemTpl,faillTpl,popupLoginTpl,
              popupLogin,
              common) {

        function createPage(pagination,pagenumber) {
            document.title = "博学谷·院校-教师端课程中心";
            //设置导航的active
            $(".home-header .home-nav .home-nav-li a").removeClass("active");
            $(".home-header .home-nav .home-nav-li a.teacrise").addClass("active");
            //console.log(pagination,pagenumber)
            var viewDetailDB = viewDetail(pagination);
            $("#content").html(template.compile(teaimproveDelTpl)({
                viewDetail: viewDetailDB
            }));

            $(".course-del-button-box2-download").on("click",function(){
                var downloadDB = download(pagination);
                if (downloadDB.success) {
                    window.open(downloadDB.resultObject)
                }else {
                    if (downloadDB.errorMessage == "0") {
                        layer.open({
                            type: 1,
                            title: false,
                            skin: 'layui-layer-rim', //加上边框
                            area: ['500px', '500px'], //宽高
                            content: popupLoginTpl
                        });
                        //加载弹窗登录js文件;
                        popupLogin.popupLogin();
                    } else if (downloadDB.errorMessage == "1") {
                        //页面层
                        layer.open({
                            type: 1,
                            title: false,
                            skin: 'layui-layer-rim', //加上边框
                            area:['500px', '250px'], //宽高
                            content: faillTpl
                        });
                    } else if (downloadDB.errorMessage == "2") {
                        layer.alert("正在认证中...");
                    }else {
                        layer.msg(downloadDB.errorMessage, {icon: 5});
                    }
                }
            });
            var num = 100.0;
            var arropud = num.split(".");
            alert(arropud[1]);

            $(".J-btn-fx").on('mouseover', function(){
                $(".fx-box").show();
            });

            $(".fx-box").on('mouseleave', function(){
                $(".fx-box").hide();
            });
        }

        var viewDetail = function(id) {
            return common.requestService('bxg_anon/teachImprove/view','get', {
                id: id
            });
        };

        var download = function(id) {
            return common.requestService('bxg_anon/teachImprove/download','get', {
                id: id
            });
        };

        return {
            createPage: createPage
        }
    });