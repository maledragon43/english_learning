(function(){
  const SEA_ANIMALS = ['shells', 'turtle', 'dolphin', 'jellyfish', 'seahorse', 'starfish', 'crab', 'shark', 'penguin', 'clownfish'];
  const FARM_ANIMALS = ['cat', 'dog', 'tractor', 'horse', 'pig', 'farm', 'cow', 'duck', 'chicken', 'mouse'];
  const WILD_ANIMALS = ['crocodile', 'tiger', 'elephant', 'monkey', 'bear', 'frog', 'bird', 'zebra', 'lion', 'giraffe'];
  const COLORS = ['white', 'black', 'grey', 'yellow', 'orange', 'pink', 'red', 'purple', 'blue', 'green', 'brown'];
  
  function post(m){ parent.postMessage(m,'*'); }
  function autoResize(){ const h=document.documentElement.scrollHeight; post({type:'resize', height:h}); }
  function tts(text){ try{ const u=new SpeechSynthesisUtterance(text); u.rate=.95; u.lang='en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }
  
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
  
  window.g3 = { SEA_ANIMALS, FARM_ANIMALS, WILD_ANIMALS, COLORS, post, autoResize, tts, updateCharacterState };
  window.addEventListener('load', autoResize);
  window.addEventListener('resize', autoResize);
})();
