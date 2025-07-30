import axios from 'axios';

import type { WorklogObject } from './interfaces.ts';
import returnUrl from '../../../utils/returnUrl.ts';

const tasksList = document.getElementById('startedTasks') as HTMLUListElement;

// Requesting and inserting Worklogs data
export const gettingAllWorklogs = async () => {
  const worklogs = await axios.get(
    `http://${returnUrl()}/api/v1/users/me/worklogs`,
  );

  // Check if work logs exists
  if (!worklogs.data.data) return;

  // emptying worklogs list from UI
  tasksList.innerHTML = '';

  // for each found worklog insert into task list
  worklogs.data.data.forEach((worklog: WorklogObject) => {
    const content = `<li>${worklog.title ? `${worklog.title} |` : ''} ${worklog.rate ? `rate: $${worklog.rate} |` : ''} ${new Date(worklog.time).toISOString().slice(11, -5)} ${worklog.client ? `| ${worklog.client.name}` : ''}</li>`;

    tasksList.insertAdjacentHTML('afterbegin', content);
  });
};
