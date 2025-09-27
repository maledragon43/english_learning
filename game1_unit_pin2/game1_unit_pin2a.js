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
    cat: '../assets/sounds/mixkit-sweet-kitty-meow-93.wav',
    dog: '../assets/sounds/mixkit-dog-barking-twice-1.wav', 
    tractor: '../assets/sounds/tractor-slowly-passing-by-409413.mp3',
    horse: '../assets/sounds/mixkit-intense-horse-stallion-neigh-76.wav',
    pig: '../assets/sounds/mixkit-pig-grunting-3.wav',
    farm: '../assets/sounds/mixkit-farm-animals-in-the-morning-7.mp3',
    cow: '../assets/sounds/mixkit-cow-moo-in-the-barn-1751.wav',
    duck: '../assets/sounds/duck-quacking-37392.mp3',
    chicken: '../assets/sounds/mixkit-chickens-clucking-short-1772.wav',
    mouse: '../assets/sounds/mouse-36220.mp3'
  };
  
  function tts(text){ try{ const u=new SpeechSynthesisUtterance(text); u.rate=0.95; u.pitch=1; u.lang='en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }
  let currentAudio = null;
  
  function playAnimalSound(animal) {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    try {
      currentAudio = new Audio(animalAudioFiles[animal]);
      currentAudio.play().catch(e => {
        // Fallback to text-to-speech if audio file doesn't exist
        tts(animalSounds[animal]);
      });
    } catch(e) {
      // Fallback to text-to-speech if audio fails
      tts(animalSounds[animal]);
    }
  }
  function stopAllAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    // Also stop any text-to-speech
    speechSynthesis.cancel();
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
  
  window.g1 = { ANIMALS, animalSounds, animalAudioFiles, tts, playAnimalSound, stopAllAudio, post, autoResize, updateCharacterState };
  window.addEventListener('load', autoResize);
  window.addEventListener('resize', autoResize);
})();
