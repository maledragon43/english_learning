(function(){
  // Animal actions data for Yes/No game
  const ANIMAL_ACTIONS = [
    // YES answers (50%) - sentence matches the image
    { animal: 'penguin', action: 'sleeping', image: 'sleeping_penguin.png', answer: true },
    { animal: 'elephant', action: 'flying', image: 'flying_elephant.png', answer: true },
    { animal: 'bird', action: 'flying', image: 'flying_bird.png', answer: true },
    { animal: 'turtle', action: 'running', image: 'running_turtle.png', answer: true },
    { animal: 'chicken', action: 'sleeping', image: 'sleeping_chicken.png', answer: true },
    { animal: 'mouse', action: 'eating', image: 'eating_mouse.png', answer: true },
    { animal: 'lion', action: 'flying', image: 'flying_lion.png', answer: true },
    { animal: 'dog', action: 'swimming', image: 'swimming_dog.png', answer: true },
    { animal: 'elephant', action: 'sleeping', image: 'sleeping_elephant.png', answer: true },
    { animal: 'horse', action: 'running', image: 'running_horse.png', answer: true },
    { animal: 'crocodile', action: 'singing', image: 'singing_crocodile.png', answer: true },
    { animal: 'giraffe', action: 'eating', image: 'eating_giraffe.png', answer: true },
    { animal: 'pig', action: 'sleeping', image: 'sleeping_pig.png', answer: true },
    { animal: 'duck', action: 'flying', image: 'flying_duck.png', answer: true },
    { animal: 'cat', action: 'sleeping', image: 'sleeping_cat.png', answer: true },
    { animal: 'dog', action: 'singing', image: 'singing_dog.png', answer: true },
    { animal: 'bear', action: 'sleeping', image: 'sleeping_bear.png', answer: true },
    { animal: 'tiger', action: 'jumping', image: 'jumping_tiger.png', answer: true },
    { animal: 'mouse', action: 'sleeping', image: 'sleeping_mouse.png', answer: true },
    { animal: 'pig', action: 'flying', image: 'flying_pig.png', answer: true },
    { animal: 'turtle', action: 'swimming', image: 'swimming_turtle.png', answer: true },
    { animal: 'crocodile', action: 'sleeping', image: 'sleeping_crocodile.png', answer: true },
    { animal: 'fish', action: 'singing', image: 'singing_fish.png', answer: true },
    { animal: 'monkey', action: 'singing', image: 'singing_monkey.png', answer: true },
    { animal: 'dolphin', action: 'jumping', image: 'jumping_dolphin.png', answer: true },
    { animal: 'bear', action: 'eating', image: 'eating_bear.png', answer: true },
    { animal: 'bear', action: 'sleeping', image: 'sleeping_bear.png', answer: true },
    { animal: 'horse', action: 'running', image: 'running_horse.png', answer: true },
    { animal: 'elephant', action: 'drinking', image: 'drinking_elephant.png', answer: true },
    { animal: 'mouse', action: 'eating', image: 'eating_mouse.png', answer: true },
    { animal: 'tiger', action: 'jumping', image: 'jumping_tiger.png', answer: true },
    
    // NO answers (50%) - sentence does NOT match the image
    { animal: 'dog', action: 'drinking', image: 'sleeping_dog.png', answer: false },
    { animal: 'bear', action: 'swimming', image: 'eating_bear.png', answer: false },
    { animal: 'dog', action: 'eating', image: 'sleeping_dog.png', answer: false },
    { animal: 'horse', action: 'jumping', image: 'running_horse.png', answer: false },
    { animal: 'crocodile', action: 'running', image: 'sleeping_crocodile.png', answer: false },
    { animal: 'cat', action: 'singing', image: 'sleeping_cat.png', answer: false },
    { animal: 'elephant', action: 'drinking', image: 'flying_elephant.png', answer: false },
    { animal: 'dog', action: 'sleeping', image: 'swimming_dog.png', answer: false },
    { animal: 'bear', action: 'eating', image: 'sleeping_bear.png', answer: false },
    { animal: 'crocodile', action: 'swimming', image: 'singing_crocodile.png', answer: false },
    { animal: 'bear', action: 'flying', image: 'sleeping_bear.png', answer: false },
    { animal: 'turtle', action: 'running', image: 'swimming_turtle.png', answer: false },
    { animal: 'mouse', action: 'sleeping', image: 'eating_mouse.png', answer: false },
    { animal: 'mouse', action: 'eating', image: 'sleeping_mouse.png', answer: false },
    { animal: 'bear', action: 'flying', image: 'sleeping_bear.png', answer: false },
    { animal: 'horse', action: 'swimming', image: 'running_horse.png', answer: false },
    { animal: 'elephant', action: 'sleeping', image: 'drinking_elephant.png', answer: false },
    { animal: 'tiger', action: 'running', image: 'jumping_tiger.png', answer: false },
    { animal: 'turtle', action: 'singing', image: 'running_turtle.png', answer: false },
    { animal: 'giraffe', action: 'eating', image: 'giraffe.png', answer: false },
    { animal: 'pig', action: 'sleeping', image: 'flying_pig.png', answer: false },
    { animal: 'turtle', action: 'flying', image: 'swimming_turtle.png', answer: false },
    { animal: 'mouse', action: 'sleeping', image: 'eating_mouse.png', answer: false },
    { animal: 'dog', action: 'singing', image: 'sleeping_dog.png', answer: false },
    { animal: 'bear', action: 'sleeping', image: 'eating_bear.png', answer: false },
    { animal: 'mouse', action: 'jumping', image: 'sleeping_mouse.png', answer: false },
    { animal: 'mouse', action: 'sleeping', image: 'eating_mouse.png', answer: false },
    { animal: 'pig', action: 'flying', image: 'sleeping_pig.png', answer: false },
    { animal: 'turtle', action: 'swimming', image: 'running_turtle.png', answer: false },
    { animal: 'crocodile', action: 'sleeping', image: 'swimming_crocodile.png', answer: false },
    { animal: 'turtle', action: 'singing', image: 'swimming_turtle.png', answer: false },
    { animal: 'mouse', action: 'singing', image: 'eating_mouse.png', answer: false },
    { animal: 'turtle', action: 'jumping', image: 'swimming_turtle.png', answer: false },
    { animal: 'bear', action: 'eating', image: 'sleeping_bear.png', answer: false },
    { animal: 'lion', action: 'sleeping', image: 'flying_lion.png', answer: false },
    { animal: 'dog', action: 'running', image: 'sleeping_dog.png', answer: false },
    { animal: 'bear', action: 'drinking', image: 'eating_bear.png', answer: false },
    { animal: 'turtle', action: 'eating', image: 'swimming_turtle.png', answer: false },
    { animal: 'mouse', action: 'jumping', image: 'sleeping_mouse.png', answer: false }
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
  window.g1 = {
    ANIMAL_ACTIONS,
    shuffle,
    post,
    autoResize,
    tts,
    updateCharacterState
  };
})();
