/**
 * Created by wcd on 2016/11/29.
 */
/******************************获取导航*******************************/

/*******************************************url**************************************/
function getUrl(){
    var url =window.location.href;
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u= u[1].replace(/id=/,"");
        return u ;
    }
}
var res_id=getUrl().split("&")[0];
//判断地址栏是否传category_id
if(getUrl().indexOf("&")>0){
    var category_id=getUrl().split("&")[1].split("=")[1];
    var test_id = getUrl().split("&")[0];
}
var v_flag;
var praiseCount;
//通过视频的ID获取视频播放的相关信息
function getVideoPlay(){
    var param={};
    param.resId=res_id;
    $.ajax({
        type: "post",
        url: "/web/student/prepare/video/play",
        data:param,
        dataType: "json",
        success:function(data){
            var codenum = parseInt(data.retCode.substr(0, 1));
            //判断你是否成功
            if (codenum == 0) {
                var list=data.retData;
                var fileName = list.fileName;
                v_flag=list.islike;
                praiseCount=list.likeNum;
                //知识点名称
                if(list.knowledgeName){
                    $(".prepareVideoName").html(list.knowledgeName);
                }else{
                    $(".prepareVideoName").html(fileName);
                }
                //预览次数
                $(".pageViewsNum").html("("+list.queryNum +")");
                //点赞数量
                $(".agreeNum").html("("+praiseCount+")");
                //点赞功能
                if(v_flag==1){
                    $(".agree").removeClass("p_Praiseico").addClass("p_yetPraiseico");
                    $(".agreeNum").css("color","#49b9df");
                }
                //获取视频
                var PlayCode = list.playCode;
                PlayCode=PlayCode.replace(/600/g,'100%');
                PlayCode=PlayCode.replace(/490/g,'660');
                $(".prepareVideo").html(PlayCode);
                //$(".recommend").html(list.recommend );
                //是否有测试
                if(list.prepareTest==1){
                 $(".prepareTest").css({"display":"block"});
                }else{
                    $(".prepareTest").css({"display":"none"})
                }
                //是否有推荐
                if(list.recommend=="0"){
                  $(".recommend").css({"display":"none"});
                }else{
                   $(".functions .recommend").fadeIn();
               }
            }
        }
    });
}
$(".agree").on("click",function(){
    if($(this).hasClass("p_yetPraiseico")){
        return;
    }
    prise();
});
//点赞
function prise(){
    var param={};
    param.resId=res_id;
   $.ajax({
       type: "post",
       url: "/web/common/like",
       data:param,
       dataType: "json",
       success:function(data){
           var codenum = parseInt(data.retCode.substr(0, 1));
           //判断你是否成功
           if (codenum == 0) {
               praiseCount+=1;
               $(".agreeNum").html('('+praiseCount+')');
               $(".agree").removeClass("p_Praiseico").addClass("p_yetPraiseico");
               $(".agreeNum").css("color","#49b9df");
           }
       }
   });
}
$('#c_RefBtn0').on('click',function(){
    RefClass(list,$('#c_Remark').val())
});
  /**********************视频分享***************************/
$('.enjoys').hover(function(){
    $(this).find('.p_shareico ').removeClass('p_shareico ').addClass('p_yetshareico');
},function(){
    $(this).find('.p_yetshareico').removeClass('p_yetshareico ').addClass('p_shareico');
});
//判断视频是否分享
CheckShare();
function CheckShare(){


}


function ShareRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs) {
        $('body,html').html("暂时不支持IOS版本，更多详情<a href='../../../../index.html'>五好导学网</a>") ;
        window.location.href="../../../../index.html";
    }else if(bIsAndroid || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM){
        $('body,html').html("正在跳转到下载地址...<br/>如果是微信访问，请点击右上角选择从浏览器打开") ;
        window.location.href="../../../../app/appdownload.html";
    }else {
        $('body,html').html("请使用手机访问，或者请前往官方<a href='../../../../index.html'>五好导学网</a>") ;
        window.location.href="../../../../index.html";
    }
}
$('#ShareClose').on('click',function(){
    $('#Share').fadeOut(150);
})
$('.enjoys').on('click',function(){
    $('#Share').fadeIn(150);
});
/**********************开始播放的时候，浏览量加1************************/
function start(){
    var param={};
    param.resId=res_id;
    $.ajax({
        type: "post",
        url: "/web/common/res/query",
        data:param,
        dataType: "json",
        success:function(data){
            console.log(data);
            $(".pageViewsNum").html("("+data.retData+")");
        }
    })
}
   /**************************视频开始播放时，触发*************************/
function on_spark_player_start() {
    start();
}
/*****************************预习测试*****************************/
var a="";
a+="<a style='color:#fff;' target='_blank' href='prepare_video_videoPlay_prepareTest.html?id="+res_id+"'>";
a+="预习测试";
a+="</a>";
$(".prepareTest").html(a);

