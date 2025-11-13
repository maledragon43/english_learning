(function(){
  const { COLORS, GAME_SLIDES, post, autoResize, tts, updateCharacterState } = window.g2u7;
  
  const coloringArea = document.getElementById('coloringArea');
  const colorPalette = document.getElementById('colorPalette');
  const banner = document.getElementById('statusBanner');
  const sceneBackground = document.getElementById('sceneBackground');
  
  let currentSlide = 3; // Start with slide 4 (Bedroom 2) for testing
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
      'under-window': { left: 57, top: 45 },
      'next-to-lamp': { left: 77, top: 55 },
      'on-bed': { left: 19, top: 33 },
      'under-desk': { left: 69, top: 79 },
      'in-box': { left: 40, top: 66 },
      'next-to-window': { left: 72, top: 20 },
      'under-bed': { left: 10, top: 59 },
      'on-mat': { left: 28, top: 72 }
    },
    // Slide 3: Kitchen 2 - Glasses
    2: {
      'on-mat': { left: 12, top: 58 },
      'in-fridge': { left: 70, top: 31 },
      'on-chair': { left: 34, top: 62 },
      'on-cooker': { left: 75, top: 57 },
      'under-chair': { left: 61, top: 78 },
      'next-to-cat': { left: 45, top: 40 },
      'in-cupboard': { left: 12, top: 29 },
      'on-table': { left: 43, top: 60 }
    },
    // Slide 4: Bedroom 2 - Lamps
    3: {
      'under-painting': { left: 78, top: 30 },
      'on-mat': { left: 10, top: 69 },
      'next-to-window': { left: 33, top: 25 },
      'under-desk': { left: 71, top: 80 },
      'on-bed': { left: 47, top: 32 },
      'in-box': { left: 21, top: 47 },
      'on-desk': { left: 74, top: 56 },
      'under-bed': { left: 43, top: 70, rotation: 90 }
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
    
    // Special case: in-box uses white-lamp-in-the-box.png for slide 4
    if (position === 'in-box' && slide.objectType === 'lamp' && slideIndex === 3) {
      return `../assets/images/Game 2 - Colour it Right 2/slide ${slideNumber}/white-lamp-in-the-box.png`;
    }
    
    // For cats, there are multiple white versions (cat_white_1.png, cat_white_2.png, etc.)
    // Special case: in-box uses white-cat-in-the-box.png
    if (slide.objectType === 'cat') {
      // Special handling for cat in box
      if (position === 'in-box') {
        return `../assets/images/Game 2 - Colour it Right 2/slide ${slideNumber}/white-cat-in-the-box.png`;
      }
      
      // Map positions to specific white cat images
      const catImageMap = {
        'under-window': 1,  // cat_white_1.png - "COLOUR THE CAT UNDER THE WINDOW GREY!"
        'next-to-lamp': 2,  // cat_white_2.png - "COLOUR THE CAT NEXT TO THE LAMP ORANGE!"
        'on-bed': 1,        // cat_white_1.png - "COLOUR THE CAT ON THE BED YELLOW!"
        'under-desk': 4,    // cat_white_4.png - "COLOUR THE CAT UNDER THE DESK BLUE!"
        'next-to-window': 3, // cat_white_3.png - "COLOUR THE CAT NEXT TO THE WINDOW PINK!"
        'under-bed': 4,     // cat_white_4.png - "COLOUR THE CAT UNDER THE BED GREEN!"
        'on-mat': 1         // cat_white_1.png - "COLOUR THE CAT ON THE MAT BLACK!"
      };
      
      const catIndex = catImageMap[position] || ((instructionIndex % 4) + 1);
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
      
      // Special handling for cat in box - use red-cat-in-the-box.png
      if (position === 'in-box' && slide.objectType === 'cat' && currentInstructionData.color === 'red') {
        img.src = `../assets/images/Game 2 - Colour it Right 2/slide ${slideNumber}/red-cat-in-the-box.png`;
      } else if (position === 'in-box' && slide.objectType === 'lamp' && slideIndex === 3 && currentInstructionData.color === 'green') {
        // Special handling for lamp in box - use green-lamp-in-the-box.png
        img.src = `../assets/images/Game 2 - Colour it Right 2/slide ${slideNumber}/green-lamp-in-the-box.png`;
      } else {
        // Use the image path from instruction (files use 'gray' not 'grey')
        img.src = `../assets/images/Game 2 - Colour it Right 2/slide ${slideNumber}/${instruction.imagePath}`;
      }
      
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
    } else if (currentSlide === 1) { // Slide 2 (Bedroom 1)
      // Add bedroom room elements to the scene
      const roomElements = [
        { 
          name: 'bed', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 2/bed_brown.png', 
          x: 10, 
          y: 32,
          width: '29%',  
          height: '43%',
          zIndex: 4
        },
        { 
          name: 'desk', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 2/desk_wood.png', 
          x: 63, 
          y: 67,
          width: '27%',  
          height: '29%',
          zIndex: 2
        },
        { 
          name: 'lamp', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 2/lamp_purple.png', 
          x: 67, 
          y: 50,
          width: '10%',  
          height: '20%',
          zIndex: 3
        },
        { 
          name: 'mat', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 2/mat_green.png', 
          x: 11, 
          y: 79,
          width: '38%',  
          height: '14%',
          zIndex: 1
        },
        { 
          name: 'painting', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 2/painting_1.png', 
          x: 13, 
          y: 12,
          width: '10%',  
          height: '20%',
          zIndex: 2
        },
        { 
          name: 'window', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 2/window_brown.png', 
          x: 55, 
          y: 14,
          width: '15%',  
          height: '29%',
          zIndex: 2
        },
        { 
          name: 'clock', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 2/clock_red.png', 
          x: 35, 
          y: 18,
          width: '8%',  
          height: '16%',
          zIndex: 3
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
    } else if (currentSlide === 2) { // Slide 3 (Kitchen 2)
      // Add kitchen 2 room elements to the scene
      const roomElements = [
        { 
          name: 'wardrobe', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 3/wardrobe.png', 
          x: 8, 
          y: 14,
          width: '21%',  
          height: '41%',
          zIndex: 2
        },
        { 
          name: 'fridge', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 3/fridge_red_open.png', 
          x: 69, 
          y: 19,
          width: '21%',  
          height: '34%',
          zIndex: 1
        },
        { 
          name: 'table', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 3/round-table.png', 
          x: 40, 
          y: 62,
          width: '23%',  
          height: '30%',
          zIndex: 3
        },
        { 
          name: 'cooker', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 3/stove_green.png', 
          x: 72, 
          y: 63,
          width: '15%', 
          height: '26%',
          zIndex: 1
        },
        { 
          name: 'chair', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 3/hitchen-chair_1.png', 
          x: 31, 
          y: 55,
          width: '15%',  
          height: '30%',
          zIndex: 2
        },
        { 
          name: 'chair2', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 3/hitchen-chair.png', 
          x: 56, 
          y: 56,
          width: '15%',  
          height: '30%',
          zIndex: 2
        },
        { 
          name: 'mat', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 3/mat_light-pink.png', 
          x: 12, 
          y: 44,
          width: '21%',  
          height: '41%',
          zIndex: 1
        },
        { 
          name: 'cat', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 3/cat.png', 
          x: 51, 
          y: 30,
          width: '11%',  
          height: '20%',
          zIndex: 2
        },
        { 
          name: 'window', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 3/window-open.png', 
          x: 39, 
          y: 12,
          width: '26%',  
          height: '38%',
          zIndex: 1
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
    } else if (currentSlide === 3) { // Slide 4 (Bedroom 2)
      // Add bedroom 2 room elements to the scene
      const roomElements = [
        { 
          name: 'bed', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 4/bed_red.png', 
          x: 40, 
          y: 27,
          width: '25%',  
          height: '50%',
          zIndex: 4
        },
        { 
          name: 'desk', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 4/desk_white.png', 
          x: 64, 
          y: 60,
          width: '25%',  
          height: '38%',
          zIndex: 2
        },
        { 
          name: 'mat', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 4/mat_pink.png', 
          x: 9, 
          y: 70,
          width: '30%',  
          height: '25%',
          zIndex: 1
        },
        { 
          name: 'painting', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 4/painting_5.png', 
          x: 78, 
          y: 12,
          width: '9%',  
          height: '16%',
          zIndex: 3
        },
        { 
          name: 'window', 
          image: '../assets/images/Game 2 - Colour it Right 2/slide 4/window_pink.png', 
          x: 10, 
          y: 15,
          width: '24%',  
          height: '30%',
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
    
    // Remove slide-specific classes
    coloringArea.classList.remove('slide-1', 'slide-2', 'slide-3', 'slide-4', 'slide-5');
    
    // Load background image
    const slide = GAME_SLIDES[currentSlide];
    sceneBackground.src = slide.background;
    
    // Add slide-specific class for CSS targeting
    coloringArea.classList.add(`slide-${currentSlide + 1}`);
    
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
      
      // Special styling for slide 2: make 12th child (index 11) larger
      if (currentSlide === 1 && index === 11) {
        objectElement.style.width = '17.5%';
        objectElement.style.height = '22.5%';
      }
      
      coloringArea.appendChild(objectElement);
      currentObjects.push(objectElement);
    });
    
    // Special styling for slide 4 is handled via CSS class on coloringArea
    
    startNewInstruction();
    autoResize();
  }
  
  function setup() {
    currentSlide = 3; // Start with slide 4 (Bedroom 2) for testing
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

