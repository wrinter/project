//Created by subo on 2017/3/27.
//报错
function optionsError(){
    $(".options_error").off("click");
    $(".options_error").on("click",function () {
        var questionId = $(this).attr("data-id");//题目id
        //错误类型
        $.ajax({
            type: "post",
            url: "/web/common/report/error",
            dataType: "json",
            success:function(data){
                var Data = data.retData;
                if(Data){
                    //结构
                    var div = '<div class="m_submitErrors_Main"><div class="m_submitErrors"><i class="spriteImg c_closeico fr c_closeimg0" id="c_closeG2"></i> <p>报错</p> <ul class="m_errorPointsBox"></ul><textarea name="" id="errorReason" maxlength="100"  placeholder="请输入错误原因(请输入100字以内)"></textarea><input type="button" class="m_submitErrorsSure" value="确&nbsp;定"><input type="button" class="m_submitErrorsCancel" value="取&nbsp;消"></div></div>';
                    //添加
                    if(!$("div").hasClass("m_submitErrors_Main")){
                        $("body").append(div);
                    }
                    //局部数据
                    var li="";
                    $.each(Data,function (i, obj) {
                        li += "<li class='m_errorPoints fl' id='" + obj.value + "'>" + obj.label + "</li>";
                    });
                    $(".m_errorPointsBox").html(li);
                    //刚进来时，清空报错原因
                    $('#errorReason').val("");
                    $(".m_submitErrors_Main").fadeIn(200);
                    //点击取消关闭弹窗
                    $(".m_submitErrorsCancel").click(function(e){
                        stopBubble(e);
                        $(".m_submitErrors_Main").fadeOut(200);
                    });
                    //点击x号关闭弹窗
                    $("#c_closeG2").click(function(e){
                        stopBubble(e);
                        $(".m_submitErrors_Main").fadeOut(200);
                    });
                    //点击选项
                    var errorType = null,
                        errorReason;
                    $(".m_errorPointsBox").on("click",".m_errorPoints",function(e){
                        stopBubble(e);
                        $(this).addClass("e_active").siblings().removeClass("e_active");
                        errorType=$(this).attr("id");
                        //前置检查
                        var _valLength = $("#errorReason").val().replace(/[^\x00-\xff]/g, 'ab').length;
                        if(_valLength > 0 && _valLength < 200){
                            $(".m_submitErrorsSure").css({"background-color":"#65b113","border-color":"#65b113"});
                        }
                    });
                    //输入检查
                    $("#errorReason").on("keyup",function(){
                        var _valLength = $(this).val().length;//.replace(/[^\x00-\xff]/g, 'ab').length;
                        //输入限制
                        //console.log(_valLength);
                        //前置检查
                        if($(".m_errorPointsBox li").hasClass("e_active") && _valLength > 0 && _valLength <= 100){
                            $(".m_submitErrorsSure").css({"background-color":"#65b113","border-color":"#65b113"});
                        }else{
                            $(".m_submitErrorsSure").removeAttr("style");
                        }
                    });
                    //点击确定按钮，检查，进行报错
                    $(".m_submitErrorsSure").on("click",function(e){
                        stopBubble(e);
                        errorReason=$("#errorReason").val();
                        var param={};
                        param.questionId=questionId;
                        param.errorType=errorType;
                        param.errorResean=errorReason;
                        if(errorType === null){
                            if(!$("div").hasClass("c_Dissolve")){
                                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                            }
                            $('#c_ErrorMsg').html('请选择错误类型').fadeIn(200);  Disappear("#c_ErrorMsg");
                        }else if(errorReason.replace(/[^\x00-\xff]/g, 'ab').length == 0){
                            if(!$("div").hasClass("c_Dissolve")){
                                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                            }
                            $('#c_ErrorMsg').html('请输入错误描述').fadeIn(200);  Disappear("#c_ErrorMsg");
                        }else if(errorReason.replace(/[^\x00-\xff]/g, 'ab').length > 200){
                            if(!$("div").hasClass("c_Dissolve")){
                                $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                            }
                            $('#c_ErrorMsg').html('请输入少于100字').fadeIn(200);  Disappear("#c_ErrorMsg");
                        }else{
                            $.ajax({
                                type: "post",
                                url: "/web/teacher/paper/assign/savequestionerror",
                                dataType: "json",
                                data:param,
                                success:function(data){
                                    if(data.retCode=="0000"){
                                        $(".m_submitErrors_Main").fadeOut(200);
                                        if(!$("div").hasClass("c_Dissolve")){
                                            $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                                        }
                                        $('#c_ErrorMsg').html('报错成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                                        $(".m_submitErrorsSure").off().removeAttr("style");//解除绑定,删除样式
                                    }else if(data.retCode=="1111"){
                                        if(!$("div").hasClass("c_Dissolve")){
                                            $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                                        }
                                        $('#c_ErrorMsg').html('失败，已达每日20次上限').fadeIn(200);  Disappear("#c_ErrorMsg");
                                        $(".m_submitErrorsSure").removeAttr("style");//删除样式
                                    }else{
                                        if(!$("div").hasClass("c_Dissolve")){
                                            $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                                        }
                                        $('#c_ErrorMsg').html('报错失败').fadeIn(200);  Disappear("#c_ErrorMsg");
                                    }
                                },
                                error:function () {
                                    if(!$("div").hasClass("c_Dissolve")){
                                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                                    }
                                    $('#c_ErrorMsg').html('报错失败,请检查网络').fadeIn(200);  Disappear("#c_ErrorMsg");
                                }
                            });
                        }
                    });
                }else{
                    if(!$("div").hasClass("c_Dissolve")){
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    }
                    $('#c_ErrorMsg').html("无法获取错误类型，请联系管理员").fadeIn(200);  Disappear("#c_ErrorMsg");
                }
            },
            error:function () {
                if(!$("div").hasClass("c_Dissolve")){
                    $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                }
                $('#c_ErrorMsg').html("无法获取错误类型，请联系管理员").fadeIn(200);  Disappear("#c_ErrorMsg");
            }
        });
    });
}
