<template>
    <div class="E_Content">
        <v-seclect @ListenChild="thisdo"></v-seclect>
        <div class="E_paper">
            <div class="p_loadtexttitle">{{title}}</div>
            <div class="objlist" v-for="(data,index) in datas" @mouseenter="mouseenter(index)" @mouseleave="mouseOut(index)">
                <div class="question">
                    <div v-for="list in data.list" v-if="list.questionType === '13'" >
                        <div  class="classfify"  v-html="list.content"></div>
                    </div>
                    <div class="questionT" v-for="list in data.list" v-if="list.questionType === '01' ">
                        <label>{{index+1}}、</label>
                        <div   class="questionTitle"  v-html="list.content.replace('【题干】','')"></div>
                    </div>
                    <div class="optionul" v-if="data.optionA">
                        <div class="option"  v-html="data.optionA"></div>
                        <div class="option"  v-html="data.optionB"></div>
                        <div class="option"  v-html="data.optionC"></div>
                        <div class="option"  v-html="data.optionD"></div>
                    </div>
                    <div v-for="list in data.list" v-if="list.questionType === '03' || list.questionType === '05' || list.questionType === '19' || list.questionType === '26' || list.questionType === '27'">
                        <div   class="answerData"  v-html="list.content"></div>
                    </div>
                    <div class="answerName anewerStyle" v-for="list in data.list" v-if="list.questionType === '14' || list.questionType === '15' || list.questionType === '16' || list.questionType === '20' || list.questionType === '21' || list.questionType === '22' ">
                        <img class="Example_ico" src="static/teacher/images/Exemplar/Example_ico.png" /><span class="summaryName"></span>
                        <div class="summaryData" v-html="list.content"></div>
                    </div>
                </div>
                <v-Down :clickDown = "data.id"></v-Down>
            </div>
        </div>
        <v-upErrors ></v-upErrors>
    </div>
</template>
<script type="text/ecmascript-6">
    import seclect from '../../common/section'
    import clickDown from './Click_Down'
    import upErrors from '../../common/upErrors'
    export default {
        data () {
            return {
                menuid: '',
                datas: '',
                title: '',
                upErrors: ''
            }
        },
        components: {
            'v-seclect': seclect,
            'v-Down': clickDown,
            'v-upErrors': upErrors
        },
        methods: {
            thisdo (knowledgeId) {
                console.log(knowledgeId)
                let parmas = {}
                parmas.knowledgeId = knowledgeId
                parmas.menuId = '5d26dv1ea59e11e6s0f576304dec7eb7'
                this.$http.post('/web/teacher/prepare/exmplarsList', parmas).then((response) => {
                    let data = response.body
                    this.title = data.retData.testTitle
                    this.datas = data.retData.questionList
                    console.log(data)
                })
            },
            mouseenter (index) {
                let click = document.getElementsByClassName('click_down')
                click[index].style.display = 'block'
            },
            mouseOut (index) {
                let click = document.getElementsByClassName('click_down')
                click[index].style.display = 'none'
            },
            upErrors (id) {
                console.log(id)
            }
        }
    }
</script>
<style>
.E_Content{
    width:860px;
    min-height: 690px;
    background: #fff;
    border-radius: 10px;
    margin:40px auto;
    padding: 30px 50px;
}
.Crumbs{
    float: none;
}
.Se_MainBox{
    padding-bottom: 30px;
}
.E_paper{
    width:100%;
    min-height: 500px;
    border-top: 1px solid #ccc;
    box-sizing: border-box;
}
.p_loadtexttitle {
    display: block;
    width: 100%;
    height: 94px;
    text-align: center;
    line-height: 94px;
    font-size: 24px!important;
    background: #fff;
    color: #333;
}
.objlist{
    position: relative;
}
.questionT{
    position: relative;
}
.question{
    padding: 20px 0 30px 0;
    font-size: 14px;
    font-family: '微软雅黑';
}
label {
    position: absolute;
    left: 0;
    top: 0px;
    display: block;
    width:24px;
    height: 30px;
    line-height: 30px;
}
/*样式试题*/
.classfify {
    color: #333;
    font-weight: 600;
    font-size: 16px;
    margin-left: 20px;
    margin-top: 0px;
    margin-bottom: 10px;
}
.questionTitle{
    width: 82%;
    line-height: 29px;
    font-family: "Times New Roman",SimSun;
    font-size: 14px;
    margin-left: 25px;
}
.optionul{
    margin-left: 25px;
}
.option, .option p, .option div {
    font-family: "Times New Roman",SimSun;
    line-height: 29px;
    font-size: 14px;
}
/*新的樣式*/
.p_loadcon img{
    max-width: 100%;
}
.optionul,.optionul p,.optionul div{
    font-family: "Times New Roman",SimSun;
}
/*答案样式微调*/
.answerName{
    margin:10px 0 5px;
}
.classfify{
    color: #333;
    font-weight: 600;
    font-size: 16px;
    margin-left: 20px;
    margin-top: 0px;
    margin-bottom: 10px;
}
.answerName,.summary{
    color: #333;
    font-weight: 400;
    font-size: 16px;
    margin-left: -8px;
}
.answerData{
    color: #333;
    font-size: 16px;
    line-height: 24px;
    font-family: "Times New Roman", "楷体";
    margin-left: 25px;
}
.answerData p,.answerData span{
    font-family: "Times New Roman", "楷体";
    line-height: 30px;
}
.answerName p{
    line-height: 30px;
}
.Example_ico{
    display: inline-block;
    width:16px;
    vertical-align: middle;
    margin-right: 10px;
}
.summaryName{
    display: inline-block;
    margin-top: -2px;
    font-weight: 600;
}
.question img{
    max-width: 90%;
}
.summaryName,.classfify,.answerName{
    font-size: 16px!important;
}
.summaryData{
    font-size: 16px!important;
    font-family: "Times New Roman", "楷体";
}
.summaryData p , .summaryData span {
    font-family: "Times New Roman", "楷体";
}
/*总结规律*/
.anewerStyle{
    font-weight:normal;
    border-radius: 10px;
    border: 1px solid #6eb621;
    background: #f8f8f8;
    padding: 10px 20px 20px;
    margin-left: 0;
}
.summaryData{
    margin-top: 0px!important;
}
</style>
