/********************************************必刷题首页By徐扬**********************************************/
//用户操作
Opration();
function Opration(){
    setInterval(function(){
        var MainH=$(window).height()-160;
        if(MainH<600){
            MainH=600;
        }
        $('#mu_Main').height(MainH);
        $('#mu_Lous').height($('#mu_Main').height());
        for(var i=0;i<$('#mu_SubMain>li').length;i++){
            $('#mu_SubMain>li').eq(i).height($('#mu_SubMain>li').eq(i).width());
        }
    },1);
    $('#BackUp').on('click',function(){
        window.location.href='mustdo_index.html?uuid='+Request.uuid;
    });
};

GetNetWork();
function draw() {
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        interaction: {
            navigationButtons: true,
            keyboard: true
        },
        nodes: {
            shape: 'dot',
            font: {
                size: 28,
                color: 'white'
            },
            borderWidth: 2,
            shadow:true
        },
        edges: {
            width: 2,
            shadow:true,

        },
        groups: {
            maxts: {color:'rgb(255,89,89)',size: 80},
            midts: {color:'rgb(60,183,236)',size: 60},
            mints: {color:'rgb(250,216,56)',size: 40}
        }
    };
    var IsForList=[];
    for(var i=0;i<nodes.length;i++){
        var obj={};
        obj.id=nodes[i].id;
        obj.isKnowledge=nodes[i].isKnowledge;
        IsForList.push(obj)
    }
    network = new vis.Network(container, data, options);
    network.on("stabilizationProgress", function(params) {
        var maxWidth = 496;
        var minWidth = 20;
        var widthFactor = params.iterations/params.total;
        var width = Math.max(minWidth,maxWidth * widthFactor);
        document.getElementById('bar').style.width = width + 'px';
        document.getElementById('text').innerHTML = Math.round(widthFactor*100) + '%';
    });
    network.once("stabilizationIterationsDone", function() {
        document.getElementById('text').innerHTML = '100%';
        document.getElementById('bar').style.width = '496px';
        document.getElementById('loadingBar').style.opacity = 0;
        setTimeout(function () {document.getElementById('loadingBar').style.display = 'none';}, 500);
    });
    network.on("click", function (params) {
        var selectNode = params.nodes[0];
        var nodePosition = network.getPositions(selectNode);
        if(selectNode!=undefined){
            for(var i=0;i<IsForList.length;i++){
                if(IsForList[i].id==selectNode){
                    if(IsForList[i].isKnowledge=='1'||IsForList[i].isKnowledge==1){
                        $('#mu_Menu').css({'top':params.pointer.DOM.y,'left':params.pointer.DOM.x}).fadeIn(150);
                        $('#onetest').off('click');
                        $('#onetest').on('click',function(){
                            store.set('isMultiple',0);
                            store.set('VisknowledgeId',selectNode);
                            var VismaterialId=store.get('VismaterialId');
                            UserOption(selectNode,0,VismaterialId);
                            $('#m_Mask').fadeIn(150);
                        });
                        $('#twotest').off('click');
                        $('#twotest').on('click',function(){
                            store.set('isMultiple',1);
                            store.set('VisknowledgeId',selectNode);
                            var VismaterialId=store.get('VismaterialId');
                            UserOption(selectNode,1,VismaterialId);
                            $('#m_Mask').fadeIn(150);
                        });
                    }
                }
            }

        }else {
            $('#mu_Menu').css('display','none');
        }
    });
    network.on("oncontext", function (params) {$('#mu_Menu').css('display','none')});
    network.on("dragStart", function (params) {$('#mu_Menu').css('display','none')});
    network.on("dragging", function (params) {$('#mu_Menu').css('display','none')});
    network.on("dragEnd", function (params) {$('#mu_Menu').css('display','none')});
    network.on("zoom", function (params) {$('#mu_Menu').css('display','none')});
    network.on("showPopup", function (params) {$('#mu_Menu').css('display','none')});
    network.on("hidePopup", function () {$('#mu_Menu').css('display','none')});
    network.on("select", function (params) {$('#mu_Menu').css('display','none')});
    network.on("selectNode", function (params) {$('#mu_Menu').css('display','none')});
    network.on("selectEdge", function (params) {$('#mu_Menu').css('display','none')});
    network.on("deselectNode", function (params) {$('#mu_Menu').css('display','none')});
    network.on("deselectEdge", function (params) {$('#mu_Menu').css('display','none')});
    network.on("hoverNode", function (params) {$('#mu_Menu').css('display','none')});
    network.on("hoverEdge", function (params) {$('#mu_Menu').css('display','none')});
    network.on("blurNode", function (params) {$('#mu_Menu').css('display','none')});
    network.on("blurEdge", function (params) {$('#mu_Menu').css('display','none')});
};
function GetNetWork(){
    setTimeout(function () {
        var SubData={};
        SubData.subjectId=Request.subjectId;
        SubData.uuid=Request.uuid;
        store.set('uuid',Request.uuid);
        var NodesData;
        $.ajax({
            "type": "post",
            "url": "/api/student/appStudent/brush/studentTopology",
            "dataType": "json",
            "data": SubData,
            success: function (data) {
                var AllData=data.retData;
                var codenum =(data.retCode.substr(0, 1));
                if(codenum==0){
                    store.set('VismaterialId',AllData.materialId);
                    var SendData=AllData.allNodesJson
                    var CreatHtml='draw()';
                    var Scrhtml='var nodes='+JSON.stringify( SendData.nodes )+';var edges='+JSON.stringify( SendData.edges )+';'+CreatHtml;
                    var head= document.getElementsByTagName('head')[0];
                    var script= document.createElement('script');
                    script.type= 'text/javascript';
                    script.innerHTML=Scrhtml;
                    head.appendChild(script);
                    //防止浏览器假死，新建一个script用于存放数据，等当前js加载完毕，执行新的script，从而保证UI线程和ajax线程冲突消
                    store.set('VismaterialId',AllData.materialId);
                }
            }
        });
    },0)

};
//获取等级
GetComGrade();
function GetComGrade(){
    var SubData={};
    SubData.uuid=Request.uuid;
    $.ajax({
        "type": "post",
        "url": "/api/student/appStudent/brush/mustBrushLevel",
        "dataType": "json",
        "data": SubData,
        success: function (data) {
            var AllData=data.retData;
            var codenum =(data.retCode.substr(0, 1));
            if(codenum==0){
                CreateGrade(AllData);
            }else {

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
};
//操作
function UserOption(knowledgeId,isMultiple,VismaterialId){
    $('#m_Rolebg li>p').off('click');
    $('#m_Rolebg li>img').off('click');
    $('#m_Rolebg li>p').on('click',function(){
        window.location.href='mustdo_test.html?knowledgeId='+knowledgeId+'&isMultiple='+isMultiple+'&subjectId='+Request.subjectId+'&VismaterialId='+VismaterialId+'&brushLevel='+$(this).parents('li').attr('data-value')+'&uuid='+Request.uuid;;
    });
    $('#m_Rolebg li>img').on('click',function(){
        window.location.href='mustdo_test.html?knowledgeId='+knowledgeId+'&isMultiple='+isMultiple+'&subjectId='+Request.subjectId+'&VismaterialId='+VismaterialId+'&brushLevel='+$(this).parents('li').attr('data-value')+'&uuid='+Request.uuid;;
    });
    $('#Close').on('click',function(){
        $('#m_Mask').fadeOut(150);
    });
}







