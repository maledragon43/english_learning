(function(){
  const { SEA_ANIMALS, FARM_ANIMALS, WILD_ANIMALS, COLORS, GAME_TURNS, post, autoResize, tts, updateCharacterState } = window.g3;
  
  const coloringArea = document.getElementById('coloringArea');
  const colorPalette = document.getElementById('colorPalette');
  const banner = document.getElementById('statusBanner');
  
  let currentTurn = 0;
  let currentInstruction = 0;
  let selectedColor = null;
  let currentAnimals = [];
  
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
    
    // Create animals for current turn
    const turnData = GAME_TURNS[currentTurn];
    const animalsToShow = turnData.animals.slice(0, 8); // Show 8 animals
    
    animalsToShow.forEach(animal => {
      const animalElement = createAnimalElement(animal, turnData.category);
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
