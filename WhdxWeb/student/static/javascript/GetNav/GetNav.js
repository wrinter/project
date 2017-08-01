/****************************************Created by 徐扬 on 2016/12/6.*****************************************/
/***************************************获取导航*******************************************/
function Nav(obj){
    var aFun = function (pid,pArr) {
        var newArr = [];
        for(var i=0;i<pArr.length;i++){
            if(pArr[i].parentId==pid){
                newArr.push(pArr[i]);
                continue;
            }
        }
        return newArr;
    };
    var fistObj = [];
    var secondObj = [];
    var resultHtml = "";
    // 数据分离
    for(var i=0;i<obj.length;i++){
        if(obj[i].parentId==0){
            fistObj.push(obj[i]);
            continue;
        }
        secondObj.push(obj[i]);
    }
    // 拼接html
    for (var i=0;i<fistObj.length;i++){
        if(fistObj[i].leaf==0){
            //有二级导航的一级导航
            resultHtml +='<li class="Com_Li Com_HasSecNav">';
            resultHtml +='<img src="../../static/image/common/i_upico0.png" alt="" class="Com_DownIco">';
            resultHtml +='<span class="Com_HasName">'+fistObj[i].menuName+'</span><i class="ArrowsFont Com_Down">&#xe600;</i>';
            resultHtml +='<ul class="Com_SecNav">';
            var tempArr = aFun(fistObj[i].menuId,secondObj);
            //二级导航
            for(var n=0;n<tempArr.length;n++){
                resultHtml +='<li class="Com_Menu" data-menuId="'+tempArr[n].menuId+'">';
                resultHtml +='<a href="'+tempArr[n].href+'">'+tempArr[n].menuName+'</a>';
                resultHtml +='</li>';
            }
            resultHtml +='</ul>';
            resultHtml +='</li>';
            continue;
        }
        //一级导航
        resultHtml +='<li class="Com_Li Com_Menu">';
        resultHtml +='<img src="../../static/image/common/i_upico0.png" alt="" class="Com_DownIco">';
        resultHtml +='<a href="'+fistObj[i].href+'">'+fistObj[i].menuName+'</a>';
        resultHtml +='</li>';
    }
    $('#Com_NavMain').html(resultHtml);
    //根据不同长度的一级导航，定位二级导航居中
    for(var i=0;i<$('.Com_HasSecNav').length;i++ ){
        var titlelength=$('.Com_HasSecNav').eq(i).find('span').html().length;
        switch (titlelength){
            case 2:$('.Com_HasSecNav').eq(i).find(".Com_SecNav").css("left",'-30px'); break;
            case 4:$('.Com_HasSecNav').eq(i).find(".Com_SecNav").css("left",'-15px'); break;
            case 5:$('.Com_HasSecNav').eq(i).find(".Com_SecNav").css("left",'-5px'); break;
        }
    }
    //蓝色箭头
    $('#Com_SignBox,.Com_Li').hover(function(){
        $(this).find('.Com_DownIco').stop(true).fadeIn(200);
    },function(){
        $(this).find('.Com_DownIco').stop(true).fadeOut(200);
    });
    $('.Com_HasSecNav').hover(function(){
        $(this).find('.ArrowsFont').css({'animation':'change 0.3s linear 1 forwards'});
        $(this).find('.Com_SecNav').stop(true).slideDown(150);
    },function(){
        $(this).find('.ArrowsFont').css({'animation':''});
        $(this).find('.Com_SecNav').stop(true).slideUp(150);
    });
    $('.Com_Menu').on('click',function(){
        store.set("menuId",$(this).attr("data-menuId"));
    });
    //退出
    $('#Quit').on('click',function(){Quit();});
    //用户头像
    var UserHeadImgSrc=store.get('UserHeadImgSrc');
    $('#UserHeadImg').attr('src',UserHeadImgSrc);
    //先判断是否签到
    isSign();
    function isSign(){
        $.ajax({
            type : "post",
            url : "/web/user/singinCount",
            dataType : "json",
            success : function(data){
                if(data.retCode == "0000"){
                    var singinedDays = data.retData.singinedDays;
                    if(data.retData.singined == "no"){
                        $("#sign").text("签到");
                    }else{
                        $("#sign").addClass("add").text("已签到");
                        $("#sign").css({"background":"#ccc"})
                    }
                    $("#sign").on("mouseover",function(){
                        $("#sign").attr("title","连续签到"+singinedDays+"天");
                    })
                }
            },
            error : function(e){
                console.log(e)
            }
        })
    }
    $("#sign").on("click",function(){
        if($(this).hasClass("add")){
        }else{
            $.ajax({
                type : "post",
                url : "/web/user/singin",
                dataType : "json",
                success : function(data){
                    console.log(data)
                    var cumlu = data.retCode.substr(0,1)
                    if(cumlu == "0"){
                        $('#c_ErrorMsg').html('签到成功！').fadeIn(200);  Disappear("#c_ErrorMsg");
                        GoldAnimate(data.retGold);
                        isSign();
                    }else{
                        $('#c_ErrorMsg').html('签到失败！').fadeIn(200);  Disappear("#c_ErrorMsg");
                    }
                },
                error : function(e){
                    console.log(e)
                }

            })
        }
    });
    $('#Com_SignBox').hover(function(){
        $(this).find('.Com_SecNav').stop(true).slideDown(150);
    },function(){
        $(this).find('.Com_SecNav').stop(true).slideUp(150);
    })
    $('.Com_Logo').click(function(){
        window.location.href='/student/model/index/index.html';
    })
}
//获取导航
var obj =store.get('data').retData.roleMenuRes;
Nav(obj);

