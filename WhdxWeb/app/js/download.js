// GetAppDownLoad(1)
// GetAppDownLoad(2)
// GetAppDownLoad(3)
function GetAppDownLoad(type) {
    var SubData={}
    SubData.appType=type;
    $.ajax({
        "type": "post",
        "url": "/web/common/appVersion",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                var Url=AllData.downloadUrl;
                if(type==1){
                    $("#Teacher").attr('href',Url);
                }else if(type==2){
                    $("#Student").attr('href',Url);
                }else {
                    $("#Parents").attr('href',Url);
                }
            }
            else {

            }
        }
    });
}
