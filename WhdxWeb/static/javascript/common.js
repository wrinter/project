/******************************************** AJAX请求Session过期 *************************************************/
/**
 * 设置未来(全局)的AJAX请求默认选项
 * 主要设置了AJAX请求遇到Session过期的情况
 */
$.ajaxSetup({
    type: 'POST',
    complete: function (xhr, status) {
        var sessionStatus = xhr.getResponseHeader('sessionstatus');
        if (sessionStatus == 'timeout') {
            doTimeOut();
        } else {
            if (xhr.responseJSON) {
                var code = xhr.responseJSON.retCode;
                if (code == '9304') {
                    doTimeOut();
                }
            }
        }
    }
});
function doTimeOut() {
    var top = getTopWinow();
    var Time1 = null;
    $('#c_ErrorMsg').html('登录超时，即将跳转首页').fadeIn(200);
    Disappear("#c_ErrorMsg");
    Time1 = setTimeout(function () {
        Quit();
        clearTimeout(Time1);
    }, 1500);
}
/**
 * 在页面中任何嵌套层次的窗口中获取顶层窗口
 * @return 当前页面的顶层窗口对象
 */
function getTopWinow() {
    var p = window;
    while (p != p.parent) {
        p = p.parent;
    }
    return p;
}

/***************************************本地缓存*******************************************/
$('head').append('<meta name="renderer" content="webkit"> ');
function StoreLocal() {
    (function (f) {
        if (typeof exports === "object" && typeof module !== "undefined") {
            module.exports = f()
        } else if (typeof define === "function" && define.amd) {
            define([], f)
        } else {
            var g;
            if (typeof window !== "undefined") {
                g = window
            } else if (typeof global !== "undefined") {
                g = global
            } else if (typeof self !== "undefined") {
                g = self
            } else {
                g = this
            }
            g.store = f()
        }
    })(function () {
        var define, module, exports;
        return (function e(t, n, r) {
            function s(o, u) {
                if (!n[o]) {
                    if (!t[o]) {
                        var a = typeof require == "function" && require;
                        if (!u && a)return a(o, !0);
                        if (i)return i(o, !0);
                        var f = new Error("Cannot find module '" + o + "'");
                        throw f.code = "MODULE_NOT_FOUND", f
                    }
                    var l = n[o] = {exports: {}};
                    t[o][0].call(l.exports, function (e) {
                        var n = t[o][1][e];
                        return s(n ? n : e)
                    }, l, l.exports, e, t, n, r)
                }
                return n[o].exports
            }

            var i = typeof require == "function" && require;
            for (var o = 0; o < r.length; o++)s(r[o]);
            return s
        })({
            1: [function (require, module, exports) {
                (function (global) {
                    "use strict";
                    module.exports = function () {
                        function e() {
                            try {
                                return o in n && n[o]
                            } catch (e) {
                                return !1
                            }
                        }

                        var t, r = {}, n = "undefined" != typeof window ? window : global, i = n.document, o = "localStorage", a = "script";
                        if (r.disabled = !1, r.version = "1.3.20", r.set = function (e, t) {
                            }, r.get = function (e, t) {
                            }, r.has = function (e) {
                                return void 0 !== r.get(e)
                            }, r.remove = function (e) {
                            }, r.clear = function () {
                            }, r.transact = function (e, t, n) {
                                null == n && (n = t, t = null), null == t && (t = {});
                                var i = r.get(e, t);
                                n(i), r.set(e, i)
                            }, r.getAll = function () {
                            }, r.forEach = function () {
                            }, r.serialize = function (e) {
                                return JSON.stringify(e)
                            }, r.deserialize = function (e) {
                                if ("string" == typeof e)try {
                                    return JSON.parse(e)
                                } catch (t) {
                                    return e || void 0
                                }
                            }, e()) t = n[o], r.set = function (e, n) {
                            return void 0 === n ? r.remove(e) : (t.setItem(e, r.serialize(n)), n)
                        }, r.get = function (e, n) {
                            var i = r.deserialize(t.getItem(e));
                            return void 0 === i ? n : i
                        }, r.remove = function (e) {
                            t.removeItem(e)
                        }, r.clear = function () {
                            t.clear()
                        }, r.getAll = function () {
                            var e = {};
                            return r.forEach(function (t, r) {
                                e[t] = r
                            }), e
                        }, r.forEach = function (e) {
                            for (var n = 0; n < t.length; n++) {
                                var i = t.key(n);
                                e(i, r.get(i))
                            }
                        }; else if (i && i.documentElement.addBehavior) {
                            var c, u;
                            try {
                                u = new ActiveXObject("htmlfile"), u.open(), u.write("<" + a + ">document.w=window</" + a + '><iframe src="/favicon.ico"></iframe>'), u.close(), c = u.w.frames[0].document, t = c.createElement("div")
                            } catch (l) {
                                t = i.createElement("div"), c = i.body
                            }
                            var f = function (e) {
                                return function () {
                                    var n = Array.prototype.slice.call(arguments, 0);
                                    n.unshift(t), c.appendChild(t), t.addBehavior("#default#userData"), t.load(o);
                                    var i = e.apply(r, n);
                                    return c.removeChild(t), i
                                }
                            }, d = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g"), s = function (e) {
                                return e.replace(/^d/, "___$&").replace(d, "___")
                            };
                            r.set = f(function (e, t, n) {
                                return t = s(t), void 0 === n ? r.remove(t) : (e.setAttribute(t, r.serialize(n)), e.save(o), n)
                            }), r.get = f(function (e, t, n) {
                                t = s(t);
                                var i = r.deserialize(e.getAttribute(t));
                                return void 0 === i ? n : i
                            }), r.remove = f(function (e, t) {
                                t = s(t), e.removeAttribute(t), e.save(o)
                            }), r.clear = f(function (e) {
                                var t = e.XMLDocument.documentElement.attributes;
                                e.load(o);
                                for (var r = t.length - 1; r >= 0; r--)e.removeAttribute(t[r].name);
                                e.save(o)
                            }), r.getAll = function (e) {
                                var t = {};
                                return r.forEach(function (e, r) {
                                    t[e] = r
                                }), t
                            }, r.forEach = f(function (e, t) {
                                for (var n, i = e.XMLDocument.documentElement.attributes, o = 0; n = i[o]; ++o)t(n.name, r.deserialize(e.getAttribute(n.name)))
                            })
                        }
                        try {
                            var v = "__storejs__";
                            r.set(v, v), r.get(v) != v && (r.disabled = !0), r.remove(v)
                        } catch (l) {
                            r.disabled = !0
                        }
                        return r.enabled = !r.disabled, r
                    }();
                }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
            }, {}]
        }, {}, [1])(1)
    });
}
StoreLocal();
/***************************************判断浏览器*******************************************/
function CheckBrower() {
    //返回代表浏览器名和版本号的字符串。
    var str = window.navigator.userAgent.toLowerCase();
//判断谷歌浏览器
    if (str.indexOf('chrome') != -1) {
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var edition_chrome = str.match(regStr_chrome);
        var edition_chromenum = edition_chrome.join().split('/')[1].slice(0, 4);
        if (edition_chromenum <= 40) {
            alert('您的浏览器版本太低，请升级40版本以上谷歌浏览器。');
            CloseWebPage()
        }
    }
//判断火狐浏览器
    else if (str.indexOf('firefox') != -1) {
        var regStr_ff = /firefox\/[\d.]+/gi;
        var edition_ff = str.match(regStr_ff);
        var edition_ffnum = edition_ff.join().split('/')[1].slice(0, 4);
        if (edition_ffnum <= 35) {
            alert('您的浏览器版本太低，请升级35以上火狐浏览器。');
            CloseWebPage()
        }
    } else if (str.indexOf('msie') != -1) {
        if (str.indexOf('msie 8') != -1) {
            alert('您的浏览器版本太低，请升级IE9以上浏览器。');
            CloseWebPage()
        } else if (str.indexOf('msie 5') != -1) {
            alert('您的浏览器版本太低，请升级IE9以上浏览器。');
            CloseWebPage()
        }
        else if (str.indexOf('msie 6') != -1) {
            alert('您的浏览器版本太低，请升级IE9以上浏览器。');
            CloseWebPage()
        }
        else if (str.indexOf('msie 7') != -1) {
            alert('您的浏览器版本太低，请升级IE9以上浏览器。');
            CloseWebPage()
        }
    }

    function CloseWebPage() {
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                window.opener = null;
                window.close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        }
        else if (navigator.userAgent.indexOf("Firefox") > 0) {
            window.location.href = 'about:blank ';
        } else {
            window.opener = null;
            window.open('', '_self', '');
            window.close();
        }
    }
}
/***************************************禁止浏览器返回*******************************************/
function StopBack() {
    jQuery(document).ready(function () {
        if (window.history && window.history.pushState) {
            $(window).on('popstate', function () {
                /// 当点击浏览器的 后退和前进按钮 时才会被触发，
                window.history.pushState('forward', null, '');
                window.history.forward(1);
            });
        }
        window.history.pushState('forward', null, '');  //在IE中必须得有这两行
        window.history.forward(1);
    });
}
StopBack();
/*******************************获取公共头部**************************************/
function GetHtml(urlname, i) {
    $.ajax({
        "type": "get",
        "url": urlname,
        "dataType": "html",//转换格式
        success: function (date) {
            $(i).append(date);
        }
    })
};
/*******************************返回顶部**************************************/
$(document).ready(function () {
    function backtop(classname) {
        $(classname).on("click", function () {
            $('body,html').animate({scrollTop: 0}, 500)
        })
    }

    backtop('.backtop');
});
/*******************************个人中心  弹出层的 显示 与隐藏**************************************/
function showMask(maskName, className) {
    $(maskName).css({"display": "block"});
    $(className).css({"display": "block"});
}
function hideMask(maskName, className) {
    $(maskName).css({"display": "none"});
    $(className).css({"display": "none"});
}
/*提示信息自动隐藏*/
function Disappear(a) {
    if ($(a).css('display') == 'block') {
        setTimeout(function () {
            $(a).fadeOut(1000, function () {
                $(a).css('width', '355px')
            })
        }, 2000);
    }
};
function NoDataImg(type) {
    var $NoData = '';
    if (type == 0) {
        $NoData += '<img src="../../static/image/kola/no.png" class="NoDataImg" alt="">';
    }
    else {
        $NoData += '<img src="../../static/image/kola/no.png" class="NoDataImg" alt="">';
    }

    $('#NoData').html($NoData);
}
/*弹出框使用方法*/
/* <!--提示框-->
 <div class="c_Dissolve dino" id="c_ErrorMsg"></div>
 * $('#c_ErrorMsg').html('注册失败').fadeIn(200);  Disappear("#c_ErrorMsg");
 * */
