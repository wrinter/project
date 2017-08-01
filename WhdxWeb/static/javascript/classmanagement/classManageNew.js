/**
 * Created by Administrator on 2017/3/14.
 */
/*************************************获取导航**********************************/
GetHtml("../../model/common/common.txt", "#Header");
CheckBrower();
forIE();
SystemRedMsg();
//获取创建的班级数据，并获取班级个数
var classData = {};
var classSum = 0;
//已创建的班级列表
var classes = [];
getClassCreated();
//有无班级的展示
getClass();
//用户是否选择学校,默认已选
var isSet = true;
isSetSchoool();
if(store.get("isClear")=="1"){
    $('.c_ErrorMsg').html('解散成功').fadeIn(150);
    Disappear(".c_ErrorMsg");
    store.set("isClear","0");
}
/*******************加入班级******************/
$(".c_join").on('click',function(){
    //清空搜索框
    $(".c_sBox").val("");
    $(".c_searchNo").hide();
    $(".c_searchYes").hide();
    $(".c_joinArea").fadeIn(150);
});
FadeOut(".c_closeImg",".c_joinArea");
//验证输入的班级码
$(".c_sBox").keyup(function(){
    $(this).val($(this).val().replace(/\D/g,''));
}).bind("paste",function(){  //CTR+V事件处理
    $(this).val($(this).val().replace(/\D|/g,''));
}).css("ime-mode", "disabled");  //CSS设置输入法不可用
//点击搜索
$('.c_sbtn').on('click',function(){
    if($(".c_sBox").val().length!=6){
        return;
    }
    var para = {};
    para.classCode = $(".c_sBox").val();
    searchClass(para);
});
$(".c_sBox").on('input',function(e){
    $(".c_searchNo").hide();
    $(".c_searchYes").hide();
});
$("#input_id").on('input',function(e){
    alert('Changed!')
});
//var seatimer=setInterval(function(){
//    if($(".c_sBox").val().length==6){
//        $(".c_sbtn").css("background",'#79CAE5');
//    }else {
//        $(".c_sbtn").css("background",'');
//    }
//},1);
/*******************创建班级******************/
$(".c_create").on('click',function(){
    $(".c_createArea").fadeIn(200);
    $(".c_pList,.c_cList,.c_coList,.c_sList").hide();
    $(".c_county").show();
    $(".c_seCon").html("");
    classes.length = 0;
    if(isSet){
        $('.c_selectSchool').hide();
    }else{
        $('.c_selectClass').hide();
        resetArea();
    }
    $('.c_schoolEnsure').css('background','#999999');
    $('.c_createEnsure').css('background','#65b113');
    getClassCreated();
    getUserGradeId();
});
//选择年级
$(".c_cli").on('click',function(){
    var grades = $('.c_tab')[0].children;
    var gradeId = $(this).attr('gradeId');
    classSum = classData.length;
    classes.length = 0;
    $(".c_seCon").html("");
    for(var i=0;i<grades.length;i++){
        if(grades[i]==this){
            grades[i].classList.add("c_selectedLi");
            grades[i].classList.remove("c_cli");
            for(var k=0;k<classData.length;k++){
                if(gradeId==classData[k].gradeId){
                    classes.push(classData[k].classNickname);
                }
            }
            showClasses(20);
        }else{
            grades[i].classList.add("c_cli");
            grades[i].classList.remove("c_selectedLi");
        }
    }
});
//选择省/市/县/学校
$('.c_selectSchool div').on('click',function(e){
    var area = this.className;
    var para = {};
    if(area == "c_province"){
        $(".c_city span").html('选择市');
        $(".c_county span").html('选择区/县');
        $(".c_school span").html('选择学校');
        $('.c_city span').attr("id",'');
        $('.c_county span').attr("id",'');
        $('.c_school span').attr("id",'');
        $('.c_pList').show();
        $('.c_cList,.c_coList,.c_sList').hide();
        getProvince();
    }else if(area == "c_city"){
        $(".c_county span").html('选择区/县');
        $(".c_school span").html('选择学校');
        $('.c_county span').attr("id",'');
        $('.c_school span').attr("id",'');
        $('.c_pList,.c_coList,.c_sList').hide();
        para.parentId = $(".c_province span")[0].id;
        if(para.parentId==""){
            $('.c_ErrorMsg').html("请先选择省").fadeIn(200).css('width','460px');
            Disappear(".c_ErrorMsg");
        }else{
            $('.c_cList').show();
            getCity(para);
    }
    }else if(area == "c_county"){
        $(".c_school span").html('选择学校');
        $('.c_school span').attr("id",'');
        para.parentId = $(".c_city span")[0].id;
        $('.c_cList,.c_pList,.c_sList').hide();
        if(para.parentId==""){
            $('.c_ErrorMsg').html("请先选择市").fadeIn(200).css('width','460px');
            Disappear(".c_ErrorMsg");
        }else{
            $('.c_coList').show();
            getCounty(para);
        }
    }else{
        $('.c_cList,.c_coList,.c_pList').hide();
        para.provinceId = $(".c_province span").attr("id");
        para.cityId = $(".c_city span").attr("id");
        para.countyId = $(".c_county span").attr("id");
        if(para.provinceId==""||para.cityId == ""||($(".c_county").css('display')==="block"&&para.countyId=="")){
            $('.c_ErrorMsg').html("请先选择地区").fadeIn(200).css('width','460px');
            Disappear(".c_ErrorMsg");
        }else{
            $('.c_sList').show();
            getSchool(para);
        }
    }
    stopBubble(e);
});
$('.c_createArea').click(function(){
    $('.c_pList,.c_cList,.c_coList,.c_pList,.c_sList').hide();
});
$('.c_schoolEnsure').on('click',function(){
    var para = {};
    para.schoolId =  $('.c_school span').attr("id");
    if(para.schoolId==""){
        return;
    }
    setSchool(para);
    $('.c_selectSchool').fadeOut();
    $('.c_selectClass').fadeIn();
});
//选择地区
$('.c_list').on('click','li',function(e){
    var id = this.id;
    var cpara ={};
    var name = this.innerText;
    var className = this.parentNode.classList[0];
    if(className == "c_pList"){
        $('.c_province span').attr("id",id);
        $('.c_province span').html(name);
        cpara.parentId = id;
        getFirstCity(cpara);
    }else if(className == "c_cList"){
        $('.c_city span').attr("id",id);
        $('.c_city span').html(name);
        cpara.parentId = id;
        getFirstCounty(cpara);
    }else if(className == "c_coList"){
        $('.c_county span').attr("id",id);
        $('.c_county span').html(name);
        cpara.provinceId = $(".c_province span").attr("id");
        cpara.cityId = $(".c_city span").attr("id");
        var countyId = $(".c_county span").attr("id");
        if(countyId!=""){
            cpara.countyId = countyId;
        }
        getFirstSchool(cpara);
    }else{
        $('.c_school span').attr("id",id);
        $('.c_school span').html(name);
        $('.c_schoolEnsure').css('background','#58C1E4');
    }
    $('.'+className).hide();
    stopBubble(e);
});
//选择班级
$('.c_tabCon').on('click','li',function(){
    var sId = $(".c_school span").attr("id");
    if(!isSet&&(sId==undefined||sId=="")){
        $('.c_ErrorMsg').html("请先选择学校").fadeIn(200).css('width','460px');
        Disappear(".c_ErrorMsg");
    }else{
        var selectedGrade = $('.c_selectedLi').attr("gradeId");
        var selectedClass = this.innerText;
        var isCreated = false;
        if ($(this).children('i').hasClass('i_slcico1')){
            $(this).children('i').removeClass("i_slcico1").addClass("i_slcico0");
            classSum--;
            $('.c_seCon li').each(function() {
                if($(this).attr("className")==selectedClass){
                    $(this).remove();
                }
            });
        }else{
            if(classSum<4){
                for(var i=0;i<classData.length;i++){
                    if(classData[i].gradeId==selectedGrade){
                        if(classData[i].classNickname==selectedClass){
                            isCreated = true;
                        }
                    }
                }
                if(isCreated){
                    $('.c_ErrorMsg').html("已创建过此班级").fadeIn(200).css('width','460px');
                    Disappear(".c_ErrorMsg");
                }else{
                    classSum++;
                    $(this).children('i').removeClass("i_slcico0").addClass("i_slcico1");
                    $html = ' <li className="'+selectedClass+'" >' + selectedGrade + '年级' + selectedClass
                        + ' <i class="spriteImg c_delClass c_delImg"></i></li>'
                    $('.c_seClass ul').append($html);
                    $('.c_delImg').click(function(){
                        var classname = $(this).parent().attr('classname');
                        $('.c_ClassNum').each(function(){
                            if($(this).html()==classname){
                                $(this).prev().removeClass("i_slcico1").addClass("i_slcico0");
                            }
                        });
                        $(this).parent().remove();
                        classSum--;
                    });
                }
            }else{
                $('.c_ErrorMsg').html("每个用户最多只能创建4个班级").fadeIn(200).css('width','460px');
                Disappear(".c_ErrorMsg");
            }
        }
    }

});
//提交选择的班级
$('.c_createEnsure').on('click',function(){
    if($(this).css("background")!="#999"){
        $(this).css("background","#999");
    }else{
        return;
    }
    var c_para={};
    c_para.gradeId = $('.c_selectedLi').attr("gradeId");
    var c_arr = [];
    $('.c_seCon li').each(function() {
        c_arr.push($(this).attr('classname'));
    });
    c_para.className = c_arr;
    createEnsure(c_para);
});
FadeOut(".c_closeImg",".c_createArea");
FadeOut(".c_createCancel",".c_createArea");


