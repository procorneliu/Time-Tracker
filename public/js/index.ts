import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { Timer } from 'timer-node';

// importing utils
import returnWithZero from './utils/returnWithZero.ts';
import generatePDF from './utils/generatePDF.ts';

import { login, logout } from './authFunctions.ts';
import { createClient } from './httpRequests.ts';

interface WorklogObject {
  title: string;
  time: number;
  rate: string;
  client: { [key: string]: any };
}

interface ClientObject {
  name: string;
  owner: { [key: string]: any };
  id: string;
}

const totalTime = document.getElementById('totalTime') as HTMLElement;
const downloadLink = document.getElementById('downloadLink') as HTMLLinkElement;
const timerField = document.getElementById('timerField') as HTMLHeadingElement;
const timerStartButton = document.getElementById('startTimer') as HTMLButtonElement;
const projectTitle = document.getElementById('projectTitle') as HTMLInputElement;
const projectRate = document.getElementById('projectRate') as HTMLInputElement;
const projectsList = document.getElementById('project-name') as HTMLSelectElement;
const tasksList = document.getElementById('startedTasks') as HTMLUListElement;
const createClientForm = document.querySelector('.creating__client') as HTMLDivElement;
const clientName = document.getElementById('clientName') as HTMLInputElement;
const createClientButton = document.getElementById('createClient') as HTMLButtonElement;

const loginForm = document.querySelector('.form__login') as HTMLFormElement;
const logoutButton = document.querySelector('.logout') as HTMLButtonElement;

let timer: Timer;
let interval: ReturnType<typeof setInterval>;

const insertContent = async () => {
  try {
    const worklogs = await axios.get('http://localhost:3000/api/v1/users/me/worklogs');
    const clients = await axios.get('http://localhost:3000/api/v1/users/me/clients');

    // Check if work logs or clients exists
    if (!worklogs.data.data || !clients.data.data) return;

    tasksList.innerHTML = '';

    worklogs.data.data.forEach((worklog: WorklogObject) => {
      // const content = `<li>${worklog.title} | ${new Date(worklog.time).toISOString().slice(11, -5)} | </li>`;
      const content = `<li>${worklog.title} | rate: $${worklog.rate} | ${new Date(worklog.time).toISOString().slice(11, -5)} | ${worklog.client.name}</li>`;
      tasksList.insertAdjacentHTML('afterbegin', content);
    });

    clients.data.data.forEach((client: ClientObject) => {
      const content = `<option value='${client.id}'>${client.name}</option>`;

      projectsList.insertAdjacentHTML('beforeend', content);
    });

    projectsList.addEventListener('change', (e: Event) => {
      const selectValue = (e.target as HTMLInputElement).value;
      if (selectValue === 'create') {
        createClientForm.style = 'visible';
      }
    });
  } catch (err: any) {
    if (err.status === 401) {
      window.location.href = 'http://localhost:3000/login';
    }
    console.log(err);
  }
};

const calculateTotalHours = async () => {
  const timeData: AxiosResponse = await axios.get('http://localhost:3000/api/v1/worklogs/total');
  if (!timeData.data.data) return;

  const duration: string = timeData.data.data;

  const convertMsToTime = new Date(duration).toISOString().slice(11, -5);

  totalTime.textContent = convertMsToTime;

  generatePDF(convertMsToTime, downloadLink);
};

// Get total amount of hours from DATABASE
const gettingAllData = async () => {
  insertContent();
  calculateTotalHours();
};

const saveTimeToDB = async (time: number) => {
  const body: WorklogObject = {
    title: projectTitle.value,
    time,
    rate: projectRate.value,
    client: { _id: projectsList.value },
  };

  const sameNameProject = await axios.get(
    `http://localhost:3000/api/v1/worklogs?title=${body.title}&sort=createdAt`,
  );
  const foundProject = sameNameProject.data.data[0];

  if (foundProject && new Date(foundProject.createdAt).getDate() === new Date().getDate()) {
    await axios.patch(`http://localhost:3000/api/v1/worklogs/${foundProject._id}`, {
      time: foundProject.time + body.time,
    });
  } else {
    await axios.post('http://localhost:3000/api/v1/worklogs', body);
  }

  calculateTotalHours();
  insertContent();

  projectTitle.value = '';
  projectRate.value = '';
};

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    login(email, password);
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    logout();
  });
}

if (timerStartButton) {
  timerStartButton.addEventListener('click', function (this: HTMLButtonElement) {
    if (this.dataset.status === 'stoped') {
      this.textContent = 'STOP';
      this.dataset.status = 'started';

      timer = new Timer();

      timer.start();

      interval = setInterval(() => {
        const { s: seconds, m: minutes, h: hours } = timer.time();

        timerField.textContent = String(
          `${returnWithZero(hours)}:${returnWithZero(minutes)}:${returnWithZero(seconds)}`,
        );
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
}

if (createClientButton) {
  createClientButton.addEventListener('click', async (e) => {
    e.preventDefault();

    createClient(clientName.value);

    const allClient = await axios.get('http://localhost:3000/api/v1/users/me/clients/');

    const clientId = allClient.data.data.find(
      (client: ClientObject) => client.name === clientName.value,
    );

    const content = `<option value='${clientId}'>${clientName.value}</option>`;
    projectsList.insertAdjacentHTML('beforeend', content);

    clientName.value = '';
    createClientForm.style.display = 'none';
  });
}

if (window.location.pathname === '/') {
  document.addEventListener('DOMContentLoaded', () => {
    gettingAllData();
  });
}
