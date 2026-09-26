  /* ---------- side quests: the site's easter eggs, logged per browser (localStorage ab:quests).
     Any bundle reports a find with AB.quest('id'). A toast says so (after the egg's own toast has had its moment);
     the first find also says where the log lives (About › Player one). The log UI is in ab-about. ---------- */
  var QUESTS = [
    ['boss', 'Defeat The Scope Creep', 'A certain card on the About page gets interesting at level 20.'],
    ['konami', 'Enter the cheat code', 'Some codes never die. Up, up… (on a phone, swipe it on the Player one screen, then tap twice).'],
    ['badge', 'Flip the crew badge', 'Every ID has a back side.'],
    ['lanyard', 'Swing the lanyard', 'That badge is on a string for a reason.'],
    ['book', 'Knock a book off the shelf', 'The bookshelf is a little crowded.'],
    ['endurance', 'Fly the Endurance close', 'Get close to something very heavy.'],
    ['escape', 'Break the Endurance free', 'Near the horizon? Hit the thrusters: tap the black hole, fast.'],
    ['spin', 'Spin a planet', 'Not every planet sits still.'],
    ['questions', 'Ask every question', 'A philosopher never stops at one.'],
    ['satellite', 'Make the satellite leave', 'Something on the homepage really hates being dragged.'],
    ['toys', 'Throw a headline around', 'Headlines here are toys.'],
    ['blackhole', 'Feed the black hole', 'Scroll all the way down. It\'s hungry.'],
    ['channels', 'Watch every channel', 'Mission monitors carry more than one channel.'],
    ['diagnostics', 'Run diagnostics', 'Launch control can tell you what\'s wrong.'],
    ['touchdown', 'Land a mission', 'Follow a flight plan all the way to the end.'],
    ['aside', 'Read the fine print', 'Some things on this site whisper when you hover (or tap) them.']
  ];
  var QKEY = 'ab:quests', qFound = {};
  try { qFound = JSON.parse(localStorage.getItem(QKEY) || '{}') || {}; } catch (e){ qFound = {}; }
  function qCount(){ var n = 0; QUESTS.forEach(function(q){ if (qFound[q[0]]) n++; }); return n; }
  function qSave(){ try { localStorage.setItem(QKEY, JSON.stringify(qFound)); } catch (e){} }
  function qEmit(id){ var d = { id: id, n: qCount(), total: QUESTS.length }; try { document.dispatchEvent(new CustomEvent('ab:quest', { detail: d })); } catch (e){} }
  function quest(id){
    var q = null; QUESTS.forEach(function(x){ if (x[0] === id) q = x; });
    if (!q || qFound[id]) return false;
    qFound[id] = Date.now(); qSave();
    var n = qCount(), N = QUESTS.length, onAbout = !!document.querySelector('[data-gm]');
    setTimeout(function(){
      toast('✦ Side quest complete · ' + q[1] + ' · ' + n + '/' + N);
      if (n === N) setTimeout(function(){ toast('Every side quest found. The crew badge went gold.'); }, 2800);
      else if (n === 1) setTimeout(function(){ toast(onAbout ? 'Side quests are logged on the Player one card' : 'Side quests are logged on About › Player one'); }, 2800);
    }, 2400);
    qEmit(id);
    return true;
  }
  quest.list = QUESTS;
  quest.has = function(id){ return !!qFound[id]; };
  quest.count = qCount;
  quest.reset = function(){ qFound = {}; qSave(); qEmit(''); };
  AB.quest = quest;
