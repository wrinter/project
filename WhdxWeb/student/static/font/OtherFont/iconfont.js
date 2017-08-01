;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-xuanzhong" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M775.698101 246.803394c-65.197253-65.207596-151.877818-101.12-244.088242-101.12s-178.892283 35.912404-244.088242 101.12c-65.208889 65.188202-101.110949 151.870061-101.110949 244.079192 0 92.198788 35.903354 178.880646 101.110949 244.079192 65.19596 65.208889 151.877818 101.12 244.088242 101.12s178.89099-35.912404 244.088242-101.12c65.208889-65.198545 101.110949-151.880404 101.110949-244.079192C876.809051 398.673455 840.905697 311.991596 775.698101 246.803394zM696.623838 390.278465l-185.949091 230.132364c-0.078869 0.09697-0.20299 0.124121-0.280566 0.218505-0.10602 0.129293-0.133172 0.296081-0.245657 0.421495-1.084768 1.212768-2.517333 1.808808-3.776646 2.733253-4.054626 3.079758-8.669091 5.178182-13.608081 5.178182-5.078626 0-10.192162-1.674343-14.449778-5.113535-0.619313-0.497778-0.905051-1.210182-1.457131-1.755798l-107.73204-96.702061c-9.462949-8.482909-10.250343-23.036121-1.754505-32.496485 8.462222-9.460364 23.024485-10.259394 32.496485-1.754505l90.467556 81.207596 170.486949-210.991838c8.001939-9.888323 22.49697-11.406222 32.363313-3.437899C703.074263 365.904162 704.614141 380.388848 696.623838 390.278465z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-close" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M512 1024C229.226667 1024 0 794.773333 0 512 0 229.226667 229.226667 0 512 0 794.773333 0 1024 229.226667 1024 512 1024 794.773333 794.773333 1024 512 1024ZM512 42.666667C252.8 42.666667 42.666667 252.778667 42.666667 512 42.666667 771.2 252.8 981.333333 512 981.333333 771.2 981.333333 981.333333 771.2 981.333333 512 981.333333 252.778667 771.2 42.666667 512 42.666667ZM700.565333 685.461333 685.482667 700.544C681.301333 704.725333 674.56 704.725333 670.378667 700.544L512 542.165333 353.6 700.544C349.44 704.725333 342.698667 704.725333 338.517333 700.544L323.434667 685.461333C319.274667 681.301333 319.274667 674.56 323.434667 670.378667L481.834667 512 323.434667 353.6C319.274667 349.44 319.274667 342.677333 323.434667 338.517333L338.517333 323.434667C342.677333 319.274667 349.44 319.253333 353.6 323.434667L512 481.813333 670.4 323.434667C674.56 319.274667 681.301333 319.253333 685.482667 323.434667L700.565333 338.517333C704.725333 342.677333 704.725333 349.44 700.565333 353.6L542.165333 511.978667 700.565333 670.378667C704.725333 674.56 704.725333 681.301333 700.565333 685.461333Z"  ></path>' +
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