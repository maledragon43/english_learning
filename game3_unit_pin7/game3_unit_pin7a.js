(function(){
  // Yes/No questions data organized by slides
  const GAME_SLIDES = [
    // Slide 1: Kitchen
    {
      slideIndex: 0,
      slideName: 'Kitchen',
      background: '../assets/images/yes_no_unit 9/slide 1_kitchen/_background_kitchen.png',
      dashboard: '../assets/images/yes_no_unit 9/slide 1_kitchen/_dashboard_yes_no_kitchen.jpg',
      questions: [
        { text: 'THE CLOCK IS NEXT TO THE WINDOW.', answer: true },
        { text: 'THERE ARE 5 GLASSES IN THE CUPBOARD.', answer: false },
        { text: 'THE CAT IS SLEEPING.', answer: false },
        { text: 'THE PLATES ARE BLUE.', answer: true },
        { text: 'THERE IS A SPOON UNDER THE CHAIR.', answer: false },
        { text: 'THE COOKER IS RED.', answer: true },
        { text: 'THERE IS A MOUSE IN THE FRIDGE.', answer: true },
        { text: 'THE CAT IS ON THE MAT.', answer: true },
        { text: 'THE CUPBOARD IS NEXT TO THE FRIDGE.', answer: false },
        { text: 'THE FORK IS UNDER THE TABLE.', answer: true },
        { text: 'THERE ARE 4 CHAIRS IN THE KITCHEN.', answer: false },
        { text: 'THE CAT IS EATING.', answer: false },
        { text: 'THERE IS A GLASS UNDER THE TABLE.', answer: false },
        { text: 'THE MOUSE IS GREEN.', answer: false },
        { text: 'THERE IS A LAMP IN THE KITCHEN.', answer: false },
        { text: 'THE CUPBOARD IS BROWN.', answer: true },
        { text: 'THERE IS A PLATE ON THE COOKER.', answer: false },
        { text: 'THE FRIDGE IS NEXT TO THE COOKER.', answer: true },
        { text: 'THERE ARE 2 PLATES ON THE TABLE.', answer: true },
        { text: 'THE FRIDGE IS GREY.', answer: true },
        { text: 'THE CAT IS FLYING.', answer: false },
        { text: 'THIS IS A KITCHEN.', answer: true }
      ]
    },
    // Slide 2: Bedroom
    {
      slideIndex: 1,
      slideName: 'Bedroom',
      background: '../assets/images/yes_no_unit 9/slide 2_bedroom/_background.png',
      dashboard: '../assets/images/yes_no_unit 9/slide 2_bedroom/_dashboard_yes_no_bedroom.jpg',
      questions: [
        { text: 'THERE IS A BEAR ON THE BED.', answer: true },
        { text: 'THE LAMP IS UNDER THE BED.', answer: false },
        { text: 'THE TOYS ARE ON THE MAT.', answer: true },
        { text: 'THE CLOCK IS NEXT TO THE PAINTING.', answer: true },
        { text: 'THE TRACTOR IS UNDER THE BED.', answer: true },
        { text: 'THE BEAR IS PURPLE.', answer: false },
        { text: 'THERE ARE 2 WINDOWS IN THE BEDROOM.', answer: false },
        { text: 'THE MOUSE IS ON THE DESK.', answer: false },
        { text: 'THE LAMP IS GREEN AND PINK.', answer: false },
        { text: 'THE CAT IS SLEEPING.', answer: true },
        { text: 'THE MOUSE IS IN THE BOX.', answer: true },
        { text: 'THE MAT IS ORANGE AND RED.', answer: false },
        { text: 'THE LAMP IS ON THE DESK.', answer: true },
        { text: 'THERE ARE 3 CHAIRS IN THE BEDROOM.', answer: false },
        { text: 'THE MOUSE IS GREY.', answer: true },
        { text: 'THE TRACTOR IS IN THE TOY BOX.', answer: false },
        { text: 'THE LAMP IS YELLOW AND RED.', answer: false },
        { text: 'THIS IS A BEDROOM.', answer: true }
      ]
    }
  ];

  // Utility functions
  function shuffle(a) { 
    return a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]); 
  }

  function post(data) {
    if (window.parent && window.parent.postMessage) {
      window.parent.postMessage(data, '*');
    }
  }

  function autoResize() {
    if (window.parent && window.parent.postMessage) {
      window.parent.postMessage({type: 'resize'}, '*');
    }
  }

  function tts(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }

  function updateCharacterState(state) {
    const characterImg = document.querySelector('.game-student');
    if (characterImg) {
      switch(state) {
        case 'thinking':
          characterImg.src = '../assets/images/chars/squirrel think.png';
          break;
        case 'correct':
          characterImg.src = '../assets/images/chars/squirrel right.png';
          break;
        case 'wrong':
          characterImg.src = '../assets/images/chars/veverita wrong.png';
          break;
      }
    }
  }

  // Expose to global scope
  window.g3 = {
    GAME_SLIDES,
    shuffle,
    post,
    autoResize,
    tts,
    updateCharacterState
  };
})();

