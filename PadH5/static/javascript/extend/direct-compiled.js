/**
 * Created by Echonessy on 2017/7/26.
 */
var ThisVue = new Vue({
    el: '#Direct',
    data: {
        Data: '',
        Content: '',
        IsUp: false,
        IsDown: false,
        UpArtName: '',
        DownArtName: '',
        ArtIndex: '',
        CanUpDown: false,
        ReceiveData: store.get('DirectData')
    },
    mounted: function () {
        this.Init();
    },
    methods: {
        Init() {
            this.ArtIndex = parseInt(Request.index);
            this.AboutAjax();
        },
        AboutAjax: function () {
            var SubData = {};
            var that = this;
            SubData.id = Request.id;
            $.ajax({
                type: "post",
                url: "/pad/teacher/catlogarticle/article",
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
        ResetContent: function (data) {
            var str = data;
            str = str.replace(/\&lt;/g, '<');
            str = str.replace(/\&gt;/g, '>');
            str = str.replace(/\&quot;/g, '"');
            str = str.replace(/\&amp;quot;/g, '"');
            str = str.replace(/\&amp;nbsp;/g, "");
            str = str.replace(/\&amp;nbsp;/g, "");
            str = str.replace(/\&middot;/g, "·");
            str = str.replace(/\&rdquo;/g, "”");
            str = str.replace(/\&ldquo;/g, "“");
            this.Content = str;
        },
        GetData: function (data) {
            this.Data = data;
            if (this.isEmptyObject(this.Data.content)) {
                this.ResetContent(this.Data.content);
            }
            this.JudePage(this.ArtIndex);
        },
        JudePage: function (index) {
            index = parseInt(index);
            var Leg = this.ReceiveData.length;
            if (Leg > 1) {
                this.CanUpDown = true;
                if (index === 0) {
                    this.IsUp = false;
                    this.IsDown = true;
                    this.DownArtName = this.ReceiveData[index + 1].title;
                } else if (index === this.ReceiveData.length - 1) {
                    this.IsUp = true;
                    this.IsDown = false;
                    this.UpArtName = this.ReceiveData[index - 1].title;
                } else {
                    this.IsUp = true;
                    this.IsDown = true;
                    this.DownArtName = this.ReceiveData[index + 1].title;
                    this.UpArtName = this.ReceiveData[index - 1].title;
                }
            } else {
                this.CanUpDown = false;
                this.IsUp = false;
                this.IsDown = false;
            }
        },
        ChangeArt: function (rule) {
            this.ArtIndex = this.ArtIndex + rule;
            window.location.href = 'direct.html?id=' + this.ReceiveData[this.ArtIndex].id + '&index=' + this.ArtIndex;
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

//# sourceMappingURL=direct-compiled.js.map