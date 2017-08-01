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
            resultHtml += "<li class='totalnav Thisli'>";
            resultHtml += '<span class="fl cup fistMenu">';
            resultHtml += fistObj[i].menuName;
            resultHtml += '</span>';
            resultHtml += '<i class="spriteImg c_downico fl c_Downico"></i>';
            resultHtml += '<i class="spriteImg c_navico c_Navico"></i>';
            resultHtml += '<i class="dino sort">';
            resultHtml += fistObj[i].sort;
            resultHtml += '</i>';
            resultHtml += '<ul class="c_NavSecond dino">';
            var tempArr = aFun(fistObj[i].menuId,secondObj);
            for(var n=0;n<tempArr.length;n++){
                resultHtml+='<li  class="menuId nav_secnva " data-menuId="'+tempArr[n].menuId+'">';
                resultHtml += '<a href="'+tempArr[n].href+'">';
                resultHtml += tempArr[n].menuName;
                resultHtml += '</a></li>';
            }
            resultHtml += '</ul></li>';
            continue;
        }
        resultHtml += '<li class="menuId nav_firstnva Thisli" data-menuId="'+fistObj[i].menuId+'"><a href="'+fistObj[i].href+'">';
        resultHtml += fistObj[i].menuName;
        resultHtml += '</a>';
        resultHtml += '<i class="spriteImg c_navico c_Navico"></i>';
        resultHtml += '<i class="dino sort">';
        resultHtml += fistObj[i].sort;
        resultHtml += '</i></li>';
    }
    $('.c_Nav').html(resultHtml);
    $(".menuId").click(function(){
        store.set("menuId",$(this).attr("data-menuId"));
    });
    $('.Thisli').hover(function(){
        $(this).find('.c_Navico').stop(true).fadeIn(200);
    },function(){
        $(this).find('.c_Navico').stop(true).fadeOut(200);
    })
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
    $(".weblogo").on("click",function(){
        window.location.href='/model/index/indexX.html';
    })
    $("#sign").on("click",function(){
        if($(this).hasClass("add")){

        }else{
            $.ajax({
                type : "post",
                url : "/web/user/singin",
                dataType : "json",
                success : function(data){
                    console.log(data)
                    var comlu = data.retCode.substr(0,1);
                    if(comlu == "0"){
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
    })
    //根据不同长度的一级导航，定位二级导航居中
    for(var i=0;i<$('.totalnav').length;i++ ){
        var titlelength=$('.totalnav').eq(i).find('span').html().length;
        switch (titlelength){
            case 2:$('.totalnav').eq(i).find(".c_NavSecond").css("left",'-30px'); break;
            case 4:$('.totalnav').eq(i).find(".c_NavSecond").css("left",'-15px'); break;
            case 5:$('.totalnav').eq(i).find(".c_NavSecond").css("left",'-5px'); break;
        }
    }
    //二级导航显示
    $('.totalnav').hover(function(){
        $(this).find('.c_NavSecond').stop().slideDown(150);
        $(this).find('.c_Downico').css({'animation':'change 0.3s linear 1 forwards'});
    },function(){
        $(this).find('.c_NavSecond').stop().slideUp(150);
        $(this).find('.c_Downico').css({'animation':''});
    });
    //二级导航显示
    $('.c_Day').hover(function(){
        $(this).find('.menav').stop().slideDown(150);
    },function(){
        $(this).find('.menav').stop().slideUp(150);
    });
    $('#menav li').eq(0).hover(function(){
        $(this).find('.p_msgico0').removeClass('p_msgico0').addClass('p_msgico1')
    },function(){
        $(this).find('.p_msgico1').removeClass('p_msgico1').addClass('p_msgico0')
    })
    $('#menav li').eq(1).hover(function(){
        $(this).find('.p_u0').removeClass('p_u0').addClass('p_u1')
    },function(){
        $(this).find('.p_u1').removeClass('p_u1').addClass('p_u0')
    })
    $('#menav li').eq(2).hover(function(){
        $(this).find('.p_quitico0').removeClass('p_quitico0').addClass('p_quitico1')
    },function(){
        $(this).find('.p_quitico1').removeClass('p_quitico1').addClass('p_quitico0')
    })
    $('.c_NavSecond li').hover(function(){
        $(this).find('a').css('color','#65B113 ')
    },function(){
        $(this).find('a').css('color','#666 ')
    })
    $('#menav li').hover(function(){
        $(this).find('a').css('color','#65B113 ')
    },function(){
        $(this).find('a').css('color','#666 ')
    });
    $('.quite').on('click',function(){Quit();});
    var UserHeadImgSrc=store.get('UserHeadImgSrc');
    $('#UserHeadImg').attr('src',UserHeadImgSrc);
}
//获取导航
var obj =store.get('data').retData.roleMenuRes;
Nav(obj);




