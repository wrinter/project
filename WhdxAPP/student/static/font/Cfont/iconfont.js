;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-cuowu" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M547.2 512l416-416c9.6-9.6 9.6-25.6 0-35.2s-25.6-9.6-35.2 0l-416 416-416-416c-9.6-9.6-25.6-9.6-35.2 0s-9.6 25.6 0 35.2l416 416-416 416c-9.6 9.6-9.6 25.6 0 35.2s25.6 9.6 35.2 0l416-416 416 416c9.6 9.6 25.6 9.6 35.2 0s9.6-25.6 0-35.2L547.2 512z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-tixing" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M512.004819 84.329412C275.665619 84.329412 83.388536 276.601675 83.388536 512.936056c0 236.3392 192.277082 428.616282 428.616282 428.616282 236.334381 0 428.606645-192.277082 428.606645-428.616282C940.612668 276.601675 748.3392 84.329412 512.004819 84.329412L512.004819 84.329412zM512.004819 888.946447c-207.331087 0-376.009186-168.678099-376.009186-376.009186 0-207.331087 168.678099-375.999548 376.009186-375.999548 207.327473 0 375.999548 168.67328 375.999548 375.999548C888.005572 720.268348 719.332292 888.946447 512.004819 888.946447L512.004819 888.946447zM512.004819 888.946447"  ></path>' +
    '' +
    '<path d="M541.341816 673.561901c7.863115 7.863115 11.797685 17.646532 11.797685 29.340612 0 11.703718-3.934569 21.472678-11.797685 29.340612-7.863115 7.863115-17.646532 11.797685-29.340612 11.797685-11.703718 0-21.477496-3.934569-29.340612-11.797685-7.86432-7.867934-11.797685-17.638099-11.797685-29.340612 0-11.69408 3.933365-21.477496 11.797685-29.340612 7.863115-7.867934 17.636894-11.797685 29.340612-11.797685C523.69408 661.764216 533.477496 665.698786 541.341816 673.561901L541.341816 673.561901zM539.223944 605.802014c6.447586-5.035671 9.679812-14.009525 9.679812-26.917948L548.903755 316.324442c0-12.903605-3.233431-21.87264-9.679812-26.922767-6.456019-5.034466-15.529864-7.55712-27.223944-7.55712-24.607322 0-36.903755 11.096546-36.903755 33.270362l0 264.979878c0 22.183454 12.296433 33.275181 36.903755 33.275181C523.69408 613.365158 532.767925 610.852141 539.223944 605.802014L539.223944 605.802014zM539.223944 605.802014"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)