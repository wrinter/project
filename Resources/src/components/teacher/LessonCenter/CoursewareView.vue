<template>
<div class="Courseware">
    <div class="CoursewareName">{{title}}</div>
    <div class="CoursewarePlay">
        <v-Courseware :PPTid="PPTid" v-bind:to=" 'http://ow365.cn/?i='+officeWebId+'&n=5&furl='+url " @Curl="getCurl">
        </v-Courseware>
        <iframe  id="iframeReload" :src="src" frameborder="0" width="100%" scrolling="No" height="500" leftmargin="0" topmargin="0"></iframe>
    </div>
    <div class="Clickfunction">
        <div class="clickG">
            <span class="clickGood" @click="Good" :class="isClickGoodD === false ? clickNoGood : '' "></span>
            <span class="clickGoodD">({{clickGoodD}})</span>
        </div>
        <span class="Cshare"></span>
        <div class="Cdownload">
            <span class="Download" @click="Judge">下载</span>
            <span class="DownloadWord">10金币</span>
        </div>
    </div>
</div>
</template>
<script type="text/ecmascript-6">
import {UrlSearch} from '../../../common/js/request'
 import Courese from './CourseOffice'
export default {
    data () {
        return {
            'flag': '',
            'clickNoGood': 'clickNoGood',
            'PPTid': UrlSearch('id'),
            'title': '',
            'path': '',
            'url': '',
            'officeWebId': '',
            'src': '',
            'clickGoodD': 1615,
            'isClickGoodD': true,
            'bucketName': '',
            'categoryId': '',
            'objectKey': '',
            'documentId': ''
        }
    },
    components: {
        'v-Courseware': Courese
    },
    mounted () {
        this.thisdo()
    },
    methods: {
        thisdo () {
            let parmas = {}
            parmas.resId = this.PPTid
            this.$http.post('/web/teacher/courseware/details', parmas).then((response) => {
                let data = response.body
                console.log(data)
                let Dtrue = data.retData.resResourseRes
                this.title = Dtrue.title
                this.documentId = Dtrue.documentId
                this.bucketName = Dtrue.bucketName
                this.objectKey = Dtrue.objectKey
                this.flag = data.retData.flag
                if (this.flag === true) {
                    this.isClickGoodD = false
                }
            })
        },
        getCurl (Curl) {
            this.url = Curl.url
            this.officeWebId = Curl.officeWebId
            this.src = 'http://ow365.cn/?i=' + this.officeWebId + '&n=5&furl=' + this.url
        },
        Good () {
            let id = this.PPTid
            let parmas = {}
            parmas.resId = id
            if (this.isClickGoodD === false) {
                return false
            }
            this.$http.post('/web/teacher/prepare/like', parmas).then((response) => {
                let data = response.body
                console.log(data)
                if (data.retCode === '0000') {
                    this.isClickGoodD = false
                    this.clickGoodD = this.clickGoodD + 1
                }
            })
        },
        Judge () {
            let SubData = {}
            SubData.resourceId = this.PPTid
            SubData.type = 'pptDownload'
            SubData.resType = '3'
            this.$http.post('/web/teacher/download/obtain', SubData).then((response) => {
                let data = response.body
                console.log(data)
                if (data.retData === '1') {
                    this.Download()
                }
            })
        },
        Download () {
            let DubData = {}
            DubData.objectKey = this.objectKey
            DubData.bucketName = this.bucketName
            DubData.expirationInSeconds = -1
            this.$http.post('/web/common/baidudownload', DubData).then((response) => {
                let data = response.bodyText
                console.log(data)
                if (data) {
                    window.location.href = data
                } else {
                    alert('下载地址无效')
                }
            })
        }
    }
}
</script>
<style>
.Courseware{
    width:900px;
    min-height: 500px;
    margin:40px auto;
}
.Crumbs{
    float: none;
}
.Se_MainBox{
    padding-bottom: 30px;
}
.CoursewarePlay{
    width: 100%!important;
    min-height: 500px;
    background: #333;
    overflow: hidden;
    margin-top: 30px;
}
.Clickfunction{
    width: 100%;
    height: 60px;
    background: #fff;
    line-height: 60px;
    overflow: hidden;
    position: relative;
}
.clickG{
    width:150px;
    height: 40px;
    margin-left: 5px;
    border-right: 1px solid #ccc;
    margin-top: 10px;
    line-height: 40px;
}
.clickGood{
    display: inline-block;
    width:25px;
    height: 25px;
    background: url("/static/teacher/images/Exemplar/video_nook.png");
    margin-left: 45px;
    margin-top: 5px;
    float: left;
    cursor: pointer;
}
.clickNoGood{
    display: inline-block;
    width:25px;
    height: 25px;
    background: url("/static/teacher/images/Exemplar/video_ok.png");
    margin-left: 45px;
    margin-top: 5px;
    float: left;
}
.clickGoodD{
    float: left;
    margin-left: 10px;
    color: #666;
    font-size: 12px;
}
    .Cdownload{
        width:300px;
        height: 60px;
        float: right;
        position: absolute;
        right: 0;
        top:0;
    }
    .Download{
        display: inline-block;
        width:120px;
        height: 40px;
        background: #65b113;
        line-height: 40px;
        text-align: center;
        color: #fff;
        border-radius: 10px;
        margin-left: 60px;
        cursor: pointer;
    }
    .DownloadWord{
        color: #666;
        margin-left: 10px;
        font-size: 12px;
    }
</style>
