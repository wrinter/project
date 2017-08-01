/*************************************屏幕适配*************************************/
(function(win) {
        var doc = win.document;
        var docEl = doc.documentElement;
        var tid;
        function refreshRem() {
                var width = docEl.getBoundingClientRect().width;
                if (width > 1536) { // 最大宽度
                        width =1536;
                }
                var rem = width / 10; // 将屏幕宽度分成10份， 1份为1rem
                docEl.style.fontSize = rem + 'px';
                ///rem用font-size:75px来进行换算
        }
        win.addEventListener('resize', function() {
                clearTimeout(tid);
                tid = setTimeout(refreshRem, 1);
        }, false);
        win.addEventListener('pageshow', function(e) {
                if (e.persisted) {
                        clearTimeout(tid);
                        tid = setTimeout(refreshRem, 1);
                }
        }, false);
        refreshRem();
})(window);
/*********************************截取url********************************************/
function UrlSearch() {
        var name,value;
        var str=window.location.search; //取得整个地址栏参数
        var num=str.indexOf("?")
        str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
        var arr=str.split("&"); //各个参数放到数组里
        for(var i=0;i < arr.length;i++){
                num=arr[i].indexOf("=");
                if(num>0){
                        name=arr[i].substring(0,num);
                        value=arr[i].substr(num+1);
                        this[name]=value;
                }
        }
}
var Request=new UrlSearch(); //实例化


/*播放or暂停*/
var IsCanPaly = function() {
        this.audio = document.getElementById('audio');
        this.playPause = document.getElementById('playPause');
        this.audioplayer = document.getElementById('audioplayer');
        this.Isplay = document.getElementById('Isplay');
};
IsCanPaly.prototype = {
        constructor: IsCanPaly, //确定原型链
        EngPlay: function () {
                this.audio.play();
                this.audioplayer.className='audioplayer  audioplayer-playing'
                this.Isplay.innerHTML = 'Pause';
                this.playPause.title = 'Pause';
        },
        EngStop: function () {
                this.audio.pause();
                this.audioplayer.className='audioplayer  audioplayer-stopped';
                this.Isplay.innerHTML = 'Play';
                this.playPause.title = 'Play';
        }
}
//统一的时间格式
function ToComTime(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        var Result;//最终时间
        if(value==null||value==''||value=='--'){
                Result='- -';
        }else {
                if(theTime > 60) {
                        theTime1 = parseInt(theTime/60);
                        theTime = parseInt(theTime%60);
                        if(theTime1 > 60) {
                                theTime2 = parseInt(theTime1/60);
                                theTime1 = parseInt(theTime1%60);
                        }
                }
                if(parseInt(theTime)<9){
                        var Sec = "0"+parseInt(theTime);
                }else {
                        var Sec =parseInt(theTime);
                }
                if(parseInt(theTime1)<9){
                        var Min = "0"+parseInt(theTime1);
                }else {
                        var Min =parseInt(theTime1);
                }
                if(parseInt(theTime2)<9){
                        var Hour = "0"+parseInt(theTime2);
                }else {
                        var Hour =parseInt(theTime2);
                }
                Result=Hour+':'+Min+':'+Sec;
        }

        return Result;
}
/************************************************latex公式***************************************************/
function intMathJax(subjectId) {
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
        var boll = true,styles = document.getElementsByTagName("style");
        for(var i = 0;i<styles.length;i++){
            var styleValue = styles[i].innerHTML;
            if(styleValue.indexOf(".mjx-chtml.MJXc-processed") != -1){
                boll = false;
                break;
            }
        }
        if(boll){
            var latexStyleNew = document.createElement("style");
            latexStyleNew.innerHTML = ".mjx-chtml.MJXc-processed{display: inline-block;}.mjx-chtml .mjx-math{display: none;}.mjx-chtml .mjx-math:first-child{display: inline-block;}";
            thisBody.appendChild(latexStyleNew);
        }
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);//重载
    }else{
        if(subjectId){
            if(subjectId == "02" || subjectId == "06" || subjectId == "07" || subjectId == "08" || subjectId == "09"){
                var latexStyle = document.createElement("style"),
                    latexScript = document.createElement("script"),
                    intLatex = latexScript.cloneNode(false);
                latexScript.setAttribute("src","../../../../MathJax-master/MathJax.js?config=TeX-MML-AM_CHTML");
                intLatex.setAttribute("type","text/x-mathjax-config");
                intLatex.innerHTML = "MathJax.Hub.Config({messageStyle: 'none',showMathMenu: false,tex2jax: {inlineMath: [['$','$']]}});";
                latexStyle.innerHTML = ".MathJax_CHTML{margin-top:5px;font-family: Arial, Chandara;margin-right:2px;}.MathJax{font-family: Arial, Chandara;}.MathJax span{line-height: normal !important;}.mjx-mfrac{padding-right:1em;}";
                thisBody.appendChild(latexScript);
                thisBody.appendChild(intLatex);
                thisBody.appendChild(latexStyle);
            }
        }else{
            var latexStyle = document.createElement("style"),
                latexScript = document.createElement("script"),
                intLatex = latexScript.cloneNode(false);
            latexScript.setAttribute("src","../../../../MathJax-master/MathJax.js?config=TeX-MML-AM_CHTML");
            intLatex.setAttribute("type","text/x-mathjax-config");
            intLatex.innerHTML = "MathJax.Hub.Config({messageStyle: 'none',showMathMenu: false,tex2jax: {inlineMath: [['$','$']]}});";
            latexStyle.innerHTML = ".MathJax_CHTML{margin-top:5px;font-family: Arial, Chandara;margin-right:2px;}.MathJax{font-family: Arial, Chandara;}.MathJax span{line-height: normal !important;}.mjx-mfrac{padding-right:1em;}";
            thisBody.appendChild(latexScript);
            thisBody.appendChild(intLatex);
            thisBody.appendChild(latexStyle);
        }
    }
}
