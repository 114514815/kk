/* kk-liquid-glass — 全静态前端展示页
 * ES5 兼容写法:IE11 / Safari 9 / Chrome 45+ 全部可跑
 * 全部 DOM 操作使用安全的 API,没有任何 innerHTML / eval / Function,
 * 没有外部资源加载,没有用户数据持久化。
 */
(function () {
  'use strict';

  // 老浏览器无 addEventListener / querySelector 时直接跳过
  if (!document.addEventListener || !document.querySelector) return;

  // -------- 涟漪:点击 .glass-word 任意位置都触发 --------
  var glass = document.querySelector('.glass-word');
  if (glass) {
    function spawnRipple(x, y) {
      var r = document.createElement('div');
      r.className = 'ripple';
      r.style.left = x + 'px';
      r.style.top  = y + 'px';
      document.body.appendChild(r);
      // 优先用 animationend(IE11 支持),fallback 用 setTimeout
      var cleaned = false;
      function cleanup() {
        if (cleaned) return;
        cleaned = true;
        if (r.parentNode) r.parentNode.removeChild(r);
      }
      if ('onanimationend' in window) {
        r.addEventListener('animationend', cleanup, { once: true });
        setTimeout(cleanup, 1200);
      } else {
        setTimeout(cleanup, 900);
      }
    }

    // 父级类名匹配(用 ES5 字符串方法代替 classList.contains)
    function hasClass(node, cls) {
      if (!node || !node.className || typeof node.className !== 'string') return false;
      // 单词边界匹配,避免 'boost' 命中 'boosted'
      return (' ' + node.className + ' ').indexOf(' ' + cls + ' ') !== -1;
    }

    function onTap(e) {
      // 跳过任何带禁用/特殊类的祖先(虽然现在 boost/lang 都不在 glass-word 内,保险)
      var n = e.target;
      while (n && n !== glass) {
        if (hasClass(n, 'boost') || hasClass(n, 'lang-btn') || hasClass(n, 'lang-switch')) return;
        n = n.parentNode;
      }
      var x, y;
      if (e.changedTouches && e.changedTouches.length) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }
      if (typeof x !== 'number' || typeof y !== 'number') return;
      spawnRipple(x, y);
    }

    glass.addEventListener('click', onTap);
  }

  // -------- 后台标签暂停轨道动画 --------
  var orbit = document.querySelector('.orbit');
  if (orbit) {
    function syncPlay() {
      orbit.style.animationPlayState = document.hidden ? 'paused' : 'running';
    }
    document.addEventListener('visibilitychange', syncPlay);
  }

  // -------- GitHub Stars 计数 --------
  var starsEl = document.querySelector('.stars-count');
  if (starsEl && window.fetch) {
    var url = 'https://api.github.com/repos/ZCH-KK/kk';
    fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var n = data && typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
        if (n == null) throw new Error('no count');
        var formatted = n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
        starsEl.textContent = formatted;
      })
      .catch(function () {
        starsEl.setAttribute('title', 'GitHub stars 加载失败');
      });
  }
})();
