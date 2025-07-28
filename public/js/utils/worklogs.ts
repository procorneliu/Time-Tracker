import axios from 'axios';

import type { WorklogObject } from './interfaces.ts';

const tasksList = document.getElementById('startedTasks') as HTMLUListElement;

// Requesting and inserting Worklogs data
export const gettingAllWorklogs = async () => {
  const worklogs = await axios.get('http://localhost:3000/api/v1/users/me/worklogs');

  // Check if work logs exists
  if (!worklogs.data.data) return;

  // emptying worklogs list from UI
  tasksList.innerHTML = '';

  // for each found worklog insert into task list
  worklogs.data.data.forEach((worklog: WorklogObject) => {
    const content = `<li>${worklog.title} | rate: $${worklog.rate} | ${new Date(worklog.time).toISOString().slice(11, -5)} | ${worklog.client.name}</li>`;

    tasksList.insertAdjacentHTML('afterbegin', content);
  });
};
