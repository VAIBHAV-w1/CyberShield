const crypto = require('crypto');

const encrypt = (text, key, iv) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encrypted, key, iv) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const generateKeyAndIV = () => {
  const key = crypto.randomBytes(32); // 256 bits
  const iv = crypto.randomBytes(16); // 128 bits
  return { key, iv };
};

// New function to encrypt files securely
const encryptFile = (fileBuffer, key, iv) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
  return encrypted;
};

// New function to decrypt files securely
const decryptFile = (encryptedBuffer, key, iv) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return decrypted;
};

module.exports = { encrypt, decrypt, generateKeyAndIV, encryptFile, decryptFile };
