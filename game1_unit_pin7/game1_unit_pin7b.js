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
  let placedPatterns = new Set(); // Track which patterns have been correctly placed
  let patternToInstructionMap = new Map(); // Map patterns to their instruction index
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
    placedPatterns.clear(); // Reset placed patterns for new slide
    patternToInstructionMap.clear(); // Reset pattern mapping
    
    // Set background
    backgroundImage.src = slide.background;
    backgroundImage.alt = slide.title;
    
    console.log(`Setting background image:`, slide.background);
    
    // Debug background image loading
    backgroundImage.onload = function() {
      console.log(`✅ Background image loaded successfully:`, slide.background);
    };
    backgroundImage.onerror = function() {
      console.error(`❌ Failed to load background image:`, slide.background);
      backgroundImage.style.border = '3px solid red';
      backgroundImage.style.backgroundColor = 'yellow';
    };
    
    // Create all patterns for this slide (8 patterns, one for each instruction)
    createPatternsForSlide();
    
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
    
    // Show all drop zones as white circles
    const allDropZones = dropZones.querySelectorAll('.drop-zone');
    allDropZones.forEach((zone, index) => {
      // Reset drop zone to white circle appearance
      zone.style.border = '';
      zone.style.backgroundColor = '';
      zone.style.borderRadius = '50%';
      zone.innerHTML = '';
      zone.style.display = 'flex';
      
      if (index === currentInstruction) {
        currentDropZone = zone;
      }
    });
    
    // Play instruction
    tts(instruction.text);
    
    // Reset character state
    updateCharacterState('thinking');
    
    // Ensure patterns are always visible
    ensurePatternsVisible();
    
    autoResize();
  }

  function createPatternsForSlide() {
    const slide = GAME_SLIDES[currentSlide];
    
    // Clear previous patterns
    const existingPatterns = spotDropContainer.querySelectorAll('.animal-to-place');
    existingPatterns.forEach(pattern => pattern.remove());
    patternInitialPositions = [];
    
    // Create 8 patterns, one for each instruction
    slide.instructions.forEach((instruction, index) => {
      const patternDiv = document.createElement('div');
      patternDiv.className = 'animal-to-place';
      patternDiv.style.position = 'absolute';
      patternDiv.style.width = '60px';
      patternDiv.style.height = '60px';
      patternDiv.style.cursor = 'grab';
      patternDiv.style.zIndex = '199';
      patternDiv.style.pointerEvents = 'auto';
      patternDiv.dataset.instructionIndex = index;
      patternDiv.dataset.pattern = instruction.pattern;
      
      const patternImg = document.createElement('img');
      patternImg.src = instruction.patternImage;
      patternImg.alt = instruction.pattern;
      patternImg.style.width = '100%';
      patternImg.style.height = '100%';
      patternImg.style.objectFit = 'contain';
      patternImg.style.display = 'block';
      
      console.log(`Creating pattern ${index} (${instruction.pattern}) with src:`, instruction.patternImage);
      
      // Ensure image loads
      patternImg.onload = function() {
        console.log(`✅ Image loaded successfully for pattern ${index}:`, instruction.patternImage);
      };
      patternImg.onerror = function() {
        console.error(`❌ Failed to load image for pattern ${index}:`, instruction.patternImage);
        patternImg.style.border = '2px solid red';
        patternImg.style.backgroundColor = 'yellow';
      };
      
      patternDiv.appendChild(patternImg);
      spotDropContainer.appendChild(patternDiv);
      
      // Use predetermined positions for patterns (8 patterns in a row at the bottom)
      const predeterminedPositions = [
        { x: 10, y: 85 },   // Pattern 1
        { x: 20, y: 85 },   // Pattern 2
        { x: 30, y: 85 },   // Pattern 3
        { x: 40, y: 85 },   // Pattern 4
        { x: 50, y: 85 },   // Pattern 5
        { x: 60, y: 85 },   // Pattern 6
        { x: 70, y: 85 },   // Pattern 7
        { x: 80, y: 85 }     // Pattern 8
      ];
      
      const patternX = predeterminedPositions[index].x;
      const patternY = predeterminedPositions[index].y;
      
      patternDiv.style.left = `${patternX}%`;
      patternDiv.style.top = `${patternY}%`;
      
      console.log(`Pattern ${index} (${instruction.pattern}) positioned at:`, patternDiv.style.left, patternDiv.style.top);
      
      // Store initial position
      const patternId = `pattern_${currentSlide}_${index}`;
      patternInitialPositions.push({
        id: patternId,
        element: patternDiv,
        x: patternX,
        y: patternY,
        slide: currentSlide,
        index: index,
        instructionIndex: index
      });
      
      // Map pattern to instruction
      patternToInstructionMap.set(patternDiv, index);
      
      // Add drag functionality
      patternDiv.addEventListener('mousedown', handleMouseDown);
    });
    
    console.log(`Created ${slide.instructions.length} patterns for slide ${currentSlide + 1}`);
  }

  function ensurePatternsVisible() {
    // Make sure all patterns are visible and positioned correctly
    const patterns = spotDropContainer.querySelectorAll('.animal-to-place');
    patterns.forEach((pattern, index) => {
      pattern.style.display = 'block';
      pattern.style.visibility = 'visible';
      pattern.style.opacity = '1';
      
      // Ensure they're positioned at the bottom
      if (!pattern.style.left || !pattern.style.top) {
        const predeterminedPositions = [
          { x: 10, y: 85 },
          { x: 20, y: 85 },
          { x: 30, y: 85 },
          { x: 40, y: 85 },
          { x: 50, y: 85 },
          { x: 60, y: 85 },
          { x: 70, y: 85 },
          { x: 80, y: 85 }
        ];
        
        if (predeterminedPositions[index]) {
          pattern.style.left = `${predeterminedPositions[index].x}%`;
          pattern.style.top = `${predeterminedPositions[index].y}%`;
        }
      }
    });
    
    console.log(`Ensured ${patterns.length} patterns are visible`);
  }

  function returnPatternToInitialPosition(pattern) {
    // Find the initial position for this pattern
    const initialPos = patternInitialPositions.find(pos => pos.element === pattern);
    if (initialPos) {
      pattern.style.left = `${initialPos.x}%`;
      pattern.style.top = `${initialPos.y}%`;
    } else {
      // If not found, return to a default position
      pattern.style.left = '50%';
      pattern.style.top = '80%';
    }
  }

  function checkDrop(pattern, dropZone) {
    const slide = GAME_SLIDES[currentSlide];
    const instruction = slide.instructions[currentInstruction];
    const patternInstructionIndex = patternToInstructionMap.get(pattern);
    
    // Check if this pattern belongs to the current instruction
    if (patternInstructionIndex !== currentInstruction) {
      // Wrong pattern - return to initial position
      updateCharacterState('wrong');
      post({type: 'score:delta', value: -5});
      score -= 5;
      
      tts('Try again!');
      
      setTimeout(() => {
        returnPatternToInitialPosition(pattern);
        updateCharacterState('thinking');
      }, 1500);
      return;
    }
    
    // Check if dropped on correct zone
    const rect = dropZone.getBoundingClientRect();
    const patternRect = pattern.getBoundingClientRect();
    
    const centerX = patternRect.left + patternRect.width / 2;
    const centerY = patternRect.top + patternRect.height / 2;
    
    const isInZone = centerX >= rect.left && centerX <= rect.right && 
                     centerY >= rect.top && centerY <= rect.bottom;
    
    if (isInZone) {
      // Correct drop - mark pattern as placed and lock it
      placedPatterns.add(pattern);
      pattern.style.pointerEvents = 'none';
      pattern.style.cursor = 'default';
      
      updateCharacterState('correct');
      post({type: 'score:delta', value: 10});
      score += 10;
      
      tts('Correct!');
      
      // Move to next instruction
      setTimeout(() => {
        currentInstruction++;
        startInstruction();
      }, 2000);
      
    } else {
      // Wrong drop zone
      updateCharacterState('wrong');
      post({type: 'score:delta', value: -5});
      score -= 5;
      
      tts('Try again!');
      
      setTimeout(() => {
        returnPatternToInitialPosition(pattern);
        updateCharacterState('thinking');
      }, 1500);
    }
  }

  // Drag and drop functionality
  let dragOffset = { x: 0, y: 0 };

  function handleMouseDown(e) {
    console.log('Mouse down event triggered on:', e.target);
    if (e.target.tagName === 'IMG') {
      const pattern = e.target.parentElement;
      
      // Check if this pattern has already been correctly placed
      if (placedPatterns.has(pattern)) {
        console.log('Pattern already placed, cannot drag');
        return;
      }
      
      console.log('Starting drag for pattern');
      isDragging = true;
      const container = spotDropContainer;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate offset from mouse to pattern's current position relative to container
      const currentLeftPercent = parseFloat(pattern.style.left) || 0;
      const currentTopPercent = parseFloat(pattern.style.top) || 0;
      
      // Convert percentage to pixels for offset calculation
      const currentX = (currentLeftPercent / 100) * containerRect.width;
      const currentY = (currentTopPercent / 100) * containerRect.height;
      
      dragOffset.x = e.clientX - containerRect.left - currentX;
      dragOffset.y = e.clientY - containerRect.top - currentY;
      
      pattern.style.zIndex = '199';
      pattern.style.cursor = 'grabbing';
      
      // Store reference to the dragged pattern
      currentDraggedAnimal = pattern;
      
      e.preventDefault();
    }
  }

  function handleMouseMove(e) {
    if (isDragging && currentDraggedAnimal) {
      const pattern = currentDraggedAnimal;
      const container = spotDropContainer;
      const containerRect = container.getBoundingClientRect();
      
      // Position pattern exactly at mouse cursor
      let newX = e.clientX - containerRect.left - dragOffset.x;
      let newY = e.clientY - containerRect.top - dragOffset.y;
      
      // Keep within bounds
      newX = Math.max(0, Math.min(newX, containerRect.width - pattern.offsetWidth));
      newY = Math.max(0, Math.min(newY, containerRect.height - pattern.offsetHeight));
      
      // Convert to percentage units
      const newXPercent = (newX / containerRect.width) * 100;
      const newYPercent = (newY / containerRect.height) * 100;
      
      pattern.style.left = `${newXPercent}%`;
      pattern.style.top = `${newYPercent}%`;
    }
  }

  function handleMouseUp(e) {
    if (isDragging && currentDraggedAnimal) {
      isDragging = false;
      const pattern = currentDraggedAnimal;
      pattern.style.zIndex = '199';
      pattern.style.cursor = 'grab';
      
      // Check if dropped on current drop zone
      if (currentDropZone) {
        checkDrop(pattern, currentDropZone);
      }
      
      currentDraggedAnimal = null;
    }
  }

  function setup() {
    currentSlide = 0;
    currentInstruction = 0;
    score = 0;
    placedPatterns.clear();
    patternToInstructionMap.clear();
    
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

