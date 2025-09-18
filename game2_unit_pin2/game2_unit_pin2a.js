(function(){
  const ANIMALS = ['cat', 'dog', 'tractor', 'horse', 'pig', 'farm', 'cow', 'duck', 'chicken', 'mouse'];
  const animalSounds = { 
    cat: 'meow', 
    dog: 'woof', 
    tractor: 'chug chug', 
    horse: 'neigh', 
    pig: 'oink', 
    farm: 'farm sounds', 
    cow: 'moo', 
    duck: 'quack', 
    chicken: 'cluck cluck', 
    mouse: 'squeak' 
  };
  
  function tts(text){ try{ const u=new SpeechSynthesisUtterance(text); u.rate=0.95; u.pitch=1; u.lang='en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }
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
  
  window.g2 = { ANIMALS, animalSounds, tts, post, autoResize, updateCharacterState };
  window.addEventListener('load', autoResize);
  window.addEventListener('resize', autoResize);
})();
