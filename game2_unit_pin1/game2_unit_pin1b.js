(function(){
  const { COLORS, palette, tts, post, autoResize, updateCharacterState } = window.g2;
  const stage = document.getElementById('balloonStage');
  const banner = document.getElementById('currentWord');

  function shuffle(a){ return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]); }
  function pickFive(){ return shuffle(COLORS).slice(0,5); }

  let names = [];
  let target = '';
  let timer = null;
  let placedBalloons = [];

     function render(){
     stage.innerHTML='';
     placedBalloons = []; // Reset placed balloons for new round
     
     // Use relative positions based on dashboard size - 5 different positions
     const stageWidth = stage.offsetWidth;
     const stageHeight = stage.offsetHeight;
     
     const positions = [
       { x: stageWidth * 0.1, y: stageHeight * 0.1 },    // Top-left
       { x: stageWidth * 0.7, y: stageHeight * 0.15 },   // Top-right
       { x: stageWidth * 0.3, y: stageHeight * 0.5 },    // Middle-left
       { x: stageWidth * 0.8, y: stageHeight * 0.4 },    // Middle-right
       { x: stageWidth * 0.15, y: stageHeight * 0.8 }    // Bottom-left
     ];
     
     // Shuffle the positions array for initial generation
     const shuffledPositions = shuffle([...positions]);
     
     names.forEach((n, index)=>{
       const el = document.createElement('div');
       el.className = 'balloon';
       el.setAttribute('data-name', n);
       
       // Use shuffled positions for initial generation
       const pos = shuffledPositions[index] || shuffledPositions[0];
       
       el.style.left = pos.x + 'px';
       el.style.top = pos.y + 'px';
      
      // Set z-index to ensure correct balloon is on top
      if (n === target) {
        el.style.zIndex = '10';
      } else {
        el.style.zIndex = '1';
      }
     
     // Create balloon image
     const balloonImg = document.createElement('img');
     balloonImg.src = `../assets/images/balloons/${n}-balloon.png`;
     balloonImg.alt = n;
     balloonImg.className = 'balloon-image';
     el.appendChild(balloonImg);
     
            el._clickHandler = () => onPick(el, n);
      el.addEventListener('click', el._clickHandler);
      stage.appendChild(el);
      
             // Track placed balloon position with relative dimensions
       const balloonWidth = stageWidth * 0.25; // 25% of stage width
       const balloonHeight = balloonWidth; // Square aspect ratio
       placedBalloons.push({ x: pos.x, y: pos.y, width: balloonWidth, height: balloonHeight });
   });
 }

   function start(){
    names = pickFive();
    target = names[Math.floor(Math.random()*names.length)];
    banner.textContent = target;
    tts(target);
    render();
    progress.style.width = '100%';
    updateCharacterState('thinking');
    autoResize();
  }

 function schedule(){
   // This function is no longer needed for the relaxed game
   // Balloons don't disappear automatically
 }
 
              function shuffleBalloonPositions(){
     console.log('Shuffle function called!');
     // Get all visible balloons
     const visibleBalloons = Array.from(stage.querySelectorAll('.balloon')).filter(x=>x.style.opacity!=='0');
     console.log('Visible balloons:', visibleBalloons.length);
     if (visibleBalloons.length < 2) {
       console.log('Not enough balloons to shuffle');
       return; // Need at least 2 balloons to shuffle
     }
     
     // Clear placed balloons tracking
     placedBalloons = [];
     
     // Use relative positions based on dashboard size - 5 different positions
     const stageWidth = stage.offsetWidth;
     const stageHeight = stage.offsetHeight;
     
     const positions = [
       { x: stageWidth * 0.1, y: stageHeight * 0.1 },    // Top-left
       { x: stageWidth * 0.7, y: stageHeight * 0.15 },   // Top-right
       { x: stageWidth * 0.3, y: stageHeight * 0.5 },    // Middle-left
       { x: stageWidth * 0.8, y: stageHeight * 0.4 },    // Middle-right
       { x: stageWidth * 0.15, y: stageHeight * 0.8 }    // Bottom-left
     ];
     
     // Shuffle the positions array
     const shuffledPositions = shuffle([...positions]);
     
     // Reposition each balloon to a different fixed position
     visibleBalloons.forEach((el, index) => {
       const pos = shuffledPositions[index] || shuffledPositions[0];
       
       console.log(`Balloon ${index}: Moving to position (${pos.x}, ${pos.y})`);
       el.style.transition = 'left 0.8s ease, top 0.8s ease';
       el.style.left = pos.x + 'px';
       el.style.top = pos.y + 'px';
       
       // Track placed balloon position with relative dimensions
       const balloonWidth = stageWidth * 0.25; // 25% of stage width
       const balloonHeight = balloonWidth; // Square aspect ratio
       placedBalloons.push({ x: pos.x, y: pos.y, width: balloonWidth, height: balloonHeight });
     });
     
     // Reset transition after animation and ensure correct z-index
     setTimeout(() => {
       visibleBalloons.forEach(el => {
         el.style.transition = 'opacity 0.3s ease';
         // Ensure target balloon stays on top after shuffling
         const balloonColor = el.getAttribute('data-name');
         if (balloonColor === target) {
           el.style.zIndex = '10';
         } else {
           el.style.zIndex = '1';
         }
       });
     }, 800);
 }

        function onPick(el, n){
    if (el.style.opacity==='0') return;
    if (n===target){
      updateCharacterState('correct');
      post({type:'score:delta', value:10});
      
      // Change balloon to burst image
      const balloonImg = el.querySelector('.balloon-image');
      if (balloonImg) {
        balloonImg.src = `../assets/images/balloons/${n}-balloon_1.png`;
      }
      
      // Hide the balloon after showing burst effect
      setTimeout(() => {
        el.style.opacity='0'; 
        el.style.pointerEvents='none';
      }, 500);
      
              // Replace the burst balloon with a new one
       setTimeout(() => {
         // Get all current visible balloon colors
         const visibleBalloons = Array.from(stage.querySelectorAll('.balloon')).filter(x=>x.style.opacity!=='0');
         const currentColors = visibleBalloons.map(x=>x.getAttribute('data-name'));
         
         // Get a new color that's different from all existing colors
         let newColor;
         do {
           newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
         } while (currentColors.includes(newColor));
         
                    // Update the balloon with new color
          el.setAttribute('data-name', newColor);
          balloonImg.src = `../assets/images/balloons/${newColor}-balloon.png`;
          el.style.opacity = '1';
          el.style.pointerEvents = 'auto';
          

          
          // Remove old click listener and add new one with the new color
          el.removeEventListener('click', el._clickHandler);
          el._clickHandler = () => onPick(el, newColor);
          el.addEventListener('click', el._clickHandler);
         
                    // Select new target from all visible balloons (including the new one)
          const allVisibleBalloons = Array.from(stage.querySelectorAll('.balloon')).filter(x=>x.style.opacity!=='0');
          const allVisibleColors = allVisibleBalloons.map(x=>x.getAttribute('data-name'));
          target = allVisibleColors[Math.floor(Math.random()*allVisibleColors.length)];
          banner.textContent = target; 
          tts(target);
          updateCharacterState('thinking');
          
          // Update z-index to ensure new target is on top
          allVisibleBalloons.forEach(balloon => {
            const balloonColor = balloon.getAttribute('data-name');
            if (balloonColor === target) {
              balloon.style.zIndex = '10';
            } else {
              balloon.style.zIndex = '1';
            }
          });
          
                                // Shuffle ALL balloon positions when problem changes (including the new one)
            setTimeout(() => {
              console.log('About to shuffle balloon positions');
              shuffleBalloonPositions();
            }, 100);
       }, 600);
      
    } else {
      updateCharacterState('wrong');
      post({type:'score:delta', value:-5});
      setTimeout(() => updateCharacterState('thinking'), 1000);
    }
  }

  start();
})();


