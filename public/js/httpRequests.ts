import axios from 'axios';

export const createClient = async (clientName: string) => {
  try {
    await axios({
      method: 'POST',
      url: 'api/v1/clients/',
      data: {
        name: clientName,
      },
    });
  } catch (error) {
    console.log(`Something went wrong when creating new client. Error: ${error}`);
  }
};
