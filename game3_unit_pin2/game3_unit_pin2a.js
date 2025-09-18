(function(){
  const ANIMALS = ['cat', 'dog', 'tractor', 'horse', 'pig', 'farm', 'cow', 'duck', 'chicken', 'mouse'];
  
  // Sentence data with correct image and distractors
  const sentenceData = [
    { sentence: "This is a farm.", correct: "FARM.png", options: ["FARM.png", "Orange_tractor.png", "brown cow.png"] },
    { sentence: "The cat is black and white.", correct: "CAT_Black_and_white.png", options: ["Black_cat.png", "White_cat.png", "CAT_Black_and_white.png"] },
    { sentence: "This is a duck.", correct: "DUCK_brown_and_green.png", options: ["DUCK_brown_and_green.png", "White_chicken.png", "Mouse.png"] },
    { sentence: "The mouse is grey.", correct: "MOUSE_grey.png", options: ["Brown_mouse.png", "White_mouse.png", "MOUSE_grey.png"] },
    { sentence: "The dog is brown.", correct: "DOG_Brown.png", options: ["Black_dog.png", "Pink_dog.png", "DOG_Brown.png"] },
    { sentence: "This is a pig.", correct: "PIG_Pink.png", options: ["brown cow.png", "HORSE_White.png", "PIG_Pink.png"] },
    { sentence: "The chicken is white.", correct: "White_chicken.png", options: ["CHICKEN_Brown.png", "Dark_brown_chicken.png", "White_chicken.png"] },
    { sentence: "This is a cow.", correct: "brown cow.png", options: ["HORSE_White.png", "brown cow.png", "Orange_tractor.png"] },
    { sentence: "The horse is black.", correct: "Black_horse.png", options: ["HORSE_White.png", "Brown_horse.png", "Black_horse.png"] },
    { sentence: "The tractor is green.", correct: "TRACTOR_Green.png", options: ["Red_tractor.png", "Orange_tractor.png", "TRACTOR_Green.png"] },
    { sentence: "This is a mouse", correct: "Mouse.png", options: ["Black_cat.png", "Mouse.png", "Black_dog.png"] },
    { sentence: "The pig is pink.", correct: "PIG_Pink.png", options: ["PIG_Purple.png", "PIG_Blue.png", "PIG_Pink.png"] },
    { sentence: "This is a horse.", correct: "HORSE_White.png", options: ["HORSE_White.png", "White_chicken.png", "Mouse.png"] },
    { sentence: "The cow is black and white.", correct: "COW_Black_and_white.png", options: ["COW_Grey_and_white.png", "brown cow.png", "COW_Black_and_white.png"] },
    { sentence: "This is a cat.", correct: "Black_cat.png", options: ["HORSE_White.png", "brown cow.png", "Black_cat.png"] },
    { sentence: "This is a dog.", correct: "Black_dog.png", options: ["White_chicken.png", "Black_dog.png", "PIG_Pink.png"] },
    { sentence: "The duck is brown and green.", correct: "DUCK_brown_and_green.png", options: ["DUCK_grey.png", "DUCK_Red.png", "DUCK_brown_and_green.png"] },
    { sentence: "This is a tractor.", correct: "Orange_tractor.png", options: ["FARM.png", "brown cow.png", "Orange_tractor.png"] },
    { sentence: "This is a chicken.", correct: "White_chicken.png", options: ["White_chicken.png", "Black_cat.png", "Mouse.png"] }
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
  
  window.g3 = { ANIMALS, sentenceData, post, autoResize, tts, updateCharacterState };
  window.addEventListener('load', autoResize);
  window.addEventListener('resize', autoResize);
})();
