(function(){
  const { COLORS, palette, tts, post, autoResize, updateCharacterState } = window.g1;
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

  function shuffle(arr){ return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }
  function pickSix(){ return shuffle(COLORS).slice(0,6); }
  
  function startCountdown(){
    // Clear any existing countdown timer
    if (countdownTimer) {
      clearInterval(countdownTimer);
    }
    
    countdownSeconds = 0;
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
    active.forEach((name, idx)=>{
      const div = document.createElement('div');
      div.className = 'color-dot';
      div.style.background = palette[name];
      div.setAttribute('data-name', name);
      div.addEventListener('click', ()=>onPick(div, name));
      (idx<3?row1:row2).appendChild(div);
    });
  }

  function startRound(){
    active = pickSix();
    target = active[Math.floor(Math.random()*active.length)];
    banner.textContent = target;
    renderCircles();
    remainCount = active.length;
    progress.style.width = '100%';
    updateCharacterState('thinking');
    // Start 7-second countdown timer
    startCountdown();
    // Remove the old fade delay since countdown handles timing now
    tts(target);
    autoResize();
  }

  function startNewTurn(){
    turnCount++;
    if (turnCount > 10) {
      // Game completed - send completion message
      post({type: 'game:complete', score: turnCount});
      return;
    }
    
    // Reset used problems if we've used all available colors
    if (usedProblems.length >= COLORS.length) {
      usedProblems = [];
    }
    
    active = pickSix();
    
    // Select a target that hasn't been used in this game
    let availableTargets = active.filter(color => !usedProblems.includes(color));
    if (availableTargets.length === 0) {
      // If all colors in current set have been used, reset used problems
      usedProblems = [];
      availableTargets = active;
    }
    
    target = availableTargets[Math.floor(Math.random()*availableTargets.length)];
    usedProblems.push(target);
    
    banner.textContent = target;
    renderCircles();
    remainCount = active.length;
    progress.style.width = '100%';
    updateCharacterState('thinking');
    // Start 7-second countdown timer
    startCountdown();
    // Remove the old fade delay since countdown handles timing now
    tts(target);
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

  function onPick(el, name){
    if (el.style.opacity==='0') return;
    const correct = name===target;
    if (correct){
      updateCharacterState('correct');
      post({type:'score:delta', value:10});
      el.style.transform = 'scale(0.9)';
      
      // Always change the problem when correct answer is selected
      // Select new target that hasn't been used in this game
      let availableTargets = active.filter(color => !usedProblems.includes(color));
      if (availableTargets.length === 0) {
        // If all colors in current set have been used, reset used problems
        usedProblems = [];
        availableTargets = active;
      }
      
      const newTarget = availableTargets[Math.floor(Math.random()*availableTargets.length)];
      target = newTarget;
      usedProblems.push(target);
      banner.textContent = target; 
      tts(target);
      
      // Clear any existing fade timer first
      clearInterval(timerId);
      
      // Reset ALL 6 circles to visible when problem changes (including the one that was just clicked)
      const allDots = Array.from(document.querySelectorAll('.color-dot'));
      allDots.forEach(dot => {
        dot.style.opacity = '1';
        dot.style.pointerEvents = 'auto';
        dot.style.transform = 'scale(1)';
      });
      
      // Shuffle color dot positions
      const shuffledDots = shuffle(allDots);
      shuffledDots.forEach(dot => {
        // Determine which row to append to based on index
        const index = shuffledDots.indexOf(dot);
        if (index < 3) {
          row1.appendChild(dot);
        } else {
          row2.appendChild(dot);
        }
      });
      // Reset progress bar and start new countdown timer
      progress.style.width = '100%';
      remainCount = active.length;
      startCountdown();
      setTimeout(() => updateCharacterState('thinking'), 1000);
    } else {
      updateCharacterState('wrong');
      post({type:'score:delta', value:-5});
      setTimeout(() => updateCharacterState('thinking'), 1000);
    }
  }

  startNewTurn();
})();


