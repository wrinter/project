<template>
<div class="AcademicDo">
    <div class="AcadeTitle">
        <span class="AcadeName">{{title}}</span>
        <span class="AcadeChange" @click="reload" :class="isReload === false ? notClick : '' ">换一换</span>
        <span class="Time">
            <i class="Clock"></i>
            <span class="Acadetime">倒计时</span>
            <span class="AcadetimeS"><span class="AcadeHour" id="AcadeHour">{{hh}}</span>时<span class="AcadeMin" id="AcadeMin">{{mm}}</span>分<span class="AcadeSecond" id="AcadeSecond">{{ss}}</span>秒</span>
        </span>
    </div>
    <div class="AcadePaper">
        <div v-for="data in datas">
            <div class="AcadeLine">{{data.questionGroup}}</div>
            <!--每道题的解析-->
            <div v-for="PaperConfLn in data.resRandomPaperConfLn">
                <!--questions-->
                <div class="AcadeQuestion" v-for="(question,index) in PaperConfLn.questions">
                    <div class="AcadeQuestionTitle" v-for="List in question.list" v-if="List.questionType === '01' " >
                        <span  v-html="List.content.replace('【题干】',++index+'、')"></span>
                        <img class="Img" v-if="List.questionType === '01' && PaperConfLn.selectAble === '1' " src="/static/teacher/images/Academic/right.png" />
                        <img class="Img" v-if="List.questionType === '01' && PaperConfLn.selectAble === '1' " src="/static/teacher/images/Academic/wrong.png" />
                    </div>
                    <div class="OptionUl" v-if="question.optionA">
                        <div class="choose chooseA" v-html="question.optionA" @click.stop = "Select(question.id,'A',$event,index)" ></div>
                        <div class="choose chooseB" v-html="question.optionB" @click.stop = "Select(question.id,'B',$event,index)" ></div>
                        <div class="choose chooseC" v-html="question.optionC" @click.stop = "Select(question.id,'C',$event,index)" ></div>
                        <div class="choose chooseD" v-html="question.optionD" @click.stop = "Select(question.id,'D',$event,index)" ></div>
                    </div>
                    <div v-if="PaperConfLn.selectAble === '0' " >
                        <textarea class="isinput" placeholder="请填写你的答案..." @blur="blur(question.id,$event)"></textarea>
                    </div>
                    <div class="AcadeQuestionAnswer" v-for="List in question.list" v-if="List.questionType !== '01'&& List.questionType !== '07' " v-html="List.content.replace('【题干】','')"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="ClickUp" @click="Up">提交</div>
