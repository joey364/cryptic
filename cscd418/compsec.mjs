import crypto from 'crypto'
import fs from 'fs'

const symmetricAlgorithms = {
  AES: 'aes-256-cbc',
}

const SEC_KEY = crypto.randomBytes(32)
const INIT_VECTOR = crypto.randomBytes(16)

function readFileData(filepath) {
  try {
    // check if file exists
    fs.accessSync(filepath)

    // read file contents
    const fileBuffer = fs.readFileSync(filepath)
    return fileBuffer
  } catch (err) {
    console.log(err.message)
  }
}

function symmetricEncrypt(key, data) {
  const cipher = crypto.createCipheriv(
    symmetricAlgorithms.AES,
    key,
    INIT_VECTOR
  )
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

function symmetricDecrypt(key, data) {
  const decipher = crypto.createDecipheriv(
    symmetricAlgorithms.AES,
    key,
    INIT_VECTOR
  )
  let decrypted = decipher.update(data, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

function saveEncryptedData(encryptedData, filepath) {
  fs.writeFileSync(filepath, encryptedData)
}

/////////////////////////////////////////////////////////////////////////////////

const filepath = './mess200.txt'

const data = readFileData(filepath)
const encrypted = symmetricEncrypt(SEC_KEY, data)

saveEncryptedData(encrypted, filepath + '.enc-aes')

const decrypted = symmetricDecrypt(SEC_KEY, encrypted)
console.log(decrypted)
