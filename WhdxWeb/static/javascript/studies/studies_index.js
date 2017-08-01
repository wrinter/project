/**
 * Created by lgr on 2016/11/30.
 */
SystemRedMsg();
CheckBrower();
GetHtml("../../model/common/common.txt","#Header");
$(document).ready(function(){
    var $getCity = {
        init : function(a,b){   //调取省市接口
            var _this = this;
            $.ajax({
                type : "post",
                url : "/web/common/area ",
                dataType : "json",
                success : function(data){
                    var s_inxul = $(".s_inxul");
                    if(data.retCode == "0000"){
                        for(var i = 0 ; i < data.retData.length ; i++){
                            var Dtrue = data.retData[i];
                            var id = Dtrue.id;
                            var name = Dtrue.name;
                            $li = $("<li class='s_inxli fs24' id='"+id+"' >"+name+"</li>").appendTo(s_inxul);
                            if(name===a){
                                $(".s_inxareaname").attr("id",id).text(a);
                                var parmas = {};
                                parmas.parentId = id;
                                _this.Ajax(parmas,b)
                            }
                        }
                        $(".s_inxli").on("click",function(){
                            var id = $(this).attr("id");
                            var name = $(this).text();
                            $(this).closest(".s_inxul").siblings(".s_inxareaname").text(name).attr("provenicId",id);
                            var s_inxareanamecl = $(".s_inxareanamecl")
                            var s_inxulcl = $(".s_inxulcl");
                            s_inxulcl.html("");
                            var parmas = {};
                            parmas.parentId = id ;
                            _this.Ajax(parmas,null)
                        });
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        Ajax : function (parmas,b){
            var _this = this;
            $.ajax({
                type : "post",
                data : parmas,
                url : "/web/common/area",
                dataType : "json",
                success : function(data){
                    if(data.retCode == "0000"){
                        var s_inxareanamecl = $(".s_inxareanamecl");
                        var s_inxulcl = $(".s_inxulcl");
                        for(var j = 0 ; j < data.retData.length ; j++){
                            var tDtrue = data.retData[j];
                            var id = tDtrue.id;
                            var name = tDtrue.name;
                            var nameone = data.retData[0].name;
                            var idone = data.retData[0].id;
                            if(name == b){
                                s_inxareanamecl.text(b).attr("cityId",id);
                            }else{
                                s_inxareanamecl.text(nameone).attr("cityId",idone);
                            }
                            $li = $("<li class='s_inxlist fs24' cityId='"+id+"' >"+name+"</li>").appendTo(s_inxulcl);
                        }
                        $(".s_inxlist").on("click",function(){
                            var id = $(this).attr("cityId");
                            var name = $(this).text();
                            $(this).closest(".s_inxulcl").siblings(".s_inxareanamecl").text(name).attr("cityId",id);
                        });

                    }

                },
                error : function(e){
                    console.log(e)
                }
            })
        },
        Start : function(){
            //开始答题
            var _this = this;
            $(".s_inxbttn ").on("click",function(){
                _this.sessionStorge(); //存储id
                window.location.href = "studies_paper.html";
            })
        },
        onClick : function(){
            $(".s_inxselect").on("click",function(){  //点击城市的选择
                $(this).find(".s_inxul").toggle();
                $(".s_inxulcl").hide();//城市选择
            });
            $(".s_inxareaselect").on("click",function(){  //选择城市
                $(this).find(".s_inxulcl").toggle();
                $(".s_inxul").hide();//省市选择
            })
        },
        clickChoose : function (){   //筛选题
            $(".s_inxseled").on("click",function(){
                if(!$(this).hasClass("s_inxseleimg")){
                    $(this).addClass("s_inxseleimg").attr("menuId","0");
                    //$(".s_inxseleimg").removeClass("s_inxseled");
                }else{
                    $(this).attr("menuId","1").removeClass("s_inxseleimg");
                }
            });
            $(".s_inxseleimg").on("click",function(){
                if(!$(this).hasClass("s_inxseled")){
                    $(this).addClass("s_inxseled").attr("menuId","1");
                    $(this).removeClass("s_inxseleimg");
                }else{
                    $(this).addClass("s_inxseleimg");
                    $(this).attr("menuId","0").removeClass("s_inxseled");
                }
            });
        },
        sessionStorge : function(){
            //储存数据
            var paperid = {};
            paperid.areaId = $(".s_inxareanamecl").attr("cityId");
            //paperid.subjectId = $(".s_inxseled").attr("menuId");
            paperid.menuId = $(".s_inxseled").attr("menuId");
            sessionStorage.setItem("studies",JSON.stringify(paperid));
        },
        look : function(){
            $(".s_inxback").on("click",function(){
                window.location.href = "studies_record.html";
            })
        },
        Continue : function(){
            $.ajax({
                type : "post",
                url : "/web/teacher/modeltest/completedHistory",
                data : {status:"0",pageNum:"1",pageSize:"1"},
                success : function(data){
                    if(data.retCode == '0000'){
                        for(var i = 0;i<data.retData.list.length;i++){
                            var Dtrue = data.retData.list[i]
                            var paperName = Dtrue.paperName;
                            var id = Dtrue.id;
                            var startTime = Dtrue.startTime;
                            //var testTime = Dtrue.testTime;
                            //var score = Dtrue.score;
                            $(".s_lastdate").attr("id",id).text(startTime+""+paperName);
                        }
                    }else{
                        $(".s_lasttext,.s_radioimg,.s_delete").hide()
                        $(".s_inxgo").hide();
                    }
                },
                error : function(e){
                    console.log(e)
                }
            })
            $(".s_inxgo").on("click",function(){
                var id  = $(this).siblings(".s_lastdate").attr("id");
                sessionStorage.setItem("continueid",JSON.stringify(id));
                window.location.href = "studies_Continue.html"
            })
        },
        ip : function(){
            var _this = this,ip;
            var url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_='+Math.random();
            $.getJSON(url, function(data){
                ip = data.Ip;
                $.ajax({
                    type : "post",
                    url : "/web/teacher/modeltest/getMyAddress",
                    dataType : "json",
                    data:{"ip":ip},
                    success : function(data){
                        if(data.retCode == "0000"){
                            var retData = data.retData;
                            var retprovenice = retData.split("|");
                            if(retprovenice[0] == "北京市"){
                                retprovenice[0] = "北京"
                            }
                            if(retprovenice[0] == "上海市"){
                                retprovenice[0] = "上海"
                            }
                            if(retprovenice[0] == "重庆市"){
                                retprovenice[0] = "重庆"
                            }
                            if(retprovenice[0] == "天津市"){
                                retprovenice[0] = "天津"
                            }
                            _this.init(retprovenice[0],retprovenice[1]);
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                })
                _this.init();
            });
        },
        Dele : function(){
            $(".s_delete").on("click",function(){
                $(".s_lasttext,.s_radioimg,.s_delete").hide()
            })
        }
    }
        //$getCity.init();
    $getCity.ip();
    $getCity.onClick();
    $getCity.clickChoose();
    $getCity.look();
    $getCity.Continue();
    $getCity.Dele();
    $getCity.Start();
});