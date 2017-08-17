/**
 * Created by Echonessy on 2017/7/26.
 */
var ThisVue = new Vue({
    el: '#Art_Main',
    data: {
        Player: '',
        AudioSrc: '../../plugin/slice.mp3',
        ShowTrans: false,
        TransBtnTxt: '查看翻译',
        Data: '',
        author: '',
        Content: '',
        TransContent: '',
        IsUp: false,
        IsDown: false,
        UpArtName: '',
        DownArtName: '',
        ArtIndex: '',
        CanUpDown: false,
        ReceiveData: store.get('ReadArtData')
    },
    mounted: function () {
        this.Init();
    },
    methods: {
        Init: function () {
            this.ArtIndex = parseInt(Request.index);
            this.AboutAjax();
        },
        InitPlayer: function () {
            this.Player = new EchoPlayer();
            this.Player.config({
                ele: '#ThisAudio', //绑定的DOM
                ClassPrefix: 'ComPlayer', //自定义播放器的标识类名
                ClassPrefixPosition: 'fixed' //自定义播放器的布局方式fixed 特殊 默认auto
            });
        },
        Command: function () {
            javascript: bc.recommend2cls(Request.id);
        },
        ShowTransEvt: function () {
            this.ShowTrans = !this.ShowTrans;
            if (this.ShowTrans) {
                this.TransBtnTxt = '收起翻译';
            } else {
                this.TransBtnTxt = '查看翻译';
            }
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
        ResetTrans: function (data) {
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
            str = str.replace(/\&amp;nbsp;/g, " ");
            str = str.replace(/\&rsquo;/g, "'");
            this.TransContent = str;
        },
        GetData: function (data) {
            this.Data = data;
            this.AudioSrc = this.Data.url;
            $('#ThisAudio').attr('src', this.AudioSrc);
            this.InitPlayer();
            if (this.isEmptyObject(this.Data.subtitle)) {
                this.author = this.Data.subtitle.replace(/\&middot;/g, "·");
            }
            if (this.isEmptyObject(this.Data.content)) {
                this.ResetContent(this.Data.content);
                this.ResetTrans(this.Data.contentTrans);
            }
            this.JudePage(this.ArtIndex);
            $('#Title').html(this.Data.title);
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
            window.location.href = 'engart.html?id=' + this.ReceiveData[this.ArtIndex].id + '&index=' + this.ArtIndex;
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

//# sourceMappingURL=engart-compiled.js.map