/***************后台接口**************/
//判断是否选择学校
function isSetSchoool() {
    $.ajax({
        "type": "post",
        "url": "/web/teacher/class/check/school",
        "dataType": "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 3) {
                isSet = false;
            }
        }
    });
}
//获取当前用户创建的班级
function getClass(){
    $.ajax({
        "type":"post",
        "url":"/web/teacher/class/list",
        "dataType":"json",
        success:function(data){
            if(data.retCode=="0000") {
                showCreatedClass(data.retData);
            }
        }
    });
}
//根据班级码查询班级
function searchClass(para){
    $.ajax({
        "type":"post",
        "url":"  /web/teacher/class/search",
        "dataType":"json",
        "data":para,
        success:function(data){
            if(data.retCode == "0000"){
                showSearchResult(data.retData);
            }else{
                $(".c_searchNo").html("查无此班，请重新输入").show();
                $(".c_searchYes").hide();
            }
        }
    });
}
function joinClass(para){
    $.ajax({
        "type": "post",
        "url": "  /web/teacher/class/join",
        "dataType": "json",
        "data": para,
        success: function (data) {
            showJoinedResult(data);
        }
    });
}

function setSchool(para){
    $.ajax({
        "type": "post",
        "url": "/web/teacher/class/school",
        "dataType": "json",
        "data": para,
        success: function (data) {

        }
    });
}
//提交创建的班级
function createEnsure(para){
    $.ajax({
        'type':"post",
        'url':"/web/teacher/class/create",
        'data': JSON.stringify(para),
        'contentType':"application/json;charset=utf-8",
        'dataType':"json",
        success:function(data){
            showCreatedResult(data);
        }
    });
}
//获取当前用户的年级
function getUserGradeId(){
    $.ajax({
        "type":"post",
        "url":"/web/teacher/class/current/grade",
        "dataType":"json",
        success:function(data){
            //console.log(data);
            var codenum =parseInt(data.retCode.substr(0, 1));
            if(codenum==0){
                var index=parseInt(data.retData);
                showDefaultGrade(index);
            }else{
                showDefaultGrade(2);
            }
        }
    });
}
function getProvince(){
    $.ajax({
        "type":"post",
        "url":"/web/common/area?parentId=100000",
        "dataType":"json",
        success:function(data) {
            showArea(data,"c_pList");
        }
    });
}
function getCity(para){

    $.ajax({
        "type":"post",
        "url":"/web/common/area",
        "dataType":"json",
        "data":para,
        success:function(data){
            //console.log(data);
            showArea(data,"c_cList");
        }
    });
}
function getFirstCity(para){
    $.ajax({
        "type":"post",
        "url":"/web/common/area",
        "dataType":"json",
        "data":para,
        success:function(data){
            if(data.retCode=="0000") {
                if (data.retData.length > 0) {
                    var id = data.retData[0].id;
                    var name = data.retData[0].name;
                    $('.c_city span').html(name);
                    $('.c_city span').attr("id",id);
                    getFirstCounty({'parentId':id});
                }
            }
        }
    });
}
function getFirstCounty(para){
    $.ajax({
        "type":"post",
        "url":"/web/common/area",
        "dataType":"json",
        "data":para,
        success:function(data){
            if(data.retCode=="0000") {
                if (data.retData.length > 0) {
                    $('.c_county span').html(data.retData[0].name);
                    $('.c_county span').attr("id", data.retData[0].id);
                    var param ={};
                    param.provinceId = $(".c_province span").attr("id");
                    param.cityId = para.parentId;
                    param.countyId =  data.retData[0].id;
                    getFirstSchool(param);
                }else{
                    $('.c_county').hide();
                    var param ={};
                    param.provinceId = $(".c_province span").attr("id");
                    param.cityId = para.parentId;
                    getFirstSchool(param);
                }
            }
        }
    });
}
function getFirstSchool(para){

    $.ajax({
        "type":"post",
        "url":"/web/common/school",
        "dataType":"json",
        "data":para,
        success:function(data){
            if(data.retCode=="0000"){
                if(data.retData.length>0){
                    $('.c_school span').html(data.retData[0].schoolName);
                    $('.c_school span').attr("id",data.retData[0].id);
                    $('.c_schoolEnsure').css('background','#58C1E4');
                }
            }
        }
    });
}
function getCounty(para){

    $.ajax({
        "type":"post",
        "url":"/web/common/area",
        "dataType":"json",
        "data":para,
        success:function(data){
            showArea(data,"c_coList");
        }
    });
};
function getSchool(para){
    $.ajax({
        "type": "post",
        "url": "/web/common/school",
        "dataType": "json",
        "data": para,
        /*async:false,*/
        success: function (data) {
            showArea(data,"c_sList");
        }
    });
}
//获取当前用户已经创建的班级
function getClassCreated(){
    $.ajax({
        "type":"post",
        "url":"/web/teacher/class/exist",
        "dataType":"json",
        success:function(data){
            //console.log(data);
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                classData = data.retData;
                classSum = classData.length;
            }
        }
    });
}
function getApplyNum(){
    $.ajax({
        "type":"post",
        "url":"/web/user/pcUserApplyMessageSize",
        "dataType":"json",
        success:function(data){
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                if(data.retData==0){
                    $('#c_applyCon').hide();
                }else{
                    $('#c_apply').html(data.retData);
                    $('#c_applyCon').show();
                }
            }
        }
    });

}




