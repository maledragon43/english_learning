(function(){
  const FARM_ANIMALS = ['cat', 'dog', 'tractor', 'horse', 'pig', 'farm', 'cow', 'duck', 'chicken', 'mouse'];
  const WILD_ANIMALS = ['crocodile', 'tiger', 'elephant', 'monkey', 'bear', 'frog', 'bird', 'zebra', 'lion', 'giraffe', 'fish'];
  
  // Sentence data with correct image and distractors for Unit 3 - Mixed Farm and Wild Animals
  const sentenceData = [
    // Round 1 - Wild animals with mixed options
    { sentence: "This is a crocodile.", correct: "crocodile.png", options: ["tiger-orange.png", "crocodile.png", "cat.png"] },
    { sentence: "The lion is brown and orange.", correct: "lion-brown-and-orange.png", options: ["lion-blue.png", "lion-yellow.png", "lion-brown-and-orange.png"] },
    { sentence: "This is a tiger.", correct: "tiger-orange.png", options: ["dog.png", "elephant-grey.png", "tiger-orange.png"] },
    { sentence: "The monkey is brown.", correct: "monkey-brown.png", options: ["monkey-black.png", "monkey-white.png", "monkey-brown.png"] },
    { sentence: "This is an elephant.", correct: "elephant-grey.png", options: ["bear-brown.png", "horse.png", "elephant-grey.png"] },
    { sentence: "The bear is brown.", correct: "bear-brown.png", options: ["bear-black.png", "bear-white.png", "bear-brown.png"] },
    { sentence: "This is a monkey.", correct: "monkey-brown.png", options: ["pig.png", "monkey-brown.png", "crocodile.png"] },
    { sentence: "The frog is green.", correct: "frog-green.png", options: ["frog-purple.png", "frog-red.png", "frog-green.png"] },
    { sentence: "This is a bear.", correct: "bear-brown.png", options: ["bear-brown.png", "tiger-orange.png", "cow.png"] },
    { sentence: "The tiger is black and orange.", correct: "tiger-orange.png", options: ["tiger-orange.png", "tiger-pink.png", "tiger-black-and-white.png"] },
    { sentence: "This is a frog.", correct: "frog-green.png", options: ["frog-green.png", "fish-blue.png", "duck.png"] },
    { sentence: "The elephant is grey.", correct: "elephant-grey.png", options: ["elephant-blue.png", "elephant-pink.png", "elephant-grey.png"] },
    { sentence: "This is a bird.", correct: "bird-blue.png", options: ["chicken.png", "mouse.png", "bird-blue.png"] },
    { sentence: "The frog is purple.", correct: "frog-purple.png", options: ["frog-green.png", "frog-red.png", "frog-purple.png"] },
    { sentence: "This is a zebra.", correct: "zebra.png", options: ["zebra.png", "giraffe.png", "mouse.png"] },
    { sentence: "The fish is blue.", correct: "fish-blue.png", options: ["fish-purple.png", "fish-yellow.png", "fish-blue.png"] },
    { sentence: "This is a lion.", correct: "lion-brown-and-orange.png", options: ["tiger-orange.png", "lion-brown-and-orange.png", "cat.png"] },
    { sentence: "The bear is white.", correct: "bear-white.png", options: ["bear-black.png", "bear-brown.png", "bear-white.png"] },
    { sentence: "This is a giraffe.", correct: "giraffe.png", options: ["giraffe.png", "monkey-brown.png", "pig.png"] },
    { sentence: "The bird is blue.", correct: "bird-blue.png", options: ["bird-orange.png", "bird-red.png", "bird-blue.png"] },
    { sentence: "This is a fish.", correct: "fish-blue.png", options: ["crocodile.png", "fish-blue.png", "cow.png"] },
    { sentence: "The zebra is black and white.", correct: "zebra.png", options: ["zebra-blue-white.png", "zebra-pink-white.png", "zebra.png"] },
    
    // Round 2 - Mixed sentences with different options
    { sentence: "This is a crocodile.", correct: "crocodile.png", options: ["crocodile.png", "tiger-orange.png", "cat.png"] },
    { sentence: "The lion is yellow.", correct: "lion-yellow.png", options: ["lion-blue.png", "lion-brown-and-orange.png", "lion-yellow.png"] },
    { sentence: "This is a tiger.", correct: "tiger-orange.png", options: ["tiger-orange.png", "monkey-brown.png", "dog.png"] },
    { sentence: "The monkey is white.", correct: "monkey-white.png", options: ["monkey-black.png", "monkey-brown.png", "monkey-white.png"] },
    { sentence: "This is an elephant.", correct: "elephant-grey.png", options: ["elephant-grey.png", "bear-brown.png", "horse.png"] },
    { sentence: "The bear is black.", correct: "bear-black.png", options: ["bear-brown.png", "bear-white.png", "bear-black.png"] },
    { sentence: "This is a monkey.", correct: "monkey-brown.png", options: ["monkey-brown.png", "frog-green.png", "pig.png"] },
    { sentence: "The frog is red.", correct: "frog-red.png", options: ["frog-green.png", "frog-purple.png", "frog-red.png"] },
    { sentence: "This is a bear.", correct: "bear-brown.png", options: ["bear-brown.png", "tiger-pink.png", "cow.png"] },
    { sentence: "The tiger is pink and black.", correct: "tiger-pink.png", options: ["tiger-orange.png", "tiger-black-and-white.png", "tiger-pink.png"] },
    { sentence: "This is a frog.", correct: "frog-green.png", options: ["frog-green.png", "elephant-blue.png", "duck.png"] },
    { sentence: "The elephant is blue.", correct: "elephant-blue.png", options: ["elephant-grey.png", "elephant-pink.png", "elephant-blue.png"] },
    { sentence: "This is a bird.", correct: "bird-orange.png", options: ["bird-orange.png", "tiger-black-and-white.png", "chicken.png"] },
    { sentence: "The tiger is black and white.", correct: "tiger-black-and-white.png", options: ["tiger-orange.png", "tiger-pink.png", "tiger-black-and-white.png"] },
    { sentence: "This is a zebra.", correct: "zebra-blue-white.png", options: ["zebra-blue-white.png", "fish-purple.png", "mouse.png"] },
    { sentence: "The fish is purple.", correct: "fish-purple.png", options: ["fish-blue.png", "fish-yellow.png", "fish-purple.png"] },
    { sentence: "This is a lion.", correct: "lion-blue.png", options: ["lion-blue.png", "monkey-white.png", "cat.png"] },
    { sentence: "The monkey is white.", correct: "monkey-white.png", options: ["monkey-black.png", "monkey-brown.png", "monkey-white.png"] },
    { sentence: "This is a giraffe.", correct: "giraffe.png", options: ["giraffe.png", "bird-red.png", "pig.png"] },
    { sentence: "The bird is red.", correct: "bird-red.png", options: ["bird-blue.png", "bird-orange.png", "bird-red.png"] },
    { sentence: "This is a fish.", correct: "fish-yellow.png", options: ["fish-yellow.png", "zebra-blue-white.png", "cow.png"] },
    { sentence: "The zebra is blue and white.", correct: "zebra-blue-white.png", options: ["zebra.png", "zebra-pink-white.png", "zebra-blue-white.png"] }
  ];
  
  function post(m){ parent.postMessage(m,'*'); }
  function autoResize(){ const h=document.documentElement.scrollHeight; post({type:'resize', height:h}); }
  function tts(text){ try{ const u=new SpeechSynthesisUtterance(text); u.rate=.95; u.lang='en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }
  
  // Character state management
  function updateCharacterState(state) {
    const studentImg = document.querySelector('.game-student');
    if (studentImg) {
      switch(state) {
        case 'correct':
          studentImg.src = '../assets/images/chars/squirrel right.png';
          break;
        case 'wrong':
          studentImg.src = '../assets/images/chars/veverita wrong.png';
          break;
        case 'thinking':
        default:
          studentImg.src = '../assets/images/chars/squirrel think.png';
          break;
      }
    }
  }
  
  window.g1 = { FARM_ANIMALS, WILD_ANIMALS, sentenceData, post, autoResize, tts, updateCharacterState };
  window.addEventListener('load', autoResize);
  window.addEventListener('resize', autoResize);
})();
