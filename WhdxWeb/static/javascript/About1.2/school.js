/********************************************校园合作**Created by Echonessy on 2017/6/1.****************************************************/
ShowWeixinCode();
/********************************************获取地区******************************************************/
$('.NavLogo').click(function(){
    window.location.href='/index.html';
})
ComOpration();
function ComOpration() {
    document.addEventListener('click',function(e){
        if(e.target.className.indexOf("AreaBox")==-1){
            $(".AreaList").slideUp();
        }
    });
    $('.AreaBox').on('click',function(e){
        stopBubble(e);
        $(this).find('.AreaList').slideToggle(150);
        $(this).siblings().find('.AreaList').slideUp(150);
    });
}
//判断对象是否为空
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
};
//获取省份
GetProvince()
function GetProvince(){
    $.ajax({
        "type":"post",
        "url":"/web/common/area?parentId=100000",
        "dataType":"json",
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                CreatProvince(AllData);
            }
        }
    });
};
//创建省
function CreatProvince(data) {
    var $areahtml='';
    for(var i=0;i<data.length;i++){
        $areahtml+='<li title="'+data[i].name+'" data-Id="'+data[i].id+'">'+data[i].name+'</li>'
    }
    $('#ProVince').html($areahtml);//省份列表
    var DefultId=data[0].id;
    $('#ProVinceCon').html(data[0].name).attr('data-Id',DefultId);
    ProOpration(DefultId);
};
//省份操作
function ProOpration(DefultId) {
    GetCity(DefultId);
    $('#ProVince li').off('click');
    $('#ProVince li').on('click',function(){
        var Id=$(this).attr('data-Id');
        $('#ProVinceCon').html($(this).html()).attr('data-Id',Id);
        GetCity(Id);
    });
};
// 获取城市
function GetCity(parentId){
    var subData = {};
    /*根据省份匹配城市*/
    subData.parentId=parentId;
    /*获取城市*/
    $.ajax({
        "type":"post",
        "url":"/web/common/area",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                CreatCity(AllData);
            }
        }
    });
};
//创建城市
function CreatCity(data) {
    var $cityhtml='';
    for(var i=0;i<data.length;i++){
        $cityhtml+='<li  data-Id="'+data[i].id+'">'+data[i].name+'</li>';
    }
    $('#CityList').html($cityhtml);
    var DefultId=data[0].id;
    $('#CityCon').html(data[0].name).attr('data-Id',DefultId);
    CityOpration(DefultId);
};
//城市操作
function CityOpration(DefultId) {
    GetCounty(DefultId);
    $('#CityList li').off('click');
    $('#CityList li').on('click',function(){
        var Id=$(this).attr('data-Id');
        $('#CityCon').html($(this).html()).attr('data-Id',Id);
        GetCounty(Id);
    });
};
//获取县区
function GetCounty(parentId){
    var subData = {};
    /*根据城市匹配县区*/
    subData.parentId=parentId;
    $.ajax({
        "type":"post",
        "url":"/web/common/area",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var AllData=data.retData;
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            if(codenum==0){
                CreatContry(AllData);
            }
        }
    });
};
//创建县区
function CreatContry(data) {
    var $countyhtml='';
    if(!isEmptyObject(data)){
        $('#Contry').css('display','block');
        for(var i=0;i<data.length;i++){
            $countyhtml+='<li data-Id="'+data[i].id+'">'+data[i].name+'</li>';
        }
        $('#ContryList').html($countyhtml);
        var DefultId=data[0].id;
        $('#ContryCon').html(data[0].name).attr('data-Id',DefultId);
        ContryOpration();
    }else {
        $('#Contry').css('display','none');
    }
};
//正常的县区操作
function ContryOpration(DefultId) {
    $('#ContryList li').off('click')
    $('#ContryList li').on('click',function(){
        var Id=$(this).attr('data-Id');
        $('#ContryCon').html($(this).html()).attr('data-Id',Id);
    });
};
//数据提交
$(".SubBtn").on("click",function(){
    company();
})
function company(){
    var ProVinceCon = $("#ProVinceCon").attr("data-id");
    var CityCon = $("#CityCon").attr("data-id");
    var ContryCon = $("#ContryCon").attr("data-id");
    var countyId = ProVinceCon+"|"+CityCon+"|"+ContryCon;
    var countyId = JSON.stringify(countyId);
    console.log(countyId);
    var subData = $(".subData");
    var userBusinessPartersRes = {};
    userBusinessPartersRes.countyId = countyId;
    userBusinessPartersRes.type = "2";
    var is = true;
    subData.each(function(){
        var data_name = $(this).attr("data-name");
        var value = $(this).val();
        userBusinessPartersRes[data_name] = value;
        //没有填写的内容变红
        if(value == ""){
            $(this).focus();
            $(this).css("border","1px solid #e41414")
            is = false;
            return false;
        }
    })
    if(is == false){
        return false;
    }
    var parmas = JSON.stringify(userBusinessPartersRes);
    $.ajax({
        type : "post",
        url : "/web/common/bottom/addBusinessParters",
        data : parmas,
        dataType : "json",
        async : false,
        contentType: "application/json;charset=utf-8",
        success : function(data){
            console.log(data)
            if(data.retCode == "0000"){
                $('#c_ErrorMsg').html('提交成功!').fadeIn(200);  Disappear("#c_ErrorMsg");
                //subData.val("");
            }
        },
        error : function(e){
            console.log(e)
        }
    })
}
//没有填写的内容
$(".subData").blur(function(){
    var value = $(this).val();
    if(value != ""){
        $(this).css("border","1px solid #ccc");
        $(this).parent("li").find(".subData").css("border","1px solid #ccc");
    }
})
