/****************************************Created by 徐扬 on 2016/12/6.*****************************************/
/*****************************************期刊***********************************************/
GetHtml("../../model/common/common.txt","#Header");
document.body.onselectstart=document.body.oncontextmenu=function(){ return false;}//禁止复制
CheckBrower();
//公共样式
getCss();
SystemRedMsg();
function getCss(){
    $.ajax({
        type:"post",
        url:"/web/common/commonStyle",
        dataType:"json",
        success:function(data){
            if(data.retCode == "0000"){
                var retData = data.retData;
                $("head").append(retData);
            }
        },
        error:function(e){
            console.log(e)
        }
    })
}
/*获取栏目*/
function GetPart() {
    var SubData={};
    SubData.menuid=store.get('menuId');
    $.ajax({
        "type": "post",
        "url": "/web/common/catalogartacle",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            console.log(data)
            var AllData=data.retData[0];
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                IsFirstShow(AllData.childrens[AllData.childrens.length-1]);
                GetArtInfoList(AllData.childrens.length,AllData.childrens);
            }
        }
    });
};
GetPart();
/*获取期刊封面*/
function GetImg(a,b,c){
    var $ImgSrc='';
    var ImgData={};
    ImgData.objectKey=a;
    ImgData.bucketName=b;
    ImgData.expirationInSeconds=-1;
    $.ajax({
        "type": "post",
        "url": "/web/common/baidudownload",
        "data": ImgData,
        success: function (data) {
            $ImgSrc= data;
            $('#img_'+c).attr('src',$ImgSrc);
        }
    });
};
/*保存期刊目录文章的id与名称*/
function SaveArtInfo(){
    var ArtTitle={};
    var TitleId=[];
    var TitleName=[];
    for(var k=0;k<$('#c_MenuList li').length;k++){
        TitleId.push($('#c_MenuList li').eq(k).find('.c_ThisId').html());
        TitleName.push($('#c_MenuList li').eq(k).find('.c_Title').html());
    }
    ArtTitle.ArtId=TitleId;
    ArtTitle.ArtName=TitleName;
    store.set('ArtTitle',ArtTitle);
};
/*获取最新的一期期刊展示*/
function IsFirstShow(data){
    var $FirstInfo='';
    $FirstInfo+='<img src="" alt="加载中" class="fl w100" id=img_'+'New'+'>';
    GetImg(data.objectKey,data.bucketName,'New')
    $FirstInfo+='<div class="c_MenuShow" id="c_MenuShow">';
    $FirstInfo+='<div class="c_MenuTopInfo" id="c_MenuTopInfo">';
    $FirstInfo+='<p class="fl w100 fs18" id="ArtTime">'+data.updateTime+'</p>';
    $FirstInfo+='<p class="fl w100 fs18" id="ArtName">'+data.title+'</p>';
    $FirstInfo+='<p class="fl w100 fc65 fs30 mt35">目录</p>';
    $FirstInfo+='<p class="c_BucketName dino">'+data.bucketName+'</p>';
    $FirstInfo+='<p class="c_ObjectKey dino">'+data.objectKey+'</p>';
    $FirstInfo+='</div>';
    $FirstInfo+='<ul class="c_MenuList" id="c_MenuList">';
    for(var i=0;i<data.resList.length;i++){
        $FirstInfo+='<li><i class="guosprite c_timeico"></i><a target="_blank" href="chinese_article.html?id='+data.resList[i].id+' " title="'+data.resList[i].title+'" class="fs18 fc33 c_Title">'+data.resList[i].title+'</a><span class="c_ThisId dino">'+data.resList[i].id+'</span></li>';
    }
    $FirstInfo+='</ul>';
    $FirstInfo+='</div>';
    $('#c_MagLeft').html($FirstInfo).hover(function(){
        $('#c_MenuShow').stop().animate({'left':'0'})
    },function(){$('#c_MenuShow').stop().animate({'left':'-350px'})});
    CheckedArtList()
};
/*获取往期期刊列表*/
function GetArtInfoList(length,data){
    var $Maghtml='';var img_='';
    for(var j=length-1;j>-1;j--) {
        $Maghtml+='<li>';
        $Maghtml+='<img src="" alt="加载中" class="fl w100 GetImg" id=img_'+j+'>';
        GetImg(data[j].objectKey,data[j].bucketName,j);
        $Maghtml+='<div class="ArtInfo dino">';
        $Maghtml+='<p class="fl w100 fs18">'+data[j].updateTime+'</p>';
        $Maghtml+='<p class="fl w100 fs18">'+data[j].title+'</p>';
        $Maghtml+='<p class="fl w100 fc65 fs30 mt35">目录</p>';
        $Maghtml+='<p class="c_BucketName dino">'+data[j].bucketName+'</p>';
        $Maghtml+='<p class="c_ObjectKey dino">'+data[j].objectKey+'</p>';
        $Maghtml+='</div>';
        $Maghtml+='<ul class="Small dino fl">';
        for(var i=0;i<data[j].resList.length;i++){
            $Maghtml+='<li><i class="guosprite c_timeico"></i><a target="_blank" href="chinese_article.html?id='+data[j].resList[i].id+'"   title="'+data[j].resList[i].title+'" class="fs18 fc33 c_Title">'+data[j].resList[i].title+'</a><span class="c_ThisId dino">'+data[j].resList[i].id+'</span></li>';
        }
        $Maghtml+='</ul>';
        $Maghtml+='</li>';
    };
    $('#c_SmallMag').html($Maghtml);
    $('#c_SmallMag li').eq(0).removeClass().addClass('c_Shadow');
    CheckedArtList();
};
/*选中期刊*/
function CheckedArtList(){
    $('#c_SmallMag li').on('click',function(){
        $('#c_MenuList').html($(this).find('.Small').html());
        $('#c_MenuTopInfo').html($(this).find('.ArtInfo').html());
        $('#img_New').attr('src',$(this).find('img').attr('src'));
        $(this).removeClass().addClass('c_Shadow');
        $(this).siblings().removeClass();
        $('.c_Title').on('click',function(){
            SaveArtInfo();
            window.location.href='chinese_magazine.html?id='+$(this).find('.c_ThisId ').html()+'';

        });
    })
};
/*期刊切换*/
function IsArtListUpOrDown(){
    var Inheight=Math.ceil($('#c_SmallBox ul').height()/690);
    var IsUpDownNum=0;
    if(Inheight>1){
        $('#c_IsUpDown').css('display','block');
    }
    else {
        $('#c_IsUpDown').css('display','none');
    }
    $('#c_DownBtn').on('click',function(){
        IsUpDownNum++;if(IsUpDownNum>=Inheight){IsUpDownNum=Inheight-1;}
        $("#c_SmallBox").stop().animate({ scrollTop: IsUpDownNum*690}, 500);
    })
    $('#c_UpBtn').on('click',function(){
        IsUpDownNum--;if(IsUpDownNum<=0){IsUpDownNum=0;}
        $("#c_SmallBox").stop().animate({ scrollTop: IsUpDownNum*690}, 500);
    })
}
IsArtListUpOrDown();

