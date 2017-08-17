<template>
  <div class="c_Main" >
    <div class="NoData i_nodata NoDataTop dino" id="NoData"></div>
    <div style="clear:both"></div>
    <ul class="testList correctList">
      <li class="listLi" v-for="temp in testList" :id="temp.id">
        <ul class="testList">
          <li class="assignTime">
            <span>{{temp.assignTime}}</span><span style="margin-left:2px;">{{getWeek(temp.assignTime)}}</span>
          </li>
          <li class="Title" title="temp.title">{{temp.title}}</li>
          <li class="classes">{{temp.correctObj}}</li>
          <li class="subAndCorrectBox">
            <div class="submitWork">
              <span class="_name">提交</span>
              <div class="s_progressBar">
                <span class="s_progress" :class="temp.id+'s_progress'" :style="{width:temp.swidth}"></span>
              </div>
              <span class="submitStu">{{temp.submitNum}}</span>
              <span class="line">/</span>
              <span class="totalStu">{{temp.allNum}}</span>
            </div>
            <div class="correctWork">
              <span class="_name">批改</span>
              <div class="c_progressBar">
                <span class="c_progress" :class="temp.id+'s_progress'" :style="{'width':temp.cwidth}"></span>
              </div>
              <span class="correctStu">{{temp.correctNum}}</span>
              <span class="line">/</span>
              <span class="totalStu">{{temp.allNum}}</span>
            </div>
            <div class="deadlineTime">
              <span>截止时间：</span>
              <span>{{temp.endTime}}</span>
            </div>
          </li>
          <li class="end_li">
            <span class="end_flag" v-if="temp.endFlag=='yes'"></span>
            <span v-else class="sendMessage" :nosubmitlist="temp.noSubmitId">催作业</span>
          </li>
          <li class="clickIn _correct cup" :submitnum="temp.submitNum" :correctnum="temp.correctNum" :allnum="temp.allNum" :hasselectable="temp.hasSelectAble" @click="toCorrect(temp.id)">批改</li>
        </ul>
      </li>
    </ul>
    <div class="p_LessMoney" id="NoIdentify">
      <div class="p_NoIdentifyBg">
        <p class="GoPayClose" id="GoIdentifyClose"></p>
      </div>
    </div>
    <v-pages :ToPages="ThisPages" @ListenChild="RecieveChild" v-if="testList.length>0"></v-pages>
  </div>
</template>
<script type="text/ecmascript-6">
  import pages from '../../common/pages'
  import {selectCorrect} from '../../../service/teacher/homework/correctwork.js';
  export default {
    data() {
      return {
        testList: [],
        currentPage:1,
        ThisPages:{
          Total:0,
          Role:0,
          PnoPage:0,
          Local:''
        }
      }
    },
    mounted() {
      this.showList('1')
    },
    methods: {
      showList(pagesNum) {
        let param = {}
        param.type=2;
        param.pageNum=pagesNum;
        param.pageSize=5;
        let that = this
        selectCorrect(this,param).then(function(response) {
          let res = response.body
          if (res.retCode == '0000') {
            that.testList = []
            that.ThisPages.Total = res.retData.pages
            that.ThisPages.PnoPage = res.retData.pageNum
            let list = res.retData.list
            for(let i=0;i<list.length;i++) {
              let item = list[i]
              item.swidth = item.submitNum/item.allNum*100+'%'
              item.cwidth = item.correctNum/item.allNum*100+'%'
              that.testList.push(item)
            }
            that.currentPage = res.retData.pageNum
          }
        })
      },
      RecieveChild(page) {
        this.showList(page)
      },
      getWeek(day) {//通过日期，改为周几
        let arrDay=day.split("-");
        let x;
        let Day=new Date(arrDay[0],parseInt(arrDay[1]-1),arrDay[2]);
        switch (Day.getDay()) {
          case 0:
            x="周日";
            break;
          case 1:
            x="周一";
            break;
          case 2:
            x="周二";
            break;
          case 3:
            x="周三";
            break;
          case 4:
            x="周四";
            break;
          case 5:
            x="周五";
            break;
          case 6:
            x="周六";
            break;
        }
        return x//返回周几
      },
      toCorrect(id) {
        this.$router.push('/content/teacher/test/correcttest?id='+id)
      }
    },
    components:{
      'v-pages':pages
    }
  };
