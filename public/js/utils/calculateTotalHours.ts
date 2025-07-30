import axios, { type AxiosResponse } from 'axios';

const totalTime = document.getElementById('totalTime') as HTMLElement;

// Get total amount of hours from DATABASE
const calculateTotalHours = async () => {
  const timeData: AxiosResponse = await axios.get(
    `http://${window.location.host}/api/v1/worklogs/total`,
  );
  if (!timeData.data.data) return;

  const duration: string = timeData.data.data;

  // convert to human readable time
  const convertMsToTime = new Date(duration).toISOString().slice(11, -5);

  totalTime.textContent = convertMsToTime;

  return convertMsToTime;
};

export default calculateTotalHours;
