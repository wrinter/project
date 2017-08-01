/****************************************Created by 徐扬 on 2016/12/6.*****************************************/
/**************************************国学*********************************************/
GetHtml("../../model/common/common.txt","#Header");
SystemRedMsg();
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
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0) {
                $('.noData').hide();
                var AllData=data.retData[0].childrens;
                CreatList(AllData)
            }else if(codenum == 2){
                $('.noData').show();
            }
        }
    });
}
GetPart();
/*适配高度*/
setInterval(function(){
    var lefth=$('.c_Catalogue .c_CataListL').height();
    var righth=$('.c_Catalogue .c_CataListR').height();
    if(lefth>righth){
        $('.c_Catalogue .c_CataListR').height($('.c_Catalogue .c_CataListL').height())
    }
    else {
        $('.c_Catalogue .c_CataListL').height($('.c_Catalogue .c_CataListR').height())
    }

},1);
/*请求图片*/
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
            $('#img_'+c).attr('src',$ImgSrc).addClass('w100');
        }
    });
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
/*创建html*/
function CreatList(data){
    console.log(data);
    var $content='';
    for(var i=0;i<data.length;i++){
        $content+='<li class="c_Catalogue">';
        for(var n=0;n<data[i].childrens.length;n++){
            /*文章*/
            if(data[i].childrens[n].subType!=15){
                $content+='<div class="c_CataListL">';
                if(i==0){
                    $content+='<i class="guosprite c_bedeckico0 "></i>';
                }
                else {
                    $content+='<i class="guosprite c_bedeckico0 "></i>';
                }
                $content+='<h1 class="c_CataTitle">'+data[i].title+'</h1>';
                $content+='<p class="c_CataImg">';
                $content+='<img src="'+data[i].url+'"  class="w100"  alt="" id=img_'+i+'>';
                //GetImg(data[i].objectKey,data[i].bucketName,i)
                $content+='</p>';
                $content+='<ul class="c_CataList" id="c_CataList">';
                for(var j=0;j<data[i].childrens[n].childrens.length;j++){
                    $content+='<li class="c_CataLi">';
                    for(var k=0;k<data[i].childrens[n].childrens[j].resList.length;k++){
                        $content+='<a target="_blank" href="chinese_article.html?id='+data[i].childrens[n].childrens[j].resList[k].id+'&k='+Math.random()+'"   title="'+data[i].childrens[n].childrens[j].resList[k].title+'" class="fs18 fc33 c_Title0">' ;
                        $content+='<span class="name">'+data[i].childrens[n].childrens[j].resList[k].title+'</span>';
                        $content+='<span class="id dino">'+data[i].childrens[n].childrens[j].resList[k].id+'</span>';
                        $content+='</a>';
                    }
                    $content+= '</li>';
                }
                $content+='</ul>';
                $content+='</div>';
            }
        }
        for(var n=0;n<data[i].childrens.length;n++){
            /*名师指点*/
            if(data[i].childrens[n].subType==15){
                $content+='<div class="c_CataListR">';
                if(i==0){
                    $content+='<i class="guosprite c_bedeckico1 "></i>';
                }
                else {
                    $content+='<i class="guosprite c_bedeckico1 "></i>';
                }
                $content+='<h1 class="c_CataTitle">名师指点</h1>';
                for(var j=0;j<data[i].childrens[n].resList.length;j++){
                    if(data[i].childrens[n].resList[j].type==1){
                        $content+='<div class="c_CataImg c_CataImg1">' ;
                        $content+='<img src="'+data[i].childrens[n].resList[j].vedioPicture+'" class="w100" alt="">';
                        $content+='<div class="c_CataMask">';
                        $content+='<a target="_blank"  href="chinese_video.html?id='+data[i].childrens[n].resList[j].id+'"   title="'+data[i].childrens[n].resList[j].title +'" class="fs18 fc33 c_Title1">' ;
                        $content+='<img src="../../../static/image/chinese/c_playico.png" alt="" class="c_PlayImg" >';
                        $content+='</a>';
                        $content+='</div>';
                        $content+='<span class="c_Movtit">'+data[i].childrens[n].resList[j].title+'</span>';
                        $content+='</p>';
                    }
                }
                $content+='<ul class="c_CataTeList" id="c_CataTeList">';
                for(var j=0;j<data[i].childrens[n].resList.length;j++){
                    if(data[i].childrens[n].resList[j].type==4){
                        $content+='<li>';
                        $content+='<a target="_blank" href="chinese_Teacher.html?id='+data[i].childrens[n].resList[j].id+'"   title="'+data[i].childrens[n].resList[j].title +'" class="fs18 fc33 c_Title1">' ;
                        $content+='<span class="name">'+data[i].childrens[n].resList[j].title+'</span>';
                        $content+='<span class="dino id">'+data[i].childrens[n].resList[j].id+'</span>';
                        $content+='</a>';
                        $content+='</li>';
                    }
                }
                $content+='</ul>';
                $content+='</div>';
            }
        }
        $content+='</li>';
    }
    $('#c_Content').html($content);
    ArtOnclick();
};
function ArtOnclick(){
    $('.c_Title0').on('click',function(){
        CreatArtArr( $(this).parents('.c_CataLi').find('a'))
    });
    $('.c_Title1').on('click',function(){
        CreatArtArr( $(this).parents('.c_CataTeList').find('li'))
    });
    $('.c_CataImg').hover(function(){
        $(this).find('.c_PlayImg').css("display",'block')
        $(this).find('.c_CataMask').css("display",'block')
    },function(){
        $(this).find('.c_PlayImg').css("display",'none')
        $(this).find('.c_CataMask').css("display",'none')
    });
};
