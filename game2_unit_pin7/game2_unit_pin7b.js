(function(){
  const { COLORS, GAME_SLIDES, post, autoResize, tts, updateCharacterState } = window.g2u7;
  
  const coloringArea = document.getElementById('coloringArea');
  const colorPalette = document.getElementById('colorPalette');
  const banner = document.getElementById('statusBanner');
  const sceneBackground = document.getElementById('sceneBackground');
  
  let currentSlide = 0;
  let currentInstruction = 0;
  let selectedColor = null;
  let currentObjects = [];
  
  // Predefined positions for objects in each slide (percentage-based)
  const objectPositions = {
    // Slide 1: Kitchen 1 - Spoons
    0: {
      'on-table': { left: 31, top: 63, rotation: 92 },
      'in-cupboard': { left: 71, top: 27, rotation: 90 },
      'next-to-clock': { left: 37, top: 21, rotation: 0 },
      'on-mat': { left: 59, top: 75, rotation: 90 },
      'under-table': { left: 34, top: 81, rotation: 86 },
      'in-box': { left: 10, top: 61, rotation: 0 },
      'on-cooker': { left: 70, top: 56, rotation: 106 },
      'in-fridge': { left: 9, top: 32, rotation: 93}
    },
    // Slide 2: Bedroom 1 - Cats
    1: {
      'under-window': { left: 42, top: 25 },
      'next-to-lamp': { left: 75, top: 45 },
      'on-bed': { left: 5, top: 50 },
      'under-desk': { left: 62, top: 60 },
      'in-box': { left: 78, top: 45 },
      'next-to-window': { left: 45, top: 20 },
      'under-bed': { left: 10, top: 70 },
      'on-mat': { left: 28, top: 58 }
    },
    // Slide 3: Kitchen 2 - Glasses
    2: {
      'on-mat': { left: 12, top: 63 },
      'in-fridge': { left: 75, top: 25 },
      'on-chair': { left: 42, top: 58 },
      'on-cooker': { left: 7, top: 38 },
      'under-chair': { left: 45, top: 70 },
      'next-to-cat': { left: 15, top: 50 },
      'in-cupboard': { left: 42, top: 28 },
      'on-table': { left: 52, top: 65 }
    },
    // Slide 4: Bedroom 2 - Lamps
    3: {
      'under-painting': { left: 42, top: 15 },
      'on-mat': { left: 67, top: 63 },
      'next-to-window': { left: 45, top: 25 },
      'under-desk': { left: 72, top: 55 },
      'on-bed': { left: 5, top: 48 },
      'in-box': { left: 55, top: 63 },
      'on-desk': { left: 72, top: 33 },
      'under-bed': { left: 10, top: 70 }
    },
    // Slide 5: Bedroom 3 - Bears
    4: {
      'under-bed': { left: 65, top: 70 },
      'next-to-lamp': { left: 8, top: 35 },
      'in-box': { left: 13, top: 70 },
      'next-to-bed': { left: 62, top: 55 },
      'under-desk': { left: 8, top: 50 },
      'on-mat': { left: 32, top: 63 },
      'under-window': { left: 42, top: 25 },
      'on-bed': { left: 62, top: 52 }
    }
  };
  
  function getObjectImagePath(slideIndex, objectType, color, position) {
    const slide = GAME_SLIDES[slideIndex];
    const slideFolder = slide.slideName.toLowerCase().replace(' ', '');
    const slideNumber = slideIndex + 1;
    
    if (color) {
      // Return colored version
      return `../assets/images/Game 2 - Colour it Right 2/slide ${slideNumber}/${slide.objectType}_${color}.png`;
    } else {
      // Return default/white version - need to determine based on position
      // For now, return white version
      return `../assets/images/Game 2 - Colour it Right 2/slide ${slideNumber}/${slide.objectType}_white.png`;
    }
  }
  
  function getDefaultObjectImage(slideIndex, position, instructionIndex) {
    const slide = GAME_SLIDES[slideIndex];
    const slideNumber = slideIndex + 1;
    
    // For cats, there are multiple white versions (cat_white_1.png, cat_white_2.png, etc.)
    // Use a simple rotation based on instruction index
    if (slide.objectType === 'cat') {
      const catIndex = (instructionIndex % 4) + 1;
      return `../assets/images/Game 2 - Colour it Right 2/slide ${slideNumber}/${slide.objectType}_white_${catIndex}.png`;
    }
    
    // For other objects, use white version
    return `../assets/images/Game 2 - Colour it Right 2/slide ${slideNumber}/${slide.objectType}_white.png`;
  }
  
  function createObjectElement(slideIndex, objectType, position, instruction, instructionIndex) {
    const objectDiv = document.createElement('div');
    objectDiv.className = 'object-to-color';
    objectDiv.setAttribute('data-object', objectType);
    objectDiv.setAttribute('data-position', position);
    objectDiv.setAttribute('data-slide', slideIndex);
    objectDiv.setAttribute('data-instruction-index', instructionIndex);
    
    // Store rotation for hover effect
    const positions = objectPositions[slideIndex];
    let rotation = 0;
    if (positions && positions[position] && positions[position].rotation !== undefined) {
      rotation = positions[position].rotation;
      objectDiv.setAttribute('data-rotation', rotation);
    }
    
    const img = document.createElement('img');
    // Start with white/default version
    img.src = getDefaultObjectImage(slideIndex, position, instructionIndex);
    img.alt = `${objectType} at ${position}`;
    img.onerror = function() {
      // If white version doesn't exist, try to find any default version
      const slide = GAME_SLIDES[slideIndex];
      const slideNumber = slideIndex + 1;
      // Try without color suffix
      img.src = `../assets/images/Game 2 - Colour it Right 2/slide ${slideNumber}/${slide.objectType}.png`;
    };
    objectDiv.appendChild(img);
    
    // Add hover effect that preserves rotation
    objectDiv.addEventListener('mouseenter', function() {
      const rot = this.getAttribute('data-rotation');
      if (rot) {
        this.style.transform = `rotate(${rot}deg) scale(1.05)`;
      } else {
        this.style.transform = 'scale(1.05)';
      }
    });
    objectDiv.addEventListener('mouseleave', function() {
      const rot = this.getAttribute('data-rotation');
      if (rot) {
        this.style.transform = `rotate(${rot}deg)`;
      } else {
        this.style.transform = '';
      }
    });
    
    objectDiv.addEventListener('click', () => onObjectClick(objectDiv, slideIndex, objectType, position, instruction));
    return objectDiv;
  }
  
  function onObjectClick(objectDiv, slideIndex, objectType, position, instruction) {
    if (!selectedColor) {
      updateCharacterState('thinking');
      tts('Please select a color first!');
      return;
    }
    
    const currentInstructionData = GAME_SLIDES[currentSlide].instructions[currentInstruction];
    
    // Check if this object matches the current instruction
    const instructionIndex = parseInt(objectDiv.getAttribute('data-instruction-index'));
    const isCorrectObject = (instructionIndex === currentInstruction);
    
    // Normalize color comparison (gray vs grey)
    let normalizedSelectedColor = selectedColor;
    let normalizedInstructionColor = currentInstructionData.color;
    if (normalizedSelectedColor === 'gray') normalizedSelectedColor = 'grey';
    if (normalizedInstructionColor === 'gray') normalizedInstructionColor = 'grey';
    
    const isCorrectColor = (normalizedSelectedColor === normalizedInstructionColor);
    
    if (isCorrectObject && isCorrectColor) {
      // Correct!
      updateCharacterState('correct');
      post({type: 'score:delta', value: 10});
      
      // Update the image to colored version
      const img = objectDiv.querySelector('img');
      const slide = GAME_SLIDES[slideIndex];
      const slideNumber = slideIndex + 1;
      // Use the image path from instruction (files use 'gray' not 'grey')
      img.src = `../assets/images/Game 2 - Colour it Right 2/slide ${slideNumber}/${instruction.imagePath}`;
      
      // Mark as completed
      objectDiv.classList.add('completed');
      objectDiv.style.pointerEvents = 'none';
      
      tts('Well done!');
      
      setTimeout(() => {
        currentInstruction++;
        if (currentInstruction >= GAME_SLIDES[currentSlide].instructions.length) {
          // Slide completed
          currentSlide++;
          if (currentSlide >= GAME_SLIDES.length) {
            // Game completed
            banner.textContent = 'WELL DONE! All objects colored!';
            tts('Well done! All objects colored!');
            setTimeout(() => {
              setup();
            }, 3000);
          } else {
            startNewSlide();
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
    const currentInstructionData = GAME_SLIDES[currentSlide].instructions[currentInstruction];
    banner.textContent = currentInstructionData.text;
    tts(currentInstructionData.text);
    updateCharacterState('thinking');
  }
  
  function addRoomElementsToScene() {
    // Clear previous room elements
    const existingRoomElements = coloringArea.querySelectorAll('.room-element');
    existingRoomElements.forEach(element => element.remove());
    
    if (currentSlide === 0) { // Slide 1 (Kitchen 1)
      // Add kitchen room elements to the scene
      const roomElements = [
        { 
          name: 'cupboard', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 1/cupboard_brown.png', 
          x: 68, 
          y: 12,
          width: '20%',  
          height: '41%',
          zIndex: 1
        },
        { 
          name: 'fridge', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 1/fridge_blue_open.png', 
          x: 7, 
          y: 15,
          width: '25%',  
          height: '50%',
          zIndex: 1
        },
        { 
          name: 'table', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 1/kitchen-table.png', 
          x: 23, 
          y: 64,
          width: '30%',  
          height: '33%',
          zIndex: 3
        },
        { 
          name: 'cooker', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 1/cooker.png', 
          x: 66, 
          y: 60,
          width: '17%', 
          height: '36%',
          zIndex: 2
        },
        { 
          name: 'chair', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 1/wooden-chair_1.png', 
          x: 5, 
          y: 56,
          width: '21%',  
          height: '41%',
          zIndex: 2
        },
        { 
          name: 'chair2', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 1/wooden-chair.png', 
          x: 45, 
          y: 50,
          width: '21%',  
          height: '41%',
          zIndex: 2
        },
        { 
          name: 'mat', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 1/mat_cream_blue.png', 
          x: 41, 
          y: 58,
          width: '46%',  
          height: '50%',
          zIndex: 1
        },
        { 
          name: 'clock', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 1/clock_orange.png', 
          x: 32, 
          y: 18,
          width: '8%',  
          height: '15%',
          zIndex: 2
        },
        { 
          name: 'window', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 1/window_white.png', 
          x: 44, 
          y: 17,
          width: '25%',  
          height: '36%',
          zIndex: 1
        },
        { 
          name: 'box', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 1/box.png', 
          x: 10, 
          y: 59,
          width: '10%',  
          height: '20%',
          zIndex: 2
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
        elementDiv.style.zIndex = element.zIndex || '1';
        
        const elementImg = document.createElement('img');
        elementImg.src = element.image;
        elementImg.alt = element.name;
        elementImg.style.width = '100%';
        elementImg.style.height = '100%';
        elementImg.style.objectFit = 'cover';
        
        elementDiv.appendChild(elementImg);
        coloringArea.appendChild(elementDiv);
      });
    }
  }
  
  function startNewSlide() {
    currentInstruction = 0;
    
    // Clear previous objects
    const objectsToRemove = coloringArea.querySelectorAll('.object-to-color');
    objectsToRemove.forEach(obj => obj.remove());
    currentObjects = [];
    
    // Load background image
    const slide = GAME_SLIDES[currentSlide];
    sceneBackground.src = slide.background;
    
    // Add room elements to the scene
    addRoomElementsToScene();
    
    // Create ALL objects for current slide
    slide.instructions.forEach((instruction, index) => {
      const objectElement = createObjectElement(
        currentSlide,
        slide.objectType,
        instruction.position,
        instruction,
        index
      );
      
      // Use predefined position for this object
      const positions = objectPositions[currentSlide];
      if (positions && positions[instruction.position]) {
        const position = positions[instruction.position];
        objectElement.style.left = position.left + '%';
        objectElement.style.top = position.top + '%';
        // Apply rotation if specified
        if (position.rotation !== undefined) {
          objectElement.style.transform = `rotate(${position.rotation}deg)`;
        }
      }
      
      coloringArea.appendChild(objectElement);
      currentObjects.push(objectElement);
    });
    
    startNewInstruction();
    autoResize();
  }
  
  function setup() {
    currentSlide = 0;
    currentInstruction = 0;
    selectedColor = null;
    
    // Clear color selection
    document.querySelectorAll('.color-selector').forEach(selector => {
      selector.classList.remove('selected');
    });
    
    updateCharacterState('thinking');
    startNewSlide();
  }
  
  // Color palette event listeners
  document.querySelectorAll('.color-selector').forEach(selector => {
    selector.addEventListener('click', () => {
      // Remove previous selection
      document.querySelectorAll('.color-selector').forEach(s => s.classList.remove('selected'));
      
      // Select new color
      selector.classList.add('selected');
      selectedColor = selector.getAttribute('data-color');
      
      // Normalize gray/grey - instructions use 'grey', HTML uses 'gray'
      // Keep as 'gray' for image paths, but compare with 'grey' from instructions
      
      tts(`Selected ${selectedColor} color`);
    });
  });
  
  setup();
})();

