/**
 * Created by Administrator on 2017/2/10 0010.
 */
CheckBrower();
subjectSel();
autoDo();
//学科
function subjectSel(){
    var that = this;
    $.ajax({
        type:"post",
        url:"/web/student/center/getSubjectList",
        dataType: "json",
        "async":false,
        success:function(data){
            var htm = '';
            for(var i in data.retData){
                if(data.retData[i].value == "01"){
                    htm += '<span class="fn_sub change" mycla="mathematics" val="'+data.retData[i].value+'">'+data.retData[i].label+'</span>';
                }
            }
            for(var i in data.retData){
                if(data.retData[i].value == "03"){
                    htm += '<span class="fn_sub" mycla="mathematics" val="'+data.retData[i].value+'">'+data.retData[i].label+'</span>';
                }
            }
            $("#fn_subject_div").append(htm);
            subjectAll();
        }
    });
}
//页面进入自动执行
function autoDo(){
    var that = this;
    var subject = {};
    subject.subjectId =$('#fn_subject_div').find(".change").attr("val");
    subject.menuId = store.get('menuId');;
    $.ajax({
        type:"post",
        url:"/web/student/common/knowledge",
        data:subject,
        dataType: "json",
        "async":false,
        success:function(data){
            var list = data.retData;
            var flag = true,knowledgeId = "",num=0;
            if(list.length>0) {
                while (flag) {
                    if (list[0].childrens.length > 0) {
                        sellist(list, num, "auto");
                        num++;
                        list = list[0].childrens;
                    } else {
                        knowledgeId = list[0].id;
                        flag = false;
                        sellist(list, num, "auto");
                    }
                }
            }else{
                $('.childList').html("<div class='noData'><img class='noImg' src='../../static/image/kola/no.png'></div>");
            }
        }
    })
}
//章
function subjectAll(){
    var that=this;
    $(".p_loadtexttitle .fn_sub").click(function(){
        if($(this).hasClass("change")){
            return;
        }else{
            $(this).parent().find("span").removeClass("change");
            $(this).addClass("change");
            $(".videoBox").html("");
            $(".childList").html("");
        }
        $(this).parent().parent().nextAll().remove();
        var subject = {};
        subject.subjectId = $(this).attr("val");
        autoDo();
    });
}
//节
function sellist(list,level,flag){
    var that=this;
    var li = "";
    if(level=="0"){
        li = "<li><label>章：</label><div>";
    }else if(level=="1"){
        li = "<li><label>节：</label><div>";
    }else if(level=="2"){
        li = "<li><label>课时：</label><div>";
    }
    if(list[0].childrens.length==0&&$(".fn_sub.change").attr("val")=="01"){
        selectChineseChild(list);
        return;
    }else if(list[0].childrens.length==0&&$(".fn_sub.change").attr("val")=="03"){
        selectEnglishChild(list);
        return;
    }
    for(var i=0; i<list.length; i++){
        li+="<span id='"+list[i].knowledgeId+"' class='fn_par ";
        if(i==0&&flag=="auto"){
            li+="change";
        }

        if(list[i].alias==''||list[i].alias==null){
            li+="' level='"+list[i].level+"' parent='"+JSON.stringify(list[i].childrens)+"' title='"+list[i].name+"'>"+list[i].name+"</span>";
        }else {
            li+="' level='"+list[i].level+"' parent='"+JSON.stringify(list[i].childrens)+"'  title='"+list[i].name+'  '+list[i].alias+"'  >"+list[i].name+"</span>";
        }
    }
    li+="</div></li>";
    $(".p_loadtexttitle").append(li);
    $(".fn_par").click(function(){
        if(!$(this).hasClass("change")){
            $(".p_loadcon").html("");
            $(this).parent().parent().nextAll().remove();
            $(this).parent().find("span").removeClass("change");
            $(this).addClass("change");
            if(JSON.parse($(this).attr("parent")).length>0){
                sellist(JSON.parse($(this).attr("parent")),$(this).attr("level"));
            }
        }
    })
}
//语文
function selectChineseChild(list){
    var htm = '';
    for(var i in list){
        if(list[i].alias==''||list[i].alias==null){
            htm += '<li id="'+list[i].knowledgeId+'" title="'+list[i].name+'" class="child_li"><i class="prepare_sprite p_bookico0 "></i><i class="font_li">'+list[i].name+'</i></li>';
        }else {
            htm += '<li id="'+list[i].knowledgeId+'"  title="'+list[i].name+'  '+list[i].alias+'" class="child_li"><i class="prepare_sprite p_bookico0 "></i><i class="font_li">'+list[i].name+'</i></li>';
        }
    }
    $(".fn_childList").html(htm);
    clickChineseChild_li();
}
function clickChineseChild_li(){
    $(".child_li").click(function(){
        store.set("audioKnowledgeId",$(this).attr("id"));
        store.set("audioSubjectId",$("span.fn_sub.change").attr("val"));
        var href = "prepare_Chinese_audio.html";
        var a = $("<a href='"+href+"' >Apple</a>").get(0);
        var e = document.createEvent('MouseEvents');
        e.initEvent( 'click', true, true );
        a.dispatchEvent(e);
    });
    $(".child_li").hover(function(){
        $(this).find(".prepare_sprite").removeClass("p_bookico0").addClass("p_bookico1");
        $(this).find(".font_li").css("color","#1EAADD");
        $(this).css("background-color","#D4F0FC");
    },function(){
        $(this).find(".prepare_sprite").removeClass("p_bookico1").addClass("p_bookico0");
        $(this).find(".font_li").css("color","#999999");
        $(this).css("background-color","#fff");
    });
}
//英语

function selectEnglishChild(list){
    var htm = '';
    for(var i in list){
        var english = GetVoiceData($("span.fn_sub.change").attr("val"),list[i].knowledgeId);
       if(list[i].alias==''||list[i].alias==null){
           htm += '<div class="english_div fl"><li class="english_li fl" title="'+list[i].name+'" id="'+list[i].knowledgeId+'">'+list[i].name+'</li>'+english+'</div>';
       }else {
           htm += '<div class="english_div fl"><li class="english_li fl" title="'+list[i].name+'  '+list[i].alias+'" id="'+list[i].knowledgeId+'">'+list[i].name+'</li>'+english+'</div>';
       }
    }
    $(".fn_childList").html(htm);
    CheckListCss();
}