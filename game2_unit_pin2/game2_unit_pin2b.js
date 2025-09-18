(function(){
  const { ANIMALS, animalSounds, tts, post, autoResize, updateCharacterState } = window.g2;
  const stage = document.getElementById('balloonStage');
  const banner = document.getElementById('currentWord');

  let currentTarget = '';
  let balloons = [];
  let gameActive = true;
  let turnCount = 0;

  function shuffle(arr){ return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }

  function createBalloon(animal, x, y) {
    const balloon = document.createElement('button');
    balloon.className = 'balloon';
    balloon.style.left = x + '%';
    balloon.style.top = y + '%';
    balloon.setAttribute('data-animal', animal);
    
    const img = document.createElement('img');
    img.className = 'balloon-image';
    img.src = `../assets/images/Word Dash photos/${animal}.png`;
    img.alt = animal;
    balloon.appendChild(img);
    
    balloon.addEventListener('click', () => onBalloonClick(balloon, animal));
    return balloon;
  }

  function generatePositions() {
    const positions = [];
    for (let i = 0; i < 9; i++) {
      let x, y;
      do {
        x = Math.random() * 70 + 15; // Keep within 15-85% range
        y = Math.random() * 60 + 20; // Keep within 20-80% range
      } while (positions.some(pos => 
        Math.abs(pos.x - x) < 20 && Math.abs(pos.y - y) < 20
      ));
      positions.push({ x, y });
    }
    return positions;
  }

  function startNewRound() {
    turnCount++;
    if (turnCount > 20) {
      // Game completed
      post({type: 'game:complete', score: turnCount});
      return;
    }

    // Clear existing balloons
    stage.innerHTML = '';
    balloons = [];
    
    // Select target animal
    currentTarget = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    banner.textContent = animalSounds[currentTarget].toUpperCase();
    
    // Create 8 balloons with random animals (including the target)
    const selectedAnimals = [currentTarget];
    while (selectedAnimals.length < 8) {
      const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      if (!selectedAnimals.includes(randomAnimal)) {
        selectedAnimals.push(randomAnimal);
      }
    }
    
    const shuffledAnimals = shuffle(selectedAnimals);
    const positions = generatePositions();
    
    shuffledAnimals.forEach((animal, index) => {
      const balloon = createBalloon(animal, positions[index].x, positions[index].y);
      stage.appendChild(balloon);
      balloons.push(balloon);
    });
    
    updateCharacterState('thinking');
    tts(animalSounds[currentTarget]);
    autoResize();
  }

  function onBalloonClick(balloon, animal) {
    if (!gameActive) return;
    
    const correct = animal === currentTarget;
    
    if (correct) {
      updateCharacterState('correct');
      post({type: 'score:delta', value: 10});
      
      // Animate balloon pop
      balloon.style.transform = 'scale(1.2)';
      balloon.style.opacity = '0';
      
      setTimeout(() => {
        startNewRound();
      }, 1000);
    } else {
      updateCharacterState('wrong');
      post({type: 'score:delta', value: -5});
      
      // Shake animation for wrong answer
      balloon.style.transform = 'translateX(-5px)';
      setTimeout(() => {
        balloon.style.transform = 'translateX(5px)';
        setTimeout(() => {
          balloon.style.transform = 'translateX(0)';
        }, 100);
      }, 100);
      
      setTimeout(() => updateCharacterState('thinking'), 1000);
    }
  }

  // Start the game
  startNewRound();
})();
