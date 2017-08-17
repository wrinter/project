<template>
  <div class="data_Popup setLine">
    <div class="setLine_in">
      <i class="setLine_close spriteImg c_closeico fr c_closeimg0" @click="closeLine"></i>
      <div class="setLine_lines">
        <draggable v-model="lines" :move="getline" @update="linedragEnd">
          <transition-group tag="ul">
            <li class="setLine_line" v-for="line in lines" :key="line.lineId">
              <span>
                <span class="setLine_line_number">{{line.lineNumber}}</span>
                <span class="setLine_line_name">{{line.lineName}}</span>
                <span class="setLine_line_score"></span>
              </span>
              <i class="line_delete">删除</i>
            </li>
          </transition-group>
        </draggable>
        <div class="question_type" v-if="typeShow">
          <i>请选择题型</i>
          <a href="javascript:;" v-for="(item,index) in queTypes" @click="selectType(index,$event)" :class="{'disabled':item.selected}">{{item.label}}</a>
        </div>
        <div class="setLine_btn a" @click="addQueType">
          <span class="setLine_btn_add">添加题型</span>
        </div>
        <div class="setLine_btn b">
          <span class="setLine_btn_done" @click="complete">完成</span>
          <span class="setLine_btn_cancel" @click="closeLine">取消</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import draggable from 'vuedraggable'
  import {contains} from '../../../common/js/common.js'
    export default {
        data () {
          return {
            lines: [],
            queTypes: [],
            typeShow: false
          };
        },
      mounted () {
        this.init()
      },
      methods: {
        init () {
          this.lines = JSON.parse(window.localStorage.getItem('lines'))
          this.$http.post('/web/teacher/paper/assign/subjectquestiontypes').then(function(response) {
            let retCode = response.body.retCode
            if (retCode === '0000') {
              let retData = response.body.retData
              for(let i=0;i<retData.length;i++) {
                let queType = {}
                queType.label = retData[i].label
                queType.code = retData[i].code
                queType.selected = false
                this.queTypes.push(queType)
              }
            }
          })
        },
        getline (e) {
//          console.log('move')
        },
        linedragEnd (e) {
          //          console.log('move')
        },
        closeLine () {
          this.$parent.lineShow = false
        },
        addQueType () {
          this.typeShow = true
        },
        selectType (index,e) {
          let classList = e.currentTarget.classList
          if (contains(classList,'disabled')) {
            return
          } else {
            this.queTypes[index].selected = true
          }
          let line = {}
          line.lineNumber = ''
          line.lineId = ''
          line.lineName = this.queTypes[index].label
          line.questionType = this.queTypes[index].code
          this.lines.push(line)
          this.typeShow = false
          window.localStorage.setItem('lines',JSON.stringify(this.lines))
        },
        complete () {
          this.$emit('updateLine',this.lines)
          this.$parent.lineShow = false
        }
      },
      components: {
        draggable
      }
    };
</script>
<style>
</style>
