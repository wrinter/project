
/**
 * Created by lgr on 2016/11/28.
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
    //重新加载一遍下载和报错按钮
    var $Reload = createReload();
    var $errors = Errors();
    var questionnum = 0;
    $.ajax({
        type:"post",
        url:"/web/teacher/prepare/exmplarsList",
        data:parmars,
        dataType: "json",
        success:function(data){
            if(data.retCode == "0000"){
                var questionList = data.retData.questionList;
                var p_loadtexttitle = $(".p_loadtexttitle");
                for(var i=0;i<questionList.length;i++){
                    var newclone = p_mei.clone(true);
                    var p_cons = newclone.find(".p_cons");
                    var p_con = newclone.find(".p_con");
                    var Dtrue = data.retData.questionList[i];
                    var id= Dtrue.id;
                    var testId = data.retData.testId;
                    var testTitle = data.retData.testTitle;
                    var videoId = data.retData.questionList[i].videoId;
                    var groupCode = data.retData.questionList[i].groupCode;
                    var questionData = data.retData.questionList[i].questionData;
                    newclone.find(".p_moneycl").hide();
                    //标题
                    p_loadtexttitle.text(testTitle);
                    newclone.attr({"id":id,"testId":testId});
                    //question里面的
                    p_cons.each(function(){
                        var htype = $(this).attr("htype");
                        var name = Dtrue[$(this).attr("name")] ;
                        if(htype == "text"){
                            $(this).html(name)
                        }else if(htype == "value"){
                            $(this).attr("videoId",name)
                        }else if(htype == "imge"){
                            if(!videoId){
                                $(this).closest(".p_analysisvodeo").hide()
                            }
                            $(this).attr("src",name);
                        }
                    });
                    //list里面的东西
                    for(var j=0;j<questionList[i].list.length;j++){
                        p_con.each(function(){
                            var tDtrue = questionList[i].list[j];
                            var showOrder = tDtrue.showOrder;
                            var  content = tDtrue.content.replace("【题干】",(questionnum+1)+"、").replace("【<span><span>题干</span></span>】",(questionnum+1)+"、");
                            var questionType = tDtrue.questionType;
                            var isinput = $(this).attr("isinput");
                            if(isinput == questionType){
                                if(questionType == "01"){
                                    questionnum++;
                                    $(this).html(content);
                                }else{
                                    $(this).html(content);
                                }
                            }
                        })
                    }
                    //判断是否组合体
                    if(!groupCode){

                    }else{
                        for(var k=0;k<questionList[i].prepares.length;k++){
                            var pDtrue = questionList[i].prepares[k];
                            var optionA = pDtrue.optionA;
                            var optionB = pDtrue.optionB;
                            var optionC = pDtrue.optionC;
                            var optionD = pDtrue.optionD;
                            //question里面的
                                var $optionul = $("<p class='p1 optionul"+k+"'></p>");
                                var $optionA = $("<p class='p1 optionA"+k+"'>"+optionA+"</p>");
                                var $optionB = $("<p class='p1 optionB'>"+optionB+"</p>");
                                var $optionC = $("<p class='p1 optionC'>"+optionC+"</p>");
                                var $optionD = $("<p class='p1 optionD"+k+"'>"+optionD+"</p>");
                                var $option = $("<p class='p1 optionulanwser"+k+"'></p>")
                                $optionul.append($optionA);
                                $optionul.append($optionB);
                                $optionul.append($optionC);
                                $optionul.append($optionD);
                                newclone.find(".groupcode").append($optionul);
                                newclone.find(".groupcode").append($option);
                            //list 2
                            for(var m=0;m<pDtrue.list.length;m++){
                                var content = pDtrue.list[m].content.replace("【题干】","").replace("【<span><span>题干</span></span>】","");
                                var questionType = pDtrue.list[m].questionType;
                                if( questionType == "01"){
                                    var $cont = $("<p class='content p1' m='"+m+"'>"+content+"</p>").insertBefore(newclone.find(".optionA"+k+""));
                                }else if(questionType == "07"){

                                }else{
                                    var $conts = $("<p class='conts p1' m = '"+m+"'>"+content+"</p>");
                                    newclone.find(".optionulanwser"+k+"").append($conts);
                                }
                            }
                        }
                    }
                    //看视频
                    newclone.find(".p_analysisvo").on("click",function(){
                        var videoId = $(this).siblings(".videoId").attr("videoId");
                        var p_exampleradio = $(this).siblings(".p_exampleradio");
                        $(this).css({"visibility":"hidden"});
                        $.ajax({
                            type:"post",
                            url:"/web/teacher/prepare/file/play",
                            data:{fileId:videoId},
                            dataType:"json",
                            success:function(data){
                                var retcode = data.retCode;
                                if(retcode == "0000"){
                                    var playCode = data.retData.playCode;
                                    p_exampleradio.html(playCode);
                                }
                            }
                        })
                    });

                    //下载
                    newclone.on("mouseover",function(){
                        var p_errors = $(this).children(".p_errors");
                        if(p_errors.length<=0){
                            $Reload.addClass("add")
                            $Reload.appendTo(this);
                        };
                    });
                    //报错
                    newclone.on("mouseover",function(){
                        var p_errors = $(this).children(".p_errors");
                        if(p_errors.length<=0){
                            $errors.addClass("add");
                            $errors.appendTo(this);
                        };
                    });
                    newclone.appendTo(".p_loadcon");
                }
            }else{
                //$('#c_ErrorMsg').html('没有试题资源').fadeIn(200);  Disappear("#c_ErrorMsg");
                //$(".p_loadtexttitle").hide();
                $(".p_loadcon").html("<div class='nothing'><img class='kolano' src='../../static/image/kola/no.png' /></div>");
            }
        },
        error:function(e){
            console.log(e);
        }
    })
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
    }
//    下载按钮
    function createReload(){
        var $p_reloadcon = $("<a class='p_reloadcon'></a>");
        var $new = $("<div  class='p_reload'></div>").appendTo($p_reloadcon);
        var $i = $("<i class='p_pre_03 fl'></i>").appendTo($new);
        var $reload = $("<span class='p_reloadword'>下载</span>").appendTo($new);
        var $useup = $("<div class='p_useup'>消耗1金币</div>").appendTo($p_reloadcon);
        return $p_reloadcon.on("click",function(){
            var id = $(this).closest(".p_mei").attr("id");
            //用户验证
            $.ajax({
                type : "post",
                url : "/web//user/check/user/auth/status",
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        if(data.retData == "1"){
                            load()
                        }else{
                           $(".p_sharks").show();
                        }
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
            function load(){
                $.ajax({
                    type : "post",
                    url : "/web/user/finance",
                    success : function(data){
                        if(data.retCode == "0000"){
                            var usable = data.retData.usable;
                            if(!usable){
                                $(".p_shark,.p_reloadfalse").show();
                                return false;
                            }
                            if(usable >= 1){
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
    }
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
        var $i = $("<i class='p_exselete fl'></i>").appendTo($new);
        var $reload = $("<span class='p_errorsword'>报错</span>").appendTo($new);
        return $new.on("click",function(){
            $(".p_shark,.p_wrong").show();
            $(".p_errortype").removeClass("p_ceselect");
            var questionId = $(this).closest(".p_mei").attr("id");
            sessionStorage.setItem("questionId",JSON.stringify(questionId));
        });
    };
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
    }
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
    }
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
        var  thisId=Data[0].knowledgeId;//一级DOM节点ID
        $('#c_Kownledge').append($html);
        Recursive(thisId,newArrays);//递归插入html
        GetLeafData(newArrays);//切换操作
        GetLastid(newArrays);//获取默认
    }
//有上次记录的情况
    function IsLastRecord(DefultId,newArrays){
        var LeafArr=[];
        //递归默认层级
        function LastKownledge(DefultId,data){
            for(var i=0;i<data.length;i++){
                if(data[i].id==DefultId){
                    LeafArr.push(data[i])
                    LastKownledge(data[i].parentId,data)
                }
            }
            return LeafArr;
        };
        var LeafMain=LastKownledge(DefultId,newArrays);
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
        if(FirstData==null){
            $('#c_Kownledge').html('<img src="../../static/image/kola/no.png" alt="" class="Kolaimg">')
            return false;
        }
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
        $.each(newArrays,function (i,obj) {
            if(obj.parentId === thisId){
                Bool=true;
                oArr.push(obj.id);
                if(obj.alias==null){
                    $HtmlNew+='<li id="' + obj.id + '" class="GetData" title="'+obj.name+'" data-parentId="'+obj.parentId+'">'+obj.name+'</li>';
                }else {
                    $HtmlNew+='<li id="' + obj.id + '" class="GetData" title="'+obj.name+'  '+obj.alias+'" data-parentId="'+obj.parentId+'">'+obj.name+'</li>';
                }
                levelName=obj.levelName;
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
    }
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
    }
});
