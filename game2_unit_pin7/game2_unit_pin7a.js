(function(){
  const COLORS = ['white', 'black', 'gray', 'yellow', 'orange', 'pink', 'red', 'purple', 'blue', 'green', 'brown'];
  
  // Game slides data - 5 slides, each with 8 instructions
  const GAME_SLIDES = [
    {
      slideIndex: 0,
      slideName: 'Kitchen 1',
      background: '../assets/images/Game 2 - Colour it Right 2/slide 1/_background.png',
      objectType: 'spoon',
      instructions: [
        { object: 'spoon', color: 'grey', text: 'COLOUR THE SPOON ON THE TABLE GREY!', position: 'on-table', imagePath: 'spoon_gray.png' },
        { object: 'spoon', color: 'red', text: 'COLOUR THE SPOON IN THE CUPBOARD RED!', position: 'in-cupboard', imagePath: 'spoon_red.png' },
        { object: 'spoon', color: 'blue', text: 'COLOUR THE SPOON NEXT TO THE CLOCK BLUE!', position: 'next-to-clock', imagePath: 'spoon_blue.png' },
        { object: 'spoon', color: 'yellow', text: 'COLOUR THE SPOON ON THE MAT YELLOW!', position: 'on-mat', imagePath: 'spoon_yellow.png' },
        { object: 'spoon', color: 'pink', text: 'COLOUR THE SPOON UNDER THE TABLE PINK!', position: 'under-table', imagePath: 'spoon_pink.png' },
        { object: 'spoon', color: 'green', text: 'COLOUR THE SPOON IN THE BOX GREEN!', position: 'in-box', imagePath: 'spoon_green.png' },
        { object: 'spoon', color: 'orange', text: 'COLOUR THE SPOON ON THE COOKER ORANGE!', position: 'on-cooker', imagePath: 'spoon_orange.png' },
        { object: 'spoon', color: 'purple', text: 'COLOUR THE SPOON IN THE FRIDGE PURPLE!', position: 'in-fridge', imagePath: 'spoon_purple.png' }
      ]
    },
    {
      slideIndex: 1,
      slideName: 'Bedroom 1',
      background: '../assets/images/Game 2 - Colour it Right 2/slide 2/_background.png',
      objectType: 'cat',
      instructions: [
        { object: 'cat', color: 'grey', text: 'COLOUR THE CAT UNDER THE WINDOW GREY!', position: 'under-window', imagePath: 'cat_gray.png' },
        { object: 'cat', color: 'orange', text: 'COLOUR THE CAT NEXT TO THE LAMP ORANGE!', position: 'next-to-lamp', imagePath: 'cat_orange.png' },
        { object: 'cat', color: 'yellow', text: 'COLOUR THE CAT ON THE BED YELLOW!', position: 'on-bed', imagePath: 'cat_yellow.png' },
        { object: 'cat', color: 'blue', text: 'COLOUR THE CAT UNDER THE DESK BLUE!', position: 'under-desk', imagePath: 'cat_blue.png' },
        { object: 'cat', color: 'red', text: 'COLOUR THE CAT IN THE BOX RED!', position: 'in-box', imagePath: 'red-cat-in-the-box.png' },
        { object: 'cat', color: 'pink', text: 'COLOUR THE CAT NEXT TO THE WINDOW PINK!', position: 'next-to-window', imagePath: 'cat_pink.png' },
        { object: 'cat', color: 'green', text: 'COLOUR THE CAT UNDER THE BED GREEN!', position: 'under-bed', imagePath: 'cat_green.png' },
        { object: 'cat', color: 'black', text: 'COLOUR THE CAT ON THE MAT BLACK!', position: 'on-mat', imagePath: 'cat_black.png' }
      ]
    },
    {
      slideIndex: 2,
      slideName: 'Kitchen 2',
      background: '../assets/images/Game 2 - Colour it Right 2/slide 3/_background.png',
      objectType: 'glass',
      instructions: [
        { object: 'glass', color: 'orange', text: 'COLOUR THE GLASS ON THE MAT ORANGE!', position: 'on-mat', imagePath: 'glass_orange.png' },
        { object: 'glass', color: 'brown', text: 'COLOUR THE GLASS IN THE FRIDGE BROWN!', position: 'in-fridge', imagePath: 'glass_brown.png' },
        { object: 'glass', color: 'purple', text: 'COLOUR THE GLASS ON THE CHAIR PURPLE!', position: 'on-chair', imagePath: 'glass_purple.png' },
        { object: 'glass', color: 'yellow', text: 'COLOUR THE GLASS ON THE COOKER YELLOW!', position: 'on-cooker', imagePath: 'glass_yellow.png' },
        { object: 'glass', color: 'blue', text: 'COLOUR THE GLASS UNDER THE CHAIR BLUE!', position: 'under-chair', imagePath: 'glass_blue.png' },
        { object: 'glass', color: 'green', text: 'COLOUR THE GLASS NEXT TO THE CAT GREEN!', position: 'next-to-cat', imagePath: 'glass_green.png' },
        { object: 'glass', color: 'pink', text: 'COLOUR THE GLASS IN THE CUPBOARD PINK!', position: 'in-cupboard', imagePath: 'glass_pink.png' },
        { object: 'glass', color: 'black', text: 'COLOUR THE GLASS ON THE TABLE BLACK!', position: 'on-table', imagePath: 'glass_black.png' }
      ]
    },
    {
      slideIndex: 3,
      slideName: 'Bedroom 2',
      background: '../assets/images/Game 2 - Colour it Right 2/slide 4/_background.png',
      objectType: 'lamp',
      instructions: [
        { object: 'lamp', color: 'brown', text: 'COLOUR THE LAMP UNDER THE PAINTING BROWN!', position: 'under-painting', imagePath: 'lamp_brown.png' },
        { object: 'lamp', color: 'yellow', text: 'COLOUR THE LAMP ON THE MAT YELLOW!', position: 'on-mat', imagePath: 'lamp_yellow.png' },
        { object: 'lamp', color: 'purple', text: 'COLOUR THE LAMP NEXT TO THE WINDOW PURPLE!', position: 'next-to-window', imagePath: 'lamp_purple.png' },
        { object: 'lamp', color: 'red', text: 'COLOUR THE LAMP UNDER THE DESK RED!', position: 'under-desk', imagePath: 'lamp_red.png' },
        { object: 'lamp', color: 'blue', text: 'COLOUR THE LAMP ON THE BED BLUE!', position: 'on-bed', imagePath: 'lamp_blue.png' },
        { object: 'lamp', color: 'green', text: 'COLOUR THE LAMP IN THE BOX GREEN!', position: 'in-box', imagePath: 'lamp_green.png' },
        { object: 'lamp', color: 'orange', text: 'COLOUR THE LAMP ON THE DESK ORANGE!', position: 'on-desk', imagePath: 'lamp_orange.png' },
        { object: 'lamp', color: 'pink', text: 'COLOUR THE LAMP UNDER THE BED PINK!', position: 'under-bed', imagePath: 'lamp_pink.png' }
      ]
    },
    {
      slideIndex: 4,
      slideName: 'Bedroom 3',
      background: '../assets/images/Game 2 - Colour it Right 2/slide 5/_background.png',
      objectType: 'bear',
      instructions: [
        { object: 'bear', color: 'green', text: 'COLOUR THE BEAR UNDER THE BED GREEN!', position: 'under-bed', imagePath: 'bear_green.png' },
        { object: 'bear', color: 'red', text: 'COLOUR THE BEAR NEXT TO THE LAMP RED!', position: 'next-to-lamp', imagePath: 'bear_red.png' },
        { object: 'bear', color: 'purple', text: 'COLOUR THE BEAR IN THE BOX PURPLE!', position: 'in-box', imagePath: 'bear_purple.png' },
        { object: 'bear', color: 'yellow', text: 'COLOUR THE BEAR NEXT TO THE BED YELLOW!', position: 'next-to-bed', imagePath: 'bear_yellow.png' },
        { object: 'bear', color: 'black', text: 'COLOUR THE BEAR UNDER THE DESK BLACK!', position: 'under-desk', imagePath: 'bear_black.png' },
        { object: 'bear', color: 'blue', text: 'COLOUR THE BEAR ON THE MAT BLUE!', position: 'on-mat', imagePath: 'bear_blue.png' },
        { object: 'bear', color: 'orange', text: 'COLOUR THE BEAR UNDER THE WINDOW ORANGE!', position: 'under-window', imagePath: 'bear_orange.png' },
        { object: 'bear', color: 'brown', text: 'COLOUR THE BEAR ON THE BED BROWN!', position: 'on-bed', imagePath: 'bear_brown.png' }
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
  
  window.g2u7 = { COLORS, GAME_SLIDES, post, autoResize, tts, updateCharacterState };
  window.addEventListener('load', autoResize);
  window.addEventListener('resize', autoResize);
})();

