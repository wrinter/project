/****************************************Created by 徐扬 on 2016/12/6.*****************************************/
/*************************************获取导航**********************************/
GetHtml("../../model/common/common.txt","#Header");

function GetUserGradeId(){
    $.ajax({
        "type":"post",
        "url":"/web/teacher/class/current/grade",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1));
           if(codenum==0){
               var index=parseInt(data.retData);
               if(index==9){ $('#c_TabT li').eq(0).click()}
               if(index==8){ $('#c_TabT li').eq(1).click()}
               if(index==7){ $('#c_TabT li').eq(2).click()}
           }
        }
    })
}

/*检测解散班级是否成功*/
var timeClear=setInterval(function(){
    if(store.get('Isclear')==1){
        $('#c_ErrorMsg').html('解散成功').fadeIn(200);
        Disappear("#c_ErrorMsg");
        clearInterval(timeClear);
        store.set("Isclear","0");
    }
},1);
/*创建班级数据重置*/
function DataReset(){
    /*重置*/
    $('#c_GradeList').html('');
    $('.s_Choimg').removeClass('i_slcico1').addClass('i_slcico0');
    $('#c_SchoolEnsure').css('background','#999999');
    $('.arealist').css('display','none');
    $('.creatReset').css('display','none');
    $('#c_ProvinceCon').html('选择省');
    $('#c_CityCon').html('选择市');
    $('#c_CountyCon').html('选择区/县');
    $('#c_SchoolCon').html('选择学校');
    $('#c_CityList').html('<li>请先选择省</li>');
    $('#c_CountyList').html('<li>请先选择城市</li>');
    $('#c_CountyList').html('<li>请先选择地区</li>');
}
/*创建班级封装*/
function IsSetSchoool(){
    DataReset();
    /*判断用户是否含有学校资料*/
    $.ajax({
        "type":"post",
        "url":"/web/teacher/class/check/school",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1));
            if(codenum==3){
                $('#c_CreatSChool').css("display",'block');
            }
            else {
                $('#c_CreatGrade').css("display",'block');
            }
        }
    })
};
/*地区选择下拉*/
$('.c_AreaSelect').on('click',function(e){
    stopBubble(e)
    $(this).find('.arealist').slideToggle(150);
    $(this).siblings().find('.arealist').slideUp(150);
});
document.addEventListener('click',function(e){
    if(e.target.className.indexOf("m_AreaSelect")==-1){
        $(".arealist").slideUp();
    }
});
GetProvince();
/*获取省份*/
function GetProvince(){
    $.ajax({
        "type":"post",
        "url":"/web/common/area?parentId=100000",
        "dataType":"json",
        success:function(data){
            var $areahtml='';
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                for(var i=0;i<data.retData.length;i++){
                    $areahtml+='<li>' +
                        '<span class="areaname">'+data.retData[i].name+'</span>' +
                        '<span class="areaparentId dino">'+data.retData[i].parentId+'</span>' +
                        '<span class="areaId dino">'+data.retData[i].id+'</span>' +
                        '<span class="areacode dino">'+data.retData[i].code+'</span>' +
                        '<span class="areatype dino">'+data.retData[i].type+'</span>' +
                        '</li>'
                }
                /*省份列表*/
                $('#c_ProvinceList').html($areahtml);
                /*省份选择*/
                $('#c_ProvinceList li').on('click',function(){
                    /*省份的选中展示*/
                    $('#c_ProvinceCon').html($(this).html());
                    /*重置：每次选择省，清空市和县*/
                    $('#c_CityCon').html('选择市');
                    $('#c_CountyCon').html('选择区/县');
                    $('#c_SchoolCon').html('选择学校');
                    $('#c_CityList').html('<li>请先选择省</li>');
                    $('#c_CountyList').html('<li>请先选择城市</li>');
                    $('#c_CountyList').html('<li>请先选择地区</li>');
                    /*省份选择完毕后再选择市*/
                    GetCity();
                });
            }
        }
    });
};
/*获取城市*/
function GetCity(){
    var subData = {};
    /*根据省份匹配城市*/
    subData.parentId=$('#c_ProvinceCon .areaId').html();
    /*获取城市*/
    $.ajax({
        "type":"post",
        "url":"/web/common/area",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var $cityhtml='';
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                for(var i=0;i<data.retData.length;i++){
                    $cityhtml+='<li>' +
                        '<span class="areaname">'+data.retData[i].name+'</span>' +
                        '<span class="areaparentId dino">'+data.retData[i].parentId+'</span>' +
                        '<span class="areaId dino">'+data.retData[i].id+'</span>' +
                        '<span class="areacode dino">'+data.retData[i].code+'</span>' +
                        '<span class="areatype dino">'+data.retData[i].type+'</span>' +
                        '</li>'
                }
                $('#c_CityList').html($cityhtml);
                $('#c_CityList li').on('click',function(){
                    /*城市的选中展示*/
                    $('#c_CityCon').html($(this).html());
                    /*每次选择市，清空县*/
                    $('#c_CountyCon').html('选择区/县');
                    /*城市选择完毕后再选择县区*/
                    GetCounty();
                });
            }
        }
    });
};
/*获取县区*/
function GetCounty(){
    var subData = {};
    /*根据城市匹配县区*/
    subData.parentId=$('#c_CityCon .areaId').html();
    $.ajax({
        "type":"post",
        "url":"/web/common/area",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var $countyhtml='';
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                for(var i=0;i<data.retData.length;i++){
                    $countyhtml+='<li>' +
                        '<span class="areaname">'+data.retData[i].name+'</span>' +
                        '<span class="areaparentId dino">'+data.retData[i].parentId+'</span>' +
                        '<span class="areaId dino">'+data.retData[i].id+'</span>' +
                        '<span class="areacode dino">'+data.retData[i].code+'</span>' +
                        '<span class="areatype dino">'+data.retData[i].type+'</span>' +
                        '</li>'
                }
                $('#c_CountyList').html($countyhtml);
                $('#c_CountyList li').on('click',function(){
                    /*城市的选中展示*/
                    $('#c_CountyCon').html($(this).html());
                    GetSchool();
                });
            }
        }
    });
};
/*获取学校*/
function GetSchool(){
    /*学校选择*/
    var subData = {};
    /*省份ID*/
    subData.provinceId=$('#c_ProvinceCon .areaId').html();
    /*城市ID*/
    subData.cityId=$('#c_CityCon .areaId').html();
    /*区县ID*/
    subData.countyId=$('#c_CountyCon .areaId').html();
    $.ajax({
        "type":"post",
        "url":"/web/common/school",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var $schoolhtml='';
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                if(data.retData.length>0){
                    for(var i=0;i<data.retData.length;i++){
                        $schoolhtml+='<li>' +
                            '<span class="schoolName">'+data.retData[i].schoolName+'</span>' +
                            '<span class="allAddress dino">'+data.retData[i].allAddress+'</span>' +
                            '<span class="cityId dino">'+data.retData[i].cityId+'</span>' +
                            '<span class="countyId dino">'+data.retData[i].countyId+'</span>' +
                            '<span class="delFlag dino">'+data.retData[i].delFlag+'</span>' +
                            '<span class="id dino">'+data.retData[i].id+'</span>' +
                            '<span class="lengthSchool dino">'+data.retData[i].lengthSchool+'</span>' +
                            '<span class="provinceId dino">'+data.retData[i].provinceId+'</span>' +
                            '<span class="schoolType dino">'+data.retData[i].schoolType+'</span>' +
                            '</li>'
                    }
                    $('#c_SchoolList').html($schoolhtml);
                    var subData = {};
                    $('#c_SchoolList li').on('click',function(){
                        /*城市的选中展示*/
                        $('#c_SchoolCon').html($(this).html());
                        if($('#c_SchoolCon').html()!='选择学校'){
                            $('#c_SchoolEnsure').css('background','#58C1E4');
                        }
                        /*记录学校ID*/
                        subData.schoolId=$('#c_SchoolCon .id').html();
                    });
                    $('#c_SchoolEnsure').on('click',function(){
                        $.ajax({
                            "type":"post",
                            "url":"/web/teacher/class/school",
                            "dataType":"json",
                            "data":subData,
                            success:function(data){
                                console.log(data)
                                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                                if(codenum==0){
                                    $('#c_CreatSChool').css('display','none');
                                    $('#c_CreatGrade').css('display','block');

                                }
                            }
                        })
                    });
                }
            }
        }
    });
};
/*显示创建班级*/
FadeIn('#CreatClass0',"#c_CreatClass");
FadeIn('#CreatClass1',"#c_CreatClass");
$('#CreatClass0').on('click',function(){
    /*根据用户是否已经填写学校信息来判断是否在创建班级管理时显示*/
    IsSetSchoool();
    GetUserGradeId();
});
$('#CreatClass1').on('click',function(){
    /*根据用户是否已经填写学校信息来判断是否在创建班级管理时显示*/
    IsSetSchoool();
    GetUserGradeId();
});
/*提示信息自动隐藏*/
function Disappear(a){
    if($(a).css('display')=='block'){
        setTimeout(function(){$(a).fadeOut(1000,function(){$(a).css('width','355px')})},2000);
    }
};
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
        $('#c_CreatClass').fadeOut(250);
    } );
};
CopyInvite();
/*收起/更多*/
var isup=true;//默认收起状态
$('.c_More').on('click',function(){
    $(this).siblings('.c_ClassChoice').eq(1).slideToggle();
    if(isup){
        $(this).find('i').css({'animation':'change 0.3s linear 1 forwards'});
        $(this).find('span').html('收起');
        isup=false;
    }
    else {
        $(this).find('i').css({'animation':''});
        $(this).find('span').html('更多');
        isup=true;
    }
});
/*创建班列表封装*/
function creatclass(i,n,a){
    var $html='';
    for(i;i<n+1;i++) {
        $html+='<li><i class="spriteImg i_slcico0 fl s_Choimg"></i><span class="c_ClassNum">'+i+'班</span><i class="dischoice dino"></i></li>'
    }
    $(a).html($html);
}
/*创建的班*/
for(var i=7;i<10;i++){
    creatclass(1,16,'#c_Class'+i);
    creatclass(17,50,'#c_Classmore'+i);
}
/*选择框按钮样式以及选择班级*/
var $GradeHtml='';
var IsCanCreat=0;
var  cannum=0;
IsCanNum();
function IsCanNum(){
    $.ajax({
        "type":"post",
        "url":"/web/teacher/class/exist",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1));
            if(codenum==0){
                cannum=data.retData.length;
                IsDefultClass(data);
            }
        }
    });
};
//用户默认班级
function IsDefultClass(data){
    for(var i=0;i<data.retData.length;i++){
        for(var k=0;k<$('#c_TabT li').length;k++){
            var gradeId=$('#c_TabT li').eq(k).find('.gradeId').html();
            if(data.retData[i].gradeId==gradeId){
                for(var j=0;j<$('.c_TabMain').eq(k).find('li').length;j++){
                    var c_ClassNum=$('.c_ClassNum').eq(j).html();
                    if(data.retData[i].classNickname==c_ClassNum){
                        var Pindex=k;
                        $('.c_TabMain').eq(Pindex).find('li').eq(j).find('.dischoice').css('display','block')
                    }
                }
            }
        }
    }
};
$('.s_Choimg').on('click',function(){
    IsCanNum();
    var iscannum=cannum;
    console.log(IsCanCreat)
    console.log(iscannum)
    /*选择*/
    var Pindex=$(this).parent().parent().parent('.c_TabMain').index()-1;
    var Classnum=$(this).siblings('.c_ClassNum').html();
    var Gradenum=$('#c_TabT li').eq(Pindex).find('.c_GradeNum').html();
    var GradeId=$('#c_TabT li').eq(Pindex).find('.gradeId').html();
    if(IsCanCreat<4-iscannum){
        if ($(this).hasClass('i_slcico0')) {
            IsCanCreat++;
            $(this).removeClass('i_slcico0').addClass('i_slcico1');
            $GradeHtml = '<li>' + Gradenum + '<span class="classnum">' + Classnum + '</span><i class="spriteImg c_delclassico c_DelImg"></i><em class="dino gradeId">' + GradeId + '</em></li>';
            $('#c_GradeList').append($GradeHtml);
            /*删除选中的班级*/
            var   Chonum=$('.c_TabMain').eq(Pindex).find('.s_Choimg').length;
            $('.c_DelImg').off('click');
            $('.c_DelImg').on('click',function(){
                var Tindex=$(this).index();
                console.log(Tindex);
                IsCanCreat--;
                if(IsCanCreat<=0){IsCanCreat=0;}
                //console.log(IsCanCreat);
                $(this).parent().remove();
                for(var i=0;i<Chonum;i++){
                    /*通过匹配删除的框内的班级是否与当前的班级相等来进行删除*/
                    if($('.c_ClassNum').eq(i).html()==$(this).siblings('.classnum').html()){
                        $('.c_TabMain').eq(Pindex).find('.s_Choimg').eq(i).removeClass('i_slcico1').addClass('i_slcico0');
                    }
                }
            });
        }
        /*取消选择*/
        else {
            IsCanCreat--;if(IsCanCreat<=0){IsCanCreat=0;}
            /*取消选择后已经选中的班级删除*/
            for(var i=0;i<$('.classnum').length;i++){
                /*通过匹配选中框内的班级是否与当前的班级相等来进行删除*/
                if($('.classnum').eq(i).html()==Classnum){
                    $('#c_GradeList li').eq(i).remove();
                }
            }
            $(this).removeClass('i_slcico1').addClass('i_slcico0');
        }
    }
    else {
        /*取消选择*/
        if ($(this).hasClass('i_slcico1')) {
            IsCanCreat--;if(IsCanCreat<=0){IsCanCreat=0;}
            /*取消选择后已经选中的班级删除*/
            for(var i=0;i<$('.classnum').length;i++){
                /*通过匹配选中框内的班级是否与当前的班级相等来进行删除*/
                if($('.classnum').eq(i).html()==Classnum){
                    $('#c_GradeList li').eq(i).remove();
                }
            }
            $(this).removeClass('i_slcico1').addClass('i_slcico0');
        }
        else {
            $('#c_ErrorMsg').html('每个用户最多只能创建4个班级').fadeIn(200);
            Disappear("#c_ErrorMsg");
        }
        /*删除选中的班级*/
    };
});
/*关闭创建班级*/
FadeOut('#c_closeG','#c_CreatClass');
/*关闭邀请函*/
FadeOut('#c_closeI','#c_CreatClass');
/*关闭学校*/
FadeOut('#c_closeS','#c_CreatClass');
/*选择班级*/
$('.c_TabT li').on('click',function(){
    IsCanCreat=0;
    $('#c_GradeList').html('');
    $('.s_Choimg').removeClass('i_slcico1').addClass('i_slcico0');
    var tabnum=$(this).index();
    $('.c_TabMain').eq(tabnum).css('display','block').siblings('.c_TabMain').css('display','none');
    $('.c_TabMain').eq(tabnum).find('.c_ClassChoice').eq(1).css('display','none');
    $('.c_More').find('span').html('更多');
    isup=true;
    $('.c_More').find('i').css({'animation':''});
    $(this).css({
        "font-size":"24px",
        "color":"#58C1E4",
        "line-height":"60px",
        "background":"#EFFAFD",
        "border":"1px solid #58C1E4",
        "border-bottom":"0"
    }).animate({"top":"10px"},100,function(){$(this).css({"z-index":"6"})});
    $(this).siblings().css({
        "font-size":"20px",
        "color":"#666",
        "line-height":"40px",
        "background":"#F6F6F6",
        "border":"1px solid #CCC",
        "border-bottom":"0",
        "z-index":"4",
        "top":"20px"
    });
});
/*取消创建班级*/
$('#c_closeG').on('click',function(){
    IsCanCreat=0;
    $('#c_GradeList').html('');
});
$('#c_CreatCancel').on('click',function(){
    IsCanCreat=0;
    $('#c_GradeList').html('');
});
FadeOut('#c_CreatCancel','#c_CreatClass');
GetClass();
/*获取班级*/
function GetClass(){
    var $Classhtml='';
    $.ajax({
        "type":"post",
        "url":"/web/teacher/class/list",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                if(data.retData.length>0){
                    $('#c_HasClassMain').css('display','block');
                    $('#NoClassMain').css('display','none');
                    for(var i=0;i<data.retData.length;i++){
                        //创建的班级
                        if(data.retData[i].joinStatus==1){
                            if(data.retData[i].headTeacherId=='1'){
                                $Classhtml+='<li class="CanIn OwnClass">';
                            }else {
                                $Classhtml+='<li class="CanIn">';
                            }

                            if(data.retData[i].headTeacherImage==''||data.retData[i].headTeacherImage==null){
                                $Classhtml+='<p class="c_UserPhoto"><img src="../../static/image/me/user.png" alt="" class="w100 fl"></p>';
                            }
                            else {
                                $Classhtml+='<p class="c_UserPhoto"><img src="'+data.retData[i].headTeacherImage+'" alt="" class="w100 fl"></p>';
                            }
                            $Classhtml+='<p class="c_UserName">'+data.retData[i].headTeacherName+'</p>';
                            $Classhtml+='<p class="headTeacherId dino">'+data.retData[i].headTeacherId+'</p>';
                            $Classhtml+='<p class="c_Grade">'+data.retData[i].gradeName+data.retData[i].className+'</p>';
                            $Classhtml+='<p class="c_Student">学生：<span >'+data.retData[i].studentNum+'</span>人</p>';
                            $Classhtml+='<p class="c_Student">老师：<span >'+data.retData[i].teacherNum+'</span>人</p>';
                            $Classhtml+='<p class="dino gradename">'+data.retData[i].gradeName+'</p>';
                            $Classhtml+='<p class="dino classId">'+data.retData[i].classId+'</p>';
                            $Classhtml+='<input type="button" class="c_InBtn borc65 cup mt55 fc65" value="进入班级">';
                            $Classhtml+='</li>';
                        }
                        if(data.retData[i].joinStatus==2){
                            $Classhtml+='<li>';
                            if(data.retData[i].headTeacherImage==''||data.retData[i].headTeacherImage==null){
                                $Classhtml+='<p class="c_UserPhoto"><img src="../../static/image/me/user.png" alt="" class="w100 fl"></p>';
                            }
                            else {
                                $Classhtml+='<p class="c_UserPhoto"><img src="'+data.retData[i].headTeacherImage+'" alt="" class="w100 fl"></p>';
                            }
                            $Classhtml+='<p class="c_UserName">'+data.retData[i].headTeacherName+'</p>';
                            $Classhtml+='<p class="headTeacherId dino">'+data.retData[i].headTeacherId+'</p>';
                            $Classhtml+='<p class="c_Grade">'+data.retData[i].gradeName+data.retData[i].className+'</p>';
                            $Classhtml+='<p class="c_Student">学生：<span >'+data.retData[i].studentNum+'</span>人</p>';
                            $Classhtml+='<p class="c_Student">老师：<span >'+data.retData[i].teacherNum+'</span>人</p>';
                            $Classhtml+='<p class="dino gradename">'+data.retData[i].gradeName+'</p>';
                            $Classhtml+='<p class="dino classId">'+data.retData[i].classId+'</p>';
                            $Classhtml+='<input type="button" class="c_WaitBtn borcCC cup mt55 fcCA" value="等待ing">';
                            $Classhtml+='</li>';
                        }
                    }
                    $('#c_AllClass').html($Classhtml);
                    /*进入班级保存classid*/
                    $('#c_AllClass li .c_InBtn').on('click',function(){
                        store.set('NowClassId', $(this).siblings('.classId').html());
                        store.set('headTeacherId', $(this).siblings('.headTeacherId').html());
                        store.set('c_Grade', $(this).siblings('.c_Grade').html());
                        window.location.href="../../../model/classmanage/classyem2.html";
                    })
                }
                else {
                    $('#NoClassMain').css('display','block');
                    $('#c_HasClassMain').css('display','none');
                }

            }
        }
    });
};
/*创建班级确定提交*/
$('#c_CreatEnsure').on('click',function(){
    if($('#c_GradeList li').length>0){
        var subData = {};
        var classNamearr=[];
        for(var i=0;i<$('#c_GradeList li').length;i++){
            classNamearr.push($('#c_GradeList li').eq(i).find(".classnum").html())
        }
        subData.className=classNamearr;
        subData.gradeId= $('#c_GradeList li').eq(0).find(".gradeId").html();
        /*提交创建的班级*/
        $.ajax({
            'type':"post",
            'url':"/web/teacher/class/create",
            'data': JSON.stringify(subData),
            'contentType':"application/json;charset=utf-8",
            'dataType':"json",
            success:function(data){
                var codenum =parseInt(data.retCode.substr(0, 1));
                if(codenum==0){
                    IsCanCreat=0;
                    GetClass();
                    IsCanNum();
                    GoldAnimate(data.retGold);
                    $('#c_ErrorMsg').html('创建班级成功').fadeIn(200);Disappear("#c_ErrorMsg");
                    IsCreatResult(data);
                }
                if(codenum==1){
                    $('#c_ErrorMsg').html('服务异常，请重试').fadeIn(200);
                    Disappear("#c_ErrorMsg");
                }
                if(codenum==2){
                    $('#c_ErrorMsg').html('每个用户最大能创建4个班级').fadeIn(200);
                    Disappear("#c_ErrorMsg");
                }
            }
        });
    }
});
/*关闭搜索框*/
FadeOut('#c_closeX','#c_Search');
var seatimer=null;
FadeIn('#JoinClass0',"#c_Search");
FadeIn('#JoinClass1',"#c_Search");
/*检测输入个数，是否可以点击*/
seatimer=setInterval(function(){
    if($("#c_SeaBox").val().length==6){
        $("#c_SbtnX").css("background",'#78CAE5');
    }
    else {
        $("#c_SbtnX").css("background",'');
    }
},1);
$('#JoinClass0').on('click',function(){
    SearchReset();
})
$('#JoinClass1').on('click',function(){
    SearchReset();
})
/*加入班级数据重置*/
function SearchReset(){
    /*重置*/
    $('#c_SearchError').css('display','none');
    $('#c_SeaBox').val('');
    $('#c_SearchClass').html('').css('display','none');
}
/*搜索按钮*/
$("#c_SbtnX").on('click',function(){
    /*数据重置*/
    $('#c_SearchClass').html('').css('display','none');
    $('#c_SearchError').html('').css("display",'none');
    if($("#c_SeaBox").val().length==6){
        var subData = {};
        subData.classCode =$("#c_SeaBox").val();
        $.ajax({
            "type":"post",
            "url":"  /web/teacher/class/search",
            "dataType":"json",
            "data":subData,
            success:function(data){
                $('#c_SearchError').html('').css("display",'none');
                var codenum =parseInt(data.retCode.substr(0, 1)) ;
                if(codenum==0){
                    if(data.retData==null){
                        $('#c_SearchError').html('查无此班，请重新输入').fadeIn(100);
                    }
                    else {
                        if(data.retData.joinStatus=='1'||data.retData.joinStatus==1){
                            $('#c_SearchError').html('已加入此班').css("display",'block');
                        }
                        else {
                            $('#c_SearchError').html('').css("display",'none');
                            CreatJionHtml(data);
                            /*搜索出的班级点击进入*/
                            $('#c_SearchClass .c_SeBtn').one('click',function(){
                                UserJoinClass()
                            })
                        }

                    }
                }
                else {
                    $('#c_SearchError').html('查无此班，请重新输入').css("display",'block');
                }
            }
        });
    }
});
function CreatJionHtml(data){
    var $searchhtml='';
    if(data.retData.headTeacherImage==''||data.retData.headTeacherImage==null){
        $searchhtml+='<p class="c_UserPhoto"><img src="../../static/image/me/user.png" alt="" class="w100 fl"></p>';
    }
    else {
        $searchhtml+='<p class="c_UserPhoto"><img src="'+data.retData.headTeacherImage+'" alt="" class="w100 fl"></p>';
    }
    $searchhtml+='<p class="c_UserName">'+data.retData.headTeacherName+'</p>';
    $searchhtml+='<p class="c_Grade">'+data.retData.className+'</p>';
    $searchhtml+='<p class="c_Student">学生：<span class="studentNum">'+data.retData.studentNum+'</span>人</p>';
    $searchhtml+='<p class="c_Student">老师：<span class="teacherNum">'+data.retData.teacherNum+'</span>人</p>';
    $searchhtml+='<p class="dino gradename">'+data.retData.gradeName+'</p>';
    $searchhtml+='<p class="dino classId">'+data.retData.classId+'</p>';
    if(data.retData.status==null){
        $searchhtml+='<input type="button" class="c_SeBtn  borc65 cup mt55 " value="加入班级">';
    }
    if(data.retData.status=='2'||data.retData.status==2){
        $searchhtml+='<input type="button" class="c_WaitBtn borcCC cup mt55 fcCA" style="clear: both;display: block;margin: 50px auto;" value="等待ing">';
    }
    $('#c_SearchClass').html($searchhtml).fadeIn();
};
function UserJoinClass(){
    var subData = {};
    subData.classId =$('#c_SearchClass').find('.classId').html();
    $.ajax({
        "type":"post",
        "url":"  /web/teacher/class/join",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                $('#c_Search').fadeOut(150);
                $('#c_ErrorMsg').html("申请成功，等待通过").fadeIn(200).css('width','460px');
                Disappear("#c_ErrorMsg");
                GetClass();
            }
            if(codenum==2){
                $('#c_ErrorMsg').html("您已经申请过加入该班或已经进入该班").fadeIn(200).css('width','460px');
                Disappear("#c_ErrorMsg");
                $('#c_Search').fadeOut(150);
            }
            if(codenum==3){
                $('#c_ErrorMsg').html("每位老师最多加入20个班级").fadeIn(200).css('width','460px');
                Disappear("#c_ErrorMsg");
                $('#c_Search').fadeOut(150);
            }
        }
    })
};
CheckBrower();
/***********************************************************/
function IsCreatResult(data){
    if($('#c_GradeList li').length==1){
        var NowClassId=data.retData.indexClassId;
        var headTeacherId=data.retData.headerTeacherId;
        var c_Grade=data.retData.className;
        GetClassinfo(NowClassId,headTeacherId,c_Grade);
        setTimeout(function(){
            window.location.href="../../../model/classmanage/classyem2.html";
        },100)
        $('#c_CreatClass').css('display','none');
    }
    if($('#c_GradeList li').length>1) {
        $('#c_ErrorMsg').html('创建班级成功').fadeIn(200);Disappear("#c_ErrorMsg");
        $('#c_CreatClass').css('display','none');
    }
};
function GetClassinfo(NowClassId,headTeacherId,c_Grade){
    store.set('NowClassId',NowClassId);
    store.set('headTeacherId',headTeacherId);
    store.set('c_Grade',c_Grade);
};



