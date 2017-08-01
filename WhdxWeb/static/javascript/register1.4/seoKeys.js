/**
 * Created by lc on 2017/6/19.
 */
function Obj(){};
Obj.prototype = {
    init : function(){
        var parmas = {};
        parmas.code = "register_keys";
        $.ajax({
            type : "post",
            url : "/web/common/pcSysAlert",
            data : parmas,
            dataType : "json",
            success : function(data){
                console.log(data)
                var str=data.retData;
                str=str.replace(/\&lt;/g,'')
                str=str.replace(/\&gt;/g,'')
                str=str.replace(/\&quot;/g,'')
                str=str.replace(/\&amp;quot;/g,'')
                str=str.replace(/\&amp;nbsp;/g, "");
                str=str.replace(/\&amp;#39;/g,"");
                str=str.replace(/p/g,"");
                str=str.replace("/","");
                var $meta0 = $("<meta name='description' content='"+str+"' />").prependTo("head");
            },
            error : function(e){
                console.log(e)
            }
        })
        $.ajax({
            type : "post",
            url : "/web/common/pcSysAlert",
            data : {code:"keyword"},
            dataType : "json",
            success : function(data){
                console.log(data)
                var str=data.retData;
                str=str.replace(/\&lt;/g,'')
                str=str.replace(/\&gt;/g,'')
                str=str.replace(/\&quot;/g,'')
                str=str.replace(/\&amp;quot;/g,'')
                str=str.replace(/\&amp;nbsp;/g, "");
                str=str.replace(/\&amp;#39;/g,"'");
                str=str.replace(/p/g,"");
                str=str.replace("/","");
                var $meta1 = $("<meta name='keywords' content='"+str+"' />").prependTo("head");
            },
            error : function(e){
                console.log(e)
            }

        })
    }
}
var Obj = new Obj();
Obj.init();
