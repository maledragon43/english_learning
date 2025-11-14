(function(){
  const { GAME_SLIDES, shuffle, post, autoResize, tts, updateCharacterState } = window.g3;
  
  const sceneImage = document.getElementById('sceneImage');
  const sceneImageContainer = document.getElementById('sceneImageContainer');
  const banner = document.getElementById('statusBanner');
  const yesButton = document.getElementById('yesButton');
  const noButton = document.getElementById('noButton');

  let currentSlide = 0;
  let currentQuestion = null;
  let shuffledQuestions = [];
  let questionIndex = 0;
  let score = 0;

  function startNewSlide() {
    if (currentSlide >= GAME_SLIDES.length) {
      // All slides completed
      banner.textContent = 'WELL DONE!';
      tts('Well done!');
      updateCharacterState('correct');
      
      setTimeout(() => {
        setup(); // Restart game
      }, 3000);
      return;
    }

    const slide = GAME_SLIDES[currentSlide];
    
    // Set the background image for this slide
    sceneImage.src = slide.background;
    sceneImage.alt = slide.slideName;
    
    // Shuffle questions for this slide
    shuffledQuestions = shuffle([...slide.questions]);
    questionIndex = 0;
    
    // Start first question of this slide
    startNewQuestion();
  }

  function startNewQuestion() {
    if (questionIndex >= shuffledQuestions.length) {
      // All questions in this slide completed, move to next slide
      currentSlide++;
      setTimeout(() => {
        startNewSlide();
      }, 1500);
      return;
    }

    currentQuestion = shuffledQuestions[questionIndex];
    
    // Update banner with the sentence
    banner.textContent = currentQuestion.text;
    
    // Play the sentence
    tts(currentQuestion.text);
    
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
        questionIndex++;
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
    currentSlide = 0;
    questionIndex = 0;
    score = 0;
    
    // Reset character state
    updateCharacterState('thinking');
    
    // Start first slide
    startNewSlide();
  }

  // Event listeners
  yesButton.addEventListener('click', () => onAnswerClick(true));
  noButton.addEventListener('click', () => onAnswerClick(false));

  // Initialize game
  setup();
})();

