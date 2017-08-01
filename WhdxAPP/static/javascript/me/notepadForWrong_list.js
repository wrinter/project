//Created by subo on 2017/3/1.
(function () {
    //分页码
    var pageNum = 1,//页码
        pageSize = 10,//每页条数
        get = false,//追加列表是否成功 默认:不成功
        loading = false,//状态：true正在追加，false追加完成
        subjectId;//科目id,将会在错题请求的时候赋值
    //长按和删除
    var deleteOc = false;//开关  默认关闭, 防止重复触发deleteAll事件
    var questionIdList = [],//要删除的单题或可拆分组合题
        groupCodeList = [];//要删除的不可拆分组合题
    //默认章节
    var thisKid = Request.kid,
        knowLedgeList = [];
    //默认题目,对应的页码
    var thisPn = Request.pn,
        thisSt = Request.st;
    if(thisPn){
        var pageSizeBase = pageSize;//存放原始每页条数,用于恢复
        pageSize = pageSize * thisPn;//页面被返回时的临时条数，返回成功后将恢复初始值
    }
    //删除错题的发送数据
    var param = {};
    param.uuid = uuid;
    //导航
    var _menu = document.getElementById("menu"),
        _menuCon = document.getElementById("menu_con");
    //返回按钮
    document.getElementById("btn_back").onclick = function () {
        javascript:bc.back();
    };
    //弹出章节
    document.getElementById("btn_menu").onclick = function () {
        menuIn();
    };
    function menuIn() {
        _menu.style.cssText = "right: 0;background-color: rgba(0,0,0,0.3);";
        _menuCon.style.cssText = "right: 0;";
    }
    //隐藏章节
    document.getElementById("menu_close").onclick = function () {
        menuOut();
    }
    function menuOut() {
        _menuCon.style.cssText = "transition-duration: 0.3s;";
        _menu.style.cssText = "transition-duration: 0.5s;";
        setTimeout(follow,500);
    }
    function follow() {
        _menuCon.style.cssText = "";
        _menu.style.cssText = "";
    }
    //滑动事件
    new swiperMaker({
        bind:_menu,
        endpointDirection:true,//端点方向：true x ; false y
        returnEnd:function(endpoint){
            if(endpoint.indexOf("r") != -1 && parseInt(endpoint) > rem * 4){//r：右，超过4栅格 收起菜单
                menuOut();
            }
        }
    });
    new swiperMaker({
        bind:document.getElementById("main"),
        endpointDirection:true,
        returnEnd:function(endpoint){
            if(endpoint.indexOf("l") != -1 && parseInt(endpoint) > rem * 4){//l：左，超过4栅格 打开菜单
                menuIn();
            }
        }
    });
    //ajax填充
    ajax({//章节
        method: "GET",
        url: "/api/teacher/center/wrongbook/knowledge",
        data: {uuid:uuid},
        success: function (response) {
            var data = JSON.parse(response);
            if(data.retCode == "0000"){
                var Data = data.retData,
                    node = document.getElementById("menu_list"),
                    _li = "";
                if(Data.length>0){
                    var subjectId = Data[0].subjectId;
                    if(subjectId!='07'){
                        _li += "<li><a id='all' class='on' href='javascript:;'>全部章节</a></li>";
                    }
                }
                for(var i in Data){
                    var children = Data[i].childrens;
                    if(children.length>0){
                        _li += "<li class='m_first'><a id='" + Data[i].knowledgeId + "' href='javascript:;'>" + Data[i].name + "</a></li>";
                        _li += "<ul class='m_second'>";
                        for(var j=0;j<children.length;j++){
                            _li += "<li><a id='" + children[j].knowledgeId + "' href='javascript:;'>" + children[j].name + "</a></li>";
                        }
                        _li += "</ul>";
                    }else{
                        _li += "<li><a id='" + Data[i].knowledgeId + "' href='javascript:;'>" + Data[i].name + "</a></li>";
                    }
                }
                node.innerHTML = _li;
                $('.m_second:first').show().siblings('.m_second').hide();
                var firstLi = $('li:first');
                if(firstLi.hasClass('m_first')){
                    firstLi.next('.m_second').children('li:first').children('a').addClass('on');
                    knowLedgeList.push(firstLi.next('.m_second').children('li:first').children('a')[0].attributes.id);
                }else{
                    firstLi.children('a').addClass('on');
                }
                //请求*章节的错题
                //thisKid ? knowLedgeList.push(thisKid) : knowLedgeList = "";
                getWrongbook(true);
                //事件
                var $a = node.getElementsByTagName("a");
                for(var i in $a){
                    $a[i].onclick = function () {
                        //清除滚动
                        document.getElementById("content").scrollTop = 0;
                        if(this.parentNode.className=='m_first'){
                            var m_second = $(this).parent().next('.m_second');
                            if(m_second.css('display')=='none'){
                                m_second.show().siblings('.m_second').hide();
                                var clickA = m_second.children('li:first').children('a');
                                clickA.addClass('on');
                                knowLedgeList = [];//清空
                                knowLedgeList.push(clickA.attr('id'));
                                pageNum = 1;
                                get = false;
                                loading = false;
                                getWrongbook(true);
                            }else{
                                m_second.hide();
                            }
                        }else{
                            //状态
                            for(var j=0;j<$a.length;j++){
                                if($a[j].getAttribute("class") == "on"){
                                    $a[j].removeAttribute("class");
                                }
                            }
                            this.className = "on";
                            knowLedgeList = [];//清空
                            if(this.getAttribute("id") == "all"){
                                knowLedgeList = "";
                            }else{
                                knowLedgeList.push(this.getAttribute("id"));
                            }
                            //重载章节错题
                            pageNum = 1;
                            get = false;
                            loading = false;
                            getWrongbook(true);
                        }
                        //关闭菜单
                        menuOut();
                    }
                }
            }else{
                javascript:bc.ret(data.retCode,data.retMsg);
            }
        }
    });
    ajax({//获取错误率
        method: "POST",
        url: "/api/teacher/center/wrongbook/wrongrate",
        data: {uuid:uuid},
        success: function (response) {
            var data = JSON.parse(response);
            if(data.retCode == "0000"){
                //转换
                var Data = data.retData;
                document.getElementById("showUserPicker").value = Data.toPercent();
                var userPicker = new mui.PopPicker();
                userPicker.setData([
                    {
                        value: '20%',
                        text: '20%'
                    }, {
                        value: '30%',
                        text: '30%'
                    }, {
                        value: '40%',
                        text: '40%'
                    }, {
                        value: '50%',
                        text: '50%'
                    }, {
                        value: '60%',
                        text: '60%'
                    }]);
                var showUserPickerButton = document.getElementById('showUserPicker');
                var userResult = document.getElementById('userResult');
                showUserPickerButton.addEventListener('tap', function(event) {
                    userPicker.show(function(items) {
                        showUserPickerButton.value = items[0].text;
                    });
                }, false);
                //事件
                document.getElementById("menu_btn_set").onclick = function () {
                    document.getElementById("menu_set_wrap").style.cssText = "display:block;";
                    setTimeout(opacityfn,10);
                    function opacityfn() {
                        document.getElementById("menu_set_wrap").style.cssText = "opacity:1;";
                    }
                };
                //设定值
                //setSelect({
                //    bind: "percentage_con_list",
                //    values: ["20%","30%","40%","50%","60%"],
                //    height: "6rem",
                //    size: 5,
                //    selected: Data.toPercent(),//可选
                //    returnDone: function (value) {
                //        document.getElementById("percentage_con_btn_done").onclick = function () {
                //            //预留的触摸结束时赋值方式
                //        }
                //    }
                //});
                //document.getElementById("percentage").onclick = function () {
                //    document.getElementById("percentage_con_wrap").style.cssText = "display:block;";
                //};
                //document.getElementById("percentage_con_btn_cancel").onclick = function () {
                //    document.getElementById("percentage_con_wrap").style.cssText = "display:none;";
                //};
                //document.getElementById("percentage_con_btn_done").onclick = function () {
                //    var thatSelected = document.getElementById("percentage_con_list").getAttribute("selected");
                //    document.getElementById("percentage").value = thatSelected;
                //    document.getElementById("percentage_con_wrap").style.cssText = "display:none;";
                //};
                //取消
                document.getElementById("menu_btn_cancel").onclick = function () {
                    cancel();
                };
                function cancel(){
                    document.getElementById("menu_set_wrap").style.cssText = "opacity:0";
                    setTimeout(opacityfn,510);
                    function opacityfn() {
                        document.getElementById("menu_set_wrap").style.cssText = "display:none;";
                    }
                }
                //确定
                document.getElementById("menu_btn_done").onclick = function () {
                    var thisPercent = document.getElementById("showUserPicker").value,
                        wrongRate = thisPercent.toNumber();
                    ajax({//修改错误率
                        method: "POST",
                        url: "/api/teacher/center/wrongrate",
                        data: {uuid:uuid,wrongRate:wrongRate},
                        success: function (response) {
                            var data = JSON.parse(response);
                            if(data.retCode == "0000"){
                                var _div =document.createElement("div");
                                _div.setAttribute("style","position:absolute;top:0;right:0;bottom:0;left:0;padding-top: 1rem;line-height: 0.8rem;text-align: center;border-radius: 0 0 0.15rem 0.15rem;background-color: #ebfaff;color: #666;");
                                _div.innerHTML = "<p>您已将错误率成功修改为" + thisPercent + "</p><small style='color: #999;'>即将关闭</small>";
                                document.getElementById("menu_set_con").appendChild(_div);
                                //成功后，模拟取消
                                setTimeout(cancel,700);
                                //恢复原内容
                                setTimeout(recover,1250);
                                function recover() {
                                    _div.parentNode.removeChild(_div);
                                }
                            }
                        }
                    });
                }
            }else{
                javascript:bc.ret(data.retCode,data.retMsg);
            }
        }
    });
    function getWrongbook(type) {//获取错题本 type: true刷新列表，type：false追加列表
        if(type){
            //清空上次请求的数据、恢复长按开关
            questionIdList = [];
            groupCodeList = [];
            deleteOc = false;
            //移除上次请求遗留的功能按钮
            var _delbtn = getClass("delbtn")[0] || 0;
            if(_delbtn != 0){
                _delbtn.parentNode.removeChild(_delbtn);
            }
        }
        ajax({
            method: "GET",
            url: "/api/teacher/center/wrongbook",
            data: {uuid:uuid,knowLedgeList:knowLedgeList,pageNum:pageNum,pageSize:pageSize},
            success: function (response) {
                //处理参数
                var urlKid = "";
                if(knowLedgeList[0]){
                    urlKid = "&kid=" + knowLedgeList[0];
                }
                //正文
                var data = JSON.parse(response);
                subjectId = data.retData.parameters.subjectId;
                if(data.retCode == "0000"){
                    var Data = data.retData,
                        _li = "";
                    if(Data.list[0]){
                        for(var i in Data.list){
                            //单题 -1,组合题：不可拆分 0 可拆分 1
                            !Data.list[i].groupCode ? setHtml(-1) : Data.list[i].isSplite == "0" ? setHtml(0) : setHtml(1);
                            function setHtml(bol) {
                                //多选
                                var deleteInput = "";
                                deleteOc ? deleteInput = "<div class='item-media' style='display: block;'><i class='checkbox'></i></div><div class='item-inner'>" : deleteInput = "<div class='item-media'><i class='checkbox'></i></div><div class='item-inner'>";
                                //头
                                var LnOrder = "",
                                    lnOrderEnd = "",
                                    aEnd = "";
                                if(bol == 0){
                                    _li += "<li id='" + Data.list[i].questionId + "' data-type='" + bol + "'>" + deleteInput + "<a href='notepadForWrong_page.html?uuid=" + uuid + "&qid=" + Data.list[i].questionId + urlKid + '&gropuCode=' + Data.list[i].groupCode + "'><h2><span class='ln_order'></span>" + Data.list[i].content + "</h2><ul>";
                                    LnOrder = "<h3><span class='quest_order'></span>";
                                    lnOrderEnd = "</h3>";
                                    aEnd = "";
                                }else if(bol == 1){
                                    _li += "<li id='" + Data.list[i].questionId + "' data-type='" + bol + "'><h2>" + Data.list[i].content + "</h2><ul>";
                                    LnOrder = "<h3><span class='ln_order'></span>";
                                    lnOrderEnd = "</h3>";
                                    aEnd = "</a></div>";
                                }else if(bol == -1){
                                    LnOrder = "<h3><span class='ln_order'></span>";
                                    lnOrderEnd = "</h3>";
                                    aEnd = "</a></div>";
                                }
                                //正文
                                var questions = Data.list[i].questions;
                                if(questions.length != 0){
                                    for(var j in questions){
                                        var lnOrderStart = "",
                                            _option = "";
                                        bol == 0 ? lnOrderStart = "" : lnOrderStart = deleteInput + "<a href='notepadForWrong_page.html?uuid=" + uuid + "&qid=" + questions[j].questionId + urlKid + "'>";
                                        if(questions[j].optionA != null){
                                            _option += "<div class='option'>";
                                            _option += "<p>" + questions[j].optionA + "</p>";
                                            _option += "<p>" + questions[j].optionB + "</p>";
                                            _option += "<p>" + questions[j].optionC + "</p>";
                                            if(questions[j].optionD != null){
                                                _option += "<p>" + questions[j].optionD + "</p>";
                                            }
                                            _option += "</div>";
                                        }
                                        _li += "<li id='" + questions[j].questionId + "' data-type='" + bol + "'>";
                                        _li += lnOrderStart + LnOrder + questions[j].questionTitle.replace(/【题干】/,"") + lnOrderEnd;
                                        _li += _option;
                                        _li += aEnd;
                                        _li += "</li>";
                                    }
                                }
                                //尾
                                if(bol == 0){
                                    _li += "</ul></a></div></li>";
                                }else if(bol == 1){
                                    _li += "</ul></li>";
                                }
                            }
                        }
                        type ? get = false : get = true;
                        //追加完新的列表，状态更新
                        if(get == true && !type){
                            loading = false;
                            var _infiniteing = document.getElementById("infiniteing");
                            _infiniteing.parentNode.removeChild(_infiniteing);
                        }
                    }else{
                        type ? _li = "<li style='display: block;padding: 0.25rem;margin-top: 0.45rem;line-height: 1.75;text-align: center;background-color: #fff;color: #999;'>当前栏目没有错题</li>" : document.getElementById("infiniteing").innerHTML = "<p style='color: #999;'>已经到最后了！</p>";
                        //追加列表为空，页码恢复
                        if(!type){
                            pageNum --;
                        }
                        get = false;
                    }
                    type ? document.getElementById("content").getElementsByTagName("ul")[0].innerHTML = _li : document.getElementById("content").getElementsByTagName("ul")[0].innerHTML += _li;
                    //如果是返回页，恢复每页条数,页码数，并滚动到原位置,最后禁用返回触发
                    if(thisPn){
                        pageSize = pageSizeBase;
                        if(pageNum == 1){
                            pageNum = thisPn;
                        }
                        setTimeout(function () {
                            document.getElementById("content").scrollTop = thisSt;
                            thisPn = null;
                        },10);
                    }
                    //设置页码和垂直位置
                    var _a = document.getElementById("content").getElementsByTagName("a");
                    for(var i = 0;i<_a.length;i++){
                        _a[i].onclick = function () {
                            //如果是编辑激活状态，阻止链接事件
                            if(deleteOc){
                                return false;
                            }else{
                                var st = document.getElementById("content").scrollTop;
                                var _href = this.getAttribute("href") + "&pn=" + pageNum + "&st=" + st;
                                this.setAttribute("href",_href);
                            }
                        }
                    }
                    //更新多选事件
                    if(deleteOc){
                        choice();
                    }
                    setLnOrder();
                    autoFlod();//行高度控制
                }else{
                    //追加列表为空，页码恢复
                    if(!type){
                        pageNum --;
                    }
                    get = false;
                    javascript:bc.ret(data.retCode,data.retMsg);
                }
                intMathJax();//公式
            }
        });
        //添加题号
        function setLnOrder() {
            var nodes = getClass("ln_order");
            for(var i= 0;i<nodes.length;i++){
                nodes[i].innerHTML = (i+1) + "、";
                nodes[i].parentNode.parentNode.style.cssText = "padding-left: 1.2rem;";
            }
            var littleNodes = getClass("quest_order");
            for(var i= 0;i<littleNodes.length;i++){
                littleNodes[i].innerHTML = "(" + (i+1) + ")、";
                littleNodes[i].style.cssText = "margin-left: -1.2rem;";
            }
        }
    }
    //分页
    var infiniteWrap = document.getElementById("content");
    infiniteWrap.onscroll = function () {
        if(loading){
            return;
        }
        if(this.scrollTop >= this.scrollHeight - this.offsetHeight - 20){
            loading = true;
            //添加加载提示
            var infiniteing = document.createElement("li");
            infiniteing.setAttribute("id","infiniteing");
            infiniteing.innerHTML = "<p style='color: #999;'><img src='../../static/image/me/loading-spin.svg' style='width: .65rem;margin-right: .25rem;' />加载ing</p>";
            this.getElementsByTagName("ul")[0].appendChild(infiniteing);
            setTimeout(breath,1000);
            function breath() {
                //加载新列表
                pageNum ++;
                getWrongbook(false);
            }
        }
    };
    //批量删除
    var timeout = null,//延迟事件
        touchNode = document.getElementById("content");
    touchNode.addEventListener("touchstart",function () {
        timeout = setTimeout(function () {
            if(!deleteOc){
                deleteAll();
                deleteOc = true;
            }
        },1000);
    });
    touchNode.addEventListener("touchmove",function () {
        clearTimeout(timeout);
    });
    touchNode.addEventListener("touchend",function () {
        clearTimeout(timeout);
    });
    function deleteAll() {
        var itemMedia = getClass("item-media"),
            itemA = document.getElementById("content").getElementsByTagName("a");
        //阻止链接跳转
        for(var i=0;i<itemA.length;i++){
            itemA[i].onclick = function () {
                return false;
            };
        }
        //弹出多选
        for(var i=0;i<itemMedia.length;i++){
            itemMedia[i].style.display = "block";
        }
        //弹出功能按钮
        var delBtn = document.createElement("div");
        delBtn.setAttribute("class","delbtn");
        delBtn.innerHTML = "<a id='delbtn-choice' href='javascript:;'>全选</a><a id='delbtn-del' href='javascript:;'>删除</a><a id='delbtn-cancel' href='javascript:;'>取消编辑</a>";
        document.getElementById("main").appendChild(delBtn);
        //其它事件
        choice();
        deleteBtn();
    }
    //选择
    function choice() {
        var deles = getClass("checkbox");
        for(var i=0;i<deles.length;i++){
            deles[i].onclick = function () {
                var _id = this.parentNode.parentNode.getAttribute("id"),
                    _dataType = this.parentNode.parentNode.getAttribute("data-type");
                if(this.getAttribute("checked") != "checked"){
                    this.setAttribute("checked","checked");
                    this.style.cssText = "background-position: left bottom;border-color: #f9a24a;background-color: #f9a24a;";
                    _dataType != "0" ? questionIdList.push(_id) : groupCodeList.push(_id);
                }else{
                    this.removeAttribute("checked");
                    this.removeAttribute("style");
                    if(_dataType != "0"){
                        var _i = questionIdList.indexOf(_id);
                        questionIdList.splice(_i,1);
                    }else{
                        var _i = groupCodeList.indexOf(_id);
                        groupCodeList.splice(_i,1);
                    }
                }
            }
        }
    }
    //功能按钮
    function deleteBtn() {
        document.getElementById("delbtn-cancel").onclick = function () {
            //清空数据、恢复长按开关
            questionIdList = [];
            groupCodeList = [];
            deleteOc = false;
            //移除功能按钮
            var _delbtn = getClass("delbtn")[0];
            _delbtn.parentNode.removeChild(_delbtn);
            //移除选中状态、选择框、解除链接阻止并重定义参数
            var deles = getClass("checkbox");
            for(var i=0;i<deles.length;i++){
                if(deles[i].hasAttribute("checked")){
                    deles[i].removeAttribute("checked");
                    deles[i].removeAttribute("style");
                }
                deles[i].parentNode.removeAttribute("style");
                deles[i].parentNode.parentNode.getElementsByTagName("a")[0].onclick = function () {
                    var st = document.getElementById("content").scrollTop;
                    var _href = this.getAttribute("href") + "&pn=" + pageNum + "&st=" + st;
                    this.setAttribute("href",_href);
                };
            }
        };
        document.getElementById("delbtn-choice").onclick = function () {
            questionIdList = [];//清空
            groupCodeList = [];//清空
            var deles = getClass("checkbox");
            if(this.getAttribute("checked") != "checked"){
                this.setAttribute("checked","checked");
                this.innerHTML = "取消全选";
                for(var i=0;i<deles.length;i++){
                    var _id = deles[i].parentNode.parentNode.getAttribute("id"),
                        _dataType = this.parentNode.parentNode.getAttribute("data-type");
                    deles[i].setAttribute("checked","checked");
                    deles[i].style.cssText = "background-position: left bottom;border-color: #f9a24a;background-color: #f9a24a;";
                    _dataType != "0" ? questionIdList.push(_id) : groupCodeList.push(_id);
                }
            }else{
                this.removeAttribute("checked");
                this.innerHTML = "全选";
                for(var i=0;i<deles.length;i++){
                    deles[i].removeAttribute("checked");
                    deles[i].removeAttribute("style");
                }
                questionIdList = [];
                groupCodeList = [];
            }
        };
        document.getElementById("delbtn-del").onclick = function () {
            if(questionIdList.length != 0){
                param.questionIdList = questionIdList;
            }else{
                delete param.questionIdList;
            }
            if(groupCodeList.length != 0){
                param.groupCodeList = groupCodeList;
            }else{
                delete param.groupCodeList;
            }
            ajax({
                method: "POST",
                url: "/api/teacher/center/wrongbook/delete",
                data: param,
                success: function (response) {
                    var data = JSON.parse(response);
                    if(data.retCode == "0000"){
                        document.getElementById("deleteDone").getElementsByTagName("p")[0].innerHTML = "恭喜您，删除成功！";
                        document.getElementById("deleteDone").style.cssText = "display:block;";
                        //1秒后返回
                        setTimeout(refresh,700);
                        function refresh() {
                            //清除已删除的题目(可能包含两种类型)
                            if(questionIdList.length != 0){
                                for(var k=0;k<questionIdList.length;k++){
                                    var quest = document.getElementById(questionIdList[k]);
                                    quest.parentNode.removeChild(quest);
                                }
                            }
                            if(groupCodeList.length != 0){
                                for(var k=0;k<groupCodeList.length;k++){
                                    var quest = document.getElementById(groupCodeList[k]);
                                    quest.parentNode.removeChild(quest);
                                }
                            }
                            document.getElementById("deleteDone").style.cssText = "display:none;";
                        }
                    }else{
                        document.getElementById("deleteDone").getElementsByTagName("p")[0].innerHTML = "删除失败";
                        document.getElementById("deleteDone").style.cssText = "display:block;";
                        setTimeout(error,700);
                        function error() {
                            document.getElementById("deleteDone").style.cssText = "display:none;";
                        }
                        javascript:bc.ret(data.retCode,data.retMsg);
                    }
                }
            });
        }
    }
    //超高折叠
    function autoFlod(){
        var _itemInners = getClass("item-inner");
        for(var i = 0;i<_itemInners.length;i++){
            var _this = _itemInners[i];
            var _thisHeight = _this.offsetHeight;
            if(_thisHeight > 200){
                //超出200写入限制高度
                _this.style.height = "200px";
                //添加展开按钮和折叠
                var _btn = document.createElement("div");
                _btn.setAttribute("class","item-inner-btn");
                _btn.innerText = "展开全部";
                var _sons = _this.getElementsByTagName("div"),_sonsBol = true;
                for(var j = 0;j<_sons.length;j++){
                    if(_sons[j].getAttribute("class") == "item-inner-btn"){
                        _sonsBol = false;
                    }
                }
                if(_sonsBol){
                    _this.appendChild(_btn);
                }
            }
        }
        //点击事件
        var _tbtns = getClass("item-inner-btn");
        for(var j = 0;j<_tbtns.length;j++){
            var $top;//#content的滚动条位置
            _tbtns[j].onclick = null;//清空事件
            _tbtns[j].onclick = function(){
                var thisText = this.innerText;
                if(thisText == "展开全部"){
                    $top = 0 - $(this.parentNode.parentNode.parentNode).position().top;//展开时获取此刻的滚动条位置
                    this.parentNode.style.cssText = "height:auto;padding-bottom:1.4rem;";
                    this.innerText = "收回";
                    this.style.color = "#65b113";
                }else{
                    this.parentNode.style.height = "200px";
                    this.innerText = "展开全部";
                    this.style.color = "#666";
                    $("#content").scrollTop($top);//折叠时回滚到展开时的滚动条位置
                }
            }
        }
    }
}());