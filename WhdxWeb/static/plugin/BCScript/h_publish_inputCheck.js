//Created by subo on 2017/3/30.
//输入验证
function checkes(){
    var _oldVal = "";
    $(".t_time,.average,.score_val").on("focus",function(){
        $(this).hasClass("score_val") ? _oldVal = $(this).val() == "分" || $(this).val() == "" ? "0" : Math.abs(parseInt($(this).val()).toString()) : _oldVal = Math.abs(parseInt($(this).val()));
    });
    $(".t_time,.average,.score_val").on("blur",function(){
        if($(this).val() == "" || $(this).val() == "分"){
            $(this).hasClass("score_val") ? $(this).val("0分") : $(this).val("0");
        }
        if($(this).hasClass("score_val")){
            if($(this).val().indexOf("分") == -1){
                $(this).val($(this).val() + "分");
            }
        }
    });
    $(".t_time,.average,.score_val").on("keyup",function(){
        var _val = $(this).hasClass("score_val") ? $(this).val() == "分" || $(this).val() == "" ? "" : $(this).val().replace("分","") : $(this).val();
        if(_val != "" && !checkNum(_val)){
            $(this).hasClass("score_val") ? $(this).val(_oldVal + "分") : $(this).val(_oldVal);
        }else{
            _val < 0 ? _oldVal = Math.abs(_val) : _oldVal = _val;
            _val <= 999 ? _oldVal = _val : $(this).hasClass("score_val") ? $(this).val("999分") : $(this).val("999");
        }
    });
}
//数字检查
function checkNum(value){
    var reg = /^\d+$/;
    if(value.constructor === String && value >= 0){
        var re = value.match(reg);
        if(re){
            return true;
        }
    }
    return false;
}