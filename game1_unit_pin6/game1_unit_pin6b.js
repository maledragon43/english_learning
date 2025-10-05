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
  let patternInitialPositions = [];
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
    
    // Reset all drop zones to original state
    const allDropZones = dropZones.querySelectorAll('.drop-zone');
    allDropZones.forEach((zone, index) => {
      // Reset drop zone appearance
      zone.style.border = '';
      zone.style.backgroundColor = '';
      zone.innerHTML = ''; // Clear any correct placement images
      
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
    
    // Ensure animals are always visible
    ensureAnimalsVisible();
    
    autoResize();
  }

  function createAnimalsForTurn() {
    const slide = GAME_SLIDES[currentSlide];
    
    // Clear previous animals
    const existingPatterns = spotDropContainer.querySelectorAll('.animal-to-place');
    existingPatterns.forEach(pattern => pattern.remove());
    // Don't clear patternInitialPositions - we need to keep track of positions
    
    // Create 4 animals - always visible like Game 3 Unit 4
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
      animalImg.style.display = 'block';
      
      // Ensure image loads
      animalImg.onload = function() {
        console.log(`Image loaded for pattern ${i}:`, slide.animalImage);
      };
      animalImg.onerror = function() {
        console.error(`Failed to load image for pattern ${i}:`, slide.animalImage);
      };
      
      animalDiv.appendChild(animalImg);
      spotDropContainer.appendChild(animalDiv);
      
      // Use predetermined positions for patterns
      const predeterminedPositions = [
        { x: 20, y: 85 },   // Bottom-left area
        { x: 40, y: 85 },   // Bottom-center-left area
        { x: 60, y: 85 },   // Bottom-center-right area
        { x: 80, y: 85 }    // Bottom-right area
      ];
      
      const patternX = predeterminedPositions[i].x;
      const patternY = predeterminedPositions[i].y;
      
      animalDiv.style.left = `${patternX}%`;
      animalDiv.style.top = `${patternY}%`;
      
      console.log(`Pattern ${i} positioned at:`, animalDiv.style.left, animalDiv.style.top);
      console.log(`Pattern ${i} image source:`, slide.animalImage);
      
      // Store initial position with unique ID
      const patternId = `pattern_${currentSlide}_${i}`;
      patternInitialPositions.push({
        id: patternId,
        element: animalDiv,
        x: patternX,
        y: patternY,
        slide: currentSlide,
        index: i
      });
      
      // Add drag functionality
      animalDiv.addEventListener('mousedown', handleMouseDown);
    }
    
    // Make sure animals are visible immediately
    console.log(`Created ${4} animals for slide ${currentSlide}`);
    
    // Force visibility
    setTimeout(() => {
      const patterns = spotDropContainer.querySelectorAll('.animal-to-place');
      console.log(`Found ${patterns.length} patterns in container`);
      patterns.forEach((pattern, index) => {
        console.log(`Pattern ${index}:`, pattern.style.left, pattern.style.top, pattern.style.display);
      });
    }, 100);
  }

  function ensureAnimalsVisible() {
    // Make sure all animals are visible and positioned correctly
    const animals = spotDropContainer.querySelectorAll('.animal-to-place');
    animals.forEach((animal, index) => {
      animal.style.display = 'block';
      animal.style.visibility = 'visible';
      animal.style.opacity = '1';
      
      // Ensure they're positioned at the bottom
      if (!animal.style.left || !animal.style.top) {
        const predeterminedPositions = [
          { x: 20, y: 85 },   // Bottom-left area
          { x: 40, y: 85 },   // Bottom-center-left area
          { x: 60, y: 85 },   // Bottom-center-right area
          { x: 80, y: 85 }    // Bottom-right area
        ];
        
        if (predeterminedPositions[index]) {
          animal.style.left = `${predeterminedPositions[index].x}%`;
          animal.style.top = `${predeterminedPositions[index].y}%`;
        }
      }
    });
    
    console.log(`Ensured ${animals.length} animals are visible`);
  }

  function returnPatternToInitialPosition(pattern) {
    // Find the initial position for this pattern
    const initialPos = patternInitialPositions.find(pos => pos.element === pattern);
    if (initialPos) {
      pattern.style.left = `${initialPos.x}%`;
      pattern.style.top = `${initialPos.y}%`;
    } else {
      // If not found, return to a default position (bottom area)
      pattern.style.left = '50%';
      pattern.style.top = '80%';
    }
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
      
      // Show correct feedback without replacing drop zone content
      setTimeout(() => {
        // Just show visual feedback, don't replace content
        dropZone.style.border = '3px solid green';
        dropZone.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
        
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
        returnPatternToInitialPosition(animal);
        updateCharacterState('thinking');
      }, 1500);
    }
  }

  // Drag and drop functionality
  let dragOffset = { x: 0, y: 0 };

  function handleMouseDown(e) {
    console.log('Mouse down event triggered on:', e.target);
    if (e.target.tagName === 'IMG') {
      console.log('Starting drag for pattern');
      isDragging = true;
      const animal = e.target.parentElement;
      const container = spotDropContainer;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate offset from mouse to pattern's current position relative to container
      const currentLeftPercent = parseFloat(animal.style.left) || 0;
      const currentTopPercent = parseFloat(animal.style.top) || 0;
      
      // Convert percentage to pixels for offset calculation
      const currentX = (currentLeftPercent / 100) * containerRect.width;
      const currentY = (currentTopPercent / 100) * containerRect.height;
      
      dragOffset.x = e.clientX - containerRect.left - currentX;
      dragOffset.y = e.clientY - containerRect.top - currentY;
      
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
      
      // Position pattern exactly at mouse cursor
      let newX = e.clientX - containerRect.left - dragOffset.x;
      let newY = e.clientY - containerRect.top - dragOffset.y;
      
      // Keep within bounds
      newX = Math.max(0, Math.min(newX, containerRect.width - animal.offsetWidth));
      newY = Math.max(0, Math.min(newY, containerRect.height - animal.offsetHeight));
      
      // Convert to percentage units
      const newXPercent = (newX / containerRect.width) * 100;
      const newYPercent = (newY / containerRect.height) * 100;
      
      animal.style.left = `${newXPercent}%`;
      animal.style.top = `${newYPercent}%`;
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
