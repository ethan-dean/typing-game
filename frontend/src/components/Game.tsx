import React, { useEffect, useRef, useState } from 'react';
import '../css/game.css';
import {v4 as uuidv4} from 'uuid';
import { miniPrograms } from '../program-snippets';

interface Bug {
  id: string;
  text: string;
  element: HTMLElement;
}

function Game() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [typedWord, setTypedWord] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const playerShipRef = useRef<HTMLDivElement>(null);
  const setBugs = useState<Bug[]>([])[1];
  const [activeBug, setActiveBug] = useState<string | null>(null);
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('score');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });
  const gameOver = false;
  const [waveCleared, setWaveCleared] = useState(false);
  /*
  const [totalWords, setTotalWords] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
*/

	useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input element when the component mounts
    }
    
    startWaves();
    
    const checkBugsInterval = setInterval(() => {
      const gameContainer = gameContainerRef.current;
      if(gameContainer) {
        const bugsInContainer = gameContainer.getElementsByClassName('bug').length;
        if(bugsInContainer === 0 && !waveCleared) {
          setWaveCleared(true);
        }
      }
    }, 1000);
    
    return () => clearInterval(checkBugsInterval);
	}, []);
	
	useEffect(() => {
    console.log('Active Bug ID:', activeBug);
	}, [activeBug]);
	
	useEffect(() => {
    localStorage.setItem('score', score.toString());
	}, [score]);
	
	useEffect(() => {
    if(waveCleared && !gameOver) {
      const waveDelay = 4000;
      setTimeout(startWaves, waveDelay);
    }
	}, [waveCleared, gameOver]);
	
	const startWaves = () => {
    const spawnNextWave = () => {
    if(!gameOver) {
	        const gameContainer = gameContainerRef.current;
	        if(!gameContainer) return;
	        
	        const currentBugs = gameContainer.getElementsByClassName('bug').length;
	        const maxBugs = 10;
	        const bugsToSpawn = Math.min(maxBugs - currentBugs, Math.floor(Math.random() * 10) + 1);
	        
	        if(bugsToSpawn > 0) {
          setWaveCleared(false);
          spawnWave(bugsToSpawn);
          }
	    }
    };
  
    spawnNextWave();
	};
	
	const spawnWave = (count: number) => {
    const lines = generateRandomCode();
    let spawnedBugs = 0;
    const interval = setInterval(() => {
      if (spawnedBugs < count && spawnedBugs < lines.length) {
        spawnBug(lines[spawnedBugs]);
        spawnedBugs++;
      } else {
        clearInterval(interval);
      }
    }, 5000); // 5 seconds
  };
	
	const spawnBug = (line: string) => {
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;
  
    const gameContainerWidth = gameContainer.offsetWidth;
    const bugWidth = 100; // Assuming each bug has a width of 50px
    const minLeft = 150;
    const maxLeft = gameContainerWidth - bugWidth;
  
    let leftPosition;
    let isOverlapping;
  
    // Create a temporary element to measure the text width
    const tempBugText = document.createElement('div');
    tempBugText.className = 'bug-text';
    tempBugText.style.position = 'absolute';
    tempBugText.style.visibility = 'hidden';
    tempBugText.style.whiteSpace = 'nowrap';
    tempBugText.textContent = line;
    document.body.appendChild(tempBugText);
    const textWidth = tempBugText.offsetWidth;
    document.body.removeChild(tempBugText);
  
    do {
      leftPosition = Math.random() * (maxLeft - minLeft) + minLeft;
      isOverlapping = false;
  
      // Check for overlapping with existing bugs
      const existingBugs = gameContainer.getElementsByClassName('bug');
      for (let i = 0; i < existingBugs.length; i++) {
        const existingBug = existingBugs[i] as HTMLElement;
        const existingBugLeft = parseFloat(existingBug.style.left);
        if (Math.abs(existingBugLeft - leftPosition) < bugWidth) {
          isOverlapping = true;
          break;
        }
      }
    } while (isOverlapping || leftPosition + textWidth > gameContainerWidth);
  
    const bugElement = document.createElement('div');
    bugElement.className = 'bug';
    bugElement.style.left = `${leftPosition}px`;
  
    const bugText = document.createElement('div');
    bugText.className = 'bug-text';
    line.split('').forEach(char => {
      const spanElement = document.createElement('span');
      spanElement.textContent = char;
      bugText.appendChild(spanElement);
    });
  
    bugElement.appendChild(bugText);
    gameContainer.appendChild(bugElement);
  
      const bug: Bug = {
          id: uuidv4(),
          text: line,
          element: bugElement,
      };
      
      bugElement.dataset.id = bug.id.toString();
      
      setBugs(prevBugs => [...prevBugs, bug]);
      
      bugElement.addEventListener('animationend', () => {
          gameContainer.removeChild(bugElement);
          setBugs(prevBugs => prevBugs.filter(b => b.element !== bugElement));
      });
      
	};
	
	const shootProjectile = (targetElement: HTMLElement) => {
    console.log('Shooting projectile at:', targetElement.textContent);
  
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) {
      console.error('Game container not found');
      return;
    }
  
    const playerShip = playerShipRef.current;
    if (!playerShip) {
      console.error('Player ship not found');
      return;
    }
  
    const projectile = document.createElement('div');
    projectile.className = 'projectile';
    gameContainer.appendChild(projectile);
  
    const playerRect = playerShip.getBoundingClientRect();
    const gameRect = gameContainer.getBoundingClientRect();
    projectile.style.left = `${playerRect.left}px`;
    projectile.style.top = `${playerRect.top}px`;
  
    console.log('Projectile initial position:', projectile.style.left, projectile.style.top);
  
    // Calculate the initial angle to rotate the projectile
    const initialTargetRect = targetElement.getBoundingClientRect();
    const initialTargetX = initialTargetRect.left - gameRect.left + initialTargetRect.width / 2;
    const initialTargetY = initialTargetRect.top - gameRect.top + initialTargetRect.height / 2;
  
    const initialDeltaX = initialTargetX - (playerRect.left - gameRect.left + playerRect.width / 2);
    const initialDeltaY = initialTargetY - (playerRect.top - gameRect.top);
    const initialDistance = Math.sqrt(initialDeltaX * initialDeltaX + initialDeltaY * initialDeltaY);
    const initialAngle = Math.atan2(initialDeltaY, initialDeltaX);
  
    console.log('Initial target position:', initialTargetX, initialTargetY);
    console.log('Initial angle (radians):', initialAngle);
  
    // Apply initial rotation to the projectile
    projectile.style.transform = `rotate(${initialAngle}rad)`;
    projectile.style.transformOrigin = 'center';
  
    // Calculate a shorter distance to stop before the target
  
    // Calculate animation duration based on the shorter distance
    const speed = 1000; // Pixels per second
    const duration = (initialDistance / speed) * 1000; // Convert to milliseconds
  
    // Smooth projectile animation
    const animation = projectile.animate(
      [
        { transform: `translate(0, 0) rotate(${initialAngle}rad)` },
        { transform: `translate(${initialDeltaX}px, ${initialDeltaY}px) rotate(${initialAngle}rad)` },
      ],
      {
        duration: duration,
        easing: 'linear',
      }
    );
  
    animation.onfinish = () => {
      gameContainer.removeChild(projectile);
  
      if (gameContainer.contains(targetElement)) {
        gameContainer.removeChild(targetElement);
      }
    };
  
    const updateTargetPosition = () => {
      const currentRect = projectile.getBoundingClientRect();
      const currentX = currentRect.left + currentRect.width / 2;
      const currentY = currentRect.top + currentRect.height / 2;
  
      const targetRect = targetElement.getBoundingClientRect();
      const targetX = targetRect.left - gameRect.left + targetRect.width / 2;
      const targetY = targetRect.top - gameRect.top + targetRect.height / 2;
  
      const deltaX = targetX - currentX;
      const deltaY = targetY - currentY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
      if (distance < 5) {
        console.log('Projectile hit the target!');
        gameContainer.removeChild(projectile);
        gameContainer.removeChild(targetElement);
        return;
      }
  
      requestAnimationFrame(updateTargetPosition);
    };
  
    requestAnimationFrame(updateTargetPosition);
  };
  
	
	/*
	useEffect(() => {
	  const gameLoop = () => {
	    requestAnimationFrame(gameLoop);
	  };
	});
	
	const updateStatsInDatabase = async () => {
	  try {
	    const response = await fetch()
	  }
	}*/
	
  const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
    }
  };

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
  const input = event.target.value;
  setTypedWord(input);

  const gameContainer = gameContainerRef.current;
  if (!gameContainer) return;

  const bugs = Array.from(gameContainer.getElementsByClassName('bug')) as HTMLElement[];
  //console.log('Bugs:', bugs.map(bug => bug.textContent));

  if (!activeBug) {
    const matchingBugs = bugs.filter(bugElement => {
      const bugText = bugElement.querySelector('.bug-text') as HTMLElement;
      const bugTextContent = bugText.textContent?.trim(); // Trim the bug text
      console.log(`Comparing input "${input}" with bug text "${bugTextContent}"`);
      return input.split('').some(char => bugTextContent?.startsWith(char));
    });
    
    console.log('Matching Bugs:', matchingBugs);

    if (matchingBugs.length > 0) {
      const activeBugElement = matchingBugs[0] as HTMLElement;
      setActiveBug(activeBugElement.dataset.id || null);
      console.log('Active Bug ID:', activeBugElement.dataset.id);
      
      const bugText = activeBugElement.querySelector('.bug-text') as HTMLElement;
      const spans = Array.from(bugText.children) as HTMLElement[];
      spans[0].classList.add('correct');
    } else {
      setActiveBug(null);
    }
  }

  const activeBugElement = bugs.find(bug => bug.dataset.id === activeBug);
  
  if (activeBugElement) {
    const bugText = activeBugElement.querySelector('.bug-text') as HTMLElement;
    const spans = Array.from(bugText.children) as HTMLElement[];
    
    console.log('Spans:', spans);
    let currentIndex = 0;
    let inputIndex = 0;

    if (spans[0].classList.contains('correct')) {
      currentIndex = 1;
      inputIndex = 1;
    }

    while (inputIndex < input.length && currentIndex < spans.length) {
      if (input[inputIndex] === spans[currentIndex].textContent) {
        spans[currentIndex].classList.add('correct');
        currentIndex++;
      } else {
        spans[currentIndex].classList.remove('correct');
      }
      inputIndex++;
    }

    if (currentIndex === spans.length) {
      shootProjectile(activeBugElement);
      setTypedWord('');
      setScore(prevScore => {
        const newScore = prevScore + 10;
        localStorage.setItem('score', newScore.toString());
        return newScore;
      });
      setBugs(prevBugs => {
        const updatedBugs = prevBugs.filter(b => b.id !== (activeBugElement as HTMLElement).dataset.id);
        if (updatedBugs.length === 0) {
          setWaveCleared(true);
        }
        return updatedBugs;
      });
      setActiveBug(null);
    }
  }
};

	const generateRandomCode = () => {
    const languages = Object.keys(miniPrograms);
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)] as keyof typeof miniPrograms;
    const snippets = miniPrograms[randomLanguage];
    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
    return randomSnippet.lines;
	};

	return (
    <div className="game-container" ref={gameContainerRef}>
    <div className="stats">
      <div>Score: {score}</div>
    </div>
    <div className='player-ship' ref={playerShipRef}></div>
    <input
        type="text"
        value={typedWord}
        onChange={handleTyping}
        onKeyDown={handleBackspace}
        placeholder="Type the word"
        className="typing-input"
        autoFocus
    />
    </div>
	);
}

export default Game;