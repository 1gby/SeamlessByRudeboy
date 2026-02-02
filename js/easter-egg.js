/* ============================================================================
EASTER-EGG.JS - Matrix Effect & Music Player

This file handles the easter egg functionality:

- Matrix canvas effect
- Music playlist and playback
- Logo click easter egg trigger
  ============================================================================ */

/**

- Music playlist
  */
  const playlist = [
  {
  title: ‘Capone’,
  artist: ‘Hey Pluto’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/capone.mp3’
  },
  {
  title: ‘Count’,
  artist: ‘Fonss’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/count.mp3’
  },
  {
  title: ‘Falling Softly’,
  artist: ‘Richard Smithson’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/falling%20softly.mp3’
  },
  {
  title: ‘Fluid’,
  artist: ‘Mountaineer’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/fluid.mp3’
  },
  {
  title: ‘I Wanna Take Your Body Higher’,
  artist: ‘SkyGaze’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/i%20wanna%20take%20your%20body%20higher.mp3’
  },
  {
  title: ‘Journey’,
  artist: ‘Tatami’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/journey.mp3’
  },
  {
  title: ‘Moments’,
  artist: ‘Tatami’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/moments.mp3’
  },
  {
  title: ‘Stardrive’,
  artist: ‘Simon Folwar’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/stardrive.mp3’
  },
  {
  title: ‘Sunset In Junipero’,
  artist: ‘Bach’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/sunset%20in%20junipero.mp3’
  },
  {
  title: ‘I Know’,
  artist: ‘Matrika’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/IKnow.mp3’
  },
  {
  title: ‘Other Worlds’,
  artist: ‘Carpetman’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/OtherWorlds.mp3’
  },
  {
  title: ‘JaffaDays’,
  artist: ‘ToneBreak’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/JaffaDays.mp3’
  },
  {
  title: ‘Baby Blue’,
  artist: ‘Action Bronson’,
  url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/BabyBlue.mp3’
  }
  ];

let shuffledPlaylist = […playlist];
let currentTrackIndex = 0;
let matrixActive = false;
let matrixInterval = null;

/**

- Initialize easter egg
  */
  function initEasterEgg() {
  shufflePlaylist();

const easterEgg = document.getElementById(‘easterEgg’);
const easterEggOverlay = document.getElementById(‘easterEggOverlay’);
const easterEggLogo = document.getElementById(‘easterEggLogo’);
const matrixCanvas = document.getElementById(‘matrixCanvas’);
const audio = document.getElementById(‘easterEggAudio’);

// Click footer credit to trigger
easterEgg.addEventListener(‘click’, () => {
if (matrixActive) return;

```
matrixActive = true;
easterEggOverlay.classList.add('visible');
playRandomTrack();

setTimeout(() => {
  easterEggLogo.style.animation = 'none';
  easterEggLogo.style.opacity = '0';
  easterEggLogo.style.transition = 'opacity 0.5s';
  
  setTimeout(() => {
    easterEggLogo.style.display = 'none';
    matrixCanvas.classList.add('visible');
    startMatrix();
  }, 500);
}, 1000);
```

});

// Click overlay to close
easterEggOverlay.addEventListener(‘click’, () => {
if (!matrixActive) return;

```
matrixActive = false;
matrixCanvas.classList.remove('visible');
stopMatrix();
stopMusic();

setTimeout(() => {
  easterEggLogo.style.display = 'block';
  easterEggLogo.style.animation = 'spin-out 1s ease-in forwards';
  
  setTimeout(() => {
    easterEggOverlay.classList.remove('visible');
    easterEggLogo.style.animation = 'spin-in 1s ease-out forwards, egg-glow 2s ease-in-out infinite 1s';
  }, 1000);
}, 500);
```

});

// Track ended - play next
audio.addEventListener(‘ended’, () => {
if (matrixActive) {
playRandomTrack();
}
});

// Media session handlers for iOS Dynamic Island
if (‘mediaSession’ in navigator) {
navigator.mediaSession.setActionHandler(‘play’, () => {
if (matrixActive && audio.paused) {
audio.play();
}
});

```
navigator.mediaSession.setActionHandler('pause', () => {
  if (matrixActive) {
    audio.pause();
  }
});

navigator.mediaSession.setActionHandler('nexttrack', () => {
  if (matrixActive) {
    playRandomTrack();
  }
});

navigator.mediaSession.setActionHandler('previoustrack', () => {
  if (matrixActive) {
    currentTrackIndex = Math.max(0, currentTrackIndex - 2);
    playRandomTrack();
  }
});
```

}
}

