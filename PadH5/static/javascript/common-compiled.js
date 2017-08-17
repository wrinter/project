/*** Created by Echonessy on 2017/7/25.*/
/*********************************************适配**********************************************/
function Page() {
    (function (win) {
        var doc = win.document;
        var docEl = doc.documentElement;
        var tid;
        function refreshRem() {
            var width = docEl.getBoundingClientRect().width;
            if (width > 1800) {
                // 最大宽度
                width = 1800;
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
Page();
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
/*********************************************判断对象是否为空**********************************************/
function isEmptyObject(e) {
    var t;
    for (t in e) return !1;
    return !0;
}
/*********************************************本地缓存**********************************************/
function StoreLocal() {
    (function (f) {
        if (typeof exports === "object" && typeof module !== "undefined") {
            module.exports = f();
        } else if (typeof define === "function" && define.amd) {
            define([], f);
        } else {
            var g;
            if (typeof window !== "undefined") {
                g = window;
            } else if (typeof global !== "undefined") {
                g = global;
            } else if (typeof self !== "undefined") {
                g = self;
            } else {
                g = this;
            }
            g.store = f();
        }
    })(function () {
        var define, module, exports;
        return function e(t, n, r) {
            function s(o, u) {
                if (!n[o]) {
                    if (!t[o]) {
                        var a = typeof require == "function" && require;
                        if (!u && a) return a(o, !0);
                        if (i) return i(o, !0);
                        var f = new Error("Cannot find module '" + o + "'");
                        throw f.code = "MODULE_NOT_FOUND", f;
                    }
                    var l = n[o] = { exports: {} };
                    t[o][0].call(l.exports, function (e) {
                        var n = t[o][1][e];
                        return s(n ? n : e);
                    }, l, l.exports, e, t, n, r);
                }
                return n[o].exports;
            }

            var i = typeof require == "function" && require;
            for (var o = 0; o < r.length; o++) s(r[o]);
            return s;
        }({
            1: [function (require, module, exports) {
                (function (global) {
                    "use strict";

                    module.exports = function () {
                        function e() {
                            try {
                                return o in n && n[o];
                            } catch (e) {
                                return !1;
                            }
                        }

                        var t,
                            r = {},
                            n = "undefined" != typeof window ? window : global,
                            i = n.document,
                            o = "localStorage",
                            a = "script";
                        if (r.disabled = !1, r.version = "1.3.20", r.set = function (e, t) {}, r.get = function (e, t) {}, r.has = function (e) {
                            return void 0 !== r.get(e);
                        }, r.remove = function (e) {}, r.clear = function () {}, r.transact = function (e, t, n) {
                            null == n && (n = t, t = null), null == t && (t = {});
                            var i = r.get(e, t);
                            n(i), r.set(e, i);
                        }, r.getAll = function () {}, r.forEach = function () {}, r.serialize = function (e) {
                            return JSON.stringify(e);
                        }, r.deserialize = function (e) {
                            if ("string" == typeof e) try {
                                return JSON.parse(e);
                            } catch (t) {
                                return e || void 0;
                            }
                        }, e()) t = n[o], r.set = function (e, n) {
                            return void 0 === n ? r.remove(e) : (t.setItem(e, r.serialize(n)), n);
                        }, r.get = function (e, n) {
                            var i = r.deserialize(t.getItem(e));
                            return void 0 === i ? n : i;
                        }, r.remove = function (e) {
                            t.removeItem(e);
                        }, r.clear = function () {
                            t.clear();
                        }, r.getAll = function () {
                            var e = {};
                            return r.forEach(function (t, r) {
                                e[t] = r;
                            }), e;
                        }, r.forEach = function (e) {
                            for (var n = 0; n < t.length; n++) {
                                var i = t.key(n);
                                e(i, r.get(i));
                            }
                        };else if (i && i.documentElement.addBehavior) {
                            var c, u;
                            try {
                                u = new ActiveXObject("htmlfile"), u.open(), u.write("<" + a + ">document.w=window</" + a + '><iframe src="/favicon.ico"></iframe>'), u.close(), c = u.w.frames[0].document, t = c.createElement("div");
                            } catch (l) {
                                t = i.createElement("div"), c = i.body;
                            }
                            var f = function (e) {
                                return function () {
                                    var n = Array.prototype.slice.call(arguments, 0);
                                    n.unshift(t), c.appendChild(t), t.addBehavior("#default#userData"), t.load(o);
                                    var i = e.apply(r, n);
                                    return c.removeChild(t), i;
                                };
                            },
                                d = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g"),
                                s = function (e) {
                                return e.replace(/^d/, "___$&").replace(d, "___");
                            };
                            r.set = f(function (e, t, n) {
                                return t = s(t), void 0 === n ? r.remove(t) : (e.setAttribute(t, r.serialize(n)), e.save(o), n);
                            }), r.get = f(function (e, t, n) {
                                t = s(t);
                                var i = r.deserialize(e.getAttribute(t));
                                return void 0 === i ? n : i;
                            }), r.remove = f(function (e, t) {
                                t = s(t), e.removeAttribute(t), e.save(o);
                            }), r.clear = f(function (e) {
                                var t = e.XMLDocument.documentElement.attributes;
                                e.load(o);
                                for (var r = t.length - 1; r >= 0; r--) e.removeAttribute(t[r].name);
                                e.save(o);
                            }), r.getAll = function (e) {
                                var t = {};
                                return r.forEach(function (e, r) {
                                    t[e] = r;
                                }), t;
                            }, r.forEach = f(function (e, t) {
                                for (var n, i = e.XMLDocument.documentElement.attributes, o = 0; n = i[o]; ++o) t(n.name, r.deserialize(e.getAttribute(n.name)));
                            });
                        }
                        try {
                            var v = "__storejs__";
                            r.set(v, v), r.get(v) != v && (r.disabled = !0), r.remove(v);
                        } catch (l) {
                            r.disabled = !0;
                        }
                        return r.enabled = !r.disabled, r;
                    }();
                }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
            }, {}]
        }, {}, [1])(1);
    });
}
StoreLocal();
//统一的时间格式
/*********************************************时间格式**********************************************/

function ToComTime(value) {
    var theTime = parseInt(value); // 秒
    var theTime1 = 0; // 分
    var theTime2 = 0; // 小时
    var Result; //最终时间
    if (value == null || value == '' || value == '--') {
        Result = '——';
    } else {
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }

        if (parseInt(theTime) <= 9) {
            var Sec = "0" + parseInt(theTime);
        } else {
            var Sec = parseInt(theTime);
        }
        if (parseInt(theTime1) <= 9) {
            var Min = "0" + parseInt(theTime1);
        } else {
            var Min = parseInt(theTime1);
        }
        if (parseInt(theTime2) <= 9) {
            var Hour = "0" + parseInt(theTime2);
        } else {
            var Hour = parseInt(theTime2);
        }
        Result = Hour + ':' + Min + ':' + Sec;
    }
    return Result;
}
function ToSecTime(Value) {
    var Result;
    if (Value == null || Value == '' || Value == '--') {
        Result = 0;
    } else {
        Result = Math.ceil(Value / 60);
    }
    return Result;
}
/*********************************************mathJax**********************************************/
function intMathJax() {
    var thisBody = document.getElementsByTagName("body")[0],
        scripts = document.getElementsByTagName("script"),
        oldLatexScript;
    for (var i = 0; i < scripts.length; i++) {
        oldLatexScript = scripts[i].hasAttribute("src") ? scripts[i].getAttribute("src").indexOf("MathJax.js?config=") != -1 ? scripts[i] : null : null;
        if (oldLatexScript) {
            break;
        }
    }
    if (oldLatexScript) {
        var math = $(".edit_Box_source") ? $(".edit_Box_source").size() > 0 ? $(".edit_Box_source")[0] : null : null;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, math]); //在math容器里重载MathJax
        //去除重复id
        if ($(".edit_Box_work").length > 0) {
            var $s = $(".edit_Box_work")[0].getElementsByTagName("*");
            for (var i = 0; i < $s.length; i++) {
                if ($s[i].hasAttribute("id") && ($s[i].getAttribute("id").indexOf("MathJax-Element") != -1 || $s[i].getAttribute("id").indexOf("MJXc-Node") != -1)) {
                    $s[i].removeAttribute("id");
                }
            }
        }
    } else {
        //处理公式
        var latexStyle = document.createElement("style"),
            latexScript = document.createElement("script"),
            intLatex = latexScript.cloneNode(false);
        latexScript.setAttribute("src", "../../../MathJax-master/MathJax.js?config=TeX-MML-AM_CHTML");
        intLatex.setAttribute("type", "text/x-mathjax-config");
        intLatex.innerHTML = "MathJax.Hub.Config({messageStyle: 'none',showMathMenu: false,tex2jax: {inlineMath: [['$','$']]}});";
        latexStyle.innerHTML = ".MathJax_CHTML{margin-top:5px;font-family: Arial, Chandara;margin-right:2px;}.MathJax{font-family: Arial, Chandara;}.MathJax span{line-height: normal !important;}.mjx-mfrac{padding-right:1em;}";
        thisBody.appendChild(latexScript);
        thisBody.appendChild(intLatex);
        thisBody.appendChild(latexStyle);
    }
}

//# sourceMappingURL=common-compiled.js.map