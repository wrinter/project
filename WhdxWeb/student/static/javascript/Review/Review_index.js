/**
 * Created by lgr on 2017/5/19.
 */
//获取年级
getGreade();
function getGreade(){
    $.ajax({
        type : "post",
        url : "/web/student/review/getCradeSubject",
        dataType : "json",
        success : function(data){
            console.log(data)
            if(data.retCode == "0000"){
                showGreade(data);
                Default(data)//默认
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
            if(id == "7"){
                Default(data);//七年级
                if(!$(this).hasClass("add")){
                    $(this).addClass("add");
                    $(this).siblings(".R_gre").removeClass("add");
                }else{
                    $(this).removeClass("add");
                }
            }else{
                if(!$(this).hasClass("add")){
                    $(this).addClass("add");
                    $(this).siblings(".R_gre").removeClass("add");
                }else{
                    $(this).removeClass("add");
                }
                Eight(data);//八年级
            }
        })
    }
    $(".R_gre[i='0']").addClass("add");
}
//默认七年级
function Default(data){
    var Dtrue = data.retData[0];
    var id = Dtrue.id;
    var name = Dtrue.name;
    var subjectResList = Dtrue.subjectResList;
    for(var i = 0;i<subjectResList.length;i++){
        var Dtrue = subjectResList[i];
        var label = Dtrue.label;
        var materialId = Dtrue.materialId;
        var materialName = Dtrue.materialName;
        var value = Dtrue.value;
        var $GreadeName = $("<li class='R_sub' materialId='"+materialId+"' value='"+value+"'>"+label+"</li>").appendTo(".R_kwonsub");
        $GreadeName.on("click",function(){
            var materialId = $(this).attr("materialId");
            var value = $(this).attr("value");
            if(!$(this).hasClass("add")){
                $(this).addClass("add");
                $(this).siblings(".R_sub").removeClass("add");
                getPoint(value,materialId);
            }else{
                $(this).removeClass("add");
            }
        })
    }
    $(".R_sub").eq(0).addClass("add");
    var materialId = $(".R_sub").eq(0).attr("materialId");
    var value = $(".R_sub").eq(0).attr("value");
    getPoint(value,materialId);
}
//八年级
function Eight(data){
    var Dtrue = data.retData[1];
    var id = Dtrue.id;
    var name = Dtrue.name;
    var subjectResList = Dtrue.subjectResList;
    for(var i = 0;i<subjectResList.length;i++){
        var Dtrue = subjectResList[i];
        var label = Dtrue.label;
        var materialId = Dtrue.materialId;
        var materialName = Dtrue.materialName;
        var value = Dtrue.value;
        var $GreadeName = $("<li class='R_sub' materialId='"+materialId+"' value='"+value+"'>"+label+"</li>").appendTo(".R_kwonsub");
    }
    $(".R_sub").on("click",function(){
        var materialId = $(this).attr("materialId");
        var value = $(this).attr("value");
        if(!$(this).hasClass("add")){
            $(this).addClass("add");
            $(this).siblings(".R_sub").removeClass("add");
            getPoint(value,materialId);
        }else{
            $(this).removeClass("add");
        }
    })
    $(".R_sub").eq(0).addClass("add");
    var materialId = $(".R_sub").eq(0).attr("materialId");
    var value = $(".R_sub").eq(0).attr("value");
    getPoint(value,materialId);
}
//获取知识点
function getPoint(subjectId,materId){
    var menuId = JSON.parse(localStorage.getItem("menuId"));
    var parmas = {};
    parmas.menuId = "ae3dac1862b84c67ae4e35eacab6e4ff";
    parmas.materId = materId;
    parmas.subjectId = subjectId;
    $.ajax({
        type : "post",
        url : "/web/student/review/getCategoryFile",
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
            var $R_objList = $("<div class='R_objList' documentId='"+serviceId+"' synServiceId = '"+synServiceId+"' synService='"+synService+"' service='"+service+"' synFilePath='"+synFilePath+"' filePath='"+filePath+"'>").appendTo(R_fc);
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
                var $R_listName = $("<li class='R_listName'documentId='"+serviceId+"' synServiceId = '"+synServiceId+"' synService='"+synService+"' service='"+service+"' synFilePath='"+synFilePath+"' filePath='"+filePath+"' >"+name+"</li>").appendTo($R_ul);
                $R_listName.on("click",function(){
                    $(this).addClass("add");
                    $(this).siblings(".R_listName").removeClass("add");
                    var documentId = $(this).attr("documentId");
                    if($(this).attr("synServiceId")!= "null"){
                        R_Look.removeClass("addword").text("查看解析").show();//查看解析显示
                    }else{
                        R_Look.removeClass("addword").text("查看解析").hide();//查看解析隐藏
                    }
                    $(".R_content").css({"height":"800px"});
                    BaiDoc(documentId);
                })
            }
        }
    }
    //知识点列表
    $(".R_objList").on("click",function(){
        $(this).find(".R_ul").show();
        $(this).find(".Dom_Down").css({'animation':'change 0.3s linear 1 forwards'});
        $(this).siblings(".R_objList").find(".Dom_Down").css({'animation':''});
        $(this).siblings(".R_objList").find(".R_ul").hide();
        $(this).siblings(".R_objList").find(".R_listName").removeClass("add");
        $(this).siblings(".R_objList").removeClass("add");
        //没有知识点梳理
        if(!$(this).find(".R_ul").html()){
            $(this).addClass("add").find(".R_objName");
            var documentId = $(this).attr("documentId");
            $(".R_content").css({"height":"800px"});
            BaiDoc(documentId);
            if($(this).attr("synServiceId")!= "null"){
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
    var R_listName = $(".R_listName")
    R_listName.eq(0).addClass("add");
    var documentId = R_listName.eq(0).attr("documentId");
    if(R_listName.eq(0).attr("synServiceId")!= "null"){
        R_Look.show();//查看解析显示
    }else{
        R_Look.hide();//查看解析隐藏
    }
    BaiDoc(documentId);
    ClickDload();//下载
    ClickLook();//查看解析
}
//获取百度文档
function BaiDoc(documentId){
    $("#reader").html("");//加数据之前清空
    $.ajax({
        type : "post",
        url : "/web/common/baiducheckarticle",
        data : {documentId : documentId},
        dataType : "json",
        beforeSend : function(){
            $(".R_Download,.R_Sharks").show();
        },
        success : function(data){
            if(data.retCode == "0000"){
                var Mwidth = $(".Main").width();
                var Lwidth = $(".R_subject").width();
                var Cwidth = parseInt(parseInt(Mwidth)-parseInt(Lwidth)-30);
                if(data.retData.docId == null || data.retData.host == null || data.retData.token == null){
                    $("<img class='review_img' src='../../static/image/Review/review.png' />").appendTo(".R_content");
                    $(".R_Look,.R_Download,.R_Sharks").hide();
                    return false;
                }
                checkarticle(data.retData,Cwidth);
                sessionStorage.setItem("data",JSON.stringify(data.retData));
            }else{
                $("<img class='review_img' src='../../static/image/Review/review.png' />").appendTo(".R_content");
                $(".R_Look,.R_Download,.R_Sharks").hide();
            }
        },
        error : function(e){
            $(".R_Sharks").hide();
            console.log(e)
        }
    })
}
//文档预览的主方法
function checkarticle(data,Cwidth){
    //遮罩层消失
    function timeout() {
        $(".R_Sharks").hide();
    };
    setTimeout(timeout,1000);//2秒之后消失
    $("#reader").html("");//加数据之前清空
    var option = {
        docId: data.docId,
        token: data.token,
        host:  data.host,
        width: Cwidth, //文档容器宽度
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
    new Document('reader', option);
}
//适配
$(window).resize(function(){
    if(document.body.offsetWidth<=1366){
        var Mwidth = $(".Main").width();
        var Lwidth = $(".R_subject").width();
        var Cwidth = 700;
    }else if(document.body.offsetWidth>1366&&document.body.offsetWidth<1600){
        var Mwidth = $(".Main").width();
        var Lwidth = $(".R_subject").width();
        var Cwidth = 780;
    }
    else{
        var Mwidth = $(".Main").width();
        var Lwidth = $(".R_subject").width();
        var Cwidth = 930;
    }
    $("#reader,.wenku-toolsbar-inner,iframe,.wenku-toolsbar-mod,.bd,.reader-container,.reader-page,.complex,.reader-container-inner,.reader-container p").css({"width":Cwidth});
    $(".wenku-toolsbar-zoom").hide();
    //checkarticle(dataa,Cwidth);
    //$("#reader").html("");//加数据之前清空
    //$(".R_fc").find(".add").click();
    //$("#reader").html("");//加数据之前清空
});
//百度云下载
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
        var synServiceId = R_fc.find(".add").attr("synServiceId");
        BaiDoc(synServiceId);
        that.addClass("addword").text("收起解析");
    }else{
        var documentId = R_fc.find(".add").attr("documentId");
        BaiDoc(documentId);
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