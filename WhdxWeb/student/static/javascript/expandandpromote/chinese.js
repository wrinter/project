/**
 * Created by renwencong on 2017/2/4 0004.
 */
setInterval(function(){
    var lefth=$('.c_Catalogue .c_CataListL').height();
    var righth=$('.c_Catalogue .c_CataListR').height();
    if(lefth>righth){
        $('.c_Catalogue .c_CataListR').height($('.c_Catalogue .c_CataListL').height())
        $('.c_Catalogue .c_CataListL').height($('.c_Catalogue .c_CataListR').height())
    }
    else {
        $('.c_Catalogue .c_CataListL').height($('.c_Catalogue .c_CataListR').height())
        $('.c_Catalogue .c_CataListR').height($('.c_Catalogue .c_CataListR').height())
    }
},1);

//国学与美文
var chinese = {
    main:function(){
        chinese.IsArtListUpOrDown();
        chinese.changePro();
        $("#c_Content").show();
        $(".c_MagMian").hide();
        chinese.selectMenu();
    },
    //美文
    article:function(menuid,flag){
        var SubData={};
        //SubData.menuid=store.get('menuId');
        SubData.menuid = menuid;
        SubData.subjectId = "01"
        $.ajax({
            "type": "post",
            "url": "/web/student/extended/index",
            "dataType": "json",
            "async":false,
            "data": SubData,
            success: function (data) {
                var codenum = parseInt(data.retCode.substr(0, 1));
                if (codenum == 0) {
                    if(data.retData.length>0){
                        var AllData=data.retData[0].childrens;
                        if (flag == 'article') {
                            chinese.CreatList(AllData);
                        }
                        if (flag == 'sinology') {
                            chinese.CreatSinologyList(AllData);
                        }
                        if(flag == 'magazine'){
                            chinese.IsFirstShow(AllData[AllData.length-1]);
                            chinese.GetArtInfoList(AllData.length,AllData);
                            $(".c_MagMian").show();
                        }
                        $(".noData").hide();
                    }else{
                        $(".c_MagMian").hide();
                        $(".noData").show();
                    }
                }else{
                    $(".noData").show();
                    $(".c_MagMian").hide();
                }

            },
            error:function(data){
                console.log(data)
                alert(data);
            }
        });
    },
    /*美文创建html*/
    CreatList:function(data){
        console.log(data)
        var $content='';
        var titum=0;
        for(var i=0;i<data.length;i++){
            var Is1=1+3*i;
            var Is2=2+3*i;
            var Is3=3+3*i;
            $content+='<div class="c_Catalogue">';
            for(var n=0;n<data[i].childrens.length;n++){
                /*文章*/
                if(data[i].childrens[n].subType!=15){
                    $content+='<div class="c_CataListL">';
                    if(i==0){
                        $content+='<i class="guosprite c_decorateico0 "></i>';
                    }
                    else {
                        $content+='<i class="guosprite c_bedeckico0 "></i>';
                    }
                    $content+='<div class="fl c_FicListMain">';
                    for(var j=0;j<data[i].childrens[n].childrens.length;j++){
                        $content+='<div class="c_FicBox fl">';
                        titum=data[i].childrens[n].childrens[j].title;
                        if(titum==Is1){$content+='<span class="c_PartTit fc65">'+titum+'</span>';}
                        else if(titum==Is2){$content+='<span class="c_PartTit fcE3">'+titum+'</span>';}
                        else if(titum==Is3){$content+='<span class="c_PartTit fc10">'+titum+'</span>';}
                        else {
                            $content+='<span class="c_PartTit fc65">'+titum+'</span>';
                        }
                        $content+='<ul class="c_FicList">';
                        for(var k=0;k<data[i].childrens[n].childrens[j].resList.length;k++){
                            $content+= '<li>';
                            if(titum==Is1){ $content+= '<i class="WinnieFont fc65">&#xe652;</i>';}
                            else if(titum==Is2){ $content+= '<i class="WinnieFont fcE3">&#xf001e;</i>';}
                            else if(titum==Is3){ $content+= '<i class="WinnieFont fc10">&#xe604;</i>';}
                            else {
                                $content+= '<i class="WinnieFont fc65">&#xe652;</i>';
                            }
                            $content+='<a target="_blank" href="chinese_article.html?id='+data[i].childrens[n].childrens[j].resList[k].id+'"   title="'+data[i].childrens[n].childrens[j].resList[k].title+'" class="fs18 fc33 c_Title0">' ;
                            $content+='<span class="name">'+data[i].childrens[n].childrens[j].resList[k].title+'</span>';
                            $content+='<span class="id dino">'+data[i].childrens[n].childrens[j].resList[k].id+'</span>';
                            $content+='</a>';
                            $content+= '</li>';
                        }
                        $content+= '</ul>';
                        $content+= '</div>';
                    }
                    $content+='</div>';
                    $content+='</div>';
                }
            }
            for(var n=0;n<data[i].childrens.length;n++){
                /*名师指点*/
                if(data[i].childrens[n].subType==15) {
                    $content+='<div class="c_CataListR">';
                    if(i==0){
                        $content+='<i class="guosprite c_decorateico1 "></i>';
                    }
                    else {
                        $content+='<i class="guosprite c_bedeckico1 "></i>';
                    }
                    $content+='<h1 class="c_CataTitle">名师指点</h1>';
                    for(var j=0;j<data[i].childrens[n].resList.length;j++){
                        if(data[i].childrens[n].resList[j].type==1){
                            $content+='<p class="c_CataImg c_CataImg1">' ;
                            console.log(data[i].childrens[n].resList[j].vedioPicture)
                            $content+='<img src="'+data[i].childrens[n].resList[j].vedioPicture+'" class="w100" alt="">';
                            $content+='<a  class="c_PlayImg" href="chinese_video.html?id='+data[i].childrens[n].resList[j].id+'"   title="'+data[i].childrens[n].resList[j].title +'" class="fs18 fc33 c_Title1">' ;
                            $content+='<img src="../../../static/image/chinese/c_playico.png" alt="" >';
                            $content+='</a>';
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
            $content+='</div>';
        }
        $('#c_Content').html($content);
        chinese.ArtOnclick();
    },
    /*国学创建html*/
    CreatSinologyList:function(data){
        console.log(data);
        var $content='';
        for(var i=0;i<data.length;i++){
            $content+='<div class="c_Catalogue">';
            for(var n=0;n<data[i].childrens.length;n++){
                /*文章*/
                if(data[i].childrens[n].subType!=15){
                    $content+='<div class="c_CataListL">';
                    if(i==0){
                        $content+='<i class="guosprite c_decorateico0 "></i>';
                    }
                    else {
                        $content+='<i class="guosprite c_bedeckico0 "></i>';
                    }
                    $content+='<h1 class="c_CataTitle">'+data[i].title+'</h1>';
                    $content+='<p class="c_CataImg">';
                    $content+='<img src="../../../static/image/chinese/load.gif" alt="" id=img_'+i+'>';
                    chinese.GetImg(data[i].objectKey,data[i].bucketName,i)
                    $content+='</p>';
                    $content+='<ul class="c_CataList" id="c_CataList">';
                    for(var j=0;j<data[i].childrens[n].childrens.length;j++){
                        $content+='<li class="c_CataLi">';
                        for(var k=0;k<data[i].childrens[n].childrens[j].resList.length;k++){
                            $content+='<a target="_blank" href="chinese_article.html?id='+data[i].childrens[n].childrens[j].resList[k].id+'"   title="'+data[i].childrens[n].childrens[j].resList[k].title+'" class="fs18 fc33 c_Title0">' ;
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
                        $content+='<i class="guosprite c_decorateico1 "></i>';
                    }
                    else {
                        $content+='<i class="guosprite c_bedeckico1 "></i>';
                    }
                    $content+='<h1 class="c_CataTitle">名师指点</h1>';
                    for(var j=0;j<data[i].childrens[n].resList.length;j++){
                        if(data[i].childrens[n].resList[j].type==1){
                            $content+='<p class="c_CataImg c_CataImg1">' ;
                            $content+='<img src="'+data[i].childrens[n].resList[j].vedioPicture+'" class="w100" alt="">';
                            $content+='<a  class="c_PlayImg" href="chinese_video.html?id='+data[i].childrens[n].resList[j].id+'"   title="'+data[i].childrens[n].resList[j].title +'" class="fs18 fc33 c_Title1">' ;
                            $content+='<img src="../../../static/image/chinese/c_playico.png" alt="" >';
                            $content+='</a>';
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
            $content+='</div>';
        }
        $('#c_Content').html($content);
        chinese.ArtOnclick();
    },
    /*国学请求图片*/
    GetImg:function(a,b,c){
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
    },
    ArtOnclick:function(){
        $('.c_Title0').on('click',function(){
            chinese.CreatArtArr( $(this).parents('.c_FicList').find('a'))
        });
        $('.c_Title1').on('click',function(){
            chinese.CreatArtArr( $(this).parents('.c_CataTeList').find('li'))
        });
        $('.c_CataImg').hover(function(){
            $(this).find('.c_PlayImg').css("display",'block')
        },function(){
            $(this).find('.c_PlayImg').css("display",'none')
        });
    },
    /*获取期刊封面*/
    MagazineGetImg:function(a,b,c){
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
            },
            beforeSend:function(){
                $('#img_'+c).attr('src','../../../static/image/chinese/load.gif');
            }
        });
    },
    /*保存期刊目录文章的id与名称*/
    SaveArtInfo:function(){
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
    },
    /*获取最新的一期期刊展示*/
    IsFirstShow:function(data){
        var $FirstInfo='';
        $FirstInfo+='<img src="" alt="加载中" class="fl w100" id=img_'+'New'+'>';
        chinese.MagazineGetImg(data.objectKey,data.bucketName,'New')
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
        chinese.CheckedArtList();
    },
    /*获取往期期刊列表*/
    GetArtInfoList:function (length,data){
        var $Maghtml='';var img_='';
        for(var j=length-1;j>-1;j--) {
            $Maghtml+='<li>';
            $Maghtml+='<img src="" alt="加载中" class="fl w100 GetImg" id=img_'+j+'>';
            chinese.MagazineGetImg(data[j].objectKey,data[j].bucketName,j);
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
        $('.c_Title').on('click',function(){
            chinese.SaveArtInfo();
            /*window.location.href='chinese_magazine.html?id='+$(this).find('.c_ThisId ').html()+'';*/
        });
        chinese.CheckedArtList();
    },
    /*选中期刊*/
    CheckedArtList:function (){
        $('#c_SmallMag li').on('click',function(){
            $('#c_MenuList').html($(this).find('.Small').html());
            $('#c_MenuTopInfo').html($(this).find('.ArtInfo').html());
            $('#img_New').attr('src',$(this).find('img').attr('src'));
            $(this).removeClass().addClass('c_Shadow');
            $(this).siblings().removeClass();
            $('.c_Title').on('click',function(){
                chinese.SaveArtInfo();
                /*window.location.href='chinese_magazine.html?id='+$(this).find('.c_ThisId ').html()+'';*/
            });
        })
    },
    /*期刊切换*/
    IsArtListUpOrDown:function (){
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
    },
    //国学，美文，期刊切换
    changePro:function(){
        $(".title_ul li").click(function(){
            $(".title_ul li").removeClass("change_title");
            $(this).addClass("change_title");
            if($(this).attr("mycla") == 'article'){
                $("#c_SmallMag").empty();
                chinese.article($(this).attr("id"),"article");
                $("#c_Content").show();
                $(".c_MagMian").hide();
                $("#the_end").html("美文");
            }
            if($(this).attr("mycla") == 'sinology'){
                $("#c_SmallMag").empty();
                chinese.article($(this).attr("id"),"sinology");
                $("#c_Content").show();
                $(".c_MagMian").hide();
                $("#the_end").html("国学");
            }
            if($(this).attr("mycla") == 'magazine'){
                $("#c_Content").empty();
                chinese.article($(this).attr("id"),"magazine");
                $("#c_Content").hide();
                $("#the_end").html("期刊");
            }
        })
    },
    /*创建文章列表数组*/
    CreatArtArr:function(a){
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
    },
    /*获取语文科目下的栏目*/
    selectMenu:function(){
        $.ajax({
            "type": "post",
            "url": "/web/student/extended/grammarMenu",
            "async":false,
            success: function (data) {
                var htm ="",list = data.retData;
                for(var i in list){
                    if(list[i].menuName === "美文"){
                        htm +='<li id="'+list[i].id+'" class="fl change_title" mycla="article">'+list[i].menuName+'</li>';
                    }else if(list[i].menuName === "国学"){
                        htm +='<li id="'+list[i].id+'" class="fl" mycla="sinology">'+list[i].menuName+'</li>';
                    }else if(list[i].menuName === "期刊"){
                        htm +='<li id="'+list[i].id+'" class="fl" mycla="magazine">'+list[i].menuName+'</li>';
                    }
                }
                $(".title_ul").html(htm);
                chinese.changePro();
                chinese.article($(".change_title").attr("id"),"article");
            }
        })
    }
}
$(function(){
    chinese.main();
})