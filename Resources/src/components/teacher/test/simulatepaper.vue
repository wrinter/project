<template>
  <div class="t_Main ">
    <div class="t_container" v-if="list.length>0">
      <ul class="t_list">
        <li class="paperTitle" v-for="temp in list">
          <router-link v-bind:to="'/content/teacher/test/assignpaper?htype=mylist&status=2&paperId='+temp.paperId+'&paperType='+paperType">
            <nobr>{{temp.paperName}}</nobr>
          </router-link>
          </a>
        </li>
      </ul>
    </div>
    <div class="t_container" v-else>
      <img class="nodata" src="/static/common/images/no.png">
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {UrlSearch} from '../../../common/js/request.js';
    export default {
      data () {
        return {
          list:[],
          paperType: UrlSearch('paperType')
        }
      },
      mounted () {
        this.getList()
      },
      methods: {
        getList () {
          let crumb = this.$route.meta.crumbs[2]
          crumb.name = '模拟套卷'
          let knowledgeId = window.localStorage.getItem('knowledgeId')
          let para = {}
          para.knowledgeId = knowledgeId
          para.categoryId = UrlSearch('id')
          this.$http.post('/web/teacher/paper/assign/simulatepapers', para, {'emulateJSON': true}).then(function (response) {
            let retCode = response.body.retCode
            if (retCode === '0000') {
              this.list = response.body.retData
            }
          })
        }
      }
    };
</script>
<style>
  html{background-color: #ecedf0;}
  h3,h4,p,div.flex{font-family: Times New Roman,\5B8B\4F53;}
  h2,h2 p{font-family: Microsoft YaHei,sans-serif,Arial;}
  table{border-collapse: separate;}
  .t_Main{width: 100%;float: left;background: #ecedf0;box-sizing: border-box;min-height: 780px;;padding-bottom: 40px;}
  .nodata{display: block;width: 176px;margin: 40px auto;}
  /*****************************  模拟套卷  **********************************/
  .t_container{background: #fff;border-radius: 10px;height: auto;min-height: 568px;margin: 0 auto;margin-top: 40px;}
  .t_list{overflow-y: auto;}
  .paperTitle{height: 80px;line-height: 80px;color: #333;width: 80%;padding: 0 10%;border-bottom: 1px dashed #ccc;}
  /*屏幕小于1366*/
  @media screen and (max-width:1365px){
    .t_container{width:900px;}
  }
  @media screen and (min-width:1366px) and (max-width:1599px){
    .t_container{width:1000px;}
  }
  /*屏幕大于1600*/
  @media screen and (min-width:1600px){
    .t_container{width:1200px;}
  }
</style>
