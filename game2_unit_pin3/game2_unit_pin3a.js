(function(){
  const FARM_ANIMALS = ['cat', 'dog', 'tractor', 'horse', 'pig', 'farm', 'cow', 'duck', 'chicken', 'mouse'];
  const WILD_ANIMALS = ['crocodile', 'tiger', 'elephant', 'monkey', 'bear', 'frog', 'bird', 'zebra', 'lion', 'giraffe'];
  
  // Animal image mappings
  const FARM_ANIMAL_IMAGES = {
    'cat': 'cat.png',
    'dog': 'dog.png', 
    'tractor': 'tractor.png',
    'horse': 'horse.png',
    'pig': 'pig.png',
    'farm': 'farm.png',
    'cow': 'cow.png',
    'duck': 'duck.png',
    'chicken': 'chicken.png',
    'mouse': 'mouse.png'
  };
  
  const WILD_ANIMAL_IMAGES = {
    'crocodile': 'crocodile.png',
    'tiger': 'tiger-orange.png',
    'elephant': 'elephant-grey.png',
    'monkey': 'monkey-brown.png',
    'bear': 'bear-brown.png',
    'frog': 'frog-green.png',
    'bird': 'bird-blue.png',
    'zebra': 'zebra.png',
    'lion': 'lion-brown-and-orange.png',
    'giraffe': 'giraffe.png'
  };
  
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
  
  window.g2 = { FARM_ANIMALS, WILD_ANIMALS, FARM_ANIMAL_IMAGES, WILD_ANIMAL_IMAGES, post, autoResize, tts, updateCharacterState };
  window.addEventListener('load', autoResize);
  window.addEventListener('resize', autoResize);
})();
