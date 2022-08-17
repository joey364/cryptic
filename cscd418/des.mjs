// const crypto = require('crypto')
import crypto from 'crypto'
import fs from 'fs'

/**
 * Encrypt 3DES using Node.js's crypto module *
 * @param {string | buffer} data A utf8 string
 * @param {string | buffer} key Key would be hashed by md5 and shorten to maximum of 192 bits,
 * @returns {*} A base64 string
 */
function encrypt3DES(data, key) {
  const md5Key = crypto
    .createHash('md5')
    .update(key)
    .digest('hex')
    .substring(0, 24)
  const cipher = crypto.createCipheriv('des-ede3', md5Key, '')

  let encrypted = cipher.update(data, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

/**
 * Decrypt 3DES using Node.js's crypto module
 * @param data a base64 string
 * @param key Key would be hashed by md5 and shorten to max 192 bits,
 * @returns {*} a utf8 string
 */
function decrypt3DES(data, key) {
  const md5Key = crypto
    .createHash('md5')
    .update(key)
    .digest('hex')
    .substring(0, 24)
  const decipher = crypto.createDecipheriv('des-ede3', md5Key, '')

  let encrypted = decipher.update(data, 'base64', 'utf8')
  encrypted += decipher.final('utf8')
  return encrypted
}

function saveEncryptedData(encryptedData, filepath) {
  fs.writeFileSync(filepath, encryptedData)
}

////////////////////////////////////////////////////////////////////////////////////
const filepath = './mess200.txt'

const data = fs.readFileSync(filepath)
const key = 'bikini bottom'

const encrypted = encrypt3DES(data, key)
console.log(encrypted)
saveEncryptedData(encrypted, filepath + '.enc-des')

const decrypted = decrypt3DES(encrypted, key)
console.log(decrypted)
