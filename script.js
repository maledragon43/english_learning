(() => {
  const frame = document.getElementById('gameFrame');
  const scoreEl = document.getElementById('score');
  let currentScore = 0;
  let lastHeight = 600; // Track the last set height to prevent continuous growth

  function setScore(value) {
    currentScore = Math.max(0, Number(value) || 0);
    if (scoreEl) scoreEl.textContent = String(currentScore);
  }

  function sendToIframe(message) {
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(message, '*');
  }

  document.querySelectorAll('[data-load]')?.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-load');
      if (url && frame) {
        frame.src = url;
      }
    });
  });

  window.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data?.type === 'resize' && frame) {
      if (typeof data.height === 'number') {
        // Set reasonable height limits to prevent continuous growth
        const minHeight = Math.max(360, window.innerHeight * 0.3); // At least 30% of viewport height
        const maxHeight = Math.min(1800, window.innerHeight * 0.7); // Maximum 80% of viewport height
        const newHeight = Math.max(minHeight, Math.min(maxHeight, data.height));
        
        // Only update height if it's significantly different to prevent continuous growth
        if (Math.abs(newHeight - lastHeight) > 10) {
          frame.style.height = newHeight + 'px';
          lastHeight = newHeight;
        }
      }
    }
    if (data?.type === 'score:update') {
      setScore(data.value);
    }
    if (data?.type === 'score:delta') {
      setScore(currentScore + (Number(data.value) || 0));
    }
    if (data?.type === 'speak') {
      const text = String(data.text || '').trim();
      if (text) speak(text);
    }
  });

  function speak(text) {
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      utter.pitch = 1.0;
      utter.lang = 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }

  window.send = function send(action) {
    sendToIframe({ type: 'action', action });
  };
})();


