import axios, { type AxiosResponse } from 'axios';
import generatePDF from './utils/generatePDF.ts';
import returnWithZero from './utils/returnWithZero.ts';
import { Timer } from 'timer-node';

const timeField: HTMLElement = document.getElementById('totalTime')!;
const downloadLink = document.getElementById('downloadLink') as HTMLLinkElement;
const timerField = document.getElementById('timerField') as HTMLHeadingElement;
const timerStartButton = document.getElementById('startTimer') as HTMLButtonElement;

// Get total amount of hours from DATABASE
const calculateTotalTime = async () => {
  const data: AxiosResponse = await axios.get('http://localhost:3000/api/v1/worklogs/total');
  const totalHours: string = data.data.data;

  timeField.textContent = totalHours;

  generatePDF(totalHours, downloadLink);
};

calculateTotalTime();

timerStartButton.addEventListener('click', () => {
  const timer = new Timer({ label: 'demo' });

  timer.start();

  // timerField.textContent = String(timer.time());
  setInterval(() => {
    const { s: seconds, m: minutes, h: hours } = timer.time();

    timerField.textContent = String(`${returnWithZero(hours)}:${returnWithZero(minutes)}:${returnWithZero(seconds)}`);
  }, 1000);
});
