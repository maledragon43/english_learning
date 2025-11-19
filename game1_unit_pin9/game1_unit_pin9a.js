(function(){
  // Game data for Knock-knock game
  // Each question has: question text, correct answer image, and 2 wrong answer images
  
  const GAME_QUESTIONS = [
    // Slide 1: WHERE IS THE WITCH?
    {
      question: "WHERE IS THE WITCH?",
      correctAnswer: "girl_witch.png",
      wrongAnswers: ["ghost_1.png", "black-cat.png"]
    },
    // Slide 2: WHERE IS THE SKELETON?
    {
      question: "WHERE IS THE SKELETON?",
      correctAnswer: "boy_skeleton-costume.png",
      wrongAnswers: ["ghost_11.png", "halloween-kid_1.png"]
    },
    // Slide 3: WHERE IS THE GHOST?
    {
      question: "WHERE IS THE GHOST?",
      correctAnswer: "ghost_9.png",
      wrongAnswers: ["black-cat_1.png", "halloween-kid_2.png"]
    },
    // Slide 4: WHERE IS THE BLACK CAT?
    {
      question: "WHERE IS THE BLACK CAT?",
      correctAnswer: "black-cat-witch-hat.png",
      wrongAnswers: ["ghost_4.png", "halloween-kid_3.png"]
    },
    // Slide 5: WHERE IS THE VAMPIRE?
    {
      question: "WHERE IS THE VAMPIRE?",
      correctAnswer: "boy_vampire-costume.png",
      wrongAnswers: ["ghost_8.png", "skeleton-boy.png"]
    },
    // Slide 6: WHERE IS THE SPIDER?
    {
      question: "WHERE IS THE SPIDER?",
      correctAnswer: "spider_hat.png",
      wrongAnswers: ["black-cat-on-a-pumpkin.png", "ghost_16.png"]
    },
    // Slide 7: WHERE IS THE PUMPKIN?
    {
      question: "WHERE IS THE PUMPKIN?",
      correctAnswer: "pumpkin.png",
      wrongAnswers: ["candy_pink_dots.png", "halloween-kid_4.png"]
    },
    // Slide 8: WHERE IS THE BAT?
    {
      question: "WHERE IS THE BAT?",
      correctAnswer: "bat_brown.png",
      wrongAnswers: ["ghost_1.png", "black-cat.png"]
    },
    // Slide 9: WHERE IS THE CANDY?
    {
      question: "WHERE IS THE CANDY?",
      correctAnswer: "candy_pink.png",
      wrongAnswers: ["halloween-kid_6.png", "halloween-kid_5.png"]
    },
    // Slide 10: WHERE IS THE WITCH? (repeat)
    {
      question: "WHERE IS THE WITCH?",
      correctAnswer: "girl_witch_purple_1.png",
      wrongAnswers: ["ghost_11.png", "skeleton-boy-with-pumpkin.png"]
    },
    // Slide 11: WHERE IS THE SKELETON? (repeat)
    {
      question: "WHERE IS THE SKELETON?",
      correctAnswer: "boy_skeleton-costume_pumpkin.png",
      wrongAnswers: ["black-cat-phantom-on-a-pumpkin.png", "halloween-kid_6.png"]
    },
    // Slide 12: WHERE IS THE GHOST? (repeat)
    {
      question: "WHERE IS THE GHOST?",
      correctAnswer: "ghost_14.png",
      wrongAnswers: ["cat in a witch hat.png", "dracula-boy.png"]
    },
    // Slide 13: WHERE IS THE BLACK CAT? (repeat)
    {
      question: "WHERE IS THE BLACK CAT?",
      correctAnswer: "black-cat-vampire.png",
      wrongAnswers: ["ghost_16.png", "girl_pumpkin-costume.png"]
    },
    // Slide 14: WHERE IS THE VAMPIRE? (repeat)
    {
      question: "WHERE IS THE VAMPIRE?",
      correctAnswer: "boy_vampire-costume_pumpkin.png",
      wrongAnswers: ["candy_pink_stripes.png", "witch-cat_6.png"]
    },
    // Slide 15: WHERE IS THE SPIDER? (repeat)
    {
      question: "WHERE IS THE SPIDER?",
      correctAnswer: "spider_purple-hat.png",
      wrongAnswers: ["ghost_4.png", "halloween-girl_1.png"]
    },
    // Slide 16: WHERE IS THE PUMPKIN? (repeat)
    {
      question: "WHERE IS THE PUMPKIN?",
      correctAnswer: "pumpkin_1.png",
      wrongAnswers: ["ghost_4.png", "halloween-girl_2.png"]
    },
    // Slide 17: WHERE IS THE BAT? (repeat)
    {
      question: "WHERE IS THE BAT?",
      correctAnswer: "happy bat.png",
      wrongAnswers: ["ghost_8.png", "kid-in-costume_2.png"]
    },
    // Slide 18: WHERE IS THE CANDY? (repeat)
    {
      question: "WHERE IS THE CANDY?",
      correctAnswer: "candy_pink_stars.png",
      wrongAnswers: ["halloween-girl_2.png", "kid-in-costume_4.png"]
    },
    // Slide 19: WHERE IS THE WITCH? (repeat)
    {
      question: "WHERE IS THE WITCH?",
      correctAnswer: "girl_witch_purple_3.png",
      wrongAnswers: ["ghost_1.png", "kid-in-costume_5.png"]
    },
    // Slide 20: WHERE IS THE GHOST? (repeat)
    {
      question: "WHERE IS THE GHOST?",
      correctAnswer: "ghost_15.png",
      wrongAnswers: ["black-cat-on-a-pumpkin.png", "halloween-basket-orange-pumpkin.png"]
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
      const height = document.body.scrollHeight;
      window.parent.postMessage({type: 'resize', height}, '*');
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
    GAME_QUESTIONS,
    shuffle,
    post,
    autoResize,
    tts,
    updateCharacterState
  };
})();

