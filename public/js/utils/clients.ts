import axios from 'axios';

import type { ClientObject } from './interfaces.ts';

// Requesting and inserting Clients data
export const gettingAllClients = async (projectsList: HTMLSelectElement) => {
  const clients = await axios.get('http://localhost:3000/api/v1/users/me/clients');

  // Check if clients exists
  if (!clients) return;

  clients.data.data.forEach((client: ClientObject) => {
    const content = `<option value='${client.id}'>${client.name}</option>`;

    projectsList.insertAdjacentHTML('beforeend', content);
  });
};

export const createClient = async (
  clientName: string,
  projectsList: HTMLSelectElement,
  createClientForm: HTMLFormElement,
) => {
  try {
    await axios({
      method: 'POST',
      url: 'api/v1/clients/',
      data: {
        name: clientName,
      },
    });

    // find updated clients list
    const allClient = await axios.get('http://localhost:3000/api/v1/users/me/clients/');

    // find new created client
    const clientId = allClient.data.data.find((client: ClientObject) => client.name === clientName);

    // update UI content
    const content = `<option value='${clientId}'>${clientName}</option>`;
    projectsList.insertAdjacentHTML('beforeend', content);

    // clean and hide create client form
    clientName = '';
    createClientForm.style.display = 'none';
  } catch (error) {
    console.log(`Something went wrong when creating new client. Error: ${error}`);
  }
};

// when "Add new..." option is selected
export const addNewClient = (
  projectsList: HTMLSelectElement,
  createClientForm: HTMLFormElement,
) => {
  projectsList.addEventListener('change', (e: Event) => {
    const selectValue = (e.target as HTMLInputElement).value;
    if (selectValue === 'create') {
      createClientForm.style = 'visible';
    } else {
      // hide form is selecting another option
      createClientForm.style.display = 'none';
    }
  });
};
