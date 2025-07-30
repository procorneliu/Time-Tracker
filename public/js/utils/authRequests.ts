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
    window.location.href = `http://${window.location.host}/`;
  } catch {
    console.log('Something with login went wrong');
    location.reload();
  }
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  passwordConfirm: string,
) => {
  try {
    await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    window.location.href = `http://${window.location.host}/`;
  } catch (err: any) {
    console.log(
      'Something went wrong with signup a new user. Error:',
      err.response.data.message,
    );
  }
};

export const logout = async () => {
  try {
    await axios({
      method: 'POST',
      url: '/api/v1/users/logout',
    });
    window.location.href = `http://${window.location.host}/login`;
  } catch (err: any) {
    console.log(
      'Something went wrong with logout. Error:',
      err.response.data.message,
    );
  }
};
