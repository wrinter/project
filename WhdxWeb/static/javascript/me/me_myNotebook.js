/**
 * Created by 王长栋 on 2016/11/22.
 */
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt", "#Header");
CheckBrower();
SystemRedMsg();
var kownledgerTree = {
    'cell':[],
    'chapter':{},
    'subjectId':''
};
//获取一级目录
function getFirst() {
    var param = {};
    $.ajax({
        type: "get",
        url: "/web/teacher/center/wrongbook/knowledge",
        data: param,
        dataType: "json",
        success: function (data) {
            constructData(data);
            createKownledge();
        }
    });
}
getFirst();
//调接口 展示每章错题
$(".error_level").on("click", ".every_level", function () {
    $(this).addClass("l_active").siblings().removeClass("l_active");
    var pid = $(this).parent().attr('id');
    var cid = this.id;
    if(pid=="m_cell"){
        var cList = kownledgerTree.chapter[cid];
        if(cList!=undefined) {
            var htm = '';
            htm += "<span>" + cList[0].levelName + ":</span>";
            for (var i = 0; i < cList.length; i++) {
                htm += "<span class='every_level' id='" + cList[i].id + "'>" + cList[i].name + "</span>";
            }
            $("#m_chapter").html(htm);
            $("#m_chapter").find(".every_level:first").addClass("l_active");
            testPaper(cList[0].id, 1, 3);
            store.set('Unitid', cList[0].id);
        }else{
            testPaper(cid,1,3);
            store.set('Unitid',cid);
        }
    }else{
        testPaper(cid,1,3);
        store.set('Unitid',cid);
    }
});
function constructData(data){
    if(data.retCode=='0000'){
        var list = data.retData;
        if(list.length>0){
            kownledgerTree.subjectId = list[0].subjectId;
            for(var i=0;i<list.length;i++){
                var cell = {},chapters=[];
                cell.id = list[i].knowledgeId;
                cell.name = list[i].name;
                cell.levelName = list[i].levelName;
                kownledgerTree.cell.push(cell);
                var cList = list[i].childrens;
                if(cList.length>0){
                    for(var j=0;j<cList.length;j++){
                        var chapter={};
                        chapter.id = cList[j].knowledgeId;
                        chapter.name = cList[j].name;
                        chapter.levelName = cList[j].levelName;
                        chapters.push(chapter);
                    }
                    kownledgerTree.chapter[list[i].knowledgeId] = chapters;
                }
            }
        }
    }
}
function createKownledge(){
    var arrId = "";
    //生成单元
    var list = kownledgerTree.cell;
    var li = "";
    li += "<span>" + list[0].levelName + ":</span>";
    if(kownledgerTree.subjectId!='07'){
        li += "<span class='every_level all' id=''>" + '全部' + "</span>";
    }
    for (var k = 0; k < list.length; k++) {
        li += "<span class='every_level' id='" + list[k].id + "'>" + list[k].name + "</span>";
        if (k < list.length - 1) {
            arrId += list[k].id + ",";
        } else {
            arrId += list[k].id;
        }
    }
    store.set("arrId", arrId);
    $("#m_cell").html(li);
    $("#m_cell").find(".every_level:first").addClass("l_active");
    //生成章节
    var htm = '';
    var cList = kownledgerTree.chapter[list[0].id];
    if(cList!=undefined&&cList.length>0){
        htm += "<span>" + cList[0].levelName + ":</span>";
        for(var i=0;i<cList.length;i++){
            htm += "<span class='every_level' id='" + cList[i].id + "'>" + cList[i].name + "</span>";
        }
        $("#m_chapter").html(htm);
        $("#m_chapter").find(".every_level:first").addClass("l_active");
        testPaper(cList[0].id,1,3);
        store.set('Unitid', cList[0].id);
    }else{
        var cellId = $('.every_level:first').attr('id');
        testPaper(cellId,1,3);
        store.set('Unitid', cellId);
    }
}
//展示错题 接口
function testPaper(id,pageNum,pageSize) {
    var param = {};
    param.knowLedgeList = id;
    param.pageNum = pageNum;
    param.pageSize = pageSize;
    $.ajax({
        type: "get",
        url: "/web/teacher/center/wrongbook",
        data: param,
        dataType: "json",
        success: function (data) {
            if (data.retCode == "0000") {
                var list = data.retData.list;
                var li = "";
                if(list.length == 0){
                    li += "<img class='noImg' src='../../../static/image/kola/no.png'>";
                    $(".Paging").hide();
                }else{
                    $(".Paging").show();
                    for(var i in list){
                        /*判断是组题还是单题---单题：groupCode==null组题：groupCode！=null*/
                        if(list[i].groupCode==null){
                            for(var k=0 in list[i].questions){
                                li += "<ul class='source_txt slot-list'>";
                                li += "<li class='lineBox slot-item saveLine' data-split='" + list[i].isSplite + "' data-groupcode='" + list[i].groupCode + "'>";
                                $.each(list[i].questions, function (i, obj) {
                                    li += "<div id='" + obj.questionId + "' class='questionContext'>" + obj.questionTitle.replace("题干", "<span class='m_order'></span>").replace("【","").replace("】","") + "</div>";
                                    li += "<div class='option optionA'>" + obj.optionA + "</div>";
                                    li += "<div class='option optionB'>" + obj.optionB + "</div>";
                                    li += "<div class='option optionC'>" + obj.optionC + "</div>";
                                    li += "<div class='option optionD'>" + obj.optionD + "</div>";
                                    li += "<div class='source_txt_btn'><a class='lookExplore' href='javascript:;'>查看解析</a><span><a class='paoError' href='javascript:;'>报错</a><a class='del_out' questionId='"+obj.questionId+"' href='javascript:;'>删除</a></span></div>";
                                    li += "<div class='analysisBox'>";
                                    $.each(obj.labels, function (i, obj) {//解析
                                        li += "<div id='" + obj.questionId + "'>" + obj.content + "</div>";
                                    });
                                    li += "</div>";
                                });
                                li += "</li>";
                                li += "</ul>";
                            }
                        }else{
                            /*判断是可拆还是不可拆---可拆：isSplite==1 不可拆：isSplite==0*/
                            if(list[i].isSplite == 1){
                                li += "<li class='slot-item saveLine'>" + list[i].content.replace("材料", "<span class='m_order'></span>").replace("【","").replace("】","");
                                $.each(list[i].questions, function (i, obj) {
                                    li += "<ul class='source_txt slot-list'>";
                                    li += "<li class='lineBox slot-item' data-split='" + obj.isSplite + "' data-groupcode='" + obj.groupCode + "'>";
                                    li += "<div id='" + obj.questionId + "' class='questionContext'>" + obj.questionTitle.replace("题干", "").replace("【","").replace("】","") + "</div>";
                                    li += "<div class='option optionA'>" + obj.optionA + "</div>";
                                    li += "<div class='option optionB'>" + obj.optionB + "</div>";
                                    li += "<div class='option optionC'>" + obj.optionC + "</div>";
                                    li += "<div class='option optionD'>" + obj.optionD + "</div>";
                                    li += "<div class='source_txt_btn'><a class='lookExplore' href='javascript:;'>查看解析</a><span><a class='paoError' href='javascript:;'>报错</a><a class='del_out' questionId='"+obj.questionId+"' href='javascript:;'>删除</a></span></div>";
                                    li += "<div class='analysisBox'>";
                                    $.each(obj.labels, function (i, obj) {//解析
                                        li += "<div id='" + obj.questionId + "'>" + obj.content + "</div>";
                                    });
                                    li += "</div>";
                                    li += "</li>";
                                    li += "</ul>"
                                });
                                li += "</li>";
                            }else if(list[i].isSplite == 0){
                                li += "<ul class='source_txt slot-list'>";
                                li += "<li class='slot-item lineBox saveLine' data-split='" + list[i].isSplite + "' data-groupcode='" + list[i].groupCode + "'>" + list[i].content.replace("材料", "<span class='m_order'></span>").replace("【","").replace("】","");
                                $.each(list[i].questions, function (i, obj) {
                                    li += "<div  data-split='" + obj.isSplite + "' data-groupcode='" + obj.groupCode + "'>";
                                    li += "<div id='" + obj.questionId + "' class='questionContext'>" + obj.questionTitle.replace("题干", "").replace("【","").replace("】","") + "</div>";
                                    /*if(!obj.wrongQuestion){
                                        li += "<div class='question_result'><img src='../../../static/image/prepare/right.png'></div>";
                                    }else{
                                        li += "<div class='question_result'><img src='../../../static/image/prepare/wrong.png'></div>";
                                    }*/
                                    li += "<div class='option optionA'>" + obj.optionA + "</div>";
                                    li += "<div class='option optionB'>" + obj.optionB + "</div>";
                                    li += "<div class='option optionC'>" + obj.optionC + "</div>";
                                    li += "<div class='option optionD'>" + obj.optionD + "</div>";
                                    li += "</div>";
                                });
                                li += "<div class='source_txt_btn'><a class='lookExplore' href='javascript:;'>查看解析</a><span><a class='paoError' href='javascript:;'>报错</a><a class='del_out' questionId='"+list[i].questionId+"' href='javascript:;'>删除</a></span></div>";
                                li += "<div class='analysisBox'>";
                                $.each(list[i].labels, function (i, obj) {//解析
                                    li += "<div id='" + obj.questionId + "'>" + obj.content + "</div>";
                                });
                                li += "</div>";
                                li += "</li>";
                                li += "</ul>"
                            }
                        }
                    }
                }
                li += '<div class="m_rightNav">';
                li += '<p class="m_line"></p>';
                li += '<p class="m_row1"></p>';
                li += '<p class="m_row2"></p>';
                li += '<a href="me_publishError.html">';
                li += '<p class="m_con4 m_active">布置错题</p>';
                li += '</a>';
                li += '<a href="me_publishRecords.html"><p class="m_con4">布置记录</p>';
                li += '</a>';
                li += '<p class="m_con4 m_export">导出错题</p>';
                li += '<p class="m_con4 m_set">设置</p>';
                $(".error_source_txt").html(li.replace(/null/g, ""));
                $(".source_txt").hover(function () {
                    $(this).find(".source_txt_btn span").fadeIn();
                }, function () {
                    $(this).find(".source_txt_btn span").fadeOut();
                });

                /*    $(".source_txt p").on("click",function(){
                 $(this).parent(".source_txt").find("ul").toggle();
                 });*/
                //查看解析
                $(".source_txt_btn").on("click", ".lookExplore", function () {
                    $(this).parent().siblings(".analysisBox").toggle();
                    if ($(this).text() == "查看解析") {
                        $(this).text("收起解析");
                        $(this).css("background","#65b113");
                        $(this).css("color","#fff");
                    } else if ($(this).text() == "收起解析") {
                        $(this).text("查看解析");
                        $(this).css("background","#fff");
                        $(this).css("color","#000");
                    }
                });
                //点击删除------------------------------------------------------------- ------  -------   组合题存在问题
                $(".source_txt_btn").on("click", ".del_out", function () {
                   /* if ($(this).parent("span").parent(".source_txt_btn").parent(".lineBox").attr("data-groupcode")) {
                        console.log($(this).parent("span").parent(".source_txt_btn").parent(".lineBox").attr("id"));
                    }*/
                    $(this).parent("span").parent(".source_txt_btn").parent(".lineBox").remove();
                    var groupcode = $(this).parent().parent().parent().attr("data-groupcode"),split = $(this).parent().parent().parent().attr("data-split"),param = {};
                    if(groupcode==null||groupcode==undefined||groupcode==""){
                        param.questionIdList = $(this).attr("questionId");
                    }else{
                        if(split==1){
                            param.questionIdList = $(this).attr("questionId");
                            param.groupCodeList = "";
                        }else if(split==0){
                            param.groupCodeList = groupcode;
                            param.questionIdList = "";
                        }
                    }
                    console.log(param);
                    var that = this;
                      $.ajax({
                          type: "POST",
                          url: "/web/teacher/center/wrongbook/delete",
                          data: param,
                          dataType: "json",
                          success: function (data) {
                              console.log(data);
                              if (data.retData == "0000") {

                                  $(that).parent("span").parent(".source_txt_btn").parent(".lineBox").remove();
                                  //展示空白页
                                  if ($(".error_source_txt .source_txt").length == 0) {
                                      $(".error_source_txt .source_txt").html("<img class='noImg' src='../../../static/image/kola/no.png'>");
                                  }

                                  if (!$("div").hasClass("c_Dissolve")) {
                                      $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                                  }
                                  var _i = 2;
                                  $('#c_ErrorMsg').html('删除成功').fadeIn(200);
                                  //跳转倒计时
                                  set();
                                  function set() {
                                      _i--;
                                      $('#c_ErrorMsg').html('删除成功');
                                      if (_i > 0) {
                                          setTimeout(set, 1000);//_i大于0时每秒递归
                                      } else {
                                          $('#c_ErrorMsg').css("display", "none");
                                      }
                                  }
                              }
                          }
                      });
                });
                jobNumbers();
                //获取报错类型
                function getErrorType() {
                    $.ajax({
                        type: "post",
                        url: "/web/common/report/error",
                        dataType: "json",
                        success: function (data) {
                            if (data.retCode == "0000") {
                                var list = data.retData;
                                var li = "";
                                for (var k in list) {
                                    li += "<li class='m_errorPoints fl' id='" + list[k].value + "'>" + list[k].label + "</li>";
                                }
                            }
                            $(".m_errorPointsBox").html(li);
                        }
                    });
                }

                //$(".source_txt_btn").off("click");
                //点击报错
                $(".source_txt_btn").on("click", ".paoError", function (e) {
                    getErrorType();//重新请求 报错类型
                    showMask(".mask", ".m_submitErrors");
                    // stopBubble(e);
                    var that = this;
                    var questionId = $(this).parent().parent().siblings(".questionContext").attr("id");
                    var errorType, errorReason;
                    $(".m_errorPointsBox").on("click", ".m_errorPoints", function (e) {
                        stopBubble(e);
                        $(this).addClass("e_active").siblings().removeClass("e_active");
                        errorType = $(this).attr("id");
                    });
                    //点击确定按钮，进行报错
                    $(".m_submitErrorsSure").on("click", function (e) {
                        stopBubble(e);
                        errorReason = $("#errorReason").val();
                        var param = {};
                        param.questionId = questionId;
                        param.errorType = errorType;
                        param.errorResean = errorReason;
                        $.ajax({
                            type: "post",
                            url: "/web/teacher/paper/assign/savequestionerror",
                            dataType: "json",
                            data: param,
                            success: function (data) {
                                if ($("div").hasClass("c_Dissolve")) {
                                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                                }
                                var _i = 2;
                                /* if(param.errorType==undefined){
                                 $('#c_ErrorMsg').html('报错类型不能为空');
                                 set();
                                 function set() {
                                 _i--;
                                 $('#c_ErrorMsg').html('报错类型不能为空');
                                 if(_i > 0){
                                 setTimeout(set,1000);//_i大于0时每秒递归
                                 }else{
                                 $('#c_ErrorMsg').css("display","none");
                                 }
                                 }
                                 }*/
                                if (param.errorResean == "") {
                                    $('#errorReason').html('错误原因不能为空').css("color", "red");
                                    setTimeout(function () {
                                        $('#errorReason').html("").css("color", "#555");
                                    }, 600);
                                }
                                if (data.retCode == "0000") {
                                    hideMask(".mask", ".exportError");
                                    $(".m_submitErrors").css("display", "none");
                                    $('#c_ErrorMsg').html('报错成功').fadeIn(200);
                                    //跳转倒计时
                                    set();
                                    function set() {
                                        _i--;
                                        $('#c_ErrorMsg').html('报错成功');
                                        if (_i > 0) {
                                            setTimeout(set, 1000);//_i大于0时每秒递归
                                        } else {
                                            $('#c_ErrorMsg').css("display", "none");
                                        }
                                    }

                                    $(".m_submitErrorsSure").off("click");//解除绑定
                                }
                            }
                        });

                    });
                });
            }
            Paging(data.retData.pages,data.retData.pageNum);
            intMathJax();//公式
            if(document.documentElement.scrollTop) {
                document.documentElement.scrollTop = 0;
            }else {
                document.body.scrollTop = 0;
            }
        }
    });
}
//分页
function Paging(PageSize,PageNum){
    var totalPage=PageSize;
    var totalRecords = totalPage*3;
    kkpager.total=PageSize;
    kkpager.totalRecords= totalPage*3;
    var pageNo = PageNum;
    if(!pageNo){pageNo = 1;}
    store.set("PageNum",pageNo);
    kkpager.generPageHtml({
        pno : pageNo, //总页码
        hrefFormer : 'me_myNotebook', //链接尾部
        hrefLatter : '.html',
        mode : 'click',//默认值是link，可选link或者click
        click : function(n){
            this.selectPage(n);
            store.set("PageNum",n);
            testPaper(store.get('Unitid'),n,3);
            return false;
        }
    },true);
};
function getParameter(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
};

