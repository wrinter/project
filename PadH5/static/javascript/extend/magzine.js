/**
 * Created by Echonessy on 2017/7/26.
 */
var ThisVue = new Vue({
    el: '#Magazine',
    data: {
        Data:''
    },
    mounted:function(){
        this.AboutAjax()
    },
    methods:{
        AboutAjax:function () {
            var SubData = {};
            var that = this
            SubData.codeId = Request.codeId;
            // SubData.codeId = '10';
            SubData.uuid = Request.uuid;
            // SubData.uuid = '73be6077185bd50eefbb5ee60bee4e0c';
            $.ajax({
                type : "post",
                url : "/pad/teacher/catlogarticle/articleListForTzts",
                dataType : "json",
                data:SubData,
                success : function(data){
                    var Code = data.retCode;
                    if (Code == '0000') {
                        that.Data = data.retData
                    }
                }
            })
        },
        ToArt:function (index,data) {
            var Arr = []
            for (var i=0;i<data.length;i++) {
                var Obj = {}
                Obj.categoryId = data[i].categoryId
                Obj.id = data[i].id
                Obj.title = data[i].title
                Obj.index = i
                Arr.push(Obj)
            }
            store.set("ArtData",Arr)
            window.location.href = 'comart.html?id='+Arr[index].id+'&index='+index
        },
        isEmptyObject:function(obj) {
            if (obj) {
                return true
            } else if (obj === '') {
                return false
            } else {
                return false
            }
        }
    }
})
