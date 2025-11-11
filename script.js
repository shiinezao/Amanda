// Amanda - versão caprichada (v2)
// Features:
// - background (Van Gogh Starry Night via Wikimedia Commons)
// - ambient music via WebAudio (gentle pad loop synthesized)
// - couples grid (images can be uploaded/dragged to replace)
// - many-language hearts with colors per language
// - mini poems generated and shown
// - deep declaration in About tab (Wen -> Amanda)

// ----------------------- Helpers -----------------------
function el(q,ctx=document){return ctx.querySelector(q)}
function elAll(q,ctx=document){return Array.from(ctx.querySelectorAll(q))}

// ----------------------- Tabs -----------------------
const tabs = elAll('.tab');
const panels = elAll('.panel');
tabs.forEach(t=> t.addEventListener('click', ()=>{
  tabs.forEach(x=>x.classList.remove('active'));
  panels.forEach(p=>p.classList.remove('active'));
  t.classList.add('active');
  document.getElementById(t.dataset.tab).classList.add('active');
  t.setAttribute('aria-selected','true');
}));

// ----------------------- Music (simple ambient loop with WebAudio) -----------------------
let audioCtx, masterGain;
let isMusicOn = false;
const toggleBtn = el('#toggleMusic');
const volSlider = el('#vol');

function createAmbient(){
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = Number(volSlider.value);
  masterGain.connect(audioCtx.destination);

  // create two detuned oscillators + noise for texture
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const g1 = audioCtx.createGain();
  const g2 = audioCtx.createGain();
  osc1.type = 'sine'; osc2.type = 'sine';
  osc1.frequency.value = 220; osc2.frequency.value = 277.5;
  g1.gain.value = 0.004; g2.gain.value = 0.003;
  osc1.connect(g1); g1.connect(masterGain);
  osc2.connect(g2); g2.connect(masterGain);
  osc1.start(); osc2.start();

  // slow LFO to modulate gains for motion
  const lfo = audioCtx.createOscillator();
  lfo.frequency.value = 0.08;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 0.0025;
  lfo.connect(lfoGain);
  lfoGain.connect(g1.gain); lfoGain.connect(g2.gain);
  lfo.start();

  return {osc1, osc2, lfo, g1, g2};
}

let ambientNodes;
function startMusic(){
  if(!audioCtx){ ambientNodes = createAmbient(); }
  masterGain.gain.value = Number(volSlider.value);
  isMusicOn = true;
  toggleBtn.textContent = '🎵 Música: ON';
}

function stopMusic(){
  if(masterGain) masterGain.gain.value = 0.00001;
  isMusicOn = false;
  toggleBtn.textContent = '🎵 Música: OFF';
}

toggleBtn.addEventListener('click', ()=>{
  if(!audioCtx) startMusic();
  else {
    if(isMusicOn) stopMusic();
    else startMusic();
  }
});
volSlider.addEventListener('input', ()=>{ if(masterGain) masterGain.gain.value = Number(volSlider.value); });

// auto-start minimal after user gesture (first click)
window.addEventListener('click', ()=>{ if(!audioCtx) startMusic(); }, {once:true});

// ----------------------- Couples area: image replacement -----------------------
const coupleGrid = el('#coupleGrid');
const fileInput = el('#fileInput');

coupleGrid.addEventListener('click', (e)=>{
  const target = e.target.closest('.couple-card');
  if(!target) return;
  fileInput.dataset.target = Array.from(coupleGrid.children).indexOf(target);
  fileInput.click();
});

fileInput.addEventListener('change', (e)=>{
  const files = Array.from(e.target.files);
  files.forEach((file, idx)=>{
    const reader = new FileReader();
    reader.onload = function(ev){
      const i = Number(fileInput.dataset.target) || 0;
      const card = coupleGrid.children[i % coupleGrid.children.length];
      const div = card.querySelector('.img');
      div.style.backgroundImage = `url(${ev.target.result})`;
      div.textContent = '';
    };
    reader.readAsDataURL(file);
  });
  fileInput.value = '';
});