//获取错题的章节
function getExportError() {
    $.ajax({
        type: "get",
        url: "/web/teacher/center/wrongbook/knowledge",
        dataType: "json",
        success: function (data) {
            var list = data.retData;
            var li = "";
            li += "<i class='spriteImg c_closeico fr c_closeimg0' id='c_closeG0'></i>";
            li += "<div class='m_seclectSection'>选择" + list[0].levelName + ":</div>";
            li += "<ul class='m_sectionChoice'>";
            li += "<li id=''><i class='spriteImg i_slcico0 fl s_Choimg m_all'></i><span class='m_sectionNum'>全部</span><i class='dischoice dino'></i></li>";
            for (var k in list) {
                li += "<li class='m_sectionNumBox' id='" + list[k].knowledgeId + "'><i class='spriteImg i_slcico0 fl s_Choimg'></i>";
                li += "<span class='m_sectionNum'>" + list[k].name + "</span>";
                li += "<i class='dischoice dino'></i></li>";
            }
            li += "</ul>";
            li += "<input type='button' class='m_btnSure' value='确&nbsp;定'>";
            $(".exportError").html(li);
        }
    });
}
//弹出层    导出错题
$(".error_source_txt").on("click", ".m_export", function (e) {
    stopBubble(e);
    getExportError();
    showMask(".mask", ".exportError");
    getLoadKnowledge();
    $(".exportError").on("click", "#c_closeG0", function () {
        hideMask(".mask", ".exportError");
    });
});
//选择要下载的章节
function getLoadKnowledge() {
    var selectArr = "";
    $(".exportError").off("click");
    $(".exportError").on("click", ".s_Choimg", function () {
        if ($(this).hasClass("m_all")) {//点击全选
            if ($(this).hasClass("i_slcico0")) {
                $.each($(".m_sectionChoice").find(".m_sectionNumBox"), function (i, obj) {
                    if (i < $(".m_sectionChoice").find(".m_sectionNumBox").length - 1) {
                        selectArr += $(obj).attr("id") + ",";
                    } else {
                        selectArr += $(obj).attr("id");
                    }
                });

                $(this).parent("li").siblings().children("i").removeClass('i_slcico0').addClass('i_slcico1');
                $(this).removeClass('i_slcico0').addClass('i_slcico1');
            } else {
                selectArr = "";
                $(this).parent("li").siblings().children("i").removeClass('i_slcico1').addClass('i_slcico0');
                $(this).removeClass('i_slcico1').addClass('i_slcico0');
                console.log(selectArr);
            }
        } else {//不点全选
            // var index=$(this).parent("li").index();
            if ($(this).hasClass("i_slcico0")) {
                $(this).removeClass('i_slcico0').addClass('i_slcico1');
                selectArr += $(this).parent("li").attr("id") + ",";
            } else {
                //删除特定的id
                for (var i = 0; i < selectArr.length; i++) {

                    if (selectArr[i] == $(this).parent("li").attr("id")) {
                        selectArr -= $(this).parent("li").attr("id");
                    }
                }
                $(this).removeClass('i_slcico1').addClass('i_slcico0');
                //当前没有.m_all属性，也没有i_slcico1时，全部选择  需要移除i_slcico1属性
                if ($(".m_all").hasClass("i_slcico1")) {
                    $(".m_all").removeClass("i_slcico1").addClass("i_slcico0")
                }
            }
        }
        $("#c_closeG0").on("click", function () {
            hideMask(".mask", ".exportError");
            $(".exportError").off();
        });
    });
    $(".exportError").on("click", ".m_btnSure", function () {
        var param = {};
        var selected = selectArr.substring(0, selectArr.length - 1);
        if(selected!=""){
            param.knowledgeList = JSON.stringify(selected);
            $.ajax({
                type: "get",
                url: "/web/teacher/center/wrongbook/export",
                data: param,
                success: function (data) {
                    hideMask(".mask", ".errorPer");
                    window.location.href = "/web/teacher/center/wrongbook/export?knowledgeList=" + selected;//下载
                    $(".exportError").css({"display": "none"});//下载后隐藏
                },
                error: function (data) {//请求失败，居然还能执行
                    console.log(data);
                }
            });
        }else{
            $('.c_ErrorMsg').html("请先选择章节").fadeIn(200);
            Disappear(".c_ErrorMsg");
        }

    });
}
//弹出层    设置   加事件绑定
$(".error_source_txt").on("click", ".m_set", function () {
    showMask(".mask", ".errorPer");
});
$("#c_closeG1").click(function () {
    hideMask(".mask", ".errorPer");
});
// 弹出层 报错
$("#c_closeG2").click(function () {
    hideMask(".mask", ".m_submitErrors");
});
//弹出层 错误率
$(".m_select").click(function () {
    $(".errorPerCon ul").slideToggle();
});
$(".m_select ul li").click(function () {
    $(".m_selectSpan").html($(this).html());
});
//错题率接口
getNowError();//一进入页面，获取当前错题率
$(".m_btnPer").click(function () {
    getError();//更新错题率
});

