CheckBrower();//检查浏览器版本
GetHtml("../../model/common/common.txt","#Header");//引入导航
//截取URL 的 id
var PPtId=Request.id;
queryordownload(PPtId,"query");//统计浏览量；
//备课中心课件详情
var flag='';
var documentId='';//资源在百度云的Id；
var bucketName='';//百度云文件服务器名称;
var objectKey='';//百度云文件唯一标识;
var praiseCount;
var prepareData;
function GetCWDetail() {
    $.ajax({
        type: "post",
        url: "/web/teacher/courseware/details",
        data: {
            resId:PPtId
        },
        dataType: "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                praiseCount=data.retData.count;
                $(".p_ZanCount").html('（'+praiseCount+'）');//点赞数量；
                documentId=data.retData.resResourseRes.documentId;
                bucketName=data.retData.resResourseRes.bucketName;
                objectKey=data.retData.resResourseRes.objectKey;
                flag=data.retData.flag;//点赞标识；
                $(".p_CWTitle").html(data.retData.resResourseRes.title);//标题
                var str='';
                str=data.retData.resResourseRes.content;
                str=str.replace(/\&lt;/g,'<');
                str=str.replace(/\&gt;/g,'>');
                str=str.replace(/\&quot;/g,'"');
                str=str.replace(/\&amp;nbsp;/g, "");
                $(".p_CWItdTxt").html(str);//课件介绍文本
                GetBaiduCW(documentId);//从百度云获取课件
                //点赞
                if(flag==true){
                    $(".p_CWZan").removeClass("p_Praiseico").addClass("p_yetPraiseico");
                    $(".p_ZanCount").css("color","#F4840A");
                }
                //下载功能
                $(".c_CWDownLoadBtn").on("click",function(){
                    download();
                })
            }
        }
    });
}
GetCWDetail();
//点赞功能
$(".p_CWZan").on("click",function(){
    if(flag==false){
        Like(PPtId);//课件点赞
        flag=true;
    }else {
        NoLike(PPtId);//取消点赞
        flag=false;
    }
});
//点赞
function Like(currentId) {
    $.ajax({
        type: "post",
        url: "/web/teacher/prepare/like",
        data: {
            resId:currentId
        },
        dataType: "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                praiseCount+=1;
                $(".p_ZanCount").html('（'+praiseCount+'）');
                $(".p_CWZan").removeClass("p_Praiseico").addClass("p_yetPraiseico");
                $(".p_ZanCount").css("color","#F4840A");
            }
        }
    });
}
//取消点赞
function NoLike(currentId) {
    $.ajax({
        type: "post",
        url: "/web/teacher/prepare/nolike",
        data: {
            resId:currentId
        },
        dataType: "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                praiseCount-=1;
                $(".p_ZanCount").html('（'+praiseCount+'）');
                $(".p_CWZan").removeClass("p_yetPraiseico").addClass("p_Praiseico");
                $(".p_ZanCount").css("color","#7B7B7B");
            }
        }
    });
}
//从百度云获取课件
function GetBaiduCW(a) {
    $.ajax({
        type: "post",
        url: "/web/common/baiducheckarticle",
        data: {
            documentId:a
        },
        dataType: "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                checkarticle(data.retData);
                prepareData = data.retData;
            }
        }
    });
}
//文档预览的主方法
var cwwidth;//通过判断浏览器的宽度决定课件容器的宽度
if(document.body.offsetWidth>1600){
    cwwidth=1200;
}else if(document.body.offsetWidth>1366){
    cwwidth=1000;
}else{
    cwwidth=900;
}
console.log(cwwidth);
function checkarticle(data){
    var option = {
        docId: data.docId,
        token: data.token,
        host:  data.host,
        width: cwwidth, //文档容器宽度
        pn: 0,  //定位到第几页，可选
        ready: function (handler) {  // 设置字体大小和颜色, 背景颜色（可设置白天黑夜模式）
            handler.setFontSize(1);
            handler.setBackgroundColor('#000');
            handler.setFontColor('#fff');
        },
        flip: function (data) {    // 翻页时回调函数, 可供客户进行统计等
            console.log(data.pn);
        },
        fontSize:'big',
        toolbarConf: {
            page: true, //上下翻页箭头图标
            pagenum: true, //几分之几页
            full: true, //是否显示全屏图标,点击后全屏
            copy: false, //是否可以复制文档内容
            position: 'center',// 设置 toolbar中翻页和放大图标的位置(值有left/center)
        } //文档顶部工具条配置对象,必选
    };
    new Document('p_CWReader', option);
}
//下载的点击方法
function download(){
        //判断该用户金币是否够用
        //判断逻辑。。。。。
        //下载次数加1
        var bo =queryordownload(PPtId,"download");
        if(!bo){
            alert("数据异常");
            return;
        }
        //用户验证
        $.ajax({
            type : "post",
            url : "/web//user/check/user/auth/status",
            dataType : "json",
            success : function(data){
                console.log(data)
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
                console.log(data)
                if(data.retCode == "0000"){
                    var usable = data.retData.usable;
                    if(!usable){
                        $(".p_shark").show();
                        return false;
                    }
                    console.log(usable)
                    if(usable >= 1){
                        downreload();
                    }else{
                        $(".p_shark").show();
                    }
                }
            },
            error : function(e){
                console.log(e)
            }
        })
    }
    $(".p_success_remove").on("click",function(){
        $(".p_sharks").hide();
    })
    $(".p_checkname").on("click",function(){
        window.location.href = "../me/me_certification.html";
    })
    $(".p_success_dele").on("click",function(){
        $(".p_shark").hide();
    });
    $(".p_name").on("click",function(){
        window.location.href = "../me/me_pay.html"
    });
        //。。。。。
        function downreload(){
            $.ajax({
                type:"POST",
                data:{
                    "objectKey":objectKey,
                    "bucketName":bucketName,
                    "expirationInSeconds":-1
                },
                url:"/web/common/baidudownload",
                success:function(data){
                    var a = document.createElement("a");
                    a.setAttribute("href",data);
                    a.setAttribute("download","下载");
                    a.click();
                }
            });
        }

}
//下载或阅览时相应的字段加1
function queryordownload(id,str){
    var bo = true;
    $.ajax({
        type:"POST",
        data:{
            "id":id,
            "flag":str
        },
        url:"/web/common/queryordownnum",
        success:function(data){
            if(data.retCode!="0000"){
                bo = false;
            }
        }
    });
    return bo;
}

