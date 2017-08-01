/**
 * Created by zxl on 2017/3/10.
 */
SystemRedMsg();
$(function() {
    GetHtml('../common/common.txt', '#header');//引入导航
    CheckBrower();
    var classId = store.get('nowClassId');//取LocalStorage传递的班级id
    var headTeacherId = store.get('headTeacherId');//取LocalStorage传递的班主任id
    var c_grade = store.get('c_grade');//取LocalStorage传递的班级名称用于面包屑导航
    $('#c_Crum1').append('<li class="fc65">' + c_grade + '</li>');
    //编辑的小组id
    var groupId = '';
    //删除小组的id
    var delGroupId = '';
    /****邀请链接*****/
    var WinUrl=window.location.href;
    var IndexUrl=WinUrl.split('/')[0]+'//'+WinUrl.split('/')[1]+WinUrl.split('/')[2];
    $('.c_adress').attr('href',IndexUrl);
    $('.c_adress').html(IndexUrl);
/***************************************班级类***********************************************/
    function clazz(classId, headTeacherId, c_grade) {
        this.classId = classId;
        this.headTeacherId = headTeacherId;
        this.c_grade = c_grade;
        this.teacherList = {};
        this.studentList = [];
        this.deStudentId = "";
        this.groupData = [];
    }

    clazz.prototype = {
        init: function () {
            this.getClassCode();
            this.getTeachers();
            this.getJionedClass();
            this.getStudents();
        },
        getClassCode: function () {
            var that = this;
            $.ajax({
                type: "POST",
                url: "/web/teacher/class/info",
                data: {classId: this.classId},
                dataType: "json",
                success: function (data) {
                    if (data.retCode == "0000") {
                        that.classCode = data.retData.classCode;
                        $('.c_ClassCode').html(selfClass.classCode);
                    }
                }
            });
        },
        getJionedClass: function () {
            var that = this;
            $.ajax({
                type: "POST",
                url: "/web/teacher/class/list",
                dataType: "json",
                success: function (data) {
                    that.classList = data.retData;
                    showJoinedClass(that.classList);
                }
            });
        },
        getTeachers: function () {
            var that = this;
            $.ajax({
                type: "post",
                url: "/web/teacher/class/teacher",
                data: {classId: this.classId},
                async:false,
                dataType: "json",
                success: function (data) {

                    if (data.retCode == "0000") {
                        that.teacherList = data.retData
                        showTeacher(that.teacherList);
                    }
                }
            });
        },
        exitClass:function(){
            $.ajax({
                type: "POST",
                url: "/web/teacher/class/teacher/exit",
                data:{classId:this.classId},
                dataType: "json",
                success:function(data) {
                    var codenum = parseInt(data.retCode.substr(0, 1));
                    if (codenum == 0) {
                        //退出班级成功返回班级管理页面。
                        window.location.href="../../../../model/classmanagement/classmanagenew.html";
                    }
                }
            });
            $(".m_classMark").fadeIn();
        },
        dissolveClass:function(password){
            $.ajax({
                type: "post",
                url: "/web/teacher/class/teacher/dissolve",
                data: {classId: this.classId, password: password},
                //async: false,
                dataType: "json",
                success: function (msg) {
                    showDissolvedResult(msg);
                }
            });
        },
        logout:function(){
            $.ajax({
                "type":"get",
                "url":"/web/user/logout?"+Math.random(),
                "dataType":"json",
                success:function(data){
                    var codenum =parseInt(data.retCode.substr(0, 1)) ;
                    if(codenum==0){
                        window.location.href = "../../../../model/foundpass/foundpass.html";
                    }
                    else {
                        $('#c_ErrorMsg').html('退出失败请重试').fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
                }
            });
        },
        setTeacherHead:function(teacherIdSet){
                $.ajax({
                    type:"post",
                    url:"/web/teacher/class/teacher/set",
                    data:{classId:this.classId,teacherId:teacherIdSet},
                    dataType:"json",
                    success: function (msg) {
                        if(msg.retCode=="0000"){
                            selfClass.getTeachers();
                            selfClass.getStudents();
                            selfClass.isQuoteGroup();
                            $('#c_ErrorMsg').html('设置成功').fadeIn(200);
                            Disappear("#c_ErrorMsg");
                        }else{
                            $('#c_ErrorMsg').html(msg.retMsg).fadeIn(200);
                            Disappear("#c_ErrorMsg");
                        }

                    }
                });
        },
        deleteTeacher:function(teacherIdDelete){
            $.ajax({
                type:"post",
                url:"/web/teacher/class/teacher/delete",
                data:{classId:this.classId,teacherId: teacherIdDelete},
                async: false,
                dataType:"json",
                success: function (msg) {
                    if(msg.retCode=="0000"){
                        selfClass.getTeachers();
                    }else if(msg.retCode=="3001"){

                    }
                }
            });
        },
        getStudents:function(){
            var that = this;
            $.ajax({
                type: "POST",
                url: "/web/teacher/class/student",
                data: {classId: this.classId},
                dataType: "json",
                success: function (data) {
                    if (data.retCode == "0000") {
                        that.studentList = data.retData;
                        showStudents(that.studentList);
                    }
                }
            });
        },
        getStudentsNoGroup:function(){
            $.ajax({
                type: "POST",
                url: "/web/teacher/class/nogroup",
                data: {classId: this.classId},
                dataType: "json",
                success: function (data) {
                    showStudentsNoGroup(data);
                }
            });
        },
        getGroup:function() {
            $.ajax({
                type: "POST",
                url: "/web/teacher/class/group",
                data: {classId: this.classId},
                dataType: "json",
                success: function (data) {
                    showGroup(data);
                }
            });
        },
        deleteStudent:function() {
            $.ajax({
                type: "POST",
                url: "/web/teacher/class/student/remove",
                data: {classId: this.classId, studentId: this.deStudentId},
                dataType: "json",
                success: function (data) {
                    if(data.retCode=="0000"){
                        selfClass.getStudents();
                    }
                }
            });
        },
        isQuoteGroup:function(){
            $.ajax({
                type: "post",
                url: "/web/teacher/class/group/checkHeader",
                data: {classId: this.classId},
                dataType: "json",
                success: function (data) {
                    showQuoteResult(data);
                }
            });
        },
        useHeader:function(){
            $.ajax({
                type: "post",
                url: "/web/teacher/class/group/useHeader",
                data: {classId:this.classId},
                dataType: "json",
                success: function (data){
                    if(data.retCode.substr(0, 1)==0){
                        selfClass.getGroup();
                    }
                }
            });
        }
    }
/*******************************初始化班级类*******************************************/
    var selfClass = new clazz(classId, headTeacherId, c_grade);
    selfClass.init();
/***********************************教师区域功能***************************************/


/*********展示教师***********/
    function showTeacher(data){
        var $TeacherList = '';
        if(data.length<=1){
            $(".c_OtherTeacherWrap").html('');
            $TeacherList = makeTeacherLi(data[0]);
            $(".c_TeacherAreaCurrent").html($TeacherList);
            $(".c_TeacherLeft,.c_TeacherRight").hide();
            $('.c_OtherTeacherWrap').css({left:0});
            if(data[0].teacherHeader=="1") {
                $(".c_more,.c_intnav").show();
                $(".c_BtnExit").hide();
            }
        }else{
            //当前用户
            $TeacherList = makeTeacherLi(data[0]);
            $(".c_TeacherAreaCurrent").html($TeacherList);
            //左右箭头显示
            if(data.length>5){
                $(".c_TeacherLeft,.c_TeacherRight").show();
            }else{
                $(".c_TeacherLeft,.c_TeacherRight").hide();
                $('.c_OtherTeacherWrap').css({left:0});
            }
            //其他教师
            $TeacherList = '';
            for(var i=1;i<data.length;i++){
                $TeacherList += makeTeacherLi(data[i]);
            }
            $('.c_OtherTeacherWrap').html($TeacherList);
            //判断当前用户是否为班主任
            if(data[0].teacherHeader=="1"){
                $(".c_more,.c_intnav").show();
                $(".c_BtnExit").hide();
                $(".c_TeacherAreaList").on("click",".c_OtherTeacher  .c_OtherTeacherWrap li .c_TeacherPhoto ",function(){
                    store.set("teacherName",$(this).siblings(".c_Subject").html());
                    store.set("teacherId",$(this).siblings('.teacherId').html());
                    window.location.href="teacherManage.html?classId="+store.get("nowClassId");
                });
                $(".c_OtherTeacherWrap li").hover(function(){
                    $(this).children(".c_setTeacher").show();
                    $(this).children(".c_deleteClass").show();
                },function(){
                    $(this).children(".c_setTeacher").hide();
                    $(this).children(".c_deleteClass").hide();
                });
                //设为班主任
                setTeacher();
                //删除班主任
                toDeletedTeacher();
                $(".c_OtherTeacherWrap li").css('cursor','pointer');
                $(".c_TeacherAreaCurrent").css('cursor','pointer');
            }else{
                $(".c_TeacherAreaList").off("click",".c_OtherTeacher  .c_OtherTeacherWrap li .c_TeacherPhoto ");
                $(".c_more,.c_intnav").hide();
                $(".c_BtnExit").show();
                $(".c_setTeacher").hide();
                $(".c_deleteClass").hide();
                $(".c_OtherTeacherWrap li").css('cursor',null);
                $(".c_TeacherAreaCurrent").css('cursor',null);
            }
            //左右切换
            i_ArrowShow();
        }

    }
    function makeTeacherLi(teacher){
        var $TeacherList = '<li>';
        if (teacher.teacherImage == '' || teacher.teacherImage == null) {
            $TeacherList += '<p class="c_TeacherPhoto bd1"><img src="../../static/image/me/user.png" alt="" class="w100 fl"></p>';
        }else {
            $TeacherList += '<p class="c_TeacherPhoto bd1"><img src="' + teacher.teacherImage + '" alt="" class="w100 fl"></p>';
        }
        if(teacher.teacherHeader=="1"){
            $TeacherList += '<i class="c_TeacherTag spriteImg s_teacherico"></i>';
        }else{
            $TeacherList += '<i class="c_TeacherTag spriteImg s_teacherico dino"></i>';
        }
        $TeacherList +='<p class="fs18 fc66 c_Subject" title="' + teacher.subjectName + '' + teacher.teacherName + '">';
        $TeacherList += '<span>' + teacher.subjectName + '</span>';
        $TeacherList += '<span>' + teacher.teacherName + '</span>';
        $TeacherList +='</p>';
        $TeacherList += '<span class="teacherFirst dino">' + teacher.teacherFirst + '</span>';
        $TeacherList += '<span class="teacherHeader dino">' + teacher.teacherHeader + '</span>';
        $TeacherList += '<span class="teacherId dino">' + teacher.teacherId + '</span>';
        $TeacherList +='<span class="c_setTeacher dino">设为班主任</span>';
        $TeacherList +='<span class="c_deleteClass dino">删除</span>';
        $TeacherList += '</li>';
        return $TeacherList;
    }
    //其他老师超过4个，显示左右箭头，并可切换未显示出来的老师
    function i_ArrowShow(){
        var totalSize = $('.c_OtherTeacherWrap li').size();//获取总数据
        var pageSize = 4;//每页显示4条数据
        var currentPage = 1;//当前为第一页
        var totalPage = Math.ceil(totalSize / pageSize);//计算总页数
        var scrollWidth;//通过判断浏览器的宽度决定课件容器的宽度
        if(document.body.offsetWidth<1366){
            scrollWidth=680;
        }else if(document.body.offsetWidth>=1366&&document.body.offsetWidth<=1599){
            scrollWidth=740;
        }else{
            scrollWidth=840;
        }
        if(totalSize>4){
            $('.c_TeacherLeft,.c_TeacherRight').show();
            /*单击向右的箭头*/
            $('.c_TeacherRight').unbind('click').click(function(){
                if(currentPage==totalPage){
                    return false;
                }else {
                    $('.c_OtherTeacherWrap').stop(true).animate({left:currentPage*-scrollWidth},200);
                    currentPage++;
                }
            });
            /*单击向左的箭头*/
            $('.c_TeacherLeft').unbind('click').click(function(){
                if(currentPage==1){
                    return false;
                }else {
                    currentPage--;
                    $('.c_OtherTeacherWrap').stop(true).animate({left:((currentPage-1)*-scrollWidth)},200)
                }
            });
        }
    }
/*********展示加入的班级下拉列表***********/
    function showJoinedClass(data){
        $ClassList = '';
        /*获取当前班级*/
        for(var i= 0;i<data.length; i++){
            if(data[i].joinStatus=="1"){
                if(data[i].classId==classId){
                    $('.c_MainX .c_minxS').html(data[i].gradeName+data[i].className);
                }
            }
        }
        /*如果当前老师加入的班级数量超过1个，加载下拉列表，显示下拉三角*/
        $ClassList+='<i class="spriteImg i_downico"></i>';
        $ClassList+='<ul>';
        for(var i= 0; i<data.length; i++){
            if(data[i].joinStatus=="1"){
                $ClassList +='<li classId="' + data[i].classId
                           + '" headTeacherId="' + data[i].headTeacherId + '">';
                $ClassList +=data[i].gradeName+data[i].className;
                $ClassList += '</li>';
            }
        }
        $ClassList+='</ul>';
        $('.c_MainX .c_dropList').html($ClassList);
        /*选择班级下拉框*/
        $(".c_MainX").on('click', function (e) {
            stopBubble(e);
            if(!$(".c_MainX ul").is(":animated")){
                $(".c_MainX ul").slideToggle(150);
            }
        });
        $(document).click(function(){
            $(".c_MainX ul").slideUp();
        })
        //点击切换班级
        $(".c_dropList ul li").on('click',function (e) {
            //获取切换班级的classId
            classId = $(this).attr("classId");
            headTeacherId = $(this).attr("headTeacherId");
            c_grade = $(this).html();
            store.set('nowClassId',classId);
            store.set('c_grade',c_grade);
            store.set('headTeacherId',headTeacherId);
            selfClass = new clazz(classId, headTeacherId, c_grade);
            selfClass.init();
            //获取切换班级的班级名字
            $(".c_MainX .c_minxS").html(c_grade);
            //面包屑上的班级名字
            $(".c_Crum li:last-child").html(c_grade);
            //邀请函上班级名字
            $("#GradeName").html(c_grade);
            $('.c_StudentManageBtn').addClass("c_StudentAreaBtnCur").siblings().removeClass("c_StudentAreaBtnCur");
            $(".c_StudentManageWrap").show().siblings().hide();
            //是否引用班主任小组
            selfClass.isQuoteGroup();
            $('.c_OtherTeacherWrap').css({left:0});
            stopBubble(e);
        });
    }
    /*****************班主任状态点击邀请***********************/
    $(".c_intnav").click(function(){
        $("#c_Invitedmain").fadeIn();
        $("#c_TeacherName").html(selfClass.teacherList[0].teacherName);
        $("#GradeName").html(selfClass.c_grade);
        $("#GradeCode").html(selfClass.classCode);
    });
    if(window.clipboardData) {
        //for IE
        var copyBtn = document.getElementById("c_CopyBtn");
        copyBtn.onclick = function () {
            var text = $("#Copy_text").text();
            window.clipboardData.setData('text', text);
            $('#c_ErrorMsg').html('复制成功').fadeIn(200);
            Disappear("#c_ErrorMsg");
            $('#c_Invitedmain').fadeOut(250);
        }
    }else{
        // 定义一个新的复制对象
        var clip = new ZeroClipboard( document.getElementById("c_CopyBtn"), {
            moviePath: "../../static/plugin/ZeroClipboard/ZeroClipboard.swf"
        });
        // 复制内容到剪贴板成功后的操作
        clip.on( 'complete', function(client, args) {
            $('#c_ErrorMsg').html('复制成功').fadeIn(200);
            Disappear("#c_ErrorMsg");
            $('#c_Invitedmain').fadeOut(250);
        });
    }

    $("#c_closeI").click(function(){
        $("#c_Invitedmain").fadeOut();
    });
    /******************************解散/退出班级*************************/
    //非班主任状态下老师退出班级
    $(".m_ExitBtn").click(function () {
        selfClass.exitClass();
    });
    $(".c_firstSy").click(function(){
        var len = selfClass.teacherList.length;
        if(len==1){
            $('.m_classFastApp p').html('班里没有更多老师，请解散班级');
        }else{
            $('.m_classFastApp p').html('快去任命下一任班主任吧！');
        }
        $(".m_classFastApp").fadeIn();
        $(".m_classFastAppSon").fadeIn();
    });
    $(".m_classAppointIcoX").click(function(){
        $(".m_classFastApp").fadeOut();
        $(".m_classFastAppSon").fadeOut();
    });
    //点击确定，解散班级。
    $(".m_classAff input:first-child").click(function() {
        //当密码为空的时候，提示用户密码为空。
        if ($(".m_classPass input").val() == "") {
            $(".m_classDisSon h2").text("密码错误").css({
                height: "70px",
                paddingTop: "75px"
            });
            $(".m_classPass input").css("marginTop", "10px");
            $("<p class='c_code'>密码为空<p>").css({
                marginTop: "20px"
            }).appendTo($(".m_classDisSon h2"));
        } else {
            //密码不为空，但是输入密码错误，并向后台发送数据
            var password = $.md5($(".m_classPass input").val());
            selfClass.dissolveClass(password);
        }
    });
    function showDissolvedResult(msg){
        //后台返回的状态码切割后第一位为0时解散成功,其余的都是失败。
        if(msg.retCode.substr(0,1)==="0"){
            //跳转到班级管理页面
            window.location.href = "classmanagenew.html";
            store.set("isClear","1");
        }else if(msg.retCode.substr(0,1)==="3") {
            var clickNum = msg.retData;
            if (clickNum == 2) {
                $(".m_classDisSon h2").text("密码错误").css({
                    height: "70px",
                    paddingTop: "75px"
                });
                $(".m_classPass input").css("marginTop", "10px")
                $("<p class='c_code'>您还有两次机会<p>").css({
                    marginTop: "20px"
                }).appendTo($(".m_classDisSon h2"))
                $(".m_classPass input").val("");
            } else if (clickNum == 1) {
                $(".m_classDisSon h2").text("密码错误").css({
                    height: "70px",
                    paddingTop: "75px"
                });
                $(".m_classPass input").css("marginTop", "10px")
                $("<p class='c_code'>您还有一次机会<p>").css({
                    marginTop: "20px"
                }).appendTo($(".m_classDisSon h2"))
                $(".m_classPass input").val("");
            }
        }else if (msg.retCode.substr(0,1)==="9"){
                //当输入密码三次错误时，自动跳转到修改密码的页面
                $(".m_classPass input").val("");
                $(".m_classDisSon h2").text("请输入登录密码");
                $(".m_classPass input").css("marginTop","0");
                selfClass.logout();
        }
    }
    /*****************设置班主任/删除老师******************/
    function setTeacher(){
        var teacherIdSet;
        //点击设置班主任，获取当前点击的老师的teacherId并且出现弹出框
        $(".c_setTeacher").click(function(){
            teacherIdSet = $(this).parent().children(".teacherId").html();
            $(".m_classAppoint").fadeIn();
            $(".m_classAppointSon").fadeIn();
        });
        //弹出框出现后，点击确定，设定班主任。
        $(".m_classAppointBtnYes").click(function(){
            selfClass.setTeacherHead(teacherIdSet);
            $(".m_classAppoint").fadeOut();
            $(".m_classAppointSon").fadeOut();

        });
        //点击差号，让弹出框隐藏
        $(".m_classAppointIcoX").click(function(){
            $(".m_classAppoint").fadeOut();
            $(".m_classAppoint1").fadeOut();
        });
        //点击取消，让弹出框隐藏
        $(".m_classAppointBtnNo").click(function(){
            $(".m_classAppoint").fadeOut();
            $(".m_classAppointSon").fadeOut();
        });
    }

    function toDeletedTeacher(){
        //定义当前变量存储删除老师的teacherId
        var teacherIdDelete;
        //点击删除，获取当前点击的删除老师的teacherId并且出现弹出框
        $(".c_deleteClass").click(function(){
            teacherIdDelete = $(this).parent().children(".teacherId").html();
            $(".m_classLeave").fadeIn();
            $(".m_classLeaveson").fadeIn();

        });
        //弹出框出现后，点击再见 ,挥手和后台数据交互，删除当前老师.
        $(".m_classLeaveBtnYes").click(function(){
            selfClass.deleteTeacher(teacherIdDelete);
            $('#c_ErrorMsg').html('删除成功').fadeIn(200);
            Disappear("#c_ErrorMsg");
            $(".m_tDelete").fadeOut();
            $(".m_classLeaveson").fadeOut();
            $(".m_classLeave").fadeOut();
            $(".m_classLeaveson").fadeOut();
        });
        //点击差号,隐藏弹出框
        $(".m_classLeaveIcoX").click(function(){
            $(".m_tDelete").fadeOut();
            $(".m_classLeave").fadeOut();
            $(".m_classLeaveson").fadeOut();
        });
        //点击不了在考虑一下，隐藏弹出框
        $(".m_classLeaveBtnNo").click(function(){
            $(".m_tDelete").fadeOut();
            $(".m_classLeave").fadeOut();
            $(".m_classLeaveson").fadeOut();
        });
        $(".m_classDelNo").click(function(){
            $(".m_tDelete").fadeOut();
            $(".m_classLeaveson").fadeOut();
        });
        //当前用户是班主任状态下，点击退出班级
        $(".c_firstSy").click(function(){
            $(".m_classFastApp").fadeIn();
            $(".m_classFastAppSon").fadeIn();
        });
        $(".m_classAppointIcoX").click(function(){
            $(".m_classFastApp").fadeOut();
            $(".m_classFastAppSon").fadeOut();
        });
    }
    /************引用班主任分组**************/
    FadeOut('.m_classTchbtnOne','.m_classTchMask');
    $('.m_classTchbtnTwo').on('click',function(){
        $(".m_classTchMask").fadeOut();
        selfClass.useHeader();
    });
    function showQuoteResult(data){
        var codenum = parseInt(data.retCode.substr(0, 1));
        if (codenum == 0) {
            $(".c_QuotHeatherGroupBtn").show();
            $(".c_QuotHeatherGroupBtn").on("click").click(function(){
                $(".m_classTchMask").fadeIn();
                var $EditGroupList = '';
                for (var i=0;i<data.retData.length;i++){
                    $EditGroupList += '<ul class="m_groupWrap">';
                    $EditGroupList += '<li class="m_groupName">'+data.retData[i].groupName+'</li>';
                    $EditGroupList += '<ul class="m_groupMember">';
                    for (var j=0;j<data.retData[i].classStudentList.length;j++){
                        $EditGroupList += '<li>' + data.retData[i].classStudentList[j].sutdentName+
                            '<span class="studentid dino">' + data.retData[i].classStudentList[j].sutdentId + '</span>'+
                            '<span class="studentMobile dino">' + data.retData[i].classStudentList[j].studentMobile + '</span>'+
                            '</li>'
                    }
                    $EditGroupList += '</ul>';
                    $EditGroupList += '</ul>'
                }
                $(".m_classTchList").html($EditGroupList);
            });
        }else{
            $('.c_QuotHeatherGroupBtn').hide();
        }
    }
    /******************************按钮效果********************************/
    //邀请按钮划上划下效果
    $(".c_intnav").hover(function(){
        $(".c_intnav").css({
            background:"url('../../static/image/classmanagement/c_BgBtnGreen.png')",
            color:"#fff"
        })
    },function(){
        $(".c_intnav").css({
            background:"url('../../static/image/classmanagement/c_btn1ico.jpg')",
            color:"#333"
        })
    });
    //更多按钮划上划下效果
    $(".c_more").hover(function(){
        $(".c_more").css({
            background:"url('../../static/image/classmanagement/c_BgBtnGreen.png')",
            color:"#fff"
        });
    },function(){
        $(".c_more").css({
            background:"url('../../static/image/classmanagement/c_btn1ico.jpg')",
            color:"#333"
        });
    });
    $('.c_Synsize li').hover(function(){
        $(this).css("color","#65b113");
    },function(){
        $(this).css("color","#666");
    });
    //点击更多按钮，出现下拉框
    $(".c_more").click(function(e){
        $(".c_Synsize").slideToggle(150);
        $('.c_Synsize li').css("color","#666 ");
        stopBubble(e);
    });
    $('.c_BtnExit').hover(function(){
        $(this).css({
            background:"url('../../static/image/classmanagement/c_BgBtnGreen.png')",
            color:"#fff"
        });
    },function(){
        $(this).css({
            background:"url('../../static/image/classmanagement/c_btn1ico.jpg')",
            color:"#333"
        });
    });
    $(document).click(function(){
        $(".c_Synsize").slideUp();
    });
    //点击解散弹出提示框
    $(".c_Synsize li:last-child").click(function(){
        $(".m_classDis").fadeIn();
        $(".m_classDisSon").fadeIn();
        $('.m_classPass input').val("");
    });
    //点击提示框上的差号，隐藏弹出框
    $(".m_classDisSon i").click(function(){
        $(".m_classDis").fadeOut();
        $(".m_classDisSon").fadeOut();
        $(".m_classDisSon h2").text("请输入登录密码");
        $(".m_classPass input").css("marginTop","0");
    });
    //点击取消，隐藏弹出框。
    $(".m_classAff input:last-child").click(function(){
        $(".m_classDis").fadeOut();
        $(".m_classDisSon").fadeOut();
        $(".m_classDisSon h2").text("请输入登录密码");
        $(".m_classPass input").css("marginTop","0");
    });

    $(".c_BtnExit").click(function () {
        $(".m_classMark").fadeIn();
    });
    //点击差号或者点击取消，隐藏弹出框
    $(".m_Close,.m_NoExitBtn").click(function () {
        $(".m_classMark").fadeOut();
    });

    /***********************************学生区域功能***************************************/
        //单击学生管理
    $(".c_StudentManageBtn").click(function () {
        $(this).addClass("c_StudentAreaBtnCur").siblings().removeClass("c_StudentAreaBtnCur");
        $(".c_StudentManageWrap").show().siblings().hide();
    });
    function showStudents(data){
        $html = "";
        if(data.length>0){
            if(selfClass.teacherList[0].teacherHeader=="0"){
                for(var i=0;i<data.length;i++){
                    var j = i+1;
                    $html += '<li>';
                    $html += '<span class="fs18 fc33 c_StudentNum">'+ j + '.</span>'
                        + '<span class="c_StudentName0 fs18 fc33 fl">' + data[i].sutdentName + '</span>'
                        + '<span class="c_StudentTelNum fs18 fc33 fl">'+ '手机:' + data[i].studentMobile + '</span>'
                        + '</li>';
                }
            }else{
                for(var i=0;i<data.length;i++){
                    var j = i+1;
                    $html += '<li>';
                    $html += '<span class="fs18 fc33 c_StudentNum">'+ j + '.</span>'
                        + '<span class="c_StudentName0 fs18 fc33 fl">' + data[i].sutdentName + '</span>'
                        + '<span class="c_StudentTelNum fs18 fc33 fl">'+ '手机:' + data[i].studentMobile + '</span>'
                        + '<i class="spriteImg s_Delico0 fr c_StudentDel" studentId="' + data[i].sutdentId + '"></i>'
                        + '</li>';
                }
            }
            $('.c_StudentList').html($html);
            //删除键
            $(".c_StudentDel").hover(function(){
                $(this).removeClass('s_Delico0').addClass('s_Delico1');
            },function(){
                $(this).removeClass('s_Delico1').addClass('s_Delico0');
            });
            /*删除学生功能*/
            $('.c_StudentList li i').on('click',function(){
                selfClass.deStudentId = $(this).attr('studentId');
                $(".m_DelStudent").fadeIn();
                $(".m_DelClose,.m_NoDelBtn").click(function () {
                    $(".m_DelStudent").fadeOut();
                });
            });
            $(".m_DelBtn").on( 'click',function () {
                selfClass.deleteStudent();
                $(".m_DelStudent").fadeOut();

            });
        }else{
            if(selfClass.teacherList.length==1){
                $html += '<li class="c_NoStudent">点击右上角‘邀请’分享，通知老师和学生们吧</li>';
            }else{
                $html += '<li class="c_NoStudent">快去邀请学生加入班级</li>';
            }
            $('.c_StudentList').html($html);
        }
    }

    function deleteStudents(){
        $(".c_Mainbot1").hover(function () {
            $(this).children(".a_MainCha").show();
        },function () {
            $(this).children(".a_MainCha").hide();
        });
        $('.c_MainList').delegate("li","mouseenter",function(e){
            $(e.target).find('.a_MainDelCha').show();
        });
        $('.c_MainList').delegate("li","mouseleave",function(e){
            $(e.target).find('.a_MainDelCha').hide();
        });
        $('.c_Mainbot1>i').on('click',function(){
            var isBlock = false;
            $(this).parent().siblings('.c_Mainbot1').each(function(){
                if($(this).children('.c_GroupSaveBtn').css('display')=="block"||$(this).hasClass("newGroup")){
                    isBlock = true;
                }
            });
            if(isBlock){
                return;
            }
            $(".m_DelGroup").fadeIn();
            delGroupId = $(this).next().attr('groupId');
        });
        FadeOut('.m_NoDelGroupBtn','.m_DelGroup');
        FadeOut('.m_DelGroupClose','.m_DelGroup');
        $('.c_MainList li i').on('click',function(){
            var isBlock = false;
            $(this).parent().parent().parent().siblings('.c_Mainbot1').each(function(){
                if($(this).children('.c_GroupSaveBtn').css('display')=="block"||$(this).hasClass("newGroup")){
                    isBlock = true;
                }
            });
            if(isBlock){
                return;
            }
            $(this).parent().parent().siblings(".c_GroupSaveBtn").show();
            $(this).parent().remove();
        });
        $('.m_DelGroupBtn').click(function(){
            if(delGroupId==""){
                $('.newGroup').remove();
                toCreateGroup();
            }else{
                deleteGroup(delGroupId);
            }
            $('.m_DelGroup').fadeOut();
        });
    }
    function toCreateGroup(){
        $('.c_MainAdd').on('click',function(){
            var isBlock = false;
            $(this).parent().siblings('.c_Mainbot1').each(function(){
                if($(this).children('.c_GroupSaveBtn').css('display')=="block"){
                    isBlock = true;
                }
            });
            if(isBlock){
                return;
            }
            $html = '<div class="c_Mainbot1 fl newGroup"><i class="spriteImg s_delico a_MainCha"></i>'
                + '<h3 class="fs24 c_MainZ" groupId=""><input class="c_GroupName" id="gourpName_ipt" placeholder="设置小组名称" autofocus="" type="text">'
                + '<span class="c_GroupIdTag">newGroup</span></h3>'
                + '<ul id="g_ul_newGroup" class="c_MainList"><li class="c_GroupNoStu"><span class="c_fontShock">请添加学生</span></li></ul>'
                + '<div class="c_MainB"><i class="spriteImg s_addico0 fl c_MainI"></i><span>添加学生</span></div>'
                + '<p class="c_GroupSaveBtn"><button class="c_SaveGroup">保 存</button><button class="c_CancelGroup">取消</button></p></div>';
            if($(this).parent().prev().hasClass('newGroup')){
                return;
            }
            $(this).parent(). before($html);
            toSaveGroup();
            deleteStudents();
        });
    }
    //单击小组管理按钮
    $(".c_GroupManageBtn").click(function () {
        selfClass.isQuoteGroup();
        selfClass.getGroup();
        $(this).addClass("c_StudentAreaBtnCur").siblings().removeClass("c_StudentAreaBtnCur");
        $(".c_StudentManageWrap").hide().siblings().show();
    });
    //创建小组
    $('.c_CreatGroupBtn').on('click',function(){

        var len = $('.c_EditGroupWrap .c_Mainbot1').length;
        if(len>2){
            $('#createGroupDiv').prevAll().remove();
            var $html = '<div class="c_Mainbot1 fl newGroup"><i class="spriteImg s_delico a_MainCha"></i>'
                + '<h3 class="fs24 c_MainZ" groupId=""><input class="c_GroupName" id="gourpName_ipt" placeholder="设置小组名称" autofocus="" type="text">'
                + '<span class="c_GroupIdTag">newGroup</span></h3>'
                + '<ul id="g_ul_newGroup" class="c_MainList"><li class="c_GroupNoStu"><span class="c_fontShock">请添加学生</span></li></ul>'
                + '<div class="c_MainB"><i class="spriteImg s_addico0 fl c_MainI"></i><span>添加学生</span></div>'
                + '<p class="c_GroupSaveBtn dino"><button class="c_SaveGroup">保 存</button><button class="c_CancelGroup">取消</button></p></div>';
            $('#createGroupDiv').before($html);
        }else{
            $('.c_GroupSaveBtn').hide();
        }
        $('.c_EditGroupWrap').show().siblings().hide();
        $('.c_EditGroupWrap div').show();
        $('.c_MainList').html($('<li class="c_GroupNoStu"><span class="c_fontShock">请添加学生</span></li>'));
        $('.c_MainZ').attr('groupId','');
        $('.c_MainZ').html($('<input class="c_GroupName" id="gourpName_ipt" placeholder="设置小组名称" autofocus="" type="text"><span class="c_GroupIdTag">newGroup</span>'));
        getNoGroupSize();
        toSaveGroup();
        deleteStudents();
    });
    //保存按钮
    function toSaveGroup(){
        $('.c_MainB').unbind().click(function(){
            if($(this).parent().siblings('.newGroup').length>0){
                return;
            }
            var isBlock = false;
            $(this).parent().siblings('.c_Mainbot1').each(function(){
                if($(this).children('.c_GroupSaveBtn').css('display')=="block"){
                    isBlock = true;
                }
            });
            if(isBlock){
                return;
            }
            groupId = $(this).prev().attr('id');
            selfClass.getStudentsNoGroup();
            $(this).next().fadeIn();

        });
        $('.c_GroupName').keyup(function(){
            $(this).parent().siblings('.c_GroupSaveBtn').show();
        });
        $('.c_SaveGroup').unbind().click(function(){
            var sibs= $(this).parent().siblings();
            var groupName = '';
            var groupId = sibs[1].attributes['groupId'].value;
            var para = {};
            para.classId = selfClass.classId;
            para.studentIdList = [];
            var lis = sibs[2].children;
            for (var i = 0; i < lis.length; i++) {
                if(lis[i].attributes['studentId']!=undefined){
                    para.studentIdList.push(lis[i].attributes['studentId'].value);
                }

            }
            if(lis.length==0||para.studentIdList.length==0){
                $addCon = '<li class="c_GroupNoStu"><span class="c_fontShock">请添加学生</span></li>';
                sibs[2].innerHTML = $addCon;
                var obj =  $(".c_fontShock");
                shock(obj);
            }else{
                if(groupId!=""&&groupId!=undefined){
                    groupName = $(this).parent().siblings('.c_MainZ').html();
                    if(groupName == ""){
                        shock($(".c_GroupName"));
                        $(".c_GroupName").css({
                            border:"1px solid red"
                        });
                    }else {
                        var count=0;
                        //判断该小组是否改变
                        for(var i=0;i<selfClass.groupData.length;i++){
                            //判断组id
                            if(groupId==selfClass.groupData[i].groupId){
                                //判断组名
                                if(selfClass.groupData[i].groupName==groupName){
                                    var classStudentList = selfClass.groupData[i].classStudentList;
                                    if(classStudentList.length==para.studentIdList.length){
                                        for(var k1=0;k1<para.studentIdList.length;k1++){
                                            for(var k2=0;k2<classStudentList.length;k2++){
                                                if(para.studentIdList[k1]==classStudentList[k2].sutdentId){
                                                    count++;
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                        }
                        if(count!=para.studentIdList.length){
                            para.groupName = groupName;
                            para.groupId = groupId;
                            updateGroup(para);
                        }
                    }
                }else{
                    groupName = $(this).parent().siblings('.c_MainZ').children()[0].value;
                    if(groupName == ""){
                        shock($(".c_GroupName"));
                        $(".c_GroupName").css({
                            border:"1px solid red"
                        });
                    }else {
                        para.groupName = groupName;
                        createGroup(para);
                    }
                }
            }

        });
        $('.c_CancelGroup').on('click',function(){
            if($(this).parent().parent().hasClass('newGroup')){
                $(this).parent().parent().remove();
            }else{
                selfClass.getGroup();
            }
            $('.c_EditGroupWrap').show().siblings().hide();
            toCreateGroup();
        });
    }
    function showGroup(data){
        if(data.retCode=="0000"){
            var groups = data.retData;
            if(groups.length==0){
                if(selfClass.studentList.length>0){
                    $('.c_NoGroup').show().siblings().hide();
                }else{
                    $('.c_classMsg').show().siblings().hide();
                }
            }else{
                selfClass.groupData = data.retData;
                $EditGroupList = "";
                for (var i = 0; i < groups.length; i++) {
                    $EditGroupList += '<div class="c_Mainbot1 fl">';
                    $EditGroupList += '<i class="spriteImg s_delico a_MainCha"></i>';
                    $EditGroupList += '<h3 class="fs24 c_MainZ" groupId="'+ groups[i].groupId
                        + '">' + groups[i].groupName;
                    $EditGroupList += '</h3>';
                    $EditGroupList += '<ul id="g_ul_'+groups[i].groupId+'" class="c_MainList">';
                    for (var j = 0; j < groups[i].classStudentList.length; j++) {
                        $EditGroupList += '<li studentId="' +  groups[i].classStudentList[j].sutdentId + '">'
                            + groups[i].classStudentList[j].sutdentName + ''
                            + '<i class="spriteImg s_delico a_MainDelCha"></i></li>';
                    }
                    $EditGroupList += '</ul>';
                    $EditGroupList += '<div class="c_MainB"><i class="spriteImg s_addico0 fl c_MainI"></i><span>添加学生</span></div>';
                    $EditGroupList +='<p class="c_GroupSaveBtn">';
                    $EditGroupList +='<button class="c_SaveGroup">保 存</button>';
                    $EditGroupList +='<button class="c_CancelGroup">取消</button>';
                    $EditGroupList +='</p>';
                    $EditGroupList += '</div>';
                }
                var $box = '<div id="createGroupDiv" class="c_Mainbot1 fl">'+'<div class="c_MainAdd">'
                         + '<i class="spriteImg s_addico1 c_MainIZove"></i>' + '<p>创建小组</p></div></div>'
                         + '<p class="c_GroupMsg fs18">还有同学没加入小组呢，快把ta加进来吧！</p>';
                $('.c_EditGroupWrap').html($EditGroupList + $box);
                $('.c_EditGroupWrap').show().siblings().hide();
                getNoGroupSize();
                toSaveGroup();
                $('.c_MainAdd').on('click',function(){
                    var isBlock = false;
                    $(this).parent().siblings('.c_Mainbot1').each(function(){
                        if($(this).children('.c_GroupSaveBtn').css('display')=="block"){
                            isBlock = true;
                        }
                    });
                    if(isBlock){
                        return;
                    }
                    $html = '<div class="c_Mainbot1 fl newGroup"><i class="spriteImg s_delico a_MainCha"></i>'
                        + '<h3 class="fs24 c_MainZ" groupId=""><input class="c_GroupName" id="gourpName_ipt" placeholder="设置小组名称" autofocus="" type="text">'
                        + '<span class="c_GroupIdTag">newGroup</span></h3>'
                        + '<ul id="g_ul_newGroup" class="c_MainList"><li class="c_GroupNoStu"><span class="c_fontShock">请添加学生</span></li></ul>'
                        + '<div class="c_MainB"><i class="spriteImg s_addico0 fl c_MainI"></i><span>添加学生</span></div>'
                        + '<p class="c_GroupSaveBtn"><button class="c_SaveGroup">保 存</button><button class="c_CancelGroup">取消</button></p></div>';
                    if($(this).parent().prev()){
                        if($(this).parent().prev().hasClass('newGroup')){
                            return;
                        }else{
                            $(this).parent(). before($html);
                        }
                    }else{
                        $(this).parent(). before($html);
                    }
                    toSaveGroup();
                    deleteStudents();
                });
                deleteStudents();
            }
        }

    }
    function showStudentsNoGroup(data){
        if(data.retCode=="0000"){
            var nowdata = new Array();
            for(var i=0;i<data.retData.length;i++){
                nowdata[i] = {};
                nowdata[i].studentId = data.retData[i].sutdentId;
                nowdata[i].studentName = data.retData[i].sutdentName;
                nowdata[i].studentMobile = data.retData[i].studentMobile;
            }
            $html = '';
            if(nowdata.length>0){
                var spAdress = [];
                for(var i=0;i<nowdata.length;i++){
                    $('#'+groupId).children().each(function(){
                       if($(this).attr("studentId")==nowdata[i].studentId){
                           spAdress.push(i);
                       }
                    });
                }
                for(var i=spAdress.length-1;i>=0;i--){
                    nowdata.splice(spAdress[i],1);
                }
                if(nowdata.length>0){
                    $html += '<p class="fs24 fc33 bd1">学生名单</p><ul class="c_ul">';
                    for(var i=0;i<nowdata.length;i++) {
                        $html += '<li studentId="' + nowdata[i].studentId + '">'
                            + nowdata[i].studentName + '</li>';
                    }
                    $html += '</ul><p class="Ok"><button class="c_OkBtn">确定</button></p>';
                    $('.c_nameList').html($html);
                    $('.c_ul li').unbind('click').click(function(e){
                        stopBubble(e);
                        var studentId = $(this).attr('studentId');
                        var $ulContent = '<li studentId="' + studentId +'">' + $(this).html()
                            + '<i class="spriteImg s_delico a_MainDelCha" ></i></li>';
                        $(this).remove();
                        $('.c_GroupNoStu').remove();
                        $('#'+groupId).append($ulContent);
                        deleteStudents();
                    });
                }else{
                    showNoData();
                }
            }else{
                showNoData();
            }
            $('.c_NoGroupWrap').show();
            FadeOut('.c_OkBtn','.c_NoGroupWrap');
        }
    }
    function createGroup(para) {
        $.ajax({
            type: "POST",
            url: "/web/teacher/class/group/create",
            data: JSON.stringify(para),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                selfClass.getGroup();
            }
        });
    }
    function updateGroup(parm){
        $.ajax({
            type: "POST",
            url: "/web/teacher/class/group/update",
            data: JSON.stringify(parm),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function(data) {
                selfClass.getGroup();
            }
        });
    }
    function deleteGroup(groupId){
        $.ajax({
            type: "POST",
            url: "/web/teacher/class/group/delete",
            data: {groupId: groupId},
            dataType: "json",
            success: function (data) {
                selfClass.getGroup();
            }
        });
    }
    function getNoGroupSize(){
        $.ajax({
            type: "POST",
            url: "/web/teacher/class/nogroup",
            data: {classId:selfClass.classId},
            dataType: "json",
            success: function (data) {
                if(data.retCode=="0000"){
                    if(data.retData.length>0){
                        $('.c_GroupMsg').show();
                    }else{
                        $('.c_GroupMsg').hide();
                    }
                }
            }
        });
    }
    function showNoData(){
        $html += '<div id="noData" class="NoData"><img src="../../static/image/kola/no.png" class="NoDataImg" alt=""></div>'
            + '<p class="Ok"><button class="c_OkBtn">确定</button></p>';
        $('.c_nameList').html($html);
        $('#noData').css('height','300px');
        $('#noData').css('margin-top','150px');
        $('.c_OkBtn').css('margin-top','108px');
    }

});