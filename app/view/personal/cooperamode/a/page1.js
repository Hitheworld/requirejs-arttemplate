define(['template',
        'jquery',
        'text!tplUrl/personal/cooperamode/cooperamode.html',
        'text!tplUrl/personal/cooperamode/cooperamode1.html',
        'text!tplUrl/personal/cooperamode/cooperamode2.html',
        'common',
        'layer',
        'layui',
        'laypage',
        'api',
        'css!layerCss',
        'css!layuiCss',
        'css!cssUrl/personal'],
    function (template,$,cooperamodeTpl,cooperamode1,cooperamode2,common,layer,layui,laypage,api) {
        function createPage(type, pageNumber) {


        }



        return {
            createPageA: createPage
        }
    });