/**
 * Created by lc on 2017/7/7.
 */
SystemRedMsg();
CheckBrower();//检查浏览器版本
GetHtml("../../model/common/common.txt","#Header");//引入导航
//截取URL 的 id
var PPtId=Request.id;
//刷新子页面的数据
document.getElementById('iframeReload').src = "Course.html"
queryordownload(PPtId,"query");//统计浏览量；
//备课中心课件详情
var flag='';
var documentId='';//资源在百度云的Id；
var bucketName='';//百度云文件服务器名称;
var objectKey='';//百度云文件唯一标识;
var praiseCount;
var prepareData;
GetCWDetail()
function GetCWDetail(){
	$.ajax({
		type: "post",
		url: "/web/teacher/courseware/details",
		data: {
			resId:PPtId
		},
		dataType: "json",
		success: function (data) {
			console.log(data);
			var codenum = parseInt(data.retCode.substr(0, 1));
			if (codenum == 0) {
				praiseCount=data.retData.count;
				$(".p_ZanCount").html('（'+praiseCount+'）');//点赞数量；
				documentId=data.retData.resResourseRes.documentId;
				bucketName=data.retData.resResourseRes.bucketName;
				objectKey=data.retData.resResourseRes.objectKey;
				flag=data.retData.flag;//点赞标识；
				$(".p_CWTitle").html(data.retData.resResourseRes.title);//标题
				var str='';
				str=data.retData.resResourseRes.content;
				str=str.replace(/\&lt;/g,'<');
				str=str.replace(/\&gt;/g,'>');
				str=str.replace(/\&quot;/g,'"');
				str=str.replace(/\&amp;nbsp;/g, "");
				$(".p_CWItdTxt").html(str);//课件介绍文本
				//点赞
				if(flag==true){
					$(".p_CWZan").removeClass("p_Praiseico").addClass("p_yetPraiseico");
					$(".p_ZanCount").css("color","#F4840A");
				}
				//下载功能
				//add by subo 3-24 for 789
				$(".c_CWDownLoadBtn").after("<div id='itHasFlash' style='display: none;float: right;position: relative;'><div style='position: absolute;top: -70px;right: -160px;padding: 15px 30px;white-space: nowrap;border-radius: 8px;border: 1px solid #ccc;background-color: rgba(255,255,255,0.8);'><i style='position: absolute; left: 50%; bottom: -16px; width: 0;height: 0;margin-left: -4px;border: 8px solid transparent;border-top: 8px solid #ccc;'></i><i style='position: absolute; left: 50%; bottom: -15px; z-index: 2; width: 0;height: 0;margin-left: -4px;border: 8px solid transparent;border-top: 8px solid #fff;'></i><p style='font-size: 16px;color: #666;'>可观看动态效果</p></div></div>");
				$(".c_CWDownLoadBtn").on("mouseover",function(){
					$("#itHasFlash").stop(true,true).fadeIn();
				});
				$(".c_CWDownLoadBtn").on("mouseout",function(){
					$("#itHasFlash").stop(true,true).fadeOut();
				});
				//over
				$(".c_CWDownLoadBtn").on("click",function(){
					NewDownload(bucketName,objectKey)
				})
			}
		}
	});
}

//点赞功能
$(".p_CWZan").on("click",function(){
	Like(PPtId);//课件点赞
});
//点赞
function Like(currentId) {
	$.ajax({
		type: "post",
		url: "/web/teacher/prepare/like",
		data: {
			resId:currentId
		},
		dataType: "json",
		success: function (data) {
			var codenum = parseInt(data.retCode.substr(0, 1));
			if (codenum == 0) {
				praiseCount+=1;
				$(".p_ZanCount").html('（'+praiseCount+'）');
				$(".p_CWZan").removeClass("p_Praiseico").addClass("p_yetPraiseico");
				$(".p_ZanCount").css("color","#F4840A");
			}
		}
	});
}
//取消点赞
function NoLike(currentId) {
	$.ajax({
		type: "post",
		url: "/web/teacher/prepare/nolike",
		data: {
			resId:currentId
		},
		dataType: "json",
		success: function (data) {
			var codenum = parseInt(data.retCode.substr(0, 1));
			if (codenum == 0) {
				praiseCount-=1;
				$(".p_ZanCount").html('（'+praiseCount+'）');
				$(".p_CWZan").removeClass("p_yetPraiseico").addClass("p_Praiseico");
				$(".p_ZanCount").css("color","#7B7B7B");
			}
		}
	});
}
//文档预览的主方法
var cwwidth;//通过判断浏览器的宽度决定课件容器的宽度
$(window).resize(function(){
	window.location.reload()
});
setInterval(function () {
	$('.wenku-api-box').eq(0).siblings().remove()
},1);
//下载或阅览时相应的字段加1
function queryordownload(id,str){
	var bo = true;
	$.ajax({
		type:"POST",
		data:{
			"id":id,
			"flag":str
		},
		url:"/web/common/queryordownnum",
		success:function(data){
			if(data.retCode!="0000"){
				bo = false;
			}
		}
	});
	return bo;
}
//下载时扣除相应的金币
function downlaodingAndReduceGold(id){
	$.ajax({
		type:"POST",
		data:{
			"id":id,
			"type":"pptDownload"
		},
		url:"/web/teacher/courseware/downlaodingAndReduceGold",
		success:function(data){
			console.log(data);
		}
	})
}
/*分享*/
$('.p_CWShare').hover(function(){
	$(this).removeClass('p_shareico ').addClass('p_yetshareico');
},function(){
	$(this).removeClass('p_yetshareico ').addClass('p_shareico');
});
$('.p_CWShare').on('click',function(){
	$('#Share').fadeIn(150);
	//Share();报错，单不影响功能，注释掉 subo 3-23
});
$('.c_ruleico').on('click',function(){
	$('#Share').fadeOut(150);
});



