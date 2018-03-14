const {BrowserWindow, app} = require('electron').remote;
const path = require('path');
const Vue = require('vue');

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
    s = c + s;
  }
  return s;
}

new Vue({
  el: '#app',
  data: {
    startedAt: null,
    time: null,
    timerId: null,
    display: '00:00',
  },
  computed: {
    display_() {
      if (this.startAt == null) {
        return '00:00';
      }
      const rest = Math.floor((this.startAt + this.time - this.now) / 1000);
      if (rest <= 0) {
        return '00:00';
      }
      const s = Math.max(0, rest % 60);
      const m = Math.max(0, Math.floor(rest / 60));
      return `${pad(m, 2, '0')}:${pad(s, 2, '0')}`;
    },
  },
  methods: {
    startTimer(minutes) {
      if (this.startedAt != null) {
        return;
      }

      this.startedAt = new Date().getTime();
      this.time = minutes * 60000;
      this.timerId = setInterval(() => {
        const now = new Date().getTime();
        const rest = this.time + this.startedAt - now;
        const seconds = Math.floor(rest / 1000);
        const s = Math.max(0, seconds % 60);
        const m = Math.max(0, Math.floor(seconds / 60));
        this.display = `${pad(m, 2, '0')}:${pad(s, 2, '0')}`;
        if (now - this.startedAt >= this.time) {
          clearInterval(timerId);
          this.startedAt = null;
          sound.play();
          app.focus();
        }
      }, 250);
    },

    stopTimer() {
      if (this.startedAt == null) {
        return;
      }

      clearInterval(this.timerId);
      this.startedAt = null;
      this.display = '00:00';
    },
  },
  render(h) {
    return h('div', [
      h('h1', 'Pomodoro Timer'),
      h('p', this.display),
      h(
        'div',
        this.startedAt == null
          ? [
              h(
                'button',
                {
                  on: {
                    click: () => {
                      this.startTimer(25);
                    },
                  },
                },
                'pomodoro'
              ),
              h(
                'button',
                {
                  on: {
                    click: () => {
                      this.startTimer(5);
                    },
                  },
                },
                'short break'
              ),
            ]
          : [
              h(
                'button',
                {
                  on: {
                    click: () => {
                      this.stopTimer();
                    },
                  },
                },
                'stop'
              ),
            ]
      ),
    ]);
  },
});
