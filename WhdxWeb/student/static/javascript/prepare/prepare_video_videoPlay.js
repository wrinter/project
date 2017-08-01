/**
 * Created by wcd on 2016/11/28.
 */
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
//面包屑导航
$("#c_Crum li a").removeClass("fc65");
$("#c_Crum").append("<li><i class='spriteImg c_Crumgoico c_Crumgo'></i><a href='' class='fc65'>视频播放</a></li>");