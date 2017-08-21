//reEdit by subo on 2017-2-10
//获取导航--------------------------------------------------------------------------------------------------------------
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
SystemRedMsg();
//banner
var iW = ($(".i_Banner").outerWidth() * 37) / 192;
$(".i_Banner").css("height",iW + "px");
//设置首页数据
function setIndex(callBack) {
    $.ajax({
        type:"post",
        url:"/web/teacher/homepage/index/getSiteIndex",
        dataType:"json",
        success:function (data) {
            var Data = data.retData;
            new callBack(Data);
        }
    });
}
function index(data) {
    this.menuData = store.get('data').retData;//提取导航数据
    this.Data = data;//获取栏目数据
    this.init();//初始化
}
index.prototype = {
    init: function () {
        this.getBanner();
        this.videoColumn(imgAutoHeight1,imgAutoHeight2);//视频栏目启动
        this.coursewareColumn(imgAutoHeight3);//课件栏目启动
        this.homeworkColumn();//作业栏目启动
        this.footerColumn();//底部动态栏目启动
    },
    //获取banner
    getBanner:function() {
        $.ajax({
            type: "post",
            url: "/web/teacher/homepage/index/getTeacherSiteIndexAd",
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
    //视频
    videoColumn: function (callBack1,callBack2) {
        var menuData = this.menuData.roleMenuRes,//导航数据
            Data = this.Data,//栏目数据
            videoList = [];//视频数据
        $.each(Data,function (i,obj) {
            if(obj.content == "1"){
                videoList.push(obj);
            }
        });
        //添加数据
        var div = "",
            img = "",
            h4 = "",
            a = "",
            li = "",
            ul = "";
        $.each(videoList,function (i,obj) {
            var thumbnail = obj.thumbnail;
            if(i == 0){
                thumbnail != null ? thumbnail = obj.thumbnail : thumbnail = "../../static/image/index/iVideo_01.jpg";
                div = "<div class='i_Video_max_wrap'><img src='../../static/image/index/i_Video_01.png'></div>";
                img = "<img src='" + thumbnail +"'>";
                h4 = "<h4>" + obj.title + "</h4>";
                a = "<a href='prepare_video_prepareVideoPlay.html?id=" + obj.id + "' target='_blank'>" + div + img + h4 + "</a>";
                $(".i_Video_max").html(a);
                callBack1();
            }
            if(i != 0 && i < 5){
                thumbnail != null ? thumbnail = obj.thumbnail : thumbnail = "../../static/image/index/iVideo_02.jpg";
                div = "<div class='i_Video_min_wrap'><img src='../../static/image/index/i_Video_02.png'></div>";
                img = "<img src='" + thumbnail +"'>";
                h4 = "<h4>" + obj.title + "</h4>";
                a = "<a href='prepare_video_prepareVideoPlay.html?id=" + obj.id + "' target='_blank'>" + div + img + h4 + "</a>";
                li += "<li>" + a + "</li>";
            }
        });
        ul = "<ul>" + li + "</ul>";
        $(".i_Video_min").html(ul);
        callBack2();
        //添加链接
        var VideoMenuid=GetMenuid('视频');
        $("#sort5").attr('menuId',VideoMenuid);
        $("#sort5").on("click",function () {
            store.set("menuId",VideoMenuid);
        });
    },
    //课件
    coursewareColumn: function (callBack) {
        var menuData = this.menuData.roleMenuRes,//导航数据
            Data = this.Data;//栏目数据
        //添加数据
        var img = "",
            div = "",
            h4 = "",
            a = "",
            divWrap = "",
            _num = 0;
        $.each(Data,function (i,obj) {
            if(obj.content == "2"){
                _num++;
                if(_num < 5){
                    img = "<img src='"+ (obj.url ? obj.url : "../../static/image/index/img_courseware.jpg") +"' alt='" + obj.title + "'>";
                    h4 = "<h4>" + obj.title + "</h4>";
                    a = "<a href='../prepare/prepare_CoursePlay.html?id=" + obj.id + "' target='_blank'>" + img + h4 + "</a>";
                    divWrap += "<div class='i_Courseware_li'>" + a + "</div>";
                }
            }
        });
        $(".i_Courseware_ul").html(divWrap);
        //添加链接
        var CourMenuid=GetMenuid('课件');
        $("#sort9").attr('menuId',CourMenuid);
        $("#sort9").on("click",function () {
            store.set("menuId",CourMenuid);
        });
        callBack();
    },
    //作业
    homeworkColumn: function () {
        var menuData = this.menuData.roleMenuRes,//导航数据
            Tid = "";
        //添加链接
        for(var i=0;i<menuData.length;i++){
            if(menuData[i].menuName == "布置作业"){
                $("#sort21").attr("href",menuData[i].href);
                $("#sort19").attr("href",menuData[i].href);//作业的更多精彩，无主页，链到第1个子栏目
                Tid = menuData[i].menuId;
            }else if(menuData[i].menuName == "批改作业"){
                $("#sort23").attr("href",menuData[i].href);
            }else if(menuData[i].menuName == "作业报告"){
                $("#sort25").attr("href",menuData[i].href);
            }
        }
        //事件
        $(".i_Main_son_title_3 p a").on("click",function () {
            store.set("menuId",Tid);
        });
    },
    //底部动态栏目
    footerColumn: function () {
        var menuData = this.menuData.roleMenuRes,//导航数据
            Data = this.Data;//栏目数据
        var Turl = "",
            Tid = "",
            EAid = "",
            Ta = "",
            Tp = "",
            Th3 = "",
            Timg = "",
            T3 = {"for":"小学科","name":"试题","title":"全国各地中考题和模拟题任您选择"},
            T4 = {"for":"语文","name":"国学美文","title":"美文常伴左右，读写能力自然提升"},
            T5 = {"for":"英语","name":"走遍英美","title":"和英语相知，让阅读更容易"},
            T6 = {"for":"数学","name":"数学思维","title":"巧妙的方法和总结，轻松获取"},
            a = "",
            div = "",
            li = "",
            ul = "";
        var Array=[];
        var ArtTitle={};
        var TitleId=[];
        var TitleName=[];
        function SaveArtInfo(data){
            TitleId.push(data.id);
            TitleName.push(data.title);
            ArtTitle.ArtId=TitleId;
            ArtTitle.ArtName=TitleName;
            store.set('ArtTitle',ArtTitle);
        }
        function CreatArtArr(a){
            var ArtTitle={};
            var TitleId=[];
            var TitleName=[];
            var title=a;
            for(var k=0;k<title.length;k++){
                var href = title.eq(k).attr("href"),
                id = href.split("?id=")[1];
                if(id){
                    TitleId.push(id);
                    TitleName.push(title.eq(k).attr("title"));
                }
            }
            ArtTitle.ArtId=TitleId;
            ArtTitle.ArtName=TitleName;
            store.set('ArtTitle',ArtTitle);
        }
        var isFooterClumon = false;
        $.each (Data,function (i,obj) {
            //栏目头:设置和链接
            if(obj.content == "3"){
                SaveArtInfo(obj);
                //取链接
                $.each(menuData,function (i,obj) {
                    if(obj.menuName == "五年真题"){//试题  无主页，调取第1个子栏目
                        Tid = obj.menuId;
                        Turl = obj.href;
                    }
                });
                //设置
                EAid = obj.id;
                Ta = "<a class='ml20 fr' href='" + Turl + "'>更多精彩...</a>";
                Tp = "<p class='fs18 lh40'>" + T3.title + "</p>";
                Th3 = "<h3>" + T3.name + "</h3>";
                //栏目数据设置
                a = "<img src='../../../static/image/index/wordimg.png' alt=''><a class='resIDs' resId='"+obj.id+"' title='" + obj.title + "' target='_blank'>" + obj.title + "</a>";
                div = "<div class='i_OtherDiv'>" + a + "</div>";
                li += "<li>" + div + "</li>";
            }else if(obj.content == "4"){
                SaveArtInfo(obj);
                //取链接
                $.each(menuData,function (i,obj) {
                    if(obj.menuName == "美文"){//国学与美文  无主页，调取第1个子栏目
                        Tid = obj.menuId;
                        Turl = obj.href;
                    }
                });
                //设置
                Ta = "<a class='ml20 fr' href='../../../model/chinese/chinese_fiction.html'>更多精彩...</a>";
                Tp = "<p class='fs18 lh40'>" + T4.title + "</p>";
                Th3 = "<h3>" + T4.name + "</h3>";
                //栏目数据设置
                a = "<a href='../chinese/chinese_article.html?id=" + obj.id + "' title='" + obj.title + "' target='_blank'>" + obj.title + "</a>";
                div = "<div>" + a + "</div>";
                li += "<li>" + div + "</li>";
            }else if(obj.content == "5"){
                SaveArtInfo(obj);
                //取链接
                $.each(menuData,function (i,obj) {
                    if(obj.menuName == "走遍英美"){
                        Tid = obj.menuId;
                        Turl = obj.href;
                    }
                });
                //设置
                Ta = "<a class='ml20 fr' href='../../../model/acrossenglish/acrossenglish_index.html'>更多精彩...</a>";
                Tp = "<p class='fs18 lh40'>" + T5.title + "</p>";
                Th3 = "<h3>" + T5.name + "</h3>";
                //栏目数据设置
                a = "<a href='../acrossenglish/acrossenglish_voice.html?id=" + obj.id + "' title='" + obj.title + "' target='_blank'>" + obj.title + "</a>";
                div = "<div>" + a + "</div>";
                li += "<li>" + div + "</li>";
            }else if(obj.content == "6"){
                SaveArtInfo(obj);
                //取链接
                $.each(menuData,function (i,obj) {
                    if(obj.menuName == "数学思维"){
                        Tid = obj.menuId;
                        Turl = obj.href;
                    }
                });
                //设置
                Ta = "<a class='ml20 fr' href='../../../model/extendLearning/extendLearning_index.html'>更多精彩...</a>";
                Tp = "<p class='fs18 lh40'>" + T6.title + "</p>";
                Th3 = "<h3>数学思维</h3>";
                //栏目数据设置
                a = "<a href='../extendLearning/extend_article.html?id=" + obj.id + "' title='" + obj.title + "' target='_blank'>" + obj.title + "</a>";
                div = "<div>" + a + "</div>";
                li += "<li>" + div + "</li>";
            }else{//如果无数据将根据科目写入默认行标题和链接和标语
                if(isFooterClumon) return;
                isFooterClumon = true;
                $.ajax({
                    type: "post",
                    url: "/web/teacher/center/baseinfo",
                    async: false,
                    data: {},
                    success: function (data) {
                        data.retCode == "0000" ? data.retData ? data.retData.length != 0 ? tSuccess(data) : tError() : tError() : tError();
                    },
                    error: function () {
                        tError();
                    }
                });
                function tSuccess(data) {
                    var subject = data.retData.subjectId;
                    switch (subject){
                        case "01":
                            SaveArtInfo(obj);
                            //取链接
                            $.each(menuData,function (i,obj) {
                                if(obj.menuName == "美文"){//国学与美文  无主页，调取第1个子栏目
                                    Tid = obj.menuId;
                                    Turl = obj.href;
                                }
                            });
                            Ta = "<a class='ml20 fr' href='../../../model/chinese/chinese_fiction.html'>更多精彩...</a>";
                            Tp = "<p class='fs18 lh40'>" + T4.title + "</p>";
                            Th3 = "<h3>" + T4.name + "</h3>";
                            break;
                        case "02":
                            SaveArtInfo(obj);
                            //取链接
                            $.each(menuData,function (i,obj) {
                                if(obj.menuName == "数学思维"){
                                    Tid = obj.menuId;
                                    Turl = obj.href;
                                }
                            });
                            Ta = "<a class='ml20 fr' href='../../../model/extendLearning/extendLearning_index.html'>更多精彩...</a>";
                            Tp = "<p class='fs18 lh40'>" + T6.title + "</p>";
                            Th3 = "<h3>" + T6.name + "</h3>";
                            break;
                        case "03":
                            SaveArtInfo(obj);
                            //取链接
                            $.each(menuData,function (i,obj) {
                                if(obj.menuName == "走遍英美"){
                                    Tid = obj.menuId;
                                    Turl = obj.href;
                                }
                            });
                            Ta = "<a class='ml20 fr' href='../../../model/acrossenglish/acrossenglish_index.html'>更多精彩...</a>";
                            Tp = "<p class='fs18 lh40'>" + T5.title + "</p>";
                            Th3 = "<h3>" + T5.name + "</h3>";
                            break;
                        default:
                            SaveArtInfo(obj);
                            //取链接
                            $.each(menuData,function (i,obj) {
                                if(obj.menuName == "五年真题"){//试题  无主页，调取第1个子栏目
                                    Tid = obj.menuId;
                                    Turl = obj.href;
                                }
                            });
                            Ta = "<a class='ml20 fr' href='" + Turl + "'>更多精彩...</a>";
                            Tp = "<p class='fs18 lh40'>" + T3.title + "</p>";
                            Th3 = "<h3>" + T3.name + "</h3>";
                            break;
                    }
                }
                function tError() {
                    //暂无处理规则
                }
            }
        });
        var Thtml = Th3 + Tp + Ta;
        $("#footerClumon .i_Main_son_title").html(Thtml);//插入标题
        ul = "<ul class='i_Index_ul'>" + li + "</ul>";
        $("#footerClumon .i_Main_son_content").html(ul);//插入内容列表
        //事件
        $(".i_Main_son_title_4").parent().find("a").on("click",function () {
            var aArr = $(".i_Main_son_title_4").parent().find("a");
            if(!aArr.hasClass("resIDs")){
                CreatArtArr(aArr);
            }
            store.set("menuId",Tid);
        });
        $(".resIDs").on("click",function () {
            var id = $(this).attr("resId"),str = "query";
            $.ajax({
                type:"POST",
                data:{
                    "id":id,
                    "flag":str
                },
                async : false,
                url:"/web/teacher/examquestion/toExamQuestion",
                success:function(data){
                    if(data.retCode == "0000"){
                        var downloadtype='realQuestionDownload';
                        var Obj=data.retData;
                        Obj.downloadtype=downloadtype;
                        store.set("documentarticle",JSON.stringify(Obj));
                        console.log(JSON.stringify(Obj))
                        window.open("../examquestion/articledetails.html","","");
                    }
                }
            });
        });
    }
};
//页面右侧快捷入口
function shortKey(){
    //定义基础属性
    this.Div = "<div class='short_Key'></div>";//快捷入口根节点
    this.toTopDiv = "<a class='to_Top ' style='display: none' href='javascript:;'><span>顶部</span></a>";//返回顶部按钮
    this.appCodeDiv = "<a class='app_Code' href='javascript:;'><div class='app_Code_QR'><i></i><img src='../../static/image/index/qr.png'><p>扫一扫，免费下载APP</p></div></a>";//app二维码
    this.init();//初始化
}
shortKey.prototype = {
    init: function(){
        this.addDiv();
        this.toTop();
        this.appCode();
    },
    addDiv: function(){
        var Div = this.Div;
        $("body").append(Div);
        $(window).on("scroll",function(){
            var iH = $(window).height() / 2,
                dH = $(window).scrollTop();
            $(".short_Key").stop(true,true).animate({
                top: iH + dH
            },100);
        });
    },
    toTop: function(){
        var toTopDiv = this.toTopDiv;
        $(".short_Key").append(toTopDiv);
        $(".to_Top").on("click",function(){
            $("body").stop(true,true).animate({
                scrollTop: 0
            },200);
        });
    },
    appCode: function(){
        var appCodeDiv = this.appCodeDiv;
        $(".short_Key").prepend(appCodeDiv);
        $(".app_Code").on("mouseenter",function(){
            $(".app_Code_QR").stop(true,true).fadeIn(200);
        });
        $(".app_Code").on("mouseleave",function(){
            $(".app_Code_QR").stop(true,true).fadeOut(200);
        });
    }
};
//图片高度适配
function imgAutoHeight1() {
    $(".i_Video_max > a > img").height($(".i_Video_max > a:first").width() * 315 / 359);
}
function imgAutoHeight2() {
    $(".i_Video_min a > img").height($(".i_Video_min a:first").width() * 145 / 257);
}
function imgAutoHeight3() {
    $(".i_Courseware_li img").height($(".i_Courseware_li a:first").width() * 9 / 13);
}
$(window).resize(function () {
    $(".i_Video_max > a > img").height($(".i_Video_max > a:first").width() * 315 / 359);
    $(".i_Video_min a > img").height($(".i_Video_min a:first").width() * 145 / 257);
    $(".i_Courseware_li img").height($(".i_Courseware_li a:first").width() * 9 / 13);
    //banner高度自动
    var iW = ($(".i_Banner").outerWidth() * 37) / 192;
    $(".i_Banner").css("height",iW + "px");
});
function GetMenuid(str){
    var MenuRole=store.get('data').retData.roleMenuRes;
    for(var i=0;i<MenuRole.length;i++){
        if(str==MenuRole[i].menuName){
            return MenuRole[i].menuId
        }
    }
}
new setIndex(index);
new shortKey();
ShowWeixinCode();
setTimeout('showAd()',3000);
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

