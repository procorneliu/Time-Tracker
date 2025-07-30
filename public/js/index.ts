// importing utils
import generatePDF from './utils/generatePDF.ts';
import calculateTotalHours from './utils/calculateTotalHours.ts';
import { login, signup, logout } from './utils/authRequests.ts';
import { saveTimeToDB } from './utils/saveTimeToDB.ts';
import { startTimer, stopTimer } from './utils/timer.ts';
import { gettingAllWorklogs } from './utils/worklogs.ts';
import {
  gettingAllClients,
  createClient,
  addNewClient,
} from './utils/clients.ts';

// Referencing HTML elements from DOM
const timerStartButton = document.getElementById(
  'startTimer',
) as HTMLButtonElement;
const projectTitle = document.getElementById(
  'projectTitle',
) as HTMLInputElement;
const projectRate = document.getElementById('projectRate') as HTMLInputElement;
const projectsList = document.getElementById(
  'project-name',
) as HTMLSelectElement;
const clientName = document.getElementById('clientName') as HTMLInputElement;
const goToPageButton = document.getElementById('goToPage') as HTMLButtonElement;
const createClientButton = document.getElementById(
  'createClient',
) as HTMLButtonElement;
const createClientForm = document.querySelector(
  '.creating__client',
) as HTMLFormElement;
const loginForm = document.querySelector('.form__login') as HTMLFormElement;
const signupForm = document.querySelector('.form__signup') as HTMLFormElement;
const logoutButton = document.querySelector('.logout') as HTMLButtonElement;

// Clearing fields
const clearFields = () => {
  projectTitle.value = '';
  projectRate.value = '';
};

// loading and showing all data content to UI
const gettingAndInsertingAllContent = async () => {
  try {
    // reqeusting worklost and clients data from DB
    gettingAllWorklogs();
    gettingAllClients(projectsList);

    // show creating new client form when selecting option "Add new..."
    addNewClient(projectsList, createClientForm);

    const time = await calculateTotalHours();
    generatePDF(time!);
  } catch (err: any) {
    // if unauthorized go to login page
    if (err.status === 401) {
      window.location.href = `http://${window.location.host}/login`;
    }
  }
};

// Add login functionalities if you are on login page
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;

    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement)
      .value;
    const passwordConfirm = (
      document.getElementById('passwordConfirm') as HTMLInputElement
    ).value;

    signup(name, email, password, passwordConfirm);
  });
}

// Log out functionality
if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    logout();
  });
}

// If you are on signup page show login redirect and viceversa
if (goToPageButton) {
  goToPageButton.addEventListener('click', () => {
    if (goToPageButton.dataset.set === 'login') {
      window.location.href = `http://${window.location.host}/login`;
    } else if (goToPageButton.dataset.set === 'signup') {
      window.location.href = `http://${window.location.host}/signup`;
    }
  });
}

// Toggle timer button functionalities
if (timerStartButton) {
  timerStartButton.addEventListener(
    'click',
    async function (this: HTMLButtonElement) {
      // if timer is stopped
      if (this.dataset.status === 'stopped') {
        startTimer(this);
      } else if (this.dataset.status === 'started') {
        const timeMs = await stopTimer(this);

        // Save timer time to DATABASE
        console.log(projectsList.value);
        await saveTimeToDB(
          projectTitle.value,
          timeMs,
          projectRate.value,
          projectsList.value,
        );

        // refresh all content
        gettingAndInsertingAllContent();
        clearFields();
      }
    },
  );
}

if (createClientButton) {
  createClientButton.addEventListener('click', async (e) => {
    e.preventDefault();

    // creating and saving to DB new client using user input
    createClient(clientName.value, projectsList, createClientForm);
  });
}

// Loading all content after DOM was loaded
if (window.location.pathname === '/') {
  document.addEventListener('DOMContentLoaded', () => {
    gettingAndInsertingAllContent();
  });
}
