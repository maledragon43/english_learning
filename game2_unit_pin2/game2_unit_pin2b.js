(function(){
  const { ANIMALS, post, autoResize, tts, updateCharacterState } = window.g2;
  const grid = document.getElementById('grid');
  const banner = document.getElementById('statusBanner');

  const rows = 4, cols = 5;
  const TOTAL_PAIRS = 10; // 20 cards (10 pairs)

  function shuffle(a){ return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]); }

  function buildDeck(){
    const animals = ANIMALS.slice(0, TOTAL_PAIRS);
    const deck = [];
    
    // Create pairs of cards
    animals.forEach((animal, index) => {
      deck.push({ id: `card-${index}-a`, animal: animal, pairId: index });
      deck.push({ id: `card-${index}-b`, animal: animal, pairId: index });
    });
    
    return shuffle(deck);
  }

  let deck = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let canFlip = true;

  function render(){
    grid.innerHTML = '';
    deck.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      cardEl.setAttribute('data-id', card.id);
      cardEl.setAttribute('data-animal', card.animal);
      cardEl.setAttribute('data-pair-id', card.pairId);
      
      const front = document.createElement('div');
      front.className = 'card-face card-front';
      const frontImg = document.createElement('img');
      frontImg.src = '../assets/images/backside.png';
      frontImg.alt = 'card back';
      frontImg.style.width = '100%';
      frontImg.style.height = '100%';
      frontImg.style.objectFit = 'contain';
      frontImg.style.borderRadius = '8px';
      front.appendChild(frontImg);
      
      const back = document.createElement('div');
      back.className = 'card-face card-back';
      const backImg = document.createElement('img');
      backImg.src = `../assets/images/Word Dash photos/${card.animal}.png`;
      backImg.alt = card.animal;
      backImg.style.width = '100%';
      backImg.style.height = '100%';
      backImg.style.objectFit = 'contain';
      backImg.style.objectPosition = 'center';
      backImg.style.borderRadius = '8px';
      back.appendChild(backImg);
      
      cardEl.appendChild(front);
      cardEl.appendChild(back);
      cardEl.addEventListener('click', () => onCardClick(cardEl, card));
      grid.appendChild(cardEl);
    });
    autoResize();
  }

  function onCardClick(cardEl, card){
    if (!canFlip || cardEl.classList.contains('is-flipped') || cardEl.classList.contains('matched')) {
      return;
    }

    // Flip the card
    cardEl.classList.add('is-flipped');
    flippedCards.push({ element: cardEl, card: card });

    // If this is the first card, just flip it
    if (flippedCards.length === 1) {
      tts(card.animal);
      return;
    }

    // If this is the second card, check for match
    if (flippedCards.length === 2) {
      canFlip = false;
      const [first, second] = flippedCards;
      
      if (first.card.pairId === second.card.pairId && first.card.pairId !== -1) {
        // Match found!
        updateCharacterState('correct');
        post({type: 'score:delta', value: 10});
        
        setTimeout(() => {
          first.element.classList.add('matched');
          second.element.classList.add('matched');
          matchedPairs++;
          
          // Check if game is complete
          if (matchedPairs >= TOTAL_PAIRS) {
            banner.textContent = 'WELL DONE!';
            tts('Well done!');
            setTimeout(() => {
              setup();
            }, 2000);
          } else {
            updateCharacterState('thinking');
          }
          
          flippedCards = [];
          canFlip = true;
        }, 1000);
        
      } else {
        // No match
        updateCharacterState('wrong');
        post({type: 'score:delta', value: -2});
        
        setTimeout(() => {
          first.element.classList.remove('is-flipped');
          second.element.classList.remove('is-flipped');
          flippedCards = [];
          canFlip = true;
          updateCharacterState('thinking');
        }, 1500);
      }
    }
  }

  function setup(){
    deck = buildDeck();
    flippedCards = [];
    matchedPairs = 0;
    canFlip = true;
    banner.textContent = 'FIND THE PAIRS';
    updateCharacterState('thinking');
    render();
  }

  setup();
})();
