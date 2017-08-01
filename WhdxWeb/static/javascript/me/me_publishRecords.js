CheckBrower();
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");

//面包屑导航
SystemRedMsg();
function getList(){
    $.ajax({
        type:"post",
        url:"/web/teacher/center/wrongbook/paper/record",
        dataType:"json",
        success:function(data){
           if(data.retCode=="0000"){
               var list=data.retData;
              if(list.length!==0){
                  var li="";
                  $.each(list,function (i, obj) {
                      var date = new Date(obj.assignTime);
                      var Y=date.getFullYear();
                      var M=date.getMonth();
                      var D=date.getDate();
                      var H=date.getHours();
                      var m=date.getMinutes();
                      var assignTime=Y+"-"+M+"-"+D+" "+H+":"+m;
                      li+="<ul class='m_records' id='"+obj.id+"' data-paperResId='"+obj.paperResId+"'>";
                      li+="<a href='me_pubAndPrint.html?paperId="+obj.paperResId+"&paperType=119&assignId="+obj.id+"'>";
                      li+="<li class='fl m_toPreview'>"+obj.aliasName+"</li>";
                      li+="</a>";
                      if(obj.status=="2"){
                          li+="<li class='fl m_status'>"+"未布置"+"</li>";
                      }else{
                          li+="<li class='fl m_status'>"+"已布置"+"</li>";
                      }
                      li+="<li class='fl m_grade'>"+obj.classId+"</li>";
                      li+="<li class='fl m_pubTime'>"+obj.assignTime+"</li>";
                      if(obj.status =="2"){
                          li+="<li class='m_del spriteImg p_delico0 fr'></li>";
                      }
                      li+="</ul>";
                  });
                  $(".m_allRecords").html(li.replace(/null/g,""));
              }else{
                  var li="";
                  li+="<img class='noImg' src='../../../static/image/kola/no.png'>";
                  $(".m_allRecords").html(li);
              }
            }
        }
    });
}
getList();
//删除行
function delLine(that) {
    var param={};
    param.paperAssignId=$(that).parent().attr("id");
    $.ajax({
        type:"post",
        url:"/web/teacher/center/wrongbook/paper/delete",
        dataType:"json",
        data:param,
        success:function(data){
            if(data.retCode=="0000"){
               $(that).parent().remove();
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                }
                $('#c_ErrorMsg').html('删除成功').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    })
}

$(".m_allRecords").on("click",".m_del",function(){
    delLine(this);
});
//点击错题记录，跳转到预览页面
$(".m_toPreview").on("click",function(){
    window.location.href="../../../model/me/me_preview.html";
});


css();
function css(){
    $.ajax({
        type:"post",
        url:"/web/common/commonStyle",
        dataType:"json",
        success:function(data){
            console.log(data);
            if(data.retCode == "0000"){
                var retData = data.retData;
                //console.log(retData);
                //retData.appendTo("head");
                $("head").append(retData);
            }
        },
        error:function(e){
            console.log(e)
        }
    })
}