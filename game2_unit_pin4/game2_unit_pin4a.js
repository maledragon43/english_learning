(function(){
  const SEA_ANIMALS = ['shells', 'turtle', 'dolphin', 'jellyfish', 'seahorse', 'starfish', 'crab', 'shark', 'penguin', 'clownfish'];
  const FARM_ANIMALS = ['cat', 'dog', 'horse', 'pig', 'cow', 'duck', 'chicken', 'mouse'];
  const WILD_ANIMALS = ['crocodile', 'tiger', 'elephant', 'monkey', 'bear', 'frog', 'bird', 'zebra', 'lion'];
  
  // Balloon image mappings - ONLY from balloons_animal folder
  const BALLOON_IMAGES = {
    // Sea animals
    'shells': 'shells_balloon.png',
    'turtle': 'turtle_balloon.png',
    'dolphin': 'dolphin_balloon.png',
    'jellyfish': 'jellyfish_balloon.png',
    'seahorse': 'seahorse_balloon.png',
    'starfish': 'starfish_balloon.png',
    'crab': 'crab_balloon.png',
    'shark': 'shark_balloon.png',
    'penguin': 'penguin_balloon.png',
    'clownfish': 'clownfish_balloon.png',
    
    // Farm animals
    'cat': 'black-cat_balloon.png',
    'dog': 'black-dog_balloon.png',
    'horse': 'white-horse_balloon.png',
    'pig': 'pig_balloon.png',
    'cow': 'black-and-white-cat_balloon.png', // Using available cat balloon
    'duck': 'duck_balloon.png',
    'chicken': 'red-bird_balloon.png', // Using available bird balloon
    'mouse': 'mouse_balloon.png',
    
    // Wild animals
    'crocodile': 'crocodile_balloon.png',
    'tiger': 'tiger_balloon.png',
    'elephant': 'blue-elephant_balloon.png',
    'monkey': 'black-monkey_balloon.png',
    'bear': 'black-bear_balloon.png',
    'frog': 'green-frog_balloon.png',
    'bird': 'orange-bird_balloon.png',
    'zebra': 'zebra_balloon.png',
    'lion': 'lion_balloon.png'
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
  
  window.g2 = { SEA_ANIMALS, FARM_ANIMALS, WILD_ANIMALS, BALLOON_IMAGES, post, autoResize, tts, updateCharacterState };
  window.addEventListener('load', autoResize);
  window.addEventListener('resize', autoResize);
})();
