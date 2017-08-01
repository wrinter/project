import _default2 from 'element-ui/lib/theme-default/index.css';
import _default from 'element-ui/lib';
import VueResource from 'vue-resource';
import Vue from 'vue';
import App from './App';
import router from './router';

import 'element-ui/lib/theme-default/index.css';
Vue.use(VueResource);
Vue.use(_default);

Vue.config.productionTip = false;

Vue.http.options.emulateJSON = true;

new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App: App },
  mounted: function mounted() {
    this.checkRouter();
  },

  watch: {
    '$route': 'checkRouter'
  },
  methods: {
    checkRouter: function checkRouter() {
      var ThisPage = window.location.href.split('#')[1];
      var menuid = this.$route.query.id;

      if (ThisPage !== '/') {
        if (ThisPage.indexOf('nofresh') === -1) {
          localStorage.setItem('ThisWebPage', ThisPage);
          localStorage.setItem('menuid', menuid);
        }
      }
      this.CheckTimeOut();
    },
    CheckTimeOut: function CheckTimeOut() {
      var _this = this;

      var SubData = {};
      SubData.menuid = this.menuId;
      this.$http.post('/web/user/check/timeout').then(function (response) {
        var ReceiveData = response.body;
        var CodeMsg = ReceiveData.retCode;
        var ThisPage = window.location.href.split('#')[1];

        if (CodeMsg === '0000') {
          if (ThisPage.indexOf('share') > 0) {
            _this.$router.push(ThisPage);
          } else {
            _this.$router.push('/');
          }
        } else {
          if (ThisPage.indexOf('nofresh') > 0) {} else {
            _this.$router.push(localStorage.getItem('ThisWebPage'));
          }
        }
      });
    }
  }
});

//# sourceMappingURL=main-compiled.js.map