/**
 * Created by lc on 2017/6/5.
 */
//获取头部导航
GetHtml("../../model/common/Head.txt","#Com_Head");
CheckBrower();
//获取拓扑数据
//展现学科名称
window.onload=function () {
    var SubjectName=decodeURI(decodeURI(encodeURI(Request.subjectname)));
    var Tit='<i class="ArrowsFont Com_NextIco">&#xe603;</i><span class="fl fc49">'+SubjectName+'</span>';
    $('#HtmlTitle').html(Tit);
    var MainH=$(window).height()-120;
    if(MainH<600){
        MainH=600;
    }
    $('#mu_Main').height(MainH);
    $('#mu_Lous').height($('#mu_Main').height());
    for(var i=0;i<$('#mu_SubMain>li').length;i++){
        $('#mu_SubMain>li').eq(i).height($('#mu_SubMain>li').eq(i).width());
    }
}
GetGraph();//获取数据
function GetGraph(){
    var SubData={};
    SubData.subjectId=Request.subjectId;
    $.ajax({
        "type": "post",
        "url": "/web/student/brush/studentTopology",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            console.log(data);
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                if(data.retData.length == 0){
                    $('#c_ErrorMsg').html('暂未开启').fadeIn(300);  Disappear("#c_ErrorMsg");
                    return false;
                }
                Echarts(AllData);//拓扑图
            }
            else {
                $('#c_ErrorMsg').html(data.retMsg).fadeIn(300); Disappear("#c_ErrorMsg");
            }
        }
    });
};//获取数据
//拓扑图的展现
function Echarts(data){
    var myChart = echarts.init(document.getElementById("main"));
    function get_nodes(data) {
        var nodes = [];
        var tmp_nodes = [];
        for(var nodes_i in data) {
            tmp_nodes.push(data[nodes_i].node);
            nodes.push(
                {
                    'name':data[nodes_i].node,
                    "symbolSize": data[nodes_i].symbolSize,
                    itemStyle: {//圆的样式
                        normal: {
                            color: data[nodes_i].color,
                            borderColor: '#1af'
                        },
                    },
                    'x':data[nodes_i].x,
                    'y':data[nodes_i].y,
                    'value':data[nodes_i].value
                }
            );
        }
        return nodes;
    }
    //连线
    function get_links(data) {
        var links = [];
        for(var nodes_i in data) {
            var node = data[nodes_i].node;
            var endpoint = data[nodes_i].endpoint;
            var service = data[nodes_i].service;
            // console.log(service);
            for(var service_i in endpoint) {
                links.push({
                    'source':node,
                    'target':endpoint[service_i],
                    'label': {
                        'normal': {
                            'show': false,
                            'textStyle':{
                                'fontSize':5
                            },
                            'formatter': service
                        }
                    },
                    'lineStyle': {
                        'normal': {
                            'curveness': 0.1
                        }
                    }
                })
            }
        }
        for (var i = 0, len1 = links.length; i < len1; i++) {
            for(var j = i, len2 = len1 - 1; j < len2; j++) {
                if (links[i].source==links[j].target) {
                    links[j].lineStyle.normal.curveness = -0.1;
                }
            }
        }
        // console.log(links);
        return links;
    }
    var option = {
        title: {
            text: ''
        },
        // tooltip: {
        //formatter: '调用方法'
        // },
        layout: 'force',
        symbolSize: 10,
        animationEasingUpdate: 'quinticInOut',
        series : [
            {
                type: 'graph',
                //layout: 'circular',
                 layout:'none',
                focusNodeAdjacency: true,
                legendHoverLink: true,
                hoverAnimation:true,
                //coordinateSystem:'cartesian2d',
                symbolSize: 20,
                //edgeSymbolSize: 50,
                roam: true,
                //symbol: "roundRect",//图形形状
                label: {
                    normal: {
                        show: true,
                        position: 'top',

                    }
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    normal: {
                        textStyle: {
                            fontSize: 20
                        }
                    }
                },
                itemStyle: {//圆的样式
		            normal: {
		                color: '#ccc',
		                borderColor: '#1af'
		            }
		        },
                zoom :1.75,//默认放大大小
                xAxisIndex :10,
                scaleLimit:{min:0.3,max:5},//放大比例
                data: get_nodes(data),
                links: get_links(data),
                lineStyle: {//线的样式
                    normal: {
                        color: '#1af',
                        opacity: 0.9,
                        width: 2,
                        curveness: 0.2
                    }
                }
            },
        ]
    };
    Excuse(myChart);//单点多点练习
    Lclick(myChart,option);//放大
    Mclick(myChart,option);//缩小
    Right(myChart,option);//恢复原来状态
    myChart.setOption(option);

}
//点击放大
function Lclick(myChart,option){
    $(".large").unbind("click");
    $(".large").on("click",function(){
        var a = option.series[0].zoom;
        if(a > 5){
            return false;
        }
        option.series[0].zoom = parseFloat(a+1);
        myChart.setOption(option);
    })
}
//点击缩小
function Mclick(myChart,option){
    $(".minus").unbind("click");
    $(".minus").on("click",function(){
        var a = option.series[0].zoom;
        if(a < 0.3){
            return false;
        }
        option.series[0].zoom = parseFloat(a-1);
        myChart.setOption(option);
    })
}
//恢复原来状态
function Right(myChart,option){
    $(".right").unbind("click");
    $(".right").on("click",function(){
        var a = option.series[0].zoom;
        option.series[0].zoom = 1.75;
        myChart.setOption(option);
    })
}
//单点练习或者多点联系
function Excuse(myChart){
    //添加点击事件
    var mu_Menu = $(".mu_Menu");
    var icRoll = true;
    myChart.on('click', function (params,evt) {
        evt = window.event || arguments[0].event.event;
        if(evt.stopPropagation){
            evt.stopPropagation();
        }else{
            evt.cancelBubble = true;//在echarts的时候取消冒泡
        }
        //console.log(evt)
        var xx = evt.offsetX;//自动获取单点联系的位置
        var yy = evt.offsetY;//自动获取单点联系的位置
        mu_Menu.hide();//单点练习消失
        if (params.data.value.isKnowledge == "1" || params.data.value.isKnowledge == 1) {//控制单点练习展现消失
            mu_Menu.show();//单点练习
            icRoll = false;
            var Data = {
                knowledgeId :params.data.value.knowledgeId,
                materialId :params.data.value.materialId,
                name : params.data.name
            }
            sessionStorage.setItem("Data",JSON.stringify(Data));
        }
        mu_Menu.css({"top":(yy+140)+"px","left":(xx+20)+"px"});//单点练习的位置
        $('#onetest').off('click');
        $('#onetest').on('click',function(){
            $('#m_Mask').fadeIn(150);
            sessionStorage.setItem("isKnowledge",0);
            //获取等级
            GetComGrade();
        });
        //多点练习
        $('#twotest').off('click');
        $('#twotest').on('click',function(){
            $('#m_Mask').fadeIn(150);
            sessionStorage.setItem("isKnowledge",1);
            //获取等级
            GetComGrade();
        });
    });
    //点击其他地方消失单点练习
    $(document).on('click',function(evt){
        evt = window.event || evt;
        console.log(evt)
        if(evt.stopPropagation){
            evt.stopPropagation();
            mu_Menu.hide();//单点练习
        }
    })
}

