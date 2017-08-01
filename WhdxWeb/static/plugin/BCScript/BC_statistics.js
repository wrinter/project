/**
 * Created by subo on 2017/2/5.
 */
//arguments
    //data:源数据 *
    //wrapId:容器id名 *
    //top:容器位置 --------------
    //right:容器位置 ------------
    //left:容器位置 -------------
    //drag:是否可拖动，默认false  可选
//method
    //reStatistics:刷新统计结果 接收1个新data参数,1个刷新目标id  顺序不可颠倒
        //用法 ： new BC_statistics.fn.reStatistics(Data,"id");

//创建插件--------------------------------------------------------------------------------------------------------------
var BC_statistics = function () {
    this.id = arguments[0].wrapId;
    return new BC_statistics.fn.init(arguments[0]);//每次使用创建新的实例，便于单页面多次使用不冲突
};
BC_statistics.fn = BC_statistics.prototype = {
    init: function () {
        var Data = arguments[0].data,//数据
            WrapId = arguments[0].wrapId,//创建的div id名
            Top = arguments[0].top,
            Right = arguments[0].right,
            Left = arguments[0].left,
            Drag = arguments[0].drag;//是否拖动
        //遍历所有题目,输出题目组和知识点组
        var workArray = [],//题目组
            knowledgeArray = [],//知识点组
            knowledgeShort = [];//知识点去重
        var codeArray = [];//存放组合题code,用于排重
        for(var i=0;i<Data.questionLines.length;i++){
            if("questionGroup" in Data.questionLines[i]){
                for(var j=0;j<Data.questionLines[i].questionGroup.length;j++){
                    for(var k=0;k<Data.questionLines[i].questionGroup[j].questions.length;k++){
                        if(Data.questionLines[i].questionGroup[j].groupCode == "" || Data.questionLines[i].questionGroup[j].groupCode == null || Data.questionLines[i].questionGroup[j].groupCode == undefined){//单题
                            workArray.push(Data.questionLines[i].questionGroup[j].questions[k]);
                            knowledgeArray.push(Data.questionLines[i].questionGroup[j].questions[k].knowledgeId);
                        }else{//组合题
                            var code = Data.questionLines[i].questionGroup[j].groupCode;
                            if(codeArray.indexOf(code) == -1) {//排重
                                workArray.push(Data.questionLines[i].questionGroup[j]);
                                knowledgeArray.push(Data.questionLines[i].questionGroup[j].knowledgeId);
                                codeArray.push(code);
                            }
                        }
                    }
                }
            }else if("customLineTj" in Data.questionLines[i]){
                for(var j=0;j<Data.questionLines[i].customLineTj.length;j++){
                    if(Data.questionLines[i].customLineTj[j].groupCode == "" || Data.questionLines[i].customLineTj[j].groupCode == null || Data.questionLines[i].customLineTj[j].groupCode == undefined){//单题
                        workArray.push(Data.questionLines[i].customLineTj[j]);
                        knowledgeArray.push(Data.questionLines[i].customLineTj[j].knowledgeId);
                    }else{//组合题
                        var code = Data.questionLines[i].customLineTj[j].groupCode;
                        //if(codeArray.indexOf(code) == -1){//排重 因逻辑改变不再需要排重
                            workArray.push(Data.questionLines[i].customLineTj[j]);
                            knowledgeArray.push(Data.questionLines[i].customLineTj[j].knowledgeId);
                            codeArray.push(code);
                        //}
                    }
                }
            }
        }
        //知识点去重
        knowledgeShort = knowledgeArray.unique();
        //创建节点 statistics
        var dlWrap = document.createElement("div"),//封套
            close = dlWrap.cloneNode(false),//关闭
            dlA = document.createElement("dl"),//表头
            dlS = dlWrap.cloneNode(false);//表内容
        //设置节点属性
        dlWrap.setAttribute("class","exercise_statistics");
        dlWrap.setAttribute("id",WrapId);
        close.setAttribute("class","exercise_statistics_close");
        dlA.setAttribute("id",WrapId + "_drag");
        dlS.setAttribute("class","statistics");
        dlS.setAttribute("id",WrapId + "_statistics");
        close.innerText = "关闭";
        dlA.innerHTML = "<dt><div class='middle'>知识点</div></dt><dd><span>题号</span><span>难易度</span></dd>";
        dlA.style.cssText = "cursor:pointer";
        //设置节点事件
        close.onclick = function () {
            dlWrap.style.cssText = "display:none;";
        };
        //连接表头和按钮
        dlWrap.appendChild(close);
        dlWrap.appendChild(dlA);
        //连接表内容
        for(var i=0;i<knowledgeShort.length;i++){//遍历知识点组
            var thisKnowledge = knowledgeShort[i];//获得某知识点
            var dl = document.createElement("dl");//表单项
            var n=0;//计数器
            for(var j=0;j<workArray.length;j++){//遍历题目组，寻找其中存在某知识点的所有题目
                if(workArray[j].knowledgeId == thisKnowledge){
                    n++;
                    if(n == 1){
                        var Kname,dt = document.createElement("dt");
                        workArray[j].knowledgeName == null ? Kname = "" : Kname = workArray[j].knowledgeName;
                        dt.innerHTML = "<div class='middle'>" + Kname + "</div>";
                        dl.appendChild(dt);
                    }
                    var dd = document.createElement("dd"),
                        spanA = document.createElement("span"),
                        spanB = spanA.cloneNode(false);
                    spanA.innerText = workArray[j].lnOrder;
                    workArray[j].difficultName == null || workArray[j].difficultName == "null" ? spanB.innerText = "" : spanB.innerText = workArray[j].difficultName;
                    dd.appendChild(spanA);
                    dd.appendChild(spanB);
                    dl.appendChild(dd);
                }
            }
            dlS.appendChild(dl);
        }
        dlWrap.appendChild(dlS);
        //如没有统计：添加到页面，如再次统计：刷新统计结果
        var exist = true;// true:默认没有
        var dives = document.getElementsByTagName("div");//获取所有div
        for(var i=0;i<dives.length;i++){
            if(dives[i].getAttribute("id") == WrapId){
                exist = false;// false:已存在
            }
        }
        if(exist){//添加
            document.body.appendChild(dlWrap);
        }else{//刷新
            refresh();
        }
        //统计表位置
        if(Top){
            var _this = document.getElementById(WrapId);
            if(Left){
                _this.style.cssText = "top: " + Top + "px;left: " + Left + "px;";
            }
            if(Right){
                _this.style.cssText = "top: " + Top + "px;right: " + Right + "px;";
            }
        }
        and();
        //表项目高度适配
        function and() {
            var _this = document.getElementById(WrapId);
            var middles = _this.getElementsByTagName("div");
            for(var i=0;i<middles.length;i++){
                if(middles[i].getAttribute("class") == "middle"){
                    var hA = middles[i].offsetHeight,
                        hB = middles[i].parentNode.parentNode.offsetHeight;
                    if(hA > hB){
                        middles[i].style.cssText = "top: 9px;padding: 5px 0;";
                        middles[i].parentNode.parentNode.style.cssText = "height: " + (hA + 10) + "px;";
                        var _span = middles[i].parentNode.parentNode.getElementsByTagName("span");
                        for(var j=0;j<_span.length;j++){
                            _span[j].style.cssText = "line-height: " + (hA + 10) + "px;";
                        }
                    }
                }
            }
        }
        //再次刷新统计
        function refresh() {
            var _id = WrapId + "_statistics",
                _statistics = document.getElementById(_id);
            _statistics.innerHTML = dlS.innerHTML;
            and();
        }
        //拖动
        if(Drag){
            var handle = document.getElementById(WrapId + "_drag"),
                handlePosition = document.getElementById(WrapId);
            handle.onmousedown = function (e) {
                var x = e.pageX - handlePosition.offsetLeft;
                var y = e.pageY - handlePosition.offsetTop;
                document.body.onmousemove = function (e) {
                    var moveX = e.pageX - x;
                    var moveY = e.pageY - y;
                    var X = document.body.offsetWidth - handlePosition.offsetWidth;
                    var Y = document.documentElement.clientHeight - handlePosition.offsetHeight;
                    if(moveX<=0){
                        moveX=0;
                    }
                    if(moveX >= X){
                        moveX = X;
                    }
                    if(moveY<=0){
                        moveY = 0;
                    }
                    if(moveY >= Y){
                        moveY = Y;
                    }
                    handlePosition.style.cssText = "left: " + moveX + "px;top: " + moveY + "px;";
                }
            };
            document.body.onmouseup = function () {
                this.onmousemove = null;
            }
        }
    },
    reStatistics : function () {
        var oldId = arguments[1];//刷新id地址
        var newData = arguments[0];//新数据
        var b_id = document.getElementById(oldId) || false; //如果存在统计，继续
        if(b_id){
            //遍历所有题目,输出题目组和知识点组
            var workArray = [],//题目组
                knowledgeArray = [],//知识点组
                knowledgeShort = [];//知识点去重
            var codeArray = [];//存放组合题code,用于排重
            for(var i=0;i<newData.questionLines.length;i++){
                if("questionGroup" in newData.questionLines[i]){
                    for(var j=0;j<newData.questionLines[i].questionGroup.length;j++){
                        for(var k=0;k<newData.questionLines[i].questionGroup[j].questions.length;k++){
                            if(newData.questionLines[i].questionGroup[j].groupCode == "" || newData.questionLines[i].questionGroup[j].groupCode == null || newData.questionLines[i].questionGroup[j].groupCode == undefined){//单题
                                workArray.push(newData.questionLines[i].questionGroup[j].questions[k]);
                                knowledgeArray.push(newData.questionLines[i].questionGroup[j].questions[k].knowledgeId);
                            }else{//组合题
                                var code = newData.questionLines[i].questionGroup[j].groupCode;
                                if(codeArray.indexOf(code) == -1) {//排重
                                    workArray.push(newData.questionLines[i].questionGroup[j]);
                                    knowledgeArray.push(newData.questionLines[i].questionGroup[j].knowledgeId);
                                    codeArray.push(code);
                                }
                            }
                        }
                    }
                }else if("customLineTj" in newData.questionLines[i]){
                    for(var j=0;j<newData.questionLines[i].customLineTj.length;j++){
                        if(newData.questionLines[i].customLineTj[j].groupCode == "" || newData.questionLines[i].customLineTj[j].groupCode == null || newData.questionLines[i].customLineTj[j].groupCode == undefined){
                            workArray.push(newData.questionLines[i].customLineTj[j]);
                            knowledgeArray.push(newData.questionLines[i].customLineTj[j].knowledgeId);
                        }else{
                            var code = newData.questionLines[i].customLineTj[j].groupCode;
                            //if(codeArray.indexOf(code) == -1){   //因逻辑改变：不需要排重了
                                workArray.push(newData.questionLines[i].customLineTj[j]);
                                knowledgeArray.push(newData.questionLines[i].customLineTj[j].knowledgeId);
                                codeArray.push(code);
                            //}
                        }
                    }
                }
            }
            //知识点去重
            knowledgeShort = knowledgeArray.unique();
            //创建节点
            var dlS = document.createElement("div");//表内容
            //连接表内容
            for(var i=0;i<knowledgeShort.length;i++){//遍历知识点组
                var thisKnowledge = knowledgeShort[i];//获得某知识点
                var dl = document.createElement("dl");//表单项
                var n=0;//计数器
                for(var j=0;j<workArray.length;j++){//遍历题目组，寻找其中存在某知识点的所有题目
                    if(workArray[j].knowledgeId == thisKnowledge){
                        n++;
                        if(n == 1){
                            var Kname,dt = document.createElement("dt");
                            workArray[j].knowledgeName == null ? Kname = "" : Kname = workArray[j].knowledgeName;
                            dt.innerHTML = "<div class='middle'>" + Kname + "</div>";
                            dl.appendChild(dt);
                        }
                        var dd = document.createElement("dd"),
                            spanA = document.createElement("span"),
                            spanB = spanA.cloneNode(false);
                        spanA.innerText = workArray[j].lnOrder;
                        workArray[j].difficultName == null || workArray[j].difficultName == "null" ? spanB.innerText = "" : spanB.innerText = workArray[j].difficultName;
                        dd.appendChild(spanA);
                        dd.appendChild(spanB);
                        dl.appendChild(dd);
                    }
                }
                dlS.appendChild(dl);
            }
            refresh();
            //表项目高度适配
            function and() {
                var _this = document.getElementById(oldId);
                var middles = _this.getElementsByTagName("div");
                for(var i=0;i<middles.length;i++){
                    if(middles[i].getAttribute("class") == "middle"){
                        var hA = middles[i].offsetHeight,
                            hB = middles[i].parentNode.parentNode.offsetHeight;
                        if(hA > hB){
                            middles[i].style.cssText = "top: 9px;padding: 5px 0;";
                            middles[i].parentNode.parentNode.style.cssText = "height: " + (hA + 10) + "px;";
                            var _span = middles[i].parentNode.parentNode.getElementsByTagName("span");
                            for(var j=0;j<_span.length;j++){
                                _span[j].style.cssText = "line-height: " + (hA + 10) + "px;";
                            }
                        }
                    }
                }
            }
            //再次刷新统计
            function refresh() {
                var _id = oldId + "_statistics",
                    _statistics = document.getElementById(_id);
                _statistics.innerHTML = dlS.innerHTML;
                and();
            }
        }
    }
};
BC_statistics.fn.init.prototype = BC_statistics.fn;
//依赖 -----------------------------------------------------------------------------------------------------------------
Array.prototype.unique = function () {
    this.sort();
    var newArray=[this[0]];
    for(var i = 1; i < this.length; i++) {
        if( this[i] !== newArray[newArray.length-1]) {
            newArray.push(this[i]);
        }
    }
    return newArray;
};
