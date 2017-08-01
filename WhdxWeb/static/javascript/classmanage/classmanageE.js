/**
 * Created by wcd on 2016/12/21.
 */
$(function(){
    GetHtml('../common/common.txt', '#header');//引入导航
    var classid=store.get('NowClassId');//取LocalStorage传递的班级id
    var headTeacherid=store.get('headTeacherId');//取LocalStorage传递的班主任id
    var c_grade=store.get('c_Grade');//取LocalStorage传递的班级名称用于面包屑导航
    $('#c_Crum1').append('<li><a href="classyem2.html" class="fl ">'+c_grade+'</a><i class="spriteImg c_Crumgoico c_Crumgo"></i></li><li  class="fc65">'+store.get("teacherName")+'</li>');
    $(".teacherName").html(store.get("c_Grade"));//次导航的老师名字
     var report=function(){};
     report.prototype={
         constructor:report,//确定原型链
         init:function(){
             this.getReportList();
             this.noSubmit();
             this.getTestList();
         },
         getReportList:function(){//获取这个老师布置的作业list数据
             var param={};
             var that=this;
             param.classId=store.get('NowClassId');
             param.teacherId=store.get('headTeacherId');
             $.ajax({
                 type: "post",
                 url: "/web/teacher/class/report/work",
                 data:param,
                 dataType: "json",
                 success:function(data){
                     var li="";
                     var codenum = parseInt(data.retCode.substr(0, 1));
                     if (codenum ==0) {
                         console.log("reportList"+data);
                         var list=data.retData;
                         if(list.length!=0){
                             $("#c_HomeName").html(list[0].aliasName);
                             for(var k in list){
                                 li+="<li class='fs18 HomeShowLi' id='"+list[k].id+"'>"+list[k].aliasName+"</li>";
                             }
                             $("#c_Homeshow").html(li);
                             //刚进页面时，默认第一个
                             that.getRerportDetail(list[0].id);
                             //下拉框
                             $('#c_HomeText').on('click',function(){$('#c_Homeshow').slideToggle(200);});
                             $("#c_Homeshow").on("click",".HomeShowLi",function(){
                                 $("#c_HomeName").html($(this).html());
                                 that.getRerportDetail($(this).attr("id"));
                             })
                         }else{
                             detectData('c_HomeWork');
                         }
                     }
                 }
             })
         },
         getRerportDetail:function(id){
             var param={};
             param.paperAssignId=id;
             $.ajax({
                 type: "post",
                 url: "/web/teacher/class/report/work/details",
                 data:param,
                 dataType: "json",
                 success:function(data) {
                   console.log("detail"+data);
                     var li="";
                     if(document.body.offsetWidth>1600){
                         li+="<span style='font-size:18px;'>未交</span>";
                         li+="<span style='color:#ca0e0d;font-size:18px;'>"+data.retData.unSubmitList.length+"人：</span>";
                     }else if(document.body.offsetWidth<1600 &document.body.offsetWidth>1366){
                         li+="<span style='font-size:16px;'>未交</span>";
                         li+="<span style='color:#ca0e0d;font-size:16px;'>"+data.retData.unSubmitList.length+"人：</span>";
                     }else if(document.body.offsetWidth<1366){
                         li+="<span style='font-size:14px;'>未交</span>";
                         li+="<span style='color:#ca0e0d;font-size:14px;'>"+data.retData.unSubmitList.length+"人：</span>";
                     }

                     for(var k in data.retData.unSubmitList){
                       li+="<span class='c_noNames'>"+data.retData.unSubmitList[k].userName+"</span>";

                     } if(data.retData.unSubmitList.length>3){
                         li+="<i class='fr downShow spriteImg s_Dico'></i>";
                     }
                     var i=0;
                     $(".c_noSubmitNames").on("click",".downShow",function(){
                         i++;
                         if(i%2==1){
                             $(".c_noSubmitNames").css({"height":"auto"});
                             $(this).css({"transform": "rotate(180deg)"});
                         }else{
                             $(".c_noSubmitNames").css({"height":"30px"});
                             $(this).css({"transform": "rotate(0deg)"});
                         }

                     });
                     $(".c_noSubmitNames").html(li);
                     //echart 饼图 记录作业提交情况
                     var data1 = [];
                     data1.push({value:data.retData.unSubmitList.length,name:"未交"},{value:data.retData.submittedSize, name:'已交'});
                     var myChart = echarts.init(document.getElementById('c_echart'));
                     option = {
                         tooltip: {
                             trigger: 'item',
                             formatter: "{a} <br/>{b}: {c} ({d}%)"
                         },
                         legend: {
                             orient: 'vertical',
                             x: 'right',
                             y: 'bottom',
                             data:['已交','未交']
                         },
                         color:[
                             '#FC5555', '#5FCFF9'
                         ],
                         series: [
                             {
                                 name:'作业提交情况',
                                 type:'pie',
                                 radius: ['50%', '80%'],
                                 center: ['35%', '50%'],
                                 avoidLabelOverlap: false,
                                 label: {
                                     normal: {
                                         show: false,
                                         position: 'center'
                                     },
                                     emphasis: {
                                         show: true,
                                         textStyle: {
                                             fontSize: '24',
                                             fontWeight: 'bold'
                                         }
                                     }
                                 },
                                 labelLine: {
                                     normal: {
                                         show: false
                                     }
                                 },
                                 data:data1
                             }
                         ]
                     };
                     myChart.setOption(option);
                 }
              })
           },
         noSubmit:function(){//未交作业人员名单
            var param={};
             param.classId=store.get('NowClassId');
             param.teacherId=store.get('headTeacherId');
             $.ajax({
                 type: "post",
                 url: "/web/teacher/class/report/unsubmit",
                 data: param,
                 dataType: "json",
                 success: function (data) {
                     var list=data.retData;
                     var li="";
                     if(list.length!=0){
                         li+="<p>累计未交名单</p>";
                         li+=" <ul id='c_NoHomeName'>";
                         for(var k in list){
                             li+="<li>";
                             li+="<span>"+list[k].userName+"</span>";
                             li+="<span>（"+list[k].unSubmitNum+"）</span>";
                             li+="</li>";
                         }
                         li+="</ul>";
                     }else{
                        li = '<div class="NoData"><img src="../../static/image/classmanage/no.jpg" alt="" style="position: relative; top:40%;"></div>';
                     }

               $(".c_NoHomeName").html(li);
                 }
             })
         },
         getTestList:function(){//获取测试列表
             var param={};
             var that=this;
             param.classId=store.get('NowClassId');
             param.teacherId=store.get('headTeacherId');
             $.ajax({
                 type: "post",
                 url: "/web/teacher/class/report/test",
                 data:param,
                 dataType: "json",
                 success:function(data){
                     console.log(data);
                     if(data.retData.length==0){
                        detectData('c_HomeReport');
                     }else{
                         var li="";
                         $("#c_HomeSelectName").html(data.retData[0].aliasName);

                         for(var k in data.retData){
                             li+="<li class='fs18 HomeSelectShowLi' id='"+data.retData[k].id+"'>"+data.retData[k].aliasName+"</li>";
                         }
                         $("#c_HomeSelectshow").html(li);
                         //刚进页面时，默认第一个
                         that.getTestDetail(data.retData[0].id);
                         //下拉框
                         $('#c_HomeSelect').on('click',function(){$('#c_HomeSelectshow').slideToggle(200);});
                         $("#c_HomeSelectshow").on("click",".HomeSelectShowLi",function(){
                             $("#c_HomeSelectName").html($(this).html());
                             that.getTestDetail($(this).attr("id"));
                         });
                     }
                 }
             })
         },
         getTestDetail:function(id){
             var param={};
             param.paperAssignId=id;
             $.ajax({
                 type: "post",
                 url: "/web/teacher/class/report/test/details",
                 data: param,
                 dataType: "json",
                 success: function (data) {
                     console.log(data);
                     var li="";
                     li+="<tr>";
                     li+="<th>序号</th>";
                     li+="<th>姓名</th>";
                     li+="<th>成绩</th>";
                     li+="<th>用时</th>";
                     li+="</tr>";
                      var _score=0;
                     if(data.retData.length>0){
                         for(var k in data.retData){
                             _score+=data.retData[k].score;
                             li+="<tr>";
                             li+="<td>"+(parseInt(k)+1)+"</td>";
                             li+="<td>"+data.retData[k].name+"</td>";
                             li+="<td>"+data.retData[k].score+"</td>";
                             if(data.retData[k].totalTime>data.retData[k].shouldTime){//超出预定时间，变提示色
                                 li+="<td class='changeColor'>"+data.retData[k].totalTime+"</td>";
                             }else{
                                 li+="<td>"+data.retData[k].totalTime+"</td>";
                             }
                             li+="</tr>";
                         }
                         $(".t_table").html(li);
                         var _li="";
                         var ave_score=Math.round(_score/data.retData.length);//平均分
                         console.log(ave_score);
                         function numTwo(shi,ge) {//平均分为两位数时
                             _li+="<i class='fl num _"+shi+"'></i>";
                             _li+="<i class='fl num _"+ge+"'></i>";
                         }
                         function numThree(bai,shi,ge){//平均分为三位数时
                             _li+="<i class='fl num _"+bai+"'></i>";
                             _li+="<i class='fl num _"+shi+"'></i>";
                             _li+="<i class='fl num _"+ge+"'></i>";
                         }
                         if(ave_score<100 & ave_score>=0){
                             numTwo(Math.floor(ave_score/10),ave_score%10);
                         }
                         if(ave_score>=100){
                             numThree(Math.floor(ave_score/100),Math.floor(ave_score%100/10),ave_score%10);
                         }
                         $(".score").html(_li);
                     }else{
                         detectData('c_HomeReport');
                     }
                 }
             })
             }
         }

    new report().init();//实例化
    function detectData(className){
        var classN = "." + className + '>div:eq(0)';
        $(classN).after('<div class="NoData"><img src="../../static/image/kola/no.png" class="NoDataImg" alt=""></div>');
        $('.NoData').nextAll().css('display', 'none');
    }
});