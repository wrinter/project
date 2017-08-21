//Created by subo on 2017/4/12.
//将业务构建函数拆分为：原型层和逻辑层
//原型层  业务类构建层，为逻辑层提供调用支持
//逻辑层  具体业务处理层，为页面具体业务逻辑提供调用支持
(function(){
    //业务构建函数
    var WorkTest = function(){
        return new init();
    };
    //原型层
    WorkTest.prototype = {
        constructor: WorkTest,
        Ajax:function (op){
            var opt = op || {};
            opt.type = op.type.toUpperCase() || 'POST';
            opt.url = op.url;
            opt.async = op.async;
            opt.data = op.data;
            opt.success = op.success || function (){};
            opt.error = op.error || function (){};
            opt.contentType = op.contentType || "application/x-www-form-urlencoded";
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
            if(opt.type.toUpperCase() === 'POST') {
                xmlHttp.open(opt.type, opt.url, opt.async);
                xmlHttp.setRequestHeader('Content-Type', opt.contentType + ';charset=utf-8');
                opt.contentType == "application/json" ? xmlHttp.send(opt.data) : xmlHttp.send(postData);
            }else if(opt.type.toUpperCase() === 'GET') {
                xmlHttp.open(opt.type, opt.url + '?' + postData, opt.async);
                xmlHttp.send(null);
            }
            if(opt.async){
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState == 4) {
                        if(xmlHttp.status == 200){
                            opt.success(xmlHttp.responseText);
                        }else{
                            opt.error();
                        }
                    }
                };
            }else{
                opt.success(xmlHttp.responseText);
            }
        },
        post:function (bol,url,obj,success,error,contype){
            this.Ajax({
                type: "post",
                url: url,
                data:obj,
                async:bol,
                contentType:contype,
                success:function(data) {
                    data = JSON.parse(data);
                    data.retCode == "0000" ? data.retData ? data.retData.length != 0 ? success(data) : error() : error() : error();
                },
                error:function(){
                    error();
                }
            });
        },
        postForDataNull:function (bol,url,obj,success,error,contype){
            this.Ajax({
                type: "post",
                url: url,
                data:obj,
                async:bol,
                contentType:contype,
                success:function(data) {
                    data = JSON.parse(data);
                    data.retCode == "0000" ? success(data) : error();
                },
                error:function(){
                    error();
                }
            });
        },
        postForRetData:function (bol,url,obj,success,error,contype){
            this.Ajax({
                type: "post",
                url: url,
                data:obj,
                async:bol,
                contentType:contype,
                success:function(data) {
                    data = JSON.parse(data);
                    success(data);
                },
                error:function(){
                    error();
                }
            });
        },
        get:function (bol,url,obj,success,error,contype){
            this.Ajax({
                type: "get",
                url: url,
                data:obj,
                async:bol,
                contentType:contype,
                success:function(data) {
                    data = JSON.parse(data);
                    data.retCode == "0000" ? data.retData ? data.retData.length != 0 ? success(data) : error() : error() : error();
                },
                error:function(){
                    error();
                }
            });
        },
        class:function (className){
            if(document.getElementsByClassName){
                return document.getElementsByClassName(className);
            }else{
                var tags = document.getElementsByTagName("*");//获取标签
                var Arr = [];
                for(var i=0;i < tags.length; i++) {
                    if(tags[i].className == className) {
                        Arr.push(tags[i]);
                    }
                }
                return Arr;
            }
        },
        request:function (){
            var url = location.search;
            var theRequest = {};
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for(var i = 0; i < strs.length; i ++) {
                    theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }(),
        storage:{
            getLocal:function (type,key){
                var $whdxHj = localStorage.whdxHj ? JSON.parse(localStorage.whdxHj) : null,
                    $type = $whdxHj ? $whdxHj[type] ? $whdxHj[type] : null : null;
                var $value = $type ? $type[key] ? $type[key] : null : null;
                return $value;
            },
            setLocal:function (type,key,value){
                var $whdxHj2 = localStorage.whdxHj ? JSON.parse(localStorage.whdxHj) : null;
                if($whdxHj2){
                    if($whdxHj2[type]){
                        $whdxHj2[type][key] = value;
                        localStorage.whdxHj = JSON.stringify($whdxHj2);
                    }else{
                        var $typee = {};
                        $typee[key] = value;
                        $whdxHj2[type] = $typee;
                        localStorage.whdxHj = JSON.stringify($whdxHj2);
                    }
                }else{
                    localStorage.whdxHj = '{"' + type + '":{"' + key + '":"' + value + '"}}';
                }
            }
        },
        getNextDate: function (num) {
            var dd = new Date();
            dd.setDate(dd.getDate()+num);//获取num天后的日期
            var y = dd.getFullYear(),
                m = dd.getMonth()+1,
                d = dd.getDate();
            if(String(m).length == 1){
                m = "0" + m;
            }
            if(String(d).length == 1){
                d = "0" + d;
            }
            var thisVal = y + "-" + m + "-" + d + " 22:00";
            return thisVal;
        },
        myIndexOf:function (self,obj){
            for(var i=0;i < obj.length;i++){
                if(JSON.stringify(obj[i]) === JSON.stringify(self)){
                    return i;
                }
            }
        },
        objArrayReorder:function (arr,start,end,num) {
            if(end == "delete"){
                num ? arr.splice(start,1 + num + 1) : arr.splice(start,1);
            }else{
                if(num){
                    var startObjs = arr.slice(start,start + num + 1);
                    if(start > end){
                        arr.splice(start,1 + num + 1);
                        for(var i = num + 1;i>0;i--){
                            arr.splice(end,0,startObjs[i]);
                        }
                    }else if(start == end){
                        arr = arr;
                    }else{
                        for(var i = num + 1;i>0;i--){
                            arr.splice(end,0,startObjs[i]);
                        }
                        arr.splice(start,1 + num + 1);
                    }
                }else{
                    var startObj = arr[start];
                    if(start > end){
                        arr.splice(start,1);
                        arr.splice(end,0,startObj);
                    }else if(start == end){
                        arr = arr;
                    }else{
                        arr.splice(end,0,startObj);
                        arr.splice(start,1);
                    }
                }
            }
            return arr;
        },
        checkNum:function (value){
            var reg = /^\d+$/;
            if(value.constructor === String && value != 0 && value < 1000 && String(value)[0] != 0){
                var re = value.match(reg);
                if(re){
                    return true;
                }
            }
            return false;
        },
        toChinese:function (num){
            if(isNaN(num)){
                return num;
            }
            var AA = ["0", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
            var BB = ["", "十", "百", "千", "万", "亿", "点", ""];
            var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, chinese = "";
            for (var i = a[0].length - 1; i >= 0; i--) {
                switch (k) {
                    case 0: chinese = BB[7] + chinese; break;
                    case 4: if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                        chinese = BB[4] + chinese; break;
                    case 8: chinese = BB[5] + chinese; BB[7] = BB[5]; k = 0; break;
                }
                if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) chinese = AA[0] + chinese;
                if (a[0].charAt(i) != 0) chinese = AA[a[0].charAt(i)] + BB[k % 4] + chinese; k++;
            }
            if (a.length > 1) //加上小数部分(如果有小数部分)
            {
                chinese += BB[6];
                for (var i = 0; i < a[1].length; i++) chinese += AA[a[1].charAt(i)];
            }
            return chinese;
        },
        toRoman:function (num){
            if(isNaN(num)){
                return num;
            }
            var roman="";
            var alpha=[ 'I', 'V', 'X', 'L', 'C', 'D', 'M' ];
            var bit = 0;
            while (num > 0) {
                var tempnum = num % 10;
                switch (tempnum){
                    case 3:
                        roman=alpha[bit]+roman;
                        tempnum--;
                    case 2:
                        roman=alpha[bit]+roman;
                        tempnum--;
                    case 1:
                        roman=alpha[bit]+roman;
                        break;
                    case 4:
                        roman=alpha[bit + 1]+roman;
                        roman=alpha[bit]+roman;
                        break;
                    case 8:
                        roman=alpha[bit]+roman;
                        tempnum--;
                    case 7:
                        roman=alpha[bit]+roman;
                        tempnum--;
                    case 6:
                        roman=alpha[bit]+roman;
                        tempnum--;
                    case 5:
                        roman=alpha[bit + 1]+roman;
                        break;
                    case 9:
                        roman=alpha[bit + 2]+roman;
                        roman=alpha[bit]+roman;
                        break;
                    default:
                        break;
                }
                bit += 2;
                num = Math.floor(num / 10);
            }
            return roman;
        },
        warn:function (text) {
            var warn = document.getElementById("c_ErrorMsg");
            if(warn){
                warn.innerText = text;
            }else{
                var div = document.createElement("div");
                div.setAttribute("class","c_Dissolve dino");
                div.setAttribute("id","c_Dissolve");
                div.innerText = text;
                document.getElementsByTagName("body")[0].appendChild(div);
            }
            $(warn).fadeIn("200");
            setTimeout(function () {
                $(warn).fadeOut("200");
            },2000);
        }
    };
    //逻辑层
    var init = function (){
        var $this = this;
        //请求逻辑
        this.ajax = {
            hjLastcode:function (bol,obj,success,error){//章节记录
                $this.post(bol,"/web/common/teacherandstudent/lastcode",obj,success,error);
            },
            hjKnowledgetree:function (bol,obj,success,error){//章节
                $this.post(bol,"/web/common/teacher/knowledgetree",obj,success,error);
            },
            hjSavelastcode:function (bol,obj,success,error){//更新章节记录
                $this.post(bol,"/web/common/teacherandstudent/savelastcode",obj,success,error);
            },
            hjTypes:function (bol,obj,success,error){//名师指点类型
                $this.post(bol,"/web/teacher/paper/assign/types",obj,success,error);
            },
            hjPaperslist:function (bol,obj,success,error){//我的列表
                $this.post(bol,"/web/teacher/paper/assign/paperslist",obj,success,error);
            },
            hjDeletemylist:function (bol,obj,success,error){//删除我的列表项
                $this.postForDataNull(bol,"/web/teacher/paper/assign/delete",obj,success,error);
            },
            hjBaseinfo:function (bol,obj,success,error){//当前学科
                $this.post(bol,"/web/teacher/center/baseinfo",obj,success,error);
            },
            hjPaperinfo:function (bol,obj,success,error){//标准作业、测试详情
                $this.post(bol,"/web/teacher/paper/assign/paperinfo",obj,success,error);
            },
            hjPaperinfowithidtype:function (bol,obj,success,error){//我的列表-作业、测试详情
                $this.post(bol,"/web/teacher/paper/assign/paperinfowithidtype",obj,success,error);
            },
            hjPaperinfoWithAssign:function (bol,obj,success,error){//我的列表-作业、测试详情
                $this.post(bol,"/web/teacher/paper/assign/paperinfoWithAssign",obj,success,error);
            },
            hjEnglishpaperinfo:function (bol,obj,success,error){//英语分层作业、测试详情
                $this.post(bol,"/web/teacher/paper/assign/englishpaperinfo",obj,success,error);
            },
            hjEnglishpaperinfowithidtype:function (bol,obj,success,error){//英语我的列表-分层作业、测试详情
                $this.post(bol,"/web/teacher/paper/assign/englishpaperinfowithidtype",obj,success,error);
            },
            hjListeningtest:function (bol,obj,success,error){//英语听力训练详情
                $this.post(bol,"/web/teacher/paper/assign/listeningtest",obj,success,error);
            },
            hjListeningtestwithidtype:function (bol,obj,success,error){//英语我的列表听力训练详情
                $this.post(bol,"/web/teacher/paper/assign/listeningtestwithidtype",obj,success,error);
            },
            hjAssignclass:function (bol,obj,success,error){//班级列表
                $this.post(bol,"/web/teacher/paper/assign/assignclass",obj,success,error);
            },
            hjAssignindividual:function (bol,obj,success,error){//个人列表
                $this.post(bol,"/web/teacher/paper/assign/assignindividual",obj,success,error);
            },
            hjAssigngroup:function (bol,obj,success,error){//小组列表
                $this.post(bol,"/web/teacher/paper/assign/assigngroup",obj,success,error);
            },
            hjAssignpaperstoclass:function (bol,obj,success,error,contype){//布置给班级
                $this.postForDataNull(bol,"/web/teacher/paper/assign/assignpaperstoclass",obj,success,error,contype);
            },
            hjAssignpaperstogroup:function (bol,obj,success,error,contype){//布置给个人、小组
                $this.postForDataNull(bol,"/web/teacher/paper/assign/assignpaperstogroup",obj,success,error,contype);
            },
            hjSimulatepapers:function (bol,obj,success,error,contype){//模拟套卷
                $this.post(bol,"/web/teacher/paper/assign/simulatepapers",obj,success,error,contype);
            },
            hjCustompapername:function (bol,obj,success,error){//自主组卷标题
                $this.post(bol,"/web/teacher/paper/assign/custompapername",obj,success,error);
            },
            hjHourknowledges:function (bol,obj,success,error){//知识点 - 作业
                $this.post(bol,"/web/teacher/paper/assign/hourknowledges",obj,success,error);
            },
            hjTestknowledges:function (bol,obj,success,error){//知识点 - 测试
                $this.post(bol,"/web/teacher/paper/assign/testknowledges",obj,success,error);
            },
            hjSubjectquestiontypes:function (bol,obj,success,error){//题型 - 作业/测试
                $this.post(bol,"/web/teacher/paper/assign/subjectquestiontypes",obj,success,error);
            },
            hjPapersquestions:function (bol,obj,success,error){//题库 - 作业
                $this.post(bol,"/web/teacher/paper/assign/papersquestions",obj,success,error);
            },
            hjPpapertestquestions:function (bol,obj,success,error){//题库 - 测试
                $this.post(bol,"/web/teacher/paper/assign/papertestquestions",obj,success,error);
            },
            hjError:function (bol,obj,success,error){//错误类型
                $this.post(bol,"/web/common/report/error",obj,success,error);
            },
            hjSavequestionerror:function (bol,obj,success,error){//报错
                $this.postForRetData(bol,"/web/teacher/paper/assign/savequestionerror",obj,success,error);
            },
            hjSavecustompaper:function (bol,obj,success,error,contype){//保存试卷
                $this.post(bol,"/web/teacher/paper/assign/savecustompaper",obj,success,error,contype);
            },
            hjDelete:function (bol,obj,success,error){//删除我的作业记录
                $this.postForDataNull(bol,"/web/teacher/paper/assign/delete",obj,success,error);
            },
            hjGetquestiontypelist:function (bol,obj,success,error){//所有题型的列表
                $this.post(bol,"/web/common/getQuestionTypeList",obj,success,error);
            },
            hjCommonStyle:function (bol,obj,success,error){//题目自带样式
                $this.post(bol,"/web/common/commonStyle",obj,success,error);
            }
        };
        //数据转换逻辑
        this.Data = {
            hjKnowledgetree:function(Data){
                var newArray = [];
                function recursive(data,level,parentId) {
                    var newObj ={};
                    newObj.knowledgeId = data.knowledgeId;
                    newObj.alias = data.alias;
                    newObj.name = data.name;
                    newObj.parentId = parentId;
                    newObj.levelName = data.levelName;
                    newObj.level = level;
                    newObj.knowledgeType = data.knowledgeType ? data.knowledgeType : null;
                    newArray.push(newObj);
                    if(data.childrens){
                        level++;
                        for(var i = 0;i<data.childrens.length;i++){
                            recursive(data.childrens[i],level,data.knowledgeId);
                        }
                    }
                    return newArray;
                }
                var newArrays = [];
                for(var j = 0;j<Data.length;j++){
                    var myLevel = 1,
                        myParentId = "1";
                    newArrays = recursive(Data[j],myLevel,myParentId);
                }
                return newArrays;
            },
            hjQuestionLines:function (data,type,subject,pt){
                var idata = [],iNum = 1,iCode = 1;//简化的数据，新的lnOrder排序（原始数据中排序会改变为新的），组别统一码gpOrder排码
                if(data){
                    if("list" in data){//题库
                        var List = data.list;
                        var tgcode='',tisSplite='';
                        for(var a=0;a<List.length;a++){
                            if(List[a].groupCode == null || List[a].groupCode == "null"){//单题
                                if("questions" in List[a] && List[a].questions.length > 0){
                                    List[a].questions[0].lnOrder = iNum;
                                    delete List[a].questions[0].lineId;
                                    idata.push(List[a].questions[0]);
                                    iNum++;//题号++
                                }
                            }else{//组合题
                                var groupStartA = {
                                        group:"start",
                                        lnOrder: iNum,
                                        gpOrder: iCode,
                                        content: List[a].content,
                                        isSplite: List[a].isSplite,
                                        groupCode: List[a].groupCode,
                                        questionId: List[a].questionId,
                                        selectable: List[a].selectable,
                                        knowledgeId: List[a].knowledgeId,
                                        knowledgeName: List[a].knowledgeName,
                                        difficultName: List[a].difficultName,
                                        questionTypeId: List[a].questionTypeId,
                                        questionTypeName: List[a].questionTypeName
                                    },
                                    groupEndA = {
                                        group:"end",
                                        labels: List[a].labels,
                                        isSplite: List[a].isSplite,
                                        groupCode: List[a].groupCode,
                                        groupId: List[a].questionId
                                    };
                                tisSplite = List[a].isSplite;
                                tgcode = List[a].groupCode;
                                idata.push(groupStartA);
                                if("questions" in List[a] && List[a].questions.length > 0){
                                    var Questionses = List[a].questions;
                                    for(var b=0;b<Questionses.length;b++){
                                        Questionses[b].lnOrder = iNum;
                                        Questionses[b].gpOrder = iCode;
                                        if(Questionses[b].groupCode == tgcode){
                                            Questionses[b].isSplite = tisSplite;
                                        }
                                        delete Questionses[b].lineId;
                                        idata.push(Questionses[b]);
                                        if(Questionses[b].isSplite == "0"){//不可拆分
                                            if(b == Questionses.length - 1){//此group的最后1题
                                                iNum++;//题号++
                                            }
                                        }else if(Questionses[b].isSplite == "1"){//可拆分
                                            iNum++;//题号++
                                        }
                                        if(b == Questionses.length - 1){
                                            iCode++;//组别统一码++
                                        }
                                    }
                                }
                                idata.push(groupEndA);
                            }
                        }
                    }else if("questionLines" in data){//试卷or作业
                        var QuestionLines = data.questionLines;
                        for(var i=0;i<QuestionLines.length;i++){
                            //行号：
                            var isNumber = null,lineNumber = null,lineName = null;
                            //非英语使用标点、抓取题号；英语使用标点.抓取题号
                            if(QuestionLines[i].lineName){
                                if(QuestionLines[i].lineName.indexOf("、") != -1 && QuestionLines[i].lineName.indexOf("、") < 4){//标点、在前3个字符之间
                                    isNumber = true;
                                    lineNumber = QuestionLines[i].lineName.split("、")[0];
                                    lineName = QuestionLines[i].lineName.replace(lineNumber,"");
                                }else if(QuestionLines[i].lineName.indexOf(".") != -1 && QuestionLines[i].lineName.indexOf(".") < 5){//标点.在前4个字符之间
                                    isNumber = true;
                                    lineNumber = QuestionLines[i].lineName.split(".")[0];
                                    lineName = QuestionLines[i].lineName.replace(lineNumber,"");
                                }else{//其它，判断为无题号
                                    isNumber = false;
                                    lineNumber = null;
                                    lineName = QuestionLines[i].lineName;
                                }
                            }else{
                                isNumber = false;
                                lineNumber = null;
                                lineName = null;
                            }
                            if(pt == "203"){//英语听力 : 题行
                                isNumber = false;
                                lineNumber = null;
                                lineName = QuestionLines[i].lineName;
                            }
                            var lineStart = {
                                    line: "start",
                                    lnOrder: iNum,
                                    isShow: QuestionLines[i].isShow,
                                    lineId: QuestionLines[i].lineId,
                                    scoreDef: QuestionLines[i].scoreDef,
                                    lineName: lineName,
                                    isNumber: isNumber,
                                    showOrder: i,
                                    lineNumber: lineNumber,
                                    questionType: QuestionLines[i].questionType,
                                    isScoreBatch: $this.Data.isScoreBatch(type,subject,QuestionLines[i].questionType,QuestionLines[i].lineId,lineName),//查询赋分模式（true:批量,false:逐题）
                                    isScoreBtn: $this.Data.isScoreBtn(type,subject,QuestionLines[i].questionType,QuestionLines[i].lineId,lineName)//查询是否有赋分模式切换按钮（true:有,false:无）
                                },
                                lineEnd = {
                                    line: "end"
                                };
                            idata.push(lineStart);
                            if("questionGroup" in QuestionLines[i] && QuestionLines[i].questionGroup.length > 0){
                                var QuestionGroup = QuestionLines[i].questionGroup;
                                var tgcode='',tisSplite='';
                                for(var j=0;j<QuestionGroup.length;j++){
                                    if(QuestionGroup[j].groupCode == null || QuestionGroup[j].groupCode == "null"){//单题
                                        if("questions" in QuestionGroup[j] && QuestionGroup[j].questions.length > 0){
                                            QuestionGroup[j].questions[0].lnOrder = iNum;
                                            delete QuestionGroup[j].questions[0].lineId;
                                            idata.push(QuestionGroup[j].questions[0]);
                                            iNum++;//题号++
                                        }
                                    }else{//组合题
                                        var groupStart = {
                                                group:"start",
                                                lnOrder: iNum,
                                                gpOrder: iCode,
                                                content: QuestionGroup[j].content,
                                                isSplite: QuestionGroup[j].isSplite,
                                                groupCode: QuestionGroup[j].groupCode,
                                                questionId: QuestionGroup[j].questionId,
                                                selectable: QuestionGroup[j].selectable,
                                                knowledgeId: QuestionGroup[j].knowledgeId,
                                                knowledgeName: QuestionGroup[j].knowledgeName,
                                                difficultName: QuestionGroup[j].difficultName,
                                                questionTypeId: QuestionGroup[j].questionTypeId,
                                                questionTypeName: QuestionGroup[j].questionTypeName
                                            },
                                            groupEnd = {
                                                group:"end",
                                                labels: QuestionGroup[j].labels,
                                                isSplite: QuestionGroup[j].isSplite,
                                                groupCode: QuestionGroup[j].groupCode,
                                                groupId: QuestionGroup[j].questionId
                                            };
                                        tisSplite = QuestionGroup[j].isSplite;
                                        tgcode = QuestionGroup[j].groupCode;
                                        idata.push(groupStart);
                                        if("questions" in QuestionGroup[j] && QuestionGroup[j].questions.length > 0){
                                            var Questions = QuestionGroup[j].questions;
                                            for(var k=0;k<Questions.length;k++){
                                                Questions[k].lnOrder = iNum;
                                                Questions[k].gpOrder = iCode;
                                                if(Questions[k].groupCode == tgcode){
                                                    Questions[k].isSplite = tisSplite;
                                                }
                                                delete Questions[k].lineId;
                                                idata.push(Questions[k]);
                                                if(Questions[k].isSplite == "0"){//不可拆分
                                                    if(k == Questions.length - 1){//此group的最后1题
                                                        iNum++;//题号++
                                                    }
                                                }else if(Questions[k].isSplite == "1"){//可拆分
                                                    iNum++;//题号++
                                                }
                                                if(k == Questions.length - 1){
                                                    iCode++;//组别统一码++
                                                }
                                            }
                                        }
                                        idata.push(groupEnd);
                                    }
                                }
                            }
                            idata.push(lineEnd);
                        }
                    }
                }
                return idata;
            },
            isScoreBatch:function (type,subject,questionType,lineId,lineName) {
                if(type == "work") return false;
                var isSB = false;
                lineId.indexOf("new") != -1 ? standard() : practice();//  标准题行 ：课时练题行
                if(isSB){//如果批量赋分，但题行内部小题分值不全相等,设定为逐题赋分
                    var paperData = $this.storage.getLocal(type,"paperdata");
                    paperData = paperData ? JSON.parse(paperData) : [];
                    for(var i = 0;i<paperData.length;i++){
                        if(paperData[i].line && paperData[i].line == "start" && paperData[i].lineId == lineId){
                            var scoreBase = null;
                            contrast(i);
                            function contrast(num) {
                                if(!(paperData[num+1].line && paperData[num+1].line == "end")){
                                    if(!scoreBase){
                                        scoreBase = paperData[num+1].score;
                                    }
                                    if(paperData[num+1].score != scoreBase){
                                        isSB = false;
                                    }else{
                                        contrast(num+1);
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                function standard() {
                    switch (subject){
                        case "01":
                            questionType == "01" || questionType == "34" ? isSB = true : isSB = false;
                            break;
                        case "02":
                            questionType == "01" ? isSB = true : isSB = false;
                            break;
                        case "03":
                            questionType == "05" || questionType == "35" ? isSB = true : isSB = false;
                            break;
                        case "04":
                            questionType == "05" || questionType == "09" || questionType == "10" || questionType == "34" ? isSB = true : isSB = false;
                            break;
                        case "05":
                            questionType == "01" || questionType == "10" ? isSB = true : isSB = false;
                            break;
                        case "06":
                            questionType == "05" || questionType == "09" ? isSB = true : isSB = false;
                            break;
                        case "07":
                            questionType == "05" || questionType == "09" || questionType == "10" ? isSB = true : isSB = false;
                            break;
                        case "08":
                            questionType == "05" || questionType == "09" ? isSB = true : isSB = false;
                            break;
                        case "09":
                            questionType == "05" || questionType == "09" || questionType == "10" || questionType == "34" || questionType == "38" ? isSB = true : isSB = false;
                            break;
                        default:
                            isSB = false;
                    }
                }
                function practice() {
                    switch (subject){
                        case "01":
                            questionType == "01" || questionType == "34" ? isSB = true : isSB = false;
                            break;
                        case "02":
                            questionType == "01" ? isSB = true : isSB = false;
                            break;
                        case "03":
                            questionType == "05" || questionType == "35" ? isSB = true : isSB = false;
                            break;
                        case "04":
                            questionType == "05" || questionType == "09" || questionType == "10" || questionType == "34" ? isSB = true : isSB = false;
                            break;
                        case "05":
                            questionType == "01" || questionType == "10" ? isSB = true : isSB = false;
                            break;
                        case "06":
                            questionType == "05" || questionType == "09" ? isSB = true : isSB = false;
                            break;
                        case "07":
                            questionType == "05" || questionType == "09" || questionType == "10" ? isSB = true : isSB = false;
                            break;
                        case "08":
                            questionType == "05" || questionType == "09" ? isSB = true : isSB = false;
                            break;
                        case "09":
                            questionType == "05" || questionType == "09" || questionType == "10" || questionType == "34" || questionType == "38" ? isSB = true : isSB = false;
                            break;
                        default:
                            isSB = false;
                    }
                }
                return isSB;
            },
            isScoreBtn:function (type,subject,questionType,lineId,lineName) {
                if(type == "work") return false;
                var isSB = false;
                lineId.indexOf("new") != -1 ? standard() : practice();//  标准题行 ：课时练题行
                function standard() {
                    switch (subject){
                        case "01":
                            questionType == "01" || questionType == "34" ? isSB = true : isSB = false;
                            break;
                        case "02":
                            questionType == "01" ? isSB = true : isSB = false;
                            break;
                        case "03":
                            questionType == "05" || questionType == "35" ? isSB = true : isSB = false;
                            break;
                        case "04":
                            questionType == "05" || questionType == "09" || questionType == "10" || questionType == "34" ? isSB = true : isSB = false;
                            break;
                        case "05":
                            questionType == "01" || questionType == "10" ? isSB = true : isSB = false;
                            break;
                        case "06":
                            questionType == "05" || questionType == "09" ? isSB = true : isSB = false;
                            break;
                        case "07":
                            questionType == "05" || questionType == "09" || questionType == "10" ? isSB = true : isSB = false;
                            break;
                        case "08":
                            questionType == "05" || questionType == "09" ? isSB = true : isSB = false;
                            break;
                        case "09":
                            questionType == "05" || questionType == "09" || questionType == "10" || questionType == "34" || questionType == "38" ? isSB = true : isSB = false;
                            break;
                        default:
                            isSB = false;
                    }
                }
                function practice() {
                    switch (subject){
                        case "01":
                            questionType == "01" || questionType == "34" ? isSB = true : isSB = false;
                            break;
                        case "02":
                            questionType == "01" ? isSB = true : isSB = false;
                            break;
                        case "03":
                            questionType == "05" || questionType == "35" ? isSB = true : isSB = false;
                            break;
                        case "04":
                            questionType == "05" || questionType == "09" || questionType == "10" || questionType == "34" ? isSB = true : isSB = false;
                            break;
                        case "05":
                            questionType == "01" || questionType == "10" ? isSB = true : isSB = false;
                            break;
                        case "06":
                            questionType == "05" || questionType == "09" ? isSB = true : isSB = false;
                            break;
                        case "07":
                            questionType == "05" || questionType == "09" || questionType == "10" ? isSB = true : isSB = false;
                            break;
                        case "08":
                            questionType == "05" || questionType == "09" ? isSB = true : isSB = false;
                            break;
                        case "09":
                            questionType == "05" || questionType == "09" || questionType == "10" || questionType == "34" || questionType == "38" ? isSB = true : isSB = false;
                            break;
                        default:
                            isSB = false;
                    }
                }
                return isSB;
            },
            restorePaperData:function (type,subject) {
                var paperData = $this.storage.getLocal(type,"paperdata");
                paperData = paperData ? JSON.parse(paperData) : [];
                var restoreData = [];
                for(var i = 0;i<paperData.length;i++){
                    if(paperData[i].line && paperData[i].line == "start"){
                        var lineObj = {};
                        lineObj.isShow = paperData[i].isShow;
                        lineObj.questionType = paperData[i].questionType;
                        lineObj.showOrder = paperData[i].showOrder;
                        lineObj.remarks = (paperData[i].lineNumber ? paperData[i].lineNumber : "") + paperData[i].lineName;
                        lineObj.scoreDef = paperData[i].scoreDef;
                        lineObj.customLineTj = [];
                        findQues(i);
                        restoreData.push(lineObj);
                        function findQues(num) {
                            var obj = paperData[num+1],
                                isGroupEnd = false,
                                isLineEnd = false;
                            if(obj.group && obj.group == "end") isGroupEnd = true;
                            if(obj.line && obj.line == "end") isLineEnd = true;
                            if(!isLineEnd){
                                if(isGroupEnd){
                                    findQues(num+1);
                                }else{
                                    var quesOrLineObj = {};//组和题是平行数据
                                    quesOrLineObj.lnOrder = paperData[num+1].lnOrder;
                                    quesOrLineObj.questionId = paperData[num+1].questionId;
                                    quesOrLineObj.score = paperData[num+1].score;
                                    lineObj.customLineTj.push(quesOrLineObj);
                                    findQues(num+1);
                                }
                            }
                        }
                    }
                }
                return restoreData;
            },
            hjPaperData:{//编辑：增删改等数据处理
                add:function (type,subject,id,prevId,prevCondition,objArr,condition) {
                    //(类型，添加至prevId之后，prevId的类型，添加的数据，添加的数据类型)
                    var paperData = JSON.parse($this.storage.getLocal(type,"paperdata"));
                    objArr.reverse();//倒置
                    if(prevCondition.indexOf("question") != -1){
                        //行内不置顶的单题，可跨行
                        for(var i=0;i<paperData.length;i++){
                            if(paperData[i].questionId == prevId){
                                for(var j=0;j<objArr.length;j++){
                                    paperData.splice(i+1,0,objArr[j]);
                                }
                                break;
                            }
                        }
                    }else if(prevCondition.indexOf("group") != -1){
                        //行内不置顶的组合题，可跨行
                        for(var i=0;i<paperData.length;i++){
                            var prevGroupNum = 0;
                            if(paperData[i].questionId == prevId){
                                if(paperData[i].groupCode){
                                    accumulationGroup(i);
                                    function accumulationGroup(num) {
                                        prevGroupNum++;
                                        if(!(paperData[num+1].group && paperData[num+1].group == "end")){
                                            accumulationGroup(num+1);
                                        }
                                    }
                                    for(var j=0;j<objArr.length;j++){
                                        paperData.splice(i+1+prevGroupNum,0,objArr[j]);
                                    }
                                }else{
                                    for(var j=0;j<objArr.length;j++){
                                        paperData.splice(i+1,0,objArr[j]);
                                    }
                                }
                                break;
                            }
                        }
                    }else if(prevCondition.indexOf("line") != -1 && (condition.indexOf("question") != -1 || condition.indexOf("group") != -1)){
                        //单题或组合题在行内置顶
                        for(var i=0;i<paperData.length;i++){
                            if(paperData[i].lineId == prevId){
                                for(var j=0;j<objArr.length;j++){
                                    paperData.splice(i+1,0,objArr[j]);
                                }
                                break;
                            };
                        }
                    }else if(prevCondition.indexOf("line") != -1 && condition.indexOf("line") != -1){
                        //行与行换位
                        for(var i=0;i<paperData.length;i++){
                            if(paperData[i].lineId == prevId){
                                var prevLineNum = 0;
                                accumulationLine(i);
                                function accumulationLine(num) {
                                    prevLineNum++;
                                    if(!(paperData[num+1].line && paperData[num+1].line == "end")){
                                        accumulationLine(num+1);
                                    }
                                }
                                for(var j=0;j<objArr.length;j++){
                                    paperData.splice(i+1+prevLineNum,0,objArr[j]);
                                }
                                break;
                            };
                        }
                    }else if(prevId == "start" && condition.indexOf("line") != -1){
                        //行置顶
                        for(var j=0;j<objArr.length;j++){
                            paperData.splice(0,0,objArr[j]);
                        }
                    }
                    $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                    $this.Data.hjPaperData.reorder(type);//数据排序
                    if(type == "test"){
                        if(condition.indexOf("question") != -1 || condition.indexOf("group") != -1){//整行移动位置不会改变他们的scoreDef
                            var lineId;
                            for(var j = 0;j<paperData.length;j++){
                                if(paperData[j].questionId == id){
                                    findLineId(j);
                                    function findLineId(num) {
                                        if(paperData[num-1].line && paperData[num-1].line == "start"){
                                            lineId = paperData[num-1].lineId;
                                        }else{
                                            findLineId(num-1);
                                        }
                                    }
                                }
                            }
                            $this.Data.hjPaperData.modify.lineScoreDef(type,lineId);//更新数据行分
                            $this.Data.hjPaperData.modify.isScoreBatch(type,subject)//更新行赋分类型
                            $this.event.modifyLineScoreDef(type,lineId);//更新html行分
                        }
                    }
                },
                deleteOne:function (type,questionId) {
                    var paperData = JSON.parse($this.storage.getLocal(type,"paperdata"));
                    var lineId;
                    for(var j = 0;j<paperData.length;j++){
                        if(paperData[j].questionId == questionId){
                            findLineId(j);
                            function findLineId(num) {
                                if(paperData[num-1].line && paperData[num-1].line == "start"){
                                    lineId = paperData[num-1].lineId;
                                }else{
                                    findLineId(num-1);
                                }
                            }
                        }
                    }
                    for(var j = 0;j<paperData.length;j++){
                        if(paperData[j].questionId == questionId){
                            //(1)删除:组可拆分
                            var deleteGroup = false;
                            var deleteGroup0 = false;
                            if(j>0 && paperData[j-1].group == "start" && paperData[j+1].group == "end"){
                                deleteGroup = true;
                            }
                            var deleteGroup0num = 1;
                            if(j>0 && paperData[j].group == "start"){
                                deleteGroup0 = true;
                                haveNum(j);
                                function haveNum(num) {
                                    deleteGroup0num++;
                                    if(!(paperData[num+1].group && paperData[num+1].group == "end")){
                                        haveNum(num+1);
                                    }
                                }
                            }
                            //(2)删除:组不可拆分
                            var deleteGroup2 = false,deleteGroup2num = 1;
                            if(paperData[j].group && paperData[j].isSplite && paperData[j].isSplite == "0"){
                                deleteGroup2 = true;
                                haveNum(j);
                                function haveNum(num) {
                                    deleteGroup2num++;
                                    if(!(paperData[num+1].group && paperData[num+1].group == "end")){
                                        haveNum(num+1);
                                    }
                                }
                            }
                            //删除事件
                            if(deleteGroup){
                                paperData.splice(j-1,3);
                            }else if(deleteGroup0){
                                paperData.splice(j,deleteGroup0num);
                            }else if(deleteGroup2){
                                paperData.splice(j,deleteGroup2num);
                            }else{
                                paperData.splice(j,1);//(3)删除：单题
                            }
                            break;
                        }
                    }
                    $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                    $this.Data.hjPaperData.reorder(type);//数据排序
                    if(type == "test"){//测试
                        $this.Data.hjPaperData.modify.lineScoreDef(type,lineId);//更新数据行分
                        $this.event.modifyLineScoreDef(type,lineId);//更新html行分
                    }
                },
                deleteLine:function (type, lineId) {//已废除的功能，留作备用
                    var paperData = JSON.parse($this.storage.getLocal(type,"paperdata"));
                    for(var j = 0;j<paperData.length;j++){
                        if(paperData[j].lineId == lineId){
                            var deleteLineNum = 1;
                            haveNum(j);
                            function haveNum(num) {
                                deleteLineNum++;
                                if(!(paperData[num+1].line && paperData[num+1].line == "end")){
                                    haveNum(num+1);
                                }
                            }
                            paperData.splice(j,deleteLineNum);
                            break;
                        }
                    }
                    $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                },
                modify:{
                    lineNumber:function (type,subject) {
                        var paperData = JSON.parse($this.storage.getLocal(type,"paperdata")),
                            num = 0;
                        for(var i = 0;i<paperData.length;i++){
                            if(paperData[i].line && paperData[i].line == "start" && paperData[i].isNumber == true){
                                num++;
                                paperData[i].lineNumber = subject == "03" ? $this.toRoman(num) : $this.toChinese(num);
                            }
                        }
                        $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                    },
                    lineScoreDef:function (type,lineId){
                        var paperData = JSON.parse($this.storage.getLocal(type,"paperdata")),
                            orderMin,orderMax,totalScore = 0;
                        for(var i = 0;i<paperData.length;i++){
                            if(paperData[i].line && paperData[i].line == "start" && paperData[i].lineId == lineId){
                                //if(paperData[i].group && paperData[i].group == "start") {
                                //
                                //}
                                orderMin = paperData[i].lnOrder;
                                findOrderMax(i);
                                addTotalScore(i);
                                paperData[i].scoreDef = orderMax ? "（共" + (orderMax-orderMin+1) + "小题，共" + totalScore + "分）" : null;
                                function findOrderMax(num) {
                                    if(!(paperData[num+1].line && paperData[num+1].line == "end")){
                                        if(!(paperData[num+1].group && paperData[num+1].group == "end")){
                                            orderMax = paperData[num+1].lnOrder;
                                            findOrderMax(num+1);
                                        }else{
                                            findOrderMax(num+1);
                                        }
                                    }
                                }
                                function addTotalScore(num) {
                                    if(!(paperData[num+1].line && paperData[num+1].line == "end")){
                                        totalScore += paperData[num+1].score ? paperData[num+1].score : 0;
                                        addTotalScore(num+1);
                                    }
                                }
                                break;
                            }
                        }
                        $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                    },
                    allLineScoreDef:function (type) {
                        var paperData = $this.storage.getLocal(type,"paperdata");
                        paperData = paperData ? JSON.parse(paperData) : [];
                        for(var i = 0;i<paperData.length;i++){
                            if(paperData[i].line && paperData[i].line == "start"){
                                var orderMin,orderMax = null,totalScore = 0;
                                orderMin = paperData[i].lnOrder;
                                findOrderMax(i);
                                addTotalScore(i);
                                paperData[i].scoreDef = orderMax ? "（共" + (orderMax-orderMin+1) + "小题，共" + totalScore + "分）" : null;
                                function findOrderMax(num) {
                                    if(!(paperData[num+1].line && paperData[num+1].line == "end")){
                                        orderMax = paperData[num+1].lnOrder ? paperData[num+1].lnOrder : orderMax;
                                        findOrderMax(num+1);
                                    }
                                }
                                function addTotalScore(num) {
                                    if(!(paperData[num+1].line && paperData[num+1].line == "end")){
                                        totalScore += paperData[num+1].score ? paperData[num+1].score : 0;
                                        addTotalScore(num+1);
                                    }
                                }
                            }
                        }
                        paperData.length == 0 ? $this.storage.setLocal(type,"paperdata","") : $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                    },
                    isScoreBatch:function (type,subject) {
                        var paperData = JSON.parse($this.storage.getLocal(type,"paperdata"));
                        for(var i = 0;i<paperData.length;i++){
                            if(paperData[i].line && paperData[i].line == "start" && paperData[i].isScoreBatch){
                                var baser = null,isbaser = false;
                                eveScore(i);
                                function eveScore(num) {
                                    if(paperData[num+1].score && !(paperData[num+1].line && paperData[num+1].line == "end")){
                                        if(!baser){
                                            baser = paperData[num+1].score;
                                            console.log(baser);
                                        }
                                        console.log(paperData[num+1].score)
                                        if(paperData[num+1].score != baser){
                                            isbaser = true;
                                        }else{
                                            eveScore(num+1);
                                        }
                                    }
                                }
                                if(isbaser){
                                    paperData[i].isScoreBatch = false;
                                }
                            }
                        }
                        $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                    }
                },
                select:function (type,id) {
                    var paperData = JSON.parse($this.storage.getLocal(type,"paperdata")),
                        condition;
                    //取出id相关的类型（题/组/行）
                    for(var i = 0;i<paperData.length;i++){
                        if(paperData[i].questionId == id){
                            paperData[i].group ? condition = "group" : condition = "question";
                        }else if(paperData[i].lineId == id){
                            condition = "line";
                        }
                    }
                    //克隆
                    var cloneArr=[];
                    if(condition == "question"){
                        //单题
                        for(var i=0;i<paperData.length;i++){
                            if(paperData[i].questionId == id){
                                var cloneObj = $.extend(true,{},paperData[i]);
                                cloneArr.push(cloneObj);
                                break;
                            }
                        }
                    }else if(condition == "group"){
                        //组合题
                        for(var i=0;i<paperData.length;i++){
                            if(paperData[i].questionId == id){
                                var cloneObj = $.extend(true,{},paperData[i]);
                                cloneArr.push(cloneObj);
                                accumulationGroup(i);
                                function accumulationGroup(num) {
                                    cloneArr.push(paperData[num+1]);
                                    if(!(paperData[num+1].group && paperData[num+1].group == "end")){
                                        accumulationGroup(num+1);
                                    }
                                }
                                break;
                            }
                        }
                    }else if(condition == "line"){
                        //行
                        for(var i=0;i<paperData.length;i++){
                            if(paperData[i].lineId == id){
                                var cloneObj = $.extend(true,{},paperData[i]);
                                cloneArr.push(cloneObj);
                                accumulationLine(i);
                                function accumulationLine(num) {
                                    cloneArr.push(paperData[num+1]);
                                    if(!(paperData[num+1].line && paperData[num+1].line == "end")){
                                        accumulationLine(num+1);
                                    }
                                }
                                break;
                            }
                        }
                    }
                    return cloneArr;
                },
                reorder:function (type) {
                    var paperData = JSON.parse($this.storage.getLocal(type,"paperdata"));
                    if(paperData && paperData.length > 0){
                        var showOrder = 0;
                        //var lnOrder = 1;
                        var tCode = '',tSplite = '',order= 0,gorder=0;
                        for(var i = 0;i<paperData.length;i++){
                            var obj = paperData[i];
                            if(obj.line && obj.line == "start" && (obj.showOrder || obj.showOrder == 0)){
                                obj.showOrder = showOrder;
                                showOrder++;
                            }
                            //if(obj.lnOrder || obj.lnOrder == 0){
                            //    obj.lnOrder = lnOrder;
                            //    if(!(obj.line || obj.group || (obj.groupCode && obj.isSplite == "0"))){
                            //        lnOrder++;
                            //    }
                            //}else{
                            //
                            //}if(obj.group && obj.group == "end"){
                            //    lnOrder++;
                            //}
                            if(obj.group){
                                if(obj.group=='start'){
                                    tCode = obj.groupCode;
                                    tSplite = obj.isSplite;
                                    if(tSplite == '0'){
                                        order++;
                                        obj.lnOrder = order;
                                        gorder=0;
                                    }else{
                                        obj.lnOrder = order+1;
                                    }
                                }
                            }else if(obj.line){
                                if(obj.line=='start'){
                                    obj.lnOrder = order+1;
                                }
                            }else{
                                if(obj.groupCode&&obj.groupCode == tCode){
                                    if(tSplite == '0'){
                                        obj.lnOrder = order;
                                        gorder++;
                                        obj.gpOrder = gorder;
                                    }else{
                                        order++;
                                        obj.lnOrder = order;
                                        obj.lnOrder = order;
                                    }
                                }else{
                                    order++;
                                    obj.lnOrder = order;
                                }
                            }
                        }
                        $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                    }
                }
            },
            knowledge:function (type,active,thisKt) {
                var knowledgePost = {};
                knowledgePost.knowledgeId = active;
                if(type == "work"){
                    $this.ajax.hjHourknowledges(true,knowledgePost,sKnowledge,eKnowledge);
                }else if(type == "test"){
                    knowledgePost.knowledgeType = thisKt;
                    $this.ajax.hjTestknowledges(true,knowledgePost,sKnowledge,eKnowledge);
                }
                function sKnowledge(data) {
                    $this.storage.setLocal(type,"knowledge",JSON.stringify(data.retData));
                }
                function eKnowledge() {
                    $this.storage.setLocal(type,"knowledge","");
                }
            },
            questionType:function (type,active,thisKt) {
                var questiontype = $this.storage.getLocal(type,"questiontype");
                questiontype = questiontype ? JSON.parse(questiontype) : [];
                var forActive = questiontype.length > 0 ? questiontype[0].forActive : null;
                if(forActive != active){
                    var questionTypePost = {};
                    questionTypePost.knowledgeId = active;
                    if(type == "work"){
                        $this.ajax.hjSubjectquestiontypes(true,questionTypePost,sQuestionType,eQuestionType);
                    }else if(type == "test"){
                        questionTypePost.knowledgeType = thisKt;
                        $this.ajax.hjSubjectquestiontypes(true,questionTypePost,sQuestionType,eQuestionType);
                    }
                }
                function sQuestionType(data) {
                    var data = data.retData;
                    for(var i = 0;i<data.length;i++){
                        data[i].lineId = "new" + Math.random().toString().replace(".","") + new Date().getTime();
                        data[i].forActive = active;
                    }
                    $this.storage.setLocal(type,"questiontype",JSON.stringify(data));
                }
                function eQuestionType() {
                    $this.storage.setLocal(type,"questiontype","");
                }
            },
            questionTypeMapped:function (type,active,subject) {
                var questiontype = $this.storage.getLocal(type,"questiontype");
                questiontype = questiontype ? JSON.parse(questiontype) : [];
                if(subject == "03"){
                    var newObj = {};//阅读理解
                    newObj.code = "13,30,31,32,33";
                    newObj.label = "阅读理解";
                    newObj.lineId = "new" + Math.random().toString().replace(".","") + new Date().getTime();
                    newObj.forActive = active;
                    questiontype.push(newObj);//添加新映射
                    //删除旧映射
                    for(var i = questiontype.length - 1;i>=0;i--){
                        if(questiontype[i].code == "13" || questiontype[i].code == "30" || questiontype[i].code == "31" || questiontype[i].code == "32" || questiontype[i].code == "33"){
                            questiontype.splice(i,1);
                        }
                    }
                }
                $this.storage.setLocal(type,"questiontypemapped",JSON.stringify(questiontype));//缓存映射
            },
            questionTypeMappedToPaperData:function (type,subject) {
                var paperData = $this.storage.getLocal(type,"paperdata");
                paperData = paperData ? JSON.parse(paperData) : [];
                if(subject == "03"){
                    for(var i = 0;i<paperData.length;i++){
                        if(paperData[i].line && paperData[i].line == "start"){
                            if(paperData[i].questionType == "13" || paperData[i].questionType == "30" || paperData[i].questionType == "31" || paperData[i].questionType == "32" || paperData[i].questionType == "33"){
                                paperData[i].questionType = "13,30,31,32,33";
                            }
                        }
                    }
                }
                if(paperData.length > 0){
                    $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));//缓存题型映射后的试卷
                }
            }
        };
        //数据解析逻辑
        this.Html = {
            hjKnowledgetree:function(Data,theActive){
                if(!theActive){//无记录，获取第1章最后1个子栏目的第1个项目id
                    getActive("1");
                    function getActive(objId){
                        for(var i = 0;i<Data.length;i++){
                            if(Data[i].parentId == objId){
                                theActive = Data[i].knowledgeId;
                                getActive(theActive);
                                break;
                            }
                        }
                    }
                }
                var theActiveParent;//获取父节点id
                for(var j = 0;j<Data.length;j++){
                    if(Data[j].knowledgeId == theActive){
                        theActiveParent = Data[j].parentId;
                        break;
                    }
                }
                var knowledgetreeHtml = "";
                setHtml(theActiveParent);
                function setHtml(theActiveParent,LastActiveParent){
                    var li="",dlLevel,dlLevelName;
                    for(var n = 0;n<Data.length;n++){
                        if(Data[n].parentId == theActiveParent){
                            if(!dlLevel){
                                dlLevel = Data[n].level;
                                dlLevelName = Data[n].levelName;
                            }
                            var _alias = "",_knowledgeType = Data[n].knowledgeType ? Data[n].knowledgeType : "";
                            Data[n].alias ? _alias = " " + Data[n].alias : _alias = "";
                            Data[n].knowledgeId == theActive || Data[n].knowledgeId == LastActiveParent ? li += "<li class='on' id='" + Data[n].knowledgeId + "' data-kt='" + _knowledgeType + "' title='" + Data[n].name + _alias + "'>" + Data[n].name + "</li>" : li += "<li id='" + Data[n].knowledgeId + "' data-kt='" + _knowledgeType + "' title='" + Data[n].name + _alias + "'>" + Data[n].name + "</li>";
                        }
                    }
                    knowledgetreeHtml = "<dl class='level_" + dlLevel + "'>" + "<dt>" + dlLevelName + "：</dt>" + "<dd>" + "<ul>" + li + "</ul>" + "</dd>" + "</dl>" + knowledgetreeHtml;
                    for(var k = 0;k<Data.length;k++){
                        if(Data[k].knowledgeId == theActiveParent){
                            setHtml(Data[k].parentId,theActiveParent);
                        }
                    }
                }
                return knowledgetreeHtml;
            },
            hjTypes:function(Data,type){
                var div1 = "",div2 = "",div3 = "",div4 = "",div5 = "",div6 = "",div7 = "";
                for(var i = 0;i<Data.length;i++) {
                    var obj = Data[i];
                    if(obj.title === "课时练"){
                        var ptA = type == "work" ? "101" : "201",
                            hrefA = type == "work" ? "../../model/homework/hj_paper.html?isSaved=no" : "../../model/test/hj_paper.html?isSaved=no",
                            imgA = type == "work" ? "../../static/image/homework/h_Type_01.jpg" : "../../static/image/test/h_Type_01.jpg";
                        div1 += "<div class='h_Type'>";
                        div1 += "<a class='needsetstorage' data-id='" + obj.id + "' data-pt='" + ptA + "' href='" + hrefA + "' data-target='standard'>";
                        div1 += "<img src='" + imgA + "' alt='" + obj.title + "'>";
                        div1 += "</a>";
                        div1 += "</div>";
                    }else if(obj.title === "自主组卷"){
                        var ptB = type == "work" ? "116" : "216",
                            hrefB = type == "work" ? "../../model/homework/hj_edit.html" : "../../model/test/hj_edit.html",
                            imgB = type == "work" ? "../../static/image/homework/h_Type_05.jpg" : "../../static/image/test/h_Type_05.jpg";
                        div2 += "<div class='h_Type'>";
                        div2 += "<a class='needsetstorage' data-id='" + obj.id + "' data-pt='" + ptB + "' href='" + hrefB + "' data-target='standard' data-paperdata=''>";
                        div2 += "<img src='" + imgB + "' alt='" + obj.title + "'>";
                        div2 += "</a>";
                        div2 += "</div>";
                    }else if(obj.title === "随堂检测"){
                        div3 += "<div class='h_Type'>";
                        div3 += "<a class='needsetstorage' data-id='" + obj.id + "' data-pt='105' href='../../model/homework/hj_paper.html?isSaved=no' data-target='standard'>";
                        div3 += "<img src='../../static/image/homework/h_Type_06.jpg' alt='" + obj.title + "'>";
                        div3 += "</a>";
                        div3 += "</div>";
                    }else if(obj.title === "分层作业"){
                        var reverseArr = obj.childsList.reverse();
                        for(var j = 0;j<reverseArr.length;j++){
                            div4 += "<div class='h_Type'>";
                            div4 += "<a class='needsetstorage' data-id='" + reverseArr[j].id + "' data-pt='10"+(j+2)+"' href='../../model/homework/hj_paper.html?isSaved=no' data-target='standard'>";
                            div4 += "<img src='../../static/image/homework/h_Type_0"+(j+2)+".jpg' alt='" + reverseArr[j].title + "'>";
                            div4 += "</a>";
                            div4 += "</div>";
                        }
                    }else if(obj.title === "模拟套卷"){
                        div6 += "<div class='h_Type'>";
                        div6 += "<a class='needsetstorage' data-id='" + obj.id + "' data-pt='202' href='../../model/test/hj_paperlist.html' data-target='standard'>";
                        div6 += "<img src='../../static/image/test/h_Type_07.jpg' alt='" + obj.title + "'>";
                        div6 += "</a>";
                        div6 += "</div>";
                    }else if(obj.title=="听力测试"){
                        div7 += "<div class='h_Type'>";
                        div7 += "<a class='needsetstorage' data-id='" + obj.id + "' data-pt='203' href='../../model/test/hj_paper.html?isSaved=no' data-target='standard'>";
                        div7 += "<img src='../../static/image/test/h_Type_08.jpg' alt='" + obj.title + "'>";
                        div7 += "</a>";
                        div7 += "</div>";
                    }
                }
                return "<div>" + div1 + div3 + div4 + div5 + div6 + div2 + div7 + "</div>";
            },
            hjPaperslist:function (Data,type){
                var tr = "";
                for(var i = 0;i<Data.length;i++){
                    var obj = Data[i];
                    var href = type == "work" ? "../../model/homework/hj_paper.html" : "../../model/test/hj_paper.html",
                        status = "",//布置状态
                        del = "";//删除按钮
                    if(obj.status === "2"){
                        status = "<span class='gray'>未布置</span>";
                        del = "<input id='" + obj.paperId + "' data-assignid='" + obj.id + "' class='myWork_del' type='button' value='删除'>"
                    }else{
                        status = "<span class='green'>已布置</span>";
                    }
                    tr += "<tr><td><a class='needsetstorage' data-pt='" + obj.paperType + "' data-pi='" + obj.paperId + "' data-ai='" + obj.id + "' data-st='" + obj.status + "' href='" + href + "' data-target='mylist'>" + obj.aliasName + "</a></td><td>" + status + "</td><td>" + obj.objname + "</td><td>" + obj.assignTime + "</td><td>" + del + "</td></tr>";
                }
                return "<tr><th>名称</th><th>状态</th><th>布置对象</th><th>时间</th><th>　</th></tr>" + tr;
            },
            hjQuestionLines:function (argobj){
                var Data = argobj.data,//试卷
                    theType = argobj.type,//类型
                    sub = argobj.subject,//科目
                    pt = argobj.pt,//作业类型
                    btnObj = argobj.btnobj;//按钮{analysis:查看解析,error:报错,delet:删除,choice:选入}
                var groupCode = '', isSplite = '';
                var $questionLines,publishType = theType,subject = sub;
                if(Data.length > 0){
                    $questionLines = "<ul>";
                    for(var i=0;i<Data.length;i++){
                        var obj = Data[i];
                        if("line" in obj){//行
                            if(obj.line == "start"){
                                $questionLines += $this.Html.SetHtmlLineStart(obj,publishType) ? $this.Html.SetHtmlLineStart(obj,publishType) : "";
                                $questionLines += "<ul class='line_list'>";
                            }else if(obj.line == "end"){
                                $questionLines += "</ul>";
                                $questionLines += $this.Html.SetHtmlLineEnd(obj) ? $this.Html.SetHtmlLineEnd(obj) : "";
                            }
                        }else if("group" in obj){//组
                            if(obj.group == "start"){
                                groupCode = obj.groupCode
                                isSplite = obj.isSplite
                                $questionLines += $this.Html.SetHtmlGroupStart(obj) ? $this.Html.SetHtmlGroupStart(obj) : "";
                                $questionLines += "<ul class='group_list'>";
                            }else if(obj.group == "end"){
                                $questionLines += "</ul>";
                                if(obj.isSplite == "0"){
                                    $questionLines += $this.Html.SetHtmlButton(obj,btnObj) ? $this.Html.SetHtmlButton(obj,btnObj) : "";//按钮
                                    $questionLines += $this.Html.SetHtmlAnswer(obj) ? $this.Html.SetHtmlAnswer(obj) : "";//答案
                                    $questionLines += $this.Html.SetHtmlAnalysis(obj) ? $this.Html.SetHtmlAnalysis(obj) : "";//解析
                                }
                                $questionLines += $this.Html.SetHtmlGroupEnd(obj) ? $this.Html.SetHtmlGroupEnd(obj) : "";
                            }
                        }else{//题
                            $questionLines += $this.Html.SetHtmlTitle(obj,subject) ? $this.Html.SetHtmlTitle(obj,subject) : "";//题干
                            $questionLines += $this.Html.SetHtmlOption(obj) ? $this.Html.SetHtmlOption(obj) : "";//选项
                            if(!(obj.groupCode && obj.groupCode == groupCode && isSplite == "0")){//非 不可拆分的组合题
                                $questionLines += $this.Html.SetHtmlButton(obj,btnObj) ? $this.Html.SetHtmlButton(obj,btnObj) : "";//按钮
                                $questionLines += $this.Html.SetHtmlAnswer(obj) ? $this.Html.SetHtmlAnswer(obj) : "";//答案
                                $questionLines += $this.Html.SetHtmlAnalysis(obj) ? $this.Html.SetHtmlAnalysis(obj) : "";//解析
                            }
                        }
                    }
                    $questionLines += "</ul>";
                }
                return $questionLines;
            },
            SetHtmlLineStart:function (obj,type){
                var $lineStart;
                if(obj.line == "start"){
                    $lineStart =
                        "<li" +
                        " class='line'" +
                        " data-wrapid='" + obj.lineId + "'" +
                        " data-isshow='" + obj.isShow + "'" +
                        " data-isnumber='" + obj.isNumber + "'" +
                        " data-questiontype='" + obj.questionType + "'" +
                        "><div class='line_title'"+ (obj.isShow == "0" ? " style='display:none'" : "") +">" +
                        "<h2>" +
                        "<span class='line_number'>" + (obj.isNumber ? obj.lineNumber ? obj.lineNumber : "" : "") + "</span>" +
                        "<span class='line_name'>" + (obj.lineName ? obj.lineName : "") + "</span>" +
                        "<span class='line_score'>" + (obj.scoreDef ? obj.scoreDef : "") + "</span>" +
                        "</h2>" + (obj.questionType == "999" ? "" : "<span class='line_btn'><i class='line_addQuestion'>添加题目</i></span>") +
                        "</div>";//questionType:"999"是空题行的标识
                }
                return $lineStart;
            },
            SetHtmlLineEnd:function (obj){
                var $lineEnd;
                if(obj.line == "end"){
                    $lineEnd = "</li>";
                }
                return $lineEnd;
            },
            SetHtmlGroupStart:function (obj){
                var $groupStart,title,content;
                content = obj.content ? "<div>" + obj.content.replace("材料","").replace("【","").replace("】","") + "</div>" : "";
                if(obj.isSplite == "0"){
                    title = "<h3><span class='question_number'></span>" + content + "</h3>";
                }else if(obj.isSplite == "1"){
                    title = "<strong>" + obj.questionTypeName + content + "</strong>";
                }
                if(obj.group == "start"){
                    $groupStart =
                        "<li" +
                        " class='group'" +
                        " data-wrapid='" + obj.questionId + "'" +
                        " data-issplite='" + obj.isSplite +"'" +
                        " data-groupCode='" + obj.groupCode + "'" +
                        " data-questiontype='" + obj.questionTypeId + "'" +
                        ">" +
                        title;
                }
                return $groupStart;
            },
            SetHtmlGroupEnd:function (obj){
                var $groupEnd;
                if(obj.group == "end"){
                    $groupEnd = "</li>";
                }
                return $groupEnd;
            },
            SetHtmlTitle:function (obj,sub){
                var $title,subject = sub;
                if(obj.questionId){
                    var audio = "";
                    if(subject == "03"){
                        if(obj.url){
                            audio = "<i class='audioEN'><a href='javascript:;' data-url='" + obj.url + "' title='播放音频'>点击试听音频</a></i>";
                        }
                    }
                    $title =
                        obj.isSplite == "0" && !!obj.groupCode
                            ?
                        "<li" +
                        " class='question'" +
                        " data-wrapid='" + obj.questionId + "'" +
                        " data-groupCode='" + obj.groupCode + "'" +
                        " data-selectable='" + obj.selectable +"'>" +
                        "<h4>" +
                        "<span class='question_number_liIn question_score' data-score='" + obj.score + "'></span>" + obj.questionTitle.replace(/题干/g,' ').replace("【","").replace("】","").replace(/题<\/span><span>干/g,' ') +
                        "</h4>"
                            :
                            obj.isSplite == "1"
                                ?
                            "<li" +
                            " class='question'" +
                            " data-wrapid='" + obj.questionId + "'" +
                            " data-groupCode='" + obj.groupCode + "'" +
                            " data-selectable='" + obj.selectable +"'>" +
                            "<h3>" +
                            "<span class='question_number question_score' data-score='" + obj.score + "'></span>" + obj.questionTitle.replace(/题干/g,' ').replace("【","").replace("】","").replace(/题<\/span><span>干/g,' ') +
                            "</h3>"
                                :
                            "<li" +
                            " class='question'" +
                            " data-wrapid='" + obj.questionId + "'" +
                            " data-selectable='" + obj.selectable + "'" +
                            " data-questiontype='" + obj.questionTypeId + "'" +"'>" +
                            "<h3>" +
                            "<span class='question_number question_score' data-score='" + obj.score + "'></span>" + audio + obj.questionTitle.replace(/题干/g,' ').replace("【","").replace("】","").replace(/题<\/span><span>干/g,' ') +
                            "</h3>";
                }
                return $title;
            },
            SetHtmlOption:function (obj){
                var $option;
                if(obj.optionA){
                    if(obj.optionA.indexOf("oneline") != -1){
                        $option = "<div class='options one'>";
                    }else if(obj.optionA.indexOf("twoline") != -1){
                        $option = "<div class='options two'>";
                    }else{
                        $option = "<div class='options auto'>";
                    }
                    $option += "<div class='flex'>" + obj.optionA + "</div>";
                    if(obj.optionB){
                        $option += "<div class='flex'>" + obj.optionB + "</div>";
                    }
                    if(obj.optionC){
                        $option += "<div class='flex'>" + obj.optionC + "</div>";
                    }
                    if(obj.optionD){
                        $option += "<div class='flex'>" + obj.optionD + "</div>";
                    }
                    $option += "</div>";
                }
                return $option;
            },
            SetHtmlButton:function (obj,btnObj){
                var $button;
                if(obj.questionId){
                    var btn = "";
                    if(btnObj){
                        if(btnObj.analysis){
                            btn += "<span class='options_analysis' data-id='" + obj.questionId + "'>查看解析</span>";
                        }
                        if(btnObj.error){
                            btn += "<span class='options_error' data-id='" + obj.questionId + "'>报错</span>";
                        }
                        if(btnObj.delet){
                            btn += "<span class='options_delete' data-id='" + obj.questionId + "'>删除</span>";
                        }
                        if(btnObj.choice){
                            btn += "<span class='options_choice' data-id='" + obj.questionId + "'>选入</span>";
                        }
                    }
                    $button = "<div class='buttons'><div>"+ btn + "</div></div>";
                }else if(obj.groupId){
                    var btn = "",audio = "";
                    if(btnObj){
                        if(btnObj.analysis){
                            btn += "<span class='options_analysis' data-id='" + obj.groupId + "'>查看解析</span>";
                        }
                        if(btnObj.error){
                            btn += "<span class='options_error' data-id='" + obj.groupId + "'>报错</span>";
                        }
                        if(btnObj.delet){
                            btn += "<span class='options_delete' data-id='" + obj.groupId + "'>删除</span>";
                        }
                        if(btnObj.choice){
                            btn += "<span class='options_choice' data-id='" + obj.groupId + "'>选入</span>";
                        }
                    }
                    $button = "<div class='buttons'><div>" + btn + "</div></div>";
                }
                return $button;
            },
            SetHtmlAnswer:function (obj){
                var $answer;
                if(obj.labels && obj.labels.length != 0){
                    var Labels = obj.labels;
                    for(var i=0;i<Labels.length;i++){
                        if(Labels[i].questionType == "03" && Labels[i].content){
                            $answer = "<div class='answer'>" + Labels[i].content + "</div>";
                            break;
                        }
                    }
                }
                return $answer;
            },
            SetHtmlAnalysis:function (obj){
                var $analysis = "";
                if(obj.labels && obj.labels.length != 0){
                    var Labels = obj.labels;
                    for(var i=0;i<Labels.length;i++){
                        if(Labels[i].questionType != "03" && Labels[i].questionType != "07" && Labels[i].content){
                            $analysis += "<div class='analysis'>" + Labels[i].content + "</div>";
                        }
                    }
                }
                return $analysis;
            },
            setClasses:function (data) {
                var $classes = "<ul class='obj_type_con set_classes'>";
                for(var i = 0;i<data.length;i++){
                    $classes += "<li data-num='" + data[i].studNum + "' data-id='" + data[i].classId + "'>" + data[i].className + "</li>";
                }
                $classes += "</ul>";
                return $classes;
            },
            setIndividual:function (data) {
                var user = "<div>",
                    userClass = "<ul>";
                for(var i = 0;i<data.length;i++) {
                    var obj = data[i];
                    userClass += "<li data-id='" + obj.calssId + "'>" + obj.calssName + "</li>";
                    if(i == 0){
                        user += "<ol class='user'>";
                    }else{
                        user += "<ol class='user' style='display: none'>";
                    }
                    var iLength = obj.studentInfos.length;
                    if(iLength == 0){
                        user += "<li style='width: 100%;text-align: center;color: #999;'>暂无人员，请到班级管理页面进行设置</li>";
                    }else{
                        for(var j = 0;j<obj.studentInfos.length;j++) {
                            user += "<li><span data-id='" + obj.studentInfos[j].userId + "'>" + obj.studentInfos[j].userName + "</span></li>";

                        }
                    }
                    user += "</ol>";
                }
                user += "</div>";
                userClass += "</ul>";
                var $individual = "<div class='obj_type_con set_user' style='display: none'>" + userClass + user + "</div>";
                return $individual;
            },
            setGroup:function (data) {
                var user = "<div>",
                    userClass = "<ul>";
                for(var i = 0;i<data.length;i++) {
                    var obj = data[i];
                    userClass += "<li data-id='" + obj.calssId + "'>" + obj.calssName + "</li>";
                    if(i == 0){
                        user += "<ol class='user gr'>";
                    }else{
                        user += "<ol class='user gr' style='display: none'>";
                    }
                    var iLength = obj.studentInfos.length;
                    if(iLength == 0){
                        user += "<li style='width: 100%;text-align: center;color: #999;'>暂无小组，请到班级管理页面进行设置</li>";
                    }else{
                        for(var j = 0;j<obj.studentInfos.length;j++) {
                            user += "<li><span data-id='" + obj.studentInfos[j].userId + "'>" + obj.studentInfos[j].userName + "</span></li>";
                        }
                    }
                    user += "</ol>";
                }
                user += "</div>";
                userClass += "</ul>";
                var $group = "<div class='obj_type_con set_group' style='display: none'>" + userClass + user + "</div>";
                return $group;
            },
            setTitle:function (paperType) {
                var $title;
                switch (paperType){
                    case "101":
                        $title = "布置作业-课时练";
                        break;
                    case "111":
                        $title = "布置作业-我的作业-课时练";
                        break;
                    case "102":
                        $title = "布置作业-及格线";
                        break;
                    case "112":
                        $title = "布置作业-我的作业-及格线";
                        break;
                    case "103":
                        $title = "布置作业-考A吧";
                        break;
                    case "113":
                        $title = "布置作业-我的作业-考A吧";
                        break;
                    case "104":
                        $title = "布置作业-冲A+";
                        break;
                    case "114":
                        $title = "布置作业-我的作业-冲A+";
                        break;
                    case "105":
                        $title = "布置作业-随堂检测";
                        break;
                    case "115":
                        $title = "布置作业-我的作业-随堂检测";
                        break;
                    case "116":
                        $title = "布置作业-自主组卷";
                        break;
                    case "201":
                        $title = "布置测试-课时练";
                        break;
                    case "211":
                        $title = "布置测试-我的测试-课时练";
                        break;
                    case "202":
                        $title = "布置测试-模拟套卷";
                        break;
                    case "212":
                        $title = "布置测试-我的测试-模拟套卷";
                        break;
                    case "203":
                        $title = "布置测试-听力测试";
                        break;
                    case "213":
                        $title = "布置测试-我的测试-听力测试";
                        break;
                    case "216":
                        $title = "布置测试-自主组卷";
                        break;
                    default:
                        $title = "题目详情";
                }
                return $title;
            },
            setDefaultPaperName:function (paperType) {
                var $paperName = "";
                switch (thisPt){
                    case "101":
                        $paperName = "课时练";
                        break;
                    case "102":
                        $paperName = "及格线";
                        break;
                    case "103":
                        $paperName = "考A吧";
                        break;
                    case "104":
                        $paperName = "冲A+";
                        break;
                    case "105":
                        $paperName = "随堂检测";
                        break;
                    case "201":
                        $paperName = "课时练";
                        break;
                    case "202":
                        $paperName = "模拟套卷";
                        break;
                    case "203":
                        $paperName = "听力测试";
                        break;
                    default:
                        $paperName = "我的作业、测试";
                }
                return $paperName;
            },
            hjSimulatepapers:function (data) {
                var $paperslist = "";
                for(var i = 0;i<data.length;i++){
                    $paperslist += "<li class='paperTitle'><a class='needsetstorage' href='../../model/test/hj_paper.html?isSaved=no' data-pi='" + data[i].paperId + "'title='" + data[i].paperName + "' data-target='mylist'><nobr>" + data[i].paperName + "</nobr></a></li>";
                }
                return $paperslist;
            }
        };
        //基础dom处理逻辑
        this.dom = {
            addOn:function (node){
                var nodeArray = node ? typeof node === "object" && (node.constructor == HTMLCollection || node.constructor == Array) ? node : [node] : [];
                for(var i = 0;i<nodeArray.length;i++){
                    if(nodeArray[i].hasAttribute("class")){
                        var classStr = nodeArray[i].getAttribute("class");
                        if(classStr != "on"){
                            var strArray = classStr.split(" ");
                            if(strArray.indexOf("on") == -1){
                                nodeArray[i].setAttribute("class",classStr + " on");
                            }
                        }
                    }else{
                        nodeArray[i].setAttribute("class","on");
                    }
                }
            },
            clearOn:function (node){
                var nodeArray = node ? typeof node === "object" && (node.constructor == HTMLCollection || node.constructor == Array) ? node : [node] : [];
                for(var i = 0;i<nodeArray.length;i++){
                    if(nodeArray[i].hasAttribute("class")){
                        var classStr = nodeArray[i].getAttribute("class");
                        if(classStr == "on"){
                            nodeArray[i].removeAttribute("class");
                        }else{
                            var strArray = classStr.split(" ");
                            var newClassStr = null;
                            if(classStr.indexOf("on") != -1){
                                for(var j = 0;j<strArray.length;j++){
                                    if(strArray[j] != "on"){
                                        if(!newClassStr){
                                            newClassStr = strArray[j];
                                        }else{
                                            newClassStr += " " + strArray[j];
                                        }
                                    }
                                }
                                nodeArray[i].setAttribute("class",newClassStr);
                            }
                        }
                    }
                }
            },
            nextSiblings:function (node){
                var $siblings = [];
                getSibling(node);
                function getSibling(n){
                    var next = n.nextSibling;
                    if(next){
                        $siblings.push(next);
                        getSibling(next);
                    }
                }
                return $siblings;
            },
            remove:function (node){
                var nodeArray = node ? typeof node === "object" && (node.constructor == HTMLCollection || node.constructor == Array) ? node : [node] : [];
                for(var i = 0;i<nodeArray.length;i++){
                    nodeArray[i].parentNode.removeChild(nodeArray[i]);
                }
            }
        };
        //事件处理逻辑
        this.event = {
            clickNeedsetstorage:function (type){
                var storageDataNode = $this.class("needsetstorage");
                for (var i = 0;i<storageDataNode.length;i++){
                    storageDataNode[i].onclick = function (){
                        var keys = this.attributes;
                        for(var j = 0;j<keys.length;j++){
                            var key = keys.item(j).name,
                                value = keys.item(j).value;
                            if(key.indexOf("data-") != -1){
                                key = key.replace("data-","");
                                $this.storage.setLocal(type,key,value);
                            }
                        }
                    }
                }
            },
            clickChapter:function (type,data){//章节单击事件
                var _homeworkChapterLi = $this.class("hj_Chapter")[0].getElementsByTagName("li");
                for(var ai = 0;ai<_homeworkChapterLi.length;ai++){
                    _homeworkChapterLi[ai].onclick = function (){
                        //删除旧的选中状态
                        var _thisCloumn = this.parentNode.getElementsByTagName("li");
                        $this.dom.clearOn(_thisCloumn);
                        //删除旧的子栏目
                        var _lastCloumnes = [];
                        nextSbl(this.parentNode.parentNode.parentNode);
                        function nextSbl(node){
                            var _lastCloumn = node.nextSibling;
                            if(_lastCloumn){
                                _lastCloumnes.push(_lastCloumn);
                                nextSbl(_lastCloumn);
                            }
                        }
                        $this.dom.remove(_lastCloumnes);
                        //更新状态
                        this.setAttribute("class","on");
                        //添加新子栏目
                        var _active = this.getAttribute("id"),
                            _thisKt = this.getAttribute("data-kt");
                        newDl(_active);
                        function newDl(_id){
                            var firstId = null;
                            var newdl = "<dl ";
                            for(var aia = 0;aia<data.length;aia++){
                                if(data[aia].parentId == _id){
                                    if(newdl.indexOf("level_") == -1){
                                        newdl += " class = 'level_" + data[aia].level + "'>";
                                        newdl += "<dt>" + data[aia].levelName + "：</dt>";
                                        newdl += "<dd><ul>";
                                    }
                                    if(newdl.indexOf("class='on'") == -1){
                                        newdl += "<li class='on' ";
                                    }else{
                                        newdl += "<li ";
                                    }
                                    var _knowledgeType2 = data[aia].knowledgeType ? data[aia].knowledgeType : "";
                                    newdl += "id='" + data[aia].knowledgeId + "' data-kt='" + _knowledgeType2 + "' title='" + data[aia].name + " " + data[aia].alias + "'>" + data[aia].name + "</li>";
                                    if(!firstId){
                                        firstId = data[aia].knowledgeId;
                                    }
                                }
                            }
                            newdl += "</ul></dd></dl>";
                            if(firstId){
                                var _chapter = $this.class("hj_Chapter")[0];
                                _chapter.innerHTML += newdl;
                                newDl(firstId);
                            }else{
                                $this.event.clickChapter(type,data);
                            }
                        }
                        //更新storage,thisActive
                        var _liOn = [],
                            _liWrap = $this.class("hj_Chapter")[0].getElementsByTagName("li");
                        for(var aib = 0;aib<_liWrap.length;aib++){
                            var _liClass = _liWrap[aib].getAttribute("class");
                            if(_liClass){
                                if(_liClass.indexOf("on") != -1){
                                    _liOn.push(_liWrap[aib]);
                                }
                            }
                        }
                        if(_liOn.length > 0){
                            _active = _liOn[_liOn.length - 1].getAttribute("id");
                            _thisKt = _liOn[_liOn.length - 1].getAttribute("data-kt");
                        }
                        $this.storage.setLocal(type,"active",_active);
                        $this.storage.setLocal(type,"kt",_thisKt);
                        thisActive = _active;
                        //重载
                        jobTypes();//类型
                        jobPaperslist();//我的列表
                        //更新历史记录
                        $this.ajax.hjSavelastcode(true,{menuId:thisMenuId,lastCode:_active},sSavelastcode,eSavelastcode);
                        function sSavelastcode(){
                            console.log("章节历史记录更新成功！");
                        }
                        function eSavelastcode(){
                            console.log("章节历史记录更新失败！");
                        }
                    };
                }
            },
            clickSeeanalysis:function (agent){
                $(agent).on("click",".options_analysis",function () {
                    var thisClass = this.getAttribute("class");
                    var strArr = thisClass.split(" "),
                        nodeArr = [];
                    nodeArr.push(this);
                    nodeArr.push(this.parentNode.parentNode.parentNode);
                    var siblings = $this.dom.nextSiblings(this.parentNode.parentNode);
                    nodeArr = nodeArr.concat(siblings);
                    if(strArr.indexOf("on") != -1){
                        $this.dom.clearOn(nodeArr);
                        this.innerText = "查看解析";
                    }else{
                        $this.dom.addOn(nodeArr);
                        this.innerText = "收回解析";
                    }
                });
            },
            clickOptIn:function (argobj) {
                var orderLineNumber = argobj.orderLineNumber,
                    type = argobj.type,
                    subject = argobj.subject,
                    codeArr = argobj.codeArr;
                var newlistarr = [],//加入的所有题目的id组：用于判断是否选入
                    newlistobj = {};//加入的题目对象：键为题型，值为该题型对应的题目组(0键对应所有题型)
                $this.storage.setLocal(type,"newlistarr","");//清空选入id缓存
                $this.storage.setLocal(type,"newlistobj","");//清空选入题目缓存
                var condition;//可拆分组合题的材料状态：1:绝对不存在材料；2:试卷中存在材料；3:选入中存在材料
                var thisGroupCode;//所有题目的组别状态
                $(".addLineQuestion_middle_questions").on("click",".options_choice",function () {
                    var _this = this,
                        questionTypeCode = $(".addLineQuestion_questiontype span.on").attr("data-code"),
                        questionTypeName = $(".addLineQuestion_questiontype span.on").text(),
                        optId = this.getAttribute("data-id"),
                        paperData = $this.storage.getLocal(type,"paperdata"),
                        currentlist = $this.storage.getLocal(type,"currentlist");
                    currentlist = currentlist ? JSON.parse(currentlist) : [];
                    paperData = paperData ? JSON.parse(paperData) : [];
                    //事件中止的情况
                    if(!questionTypeCode || !optId || currentlist.length == 0) return;//如果题型、id或源数据有异常
                    for(var i = 0;i<paperData.length;i++){
                        if(paperData[i].questionId && paperData[i].questionId == optId){//已有该题在试卷中
                            $this.warn("该题目已存在！");
                            return;
                        }
                    }
                    //可拆分的组合题在试卷和选入列表中的情况
                    condition = null;//清空
                    var tgroupCode = '',tisSplite = '';
                    for(var i = 0;i<currentlist.length;i++) {
                        if(currentlist[i].group&&currentlist[i].group=='start') {
                            tgroupCode = currentlist[i].groupCode;
                            tisSplite = currentlist[i].isSplite;
                        }
                        if (currentlist[i].questionId == optId) {
                            thisGroupCode = currentlist[i].groupCode;//当前组别
                            if(currentlist[i].groupCode &&currentlist[i].groupCode==tgroupCode && tisSplite == "1"){
                                condition = 1;//是可拆分的组合题后，↓再判断子条件的值↓
                                for(var j = 0;j<paperData.length;j++){
                                    if(paperData[j].groupCode && paperData[j].groupCode == thisGroupCode){
                                        condition = 2;
                                        break;
                                    }
                                }
                                if(condition != 2){//2和3不会同时存在
                                    for(var n in newlistobj){// n:string
                                        var nbreak = false;
                                        for(var k = 0;k<newlistobj[n].length;k++){
                                            if(newlistobj[n][k].groupCode && newlistobj[n][k].groupCode == thisGroupCode){
                                                condition = 3;
                                                nbreak = true;
                                                break;
                                            }
                                        }
                                        if(nbreak){
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //正常
                    $(this).hasClass("on") ? optout() : optin();
                    var totalNum = newlistarr.length;//选入题目统计
                    totalNum == 0 ? $this.class("addLineQuestion_bottom_num")[0].style.display = "none" : $this.class("addLineQuestion_bottom_num")[0].style.display = "block";
                    $this.class("addLineQuestion_bottom_total")[0].innerText = totalNum;
                    var optinType = $this.storage.getLocal(type,"optintype");//选入题目精细统计（一）for empty
                    if(optinType == "empty"){
                        setNumlist();
                    }else if(optinType == "line"){
                        if(codeArr.length > 1){//至少2种题型
                            setNumlist();
                        }
                    }
                    function setNumlist() {
                        var numlist = null,
                            theQuestionType = $this.storage.getLocal(type,"questiontype");
                        theQuestionType = theQuestionType ? JSON.parse(theQuestionType) : [];
                        for(var i in newlistobj){// i:string
                            numlist += "<li>";
                            for(var j = 0;j<theQuestionType.length;j++){
                                if(theQuestionType[j].code == i){
                                    numlist += theQuestionType[j].label;
                                }
                            }
                            var iLength = 0,//题型下的小题总数，默认为0
                                iGroupLength = 0;//题型下的组合题小题总数，默认为0
                            for(var j = 0;j<newlistobj[i].length;j++){
                                if(newlistobj[i][j].group && newlistobj[i][j].group == "start"){
                                    if(newlistobj[i][j].isSplite == "0"){
                                        getNext(j);
                                        function getNext(num) {
                                            if(!(newlistobj[i][num+1].group && newlistobj[i][num+1].group == "end")){
                                                iGroupLength++;
                                                getNext(num+1);
                                            }
                                        }
                                    }else{
                                        iLength--;
                                    }
                                }else{
                                    iLength++;
                                }
                            }
                            iLength = iLength - iGroupLength;
                            numlist += "(<i>" + iLength + "</i>)";
                            numlist += "</li>";
                        }
                        if(numlist){
                            numlist = "<ul>" + numlist + "</ul>";
                            $this.class("addLineQuestion_bottom_numlist")[0].style.display = "block";
                            $this.class("addLineQuestion_bottom_numlist")[0].innerHTML = numlist.replace("null","");
                        }else{
                            $this.class("addLineQuestion_bottom_numlist")[0].style.display = "none";
                        }
                    }
                    var doneBol = false;//按钮状态控制
                    for(var iii in newlistobj){
                        doneBol = true;
                        break;
                    }
                    doneBol ? $(".addLineQuestion_bottom_done").removeClass("off").text("完成") : $(".addLineQuestion_bottom_done").addClass("off").text("请选择题目");
                    function optin() {
                        newlistarr.push(optId);
                        $this.storage.setLocal(type,"newlistarr",JSON.stringify(newlistarr));//缓存选入后的所有题目id
                        var thisQuestionData = [];// length=1:单题 ; length>1:组合题
                        var tgroupCode = '',tisSplite = '';
                        for(var i = 0;i<currentlist.length;i++){
                            if(currentlist[i].group&&currentlist[i].group=='start') {
                                tgroupCode = currentlist[i].groupCode;
                                tisSplite = currentlist[i].isSplite;
                            }
                            if(currentlist[i].questionId == optId){
                                if(currentlist[i].group == "start" && currentlist[i].isSplite == "0"){//不可拆分组合
                                    thisQuestionData.push(currentlist[i]);
                                    accumulationGroup(i);
                                    break;
                                    function accumulationGroup(num) {
                                        thisQuestionData.push(currentlist[num+1]);
                                        if(!(currentlist[num+1].group && currentlist[num+1].group == "end")){
                                            accumulationGroup(num+1);
                                        }
                                    }
                                }else if(currentlist[i].groupCode && currentlist[i].groupCode == tgroupCode&& tisSplite == "1"){//可拆分组合
                                    if(condition == 1){//绝对不存在材料
                                        accumulationGroupStart(i);
                                        thisQuestionData.push(currentlist[i]);
                                        accumulationGroupEnd(i);
                                    }else if(condition == 2){//试卷存在材料
                                        thisQuestionData.push(currentlist[i]);
                                    }else if(condition == 3){//选入存在材料
                                        thisQuestionData.push(currentlist[i]);
                                    }
                                    break;
                                    function accumulationGroupStart(num) {
                                        if(currentlist[num-1].group && currentlist[num-1].group == "start"){
                                            thisQuestionData.push(currentlist[num-1]);
                                        }else{
                                            accumulationGroupStart(num-1);
                                        }
                                    }
                                    function accumulationGroupEnd(num) {
                                        if(currentlist[num+1].group && currentlist[num+1].group == "end"){
                                            thisQuestionData.push(currentlist[num+1]);
                                        }else{
                                            accumulationGroupEnd(num+1);
                                        }
                                    }
                                }else{//单题
                                    thisQuestionData.push(currentlist[i]);
                                    break;
                                }
                            }
                        }
                        questionTypeCode == "0" ? inalltypes() : inonetype();
                        function inalltypes() {
                            var questionTypeCode0 = thisQuestionData[0].questionTypeId;
                            if(questionTypeCode0 in newlistobj){
                                if(condition == 1){//可拆组合A
                                    for(var a = 0;a<thisQuestionData.length;a++){
                                        newlistobj[questionTypeCode0].push(thisQuestionData[a]);
                                    }
                                }else if(condition == 2){//可拆组合B
                                    newlistobj[questionTypeCode0].push(thisQuestionData[0]);
                                }else if(condition == 3){//可拆组合C
                                    for(var a = 0;a<newlistobj[questionTypeCode0].length;a++){
                                        if(newlistobj[questionTypeCode0][a].groupCode == thisGroupCode){
                                            foundGroupEnd(a);
                                            function foundGroupEnd(num) {
                                                if(newlistobj[questionTypeCode0][num+1].group && newlistobj[questionTypeCode0][num+1].group == "end"){
                                                    newlistobj[questionTypeCode0].splice(num+1,0,thisQuestionData[0]);
                                                }else{
                                                    foundGroupEnd(num+1);
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }else{//不可拆组合和单题
                                    for(var a = 0;a<thisQuestionData.length;a++){
                                        newlistobj[questionTypeCode0].push(thisQuestionData[a]);
                                    }
                                }
                            }else{
                                newlistobj[questionTypeCode0] = [];
                                for(var a = 0;a<thisQuestionData.length;a++){
                                    newlistobj[questionTypeCode0].push(thisQuestionData[a]);
                                }
                            }
                        }
                        function inonetype() {
                            if(questionTypeCode in newlistobj){
                                if(condition == 1){//可拆组合A
                                    for(var a = 0;a<thisQuestionData.length;a++){
                                        newlistobj[questionTypeCode].push(thisQuestionData[a]);
                                    }
                                }else if(condition == 2){//可拆组合B
                                    newlistobj[questionTypeCode].push(thisQuestionData[0]);
                                }else if(condition == 3){//可拆组合C
                                    for(var a = 0;a<newlistobj[questionTypeCode].length;a++){
                                        if(newlistobj[questionTypeCode][a].groupCode == thisGroupCode){
                                            foundGroupEnd(a);
                                            function foundGroupEnd(num) {
                                                if(newlistobj[questionTypeCode][num+1].group && newlistobj[questionTypeCode][num+1].group == "end"){
                                                    newlistobj[questionTypeCode].splice(num+1,0,thisQuestionData[0]);
                                                }else{
                                                    foundGroupEnd(num+1);
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }else{//不可拆组合和单题
                                    for(var a = 0;a<thisQuestionData.length;a++){
                                        newlistobj[questionTypeCode].push(thisQuestionData[a]);
                                    }
                                }
                            }else{
                                newlistobj[questionTypeCode] = [];
                                for(var a = 0;a<thisQuestionData.length;a++){
                                    newlistobj[questionTypeCode].push(thisQuestionData[a]);
                                }
                            }
                        }
                        $this.storage.setLocal(type,"newlistobj",JSON.stringify(newlistobj));//缓存选入后的所有题目
                        $(_this).addClass("on").text("取消");
                    }
                    function optout() {
                        for(var i = 0;i<newlistarr.length;i++){
                            if(newlistarr[i] == optId){
                                newlistarr.splice(i,1);
                                break;
                            }
                        }
                        $this.storage.setLocal(type,"newlistarr",JSON.stringify(newlistarr));//缓存选出后的所有题目id
                        questionTypeCode == "0" ? outalltypes() : outonetype();
                        function outalltypes() {
                            var ibreak = false;
                            for(var i in newlistobj){// i: string
                                for(var j = 0;j<newlistobj[i].length;j++){
                                    var iobj = newlistobj[i];
                                    if(iobj[j].questionId == optId){
                                        if(iobj.length == 1){
                                            delete newlistobj[i];
                                        }else{
                                            if(thisGroupCode){//组合题
                                                if(iobj[j].isSplite == "0"){//不可拆
                                                    var deleteNum = 1;
                                                    deleteToEnd(j);
                                                    function deleteToEnd(num) {
                                                        deleteNum++;
                                                        if(!(iobj[num+1].group && iobj[num+1].group == "end")){
                                                            deleteToEnd(num+1);
                                                        }
                                                    }
                                                    if(iobj.length == deleteNum){
                                                        delete newlistobj[i];
                                                    }else{
                                                        newlistobj[i].splice(j,deleteNum);
                                                    }
                                                }else if(iobj[j].isSplite == "1"){//可拆
                                                    if(iobj[j-1].group && iobj[j+1].group && iobj[j-1].group == "start" && iobj[j+1].group == "end"){//前是开始，后是结束：只剩1个小题
                                                        if(iobj.length == 3){//开始+小题+结束 = 3个
                                                            delete newlistobj[i];
                                                        }else{
                                                            newlistobj[i].splice(j-1,3);
                                                        }
                                                    }else{
                                                        newlistobj[i].splice(j,1);
                                                    }
                                                }
                                            }else{//单题
                                                newlistobj[i].splice(j,1);
                                            }
                                        }
                                        ibreak = true;
                                        break;
                                    }
                                }
                                if(ibreak){
                                    break;
                                }
                            }
                        }
                        function outonetype() {
                            var Arr = newlistobj[questionTypeCode];
                            for(var i = 0;i<Arr.length;i++){
                                if(Arr[i].questionId == optId){
                                    if(Arr.length == 1){
                                        delete newlistobj[questionTypeCode];
                                    }else{
                                        if(thisGroupCode){//组合题
                                            if(Arr[i].isSplite == "0"){//不可拆
                                                var deleteNum = 1;
                                                deleteToEnd(i);
                                                function deleteToEnd(num) {
                                                    deleteNum++;
                                                    if(!(Arr[num+1].group && Arr[num+1].group == "end")){
                                                        deleteToEnd(num+1);
                                                    }
                                                }
                                                if(Arr.length == deleteNum){
                                                    delete newlistobj[questionTypeCode];
                                                }else{
                                                    newlistobj[questionTypeCode].splice(i,deleteNum);
                                                }
                                            }else if(Arr[i].isSplite == "1"){//可拆
                                                if(Arr[i-1].group && Arr[i+1].group && Arr[i-1].group == "start" && Arr[i+1].group == "end"){
                                                    if(Arr.length == 3){//开始+小题+结束 = 3个
                                                        delete newlistobj[questionTypeCode];
                                                    }else{
                                                        newlistobj[questionTypeCode].splice(i-1,3);
                                                    }
                                                }else{
                                                    newlistobj[questionTypeCode].splice(i,1);
                                                }
                                            }
                                        }else{//单题
                                            newlistobj[questionTypeCode].splice(i,1);
                                        }
                                    }
                                }
                            }
                        }
                        $this.storage.setLocal(type,"newlistobj",JSON.stringify(newlistobj));//缓存选出后的所有题目
                        $(_this).removeClass("on").text("选入");
                    }
                });
            },
            clickOptInDone:function (argobj) {
                var orderLineNumber = argobj.orderLineNumber,
                    type = argobj.type,
                    subject = argobj.subject,
                    lineId = argobj.lineId;
                var optInType = $this.storage.getLocal(type,"optintype");
                $(".addLineQuestion_bottom").on("click",".addLineQuestion_bottom_done",function () {
                    if(this.getAttribute("class").indexOf("off") == -1){
                        var isclick = this.getAttribute("isclick");
                        if(isclick) return;
                        this.setAttribute("isclick","true");
                    }else{
                        return;//如果状态为off 事件中止
                    }
                    var paperData = $this.storage.getLocal(type,"paperdata"),
                        newlistobj = $this.storage.getLocal(type,"newlistobj");
                    paperData = paperData ? JSON.parse(paperData) : [];
                    newlistobj = newlistobj ? JSON.parse(newlistobj) : [];
                    var newQuesIdArr = [],//新入题目的id组
                        newPaperData = [];//新试卷
                    if(optInType == "line"){//hasQuestion
                        //新加入的数据
                        var newQuesArr = [];//取出题组
                        for(var i in newlistobj){// i:string
                            for(var j = 0;j<newlistobj[i].length;j++){
                                newQuesArr.push(newlistobj[i][j]);
                                newQuesIdArr.push(newlistobj[i][j].questionId);
                            }
                        }
                        //paper数据
                        if(paperData){
                            for(var i = 0;i<paperData.length;i++){
                                if(paperData[i].lineId && paperData[i].lineId == lineId){
                                    var inLineNum = 0,//行内题目数
                                        isScoreBatch = paperData[i].isScoreBatch,//赋分类型
                                        baseScore = !paperData[i+1].group ? paperData[i+1].score ? paperData[i+1].score : null : paperData[i+2] ? paperData[i+2].score ? paperData[i+2].score : null : null;//每小题分数
                                    accumulation(i);
                                    function accumulation(num) {
                                        if(!(paperData[num+1].line && paperData[num+1].line == "end")){
                                            inLineNum++;
                                            accumulation(num+1);
                                        }
                                    }
                                    newQuesArr.reverse();
                                    for(var j = 0;j<newQuesArr.length;j++){
                                        if(type == "test" && isScoreBatch){
                                            newQuesArr[j].score = baseScore;
                                        }
                                        paperData.splice(i+inLineNum+1,0,newQuesArr[j]);
                                    }
                                    break;
                                }
                            }
                        }
                        newPaperData = paperData;
                    }else if(optInType == "empty"){//empty
                        //映射题型
                        if(subject == "03"){
                            var mappedArr = [13,30,31,32,33],
                                mappedQuesArr = [],
                                ismapped = false;//选入的题目是否存在映射的题型
                            for(var i in newlistobj){// i:string
                                if(i == "13" || i == "30" || i == "31" || i == "32" || i == "33"){
                                    mappedQuesArr = mappedQuesArr.concat(newlistobj[i]);
                                    ismapped = true;
                                }
                            }
                            if(ismapped){
                                for(var i = 0;i<mappedArr.length;i++){
                                    if(mappedArr[i] in newlistobj){
                                        delete newlistobj[mappedArr[i]];
                                    }
                                }
                                newlistobj["13,30,31,32,33"] = mappedQuesArr;
                            }
                        }
                        //映射结束
                        var isNumber = $this.storage.getLocal(type,"islinenumber"),
                            questiontypemapped = $this.storage.getLocal(type,"questiontypemapped");
                        questiontypemapped = questiontypemapped ? JSON.parse(questiontypemapped) : [];
                        isNumber = isNumber ? isNumber == "true" ? true : false : false;
                        if(type == "work"){
                            if(subject == "01" || subject == "03" || subject == "05" || subject == "09"){
                                organizationForShowLine();
                            }else{
                                organizationForHideLine();
                            }
                        }else if(type == "test"){
                            isNumber = true;
                            organizationForShowLine();
                        }
                        function organizationForShowLine() {
                            var iNum = 1;
                            for(var i in newlistobj){// i:string
                                var lineName = null;
                                for(var j = 0;j<questiontypemapped.length;j++){
                                    if(questiontypemapped[j].code == i){
                                        lineName = questiontypemapped[j].label;
                                        lineId = questiontypemapped[j].lineId;
                                        break;
                                    }
                                }
                                var lineNum = isNumber ? subject == "03" ? $this.toRoman(iNum) : $this.toChinese(iNum) : "",//行号
                                    lineName = isNumber ? subject == "03" ? "." + lineName : "、" + lineName : lineName;//行名
                                var lineStart = {},
                                    lineEnd = {line:"end"};
                                lineStart.isNumber = isNumber;
                                lineStart.isShow = "1";
                                lineStart.line = "start";
                                lineStart.lineId = lineId;
                                lineStart.lineName = lineName;
                                lineStart.lineNumber = lineNum;
                                lineStart.lnOrder = 0;
                                lineStart.questionType = i;
                                lineStart.scoreDef = null;
                                lineStart.showOrder = iNum-1;
                                lineStart.isScoreBatch = $this.Data.isScoreBatch(type,subject,i,lineId,lineName);
                                lineStart.isScoreBtn = $this.Data.isScoreBtn(type,subject,i,lineId,lineName);
                                iNum++;
                                newPaperData.push(lineStart);//行头
                                for(var j = 0;j<newlistobj[i].length;j++){
                                    newPaperData.push(newlistobj[i][j]);//行内题目
                                    newQuesIdArr.push(newlistobj[i][j].questionId);
                                }
                                newPaperData.push(lineEnd);//行尾
                            }
                        }
                        function organizationForHideLine() {
                            var lineStart = {},
                                lineEnd = {line:"end"};
                            lineStart.isNumber = false;
                            lineStart.isShow = "0";
                            lineStart.line = "start";
                            lineStart.lineId = "new" + new Date().getDate() + Math.random().toString().replace(".","");
                            lineStart.lineName = "默认题行";
                            lineStart.lineNumber = null;
                            lineStart.lnOrder = 0;
                            lineStart.questionType = "01";
                            lineStart.scoreDef = null;
                            lineStart.showOrder = 0;
                            lineStart.isScoreBatch = false;
                            lineStart.isScoreBtn = false;
                            newPaperData.push(lineStart);//行头
                            for(var i in newlistobj){// i:string
                                for(var j = 0;j<newlistobj[i].length;j++){
                                    newPaperData.push(newlistobj[i][j]);//行内题目
                                    newQuesIdArr.push(newlistobj[i][j].questionId);
                                }
                            }
                            newPaperData.push(lineEnd);//行尾
                        }
                    }
                    $this.storage.setLocal(type,"paperdata",JSON.stringify(newPaperData));//更新试卷缓存
                    $this.Data.hjPaperData.reorder(type);//数据排序
                    if(type == "test"){//测试
                        $this.Data.hjPaperData.modify.allLineScoreDef(type);//更新数据行分
                        $this.event.modifyPaperScore(type);//更新试卷总分
                    }
                    $this.event.resetPaperHtml({orderLineNumber:orderLineNumber,type:type,subject:subject});//刷新html
                    $this.storage.setLocal(type,"currentlist","");//清空缓存的当前分页数据
                    $this.storage.setLocal(type,"newlistarr","");//清空缓存的当前选入数据
                    $this.storage.setLocal(type,"newlistobj","");//清空缓存的当前选入数据
                    $this.storage.setLocal(type,"optintype","");//清空缓存的当前选入入口数据
                    $(".addLineQuestion").fadeOut(200);//关闭窗口
                    $this.event.setNewQuesState(newQuesIdArr);//添加题目的状态，以及状态取消事件
                });
            },
            setLineType:function (type) {
                var lineType = true,//普通可显示题行 false:默认不显题行
                    lineNum = 0,//行数
                    paperData = $this.storage.getLocal(type,"paperdata");
                paperData = paperData ? JSON.parse(paperData) : [];
                for(var i = 0;i<paperData.length;i++){
                    if(paperData[i].line && paperData[i].line == "start"){
                        lineNum++;
                    }
                }
                if(lineNum == 1){
                    for(var i = 0;i<paperData.length;i++){
                        if(paperData[i].line && paperData[i].line == "start" && paperData[i].isShow == "0"){
                            lineType = false;
                            var defaultLineTypeObj = {questionType:paperData[i].questionType,lineId:paperData[i].lineId};//如果是不显的默认题行：缓存题行数据
                            $this.storage.setLocal(type,"defaultlinetypeobj",JSON.stringify(defaultLineTypeObj));
                        }
                    }
                }
                lineType ? $this.storage.setLocal(type,"linetype","true") : $this.storage.setLocal(type,"linetype","false");
            },
            setIsLineNumber:function (argobj) {
                var orderLineNumber = argobj.orderLineNumber,
                    type = argobj.type,
                    subject = argobj.subject;
                var islinenumber = false,
                    paperData = $this.storage.getLocal(type,"paperdata");
                paperData = paperData ? JSON.parse(paperData) : [];
                paperData.length == 0 ? newPaper() : toPaper();
                function newPaper() {//自主组卷
                    if(type == "work"){
                        subject == "01" || subject == "03" || subject == "05" || subject == "09" ? $this.storage.setLocal(type,"islinenumber","true") : $this.storage.setLocal(type,"islinenumber","false");
                    }else if(type == "test"){
                        $this.storage.setLocal(type,"islinenumber","true");
                    }
                }
                function toPaper() {//课时练等有内容卷
                    for(var i = 0;i<paperData.length;i++){
                        if(paperData[i].line && paperData[i].line == "start" && paperData[i].isNumber){
                            islinenumber = true;
                            break;
                        }
                    }
                    islinenumber ? $this.storage.setLocal(type,"islinenumber","true") : $this.storage.setLocal(type,"islinenumber","false");
                }
            },
            setOrderNumber:function (argobj) {
                var orderLineNumber = argobj.orderLineNumber,//是否排列行号
                    type = argobj.type,
                    subject = argobj.subject;
                //题号
                var questionNumber = $this.class("question_number");
                for(var j = 0;j<questionNumber.length;j++){
                    questionNumber[j].innerHTML = (j+1) + "、";
                }
                //行号
                if(orderLineNumber){
                    var num = 0,
                        lineNumber = $this.class("line_number");
                    for(var i = 0;i<lineNumber.length;i++){
                        if(lineNumber[i].parentNode.parentNode.parentNode.getAttribute("data-isnumber") == "true"){
                            num++;
                            //修改数据题号
                            $this.Data.hjPaperData.modify.lineNumber(type,subject);
                            //更新html
                            lineNumber[i].innerHTML = subject == "03" ? $this.toRoman(num) : $this.toChinese(num);
                        }
                    }
                }
            },
            deleteOne:function (questionId) {
                var thisLi,//关键节点
                    editBox = $this.class("work_box_edit")[0],
                    lies = editBox.getElementsByTagName("li");
                for(var k = 0;k<lies.length;k++){
                    var wrapId = lies[k].getAttribute("data-wrapid");
                    if(wrapId == questionId){
                        thisLi = lies[k];
                        break;
                    }
                }
                var liGroup = thisLi.parentNode.parentNode,
                    liGroupSon = $(liGroup).find(".Group_list").children();
                liGroupSon.length == 1 ? liGroup.parentNode.removeChild(liGroup) : thisLi.parentNode.removeChild(thisLi);//删除题组或题目
            },
            modifyLineScoreDef:function (type,lineId) {
                var paperData = JSON.parse($this.storage.getLocal(type,"paperdata")),
                    thisDef;
                for(var i = 0;i<paperData.length;i++){
                    if(paperData[i].lineId && paperData[i].lineId == lineId){
                        thisDef = paperData[i].scoreDef ? paperData[i].scoreDef : null;
                        break;
                    }
                }
                var selector = ".line[data-wrapid='" + lineId + "']";
                $(selector).find(".line_score").text(thisDef ? thisDef : "");
            },
            modifyPaperScore:function (type) {
                var paperInfo = JSON.parse($this.storage.getLocal(type,"paperinfo")),
                    paperData = $this.storage.getLocal(type,"paperdata"),
                    paperScore = 0;
                paperData = paperData ? JSON.parse(paperData) : [];
                for(var i = 0;i<paperData.length;i++){
                    if(!(paperData[i].line || paperData[i].group)){
                        paperScore += paperData[i].score ? paperData[i].score : 0;
                    }
                }
                paperInfo.score = paperScore;
                $this.storage.setLocal(type,"paperinfo",JSON.stringify(paperInfo));
                $this.class("test_score")[0].innerHTML = paperScore;
            },
            scrollPage:function () {
                crumSP();//面包屑跟随
                function crumSP() {
                    var follow = true,
                        _headerHeight = document.getElementById("Header").offsetHeight;
                    if(_headerHeight > 0){
                        window.onscroll = function () {
                            var _thisTop = $(window).scrollTop();
                            if(follow && _thisTop >= _headerHeight){
                                follow = false;
                                var _iCrumbs = $this.class("c_Crumbs")[0],
                                    iCrumbs = _iCrumbs.cloneNode(true);
                                iCrumbs.style.cssText = "position:fixed;top:0;left:0;z-index:999;";
                                iCrumbs.className += " i_c_Crumbs";
                                document.getElementsByTagName("body")[0].appendChild(iCrumbs);
                            }
                            if((!follow) && _thisTop < _headerHeight){
                                follow = true;
                                var _iCCrumbs = $this.class("i_c_Crumbs")[0];
                                _iCCrumbs.parentNode.removeChild(_iCCrumbs);
                            }
                        }
                    }else{
                        setTimeout(crumSP,50);//50毫秒递归，直到_headerHeight取到值
                    }
                }
            },
            clickDeleteQuestion:function (argobj) {
                var orderLineNumber = argobj.orderLineNumber,
                    type = argobj.type,
                    subject = argobj.subject;
                $(".work_box_edit").on("click",".options_delete",function () {
                    var questionId = this.getAttribute("data-id");
                    var lineId = $(this).parents(".line").attr("data-wrapid");
                    //更新数据(删除一题)
                    $this.Data.hjPaperData.deleteOne(type,questionId);
                    $this.Data.hjPaperData.reorder(type);
                    //更新html(删除一题)
                    $this.event.deleteOne(questionId);
                    //嵌套
                    $this.event.setOrderNumber({orderLineNumber:orderLineNumber,type:type,subject:subject});//排列题号、行号
                    if(type == "test"){//测试
                        $this.Data.hjPaperData.modify.lineScoreDef(type,lineId);//更新数据行分
                        $this.event.modifyLineScoreDef(type,lineId);//更新html行分
                        $this.event.modifyPaperScore(type);//更新试卷总分
                    }
                });
            },
            clickDeleteLine:function (argobj) {
                var orderLineNumber = argobj.orderLineNumber,
                    type = argobj.type,
                    subject = argobj.subject;
                $(".work_box_edit").on("click",".line_delete",function () {
                    var line = this.parentNode.parentNode.parentNode,
                        lineId = line.getAttribute("data-wrapid");
                    //删除数据
                    $this.Data.hjPaperData.deleteLine(type,lineId);
                    //排列数据lnorder
                    $this.Data.hjPaperData.reorder(type);
                    //删除html
                    line.parentNode.removeChild(line);
                    //排列行号、题号
                    $this.event.setOrderNumber({orderLineNumber:orderLineNumber,type:type,subject:subject});//排列题号、行号
                });
            },
            sortable:function (argobj) {
                var orderLineNumber = argobj.orderLineNumber,
                    type = argobj.type,
                    subject = argobj.subject;
                //拖动插件,依赖JQ，jqUI
                var id,condition,prevId,prevCondition,cloneArr = [];
                $(".work_box_edit > ul,.line_list,.group[data-issplite='1'] .group_list").sortable({
                    revert: 100,
                    scroll: true,
                    scrollSensitivity: 50,
                    scrollSpeed: 30,
                    cursorAt: {top: 10,left: 10},
                    distance: 25,
                    placeholder: "ui-state",
                    dropOnEmpty: true,
                    start: function(event, ui) {
                        ui.item.css('cursor','n-resize');
                        //取出id、条件class
                        id = ui.item.attr("data-wrapid");
                        condition = ui.item.attr("class");
                        var prev = ui.item.prev().attr("data-wrapid") ? ui.item.prev() : ui.item.parent().parent();
                        var prevId = prev.attr("data-wrapid");
                        localStorage.setItem('prevId',prevId);
                        var prevCondition = prev.attr("class");
                        //if(prevCondition=='group'){
                        //    return;
                        //}
                        //查询出id相关数据
                        cloneArr = $this.Data.hjPaperData.select(type,id);
                        //在原id上添加删除标记前缀：delete
                        var paperData = JSON.parse($this.storage.getLocal(type,"paperdata"));
                        if(condition.indexOf("question") != -1 || condition.indexOf("group") != -1){
                            for(var i=0;i<paperData.length;i++){
                                if(paperData[i].questionId == id){
                                    paperData[i].questionId = "delete" + id;
                                    break;
                                }
                            }
                        }else if(condition.indexOf("line") != -1){
                            for(var i=0;i<paperData.length;i++){
                                if(paperData[i].lineId == id){
                                    paperData[i].lineId = "delete" + id;
                                    break;
                                }
                            }
                        }
                        $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                    },
                    stop: function(event, ui){
                        //取出位置id、条件class
                        var id = ui.item.attr("data-wrapid");
                        var prev = ui.item.prev().attr("data-wrapid") ? ui.item.prev() : ui.item.parent().parent();
                        prevId = prev.attr("data-wrapid");
                        prevCondition = prev.attr("class");
                        var tempQtype = ui.item.attr('data-questiontype');
                        var sprevId = localStorage.getItem('prevId')
                        var paperData = JSON.parse($this.storage.getLocal(type,"paperdata"));
                        var questiontypes = prev.attr("data-questiontype");
                        var tempId = "delete" + id;
                        var className = '';
                        if(prevCondition=='line'){
                            if(condition != 'line'&&questiontypes.indexOf(tempQtype)==-1){
                                for(var i=0;i<paperData.length;i++){
                                    if(paperData[i].questionId == tempId){
                                        paperData[i].questionId = id;
                                        break;
                                    }
                                }
                                $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                                $(this).sortable( 'cancel' );
                                return;
                            }
                        }else if(prevCondition=='group'||prevCondition.indexOf('question')!=-1){
                            className = prev.parent().parent().attr('class');//题行类名
                            questiontypes = prev.parent().parent().attr('data-questiontype');//题行包含题型
                            if(className == 'line'){
                                if(questiontypes.indexOf(tempQtype)==-1){
                                    for(var i=0;i<paperData.length;i++){
                                        if(paperData[i].questionId == tempId){
                                            paperData[i].questionId = id;
                                            break;
                                        }
                                    }
                                    $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                                    $(this).sortable( 'cancel' );
                                    return
                                }
                            }
                        }else if(prevCondition=='group new'){
                            var gCode = prev.attr("data-groupcode");
                            var gsplite = prev.attr("data-issplite");
                            var className = ''
                            if(gCode&&gsplite=='0') {
                                className = prev.parent().parent().attr('class');//题行类名
                                questiontypes = prev.parent().parent().attr('data-questiontype');//题行包含题型
                            } else {
                                className = prev.parent().attr('class');//题行类名
                                questiontypes = prev.parent().attr('data-questiontype');//题行包含题型
                            }
                            if(className == 'line'){
                                if(questiontypes.indexOf(tempQtype)==-1){
                                    for(var i=0;i<paperData.length;i++){
                                        if(paperData[i].questionId == tempId){
                                            paperData[i].questionId = id;
                                            break;
                                        }
                                    }
                                    $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                                    $(this).sortable( 'cancel' );
                                    return
                                }
                            }
                        }else{
                            //移动整个题行
                        }
                        if(sprevId == prevId){
                            if(condition=='line'){
                                for(var i=0;i<paperData.length;i++){
                                    if(paperData[i].lineId&&paperData[i].lineId.indexOf('delete')!=-1){
                                        paperData[i].lineId = paperData[i].lineId.replace(/delete/g,'');
                                        $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                                        break;
                                    }
                                }
                            }else{
                                for(var i=0;i<paperData.length;i++){
                                    if(paperData[i].questionId&&paperData[i].questionId.indexOf('delete')!=-1){
                                        paperData[i].questionId = paperData[i].questionId.replace(/delete/g,'');
                                        $this.storage.setLocal(type,"paperdata",JSON.stringify(paperData));
                                        break;
                                    }
                                }
                            }
                            return;
                        }else{
                            //根据prevId相关信息增加数据
                            $this.Data.hjPaperData.add(type,subject,id,prevId,prevCondition,cloneArr,condition);//添加题目或行
                        }
                        //根据带delete前缀的id删除数据
                        if(condition.indexOf("question") != -1 || condition.indexOf("group") != -1){
                            $this.Data.hjPaperData.deleteOne(type,"delete" + id);
                        }else if(condition.indexOf("line") != -1){
                            $this.Data.hjPaperData.deleteLine(type,"delete" + id);
                            $this.Data.hjPaperData.reorder(type);
                        }
                        //排列数据lnorder
                        $this.Data.hjPaperData.reorder(type);
                        //排列html题号
                        $this.event.setOrderNumber({orderLineNumber:orderLineNumber,type:type,subject:subject});
                        //清空这次操作
                        id = undefined;
                        condition = undefined;
                        prevId = undefined;
                        prevCondition = undefined;
                        cloneArr = [];
                        ui.item.css('cursor','');
                    }
                });
                $( ".line_list" ).sortable( "option", "connectWith", "li.line:not(li[data-questiontype=999]) .line_list" );//链接列表
            },
            resetPaperHtml:function (argobj) {
                var subject = argobj.subject,
                    type = argobj.type,
                    orderLineNumber = argobj.orderLineNumber;
                //重载试卷html
                var thisPaperData = $this.storage.getLocal(type,"paperdata");
                thisPaperData = thisPaperData ? JSON.parse(thisPaperData) : [];
                var _questionLines = (thisPaperData.length > 0 ? $this.Html.hjQuestionLines({type:type,subject:subject,data:thisPaperData,btnobj:{analysis:true,delet:true}}) : "");
                $(".work_box_edit").html(_questionLines);
                if(_questionLines){
                    $this.event.setOrderNumber({orderLineNumber:orderLineNumber,type:type,subject:subject});//排列题号、行号
                    //重载拖动插件
                    $this.event.sortable({orderLineNumber:orderLineNumber,type:type,subject:subject});//排序     嵌套：数据(题目删除、题行删除、排列、增加)，html(sortable插件、题号处理)
                    //重载latex解析
                    intMathJax();
                    //重载操作
                    if($(".exercise_btn_in input").hasClass("exercise_btn_add")){
                        var _newBtn = type == "work" ?  "<input class='exercise_btn_done' type='button' value='完成'><input class='exercise_btn_setline' type='button' value='调整题型'>" : "<input class='exercise_btn_done' type='button' value='完成'><input class='exercise_btn_score' type='button' value='设置分数'><input class='exercise_btn_setline' type='button' value='调整题型'>";
                        if(type == "work"){
                            if(!(subject == "01" || subject == "03" || subject == "05" || subject == "09")){
                                var defaultLineTypeObj = {};
                            defaultLineTypeObj.questionType = "01";
                            defaultLineTypeObj.lineId = $this.class("line")[0].getAttribute("data-wrapid");
                            $this.storage.setLocal(type,"linetype","false");
                            $this.storage.setLocal(type,"defaultlinetypeobj",JSON.stringify(defaultLineTypeObj));
                            _newBtn = "<input class='exercise_btn_done' type='button' value='完成'><input class='exercise_btn_add_lineTypeFalse' type='button' value='加题' data-questiontype='" + defaultLineTypeObj.questionType + "' data-lineid='" + defaultLineTypeObj.lineId + "'>";
                        }
                        }
                        $(".exercise_btn_in").html(_newBtn);
                    }
                }else{
                    //重载操作
                    $(".exercise_btn_in").html("<input class='exercise_btn_add' type='button' value='加题'>");
                }
            },
            setNewQuesState:function (newQuesIdArr) {
                var paperQues = $this.class("question"),
                    paperGroup = $this.class("group");
                for(var iq = 0;iq<paperQues.length;iq++){
                    var iqId = paperQues[iq].getAttribute("data-wrapid");
                    for(var inq = 0;inq<newQuesIdArr.length;inq++){
                        if(newQuesIdArr[inq] == iqId){
                            $(paperQues[iq]).addClass("new").on("click",function () {
                                $(this).removeClass("new");
                            });
                            break;
                        }
                    }
                }
                for(var ip = 0;ip<paperGroup.length;ip++){
                    var ipId = paperGroup[ip].getAttribute("data-wrapid");
                    var isSplite = paperGroup[ip].getAttribute("data-issplite");
                    if(isSplite == "0"){
                        for(var inq = 0;inq<newQuesIdArr.length;inq++){
                            if(newQuesIdArr[inq] == ipId){
                                $(paperGroup[ip]).addClass("new").on("click",function () {
                                    $(this).removeClass("new");
                                });
                                $(paperGroup[ip]).find(".question").removeClass("new");//清除内部小题的状态
                                break;
                            }
                        }
                    }
                }
            }
        };
        //依赖JQ的实例
        this.components = {
            deletePaperlist:function (){
                var dels = $this.class("myWork_del");
                for(var i = 0;i<dels.length;i++){
                    dels[i].onclick = function (){
                        var _this = this;
                        //取值
                        var thisPar = {};
                        thisPar.paperId = this.getAttribute("id");
                        thisPar.assignId = this.getAttribute("data-assignid");
                        //界面
                        if($this.class("del_Error").length == 0){
                            var thisPop = document.createElement("div");
                            thisPop.setAttribute("class","data_Popup del_Error");
                            thisPop.innerHTML = "<div class='in'><span class='close del_Error_close'>关闭</span><img src='../../static/image/test/list_ErrorUrl_bg.jpg' /><div class='btn'><a class='btn_yes del_Error_btn_yes' href='javascript:;'>是的</a><a class='btn_no del_Error_btn_no' href='javascript:;'>取消</a></div></div>";
                            document.getElementsByTagName("body")[0].appendChild(thisPop);
                        }
                        //事件
                        $(".del_Error").fadeIn(200);
                        $this.class("del_Error_close")[0].onclick = $this.class("del_Error_btn_no")[0].onclick = function (){
                            $(".del_Error").fadeOut(200);
                        }
                        $this.class("del_Error_btn_yes")[0].onclick = function (){
                            $this.ajax.hjDeletemylist(true,thisPar,sDeletemylist,eDeletemylist);
                            function sDeletemylist(data){
                                $(".del_Error").fadeOut(200);
                                $this.dom.remove(_this.parentNode.parentNode);
                                $this.warn("删除成功");
                            }
                            function eDeletemylist(){
                                $(".del_Error").fadeOut(200);
                                $this.warn("删除失败");
                            }
                        }
                    }
                }
            },
            clickPrint:function () {
                document.getElementById("w_PrintBtn").onclick = function () {
                    //界面
                    if($this.class("print_wrap").length == 0){
                        $("body").append("<div class='print_wrap'><div class='print_in'><i class='GoPayClose print_wrap_close spriteImg c_closeico fr c_closeimg0'></i><div class='print_btn withAnalyze'>带解析打印</div><div class='print_btn normal'>普通打印</div></div></div><div style='display: none'><div id='w_Print'><div id='ComStyle'></div><div id='w_Print_Main'></div></div></div>");
                    }
                    $this.ajax.hjCommonStyle(true,{},sCommonStyle);//请求试题样式
                    function sCommonStyle(data) {
                        $("#ComStyle").html(data.retData);
                    }
                    //事件
                    $(".print_wrap").fadeIn(200);
                    $(".print_wrap_close").on("click",function () {
                        $(".print_wrap").fadeOut(200);
                    });
                    //普通打印
                    $(".normal").on("click",function () {
                        $("#w_Print_Main").html("");//清空
                        $("#w_Print_Main").append($(".exercise_box > h1").clone());
                        $("#w_Print_Main").append($(".exercise_box .timing").clone());
                        $("#w_Print_Main").append("<div class='work_box print'>" + $(".work_box").html() + "</div>");
                        $("#w_Print_Main .answer").hide();
                        $("#w_Print_Main .analysis").hide();
                        $("#w_Print_Main .buttons").hide();
                        $("#w_Print_Main math").remove();
                        console.log($("#w_Print").html())
                        $("#w_Print_Main li.on").css("border","none");
                        $("#w_Print").jqprint({
                            importCSS: true
                        });
                    });
                    //带解析打印
                    $(".withAnalyze").on("click",function () {
                        $("#w_Print_Main").html("");//清空
                        $("#w_Print_Main").append($(".exercise_box > h1").clone());
                        $("#w_Print_Main").append($(".exercise_box .timing").clone());
                        $("#w_Print_Main").append("<div class='work_box print'>" + $(".work_box").html() + "</div>");
                        $("#w_Print_Main .answer").show();
                        $("#w_Print_Main .analysis").show();
                        $("#w_Print_Main .buttons").hide();
                        $("#w_Print_Main math").remove();
                        $("#w_Print_Main li.on").css("border","none");
                        $("#w_Print").jqprint({
                            importCSS: true
                        });
                    });
                }
            },
            clickPublish:function (paperObj) {
                $this.class("exercise_btn_publish")[0].onclick = function () {
                    $this.ajax.hjAssignclass(true,{},sAssignclass,eAssignclass);//班级列表
                }
                function sAssignclass(data) {
                    //界面
                    var thistab = "<a class='obj_type on' href='javascript:;' data-objtype='0'>班级</a>",
                        thisContent = $this.Html.setClasses(data.retData);
                    if(paperObj.paperType == "102" || paperObj.paperType == "112" || paperObj.paperType == "103" || paperObj.paperType == "113" || paperObj.paperType == "104" || paperObj.paperType == "114"){//分层作业
                        $this.ajax.hjAssignindividual(false,{},sAssignindividual,eAssignindividual);//个人列表
                        $this.ajax.hjAssigngroup(false,{},sAssigngroup,eAssigngroup);//小组列表
                        function sAssignindividual(dat) {
                            thistab += "<a class='obj_type' href='javascript:;' data-objtype='1'>个人</a>";
                            thisContent += $this.Html.setIndividual(dat.retData);
                        }
                        function eAssignindividual() {
                            thisContent += "<div class='obj_type_con set_user' style='display: none'><p style='width: 100%;text-align: center;color: #999;'>请到班级管理页面进行设置</p></div>";
                        }
                        function sAssigngroup(dat) {
                            thistab += "<a class='obj_type' href='javascript:;' data-objtype='2'>小组</a>";
                            thisContent += $this.Html.setGroup(dat.retData);
                        }
                        function eAssigngroup() {
                            thisContent += "<div class='obj_type_con set_user' style='display: none'><p style='width: 100%;text-align: center;color: #999;'>请到班级管理页面进行设置</p></div>";
                        }
                    }
                    var publishBox =
                        "<div class='publish_box_wrap'><div class='publish_box'><i class='publish_box_close spriteImg c_closeico fr c_closeimg0'></i>" +
                        "<dl><dt>作业名称：</dt><dd>" + paperObj.paperName + "</dd></dl><div class='clear'></div>" +
                        "<dl><dt>建议用时：</dt><dd><input class='act_time' type='text' value='" + paperObj.testTime + "'> 分钟</dd></dl><div class='clear'></div>" +
                        "<dl><dt>截止时间：</dt><dd><input class='act_stop_time' type='text' value='" + $this.getNextDate(1) + "'/></dd></dl><div class='clear'></div>" +
                        "<div class='dl tab'><dl><dt>布置对象：</dt><dd>" + thistab + "</dd></dl><div class='clear'></div>" + thisContent + "</div><div class='clear'></div>" +
                        "<div class='dl done'><a class='work_done' href='javascript:;'>确定</a></div>" +
                        "</div></div>";
                    if($this.class("publish_box_wrap").length == 0){
                        $("body").append(publishBox);
                        thisEvent();
                    }else{
                        $(".publish_box_wrap").fadeIn(200);
                    }
                    function thisEvent() {
                        //不会变动的数据
                        var doparam = {};
                        doparam.paperResId = paperObj.paperId;
                        doparam.assignId = paperObj.assignId;
                        doparam.paperName = paperObj.paperName;
                        doparam.paperType = paperObj.paperType;
                        //初始化变动的数据
                        var assignObj = [],//布置给班级
                            classId = "",//布置给小组、个人
                            userIds = [];//布置给小组、个人
                        //如果是模拟套卷或听力测试，禁用建议用时
                        if(paperObj.paperType == "202" || paperObj.paperType == "203"){
                            $(".act_time").attr("disabled","disabled").css("color","#999");
                        }
                        //开关
                        $(".publish_box_wrap").fadeIn(200);
                        $(".publish_box_close").on("click",function () {
                            $(".publish_box_wrap").fadeOut(200);
                        });
                        var _maxHeight = $(window).height() - 374,//班级列表最大高度
                            _marginTop = ($(window).height() - ($(".publish_box").height() + 80 ) ) / 2;//位置
                        $(".publish_box").css("margin-top",_marginTop + "px");
                        $(".obj_type_con").css({"max-height":_maxHeight + "px","overflow-y":"auto"});
                        $(".act_stop_time").datetimepicker();//datetimepicker :日期+时间；datepicker:日期；timepicker:时间
                        $(".act_stop_time").datetimepicker("option","minDate",0);//可选日期最小值
                        $(".act_stop_time").datetimepicker("option","maxDate",null);//可选日期最大值
                        //点击切换布置类型
                        var thisObjType = "0";//string   0：班级   1：小组    2：个人
                        $(".obj_type").on("click",function () {
                            if(!($(this).hasClass("on"))){
                                thisObjType = $(this).attr("data-objtype");
                                if("assignObj" in doparam){
                                    assignObj = [];//清空
                                    delete doparam.assignObj;//删除数据
                                    $(".set_classes .on").removeClass("on");//清除样式
                                }else if("classId" in doparam){
                                    classId = "";
                                    userIds = [];
                                    delete doparam.classId;
                                    delete doparam.userIds;
                                    delete doparam.objNames;
                                    $(".set_user .on").removeClass("on");
                                    $(".set_user .user").css("display","none");
                                    $(".set_group .on").removeClass("on");
                                    $(".set_group .user").css("display","none");
                                }
                                $(".obj_type.on").removeClass("on");
                                $(this).addClass("on");
                                $(".obj_type_con").css("display","none");
                                $(".obj_type_con").eq($(this).index()).fadeIn();
                                //初始首选项
                                if($(this).index() == 1){
                                    $(".set_user ul li").eq(0).addClass("on");
                                    $(".set_user .user").eq(0).fadeIn();
                                    classId = $(".set_user ul li").eq(0).attr("data-id");
                                    doparam.classId = classId;
                                    //小组和个人样式协助
                                    $(".set_user .user").eq(0).each(function(i,obj){
                                        $(obj).css("height",obj.offsetHeight);
                                    });
                                }
                                if($(this).index() == 2){
                                    $(".set_group ul li").eq(0).addClass("on");
                                    $(".set_group .user").eq(0).fadeIn();
                                    classId = $(".set_group ul li").eq(0).attr("data-id");
                                    doparam.classId = classId;
                                    //小组和个人样式协助
                                    $(".set_group .user").eq(0).each(function(i,obj){
                                        $(obj).css("height",obj.offsetHeight);
                                    });
                                }
                            }
                        });
                        //点击传送班级
                        $(".set_classes li").on("click",function () {
                            var _this = $(this),
                                thisId = $(this).attr("data-id"),
                                thisNum = $(this).attr("data-num"),
                                thisName = $(this).text(),
                                thisParam = {};
                            thisParam.classId = thisId;
                            thisParam.className = thisName;
                            thisParam.studNum = thisNum;
                            thisNum === "0" ? noStudent() : $(this).hasClass("on") ? off() : on();
                            function on() {
                                $(_this).addClass("on");
                                assignObj.push(thisParam);
                            }
                            function off() {
                                $(_this).removeClass("on");
                                var valNum = $this.myIndexOf(thisParam,assignObj);
                                assignObj.splice(valNum,1);
                            }
                            function noStudent() {
                                $this.warn("此班级中无学生，不能布置作业");
                                $(_this).css("color","#ccc");
                            }
                            doparam.assignObj = assignObj;//传送
                        });
                        //点击传送个人
                        $(".set_user ul li").on("click",function () {//班级
                            if(!$(this).hasClass("on")){
                                //重载班级id
                                classId = $(this).attr("data-id");
                                doparam.classId = classId;
                                //切换个人  未选个人可切换
                                if(userIds.length == 0){
                                    $(".set_user ul li.on").removeClass("on");
                                    $(this).addClass("on");
                                    $(".set_user .user").css("display","none");
                                    $(".set_user .user").eq($(this).index()).fadeIn();
                                    //小组和个人样式协助
                                    $($(".set_user .user").eq($(this).index())).find("li").each(function(i,obj){
                                        $(obj).css("height",obj.offsetHeight);
                                    });
                                }else{
                                    $this.warn("不能跨班布置哦！");
                                }
                            }
                        });
                        $(".set_user ol li span").on("click",function () {//个人
                            var _this = this,
                                _thisId = $(this).attr("data-id");
                            $(this).hasClass("on") ? off() : on();
                            function on() {
                                $(_this).addClass("on");
                                userIds.push(_thisId);
                            }
                            function off() {
                                $(_this).removeClass("on");
                                var valNum = $this.myIndexOf(_thisId,userIds);
                                userIds.splice(valNum,1);
                            }
                            doparam.userIds = userIds;
                            //列表展示短标题
                            var classTitle = ".set_user ul li[data-id = " + classId + "]";
                            var sortTitle = $(classTitle).text() + " ";
                            for(var kki = 0;kki<userIds.length;kki++){
                                var _thisIdi = ".set_user ol li span[data-id = " + userIds[kki] + "]";
                                if(kki == 0){
                                    sortTitle += $(_thisIdi).text();
                                }else if(kki == 1){
                                    sortTitle += "、" + $(_thisIdi).text();
                                }else{
                                    sortTitle += "等";
                                    break;
                                }
                            }
                            if(sortTitle.length > 32){
                                sortTitle = sortTitle.substring(0,32);
                            }
                            doparam.objNames = sortTitle;
                        });
                        //点击传送小组
                        $(".set_group ul li").on("click",function () {//班级
                            if(!$(this).hasClass("on")){
                                //重载班级id
                                classId = $(this).attr("data-id");
                                doparam.classId = classId;
                                //切换个人  未选个人可切换
                                if(userIds.length == 0){
                                    $(".set_group ul li.on").removeClass("on");
                                    $(this).addClass("on");
                                    $(".set_group .user").css("display","none");
                                    $(".set_group .user").eq($(this).index()).fadeIn();
                                    //小组和个人样式协助
                                    $($(".set_group .user").eq($(this).index())).find("li").each(function(i,obj){
                                        $(obj).css("height",obj.offsetHeight);
                                    });
                                }else{
                                    $this.warn("不能跨班布置哦！");
                                }
                            }
                        });
                        $(".set_group ol li span").on("click",function () {//小组
                            var _this = this,
                                _thisId = $(this).attr("data-id");
                            $(this).hasClass("on") ? off() : on();
                            function on() {
                                $(_this).addClass("on");
                                userIds.push(_thisId);
                            }
                            function off() {
                                $(_this).removeClass("on");
                                var valNum = $this.myIndexOf(_thisId,userIds);
                                userIds.splice(valNum,1);
                            }
                            doparam.userIds = userIds;
                            //列表展示短标题
                            var classTitle = ".set_group ul li[data-id = " + classId + "]";
                            var sortTitle = $(classTitle).text() + " ";
                            for(var kkn = 0;kkn<userIds.length;kkn++){
                                var _thisIdn = ".set_group ol li span[data-id = " + userIds[kkn] + "]";
                                if(kkn == 0){
                                    sortTitle += $(_thisIdn).text();
                                }else if(kkn == 1){
                                    sortTitle += "、" + $(_thisIdn).text();
                                }else{
                                    sortTitle += "等";
                                    break;
                                }
                            }
                            if(sortTitle.length > 32){
                                sortTitle = sortTitle.substring(0,32);
                            }
                            doparam.objNames = sortTitle;
                        });
                        //建议用时
                        $(".act_time").on("keyup",function () {
                            var $testTime = $(this).val();
                            if($this.checkNum($testTime)){
                                $(this).css("border-color","#ccc");
                                if($(this).parent().find("span").hasClass("orange")){
                                    $(this).parent().find(".orange").remove();
                                }
                            }else{
                                $(this).css("border-color","orange");
                                if(!$(this).parent().find("span").hasClass("orange")){
                                    $(this).parent().append("<span class='orange' style='padding-left: 20px;color: orange;'>请您输入1-999的整数时间</span>");
                                }
                            }
                        });
                        //提交
                        $(".work_done").on("click",function () {
                            $(".work_done").off("click").css("background-color","#aaa");
                            var scoreWrap = $this.class("test_score");
                            doparam.testTime = $( "input.act_time" ).val();
                            doparam.score = scoreWrap.length != 0 ? parseFloat(scoreWrap[0].text().replace(/[^0-9]/g,"")) : "0";
                            doparam.deadline = new Date($( "input.act_stop_time" ).val().replace(/-/g,"/"));
                            //添加布置类型
                            if(thisObjType == "0"){
                                doparam.objType = "class";
                            }else if(thisObjType == "1"){
                                doparam.objType = "user";
                            }else if(thisObjType == "2"){
                                doparam.objType = "group";
                            }
                            //请求前检查
                            if(!$this.checkNum(doparam.testTime)){
                                $this.warn("请输入正确的建议用时");
                            }else if(doparam.deadline == ""){
                                $this.warn("请您选择日期");
                            }else if(new Date(doparam.deadline)< new Date()){
                                $this.warn("请您选择正确的日期");
                            }else if(thisObjType == "0"){
                                if(!("assignObj" in doparam)){
                                    $this.warn("请您选择班级");
                                }else if(!doparam.assignObj[0]){
                                    $this.warn("请您选择班级");
                                }else{
                                    postIt();
                                }
                            }else if(thisObjType == "1"){
                                if(!("userIds" in doparam)){
                                    $this.warn("请您选择个人");
                                }else if(!doparam.userIds[0]){
                                    $this.warn("请您选择个人");
                                }else{
                                    postIt();
                                }
                            }else if(thisObjType == "2"){
                                if(!("userIds" in doparam)){
                                    $this.warn("请您选择小组");
                                }else if(!doparam.userIds[0]){
                                    $this.warn("请您选择小组");
                                }else{
                                    postIt();
                                }
                            }
                            function postIt() {
                                //班级和其它布置类型请求地址不同
                                if(doparam.objType == "class"){
                                    $this.ajax.hjAssignpaperstoclass(true,JSON.stringify(doparam),sAssignpapersto,eAssignpapersto,"application/json");
                                }else{
                                    $this.ajax.hjAssignpaperstogroup(true,JSON.stringify(doparam),sAssignpapersto,eAssignpapersto,"application/json");
                                }
                                function sAssignpapersto(data) {
                                    //解除事件并置灰
                                    $(".work_done").val("提交成功");
                                    $(".publish_box_Main").fadeOut(200);
                                    //金币
                                    GoldAnimate(data.retGold);
                                    //提示
                                    $this.warn("布置成功,即将跳转");
                                    //跳转
                                    setTimeout(resetUrl,1500);
                                    function resetUrl() {
                                        window.location.href = "hj_publish.html";
                                    }
                                }
                                function eAssignpapersto(data) {
                                    $this.warn("布置失败,请联系管理员");
                                }
                            }
                        });
                    }
                }
                function eAssignclass() {
                    //界面
                    if($this.class("exercise_ErrorUrl").length == 0){
                        $("body").append("<div class='data_Popup exercise_ErrorUrl'><div class='in'><span class='close'>关闭</span><img src='../../static/image/homework/exercise_ErrorUrl_bg.jpg' /><div class='btn'><a href='/model/classmanage/classmanage.html'>创建班级</a><a href='/model/classmanage/classmanage.html'>加入班级</a></div></div></div>");
                    }
                    //事件
                    $(".exercise_ErrorUrl").fadeIn(200);
                    $(".exercise_ErrorUrl .close").on("click",function () {
                        $(".exercise_ErrorUrl").fadeOut(200);
                    });
                }
            },
            clickSetLine:function (argobj) {
                var orderLineNumber = argobj.orderLineNumber,
                    type = argobj.type,
                    subject = argobj.subject;
                $(".exercise_btn_in").on("click",".exercise_btn_setline",function () {
                    var paperData = JSON.parse($this.storage.getLocal(type,"paperdata"));
                    var questionTypes = JSON.parse($this.storage.getLocal(type,"questiontypemapped"));
                    //数据
                    var linesArr = [];//取出题行组(带题)
                    if(paperData){
                        for(var i = 0;i<paperData.length;i++){
                            if(paperData[i].line && paperData[i].line == "start"){
                                var lineArr = [];//整行
                                lineArr.push(paperData[i]);
                                accumulation(i);
                                function accumulation(num) {
                                    lineArr.push(paperData[num+1]);
                                    if(!(paperData[num+1].line && paperData[num+1].line == "end")){
                                        accumulation(num+1);
                                    }
                                }
                                linesArr.push(lineArr);
                            }
                        }
                    }
                    //界面
                    var _lines = "",
                        _questionTypes = "";
                    for(var i = 0;i<linesArr.length;i++){
                        _lines += "<li class='setLine_line' data-isnumber='" + linesArr[i][0].isNumber + "' data-addquestion='" + (linesArr[i][0].questionType == "999" ? "false" : "true") + "' data-questiontype='" + linesArr[i][0].questionType + "' data-lineid='" + linesArr[i][0].lineId + "'><span><span class='setLine_line_number'>" + (linesArr[i][0].lineNumber ? linesArr[i][0].lineNumber : "") + "</span><span class='setLine_line_name'>" + (linesArr[i][0].lineName ? linesArr[i][0].lineName : "默认题行") + "</span><span class='setLine_line_score'>" + (linesArr[i][0].scoreDef ? linesArr[i][0].scoreDef : "") + "</span></span><i class='line_delete'>删除</i></li>";
                    }
                    for(var i = 0;i<questionTypes.length;i++){
                        _questionTypes += "<a href='javascript:;' data-questiontype='" + questionTypes[i].code + "' data-lineid='" + questionTypes[i].lineId + "'>" + questionTypes[i].label + "</a>";
                    }
                    var setLineHtml = "<div class='setLine_in'><i class='setLine_close spriteImg c_closeico fr c_closeimg0'></i><div class='setLine_lines'><ul>" + _lines + "</ul><div class='question_type'><i>请选择题型</i>" + _questionTypes + "</div><div class='setLine_btn a'><span class='setLine_btn_add'>添加题型</span></div><div class='setLine_btn b'><span class='setLine_btn_done'>完成</span><span class='setLine_btn_cancel'>取消</span></div></div></div>";
                    if($this.class("setLine").length == 0){
                        $("body").append("<div class='data_Popup setLine'>" + setLineHtml + "</div>");
                    }else{
                        $(".setLine")[0].innerHTML = setLineHtml;
                    }
                    //事件
                    $(".setLine").fadeIn(200);
                    $(".setLine_btn_cancel,.setLine_close").on("click",function () {
                        $(".setLine").fadeOut(200);
                    });
                    //禁用新加的题型再次选入
                    var disableArr = [];
                    for(var i = 0;i<linesArr.length;i++){
                        if(linesArr[i][0].lineId.indexOf("new") != -1){
                            disableArr.push(linesArr[i][0].questionType);
                        };
                    }
                    if(disableArr.length > 0){
                        var _newlinesArr = $(".question_type a");
                        for(var i = 0;i<disableArr.length;i++){
                            for(var j = 0;j<_newlinesArr.length;j++){
                                if(_newlinesArr[j].getAttribute("data-questiontype") == disableArr[i]){
                                    _newlinesArr[j].setAttribute("class","disabled");
                                    break;
                                }
                            }
                        }
                    }
                    //拖动
                    var startNum = 0,stopNum = 0;//拖动的起止下标
                    $(".setLine_lines > ul").sortable({
                        revert: 100,
                        scroll: true,
                        scrollSensitivity: 50,
                        scrollSpeed: 30,
                        cursorAt: {top: 10,left: 10},
                        distance: 25,
                        placeholder: "ui-state",
                        start: function(event, ui) {
                            ui.item.css('cursor','n-resize');
                            startNum = ui.item.index();
                        },
                        stop: function(event, ui){
                            stopNum = ui.item.index();
                            var startObj = linesArr[startNum],
                                stopObj = linesArr[stopNum];
                            if(startNum != stopNum){
                                linesArr.splice(startNum,1);
                                linesArr.splice(stopNum,0,startObj);
                            }
                            setLineReOrderLine(orderLineNumber);
                            ui.item.css('cursor','');
                        }
                    });
                    //删除
                    $(".setLine_lines > ul").on("click",".line_delete",function () {
                        var thisLine = this.parentNode,
                            thisLineId = thisLine.getAttribute("data-lineid");
                        //删除数据
                        for(var i = 0;i<linesArr.length;i++){
                            if(linesArr[i][0].lineId == thisLineId){
                                linesArr.splice(i,1);
                                break;
                            }
                        }
                        //删除html
                        thisLine.parentNode.removeChild(thisLine);
                        setLineReOrderLine(orderLineNumber);
                        //交互:如果删除的是新加题型，解锁可选项
                        if(thisLineId.indexOf("new") != -1){
                            var _newLineArr = $(".question_type a");
                            for(var i = 0;i<_newLineArr.length;i++){
                                var theLineId = _newLineArr[i].getAttribute("data-lineid");
                                if(theLineId == thisLineId){
                                    $(_newLineArr[i]).removeClass("disabled");
                                    break;
                                }
                            }
                        }
                    });
                    //新增
                    $(".setLine_btn_add").on("click",function () {
                        $(this).fadeOut(0);
                        $(".question_type").fadeIn(200);
                    });
                    $(".question_type a").on("click",function () {
                        if($(this).hasClass("disabled")) return;
                        //新增数据
                        var questionType = this.getAttribute("data-questiontype"),
                            lineName = this.innerText,
                            lineId = this.getAttribute("data-lineid"),
                            isNumber = type == "work" ? false : true,//作业初始无行号，测试初始有行号
                            lineNumber = null;
                        if(type == "work"){
                            for(var i = 0;i<linesArr.length;i++){
                                if(linesArr[i][0].isNumber){//如果作业源数据中有行号，处理行号
                                    isNumber = true;
                                    break;
                                }
                            }
                        }
                        if(isNumber){//处理行号
                            lineNumber = 1;
                            for(var i = 0;i<linesArr.length;i++){
                                if(linesArr[i][0].isNumber){
                                    lineNumber++;
                                }
                            }
                            lineNumber = subject == "03" ? $this.toRoman(lineNumber) : $this.toChinese(lineNumber);
                            lineName = subject == "03" ? "." + lineName : "、" + lineName;
                        }
                        var newLine = [
                            {
                                isNumber:isNumber,
                                isShow:"1",
                                line:"start",
                                lineId:lineId,
                                lineName:lineName,
                                lineNumber:lineNumber,
                                lnOrder:0,
                                showOrder:0,
                                questionType:questionType,
                                scoreDef:null,
                                isScoreBatch:$this.Data.isScoreBatch(type,subject,questionType,lineId,lineName),
                                isScoreBtn: $this.Data.isScoreBtn(type,subject,questionType,lineId,lineName)
                            },
                            {
                                line:"end"
                            }
                        ];
                        linesArr.push(newLine);
                        //新增html
                        var _newLine = "<li class='setLine_line' data-isnumber='" + isNumber + "' data-addquestion='" + (questionType == "999" ? "false" : "true") + "' data-questiontype='" + questionType + "' data-lineid='" + lineId + "'><span><span class='setLine_line_number'>" + (lineNumber ? lineNumber : "") + "</span><span class='setLine_line_name'>" + lineName + "</span><span class='setLine_line_score'></span></span><i class='line_delete'>删除</i></li>";
                        $(".setLine_lines ul").append(_newLine);
                        //交互
                        $(this).addClass("disabled");
                        $(".setLine_btn_add").fadeIn(0);
                        $(".question_type").fadeOut(0);
                    });
                    //↓点击“完成”之前，为避免浪费处理资源，不对数据行号进行排列
                    //↑排列html行号
                    function setLineReOrderLine(orderLineNumber) {
                        if(orderLineNumber){
                            var iNumber = 1,
                                _totalLines = $(".setLine_lines li");
                            for(var i = 0;i<_totalLines.length;i++){
                                if(_totalLines[i].getAttribute("data-isnumber") == "true"){
                                    var _iNumber = subject == "03" ? $this.toRoman(iNumber) : $this.toChinese(iNumber);
                                    $(_totalLines[i]).find(".setLine_line_number").text(_iNumber);
                                    iNumber++;
                                }
                            }
                        }
                    }
                    //完成
                    $(".setLine_btn_done").on("click",function () {
                        var isclick = this.getAttribute("isclick");
                        if(isclick) return;
                        this.setAttribute("isclick","true");
                        //更新数据
                        var newSetPaperData = [];
                        for(var i = 0;i<linesArr.length;i++){
                            newSetPaperData = newSetPaperData.concat(linesArr[i]);
                        }
                        $this.storage.setLocal(type,"paperdata",JSON.stringify(newSetPaperData));
                        //排序数据
                        $this.Data.hjPaperData.reorder(type);
                        $this.Data.hjPaperData.modify.lineNumber(type,subject);
                        if(type == "test"){//测试
                            $this.Data.hjPaperData.modify.allLineScoreDef(type);//更新数据行分
                            $this.event.modifyPaperScore(type);//更新试卷总分
                        }
                        //重载试卷html
                        $this.event.resetPaperHtml({orderLineNumber:orderLineNumber,type:type,subject:subject});
                        //关闭窗口
                        $(".setLine").fadeOut(200);
                    });
                });
            },
            clickSavePaper:function (type,subject,active,target,ai,pi,pt,st) {
                $(".exercise_btn_in").on("click",".exercise_btn_done",function () {
                    var paperInfo = $this.storage.getLocal(type,"paperinfo"),
                        paperData = $this.storage.getLocal(type,"paperdata");
                    paperInfo = paperInfo ? JSON.parse(paperInfo) : null;
                    paperData = paperData ? JSON.parse(paperData) : [];
                    if(!paperInfo){
                        $this.warn("请您编辑后再进行保存");
                        return;
                    }else{
                        if(paperData.length == 0){
                            $this.warn("请您编辑后再进行保存");
                            return;
                        }
                    }
                    for(var i = 0;i<paperData.length;i++){
                        if(paperData[i].line  && paperData[i].line == "start" && paperData[i].questionType && paperData[i].questionType != "999" && paperData[i+1].line && paperData[i+1].line == "end"){
                            $this.warn("还有大题中未设置题目哦");
                            return;
                        };
                    }
                    if(type == "test"){
                        for(var i = 0;i<paperData.length;i++){
                            if(!(paperData[i].line || paperData[i].group)){
                                if(!paperData[i].score){
                                    $this.warn("还有题目没设置分数呢");
                                    return;
                                }
                            };
                        }
                        var paperScore = parseInt($this.class("test_score")[0].innerText);
                        if(!isNaN(paperScore)){
                            if(paperScore > 999){
                                $this.warn("请设置正确的分数");
                                return;
                            }
                        }
                    }
                    var paperTime = parseInt($this.class("t_time")[0].value);
                    if(!isNaN(paperTime)){
                        if(paperTime > 999){
                            $this.warn("请设置正确的时间");
                            return;
                        }
                    }
                    var newPaper = {};//作业或试卷
                    newPaper.paperName = paperInfo.paperName;
                    newPaper.knowledgeId = active;
                    newPaper.type = pt.replace("0","1");
                    newPaper.editorType = "1";//后台统计布置类型接口：默认1
                    newPaper.testTime = $(".t_time").val();
                    newPaper.score = $("span").hasClass("test_score") ? parseInt($(".test_score").text()) : 0;
                    newPaper.questionLines = $this.Data.restorePaperData(type,subject);
                    var isMarked = false;
                    for(var i = 0;i<paperData.length;i++){
                        if(paperData[i].selectable && paperData[i].selectable == "0"){
                            isMarked = true;
                            break;
                        }
                    }
                    newPaper.isMarked = isMarked ? "1" : "0";
                    if(pt == "106" || pt == "116" || pt == "206" || pt == "216"){
                        newPaper.editorType = "2";//后台统计布置类型接口：2：自主组卷
                    }
                    //保存
                    $this.ajax.hjSavecustompaper(true,JSON.stringify(newPaper),sSavecustompaper,eSavecustompaper,"application/json");
                    function sSavecustompaper(data) {
                        $(".exercise_btn_done").off("click").css("background-color","#aaa").val("提交成功");//成功后解除事件并置灰
                        if(target == "mylist" && st == "2"){//我的作业里的 未布置的旧记录
                            $this.ajax.hjDelete(true,{paperId:pi,assignId:ai},sDelete,eDelete);//删除
                            function sDelete(data) {
                                console.log("旧记录删除成功")
                            }
                            function eDelete(data) {
                                console.log("旧记录删除失败")
                            }
                        }
                        var newPi = data.retData.paperId,//返回
                            newPt = pt.replace("0","1"),
                            newAi = data.retData.assignId,
                            newSt = "2",
                            newTarget = "mylist";
                        $this.storage.setLocal(type,"pi",newPi);
                        $this.storage.setLocal(type,"pt",newPt);
                        $this.storage.setLocal(type,"ai",newAi);
                        $this.storage.setLocal(type,"st",newSt);
                        $this.storage.setLocal(type,"target",newTarget);
                        if (!$("div").hasClass("c_Dissolve")) {
                            $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                        }
                        var _i =2;
                        $('#c_ErrorMsg').html('保存成功,将在' + _i + '秒后返回').fadeIn(200);
                        set();//跳转倒计时
                        function set() {
                            _i--;
                            $('#c_ErrorMsg').html('保存成功,将在' + _i + '秒后返回');
                            if (_i > 0) {
                                setTimeout(set, 1000);
                            } else {
                                get();//跳转
                            }
                        }
                        function get() {
                            window.location.href = "hj_paper.html";
                        }
                    }
                    function eSavecustompaper() {
                        $this.warn("抱歉，保存失败了");
                    }
                });
            },
            clickAddLineAndQuestionForPaper:function (argobj) {
                var orderLineNumber = argobj.orderLineNumber,
                    type = argobj.type,
                    subject = argobj.subject,
                    active = argobj.active,
                    kt = argobj.kt;
                $(".exercise_btn_in").on("click",".exercise_btn_add",function () {
                    $this.storage.setLocal(type,"optintype","empty");
                    forPaper({empty:true});//Empty
                });
                $(".exercise_btn_in").on("click",".exercise_btn_add_lineTypeFalse",function () {
                    $this.storage.setLocal(type,"optintype","line");
                    var questiontype = $this.storage.getLocal(type,"questiontype");
                    questiontype = questiontype ? JSON.parse(questiontype) : [];
                    if(questiontype.length > 0){
                        var _thisCodes = "0",//0:“全部”
                            _thisLineId = this.getAttribute("data-lineid");
                        for(var i = 0;i<questiontype.length;i++){
                            _thisCodes += "," + questiontype[i].code;
                        }
                        forPaper({empty:false,codes:_thisCodes,lineId:_thisLineId});//HasLineOnlyOne
                    }else{
                        $this.warn("获取题型失败，无法继续加题");
                    }
                });
                $(".work_box_edit").on("click",".line_btn",function () {
                    $this.storage.setLocal(type,"optintype","line");
                    var thisLine = this.parentNode.parentNode,
                        _thisCodes = thisLine.getAttribute("data-questiontype"),
                        _thisLineId = thisLine.getAttribute("data-wrapid");
                    forPaper({empty:false,codes:_thisCodes,lineId:_thisLineId});//HasLine
                });
                function forPaper(argobj) {
                    var knowledgeData = $this.storage.getLocal(type,"knowledge"),
                        questiontypeData = $this.storage.getLocal(type,"questiontype");
                    knowledgeData = knowledgeData ? JSON.parse(knowledgeData) : null;
                    questiontypeData = questiontypeData ? JSON.parse(questiontypeData) : null;
                    var empty = argobj.empty,
                        codeArr = argobj.codes,
                        lineId = argobj.lineId;
                    if(codeArr){
                        codeArr = codeArr.split(",");
                    }
                    var codeArr0Name = "全部";
                    if(codeArr && codeArr.length > 0){
                        for(var i = 0;i<questiontypeData.length;i++){
                            if(questiontypeData[i].code == codeArr[0]){
                                codeArr0Name = questiontypeData[i].label;
                                break;
                            }
                        }
                    }
                    //界面
                    var addLineQuestion_top = "",
                        addLineQuestion_middle = "<div class='addLineQuestion_middle'><div class='addLineQuestion_middle_questions'></div><div class='addLineQuestion_middle_list'><div id='kkpager'></div></div></div>",
                        addLineQuestion_bottom = "<div class='addLineQuestion_bottom'><a class='addLineQuestion_bottom_done off' href='javascript:;'>请选择题目</a><span class='addLineQuestion_bottom_num'>已选择<i class='addLineQuestion_bottom_total'></i>道题</span><span class='addLineQuestion_bottom_numlist'></span></div>";
                    addLineQuestion_top += "<div class='addLineQuestion_top'><dl class='addLineQuestion_knowledge'><dt>知识点：</dt><dd>";
                    if(knowledgeData){
                        addLineQuestion_top += "<span class='on' data-code='0'>全部</span>";
                        for(var i = 0;i<knowledgeData.length;i++){
                            if(knowledgeData[i]){
                                addLineQuestion_top += "<span data-code='" + knowledgeData[i].code + "'>" + knowledgeData[i].label + "</span>";
                            }
                        }
                    }else{
                        addLineQuestion_top += "<p>抱歉，无法获取知识点！</p>";
                    }
                    addLineQuestion_top += "</dd></dl><div class='clear'></div><dl class='addLineQuestion_questiontype'><dt>题　型：</dt><dd>";
                    if(questiontypeData){
                        codeArr && codeArr.length > 0 ? addLineQuestion_top += "<span class='on' data-code='" + codeArr[0] + "'>" + codeArr0Name + "</span>" : addLineQuestion_top += "<span class='on' data-code='0'>全部</span>";
                        for(var i = 0;i<questiontypeData.length;i++){
                            if(codeArr && codeArr.length > 0){
                                for(var j = 1;j<codeArr.length;j++){
                                    if(questiontypeData[i].code == codeArr[j]){
                                        addLineQuestion_top += "<span data-code='" + questiontypeData[i].code + "'>" + questiontypeData[i].label + "</span>";
                                        break;
                                    };
                                }
                            }else{
                                addLineQuestion_top += "<span data-code='" + questiontypeData[i].code + "'>" + questiontypeData[i].label + "</span>";
                            }
                        }
                    }else{
                        addLineQuestion_top += "<p>抱歉，无法获取题型！</p>";
                    }
                    addLineQuestion_top += "</dd></dl><div class='clear'></div><i class='addLineQuestion_top_switch'><i class='on'>收起</i></i></div>";
                    var addHtml = "<div class='addLineQuestion_box'><i class='addLineQuestion_box_close spriteImg c_closeico fr c_closeimg0'></i>" + addLineQuestion_top + addLineQuestion_middle + addLineQuestion_bottom +"</div>";
                    if($this.class("addLineQuestion").length == 0){
                        $("body").append("<div class='data_Popup addLineQuestion'>" + addHtml + "</div>");
                    }else{
                        $(".addLineQuestion")[0].innerHTML = addHtml;
                    }
                    //事件
                    $(".addLineQuestion").fadeIn(200);
                    $(".addLineQuestion_box_close").on("click",function () {
                        $this.storage.setLocal(type,"currentlist","");//清空缓存的当前分页数据
                        $this.storage.setLocal(type,"newlistarr","");//清空缓存的当前选入数据
                        $this.storage.setLocal(type,"newlistobj","");//清空缓存的当前选入数据
                        $this.storage.setLocal(type,"optintype","");//清空缓存的当前选入入口数据
                        $(".addLineQuestion").fadeOut(200);
                    });
                    $(".addLineQuestion_middle").css("height",$(window).height() + $(window).scrollTop() - $(".addLineQuestion_middle").offset().top - 60);
                    $(".addLineQuestion_top_switch i").on("click",function () {
                        if($(this).hasClass("on")){
                            $(this).removeClass("on").text("展开");
                            $(".addLineQuestion_top").css("height","42px");
                            $(".addLineQuestion_middle").css("height",$(window).height() + $(window).scrollTop() - $(".addLineQuestion_middle").offset().top - 60);
                        }else{
                            $(this).addClass("on").text("收起");
                            $(".addLineQuestion_top").css("height","auto");
                            $(".addLineQuestion_middle").css("height",$(window).height() + $(window).scrollTop() - $(".addLineQuestion_middle").offset().top - 60);
                        }
                    });
                    //知识点和题型改变重新请求题库事件
                    var knowledge = "0",//知识点：默认全部
                        questiontype = "0",//题型：默认全部
                        papersquestionsParam = {};//发送的数据
                    papersquestionsParam.pageNum = 1;//请求第几页
                    papersquestionsParam.pageSize = 10;//每页条数
                    papersquestionsParam.categoryId = active;//课时id
                    if(type == "test"){//测试需要多传1个参数
                        papersquestionsParam.knowledgeType = kt;//用于测试查询知识点和题型和题库
                    }
                    if(codeArr && codeArr.length > 0 && codeArr[0] != "0"){
                        papersquestionsParam.questionTypeId = codeArr[0];
                    }
                    $(".addLineQuestion_knowledge dd span").on("click",function () {
                        knowledge = this.getAttribute("data-code");
                        if(knowledge && knowledge != "0"){
                            papersquestionsParam.knowledgeIds = knowledge;
                        }else{
                            if(papersquestionsParam.knowledgeIds){
                                delete papersquestionsParam.knowledgeIds;
                            }
                        }
                        papersquestionsParam.pageNum = 1;
                        papersquestions();
                        $(".addLineQuestion_knowledge dd span.on").removeClass("on");
                        $(this).addClass("on");
                    });
                    $(".addLineQuestion_questiontype dd span").on("click",function () {
                        questiontype = this.getAttribute("data-code");
                        if(questiontype && questiontype != "0"){
                            papersquestionsParam.questionTypeId = questiontype;
                        }else{
                            if(papersquestionsParam.questionTypeId){
                                delete papersquestionsParam.questionTypeId;
                            }
                        }
                        papersquestionsParam.pageNum = 1;
                        papersquestions();
                        $(".addLineQuestion_questiontype dd span.on").removeClass("on");
                        $(this).addClass("on");
                    });
                    //题库
                    papersquestions();
                    function papersquestions() {
                        $('#h_load').show();
                        type == "work" ? $this.ajax.hjPapersquestions(true,papersquestionsParam,sPapersquestions,ePapersquestions) : $this.ajax.hjPpapertestquestions(true,papersquestionsParam,sPapersquestions,ePapersquestions);
                        function sPapersquestions(data) {
                            var pages = data.retData.pages;//可以返回的总页数
                            questionsBox(data);
                            initKkpager(pages);
                            $('#h_load').hide();
                        }
                        function ePapersquestions() {
                            $this.class("addLineQuestion_middle_questions")[0].innerHTML = "<img class='nodata' src='../../static/image/nodata.png' />";
                            document.getElementById("kkpager").innerHTML = "";//清空分页
                            $this.storage.setLocal(type,"currentlist","");//清空缓存的旧分页的题目
                            $('#h_load').hide();
                        }
                        function questionsBox(data) {
                            var data = data.retData;
                            data = $this.Data.hjQuestionLines(data,type,subject);
                            $this.storage.setLocal(type,"currentlist",JSON.stringify(data));//缓存当前分页的题目，以备选入方法使用
                            $this.class("addLineQuestion_middle_questions")[0].innerHTML = $this.Html.hjQuestionLines({type:thisType,subject:thisSubject,data:data,btnobj:{analysis:true,error:true,choice:true}});
                            var newlistarr = $this.storage.getLocal(type,"newlistarr");//已选入的题目添加状态
                            newlistarr = newlistarr ? JSON.parse(newlistarr) : [];
                            for(var i = 0;i<newlistarr.length;i++){
                                var optInId = newlistarr[i],
                                    nowList = $(".addLineQuestion_middle_questions .options_choice");
                                for(var j = 0;j<nowList.length;j++){
                                    var jId = nowList[j].getAttribute("data-id");
                                    if(jId == optInId){
                                        $(nowList[j]).addClass("on").text("取消");
                                        break;
                                    }
                                }
                            }
                            $(".addLineQuestion_middle").scrollTop(0);
                            intMathJax();//公式
                        }
                        //分页设置
                        function initKkpager(pages) {
                            document.getElementById("kkpager").innerHTML = "";//清空旧分页
                            if(pages < 2) return;//如果总页码小于2，不加载分页
                            kkpager.total = pages;//总页码
                            kkpager.totalRecords = papersquestionsParam.pageSize * pages;//总数据条数
                            var ssd = kkpager.generPageHtml({
                                pno : 1,//初始页
                                mode : 'click',
                                click : function(n){
                                    papersquestionsParam.pageNum = n;
                                    type == "work" ? $this.ajax.hjPapersquestions(true,papersquestionsParam,sPapersquestionsNoList,ePapersquestionsNoList) : $this.ajax.hjPpapertestquestions(true,papersquestionsParam,sPapersquestionsNoList,ePapersquestionsNoList);
                                    function sPapersquestionsNoList(data) {
                                        questionsBox(data);
                                    }
                                    function ePapersquestionsNoList(data) {
                                        $this.class("addLineQuestion_middle_questions")[0].innerHTML = "<p style='text-align: center;color: #999;'>抱歉，获取列表失败！</p>";
                                        $this.storage.setLocal(type,"currentlist","");//清空缓存的旧分页的题目
                                    }
                                    this.selectPage(n);
                                }
                            },true);
                        }
                    }
                    //事件代理
                    $this.event.clickSeeanalysis(".addLineQuestion_middle_questions");//查看解析
                    $this.event.clickOptIn({orderLineNumber:orderLineNumber,type:type,subject:thisSubject,codeArr:codeArr});//选入/选出
                    $this.components.clickUpError(".addLineQuestion_middle_questions");//报错
                    $this.event.clickOptInDone({orderLineNumber:orderLineNumber,type:type,subject:thisSubject,lineId:lineId});//完成加题 / 嵌套题型映射
                }
            },
            clickUpError:function (agent) {
                $(agent).on("click",".options_error",function () {
                    var questionId = this.getAttribute("data-id");
                    $this.ajax.hjError(true,{},sError,eError);//请求错误类型
                    function sError(data) {
                        //界面
                        var lies="",
                            data = data.retData;
                        for(var i = 0;i<data.length;i++){
                            lies += "<li class='m_errorPoints fl' id='" + data[i].value + "'>" + data[i].label + "</li>";
                        }
                        var errorHtml = '<div class="m_submitErrors_Main"><div class="m_submitErrors"><i class="spriteImg c_closeico fr c_closeimg0" id="c_closeG2"></i><p>报错</p><ul class="m_errorPointsBox">' + lies + '</ul><textarea name="" id="errorReason" maxlength="100"  placeholder="请输入错误原因(请输入100字以内)"></textarea><input type="button" class="m_submitErrorsSure" value="确&nbsp;定"><input type="button" class="m_submitErrorsCancel" value="取&nbsp;消"></div></div>';
                        if(!$("div").hasClass("m_submitErrors_Main")){
                            $("body").append(errorHtml);
                        }else{
                            $(".m_errorPointsBox").html(lies);
                        }
                        //事件
                        $("#errorReason").val("");//清空旧错误原因
                        $(".m_submitErrorsSure").removeAttr("style");//清除旧检查状态
                        $(".m_submitErrors_Main").fadeIn(200);
                        $(".m_submitErrorsCancel").on("click",function(){
                            $(".m_submitErrors_Main").fadeOut(200);
                        });
                        $("#c_closeG2").on("click",function(){
                            $(".m_submitErrors_Main").fadeOut(200);
                        });
                        var errorType = null;
                        $(".m_errorPointsBox").on("click",".m_errorPoints",function(){
                            $(this).addClass("e_active").siblings().removeClass("e_active");
                            errorType=$(this).attr("id");
                            //输入和点击检查
                            var _valLength = $("#errorReason").val().length;
                            if(_valLength > 0 && _valLength < 100){
                                $(".m_submitErrorsSure").css({"background-color":"#65b113","border-color":"#65b113"});
                            }
                        });
                        //输入和点击检查
                        $("#errorReason").on("keyup",function(){
                            var _valLength = $(this).val().length;
                            if($(".m_errorPointsBox li").hasClass("e_active") && _valLength > 0 && _valLength <= 100){
                                $(".m_submitErrorsSure").css({"background-color":"#65b113","border-color":"#65b113"});
                            }else{
                                $(".m_submitErrorsSure").removeAttr("style");
                            }
                        });
                        //报错
                        $(".m_submitErrorsSure").on("click",function(){
                            var errorReason=$("#errorReason").val();
                            var errorParam = {};
                            errorParam.questionId=questionId;
                            errorParam.errorType=errorType;
                            errorParam.errorResean=errorReason;
                            if(!errorType){
                                $this.warn("请选择错误类型");
                            }else if(errorReason.length == 0){
                                $this.warn("请输入错误描述");
                            }else if(errorReason.length > 100){
                                $this.warn("请输入少于100字");
                            }else{
                                $this.ajax.hjSavequestionerror(true,errorParam,sSavequestionerror,eSavequestionerror);
                                function sSavequestionerror(data) {
                                    if(data.retCode=="0000"){
                                        $(".m_submitErrors_Main").fadeOut(200);
                                        $this.warn("报错成功");
                                        $(".m_submitErrorsSure").off().removeAttr("style");//解除绑定,删除样式
                                    }else if(data.retCode=="1111"){
                                        $this.warn("失败，已达每日20次上限");
                                        $(".m_submitErrorsSure").removeAttr("style");//删除样式
                                    }else{
                                        $this.warn("报错失败");
                                    }
                                }
                                function eSavequestionerror() {
                                    $this.warn("报错失败,请检查网络");
                                }
                            }
                        });
                    }
                    function eError() {
                        $this.warn("无法获取错误类型，请联系管理员");
                    }
                });
            },
            timeing:function (node,value) {
                var thisWrap = "." + node;
                var thisUp = thisWrap + "_up",
                    thisDown = thisWrap + "_down",
                    thisTimes = [],
                    thisHtml = "";
                thisHtml = "<span>时间：</span><ul><span class='" + thisUp.replace(/./,"") + "'>上翻</span><span class='" + thisDown.replace(/./,"") + "'>下翻</span><li><input class='t_time' type='text' value=''></li><li>" + value + "</li><li>30</li><li>35</li><li>40</li><li>45</li><li>50</li><li>55</li><li>60</li><li>65</li><li>70</li><li>75</li><li>80</li><li>85</li><li>90</li><li>95</li><li>100</li><li>105</li><li>110</li><li>115</li><li>120</li><li>125</li><li>130</li><li>135</li><li>140</li><li>145</li><li>150</li></ul><span>分钟</span>";
                $(thisWrap).html(thisHtml);
                //事件
                var _times = $(thisWrap).find("li");
                for(var i = 1;i < _times.length;i++){
                    thisTimes.push(Number($(_times[i]).text()));
                }
                var papertime = thisTimes[0];
                $(thisWrap).find("input").val(papertime);//设置默认时间
                //去重
                thisTimes = thisTimes.unique();
                //排序
                thisTimes.sort(function(a,b){
                    return a-b});
                //上翻
                $(thisUp).on("click",function () {
                    var num = thisTimes.indexOf(Number($(thisWrap).find("input").val())) + 1;
                    if(num < thisTimes.length){
                        $(thisWrap).find("input").val(thisTimes[num]);
                        var testTime = $(".t_time").val();
                        if($this.checkNum(testTime)){
                            $(".t_time").removeClass("wrong");
                        }
                    }
                });
                //下翻
                $(thisDown).on("click",function () {
                    var num = thisTimes.indexOf(Number($(thisWrap).find("input").val())) - 1;
                    if(num >= 0){
                        $(thisWrap).find("input").val(thisTimes[num]);
                    }
                });
                //输入检查
                $(".t_time").on("keyup",function () {
                    var testTime = $(this).val();
                    if($this.checkNum(testTime)){
                        $(this).removeClass("wrong");
                    }else{
                        $(this).addClass("wrong");
                    }
                });
            }
        };
    };
    //逻辑层继承原型链
    init.prototype = WorkTest.prototype;
    //初始化业务构建函数的使用方法
    window.$H = WorkTest();
}());
//数组的不改变顺序去重方法
Array.prototype.unique = function () {
    var newObj = {},
        newArr = [];
    for(var i = 0;i<this.length;i++){
        if(!(this[i] in newObj)){
            newArr.push(this[i]);
            newObj[this[i]] = true;
        }
    }
    return newArr;
};
