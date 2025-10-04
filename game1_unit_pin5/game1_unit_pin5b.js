(function(){
  const { ANIMAL_ACTIONS, shuffle, post, autoResize, tts, updateCharacterState } = window.g1;
  
  const animalImage = document.getElementById('animalImage');
  const animalImageContainer = document.getElementById('animalImageContainer');
  const banner = document.getElementById('statusBanner');
  const yesButton = document.getElementById('yesButton');
  const noButton = document.getElementById('noButton');

  let currentQuestion = null;
  let shuffledQuestions = [];
  let turnCount = 0;
  let score = 0;

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
    
    // Set the animal image
    const imagePath = `../assets/images/Yes or No Game/${currentQuestion.image}`;
    animalImage.src = imagePath;
    animalImage.alt = `${currentQuestion.animal} ${currentQuestion.action}`;
    
    // Update banner with the sentence
    const sentence = `THE ${currentQuestion.animal.toUpperCase()} IS ${currentQuestion.action.toUpperCase()}`;
    banner.textContent = sentence;
    
    // Play the sentence
    tts(sentence);
    
    // Reset character state
    updateCharacterState('thinking');
    
    // Enable buttons
    yesButton.disabled = false;
    noButton.disabled = false;
    
    // Remove any previous feedback classes
    yesButton.classList.remove('correct', 'wrong');
    noButton.classList.remove('correct', 'wrong');
    
    autoResize();
  }

  function onAnswerClick(userAnswer) {
    if (!currentQuestion) return;
    
    // Disable buttons to prevent multiple clicks
    yesButton.disabled = true;
    noButton.disabled = true;
    
    const isCorrect = (userAnswer === currentQuestion.answer);
    
    if (isCorrect) {
      updateCharacterState('correct');
      post({type: 'score:delta', value: 10});
      score += 10;
      
      // Show correct feedback
      if (userAnswer) {
        yesButton.classList.add('correct');
      } else {
        noButton.classList.add('correct');
      }
      
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
      
      // Show wrong feedback
      if (userAnswer) {
        yesButton.classList.add('wrong');
      } else {
        noButton.classList.add('wrong');
      }
      
      tts('Try again!');
      
      // Stay on same question, re-enable buttons after delay
      setTimeout(() => {
        // Reset character state
        updateCharacterState('thinking');
        
        // Re-enable buttons
        yesButton.disabled = false;
        noButton.disabled = false;
        
        // Remove feedback classes
        yesButton.classList.remove('correct', 'wrong');
        noButton.classList.remove('correct', 'wrong');
      }, 2000);
    }
  }

  function setup() {
    // Shuffle questions for random order
    shuffledQuestions = shuffle([...ANIMAL_ACTIONS]);
    turnCount = 0;
    score = 0;
    
    // Reset character state
    updateCharacterState('thinking');
    
    // Start first question
    startNewQuestion();
  }

  // Event listeners
  yesButton.addEventListener('click', () => onAnswerClick(true));
  noButton.addEventListener('click', () => onAnswerClick(false));

  // Initialize game
  setup();
})();
