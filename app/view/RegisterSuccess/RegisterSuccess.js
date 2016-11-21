define(['template',
        'jquery',
        'text!tplUrl/RegisterSuccess/RegisterSuccess.html',
        'common',
        'layer',
        'layui',
        'css!layerCss',
        'css!layuiCss',
        'css!cssUrl/RegisterSuccess',
        'api'
    ],
    function (template,$,RegisterSuccess,common,layer,layui,api) {

        function createPage() {
            $("#content").html(RegisterSuccess);
            var wait = 5;
            $(".RegisterSuccess_dv_v span").text(wait)
            timeOut();
            function timeOut(){
                if(wait==0){
                    window.location.href = "#/login";
                }else{
                    setTimeout(function(){
                        wait--;
                        $(".RegisterSuccess_dv_v span").text(wait);
                        timeOut();
                    },1000)
                }
            }
        }

        return {
            createPage: createPage
        }
    });