/*******************************等待时间**************************************/
function WaitTime(a, b, c) {
    $(a).css("display", 'none');
    $(b).css("display", "block");
    var f_Sendtimer0 = null;
    $(c).html(60);
    var f_SendSecNum = 60;
    if (f_Sendtimer0) {
        clearInterval(f_Sendtimer0)
    }
    f_Sendtimer0 = setInterval(function () {
        f_SendSecNum--;
        $(c).html(f_SendSecNum);
        if (f_SendSecNum == 0) {
            clearInterval(f_Sendtimer0);
            $(b).css("display", "none");
            $(a).css("display", "block");
        }
    }, 1000);
};
/*******************************退出登录**************************************/
function Quit() {
    $.ajax({
        "type": "get",
        "url": "/web/user/logout?" + Math.random(),
        "dataType": "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                window.location.href = '../../index.html';
            }
            else {
                $('#c_ErrorMsg').html('退出失败请重试').fadeIn(200);
                Disappear("#c_ErrorMsg")
            }
        }
    })
};
/****************************************时间戳转码封装**********************************************/
function getLocalTime(nS) {
    var str = new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    return str.replace(/\//g, '-').substr(0, 10);
};
/*点击a淡rub封装*/
function FadeIn(a, b) {
    $(a).on('click', function () {
        $(b).fadeIn(200);
    });
}
/*点击a淡出b封装*/
function FadeOut(a, b) {
    $(a).on('click', function () {
        $(b).fadeOut(200);
    });
}
/****************************************阻止冒泡**********************************************/
function stopBubble(evt) {
    var evt = evt || window.event;
    if (evt.stopPropagation) {
        evt.stopPropagation();
    }
    else {
        window.event.cancelBubble = true;
    }
};
/************************************抖动函数*********************************************/
function shock(obj) {
    obj.css({
        color: "red"
    });
    for (i = 1; i < 8; i++) {
        obj.animate({
            'left': '-=2'
        }, 5, function () {
            $(this).animate({
                'left': '+=4'
            }, 5, function () {
                $(this).animate({
                    'left': '-=2'
                }, 5, function () {
                    $(this).animate({
                        'left': '-=1'
                    }, 5, function () {
                        $(this).animate({
                            'left': '+=2'
                        }, 5, function () {
                            $(this).animate({
                                'left': '-=1'
                            }, 5, function () {
                                //左右晃动
                            })
                        })
                    });
                });
            });
        });
    }
}
/****************************************ajax封装**********************************************/
//ajax请求，url请求链接,paramData参数，callback回调
function post_ajaxAndData(url, paramData, callback) {
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: paramData,
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                return callback(data);
            }
        },
        error: function () {
            return callback();
        }
    });
};
/*********************************************分享**********************************************************/
var jiathis_config = {
    boldNum: 0,
    siteNum: 7,
    showClose: false,
    sm: "weixin,tsina,tqq,qzone",
    imageUrl: "http://whdx.bcbook.cn/static/image/logo/logo.jpg",
    imageWidth: 26,
    marginTop: 150,
    summary: "来自五好导学网",
    //pic: "/static/image/logo/logo.jpg",
    data_track_clickback: true,
    appkey: {
        "tsina": "您网站的新浪微博APPKEY",
        "tqq": "您网站的腾讯微博APPKEY",
        "tpeople": "您网站的人民微博APPKEY"
    },
    ralateuid: {
        "tsina": "您的新浪微博UID"
    },
}
//百度分享
window._bd_share_config = {
    common : {
        bdDesc : '欢迎使用五好导学',
        bdText : '欢迎使用五好导学',
        bdPic : 'http://whdx.bcbook.cn/static/image/logo/logo.jpg'
    },
    share : [{
        "bdSize" : 80
    }]
}
with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='../../static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];


