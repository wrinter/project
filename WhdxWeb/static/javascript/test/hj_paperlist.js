/**
 * Created by subo on 2017/4/27 0027.
 */
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
var thisType = "test",
    thisActive = $H.storage.getLocal(thisType,"active"),
    thisId = $H.storage.getLocal(thisType,"id");
$H.ajax.hjSimulatepapers(true,{knowledgeId:thisActive,categoryId:thisId},sSimulatepapers,eSimulatepapers);
function sSimulatepapers(data) {
    $H.class("mo_list")[0].innerHTML = $H.Html.hjSimulatepapers(data.retData);
    $H.event.clickNeedsetstorage(thisType);
    $H.storage.setLocal(thisType,'st',null);
}
function eSimulatepapers() {
    $H.class("mo_list")[0].innerHTML = "<li><img class='nodata' src='../../static/image/nodata.png' /></li>";
}