/***************前台渲染**************/
//展示当前用户创建的班级
function showCreatedClass(data){
    //console.log(data);
    if(data.length==0) {
        $('.c_noClass').show();
        $('.c_haveClass').hide();
    }else{
        $('.c_noClass').hide();
        $('.c_haveClass').show();
        $html = "";
        for(var i=0;i<data.length;i++){
            $html += '<li class="c_created"><p class="c_userPhoto"><img src="';
            if(data[i].headTeacherImage==null||data[i].headTeacherImage==""){
                $html += '../../static/image/me/user.png" alt="" class="w100 fl"></p><p class="c_userName">'
            }else{
                $html += data[i].headTeacherImage +'" alt="" class="w100 fl"></p><p class="c_userName">';
            }
            $html += data[i].headTeacherName + '</p>'
                + '<p class="headTeacherId dino">' + data[i].headTeacherId + '</p>'
                + '<p class="c_grade">' + data[i].gradeName + data[i].className + '</p>'
                + '<p class="c_student"> 学生：' + data[i].studentNum + '人</p>'
                + '<p class="c_teacher">老师：' + data[i].teacherNum + '人</p>'
                + '<p class="dino classId">' + data[i].classId + '</p>';
            if(data[i].joinStatus=='1'){
                $html += '<input class="c_inBtn  cup mt55" value="进入班级" type="button">';
            }else{
                $html += '<input class="c_waitBtn borcCC cup mt55 fcCA" value="等待ing" type="button">';
            }
            $html += '</li>';
        }
        $('.c_createdList').html($html);
        $('.c_inBtn').on('click',function(){
            var sibs = $(this).siblings('p');
            store.set('nowClassId', sibs[6].innerText);
            store.set('headTeacherId',sibs[2].innerText);
            store.set('c_grade', sibs[3].innerText);
            window.location.href="../../../model/classmanagement/classInfo.html";
        });
        getApplyNum();
    }
}
function resetArea(){
    $(".c_province span").html('选择省');
    $(".c_city span").html('选择市');
    $(".c_county span").html('选择区/县');
    $(".c_school span").html('选择学校');
    $('.c_province span').attr("id",'');
    $('.c_city span').attr("id",'');
    $('.c_county span').attr("id",'');
    $('.c_school span').attr("id",'');
}