// ----------------------- Mini poems (humanized, varied) -----------------------
const poems = [
  'Em teu riso encontro mapas que me levam para casa.',
  'Seus olhos seguram o meu dia e o tornam gentil.',
  'Teu abraço tem o calor certo, a calma que cura.',
  'Andar contigo é aprender a achar poesia no comum.',
  'Cada gesto teu é uma pequena verdade que eu guardo.',
  'Quero inventar desculpas para ficar mais tempo ao teu lado.',
  'O teu silêncio nunca é só silêncio quando estamos juntos.'
];
const poemsGrid = el('#poemsGrid');
poems.forEach(p=>{
  const card = document.createElement('div');
  card.className = 'poem-card';
  card.textContent = p;
  poemsGrid.appendChild(card);
});

// ----------------------- Many-languages hearts -----------------------
const lovePhrases = [
  {lang:'Português', text:'Eu te amo, Amanda.', color:'#ff6b9a'},
  {lang:'Inglês', text:'I love you, Amanda.', color:'#7ad7ff'},
  {lang:'Espanhol', text:'Te amo, Amanda.', color:'#ffb86b'},
  {lang:'Francês', text:"Je t'aime, Amanda.", color:'#b77dff'},
  {lang:'Italiano', text:'Ti amo, Amanda.', color:'#ff7aa2'},
  {lang:'Alemão', text:'Ich liebe dich, Amanda.', color:'#6be8b0'},
  {lang:'Holandês', text:'Ik hou van je, Amanda.', color:'#ffd36b'},
  {lang:'Sueco', text:'Jag älskar dig, Amanda.', color:'#9be0ff'},
  {lang:'Norueguês', text:'Jeg elsker deg, Amanda.', color:'#a0ffa8'},
  {lang:'Dinamarquês', text:'Jeg elsker dig, Amanda.', color:'#ffa0d4'},
  {lang:'Finlandês', text:'Rakastan sinua, Amanda.', color:'#b3aefd'},
  {lang:'Polonês', text:'Kocham cię, Amanda.', color:'#ff9e7a'},
  {lang:'Russo', text:'Я тебя люблю, Amanda.', color:'#ff7fe6'},
  {lang:'Ucraniano', text:'Я тебе кохаю, Amanda.', color:'#7ad6ff'},
  {lang:'Japonês', text:'愛してる, Amanda.', color:'#ffd36b'},
  {lang:'Coreano', text:'사랑해, Amanda.', color:'#9be0ff'},
  {lang:'Chinês (Mandarim)', text:'我爱你, Amanda.', color:'#a0ffa8'},
  {lang:'Hindi', text:'मैं तुमसे प्यार करता हूँ, Amanda.', color:'#ffa0d4'},
  {lang:'Árabe', text:'أحبكِ يا Amanda.', color:'#b3aefd'},
  {lang:'Hebraico', text:'אני אוהב אותך, Amanda.', color:'#ff9e7a'},
  {lang:'Grego', text:'Σ\' αγαπώ, Amanda.', color:'#ff7fe6'},
  {lang:'Turco', text:'Seni seviyorum, Amanda.', color:'#7ad6ff'},
  {lang:'Tailandês', text:'ฉันรักคุณ, Amanda.', color:'#ffd36b'},
  {lang:'Vietnamita', text:'Anh yêu em, Amanda.', color:'#9be0ff'},
  {lang:'Indonésio', text:'Aku cinta kamu, Amanda.', color:'#a0ffa8'},
  {lang:'Tcheco', text:'Miluji tě, Amanda.', color:'#ffa0d4'},
  {lang:'Húngaro', text:'Szeretlek, Amanda.', color:'#b3aefd'},
  {lang:'Romeno', text:'Te iubesc, Amanda.', color:'#ff9e7a'},
  {lang:'Búlgaro', text:'Обичам те, Amanda.', color:'#ff7fe6'},
  {lang:'Sérvio', text:'Волим те, Amanda.', color:'#7ad6ff'},
  {lang:'Croata', text:'Volim te, Amanda.', color:'#ffd36b'},
  {lang:'Eslovaco', text:'Ľúbim ťa, Amanda.', color:'#9be0ff'},
  {lang:'Malaiala', text:'ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു, Amanda.', color:'#a0ffa8'},
  {lang:'Filipino', text:'Mahal kita, Amanda.', color:'#ffa0d4'},
  {lang:'Swahili', text:'Nakupenda, Amanda.', color:'#b3aefd'},
  {lang:'Zulu', text:'Ngiyakuthanda, Amanda.', color:'#ff9e7a'},
  {lang:'Basco', text:'Maite zaitut, Amanda.', color:'#ff7fe6'}
];

