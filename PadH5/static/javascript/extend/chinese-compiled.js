/**
 * Created by Echonessy on 2017/7/25.
 */
var ThisVue = new Vue({
    el: '#Chinese',
    data: {
        Data: ''
    },
    mounted: function () {
        this.AboutAjax();
    },
    methods: {
        AboutAjax: function () {
            var SubData = {};
            var that = this;
            SubData.codeId = Request.codeId;
            // SubData.codeId = '09';
            SubData.uuid = Request.uuid;
            // SubData.uuid = '73be6077185bd50eefbb5ee60bee4e0c';
            $.ajax({
                type: "post",
                url: "/pad/teacher/catlogarticle/articleListForGxmw",
                dataType: "json",
                data: SubData,
                success: function (data) {
                    var Code = data.retCode;
                    if (Code == '0000') {
                        that.GetData(data.retData);
                    }
                }
            });
        },
        GetData: function (data) {
            this.Data = data;
        },
        ToArt: function (index, data) {
            var Arr = [];
            for (var i = 0; i < data.length; i++) {
                var Obj = {};
                Obj.categoryId = data[i].childrens[0].categoryId;
                Obj.id = data[i].childrens[0].id;
                Obj.title = data[i].childrens[0].title;
                Obj.index = i;
                Arr.push(Obj);
            }
            store.set("ArtData", Arr);
            window.location.href = 'comart.html?id=' + Arr[index].id + '&index=' + index;
        },
        ToDirect: function (index, data) {
            var Arr = [];
            for (var i = 0; i < data.length; i++) {
                var Obj = {};
                Obj.categoryId = data[i].categoryId;
                Obj.id = data[i].id;
                Obj.title = data[i].title;
                Obj.index = i;
                Arr.push(Obj);
            }
            store.set("DirectData", Arr);
            window.location.href = 'direct.html?id=' + Arr[index].id + '&index=' + index;
        },
        isEmptyObject: function (obj) {
            if (obj) {
                return true;
            } else if (obj === '') {
                return false;
            } else {
                return false;
            }
        }
    }
});

//# sourceMappingURL=chinese-compiled.js.map