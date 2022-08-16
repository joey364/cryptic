// Implement a program that will allow a user (sender) to first create a message digest of a
// plaintext and secondly add a digital signature to the message digest.
import crypto from 'crypto'
import fs from 'fs'

const [PRIVATE_KEY, PUBLIC_KEY] = generateKeyPair()

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

function createDigest(filename) {
  // let digest = null

  const hash = crypto.createHash('sha256')

  const stream = fs.createReadStream(filename)

  stream.on('readable', () => {
    // Only one element is going to be produced by the
    // hash stream.
    const data = stream.read()
    if (data) hash.update(data)
  })

  // const digest = crypto.createHash('sha256').update('key').digest('base64')
  return hash.copy().digest('base64')
}

function createSignatureOnDigest(digest) {
  const sign = crypto.createSign('sha256')

  sign.update(digest)
  sign.end()

  const signature = sign.sign(PRIVATE_KEY)

  return signature
}

const digest = createDigest('./message.txt')
console.log(digest)
// console.log(generateKeyPair())
console.log(createSignatureOnDigest(digest))

// At the receiver’s end, the digital signature has to be decrypted to obtain the message digest. The
// receiver also creates another digest using the plaintext and compares the created digest with
// the digest sent by the sender to see if it has not been compromised.

function verifySignature(digest, signature) {
  const verify = crypto.createVerify('sha256')

  verify.update(digest)
  verify.end()

  return verify.verify(PUBLIC_KEY, Buffer.from(signature))
}

const signature = createSignatureOnDigest(digest)
console.log(verifySignature(digest, signature))

module.exports = {
  generateKeyPair,
  createSignatureOnDigest,
}
