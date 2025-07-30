// depending in what stage application is return different URLs
const returnUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.DEV_URL;
  } else if (process.env.NODE_ENV === 'production') {
    return process.env.PROD_URL;
  }
};

export default returnUrl;
