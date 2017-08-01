//Created by subo on 2017/3/1.
//uuid
var uuid = Request.uuid;//135c04ebf9cfd93a62440651f5acda43
//公共方法--------------------------------------------------------------------------------------------------------------
//栅格单位
var rem = window.innerWidth / 12;
document.getElementsByTagName("html")[0].style.cssText = "font-size:" + rem + "px";
//小数和百分比互转原型
Number.prototype.toPercent = function(){
    return parseFloat((Math.round(this * 10000)/100).toFixed(2)) + '%';
};
String.prototype.toNumber = function(){
    return parseFloat((Number(this.replace(/%/,"")) / 100).toFixed(4));
};
//触控对象
function swiperMaker(obj){
    var _this = this;
    this.obj = obj;
    this.control = false;
    this.sPos = {};
    this.mPos = {};
    this.endpoint = null;
    this.obj.bind.addEventListener("touchstart", function(e){ return start(e); } ,false);
    this.obj.bind.addEventListener("touchmove", function(e){ return move(e); } ,false);
    this.obj.bind.addEventListener("touchend", function(e){ return end(e); } ,false);
    function start(e){
        var point = e.touches ? e.touches[0] : e;
        _this.sPos.x = point.screenX;
        _this.sPos.y = point.screenY;
        if(_this.obj.returnStart){
            _this.obj.returnStart(_this.sPos);//起点方法
        }
    }
    function move(e){
        var point = e.touches ? e.touches[0] : e;
        _this.control = true;
        _this.mPos.x = point.screenX;
        _this.mPos.y = point.screenY;
        if(_this.obj.returnMove){
            _this.obj.endpointDirection  && (!_this.control ? _this.endpoint = null : _this.mPos.x > _this.sPos.x ? _this.endpoint = (_this.mPos.x - _this.sPos.x) + "r" : _this.endpoint = (_this.sPos.x - _this.mPos.x) + "l");
            _this.obj.endpointDirection  || (!_this.control ? _this.endpoint = null : _this.mPos.y > _this.sPos.y ? _this.endpoint = (_this.mPos.y - _this.sPos.y) + "d" : _this.endpoint = (_this.sPos.y - _this.mPos.y) + "u");
            _this.obj.returnMove(_this.endpoint);//触控坐标方法
        }
    }
    function end(){
        _this.obj.endpointDirection  && (!_this.control ? _this.endpoint = null : _this.mPos.x > _this.sPos.x ? _this.endpoint = (_this.mPos.x - _this.sPos.x) + "r" : _this.endpoint = (_this.sPos.x - _this.mPos.x) + "l");
        _this.obj.endpointDirection  || (!_this.control ? _this.endpoint = null : _this.mPos.y > _this.sPos.y ? _this.endpoint = (_this.mPos.y - _this.sPos.y) + "d" : _this.endpoint = (_this.sPos.y - _this.mPos.y) + "u");
        _this.control = false;
        if(_this.endpoint != null && _this.obj.returnEnd){
            _this.obj.returnEnd(_this.endpoint);//端点方法
        }
    }
}
//滑动选择方法 依赖触控对象
function setSelect(obj) {
    var _this = this;
    this.obj = obj;
    //选项
    var _options = "";
    for(var i in _this.obj.values){
        _options += "<li>" + _this.obj.values[i] + "</li>";
    }
    var _select = document.getElementById(_this.obj.bind);
    _select.innerHTML = _options;
    _select.setAttribute("size",_this.obj.size);
    //选中值输出
    if(_this.obj.selected){
        _select.setAttribute("selected",_this.obj.selected);
    }else{
        _select.setAttribute("selected",_this.obj.values[0]);
    }
    //中心项位置
    var _before = null,
        theOp = document.createElement("li");
    theOp.setAttribute("style","visibility:hidden;");
    theOp.innerText = "占位";
    for(var i = 0; i< parseInt(_this.obj.size / 2);i++){
        var thisOp = theOp.cloneNode(true);
        _select.insertBefore(thisOp,_select.getElementsByTagName("li")[0]);
    }
    //首选项
    var _selected = null;
    if(_this.obj.selected){
        for(var i in _this.obj.values){
            if(_this.obj.values[i] == _this.obj.selected){
                _selected = Number(i) + parseInt(_this.obj.size / 2);
            }
        }
    }else{
        _selected = parseInt(_this.obj.size / 2);
    }
    //高度
    var _unit = _this.obj.height.replace(/[0-9|.]/g,"");
    var _height = (parseFloat(_this.obj.height) / parseInt(_this.obj.size)),
        _options = _select.getElementsByTagName("li");
    for(var i = 0;i < _options.length; i++){
       _options[i].style.cssText += "height: " + _height + _unit + ";line-height: " + _height + _unit + ";text-align:center;";
    }
    //添加外套
    var newWrap = document.createElement("div"),
        wrapId = _this.obj.bind + "_wrap",
        _h = "height: " + _this.obj.height + ";",
        newSelect = _select.cloneNode(true);
    newWrap.setAttribute("id",wrapId);
    newWrap.setAttribute("style",_h);
    newWrap.appendChild(newSelect);
    _select.parentNode.appendChild(newWrap);
    _select.parentNode.removeChild(_select);
    //添加选框
    var _thisOp = document.createElement("div"),
        _thisOpStyle = "height: " + _height + _unit + ";margin-top: -" + (_height / 2) + _unit + ";";
    _thisOp.innerHTML = "<div class='this_op' style='" + _thisOpStyle + "'></div><div class='this_op_wrap'></div>";
    newWrap.appendChild(_thisOp);
    //首选项位置设定
    _select = document.getElementById(_this.obj.bind);//获取新的节点
    var marginTop = ((_selected - parseInt(_this.obj.size / 2)) * _height) + _unit;
    _select.style.cssText = "margin-top: -" + marginTop + ";";
    //绑定触控对象
    var oldTop = parseFloat(_select.style.marginTop);
    new swiperMaker({
        bind:newWrap,
        endpointDirection:false,//端点方向：true x ; false y
        returnMove:function(y){
            if(y.indexOf("u") != -1){
                var newTop = 0 - oldTop + parseInt(y) / (window.innerWidth / 12);
                _select.style.cssText = "margin-top: -" + newTop + _unit;
            }else if(y.indexOf("d") != -1){
                var newTop = 0 - oldTop - parseInt(y) / (window.innerWidth / 12);
                _select.style.cssText = "margin-top: -" + newTop + _unit;
            }

        },
        returnEnd:function () {
            //取整
            var thisTop = (0 - parseFloat(_select.style.marginTop)) / (parseFloat(_this.obj.height) / parseFloat(_this.obj.size));
            var newTop = Math.round(thisTop) * (parseFloat(_this.obj.height) / parseFloat(_this.obj.size)) || 0;
            //截取
            if(newTop > (_this.obj.values.length -1) * (parseFloat(_this.obj.height) / parseFloat(_this.obj.size))){
                newTop = (_this.obj.values.length -1) * (parseFloat(_this.obj.height) / parseFloat(_this.obj.size));
            }
            //设定
            _select.style.cssText = "margin-top: -" + newTop + _unit;
            //更新
            oldTop = parseFloat(_select.style.marginTop);
            //返回首选项
            var _i = Math.round(newTop / (parseFloat(_this.obj.height) / parseFloat(_this.obj.size)));
            _select.setAttribute("selected",_this.obj.values[_i]);
        }
    });
}
//getClass方法
function getClass(className) {
    if(document.getElementsByClassName){
        return document.getElementsByClassName(className);
    }else{
        var tags=document.getElementsByTagName("*");//获取标签
        var Arr=[];
        for(var i=0;i < tags.length; i++) {
            if(tags[i].className == className) {
                Arr.push(tags[i]);
            }
        }
        return Arr;
    }
}
//获取url参数
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
var Request = new GetRequest();
//ajax函数
//{string}opt.type http连接的方式，包括POST和GET两种方式
//{string}opt.url 发送请求的url
//{boolean}opt.async 是否为异步请求，true为异步的，false为同步的
//{object}opt.data 发送的参数，格式为对象类型
//{function}opt.success ajax发送并接收成功调用的回调函数
function ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function () {};
    var xmlHttp = null;
    if(XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }else{
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    var params = [];
    for(var key in opt.data){
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if(opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    }else if(opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(xmlHttp.responseText);
        }
    };
}
