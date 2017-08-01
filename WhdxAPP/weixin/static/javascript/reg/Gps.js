/****************************定位 By EchoVue 2017.05.17**********************************/
//用户选择学校
UserSchool()
function UserSchool() {
    $("#SchoolSelect").on('click',function () {
        $("#Teacher").css('display','none');
        $("#SchoolBox").fadeIn(150);
    });
}
// 百度地图API功能
BaiduApI();
function BaiduApI() {
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(data){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var Coord=data.point;
            var lng=Coord.lng;
            var lat=Coord.lat;
            GetCoord(lng,lat)
        }
        else {
            $("#AllAdress").html('定位失败');
        }
    },{enableHighAccuracy: true});
};
//获取坐标
function GetCoord(lan,lat) {
    var SubData={};
    SubData.lat=lat;
    SubData.lan=lan;
    $.ajax({
        "type":"post",
        "url":"  /api/wx/basic/getUserLocation",
        "dataType":"json",
        "data":SubData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatAdress(AllData)
            }else {

            }
        }
    });
};
//创建坐标
function CreatAdress(data) {
    if(data==null||data==''){
        $("#AllAdress").html('定位失败');
        GetArea();
    }else {
        $("#AllAdress").html(' ');
        var province=data.province;
        var provinceId=data.provinceId;
        var city=data.city;
        var cityId=data.cityId;
        var district=data.district;
        var districtId=data.districtId;
        if(district==''||district==null){
            $("#Provice").html(province).attr('data-Id',provinceId);
            $("#City").html(city).attr('data-Id',cityId);
        }else {
            $("#Provice").html(province).attr('data-Id',provinceId);
            $("#City").html(city).attr('data-Id',cityId);
            $("#Contry").html(district).attr('data-Id',districtId);
        }
        GetSchool();
        GetArea();
    }
};
//获取城市区域
function GetArea() {
    $.ajax({
        "type":"post",
        "url":"  /api/common/area",
        "dataType":"json",
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatLarea(AllData[0].child);
            }else {

            }
        }
    });
};
//创建Larea
function CreatLarea(data) {
    var ProVinceData= Provindata(data);
    var CityData= GetCity(data);
    var ContryData= GetContry(data);
    StartLArea(ProVinceData,CityData,ContryData)
}
//省数据重构
function Provindata(data) {
    var ProVinceArr=[];
    for(var i=0;i<data.length;i++){
        var Obj={};
        Obj.name=data[i].name;
        Obj.id=data[i].id;
        ProVinceArr.push(Obj)
    }
    return ProVinceArr;
};
//市数据重构
function GetCity(data) {
    var CityArr=[];
    for(var i=0;i<data.length;i++){
        var Arr=[];
        for(var j=0;j<data[i].child.length;j++){
            var CityData=data[i].child[j];
            var Obj={};
            Obj.name=CityData.name;
            Obj.id=CityData.id;
            Arr.push(Obj);
            CityArr[data[i].id]=Arr;
        }
    }
    return CityArr;
}
//区数据重构
function GetContry(data) {
    var ContryArr=[];
    for(var i=0;i<data.length;i++){
        for(var j=0;j<data[i].child.length;j++){
            var CityData=data[i].child[j];
            var Arr=[];
            for(var k=0;k<CityData.child.length;k++){
                var ContryData=CityData.child[k];
                var Obj={};
                Obj.name=ContryData.name;
                Obj.id=ContryData.id;
                Arr.push(Obj);
                ContryArr[CityData.id]=Arr;
            }
        }
    }
    return ContryArr;
};
//启动选择器
function StartLArea(Pro,City,Con) {
    var LAreaMain = new LArea();
    LAreaMain.init({
        'trigger': '#Adress',
        'keys': {id: 'id', name: 'name'},
        'type': 2,
        'data': [Pro, City, Con]
    });

};
//获取学校
function GetSchool() {
    var subData = {};
    var ContryId= $("#Contry").attr('data-Id');
    subData.provinceId = $("#Provice").attr('data-Id');
    subData.cityId = $("#City").attr('data-Id');
    subData.schoolName = $("#SearchInput").val();
    if(ContryId==''||ContryId==null||ContryId==undefined||ContryId=='undefined'){
        subData.countyId = '';
    }else {
        subData.countyId = ContryId;
    }
    $.ajax({
        "type":"post",
        "url":"/api/wx/basic/school",
        "dataType":"json",
        "data":subData,
        success:function(data){
            var codenum =parseInt(data.retCode.substr(0, 1)) ;
            var AllData=data.retData;
            if(codenum==0){
                CreatSchool(AllData)
            }
            else {

            }
        }
    });
};
//判断对象是否为空
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
//创建学校
function CreatSchool(data) {
    var $Html='';
    if(isEmptyObject(data)){
        $Html+='<li>';
        $Html+='<p class="Spell">暂无学校</p>';
        $Html+='</li>';
    }else {
        for(var i in data){
            var SpellData=data[i];
            $Html+='<li>';
            $Html+='<p class="Spell">'+i+'</p>';
            $Html+='<ul class="SchoolList">';
            for(var j=0;j<SpellData.length;j++){
                $Html+='<li data-Id="'+SpellData[j].id+'">'+SpellData[j].schoolName+'</li>';
            }
            $Html+='</ul>';
            $Html+='</li>';
        }
    }
    $("#SchoolListBox").html($Html);
    SchoolChoice()
};
//学校选择
function SchoolChoice() {
    $(".SchoolList li").off('click');
    $(".SchoolList li").on('click',function () {
        var Id=$(this).attr('data-Id');
        $("#School").html($(this).html()).attr('data-Id',Id);
        $("#SchoolBox").css('display','none');
        $("#Teacher").fadeIn(150);
    })
};
//用户选择学校
SearchSchool()
function SearchSchool() {
    $("#SearchInput").on("input propertychange",function(){GetSchool()})
}



