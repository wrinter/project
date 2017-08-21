/********************************************个人中心错题本By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
var kownledgeTree = {
    'cell':[],
    'chapter':{}
};
//用户操作
UserOpration();
function UserOpration(){
    //空白区域下拉上去
    document.addEventListener('click',function(e){
        if(e.target.className.indexOf("m_SelectBox")==-1){
            $(".m_SelectList").slideUp(150);
        }
    });
    //出现下拉
    $('.m_SelectBox').on('click',function(e){
        stopBubble(e);
        $(this).find('.m_SelectList').slideToggle(150);
    });
    //关闭打印
    $('#m_PrintBtn').on('click',function(){
        $('#m_PrintSelect').fadeIn(150);
    });
    //关闭打印
    $('.m_Close').on('click',function(){
        $('#m_PrintSelect').fadeOut(150);
    })
}
function getParameter(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
};
var TotalPageSize=0;//总页数
//获取教材
GetMaterial()
function GetMaterial(){
    var SubData={}
    SubData.subjectId=Request.subjectId;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/getWrongMaterialList",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatMaterial(AllData);
            }
        }
    });
}
//创建错题的册次
function CreatMaterial(data){
    var $Material='';
    if(data.length>0){
        $('#Nodata').css('display','none');
        for(var i=0;i<data.length;i++){
            if(data[i].isDefault){
                $('#Material').html(data[i].name).attr({"data-id":data[i].id});
                GetUnit(data[i].id);
            }
            $Material+='<li title="'+data[i].name+'" class="m_MaterialOption" data-id="'+data[i].id+'">'+data[i].name+'</li>';
        }
        $('#m_MaterialList').html($Material);
        $('.m_MaterialOption').on('click',function(e){
            stopBubble(e)
            var id = $(this).attr("data-id");
            var name = $(this).html();
            $('#Material').html(name).attr({"data-id":id});
            $('#m_MaterialList').slideUp(150);
            GetUnit(id);
            intMathJax();
        })
    }else {
        $('#Nodata').css('display','block');
        $('#m_LineBox1').css('display','none');
        $("#Material").text("暂无教材");
        $("#m_PrintBtn").css("display","none");
        //$('#m_MaterialList').css('display','none').html('<li>暂无</li>');
    }
};
//获取单元
function GetUnit(MaterialId){
    var SubData={}
    SubData.materialId=MaterialId;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/getAllUnit",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                if(data.retData&&data.retData.length>0){
                    if(Request.subjectId=='07'){
                        constructData(data);
                        createKownledge();
                        GetPrintUnit(AllData);
                    }else{
                        CreatUnit(AllData);//创建单元
                        GetPrintUnit(AllData)//创建打印单元
                    }
                    $('#m_LineBox1').show();
                    $('#Nodata').hide()
                }else{
                    $('#m_LineBox1').hide();
                    $('#Nodata').show()
                }
            }
        }
    });
};
function constructData(data){
    if(data.retCode=='0000'){
        kownledgeTree = {
            'cell':[],
            'chapter':{}
        };
        var list = data.retData;
        if(list.length>0){
            for(var i=0;i<list.length;i++){
                var cell = {},chapters=[];
                cell.id = list[i].knowledgeId;
                cell.name = list[i].name;
                cell.levelName = list[i].levelName;
                cell.subjectId = list[i].subjectId;
                cell.grade = list[i].grade;
                cell.materialId = list[i].materialId;
                kownledgeTree.cell.push(cell);
                var cList = list[i].childrens;
                if(cList.length>0){
                    for(var j=0;j<cList.length;j++){
                        var chapter={};
                        chapter.id = cList[j].knowledgeId;
                        chapter.name = cList[j].name;
                        chapter.levelName = cList[j].levelName;
                        chapter.subjectId = cList[j].subjectId;
                        chapter.grade = cList[j].grade;
                        chapter.materialId = cList[j].materialId;
                        chapters.push(chapter);
                    }
                    kownledgeTree.chapter[list[i].knowledgeId] = chapters;
                }
            }
        }
    }
}
function createKownledge(){
    var $Unit='';
    var data = kownledgeTree.cell;
    for(var i=0;i<data.length;i++){
        $Unit+='<li data-t="'+i+'" class="UnitOption" title="'+data[i].name+'" data-Unitid="'+data[i].id+'" data-materialId="'+data[i].materialId+'">'+data[i].name+'</li>';
    }
    $('#m_UnitList').html($Unit);
    //生成章节
    var htm = '';
    var cList = kownledgeTree.chapter[data[0].id];
    if(cList!=undefined&&cList.length>0){
        $("#m_chapterTxt").show();
        for(var i=0;i<cList.length;i++){
            htm+='<li data-t="'+i+'" class="UnitOption" title="'+cList[i].name+'" data-Unitid="'+cList[i].id+'" data-materialId="'+cList[i].materialId+'">'+cList[i].name+'</li>';
        }
        $("#m_chapterList").html(htm);
        GetUnitQue(cList[0].id,1);
        $("#m_UnitList li:first").css('color','#49b9df');
        $("#m_chapterList li:first").css('color','#49b9df');
        Paging();//默认分页
    }else{
        var unitid = $('#m_UnitList:first-child').attr('data-unitid');
        GetUnitQue(unitid,1);
    }
    UnitQueTab();//单元切换
}
//创建单元
function CreatUnit(data){
    var $Unit='';
    store.set('Unitid',1);//默认第一单元id
    GetUnitQue(store.get("Unitid"),1);//获取总页码
    Paging();//默认分页
    $Unit+='<li  class="UnitOption"  data-Unitid="1" data-materialId="">全部</li>';
    for(var i=0;i<data.length;i++){
        $Unit+='<li data-t="'+i+'" class="UnitOption" title="'+data[i].name+'" data-Unitid="'+data[i].knowledgeId+'" data-materialId="'+data[i].materialId+'">'+data[i].name+'</li>';
    }
    $('#m_UnitList').html($Unit);
    $('#m_UnitList li').eq(0).attr('id','Unit').css('color','#49b9df').siblings().removeAttr('id').css('color','');//默认第一单元
    UnitQueTab();//单元切换
};
//单元切换
function UnitQueTab(){
    $('#m_UnitList').on('click','.UnitOption',function(){
        $(this).attr('id','Unit').css('color','#49b9df').siblings().removeAttr('id').css('color','');//选中样式变化
        var unitId = $(this).attr('data-unitid');
        var chapters = kownledgeTree.chapter[unitId];
        if(chapters!=undefined){
            if(chapters.length==0){
                $("#m_chapterTxt").hide();
                $('#m_Nolist').css('display','block');
                $('#m_WrongTest').html('');
            }else{
                $("#m_chapterTxt").show();
                var htm = '';
                for(var i=0;i<chapters.length;i++){
                    htm+='<li data-t="'+i+'" class="UnitOption" title="'+chapters[i].name+'" data-Unitid="'+chapters[i].id+'" data-materialId="'+chapters[i].materialId+'">'+chapters[i].name+'</li>';
                }
                $("#m_chapterList").html(htm);
                $("#m_chapterList li:first").css('color','#49b9df');
                GetUnitQue(chapters[0].id,1);
                store.set('Unitid',chapters[0].id);
                intMathJax();
                Paging();//切换分页
            }
        }else {
            store.set('Unitid', $(this).attr('data-Unitid'));//记录单元id
            GetUnitQue(store.get("Unitid"), 1);//获取总页码
            intMathJax();
            Paging();//切换分页
        }
    });
}
$('#m_chapterList').on('click','.UnitOption',function(){
    $(this).attr('id','Unit').css('color','#49b9df').siblings().removeAttr('id').css('color','');//选中样式变化
    store.set('Unitid',$(this).attr('data-Unitid'));//记录单元id
    GetUnitQue(store.get("Unitid"),1);//获取总页码
    intMathJax();
    Paging();//切换分页
});
//获取单元下的试题
function GetUnitQue(unitId,PageNum){
    var SubData={},Pages=0;
    SubData.unitId=unitId;
    SubData.subjectId=Request.subjectId;
    SubData.materialId=$('#Material').attr('data-id');
    SubData.pageNum=PageNum;
    SubData.pageSize=10;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/getWrongList",
        "dataType": "json",
        "data":SubData,
        async: false,//同步加载。解决undifind
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                Pages=AllData.pages;
                store.set('PageSize',Pages);
                CreateWrongQue(AllData.list);//创建试题
                intMathJax();
            }
        }
    });
    return Pages;
};
//分页
function Paging(){
    var totalRecords = store.get('PageSize')*10;
    var pageNo = getParameter('pno');
    if(!pageNo){pageNo = 1;}
    store.set("PageNum",pageNo);
    kkpager.total = store.get('PageSize');
    kkpager.totalRecords = store.get('PageSize')*10;
    kkpager.generPageHtml({
        pno : pageNo, //总页码
        total :store.get('PageSize'), //总数据条数
        totalRecords : totalRecords, //链接前部
        hrefFormer : 'me_wrong', //链接尾部
        hrefLatter : '.html',
        mode : 'click',//默认值是link，可选link或者click
        click : function(n){
            this.selectPage(n);
            store.set("PageNum",n);
            GetUnitQue(store.get("Unitid"),n);
            intMathJax();
            return false;
        }
    },true);
};
var  $QuestionHtml='';
//普通试题
function QuestionHtml(data,i,j){
    if(data[i].questions==null){return false;}
    var Question=data[i].questions[j];
    var IsType=Question.questionTypeId;
    if(Question.optionA!=null){var $A=Question.optionA;}else {var $A='';}
    if(Question.optionB!=null){var $B=Question.optionB;}else {var $B='';}
    if(Question.optionC!=null){var $C=Question.optionC;}else {var $C='';}
    if(Question.optionD!=null){var $D=Question.optionD;}else {var $D='';}
    if(Question.questionTitle!=null){
        var  content=Question.questionTitle.replace(/\】/g,'');
        content=content.replace(/题干/g,(i+1)+'、');
        content=content.replace(/\【/g,'');
        content=content.replace(/\【题干】/g,'');
    }else {
        var  content=Question.questionTitle;
    }
    //客观题
    var IsSelect=(IsType==01||IsType==05||IsType==09||IsType==10||IsType==12||IsType==13||IsType==26||IsType==30);
    //选择题
    if(IsSelect){
        $QuestionHtml+='<li>';
        $QuestionHtml+='<div class="m_WrongQue">';
        $QuestionHtml+=content;//题干
        $QuestionHtml+=IsOptionShow($A,$B,$C,$D);
        $QuestionHtml+='</div>';
        $QuestionHtml+='<div class="m_WrongQueOp">';
        $QuestionHtml+='<a href="../../../../student/model/me/me_analyze.html?questionId='+Question.questionId+'&materialId='+$('#Material').attr('data-id')+'&groupCode='+Question.groupCode+'&isSplite='+Question.isSplite+'&subjectid='+Request.subjectId+'" target="_blank" class="m_WrongOpBtn0" data-questionId="'+Question.questionId+'">查看</a>';
        $QuestionHtml+='<p class="m_WrongOpBtn1" data-issplite="'+Question.isSplite+'" data-groupcode="'+Question.groupCode+'" data-questionid="'+Question.questionId+'">删除</p>';
        $QuestionHtml+='</div>';
        $QuestionHtml+='</li>';
    }
    //主观题
    else {
        $QuestionHtml+='<li>';
        $QuestionHtml+='<div class="m_WrongQue">';
        $QuestionHtml+=content;//题干
        $QuestionHtml+='</div>';
        $QuestionHtml+='<div class="m_WrongQueOp">';
        $QuestionHtml+='<a href="../../../../student/model/me/me_analyze.html?questionId='+Question.questionId+'&materialId='+$('#Material').attr('data-id')+'&groupCode='+Question.groupCode+'&isSplite='+Question.isSplite+'&subjectid='+Request.subjectId+'" target="_blank" class="m_WrongOpBtn0" data-questionId="'+Question.questionId+'">查看</a>';
        $QuestionHtml+='<p class="m_WrongOpBtn1" data-issplite="'+Question.isSplite+'" data-groupcode="'+Question.groupCode+'" data-questionid="'+Question.questionId+'">删除</p>';
        $QuestionHtml+='</div>';
        $QuestionHtml+='</li>';
    }
};
//不可拆分组合题
function GroupQuestionHtml(data,i){
    if(data[i].questions==null){return false;}
    $QuestionHtml+='<li>';
    var Content=data[i].content;//材料题目
    Content=Content.replace(/材料/g,(i+1)+'、');
    Content=Content.replace(/\】/g,'');
    Content=Content.replace(/\【/g,'');
    $QuestionHtml+=Content;
    for(var j=0;j<data[i].questions.length;j++){
        var Question=data[i].questions[j];
        if(Question.wrongQuestion){
            var IsType=Question.questionTypeId;
            if(Question.optionA!=null){var $A=Question.optionA;}else {var $A='';}
            if(Question.optionB!=null){var $B=Question.optionB;}else {var $B='';}
            if(Question.optionC!=null){var $C=Question.optionC;}else {var $C='';}
            if(Question.optionD!=null){var $D=Question.optionD;}else {var $D='';}
            if(Question.questionTitle!=null){
                var  content=Question.questionTitle.replace(/\】/g,'');
                content=content.replace(/题干/g,'');
                content=content.replace(/\【/g,'');
                content=content.replace(/\【题干】/g,'');
            }else {
                var  content=Question.questionTitle;
            }
            //客观题
            var IsSelect=(IsType==01||IsType==05||IsType==09||IsType==10||IsType==12||IsType==13||IsType==26||IsType==30||IsType==34);
            //选择题
            if(IsSelect){
                $QuestionHtml+='<div class="m_WrongQue ">';
                $QuestionHtml+=content;//题干
                $QuestionHtml+=IsOptionShow($A,$B,$C,$D);
                $QuestionHtml+='</div>';
            }
            //主观题
            else {
                $QuestionHtml+='<div class="m_WrongQue">';
                $QuestionHtml+=content;//题干
                $QuestionHtml+='</div>';
            }
        }
    }
    $QuestionHtml+='<div class="m_WrongQueOp">';
    $QuestionHtml+='<a href="../../../../student/model/me/me_analyze.html?questionId='+data[i].questionId+'&materialId='+$('#Material').attr('data-id')+'&groupCode='+data[i].groupCode+'&isSplite='+data[i].isSplite+'&subjectid='+Request.subjectId+'" target="_blank" class="m_WrongOpBtn0" data-questionId="'+data[i].questionId+'">查看</a>';
    $QuestionHtml+='<p class="m_WrongOpBtn1" data-issplite="'+data[i].isSplite+'" data-groupcode="'+data[i].groupCode+'" data-questionid="'+data[i].questionId+'">删除</p>';
    $QuestionHtml+='</div>';
    $QuestionHtml+='</li>';
};
//可拆分组合题
function SpliteQuestionHtml(data,i){
    if(data[i].questions==null){return false;}
    for(var j=0;j<data[i].questions.length;j++){
        var Question=data[i].questions[j];
        if(Question.wrongQuestion){
            var IsType=Question.questionTypeId;
            if(Question.optionA!=null){var $A=Question.optionA;}else {var $A='';}
            if(Question.optionB!=null){var $B=Question.optionB;}else {var $B='';}
            if(Question.optionC!=null){var $C=Question.optionC;}else {var $C='';}
            if(Question.optionD!=null){var $D=Question.optionD;}else {var $D='';}
            $QuestionHtml+='<li>';
            var Content=data[i].content;//材料题目
            $QuestionHtml+=Content;
            if(Question.questionTitle!=null){
                var  content=Question.questionTitle.replace(/\】/g,'');
                content=content.replace(/题干/g,'');
                content=content.replace(/\【/g,'');
                content=content.replace(/\【题干】/g,'');
            }else {
                var  content=Question.questionTitle;
            }
            //客观题
            var IsSelect=(IsType==01||IsType==05||IsType==09||IsType==10||IsType==12||IsType==13||IsType==26||IsType==30||IsType==34);
            //选择题
            if(IsSelect){
                $QuestionHtml+='<div class="m_WrongQue ">';
                $QuestionHtml+=content;//题干
                $QuestionHtml+=IsOptionShow($A,$B,$C,$D);
                $QuestionHtml+='</div>';
            }
            //主观题
            else {
                $QuestionHtml+='<div class="m_WrongQue">';
                $QuestionHtml+=content;//题干
                $QuestionHtml+='</div>';
            }
            $QuestionHtml+='<div class="m_WrongQueOp">';
            $QuestionHtml+='<a href="../../../../student/model/me/me_analyze.html?questionId='+data[i].questionId+'&materialId='+$('#Material').attr('data-id')+'&groupCode='+data[i].groupCode+'&isSplite='+data[i].isSplite+'&subjectid='+Request.subjectId+'" target="_blank" class="m_WrongOpBtn0" data-questionId="'+data[i].questionId+'">查看</a>';
            $QuestionHtml+='<p class="m_WrongOpBtn1" data-issplite="'+data[i].isSplite+'" data-groupcode="'+data[i].groupCode+'" data-questionId="'+data[i].questionId+'">删除</p>';
            $QuestionHtml+='</div>';
            $QuestionHtml+='</li>';
        }

    }
};
//选项分布
function IsOptionShow(A,B,C,D){
    var Option='';
    if(A.indexOf('oneline')!=-1){
        Option=A+B+C+D;
    }else if(A.indexOf('twoline')!=-1){
        B=B+'';
        Option=A+B+C+D;
    }else {
        Option=A+B+C+D;
    }
    return Option;
}
//创建试题
function CreateWrongQue(data){
    $QuestionHtml='';
    if(data.length>0){
        $('#m_Nolist').css('display','none');
        for(var i=0;i<data.length;i++){
            //组合题
            if(data[i].groupCode!=null){
                if(data[i].isSplite==0||data[i].isSplite=='0'){
                    GroupQuestionHtml(data,i);
                }else {
                    SpliteQuestionHtml(data,i)
                }
            }
            //正常题型
            else {
                QuestionHtml(data,i,0);
            }
        }
        $('#m_WrongTest').html($QuestionHtml)
        if(document.documentElement.scrollTop) {
            document.documentElement.scrollTop = 0;
        }else {
            document.body.scrollTop = 0;
        }
    }
    else {
        $('#m_Nolist').css('display','block');
        $('#m_WrongTest').html($QuestionHtml);
    }
    GetComCss();//获取公共样式
    DeletQueOprate();//删除操作
};
//获取公共样式
function GetComCss(){
    $.ajax({
        "type": "post",
        "url": "/web/common/commonStyle",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                $('head').append(AllData);
            }
        }
    });
};
//删除试题操作
function DeletQueOprate(){
    $('.m_WrongOpBtn1').on('click',function(){
        var questionId=$(this).attr('data-questionid');
        var groupCode=$(this).attr('data-groupcode');
        var isSplite=$(this).attr('data-issplite');
        DeletQue(questionId,groupCode,isSplite);
    })
};
//删除题目
function DeletQue(questionId,groupCode,isSplite){
    var SubData={};
    SubData.questionId=questionId
    SubData.groupCode=groupCode
    SubData.isSplite=isSplite
    $.ajax({
        "type": "post",
        "url": "/web/student/center/wrongbook/delete",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                $('#c_ErrorMsg').html('删除成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                GetUnitQue(store.get("Unitid"),store.get("PageNum"));//获取总页码
                Paging();//默认分页
            }else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
//创建打印单元
function GetPrintUnit(data){
    var $PrintUnit='';
    if(data.length>0){
        $PrintUnit+='<li>';
        $PrintUnit+='<img  src="../../static/image/common/i_slcico0.png" class="m_UnitSelecIco" id="IsAll" data-IsAll="0"  alt="" >';
        $PrintUnit+='<span class="m_UnitName">全部</span>';
        $PrintUnit+='</li>';
        for(var i=0;i<data.length;i++){
            $PrintUnit+='<li title="'+data[i].name+'">';
            $PrintUnit+='<img data-IsAll="1" data-name="'+data[i].name+'" data-Unitid="'+data[i].knowledgeId+'" data-materialId="'+data[i].materialId+'" data-subjectId="'+data[i].subjectId+'" src="../../static/image/common/i_slcico0.png" class="m_UnitSelecIco " alt="" >';
            $PrintUnit+='<span class="m_UnitName">'+data[i].name+'</span>';
            $PrintUnit+='</li>';
        }
        $('#m_UnitSelectList').html($PrintUnit);
        SelectUnit(data);
    }
};
//选择单元
function SelectUnit(data){
    setInterval(function(){
        if($('.otherdone').size()==data.length){
            $('.m_UnitSelecIco').attr('src','../../static/image/common/i_slcico1.png');
            $('#IsAll').addClass('done');
        }else {
            $('#IsAll').attr('src','../../static/image/common/i_slcico0.png').removeClass('done');
        }
        if($('.otherdone').size()>0){
            $('#m_UnitSelectEnsure').css('background','#58c1e4')
        }else {
            $('#m_UnitSelectEnsure').css('background','')
        }
    },1);
    $('.m_UnitSelecIco').on('click',function(){
        //全部
        if($(this).attr('data-IsAll')==0||$(this).attr('data-IsAll')=='0'){
            //取消全部
            if($(this).hasClass('done')){
                $('.m_UnitSelecIco').attr('src','../../static/image/common/i_slcico0.png');
                $(this).removeClass('done').parents('li').siblings('li').find('.m_UnitSelecIco').removeClass('otherdone');
            }
            //选择全部
            else {
                $('.m_UnitSelecIco').attr('src','../../static/image/common/i_slcico1.png');
                $(this).addClass('done').parents('li').siblings('li').find('.m_UnitSelecIco').addClass('otherdone');
            }
        }
        else {
            //取消选择
            if($(this).hasClass('otherdone')){
                $(this).removeClass('otherdone').attr('src','../../static/image/common/i_slcico0.png');
            }
            //选择
            else {
                $(this).addClass('otherdone').attr('src','../../static/image/common/i_slcico1.png');
            }
        }

    });
    $('#m_UnitSelectEnsure').on('click',function(){
        var AllArray=[];//存放全部id的数组
        for(var i=0;i<$('#m_UnitSelectList li').length;i++){
            var $Select=$('#m_UnitSelectList li').eq(i).find('.m_UnitSelecIco');
            if($Select.hasClass('otherdone')){
                AllArray.push($Select.attr('data-Unitid'));
            }
        }
        store.set("PrintList",AllArray);
        if($('.otherdone').length>0){
            window.open('me_print.html?Material='+$('#Material').html()+'&materialId='+$('#Material').attr('data-id')+'&subjectId='+Request.subjectId);
        }
    });
}