function showDefaultGrade(index){
    var k=9-index;
    var grades = $(".c_tab").children();
    for(var i=0;i<3;i++){
        if(k==i){
            grades[i].classList.add("c_selectedLi");
            grades[i].classList.remove("c_cli");
        }else{
            grades[i].classList.add("c_cli");
            grades[i].classList.remove("c_selectedLi");
        }
    }

    for(var i=0;i<classData.length;i++){
        if(index==classData[i].gradeId){
            classes.push(classData[i].classNickname);
        }
    }
    showClasses(20);
}

//展示搜索班级的结果
function showSearchResult(data){
    if(data.length == 0){
        $(".c_searchNo").show();
        $(".c_searchYes").hide();
    }else{
        $(".c_searchNo").hide();
        $(".c_searchYes").show();
        if(data.headTeacherImage!=""&&data.headTeacherImage!=null){
            $(".c_userPhoto").attr("src",data.headTeacherImage);
        }else{
            $(".c_userPhoto").attr("src","../../static/image/me/user.png");
        }
        $(".c_grade").html(data.gradeName + data.className);
        $(".c_snum").html("学生："+data.studentNum);
        $(".c_tnum").html("老师："+data.teacherNum);
        $(".c_joinBtn").attr("id",data.classId);
        $('.c_joinBtn').unbind().click(function(){
            var para = {
                'classId':$(this).attr('id')
            };
            joinClass(para);
        });
    }
}
function showJoinedResult(data){
    var codenum =parseInt(data.retCode.substr(0, 1)) ;
    if(codenum==0){
        $('#c_Search').fadeOut(150);
        $('.c_ErrorMsg').html("申请成功，等待通过").fadeIn(200).css('width','460px');
        Disappear(".c_ErrorMsg");
        $('.c_joinArea').fadeOut();
        getClass();
    }
    if(codenum==2){
        $('.c_ErrorMsg').html("您已经申请过加入该班或已经进入该班").fadeIn(200).css('width','460px');
        Disappear(".c_ErrorMsg");
        $('#c_Search').fadeOut(150);
    }
    if(codenum==3){
        $('.c_ErrorMsg').html("每位老师最多加入20个班级").fadeIn(200).css('width','460px');
        Disappear(".c_ErrorMsg");
        $('#c_Search').fadeOut(150);
    }
}
function showArea(data,type){
    var codenum =parseInt(data.retCode.substr(0, 1));
    if(codenum==0) {
        var $html = '';
        var codenum = parseInt(data.retCode.substr(0, 1));
        if (codenum == 0) {
            var uData = data.retData;
            if(uData.length==0){
                $("." + type).html("不存在学校");
            }else{
                for (var i = 0; i < uData.length; i++) {
                    if(type=="c_sList"){
                        $html += '<li id="' + uData[i].id
                            + '" parentId="' + uData[i].parentId
                            + '">' + uData[i].schoolName + "</li>";
                    }else{
                        $html += '<li id="' + uData[i].id
                            + '" parentId="' + uData[i].parentId
                            + '">' + uData[i].name + "</li>";
                    }
                }
                $("." + type).html($html);
            }
        }
    }else{
        $("." + type).html(data.retMsg);
    }
}
function showClasses(num){
    var $html = "";
    var cell = "";
    for(var i=1;i<=num;i++){
        cell = i + '班';
        var flag = true;
        for(var j=0;j<classes.length;j++){
            if(cell == classes[j]){
                $html += '<li><i class="spriteImg i_slcico2 fl c_sImg"></i><span class="c_ClassNum">'
                    + cell + '</span></li>';
                flag = false;
            }
        }
        if(flag){
            $html += '<li><i class="spriteImg i_slcico0 fl c_sImg"></i><span class="c_ClassNum">'
                + cell + '</span></li>';
        }
    }
    if(num==20){
        $html += '<p class="c_more"><span class="c_ctext">展开</span><i class="spriteImg c_spread fr"></i></p>';
    }else{
        $html += '<p class="c_less"><span class="c_ctext">收起</span><i class="spriteImg c_stop fr"></i></p>';
    }
    $('.c_tabCon').html($html);
    //展示更多班级
    $('.c_more').on('click',function(){
        showClasses(50);
        moreAndLess();
    });
    $('.c_less').on('click',function(){
        showClasses(20);
        moreAndLess();
    });
}
function moreAndLess(){
    $('.c_seCon li').each(function(){
        var className = $(this).attr('classname');
        $('.c_tabCon li span').each(function(){
            if($(this).html()==className){
                $(this).prev().removeClass("i_slcico0").addClass("i_slcico1");
            }
        });
    });
}
function showCreatedResult(data){
    var codenum =parseInt(data.retCode.substr(0, 1));
    if(codenum==0){
        getClass();
        GoldAnimate(data.retGold);
        $('.c_ErrorMsg').html('创建班级成功').fadeIn(200);
        Disappear(".c_ErrorMsg");
        //如果只选择一个班级，进入班级详情页面
        if($('.c_seCon li').length==1){
            var nowClassId = data.retData.indexClassId;
            var headTeacherId = data.retData.headerTeacherId;
            var c_grade = data.retData.className;
            store.set('nowClassId', nowClassId);
            store.set('headTeacherId',headTeacherId);
            store.set('c_grade', c_grade);
            setTimeout(function(){
                window.location.href="../../../model/classmanagement/classInfo.html";
            },100);
        }
        $('.c_createArea').hide();
    }
    if(codenum==1){
        $('.c_ErrorMsg').html(data.retMsg).fadeIn(200);
        Disappear(".c_ErrorMsg");
    }
    if(codenum==2){
        $('.c_ErrorMsg').html(data.retMsg).fadeIn(200);
        Disappear(".c_ErrorMsg");
    }
}
function forIE(){
    if (!("classList" in document.documentElement)) {
        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/g),
                            index = classes.indexOf(value);

                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    }
                }

                return {
                    add: update(function(classes, index, value) {
                        if (!~index) classes.push(value);
                    }),

                    remove: update(function(classes, index) {
                        if (~index) classes.splice(index, 1);
                    }),

                    toggle: update(function(classes, index, value) {
                        if (~index)
                            classes.splice(index, 1);
                        else
                            classes.push(value);
                    }),

                    contains: function(value) {
                        return !!~self.className.split(/\s+/g).indexOf(value);
                    },

                    item: function(i) {
                        return self.className.split(/\s+/g)[i] || null;
                    }
                };
            }
        });
    }
}