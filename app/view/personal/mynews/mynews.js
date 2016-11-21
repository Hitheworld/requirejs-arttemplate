define(['template',
        'jquery',
        'text!tplUrl/personal/mynews/mynews.html',
        'text!tplUrl/personal/mynews/mynews_content.html',
        'text!tplUrl/personal/mynews/mynews_alert.html',
        'common',
        'layer',
        'layui',
        'laypage',
        'api',
        'css!layerCss',
        'css!layuiCss',
        'css!laypageCss',
        'css!cssUrl/personal',
        'element'],
    function (template, $, mynewsTpl, mynewsContent, mynews_alert, common, layer, layui, laypage, api) {

        function createPage(type, pageNumber) {
            $(".personal_ul li").attr("class", "").each(function () {
                if ($(this).text() == "我的消息") {
                    $(this).attr("class", "personal_this")
                }
            });
            $("#personal").html(mynewsTpl);
            $(".my_open > div").click(function () {
                if ($(".my_open ul").is(":hidden")) {
                    $(".my_open ul").css("display", "block");
                } else {
                    $(".my_open ul").css("display", "none");
                }
            });
            $(".my_open ul li").on("click", function () {
                $(".my_open > div > div").text($(this).text());
                $(".my_open ul").css("display", "none");
                switch ($(this).attr("data-tpye")) {
                    case "1":
                        AddMynews($(this).attr("data-tpye"), 1, 10);
                        break;
                    case "0":
                        AddMynews($(this).attr("data-tpye"), 1, 10);
                        break;
                    default:
                        AddMynews($(this).attr("data-tpye"), 1, 10);
                }
            });

            function AddMynews(type, curr, pageSize) {
                //我的消息

                common.ajaxRequest(api.BATHPATH + 'bxg/user/msg', "POST", {
                    type: type,
                    pageNumber: curr || 1,
                    pageSize: pageSize
                }, function (data, state) {
                    $(".mynews_content").html(template.compile(mynewsContent)(data));
                    if (data.success) {
                        //显示分页
                        laypage({
                            cont: $('#page'), //容器。值支持id名、原生dom对象，jquery对象,
                            pages: parseInt(data.resultObject.totalpages), //总页数 parseInt(data.resultObject.totalpages)
                            curr: curr || 1, //当前页
                            skin: '#2cb82c',
                            jump: function (obj, first) { //触发分页后的回调
                                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                    AddMynews(type, obj.curr, pageSize);
                                }
                            }
                        });
                    }
                    $(".mynews_content_span").on("click", function () {
                        layer.open({
                            type: 1,
                            title: '消息详情',
                            area: ['500px', '508px'], //宽高
                            shadeClose: true,//开启遮罩关闭
                            content: template.compile(mynews_alert)({content: $(this).attr("data-content")})
                        });
                    });
                    var cin = $(".mynews_content input:checkbox");
                    var cin1 = $("#mynews_checkbox")
                    //全选反选
                    cin1.on("click", function () {

                        if ($(this)[0].checked) {
                            for(var o in cin){
                                cin[o].checked=true;
                            }
                        }else {
                            for(var k in cin){
                                cin[k].checked=false;
                            }
                        }
                    });
                    //判断全选反选
                    cin.click(function(){
                        var te = true;
                        var l;
                        for( l=0; l<$(".mynews_content input:checkbox").length; l++){
                            te=te && cin[l].checked
                        }
                        if(te){
                            cin1[0].checked = true;
                        }
                        else{
                            cin1[0].checked = false;
                        }
                    })
                    //删除
                    $("#myDelete").on("click",function(){
                        var te = true;
                        var i = 0;
                        var arrue = [];
                        for(var l=0; l<$(".mynews_content input:checkbox").length; l++){
                            if (cin[l].checked){
                                i++;
                                arrue.push($(cin[l]).attr("data-id"))
                            }
                        }
                        if (i==0) {
                            layer.msg('请选择删除消息', {icon: 5});
                            cin1[0].checked = false;
                        }else {
                            layer.confirm('确定要删除该消息？删除操作，不可恢复！', {
                                btn: ['确定','取消'] //按钮
                            }, function(){
                                common.ajaxRequest(api.BATHPATH+"bxg/user/updateMsg","POST",{
                                    method:"del",
                                    msgId:arrue.toString()
                                },function(data){
                                    if (data.success){
                                        AddMynews(type, curr, pageSize);
                                        cin1[0].checked = false;
                                    }
                                })
                            }, function(){
                                layer.closeAll()
                            });
                        }
                    });
                    //已读
                    $("#myRead").on("click",function(){
                        var te = true;
                        var i = 0;
                        var arrue = [];
                        for(var l=0; l<$(".mynews_content input:checkbox").length; l++){
                            if (cin[l].checked){
                                i++;
                                arrue.push($(cin[l]).attr("data-id"))
                            }
                        }
                        if (i==0) {
                            layer.msg('请选择已读消息', {icon: 5});
                            cin1[0].checked = false;
                        }else {
                            common.ajaxRequest(api.BATHPATH+"bxg/user/updateMsg","POST",{
                                method:"update",
                                msgId:arrue.toString()
                            },function(data){
                                if (data.success){
                                    AddMynews(type, curr, pageSize);
                                    cin1[0].checked = false;
                                }
                            })
                        }
                    })
                });
            }

            AddMynews("", 1, 10);
        }

        return {
            createPage: createPage
        }
    });