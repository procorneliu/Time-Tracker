import axios from 'axios';

export const login = async (email: string, password: string) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
  } catch {
    console.log('Something with login went wrong');
  }
};
