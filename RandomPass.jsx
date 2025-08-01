function generatePassword(length = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let Password = '';
  for (let i = 0; i < length; i++) {
    Password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return Password;
}

const Password = generatePassword(12); // Generates a 12-character password
console.log(Password);

module.exports = {generatePassword}