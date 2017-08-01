/****************************************By 徐扬***************************************************/
/****************************************加入我们***************************************************/
function JoinUs(){
    $('.NavU li').hover(function(){
        $(this).find('.c_Navico').stop(true).fadeIn(100);
    },function(){
        $(this).find('.c_Navico').stop(true).fadeOut(100);
    });
    $('.j_MenuMain li').hover(function(){
        $(this).find('img').stop(true).fadeIn(100);
    },function(){
        $(this).find('img').stop(true).fadeOut(100);
    });
    $('.j_MenuTabCon li').on('click',function(){
        $(this).siblings().removeClass()
        if($(this).hasClass('IsShow')){
            $(this).removeClass().find('.isupdown').attr('src','../../static/image/AboutUs/j_tabico0.png');
            $(this).siblings().find('.isupdown').attr('src','../../static/image/AboutUs/j_tabico0.png');
            $(this).find('.j_TabShow').slideUp(200);
        }
        else {
            $(this).removeClass().addClass('IsShow').find('.isupdown').attr('src','../../static/image/AboutUs/j_tabico1.png');
            $(this).siblings().find('.isupdown').attr('src','../../static/image/AboutUs/j_tabico0.png');
            $(this).siblings().find('.j_TabShow').slideUp(200);
            $(this).find('.j_TabShow').slideDown(200);
        }
    });
    $('.j_MenuMain li').on('click',function(){
        var ThisIndex=$(this).index();
        $('.j_MenuTab').css('display','none').eq(ThisIndex).css('display','block');
    });
}
JoinUs();