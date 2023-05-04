const isValidEmail = (email) => {
  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return email !== "" && emailFormat.test(email);
};

module.exports = isValidEmail;