//操作
Opration()
function Opration(){
	$('#GoIdentifyClose').on('click',function(){
		$('#NoIdentify').fadeOut(150);
	});
	$('#GoPayClose').on('click',function(){
		$('#p_LessMoney').fadeOut(150);
	});
	$('#e_DownBox').on('click',function(){
		NewDownload()
	});
}
//新下载
function NewDownload(bucketName,objectKey) {
	var SubData={};
	SubData.resourceId=Request.id;
	SubData.type='pptDownload';
	SubData.resType='3';
	$.ajax({
		"type": "post",
		"url": "/web/teacher/download/obtain",
		"dataType": "json",
		"data":SubData,
		success: function (data) {
			console.log(data)
			var AllData=data.retData;//总数据
			var Codenum = parseInt(AllData);
			if(Codenum==1){
				downreload(bucketName,objectKey);
			}
			else if(Codenum==2){
				$('#p_LessMoney').fadeIn(200);
			}else {
				$('#NoIdentify').fadeIn(200);
			}
		}
	});
}
//创建下载
function downreload(bucketName,objectKey){
	$.ajax({
		type:"POST",
		data:{
			"objectKey":objectKey,
			"bucketName":bucketName,
			"expirationInSeconds":-1
		},
		url:"/web/common/baidudownload",
		success:function(data){
			console.log(data)
			// $('#p_alabel').html('');
			// var Html='<a href="'+data+'" target="_blank" ><p id="downloada">DownLoad</p></a>'
			// $('#p_alabel').html(Html);
			// $('#downloada').click()
			if(data){
				window.location.href = data;
			}else{
				alert("无效的下载地址！");
			}
		}
	});
}

/**********************课件分享***************************/
var DoneShare=Request.IsShare;
if(window.location.hash!=''){
	$('body,html').html('')
	ShareRedirect();
}else {
	var sUserAgent = navigator.userAgent.toLowerCase();
	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	if(bIsAndroid || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM) {
		ShareRedirect();
	}else {
		//GetCWDetail();
	}
}

function ShareRedirect() {
	var sUserAgent = navigator.userAgent.toLowerCase();
	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	if (bIsIpad || bIsIphoneOs) {
		$('body,html').html("暂时不支持IOS版本，更多详情<a href='../../../index.html'>五好导学网</a>") ;
		window.location.href="../../../index.html";
	}else if(bIsAndroid || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM){
		$('body,html').html("正在跳转到下载地址...<br/>如果是微信访问，请点击右上角选择从浏览器打开") ;
		window.location.href="../../../app/appdownload.html";
	}else {
		$('body,html').html("请使用手机访问，或者请前往官方<a href='../../../index.html'>五好导学网</a>") ;
		window.location.href="../../../index.html";
	}
}
$('#ShareClose').on('click',function(){
	$('#Share').fadeOut(150);
})
$('.enjoys').on('click',function(){
	$('#Share').fadeIn(150);
});



//changeWidth()
//function changeWidth(){
//    var Timer=null;
//    if(Timer){clearInterval(Timer);}
//    Timer=setInterval(function(){
//        changeWidth()
//        if(document.body.clientWidth>=1583){
//            cwwidth=1200;
//        }else if(document.body.clientWidth>1349){
//            cwwidth=1000;
//        }else{
//            cwwidth=900;
//        }
//        clearInterval(Timer);
//        $("#p_CWReader").empty();
//        checkarticle(prepareData);
//
//    },1000)
//}





