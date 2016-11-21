define(['template',
        'jquery',
        'text!tplUrl/reset_password/reset_index.html',
        'text!tplUrl/reset_password/reset_password.html',
        '../../js/common/common.js',
        'layer',
        'layui',
        'css!layerCss',
        'css!layuiCss',
        'css!cssUrl/login',
        'api'
    ],
    function (template,$,reset_index,reset_password,common,layer,layui,api) {

        function createPage() {
            //$("#content").html(loginTpl);
            $("#content").html(reset_index);
            $(".myLogin").html(reset_password);
        }

        return {
            createPage: createPage
        }
    });