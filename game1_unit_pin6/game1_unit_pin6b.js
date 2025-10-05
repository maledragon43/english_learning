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
    
    console.log(`Setting background image:`, slide.background);
    
    // Debug background image loading
    backgroundImage.onload = function() {
      console.log(`✅ Background image loaded successfully:`, slide.background);
      backgroundImage.style.border = '3px solid green'; // Green border when loaded
    };
    backgroundImage.onerror = function() {
      console.error(`❌ Failed to load background image:`, slide.background);
      backgroundImage.style.border = '3px solid red'; // Red border when failed
      backgroundImage.style.backgroundColor = 'yellow'; // Yellow background when failed
    };
    
    // Create 4 animals in the red rectangle area
    createAnimalsForTurn();
    
    // Add farm animals to the scene if they're not in the background
    addFarmAnimalsToScene();
    
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

  function addFarmAnimalsToScene() {
    // Clear previous scene animals
    const existingSceneAnimals = spotDropContainer.querySelectorAll('.scene-animal');
    existingSceneAnimals.forEach(animal => animal.remove());
    
    if (currentSlide === 0) { // Slide 1 (Farm Animals)
      // Add farm animals to the scene
      const farmAnimals = [
        { name: 'tractor', image: '../assets/images/Spot and Drop/slide 1/mouse in the tractor.png', x: 25, y: 60 },
        { name: 'cow', image: '../assets/images/Spot and Drop/slide 1/mouse on the cow.png', x: 50, y: 50 },
        { name: 'horse', image: '../assets/images/Spot and Drop/slide 1/mouse under the horse.png', x: 70, y: 40 },
        { name: 'duck', image: '../assets/images/Spot and Drop/slide 1/mouse next to the duck.png', x: 80, y: 70 }
      ];
      
      farmAnimals.forEach(animal => {
        const animalDiv = document.createElement('div');
        animalDiv.className = 'scene-animal';
        animalDiv.style.position = 'absolute';
        animalDiv.style.left = `${animal.x}%`;
        animalDiv.style.top = `${animal.y}%`;
        animalDiv.style.width = '240px';
        animalDiv.style.height = '240px';
        animalDiv.style.zIndex = '2';
        
        const animalImg = document.createElement('img');
        animalImg.src = animal.image;
        animalImg.alt = animal.name;
        animalImg.style.width = '100%';
        animalImg.style.height = '100%';
        animalImg.style.objectFit = 'contain';
        
        animalDiv.appendChild(animalImg);
        spotDropContainer.appendChild(animalDiv);
        
        console.log(`Added farm animal: ${animal.name} at ${animal.x}%, ${animal.y}%`);
      });
    } else if (currentSlide === 1) { // Slide 2 (Wild Animals)
      // Add wild animals to the scene
      const wildAnimals = [
        { name: 'lion', image: '../assets/images/Spot and Drop/slide 2/bird-in-the-lion-mouth.png', x: 20, y: 50 },
        { name: 'bear', image: '../assets/images/Spot and Drop/slide 2/bird on the bear.png', x: 50, y: 60 },
        { name: 'giraffe', image: '../assets/images/Spot and Drop/slide 2/bird next to the monkey.png', x: 70, y: 30 },
        { name: 'monkey', image: '../assets/images/Spot and Drop/slide 2/bird under the giraffe.png', x: 80, y: 40 }
      ];
      
      wildAnimals.forEach(animal => {
        const animalDiv = document.createElement('div');
        animalDiv.className = 'scene-animal';
        animalDiv.style.position = 'absolute';
        animalDiv.style.left = `${animal.x}%`;
        animalDiv.style.top = `${animal.y}%`;
        animalDiv.style.width = '240px';
        animalDiv.style.height = '240px';
        animalDiv.style.zIndex = '2';
        
        const animalImg = document.createElement('img');
        animalImg.src = animal.image;
        animalImg.alt = animal.name;
        animalImg.style.width = '100%';
        animalImg.style.height = '100%';
        animalImg.style.objectFit = 'contain';
        
        animalDiv.appendChild(animalImg);
        spotDropContainer.appendChild(animalDiv);
        
        console.log(`Added wild animal: ${animal.name} at ${animal.x}%, ${animal.y}%`);
      });
    } else if (currentSlide === 2) { // Slide 3 (Wild Animals)
      // Add wild animals to the scene using slide 3 images
      const wildAnimals = [
        { name: 'box', image: '../assets/images/Spot and Drop/slide 3/bird in the box.png', x: 20, y: 50 },
        { name: 'tiger', image: '../assets/images/Spot and Drop/slide 3/bird under the tiger.png', x: 50, y: 60 },
        { name: 'elephant', image: '../assets/images/Spot and Drop/slide 3/bird on the elephant.png', x: 70, y: 30 },
        { name: 'crocodile', image: '../assets/images/Spot and Drop/slide 3/bird next to the crocodile.png', x: 80, y: 40 }
      ];
      
      wildAnimals.forEach(animal => {
        const animalDiv = document.createElement('div');
        animalDiv.className = 'scene-animal';
        animalDiv.style.position = 'absolute';
        animalDiv.style.left = `${animal.x}%`;
        animalDiv.style.top = `${animal.y}%`;
        animalDiv.style.width = '240px';
        animalDiv.style.height = '240px';
        animalDiv.style.zIndex = '2';
        
        const animalImg = document.createElement('img');
        animalImg.src = animal.image;
        animalImg.alt = animal.name;
        animalImg.style.width = '100%';
        animalImg.style.height = '100%';
        animalImg.style.objectFit = 'contain';
        
        animalDiv.appendChild(animalImg);
        spotDropContainer.appendChild(animalDiv);
        
        console.log(`Added wild animal: ${animal.name} at ${animal.x}%, ${animal.y}%`);
      });
    } else if (currentSlide === 3) { // Slide 4 (Sea Animals)
      // Add sea animals to the scene using slide 4 images
      const seaAnimals = [
        { name: 'seahorse', image: '../assets/images/Spot and Drop/slide 4/starfish next to the seahorse.png', x: 20, y: 50 },
        { name: 'jellyfish', image: '../assets/images/Spot and Drop/slide 4/starfish on the jellyfish.png', x: 50, y: 40 },
        { name: 'turtle', image: '../assets/images/Spot and Drop/slide 4/starfish under the turtle.png', x: 70, y: 60 },
        { name: 'shark', image: '../assets/images/Spot and Drop/slide 4/starfish in the shark mouth.png', x: 80, y: 30 }
      ];
      
      seaAnimals.forEach(animal => {
        const animalDiv = document.createElement('div');
        animalDiv.className = 'scene-animal';
        animalDiv.style.position = 'absolute';
        animalDiv.style.left = `${animal.x}%`;
        animalDiv.style.top = `${animal.y}%`;
        animalDiv.style.width = '240px';
        animalDiv.style.height = '240px';
        animalDiv.style.zIndex = '2';
        
        const animalImg = document.createElement('img');
        animalImg.src = animal.image;
        animalImg.alt = animal.name;
        animalImg.style.width = '100%';
        animalImg.style.height = '100%';
        animalImg.style.objectFit = 'contain';
        
        animalDiv.appendChild(animalImg);
        spotDropContainer.appendChild(animalDiv);
        
        console.log(`Added sea animal: ${animal.name} at ${animal.x}%, ${animal.y}%`);
      });
    } else if (currentSlide === 4) { // Slide 5 (Sea Animals)
      // Add sea animals to the scene using slide 5 images
      const seaAnimals = [
        { name: 'dolphin', image: '../assets/images/Spot and Drop/slide 5/starfish under the dolphin.png', x: 20, y: 50 },
        { name: 'seashells', image: '../assets/images/Spot and Drop/slide 5/starfish on the seashells.png', x: 50, y: 40 },
        { name: 'crab', image: '../assets/images/Spot and Drop/slide 5/starfish in the crab mouth.png', x: 70, y: 60 },
        { name: 'penguin', image: '../assets/images/Spot and Drop/slide 5/starfish next to the penguin.png', x: 80, y: 30 }
      ];
      
      seaAnimals.forEach(animal => {
        const animalDiv = document.createElement('div');
        animalDiv.className = 'scene-animal';
        animalDiv.style.position = 'absolute';
        animalDiv.style.left = `${animal.x}%`;
        animalDiv.style.top = `${animal.y}%`;
        animalDiv.style.width = '240px';
        animalDiv.style.height = '240px';
        animalDiv.style.zIndex = '2';
        
        const animalImg = document.createElement('img');
        animalImg.src = animal.image;
        animalImg.alt = animal.name;
        animalImg.style.width = '100%';
        animalImg.style.height = '100%';
        animalImg.style.objectFit = 'contain';
        
        animalDiv.appendChild(animalImg);
        spotDropContainer.appendChild(animalDiv);
        
        console.log(`Added sea animal: ${animal.name} at ${animal.x}%, ${animal.y}%`);
      });
    }
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
      animalDiv.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Yellow background to see the container
      
      const animalImg = document.createElement('img');
      animalImg.src = slide.animalImage;
      animalImg.alt = slide.animal;
      animalImg.style.width = '100%';
      animalImg.style.height = '100%';
      animalImg.style.objectFit = 'contain';
      animalImg.style.display = 'block';
      animalImg.style.border = '2px solid blue'; // Debug border for image
      
      console.log(`Creating image for pattern ${i} with src:`, slide.animalImage);
      
      // Ensure image loads
      animalImg.onload = function() {
        console.log(`✅ Image loaded successfully for pattern ${i}:`, slide.animalImage);
        animalImg.style.border = '2px solid green'; // Green border when loaded
      };
      animalImg.onerror = function() {
        console.error(`❌ Failed to load image for pattern ${i}:`, slide.animalImage);
        animalImg.style.border = '2px solid red'; // Red border when failed
        animalImg.style.backgroundColor = 'yellow'; // Yellow background when failed
        
        // Try alternative image path
        const altPath = slide.animalImage.replace('../assets/images/Spot and Drop/', '../assets/images/Spot and Drop/slide 1/');
        console.log(`Trying alternative path:`, altPath);
        animalImg.src = altPath;
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
