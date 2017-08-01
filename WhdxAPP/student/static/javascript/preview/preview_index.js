/**
 * Created by lgr on 2017/5/3.
 */
//获取题目
GetQuestion();
function GetQuestion(){
    var SubData={};
    SubData.id=Request.id;
    SubData.uuid =Request.uuid;
    $.ajax({
        type : "post",
        url : "/api/student/homework/report/getUserPaperReport",
        data: SubData,
        dataType: "json",
        success: function (data) {
            console.log(data)
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                $("title").text(data.retData.previewInfo.testTitle);
                SelectOption(AllData.previewInfo.questionList);//预习测试
                //Guid(AllData.baseInfo.questionList)//导学案
                JustWrong();
            }
        },
        error : function(e){
            console.log(e)
        }
    });
};
//创建题号预习测试
function SelectOption(data){
    var $Select='';
    var $Other='';
    for(var i=0;i<data.length;i++){
        if(data[i].groupCode==null){
            var result=data[i].paperUserAnswer.result;
            var lnOrder=data[i].lnOrder;
            var selectableType=data[i].selectableType;
            if(selectableType==1){
                if(result==1){
                    $Select+='<li class="Com_Nav r_OptionWrong">'+(i+1)+'</li>';
                }else if(result==0){
                    $Select+='<li class="Com_Nav r_OptionRight">'+(i+1)+'</li>';
                }else {
                    $Select+='<li class="Com_Nav r_OptionNo">'+(i+1)+'</li>';
                }
            }else {
                if(result==1){
                    $Other+='<li class="Com_Nav r_OptionWrong">'+(i+1)+'</li>';
                }else if(result==0){
                    $Other+='<li class="Com_Nav r_OptionRight">'+(i+1)+'</li>';
                }else {
                    $Other+='<li class="Com_Nav r_OptionNo">'+(i+1)+'</li>';
                }
            }
        }
    }
    $('#r_OptionList1').html($Select)
};
//导学案
function Guid(data){
    var $Select='';
    var $Other='';
    for(var i=0;i<data.length;i++){
        if(data[i].groupCode==null){
            var result=data[i].paperUserAnswer.result;
            var lnOrder=data[i].lnOrder;
            var selectableType=data[i].selectableType;
            if(selectableType==1){
                if(result==1){
                    $Select+='<li class="Com_Nav r_OptionWrong">'+(i+1)+'</li>';
                }else if(result==0){
                    $Select+='<li class="Com_Nav r_OptionRight">'+(i+1)+'</li>';
                }else {
                    $Select+='<li class="Com_Nav r_OptionNo">'+(i+1)+'</li>';
                }
            }else {
                if(result==1){
                    $Other+='<li class="Com_Nav r_OptionWrong">'+(i+1)+'</li>';
                }else if(result==0){
                    $Other+='<li class="Com_Nav r_OptionRight">'+(i+1)+'</li>';
                }else {
                    $Other+='<li class="Com_Nav r_OptionNo">'+(i+1)+'</li>';
                }
            }
        }
    }
    $('#r_OptionList0').html($Select)
};
//只看错题
function JustWrong(){
    $('#r_LookWrong0').on('click',function(){
        if($(this).hasClass('just')){
            $('.r_SelectBox li').css('display','block');
            $(this).removeClass('just').attr('src','../../static/image/report/wrongico.png');
        }else {
            $('.r_SelectBox li').css('display','none');

            $('.r_SelectBox .r_OptionWrong').css('display','block');
            $('.r_SelectBox .r_OptionHalf').css('display','block');
            $('.r_InTro li').css('display','block');
            $(this).removeClass('just').addClass('just').attr('src','../../static/image/report/kolaico.png');
        }
    });
    $('.Com_Nav').on('click',function(){
        var index=$(this).html()-1;
        if($('#r_LookWrong0').hasClass('just')){
            window.location.href='preview.html?LookWrong='+true+'&id='+Request.id+'&index='+index+'&uuid='+Request.uuid;
        }else {
            window.location.href='preview.html?LookWrong='+false+'&id='+Request.id+'&index='+index+'&uuid='+Request.uuid;
        }
    })
};
