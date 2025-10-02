(function(){
  const { FARM_ANIMALS, WILD_ANIMALS, FARM_ANIMAL_IMAGES, WILD_ANIMAL_IMAGES, post, autoResize, tts, updateCharacterState } = window.g2;
  
  const animalPool = document.getElementById('animalPool');
  const farmCategory = document.getElementById('farmCategory');
  const wildCategory = document.getElementById('wildCategory');
  const banner = document.getElementById('statusBanner');
  
  let currentAnimal = null;
  let turnCount = 0;
  let allAnimals = [];
  let shuffledAnimals = [];
  
  function shuffle(arr) {
    return arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  }
  
  function getAnimalImagePath(animal, category) {
    if (category === 'farm') {
      return `../assets/images/Word Dash photos/${FARM_ANIMAL_IMAGES[animal]}`;
    } else {
      return `../assets/images/wild animals/${WILD_ANIMAL_IMAGES[animal]}`;
    }
  }
  
  function createAnimalCard(animal, category) {
    const card = document.createElement('div');
    card.className = 'animal-card';
    card.draggable = true;
    card.setAttribute('data-animal', animal);
    card.setAttribute('data-category', category);
    
    const img = document.createElement('img');
    img.src = getAnimalImagePath(animal, category);
    img.alt = animal;
    card.appendChild(img);
    
    // Drag event listeners
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    return card;
  }
  
  function handleDragStart(e) {
    currentAnimal = e.target;
    e.target.style.opacity = '0.5';
  }
  
  function handleDragEnd(e) {
    e.target.style.opacity = '1';
  }
  
  function handleDragOver(e) {
    e.preventDefault();
  }
  
  function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.currentTarget;
    const animalCard = currentAnimal;
    
    if (!animalCard) return;
    
    const animal = animalCard.getAttribute('data-animal');
    const animalCategory = animalCard.getAttribute('data-category');
    const dropCategory = dropZone.getAttribute('data-category');
    
    // Check if drop is correct
    if (animalCategory === dropCategory) {
      // Correct drop
      updateCharacterState('correct');
      post({type: 'score:delta', value: 10});
      
      // Move animal to category
      const dropArea = dropZone.querySelector('.category-drop-area');
      animalCard.style.opacity = '1';
      
      // Make animal smaller when in category
      animalCard.classList.add('in-category');
      animalCard.style.width = '6vw';
      animalCard.style.height = '6vw';
      animalCard.style.minWidth = '45px';
      animalCard.style.minHeight = '45px';
      animalCard.style.maxWidth = '80px';
      animalCard.style.maxHeight = '80px';
      animalCard.style.cursor = 'default';
      animalCard.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
      
      // Remove drag functionality
      animalCard.draggable = false;
      animalCard.removeEventListener('dragstart', handleDragStart);
      animalCard.removeEventListener('dragend', handleDragEnd);
      
      dropArea.appendChild(animalCard);
      
      turnCount++;
      
      if (turnCount >= 20) {
        banner.textContent = 'WELL DONE! All animals sorted!';
        tts('Well done! All animals sorted!');
        // Game ends here - no automatic restart
      } else {
        setTimeout(() => {
          startNewTurn();
        }, 1000);
      }
      
    } else {
      // Wrong drop - return to original position
      updateCharacterState('wrong');
      post({type: 'score:delta', value: -5});
      
      animalCard.style.opacity = '1';
      
      setTimeout(() => {
        updateCharacterState('thinking');
      }, 1500);
    }
  }
  
  function startNewTurn() {
    if (turnCount >= 20) return;
    
    // Clear previous animal
    animalPool.innerHTML = '';
    
    // Get next animal
    const animal = shuffledAnimals[turnCount];
    const isFarmAnimal = FARM_ANIMALS.includes(animal);
    const category = isFarmAnimal ? 'farm' : 'wild';
    
    // Create and display animal card
    const animalCard = createAnimalCard(animal, category);
    animalPool.appendChild(animalCard);
    
    // Update banner
    banner.textContent = `correct category?`;
    tts(`Sort the ${animal} into the correct category!`);
    
    updateCharacterState('thinking');
    autoResize();
  }
  
  function setup() {
    turnCount = 0;
    
    // Create all animals list (10 farm + 10 wild)
    allAnimals = [...FARM_ANIMALS, ...WILD_ANIMALS];
    shuffledAnimals = shuffle([...allAnimals]);
    
    // Clear categories
    farmCategory.querySelector('.category-drop-area').innerHTML = '';
    wildCategory.querySelector('.category-drop-area').innerHTML = '';
    
    // Set up drop zones
    farmCategory.addEventListener('dragover', handleDragOver);
    farmCategory.addEventListener('drop', handleDrop);
    wildCategory.addEventListener('dragover', handleDragOver);
    wildCategory.addEventListener('drop', handleDrop);
    
    updateCharacterState('thinking');
    startNewTurn();
  }
  
  setup();
})();
