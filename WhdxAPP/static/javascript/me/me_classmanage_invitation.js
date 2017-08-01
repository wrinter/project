/**
 * Created by Administrator on 2016/12/8.
 */
//获取id
function getUrl(){
    var url =window.location.href;
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u= u[1].replace(/uuid=/,"");
        return u ;
    }
}
var to_uuid=getUrl().split("&")[0];
var classCode=getUrl().split("&")[1].split("=")[1];
getClassData();
function getClassData(){
    $.ajax({
        type: "post",
        url: "/api/teacher/class/search",
        data: {
            "classCode":classCode,
            "uuid":to_uuid
        },
        dataType: "json",
        success: function (data) {
            var codenum = parseInt(data.retCode.substr(0, 1));
            if(codenum==0){
                $(".teacherName").html(data.retData.headTeacherName);
                $(".className").html(data.retData.gradeName+data.retData.className);
                $(".classCode").html(classCode);
            }
        }
    });
}