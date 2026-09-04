/* ======================================================
   IE 11 专用 polyfills(被 IE 条件注释加载)
   提供:
   - Element.matches / closest(IE11 部分支持,统一补)
   - Array.isArray
   - Object.assign(IE 不支持)
   - requestAnimationFrame / cancelAnimationFrame
   ====================================================== */
(function () {
  'use strict';

  // Element.prototype.matches
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }

  // Element.prototype.closest(IE11 完全没有)
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
      var el = this;
      while (el && el.nodeType === 1) {
        if (el.matches(selector)) return el;
        el = el.parentElement || el.parentNode;
      }
      return null;
    };
  }

  // Array.isArray
  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }

  // Object.assign
  if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
      if (target == null) throw new TypeError('Cannot convert undefined or null to object');
      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i];
        if (src != null) {
          for (var k in src) {
            if (Object.prototype.hasOwnProperty.call(src, k)) {
              to[k] = src[k];
            }
          }
        }
      }
      return to;
    };
  }

  // requestAnimationFrame
  var vendors = ['webkit', 'moz', 'ms', 'o'];
  var lastTime = 0;
  if (!window.requestAnimationFrame) {
    for (var i = 0; i < vendors.length; i++) {
      if (window[vendors[i] + 'RequestAnimationFrame']) {
        window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] ||
                                       window[vendors[i] + 'CancelRequestAnimationFrame'];
        break;
      }
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (cb) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () { cb(currTime + timeToCall); }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
      window.cancelAnimationFrame = function (id) { clearTimeout(id); };
    }
  }

  // NodeList.forEach (IE 没有)
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  // CustomEvent (IE 9+ 需要 document.createEvent 兜底)
  try {
    new CustomEvent('test');
  } catch (e) {
    window.CustomEvent = function (event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
  }
})();