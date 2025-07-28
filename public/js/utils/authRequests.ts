import axios from 'axios';

export const login = async (email: string, password: string) => {
  try {
    await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    window.location.href = 'http://localhost:3000/';
  } catch {
    console.log('Something with login went wrong');
    location.reload();
  }
};

export const logout = async () => {
  try {
    await axios({
      method: 'POST',
      url: '/api/v1/users/logout',
    });
    window.location.href = 'http://localhost:3000/login';
  } catch {
    console.log('Something went wrong with logout');
  }
};