/*********************************************截取url地址**********************************************/
function UrlSearch() {
    var name, value;
    var str = window.location.search; //取得整个地址栏参数
    var num = str.indexOf("?");
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
}
var Request = new UrlSearch(); //实例化
/*********************************************适配**********************************************/
function Page() {
    (function (win) {
        var doc = win.document;
        var docEl = doc.documentElement;
        var tid;

        function refreshRem() {
            var width = docEl.getBoundingClientRect().width;
            if (width > 1536) { // 最大宽度
                width = 1536;
            }
            var rem = width / 10; // 将屏幕宽度分成10份， 1份为1rem
            docEl.style.fontSize = rem + 'px';
            ///rem用font-size:75px来进行换算
        }

        win.addEventListener('resize', function () {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 1);
        }, false);
        win.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(refreshRem, 1);
            }
        }, false);
        refreshRem();
    })(window);
}
/************************************************手机PC识别***************************************************/
function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        Page();
        $('#Pc').css('display', 'none')
        $('#Phone').css('display', 'block')
    } else {
        $('#Pc').css('display', 'block')
        $('#Phone').css('display', 'none');
        CheckBrower();
    }
};
/************************************************登录超时***************************************************/
// document.addEventListener('click',function(){
//     CheckTimeOut();
// });


function CheckTimeOut() {
    var Href = window.location.href;
    if (Href.indexOf('chinese_article.html') != -1 || Href.indexOf('test_EnglishLetters.html') != -1 || Href.indexOf('DH_EnglishLetters.html') != -1 || Href.indexOf('DH_lettres.html') != -1 || Href.indexOf('test_lettres.html') != -1 || Href.indexOf('chinese_Teacher.html') != -1) {
        return false;
    } else if (Href.indexOf('prepare_video_prepareVideoPlay.html') != -1 || Href.indexOf('IsShare=0#jtss-cqq') != -1) {
        store.set("vedioUrl", Href);
        return false;
    }
    if (window.location.hash != '') {
        if (Href.indexOf('acrossenglish_voice') != -1) {
            return false;
        }
        if (Href.indexOf('extend_article') != -1) {
            return false;
        }
    }
    var Time = null;
    var Time1 = null;
    $.ajax({
        "type": "post",
        "url": "/web/user/check/timeout",
        "dataType": "json",
        success: function (data) {
            var AllData = data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (data.retCode == '9304' || data.retCode == 9304) {
                $('#c_ErrorMsg').html('登录超时，即将跳转首页').fadeIn(200);
                Disappear("#c_ErrorMsg");
                Time = setTimeout(function () {
                    Quit();
                    clearTimeout(Time);
                }, 2000);
            }
            if (data.retCode == '0000' || data.retCode == 0000) {
                $('#c_ErrorMsg').html('登录超时，即将跳转首页').fadeIn(200);
                Disappear("#c_ErrorMsg");
                Time1 = setTimeout(function () {
                    Quit();
                    clearTimeout(Time1);
                }, 2000);
            }
        }
    });
};
/************************************************消息小红点***************************************************/
function SystemRedMsg() {
    // var Href = window.location.href;
    // // var Chinese = (Href.indexOf('chinese_article.html') != -1 );
    // var whdx = (Href=='http://www.bcbook.cn/'||Href=='http://whdx.bcbook.cn/');
    // var whdx0 = (Href=='http://47.93.155.181/');
    // // var ChiTeacher = (Href.indexOf('chinese_Teacher.html') != -1 );
    // // var Video = (Href.indexOf('prepare_video_prepareVideoPlay.html') != -1 );
    // // var TestEng = (Href.indexOf('test_EnglishLetters.html') != -1 );
    // // var TestLet = (Href.indexOf('test_lettres.html') != -1 );
    // // var EntArt = (Href.indexOf('extend_article.html') != -1 );
    // // var EntVoice = (Href.indexOf('acrossenglish_voice.html') != -1 );
    // // var Index = (Href.indexOf('index.html') != -1 );
    // // var Found = (Href.indexOf('foundpass.html') != -1 );
    // // var Reg = (Href.indexOf('register.html') != -1 );
    // if (Chinese || Video || ChiTeacher || TestEng || TestLet || EntArt || EntVoice || Index || Found || Reg|| whdx|| whdx0) {
    //     return false;
    // }
    // else {
    //
    // }
    $.ajax({
        "type": "post",
        "url": "/web/user/pcUserMessageSize",
        "dataType": "json",
        success: function (data) {
            var AllData = data.retData;
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                if (AllData > 0) {
                    if (AllData < 99) {
                        $('.AllMsgNum').css('display', 'block').html(AllData);
                    }
                    else {
                        $('.AllMsgNum').css('display', 'block').html('99+');
                    }
                } else {
                    $('.AllMsgNum').css('display', 'none');
                }
            }
        }
    });
};

