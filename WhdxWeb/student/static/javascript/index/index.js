/**
 * Created by Renwencong on 2017/2/20 0020.
 */
//banner
var iW = ($(".i_Banner").outerWidth() * 37) / 192;
$(".i_Banner").css("height",iW + "px");
function showAd(){
    var mySwiper = new Swiper('.swiper-container', {
        autoplay: 4000,//可选选项，自动滑动
        autoplayDisableOnInteraction : false,//用户操作swiper之后自动切换不会停止
        pagination : '.swiper-pagination',//分页器
        paginationClickable :true,//分页器切换事件
        prevButton:'.swiper-button-prev',//前进
        nextButton:'.swiper-button-next',//后退
        loop : true//循环
    });
}
//banner over
var list = "",resourse = "";
var index = {
    //获取banner
    getBanner:function() {
        $.ajax({
            type: "post",
            url: "/web/student/homepage/index/getStudentSiteIndexAd",
            dataType: "json",
            success: function (data) {
                if(data.retCode=="0000"){
                    var list = data.retData;
                    var htm = "";
                    for(var i=0;i<list.length;i++){
                        htm += "<div class='swiper-slide' style='background-image:url("+list[i].imgUrl+")'><a href='"+list[i].adUrl+"'></a></div>"
                    }
                    $('#in_swiper').html(htm);
                }
            }
        });
    },
    //学科
    subjectSel:function(){
        $.ajax({
            type:"post",
            url:"/web/student/center/getSubjectList",
            dataType: "json",
            success:function(data){
                list = data.retData;
                index.getvideoSubject();
                index.getEnglishSubject();
                index.getmustdoSubject();
            }
        });
    },
    //获取所有资源
    getResourse:function(){
        $.ajax({
            type:"post",
            url:"/web/student/homepage/index/getStudentSiteIndex",
            dataType:"json",
            success:function(data){
                resourse = data.retData;
                index.getVideo("02");
                index.getEnglishResourse("01","4");
            }
        })
    },

    //视频
    //获取视频相关的学科
    getvideoSubject:function(){
        var htm = '';
        for(var i in list){
            if(list[i].value ==="10"){
                break;
            }
            htm += '<li class="subject_li ';
            if(i==1){
                htm += 'change_subject';
            }
            htm +='" val="'+list[i].value+'">'+list[i].label+'</li>';
        }
        $(".subject_ul").append(htm);
        index.videoSubjectClick();
    },
    //根据学科id获取视频资源
    getVideo:function(subjectId){
        var htm = "",j = 0;
        for(var i=0;i<resourse.length;i++){
            if(j>=5){
                break;
            }
            if(resourse[i].subjectId === subjectId&&resourse[i].content === "1"){
                j++;
            }else{
                continue;
            }
            htm += '<li class="vedio_li ';
            if(j == 1){
                htm += 'changeli';
            }
            htm += '" videoId="'+resourse[i].id+'">'
            if(resourse[i].fileFullPathImg!=null&&resourse[i].fileFullPathImg!=undefined&&resourse[i].fileFullPathImg!=""){
                htm += '<img class="video_img" src="'+resourse[i].thumbnail+'">';
            }else{
                htm += '<img class="video_img" src="'+resourse[i].thumbnail+'">';
            }
            if(j == 1){
                htm += '<img class="change_img" src="../../static/image/index/i_Video_03.png"/>';
                htm += '<img class="change_img margin_img" src="../../static/image/index/i_Video_02.png"/>';
            }else{
                htm += '<img class="change_img hid_img" src="../../static/image/index/i_Video_02.png"/>';
            }
            htm += '<div class="video_title">'+resourse[i].title+'</div>';
            htm += '</li>';
        }
        $(".vedio_ul").html(htm);
        index.videoImgSize();
        index.videoClick();
        index.videoHover();
    },
    //视频学科点击事件
    videoSubjectClick:function(){
        $(".subject_ul li").click(function(){
            $(".subject_ul li").removeClass("change_subject");
            $(this).addClass("change_subject");
            index.getVideo($(this).attr("val"))
        });
    },
    //视频图片尺寸控制
    videoImgSize:function () {
        resi();
        window.onresize = function () {
            resi();
        }
        function resi() {
            var bigImg = $(".changeli"),
                smallImg = $(".vedio_li");
            var bigW = bigImg.length != 0 ? bigImg.width() : null,
                smallW = smallImg.length != 0 ? smallImg.eq(1).width() : null;
            if(smallW){
                smallImg.height(smallW*.5982);
            }
            if(bigW){
                bigImg.height(bigW*.8742);
            }
        }
    },
    //点击视频跳转页面
    videoClick:function(){
        $(".vedio_ul li").click(function(){
            /*var a = document.createElement("a");
            a.setAttribute("href","../prepare/prepare_video_prepareVideoPlay.html?id="+$(this).attr("videoId")+"&");
            a.setAttribute("target","_blank");
            a.click();*/

            var href = "../prepare/prepare_video_prepareVideoPlay.html?id="+$(this).attr("videoId")+"&";
            var a = $("<a href='"+href+"' target='_blank'>Apple</a>").get(0);
            var e = document.createEvent('MouseEvents');
            e.initEvent( 'click', true, true );
            a.dispatchEvent(e);
        });
    },
    videoTitleClick:function(){
        $(".vedio_a").click(function(){
            var VideoMenuid = GetMenuid("看视频");
            store.set("menuId",VideoMenuid);
        });
    },
    //视频鼠标滑动事件
    videoHover:function(){
        $(".vedio_ul .vedio_li").hover(function(){
            $(this).find(".hid_img").css("display","inline");
        },function(){
            $(this).find(".hid_img").hide();
        })
    },

    //作业
    //作业鼠标移动事件
    homeworkHover:function(){
        $(".homework_ul li").hover(function(){
            $(this).find(".bord2").css("background-color","#54B2D4").css("color","#ffffff");
        },function(){
            $(this).find(".bord2").css("background-color","#ffffff").css("color","#333333");
        })
    },

    //走遍英美
    //获取走遍英美相关的学科
    getEnglishSubject:function(){
        var htm = '';
        for(var i in list){
            if(list[i].value !="01"&&list[i].value !="02"&&list[i].value !="03"){
                break;
            }
            htm += '<li class="subject_li ';
            if(i==0){
                htm += 'change_subject ';
            }
            htm +='" val="'+list[i].value+'" content="';
            if(list[i].value =="01"){
                htm +='4';
            }else if(list[i].value =="02"){
                htm +='6';
            }else if(list[i].value =="03"){
                htm +='5';
            }
            htm +='">'+list[i].label+'</li>';
        }
        $(".across_subject_ul").append(htm);
        index.englishSubjectClick();
    },
    //根据学科id获取走遍英美资源
    getEnglishResourse:function(subjectId,content){
        var htm = "",j = 0,ArtTitle = {},TitleId=[],TitleName=[];
        for(var i=0;i<resourse.length;i++){
            if(j>=10){
                break;
            }
            if(resourse[i].subjectId === subjectId&&resourse[i].content === content){
                j++;
            }else{
                continue;
            }
            htm += '<li class="article_li"><a target="_blank" href="../' + (subjectId == '03' ? 'acrossenglish/acrossenglish_voice' : 'expandandpromote/chinese_article') + '.html?id='+resourse[i].id+'"><i class="i_book indexSprite">&nbsp;&nbsp;&nbsp;&nbsp;</i>'+resourse[i].title+'</a></li>'
            TitleId.push(resourse[i].id);
            TitleName.push(resourse[i].title);
        }
        ArtTitle.ArtId = TitleId;
        ArtTitle.ArtName = TitleName;
        $(".article_ul").html(htm);
        index.englishClick(ArtTitle);
    },
    //走遍英美学科点击事件
    englishSubjectClick:function(){
        $(".across_subject_ul li").click(function(){
            $(".across_subject_ul li").removeClass("change_subject");
            $(this).addClass("change_subject");
            index.getEnglishResourse($(this).attr("val"),$(this).attr("content"));

            //换背景和标题
            $(".acrossenglish_div").removeClass("chinese").removeClass("match").removeClass("english")
            //$(".article_ul").removeClass("doubleFlower");
            //语文
            if($(this).attr("val")=="01"){
                $(".acrossenglish_div").addClass("chinese");
                $(".article_button").addClass("chinese");
                $(".article_button").removeClass("match");
                $(".article_button").removeClass("english");
                $(".fn_update_1").html("国学美文");
                $(".fn_update_2").html("美文常伴左右，读写能力自然提升");
                //$(".article_ul").addClass("doubleFlower");
                $(".article_button").attr("href","../expandandpromote/chinese.html");
            }else if($(this).attr("val")=="02"){
                $(".acrossenglish_div").addClass("match");
                $(".article_button").addClass("match");
                $(".article_button").removeClass("english");
                $(".article_button").removeClass("chinese");
                $(".fn_update_1").html("拓展学习");
                $(".fn_update_2").html("来这学数学，简单还有趣");
                $(".article_button").attr("href","../extendLearning/extendLearning_index.html");
            }else if($(this).attr("val")=="03"){
                $(".acrossenglish_div").addClass("english");
                $(".article_button").addClass("english");
                $(".article_button").removeClass("match");
                $(".article_button").removeClass("chinese");
                $(".fn_update_1").html("走遍英美");
                $(".fn_update_2").html("和英语相知，让阅读更容易");
                $(".article_button").attr("href","../acrossenglish/acrossenglish_index.html");
            }
        });
    },
    articleTitleClick:function(){
        $(".article_a").click(function(){
            if($(this).hasClass("chinese")){
                var VideoMenuid = GetMenuid("国学与美文");
                store.set("menuId",VideoMenuid);
            }else if($(this).hasClass("match")){
                var VideoMenuid = GetMenuid("拓展学习");
                store.set("menuId",VideoMenuid);
            }else if($(this).hasClass("english")){
                var VideoMenuid = GetMenuid("走遍英美");
                store.set("menuId",VideoMenuid);
            }
        });
    },
    //走遍英美点击事件
    englishClick:function(ArtTitle){
        $(".article_li a").click(function(){
            store.set('ArtTitle',ArtTitle);
        });
    },

    //刷题
    //获取刷题相关的学科
    getmustdoSubject:function(){
        var htm = '<img id="auto_img" src="../../static/image/index/Starry.png"/>';
        for(var i in list){
            htm += '<li class="mu_Sub'+list[i].value+'" data-subjectId="'+list[i].value+'"label="'+list[i].label+'"></li>';
        }
        $(".starry").html(htm);
        $('.starry li').on('click',function(){
            var subjectId = $(this).attr('data-subjectId');
            //if(subjectId=='01'||subjectId=='03'){
            //    $('#c_ErrorMsg').html('暂未开启').fadeIn(300);  Disappear("#c_ErrorMsg");
            //}else{
            //    window.location.href='../mustdo/must_DoGraph.html?subjectId='+subjectId+'&subjectname='+$(this).attr('label');
            //}
            window.location.href='../mustdo/must_DoGraph.html?subjectId='+subjectId+'&subjectname='+$(this).attr('label');
        });
    },

    //app下载
    appdownload:function(){
        $(".appdownload").hover(function(){
            $(".appdownload").css("background-color","#49B9DF");
            $(".appdownload i").css("color","#ffffff");
            $(".span1").show();
            $(".span2").show();
            $(".appdownloadImg").show();
        },function(){
            $(".appdownload").css("background-color","#ffffff");
            $(".appdownload i").css("color","#49B9DF");
            $(".span1").hide();
            $(".span2").hide();
            $(".appdownloadImg").hide();
        })
    }
}
function UserOpration(){
    setInterval(function(){
        $('#auto_img').height($(window).width()*0.2);
        $(".starry").height($("#auto_img").height());
        $(".appdownload_div").css("top",($(window).scrollTop()+$(window).height()/2));
        for(var i=0;i<$('.starry>li').length;i++){
            $('.starry>li').eq(i).height($('.starry>li').eq(i).width());
        }
    },1)
}
function GetMenuid(str){
    var MenuRole=store.get('data').retData.roleMenuRes;
    for(var i=0;i<MenuRole.length;i++){
        if(str==MenuRole[i].menuName){
            return MenuRole[i].menuId
        }
    }
}
$(function(){
    index.getBanner();
    index.subjectSel();
    index.getResourse();
    index.homeworkHover();
    index.appdownload();
    index.videoTitleClick();
    index.articleTitleClick();
    UserOpration();
    setTimeout('showAd()',3000);
})
ShowWeixinCode();
