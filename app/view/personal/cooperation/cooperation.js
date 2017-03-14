define(['template',
        'jquery',
        'text!tplUrl/personal/cooperation/cooperation.html',
        'text!tplUrl/cooperate/cooperate.html',
        'common',
        'layer',
        'layui',
        'laypage',
        'api',
        'css!layerCss',
        'css!layuiCss',
        'css!cssUrl/personal'],
    function (template,$,cooperationTpl,cooperateTpl,common,layer,layui,laypage,api) {
        function createPage() {
            $(".personal_ul li").attr("class","").each(function(){
                if ($(this).text() == "合作模式") {
                    $(this).attr("class","personal_this")
                }
            });
            $("#personal").html(cooperationTpl);
            //$(".layui-tab-content").html(cooperateTpl);
        }

        return {
            createPage: createPage
        }
    });