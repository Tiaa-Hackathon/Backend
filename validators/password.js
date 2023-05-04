const isStrongPassword = (password) => {
  /**
   * 8 to 15 characters
   * least one lowercase letter
   * one uppercase letter
   * one numeric digit
   * one special character
   */
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  return passwordRegex.test(password);
};

module.exports = isStrongPassword;
