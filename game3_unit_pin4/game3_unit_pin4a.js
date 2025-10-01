(function(){
  const SEA_ANIMALS = ['shells', 'turtle', 'dolphin', 'jellyfish', 'seahorse', 'starfish', 'crab', 'shark', 'penguin', 'clownfish'];
  const FARM_ANIMALS = ['cat', 'dog', 'horse', 'pig', 'cow', 'duck', 'chicken', 'mouse'];
  const WILD_ANIMALS = ['crocodile', 'tiger', 'elephant', 'monkey', 'bear', 'frog', 'bird', 'zebra', 'lion'];
  const COLORS = ['white', 'black', 'grey', 'yellow', 'orange', 'pink', 'red', 'purple', 'blue', 'green', 'brown'];
  
  // Game turns data
  const GAME_TURNS = [
    {
      category: 'farm',
      animals: FARM_ANIMALS,
      instructions: [
        { animal: 'cat', color: 'blue', text: 'Colour the cat blue!' },
        { animal: 'dog', color: 'orange', text: 'Colour the dog orange!' },
        { animal: 'pig', color: 'pink', text: 'Colour the pig pink!' },
        { animal: 'cow', color: 'black', text: 'Colour the cow black!' },
        { animal: 'duck', color: 'green', text: 'Colour the duck green!' }
      ]
    },
    {
      category: 'sea',
      animals: SEA_ANIMALS,
      instructions: [
        { animal: 'seashell', color: 'purple', text: 'Colour the seashell purple!' },
        { animal: 'starfish', color: 'yellow', text: 'Colour the starfish yellow!' },
        { animal: 'dolphin', color: 'blue', text: 'Colour the dolphin blue!' },
        { animal: 'jellyfish', color: 'pink', text: 'Colour the jellyfish pink!' },
        { animal: 'shark', color: 'grey', text: 'Colour the shark grey!' }
      ]
    },
    {
      category: 'wild',
      animals: WILD_ANIMALS,
      instructions: [
        { animal: 'lion', color: 'yellow', text: 'Colour the lion yellow!' },
        { animal: 'tiger', color: 'orange', text: 'Colour the tiger orange!' },
        { animal: 'elephant', color: 'grey', text: 'Colour the elephant grey!' },
        { animal: 'bear', color: 'brown', text: 'Colour the bear brown!' },
        { animal: 'frog', color: 'green', text: 'Colour the frog green!' }
      ]
    }
  ];
  
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
  
  window.g3 = { SEA_ANIMALS, FARM_ANIMALS, WILD_ANIMALS, COLORS, GAME_TURNS, post, autoResize, tts, updateCharacterState };
  window.addEventListener('load', autoResize);
  window.addEventListener('resize', autoResize);
})();
