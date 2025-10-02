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
        { animal: 'shell', color: 'purple', text: 'COLOUR THE SHELL PURPLE!' },
        { animal: 'turtle', color: 'green', text: 'COLOUR THE TURTLE GREEN!' },
        { animal: 'dolphin', color: 'blue', text: 'COLOUR THE DOLPHIN BLUE!' },
        { animal: 'jellyfish', color: 'pink', text: 'COLOUR THE JELLYFISH PINK!' },
        { animal: 'seahorse', color: 'brown', text: 'COLOUR THE SEAHORSE BROWN!' },
        { animal: 'starfish', color: 'yellow', text: 'COLOUR THE STARFISH YELLOW!' },
        { animal: 'crab', color: 'red', text: 'COLOUR THE CRAB RED!' },
        { animal: 'shark', color: 'grey', text: 'COLOUR THE SHARK GREY!' },
        { animal: 'penguin', color: 'black', text: 'COLOUR THE PENGUIN BLACK!' },
        { animal: 'clownfish', color: 'orange', text: 'COLOUR THE CLOWNFISH ORANGE!' }
      ]
    },
    {
      category: 'wild',
      animals: WILD_ANIMALS,
      instructions: [
        { animal: 'crocodile', color: 'green', text: 'COLOUR THE CROCODILE GREEN!' },
        { animal: 'tiger', color: 'orange', text: 'COLOUR THE TIGER ORANGE!' },
        { animal: 'elephant', color: 'grey', text: 'COLOUR THE ELEPHANT GREY!' },
        { animal: 'monkey', color: 'black', text: 'COLOUR THE MONKEY BLACK!' },
        { animal: 'bear', color: 'brown', text: 'COLOUR THE BEAR BROWN!' },
        { animal: 'frog', color: 'blue', text: 'COLOUR THE FROG BLUE!' },
        { animal: 'bird', color: 'purple', text: 'COLOUR THE BIRD PURPLE!' },
        { animal: 'zebra', color: 'black', text: 'COLOUR THE ZEBRA BLACK!' },
        { animal: 'lion', color: 'yellow', text: 'COLOUR THE LION YELLOW!' }
      ]
    },
    {
      category: 'farm',
      animals: FARM_ANIMALS,
      instructions: [
        { animal: 'cat', color: 'blue', text: 'COLOUR THE CAT BLUE!' },
        { animal: 'dog', color: 'orange', text: 'COLOUR THE DOG ORANGE!' },
        { animal: 'horse', color: 'brown', text: 'COLOUR THE HORSE BROWN!' },
        { animal: 'pig', color: 'pink', text: 'COLOUR THE PIG PINK!' },
        { animal: 'cow', color: 'black', text: 'COLOUR THE COW BLACK!' },
        { animal: 'duck', color: 'green', text: 'COLOUR THE DUCK GREEN!' },
        { animal: 'chicken', color: 'yellow', text: 'COLOUR THE CHICKEN YELLOW!' },
        { animal: 'mouse', color: 'grey', text: 'COLOUR THE MOUSE GREY!' }
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
