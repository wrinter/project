/**
 * Created by lc on 2017/4/13.
 */
SystemRedMsg();
/******************************获取导航*******************************/
$(document).ready(function(){
    CheckBrower();//检查浏览器版本；
    GetHtml("../../model/common/common.txt","#Header");//引入导航
    menuId = JSON.parse(localStorage.getItem("menuId"));
//    获取试题
    var p_mei = $(".p_mei").clone(true);
    document.addEventListener('click',function(e){
        if(e.target.className.indexOf("p_Directory_ico")==-1){
            $(".p_DirectoryWrap").fadeOut(300);
        }
    });
//下载试题
    function  getText(knowledgeId){
        var parmars = {};
        parmars.knowledgeId = knowledgeId;
        parmars.menuId = menuId;
        $(".p_loadcon").html("");
        $.ajax({
            type:"post",
            url:"/web/teacher/prepare/exmplarsList",
            data:parmars,
            dataType: "json",
            success:function(data){
                if(data.retCode == "0000"){
                    Data(data);
                    intMathJax();//公式
                }else{
                    $(".p_loadcon").html("<div class='nothing'><img class='kolano' src='../../static/image/kola/no.png' /></div>");
                    $(".p_loadtexttitle").text("");
                }
            },
            error:function(e){
                console.log(e);
            }
        })
    }
//    试题样式处理
    function Data(data){
	    console.log(data)
        var Num = 0;
        var pNum = 0;
        //重新加载一遍下载和报错按钮
        var $Reload = createReload();
        var $errors = Errors();
        var questionList = data.retData.questionList;
        var p_loadtexttitle = $(".p_loadtexttitle");
        var p_loadcon = $(".p_loadcon");
        for(var i=0;i<questionList.length;i++){
            Num++;
            var Dtrue = questionList[i];
            for(var M in Dtrue){//判空
                if(Dtrue[M] == null){
                    Dtrue[M] = "";
                }
            }//判空
            var id= Dtrue.id;
            var testId = data.retData.testId;
            var testTitle = data.retData.testTitle;
            var optionA = Dtrue.optionA;
            var optionB = Dtrue.optionB;
            var optionC = Dtrue.optionC;
            var optionD = Dtrue.optionD;
            var videoId = Dtrue.videoId;
            var videoPicture = Dtrue.videoPicture;
            var groupCode = Dtrue.groupCode;
            var questionData = Dtrue.questionData;
            p_loadtexttitle.html(testTitle);//标题
            var $question = $("<li class='question' id='"+id+"' testId='"+testId+"'></li>").appendTo(p_loadcon);//试卷存放处
            var $optionul = $("<div class='optionul'></div>").appendTo($question);//选项
            var $answer = $("<div class='answer'></div>").appendTo($question);//答案
            if(optionA){
                var chooseA = $("<div class='chooseA'>"+optionA+"</div>").appendTo($optionul);
                var chooseB = $("<div class='chooseB'>"+optionB+"</div>").appendTo($optionul);
                var chooseC = $("<div class='chooseC'>"+optionC+"</div>").appendTo($optionul);
                var chooseD = $("<div class='chooseD'>"+optionD+"</div>").appendTo($optionul);
            }
            for(var j = 0 ; j<Dtrue.list.length;j++){
                var lDtrue = Dtrue.list[j];
                var questionType= lDtrue.questionType;
                var content = lDtrue.content.replace(/题干/i,"").replace(/答案/i,"").replace(/解析/i,"").replace(/破题入口/i,"").replace(/规律总结/i,"").replace(/答题步骤模板/i,"").replace(/解题思维模板/i,"").replace(/答题指导/i,"");
                var content = content.replace(/解题指南/i,"").replace(/特别提醒/i,"").replace(/易错警示/i,"").replace(/解题技巧/i,"");
                if(questionType != 13 || questionType != "13"){
                    content = content.replace("【","");
                    content = content.replace("】","");
                    content = content.replace(/题<\/span><span>干/g,' ');
                }//非类型
                if(questionType == "13" || questionType == 13){
                    var $classfify = $("<span class='classfify' style='/*background:#fff100;*/display: inline-block;'>"+content+"</span>").prependTo($question);
                }else if(questionType == "01" || questionType == 01){
                    var $topic = $("<div class='topic'><label>"+Num+"、</label></div>").insertBefore($optionul);
                    var $topicp = $("<div class='topicp'>"+content+"</div>").appendTo($topic);
                }//类型
                switch (questionType){
                    case"14" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>答题指导</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                    case"15" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>易错警示</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                    case"16" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>规律总结</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                    case"20" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>解题指南</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                    case"21" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>解题技巧</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                    case"22" :
                        var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answer);
                        var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>特别提醒</span>").appendTo($answerName);
                        var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                        break;
                }//有样式的标签
                switch (questionType){
                    case"03" : var $answerName= $("<div class='answerName'>【正确答案】</div>").appendTo($answer);
                        var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answer);
                        break;
                    case"05" : var $answerName= $("<div class='answerName'>【答案解析】</div>").appendTo($answer);
                        var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answer);
                        break;
                    case"19" : var $answerName= $("<div class='answerName'>【破题入口】</div>").appendTo($answer);
                        var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answer);
                        break;
                    case"26" : var $answerName= $("<div class='answerName'>【解题思维模板】</div>").appendTo($answer);
                        var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answer);
                        break;
                    case"27" : var $answerName= $("<div class='answerName'>【答题步骤模板】</div>").appendTo($answer);
                        var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answer);
                        break;

                }//无样式的标签
            }//普通試題
            if(videoId){
                var $video = $("<div class='video' videoId='"+videoId+"'></div>").appendTo($question);
                var $answerName= $("<div class='answerName'>【视频解析】</div>").appendTo($video);
                var $answerData = $("<img class='videoClick' videoId='"+videoId+"' src='"+videoPicture+"' />").appendTo($video);
                var $answerPlay = $("<div class='answerPlay'></div>").appendTo($video);
            }//視頻
            //判断是否组合体
            if(groupCode){
                var $Prehps = $("<div class='Prehps'></div>").insertBefore($answer);
                var $questionData = $("<div class='questionData'>"+questionData+"</div>").appendTo($Prehps);
                for(var k=0;k<Dtrue.prepares.length;k++){

                    var pDtrue = Dtrue.prepares[k];
                    var optionA = pDtrue.optionA;
                    var optionB = pDtrue.optionB;
                    var optionC = pDtrue.optionC;
                    var optionD = pDtrue.optionD;
                    var $optionPul = $("<div class='optionul'></div>").appendTo($Prehps);//选项
                    var $answerPser = $("<div class='answerPser'></div>").appendTo($Prehps);//选项
                    if(optionA){
                        var chooseA = $("<div class='chooseA'>"+optionA+"</div>").appendTo($optionPul);
                        var chooseB = $("<div class='chooseB'>"+optionB+"</div>").appendTo($optionPul);
                        var chooseC = $("<div class='chooseC'>"+optionC+"</div>").appendTo($optionPul);
                        var chooseD = $("<div class='chooseD'>"+optionD+"</div>").appendTo($optionPul);
                    }//组合题选择
                    for(var m = 0; m < pDtrue.list.length;m++){
                        var cDtrue = pDtrue.list[m];
                        var questionType = cDtrue.questionType;
                        var content = cDtrue.content.replace(/题干/i,Num+"、").replace(/答案/i,"").replace(/解析/i,"").replace(/破题入口/i,"").replace(/规律总结/i,"").replace(/答题步骤模板/i,"").replace(/解题思维模板/i,"").replace(/答题指导/i,"");
                        var content = content.replace(/解题指南/i,"").replace(/特别提醒/i,"").replace(/易错警示/i,"").replace(/解题技巧/i,"");
                        if(questionType != 13 || questionType != "13"){
                            content = content.replace("【","");
                            content = content.replace("】","");
                            content = content.replace(/题<\/span><span>干/g,' ');
                        }//非类型
                        if(questionType == "13" || questionType == 13){
                            var $classfify = $("<span class='classfify' style='background:#fff100;display: inline-block;'>"+content+"</span>").prependTo($question);
                        }else if(questionType == "01" || questionType == 01){
                            var $topic = $("<div class='topic'>"+content+"</div>").insertBefore($optionPul);
                        }//类型
                        switch (questionType){
                            case"14" : var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answerPser);
                                var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>答题指导</span>").appendTo($answerName);
                                var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                                break;
                            case"15" : var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answerPser);
                                var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>易错警示</span>").appendTo($answerName);
                                var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                                break;
                            case"16" : var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answerPser);
                                var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>规律总结</span>").appendTo($answerName);
                                var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                                break;
                            case"20" : var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answerPser);
                                var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>解题指南</span>").appendTo($answerName);
                                var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                                break;
                            case"21" : var $answerName= $("<div class='answerName anewerStyle'></div>").appendTo($answerPser);
                                var $ico = $("<img class='Example_ico' src='../../../static/image/prepare/Example_ico.png' /><span class='summaryName'>解题技巧</span>").appendTo($answerName);
                                var $answerData = $("<div class='summaryData'>"+content+"</div>").appendTo($answerName);
                                break;
                        }//有样式的标签
                        switch (questionType){
                            case"03" : var $answerName= $("<div class='answerName'>【正确答案】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;
                            case"05" : var $answerName= $("<div class='answerName'>【答案解析】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;
                            case"19" : var $answerName= $("<div class='answerName'>【破题入口】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;
                            case"22" : var $answerName= $("<div class='answerName'>【特别提醒】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;
                            case"26" : var $answerName= $("<div class='answerName'>【解题思维模板】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;
                            case"27" : var $answerName= $("<div class='answerName'>【答题步骤模板】</div>").appendTo($answerPser);
                                var $answerData = $("<div class='answerData'>"+content+"</div>").appendTo($answerPser);
                                break;

                        }//无样式的标签
                    }
                }
            }//组合题
        }
        //看视频
        $(".videoClick").on("click",function(){
            var _this = $(this);
            var videoId = $(this).attr("videoId");
            var answerPlay = $(this).siblings(".answerPlay");
            $.ajax({
                type:"post",
                url:"/web/teacher/prepare/file/play",
                data:{fileId:videoId},
                dataType:"json",
                success:function(data){
                    var retcode = data.retCode;
                    if(retcode == "0000"){
                        var playCode = data.retData.playCode;
                        answerPlay.html(playCode);
                        _this.css({"display":"none"});
                    }
                }
            })
        });
        //划入出现
        $(".question").on("mouseover",function(){
            var p_errors = $(this).children(".p_errors");
            if(p_errors.length<=0){
                $Reload.addClass("add")
                $Reload.appendTo(this);
            };
        });
        //报错
        $(".question").on("mouseover",function(){
            var p_errors = $(this).children(".p_errors");
            if(p_errors.length<=0){
                $errors.addClass("add");
                $errors.appendTo(this);
            };
        });
    }
