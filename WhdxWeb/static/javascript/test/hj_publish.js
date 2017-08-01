/**
 * Created by subo on 2017/4/17 0017.
 */
SystemRedMsg();
GetHtml("../../model/common/common.txt","#Header");
CheckBrower();
var thisType = "test",
    thisActive = $H.storage.getLocal(thisType,"active"),
    thisMenuData = JSON.parse(localStorage.data).retData.roleMenuRes,
    thisMenuId = "";
for(var i = 0;i<thisMenuData.length;i++) {
    if(thisMenuData[i].sort == 29){
        thisMenuId = thisMenuData[i].menuId;
        break;
    }
}
$H.ajax.hjLastcode(true,{menuId:thisMenuId},sLastcode,eLastcode);//获取章节历史记录
function sLastcode(data){
    $H.storage.setLocal(thisType,"active",data.retData);
    thisActive = data.retData;
    $H.ajax.hjBaseinfo(true,{},sBaseinfo,eBaseinfo);//有点击记录，获取当前学科
}
function eLastcode(){
    $H.storage.setLocal(thisType,"active","");
    thisActive = null;
    $H.ajax.hjBaseinfo(true,{},sBaseinfo,eBaseinfo);//无点击记录，获取当前学科
}
function sBaseinfo(data){
    $H.storage.setLocal(thisType,"subject",data.retData.subjectId);
    $H.ajax.hjKnowledgetree(true,{menuId:thisMenuId,ceShiCode:"05"},sKnowledgetree,eKnowledgetree);//获取章节
}
function eBaseinfo(){
    $H.class("hj_Box")[0].innerHTML = "<img class='nodata' src='../../static/image/nodata.png' />";//科目获取失败，提示，不再进行
}
function sKnowledgetree(data){
    var Data = $H.Data.hjKnowledgetree(data.retData);
    if(!thisActive){//无记录，缓存第1章最后1个子栏目的第1个项目id
        getActive("1");
        function getActive(objId){
            for(var i = 0;i<Data.length;i++){
                if(Data[i].parentId == objId){
                    thisActive = Data[i].knowledgeId;
                    $H.storage.setLocal(thisType,"active",thisActive);
                    getActive(thisActive);
                    break;
                }
            }
        }
    }
    $H.class("hj_Chapter")[0].innerHTML = $H.Html.hjKnowledgetree(Data,thisActive);
    var _thisKt = document.getElementById(thisActive).getAttribute("data-kt");
    $H.storage.setLocal(thisType,"kt",_thisKt);
    $H.event.clickChapter(thisType,Data);
    jobTypes();//初始类型
    jobPaperslist();//初始我的列表
}
function eKnowledgetree(){
    $H.class("hj_Box")[0].innerHTML = "<img class='nodata' src='../../static/image/nodata.png' />";
}
function jobTypes(){
    $H.ajax.hjTypes(true,{menuId:thisMenuId},sTypes,eTypes);//获取名师指点类型
}
function sTypes(data){
    var Data = data.retData[0].childsList;
    $H.class("h_Type_ul")[0].innerHTML = $H.Html.hjTypes(Data,thisType);
    $H.event.clickNeedsetstorage(thisType);
}
function eTypes(){
    console.log("类型获取失败！");
}
function jobPaperslist(){
    $H.ajax.hjPaperslist(true,{knowledgeId:thisActive},sPaperslist,ePaperslist);//获取我的列表
}
function sPaperslist(data){
    var Data = data.retData;
    $H.class("h_Minework_table")[0].innerHTML = $H.Html.hjPaperslist(Data,thisType).replace(/null/g,"");
    $H.event.clickNeedsetstorage(thisType);
    $H.components.deletePaperlist();//删除
}
function ePaperslist(){
    $H.class("h_Minework_table")[0].innerHTML = "<tr><td colspan='5' style='font-size: 18px;padding-top: 30px;background-color: #fff;'><img class='nodata' src='../../static/image/nodata.png' /></td></tr>";
}
