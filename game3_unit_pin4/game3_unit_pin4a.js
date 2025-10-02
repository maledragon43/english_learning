(function(){
  const SEA_ANIMALS = ['shell', 'turtle', 'dolphin', 'jellyfish', 'seahorse', 'starfish', 'crab', 'shark', 'penguin', 'clownfish'];
  const FARM_ANIMALS = ['cat', 'dog', 'horse', 'pig', 'cow', 'duck', 'chicken', 'mouse'];
  const WILD_ANIMALS = ['crocodile', 'tiger', 'elephant', 'monkey', 'bear', 'frog', 'bird', 'zebra', 'lion'];
  const COLORS = ['white', 'black', 'grey', 'yellow', 'orange', 'pink', 'red', 'purple', 'blue', 'green', 'brown'];
  
  // Game turns data - color ALL animals in each turn
  const GAME_TURNS = [
    {
      category: 'sea',
      animals: SEA_ANIMALS,
      instructions: [
        { animal: 'shell', color: 'purple', text: 'Colour the shell purple!' },
        { animal: 'turtle', color: 'green', text: 'Colour the turtle green!' },
        { animal: 'dolphin', color: 'blue', text: 'Colour the dolphin blue!' },
        { animal: 'jellyfish', color: 'pink', text: 'Colour the jellyfish pink!' },
        { animal: 'seahorse', color: 'brown', text: 'Colour the seahorse brown!' },
        { animal: 'starfish', color: 'yellow', text: 'Colour the starfish yellow!' },
        { animal: 'crab', color: 'red', text: 'Colour the crab red!' },
        { animal: 'shark', color: 'grey', text: 'Colour the shark grey!' },
        { animal: 'penguin', color: 'black', text: 'Colour the penguin black!' },
        { animal: 'clownfish', color: 'orange', text: 'Colour the clownfish orange!' }
      ]
    },
    {
      category: 'wild',
      animals: WILD_ANIMALS,
      instructions: [
        { animal: 'crocodile', color: 'green', text: 'Colour the crocodile green!' },
        { animal: 'tiger', color: 'orange', text: 'Colour the tiger orange!' },
        { animal: 'elephant', color: 'grey', text: 'Colour the elephant grey!' },
        { animal: 'monkey', color: 'black', text: 'Colour the monkey black!' },
        { animal: 'bear', color: 'brown', text: 'Colour the bear brown!' },
        { animal: 'frog', color: 'blue', text: 'Colour the frog blue!' },
        { animal: 'bird', color: 'purple', text: 'Colour the bird purple!' },
        { animal: 'zebra', color: 'black', text: 'Colour the zebra black!' },
        { animal: 'lion', color: 'yellow', text: 'Colour the lion yellow!' }
      ]
    },
    {
      category: 'farm',
      animals: FARM_ANIMALS,
      instructions: [
        { animal: 'cat', color: 'blue', text: 'Colour the cat blue!' },
        { animal: 'dog', color: 'orange', text: 'Colour the dog orange!' },
        { animal: 'horse', color: 'brown', text: 'Colour the horse brown!' },
        { animal: 'pig', color: 'pink', text: 'Colour the pig pink!' },
        { animal: 'cow', color: 'black', text: 'Colour the cow black!' },
        { animal: 'duck', color: 'green', text: 'Colour the duck green!' },
        { animal: 'chicken', color: 'yellow', text: 'Colour the chicken yellow!' },
        { animal: 'mouse', color: 'grey', text: 'Colour the mouse grey!' }
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
