(function(){
  const { SEA_ANIMALS, FARM_ANIMALS, WILD_ANIMALS, BALLOON_IMAGES, post, autoResize, tts, updateCharacterState } = window.g2;
  
  const balloonStage = document.getElementById('balloonStage');
  const banner = document.getElementById('statusBanner');
  
  let currentTarget = null;
  let turnCount = 0;
  let allAnimals = [];
  let shuffledAnimals = [];
  
  // Predefined turn order for 20 variations (10 sea animals × 2 rounds)
  const turnOrder = [
    'shells', 'turtle', 'dolphin', 'jellyfish', 'seahorse', 'starfish', 'crab', 'shark', 'penguin', 'clownfish',
    'turtle', 'shells', 'seahorse', 'dolphin', 'crab', 'jellyfish', 'clownfish', 'starfish', 'penguin', 'shark'
  ];
  
  function shuffle(arr) {
    return arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  }
  
  function getRandomAnimals(category, count) {
    const animals = category === 'sea' ? SEA_ANIMALS : 
                   category === 'farm' ? FARM_ANIMALS : WILD_ANIMALS;
    return shuffle([...animals]).slice(0, count);
  }
  
  function createBalloon(animal) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.setAttribute('data-animal', animal);
    
    const img = document.createElement('img');
    img.src = `../assets/images/balloons_animal/${BALLOON_IMAGES[animal]}`;
    img.alt = animal;
    balloon.appendChild(img);
    
    balloon.addEventListener('click', () => onBalloonClick(balloon, animal));
    return balloon;
  }
  
  function onBalloonClick(balloon, animal) {
    if (balloon.classList.contains('burst')) return;
    
    const correct = animal === currentTarget;
    
    if (correct) {
      updateCharacterState('correct');
      post({type: 'score:delta', value: 10});
      
      // Burst the balloon
      balloon.classList.add('burst');
      
      setTimeout(() => {
        turnCount++;
        if (turnCount >= 20) {
          banner.textContent = 'WELL DONE! All balloons burst!';
          tts('Well done! All balloons burst!');
          setTimeout(() => {
            setup();
          }, 3000);
        } else {
          startNewTurn();
        }
      }, 1000);
      
    } else {
      updateCharacterState('wrong');
      post({type: 'score:delta', value: -5});
      
      setTimeout(() => {
        updateCharacterState('thinking');
      }, 1500);
    }
  }
  
  function startNewTurn() {
    if (turnCount >= 20) return;
    
    // Clear previous balloons
    balloonStage.innerHTML = '';
    
    // Get target animal
    currentTarget = turnOrder[turnCount];
    
    // Create exactly 5 balloons: 1 target + 4 distractors
    const balloons = [currentTarget];
    
    // Add distractors based on target category
    if (SEA_ANIMALS.includes(currentTarget)) {
      // If target is sea animal, add 2 random sea animals + 2 random from other categories
      const otherSeaAnimals = SEA_ANIMALS.filter(animal => animal !== currentTarget);
      const randomSeaAnimals = shuffle([...otherSeaAnimals]).slice(0, 2);
      balloons.push(...randomSeaAnimals);
      
      // Add 2 random animals from farm/wild categories
      const farmAnimal = getRandomAnimals('farm', 1)[0];
      const wildAnimal = getRandomAnimals('wild', 1)[0];
      balloons.push(farmAnimal, wildAnimal);
    } else {
      // If target is not sea animal, add 2 random sea animals + 2 random from other categories
      const seaAnimals = getRandomAnimals('sea', 2);
      balloons.push(...seaAnimals);
      
      // Add 2 random animals from other categories
      const otherCategories = ['farm', 'wild'];
      otherCategories.forEach(category => {
        const animals = getRandomAnimals(category, 1);
        balloons.push(...animals);
      });
    }
    
    // Ensure we have exactly 5 balloons
    const shuffledBalloons = shuffle(balloons).slice(0, 5);
    
    // Create balloon elements
    shuffledBalloons.forEach(animal => {
      const balloon = createBalloon(animal);
      balloonStage.appendChild(balloon);
    });
    
    // Update banner
    banner.textContent = `Find the ${currentTarget.toUpperCase()} balloon!`;
    tts(`Find the ${currentTarget} balloon!`);
    
    updateCharacterState('thinking');
    autoResize();
  }
  
  function setup() {
    turnCount = 0;
    updateCharacterState('thinking');
    startNewTurn();
  }
  
  setup();
})();
