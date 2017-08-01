<template>
    <div class="school">
        <v-header></v-header>
        <div  class="Content">
            <h1 class="Title">填写校园信息</h1>
            <ul class="List">
                <li>
                    <span>学校所在地区：</span>
                    <div class="AreaBox">
                        <span id="ProVinceCon" @click="getProvince(isP)">{{ProvincesName}}</span>
                        <p><img src="../../../../static/common/com/ico.png" alt=""></p>
                        <ul class="AreaList ProVince" id="ProVince" v-show="isProvinces">
                            <li v-for="dataProvince in dataProvinces" @click="getCity(dataProvince.id,dataProvince.name,isP)">{{dataProvince.name}}</li>
                        </ul>
                    </div>
                    <div class="AreaBox">
                        <span id="CityCon" @click="getCity(ProvincesId,ProvincesName,isC)">{{CityName}}</span>
                        <p><img src="../../../../static/common/com/ico.png" alt=""></p>
                        <ul class="AreaList CityList" id="CityList" v-show="isdataCitys" >
                            <li v-for="dataCity in dataCitys" @click="getHomeTown(dataCity.id,dataCity.name,isC)">{{dataCity.name}}</li>
                        </ul>
                    </div>
                    <div class="AreaBox" id="Contry">
                        <span id="ContryCon" @click="getHomeTown(CityId,CityName,isT)">{{TownName}}</span>
                        <p><img src="../../../../static/common/com/ico.png" alt=""></p>
                        <ul class="AreaList ContryList" id="ContryList" v-show="isdataTowns">
                            <li v-for="dataTown in dataTowns" @click="getAll(dataTown.id,dataTown.name,isT)">{{dataTown.name}}</li>
                        </ul>
                    </div>
                </li>
                <li>
                    <span>学校名称：</span>
                    <input type="text" class="subData" id="Name" data-name = "name" @blur="blurDo" :class=" isschoolName ===true ? Rborder : '' " v-model="schoolName">
                </li>
                <li>
                    <span>联系人姓名：</span>
                    <input type="text" class="subData" id="UserName" data-name = "linkName" :class=" isLinkName ===true ? Rborder : '' " @blur="blurDo" v-model="LinkName">
                </li>
                <li>
                    <span>联系人职务：</span>
                    <input type="text" class="subData" id="UserDuty" data-name = "linkPosition" :class=" isposition ===true ? Rborder : '' " @blur="blurDo" v-model="position">
                </li>
                <li>
                    <span>联系电话：</span>
                    <input type="text" class="subData" id="UserTell" data-name = "linkPhone" :class=" isLinkNum ===true ? Rborder : '' " @blur="blurDo" v-model="LinkNum">
                </li>
                <li>
                    <span>合作意向：</span>
                    <textarea  id="Purpose" class="subData" data-name = "cooperation" placeholder="请填写合作意向，限200字" :class=" isideas ===true ? Rborder : '' " @blur="blurDo" v-model="ideas" maxlength="200"></textarea>
                </li>
            </ul>
            <div style="clear: both;"></div>
            <input type="button" value="提交" class="SubBtn" @click="thisdo">
        </div>
        <router-footer></router-footer>
    </div>