/************************************************金币经验***************************************************/
function GoldAnimate(GoldNum) {
    if (GoldNum <= 0) {
        return false;
    }
    var $GoldHtml = '';
    $GoldHtml += '<div class="Com_Gold" id="Com_Gold">';
    $GoldHtml += '<img src="../../static/image/sprite/goldimg.png" alt="" class="Com_GoldImg">';
    $GoldHtml += '<p class="Com_GoldNum" id="Com_GoldNum"></p>';
    $GoldHtml += '<audio src="../../static/plugin/song/gold.wav" autoplay id="GoldAudio"></audio>';
    $GoldHtml += '</div>';
    $('body,html').append($GoldHtml);
    $('#Com_Gold').animate({bottom: '40%'}, 1000, function () {
        $('#Com_Gold').animate({bottom: '50%', opacity: '0'}, 2500, function () {
            $('#Com_Gold').css({'bottom': '-150px', 'opacity': '1'});
        });
    });
    $('#Com_GoldNum').html('金币+' + GoldNum);
};
//存入cookie
function SetCookie(key, value, day) {
    var dat = new Date();
    dat.setDate(dat.getDate() + day);
    document.cookie = key + '=' + escape(value) + ';expires=' + dat + ';path=/';
}
$(window).unload(function () {
    removeCookie('backPreviewToken')
});
function removeCookie(key) {
    SetCookie(key, "0", -1);
}
//统一的时间格式

