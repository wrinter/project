//Created by subo on 2017/3/29.
function deleteMyList(){
    $(".myWork_del").on("click",function () {
        var thisData = {},
            _this = $(this),
            _id = $(this).attr("id"),
            _asid = $(this).attr("asid");
        thisData.paperId = _id;
        thisData.assignId = _asid;
        //确认？
        var errorUrl = "<div class='data_Popup del_Error'><div class='in'><span class='close'>关闭</span><img src='../../static/image/test/list_ErrorUrl_bg.jpg' /><div class='btn'><a class='btn_yes' href='javascript:;'>是的</a><a class='btn_no' href='javascript:;'>取消</a></div></div></div>";
        if(!$("div").hasClass("del_Error")){
            $("body").prepend(errorUrl);
        }
        $(".del_Error").fadeIn(200);
        //事件
        $(".del_Error .btn_yes").off("click");
        $(".del_Error .btn_yes").on("click",function(){
            $.ajax({
                type: "post",
                url: "/web/teacher/paper/assign/delete",
                data: thisData,
                dataType:"json",
                success: function (data) {
                    $(".del_Error").fadeOut(200);
                    if(data.retCode === "0000"){
                        if(!$("div").hasClass("c_Dissolve")){
                            $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                        }
                        $('#c_ErrorMsg').html('删除成功').fadeIn(200);  Disappear("#c_ErrorMsg");
                        $(_this).parent().parent().remove();

                    }else {
                        if(!$("div").hasClass("c_Dissolve")){
                            $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                        }
                        $('#c_ErrorMsg').html('删除失败').fadeIn(200);  Disappear("#c_ErrorMsg");
                    };
                },
                error: function () {
                    $(".del_Error").fadeOut(200);
                    if(!$("div").hasClass("c_Dissolve")){
                        $("body").prepend("<div class='c_Dissolve dino' id='c_ErrorMsg'></div>");
                    }
                    $('#c_ErrorMsg').html('请求失败').fadeIn(200);  Disappear("#c_ErrorMsg");
                }
            });
        });
        $(".del_Error .btn_no,.del_Error .close").on("click",function(){
            $(".del_Error").fadeOut(200);
        });
    });
}
