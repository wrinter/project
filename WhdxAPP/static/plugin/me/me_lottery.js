/**
 * Created by lgr on 2016/12/2.
 */
$(document).ready(function(){
    //    选转
    var $rotaryArrow = $('#rotaryArrow,#rotaryArrow0');
    var $result = $('#result');
    var $resultTxt = $('#resultTxt');
    var $resultBtn = $('#rebtn');
    var $m_rote1 = $('.m_rote1');
    var $m_rotexuan = $(".m_rotexuan");
    $rotaryArrow.click(function(){
        var data = [0, 1, 2, 3, 4, 5, 6, 7];
        data = data[Math.floor(Math.random()*data.length)];
        switch(data){
            case 1:
                rotateFunc(1,87,'经验','+20');
                break;
            case 2:
                rotateFunc(2,43,"",'商城礼品');
                break;
            case 3:
                rotateFunc(3,134,"",'神秘大奖');
                break;
            case 4:
                rotateFunc(4,177,'经验','+5');
                break;
            case 5:
                rotateFunc(5,223,'金币 ','10枚');
                break;
            case 6:
                rotateFunc(6,268,'教材解读','图书一套');
                break;
            case 7:
                rotateFunc(7,316,"课件定制","代金券");
                break;
            default:
                rotateFunc(0,0,"",'再接再厉');
        }
    });
    var rotateFunc = function(awards,angle,text,remind){  //awards:奖项，angle:奖项对应的角度
        $rotaryArrow.stopRotate();
        $rotaryArrow.rotate({
            angle: 0,
            duration: 5000,
            animateTo: angle + 1430,  //angle是图片上各奖项对应的角度，1440是让指针固定旋转4圈
            callback: function(){
                $(".l_lottery_get").text("您获得"+ text);
                $resultTxt.html(remind);
                $result.show();
                $m_rote1.show();
                $m_rotexuan.hide().find(".m_rote2").hide();
                if( awards == "7" || awards == "3"){
                    $("#resultTxt").on("click",function(){
                        alert("个人财富中心");
                    });
                };
                if(awards == "6"){
                    $("#resultTxt").on("click",function(){
                        alert("商城");
                    });
                };
            }
        });
    };

    $resultBtn.click(function(){
        $result.hide();
    });
    //    中奖
    zhongjiang();
    function zhongjiang(){
        var first = $('.l_lottery_auto:first');
        var l_lotteryli = $('.l_lotteryli');
        var oheight = l_lotteryli.height();
        var height = first.outerHeight(true);
        first.clone().appendTo(l_lotteryli);
        var speed = height/oheight*10000;
        first.animate({'margin-top':'-'+height+'px'},speed,'linear',function(){
            $(this).remove();
            zhongjiang();
        })
    };
})
