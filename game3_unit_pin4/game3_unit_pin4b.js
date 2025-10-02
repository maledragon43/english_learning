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
    'cat': { left: 16, top: 19 },
    'dog': { left: 28, top: 16 },
    'horse': { left: 9, top: 12 },
    'pig': { left: 24, top: 24 },
    'cow': { left: 60, top: 20 },
    'duck': { left: 20, top: 14 },
    'chicken': { left: 14, top: 26 },
    'mouse': { left: 32, top: 20 },
    
    // Wild animals positions
    'tiger': { left: 17, top: 17 },
    'elephant': { left: 40, top: 18 },
    'monkey': { left: 26, top: 12 },
    'bear': { left: 11, top: 24 },
    'frog': { left: 19, top: 16 },
    'bird': { left: 23, top: 60 },
    'zebra': { left: 13, top: 20 },
    'lion': { left: 29, top: 18 },
    'giraffe': { left: 70, top: 10 },
    'fish': { left: 21, top: 22 }
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