function ToComTime(value) {
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    var Result;//最终时间
    if(value==null||value==''||value=='--'){
        Result='——';
    }else {
        if(theTime > 60) {
            theTime1 = parseInt(theTime/60);
            theTime = parseInt(theTime%60);
            if(theTime1 > 60) {
                theTime2 = parseInt(theTime1/60);
                theTime1 = parseInt(theTime1%60);
            }
        }

        if(parseInt(theTime)<=9){
            var Sec = "0"+parseInt(theTime);
        }else {
            var Sec =parseInt(theTime);
        }
        if(parseInt(theTime1)<=9){
            var Min = "0"+parseInt(theTime1);
        }else {
            var Min =parseInt(theTime1);
        }
        if(parseInt(theTime2)<=9){
            var Hour = "0"+parseInt(theTime2);
        }else {
            var Hour =parseInt(theTime2);
        }
         Result=Hour+':'+Min+':'+Sec;
    }
    return Result;
}
function ToSecTime(Value) {
    var Result;
    if(Value==null||Value==''||Value=='--'){
        Result=0;
    }else {
        Result=Math.ceil(Value/60);
    }
    return Result;
}
/************************************************latex公式***************************************************/
function intMathJax() {
    var thisBody = document.getElementsByTagName("body")[0],
        scripts = document.getElementsByTagName("script"),
        oldLatexScript;
    for(var i=0;i<scripts.length;i++){
        oldLatexScript = scripts[i].hasAttribute("src") ? scripts[i].getAttribute("src").indexOf("MathJax.js?config=") != -1 ? scripts[i] : null : null;
        if(oldLatexScript){
            break;
        }
    }
    if(oldLatexScript){
        var math = $(".edit_Box_source") ? $(".edit_Box_source").size() > 0 ? $(".edit_Box_source")[0] : null : null;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, math]);//在math容器里重载MathJax
        //去除重复id
        if($(".edit_Box_work").length > 0){
            var $s = $(".edit_Box_work")[0].getElementsByTagName("*");
            for(var i=0;i<$s.length;i++){
                if($s[i].hasAttribute("id") && ($s[i].getAttribute("id").indexOf("MathJax-Element") != -1 || $s[i].getAttribute("id").indexOf("MJXc-Node") != -1)){
                    $s[i].removeAttribute("id");
                }
            }
        }
    }else{
        //获取request:subjectId
        var subId = Request.subjectId || 0;
        if(subId){
            var data = {};
            data.retData = {};
            data.retData.subjectId = subId;
            latexSuccess(data);
        }else{
            //获取学科
            $.ajax({
                type: "post",
                url: "/web/teacher/center/baseinfo",
                data: {},
                async: true,
                success: function (data) {
                    data.retCode == "0000" ? data.retData ? data.retData.length != 0 ? latexSuccess(data) : latexError() : latexError() : latexError();
                },
                error: function () {
                    latexError();
                }
            });
        }
        function latexSuccess(data) {
            //处理公式
            var subjectId = data.retData.subjectId;
            if(subjectId == "02" || subjectId == "06" || subjectId == "07" || subjectId == "08" || subjectId == "09"){
                var latexStyle = document.createElement("style"),
                    latexScript = document.createElement("script"),
                    intLatex = latexScript.cloneNode(false);
                latexScript.setAttribute("src","../../MathJax-master/MathJax.js?config=TeX-MML-AM_CHTML");
                intLatex.setAttribute("type","text/x-mathjax-config");
                intLatex.innerHTML = "MathJax.Hub.Config({messageStyle: 'none',showMathMenu: false,tex2jax: {inlineMath: [['$','$']]}});";
                latexStyle.innerHTML = ".MathJax_CHTML{margin-top:5px;font-family: Arial, Chandara;margin-right:2px;}.MathJax{font-family: Arial, Chandara;}.MathJax span{line-height: normal !important;}";
                thisBody.appendChild(latexScript);
                thisBody.appendChild(intLatex);
                thisBody.appendChild(latexStyle);
            }
        }
        function latexError() {
            //暂无处理规则
        }
    }
}
//首页底部二维码
function ShowWeixinCode() {
    $(".Footer_Weixin").hover(function () {
        $('.Footer_Weicode').stop(true).fadeIn(150);
    },function () {
        $('.Footer_Weicode').stop(true).fadeOut(150);
    })
}

function BaiduCom() {
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?0c0420c5832d1c755d97607d53f4a9e8";
        var s = document.getElementsByTagName("head")[0];
        s.appendChild(hm, s);
    })();
}
BaiduCom()