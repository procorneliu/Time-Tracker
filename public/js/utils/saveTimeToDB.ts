import axios from 'axios';
import type { WorklogObject } from './interfaces.ts';
import returnUrl from '../../../utils/returnUrl.ts';

export const saveTimeToDB = async (
  projectTitle: string,
  time: number,
  projectRate: string,
  projectsList: string,
) => {
  const body: WorklogObject = {
    title: projectTitle,
    time,
    rate: projectRate,
  };

  // checking if project with same name exists
  const sameNameProject = await axios.get(
    `http://${returnUrl()}/api/v1/worklogs?title=${body.title}&sort=createdAt`,
  );
  const foundProject = sameNameProject.data.data[0];

  // only if user selected a client for project
  if (projectsList) {
    body.client = { _id: projectsList };
  }

  if (
    foundProject &&
    new Date(foundProject.createdAt).getDate() === new Date().getDate()
  ) {
    await axios.patch(
      `http://${returnUrl()}/api/v1/worklogs/${foundProject.id}`,
      {
        time: foundProject.time + body.time,
      },
    );
  } else {
    await axios.post(`http://${returnUrl()}/api/v1/worklogs`, body);
  }
};