//引进样式
    css();
    function css(){
        $.ajax({
            type:"post",
            url:"/web/common/commonStyle",
            dataType:"json",
            success:function(data){
                if(data.retCode == "0000"){
                    var retData = data.retData;
                    $("head").append(retData);
                }
            },
            error:function(e){
                console.log(e)
            }
        })
    }
//    下载
    function post(url, params) {
        var temp = document.createElement("form");
        temp.action = url;
        temp.method = "post";
        temp.style.display = "none";
        //var opt = document.createElement("input");
        //opt.value = params;
        //temp.appendChild(opt);
        document.body.appendChild(temp);
        temp.submit();
        return temp;
    }//下载动态生成form表格
//    下载按钮
    function createReload(){
        var $p_reloadcon = $("<a class='p_reloadcon'></a>");
        var $new = $("<div  class='p_reload'></div>").appendTo($p_reloadcon);
        var $reload = $("<span class='p_reloadword'>下载</span>").appendTo($new);
        var $useup = $("<div class='p_useup'>1金币</div>").appendTo($p_reloadcon);
        return $p_reloadcon.on("click",function(){
            var id = $(this).closest(".question").attr("id");
            var parma = {};
            parma.resourceId = id;
            parma.type = "example";
            parma.resType = "5";
            load();
            function load(){
                $.ajax({
                    type : "post",
                    url : "/web/teacher/download/obtain",
                    data : parma,
                    dataType : "json",
                    success : function(data){
                        if(data.retCode == "0000"){
                            var usable = data.retData;
                            if(usable == 2 || usable == "2"){
                                $(".p_shark,.p_reloadfalse").show();
                                return false;
                            }
                            if(usable == 3 || usable == "3"){
                                $(".p_sharks").show();
                                return false;
                            }
                            if(usable == 1 || usable == "1"){
                                var params = {};
                                params.resQuestionId = id;
                                var url = "/web/teacher/prepare/exemplarsDownload?resQuestionId="+id;
	                            post(url, params);
                            }else{
                                $(".p_shark,.p_reloadfalse").show();
                            }
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                })
            }

        });
    }//点击下载按钮
    $(".p_success_remove").on("click",function(){
        $(".p_sharks").hide();
    })
    var $Reload = createReload();
    $(".p_checkname").on("click",function(){
        window.location.href = "../me/me_certification.html";
    })

    $(".p_success_dele").on("click",function(){
        $(".p_shark,.p_reloadfalse").hide();
    });
    $(".p_name").on("click",function(){
        window.location.href = "../me/me_pay.html"
    });
//    报错按钮
    function Errors(){
        var $new = $("<div  class='p_errors'></div>");
        var $reload = $("<span class='p_errorsword'>发现错误？<span class='p_errorsClick'>请报错</span></span>").appendTo($new);
        return $new.on("click",function(){
            $(".p_shark,.p_wrong").show();
            $(".p_errortype").removeClass("p_ceselect");
            var questionId = $(this).closest(".question").attr("id");
            sessionStorage.setItem("questionId",JSON.stringify(questionId));
        });
    };//报错按钮
    var $errors = Errors();
    $(".p_cedelte,.p_cecancel").on("click",function(){
        $(".p_shark,.p_wrong").hide();
    })
    //报错
    var p_ceselect = $(".p_errortype").clone(true);
    getErrortype ();
    function getErrortype (){
        var p_wrongselect = $(".p_wrongselect");
        p_wrongselect.html("");
        $.ajax({
            type : "post",
            url : "/web/common/report/error",
            dataType : "json",
            success : function(data){
                if(data.retData == null){
                    return false;
                }
                var p_wrongselect = $(".p_wrongselect");
                for(var i = 0;i<data.retData.length;i++){
                    var Dtrue = data.retData[i];
                    var value = Dtrue.value;
                    var lable = Dtrue.label;
                    var newclone = p_ceselect.clone(true);
                    newclone.attr("value",value);
                    newclone.text(lable);
                    //    选择类型
                    newclone.on("click",function(){
                        $(this).addClass("p_ceselect").siblings(".p_errortype").removeClass("p_ceselect");
                    })
                    newclone.appendTo(p_wrongselect)
                }

            },
            error :function(e){
                console.log(e);
            }
        })
    }//报错列表
//    点击报错
    clickError();
    function clickError(){
        $(".p_cesend").on("click",function(){
            var questionId = JSON.parse(sessionStorage.getItem("questionId"));
            var parmas = {};
            parmas.errorType = $(this).closest(".p_wrong").find(".p_ceselect").attr("value");
            parmas.errorResean = $(this).closest(".p_wrong").find(".p_wrongresaon").val();
            parmas.questionId = questionId;
            var errorResean = $(this).closest(".p_wrong").find(".p_wrongresaon");
            if(!parmas.errorResean){
                errorResean.focus();
                return false;
            }
            $.ajax({
                type : "post",
                url : "/web/teacher/paper/assign/savequestionerror",
                data : parmas,
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        $(".p_shark").fadeOut();
                        if($(".p_errortype").hasClass("p_ceselect")){
                            $(".p_errortype").removeClass("p_ceselect");
                        }
                        $(".p_wrongresaon").val("");
                        //location.reload();
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        })
    }//提交报错原因
    /******************************************************新章节知识点树********************************************************/
//新章节知识点树
    KnowledgeTree();
    function KnowledgeTree(){
        var SubData={};
        SubData.menuId=store.get('menuId');
        $.ajax({
            "type": "post",
            "url": "/web/common/teacher/knowledgetree",
            "dataType": "json",
            "data": SubData,
            success: function (data) {
                var AllData=data.retData;
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0){
                    GetChapter(AllData)
                }
            }
        });
    };
//获取章节知识点树
    function GetChapter(data){
        //console.log(data);
        var Data=data;
        var newArray = [];//单节点递归解析
        function RecursiveData(data,level) {
            var newObj ={};
            newObj.id = data.knowledgeId;
            newObj.alias = data.alias;
            newObj.name = data.name;
            newObj.parentId = data.parentId;
            newObj.levelName = data.levelName;
            newObj.level = level;
            newArray.push(newObj);
            if(data.childrens){
                //递归
                level++;
                $.each(data.childrens,function (i,obj) {
                    RecursiveData(obj,level);
                });
            }
            return newArray;
        }
        var newArrays = [];//拼接单节点数据
        $.each(Data,function (i,obj) {
            var Level=1;
            newArrays = RecursiveData(obj,Level);
        });
        //初始化html
        $('#c_Kownledge').html("");//清空
        var $html='';
        $html+= FirstKownledge(Data);//一级
        if(Data.length>0){
            var  thisId=Data[0].knowledgeId;//一级DOM节点ID
            $('#c_Kownledge').append($html);
            Recursive(thisId,newArrays);//递归插入html
            GetLeafData(newArrays);//切换操作
            GetLastid(newArrays);//获取默认
        }
    }
//有上次记录的情况
    function IsLastRecord(DefultId,newArrays){
        var LeafArr=[];
        //递归默认层级
        function LastKownledge(DefultId,data){
            for(var i=0;i<data.length;i++){
                var NewIdArr=[];
                var ComPactId=data[i].id
                if(ComPactId.indexOf('-')){
                    NewIdArr=ComPactId.split('-');
                }else {
                    NewIdArr[0]=ComPactId
                }
                for(var j=0;j<NewIdArr.length;j++){
                    if(NewIdArr[j]==DefultId){
                        LeafArr.push(data[i])
                        LastKownledge(data[i].parentId,data)
                    }
                }
            }
            return LeafArr;
        };
        var LeafMain=LastKownledge(DefultId,newArrays);
        //console.log(LeafMain)
        getText(DefultId);
        var FirstThisId=LeafMain[LeafMain.length-1].id;//一级DOM节点ID
        var FirstThisDom='#'+LeafMain[LeafMain.length-1].id;//一级DOM节点
        var $FirstDom=$(FirstThisDom).parents('.c_Directory');//一级DOM节点
        //$FirstDom.nextAll().remove();//首先清除一级之后的内容，子类菜单初始化
        for(var i=LeafMain.length-1;i>-1;i--){
            var ThisId=LeafMain[i].id;
            var ThisDom='#'+LeafMain[i].id;
            $(ThisDom).css('color','#65b113');
            $(ThisDom).siblings('.GetData').css('color','#333');
            var $ThisDom=$(ThisDom).parents('.c_Directory');//当前级DOM节点
            $ThisDom.nextAll().remove();//首先清除下级之后内容，子类菜单初始化
            Recursive(ThisId,newArrays);//递归插入html
        };

    }
//没有上次记录的情况
    function IsDefultRecord(){
        $('.c_Directory').eq(0).find('li').eq(0).click();
    }
//生成一级菜单
    function FirstKownledge(FirstData){
        var $Html='';
        if(FirstData==null||FirstData.length==0){
            $('#c_Kownledge').html('<div class="NoData p_nodata" id="NoData"><img src="../../static/image/kola/no.png" class="NoDataImg" alt=""></div>');
            $('.videoBox').hide();
            return false;
        }
        $('.videoBox').show();
        $Html+='<div class="c_Directory">';
        $Html+='<p class="FirstName">'+FirstData[0].levelName+'：</p>';
        $Html+='<ul class="c_DirectoryList" >';
        for(var i=0;i<FirstData.length;i++){
            var Name=FirstData[i].name;
            var knowledgeId=FirstData[i].knowledgeId;
            var alias=FirstData[i].alias;
            var parentId=FirstData[i].parentId;
            if(alias==null){
                $Html+='<li id="'+knowledgeId+'"  class="GetData" title="'+Name+'" data-parentId="'+parentId+'">'+Name+'</li>';
            }else {
                $Html+='<li id="'+knowledgeId+'" class="GetData" title="'+Name+'  '+alias+'" data-parentId="'+parentId+'">'+Name+'</li>';
            }
        }
        $Html+='</ul>';
        $Html+='</div>';
        return $Html;
    };
//菜单多级联动点击事件
    function GetLeafData(newArrays){
        $('.GetData').off('click');
        $('.GetData').on('click',function(){
            var $Dom=$(this).parents('.c_Directory');
            var ThisId=$(this).attr('id');
            $Dom.nextAll().remove();
            Recursive(ThisId,newArrays);
            var IsCanGetCat=($Dom.nextAll().length==0);//判断是否最后一层
            if(IsCanGetCat){
                SaveLastId(ThisId);
                getText(ThisId);//默认获取最后一级的第一个文章
            }else {
                for(var i=0;i<$Dom.nextAll().length;i++){
                    $Dom.nextAll().eq(i).find('li').eq(0).css('color','#65b113');//默认选中每一级的第一样式
                    $Dom.nextAll().eq(i).find('li').eq(0).siblings('.GetData').css('color','#333')//默认选中每一级的第一样式
                }
                var LastId=$Dom.nextAll().eq($Dom.nextAll().length-1).find('li').eq(0).attr('id');
                SaveLastId(LastId);//默认记录最后一级的第一个
                getText(LastId);//默认获取最后一级的第一个文章
            }
            $(this).css('color','#65b113');
            $(this).siblings('.GetData').css('color','#333');
        });
    };
//递归循环
    function Recursive(thisId,newArrays){
        var $Html = "",
            $HtmlNew = "",
            oArr = [];
        var Bool=false;
        var levelName='';
        var NewIdArr=[];
        if(thisId.indexOf('-')){
            NewIdArr=thisId.split('-');
        }else {
            NewIdArr[0]=thisId
        }
        $.each(newArrays,function (i,obj) {
            for(var i=0;i<NewIdArr.length;i++){
                if(obj.parentId==NewIdArr[i]){
                    Bool=true;
                    oArr.push(obj.id);
                    if(obj.alias==null){
                        $HtmlNew+='<li id="' + obj.id + '" class="GetData" title="'+obj.name+'" data-parentId="'+obj.parentId+'">'+obj.name+'</li>';
                    }else {
                        $HtmlNew+='<li id="' + obj.id + '" class="GetData" title="'+obj.name+'  '+obj.alias+'" data-parentId="'+obj.parentId+'">'+obj.name+'</li>';
                    }
                    levelName=obj.levelName;
                }
            }

        });
        $Html+='<div class="c_Directory">';
        $Html+='<p class="FirstName">'+levelName+'：</p>';
        $Html+='<ul class="c_DirectoryList">'+$HtmlNew+'</ul>';
        $Html+='</div>';
        //DOM添加
        if(Bool){$('#c_Kownledge').append($Html);}
        //递归
        if(oArr.length > 0){
            var _ids = "#" + oArr[0];
            $(_ids).addClass("on");
            Recursive(oArr[0],newArrays);
        }
        //console.log(newArrays)
        GetLeafData(newArrays)
    };
//获取上次记录Id
    function GetLastid(newArrays){
        var SubData={};
        SubData.menuId=store.get('menuId');
        $.ajax({
            "type": "post",
            "url": "/web/common/teacherandstudent/lastcode",
            "dataType": "json",
            "data": SubData,
            success: function (data) {
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0){
                    var DefultId=data.retData;
                    //是否含有上次记录
                    if(DefultId==''||DefultId==null){
                        IsDefultRecord();
                    }else {
                        IsLastRecord(DefultId,newArrays);
                    }
                }
            }
        });
    };
//记录最后一次id
    function SaveLastId(LastId){
        var SubData={};
        SubData.menuId=store.get('menuId');
        SubData.lastCode=LastId;
        $.ajax({
            "type": "post",
            "url": "/web/common/teacherandstudent/savelastcode",
            "dataType": "json",
            "data": SubData,
            success: function (data) {
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0){

                }
            }
        });
    };
});

