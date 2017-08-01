//Created by subo on 2017/3/8.
(function () {
    //参数
    var uuid = Request.uuid,
        questionId = Request.qid,
        thisQn = Request.pn,
        thisSt = Request.st,
        thisKid = Request.kid,
        groupCode = Request.groupCode
    if(groupCode == undefined){
        groupCode = null
    }
    //删除发送参数
    var param = {};
    param.uuid = uuid;
    //返回按钮
    document.getElementById("btn_back").onclick = function () {
        var url = "";
        thisKid ? url = "notepadForWrong.html?uuid=" + uuid + "&kid=" + thisKid + "&pn=" + thisQn + "&st=" + thisSt : url = "notepadForWrong.html?uuid=" + uuid + "&pn=" + thisQn + "&st=" + thisSt;
        var a = document.createElement("a");
        a.setAttribute("href",url);
        a.click();
    };
    //详情
    ajax({
        method: "GET",
        url: "/api/teacher/center/wrongbook/"+questionId,
        data: {uuid: uuid,groupCode:groupCode},
        success: function (response) {
            var data = JSON.parse(response);
            if(data.retCode == "0000"){
                var Data = data.retData,
                    _li = "";
                if(Data[0]){
                    var thelenth = Data.length > 1 ? 1 : Data.length;
                    for(var i=0;i<thelenth;i++){
                        //单题 -1,组合题：不可拆分 0 可拆分 1
                        !Data[i].groupCode ? setHtml(-1) : Data[i].isSplite == "0" ? setHtml(0) : setHtml(1);
                        function setHtml(bol) {
                            //param
                            if(bol != 0){
                                param.questionIdList = [];
                                param.questionIdList.push(questionId);
                            }else{
                                param.groupCodeList = [];
                                param.groupCodeList.push(questionId);
                            }
                            //头
                            var LnOrder = "",
                                lnOrderEnd = "";
                            if(bol == 0){
                                _li += "<li id='" + Data[i].questionId + "' data-type='" + bol + "'><h2><span class='ln_order'></span>" + Data[i].content + "</h2><ul>";
                                LnOrder = "<h3><span class='quest_order'></span>";
                                lnOrderEnd = "</h3>";
                            }else if(bol == 1){
                                _li += "<li id='" + Data[i].questionId + "' data-type='" + bol + "'><h2>" + Data[i].content + "</h2><ul>";
                                LnOrder = "<h3><span class='ln_order'></span>";
                                lnOrderEnd = "</h3>";
                            }else if(bol == -1){
                                LnOrder = "<h3><span class='ln_order'></span>";
                                lnOrderEnd = "</h3>";
                            }
                            //正文
                            var questions = Data[i].questions;
                            if(questions.length != 0){
                                for(var j in questions){
                                    var lnOrderStart = "",
                                        _option = "";
                                    bol == 0 ? lnOrderStart = "" : lnOrderStart = "";
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
                                    _li += "</li>";
                                    //单题和组合题（可拆分）答案
                                    if(bol == -1 || bol == 1){
                                        var labels = questions[j].labels;
                                        if(labels.length != 0){
                                            _li += "<li>";
                                            for(var k in labels){
                                                if(labels[k].questionType == "03"){
                                                    _li += "<div class='answer'><span>答案：</span>" + labels[k].content.replace("【","").replace("答案","").replace("】","") + "</div>";
                                                }else if(labels[k].questionType == "05"){
                                                    _li += "<div class='analysis'><div>解析：</div>" + labels[k].content.replace("【","").replace("解析","").replace("】","") + "</div>";
                                                }
                                            }
                                            _li += "</li>";
                                        }
                                    }
                                }
                            }
                            //尾
                            if(bol == 0 || bol == 1){
                                _li += "</ul></li>";
                            }
                            //组合题（不可拆分）答案
                            if(bol == 0){
                                var labels2 = Data[i].labels;
                                if(labels2.length != 0){
                                    _li += "<li>";
                                    for(var j in labels2){
                                        if(labels2[j].questionType == "03"){
                                            _li += "<div class='answer'><span>答案：</span>" + labels2[j].content.replace(/【答案】/,"") + "</div>";
                                        }else if(labels2[j].questionType == "05"){
                                            _li += "<div class='analysis'><div>解析：</div>" + labels2[j].content.replace(/【解析】/,"") + "</div>";
                                        }
                                    }
                                    _li += "</li>";
                                }
                            }
                        }
                    }
                    _li += "<li class='nobg'><a id='btn_delete' href='javascript:;'>删除</a></li>";
                }else{
                    _li = "<li style='padding: 0.25rem;margin-top: 0.45rem;line-height: 1.75;text-align: center;background-color: #fff;color: #999;'>对不起，未找到该题目。</li>";
                }
                document.getElementById("content").innerHTML = "<ul class='page'>" + _li + "</ul>";
                //删除按钮事件
                deleteBtn();
            }else{
                javascript:bc.ret(data.retCode,data.retMsg);
            }
        }
    });
    function deleteBtn() {
        console.log(document.getElementById("btn_delete"))
        document.getElementById("btn_delete").onclick = function () {
            ajax({
                method: "POST",
                url: "/api/teacher/center/wrongbook/delete",
                data: param,
                success: function (response) {
                    var data = JSON.parse(response);
                    if(data.retCode == "0000"){
                        document.getElementById("deleteDone").getElementsByTagName("p")[0].innerHTML = "删除成功,即将返回";
                        document.getElementById("deleteDone").style.cssText = "display:block;";
                        //1秒后返回
                        setTimeout(back,700);
                        function back() {
                            var url = "";
                            thisKid ? url = "notepadForWrong.html?uuid=" + uuid + "&kid=" + thisKid : url = "notepadForWrong.html?uuid=" + uuid;
                            var a = document.createElement("a");
                            a.setAttribute("href",url);
                            a.click();
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
}());
