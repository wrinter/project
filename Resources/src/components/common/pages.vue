<template>
  <div  :class="{'Com_PageTeacher':PageItem == 0,'Com_PageStu':PageItem == 1}">
    <ul>
      <li :class="{'Com_PageDis':PageUp == false}" @click.stop="GoFirst">首页</li>
      <li :class="{'Com_PageDis':PageUp == false}" @click.stop="UpPage">上一页</li>
      <li v-if="data.Show" @click="ToParet(index+1)" v-for="(data,index) in PageData" :class="{'Omit':data.Omit ==true,'Com_Pno':data.Class ==true}">{{data.Con}}</li>
      <li :class="{'Com_PageDis':PageDown == false}" @click.stop="GoEnd">尾页</li>
      <li :class="{'Com_PageDis':PageDown == false}" @click.stop="DownPage">下一页</li>
    </ul>
    <div class="Com_Intro">
      <p>当前第{{ShowPage}}页/共{{ToPages.Total}}页转到</p>
      <p class="Com_IntroTex StopBo" @click.stop="PageBtnShow" @keyup.enter="GoPages">
        <input type="text" class="StopBo" :placeholder="NowPage" v-model="NowPage" >
        <transition name="Slide"  enter-active-class="slideInLeft" >
          <span  class="Com_PageEnsure StopBo" v-if="ThisBtn==true"  @click.stop="GoPages">确定</span>
        </transition>
      </p>
      <span>页</span>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        PageItem: '',
        PageData: '',
        NowPage: 1,
        ShowPage: 1,
        PageUp:false,
        PageDown:false,
        ThisBtn:false
      }
    },
    mounted () {
      this.Init()
      this.LoseBlur()
    },
    props:{
      ToPages:Object
    },
    watch: {
      ToPages : 'ResetData'
    },
    methods: {
      Init () {
        this.GetItem()
        this.GetDefaultPage()
        this.CreatPageData()
        this.JudgeUpDown(this.NowPage)
        this.ToParet(this.NowPage)
      },
      // 数据重置
      ResetData () {
        this.GetItem()
        this.GetDefaultPage()
        this.CreatPageData()
        this.JudgeUpDown(this.NowPage)
        this.GetIndex(this.NowPage)
      },
      // 显示确定
      PageBtnShow () {
        this.ThisBtn = true
      },
      GoPages () {
        this.GetIndex(this.NowPage)
        this.ThisBtn = false
      },
      // 全局点击
      LoseBlur () {
        let that = this
        document.addEventListener('click', function (evt) {
          let e = evt || window.event;
          if (e.stopPropagation) {
            e.stopPropagation();
          } else {
            window.event.cancelBubble = true;
          }
          if (evt.target.className !== 'StopBo') {
            that.ThisBtn = false
          }
        });
      },
      GetDefaultPage () {
        if (this.ToPages.Local !== '') {
          let LocalPage = parseInt(localStorage.getItem(this.ToPages.Local))
          if (LocalPage >= this.ToPages.Total) {
            this.NowPage = this.ToPages.Total
          } else {
            this.NowPage = LocalPage
          }
        } else {
          this.NowPage = this.ToPages.PnoPage
        }
      },
      // 获取主题颜色
      GetItem () {
        this.PageItem = this.ToPages.Role
      },
      // 组织分页数据
      CreatPageData () {
        let NewArr = []
        for (let i = 0; i < this.ToPages.Total; i++) {
          let Obj = {}
          Obj.Class = false
          Obj.Omit = false
          Obj.Show = true
          Obj.Con = (i + 1)
          NewArr.push(Obj)
        }
        this.PageData = NewArr
      },
      // 判断上一页下一页是否可点击
      JudgeUpDown (index) {
        if (this.ToPages.Total > 1) {
          if (index === 1) {
            this.PageUp = false
            this.PageDown = true
          } else if (index === this.ToPages.Total) {
            this.PageUp = true
            this.PageDown = false
          } else {
            this.PageUp = true
            this.PageDown = true
          }
        } else {
          this.PageUp = false
          this.PageDown = false
        }
      },
      // 重置数据类
      ResetClass (index) {
        for (let i = 0; i < this.PageData.length; i++) {
          this.PageData[i].Class = false
        }
        this.PageData[index - 1].Class = true
      },
      // 若用户点击的是第六页之前
      BeforSix () {
        this.CreatPageData()
        for (let i = 0; i < 7; i++) {
          this.PageData[i].Show = true
        }
        this.PageData[7] = {Class: false, Omit: true, Show: true, Con: '...'}
        for (let i = 8; i < this.PageData.length; i++) {
          this.PageData[i].Show = false
        }
      },
      // 若用户点击的是第六页之后
      AfterSix (index) {
        this.CreatPageData()
        var Begin = index - 2
        var End = index + 1
        if (End >= this.ToPages.Total) {
          End = this.ToPages.Total
          Begin = End - 4
        }
        for (let i = 0; i < 2; i++) {
          this.PageData[i].Show = true
        }
        this.PageData[2] = {Class: false, Omit: true, Show: true, Con: '...'}
        for (let i = 3; i < Begin - 1; i++) {
          this.PageData[i].Show = false
        }
        for (let i = Begin - 1; i < End; i++) {
          this.PageData[i].Show = true
        }
        if (End <= this.ToPages.Total - 2) {
          this.PageData[End + 1] = {Class: false, Omit: true, Show: true, Con: '...'}
          for (let i = End + 2; i < this.PageData.length; i++) {
            this.PageData[i].Show = false
          }
        }
      },
      // 用户切换页码
      GetIndex (index) {
        index = parseInt(index)
        if (index >= this.ToPages.Total) {
          index = this.ToPages.Total
        } else if (index < 1) {
          index = 1
        }
        this.ShowPage = index
        this.NowPage = index
        if (this.ToPages.Total < 9) {
        } else {
          if (index < 6) {
            this.BeforSix()
          } else {
            this.AfterSix(index)
          }
        }
        this.ResetClass(index)
        this.JudgeUpDown(index)
      },
      ToParet (index) {
        this.GetIndex(index)
        this.$emit('ListenChild', index)
      },
      // 上一页
      UpPage () {
        this.GetIndex(this.NowPage - 1)
      },
      // 下一页
      DownPage () {
        this.GetIndex(this.NowPage + 1)
      },
      // 首页
      GoFirst () {
        this.GetIndex(1)
      },
      // 尾页
      GoEnd () {
        this.GetIndex(this.ToPages.Total)
      }
    }
  }