if(window.location.hash!=''){
    $('body,html').html('')
    ShareRedirect();
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
        $('body,html').html("暂时不支持IOS版本，更多详情<a href='http://www.bcbook.cn/'>五好导学网</a>") ;
        window.location.href="../../../../index.html";
    }else if(bIsAndroid || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM){
        $('body,html').html("正在跳转到下载地址...<br/>如果是微信访问，请点击右上角选择从浏览器打开") ;
        window.location.href="http://wuhaodaoxuewang.com:88/appweb/model/me/download.html";
    }else {
        $('body,html').html("请使用手机访问，或者请前往官方<a href='http://www.bcbook.cn/'>五好导学网</a>") ;
        window.location.href="../../../../index.html";
    }
}


/*分享*/
$('.p_CWShare').hover(function(){
    $(this).removeClass('p_shareico ').addClass('p_yetshareico');
},function(){
    $(this).removeClass('p_yetshareico ').addClass('p_shareico');
});
$('.p_CWShare').on('click',function(){
    $('#Share').fadeIn(150);

});

//当分辨率改变时改变课件的宽度
(function($,h,c){var a=$([]),e=$.resize=$.extend($.resize,{}),i,k="setTimeout",j="resize",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);

window.onload = function(){
    $("#p_CWOperationWrap_div").resize(function(){
        if(document.body.offsetWidth>1581){
            cwwidth=1200;
        }else if(document.body.offsetWidth>1347){
            cwwidth=1000;
        }else{
            cwwidth=900;
        }
        $("#p_CWReader").empty();
        checkarticle(prepareData);
    });
}

