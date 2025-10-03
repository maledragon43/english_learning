(function(){
  // Animal actions data for Yes/No game
  const ANIMAL_ACTIONS = [
    // YES answers (50%)
    { animal: 'penguin', action: 'sleeping', image: 'penguin-sleeping.png', answer: true },
    { animal: 'elephant', action: 'flying', image: 'elephant-flying.png', answer: true },
    { animal: 'bird', action: 'flying', image: 'bird-flying.png', answer: true },
    { animal: 'turtle', action: 'running', image: 'turtle-running.png', answer: true },
    { animal: 'chicken', action: 'sleeping', image: 'chicken-sleeping.png', answer: true },
    { animal: 'mouse', action: 'eating', image: 'mouse-eating.png', answer: true },
    { animal: 'lion', action: 'flying', image: 'lion-flying.png', answer: true },
    { animal: 'dog', action: 'swimming', image: 'dog-swimming.png', answer: true },
    { animal: 'elephant', action: 'sleeping', image: 'elephant-sleeping.png', answer: true },
    { animal: 'horse', action: 'running', image: 'horse-running.png', answer: true },
    { animal: 'crocodile', action: 'singing', image: 'crocodile-singing.png', answer: true },
    { animal: 'giraffe', action: 'eating', image: 'giraffe-eating.png', answer: true },
    { animal: 'pig', action: 'sleeping', image: 'pig-sleeping.png', answer: true },
    { animal: 'duck', action: 'flying', image: 'duck-flying.png', answer: true },
    { animal: 'cat', action: 'sleeping', image: 'cat-sleeping.png', answer: true },
    { animal: 'dog', action: 'singing', image: 'dog-singing.png', answer: true },
    { animal: 'bear', action: 'sleeping', image: 'bear-sleeping.png', answer: true },
    { animal: 'tiger', action: 'jumping', image: 'tiger-jumping.png', answer: true },
    { animal: 'mouse', action: 'sleeping', image: 'mouse-sleeping.png', answer: true },
    { animal: 'pig', action: 'flying', image: 'pig-flying.png', answer: true },
    { animal: 'turtle', action: 'swimming', image: 'turtle-swimming.png', answer: true },
    { animal: 'crocodile', action: 'sleeping', image: 'crocodile-sleeping.png', answer: true },
    { animal: 'fish', action: 'singing', image: 'fish-singing.png', answer: true },
    { animal: 'monkey', action: 'singing', image: 'monkey-singing.png', answer: true },
    { animal: 'dolphin', action: 'jumping', image: 'dolphin-jumping.png', answer: true },
    { animal: 'bear', action: 'eating', image: 'bear-eating.png', answer: true },
    { animal: 'lion', action: 'sleeping', image: 'lion-sleeping.png', answer: true },
    { animal: 'dog', action: 'running', image: 'dog-running.png', answer: true },
    { animal: 'cow', action: 'drinking', image: 'cow-drinking.png', answer: true },
    { animal: 'frog', action: 'eating', image: 'frog-eating.png', answer: true },
    { animal: 'zebra', action: 'jumping', image: 'zebra-jumping.png', answer: true },
    
    // NO answers (50%)
    { animal: 'dog', action: 'drinking', image: 'dog-sleeping.png', answer: false },
    { animal: 'bear', action: 'swimming', image: 'bear-eating.png', answer: false },
    { animal: 'dog', action: 'eating', image: 'dog-sleeping.png', answer: false },
    { animal: 'horse', action: 'jumping', image: 'horse-running.png', answer: false },
    { animal: 'crocodile', action: 'running', image: 'crocodile-sleeping.png', answer: false },
    { animal: 'cat', action: 'singing', image: 'cat-sleeping.png', answer: false },
    { animal: 'elephant', action: 'drinking', image: 'elephant-flying.png', answer: false },
    { animal: 'dog', action: 'sleeping', image: 'dog-swimming.png', answer: false },
    { animal: 'bear', action: 'eating', image: 'bear-sleeping.png', answer: false },
    { animal: 'crocodile', action: 'swimming', image: 'crocodile-singing.png', answer: false },
    { animal: 'bird', action: 'flying', image: 'bird-sleeping.png', answer: false },
    { animal: 'turtle', action: 'running', image: 'turtle-swimming.png', answer: false },
    { animal: 'chicken', action: 'sleeping', image: 'chicken-eating.png', answer: false },
    { animal: 'mouse', action: 'eating', image: 'mouse-sleeping.png', answer: false },
    { animal: 'lion', action: 'flying', image: 'lion-sleeping.png', answer: false },
    { animal: 'dog', action: 'swimming', image: 'dog-running.png', answer: false },
    { animal: 'elephant', action: 'sleeping', image: 'elephant-drinking.png', answer: false },
    { animal: 'horse', action: 'running', image: 'horse-jumping.png', answer: false },
    { animal: 'crocodile', action: 'singing', image: 'crocodile-running.png', answer: false },
    { animal: 'giraffe', action: 'eating', image: 'giraffe-sleeping.png', answer: false },
    { animal: 'pig', action: 'sleeping', image: 'pig-flying.png', answer: false },
    { animal: 'duck', action: 'flying', image: 'duck-swimming.png', answer: false },
    { animal: 'cat', action: 'sleeping', image: 'cat-eating.png', answer: false },
    { animal: 'dog', action: 'singing', image: 'dog-eating.png', answer: false },
    { animal: 'bear', action: 'sleeping', image: 'bear-eating.png', answer: false },
    { animal: 'tiger', action: 'jumping', image: 'tiger-sleeping.png', answer: false },
    { animal: 'mouse', action: 'sleeping', image: 'mouse-eating.png', answer: false },
    { animal: 'pig', action: 'flying', image: 'pig-sleeping.png', answer: false },
    { animal: 'turtle', action: 'swimming', image: 'turtle-running.png', answer: false },
    { animal: 'crocodile', action: 'sleeping', image: 'crocodile-swimming.png', answer: false },
    { animal: 'fish', action: 'singing', image: 'fish-swimming.png', answer: false },
    { animal: 'monkey', action: 'singing', image: 'monkey-eating.png', answer: false },
    { animal: 'dolphin', action: 'jumping', image: 'dolphin-swimming.png', answer: false },
    { animal: 'bear', action: 'eating', image: 'bear-sleeping.png', answer: false },
    { animal: 'lion', action: 'sleeping', image: 'lion-flying.png', answer: false },
    { animal: 'dog', action: 'running', image: 'dog-sleeping.png', answer: false },
    { animal: 'cow', action: 'drinking', image: 'cow-eating.png', answer: false },
    { animal: 'frog', action: 'eating', image: 'frog-swimming.png', answer: false },
    { animal: 'zebra', action: 'jumping', image: 'zebra-sleeping.png', answer: false }
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
    const characterImg = document.querySelector('.game-student img');
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
