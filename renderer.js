const {BrowserWindow, app} = require('electron').remote;
const path = require('path');

const display = document.getElementById('display');
const buttonToStartPomodoro = document.getElementById('start-pomodoro');
const buttonToStartShortBreak = document.getElementById('start-short-break');

let currentTimer;

const sound = new Audio('./sound.mp3');

function pad(s, n, c) {
  if (typeof s !== 'string') {
    s = String(s);
  }
  while (s.length < n) {
    s += c;
  }
  return s;
}

function startTimer(minutes) {
  if (currentTimer) {
    return;
  }

  currentTimer = {
    startedAt: new Date().getTime(),
    time: minutes * 60000,
    timerId: setInterval(() => {
      const now = new Date().getTime();
      const rest = currentTimer.time + currentTimer.startedAt - now;
      const seconds = Math.floor(rest / 1000);
      const s = Math.max(0, seconds % 60);
      const m = Math.max(0, Math.floor(seconds / 60));
      display.innerText = `${pad(m, 2, '0')}:${pad(s, 2, '0')}`;
      if (now - currentTimer.startedAt >= currentTimer.time) {
        clearInterval(currentTimer.timerId);
        currentTimer = null;
        currentTimer;
        sound.play();
        app.focus();
      }
    }, 250),
  };
}

buttonToStartPomodoro.addEventListener('click', () => {
  startTimer(25);
});

buttonToStartShortBreak.addEventListener('click', () => {
  startTimer(5);
});