</template>
<script type="text/ecmascript-6">
    import Head from './header'
    import footer from '../../common/bottom'
    export default {
        data () {
            return {
                isP: true,
                isC: true,
                isT: true,
                Rborder: 'Rborder',
                school: '',
                dataProvinces: '',
                ProvincesName: '省',
                ProvincesId: '',
                isProvinces: false,
                dataCitys: '',
                CityName: '市',
                CityId: '',
                isdataCitys: false,
                dataTowns: '',
                TownName: '区/县',
                TownId: '',
                isdataTowns: false,
                schoolName: '',
                isschoolName: false,
                LinkName: '',
                isLinkName: false,
                position: '',
                isposition: false,
                LinkNum: '',
                isLinkNum: false,
                ideas: '',
                isideas: false
            }
        },
        components: {
            'v-header': Head,
            'router-footer': footer
        },
        created () {
            this.getProvince()
        },
        methods: {
//            省
            getProvince (isP) {
                if (isP === false) {
                    this.isProvinces = true
                    this.isdataCitys = false
                    this.isdataTowns = false
                } else {
                    this.isProvinces = false
                    this.isdataCitys = false
                    this.isdataTowns = false
                    this.isP = false
                }
                this.$http.post('/web/common/area?parentId=100000').then((response) => {
                    let data = response.body
                    this.dataProvinces = data.retData
                    if (this.isProvinces === false) {
                        this.ProvincesName = data.retData[0].name
                        this.ProvincesId = data.retData[0].id
                        this.getCity(this.ProvincesId, this.ProvincesName, this.isC)
                        console.log(data)
                    }
                })
            },
//            城市
            getCity (parentId, name, isC) {
                console.log(isC)
                if (parentId === '') {
                    return false
                }
                if (isC === false) {
                    this.isdataCitys = true
                    this.isProvinces = false
                    this.isdataTowns = false
                } else {
                    this.isdataCitys = false
                    this.isProvinces = false
                    this.isdataTowns = false
                    this.isC = false
                }
                this.ProvincesName = name
                this.ProvincesId = parentId
                var parmas = {}
                parmas.parentId = parentId
                this.$http.post('/web/common/area', parmas).then((response) => {
                    let data = response.body
                    this.dataCitys = data.retData
                    if (this.isdataCitys === false) {
                        this.CityName = data.retData[0].name
                        this.CityId = data.retData[0].id
                        this.getHomeTown(this.CityId, this.CityName, this.isT)
                    }
                    console.log(data)
                })
            },
//            县区
            getHomeTown (parentId, Cityname, isT) {
                if (parentId === '') {
                    return false
                }
                console.log(isT)
                if (isT === false) {
                    this.isProvinces = false
                    this.isdataCitys = false
                    this.isdataTowns = true
                } else {
                    this.isProvinces = false
                    this.isdataCitys = false
                    this.isdataTowns = false
                    this.isT = false
                }
                this.CityName = Cityname
                this.CityId = parentId
                var parmas = {}
                parmas.parentId = parentId
                this.$http.post('/web/common/area', parmas).then((response) => {
                    let data = response.body
                    this.dataTowns = data.retData
                    if (this.isdataTowns === false) {
                        this.TownName = data.retData[0].name
                        this.TownId = data.retData[0].id
                    }
                })
            },
            getAll (parentId, TownName) {
                this.isProvinces = false
                this.isdataCitys = false
                this.isdataTowns = false
                this.TownName = TownName
                this.TownId = parentId
            },
            blurDo () {
                let schoolName = this.schoolName
                let LinkName = this.LinkName
                let position = this.position
                let LinkNum = this.LinkNum
                let ideas = this.ideas
                if (schoolName) {
                    this.isschoolName = true
                }
                if (LinkName) {
                    this.isLinkName = true
                }
                if (position) {
                    this.isposition = true
                }
                if (LinkNum) {
                    this.isLinkNum = true
                }
                if (ideas) {
                    this.isideas = true
                }
            },
            thisdo () {
                let CId = this.ProvincesId + '|' + this.CityId + '|' + this.TownId
                let countyId = JSON.stringify(CId)
                let userBusinessPartersRes = {}
                userBusinessPartersRes.countyId = countyId
                userBusinessPartersRes.type = '2'
                let subData = document.getElementsByClassName('subData')
                let length = subData.length
                let is = true
                for (let i = 0; i < length; i++) {
                    let dataname = subData[i].getAttribute('data-name')
                    let value = subData[i].value
                    userBusinessPartersRes[dataname] = value
                    if (value === '') {
                        subData[i].focus()
                        subData[i].style.border = '1px solid #e41414'
                        is = false
                        return false
                    }
                }
                if (is === false) {
                    return false
                }
                let parmas = JSON.stringify(userBusinessPartersRes)
                this.$http.post('/web/common/bottom/addBusinessParters', parmas).then((response) => {
                    let data = response.body
                    this.dataTowns = data.retData
                    console.log(data)
                })
            }
        }
    }
</script>
<style>
    @media screen and (max-width:1366px){
        .NavMain{width: 900px;}
    }
    @media screen and (min-width:1366px){
        .NavMain{width: 1000px;}
    }
    @media screen and (min-width:1600px){
        .NavMain{width: 1200px;}
    }
    .school{float: left;width: 100%;background: #ecedf0;}
    .school .Content{margin: 30px auto;width: 960px; overflow: hidden;background: white;border-radius: 10px;padding: 0 75px 125px 75px; box-sizing: border-box;border: 1px solid #ccc;}
    .school .Content:before,.Content:after{clear: both;}
    .school .Title{float: left;width: 100%;height: 100px;color: #323232;font-weight: bold; font-size: 24px;text-align: left; line-height: 100px;}
    .school .List,.List>li{float: left;width: 100%;box-sizing: border-box;}
    .school .List>li{margin-bottom: 20px;line-height: 32px;color: #323232;}
    .school .List>li>span{float: left;width: 120px;text-align: left;font-size: 16px;color: #323232;line-height: 32px;}
    .school .List>li>input{float: left;width: 290px;padding-left: 10px; height: 32px;border: 1px solid #ccc; box-sizing: border-box;outline:none; text-align: left;font-size: 16px;color: #323232;line-height: 30px;}
    .school .List>li>textarea{float: left;width: 525px;resize:none; padding: 10px; height: 150px;border: 1px solid #ccc; box-sizing: border-box;outline:none; text-align: left;font-size: 16px;color: #323232;line-height: 24px;}
    .school .SubBtn{cursor: pointer; width: 290px;height: 38px;background: url("../../../../static/common/com/btnbg.jpg")0 0 repeat;border: 0;outline: none;color: white;text-align: center;line-height: 38px;font-size: 16px;border-radius: 19px;margin:50px auto 80px auto;display: block; }
    .school .AreaBox{margin-right: 45px; position: relative; cursor: pointer; float: left;width: 150px;height: 32px;box-sizing: border-box;line-height: 30px;border: 1px solid #ccc;}
    .school .AreaBox>span{float: left;width: 115px;overflow: hidden;white-space:nowrap;text-overflow:ellipsis; text-align: left; box-sizing: border-box; line-height: 30px;height: 30px;font-size: 14px;color: #323232;padding-left: 10px;}
    .school .AreaBox>p{float: right;background: #dedede; width: 30px;text-align: center; box-sizing: border-box; line-height: 30px;height: 30px;}
    .school .AreaList{ z-index: 2;position: absolute; top: 30px;left: -1px;padding: 10px;  box-sizing: border-box;  border-left: 1px solid #ccc;  border: 1px solid #ccc;  background: white;}
    .school .AreaList>li{float: left;color: #323232; overflow: hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 10px; width: 100px;text-align: left;box-sizing: border-box;height: 30px;line-height: 30px;font-size: 14px;}
    .school .AreaList>li:hover{color: #00ce9e;}
    .school .ProVince{width: 425px;}
    .school .CityList{width: 225px;}
    .school .ContryList{width:225px;}
    .Rborder{border:1px solid #ccc!important;}
</style>
