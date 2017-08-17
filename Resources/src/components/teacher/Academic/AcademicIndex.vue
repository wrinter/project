<template>
<div class="AcademicIndex">
    <div class="AcademicContine">
        <span class="horn"></span>
        <span>上次未做完试题：2017/05/06山东省莒南县第三中学高一期中考试</span>
        <span class="ContineDo">继续做题</span>
        <span class="ContineDelete"></span>
        <span class="clickRecord">做题记录</span>
    </div>
    <div class="AcademicArea">
        <p class="AcademicAreaP">
            <span class="AcademicAreaPword">地区:</span>
            <span class="ShowPname">
                <span class="clickShowPname" @click="clickProince">{{showPname}}</span>
                <span class="line"></span>
                <span class="pull"></span>
                <ul class="AcdeP" v-show="isP === true">
                    <li class="AcdeclickP" v-for="data in datas" @click="getCity(data.id,data.name)">{{data.name}}</li>
                </ul>
            </span>
        </p>
        <p class="AcademicAreaC">
            <span class="ShowCname">
                <span class="clickShowCname" @click="clickCity(CityId)">{{showCname}}</span>
                <span class="line"></span>
                <span class="pull"></span>
                <ul class="AcdeC" v-show="isC === true">
                    <li v-for="City in Citys" @click="ShowCity(City.id,City.name)">{{City.name}}</li>
                </ul>
            </span>
        </p>
        <p class="clickSelect">
            <span class="AcaSelect"></span>
            <span>过滤已做过的题</span>
        </p>
        <p class="clickStartPaper" @click="doPaper">开始答题</p>
    </div>
