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
  
  const animalAudioFiles = {
    cat: '../assets/sounds/cat.mp3',
    dog: '../assets/sounds/dog.mp3', 
    tractor: '../assets/sounds/tractor.mp3',
    horse: '../assets/sounds/horse.mp3',
    pig: '../assets/sounds/pig.mp3',
    farm: '../assets/sounds/farm.mp3',
    cow: '../assets/sounds/cow.mp3',
    duck: '../assets/sounds/duck.mp3',
    chicken: '../assets/sounds/chicken.mp3',
    mouse: '../assets/sounds/mouse.mp3'
  };
  
  function tts(text){ try{ const u=new SpeechSynthesisUtterance(text); u.rate=0.95; u.pitch=1; u.lang='en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }
  function playAnimalSound(animal) {
    try {
      const audio = new Audio(animalAudioFiles[animal]);
      audio.play().catch(e => {
        // Fallback to text-to-speech if audio file doesn't exist
        tts(animalSounds[animal]);
      });
    } catch(e) {
      // Fallback to text-to-speech if audio fails
      tts(animalSounds[animal]);
    }
  }
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
  
  window.g1 = { ANIMALS, animalSounds, animalAudioFiles, tts, playAnimalSound, post, autoResize, updateCharacterState };
  window.addEventListener('load', autoResize);
  window.addEventListener('resize', autoResize);
})();
