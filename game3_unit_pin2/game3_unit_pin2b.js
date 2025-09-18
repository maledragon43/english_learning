(function(){
  const { ANIMALS, sentenceData, post, autoResize, tts, updateCharacterState } = window.g3;
  const grid = document.getElementById('grid');
  const banner = document.getElementById('statusBanner');

  let currentSentence = null;
  let currentOptions = [];
  let turnCount = 0;

  function shuffle(a){ return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]); }

  function renderOptions() {
    grid.innerHTML = '';
    const shuffledOptions = shuffle([...currentOptions]);
    
    shuffledOptions.forEach((imageName, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      cardEl.setAttribute('data-image', imageName);
      
      const front = document.createElement('div');
      front.className = 'card-face card-front';
      front.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      
      const back = document.createElement('div');
      back.className = 'card-face card-back';
      const backImg = document.createElement('img');
      backImg.src = `../assets/images/Sentence Match photos/${imageName}`;
      backImg.alt = imageName;
      backImg.style.width = '100%';
      backImg.style.height = '100%';
      backImg.style.objectFit = 'contain';
      backImg.style.borderRadius = '8px';
      back.appendChild(backImg);
      
      cardEl.appendChild(front);
      cardEl.appendChild(back);
      cardEl.addEventListener('click', () => onCardClick(cardEl, imageName));
      grid.appendChild(cardEl);
    });
    autoResize();
  }

  function onCardClick(cardEl, imageName) {
    if (cardEl.classList.contains('matched')) {
      return;
    }

    // Flip the card
    cardEl.classList.add('is-flipped');
    
    const correct = imageName === currentSentence.correct;
    
    if (correct) {
      updateCharacterState('correct');
      post({type: 'score:delta', value: 10});
      
      setTimeout(() => {
        cardEl.classList.add('matched');
        turnCount++;
        
        if (turnCount >= sentenceData.length) {
          banner.textContent = 'WELL DONE!';
          tts('Well done!');
          setTimeout(() => {
            setup();
          }, 2000);
        } else {
          startNewSentence();
        }
      }, 1000);
      
    } else {
      updateCharacterState('wrong');
      post({type: 'score:delta', value: -5});
      
      setTimeout(() => {
        cardEl.classList.remove('is-flipped');
        updateCharacterState('thinking');
      }, 1500);
    }
  }

  function startNewSentence() {
    if (turnCount >= sentenceData.length) {
      return;
    }
    
    currentSentence = sentenceData[turnCount];
    currentOptions = [...currentSentence.options];
    
    banner.textContent = 'LISTEN AND MATCH';
    updateCharacterState('thinking');
    
    // Play the sentence
    tts(currentSentence.sentence);
    
    renderOptions();
  }

  function setup() {
    turnCount = 0;
    banner.textContent = 'LISTEN AND MATCH';
    updateCharacterState('thinking');
    startNewSentence();
  }

  setup();
})();
