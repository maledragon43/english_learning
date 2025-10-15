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
  let activeBalloons = [];
  let balloonSpawnTimer = null;
  let gameRunning = true;
  let currentTurn = 0;
  let maxTurns = 10; // Total number of turns
  let targetChangeTimer = null;

  function render(){
    stage.innerHTML='';
    activeBalloons = []; // Reset active balloons for new round
    clearInterval(balloonSpawnTimer);
    
    // Start continuous balloon spawning
    startBalloonSpawning();
  }

  function startBalloonSpawning() {
    // Spawn a new balloon every 2.5 seconds for consistent flow
    balloonSpawnTimer = setInterval(() => {
      if (gameRunning) {
        spawnBalloon();
      }
    }, 2500);
  }

  function spawnBalloon() {
    const stageWidth = stage.offsetWidth;
    const stageHeight = stage.offsetHeight;
    
    // Keep balloons away from edges - account for the -3vw left shift
    // Move balloons 10% of dashboard width to the left
    const margin = stageWidth * 0.3; // 30% margin on each side
    const spawnWidth = stageWidth - (margin * 2);
    const leftOffset = stageWidth * 0.2; // 10% left offset
    const x = margin + Math.random() * spawnWidth - leftOffset;
    const y = stageHeight; // Start at bottom
    
    // More incorrect balloons on screen (30% target, 70% random)
    let color;
    if (Math.random() < 0.3) {
      color = target; // 30% chance for target color
    } else {
      color = COLORS[Math.floor(Math.random() * COLORS.length)]; // 70% chance for random color
    }
    
    // Debug: Log when black balloon spawns
    if (color === 'BLACK') {
      console.log('🎈 BLACK BALLOON SPAWNED!');
    }
    
    const balloon = createBalloon(color, x, y);
    stage.appendChild(balloon);
    activeBalloons.push(balloon);
    
    // Start rising animation
    animateBalloonRise(balloon);
  }

  function createBalloon(color, x, y) {
    const el = document.createElement('div');
    el.className = 'balloon';
    el.setAttribute('data-name', color);
    el.setAttribute('data-id', Date.now() + Math.random());
    
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.zIndex = '1';
    
    // Create balloon image
    const balloonImg = document.createElement('img');
    balloonImg.src = `../assets/images/balloons/${color}-balloon.png`;
    balloonImg.alt = color;
    balloonImg.className = 'balloon-image';
    
    // Debug: Log image loading for black balloons
    if (color === 'BLACK') {
      console.log('🎈 Creating BLACK balloon with src:', balloonImg.src);
      balloonImg.onload = () => console.log('✅ BLACK balloon image loaded successfully');
      balloonImg.onerror = () => console.log('❌ BLACK balloon image failed to load');
    }
    
    el.appendChild(balloonImg);
    
    el._clickHandler = () => onPick(el, color);
    el.addEventListener('click', el._clickHandler);
    
    return el;
  }

  function animateBalloonRise(balloon) {
    const stageHeight = stage.offsetHeight;
    // Faster rise speed between 80-120 pixels per second for faster movement
    const riseSpeed = 80 + Math.random() * 40; // 80-120 pixels per second
    const riseDistance = stageHeight + 100; // Rise beyond the top
    const duration = (riseDistance / riseSpeed) * 1000; // Convert to milliseconds
    
    // Animate balloon rising
    balloon.style.transition = `top ${duration}ms linear`;
    balloon.style.top = '-100px'; // Move above the stage
    
    // Remove balloon when it reaches the top - no fade effect
    setTimeout(() => {
      if (balloon.parentNode) {
        balloon.remove();
        const index = activeBalloons.indexOf(balloon);
        if (index > -1) {
          activeBalloons.splice(index, 1);
        }
      }
    }, duration);
  }

   function start(){
    gameRunning = true;
    currentTurn = 0;
    // Pick a random target color for first turn
    target = COLORS[Math.floor(Math.random() * COLORS.length)];
    banner.textContent = target;
    tts(target);
    render();
    updateCharacterState('thinking');
    autoResize();
  }
  

 function schedule(){
   // This function is no longer needed for the continuous balloon game
 }

 function nextTurn() {
   currentTurn++;
   
   if (currentTurn >= maxTurns) {
     // Game completed
     gameRunning = false;
     clearInterval(balloonSpawnTimer);
     banner.textContent = 'WELL DONE!';
     tts('Well done!');
     updateCharacterState('correct');
     
     // Restart game after 3 seconds
     setTimeout(() => {
       start();
     }, 3000);
     return;
   }
   
   // Pick new target color for next turn
   target = COLORS[Math.floor(Math.random() * COLORS.length)];
   banner.textContent = target;
   tts(target);
   updateCharacterState('thinking');
 }

         function onPick(el, n){
   if (el.style.opacity==='0') return;
   if (n===target){
     updateCharacterState('correct');
     post({type:'score:delta', value:10});
     
     // Remove balloon immediately - no burst image
     el.style.opacity='0';
     el.style.pointerEvents = 'none';
     
     // Remove from active balloons array
     const index = activeBalloons.indexOf(el);
     if (index > -1) {
       activeBalloons.splice(index, 1);
     }
     
     // Remove from DOM immediately
     if (el.parentNode) {
       el.remove();
     }
     
     // Advance to next turn after correct click
     setTimeout(() => {
       nextTurn();
     }, 500);
     
   } else {
     updateCharacterState('wrong');
     post({type:'score:delta', value:-5});
     setTimeout(() => updateCharacterState('thinking'), 1000);
   }
 }

  start();
})();


