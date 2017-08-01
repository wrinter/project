/**
 * Created by wcd on 2016/12/28.
 */
SystemRedMsg();
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
var paper_index=function(){};
paper_index.prototype={
    constructor:paper_index,
    init:function () {
      this.getCataloglevel1();
    },
    getCataloglevel1:function () {
      var param={};
      $.ajax({
          type: "post",
          url: "/web/teacher/paper/assign/cataloglevel1",
          data:param,
          dataType: "json",
          success:function(data){
              console.log(data);
              var li="";
              li+="<div class='_levelName'>"+data.retData[0].levelName+":</div>";
              for(var k in data.retData){
                  li+="<li class='level' id='"+data.retData[k].id+"'>"+data.retData[k].name+"</li>";
              }
              $(".test_nav").html(li);
              $(".level:eq(0)").addClass("l_active");
              $(".test_nav").on("click",".level",function(){
                  $(this).addClass("l_active").siblings(".l_active").removeClass("l_active");
              });
         }
      });
    }
}
$(function() {
    new paper_index().init();//实例化
})