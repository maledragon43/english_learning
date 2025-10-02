(function(){
  const { SEA_ANIMALS, FARM_ANIMALS, WILD_ANIMALS, COLORS, GAME_TURNS, post, autoResize, tts, updateCharacterState } = window.g3;
  
  const coloringArea = document.getElementById('coloringArea');
  const colorPalette = document.getElementById('colorPalette');
  const banner = document.getElementById('statusBanner');
  
  let currentTurn = 0;
  let currentInstruction = 0;
  let selectedColor = null;
  let currentAnimals = [];
  
  // Predefined random positions for each animal type (relative to canvas top-left)
  const animalPositions = {
    // Sea animals positions
    'shell': { left: 60, top: 50 },
    'turtle': { left: 60, top: 75 },
    'dolphin': { left: 55, top: 10 },
    'jellyfish': { left: 45, top: 45 },
    'seahorse': { left: 80, top: 50 },
    'starfish': { left: 40, top: 15 },
    'crab': { left: 30, top: 75 },
    'shark': { left: 10, top: 30 },
    'penguin': { left: 15, top: 70 },
    'clownfish': { left: 10, top: 20 },
    
    // Farm animals positions
    'cat': { left: 60, top: 50 },
    'dog': { left: 70, top: 70 },
    'horse': { left: 70, top: 12 },
    'pig': { left: 45, top: 45 },
    'cow': { left: 13, top: 30 },
    'duck': { left: 40, top: 14 },
    'chicken': { left: 30, top: 75 },
    'mouse': { left: 10, top: 10 },
    
    // Wild animals positions
    'crocodile': {left: 10, top: 10},
    'tiger': { left: 50, top: 60 },
    'elephant': { left: 55, top: 12 },
    'monkey': { left: 45, top: 10 },
    'bear': { left: 32, top: 45 },
    'frog': { left: 80, top: 74 },
    'bird': { left: 30, top: 15 },
    'zebra': { left: 25, top: 75 },
    'lion': { left: 10, top: 40 },
    'giraffe': { left: 15, top: 70 },
    'fish': { left: 10, top: 20 }
  };
  
  function getAnimalImagePath(animal, category, isColored = false) {
    const colorSuffix = isColored ? `_${selectedColor}` : '';
    return `../assets/images/color it right/color me ${category} animals/${animal}${colorSuffix}.png`;
  }
  
  function createAnimalElement(animal, category) {
    const animalDiv = document.createElement('div');
    animalDiv.className = 'animal-to-color';
    animalDiv.setAttribute('data-animal', animal);
    animalDiv.setAttribute('data-category', category);
    
    const img = document.createElement('img');
    img.src = getAnimalImagePath(animal, category);
    img.alt = animal;
    animalDiv.appendChild(img);
    
    animalDiv.addEventListener('click', () => onAnimalClick(animalDiv, animal, category));
    return animalDiv;
  }
  
  function onAnimalClick(animalDiv, animal, category) {
    if (!selectedColor) {
      updateCharacterState('thinking');
      tts('Please select a color first!');
      return;
    }
    
    const currentInstructionData = GAME_TURNS[currentTurn].instructions[currentInstruction];
    
    if (animal === currentInstructionData.animal && selectedColor === currentInstructionData.color) {
      // Correct!
      updateCharacterState('correct');
      post({type: 'score:delta', value: 10});
      
      // Update the image to colored version
      const img = animalDiv.querySelector('img');
      img.src = getAnimalImagePath(animal, category, true);
      
      // Mark as completed
      animalDiv.classList.add('completed');
      animalDiv.style.pointerEvents = 'none';
      
      tts('Well done!');
      
      setTimeout(() => {
        currentInstruction++;
        if (currentInstruction >= GAME_TURNS[currentTurn].instructions.length) {
          // Turn completed
          currentTurn++;
          if (currentTurn >= GAME_TURNS.length) {
            // Game completed
            banner.textContent = 'WELL DONE! All animals colored!';
            tts('Well done! All animals colored!');
            setTimeout(() => {
              setup();
            }, 3000);
          } else {
            startNewTurn();
          }
        } else {
          startNewInstruction();
        }
      }, 1500);
      
    } else {
      // Wrong
      updateCharacterState('wrong');
      post({type: 'score:delta', value: -5});
      tts('Try again!');
      
      setTimeout(() => {
        updateCharacterState('thinking');
      }, 1500);
    }
  }
  
  function startNewInstruction() {
    const currentInstructionData = GAME_TURNS[currentTurn].instructions[currentInstruction];
    banner.textContent = currentInstructionData.text;
    tts(currentInstructionData.text);
    updateCharacterState('thinking');
  }
  
  function startNewTurn() {
    currentInstruction = 0;
    
    // Clear previous animals
    coloringArea.innerHTML = '';
    currentAnimals = [];
    
    // Create ALL animals for current turn
    const turnData = GAME_TURNS[currentTurn];
    
    turnData.animals.forEach(animal => {
      const animalElement = createAnimalElement(animal, turnData.category);
      
      // Use predefined position for this animal
      const position = animalPositions[animal];
      if (position) {
        animalElement.style.left = position.left + '%';
        animalElement.style.top = position.top + '%';
      }
      
      coloringArea.appendChild(animalElement);
      currentAnimals.push(animalElement);
    });
    
    startNewInstruction();
    autoResize();
  }
  
  function setup() {
    currentTurn = 0;
    currentInstruction = 0;
    selectedColor = null;
    
    // Clear color selection
    document.querySelectorAll('.color-selector').forEach(selector => {
      selector.classList.remove('selected');
    });
    
    updateCharacterState('thinking');
    startNewTurn();
  }
  
  // Color palette event listeners
  document.querySelectorAll('.color-selector').forEach(selector => {
    selector.addEventListener('click', () => {
      // Remove previous selection
      document.querySelectorAll('.color-selector').forEach(s => s.classList.remove('selected'));
      
      // Select new color
      selector.classList.add('selected');
      selectedColor = selector.getAttribute('data-color');
      
      tts(`Selected ${selectedColor} color`);
    });
  });
  
  setup();
})();
