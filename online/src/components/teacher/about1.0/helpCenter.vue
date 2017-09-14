<template>
<div class="helpCenter">
    <v-header></v-header>
    <div class="Center">
        <div  class="CenterContent">
            <div class="Problems">
                <div class="ProblemsList">
                    <div class="H_objlist" v-for="(Firstlevel,index) in Firstlevels">
                        <div class="H_showname" :class="index === isF ? add : ''" @click="getFirstlevel(index)">
                            <span class="H_listname" :class="index === isF ? add : ''">{{Firstlevel.categoryName}}</span>
                            <span class="bc"></span>
                        </div>
                        <ul class="H_ul" v-show="index === isF">
                            <li class="H_li" v-for="(Secondlevel,Secondindex) in Firstlevel.list" @click="Three(Secondlevel.categoryId,Secondlevel.articleId,Secondindex,Secondlevel.categoryName)"><span class="color"  :class="Secondindex === isnum ? addcolor : ''">{{Secondlevel.categoryName}}{{Secondindex}}</span></span></li>
                        </ul>
                    </div>
                </div>
                <div class="ProblemsContent">
                    <div class="H_show">{{showName}}</div>
                    <div class="H_con" v-if="isfirstContent"  v-html="Article">
                    </div>
                    <ul class="H_conT" v-if="isfirstThree">
                        <!--三级菜单-->
                        <li class='H_litree' v-for="lastThree in Threes" @click="Three(null,lastThree.articleId,isnum,lastThree.title)"><span class='radios'></span>{{lastThree.title}}</li>
                    </ul>
                </div>
            </div>
        </div>
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
                add: 'add',
                addcolor: 'addcolor',
                isnum: 0,
                isF: 0,
                isaddcolor: false,
                isfirstContent: false,
                isfirstThree: false,
                help: '',
                Firstlevels: '',
                First: true,
                isFirstlevel: false,
                Threes: '',
                Article: '',
                FirstCategoryId: '',
                FirstArticleId: '',
                showName: ''
            }
        },
        components: {
            'v-header': Head,
            'router-footer': footer
        },
        mounted () {
            this.getFirstlevel(0)
        },
        methods: {
            getFirstlevel (isF) {
                this.isF = isF
                this.$http.post('/web/common/help/menu').then((response) => {
                    let data = response.body
                    var Dtrue = data.retData
                    this.Firstlevels = Dtrue
                    if (this.isfirstContent === false) {
                        this.isfirstContent = true
                    }
                    this.FirstCategoryId = Dtrue[isF].list[isF].categoryId
                    this.FirstArticleId = Dtrue[isF].list[isF].articleId
                    let showName = Dtrue[isF].list[isF].categoryName
                    this.Three(this.FirstCategoryId, this.FirstArticleId, 0, showName)
//                    判断第一个是否有第二级菜单
                    if (Dtrue[0].list !== 0) {
                        this.First = true
                    }
                })
            },
            Three (categoryId, articleId, isnum, name) {
                if (articleId === null || articleId === '') {
                    this.isnum = isnum
                    let parmas = {}
                    parmas.categoryId = categoryId
                    this.$http.post('/web/common/help/getHelpArticle', parmas).then((response) => {
                        let data = response.body
                        var Dtrue = data.retData
                        this.Threes = Dtrue
//                        显示文章内容
                        this.isfirstContent = false
//                        显示三级菜单
                        this.isfirstThree = true
                        console.log(data)
                    })
                } else {
                    this.isnum = isnum
                    let parmas = {}
                    parmas.articleId = articleId
                    this.$http.post('/web/common/help/content', parmas).then((response) => {
                        let data = response.body
                        this.Article = data.retData
                        console.log(data)
                        //                        显示文章内容
                        this.isfirstContent = true
                        //                        显示三级菜单
                        this.isfirstThree = false
                        this.showName = name
                    })
                }
            },
            showList () {
                if (this.First) {

                }
            }
        }
    }
</script>
<style>
    .Center{float: left;width: 100%;background: #ecedf0;}
    .Center .CenterContent{margin: 30px auto;width: 1000px; overflow: hidden;background: white; box-sizing: border-box;border: 1px solid #ccc;}
    .Center .CenterContent:before,.CenterContent:after{clear: both;}
    .Problems{
        width:1000px;
        min-height: 100px;
        border-right: 1px solid #ccc;
    }
    .ProblemsList{
        width:210px;
        min-height: 700px;
        float: left;
        box-sizing: border-box;
    }
    .ProblemsContent{
        width:789px;
        min-height: 700px;
        float: left;
        border-left: 1px solid #ccc;
    }
    /*问题列表*/
    .H_objlist{
        width:100%;
        min-height: 52px;
    }
    .H_showname{
        width:100%;
        height: 52px;
        background: #eaeaea;
        line-height: 50px;
        color: #333;
        font-size: 14px;
        text-indent: 24px;
        border-bottom: 1px solid #fff;
        box-sizing: border-box;
        cursor: pointer;
    }
    .H_li{
        width:100%;
        height: 37px;
        border-bottom: 1px solid #f5f5f5;
        line-height: 37px;
        text-indent: 24px;
        font-size: 12px;
        box-sizing: border-box;
        cursor: pointer;
    }
    .bc{
        display: inline-block;
        width: 15px;
        height: 8px;
        background: url("/static/common/com/arrow_white.png");
        float: right;
        margin-top: 23px;
        margin-right: 14px;
    }
    .bc_g{
        display: inline-block;
        width: 15px;
        height: 8px;
        background: url("/static/common/com/arrow_gray.png")!important;
        float: right;
        margin-top: 23px;
        margin-right: 14px;
    }
    /*右边内容区*/
    .H_show{
        width:100%;
        height: 51px;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;
        line-height: 51px;
        text-indent: 30px;
        font-size: 20px;
    }
    .H_con{
        width:733px;
        min-height: 100px;
        margin: 40px auto;
        color: #636363;
        font-size: 14px;
    }
    .H_ul{
        /*display: none;*/
    }
    .add{
        background:#00ce9f!important;
        font-weight: 600;
        color: #fff!important;
    }
    .addcolor{
        color:#00ce9f!important;
        font-weight:600;
    }
    .addclickcolor{
        color:#00ce9f!important;
        font-weight:600;
    }
    /*三级菜单*/
    .H_conT{
        width:700px;
        min-height: 200px;
        margin: 40px auto;
        border:1px solid #ccc;
        box-sizing: border-box;
        padding: 15px 20px  15px 25px;
    }
    .H_litree{
        line-height: 22px;
        font-size: 12px;
        color: #636363;
        position: relative;
        cursor: pointer;
    }
    .H_litree:hover .radios{
        background: #fb6850;
    }
    .H_litree:hover{
        color: #fb6850;
    }
    .radios{
        display: inline-block;
        width:3px;
        height: 3px;
        background: #636363;
        margin-right: 10px;
        position: absolute;
        top:9px;
        left:-9px;
    }
</style>
