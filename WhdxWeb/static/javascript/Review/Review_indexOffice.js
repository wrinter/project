/**
 * Created by lgr on 2017/5/17.
 */
//SystemRedMsg();
//CheckBrower();
var pptid;
GetHtml("../../model/common/common.txt","#Header");
var resIDclick;
var resIDUl;
var resIDfirst;
getGreade();
function getGreade(){
    $.ajax({
        type : "post",
        url : "/web/teacher/review/getGrade",
        dataType : "json",
        success : function(data){
            console.log(data)
            if(data.retCode == "0000"){
                showGreade(data);
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
//年级
function showGreade(data){
    for(var i = 0;i<data.retData.length;i++ ){
        var Dtrue = data.retData[i];
        var id = Dtrue.id;
        var name = Dtrue.name;
        var $GreadeName = $("<li class='R_gre'id='"+id+"' i='"+i+"'>"+name+"</li>").appendTo(".R_greadesub");
        $GreadeName.on("click",function(){
            var id = $(this).attr("id");
            $(".R_kwonsub").html("");
            if(!$(this).hasClass("add")){
                $(this).addClass("add");
                $(this).siblings(".R_gre").removeClass("add");
            }else{
                $(this).removeClass("add");
            }
            getPoint(id)
        })
    }
    $(".R_gre[i='0']").addClass("add");
    var id = $(".R_gre[i='0']").attr("id");
    getPoint(id);//获取知识点
}
//获取知识点
function getPoint(materId){
    var menuId = JSON.parse(localStorage.getItem("menuId"));
    var parmas = {};
    parmas.menuId = "eca3ef5af6d64b9ab6f9475eac535424";
    parmas.materId = materId;
    $.ajax({
        type : "post",
        url : "/web/teacher/review/getCategoryFile",
        data : parmas,
        dataType : "json",
        success : function(data){
            console.log(data)
            if(data.retCode == "0000"){
                //知识点
                KnowData(data);
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
//知识点数据层展现
function KnowData(data){
    var R_fc = $(".R_fc");
    var R_Look = $(".R_Look")
    R_fc.html("");
    var R_greadName = $(".R_greadName");
    for(var i = 0;i<data.retData.length;i++){
        var Dtrue = data.retData[i];
        var name = Dtrue.name;
        R_greadName.text(name);
        //知识点第一层级
        for(var j = 0;j<Dtrue.childrens.length;j++){
            var cDtrue = Dtrue.childrens[j];
            var name = cDtrue.name;
            var serviceId = cDtrue.serviceId;
            var synServiceId = cDtrue.synServiceId;
            var filePath = cDtrue.filePath;
            var synFilePath = cDtrue.synFilePath;
            var service = cDtrue.service;
            var synService = cDtrue.synService;
            var resID = cDtrue.resID;
            var synFileid = cDtrue.synFileid;
            var $R_objList = $("<div class='R_objList' synFileid='"+synFileid+"' resID='"+resID+"' documentId='"+serviceId+"' synServiceId = '"+synServiceId+"' synService='"+synService+"' service='"+service+"' synFilePath='"+synFilePath+"' filePath='"+filePath+"'>").appendTo(R_fc);
            var $R_objName = $("<span class='R_objName' documentId='"+serviceId+"'>"+name+"</span>").appendTo($R_objList);
            var ArrowsFont = $("<i class='ArrowsFont Dom_Down'>&#xe600;</i>").appendTo($R_objList);
            var $R_ul = $("<ul class='R_ul'>").appendTo($R_objList);
            //    章节知识点梳理
            for(var k = 0;k<cDtrue.childrens.length;k++){
                var CCtrue = cDtrue.childrens[k];
                var fileId = CCtrue.fileId;
                var filePath = CCtrue.filePath;
                var id = CCtrue.id;
                var name = CCtrue.name;
                var parentId = CCtrue.parentId;
                var resID = CCtrue.resID;
                var service = CCtrue.service;
                var serviceId = CCtrue.serviceId;
                var synFilePath = CCtrue.synFilePath;
                var synFileid = CCtrue.synFileid;
                var synService = CCtrue.synService;
                var synServiceId = CCtrue.synServiceId;
                var $R_listName = $("<li class='R_listName' synFileid='"+synFileid+"' resID='"+resID+"' documentId='"+serviceId+"' synServiceId = '"+synServiceId+"' synService='"+synService+"' service='"+service+"' synFilePath='"+synFilePath+"' filePath='"+filePath+"' >"+name+"</li>").appendTo($R_ul);
                $R_listName.on("click",function(){
                    $(this).addClass("add");
                    $(this).siblings(".R_listName").removeClass("add");
                    var resID = $(this).attr("resID");
	                pptid = resID
                    if($(this).attr("synfileid")!= "null"){
                        R_Look.removeClass("addword").text("查看解析").show();//查看解析显示
                    }else{
                        R_Look.removeClass("addword").text("查看解析").hide();//查看解析隐藏
                    }
                    //刷新子页面的数据
	                document.getElementById('iframeReload').src = "Review.html";
                })
            }
        }
    }
    $(".R_objList").on("click",function(){
        $(this).find(".R_ul").show();
        $(this).find(".Dom_Down").css({'animation':'change 0.3s linear 1 forwards'});
        $(this).siblings(".R_objList").find(".Dom_Down").css({'animation':''});
        $(this).siblings(".R_objList").find(".R_ul").hide();
        $(this).siblings(".R_objList").find(".R_listName").removeClass("add");
        $(this).siblings(".R_objList").removeClass("add");
        if($(this).find(".R_ul").html() != ""){
            $(this).find(".R_ul").css("padding-bottom","16.5px");
        }
        //没有知识点梳理
        if(!$(this).find(".R_ul").html()){
            $(this).addClass("add").find(".R_objName");
            var resID = $(this).attr("resID");
	        pptid  = resID
	        //刷新子页面的数据
	        document.getElementById('iframeReload').src = "Review.html"
            if($(this).attr("synfileid")!= "null"){
                R_Look.removeClass("addword").text("查看解析").show();//查看解析显示
            }else{
                R_Look.removeClass("addword").text("查看解析").hide();//查看解析隐藏
            }
        }
    })
    //期末测试没有三角
    var R_objList = $(".R_objList");
    R_objList.each(function(){
        if(!$(this).find(".R_ul").html()){
            $(this).find(".Dom_Down").remove();
        }
    })
//    默认第一个
    $(".R_objName").eq(0).siblings(".R_ul").show();
    //三角
    $(".R_objName").eq(0).parent(".R_objList").find(".Dom_Down").css({'animation':'change 0.3s linear 1 forwards'});
    //梳理第一个获取
    var R_listName = $(".R_listName");
    R_listName.eq(0).addClass("add");
    var resID = R_listName.eq(0).attr("resID");
	pptid = resID
    if(R_listName.eq(0).attr("synfileid")!= "null"){
        R_Look.show();//查看解析显示
    }else{
        R_Look.hide();//查看解析隐藏
    }
    //默认第一个下有16.5px
    if(R_listName.eq(0).parent(".R_ul").html() != ""){
        R_listName.eq(0).parent(".R_ul").css("padding-bottom","16.5px");
    }
	//刷新子页面的数据
	document.getElementById('iframeReload').src = "Review.html"
    ClickDload();//下载
    ClickLook();//查看解析
}
var c;
function ClickDload(){
    if(c){

    }else{
        $(".R_Download").on("click",function(){
            BaiduDownload();
        })
        c = true;
    }
}
//获取下载参数
function BaiduDownload(){
    var parmas = {};
    var R_fc = $(".R_fc");
    var R_Look = $(".R_Look");
    if(R_fc.find(".add").attr("synService") == null || R_fc.find(".add").attr("synService") == "null"){
        objectKey = R_fc.find(".add").attr("filePath");
        bucketName = R_fc.find(".add").attr("service");
    }else{
        if(R_Look.hasClass("addword")){
            objectKey = R_fc.find(".add").attr("synFilePath");
            bucketName = R_fc.find(".add").attr("synService");
        }else{
            objectKey = R_fc.find(".add").attr("filePath");
            bucketName = R_fc.find(".add").attr("service");
        }
    }
    parmas.objectKey = objectKey;
    parmas.bucketName = bucketName;
    parmas.expirationInSeconds = -1;
    downreload(bucketName,objectKey);
}
//下载
function downreload(bucketName,objectKey){
    $.ajax({
        type:"POST",
        data:{
            "objectKey":objectKey,
            "bucketName":bucketName,
            "expirationInSeconds":-1
        },
        url:"/web/common/baidudownload",
        success:function(data){
            if(data){
                window.location.href = data;
            }else{
                alert("无效的下载地址！");
            }
        }
    });
}
//查看解析
var d;
function ClickLook(){
    console.log(d)
    if(d){

    }else{
        $(".R_Look").on("click",function(){
            $(".R_content").css({"height":"800px"});
            Look($(this));
        })
        d = true;
    }
}
function Look(that){
    var R_fc = $(".R_fc");
    if(!that.hasClass("addword")){
        var synfileid = R_fc.find(".add").attr("synfileid");
	    pptid = synfileid;
	    //刷新子页面的数据
	    document.getElementById('iframeReload').src = "Review.html";
        that.addClass("addword").text("收起解析");
    }else{
        var resID = R_fc.find(".add").attr("resID");
	    pptid = resID;
	    //刷新子页面的数据
	    document.getElementById('iframeReload').src = "Review.html";
        that.removeClass("addword").text("查看解析");
    }
}
//滑动
$(window).scroll(function(){
    var scroolltop = $(window).scrollTop();
    var headertop = $(".task_title").height();
    if(scroolltop > 160){
        $(".R_grade_subject").css({"top":(scroolltop-160)+"px"});
    }else{
        $(".R_grade_subject").css({"top":0+"px"});
    }
})