</div>
</template>
<script type="text/ecmascript-6">
import {UrlSearch} from '../../../common/js/request'
export default {
    data () {
        return {
            'isReload': true,
            'addColor': 'addColor',
            'notClick': 'notClick',
            'areaId': UrlSearch('areaId'),
            'allAnswer': [],
            'SelectNumber': '',
            'ontSelectAll': [],
            'isAll': false,
            'doNumber': '',
            'doAll': [],
            'isdoAll': true,
            'title': '',
            'PaperId': '',
            'Time': '',
            'hh': '00',
            'mm': '00',
            'ss': '00',
            'future': '',
            'datas': '',
            'singleA': false,
            'singleB': false,
            'singleC': false,
            'singleD': false,
            'isinput': ''
        }
    },
    mounted () {
        this.thisdo()
    },
    methods: {
        Countdown () {
            let timeDown = this.Time
            let future = new Date().setMinutes(new Date().getMinutes() + Number(timeDown))
            this.future = future
            let time = this.timer
            var timer = setInterval(time, 1000)
            console.log(timer)
        },
        timer () {
            var future = this.future
            var ts = future - (new Date())
            var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10)
            var mm = parseInt(ts / 1000 / 60 % 60, 10)
            var ss = parseInt(ts / 1000 % 60, 10)
            hh = this.checkTime(hh)
            mm = this.checkTime(mm)
            ss = this.checkTime(ss)
            this.hh = hh
            this.mm = mm
            this.ss = ss
            if (hh === 0 && mm === 0 && ss === 0) {
                alert('怎么这么笨，时间到了还没做完....')
            }
        },
        checkTime (i) {
            if (i < 10) {
                i = '0' + i
            }
            return i
        },
        reload () {
            if (this.isReload === false) {

            } else {
                location.reload()
            }
        },
        thisdo () {
//            异步获取
            let menuId = '5d26dv9ea59e11e6s0f576304dec7eb7'
            let parmas = {}
            parmas.areaId = this.areaId
            parmas.menuId = menuId
            this.$http.post('/web/teacher/modeltest/bulidPaper', parmas).then((response) => {
                let data = response.body
                this.datas = data.retData.resRandomPaperQuestion
                this.PaperId = data.retData.id
                this.Time = data.retData.testTime
                this.title = data.retData.title
                console.log(data)
                this.SelectNumber = data.retData.resRandomPaperQuestion[0].resRandomPaperConfLn[0].questions.length
//              客观题的数量
                var sum = 0
                for (let i = 0; i < data.retData.resRandomPaperQuestion[1].resRandomPaperConfLn.length; i++) {
                    let Dtrue = data.retData.resRandomPaperQuestion[1].resRandomPaperConfLn[i]
                    var question = Dtrue.questions.length
                    sum = sum + question
                }
                this.doNumber = sum
                this.Countdown()
            })
        },
        Select (id, answer, event, index) {
//            去重
            let select = this.ontSelectAll
            select.push(index)
            let notSelect = []
            for (var i = 0; i < select.length; i++) {
                if (notSelect[notSelect.length - 1] !== select[i]) {
                    notSelect.push(select[i])
                }
            }
            this.ontSelectAll = notSelect
            let addcolor = event.currentTarget // 这个是当前点击的元素
            let parmas = {}
            parmas.questionId = id
            parmas.userAnswer = answer
            this.$http.post('/web/teacher/modeltest/anwerQuestion', parmas).then((response) => {
                let data = response.body
                this.isReload = false // 不能换一换
                console.log(data)
                let length = addcolor.parentNode.children.length
                for (let i = 0; i < length; i++) {
//                    console.log(addcolor.parentNode.children[i].classList)
                    addcolor.parentNode.children[i].classList.remove('addColor')
                }
                addcolor.setAttribute('class', 'choose addColor')
            })
        },
        blur (id, event) {
            let addcolor = event.currentTarget // 这个是当前点击的元素
            let answer = addcolor.value
            let parmas = {}
            parmas.questionId = id
            parmas.userAnswer = answer
            if (parmas.userAnswer === '') {
                return false
            }
            this.$http.post('/web/teacher/modeltest/anwerQuestion', parmas).then((response) => {
                let data = response.body
                console.log(data)
                this.isReload = false // 不能换一换
            })
        },
        Up () {
//            选择
            let ontSelectAll = this.ontSelectAll
            if (ontSelectAll.length === this.SelectNumber) {
                this.isAll = true
            } else {
                alert('你的选择题还没做完呢...')
                return false
            }
//            填空
            let isinput = document.getElementsByClassName('isinput')
            for (let i = 0; i < isinput.length; i++) {
                let value = isinput[i].value
                if (value === '') {
                    this.isdoAll = false
                    alert('主观题还没有做完呢....')
                    return false // 这是和JQ不同之处JQ不会走这个循环但是下面代码还是会走的，这里是不走的
                } else {
                    this.isdoAll = true
                }
            }
            let parmas = {}
            parmas.paperId = this.PaperId
            parmas.status = '1'
            parmas.testTime = ''
            this.$http.post('/web/teacher/modeltest/paperSubmit', parmas).then((response) => {
                let data = response.body
                console.log(data)
                alert('小伙做的不赖呀....')
            })
        }
    }
}
</script>
<style>
.AcademicDo{
    width:900px;
    min-height: 600px;
    background: #fff;
    border-radius: 10px;
    margin:40px auto;
    padding:0 30px 30px;
}
.Crumbs{
    float: none;
}
.Se_MainBox{
    padding-bottom: 30px;
}
.Time{
    width: 260px;
    height: 90px;
    border: 1px solid #65b113;
    border-radius: 10px;
    line-height: 90px;
    position: absolute;
    right: 20px;
    top: 65px;
    background: #fff;
    font-size: 14px;
}
.Clock{
    display: block;
    width: 44px;
    height: 44px;
    background: #65b113;
    float: left;
    margin-left: 20px!important;
    margin-top: 25px!important;
    background: url("/static/teacher/images/Academic/studiesimg.png") -19px -37px no-repeat;
}
.Acadetime{
    margin-right: 10px;
}
.AcadeHour,.AcadeMin,.AcadeSecond {
    font-size: 20px!important;
    color: #e68923;
}
.AcadeTitle{
    width:100%;
    height: 65px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
     font-size: 24px;
    color: #333;
    line-height: 65px;
    text-align: center;
    position: relative;
}
.AcadeChange{
    display: inline-block;
    width: 150px;
    height: 40px;
    border-radius: 10px;
    background: #65b113;
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
    color: #fff;
    line-height: 40px;
    font-size: 16px;
}
.AcadePaper{

}
.AcadeLine{
    font-size: 16px!important;
    line-height: 30px!important;
    color: #333;
    margin:20px 0;
}
.AcadeQuestionTitle,.choose{
    font-family: "宋体", "Times New Roman";
    font-size: 14px;
    color: #333;
    line-height: 30px;
}
.AcadeQuestionTitle{
    position: relative;
}
.Img{
    position: absolute;
    right: 0;
    top:20px;
}
.choose{
    cursor: pointer;
}
.AcadeQuestionAnswer{
    font-family: "楷体", "Times New Roman";
    font-size: 14px;
    color: #333;
    line-height: 30px;
}
    .addColor{
        color: #65b113;
    }
    .isinput{
        display: block;
        width:90%;
        height: 100px;
        border-radius: 10px;
        margin:20px auto;
        resize: none;
        padding: 10px 20px;
        outline: none;
    }
    /*提交*/
    .ClickUp{
        width: 320px;
        height: 55px;
        background: #65b113;
        line-height: 55px;
        text-align: center;
        border-radius: 10px;
        margin-top: 80px!important;
        margin: 0 auto;
        font-size: 24px!important;
        color: #fff;
        cursor: pointer;
    }
    /*动态css*/
    .notClick{
        background: #ccc;
    }
</style>
