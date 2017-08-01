/********************************************个人中心班级详情By徐扬**********************************************/
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
//用户操作
StudentOpration();
function StudentOpration(){
    $('#m_ClassName').html(decodeURI(decodeURI(encodeURI(Request.ClassName))));
    //关闭退出班级
    $('#m_CloseQuit,#m_IsQuitBtn1').on('click',function(){
        $('#m_QuitClassBox').fadeOut(150)
    });
    //打开退出班级
    $('#m_QuitClassBtn').on('click',function(){
        $('#m_QuitClassBox').fadeIn(150)
    });
    $('#m_IsQuitBtn0').on('click',function(){
        StudentQuitClass();
    })
    $('#m_ClassCode').html(Request.classCode)
};
//教师列表切换
function TeacherListTurn(){
    var totalSize = $('#m_TeacherMain li').size();//获取总数据
    var scrollWidth;//通过判断浏览器的宽度决定课件容器的宽度
    var pageSize;
    var totalPage ;//计算总页数
    //检测屏幕
    setInterval(function(){
        if(currentPage==1){
            $('.m_ListBtnL').css('color','#999');
        }else {
            $('.m_ListBtnL').css('color','');
        }
        if(currentPage==totalPage){
            $('.m_ListBtnR').css('color','#999');
        }else {
            $('.m_ListBtnR').css('color','');
        }
        if(document.body.offsetWidth<1366){
            scrollWidth=555;
            pageSize = 3;//每页显示4条数据
            totalPage = Math.ceil(totalSize / pageSize);//计算总页数
        }else if(document.body.offsetWidth<1600&&document.body.offsetWidth>1366){
            scrollWidth=625;
            pageSize = 4;//每页显示4条数据
            totalPage = Math.ceil(totalSize / pageSize);//计算总页数
        }else {
            scrollWidth=760;
            pageSize = 4;//每页显示4条数据
            totalPage = Math.ceil(totalSize / pageSize);//计算总页数
        }
    },1)

    var currentPage = 1;//当前为第一页
    if(totalSize>4){
        $('.m_ListBtnL,.m_ListBtnR').show();
        /*单击向右的箭头*/
        $('.m_ListBtnR').click(function(){
            if(currentPage==totalPage){
                return false;
            }else {
                $('#m_TeacherMain').animate({left:currentPage*-scrollWidth},200);
                currentPage++;
            }
        });
        /*单击向左的箭头*/
        $('.m_ListBtnL').click(function(){
            if(currentPage==1){
                return false;
            }else {
                currentPage--;
                $('#m_TeacherMain').animate({left:((currentPage-1)*-scrollWidth)},200)
            }
        })
    }
    else {
        $('.m_ListBtnL,.m_ListBtnR').css('display','none');
    }
};
//获取教师列表
GetTeacherList();
function GetTeacherList(){
    var SubData={};
    SubData.classId=Request.classId;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/getClassTearcher",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatTeacherList(AllData)
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
//创建教师列表
function CreatTeacherList(data){
    var $HeadTeacher='';//班主任
    var $OtherTeacher='';//非班主任
    for(var i=0;i<data.length;i++){
        if(data[i].teacherHeader==1||data[i].teacherHeader=='1'){
            if(data[i].teacherImage==''||data[i].teacherImage==null){
                $HeadTeacher+='<p class="m_TeacherInfo"><img src="../../static/image/common/user.png" alt="" class="m_TeacherPhoto"></p>';
            }else {
                $HeadTeacher+='<p class="m_TeacherInfo" ><img src="'+data[i].teacherImage+'" alt="" class="m_TeacherPhoto"></p>';
            }
            $HeadTeacher+='<p class="m_IsHeader">班主任</p>';
            $HeadTeacher+='<p class="m_ClassInfo" data-teacherId="'+data[i].teacherId+'"><span class="m_TeacherSub" title="'+data[i].subjectName+'">'+data[i].subjectName+'</span><span class="m_TeacherName" title="'+data[i].teacherName+'">'+data[i].teacherName+'</span></p>';
        }else {
            $OtherTeacher+='<li>';
            if(data[i].teacherImage==''||data[i].teacherImage==null){
                $OtherTeacher+='<p class="m_TeacherInfo"><img src="../../static/image/common/user.png" alt="" class="m_TeacherPhoto"></p>';
            }else {
                $OtherTeacher+='<p class="m_TeacherInfo"><img src="'+data[i].teacherImage+'" alt="" class="m_TeacherPhoto"></p>';
            }
            $OtherTeacher+='<p class="m_ClassInfo" data-teacherId="'+data[i].teacherId+'"><span class="m_TeacherSub" title="'+data[i].subjectName+'">'+data[i].subjectName+'</span><span class="m_TeacherName" title="'+data[i].teacherName+'">'+data[i].teacherName+'</span></p>';
            $OtherTeacher+='</li>';
        }
    }
    $('#m_HeadTeacherL').html($HeadTeacher);
    $('#m_TeacherMain').html($OtherTeacher);
    TeacherListTurn();//教师列表切换
};
//获取学生详情
GetStudentList();
function GetStudentList(){
    var SubData={};
    SubData.classId=Request.classId;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/getClassStudent",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreatStudentList(AllData)
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
//创建学生详情
function CreatStudentList(data){
    var $StudentHtml='';
    if(data.length>0){
        for(var i=0;i<data.length;i++){
            $StudentHtml+='<li data-sutdentId="'+data[i].sutdentId+'">';
            $StudentHtml+='<span>'+data[i].sutdentName+'</span>';
            $StudentHtml+='<span>手机：'+data[i].studentMobile+'</span>';
            $StudentHtml+='</li>';
        }
    }else {
            $StudentHtml='<li class="m_NoClassMata">暂无同学信息~</li>';
    }
    $('#m_ClassMateList').html($StudentHtml);
};
//学生退出班级
function StudentQuitClass(){
    var SubData={};
    SubData.classId=Request.classId;
    $.ajax({
        "type": "post",
        "url": "/web/student/center/exitClass",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                $('#c_ErrorMsg').html('退出成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                $('#m_QuitClassBox').fadeIn(100);
                setTimeout(function(){
                    window.location.href='me_index.html'
                },1500)
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
}








