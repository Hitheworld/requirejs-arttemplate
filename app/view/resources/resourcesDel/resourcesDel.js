/**
 * 扩展资源列表
 */
define(['template',
		'jquery',
		'layui',
		'layer',
		'laypage',
		'text!tplUrl/resources/resourcesDel/resourcesDel.html',
		'text!tplUrl/resources/resourcesDel/ApplyResource.html',
		'text!tplUrl/common/login/popup.login.html',
		'popupLogin',
		'common',
		'api',
		'jquery.cityselect',
		'jquery.validate',
		'jquery.validate.zh',
		'jquery.form',
		'css!font-awesome',
		'css!cssUrl/resourcesDel',
		'css!cssUrl/popup.login'
	],
	function (template,$,layui,layer,laypage,
	          resourcesDelTpl,
	          ApplyResourceTpl,
			  popupLoginTpl,
		      popupLogin,
	          common,api) {

		function createPage(resourceId) {
			document.title = "博学谷·院校-教师端扩展资源";
			//设置导航的active
			//$(".home-header .home-nav .home-nav-li a").removeClass("active");
			//$(".home-header .home-nav .home-nav-li a.course").addClass("active");


			//数据源
			var resourcesDelDB = resourcesDel(resourceId);
			//申请资源
			var resourcesDelClaimRecordDB = resourcesDelClaimRecord(resourceId);

			//判断扩展资源的状态
			var StatusDB = resourcesDelCheckApplyStatus(resourceId);
			//  0  ---没有登录
			//  1  ---非认证教师
			//  2; ----资源待审核中
			// 3;  ----可以申请资源

			$("#content").html(template.compile( resourcesDelTpl)({
				resourcesDelDB: resourcesDelDB,
				ClaimRecordDB: resourcesDelClaimRecordDB,
				StatusDB: StatusDB
			}));

			//分享按钮
			$(".J-btn-fx").on('click', function(){
				$(".fx-box").toggle();
			});

			//登录
			$(".J-apply-resource").on('click', function(){
				if(StatusDB.resultObject != undefined &&  StatusDB.resultObject == 0){
					layer.open({
						type: 1,
						title: false,
						skin: 'layui-layer-rim', //加上边框
						area: ['500px', '500px'], //宽高
						content: popupLoginTpl
					});
					//加载弹窗登录js文件;
					popupLogin.popupLogin();
				} else if (StatusDB.resultObject == 2) {

				} else if (StatusDB.resultObject == 3) {
					//申请
					addResource();
				}
			});



			//申请
			function addResource(){
				layer.open({
					type: 1,
					title: "填写资源申请表",
					skin: 'layui-layer-rim', //加上边框
					area: ['738px','734px'], //宽高
					content: template.compile( ApplyResourceTpl)({

					})
				});
				//初始化三级省市区
				$("#citybox").citySelect({prov:"江苏", city:"南京", dist:"玄武区南京"});
				//加减交互
				$(".J-add").click(function(){
					var t=$(this).parent().find('input[class*=btn-input]');
					t.val(parseInt(t.val())+1)
					setTotal();
				})
				$(".J-min").click(function(){
					var t=$(this).parent().find('input[class*=btn-input]');
					t.val(parseInt(t.val())-1)
					if(parseInt(t.val())<0){
						t.val(0);
					}
					setTotal();
				})
				function setTotal(){
					var s=0;
					$("#tab td").each(function(){
						s+=parseInt($(this).find('input[class*=btn-input]').val())
							*parseFloat($(this).find('span[class*=price]').text());
					});
				}
				setTotal();

				//检验
				var number = $("#number").val(),   //申请数量
					province,  //地址---省
					city,   //地址---市
					area,   //地址---区
					address = $("#address").val(),   //地址---详细地址
					postalcode = $("#postalcode").val(),  //编码
					consigneeName = $("#consigneeName").val(),  //收货人
					phone = $("#phone").val(),   //手机号
					reason = $("#reason").val();  //申请理由

				$("#province").change(function() {   //地址---省
					province = $("#province option:checked").val();
				});
				$("#city").change(function() {       //地址---市
					city = $("#city option:checked").val();
				});
				$("#area").change(function() {      //地址---区
					area = $("#area option:checked").val();
				});

				$("#ApplyResourceForm").validate({
					rules : {
						number : {
							required : true,
							digits: true,
							min: 1
						},
						province : {
							required : true
						},
						city : {
							required : true
						},
						area : {
							required : true
						},
						address : {
							required : true
						},
						postalcode : {
							required : true,
							isZipCode: true
						},
						consigneeName : {
							required : true
						},
						phone : {
							required : true,
							isMobile: true
						},
						reason : {
							required : true
						}

					},
					messages : {
						number : {
							required : "请填写申请数量"
						},
						province : {
							required : "请选择省份"
						},
						city : {
							required :  "请选择市"
						},
						area : {
							required :  "请选择区"
						},
						address : {
							required :  "请填写详情地址"
						},
						postalcode : {
							required :  "请填写编码"
						},
						consigneeName : {
							required : "请填写姓名"
						},
						phone : {
							required : "请填写手机号"
						},
						reason : {
							required : "请填写申请理由"
						}
					},
					errorElement : "p"
				});

				$('#ApplyResourceForm').on("submit",function() {
					var number = $("#number").val(),   //申请数量
						province,  //地址---省
						city,   //地址---市
						area,   //地址---区
						address = $("#address").val(),   //地址---详细地址
						postalcode = $("#postalcode").val(),  //编码
						consigneeName = $("#consigneeName").val(),  //收货人
						phone = $("#phone").val(),   //手机号
						reason = $("#reason").val();  //申请理由


						province = $("#province option:checked").val();  //地址---省
						city = $("#city option:checked").val();   //地址---市
						area = $("#area option:checked").val();   //地址---区

						if (number != '' && province != '' && city != '' && area!= ''&& address!= ''&& postalcode!= ''
							&& consigneeName!= ''&& phone!= ''&& reason!= ''
						){
							var mail_address = (province + city + area + address).toString();
							console.log("地址:",mail_address,"数量:",number,"编码",postalcode,"收货人:",consigneeName,"手机号:",phone,"理由",reason);
							var ToTeacherDB = resourcesDelAddResourceToTeacher(resourceId,number, mail_address, postalcode,consigneeName, phone, reason);

							if (ToTeacherDB.success) {
								//资源待审核中
								layer.msg('提交成功！我们将在2日内回馈审核结果！');
								setTimeout(function(){
									history.go(0);
								},2000);
							} else {
								layer.alert(ToTeacherDB.errorMessage);
								return false; //阻止表单默认提交
							}

						}else {
							return false;
						};


					return false; //阻止表单默认提交
				});


			};


		}


		//获取扩展资源详情数据
		var resourcesDel = function(resourceId ) {
			return common.requestService('bxg/home/detailExtendResource','get', {
				resourceId: resourceId
			});
		};


		//获取扩展资源申请资源数据
		var resourcesDelClaimRecord = function(resourceId ) {
			return common.requestService('bxg/home/teacherApply','get', {
				resourceId: resourceId
			});
		};


		//获取判断扩展资源的状态
		var resourcesDelCheckApplyStatus = function(resourceId ) {
			return common.requestService('bxg/home/checkApplyStatus','get', {
				resourceId: resourceId
			});
		};

		//申请扩展资源
		var resourcesDelAddResourceToTeacher = function(extend_resource_id, num, mail_address, post_code, receiver, receiver_mobile,apply_reason ) {
			return common.requestService('bxg/home/addResourceToTeacher','post', {
				extend_resource_id: extend_resource_id,  //资源ID
				num: num,                                   //申请数量
				mail_address: mail_address,                //邮寄地址
				post_code: post_code,                       //邮编
				receiver: receiver,                         //收件人
				receiver_mobile: receiver_mobile,           //收件人手机号，
				apply_reason: apply_reason                  //申请原因
			});
		};


		return {
			createPage: createPage
		}
	});