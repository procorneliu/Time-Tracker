import axios from 'axios';
import type { WorklogObject } from './interfaces.ts';

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
    client: { _id: projectsList },
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
};
