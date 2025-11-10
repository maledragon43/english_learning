(function(){
  const { GAME_SLIDES, shuffle, post, autoResize, tts, updateCharacterState } = window.g1;
  
  const spotDropContainer = document.getElementById('spotDropContainer');
  const backgroundImage = document.getElementById('backgroundImage');
  const dropZones = document.getElementById('dropZones');
  const animalToPlace = document.getElementById('animalToPlace');
  const banner = document.getElementById('statusBanner');

  let currentSlide = 4; // Start with slide 5 (Bedroom 3) for testing
  let currentInstruction = 0;
  let currentDropZone = null;
  let isDragging = false;
  let currentDraggedAnimal = null;
  let patternInitialPositions = [];
  let placedPatterns = new Set(); // Track which patterns have been correctly placed
  let patternToInstructionMap = new Map(); // Map patterns to their instruction index
  let score = 0;

  function getDropZoneColor(slideIndex) {
    // Return different colors for different slides
    switch(slideIndex) {
      case 0: // Kitchen 1
        return 'yellow';
      case 1: // Bedroom 1
        return 'blue';
      case 2: // Kitchen 2
        return 'blue';
      case 3: // Bedroom 2
        return 'darkgrey';
      case 4: // Bedroom 3
        return 'blue';
      default:
        return 'white';
    }
  }

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
    
    // Adjust background position for slide 1, 2, and 5
    if (currentSlide === 0 || currentSlide === 1 || currentSlide === 4) {
      backgroundImage.style.top = '5%';
    } else {
      backgroundImage.style.top = '0';
    }
    
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
    
    // Add room elements to the scene
    addRoomElementsToScene();
    
    // Clear previous drop zones
    dropZones.innerHTML = '';
    
    // Create drop zones for all instructions
    const dropZoneColor = getDropZoneColor(currentSlide);
    slide.instructions.forEach((instruction, index) => {
      const dropZone = document.createElement('div');
      dropZone.className = 'drop-zone';
      dropZone.style.left = `${instruction.dropZone.x}%`;
      dropZone.style.top = `${instruction.dropZone.y}%`;
      dropZone.style.backgroundColor = dropZoneColor;
      dropZone.style.borderRadius = '50%';
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
    
    // Show all drop zones with slide-specific color
    const dropZoneColor = getDropZoneColor(currentSlide);
    const allDropZones = dropZones.querySelectorAll('.drop-zone');
    allDropZones.forEach((zone, index) => {
      // Reset drop zone to slide-specific color
      zone.style.border = '';
      zone.style.backgroundColor = dropZoneColor;
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
      patternImg.style.objectFit = 'cover';
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

  function addRoomElementsToScene() {
    // Clear previous room elements
    const existingRoomElements = spotDropContainer.querySelectorAll('.room-element');
    existingRoomElements.forEach(element => element.remove());
    
    if (currentSlide === 0) { // Slide 1 (Kitchen 1)
      // Add kitchen room elements to the scene
      const roomElements = [
        { 
          name: 'cupboard', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/room elements/cupboard_green.png', 
          x: 80, 
          y: 20,
          width: '20%',  
          height: '35%'  
        },
        { 
          name: 'fridge', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/room elements/fridge_gray_open.png', 
          x: 3, 
          y: 20,
          width: '27%',  
          height: '40%'
        },
        { 
          name: 'table', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/room elements/kitchen-table.png', 
          x: 43, 
          y: 47,
          width: '38%',  // 25% × 2
          height: '40%'  // 20% × 2
        },
        { 
          name: 'stove', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/room elements/stove.png', 
          x: 35, 
          y: 30,
          width: '15%', 
          height: '22%' 
        },
        { 
          name: 'chair', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/room elements/wooden-chair_1.png', 
          x: 30, 
          y: 50,
          width: '20%',  
          height: '30%'   
        },
        { 
          name: 'chair2', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/room elements/wooden-chair.png', 
          x: 75, 
          y: 50,
          width: '20%',  
          height: '30%'   
        },
        { 
          name: 'mat', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/room elements/yoga-mat_green.png', 
          x: 2, 
          y: 60,
          width: '30%',  
          height: '20%'  
        }
      ];
      
      roomElements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'room-element';
        elementDiv.style.position = 'absolute';
        elementDiv.style.left = `${element.x}%`;
        elementDiv.style.top = `${element.y}%`;
        elementDiv.style.width = element.width;
        elementDiv.style.height = element.height;
        
        // Set z-index: table on top layer, chairs above stove/cupboard
        if (element.name === 'table') {
          elementDiv.style.zIndex = '3';
        } else if (element.name === 'chair' || element.name === 'chair2') {
          elementDiv.style.zIndex = '2';
        } else if (element.name === 'stove' || element.name === 'cupboard') {
          elementDiv.style.zIndex = '1';
        } else {
          elementDiv.style.zIndex = '1';
        }
        
        const elementImg = document.createElement('img');
        elementImg.src = element.image;
        elementImg.alt = element.name;
        elementImg.style.width = '100%';
        elementImg.style.height = '100%';
        elementImg.style.objectFit = 'cover';
        
        elementDiv.appendChild(elementImg);
        spotDropContainer.appendChild(elementDiv);
        
        console.log(`Added room element: ${element.name} at ${element.x}%, ${element.y}%`);
      });
    } else if (currentSlide === 1) { // Slide 2 (Bedroom 1)
      // Add bedroom room elements to the scene
      const roomElements = [
        { 
          name: 'window', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/room elements/window-open.png', 
          x: 40, 
          y: 20,
          width: '25%',  
          height: '30%'  
        },
        { 
          name: 'box', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/room elements/box.png', 
          x: 75, 
          y: 43,
          width: '10%',  
          height: '13%'
        },
        { 
          name: 'desk', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/room elements/desk.png', 
          x: 60, 
          y: 45,
          width: '35%',  
          height: '40%'
        },
        { 
          name: 'bed', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/room elements/bed.png', 
          x: 0, 
          y: 45,
          width: '45%',  
          height: '35%'
        },
        { 
          name: 'mat', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/room elements/mat_blue.png', 
          x: 25, 
          y: 55,
          width: '50%',  
          height: '33%'  
        }
      ];
      
      roomElements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'room-element';
        elementDiv.style.position = 'absolute';
        elementDiv.style.left = `${element.x}%`;
        elementDiv.style.top = `${element.y}%`;
        elementDiv.style.width = element.width;
        elementDiv.style.height = element.height;
        
        // Set z-index: mat on bottom layer, box above desk, bed on top
        if (element.name === 'mat') {
          elementDiv.style.zIndex = '1';
        } else if (element.name === 'desk') {
          elementDiv.style.zIndex = '2';
        } else if (element.name === 'box') {
          elementDiv.style.zIndex = '3';
        } else if (element.name === 'bed') {
          elementDiv.style.zIndex = '4';
        } else {
          elementDiv.style.zIndex = '3'; // window and other elements
        }
        
        const elementImg = document.createElement('img');
        elementImg.src = element.image;
        elementImg.alt = element.name;
        elementImg.style.width = '100%';
        elementImg.style.height = '100%';
        elementImg.style.objectFit = 'cover';
        
        elementDiv.appendChild(elementImg);
        spotDropContainer.appendChild(elementDiv);
        
        console.log(`Added room element: ${element.name} at ${element.x}%, ${element.y}%`);
      });
    } else if (currentSlide === 2) { // Slide 3 (Kitchen 2)
      // Add kitchen 2 room elements to the scene
      const roomElements = [
        { 
          name: 'cupboard', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/room elements/cupboard_brown.png', 
          x: 40, 
          y: 25,
          width: '18%',  
          height: '22%'  
        },
        { 
          name: 'fridge', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/room elements/fridge_blue_open.png', 
          x: 73, 
          y: 22,
          width: '25%',  
          height: '33%'
        },
        { 
          name: 'table', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/room elements/round-table.png', 
          x: 50, 
          y: 62,
          width: '30%',  
          height: '25%'
        },
        { 
          name: 'cooker', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/room elements/cooker.png', 
          x: 5, 
          y: 35,
          width: '20%',  
          height: '23%' 
        },
        { 
          name: 'chair', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/room elements/hitchen-chair_1.png', 
          x: 40, 
          y: 55,
          width: '18%',  
          height: '27%'   
        },
        { 
          name: 'chair2', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/room elements/hitchen-chair.png', 
          x: 70, 
          y: 55,
          width: '18%',  
          height: '27%'   
        },
        { 
          name: 'mat', 
          image: '../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/room elements/mat_light-pink.png', 
          x: 9, 
          y: 60,
          width: '33%',  
          height: '22%'  
        }
      ];
      
      roomElements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'room-element';
        elementDiv.style.position = 'absolute';
        elementDiv.style.left = `${element.x}%`;
        elementDiv.style.top = `${element.y}%`;
        elementDiv.style.width = element.width;
        elementDiv.style.height = element.height;
        
        // Set z-index: table on top layer, chairs above cooker/cupboard
        if (element.name === 'table') {
          elementDiv.style.zIndex = '3';
        } else if (element.name === 'chair' || element.name === 'chair2') {
          elementDiv.style.zIndex = '2';
        } else if (element.name === 'cooker' || element.name === 'cupboard') {
          elementDiv.style.zIndex = '1';
        } else {
          elementDiv.style.zIndex = '1';
        }
        
        const elementImg = document.createElement('img');
        elementImg.src = element.image;
        elementImg.alt = element.name;
        elementImg.style.width = '100%';
        elementImg.style.height = '100%';
        elementImg.style.objectFit = 'cover';
        
        elementDiv.appendChild(elementImg);
        spotDropContainer.appendChild(elementDiv);
        
        console.log(`Added room element: ${element.name} at ${element.x}%, ${element.y}%`);
      });
    } else if (currentSlide === 3) { // Slide 4 (Bedroom 2)
      // Add bedroom 2 room elements to the scene
      const roomElements = [
        { 
          name: 'window', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/room elements/cartoon-window.png', 
          x: 40, 
          y: 23,
          width: '25%',  
          height: '28%'  
        },
        { 
          name: 'box', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/room elements/box.png', 
          x: 53, 
          y: 60,
          width: '12%',  
          height: '15%'
        },
        { 
          name: 'desk', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/room elements/desk-wood_3.png', 
          x: 70, 
          y: 30,
          width: '25%',  
          height: '32%'
        },
        { 
          name: 'bed', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/room elements/bed_pink.png', 
          x: 2, 
          y: 43,
          width: '40%',  
          height: '38%'
        },
        { 
          name: 'mat', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/room elements/mat_pink_purple.png', 
          x: 65, 
          y: 60,
          width: '30%',  
          height: '20%'  
        }
      ];
      
      roomElements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'room-element';
        elementDiv.style.position = 'absolute';
        elementDiv.style.left = `${element.x}%`;
        elementDiv.style.top = `${element.y}%`;
        elementDiv.style.width = element.width;
        elementDiv.style.height = element.height;
        
        // Set z-index: bed on top layer, desk above box, mat on bottom
        if (element.name === 'mat') {
          elementDiv.style.zIndex = '1';
        } else if (element.name === 'desk') {
          elementDiv.style.zIndex = '2';
        } else if (element.name === 'box') {
          elementDiv.style.zIndex = '3';
        } else if (element.name === 'bed') {
          elementDiv.style.zIndex = '4';
        } else {
          elementDiv.style.zIndex = '2'; // window and other elements
        }
        
        const elementImg = document.createElement('img');
        elementImg.src = element.image;
        elementImg.alt = element.name;
        elementImg.style.width = '100%';
        elementImg.style.height = '100%';
        elementImg.style.objectFit = 'cover';
        
        elementDiv.appendChild(elementImg);
        spotDropContainer.appendChild(elementDiv);
        
        console.log(`Added room element: ${element.name} at ${element.x}%, ${element.y}%`);
      });
    } else if (currentSlide === 4) { // Slide 5 (Bedroom 3)
      // Add bedroom 3 room elements to the scene
      const roomElements = [
        { 
          name: 'window', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/room elements/window_blue-sky.png', 
          x: 40, 
          y: 20,
          width: '25%',  
          height: '30%'  
        },
        { 
          name: 'box', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/room elements/box.png', 
          x: 11, 
          y: 68,
          width: '15%',  
          height: '17%'
        },
        { 
          name: 'desk', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/room elements/computer-desk.png', 
          x: 5, 
          y: 30,
          width: '30%',  
          height: '35%'
        },
        { 
          name: 'bed', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/room elements/bed_yellow.png', 
          x: 60, 
          y: 50,
          width: '35%',  
          height: '30%'
        },
        { 
          name: 'mat', 
          image: '../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/room elements/mat_pink.png', 
          x: 30, 
          y: 60,
          width: '30%',  
          height: '23%'  
        }
      ];
      
      roomElements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'room-element';
        elementDiv.style.position = 'absolute';
        elementDiv.style.left = `${element.x}%`;
        elementDiv.style.top = `${element.y}%`;
        elementDiv.style.width = element.width;
        elementDiv.style.height = element.height;
        
        // Set z-index: bed on top layer, desk above box, mat on bottom
        if (element.name === 'mat') {
          elementDiv.style.zIndex = '1';
        } else if (element.name === 'desk') {
          elementDiv.style.zIndex = '2';
        } else if (element.name === 'box') {
          elementDiv.style.zIndex = '3';
        } else if (element.name === 'bed') {
          elementDiv.style.zIndex = '4';
        } else {
          elementDiv.style.zIndex = '2'; // window and other elements
        }
        
        const elementImg = document.createElement('img');
        elementImg.src = element.image;
        elementImg.alt = element.name;
        elementImg.style.width = '100%';
        elementImg.style.height = '100%';
        elementImg.style.objectFit = 'cover';
        
        elementDiv.appendChild(elementImg);
        spotDropContainer.appendChild(elementDiv);
        
        console.log(`Added room element: ${element.name} at ${element.x}%, ${element.y}%`);
      });
    }
    // Add room elements for other slides as needed
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
    currentSlide = 4; // Start with slide 5 (Bedroom 3) for testing
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