//一进入页面，获取当前错题率
function getNowError() {
    $.ajax({
        type: "post",
        url: "/web/teacher/center/wrongbook/wrongrate",
        async: false,
        dataType: "json",
        success: function (data1) {
            console.log(data1);
            if (data1.retCode == "0000") {
                var nowRate = data1.retData;
                nowRate = nowRate * 100 + "%";
                $(".m_selectSpan").html(nowRate);
                var spans = $(".wrong_span li");
                for(var i = 0;i<spans.length;i++){
                    if(spans[i].innerHTML === nowRate){
                        spans[i].className = "change_span";
                        console.log(spans[i].className)
                    }
                }
            }

        }
    });
}
//更新错题率
function getError() {
    var param = {};
    var perVal = $(".m_selectSpan").html();
    var arr = perVal.split("%");
    var errorPercent = arr[0] / 100;
    param.wrongRate = errorPercent;
    $.ajax({
        type: "post",
        url: "/web/teacher/center/wrongrate",
        data: param,
        dataType: "json",
        success: function (data) {
            hideMask(".mask", ".errorPer");
            if (!$("div").hasClass("c_Dissolve")) {
                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
            }
            $(".wrong_span li").removeClass("change_span");
            var nowRate = errorPercent*100 + "%";
            var spans = $(".wrong_span li");
            for(var i = 0;i<spans.length;i++){
                if(spans[i].innerHTML === nowRate){
                    spans[i].className = "change_span";
                    console.log(spans[i].className)
                }
            }
            $('#c_ErrorMsg').html('错题率更新成功').fadeIn(200);
            Disappear("#c_ErrorMsg");
        }
    });
}
//报错 取消按钮
$(".m_submitErrorsCancel").click(function () {
    window.location.reload();
});
//题号 排序
function jobNumbers() {
    //规则：
    var jobList = $(".slot").find(".m_order");//获取题号列表
    $.each(jobList, function (i,obj) {
        $(obj).html((i + 1)+"、");
    });
}

css();
function css(){
    $.ajax({
        type:"post",
        url:"/web/common/commonStyle",
        dataType:"json",
        success:function(data){
            console.log(data);
            if(data.retCode == "0000"){
                var retData = data.retData;
                //console.log(retData);
                //retData.appendTo("head");
                $("head").append(retData);
            }
        },
        error:function(e){
            console.log(e)
        }
    })
}

//清空错题数据
clearWrongPage()
function clearWrongPage(){
    store.set("errorQuestionNum","0");
    store.set("errorPaper","")
}
