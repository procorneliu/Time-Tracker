import { Timer } from 'timer-node';

import returnWithZero from './returnWithZero.ts';

const timerField = document.getElementById('timerField') as HTMLHeadingElement;

let timer: Timer;
let interval: ReturnType<typeof setInterval>;

export const startTimer = (element: HTMLButtonElement) => {
  element.textContent = 'STOP';
  element.dataset.status = 'started';

  timer = new Timer();
  timer.start();

  interval = setInterval(() => {
    const { s: seconds, m: minutes, h: hours } = timer.time();

    timerField.textContent = String(
      `${returnWithZero(hours)}:${returnWithZero(minutes)}:${returnWithZero(seconds)}`,
    );
  }, 1000);
};

export const stopTimer = async (element: HTMLButtonElement) => {
  element.textContent = 'Start Timer!';
  element.dataset.status = 'stopped';

  clearInterval(interval);
  timerField.textContent = '00:00:00';

  timer.stop();

  return timer.ms();
};
