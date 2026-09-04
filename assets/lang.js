/* 中英双语切换
 * 优先级:URL ?lang=xx > localStorage > 浏览器语言 > 默认 zh
 * 用法:HTML 元素带 data-zh / data-en 属性,脚本按当前语言填入
 */
(function () {
  'use strict';
  if (!document.querySelectorAll) return;

  // ---- 检测目标语言 ----
  function detectLang() {
    var qsLang = (function () {
      var m = window.location.search.match(/[?&]lang=([a-zA-Z-]+)/);
      return m ? m[1].toLowerCase() : null;
    })();

    if (qsLang && /^zh|en/i.test(qsLang)) {
      try { localStorage.setItem('kk-lang', qsLang); } catch (e) {}
      return /^zh/i.test(qsLang) ? 'zh' : 'en';
    }

    try {
      var stored = localStorage.getItem('kk-lang');
      if (stored === 'zh' || stored === 'en') return stored;
    } catch (e) {}

    var nav = (navigator.language || navigator.userLanguage || 'zh').toLowerCase();
    if (/^en/i.test(nav)) return 'en';
    return 'zh';
  }

  var lang = detectLang();

  function apply() {
    var nodes = document.querySelectorAll('[data-zh][data-en]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var text = n.getAttribute(lang === 'en' ? 'data-en' : 'data-zh');
      // 安全:只改 textContent,不碰 innerHTML
      if (text != null) n.textContent = text;
    }
    document.documentElement.lang = (lang === 'en') ? 'en' : 'zh-CN';
  }

  // 暴露手动切换 API:window.kkSetLang('zh' | 'en')
  window.kkSetLang = function (next) {
    if (next !== 'zh' && next !== 'en') return;
    try { localStorage.setItem('kk-lang', next); } catch (e) {}
    lang = next;
    apply();
    syncButtons();
    // 通知热修改(及其他订阅者)
    try {
      document.dispatchEvent(new CustomEvent('kk:lang-changed', { detail: { lang: lang } }));
    } catch (e) {}
  };

  function syncButtons() {
    var btns = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      var isActive = b.getAttribute('data-lang') === lang;
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }
  }

  // 按钮点击事件代理(初始化后绑一次)
  function bindButtons() {
    var btns = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var v = this.getAttribute('data-lang');
        if (v) window.kkSetLang(v);
      });
    }
    syncButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { apply(); bindButtons(); });
  } else {
    apply();
    bindButtons();
  }
})();