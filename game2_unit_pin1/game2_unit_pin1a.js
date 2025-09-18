(function(){
  const COLORS = ['WHITE','BLACK','GREY','YELLOW','ORANGE','PINK','RED','PURPLE','BLUE','GREEN','BROWN'];
  const palette = { WHITE:'#ffffff', BLACK:'#000000', GREY:'#808080', YELLOW:'#facc15', ORANGE:'#fb923c', PINK:'#f472b6', RED:'#ef4444', PURPLE:'#a78bfa', BLUE:'#60a5fa', GREEN:'#34d399', BROWN:'#8b5e3c' };
  function tts(text){ try{ const u=new SpeechSynthesisUtterance(text); u.rate=0.95; u.lang='en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }
  function post(msg){ parent.postMessage(msg,'*'); }
  function autoResize(){ const h=document.documentElement.scrollHeight; post({type:'resize', height:h}); }
  
  // Character state management
  function updateCharacterState(state) {
    const studentImg = document.querySelector('.game-student');
    if (studentImg) {
      switch(state) {
        case 'correct':
          studentImg.src = '../assets/images/chars/squirrel right.png';
          break;
        case 'wrong':
          studentImg.src = '../assets/images/chars/veverita wrong.png';
          break;
        case 'thinking':
        default:
          studentImg.src = '../assets/images/chars/squirrel think.png';
          break;
      }
    }
  }
  
  window.g2 = { COLORS, palette, tts, post, autoResize, updateCharacterState };
  window.addEventListener('load', autoResize);
  window.addEventListener('resize', autoResize);
})();


