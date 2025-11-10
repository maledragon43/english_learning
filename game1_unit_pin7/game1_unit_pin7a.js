(function(){
  // Spot and Drop 2 game data for Unit 7
  const GAME_SLIDES = [
    {
      slide: 1,
      title: "Kitchen 1",
      background: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/_background.png",
      instructions: [
        {
          text: "PUT THE CLOCK NEXT TO THE CUPBOARD.",
          pattern: "clock",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/elements to be placed into the room/clock_orange.png",
          dropZone: { x: 70, y: 30 }
        },
        {
          text: "PUT THE MOUSE IN THE FRIDGE.",
          pattern: "mouse",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/elements to be placed into the room/mouse.png",
          dropZone: { x: 10, y: 38 }
        },
        {
          text: "PUT THE TOYS ON THE CHAIR.",
          pattern: "toys",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/elements to be placed into the room/toys-in-a-box.png",
          dropZone: { x: 83, y: 60 }
        },
        {
          text: "PUT THE PLATE ON THE COOKER.",
          pattern: "plate",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/elements to be placed into the room/plate_cream.png",
          dropZone: { x: 41, y: 23 }
        },
        {
          text: "PUT THE CAT UNDER THE TABLE.",
          pattern: "cat",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/elements to be placed into the room/cat_growth_sleeping.png",
          dropZone: { x: 60, y: 70 }
        },
        {
          text: "PUT THE SPOON ON THE MAT.",
          pattern: "spoon",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/elements to be placed into the room/spoon.png",
          dropZone: { x: 17, y: 67 }
        },
        {
          text: "PUT THE FORK ON THE TABLE.",
          pattern: "fork",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/elements to be placed into the room/fork.png",
          dropZone: { x: 60, y: 55 }
        },
        {
          text: "PUT THE GLASS IN THE CUPBOARD.",
          pattern: "glass",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 1/elements to be placed into the room/glass_water.png",
          dropZone: { x: 88, y: 35 }
        }
      ]
    },
    {
      slide: 2,
      title: "Bedroom 1",
      background: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/_background.png",
      instructions: [
        {
          text: "PUT THE CLOCK NEXT TO THE WINDOW.",
          pattern: "clock",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/elements to be placed into the room/clock_green.png",
          dropZone: { x: 20, y: 30 }
        },
        {
          text: "PUT THE MOUSE IN THE BOX.",
          pattern: "mouse",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/elements to be placed into the room/mouse.png",
          dropZone: { x: 78, y: 47 }
        },
        {
          text: "PUT THE SHELLS UNDER THE BED.",
          pattern: "shells",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/elements to be placed into the room/shells.png",
          dropZone: { x: 15, y: 75 }
        },
        {
          text: "PUT THE LAMP ON THE DESK, BY THE BOX.",
          pattern: "lamp",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/elements to be placed into the room/lamp_yellow.png",
          dropZone: { x: 67, y: 50 }
        },
        {
          text: "PUT THE TOYS ON THE MAT.",
          pattern: "toys",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/elements to be placed into the room/toys-in-a-box_2.png",
          dropZone: { x: 52, y: 70 }
        },
        {
          text: "PUT THE TRACTOR UNDER THE DESK.",
          pattern: "tractor",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/elements to be placed into the room/tractor_red.png",
          dropZone: { x: 73, y: 70 }
        },
        {
          text: "PUT THE PAINTING UNDER THE WINDOW.",
          pattern: "painting",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/elements to be placed into the room/painting_1.jpg",
          dropZone: { x: 48, y: 50 }
        },
        {
          text: "PUT THE CAT ON THE BED.",
          pattern: "cat",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 1/elements to be placed into the room/cat_growth_walking.png",
          dropZone: { x: 20, y: 58 }
        }
      ]
    },
    {
      slide: 3,
      title: "Kitchen 2",
      background: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/_background.png",
      instructions: [
        {
          text: "PUT THE PINK SPOON IN THE CUPBOARD.",
          pattern: "spoon",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/elements to be placed into the room/spoon_red.png",
          dropZone: { x: 15, y: 25 }
        },
        {
          text: "PUT THE FORK ON THE TABLE.",
          pattern: "fork",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/elements to be placed into the room/fork_red.png",
          dropZone: { x: 50, y: 55 }
        },
        {
          text: "PUT THE CLOCK NEXT TO THE FRIDGE.",
          pattern: "clock",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/elements to be placed into the room/clock_dark-blue.png",
          dropZone: { x: 12, y: 45 }
        },
        {
          text: "PUT THE GLASS ON THE COOKER.",
          pattern: "glass",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/elements to be placed into the room/glass_water.png",
          dropZone: { x: 50, y: 45 }
        },
        {
          text: "PUT THE MOUSE IN THE FRIDGE.",
          pattern: "mouse",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/elements to be placed into the room/mouse_eating.png",
          dropZone: { x: 10, y: 45 }
        },
        {
          text: "PUT THE DOG ON THE MAT.",
          pattern: "dog",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/elements to be placed into the room/happy-dog.png",
          dropZone: { x: 70, y: 75 }
        },
        {
          text: "PUT THE SPOON UNDER THE CHAIR.",
          pattern: "spoon",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/elements to be placed into the room/wooden-spoon.png",
          dropZone: { x: 40, y: 72 }
        },
        {
          text: "PUT THE BEAR ON THE CHAIR.",
          pattern: "bear",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for KITCHEN 2/elements to be placed into the room/bear-toy.png",
          dropZone: { x: 40, y: 70 }
        }
      ]
    },
    {
      slide: 4,
      title: "Bedroom 2",
      background: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/_background.png",
      instructions: [
        {
          text: "PUT THE CLOCK ON THE DESK.",
          pattern: "clock",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/elements to be placed into the room/clock_red_no-shadow.png",
          dropZone: { x: 25, y: 45 }
        },
        {
          text: "PUT THE PAINTING NEXT TO THE WINDOW.",
          pattern: "painting",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/elements to be placed into the room/painting_2.png",
          dropZone: { x: 75, y: 20 }
        },
        {
          text: "PUT THE BIRD UNDER THE WINDOW.",
          pattern: "bird",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/elements to be placed into the room/bird.png",
          dropZone: { x: 75, y: 30 }
        },
        {
          text: "PUT THE DOG ON THE BED.",
          pattern: "dog",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/elements to be placed into the room/dog.png",
          dropZone: { x: 35, y: 60 }
        },
        {
          text: "PUT THE LAMP IN THE BOX.",
          pattern: "lamp",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/elements to be placed into the room/lamp_red.png",
          dropZone: { x: 20, y: 50 }
        },
        {
          text: "PUT THE FROG UNDER THE BED.",
          pattern: "frog",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/elements to be placed into the room/frog_green.png",
          dropZone: { x: 30, y: 65 }
        },
        {
          text: "PUT THE TOYS UNDER THE DESK.",
          pattern: "toys",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/elements to be placed into the room/toys.png",
          dropZone: { x: 25, y: 55 }
        },
        {
          text: "PUT THE STARFISH ON THE MAT.",
          pattern: "starfish",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 2/elements to be placed into the room/starfish_red.png",
          dropZone: { x: 50, y: 75 }
        }
      ]
    },
    {
      slide: 5,
      title: "Bedroom 3",
      background: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/background.png",
      instructions: [
        {
          text: "PUT THE LAMP UNDER THE DESK.",
          pattern: "lamp",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/elements to be placed into the room/lamp_yellow.png",
          dropZone: { x: 25, y: 55 }
        },
        {
          text: "PUT THE TOYS ON THE BED.",
          pattern: "toys",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/elements to be placed into the room/toys-in-a-box_1.png",
          dropZone: { x: 35, y: 60 }
        },
        {
          text: "PUT THE HORSE ON THE MAT.",
          pattern: "horse",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/elements to be placed into the room/horse-toy.png",
          dropZone: { x: 50, y: 75 }
        },
        {
          text: "PUT THE PAINTING NEXT TO THE WALL.",
          pattern: "painting",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/elements to be placed into the room/painting_5.png",
          dropZone: { x: 80, y: 25 }
        },
        {
          text: "PUT THE CAT UNDER THE BED.",
          pattern: "cat",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/elements to be placed into the room/cat_growth_sleeping.png",
          dropZone: { x: 30, y: 65 }
        },
        {
          text: "PUT THE FISH IN THE BOX.",
          pattern: "fish",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/elements to be placed into the room/fish.png",
          dropZone: { x: 20, y: 50 }
        },
        {
          text: "PUT THE CLOCK UNDER THE WINDOW.",
          pattern: "clock",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/elements to be placed into the room/clock_orange.png",
          dropZone: { x: 75, y: 30 }
        },
        {
          text: "PUT THE BEAR ON THE DESK.",
          pattern: "bear",
          patternImage: "../assets/images/drag_and_drop_uint7/photos for BEDROOM 3/elements to be placed into the room/teddy-bear.png",
          dropZone: { x: 25, y: 45 }
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

