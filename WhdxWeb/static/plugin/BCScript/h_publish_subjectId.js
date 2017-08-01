//Created by subo on 2017/4/6.
function subjectId(){
    var id = null;
    $.ajax({
        type: "post",
        url: "/web/teacher/center/baseinfo",
        async: false,//同步
        data: {},
        dataType: "json",
        success: function (data) {
            if(data.retCode === "0000"){
                id = data.retData.subjectId;
            }
        }
    });
    return id;
}