var prepareBase = {

    //预习导学案
    base:function(){
        var param={};
        var that=this;
        param.resId=test_id;
        $.ajax({
            type: "post",
            url: "/web/student/prepare/video/base",
            data:param,
            dataType: "json",
            success:function(data){
                if(data.retCode!='0000'){
                    $(".paperBase").hide();
                    return;
                }
                var t_list=data.retData.questionList;
                var t_length=data.retData.questionList.length;
                var li="<span class='title_span_d'>导学案</span>";
                for(var k in t_list){
                    li+="<li class='paperBaseLi' data-answer='"+t_list[k].answer+"' id='"+t_list[k].id+"' >";
                    li+="<ul class='paperBaseLiUl'>";
                    for(var k1 in t_list[k].list){
                        li+="<li style='display: inline;' id='"+t_list[k].list[k1].id+"'>";
                        li+="<div class='paperBaseLiUlContent p1'"
                        if(t_list[k].list[k1].questionType!="01"){
                            li+="data-hidden='baseHidden'";
                        }else{
                            li+="data-tit='tit'";
                        }
                        li+=">";
                        li+=t_list[k].list[k1].content.replace("【题干】","<span class='_order'>"+(Number(k)+1+"、")+"</span><span class='wr'></span>");
                        li+="</div>";
                        if(t_list[k].list[k1].questionType=="01"){
                            li+="<ul class='t_option'>";
                            li+="<li class='t_optionLi t_hli optionA p1 ml25'>"+t_list[k].optionA+"</li>";
                            li+="<li class='t_optionLi t_hli optionB p1 ml25'>"+t_list[k].optionB+"</li>";
                            li+="<li class='t_optionLi t_hli optionC p1 ml25'>"+t_list[k].optionC+"</li>";
                            li+="<li class='t_optionLi t_hli optionD p1 ml25'>"+t_list[k].optionD+"</li>";
                            li+="</ul>";
                        }
                        li+="</li>";
                    }
                    li+="</ul>";
                    li+="</li>";
                }
                li+=" <input type='button' class='baseBtnSubmit fn_submit' value='提&nbsp;交'>";
                $(".paperBase").html(li.replace(/null/g,""));
                intMathJax();//公式
                //自定义属性为hidden的隐藏
                $("div[data-hidden='baseHidden']").hide();
                /******************************此处为选择答案***************************/
                //点击  选择答案
                var t_flag=[];
                prepareBase.choiceAnswer(t_flag);
                //点击提交
                prepareBase.clickSub(t_length,t_flag);
            }
        });
    },

    css:function(){
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
    },

    //选择答案
    choiceAnswer:function(t_flag){
        var index;
        var answer;//提交时，与answer对比，用于判断正误的;
        $(".paperBase").on("click",".t_optionLi",function(){
            //获取 点击后的选项
            if($(this).hasClass("optionA")){
                answer="A";
                $(this).addClass("on").siblings().removeClass("on");
            }else if($(this).hasClass("optionB")){
                answer="B";
                $(this).addClass("on").siblings().removeClass("on");
            }else if($(this).hasClass("optionC")){
                answer="C";
                $(this).addClass("on").siblings().removeClass("on");
            }else if($(this).hasClass("optionD")){
                answer="D";
                $(this).addClass("on").siblings().removeClass("on");
            }
            console.log(answer);
            //首次点击选项时，选择的答案
            //var exp=/[\(\（\(\（]\s*[\)\）\)\）]/g;
            //if(exp.test($(this).parent().siblings("div").html())){
            //    $(this).parent().siblings("div").html($(this).parent().siblings("div").html().replace(exp,"（"+answer+"）"));
            //}
            //console.log($(this).parent().siblings("div").html($(this).parent().siblings("div").html()));
            ////修改答案时（多次点击）修改答案
            //var exp1=/[\(\（][a-zA-Z]*[\)\）]/g;
            //$(this).parent().siblings("div").html($(this).parent().siblings("div").html().replace(exp1,"（"+answer+"）"));
            index=$(this).parent().parent().parent().parent().index()-1;
            if(answer==$(this).parent().parent().parent().parent().attr("data-answer")){
                t_flag[index]=true;
            }else{
                t_flag[index]=false;
            }
        });
    },

    //提交试卷
    clickSub:function(t_length,t_flag){
        $(".fn_submit").on("click",function(){
            var that = $(this);
            if(t_flag.length != t_length){
                $(".shark").show();
                $(".model_paper_delete_correr,.model_paper_success_correr").on("click",function(){//取消
                    $(this).closest(".shark").hide();
                    //点击  选择答案
                    var t_flag=[];
                    prepareBase.choiceAnswer(t_flag);
                });
                $(".model_paper_false_correr").on("click",function() {//确定
                    for(var j=0;j<t_length;j++){//判断正误
                        if(t_flag[j]){
                            $(".paperBaseLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/right.png'>");
                        }else{
                            $(".paperBaseLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/wrong.png'>");
                        }
                    }
                    $("div[data-hidden='baseHidden']").show();
                    $(this).closest(".shark").hide();
                    that.hide();
                });
            }else{
                for(var j=0;j<t_length;j++){//判断正误
                    if(t_flag[j]){
                        $(".paperBaseLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/right.png'>");
                    }else{
                        $(".paperBaseLi:eq("+j+")").find("div[data-tit='tit']").find(".wr").html("<img src='../../../static/image/prepare/wrong.png'>");
                    }
                }
                $("div[data-hidden='baseHidden']").show();
                that.hide();
            }
            $(".paperBase").unbind('click');
            $(".t_optionLi").removeClass('t_hli');
        });
    }
}
if(window.location.hash!=''){
    $('body,html').html('');
    ShareRedirect();
}
else {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if(bIsAndroid || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM) {
        ShareRedirect();
    }else {
        //prepareBase.base();
        //prepareBase.css();
        getVideoPlay();
    }
}