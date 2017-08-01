<template>
<div class="CoursewareList">
    <v-seclect @ListenChild="thisdo"></v-seclect>
    <div class="Courseware">
        <ul class="Courseware_IMG">
            <li class="CoursewareLi" v-for="(data,index) in datas" @mouseenter="mouseRu(index)" >
                <a :href=" CoursewarePath+'?id='+data.id "  target="_blank">
                    <img class="img" src="data.vedioPicture" />
                    <p class="ShowName">{{data.title}}</p>
                </a>
            </li>
        </ul>
    </div>
</div>
</template>
<script type="text/ecmascript-6">
    import seclect from '../../common/section'
    export default {
        data () {
            return {
                Courseware: '',
                datas: '',
                CoursewarePath: '/#/content/teacher/LessonCenter/CoursewareView'
            }
        },
        components: {
            'v-seclect': seclect
        },
        methods: {
            thisdo (msg) {
                let id = msg
                let parmas = {}
                parmas.menuId = '5d25eadea59e11e680f576304dec7eb7'
                parmas.konwledgeList = id
                this.$http.post('/web/teacher/courseware/selectAll', parmas).then((response) => {
                    let data = response.body
                    this.datas = data.retData
                    console.log(data)
                })
            },
            mouseRu (index) {
                let ShowName = document.getElementsByClassName('ShowName')
                for (let i = 0; i < ShowName.length; i++) {
                    ShowName[i].style.display = 'none'
                }
                ShowName[index].style.display = 'block'
            },
            OtherWin () {
            }
        }
    }
</script>
<style>
    .CoursewareList{
        width:860px;
        min-height: 690px;
        background: #fff;
        border-radius: 10px;
        margin:40px auto;
        padding: 30px 50px;
    }
    .Courseware{
        border-top: 1px solid #ccc;
    }
    .Crumbs{
        float: none;
    }
    .Se_MainBox{
        padding-bottom: 30px;
    }
    .Courseware_IMG{
        margin-top: 40px;
    }
    .CoursewareLi{
        width: 267px;
        height: 150px;
        overflow: hidden;
        position: relative;
        margin: 0 15px;
        cursor: pointer;
        text-align: center;
        background: #ccc;
        float: left;
    }
    .img{
        display: block;
        width:100%;
        height: 100%;
    }
    .ShowName{
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 1;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background: rgba(0,0,0,0.6);
        display: none;
    }
</style>
