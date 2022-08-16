// filename: runner.mjs
import crypto from 'crypto'
import fs from 'fs'

/**
 * @typedef {Object} User
 * @property {string} name - User's name
 * @property {string} publicKey - User's publick key
 * @property {string} privateKey - User's private key
 */

/**
 * User class
 */
class User {
  /**
   * Creates a new user
   * @param {string} name User's name
   */
  constructor(name) {
    const [privateKey, publicKey] = generateKeyPair()

    /**
     * @property {string} name User's name
     */
    this.name = name
    /**
     * @property {string} publicKey User's public key
     */
    this.publicKey = publicKey
    /**
     * @property {string} privateKey User's private key
     */
    this.privateKey = privateKey
  }

  /**
   * Creates digest of a message file
   * @param {string} filepath Path to the message file
   * @returns {string} Digest of the message file contents
   */
  createDigest(filepath) {
    const hash = crypto.createHash('sha256')

    // create a hash of the file contents
    const fileBuffer = fs.readFileSync(filepath)
    hash.update(fileBuffer)

    return hash.copy().digest('hex')
  }

  /**
   * Signs digest of a message file
   * @param {string} digest Digest of the message file
   * @returns {Buffer} Signature of the message file digest
   */
  createSignatureOnDigest(digest) {
    const sign = crypto.createSign('sha256')

    sign.update(digest)
    sign.end()

    const signature = sign.sign(this.privateKey)

    return signature
  }

  /**
   * Verify signature of a message file
   * @param {User} sender User who created the digest
   * @param {string} digest Digest of the message file
   * @param {Buffer} signature Signature of the message file digest
   * @returns {boolean} True if the signature is valid, false otherwise
   */
  verifySignature(sender, digest, signature) {
    const verify = crypto.createVerify('sha256')

    verify.update(digest)
    verify.end()

    // verify the signamture using the sender's public key
    return verify.verify(sender.publicKey, Buffer.from(signature))
  }
}

/**
 * Generates public and private key pair
 * @returns {string[]} Array containing public and private key pair
 */
function generateKeyPair() {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  })
  return [privateKey, publicKey]
}

/**
 * Verifies message integrity
 * @param {string} senderDigest Path to the message file
 * @param {string} receiverDigest Digest of the message file
 * @returns {boolean} True if the message is unchanged, false otherwise
 */
function verifyMessage(senderDigest, receiverDigest) {
  return senderDigest === receiverDigest
}

/** Modifies message file
 * @param {string} filepath Path to the message file
 * @param {string} data Data to append to message file
 */
function modifyMessage(filepath, data) {
  fs.appendFileSync(filepath, data, 'utf-8', (error) => {
    if (error) throw error
    console.log(`${file} has been modified`)
  })
}

/////////////////////
// tests

const sender = new User('Alice')
const receiver = new User('Bob')

const filepath = './message.txt'

const senderDigest = sender.createDigest(filepath)
console.log('sender digest:', senderDigest)

const senderSignature = sender.createSignatureOnDigest(senderDigest)
console.log('sender signature on digest:', senderSignature.toString('hex'))

// mocking the message being modified by a third party
console.log('modifying message...')
modifyMessage(filepath, 'message intercepted')

const signatureVerification = receiver.verifySignature(
  sender,
  senderDigest,
  senderSignature
)
console.log('signature verification:', signatureVerification)

const receiverDigest = receiver.createDigest(filepath)
console.log('receiver digest:', receiverDigest)

// should return false because the message has been modified
const messageVerification = verifyMessage(senderDigest, receiverDigest)
console.log('message verification:', messageVerification)
