const bcrypt = require('bcrypt');

const validPassword = (password, hash, salt) => {
  const convertedPwd = bcrypt.hashSync(password, salt);
  return convertedPwd === hash;
};

const generatePassword = (password) => {
  const SALT_ROUNDS = 10;
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hashedPassword = bcrypt.hashSync(password, salt);

  return hashedPassword;
};

module.exports = { generatePassword, validPassword };