function GetComGrade(){
    $.ajax({
        "type": "post",
        "url": "/web/student/brush/mustBrushLevel",
        "dataType": "json",
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreateGrade(AllData);
            }else {
                $('#c_ErrorMsg').html(data.retMsg); Disappear("#c_ErrorMsg");
            }
        }
    });
};
function CreateGrade(data){
    var $Grade='';
    for(var i=0;i<data.length;i++){
        if(data[i].value==50){
            $Grade+='<li data-value="'+data[i].value+'"><p>挑战'+data[i].label+'</p><img src="../../../../student/static/image/mustdo/m_role0.png" alt=""></li>';
        }
        else if(data[i].value==70){
            $Grade+='<li data-value="'+data[i].value+'"><p>挑战'+data[i].label+'</p><img src="../../../../student/static/image/mustdo/m_role1.png" alt=""></li>';
        }
        else {
            $Grade+='<li data-value="'+data[i].value+'"><p>挑战'+data[i].label+'</p><img src="../../../../student/static/image/mustdo/m_role2.png" alt=""></li>';
        }
    }
    $('#m_Rolebg').html($Grade);
    UserOption();
};
//操作
function UserOption(){
    var Data = JSON.parse(sessionStorage.getItem("Data"));
    var isKnowledge = JSON.parse(sessionStorage.getItem("isKnowledge"));
    var SubjectName = Request.subjectname;
    var knowledgeId = Data.knowledgeId;
    var isMultiple = isKnowledge;
    var VismaterialId = Data.materialId;
    var subjectId = Request.subjectId;
    var visName = Data.name;
    $('#m_Rolebg li>p').off("click");//首先失去点击事件
    $('#m_Rolebg li>p').on('click',function(){
        var brushLevel=$(this).parents('li').attr('data-value');
        window.location.href='mustdo_test.html?knowledgeId='+knowledgeId+'&isMultiple='+isMultiple+'&subjectId='+subjectId+'&VismaterialId='+VismaterialId+'&brushLevel='+brushLevel+'&visName='+visName+'&subjectName='+SubjectName;
    });
    $('#m_Rolebg li>img').off("click");//首先失去点击事件
    $('#m_Rolebg li>img').on('click',function(){
        var brushLevel=$(this).parents('li').attr('data-value');
        window.location.href='mustdo_test.html?knowledgeId='+knowledgeId+'&isMultiple='+isMultiple+'&subjectId='+subjectId+'&VismaterialId='+VismaterialId+'&brushLevel='+brushLevel+'&visName='+visName+'&subjectName='+SubjectName;
    });
    $('#Close').on('click',function(){
        $('#m_Mask').fadeOut(150);
    });
}
