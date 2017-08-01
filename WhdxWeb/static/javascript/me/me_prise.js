CheckBrower();
SystemRedMsg();
$(document).ready(function(){
    //    选转
        var $rotaryArrow = $('#rotaryArrow');
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
                    rotateFunc(1,87,'恭喜您获得了经验 <em style="color: #e68923;">+20</em> ');
                    break;
                case 2:
                    rotateFunc(2,43,'恭喜您获得了商城礼物 <em></em> ');
                    break;
                case 3:
                    rotateFunc(3,134,'恭喜您获得了PPT全额代金券 ；请到<em style="color: #e68923;">个人中心>财富</em>使用');
                    break;
                case 4:
                    rotateFunc(4,177,'恭喜您获得了经验 <em style="color: #e68923;">+5</em>');
                    break;
                case 5:
                    rotateFunc(5,223,'恭喜您获得了金币 <em style="color: #e68923;">10枚</em> ');
                    break;
                case 6:
                    rotateFunc(6,268,'恭喜您获得了教材解读 ；请到<em style="color: #e68923;">商城</em>使用 ');
                    break;
                case 7:
                    rotateFunc(7,316,'恭喜您获得了PPT全额代金券 ；请到<em>个人中心>财富</em>使用');
                    break;
                default:
                    rotateFunc(0,0,'很遗憾，这次您未抽中奖，继续加油吧');
            }
        });
        var rotateFunc = function(awards,angle,text){  //awards:奖项，angle:奖项对应的角度
            $rotaryArrow.stopRotate();
            $rotaryArrow.rotate({
                angle: 0,
                duration: 5000,
                animateTo: angle + 1440,  //angle是图片上各奖项对应的角度，1440是让指针固定旋转4圈
                callback: function(){
                    $resultTxt.html(text);
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
        var first = $('.m_pstats:first');
        var m_showarea = $('.m_showarea');
        var oheight = m_showarea.height();
        var height = first.outerHeight(true);
        first.clone().appendTo(m_showarea);
        var speed = height/oheight*10000;
        first.animate({'margin-top':'-'+height+'px'},speed,'linear',function(){
            $(this).remove();
            zhongjiang();
        })
    };

})
