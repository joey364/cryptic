import crypto from 'node:crypto'

const curve = crypto.createECDH('prime256v1')
curve.generateKeys('hex', 'uncompressed')

const [publicKey, privateKey] = [curve.getPublicKey(), curve.getPrivateKey()]

// console.log('publicKey:', publicKey.toString('hex'))
// console.log('privateKey:', privateKey.toString('hex'))

const data = Buffer.from('Hello Bitches!')

// const encrypted = crypto.publicEncrypt(publicKey.toString('utf8'), data)

console.log(publicKey.toString('hex'))
// console.log(encrypted)
