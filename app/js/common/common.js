define(['jquery','layer','api','viewer'], function ($,layer,apiUrl) {
	
	$( document ).ajaxSend(function( event, jqxhr, settings ) {
		var index = layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
		settings.layerIndex = index;
	}).ajaxComplete(function( event, xhr, settings ) {
		 layer.close(settings.layerIndex); 
	});

	var excommon = {};
	
	/**
	 * 异步加载
	 * @param url
	 * @param data
	 * @param callback
	 */
	function ajaxRequest(url, types, data, callback) {
		var result = {};
	    $.ajax({
	        url:apiUrl.BATHPATH + url,
	        data: data,
	        type: types,
	        success: function (datas) {
		        result = datas;
	            if (sessionValidate(datas)) {
	                callback(datas);
	            }
	        },
	        error: function (response) {
	//			unmask();
	            try {
	                var res = eval("(" + response.responseText + ")");
	                console.log(res.errorMessage);
	
	            } catch (e) {
	                console.log(response.responseText);
	            }
	        }
	    });
		return result;
	}


	/**
	 * 异步加载*---用于测试
	 * @param url
	 * @param data
	 * @param callback
	 */
	function TextajaxRequest(url, types, data, callback) {
		var result = {};
		$.ajax({
			url: url,
			data: data,
			type: types,
			success: function (datas) {
				result = datas;
				if (sessionValidate(datas)) {
					callback(datas);
				}
			},
			error: function (response) {
				//			unmask();
				try {
					var res = eval("(" + response.responseText + ")");
					console.log(res.errorMessage);

				} catch (e) {
					console.log(response.responseText);
				}
			}
		});
		return result;
	}

	
	/**
	 * 同步加载
	 * @param url
	 * @param data
	 * @param callback
	 */
	function syncRequest(url, types, data, callback) {
	    $.ajax({
	        url: url,
	        data: data,
	        type: types,
	        async: false,
	        success: function (datas) {
	            if (sessionValidate(datas)) {
	                callback(datas);
	            }
	        }
	    });
	}

	//ajax统一请求
	excommon.requestService = function (url,types, param, callback, requstType) {
		var result = {};
		$.ajax({
			async: false,
			url: apiUrl.BATHPATH + url,
			type: types || 'get',
			data: param,
			success: function (data) {
				result = data;
				isJumpToLogin(data);
				if (callback) {
					callback(data);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				if(callback) {
					//callback({error: errorThrown})
				}
			}
		});
		return result;
	};

	//ajax统一请求
	excommon.TextRequestService = function (url,types, param, callback, requstType) {
		var result = {};
		$.ajax({
			async: false,
			url: url,
			type: types || 'get',
			data: param,
			success: function (data) {
				result = data;
				isJumpToLogin(data);
				if (callback) {
					callback(data);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				if(callback) {
					//callback({error: errorThrown})
				}
			}
		});
		return result;
	};
	
	/**
	 * js异步操作时的session失效判断
	 * @param datas
	 */
	function sessionValidate(datas) {
		isJumpToLogin(datas);
	    if (Object.prototype.toString.call(datas) === "[object String]") {
	        if (datas.indexOf("<!DOCTYPE>") > -1 || datas.indexOf("<!doctype html>") > -1) {//ssion失效自动刷新页面
	            window.location.reload();
	            return false;
	        }
	    }
	    return true;
	}
	
	
	/**
	 * 非空验证
	 */
	function isnull(data) {
	    if (data == null || data == undefined || data == "") {
	        return true;
	    } else {
	        return false;
	    }
	}
	
	
	/**
	 * 轮播
	 * @param BannerClass
	 */
	var cy_add;
	var cy_add2;
	function index_banner(BannerClass,PrevClass,NextClass,circleClass,num) {
	    function index_banner_nextscroll() {
	        clearInterval(cy_add);
	        var vcon = $("." + BannerClass);
	        var offset = ($("." + BannerClass + " li").width()) * -1;
	        vcon.stop().animate({
	            left: offset
	        }, "slow", function () {
	            var firstItem = $("." + BannerClass + " ul li").first();
	            vcon.find("ul").append(firstItem);
	            $(this).css("left", "0px");
	            if (!isnull(circleClass)){
	                circle()
	            }
	        });
	        cy_add = setInterval(function(){
	            index_banner_nextscroll()
	        },num);
	    }
	    function circle() {
	        var currentItem = $("."+BannerClass+" ul li").first();
	        var currentIndex = currentItem.attr("index");
	        $("."+circleClass+" li").removeClass("cy_circle-cur");
	        $("."+circleClass+" li").eq(currentIndex).addClass("cy_circle-cur");
	    }
	    $("." + NextClass).on("click", function () {
	        index_banner_nextscroll();
			clearInterval(cy_add);
	    });
	    $("." + PrevClass).on("click", function () {
	        clearInterval(cy_add);
	        var vcon = $("." + BannerClass);
	        var offset = ($("." + BannerClass + " li").width() * -1);
	        var lastItem = $("." + BannerClass + " ul li").last();
	        vcon.find("ul").prepend(lastItem);
	        vcon.css("left", offset);
	        vcon.animate({
	            left: "0px"
	        }, "slow", function () {
	            if (!isnull(circleClass)){
	                circle()
	            }
	        });
	        //cy_add = setInterval(function(){
	        //    index_banner_nextscroll()
	        //},num);
	    });
		$(".cy_show").hover(function(){
			clearInterval(cy_add);
			$(".cy_prev,.cy_next").css("display","block")
		},function(){
			clearInterval(cy_add);
			$(".cy_prev,.cy_next").css("display","none");
			//setTimeout(function(){
			//	index_banner_nextscroll()
			//},3000)
			cy_add = setInterval(function(){
				index_banner_nextscroll()
			},num);

		});
	    if (!isnull(circleClass)){
	        $("."+circleClass+" li:eq(0)").addClass("cy_circle-cur");
	        var animateEnd = 1;
	        $("."+circleClass+" li").click(function () {
	            clearInterval(cy_add);
	            if (animateEnd == 0) {
	                return
	            }
	            $(this).addClass("cy_circle-cur").siblings().removeClass("cy_circle-cur");
	            var nextindex = $(this).index();
	            var currentindex = $("."+BannerClass+" li").first().attr("index");
	            var curr = $("."+BannerClass+" li").first().clone();
	            if (nextindex > currentindex) {
	                for (var i = 0; i < nextindex - currentindex; i++) {
	                    var firstItem = $("."+BannerClass+" li").first();
	                    $("."+BannerClass+" ul").append(firstItem)
	                }
	                $("."+BannerClass+" ul").prepend(curr);
	                var offset = ($("."+BannerClass+" li").width()) * -1;
	                if (animateEnd == 1) {
	                    animateEnd = 0;
	                    $("."+BannerClass).stop().animate({
	                        left: offset
	                    }, "slow", function () {
	                        $("."+BannerClass+" ul li").first().remove();
	                        $("."+BannerClass+"").css("left", "0px");
	                        if (!isnull(circleClass)){
	                            circle()
	                        }
	                        animateEnd = 1
	                    })
	                }
	            } else {
	                var curt = $("."+BannerClass+" li").last().clone();
	                for (var i = 0; i < currentindex - nextindex; i++) {
	                    var lastItem = $("."+BannerClass+" li").last();
	                    $("."+BannerClass+" ul").prepend(lastItem)
	                }
	                $("."+BannerClass+" ul").append(curt);
	                var offset = ($("."+BannerClass+" li").width()) * -1;
	                $("."+BannerClass+"").css("left", offset);
	                if (animateEnd == 1) {
	                    animateEnd = 0;
	                    $("."+BannerClass).stop().animate({
	                        left: "0px"
	                    }, "slow", function () {
	                        $("."+BannerClass+" ul li").last().remove();
	                        if (!isnull(circleClass)){
	                            circle()
	                        }
	                        animateEnd = 1
	                    })
	                }
	            }
	            //cy_add = setInterval(function(){
	            //    index_banner_nextscroll()
	            //},num)
	        });
	    }
	    cy_add = setInterval(function(){
	        index_banner_nextscroll()
	    },num);
	}
	
	function index_banner2(BannerClass,PrevClass,NextClass,circleClass,num) {
	    function index_banner_nextscroll() {
	        clearInterval(cy_add2);
	        var vcon = $("." + BannerClass);
	        var offset = ($("." + BannerClass + " li").width()) * -1;
	        vcon.stop().animate({
	            left: offset
	        }, "slow", function () {
	            var firstItem = $("." + BannerClass + " ul li").first();
	            vcon.find("ul").append(firstItem);
	            $(this).css("left", "0px");
	            if (!isnull(circleClass)){
	                circle()
	            }
	        });
	        cy_add2 = setInterval(function(){
	            index_banner_nextscroll()
	        },num);
	    }
	    function circle() {
	        var currentItem = $("."+BannerClass+" ul li").first();
	        var currentIndex = currentItem.attr("index");
	        $("."+circleClass+" li").removeClass("cy_circle-cur");
	        $("."+circleClass+" li").eq(currentIndex).addClass("cy_circle-cur");
	    }
	    $("." + NextClass).on("click", function () {
	        index_banner_nextscroll();
	    });
	    $("." + PrevClass).on("click", function () {
	        clearInterval(cy_add2);
	        var vcon = $("." + BannerClass);
	        var offset = ($("." + BannerClass + " li").width() * -1);
	        var lastItem = $("." + BannerClass + " ul li").last();
	        vcon.find("ul").prepend(lastItem);
	        vcon.css("left", offset);
	        vcon.animate({
	            left: "0px"
	        }, "slow", function () {
	            if (!isnull(circleClass)){
	                circle()
	            }
	        });
	        cy_add2 = setInterval(function(){
	            index_banner_nextscroll()
	        },num);
	    });
	    if (!isnull(circleClass)){
	        $("."+circleClass+" li:eq(0)").addClass("cy_circle-cur");
	        var animateEnd = 1;
	        $("."+circleClass+" li").click(function () {
	            clearInterval(cy_add2);
	            if (animateEnd == 0) {
	                return
	            }
	            $(this).addClass("cy_circle-cur").siblings().removeClass("cy_circle-cur");
	            var nextindex = $(this).index();
	            var currentindex = $("."+BannerClass+" li").first().attr("index");
	            var curr = $("."+BannerClass+" li").first().clone();
	            if (nextindex > currentindex) {
	                for (var i = 0; i < nextindex - currentindex; i++) {
	                    var firstItem = $("."+BannerClass+" li").first();
	                    $("."+BannerClass+" ul").append(firstItem)
	                }
	                $("."+BannerClass+" ul").prepend(curr);
	                var offset = ($("."+BannerClass+" li").width()) * -1;
	                if (animateEnd == 1) {
	                    animateEnd = 0;
	                    $("."+BannerClass).stop().animate({
	                        left: offset
	                    }, "slow", function () {
	                        $("."+BannerClass+" ul li").first().remove();
	                        $("."+BannerClass+"").css("left", "0px");
	                        if (!isnull(circleClass)){
	                            circle()
	                        }
	                        animateEnd = 1
	                    })
	                }
	            } else {
	                var curt = $("."+BannerClass+" li").last().clone();
	                for (var i = 0; i < currentindex - nextindex; i++) {
	                    var lastItem = $("."+BannerClass+" li").last();
	                    $("."+BannerClass+" ul").prepend(lastItem)
	                }
	                $("."+BannerClass+" ul").append(curt);
	                var offset = ($("."+BannerClass+" li").width()) * -1;
	                $("."+BannerClass+"").css("left", offset);
	                if (animateEnd == 1) {
	                    animateEnd = 0;
	                    $("."+BannerClass).stop().animate({
	                        left: "0px"
	                    }, "slow", function () {
	                        $("."+BannerClass+" ul li").last().remove();
	                        if (!isnull(circleClass)){
	                            circle()
	                        }
	                        animateEnd = 1
	                    })
	                }
	            }
	            cy_add2 = setInterval(function(){
	                index_banner_nextscroll()
	            },num)
	        });
	    }
	    cy_add2 = setInterval(function(){
	        index_banner_nextscroll()
	    },num);
	}


	/**
	 * 上下轮播
	 * @param data
	 */
	var bannerNum;
	function UpDownShuffling(BannerClass,PrevClass,NextClass,circleClass,num) {
		function UpDown_banner_nextscroll() {
			clearInterval(bannerNum);
			var vcon = $("." + BannerClass);
			var offset = ($("." + BannerClass + " li").width()) * -1;
			vcon.stop().animate({
				top: offset
			}, "slow", function () {
				var firstItem = $("." + BannerClass + " ul li").first();
				vcon.find("ul").append(firstItem);
				$(this).css("top", "0px");
				if (!isnull(circleClass)){
					circle()
				}
			});
			bannerNum = setInterval(function(){
				UpDown_banner_nextscroll()
			},num);
		}
		function circle() {
			var currentItem = $("."+BannerClass+" ul li").first();
			var currentIndex = currentItem.attr("index");
			$("."+circleClass+" li").removeClass("cy_circle-cur");
			$("."+circleClass+" li").eq(currentIndex).addClass("cy_circle-cur");
		}
		$("." + NextClass).on("click", function () {
			UpDown_banner_nextscroll();
		});
		$("." + PrevClass).on("click", function () {
			clearInterval(bannerNum);
			var vcon = $("." + BannerClass);
			var offset = ($("." + BannerClass + " li").width() * -1);
			var lastItem = $("." + BannerClass + " ul li").last();
			vcon.find("ul").prepend(lastItem);
			vcon.css("top", offset);
			vcon.animate({
				top: "0px"
			}, "slow", function () {
				if (!isnull(circleClass)){
					circle()
				}
			});
			bannerNum = setInterval(function(){
				UpDown_banner_nextscroll()
			},num);
		});
		if (!isnull(circleClass)){
			$("."+circleClass+" li:eq(0)").addClass("cy_circle-cur");
			var animateEnd = 1;
			$("."+circleClass+" li").click(function () {
				clearInterval(bannerNum);
				if (animateEnd == 0) {
					return
				}
				$(this).addClass("cy_circle-cur").siblings().removeClass("cy_circle-cur");
				var nextindex = $(this).index();
				var currentindex = $("."+BannerClass+" li").first().attr("index");
				var curr = $("."+BannerClass+" li").first().clone();
				if (nextindex > currentindex) {
					for (var i = 0; i < nextindex - currentindex; i++) {
						var firstItem = $("."+BannerClass+" li").first();
						$("."+BannerClass+" ul").append(firstItem)
					}
					$("."+BannerClass+" ul").prepend(curr);
					var offset = ($("."+BannerClass+" li").width()) * -1;
					if (animateEnd == 1) {
						animateEnd = 0;
						$("."+BannerClass).stop().animate({
							top: offset
						}, "slow", function () {
							$("."+BannerClass+" ul li").first().remove();
							$("."+BannerClass+"").css("top", "0px");
							if (!isnull(circleClass)){
								circle()
							}
							animateEnd = 1
						})
					}
				} else {
					var curt = $("."+BannerClass+" li").last().clone();
					for (var i = 0; i < currentindex - nextindex; i++) {
						var lastItem = $("."+BannerClass+" li").last();
						$("."+BannerClass+" ul").prepend(lastItem)
					}
					$("."+BannerClass+" ul").append(curt);
					var offset = ($("."+BannerClass+" li").width()) * -1;
					$("."+BannerClass+"").css("top", offset);
					if (animateEnd == 1) {
						animateEnd = 0;
						$("."+BannerClass).stop().animate({
							top: "0px"
						}, "slow", function () {
							$("."+BannerClass+" ul li").last().remove();
							if (!isnull(circleClass)){
								circle()
							}
							animateEnd = 1
						})
					}
				}
				bannerNum = setInterval(function(){
					UpDown_banner_nextscroll()
				},num)
			});
		}
		bannerNum = setInterval(function(){
			UpDown_banner_nextscroll()
		},num);
	}


	//是否跳转到登录页面
	function isJumpToLogin(data){
		if(isJson(data)){
			if(!data.success && data.resultObject == 'needLogin'){
				window.location.href='index.html#/login';
			}
		}
	}
	
	function isJson(obj){
		var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; 
		return isjson;
	}


	/**
	 * 图片放大功能
	 * @param _this
	 */
	function initImageViewer(_this) {
		_this.viewer({
			navbar: false,
			toolbar: false,
			transition: false,
			minZoomRatio: 0.05,//最小可以缩小到5%
			maxZoomRatio: 5//最大可以放大到500%
		});
	}



	return {
		initImageViewer: initImageViewer,
		ajaxRequest: ajaxRequest,
		TextajaxRequest: TextajaxRequest,
		syncRequest: syncRequest,
		requestService: excommon.requestService,
		TextrequestService: excommon.TextRequestService,
		sessionValidate: sessionValidate,
		isnull: isnull,
		index_banner: index_banner,
		index_banner2: index_banner2,
		UpDownShuffling: UpDownShuffling
	}

});