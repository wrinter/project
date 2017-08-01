/**
 * Created by lichao on 2017/1/19.
 */
$(document).ready(function(){
    var Student = {
        init : function(){
            this.clickobject();//变换学科
            this.clickdelete();//删除继续做题目录
            this.ip();//自动获取本地地址
            this.onClick();//选择城市
            this.clickfilter();//选择过滤
            this.Continue();//继续做题
            this.record();//做题记录
        },
        clickobject : function(){
            $(".model_a").on("click",function(){
                $(this).attr("src","../../static/image/modetest/s_right.png").addClass("addobject");
                $(".model_b").attr("src","../../static/image/modetest/s_no.png").removeClass("addobject");
                var subjectId= $(this).attr("subjectId");
            });
            $(".model_b").on("click",function(){
                $(this).attr("src","../../static/image/modetest/s_right.png").addClass("addobject");
                $(".model_a").attr("src","../../static/image/modetest/s_no.png").removeClass("addobject");;
                var subjectId= $(this).attr("subjectId");
            });
        },
        clickdelete : function(){
            $(".model_delete").on("click",function(){
                $(".laba,.s_lasttext,.model_delete").hide();
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
        ip : function(){
            var _this = this,ip;
            var url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_='+Math.random();
            $.getJSON(url, function(data) {
                ip = data.Ip;
                $.ajax({
                    type : "post",
                    url : "/web/student/modeltest/getAddress",
                    dataType : "json",
                    data:{"ip":ip},
                    success : function(data){
                        console.log(data)
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
                            _this.getProvince(retprovenice[0],retprovenice[1]);
                        }
                    },
                    error : function(e){
                        console.log(e)
                    }
                })
                _this.getProvince();
            })
        },
        getProvince : function(a,b){   //调取省市接口
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
                            var s_inxareanamecl = $(".s_inxareanamecl");
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
        Ajax : function (parmas,b){//获取城市级别的名称
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
                            ////开始答题
                            //$(".s_inxbttn ").on("click",function(){
                            //    _this.sessionStorge(); //存储id
                            //    window.open("studies_paper.html");
                            //}
                            $(".s_inxbttn").on("click",function(){
                                _this.stratpaper();
                                window.location.href = "model_paper.html";
                            })
                        }

                    },
                    error : function(e){
                        console.log(e)
                    }
                })
            },
        clickfilter : function (){
            $(".s_inxseleimg").on("click",function(){
                if(!$(this).hasClass("addimg")){
                    $(this).addClass("addimg").attr("src","../../static/image/modetest/filiter.png").attr("menuid","1");
                }else{
                    $(this).removeClass("addimg").attr("src","../../static/image/modetest/nofiliter.png").attr("menuid","0");
                }
            })
        },
        stratpaper : function(){//存储参数
            var paper = {};
            paper.areaId = $(".s_inxareanamecl").attr("cityid");
            paper.subjectId = $(".addobject").attr("subjectid");
            paper.completed = $(".s_inxseleimg").attr("menuid");
            sessionStorage.setItem("paper",JSON.stringify(paper))
        },
        Continue : function(){//继续答题
            $.ajax({
                type : "post",
                url : "/web/student/modeltest/lastRecord",
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
                        $(".laba,.s_lasttext,.model_delete").hide();
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
                window.location.href = "Continue.html";
            })
        },
        record : function(){
            $(".s_inxback").on("click",function(){
                window.location.href = "model_recod.html";
            })
        }
    }


    Student.init();//初始化
})