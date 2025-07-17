import axios, { type AxiosResponse } from 'axios';
import { Timer } from 'timer-node';

import returnWithZero from './utils/returnWithZero.ts';
import generatePDF from './utils/generatePDF.ts';

interface WorklogObject {
  title: string;
  time: number;
  rate: number;
  client: string;
}

const totalTime = document.getElementById('totalTime') as HTMLElement;
const downloadLink = document.getElementById('downloadLink') as HTMLLinkElement;
const timerField = document.getElementById('timerField') as HTMLHeadingElement;
const timerStartButton = document.getElementById('startTimer') as HTMLButtonElement;
const projectTitle = document.getElementById('projectTitle') as HTMLInputElement;
const projectsList = document.getElementById('projectsList') as HTMLUListElement;

let timer: Timer;
let interval: ReturnType<typeof setInterval>;

const insertContent = (data: WorklogObject) => {
  const content = `<li>${data.title} | ${new Date(data.time).toISOString().slice(11, -5)}</li>`;

  projectsList.insertAdjacentHTML('afterbegin', content);
};

const calculateTotalHours = async () => {
  const timeData: AxiosResponse = await axios.get('http://localhost:3000/api/v1/worklogs/total');

  const duration: string = timeData.data.data;
  const convertMsToTime = new Date(duration).toISOString().slice(11, -5);

  totalTime.textContent = convertMsToTime;

  generatePDF(convertMsToTime, downloadLink);
};

// Get total amount of hours from DATABASE
const gettingAllData = async () => {
  const worklogsData = await axios.get('http://localhost:3000/api/v1/worklogs');

  worklogsData.data.data.forEach((worklog: WorklogObject) => insertContent(worklog));

  calculateTotalHours();
};

const saveTimeToDB = async (time: number) => {
  const body: WorklogObject = {
    title: projectTitle.value,
    time,
    rate: 25,
    client: '684da4c57f7b0a3e60f94c63',
  };

  await axios.post('http://localhost:3000/api/v1/worklogs', body);

  calculateTotalHours();
  insertContent(body);

  projectTitle.value = '';
};

timerStartButton.addEventListener('click', function (this: HTMLButtonElement) {
  if (this.dataset.status === 'stoped') {
    this.textContent = 'STOP';
    this.dataset.status = 'started';

    timer = new Timer();

    timer.start();

    interval = setInterval(() => {
      const { s: seconds, m: minutes, h: hours } = timer.time();

      timerField.textContent = String(`${returnWithZero(hours)}:${returnWithZero(minutes)}:${returnWithZero(seconds)}`);
    }, 1000);
  } else if (this.dataset.status === 'started') {
    this.textContent = 'Start Timer!';
    this.dataset.status = 'stoped';

    clearInterval(interval);
    timerField.textContent = '00:00:00';

    timer.stop();

    // Save timer time to DATABASE
    saveTimeToDB(timer.ms());
  }
});

document.addEventListener('DOMContentLoaded', () => {
  gettingAllData();
});