</script>
<style>
  @media screen and (min-width: 1600px) {
    .s_progressBar {
      width: 250px;
      height: 20px;
      background: #ccc;
      box-sizing: border-box;
      border-radius: 10px;
      margin: 13px auto;
      float: left;
    }

    .s_progressBar .s_progress {
      display: block;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      height: 20px;
      background: #59c1e4;
    }

    .c_progressBar {
      width: 250px;
      height: 20px;
      background: #ccc;
      box-sizing: border-box;
      border-radius: 10px;
      margin: 13px auto;
      float: left;
    }

    .c_progressBar .c_progress {

      display: block;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      height: 20px;
      background: #59c1e4;
    }

    .testList {
      width: 1200px;
      height: auto;
      margin: 0 auto;
      background: #fff;
    }

    .listLi {
      height: 140px;
      line-height: 140px;
      width: 1200px;

      border-bottom: 1px solid #ddd;
    }

    .listLi .testList {
      overflow: hidden;
    }

    .listLi .testList li {
      float: left;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: #666;
      vertical-align:middle;
    }

    .deadlineTime {
      text-align: left;
      font-size: 13px;
    }

    .assignTime {
      width: 200px;
    }

    .Title {
      width: 200px;
    }

    .classes {
      width: 200px;
    }

    .clickIn {
      width: 80px;
      color: #59c1e4 !important;
    }

    .end_li {
      width: 100px;
      height: 140px;
    }

    .subAndCorrectBox {
      width: 400px;
      line-height: 40px;
    }

    .listLi .testList li .submitWork {
      overflow: hidden;
      height: 48px;
      line-height: 48px;
    }

    .listLi .testList li .submitWork ._name {
      float: left;
      margin-right: 10px;
      height: 43px;
      line-height: 43px;
    }

    .listLi .testList li .submitWork div {
      float: left;
    }

    .listLi .testList li .correctWork {
      overflow: hidden;
      height: 43px;
      line-height: 43px;
    }

    .listLi .testList li .correctWork ._name {
      float: left;
      margin-right: 10px;
      height: 43px;
      line-height: 43px;
    }

    #kkpager {
      width: 1000px;
      margin: 0 auto;
    }
    .i_nodata{
      width:1200px;
    }
  }

  @media screen and (min-width: 1366px) and (max-width:1599px){
    .s_progressBar {
      width: 180px;
      height: 16px;
      background: #ccc;
      box-sizing: border-box;
      border-radius: 10px;
      margin: 18px auto;
      float: left;
    }

    .s_progressBar .s_progress {

      display: block;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      height: 16px;
      background: #59c1e4;
    }

    .c_progressBar {
      width: 180px;
      height: 16px;
      background: #ccc;
      box-sizing: border-box;
      border-radius: 10px;
      margin: 18px auto;
      float: left;
    }

    .c_progressBar .c_progress {

      display: block;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      height: 16px;
      background: #59c1e4;
    }

    .testList {
      width: 1000px;
      height: auto;
      margin: 0 auto;
      background: #fff;
    }

    .listLi {
      height: 140px;
      line-height: 140px;
      width: 1000px;

      border-bottom: 1px solid #ddd;
    }

    .listLi .testList {
      overflow: hidden;
    }

    .listLi .testList li {
      float: left;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: #666;
      vertical-align:middle;
    }

    .deadlineTime {
      text-align: left;
      font-size: 13px;
    }

    .assignTime {
      width: 200px;
    }

    .Title {
      width: 200px;
    }

    .classes {
      width: 160px;
    }

    .clickIn {
      width: 70px;
      color: #59c1e4 !important;
    }
    .end_li {
      width: 80px;
      height: 140px;
    }

    .subAndCorrectBox {
      width: 280px;
      line-height: 36px;
    }

    .listLi .testList li .submitWork {
      overflow: hidden;
      height: 47px;
      line-height: 47px;
    }

    .listLi .testList li .submitWork ._name {
      float: left;
      margin-right: 10px;
      height: 45px;
      line-height: 45px;
    }

    .listLi .testList li .submitWork div {
      float: left;
    }

    .listLi .testList li .correctWork {
      overflow: hidden;
      line-height: 45px;
      height: 45px;
    }

    .listLi .testList li .correctWork ._name {
      float: left;
      margin-right: 10px;
      height: 45px;
      line-height: 45px;
    }

    #kkpager {
      width: 900px;
      margin: 0 auto;
    }
    .i_nodata{
      width:1000px;
    }
  }


  @media screen and (max-width: 1365px){
    .s_progressBar {
      width: 130px;
      height: 14px;
      background: #ccc;
      box-sizing: border-box;
      border-radius: 10px;
      margin: 18px auto;
      float: left;
    }

    .s_progressBar .s_progress {

      display: block;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      height: 14px;
      background: #59c1e4;
    }

    .c_progressBar {
      width: 130px;
      height: 14px;
      background: #ccc;
      box-sizing: border-box;
      border-radius: 10px;
      margin: 16px auto;
      float: left;
    }

    .c_progressBar .c_progress {

      display: block;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      height: 14px;
      background: #59c1e4;
    }

    .testList {
      width: 900px;
      height: auto;
      margin: 0 auto;
      background: #fff;
    }

    .listLi {
      height: 140px;
      line-height: 140px;
      width: 900px;
      font-size: 14px;
      border-bottom: 1px solid #ddd;
    }

    .listLi .testList {
      overflow: hidden;
    }

    .listLi .testList li {
      float: left;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: #666;
      vertical-align:middle;
    }

    .deadlineTime {
      text-align: left;
      font-size: 12px;
    }

    .assignTime {
      width: 190px;
    }

    .Title {
      width: 200px;
    }

    .classes {
      width: 140px;
    }

    .clickIn {
      width: 60px;
      color: #59c1e4 !important;
    }
    .end_li {
      width: 70px;
      height: 140px;
    }

    .subAndCorrectBox {
      width: 220px;
      line-height: 36px;
    }

    .listLi .testList li .submitWork {
      overflow: hidden;
      height: 48px;
      line-height: 48px;
    }

    .listLi .testList li .submitWork ._name {
      float: left;
      margin-right: 10px;
      height: 48px;
      line-height: 48px;
    }

    .listLi .workList li .submitWork div {
      float: left;
    }

    .listLi .testList li .correctWork {
      overflow: hidden;
      height: 42px;
      line-height: 42px;
    }

    .listLi .testList li .correctWork ._name {
      float: left;
      margin-right: 10px;
      height: 42px;
      line-height: 42px;
    }

    #kkpager {
      width: 800px;
      margin: 0 auto;
    }
    .i_nodata{
      width:900px;
    }
  }
  .end_flag {
    width: 50px;
    height: 40px;
    display: inline-block;
    position: relative;
    top: 5px;
    margin: 0 auto;
    background-image: url("/static/teacher/images/homework/jz.png");
    background-size: 100% 100%;
    vertical-align:center;
  }
  .correctList {

  }
  .sendMessage {
    width: 50px;
    height: 30px;
    display: inline-block;
    position: relative;
    margin: 0 auto;
    background-color: #F9A249;
    border-radius: 5px;
    color: #ffffff;
    line-height: 30px;
    cursor: pointer;
    vertical-align:middle;
  }
  .p_LessMoney{display: none; z-index: 99999; position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: black;background: rgba(0,0,0,0.5);}
  .p_LessMoneyBg{width: 670px;height: 352px;position: absolute;bottom: 0;top: 0;left: 0;right: 0;margin: auto;background: url("/static/common/images/sprite/bg.png") 0 0 no-repeat;border-radius: 10px;overflow: hidden;}
  .p_NoIdentifyBg{width: 670px;height: 352px;position: absolute;bottom: 0;top: 0;left: 0;right: 0;margin: auto;background: url("/static/teacher/images/homework/sendMessage.png") 0 0 no-repeat;border-radius: 10px;overflow: hidden;}
  .confirm{position: absolute;bottom: 15px;right: 230px;left: 0;margin: auto; width: 190px;height: 45px;text-align: center;line-height: 45px;font-size: 18px;float: left; color: white;background: #8ed6ee;border-radius: 10px;}
  .cancel{position: absolute;bottom: 15px;right: 0;left: 230px;margin: auto; width: 190px;height: 45px;text-align: center;line-height: 45px;font-size: 18px;float: left; color: white;background: #CCCCCC;border-radius: 10px;}
  .GoPayClose{opacity: 0;filter: alpha(opacity=0);  width: 35px;height: 40px;position: absolute;top: 0;right: 21px;cursor: pointer;}
  .correctList{border-radius: 10px;box-sizing: border-box;;overflow: hidden;height:700px;margin-top: 40px;}
  .i_nodata{height: 600px;line-height: 500px;margin: 0 auto;background: #fff;}
  /*add 2017-5-11*/
  .testList li.Title{text-align: left;}
</style>

