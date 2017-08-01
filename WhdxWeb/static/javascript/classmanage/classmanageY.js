/**
 * Created by yanenming on 2016/11/11.
 */
$(function(){
    GetHtml('../common/common.txt', '#header');//引入导航
    var classid=store.get('NowClassId');//取LocalStorage传递的班级id
    var headTeacherid=store.get('headTeacherId');//取LocalStorage传递的班主任id
    var c_grade=store.get('c_Grade');//取LocalStorage传递的班级名称用于面包屑导航
    $('#c_Crum1').append('<li class="fc65">'+c_grade+'</li>');
    var time;
/****************************************加载教师列表**********************************/
       $("#GradeName").html(c_grade);
       //邀请 更多按钮
       i_classButton();
      //解散班级验证密码
       i_verificationCode();
      //接口：获取班级码
       i_CLassCode();
      //接口:获取某个班级下所有的老师
       i_GetTeacher();
       //获取班级学生
       GetstudentList();
       //根据当前用户加入的班级，加载班级下拉框
       i_JionClass();
      //非班主任状态退出班级
       i_ExitClass();
     //邀请函
       i_smouseTecher();
     //邀请 更多按钮
    function i_classButton(){
        //邀请按钮划上划下效果
        $(".c_intnav").hover(function(){
            $(".c_intnav").css({
                background:"url('../../static/image/classmanage/c_btn2ico.jpg')",
            })
        },function(){
            $(".c_intnav").css({
                background:"url('../../static/image/classmanage/c_btn1ico.jpg')",
            })
        });
        //更多按钮划上划下效果
        $(".c_more").hover(function(){
            $(".c_more").css({
                background:"url('../../static/image/classmanage/c_btn2ico.jpg')",
            });
        },function(){
            $(".c_more").css({
                background:"url('../../static/image/classmanage/c_btn1ico.jpg')",
            });
        });
        $('.c_Synsize li').hover(function(){
            $(this).css("color","#65b113");
        },function(){
            $(this).css("color","#666");
        });
        //点击更多按钮，出现下拉框
        $(".c_more").click(function(e){
            $(".c_Synsize").slideToggle();
            $('.c_Synsize li').css("color","#666 ");
            //阻止冒泡
            e.stopPropagation();
            window.event.cancelBubble = true;
        });
        $(document).click(function(){
            $(".c_Synsize").slideUp();
        });
        //班主任状态点击邀请
        $(".c_intnav").click(function(){
            $("#c_Invitedmain").fadeIn();
        })
    }
    /******根据classId获取班级所有的老师*******/
    function i_GetTeacher(){
        classid = store.get('NowClassId');
        var $TeacherList='';
        $.ajax({
            type: "post",
            url: "/web/teacher/class/teacher",
            data:{classId:classid},
            dataType: "json",
            success:function(data) {
                console.log(data);
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0) {
                    if(data.retData.length<=1){
                        $(".c_OtherTeacherWrap").html('');
                    }
                    $TeacherList += '</li>';
                    if (data.retData[0].teacherImage == ''||data.retData[0].teacherImage == null) {
                        $TeacherList += '<p class="c_TeacherPhoto bd1"><img src="../../static/image/me/user.png" alt="" class="w100 fl"></p>';
                    }
                    else {
                        $TeacherList += '<p class="c_TeacherPhoto bd1"><img src="' + data.retData[0].teacherImage + '" alt="" class="w100 fl"></p>';
                    }
                    $TeacherList +='<p class="fs18 fc66 c_Subject">';
                    $TeacherList += '<span>' + data.retData[0].subjectName + '</span>';
                    $TeacherList += '<span class="dino" id="firstIs">' + data.retData[0].teacherHeader + '</span>';
                    $TeacherList += '<span>' + data.retData[0].teacherName + '</span>';
                    $('#c_TeacherName').html( data.retData[0].teacherName)
                    $TeacherList +='</p>';
                    $TeacherList += '<i class="spriteImg s_teacherico dino"></i>';
                    $TeacherList += '</li>';
                    $(".c_TeacherAreaCurrent").html($TeacherList);
                    $TeacherList = '';
                    /*先加载当前用户判断当前用户是否为班主任*/
                    if(data.retData[0].teacherHeader=="1"&&data.retData[0].teacherFirst=="1"){
                        //当前用户是班主任状态下的显示更多和邀请按钮还有班主任三个字，退出按钮隐藏,否则反之。
                        $(".c_more").show();
                        $(".c_intnav").show();
                        $(".c_BtnExit").hide();
                        $(".s_teacherico").show();
                        //点击  如果当前用户是班主任   则进入相应的班级  报告页面
                        $(".c_TeacherAreaList").on("click",".c_OtherTeacher  .c_OtherTeacherWrap li .c_TeacherPhoto ",function(){
                            store.set("teacherName",$(this).siblings(".c_Subject").html());
                            window.location.href="classmanageE.html?classId="+store.get("NowClassId");
                        });
                    }else{
                        $(".c_more").hide();
                        $(".c_intnav").hide();
                        $(".c_BtnExit").show();
                        $(".s_teacherico").hide();
                    }
                    //当老师的数量大于5个的时候显示左右箭头。
                    if(data.retData.length>5){
                        $(".c_TeacherLeft").show();
                        $(".c_TeacherRight").show();
                    }else{
                    //当老师的数量小于5个的时候隐藏左右箭头。
                        $(".c_TeacherLeft").hide();
                        $(".c_TeacherRight").hide();
                        $('.c_OtherTeacherWrap').css({left:0});
                    }
                    /*不是当前用户*/
                    for(var i=1;i<data.retData.length;i++){
                        $TeacherList += '<li>';
                        if (data.retData[i].teacherImage == '' || data.retData[i].teacherImage == null) {
                            $TeacherList += '<p class="c_TeacherPhoto bd1"><img src="../../static/image/me/user.png" alt="" class="w100 fl"></p>';
                        }else {
                            $TeacherList += '<p class="c_TeacherPhoto bd1"><img src="' + data.retData[i].teacherImage + '" alt="" class="w100 fl"></p>';
                        }
                        $TeacherList += '<i class="c_TeacherTag spriteImg s_teacherico dino"></i>';
                        $TeacherList +='<p class="fs18 fc66 c_Subject" title="' + data.retData[i].subjectName + '' + data.retData[i].teacherName + '">';
                        $TeacherList += '<span>' + data.retData[i].subjectName + '</span>';
                        $TeacherList += '<span>' + data.retData[i].teacherName + '</span>';
                        $TeacherList +='</p>';
                        $TeacherList += '<span class="teacherFirst dino">' + data.retData[i].teacherFirst + '</span>';
                        $TeacherList += '<span class="teacherHeader dino">' + data.retData[i].teacherHeader + '</span>';
                        $TeacherList += '<span class="teacherId dino">' + data.retData[i].teacherId + '</span>';
                        $TeacherList +='<span class="c_setTeacher dino">设为班主任</span>';
                        $TeacherList +='<span class="c_deleteClass dino">删除</span>';
                        $TeacherList += '</li>';
                        $('.c_OtherTeacherWrap').html($TeacherList);
                        for(var j=0;j<$('.c_OtherTeacherWrap li').length;j++){
                            var isblock=$('.c_OtherTeacherWrap li').eq(j).find('.teacherHeader').html();
                            var isTeacherTag=$('.c_OtherTeacherWrap li').eq(j).find('.c_TeacherTag');
                            if(isblock=='1'){
                                isTeacherTag.css('display','block');
                            }
                            else {
                                isTeacherTag.hide();
                            }
                        }
                    }
                    //设置班主任或删除班主任
                    if(data.retData[0].teacherHeader=="1"&&data.retData[0].teacherFirst=="1"){
                        $(".c_OtherTeacherWrap li").hover(function(){
                            $(this).children(".c_setTeacher").show();
                            $(this).children(".c_deleteClass").show();
                        },function(){
                            $(this).children(".c_setTeacher").hide();
                            $(this).children(".c_deleteClass").hide();
                        })
                    }else{
                        $(".c_setTeacher").hide();
                        $(".c_deleteClass").hide();
                    }
                    //**********点击设为班主任***********
                    i_setTeacher();
                    //**********点击删除班主任************
                    i_deleteTeacher();
                    //不是当前用户老师超过4个时左右
                    i_ArrowShow();
                }
            }
        });
        //班主任状态下学生删除按钮的显示与隐藏
        setInterval(function(){
            if( $('#firstIs').html()==1){
                $(".c_StudentDel").show();
            }else{
                $(".c_StudentDel").hide();
            }
        },300)
    }
    //当前用户是班主任状态下显示邀请函
    function i_smouseTecher(){
        $.ajax({
            type: "post",
            url: "/web/teacher/class/teacher",
            data:{classId:classid},
            dataType: "json",
                success:function(data){
                    if(data.retData[0].teacherHeader=="1"&&data.retData[0].teacherFirst=="1"){
                        ////邀请函
                        //$("#c_Invitedmain").show();
                    }else{
                        //邀请函
                        $("#c_Invitedmain").hide();
                    }
                }
            })
        }
    //***********获取班级码*********
    function i_CLassCode(){
        classid = store.get('NowClassId');
        $.ajax({
            type: "POST",
            url: "/web/teacher/class/info",
            data:{classId:classid},
            dataType: "json",
            success:function(data) {
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0) {
                     $('.c_ClassCode').html(data.retData.classCode);
                     store.set('classCode',data.retData.classCode);
                    //班级码
                    var classCode=store.get("classCode");
                    $("#GradeCode").html( classCode);
                }
            }
        });
    }
    //**********点击设为班主任***********
    function i_setTeacher(){
        classid = store.get('NowClassId');
        //定义变量存储teacherId
        var teacherIdSet;
        //点击设置班主任，获取当前点击的老师的teacherId并且出现弹出框
        $(".c_setTeacher").click(function(){
            teacherIdSet = $(this).parent().children(".teacherId").html();
            $(".m_classAppoint").fadeIn();
            $(".m_classAppointSon").fadeIn();
        });
        //弹出框出现后，点击确定，设定班主任。
        $(".m_classAppointBtnYes").click(function(){
            $.ajax({
                type:"post",
                url:"/web/teacher/class/teacher/set",
                data:{classId:classid,teacherId:teacherIdSet},
                dataType:"json",
                success: function (msg) {
                    i_GetTeacher();
                    i_QuoteClassTeacher();
                }
            });
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
        })
    }
    //**********点击删除班主任************
    function i_deleteTeacher(){
        classid = store.get('NowClassId');
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
            $.ajax({
                type:"post",
                url:"/web/teacher/class/teacher/delete",
                data:{classId:classid,teacherId: teacherIdDelete},
                dataType:"json",
                success: function (msg) {
                    i_GetTeacher();
                }
            });
            $(".m_classLeave").fadeOut();
            $(".m_classLeaveson").fadeOut();
        });
        //点击差号,隐藏弹出框
        $(".m_classLeaveIcoX").click(function(){
            $(".m_classLeave").fadeOut();
            $(".m_classLeaveson").fadeOut();
        });
        //点击不了在考虑一下，隐藏弹出框
        $(".m_classLeaveBtnNo").click(function(){
            $(".m_classLeave").fadeOut();
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
        })
    }
    //其他老师超过4个，显示左右箭头，并可切换未显示出来的老师
    function i_ArrowShow(){
        var totalSize = $('.c_OtherTeacherWrap li').size();//获取总数据
        var pageSize = 4;//每页显示4条数据
        var currentPage = 1;//当前为第一页
        var totalPage = Math.ceil(totalSize / pageSize);//计算总页数
        var scrollWidth;//通过判断浏览器的宽度决定课件容器的宽度
        if(document.body.offsetWidth<1366){
            scrollWidth=760;
        }else{
            scrollWidth=840;
        }
        if(totalSize>4){
            $('.c_TeacherLeft,.c_TeacherRight').show();
            /*单击向右的箭头*/
            $('.c_TeacherRight').click(function(){
                if(currentPage==totalPage){
                                return false;
                            }else {
                                $('.c_OtherTeacherWrap').animate({left:currentPage*-scrollWidth},200);
                                currentPage++;
                            }
            });
            /*单击向左的箭头*/
            $('.c_TeacherLeft').click(function(){
                if(currentPage==1){
                                return false;
                            }else {
                                currentPage--;
                                $('.c_OtherTeacherWrap').animate({left:((currentPage-1)*-scrollWidth)},200)
                            }
            })
        }
    }
    /*****根据当前用户加入的班级，加载班级下拉框********/
    function i_JionClass(){
        var $ClassList='';
        /*接口：根据当前登录的用户显示他加入的班级*/
        $.ajax({
            type: "POST",
            url: "/web/teacher/class/list",
            dataType: "json",
            success:function(data) {
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0) {
                    /*获取当前班级*/
                    for(var i= 0;i<data.retData.length; i++){
                        //如果当前班级是ing状态，不加载
                        if(data.retData[i].joinStatus=="1"){
                            if(data.retData[i].classId==classid){
                                $('.c_MainX .c_minxS').html(data.retData[i].gradeName+data.retData[i].className);
                            }
                        }
                    }
                    /*如果当前老师加入的班级数量超过1个，加载下拉列表，显示下拉三角*/
                    $ClassList+='<i class="spriteImg i_downico"></i>';
                    $ClassList+='<ul>';
                    for(var i= 0; i<data.retData.length; i++){
                        if(data.retData[i].joinStatus=="1"){
                            $ClassList+='<li>';
                            $ClassList +='<p>'+data.retData[i].gradeName+data.retData[i].className+'</p>'
                            $ClassList +='<span class="classId" style="display: none;">'+data.retData[i].classId +'</span>'
                            $ClassList += '</li>';
                        }
                    }
                    $ClassList+='</ul>';
                    $('.c_MainX').append($ClassList);
                    /*选择班级下拉框*/
                    $(".c_MainX").on('click', function (e) {
                        $(".c_MainX ul").slideToggle();
                        e.stopPropagation();
                        window.event.cancelBubble = true;
                    });
                    $(document).click(function(){
                        $(".c_MainX ul").slideUp();
                    })
                    //点击切换班级
                    $(".c_MainX ul").on('click',"li",function () {
                        //获取切换班级的班级名字
                        $(".c_MainX .c_minxS").html($(this).children("p").text());
                        //获取切换班级的classId
                        classid = $(this).children(".classId").text();
                        var classid = store.set('NowClassId',classid);
                        var c_grade=store.set('c_Grade',$(this).children("p").text());
                        //面包屑上的班级名字
                        $(".c_Crum li:last-child a").html(c_grade);
                        //邀请函上班级名字
                        $("#GradeName").html(c_grade);
                        /*接口：获取班级码*/
                        i_CLassCode();
                        /*获取某个班级下所有的老师*/
                        i_GetTeacher();
                        i_smouseTecher();
                        //获取班级所有的学生
                         GetstudentList();
                        //是否引用班主任小组
                        i_QuoteClassTeacher();
                        $('.c_OtherTeacherWrap').css({left:0});
                        //邀请函
                         CopyInvite();
                    })
                }
            }
        })
   }
    /**********当前用户非班主任状态退出班级弹窗*****************/
    function i_ExitClass(){
        //点击退出班级按钮，显示弹出框。
        $(".c_BtnExit").click(function () {
            $(".m_classMark").fadeIn();
        });
        //点击差号或者点击取消，隐藏弹出框
        $(".m_Close,.m_NoExitBtn").click(function () {
            $(".m_classMark").fadeOut();
        });
        //点击确定退出当前班级，并且进行数据交互
        $(".m_ExitBtn").click(function () {
            /*接口：非班主任状态下老师退出班级*/
            $.ajax({
                type: "POST",
                url: "/web/teacher/class/teacher/exit",
                data:{classId:classid},
                dataType: "json",
                success:function(data) {
                    var codenum = parseInt(data.retCode.substr(0, 1));
                    if (codenum == 0) {
                        //退出班级成功返回班级管理页面。
                        window.location.href="../../../../model/classmanage/classmanage.html";
                    }
                }
            });
            $(".m_classMark").fadeIn();
        })
    }
    //当前用户是班主任状态下解散班级验证码
    function i_verificationCode(){
        classid = store.get('NowClassId');
        //定义变量记录点击次数
        var num=0;
        //点击解散弹出提示框
        $(".c_Synsize li:last-child").click(function(){
            $(".m_classDis").fadeIn();
            $(".m_classDisSon").fadeIn();
        })
        //点击提示框上的差号，隐藏弹出框
        $(".m_classDisSon i").click(function(){
            $(".m_classDis").fadeOut();
            $(".m_classDisSon").fadeOut();
            $(".m_classDisSon h2").text("请输入登录密码");
            $(".m_classPass input").css("marginTop","0");
            num=0;
        })
        //点击取消，隐藏弹出框。
        $(".m_classAff input:last-child").click(function(){
            $(".m_classDis").fadeOut();
            $(".m_classDisSon").fadeOut();
            $(".m_classDisSon h2").text("请输入登录密码");
            $(".m_classPass input").css("marginTop","0");
            num=0;
        })
        //点击确定，解散班级。
        $(".m_classAff input:first-child").click(function(){
            //当密码为空的时候，提示用户密码为空。
            if($(".m_classPass input").val()==""){
                $(".m_classDisSon h2").text("密码错误").css({
                    height:"70px",
                    paddingTop:"75px"
                });
                $(".m_classPass input").css("marginTop","10px");
                $("<p class='c_code'>密码为空<p>").css({
                    marginTop:"20px"
                }).appendTo($(".m_classDisSon h2"));
            }else{
                //密码不为空，但是输入密码错误，并向后台发送数据
                var passworde = $.md5($(".m_classPass input").val());
                num++;
                $.ajax({
                    type: "post",
                    url: "/web/teacher/class/teacher/dissolve",
                    data:{classId:classid,password:passworde},
                    async:false,
                    dataType:"json",
                    success: function (msg) {
                        //后台返回的状态码切割后第一位为0时解散成功,其余的都是失败。
                        if(msg.retCode.substr(0,1)==="0"){
                            //跳转到班级管理页面
                            window.location.href = "classmanage.html";
                            store.set("Isclear","1");
                        }else{
                            if(num==1){
                                $(".m_classDisSon h2").text("密码错误").css({
                                    height:"70px",
                                    paddingTop:"75px"
                                });
                                $(".m_classPass input").css("marginTop","10px")
                                $("<p class='c_code'>您还有两次机会<p>").css({
                                    marginTop:"20px"
                                }).appendTo($(".m_classDisSon h2"))
                                $(".m_classPass input").val("");
                            }else if(num==2){
                                $(".m_classDisSon h2").text("密码错误").css({
                                    height:"70px",
                                    paddingTop:"75px"
                                });
                                $(".m_classPass input").css("marginTop","10px")
                                $("<p class='c_code'>您还有一次机会<p>").css({
                                    marginTop:"20px"
                                }).appendTo($(".m_classDisSon h2"))
                                $(".m_classPass input").val("");
                            }else  if (num==3){
                                //当输入密码三次错误时，自动跳转到修改密码的页面
                                $(".m_classPass input").val("");
                                $(".m_classDisSon h2").text("请输入登录密码");
                                $(".m_classPass input").css("marginTop","0");
                                ClassQuit();
                                num=0;
                            }
                        }
                    }
                });
            }
        });
    }
    function ClassQuit(){
        $.ajax({
            "type":"get",
            "url":"/web/user/logout?"+Math.random(),
            "dataType":"json",
            success:function(data){
                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                if(codenum==0){
                    window.location.href = "../../../../model/foundpass/foundpass.html"
                }
                else {
                    $('#c_ErrorMsg').html('退出失败请重试').fadeIn(200);  Disappear("#c_ErrorMsg")
                }
            }
        })
    };
    /****************************************学生管理&小组管理**********************************/
    /**********************获取分组列表功能(有分组，则是小组列表状态；无分组，则是创建分组状态)*******/
    var groupListData;
    var groupListData_tmp;
    var newGroupStuData;
    var tag=true;//标记编辑小组时，其他小组是否可操作；初始状态为1,0时不可操作
    var initGroupList = function() {
        var $EditGroupList = '';
        //存在分组时既然存在分组，那么里边的学生长度不为空
        if(groupListData_tmp.length>0){
            for (var i = 0; i < groupListData_tmp.length; i++) {
                $EditGroupList += '<div class="c_Mainbot1 fl">';
                $EditGroupList += '<i class="spriteImg s_delico a_MainCha"></i>';
                $EditGroupList += '<h3 class="fs24 c_MainZ" id="">' + groupListData_tmp[i].groupName;
                $EditGroupList += '<span class="c_GroupIdTag">' + groupListData_tmp[i].groupId + '</span>';
                $EditGroupList += '</h3>';
                $EditGroupList += '<ul id="g_ul_'+groupListData_tmp[i].groupId+'" class="c_MainList">';
                for (var j = 0; j < groupListData_tmp[i].classStudentList.length; j++) {
                    $EditGroupList += '<li>' + groupListData_tmp[i].classStudentList[j].sutdentName + '' +
                                       '<i class="spriteImg s_delico a_MainDelCha"></i>' +
                                       '<span class="c_GroupStudentId">' + groupListData_tmp[i].classStudentList[j].sutdentId + '</span>' +
                                       '<span class="studentMobile dino">' +  groupListData_tmp[i].classStudentList[j].studentMobile + '</span>'+
                                       '</li>';
                }
                $EditGroupList += '</ul>';
                $EditGroupList += '<div class="c_MainB"><i class="spriteImg s_addico0 fl c_MainI"></i><span>添加学生</span></div>';
                $EditGroupList +='<p class="c_GroupSiveBtn">';
                $EditGroupList +='<button class="c_SiveGroup">保 存</button>';
                $EditGroupList +='<button class="c_CancelGroup">取消</button>';
                $EditGroupList +='</p>';
                $EditGroupList += '</div>';
            }
        }
        var $box = '<!--创建小组的盒子-->' +
            '<div id="createGroupDiv" class="c_Mainbot1 fl">' +
            '<div class="c_MainAdd">' +
            '<i class="spriteImg s_addico1 c_MainIZove"></i>' +
            '<p>创建小组</p>' +
            '</div>' +
            '</div>'+
            '<p class="c_GroupMsg fs18">还有同学没加入小组呢，快把ta加进来吧！</p>'+
            '<div class="c_NoGroupWrap fl">'+
            '<div class="c_NoGroup_win">'+
            '<p class="fs24 fc33 bd1">学生名单</p>'+
            '<ul class="c_ul">'+
            '</ul>'+
            '<p class="Ok">'+
            '<button class="c_OkBtn">确定</button>'+
            '</p>'+
            '</div>'+
            '</div>';
        $('.c_EditGroupWrap').html($EditGroupList + $box);
        //删除小组
        DelGroup();
        //没有分组的学生
        GetNoGroupStudent();
        //取消按钮 点击事件
        $(".c_Mainbot1").delegate(".c_CancelGroup","click",function(){
            tag=true;
            groupListData_tmp = $.extend(true,[],groupListData);
            noGroupStudent_tmp = $.extend(true,[],noGroupStudent);
            //取消从新获取小组
            GetGroupList();
            writeNoGroupStudent();
        });
        //保存按钮 点击事件
        $(".c_Mainbot1").delegate(".c_SiveGroup","click",function(e){
            classid=store.get('NowClassId');
            //这是分组数组
            groupListData = $.extend(true,[],groupListData_tmp);
            //这是未分组的学生数组
            noGroupStudent = $.extend(true,[],noGroupStudent_tmp);
            var gid = $(e.target).parent().parent().find(".c_GroupIdTag").html();
            var _this = $(e.target);
            var obj =  $(".c_fontShock");
            for(var i = 0;i<groupListData.length;i++){
                if(groupListData[i].groupId==gid){
                    if(groupListData[i].classStudentList.length<=0){
                        shock(obj);
                    }else{
                        //这里代表 小组已存在，并且有学生
                        var ids = [];
                        for(var k = 0;k < groupListData[i].classStudentList.length;k++){
                            ids.push(groupListData[i].classStudentList[k].sutdentId);
                        }
                        var parm = {
                            "classId": classid,
                            "groupId": gid,
                            "groupName": groupListData[i].groupName,
                            "studentIdList": ids
                        };
                        $.ajax({
                            type: "POST",
                            url: "/web/teacher/class/group/update",
                            data: JSON.stringify(parm),
                            contentType: "application/json;charset=utf-8",
                            dataType: "json",
                            success:function(data){
                                GetGroupList();
                                var codenum = parseInt(data.retCode.substr(0, 1));
                                if (codenum == 0) {
                                    tag=true;
                                    _this.parent().parent().find('.c_GroupSiveBtn').fadeOut();
                                }
                            }
                        });
                    }
                }
            }
        });
        // 绑定删除学生
        $(".c_MainList").delegate('.a_MainDelCha','click',function(e){
            var sid = $(e.target).parent().find(".c_GroupStudentId").html();
            var gid = $(e.target).parent().parent().parent().find(".c_GroupIdTag").html();
            if(tag==true||groupid==gid){
                groupid = gid;
                $(e.target).parent().parent().parent().find('.c_GroupSiveBtn').fadeIn();
                $(e.target).parent().remove();
                for(var i = 0;i<groupListData_tmp.length;i++){
                    if(groupListData_tmp[i].groupId==gid){
                        for(var j = 0;j<groupListData_tmp[i].classStudentList.length;j++){
                            var stu = groupListData_tmp[i].classStudentList[j];
                            if(stu.sutdentId==sid){
                                groupListData_tmp[i].classStudentList.splice(j,1);
                                //console.log( groupListData_tmp[i].classStudentList.splice(j,1))
                                if(groupListData_tmp[i].classStudentList.length<=0){
                                    var tip = '<li class="c_GroupNoStu"><span class="c_fontShock">请添加学生</span></li>';
                                    $("#g_ul_"+groupid).html(tip);
                                }
                                noGroupStudent_tmp.push(stu);
                                var tmp='<li>'+stu.sutdentName+'<span class="c_NoGroupOfStudentId">'+stu.sutdentId+'</span>'+'</li>';
                                $('.c_NoGroupWrap ul').append(tmp);
                                break;
                            }
                        }
                        break;
                    }
                }
                tag=false;
            }
        });
        //单击添加学生，显示未加入小组学生名单，显示保存取消按钮；
        $(".c_Mainbot1").delegate(".c_MainB","click",function(e){
            var tmp = $(e.target).parent();
            if(e.target.tagName=='I'||e.target.tagName=='SPAN'){
                tmp = $(e.target).parent().parent();
            }
            var gid = tmp.find(".c_GroupIdTag").html();
            if(tag==true||groupid==gid){
                tag=false;
                groupid=gid;
                writeNoGroupStudent();
                $('.c_NoGroupWrap').fadeIn();
                tmp.find('.c_GroupSiveBtn').fadeIn();
                $('.c_OkBtn').click(function(){
                    $('.c_NoGroupWrap').fadeOut();
                });
            }
        });
        // 创建小组
        $(".c_Mainbot1").delegate(".c_MainAdd","click",function(e){
              i_creatGroup();
        });
    };
    //创建小组函数
    function i_creatGroup(){
        if(tag==true){
            tag = false;
            var createHtml = "";
            createHtml += '<div class="c_Mainbot1 fl newGroup">';
            createHtml += '<i class="spriteImg s_delico a_MainCha"></i>';
            createHtml += '<h3 class="fs24 c_MainZ" id="">';
            createHtml += '<input type="text" class="c_GroupName" id="gourpName_ipt" placeholder="设置小组名称" autofocus>';
            createHtml += '<span class="c_GroupIdTag">newGroup</span>';
            createHtml += '</h3>';
            createHtml += '<ul id="g_ul_newGroup" class="c_MainList">';
            createHtml += '<li class="c_GroupNoStu"><span class="c_fontShock">请添加学生</span></li>';
            createHtml += '</ul>';
            createHtml += '<div class="c_MainB"><i class="spriteImg s_addico0 fl c_MainI"></i><span>添加学生</span></div>';
            createHtml +='<p class="c_GroupSiveBtn">';
            createHtml +='<button class="c_SiveGroup">保 存</button>';
            createHtml +='<button class="c_CancelGroup">取消</button>';
            createHtml +='</p>';
            createHtml += '</div>';
            $("#createGroupDiv").before(createHtml);
            newGroupStuData = [];
            //单击添加学生，显示未加入小组学生名单，显示保存取消按钮；
            $(".newGroup").delegate(".c_MainB","click",function(e){
                if(groupListData.length<parseInt(groupListData.length)+parseInt(noGroupStudent.length)){
                    // 从未分组名单中单击人员添加
                    $('.c_NoGroupWrap ul').delegate('li','click',function(e){
                        var stuid = $(e.target).find(".c_NoGroupOfStudentId").html();
                        groupListData_tmp = $.extend(true,[],groupListData);
                        for(var i = 0;i<noGroupStudent_tmp.length;i++){
                            if(stuid==noGroupStudent_tmp[i].sutdentId){
                                var stu = noGroupStudent_tmp[i];
                                if((groupListData_tmp)&&groupListData_tmp.length>0){
                                    for(var j=0;j<groupListData_tmp.length;j++){
                                        if(groupListData_tmp[j].groupId==groupid){
                                            if(groupListData_tmp[j].classStudentList<=0){
                                                $("#g_ul_"+groupid).html("");
                                            }
                                            groupListData_tmp[j].classStudentList.push(stu);
                                            var tmp = '<li>' + stu.sutdentName + '<i class="spriteImg s_delico a_MainDelCha"></i><span class="c_GroupStudentId">' + stu.sutdentId + '</span></li>';
                                            $("#g_ul_"+groupid).append(tmp);
                                            $(e.target).remove();
                                            noGroupStudent_tmp.splice(i,1);
                                            break;
                                        }else if(groupid=='newGroup'){
                                            if(newGroupStuData.length<=0){
                                                $("#g_ul_"+groupid).html("");
                                            }
                                            newGroupStuData.push(stu);
                                            var tmp = '<li>' + stu.sutdentName + '<i class="spriteImg s_delico a_MainDelCha"></i><span class="c_GroupStudentId">' + stu.sutdentId + '</span></li>';
                                            $("#g_ul_"+groupid).append(tmp);
                                            $(e.target).remove();
                                            noGroupStudent_tmp.splice(i,1);
                                            break;
                                        }
                                    }
                                }else if(groupid=='newGroup'){
                                    if(newGroupStuData.length<=0){
                                        $("#g_ul_"+groupid).html("");
                                    }
                                    newGroupStuData.push(stu);
                                    var tmp = '<li>' + stu.sutdentName + '<i class="spriteImg s_delico a_MainDelCha"></i><span class="c_GroupStudentId">' + stu.sutdentId + '</span></li>';
                                    $("#g_ul_"+groupid).append(tmp);
                                    $(e.target).remove();
                                    noGroupStudent_tmp.splice(i,1);
                                    break;
                                }
                                break;
                            }
                        }
                    })
                }
                var tmp = $(e.target).parent();
                if(e.target.tagName=='I'||e.target.tagName=='SPAN'){
                    tmp = $(e.target).parent().parent();
                }
                groupid = tmp.find(".c_GroupIdTag").html();
                writeNoGroupStudent();
                $('.c_NoGroupWrap').show();
                tmp.find('.c_GroupSiveBtn').css("display","block");
                $('.c_OkBtn').click(function(){
                    $('.c_NoGroupWrap').hide();
                });
            });
            //鼠标移入组内学生，显示删除图标，移除则隐藏；
            $('.newGroup .c_MainList').delegate("li","mouseenter",function(e){
                $(e.target).find('.a_MainDelCha').show();
            })
            $('.newGroup .c_MainList').delegate("li","mouseleave",function(e){
                $(e.target).find('.a_MainDelCha').hide();
            })
            // 绑定删除学生
            $(".newGroup .c_MainList").delegate('.a_MainDelCha','click',function(e) {
                $(e.target).parent().parent().parent().find('.c_GroupSiveBtn').fadeIn();
                var sid = $(e.target).parent().find(".c_GroupStudentId").html();
                var gid = 'newGroup';
                groupid = gid;
                $(e.target).parent().remove();
                for (var j = 0; j < newGroupStuData.length; j++) {
                    var stu = newGroupStuData[j];
                    if (stu.sutdentId == sid) {
                        newGroupStuData.splice(j, 1);
                        if (newGroupStuData.length <= 0) {
                            var tip = '<li class="c_GroupNoStu"><span class="c_fontShock">请添加学生</span></li>';
                            $("#g_ul_" + groupid).html(tip);
                        }
                        noGroupStudent_tmp.push(stu);
                        var tmp = '<li>' + stu.sutdentName + '<span class="c_NoGroupOfStudentId">' + stu.sutdentId + '</span>' + '</li>';
                        $('.c_NoGroupWrap ul').append(tmp);
                        break;
                    }
                }
            });
            //移入小组，显示删除小组图标，移除隐藏；
            $(".newGroup").hover(function () {
                var that=this;
                $(this).children(".a_MainCha").show();
            },function () {
                $(this).children(".a_MainCha").hide();
            });
            /*删除分组功能*/
            $(".newGroup .a_MainCha").delegate(null,"click",function(e){
                noGroupStudent_tmp = $.extend(true,[],noGroupStudent);
                writeNoGroupStudent();
                $(".c_NoGroupWrap").css('display','none');
                $(e.target).parent().remove();
                tag = true;
            });
            //取消按钮 点击事件
            $(".newGroup").delegate(".c_CancelGroup","click",function(e){
                noGroupStudent_tmp = $.extend(true,[],noGroupStudent);
                writeNoGroupStudent();
                $(".c_NoGroupWrap").css('display','none');
                $(e.target).parent().parent().remove();
                tag = true;
            });
            //保存按钮 点击事件
            $(".newGroup ").delegate(".c_SiveGroup","click",function(e){
                classid=store.get('NowClassId');
                noGroupStudent = $.extend(true,[],noGroupStudent_tmp);
                var _this = $(e.target);
                var obj =  $(".c_fontShock");
                if(newGroupStuData.length<=0){
                    shock(obj);
                }else{
                    if($(".c_GroupName").val()==""){
                        shock($(".c_GroupName"));
                        $(".c_GroupName").css({
                            border:"1px solid red"
                        })
                    }
                    var ids = [];
                    for(var k = 0;k < newGroupStuData.length;k++){
                        ids.push(newGroupStuData[k].sutdentId);
                    }
                    var parm = {
                        "classId": classid,
                        "groupName": $("#gourpName_ipt").val(),
                        "studentIdList": ids
                    };
                    $.ajax({
                        type: "POST",
                        url: "/web/teacher/class/group/create",
                        data:JSON.stringify(parm),
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        success:function(data){
                            var codenum = parseInt(data.retCode.substr(0, 1));
                            if (codenum == 0) {
                                tag = true;
                                GetGroupList();
                            }
                        }
                    });
                }
            })
        }
    }
    //获取小组
    function GetGroupList(){
        classid=store.get('NowClassId');
        var dataLength = store.get("dataLength");
        $.ajax({
            type: "POST",
            url: "/web/teacher/class/group",
            data:{classId:classid},
            dataType: "json",
            success:function(data){
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0) {
                    if (data.retData.length >0) {
                        groupListData = data.retData;
                        groupListData_tmp = $.extend(true,[],groupListData);
                            $(".c_EditGroupWrap").show().siblings().hide();
                            initGroupList();
                    } else {
                        $(".c_NoGroup").show().siblings().hide();
                        $(".c_classImg").on("click",function(){
                            $(".c_EditGroupWrap").show().siblings().hide();
                            groupListData = data.retData;
                            groupListData_tmp = $.extend(true,[],groupListData);
                            initGroupList();
                            tag=true;
                            i_creatGroup();
                        });
                    }
                }
            }
        });
    }
    /****************************学生管理删除学生功能*******************************************/
    var studentid='';
    function DelStudent(){
        $(".c_StudentDel").hover(function(){
            $(this).removeClass('s_Delico0').addClass('s_Delico1');
        },function(){
            $(this).removeClass('s_Delico1').addClass('s_Delico0');
        });
        /*删除学生功能*/
        $('.c_StudentList li i').on('click',function(){
            studentid=$(this).parent().children('.c_StudentId').html();
            $(".m_DelStudent").fadeIn();
            $(".m_DelClose,.m_NoDelBtn").click(function () {
                $(".m_DelStudent").fadeOut();
            });
        });
    }
    $(".m_DelBtn").on( 'click',function () {
        /*接口：从某个班级下移除某个学生*/
        $.ajax({
            type: "POST",
            url: "/web/teacher/class/student/remove",
            data:{classId:classid,studentId:studentid},
            dataType: "json",
            success:function(data) {
                GetstudentList();
            }
        });
        $(".m_DelStudent").fadeOut();
    });
    /***************************************删除分组功能************************************/
    var groupid='';
    function DelGroup(){
        //移入小组，显示删除小组图标，移除隐藏；
        $(".c_Mainbot1").hover(function () {
            var that=this;
            $(this).children(".a_MainCha").show();
        },function () {
            $(this).children(".a_MainCha").hide();
        });
        //鼠标移入组内学生，显示删除图标，移除则隐藏；
        $('.c_MainList').delegate("li","mouseenter",function(e){
            $(e.target).find('.a_MainDelCha').show();
        })
        $('.c_MainList').delegate("li","mouseleave",function(e){
            $(e.target).find('.a_MainDelCha').hide();
        })
        /*点击删除分组功能*/
           $(".a_MainCha").click(function(){
           if(tag==true){
               GetGroupList();
               groupid=$(this).siblings('.c_MainZ').find('.c_GroupIdTag').html();
               $(".m_DelGroup").fadeIn();
               $(".m_DelGroupClose,.m_NoDelGroupBtn").click(function () {
                   $(".m_DelGroup").fadeOut();
                   //小组分组
               });
           }
        })
    }
    //点击确定删除分组功能，并向后台发送数据
    $(".m_DelGroupBtn").click(function () {
        $.ajax({
            type: "POST",
            url: "/web/teacher/class/group/delete",
            data:{groupId:groupid},
            dataType: "json",
            success:function(data) {
                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                if(codenum==0){
                    //小组分组
                    GetGroupList();
                    //未分组的学生
                    GetNoGroupStudent();
                    //引用班主任分组
                    i_QuoteClassTeacher();
                }
            }
        });
        $(".m_DelGroup").fadeOut();
    });
    /************************************获取当前班级学生*********************************/
    function GetstudentList(){
        classid=store.get('NowClassId')
        var $Studenthtml='';
        $.ajax({
            type: "post",
            url: "/web/teacher/class/student",
            data:{classId:classid},
            dataType: "json",
            success: function(data){
                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                     var dataLength=data.retData.length;
                    /*先判断班级内是否有学生，如果没有，显示“暂无学生信息“，如果有，则加载学生列表，并执行小组的系列操作*/
                    /*没有学生的情况*/
                    if(dataLength<=0){
                         $Studenthtml+='<li class="c_NoStudent">暂无学生信息</li>';
                         $(".c_StudentList").html($Studenthtml);
                         $(".c_classMsg").show().siblings().hide();
                    }else{
                        /*有学生的情况，先加载学生列表*/
                        for(var i=0;i<dataLength;i++){
                            $Studenthtml+='<li>';
                            $Studenthtml+='<span class="fs18 fc33 c_StudentNum">'+(i+1)+'.</span>';
                            $Studenthtml+='<span class="c_StudentName0 fs18 fc33 fl">'+data.retData[i].sutdentName+'</span>';
                            $Studenthtml+='<span class="c_StudentTel fs18 fc33 fl">手机：</span>';
                            $Studenthtml+='<span class="c_StudentTelNum fs18 fc33 fl">'+data.retData[i].studentMobile+'</span>';
                            $Studenthtml+='<span class="c_StudentId">'+data.retData[i].sutdentId+'</span>';
                            $Studenthtml+='<i class="spriteImg s_Delico0 fr c_StudentDel"></i>';
                            $Studenthtml+='</li>';
                        }
                        $(".c_StudentList").html($Studenthtml);
                         //获取小组
                         GetGroupList();
                         DelStudent();
                        $(".c_NoGroup").show().siblings().hide();
                    }
                }
           });
        }
    /*单击“小组管理”*/
    $(".c_GroupManageBtn").click(function () {
        $(this).addClass("c_StudentAreaBtnCur").siblings().removeClass("c_StudentAreaBtnCur");
        $(".c_StudentManageWrap").hide().siblings().show();
    });
    /****单击“学生管理”*********/
    $(".c_StudentManageBtn").click(function () {
        $(this).addClass("c_StudentAreaBtnCur").siblings().removeClass("c_StudentAreaBtnCur");
        $(".c_StudentManageWrap").show().siblings().hide();
    });
    /**********************************获取没有分组的学生**********************************/
    var noGroupStudent;
    var noGroupStudent_tmp;
    function writeNoGroupStudent(){
        $(".c_GroupMsg").css('display','block');
        var tmp = "";
        if(noGroupStudent_tmp == undefined||noGroupStudent_tmp.length==0){
            if(!document.getElementById("noData")){
                $('.c_NoGroup_win>p:eq(0)').after('<div id="noData" class="NoData"><img src="../../static/image/kola/no.png" class="NoDataImg" alt=""></div>');
            }
            $('.c_ul').css('display','none');
        }else if(noGroupStudent_tmp.length>0){
            for(var i= 0;i<noGroupStudent_tmp.length;i++){
                tmp+='<li>'+noGroupStudent_tmp[i].sutdentName+'<span class="c_NoGroupOfStudentId">'+noGroupStudent_tmp[i].sutdentId+'</span>'+'</li>';
            }
            $('.c_NoGroupWrap ul').html(tmp);
        }
    }
    function GetNoGroupStudent(){
        classid=store.get('NowClassId');
        var $NogroupList='';
        $.ajax({
            type: "POST",
            url: "/web/teacher/class/nogroup",
            data:{classId:classid},
            dataType: "json",
            success:function(data){
                var codenum = parseInt(data.retCode.substr(0, 1));
                if(codenum==0){
                  // data.retData  为  还没有被分组的学生
                    if(data.retData.length>0){
                        $(".c_ul").show();
                        $(".c_noClss").hide();
                        groupListData_tmp = groupListData_tmp||[""];
                        noGroupStudent = data.retData;
                        //复制
                        noGroupStudent_tmp = $.extend(true,[],noGroupStudent);
                        writeNoGroupStudent();
                        // 从未分组名单中单击人员添加
                        $('.c_NoGroupWrap ul').delegate('li','click',function(e){
                            var stuid = $(e.target).find(".c_NoGroupOfStudentId").html();
                            for(var i = 0;i<noGroupStudent_tmp.length;i++){
                                if(stuid==noGroupStudent_tmp[i].sutdentId){
                                    var stu = noGroupStudent_tmp[i];
                                    if((groupListData_tmp)&&groupListData_tmp.length>0){
                                       for(var j=0;j<groupListData_tmp.length;j++){
                                            if(groupListData_tmp[j].groupId==groupid){
                                                if(groupListData_tmp[j].classStudentList<=0){
                                                    $("#g_ul_"+groupid).html("");
                                                }
                                                groupListData_tmp[j].classStudentList.push(stu);
                                                var tmp = '<li>' + stu.sutdentName + '<i class="spriteImg s_delico a_MainDelCha"></i><span class="c_GroupStudentId">' + stu.sutdentId + '</span></li>';
                                                $("#g_ul_"+groupid).append(tmp);
                                                $(e.target).remove();
                                                noGroupStudent_tmp.splice(i,1);
                                                break;
                                            }else if(groupid=='newGroup'){

                                                if(newGroupStuData.length<=0){
                                                    $("#g_ul_"+groupid).html("");
                                                }
                                                newGroupStuData.push(stu);
                                                var tmp = '<li>' + stu.sutdentName + '<i class="spriteImg s_delico a_MainDelCha"></i><span class="c_GroupStudentId">' + stu.sutdentId + '</span></li>';
                                                $("#g_ul_"+groupid).append(tmp);
                                                $(e.target).remove();
                                                noGroupStudent_tmp.splice(i,1);
                                                break;
                                            }
                                        }
                                    }else if(groupid=='newGroup'){
                                        if(newGroupStuData.length<=0){
                                            $("#g_ul_"+groupid).html("");
                                        }
                                        newGroupStuData.push(stu);
                                        var tmp = '<li>' + stu.sutdentName + '<i class="spriteImg s_delico a_MainDelCha"></i><span class="c_GroupStudentId">' + stu.sutdentId + '</span></li>';
                                        $("#g_ul_"+groupid).append(tmp);
                                        $(e.target).remove();
                                        noGroupStudent_tmp.splice(i,1);
                                        break;
                                    }
                                    break;
                                }
                            }
                        })
                    }
                }
            }
        });
    }
    //判断能否引用班主任分组
    i_QuoteClassTeacher();
    function  i_QuoteClassTeacher(){
        classid = store.get('NowClassId');
        $.ajax({
            type: "post",
            url: "/web/teacher/class/group/checkHeader",
            data: {classId:classid},
            dataType: "json",
            success: function (data){
                if(data.retCode.substr(0,1)==0){
                    $(".c_QuotHeatherGroupBtn").show();
                    $(".c_QuotHeatherGroupBtn").unbind("click").click(function(){
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
                     $(".c_QuotHeatherGroupBtn").hide();
                }
            }
        })
    }
    //确定引用班主任分组并且调用数据
    $(".m_classTchbtnTwo").click(function(){
        $(".m_classTchMask").fadeOut();
        i_ClassTeacherGroup();
    });
    //取消不引用班主任分组
    $(".m_classTchbtnOne").click(function(){
        $(".m_classTchMask").fadeOut();
    });
    //查看班主任分组
    function i_ClassTeacherGroup(){
        classid = store.get('NowClassId');
        $.ajax({
            type: "post",
            url: "/web/teacher/class/group/useHeader",
            data: {classId:classid},
            dataType: "json",
            success: function (data){
                if(data.retCode.substr(0, 1)==0){
                    GetGroupList();
                }
            }
        })
    }
    CopyInvite();
    /*复制邀请函信息*/
    function CopyInvite(){
        // 定义一个新的复制对象
        var clip = new ZeroClipboard( document.getElementById("c_CopyBtn"), {
            moviePath: "../../static/plugin/ZeroClipboard/ZeroClipboard.swf"
        } );
        // 复制内容到剪贴板成功后的操作
        clip.on( 'complete', function(client, args) {
            $('#c_ErrorMsg').html('复制成功').fadeIn(200);
            Disappear("#c_ErrorMsg");
            $('#c_Invitedmain').fadeOut(250);
        } );
        $("#c_closeI").click(function(){
            $("#c_Invitedmain").fadeOut();
        })
    }
});
CheckBrower();

