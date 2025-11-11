// Amanda - versão bonita e caprichada (feito por Wen)
// Implementação de interações: flying stars, star notes, moon modal, couple image upload, poems, many-language hearts

const qs = (s,ctx=document)=>ctx.querySelector(s);
const qsa = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));

// Data
const starNotes = [
  'Seu riso acende a manhã inteira.',
  'Eu encontro paz no som da sua respiração.',
  'Segurar sua mão é meu gesto favorito.',
  'Você me faz querer ser melhor, sempre.',
  'Prometo cuidar do teu coração com carinho.',
  'Cada dia ao teu lado vira minha lembrança preferida.',
  'Seu abraço é mapa para casa.',
  'Quero construir pequenos rituais só nossos.',
  'Seu jeito me ensina o que é ternura.',
  'Com você, o futuro parece mais leve.'
];

const moonDeclaration = `Amanda, minha luz:

Escrever isso é tentar explicar o que sinto com a pouca força que as palavras têm diante do que você me faz sentir. Confio em você com todo o coração — confio nas suas escolhas, nas suas intenções e no seu jeito de cuidar. Quando digo que te amo, não é apenas um sentimento solto; é a promessa de permanecer, de aprender, de estar presente em cada manhã e em cada queda.

Quero ser tua companhia firme: nos risos fáceis, nas conversas silenciosas, nas pequenas decisões de todo dia. Quero construir com você um lar de gestos simples, leais e cheios de cuidado. Amanda, eu te amo com calma e com fogo; te escolho hoje, amanhã e sempre. — Wen`;

// init
window.addEventListener('load', ()=>{
  populateStarNotes();
  createFlyingStars();
  setupMoon();
  setupCoupleUploads();
  populatePoems();
  populateHearts();
});

function populateStarNotes(){
  const list = qs('#starNotes');
  starNotes.forEach(t=>{
    const el = document.createElement('div');
    el.className = 'star-item';
    el.textContent = '★ ' + t;
    list.appendChild(el);
  });
}

function createFlyingStars(){
  const bg = qs('#bgWrap');
  for(let i=0;i<20;i++){
    const s = document.createElement('div');
    s.className = 'fly-star';
    const size = Math.random()*3 + 2;
    s.style.width = s.style.height = size + 'px';
    s.style.position = 'absolute';
    s.style.left = (Math.random()*80 + 10) + '%';
    s.style.top = (Math.random()*60 + 10) + '%';
    s.style.background = 'radial-gradient(circle, rgba(255,255,255,1), rgba(255,255,255,0.6) 40%, rgba(255,255,255,0) 70%)';
    s.style.borderRadius = '50%'; s.style.boxShadow = '0 0 10px rgba(255,255,255,0.12)';
    const note = starNotes[i % starNotes.length];
    s.dataset.note = note;
    s.addEventListener('click', (ev)=> showNoteAt(ev.clientX, ev.clientY, note));
    bg.appendChild(s);
  }
  setInterval(()=> driftStars(), 2400);
}

function driftStars(){
  const stars = Array.from(document.querySelectorAll('.fly-star'));
  stars.forEach(s=>{
    const dx = (Math.random()*30 - 15);
    const dy = (Math.random()*20 - 10);
    s.style.transform = `translate(${dx}px, ${dy}px)`;
  });
}

let noteTimer;
function showNoteAt(x,y,text){
  clearTimeout(noteTimer);
  let tip = qs('#starTip');
  if(!tip){
    tip = document.createElement('div'); tip.id='starTip';
    tip.style.position='fixed'; tip.style.zIndex=9999;
    tip.style.background='white'; tip.style.color='#111'; tip.style.padding='10px 14px';
    tip.style.borderRadius='10px'; tip.style.boxShadow='0 8px 30px rgba(0,0,0,0.35)'; document.body.appendChild(tip);
  }
  tip.textContent = text;
  tip.style.left = (x+12)+'px'; tip.style.top = (y+12)+'px'; tip.style.opacity = '1';
  noteTimer = setTimeout(()=> tip.style.opacity = '0', 4800);
  // audio
  try{
    if(!window.audioCtx) window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = window.audioCtx.createOscillator(); const g = window.audioCtx.createGain();
    o.type='sine'; o.frequency.value = 880 + Math.random()*120; g.gain.value = 0.0001;
    o.connect(g); g.connect(window.audioCtx.destination); const now = window.audioCtx.currentTime;
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.02, now + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o.start(now); o.stop(now + 0.14);
  }catch(e){}
}

