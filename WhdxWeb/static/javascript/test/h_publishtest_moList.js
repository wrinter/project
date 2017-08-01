/**
 * Created by tang on 2017/1/10.
 */
SystemRedMsg();
/******************************获取导航*******************************/
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
var param={};
var categoryId=Request.id;
var knowledgeId=Request.ac;
var paperType=Request.pt;
var thisKt=Request.kt;
param.categoryId=Request.id;
param.knowledgeId=Request.ac;
$.ajax({
    type: "post",
    url: "/web/teacher/paper/assign/simulatepapers",
    data:param,
    dataType:"json",
    success:function(data){
        if(data.retCode=="0000"){
            var list=data.retData;
            if(list.length != 0){
                var li="";
                for(var k in list){
                    li+="<li class='paperTitle'>";
                    li+="<a href='../../model/test/h_publishTest_exercise.html?id=" + categoryId + "&ac=" + knowledgeId + "&kt=" + thisKt + "&pi=" + list[k].paperId + "&pt=" + paperType + "'>";
                    li+="<div>"+list[k].paperName+"</div>";
                    li+="</a>";
                    li+="</li>";
                }
                $(".mo_list").html(li);
            }else{
                $(".mo_list").html("<img class='nodata' src='../../static/image/nodata.png'>");
            }
        }else{
            $(".mo_list").html("<img class='nodata' src='../../static/image/nodata.png'>");
        }
    }
});
