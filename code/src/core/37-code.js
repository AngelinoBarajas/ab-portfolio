  /* ---------- code blocks (CMS snippets on the Mission template systems/problems and the Services "under the hood"; one Copy handler site-wide) ---------- */
  function codeLang(c){ var t = c.trim(); if (t.charAt(0) === '<') return 'html'; if (/^(\/\*|:root|[.#@a-z][^{(=]*\{)/i.test(t) && !/function|var |=>/.test(t)) return 'css'; return 'js'; }
  function hl(code, lang){
    var re = lang === 'css' ? /(\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|vh|vw|rem|em|%|s|ms|fr)?)|(--[\w-]+|[a-z-]+(?=\s*:))|(@media|!important)/g
      : lang === 'html' ? /(<!--[\s\S]*?-->)|("[^"]*")|(\b\d+\.?\d*\b)|(<\/?[\w-]+|\/?>)|([\w-]+(?==))/g
      : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+\.?\d*\b)|(\b(?:var|function|return|if|else|for|new|true|false|null|this|typeof|continue|break)\b)|(\b(?:window|document|Math|Object)\b)/g;
    var out = '', last = 0, m, cls = ['c', 's', 'n', 'k', 'g'];
    while ((m = re.exec(code))){ out += esc(code.slice(last, m.index)); for (var g = 1; g <= 5; g++) if (m[g] != null){ out += '<i class="t-' + cls[g - 1] + '">' + esc(m[0]) + '</i>'; break; } last = re.lastIndex; }
    return out + esc(code.slice(last));
  }
  function codeBlock(code, label){ var lang = codeLang(code); return '<figure class="cb"><figcaption><span class="cb-l">' + lang.toUpperCase() + '</span><span class="cb-n">' + esc(label || 'excerpt') + '</span><button type="button" class="cb-copy">Copy</button></figcaption><pre><code>' + hl(code, lang) + '</code></pre></figure>'; }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.cb-copy'); if (!b) return;
    var t = b.closest('.cb').querySelector('code').textContent;
    function done(){ b.textContent = 'Copied'; b.classList.add('ok'); setTimeout(function(){ b.textContent = 'Copy'; b.classList.remove('ok'); }, 1400); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, done); else done();
  });
  Object.assign(AB, { codeBlock: codeBlock });