</script>

<style>
  .Com_PageTeacher,.Com_PageStu{width: 900px;overflow: hidden;box-sizing: border-box;padding: 0 30px;margin:0 auto;}
  .Com_PageTeacher ul{float: left;}
  .Com_PageTeacher ul li,.Com_PageStu ul li{float: left;background: white;cursor: pointer; padding: 0 10px;height: 25px;margin-right: 5px;text-align: center;font-size: 12px;line-height: 25px;border: 1px solid #ccc;box-sizing: border-box;color: #666;border-radius: 3px;}
  .Omit{background: none!important; border: 0!important;cursor: text!important;}
  .Omit:hover{color: #666!important;}
  .Com_PageTeacher .Com_Intro,.Com_PageStu .Com_Intro{float: right;height: 25px;font-size: 13px;line-height: 25px;text-align: left;color: #666;}
  .Com_Intro>p,.Com_Intro input,.Com_Intro span{float: left;font-size: 13px;color: #666;}
  .Com_Intro input{width: 60px;height: 25px;position: relative;z-index: 2; box-sizing: border-box;margin: 0 3px; outline: none;border: 1px solid #ccc;border-radius: 3px;text-align: center;}
  .Com_Intro>p>.Com_PageEnsure{position: absolute;float: left;width: 50px;height: 25px;border-radius: 10px;text-align: center;line-height: 25px;font-size: 13px;color: white;cursor: pointer;}
  .Com_PageTeacher .Com_Intro>p> .Com_PageEnsure {background: #65b113}
  .Com_PageStu .Com_Intro >p>.Com_PageEnsure {background: #49b9df}
  .Com_IntroTex{width: 66px;height: 25px;}
  .Com_PageTeacher ul li:hover ,.Com_PageTeacher ul .Com_Pno{background: #65b113;color: #fff;}
  .Com_PageStu ul li:hover,.Com_PageStu ul .Com_Pno{background: #49b9df; color:#fff;}
  .Com_PageTeacher .Com_PageDis,.Com_PageStu .Com_PageDis,
  .Com_PageTeacher .Com_PageDis:hover,
  .Com_PageStu .Com_PageDis:hover
  { border: 1px solid #DFDFDF;  background-color: #FFF!important;  color: #DFDFDF!important;cursor: not-allowed;}
</style>
