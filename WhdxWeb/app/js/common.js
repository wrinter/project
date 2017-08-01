/*********************************************适配**********************************************/
function Page(){
        (function(win) {
                var doc = win.document;
                var docEl = doc.documentElement;
                var tid;
                function refreshRem() {
                        var width = docEl.getBoundingClientRect().width;
                        if (width > 1800) { // 最大宽度
                                width =1800;
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
}
Page();
/*********************************************截取url地址**********************************************/
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


