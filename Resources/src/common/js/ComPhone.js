/**
 * Created by Echonessy on 2017/7/7.
 */

export function SupportPhone () {
  let sUserAgent = navigator.userAgent.toLowerCase()
  let bIsIpad = sUserAgent.indexOf('ipad') > 0
  let bIsIphoneOs = sUserAgent.indexOf('iphone os') > 0
  let bIsMidp = sUserAgent.indexOf('midp') > 0
  let bIsUc7 = sUserAgent.indexOf('rv:1.2.3.4') > 0
  let bIsUc = sUserAgent.indexOf('ucweb') > 0
  let bIsAndroid = sUserAgent.indexOf('android') > 0
  let Support = (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid)
  if (Support) {
    (function (win) {
      var doc = win.document
      var docEl = doc.documentElement
      var tid
      function refreshRem () {
        var width = docEl.getBoundingClientRect().width
        if (width > 800) { // 最大宽度
          width = 800
        }
        var rem = width / 10// 将屏幕宽度分成10份， 1份为1rem
        docEl.style.fontSize = rem + 'px'
        // rem用font-size:75px来进行换算
      }
      win.addEventListener('resize', function () {
        clearTimeout(tid)
        tid = setTimeout(refreshRem, 1)
      }, false)
      win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
          clearTimeout(tid)
          tid = setTimeout(refreshRem, 1)
        }
      }, false)
      refreshRem()
    })(window)
  }
}

export function SupportAgent () {
  let sUserAgent = navigator.userAgent.toLowerCase()
  let bIsIpad = sUserAgent.indexOf('ipad') > 0
  let bIsIphoneOs = sUserAgent.indexOf('iphone os') > 0
  let bIsMidp = sUserAgent.indexOf('midp') > 0
  let bIsUc7 = sUserAgent.indexOf('rv:1.2.3.4') > 0
  let bIsUc = sUserAgent.indexOf('ucweb') > 0
  let bIsAndroid = sUserAgent.indexOf('android') > 0
  let Support = (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid)
  return Support
}