</div>
</template>
<script type="text/ecmascript-6">
import $ from 'jquery'
export default {
    data () {
        return {
            'isfirstCity': false,
            'Ip': '',
            'datas': '',
            'dataId': '', // 省 id
            'isP': true,
            'showPname': '请选择',
            'Citys': '',
            'CityId': '', // 市 id
            'isC': false,
            'showCname': '请选择'
        }
    },
    mounted () {
        this.ip()
        this.getProince()
    },
    methods: {
//        ip获取
        ip () {
            let url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=' + Math.random()
            $.getJSON(url, function (data) {
                let Ip = data.Ip
                sessionStorage.setItem('ip', Ip)
            })
            let Ip = sessionStorage.getItem('ip')
            this.Ip = Ip
            this.CurrentPath(this.Ip)
        },
        CurrentPath (Ip) {
            let parmas = {}
            parmas.ip = Ip
            this.$http.post('/web/teacher/modeltest/getMyAddress', parmas, {'emulateJSON': true}).then((response) => {
                let data = response.data
                console.log(data)
                let ProCity = data.retData.split('|')
                console.log(ProCity)
                this.showPname = ProCity[0]
                this.showCname = ProCity[1]
            })
        },
//        省份
        getProince () {
            this.isC = false // 单独点击省的时候市区的要消失
            this.$http.post('/web/common/area').then((response) => {
                let data = response.body
                this.datas = data.retData
                console.log(data)
            })
            this.ShowPlist() // 省
        },
        clickProince () {
            this.isC = false // 单独点击省的时候市区的要消失
            this.isfirstCity = true // 点击城市
            this.ShowPlist() // 省
        },
//        城市
        getCity (id, Proname) {
            this.showPname = Proname
            this.dataId = id
            let parmas = {}
            parmas.parentId = id
            this.$http.post('/web/common/area', parmas).then((response) => {
                let data = response.body
                this.Citys = data.retData
                this.showCname = data.retData[0].name
                this.CityId = data.retData[0].id
                console.log(data)
            })
            this.ShowPlist() // 省
        },
//        点击城市获取
        clickCity () {
            if (this.isfirstCity === false) {
                return false
            }
            let parmas = {}
            parmas.parentId = this.dataId
            this.$http.post('/web/common/area', parmas).then((response) => {
                let data = response.body
                this.Citys = data.retData
                console.log(data)
            })
            this.ShowClist()
        },
        doPaper () {
            this.$router.push('/content/teacher/Academic/AcademicDo?areaId=' + this.CityId)
        },
        ShowCity (id, name) {
            this.CityId = id
            this.showCname = name
//            市的显示和隐藏
            this.ShowClist()
            console.log(id, name)
        },
//       城市的显示和消失
        ShowPlist () {
//            省的显示和隐藏
            if (this.isP === false) {
                this.isP = true
            } else {
                this.isP = false
            }
        },
//        省份的列表
        ShowClist () {
            if (this.isC === false) {
                this.isC = true
            } else {
                this.isC = false
            }
        }
    }
}
</script>
<style>
.AcademicIndex{
    width:900px;
    height: 432px;
    background: #fff;
    border-radius: 10px;
    margin: 40px auto;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    padding-bottom: 20px;
}
.Crumbs{
    float: none;
}
.Se_MainBox{
    padding-bottom: 30px;
}
.AcademicContine{
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    line-height: 60px;
    font-size: 16px;
    color: #666;
}
.horn{
    display: inline-block;
    width:35px;
    height: 35px;
    background:url("/static/teacher/images/Academic/studiesimg.png") 0 0 repeat;
    vertical-align: middle;
    margin-left: 20px;
}
.ContineDo{
    color: #49b9df;
    text-decoration:underline;
    margin-left: 10px;
    cursor: pointer;
}
.ContineDelete{
    display: inline-block;
    width:15px;
    height: 20px;
    background:url("/static/teacher/images/Academic/studiesimg.png")  -52px 0 no-repeat;
    vertical-align: middle;
    margin-left: 10px;
    cursor: pointer;
}
.clickRecord{
    display: block;
    float: right;
    width: 150px;
    height: 45px;
    border-radius: 10px;
    box-sizing: border-box;
    /* background: #e5e4e5; */
    background: url("/static/teacher/images/Academic/s_inxback_03.png");
    border: 1px solid #ccc;
    border-top: 0;
    line-height: 45px;
    text-align: center;
    margin-top: 7.5px!important;
    margin-right: 25px!important;
    cursor: pointer;
}
/*地区*/
.AcademicAreaP{
    text-align: center;
    margin-top: 64px;
    color: #666;
}
.AcademicAreaPword{
    margin-right: 20px;
    font-size: 18px;
    color: #666;
}
    .ShowPname,.ShowCname{
        display: inline-block;
        width:327px;
        height: 46px;
        border:1px solid #ccc;
        vertical-align: middle;
        border-radius: 10px;
        line-height: 46px;
        position: relative;
    }
    .AcdeP{
        position: absolute;
        width:270px;
        height: 300px;
        background: #fff;
        border:1px solid #ccc;
        box-sizing: border-box;
        z-index: 99999;
        left:2px;
        top:50px;
        overflow: auto;
        border-radius: 10px;
    }
    .AcdeC{
        position: absolute;
        width:270px;
        height: 300px;
        background: #fff;
        border:1px solid #ccc;
        box-sizing: border-box;
        z-index: 99999;
        left:2px;
        top:50px;
        overflow: auto;
        border-radius: 10px;
    }
    .AcdeP li ,.AcdeC li{
        line-height: 60px;
        cursor: pointer;
    }
    .clickShowPname,.clickShowCname{
        display: block;
        width:270px;
        height: 46px;
        line-height: 46px;
        float: left;
        text-align: center;
        cursor: pointer;
        font-size: 18px;
    }
    .line{
        display: block;
        width:1px;
        height: 30px;
        margin-top: 8px;
        background: #ccc;
        float: left;
    }
    .pull{
        display: block;
        width:25px;
        height: 25px;
        float: left;margin-left: 20px;
        background: url("/static/teacher/images/Academic/spriteImg.png") -168px 0 no-repeat;
        margin-top: 20px;
    }
    /*城市*/
    .AcademicAreaC{
        text-align: center;
        margin-left: 65px;
        margin-top: 40px;
        color: #666;
    }
    .clickSelect{
        line-height: 30px;
        margin-top: 48px;
    }
    .AcaSelect{
        display: block;
        float: left;
        width: 26px;
        height: 26px;
        margin-left: 395px!important;
        margin-top: 5px!important;
        cursor: pointer;
        background: url("/static/teacher/images/Academic/studiesimg.png") -70px -1px no-repeat;
        vertical-align: middle;
        margin-right: 10px;
    }
    .clickStartPaper{
        display: inline-block;
        width: 320px;
        height: 50px;
        background: #65b113;
        color: #fff;
        border-radius: 10px;
        line-height: 50px;
        cursor: pointer;
        text-align: center;
        margin-left: -110px;
        margin-top: 25px;
    }
</style>
