/****************************************Created by 徐扬 on 2016/12/7.*****************************************/
/********************************************获取导航***********************************************/
GetHtml("../../model/common/common.txt","#Header");
SystemRedMsg();
CheckBrower();
/*获取栏目*/
function GetPart(){
    var SubData={};
    SubData.menuid=store.get('menuId');
    $.ajax({
        "type": "post",
        "url": "/web/common/catalogartacle",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData[0].childrens;
            console.log(AllData)
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                CreatList(AllData)
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
/*创建html*/
function CreatList(data){
    var $content='';
    for(var i=0;i<data.length;i++){
        $content+='<div class="a_Unit">';
        $content+='<h1 class="a_UnitTit">'+data[i].title+'</h1>';
        $content+='<p class="a_UnitImg">';
        $content+='<img src="../../../static/image/sprite/load.gif" alt="" class="" id=img_'+i+'>';
        GetImg(data[i].objectKey,data[i].bucketName,i);
        $content+='</p>';
        $content+='<ul class="a_UnitArt">';
        for(var j=0;j<data[i].resList.length;j++){
            $content+='<li>';
            $content+='<a class="a_Title" href="../../../model/acrossenglish/acrossenglish_voice.html?id='+data[i].resList[j].id+'" title="'+data[i].resList[j].title+'" >';
            $content+='<span class="name">'+data[i].resList[j].title+'</span>';
            $content+='<span class="dino id">'+data[i].resList[j].id+'</span>';
            $content+='</a>';
            $content+='</li>';
        }
        $content+='</ul>';
        $content+='</div>';
    }
    $('#c_Content').html($content);
    ArtOnclick();
};
/*创建文章列表数组*/
function CreatArtArr(a){
    var ArtTitle={};
    var TitleId=[];
    var TitleName=[];
    var title=a;
    for(var k=0;k<title.length;k++){
        TitleId.push(title.eq(k).find('.id').html());
        TitleName.push(title.eq(k).find('.name').html());
    }
    ArtTitle.ArtId=TitleId;
    ArtTitle.ArtName=TitleName;
    store.set('ArtTitle',ArtTitle);
};
/*文章列表点击*/
function ArtOnclick(){
    $('.a_Title').on('click',function(){
        CreatArtArr( $(this).parents('.a_UnitArt').find('a'))
        window.location.href='chinese_index.html?id='+$(this).find('.id ').html()+'';
    });
};