function setupMoon(){
  const moon = qs('#moonCard'); const modal = qs('#moonModal'); const close = qs('#closeModal'); const text = qs('#moonText');
  moon.addEventListener('click', ()=>{ text.textContent = moonDeclaration; modal.classList.add('show'); playMoonChord(); });
  moon.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { text.textContent = moonDeclaration; modal.classList.add('show'); playMoonChord(); } });
  close.addEventListener('click', ()=> modal.classList.remove('show'));
  modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('show'); });
}

function playMoonChord(){
  try{
    if(!window.audioCtx) window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = window.audioCtx; const now = ctx.currentTime; const freqs=[330,440,550];
    freqs.forEach((f,i)=>{ const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='sine'; o.frequency.value=f; g.gain.value=0.0001; o.connect(g); g.connect(ctx.destination); g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.025/(i+1), now+0.02); g.gain.exponentialRampToValueAtTime(0.0001, now+1.2); o.start(now); o.stop(now+1.2); });
  }catch(e){}
}

function setupCoupleUploads(){
  const grid = qs('#coupleGrid'); const input = qs('#fileInput');
  grid.addEventListener('click', (e)=>{ const card = e.target.closest('.couple-card'); if(!card) return; input.dataset.target = Array.from(grid.children).indexOf(card); input.click(); });
  input.addEventListener('change', (e)=>{ const files=Array.from(e.target.files); files.forEach((file, idx)=>{ const reader=new FileReader(); reader.onload=(ev)=>{ const i=Number(input.dataset.target)||0; const card=grid.children[i % grid.children.length]; const div=card.querySelector('.img'); div.style.backgroundImage=`url(${ev.target.result})`; div.textContent=''; }; reader.readAsDataURL(file); }); input.value=''; });
  // drag & drop
  grid.addEventListener('dragover', (e)=>{ e.preventDefault(); grid.classList.add('dragover'); });
  grid.addEventListener('dragleave', ()=>grid.classList.remove('dragover'));
  grid.addEventListener('drop', (e)=>{ e.preventDefault(); grid.classList.remove('dragover'); const files = Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith('image/')); files.forEach((file, idx)=>{ const reader=new FileReader(); reader.onload=(ev)=>{ const card=grid.children[idx % grid.children.length]; const div=card.querySelector('.img'); div.style.backgroundImage=`url(${ev.target.result})`; div.textContent=''; }; reader.readAsDataURL(file); }); });
}

function populatePoems(){
  const poems = [
    'Teu riso é lume que clareia meus dias.',
    'No teu abraço aprendi o significado de lar.',
    'Quero fazer pequenas festas só para te ver sorrir.',
    'Seus olhos guardam o mapa do meu caminho.'
  ];
  const pg = qs('#poemsGrid');
  poems.forEach(p=>{ const c=document.createElement('div'); c.className='poem-card'; c.textContent = p; pg.appendChild(c); });
}

function populateHearts(){
  const list = [
    {lang:'Português',text:'Eu te amo, Amanda.',color:'#ff6b9a'},
    {lang:'Inglês',text:'I love you, Amanda.',color:'#7ad7ff'},
    {lang:'Espanhol',text:'Te amo, Amanda.',color:'#ffb86b'},
    {lang:'Francês',text:"Je t'aime, Amanda.",color:'#b77dff'},
    {lang:'Italiano',text:'Ti amo, Amanda.',color:'#ff7aa2'},
    {lang:'Alemão',text:'Ich liebe dich, Amanda.',color:'#6be8b0'},
    {lang:'Japonês',text:'愛してる, Amanda.',color:'#ffd36b'},
    {lang:'Coreano',text:'사랑해, Amanda.',color:'#9be0ff'},
    {lang:'Chinês',text:'我爱你, Amanda.',color:'#a0ffa8'},
    {lang:'Árabe',text:'أحبكِ يا Amanda.',color:'#b3aefd'}
  ];
  const row = qs('#heartsRow'); const phrase = qs('#ilangPhrase');
  list.forEach(p=>{
    const b = document.createElement('button'); b.className='lang-heart'; b.style.background = p.color; b.title = p.lang; b.innerHTML='❤';
    b.addEventListener('click', ()=>{ phrase.textContent = p.text; try{ if(window.speechSynthesis){ const ut = new SpeechSynthesisUtterance(p.text); window.speechSynthesis.cancel(); window.speechSynthesis.speak(ut);} }catch(e){} });
    row.appendChild(b);
  });
}