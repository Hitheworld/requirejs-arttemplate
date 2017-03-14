define(['template',
        'jquery',
        'text!tplUrl/personal/mynews/mynews.html',
        'text!tplUrl/personal/mynews/mynews_content.html',
        'text!tplUrl/personal/mynews/mynews_alert.html',
        'text!tplUrl/personal/mynews/mynews_alert2.html',
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
    function (template, $, mynewsTpl, mynewsContent, mynews_alert,mynews_alert2,
              common, layer, layui, laypage, api) {

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
                        message_status($(this).attr("data-tpye"), 1, 10);
                        break;
                    case "0":
                        AddMynews($(this).attr("data-tpye"), 1, 10);
                        message_status($(this).attr("data-tpye"), 1, 10);
                        break;
                    default:
                        AddMynews($(this).attr("data-tpye"), 1, 10);
                        message_status($(this).attr("data-tpye"), 1, 10);
                }
            });
            function message_status (type, curr, pageSize) {
                common.ajaxRequest('bxg/user/msg', "POST", {
                    type: type,
                    pageNumber: curr || 1,
                    pageSize: pageSize
                }, function (data, state) {
                    if (data.success) {
                        if (data.resultObject.noReadCount > 0 ){
                            $(".unread_message").css("display","block").text(data.resultObject.noReadCount);
                        }else {
                            $(".unread_message").css("display","none");
                        }
                    }
                });
                common.ajaxRequest('bxg/user/personCenter', "GET", {
                    teacherId:$(".home-user-name").attr("data-id")
                }, function (data, state) {
                    if (data.success) {
                        if (parseInt(data.resultObject[0].isMsg) > 0) {
                            $(".personal_ul>li>span").css("display","block");
                        }else {
                            $(".personal_ul>li>span").css("display","none");
                        }
                    }
                });
            }
            function AddMynews(type, curr, pageSize) {
                //我的消息

                common.ajaxRequest('bxg/user/msg', "POST", {
                    type: type || "",
                    pageNumber: curr || 1,
                    pageSize: pageSize
                }, function (data, state) {
                    if (data.success) {
                        if (data.resultObject.lists.length == 0) {
                            if (parseInt(data.resultObject.currentpage) > 1){
                                AddMynews(type, (parseInt(data.resultObject.currentpage)-1), pageSize);
                            }
                            $('#page').css("display","none")
                            $(".mynews_checkbox").css("display","none");
                            $(".mynews_content").html(template.compile(mynewsContent)(data));
                        }else {
                            $(".mynews_checkbox").css("display","block");
                            $('#page').css("display","block")
                            $(".mynews_content").html(template.compile(mynewsContent)(data));
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
                            $(".mynews_content_span1").unbind().on("click", function () {
                                layer.open({
                                    type: 1,
                                    title: '消息详情',
                                    area: ['500px', '508px'], //宽高
                                    shadeClose: true,//开启遮罩关闭
                                    content: template.compile(mynews_alert)({content: $(this).attr("data-content")})
                                });
                                common.ajaxRequest("bxg_anon/user/updateMsg","POST",{
                                    method:"update",
                                    msgId:$(this).attr("data-id")
                                },function(data){
                                    if (data.success){
                                        AddMynews(type, curr, pageSize);
                                    }
                                })
                            });
                            $(".mynews_content_span2").unbind().on("click", function () {
                                var _this1 = $(this);
                                layer.open({
                                    type: 1,
                                    title: '消息详情',
                                    area: ['500px', '444px'], //宽高
                                    shadeClose: true,//开启遮罩关闭
                                    content: template.compile(mynews_alert2)({
                                        content: _this1.attr("data-content"),
                                        id:_this1.data("id")
                                    })
                                });
                                //common.ajaxRequest("bxg_anon/user/updateMsg","POST",{
                                //    method:"update",
                                //    msgId:$(this).attr("data-id")
                                //},function(data){
                                //    if (data.success){
                                //        AddMynews(type, curr, pageSize);
                                //    }
                                //})
                                $("#mynews_alert2_form_textarea").val("");
                                $("#mynews_alert2_form input[type=radio]").on("click",function(){
                                   var _this = $(this);
                                    if (_this.val() == "1"){//同意
                                        $("#mynews_alert2_form_textarea").get(0).disabled = true;
                                        $(".mynews_alert2_form_div2 p").css("display","none")
                                    } else if (_this.val() == "2"){//拒绝
                                        $("#mynews_alert2_form_textarea").get(0).disabled = false;
                                        $("#mynews_alert2_form_textarea").css("display","block")
                                    }
                                });
                                $("#mynews_alert2_form").validate({
                                    rules: {
                                        status:{
                                            required: true
                                        },
                                        audit_remark:{
                                            required: true
                                        }

                                    },
                                    messages: {
                                        status:{
                                            required: "请选择"
                                        },
                                        audit_remark:{
                                            required: "请输入拒绝理由"
                                        }
                                    },
                                    errorElement: "p"
                                });
                                $("#mynews_alert2_form").on("submit",function(){
                                    if ($("#mynews_alert2_form").valid()) {
                                        $(this).ajaxSubmit({
                                            url: 'bxg/assoSquad/audit',                 //默认是form的action
                                            //type: type,               //默认是form的method（get or post）
                                            dataType: "json",           //html(默认), xml, script, json...接受服务端返回的类型
                                            method: "post",
                                            //clearForm: true,          //成功提交后，清除所有表单元素的值
                                            //resetForm: true,          //成功提交后，重置所有表单元素的值
                                            target: '#output',          //把服务器返回的内容放入id为output的元素中
                                            //timeout: 3000,               //限制请求的时间，当请求大于3秒后，跳出请求
                                            //提交前的回调函数
                                            beforeSubmit: function(arr,$form,options){
                                                //formData: 数组对象，提交表单时，Form插件会以Ajax方式自动提交这些数据，格式如：[{name:user,value:val },{name:pwd,value:pwd}]
                                                //jqForm:   jQuery对象，封装了表单的元素
                                                //options:  options对象
                                                //比如可以再表单提交前进行表单验证
                                                //console.log("beforeSubmit",arr,$form,options);
                                                //console.log("数据是:",arr[0].value != '' );
                                                //if(arr[0].value != '' || !arr[1].value != ''){
                                                //	return false;
                                                //}
                                            },
                                            //提交成功后的回调函数
                                            success: function(data,status,xhr,$form){
                                                //console.log("success",data,status,xhr,$form);
                                                if(data.success){
                                                    layer.closeAll();
                                                    layer.msg("审批成功", {icon: 1});
                                                    AddMynews(type, curr, pageSize);
                                                }else {
                                                    layer.msg(data.errorMessage, {icon: 5});
                                                }
                                            },
                                            error: function(xhr, status, error, $form){
                                                //console.log("error",xhr, status, error, $form)
                                            },
                                            complete: function(xhr, status, $form){
                                                //console.log("complete",xhr, status, $form)
                                            }
                                        })
                                    }
                                    return false; //阻止表单默认提交
                                })
                            });
                            $(".mynews_content_span3").unbind().on("click", function () {
                                var _this1 = $(this);
                                var span_html = '<div class="span_html">\
                                        <p><span>教师姓名</span>：<span title="{{resultObject.name}}">{{resultObject.name}}</span></p>\
                                        <p><span>所在院系</span>：<span title="{{resultObject.department_name}}">{{resultObject.department_name}}</span></p>\
                                        <p><span>所教专业</span>：<span title="{{resultObject.subject}}">{{resultObject.subject}}</span></p>\
                                        <p><span>职务</span>：<span title="{{resultObject.job_title}}">{{resultObject.job_title}}</span></p>\
                                    </div>';
                                common.requestService("bxg/assoSquad/viewApplyer","POST",{
                                    messageId:_this1.data("id")
                                },function(data){
                                    if (data.success){
                                        layer.open({
                                            type: 1,
                                            title:" ",
                                            area: ['230px', '224px'], //宽高
                                            shadeClose: true,//开启遮罩关闭
                                            content: template.compile(span_html)(data)
                                        });
                                    }
                                });
                            });
                            var cin = $(".mynews_content input:checkbox");
                            var cin1 = $("#mynews_checkbox");
                            //全选反选
                            cin1.unbind().on("click", function () {

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
                            cin.unbind().click(function(){
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
                            });
                            //删除
                            $("#myDelete").unbind().on("click",function(){
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
                                    }, function(index){
                                        common.ajaxRequest(api.BATHPATH+"bxg_anon/user/updateMsg","POST",{
                                            method:"del",
                                            msgId:arrue.toString()
                                        },function(data){
                                            if (data.success){
                                                layer.close(index);
                                                AddMynews(type, curr, pageSize);
                                                cin1[0].checked = false;
                                            }
                                        })
                                    }, function(index){
                                        layer.close(index)
                                    });
                                }
                            });
                            //已读
                            $("#myRead").unbind().on("click",function(){
                                cin = $(".mynews_content input:checkbox");
                                cin1 = $("#mynews_checkbox");
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
                                    common.ajaxRequest("bxg_anon/user/updateMsg","POST",{
                                        method:"update",
                                        msgId:arrue.toString()
                                    },function(data){
                                        if (data.success){
                                            AddMynews(type, curr, pageSize);
                                            cin1[0].checked = false;
                                        } else {
                                            layer.msg(data.errorMessage, {icon: 5});
                                        }
                                    })
                                }
                            })
                            message_status (type, curr, pageSize)
                        }
                    }
                });
            }

            AddMynews("", 1, 10);
        }

        return {
            createPage: createPage
        }
    });