/**

- Shuffle playlist
  */
  function shufflePlaylist() {
  for (let i = shuffledPlaylist.length - 1; i > 0; i–) {
  const j = Math.floor(Math.random() * (i + 1));
  [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
  }
  }

/**

- Play random track from shuffled playlist
  */
  function playRandomTrack() {
  if (currentTrackIndex >= shuffledPlaylist.length) {
  shufflePlaylist();
  currentTrackIndex = 0;
  }

const track = shuffledPlaylist[currentTrackIndex];
currentTrackIndex++;

const audio = document.getElementById(‘easterEggAudio’);
audio.src = track.url;
audio.volume = 0;
audio.loop = false;

audio.play().then(() => {
// Update Media Session metadata
if (‘mediaSession’ in navigator) {
navigator.mediaSession.metadata = new MediaMetadata({
title: track.title,
artist: track.artist,
album: ‘Secret Stash’,
artwork: [
{ src: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/icons/nova.png’, sizes: ‘512x512’, type: ‘image/png’ }
]
});
}

```
// Fade in
let vol = 0;
const fadeIn = setInterval(() => {
  if (vol < 0.5) {
    vol += 0.05;
    audio.volume = Math.min(vol, 0.5);
  } else {
    clearInterval(fadeIn);
  }
}, 100);
```

}).catch(err => {
console.log(‘Audio play failed:’, err);
if (matrixActive) {
playRandomTrack();
}
});
}

/**

- Stop music with fade out
  */
  function stopMusic() {
  const audio = document.getElementById(‘easterEggAudio’);

if (!audio.paused) {
let vol = audio.volume;
const fadeOut = setInterval(() => {
if (vol > 0) {
vol -= 0.05;
audio.volume = Math.max(vol, 0);
} else {
clearInterval(fadeOut);
audio.pause();
audio.currentTime = 0;
}
}, 50);
}
}

/**

- Start Matrix animation
  */
  function startMatrix() {
  const canvas = document.getElementById(‘matrixCanvas’);
  const ctx = canvas.getContext(‘2d’);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

const msg = ‘CREATED BY RUDEBOY’;
const fontSize = Math.ceil(canvas.width / msg.length);
const drops = [];
const dropSpeeds = [];

for (let i = 0; i < msg.length; i++) {
drops[i] = Math.random() * -100;
dropSpeeds[i] = 0.5 + Math.random() * 1.5;
}

let messageMode = false;
let activeWords = [];
const words = [‘CREATED’, ‘BY’, ‘RUDEBOY’];
const wordStartPositions = [0, 8, 11];
const wordLengths = [7, 2, 7];
let messageTimer = 0;
const MESSAGE_INTERVAL = 30000;
let currentSpeed = 50;

function draw() {
if (messageMode) {
ctx.fillStyle = ‘rgba(0, 0, 0, 0.05)’;
} else {
ctx.fillStyle = ‘rgba(0, 0, 0, 0.25)’;
}
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = fontSize + ‘px monospace’;

```
if (!messageMode) {
  messageTimer += currentSpeed;
  if (messageTimer >= MESSAGE_INTERVAL) {
    messageMode = true;
    activeWords = [0];
    messageTimer = 0;
    for (let i = 0; i < msg.length; i++) {
      drops[i] = -100;
      dropSpeeds[i] = 1;
    }
    for (let i = 0; i < 7; i++) {
      drops[i] = 0;
    }
    clearInterval(matrixInterval);
    currentSpeed = 75;
    matrixInterval = setInterval(draw, currentSpeed);
  }
}

for (let i = 0; i < msg.length; i++) {
  let char;
  if (messageMode) {
    let shouldShow = false;
    for (let w of activeWords) {
      const wordStart = wordStartPositions[w];
      const wordEnd = wordStart + wordLengths[w];
      if (i >= wordStart && i < wordEnd) {
        char = msg[i];
        shouldShow = true;
        break;
      }
    }
    if (!shouldShow) {
      char = ' ';
    }
  } else {
    char = msg[i];
  }
  
  ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#764ba2';
  ctx.fillText(char, i * fontSize, drops[i] * fontSize);
  
  if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
    drops[i] = Math.random() * -100;
    if (!messageMode) {
      dropSpeeds[i] = 0.5 + Math.random() * 1.5;
    }
  }
  
  drops[i] += dropSpeeds[i];
}

if (messageMode) {
  if (activeWords.length === 1 && activeWords[0] === 0) {
    const createdMaxDrop = Math.max(...drops.slice(0, 7));
    if (createdMaxDrop * fontSize > canvas.height / 2) {
      activeWords.push(1);
      for (let j = 8; j < 10; j++) {
        drops[j] = 0;
      }
    }
  }
  if (activeWords.length === 2 && activeWords[1] === 1) {
    const byMaxDrop = Math.max(...drops.slice(8, 10));
    if (byMaxDrop * fontSize > canvas.height / 2) {
      activeWords.push(2);
      for (let j = 11; j < 18; j++) {
        drops[j] = 0;
      }
    }
  }
  if (activeWords.length === 3) {
    const rudeboyMaxDrop = Math.max(...drops.slice(11, 18));
    if (rudeboyMaxDrop * fontSize > canvas.height + fontSize * 5) {
      messageMode = false;
      activeWords = [];
      for (let j = 0; j < msg.length; j++) {
        drops[j] = Math.random() * -100;
        dropSpeeds[j] = 0.5 + Math.random() * 1.5;
      }
      clearInterval(matrixInterval);
      currentSpeed = 50;
      matrixInterval = setInterval(draw, currentSpeed);
    }
  }
}
```

}

matrixInterval = setInterval(draw, currentSpeed);
}

/**

- Stop Matrix animation
  */
  function stopMatrix() {
  if (matrixInterval) {
  clearInterval(matrixInterval);
  matrixInterval = null;
  }
  }