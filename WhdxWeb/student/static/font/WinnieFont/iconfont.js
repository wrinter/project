;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-bofang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M512 0C229.248 0 0 229.248 0 512s229.248 512 512 512 512-229.248 512-512S794.752 0 512 0zM512 960c-247.424 0-448-200.576-448-448s200.576-448 448-448 448 200.576 448 448S759.424 960 512 960z"  ></path>' +
    '' +
    '<path d="M384 256 768 512 384 768Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-iconzhongdianfuhao2" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M922.048 143.36 880.704 101.952 512.064 470.592 143.424 101.952 102.016 143.36 470.656 512 102.016 880.576 143.424 921.92 512 553.344 880.704 922.048 922.048 880.576 553.408 511.936Z"  ></path>' +
    '' +
    '<path d="M513.792 793.216m-70.4 0a1.1 1.1 0 1 0 140.8 0 1.1 1.1 0 1 0-140.8 0Z"  ></path>' +
    '' +
    '<path d="M513.792 231.488m-70.4 0a1.1 1.1 0 1 0 140.8 0 1.1 1.1 0 1 0-140.8 0Z"  ></path>' +
    '' +
    '<path d="M233.024 512.256m-70.4 0a1.1 1.1 0 1 0 140.8 0 1.1 1.1 0 1 0-140.8 0Z"  ></path>' +
    '' +
    '<path d="M794.688 512.256m-70.4 0a1.1 1.1 0 1 0 140.8 0 1.1 1.1 0 1 0-140.8 0Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-4" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M752.358765 392.94958c-44.259016 0-85.552491 12.669554-120.476909 34.561144l-1.532913-5.1503c59.306734-40.989553 98.17395-109.450784 98.17395-186.999998 0-125.464503-101.709473-227.173976-227.173976-227.173976s-227.173976 101.709473-227.173976 227.173976c0 70.428026 32.050973 133.367497 82.359776 175.036525-25.536606-9.93835-53.309136-15.400758-82.359776-15.400758-125.464503 0-227.173976 101.709473-227.173976 227.173976 0 125.464503 101.709473 227.173976 227.173976 227.173976 85.46551 0 159.89364-47.204092 198.672852-116.953665 48.374754 160.595628-74.093509 291.609521-74.093509 291.609521s61.398372 0 210.801077 0c-118.703519-160.14128-58.624189-298.66624-58.624189-298.66624l0.022513-0.052189c37.942147 72.519664 113.88784 122.015961 201.405079 122.015961 125.464503 0 227.173976-101.709473 227.173976-227.173976C979.532741 494.65803 877.823268 392.94958 752.358765 392.94958z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-iconfonticonfontyuandian" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M784 528.331c0 152.011-122.998 275.002-275 275.002-152.003 0-275-122.991-275-275.002 0-151.999 122.998-274.998 275-274.998C661.004 253.329 784 376.332 784 528.331z"  ></path>' +
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