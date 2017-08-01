import VueResource from 'vue-resource'
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(VueResource)
Vue.use(ElementUI)

Vue.config.productionTip = false

 Vue.http.options.emulateJSON = true
// {'emulateJSON': true}

// 路由
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  mounted () {
    this.checkRouter()
  },
  watch: {
    '$route': 'checkRouter'
  },
  methods: {
    checkRouter () {
      let ThisPage = window.location.href.split('#')[1]
      let menuid = this.$route.query.id
      // 写在这里的原因是因为不存登录页其他类似打开新页面的一级路由还是要存的
      if (ThisPage !== '/') {
        // 针对新打开的页面之间的路由切换不影响父级路由
        if (ThisPage.indexOf('nofresh') === -1) {
          localStorage.setItem('ThisWebPage', ThisPage)
          localStorage.setItem('menuid', menuid)
        }
      }
      this.CheckTimeOut()
    },
    CheckTimeOut () {
      var SubData = {}
      SubData.menuid = this.menuId
      this.$http.post('/web/user/check/timeout').then((response) => {
        let ReceiveData = response.body
        let CodeMsg = ReceiveData.retCode
        let ThisPage = window.location.href.split('#')[1]
        // 如果是分享的界面，在检测是否登录的情况下，如果没有登录直接跳转
        if (CodeMsg === '0000') {
          if (ThisPage.indexOf('share') > 0) {
            this.$router.push(ThisPage)
          } else {
            this.$router.push('/')
          }
        } else {
          // 如果用户已登录，新打开的页面不计入缓存
          if (ThisPage.indexOf('nofresh') > 0) {} else {
            this.$router.push(localStorage.getItem('ThisWebPage'))
          }
        }
      })
    }
  }
})

