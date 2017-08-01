//Created by subo on 2017/3/28.
//页面滚动时的界面交互--------------------------------------------------------------------------------------------------
function pageScroll(){
    var _headerHeight = document.getElementById("Header").offsetHeight;
    setTimeout(function(){
        if(_headerHeight > 0){
            var follow = true;
            theScroll();//在中途刷新页面时执行一次
            window.onscroll = function(){
                theScroll();//每次滚动都执行
            };
            function theScroll(){
                var _thisTop = $(window).scrollTop();
                //面包屑跟随
                if(follow && _thisTop >= _headerHeight){
                    follow = false;
                    var _iCrumbs = $(".c_Crumbs")[0],
                        iCrumbs = _iCrumbs.cloneNode(true);
                    iCrumbs.style.cssText = "position:fixed;top:0;left:0;z-index:999;";
                    iCrumbs.className += " i_c_Crumbs";
                    document.getElementsByTagName("body")[0].appendChild(iCrumbs);
                }else if((!follow) && _thisTop < _headerHeight){
                    follow = true;
                    var _iCCrumbs = $(".i_c_Crumbs")[0];
                    _iCCrumbs.parentNode.removeChild(_iCCrumbs);
                }
                //编辑和统计命题跟随
                var _crumbs = $(".c_Crumbs")[0],
                    _eb = $(".exercise_btn").eq(0).hasClass("bottom") ? null : $(".exercise_btn")[0];
                var crumbsHeight = _crumbs.offsetHeight;
                if(_eb){
                    if(_thisTop > (_headerHeight + crumbsHeight - 14)){
                        if(!_eb.getAttribute("style")){
                            var ebTop = crumbsHeight + 14;
                            _eb.style.cssText = "position:fixed;top:"+ ebTop +"px";
                        }
                    }else{
                        if(_eb.getAttribute("style")){
                            _eb.removeAttribute("style");
                        }
                    }
                }
                //布置和打印跟随
                var _windowHeight = $(window).height(),
                    _docHeight = $(document).height(),
                    _eb2 = $(".exercise_btn.bottom")[0];
                if(_thisTop > (_docHeight - _windowHeight - 10)){
                    if(!_eb2.getAttribute("style")){
                        _eb2.style.cssText = "position:fixed;bottom:24px;";
                    }
                }else{
                    if(_eb2.getAttribute("style")){
                        _eb2.removeAttribute("style");
                    }
                }
            }
        }else{
            pageScroll();//每20毫秒递归直到GetHtml成功
        }
    },20)
}
