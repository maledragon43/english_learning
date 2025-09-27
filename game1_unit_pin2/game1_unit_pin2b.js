(function(){
  const { ANIMALS, animalSounds, playAnimalSound, stopAllAudio, tts, post, autoResize, updateCharacterState } = window.g1;
  const SPEED_MS = 1000;
  const row1 = document.getElementById('row1');
  const row2 = document.getElementById('row2');
  const banner = document.getElementById('currentWord');
  const progress = document.getElementById('progressFill');

  let active = [];
  let target = '';
  let timerId = null;
  let remainCount = 0;
  let turnCount = 0;
  let usedProblems = [];
  let countdownTimer = null;
  let countdownSeconds = 7;
  
  // Predefined turn order for 20 variations
  const turnOrder = [
    'cat', 'dog', 'tractor', 'horse', 'pig', 'farm', 'cow', 'duck', 'chicken', 'mouse',
    'cat', 'dog', 'tractor', 'horse', 'pig', 'farm', 'cow', 'duck', 'chicken', 'mouse'
  ];

  function shuffle(arr){ return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }
  function pickSix(){ return shuffle(ANIMALS).slice(0,6); }
  
  function startCountdown(){
    // Clear any existing countdown timer
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
    
    countdownSeconds = 7;
    progress.style.width = '100%';
    
    countdownTimer = setInterval(() => {
      countdownSeconds--;
      const pct = Math.max(0, (countdownSeconds / 7) * 100);
      progress.style.width = pct + '%';
      
      if (countdownSeconds <= 0) {
        clearInterval(countdownTimer);
        // Time's up - start fading circles
        scheduleFade();
      }
    }, 1000);
  }

  function renderCircles(){
    row1.innerHTML = '';
    row2.innerHTML = '';
    active.forEach((animal, idx)=>{
      const div = document.createElement('div');
      div.className = 'color-dot';
      div.style.backgroundImage = `url('../assets/images/Word Dash photos/${animal}.png')`;
      div.setAttribute('data-name', animal);
      div.addEventListener('click', ()=>onPick(div, animal));
      (idx<3?row1:row2).appendChild(div);
    });
  }

  function startRound(){
    active = pickSix();
    target = active[Math.floor(Math.random()*active.length)];
    banner.textContent = animalSounds[target].toUpperCase();
    renderCircles();
    remainCount = active.length;
    progress.style.width = '100%';
    updateCharacterState('thinking');
    // Start 7-second countdown timer
    startCountdown();
    // Play the animal sound
    playAnimalSound(target);
    autoResize();
  }

  function startNewTurn(){
    // Stop any currently playing audio
    stopAllAudio();
    
    turnCount++;
    if (turnCount > 20) {
      // Game completed - send completion message
      post({type: 'game:complete', score: turnCount});
      return;
    }
    
    // Use predefined turn order
    target = turnOrder[turnCount - 1];
    
    // Create 6 random animals including the target
    active = [target];
    while (active.length < 6) {
      const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      if (!active.includes(randomAnimal)) {
        active.push(randomAnimal);
      }
    }
    
    // Shuffle the active animals
    active = shuffle(active);
    
    banner.textContent = animalSounds[target].toUpperCase();
    renderCircles();
    remainCount = active.length;
    progress.style.width = '100%';
    updateCharacterState('thinking');
    // Start 7-second countdown timer
    startCountdown();
    // Play the animal sound
    playAnimalSound(target);
    autoResize();
  }

  function scheduleFade(){
    clearInterval(timerId);
    const total = remainCount;
    let gone = 0;
    timerId = setInterval(()=>{
      const visible = Array.from(document.querySelectorAll('.color-dot')).filter(x=>x.style.opacity!=='0');
      if (!visible.length){ clearInterval(timerId); startNewTurn(); return; }
      
      // If only one circle remains and it's the target, don't fade it yet
      if (visible.length === 1 && visible[0].getAttribute('data-name') === target) {
        return;
      }
      
      // Pick a random visible circle that is NOT the target (if possible)
      let pick;
      const nonTargetVisible = visible.filter(x => x.getAttribute('data-name') !== target);
      if (nonTargetVisible.length > 0) {
        pick = nonTargetVisible[Math.floor(Math.random()*nonTargetVisible.length)];
      } else {
        pick = visible[Math.floor(Math.random()*visible.length)];
      }
      
      pick.style.opacity = '0'; pick.style.pointerEvents = 'none';
      gone++;
      const pct = Math.max(0, 100 * (total-gone)/total);
      progress.style.width = pct + '%';
      if (gone>=total){ clearInterval(timerId); startNewTurn(); }
    }, SPEED_MS);
  }

  function onPick(el, animal){
    if (el.style.opacity==='0') return;
    const correct = animal===target;
    if (correct){
      updateCharacterState('correct');
      post({type:'score:delta', value:10});
      el.style.transform = 'scale(0.9)';
      
      // Move to next turn in predefined order
      setTimeout(() => {
        startNewTurn();
      }, 1000);
    } else {
      updateCharacterState('wrong');
      post({type:'score:delta', value:-5});
      setTimeout(() => updateCharacterState('thinking'), 1000);
    }
  }

  startNewTurn();
})();