const heartsRow = el('#heartsRow');
const phraseLarge = el('#phraseLarge');

lovePhrases.forEach((p,i)=>{
  const b = document.createElement('div');
  b.className = 'lang-heart';
  b.style.background = p.color;
  b.title = p.lang;
  b.textContent = '❤';
  b.addEventListener('click', ()=>{
    phraseLarge.textContent = p.text;
    speakPhrase(p.text);
    b.style.transform = 'scale(1.06)';
    setTimeout(()=> b.style.transform = '', 180);
  });
  heartsRow.appendChild(b);
});

// Web Speech API: speak phrase if available (fallback silent if not)
function speakPhrase(text){
  try{
    if('speechSynthesis' in window){
      const ut = new SpeechSynthesisUtterance(text);
      ut.lang = 'pt-BR';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(ut);
    }
  }catch(e){ console.warn('speech error', e); }
}

// ----------------------- Background animated stars (divs in bgArt) -----------------------
function initBackgroundAnimation(){
  const sky = document.getElementById('bgArt');
  for(let i=0;i<60;i++){
    const s = document.createElement('div');
    s.className = 'bg-star';
    const size = Math.random()*3 + 1;
    s.style.position='absolute';
    s.style.width = s.style.height = size + 'px';
    s.style.borderRadius='50%';
    s.style.left = (Math.random()*100) + '%';
    s.style.top = (Math.random()*100) + '%';
    s.style.background = 'rgba(255,255,255,' + (0.15 + Math.random()*0.55) + ')';
    s.style.filter = 'blur(' + (Math.random()*1.2) + 'px)';
    s.style.transform = 'translateZ(0)';
    s.dataset.vx = (Math.random()*0.6 - 0.3).toFixed(3);
    s.dataset.vy = (Math.random()*0.6 - 0.3).toFixed(3);
    sky.appendChild(s);

    // click shows a small poem tooltip (unique)
    const msg = [
      'Teu riso acende a minha manhã.',
      'Você é calma e tempestade, em doses perfeitas.',
      'No teu abraço encontro todas as direções.',
      'Você é a razão dos meus melhores planos.'
    ][i % 4];
    s.addEventListener('click', (ev)=>{
      showTooltip(ev.clientX, ev.clientY, msg);
      speakPhrase(msg);
    });
  }
  requestAnimationFrame(animateBgStars);
}

function animateBgStars(){
  const stars = Array.from(document.querySelectorAll('.bg-star'));
  stars.forEach(s=>{
    let x = parseFloat(s.style.left);
    let y = parseFloat(s.style.top);
    const vx = parseFloat(s.dataset.vx), vy = parseFloat(s.dataset.vy);
    x += vx * 0.02; y += vy * 0.02;
    if(x < -2) x = 102; if(x > 102) x = -2;
    if(y < -2) y = 102; if(y > 102) y = -2;
    s.style.left = x + '%'; s.style.top = y + '%';
  });
  requestAnimationFrame(animateBgStars);
}

// tooltip for bg star messages
let ttTimeout;
function showTooltip(x,y,text){
  clearTimeout(ttTimeout);
  let tip = document.getElementById('bgTooltip');
  if(!tip){
    tip = document.createElement('div');
    tip.id = 'bgTooltip';
    tip.style.position='fixed';
    tip.style.zIndex=9999;
    tip.style.background='rgba(255,255,255,0.95)';
    tip.style.color='#111';
    tip.style.padding='10px 12px';
    tip.style.borderRadius='10px';
    tip.style.boxShadow='0 8px 30px rgba(0,0,0,0.4)';
    document.body.appendChild(tip);
  }
  tip.textContent = text;
  tip.style.left = (x+12)+'px';
  tip.style.top = (y+12)+'px';
  tip.style.opacity = '1';
  ttTimeout = setTimeout(()=>{ tip.style.opacity = '0'; }, 4200);
}

// init on load
window.addEventListener('load', ()=>{
  initBackgroundAnimation();
});