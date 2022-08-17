import crypto from 'crypto'
import fs from 'fs'

const [PRIVATE_KEY, PUBLIC_KEY] = generateKeyPair()

function generateKeyPair() {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    // key size can encrypt file sizes up to 2 kilobytes
    modulusLength: 16384,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  })
  return [privateKey, publicKey]
}

function saveEncryptedData(encryptedData, filepath) {
  fs.writeFileSync(filepath, encryptedData)
}

function encrypt(data, privateKey) {
  const encrypted = crypto.privateEncrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
      oeapHash: 'sha256',
    },
    data
  )
  return encrypted
}

function decrypt(data, publicKey) {
  const decrypted = crypto.publicDecrypt(
    {
      key: publicKey,
      encoding: 'utf8',
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    data
  )
  return decrypted
}

function readFileData(filepath) {
  try {
    // check if file exists
    fs.accessSync(filepath)

    // read file contents
    const fileBuffer = fs.readFileSync(filepath)
    return fileBuffer
  } catch (err) {
    // file does not exist
    console.log(err.message)
  }
}
/////////////////////////////////////////////////////////////////////////////////////

const largeFilePath = './mess200.txt'

const fileContents = readFileData(largeFilePath)
const encrypted = encrypt(fileContents, PRIVATE_KEY)

saveEncryptedData(encrypted, largeFilePath + '.enc-rsa')

const decrypted = decrypt(encrypted, PUBLIC_KEY)

console.log(decrypted.toString('utf8'))
