(function(){
  const { GAME_QUESTIONS, shuffle, post, autoResize, tts, updateCharacterState } = window.g1;
  
  const sceneBackground = document.getElementById('sceneBackground');
  const doorsContainer = document.getElementById('doorsContainer');
  const banner = document.getElementById('statusBanner');
  const doorWrappers = document.querySelectorAll('.door-wrapper');

  let currentQuestion = null;
  let shuffledQuestions = [];
  let turnCount = 0;
  let score = 0;
  let doorsOpened = 0;
  let correctDoorIndex = -1;
  let canSelectAnswer = false;
  let doorsOpenedOrder = [];

  // Set background image
  sceneBackground.src = '../assets/images/Game 1 - Knock-knock (new game)/photos/_background_halloween.png';

  function setupQuestion() {
    if (!currentQuestion) return;

    // Reset doors - completely hide all character images
    doorWrappers.forEach((door, index) => {
      door.classList.remove('door-opened', 'door-opening', 'knocking', 'correct-answer', 'wrong-answer');
      door.style.pointerEvents = 'auto';
      const characterImg = door.querySelector('.character-behind-door');
      // Completely remove image source
      characterImg.src = '';
      characterImg.alt = '';
      // Force hide with all methods
      characterImg.style.opacity = '0';
      characterImg.style.visibility = 'hidden';
      characterImg.style.display = 'none';
      characterImg.style.zIndex = '-100';
      characterImg.style.pointerEvents = 'none';
      // Remove any data attributes
      delete door.dataset.characterImage;
    });

    doorsOpened = 0;
    canSelectAnswer = false;
    doorsOpenedOrder = [];

    // Randomly assign correct answer to one door (0, 1, or 2)
    correctDoorIndex = Math.floor(Math.random() * 3);
    
    // Get wrong answers
    const wrongAnswers = [...currentQuestion.wrongAnswers];
    
    // Assign characters to doors - store image path but don't set src yet
    doorWrappers.forEach((door, index) => {
      const characterImg = door.querySelector('.character-behind-door');
      let imagePath = '';
      
      if (index === correctDoorIndex) {
        // Correct answer - from correct answers folder
        imagePath = `../assets/images/Game 1 - Knock-knock (new game)/photos/correct answers/${currentQuestion.correctAnswer}`;
        characterImg.alt = 'Correct answer';
      } else {
        // Wrong answer - from for wrong answers folder
        const wrongIndex = index < correctDoorIndex ? index : index - 1;
        imagePath = `../assets/images/Game 1 - Knock-knock (new game)/photos/for wrong answers/${wrongAnswers[wrongIndex]}`;
        characterImg.alt = 'Wrong answer';
      }
      
      // Store image path in data attribute, but don't set src until door opens
      door.dataset.characterImage = imagePath;
      
      // Preload image in background
      const img = new Image();
      img.src = imagePath;
    });

    // Update banner - show "KNOCK ON THE DOORS" before doors are opened
    banner.textContent = 'KNOCK ON THE DOORS';
    
    // Play question
    tts(currentQuestion.question);
    
    updateCharacterState('thinking');
    autoResize();
  }

  function onDoorClick(doorWrapper, doorIndex) {
    // If door is already opened, handle answer selection
    if (doorWrapper.classList.contains('door-opened')) {
      if (canSelectAnswer) {
        selectAnswer(doorIndex);
      }
      return;
    }

    // If door is already opening or all doors are opened, ignore
    if (doorWrapper.classList.contains('door-opening') || doorsOpened >= 3) {
      return;
    }

    // Show knocking animation
    doorWrapper.classList.add('knocking');
    
    // Remove knocking animation after short delay
    setTimeout(() => {
      doorWrapper.classList.remove('knocking');
      
      // Start opening door
      doorWrapper.classList.add('door-opening');
      
      // Fully open door after animation
      setTimeout(() => {
        doorWrapper.classList.add('door-opened');
        doorWrapper.classList.remove('door-opening');
        doorsOpened++;
        doorsOpenedOrder.push(doorIndex);
        
        // Now set the character image source and make it visible ONLY when door opens
        const characterImg = doorWrapper.querySelector('.character-behind-door');
        if (characterImg && doorWrapper.dataset.characterImage) {
          // Set the image source only when door opens
          characterImg.src = doorWrapper.dataset.characterImage;
          
          // Force show with all methods
          characterImg.style.zIndex = '60';
          characterImg.style.opacity = '1';
          characterImg.style.visibility = 'visible';
          characterImg.style.display = 'block';
          
          // If image hasn't loaded yet, wait for it
          if (!characterImg.complete || characterImg.naturalHeight === 0) {
            characterImg.onload = function() {
              this.style.zIndex = '60';
              this.style.opacity = '1';
              this.style.visibility = 'visible';
              this.style.display = 'block';
            };
          } else {
            // Image already loaded, ensure it's visible
            characterImg.style.zIndex = '60';
            characterImg.style.opacity = '1';
            characterImg.style.visibility = 'visible';
            characterImg.style.display = 'block';
          }
        }
        
        // If all doors are opened, allow answer selection
        if (doorsOpened >= 3) {
          canSelectAnswer = true;
          // Show the question text in the banner
          if (currentQuestion) {
            banner.textContent = currentQuestion.question;
            tts(currentQuestion.question);
          }
        }
      }, 300);
    }, 200);
  }

  function selectAnswer(selectedDoorIndex) {
    if (!canSelectAnswer) return;
    
    // Disable all doors
    doorWrappers.forEach(door => {
      door.style.pointerEvents = 'none';
    });

    const isCorrect = (selectedDoorIndex === correctDoorIndex);
    const selectedDoor = doorWrappers[selectedDoorIndex];

    if (isCorrect) {
      updateCharacterState('correct');
      post({type: 'score:delta', value: 10});
      score += 10;
      
      selectedDoor.classList.add('correct-answer');
      tts('Correct!');
      
      // Move to next question after delay
      setTimeout(() => {
        turnCount++;
        startNewQuestion();
      }, 2000);
    } else {
      updateCharacterState('wrong');
      post({type: 'score:delta', value: -5});
      score -= 5;
      
      selectedDoor.classList.add('wrong-answer');
      
      // Highlight correct door
      doorWrappers[correctDoorIndex].classList.add('correct-answer');
      
      tts('Try again!');
      
      // Stay on same question, re-enable after delay
      setTimeout(() => {
        updateCharacterState('thinking');
        
        // Reset doors for retry
        doorWrappers.forEach(door => {
          door.style.pointerEvents = 'auto';
          door.classList.remove('correct-answer', 'wrong-answer');
        });
        
        canSelectAnswer = true;
        banner.textContent = 'SELECT THE CORRECT ANSWER';
      }, 2000);
    }
  }

  function startNewQuestion() {
    if (turnCount >= shuffledQuestions.length) {
      // Game completed
      banner.textContent = 'WELL DONE!';
      tts('Well done!');
      updateCharacterState('correct');
      
      setTimeout(() => {
        setup(); // Restart game
      }, 3000);
      return;
    }

    currentQuestion = shuffledQuestions[turnCount];
    setupQuestion();
  }

  function setup() {
    // Shuffle questions for random order
    shuffledQuestions = shuffle([...GAME_QUESTIONS]);
    turnCount = 0;
    score = 0;
    
    // Reset character state
    updateCharacterState('thinking');
    
    // Start first question
    startNewQuestion();
  }

  // Event listeners for doors
  doorWrappers.forEach((doorWrapper, index) => {
    doorWrapper.addEventListener('click', () => {
      onDoorClick(doorWrapper, index);
    });
  });

  // Initialize game
  setup();
})();

