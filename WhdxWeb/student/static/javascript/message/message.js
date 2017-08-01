/****************************************Created by 徐扬 on 2016/12/22.*****************************************/
/********************************************获取导航***********************************************/
GetHtml("../../model/common/Head.txt","#Com_Head");
function getParameter(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
};
//分页
store.set("SysMsgPageNum",1);
function SystemPaging(SystemSize,pageNo){
    if(pageNo>SystemSize){
        pageNo=SystemSize;
    }
    kkpager.total = SystemSize;
    kkpager.totalRecords = SystemSize*5;
    kkpager.generPageHtml({
        pno : pageNo, //总页码
        hrefFormer : 'message', //链接尾部
        hrefLatter : '.html',
        mode : 'click',//默认值是link，可选link或者click
        click : function(n){
            this.selectPage(n);
            store.set("StuMsgPageNum",n);
            GetSystemList()
            return false;
        }
    },true);
};
//系统消息
GetSystemList(1);
setTimeout(function(){
    SystemPaging(store.get('StuSystemSize'),store.get("StuMsgPageNum"));
},300);
function GetSystemList(){
    var SubData={};
    SubData.pageIndex=store.get("StuMsgPageNum");
    SubData.pageSize=5;
    $.ajax({
        "type": "post",
        "url": "/web/user/pcSysMessage",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                SystemRedMsg();
                CreartSystemHtml(AllData.list);
                store.set('StuSystemSize',AllData.pages);
            }else{
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
//创建系统消息HTML
function CreartSystemHtml(data){
    var $Stystem='';
    if(data.length>0){
        for(var i=0;i<data.length;i++){
            $Stystem+='<li>';
            $Stystem+='<div class="m_SystemMsg">';
            $Stystem+='<span class="m_SystemMsgCon">'+data[i].content+'</span>';
            $Stystem+='<span class="m_SystemMsgDate">'+data[i].createDate+'</span>';
            $Stystem+='</div>';
            $Stystem+='<span class="m_MsgDel" data-userMessageId="'+data[i].userMessageId+'">删除</span>';
            $Stystem+='</li>';
        }
    }
    else {
        $Stystem+='<li class="m_NoMsg">暂无系统消息~</li>';
    }
    $('#SystemList').html($Stystem);
    DelSystemOration();
};
//删除系统消息操作
function DelSystemOration(){
    $('.m_MsgDel').on('click',function(){
        DelSystem($(this).attr('data-userMessageId'))
    });
};
//删除系统消息
function DelSystem(userMessageId){
    var SubData={};
    SubData.userMessageId=userMessageId
    $.ajax({
        "type": "post",
        "url": "/web/user/pcDelMessage",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                SystemRedMsg();
                GetSystemList()
                setTimeout(function(){
                    SystemPaging(store.get('StuSystemSize'),store.get("StuMsgPageNum"));
                },200)
                $('#c_ErrorMsg').html('删除成功').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};