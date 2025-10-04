(function(){
  const { GAME_SLIDES, shuffle, post, autoResize, tts, updateCharacterState } = window.g1;
  
  const spotDropContainer = document.getElementById('spotDropContainer');
  const backgroundImage = document.getElementById('backgroundImage');
  const dropZones = document.getElementById('dropZones');
  const animalToPlace = document.getElementById('animalToPlace');
  const banner = document.getElementById('statusBanner');

  let currentSlide = 0;
  let currentInstruction = 0;
  let currentDropZone = null;
  let isDragging = false;
  let currentDraggedAnimal = null;
  let score = 0;

  function setupSlide() {
    if (currentSlide >= GAME_SLIDES.length) {
      // Game completed
      banner.textContent = 'WELL DONE!';
      tts('Well done!');
      updateCharacterState('correct');
      
      setTimeout(() => {
        setup(); // Restart game
      }, 3000);
      return;
    }

    const slide = GAME_SLIDES[currentSlide];
    currentInstruction = 0;
    
    // Set background
    backgroundImage.src = slide.background;
    backgroundImage.alt = slide.title;
    
    // Create 4 animals in the red rectangle area
    createAnimalsForTurn();
    
    // Clear previous drop zones
    dropZones.innerHTML = '';
    
    // Create drop zones for all instructions
    slide.instructions.forEach((instruction, index) => {
      const dropZone = document.createElement('div');
      dropZone.className = 'drop-zone';
      dropZone.style.left = `${instruction.dropZone.x}%`;
      dropZone.style.top = `${instruction.dropZone.y}%`;
      dropZone.dataset.instructionIndex = index;
      dropZones.appendChild(dropZone);
    });
    
    // Start first instruction
    startInstruction();
  }

  function startInstruction() {
    const slide = GAME_SLIDES[currentSlide];
    if (currentInstruction >= slide.instructions.length) {
      // Slide completed, move to next slide
      currentSlide++;
      setupSlide();
      return;
    }

    const instruction = slide.instructions[currentInstruction];
    
    // Update banner with the instruction
    banner.textContent = instruction.text;
    
    // Show only the current drop zone
    const allDropZones = dropZones.querySelectorAll('.drop-zone');
    allDropZones.forEach((zone, index) => {
      if (index === currentInstruction) {
        zone.style.display = 'flex';
        currentDropZone = zone;
      } else {
        zone.style.display = 'none';
      }
    });
    
    // Play instruction
    tts(instruction.text);
    
    // Reset character state
    updateCharacterState('thinking');
    
    autoResize();
  }

  function createAnimalsForTurn() {
    const slide = GAME_SLIDES[currentSlide];
    
    // Clear previous animals
    animalToPlace.innerHTML = '';
    
    // Create 4 animals
    for (let i = 0; i < 4; i++) {
      const animalDiv = document.createElement('div');
      animalDiv.className = 'animal-to-place';
      animalDiv.style.position = 'absolute';
      animalDiv.style.width = '60px';
      animalDiv.style.height = '60px';
      animalDiv.style.cursor = 'grab';
      animalDiv.style.zIndex = '3';
      
      const animalImg = document.createElement('img');
      animalImg.src = slide.animalImage;
      animalImg.alt = slide.animal;
      animalImg.style.width = '100%';
      animalImg.style.height = '100%';
      animalImg.style.objectFit = 'contain';
      
      animalDiv.appendChild(animalImg);
      animalToPlace.appendChild(animalDiv);
      
      // Position in red rectangle area (bottom 20% of container)
      const container = spotDropContainer;
      const containerHeight = container.offsetHeight;
      const redRectangleArea = containerHeight * 0.8; // Start from 80% down
      
      const randomX = Math.random() * (container.offsetWidth - 60);
      const randomY = redRectangleArea + Math.random() * (containerHeight * 0.2 - 60);
      
      animalDiv.style.left = `${randomX}px`;
      animalDiv.style.top = `${randomY}px`;
      
      // Add drag functionality
      animalDiv.addEventListener('mousedown', handleMouseDown);
    }
  }

  function positionAnimalRandomly() {
    const container = spotDropContainer;
    const animal = animalToPlace;
    
    // Random position within the container
    const maxX = container.offsetWidth - animal.offsetWidth;
    const maxY = container.offsetHeight - animal.offsetHeight;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    animal.style.left = `${randomX}px`;
    animal.style.top = `${randomY}px`;
  }

  function checkDrop(animal, dropZone) {
    const slide = GAME_SLIDES[currentSlide];
    const instruction = slide.instructions[currentInstruction];
    
    // Check if dropped on correct zone
    const rect = dropZone.getBoundingClientRect();
    const animalRect = animal.getBoundingClientRect();
    
    const centerX = animalRect.left + animalRect.width / 2;
    const centerY = animalRect.top + animalRect.height / 2;
    
    const isInZone = centerX >= rect.left && centerX <= rect.right && 
                     centerY >= rect.top && centerY <= rect.bottom;
    
    if (isInZone) {
      // Correct drop
      updateCharacterState('correct');
      post({type: 'score:delta', value: 10});
      score += 10;
      
      dropZone.classList.add('correct');
      tts('Correct!');
      
      // Show correct image
      setTimeout(() => {
        const correctImg = document.createElement('img');
        correctImg.src = instruction.correctImage;
        correctImg.alt = 'Correct placement';
        correctImg.style.width = '100%';
        correctImg.style.height = '100%';
        correctImg.style.objectFit = 'contain';
        dropZone.innerHTML = '';
        dropZone.appendChild(correctImg);
        
        // Move to next instruction
        setTimeout(() => {
          currentInstruction++;
          startInstruction();
        }, 2000);
      }, 1000);
      
    } else {
      // Wrong drop
      updateCharacterState('wrong');
      post({type: 'score:delta', value: -5});
      score -= 5;
      
      dropZone.classList.add('wrong');
      tts('Try again!');
      
      // Reset after delay
      setTimeout(() => {
        dropZone.classList.remove('wrong');
        positionAnimalRandomly();
        updateCharacterState('thinking');
      }, 1500);
    }
  }

  // Drag and drop functionality
  let dragOffset = { x: 0, y: 0 };

  function handleMouseDown(e) {
    if (e.target.tagName === 'IMG') {
      isDragging = true;
      const animal = e.target.parentElement;
      const rect = animal.getBoundingClientRect();
      
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      
      animal.style.zIndex = '10';
      animal.style.cursor = 'grabbing';
      
      // Store reference to the dragged animal
      currentDraggedAnimal = animal;
      
      e.preventDefault();
    }
  }

  function handleMouseMove(e) {
    if (isDragging && currentDraggedAnimal) {
      const animal = currentDraggedAnimal;
      const container = spotDropContainer;
      const containerRect = container.getBoundingClientRect();
      
      let newX = e.clientX - containerRect.left - dragOffset.x;
      let newY = e.clientY - containerRect.top - dragOffset.y;
      
      // Keep within bounds
      newX = Math.max(0, Math.min(newX, containerRect.width - animal.offsetWidth));
      newY = Math.max(0, Math.min(newY, containerRect.height - animal.offsetHeight));
      
      animal.style.left = `${newX}px`;
      animal.style.top = `${newY}px`;
    }
  }

  function handleMouseUp(e) {
    if (isDragging && currentDraggedAnimal) {
      isDragging = false;
      const animal = currentDraggedAnimal;
      animal.style.zIndex = '3';
      animal.style.cursor = 'grab';
      
      // Check if dropped on current drop zone
      if (currentDropZone) {
        checkDrop(animal, currentDropZone);
      }
      
      currentDraggedAnimal = null;
    }
  }

  function setup() {
    currentSlide = 0;
    currentInstruction = 0;
    score = 0;
    
    // Reset character state
    updateCharacterState('thinking');
    
    // Start first slide
    setupSlide();
  }

  // Event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  // Initialize game
  setup();
})();
