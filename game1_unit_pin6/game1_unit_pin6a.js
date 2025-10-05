(function(){
  // Spot and Drop game data for Unit 6
  const GAME_SLIDES = [
    {
      slide: 1,
      title: "Farm Animals",
      background: "../assets/images/Spot and Drop/background_slide-1.png",
      animal: "mouse",
      animalImage: "../assets/images/Spot and Drop/slide 1/mouse.png",
      instructions: [
        {
          text: "PUT THE MOUSE IN THE TRACTOR!",
          dropZone: { x: 15, y: 28 },
          correctImage: "../assets/images/Spot and Drop/slide 1/mouse in the tractor.png"
        },
        {
          text: "PUT THE MOUSE ON THE COW!",
          dropZone: { x: 35, y: 52 },
          correctImage: "../assets/images/Spot and Drop/slide 1/mouse on the cow.png"
        },
        {
          text: "PUT THE MOUSE UNDER THE HORSE!",
          dropZone: { x: 78, y: 50 },
          correctImage: "../assets/images/Spot and Drop/slide 1/mouse under the horse.png"
        },
        {
          text: "PUT THE MOUSE NEXT TO THE DUCK!",
          dropZone: { x: 55, y: 65 },
          correctImage: "../assets/images/Spot and Drop/slide 1/mouse next to the duck.png"
        }
      ]
    },
    {
      slide: 2,
      title: "Wild Animals",
      background: "../assets/images/Spot and Drop/background_slide-2-and-3.png",
      animal: "bird",
      animalImage: "../assets/images/Spot and Drop/slide 2/bird.png",
      instructions: [
        {
          text: "PUT THE BIRD IN THE LION'S MOUTH!",
          dropZone: { x: 20, y: 52 },
          correctImage: "../assets/images/Spot and Drop/slide 2/bird-in-the-lion-mouth.png"
        },
        {
          text: "PUT THE BIRD ON THE BEAR!",
          dropZone: { x: 48, y: 50 },
          correctImage: "../assets/images/Spot and Drop/slide 2/bird on the bear.png"
        },
        {
          text: "PUT THE BIRD NEXT TO THE MONKEY!",
          dropZone: { x: 53, y: 30 },
          correctImage: "../assets/images/Spot and Drop/slide 2/bird next to the monkey.png"
        },
        {
          text: "PUT THE BIRD UNDER THE GIRAFFE!",
          dropZone: { x: 86, y: 70 },
          correctImage: "../assets/images/Spot and Drop/slide 2/bird under the giraffe.png"
        }
      ]
    },
    {
      slide: 3,
      title: "Wild Animals",
      background: "../assets/images/Spot and Drop/background_slide-2-and-3.png",
      animal: "bird",
      animalImage: "../assets/images/Spot and Drop/slide 2/bird.png",
      instructions: [
        {
          text: "PUT THE BIRD IN THE BOX!",
          dropZone: { x: 85, y: 55 },
          correctImage: "../assets/images/Spot and Drop/slide 3/bird in the box.png"
        },
        {
          text: "PUT THE BIRD UNDER THE TIGER!",
          dropZone: { x: 20, y: 60 },
          correctImage: "../assets/images/Spot and Drop/slide 3/bird under the tiger.png"
        },
        {
          text: "PUT THE BIRD ON THE ELEPHANT!",
          dropZone: { x: 60, y: 28 },
          correctImage: "../assets/images/Spot and Drop/slide 3/bird on the elephant.png"
        },
        {
          text: "PUT THE BIRD NEXT TO THE CROCODILE!",
          dropZone: { x: 53, y: 65 },
          correctImage: "../assets/images/Spot and Drop/slide 3/bird next to the crocodile.png"
        }
      ]
    },
    {
      slide: 4,
      title: "Sea Animals",
      background: "../assets/images/Spot and Drop/background_slide-4-and-5.png",
      animal: "starfish",
      animalImage: "../assets/images/Spot and Drop/slide 4/starfish.png",
      instructions: [
        {
          text: "PUT THE STARFISH NEXT TO THE SEAHORSE!",
          dropZone: { x: 5, y: 40 },
          correctImage: "../assets/images/Spot and Drop/slide 4/starfish next to the seahorse.png"
        },
        {
          text: "PUT THE STARFISH ON THE JELLYFISH!",
          dropZone: { x: 30, y: 45 },
          correctImage: "../assets/images/Spot and Drop/slide 4/starfish on the jellyfish.png"
        },
        {
          text: "PUT THE STARFISH UNDER THE TURTLE!",
          dropZone: { x: 55, y: 68 },
          correctImage: "../assets/images/Spot and Drop/slide 4/starfish under the turtle.png"
        },
        {
          text: "PUT THE STARFISH IN THE SHARK'S MOUTH!",
          dropZone: { x: 67, y: 40 },
          correctImage: "../assets/images/Spot and Drop/slide 4/starfish in the shark's mouth.png"
        }
      ]
    },
    {
      slide: 5,
      title: "Sea Animals",
      background: "../assets/images/Spot and Drop/background_slide-4-and-5.png",
      animal: "starfish",
      animalImage: "../assets/images/Spot and Drop/slide 5/starfish.png",
      instructions: [
        {
          text: "PUT THE STARFISH UNDER THE DOLPHIN!",
          dropZone: { x: 25, y: 45 },
          correctImage: "../assets/images/Spot and Drop/slide 5/starfish under the dolphin.png"
        },
        {
          text: "PUT THE STARFISH ON THE SEASHELLS!",
          dropZone: { x: 35, y: 60 },
          correctImage: "../assets/images/Spot and Drop/slide 5/starfish on the seashells.png"
        },
        {
          text: "PUT THE STARFISH IN THE CRAB'S MOUTH!",
          dropZone: { x: 73, y: 37 },
          correctImage: "../assets/images/Spot and Drop/slide 5/starfish in the crab's mouth.png"
        },
        {
          text: "PUT THE STARFISH NEXT TO THE PENGUIN!",
          dropZone: { x: 75, y: 63 },
          correctImage: "../assets/images/Spot and Drop/slide 5/starfish next to the penguin.png"
        }
      ]
    }
  ];

  // Utility functions
  function shuffle(a) { 
    return a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]); 
  }

  function post(data) {
    if (window.parent && window.parent.postMessage) {
      window.parent.postMessage(data, '*');
    }
  }

  function autoResize() {
    if (window.parent && window.parent.postMessage) {
      window.parent.postMessage({type: 'resize'}, '*');
    }
  }

  function tts(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }

  function updateCharacterState(state) {
    const characterImg = document.querySelector('.game-student');
    if (characterImg) {
      switch(state) {
        case 'thinking':
          characterImg.src = '../assets/images/chars/squirrel think.png';
          break;
        case 'correct':
          characterImg.src = '../assets/images/chars/squirrel right.png';
          break;
        case 'wrong':
          characterImg.src = '../assets/images/chars/veverita wrong.png';
          break;
      }
    }
  }

  // Expose to global scope
  window.g1 = {
    GAME_SLIDES,
    shuffle,
    post,
    autoResize,
    tts,
    updateCharacterState
  };
})();
