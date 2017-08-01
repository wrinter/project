/****************************************Created by 徐扬 on 2016/12/22.*****************************************/
/********************************************获取导航***********************************************/
GetHtml("../../model/common/common.txt","#Header");
SystemRedMsg();
function UserOpration(){
    //Tab切换
    $('.m_MsgBtn').on('click',function(){
        var ThisIndex=$(this).index();
        $(this).removeClass().addClass('m_MsgBtn m_Btnbg1');
        $(this).siblings().removeClass().addClass('m_MsgBtn m_Btnbg0');
        $('.m_MsgList').eq(ThisIndex).css("display",'block').siblings('.m_MsgList').css("display",'none');
    });
    $('#m_Btnbg1').on('click',function(){
        store.set('IsMsgType',0);
        GetSystemList();
        //kkpager.selectPage();
        Paging(store.get('SystemSize'),store.get("SysMsgPageNum"))
    });
    $('#m_Btnbg2').on('click',function(){
        store.set('IsMsgType',1);
        GetEntryList();
        //kkpager.selectPage();
        Paging(store.get('EntrySize'),store.get("EntryMsgPageNum"));
    });
}
function getParameter(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
};
//分页
function Paging(SystemSize,pageNo){
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
            if(store.get('IsMsgType')==0||store.get('IsMsgType')=='0'){
                store.set("SysMsgPageNum",n);
                GetSystemList()
            }else if(store.get('IsMsgType')==1||store.get('IsMsgType')=='1'){
                store.set("EntryMsgPageNum",n);
                GetEntryList();
            }
        }
    },true);
};
//系统消息
GetSystemList();
store.set('IsMsgType',0);
store.set("SysMsgPageNum",1);
store.set("EntryMsgPageNum",1);
setTimeout(function(){
    Paging(store.get('SystemSize'),store.get("SysMsgPageNum"));
    UserOpration();
},400);
function GetSystemList(){
    var SubData={};
    SubData.pageIndex=store.get("SysMsgPageNum");;
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
                CreartSystemHtml(AllData.list);
                SystemRedMsg();
                store.set('SystemSize',AllData.pages);
            }else{
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
//创建系统消息HTML
function CreartSystemHtml(data){
    $('#SystemList').html('');
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
                GetSystemList();
                setTimeout(function(){
                    Paging(store.get('SystemSize'),store.get("SysMsgPageNum"));
                },200);
                $('#c_ErrorMsg').html('删除成功').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
//申请消息
GetEntryList();
function GetEntryList(){
    var SubData={};
    SubData.pageIndex=store.get("EntryMsgPageNum");;
    SubData.pageSize=5;
    $.ajax({
        "type": "post",
        "url": "/web/user/pcUserMessage",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                SystemRedMsg();
                CreartEntryHtml(AllData.list);
                store.set('EntrySize',AllData.pages);
            }else{
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
//创建申请消息列表
function CreartEntryHtml(data){
    var $EntryHtml='';
    if(data.length>0){
        for(var i=0;i<data.length;i++){
            $EntryHtml+='<li >';
            $EntryHtml+='<div class="m_SystemMsg">';
            $EntryHtml+='<span class="m_SystemMsgCon">'+data[i].content+'</span>';
            $EntryHtml+='<span class="m_SystemMsgDate">'+data[i].createDate+'</span>';
            $EntryHtml+='</div>';
            $EntryHtml+='<span class="m_MsgDel0 EntryOperate" data-senderId="'+data[i].senderId+'" data-userMessageId="'+data[i].userMessageId+'" data-userType="'+data[i].receiveType+'">删除</span>';
            $EntryHtml+='<div class="m_Option">';
            if(data[i].applystatus==1||data[i].applystatus==3){
                $EntryHtml+='<img src="../../../static/image/message/m_OptionicoYes.png" alt="" class="m_OptionResult">';
            }
            else if(data[i].applystatus==0){
                $EntryHtml+='<img src="../../../static/image/message/m_OptionicoNo.png" alt="" class="m_OptionResult">';
            } else {
                $EntryHtml+='<p class="m_OptionYes0 EntryOperate" data-senderId="'+data[i].senderId+'" data-userMessageId="'+data[i].userMessageId+'" data-userType="'+data[i].receiveType+'">允许</p>';
                $EntryHtml+='<p class="m_OptionNo0 EntryOperate" data-senderId="'+data[i].senderId+'"  data-userMessageId="'+data[i].userMessageId+'" data-userType="'+data[i].receiveType+'">拒绝</p>';
            }
            $EntryHtml+='</div>';
            $EntryHtml+='</li>';
        }
    }
    else {
        $EntryHtml='<li class="m_NoMsg">暂无申请消息~</li>';
    }
    $('#EntryLIst').html($EntryHtml);
    EntryOpration();
};
//申请消息操作
function EntryOpration(){
    //是否允许加入班级
    $('.m_OptionNo0').on('click',function(){
        var userType=$(this).attr('data-userType');
        var userMessageId=$(this).attr('data-userMessageId');
        var senderId=$(this).attr('data-senderId');
        EntryRefuse(userType,userMessageId,senderId)
    });
    $('.m_OptionYes0').on('click',function(){
        var userType=$(this).attr('data-userType');
        var userMessageId=$(this).attr('data-userMessageId');
        var senderId=$(this).attr('data-senderId');
        EntryAgree(userType,userMessageId,senderId)
    });
    $('.m_MsgDel0').on('click',function(){
        var userType=$(this).attr('data-userType');
        var userMessageId=$(this).attr('data-userMessageId');
        var senderId=$(this).attr('data-senderId');
        DelEntry(userType,userMessageId,senderId)
    });
};
//申请消息拒绝请求
function EntryRefuse(userType,userMessageId,senderId){
    var SubData={};
    SubData.userType=userType;
    SubData.userMessageId=userMessageId;
    SubData.senderId=senderId;
    $.ajax({
        "type": "post",
        "url": "/web/user/messageApply/refuse",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                GetEntryList();
                $('#c_ErrorMsg').html('操作成功').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
//申请消息允许请求
function EntryAgree(userType,userMessageId,senderId){
    var SubData={};
    SubData.userType=userType;
    SubData.userMessageId=userMessageId;
    SubData.senderId=senderId;
    $.ajax({
        "type": "post",
        "url": "/web/user/messageApply/agree",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                GetEntryList();
                $('#c_ErrorMsg').html('操作成功').fadeIn(200);  Disappear("#c_ErrorMsg");
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};
//删除申请消息
function DelEntry(userType,userMessageId,senderId){
    var SubData={};
    SubData.userType=userType;
    SubData.userMessageId=userMessageId;
    SubData.senderId=senderId;
    $.ajax({
        "type": "post",
        "url": "/web/user/pcDeApplylMessage",
        "dataType": "json",
        "data":SubData,
        success: function (data) {
            var AllData=data.retData;//总数据
            var codenum = parseInt(data.retCode.substr(0, 1));
            if (codenum == 0){
                GetEntryList();
                setTimeout(function(){
                    Paging(store.get('EntrySize'),store.get("EntryMsgPageNum"));
                },200);
                $('#c_ErrorMsg').html('删除成功').fadeIn(200);  Disappear("#c_ErrorMsg");

            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        }
    });
};





