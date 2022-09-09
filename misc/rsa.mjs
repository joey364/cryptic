import crypto from 'crypto'

const PRIME_BIT_SIZE = 8

function gcd(a, b) {
  if (b == 0) return a
  return gcd(b, a % b)
}

function generateRandomPrimePair() {
  const primeA = crypto.generatePrimeSync(PRIME_BIT_SIZE, { bigint: true })
  const primeB = crypto.generatePrimeSync(PRIME_BIT_SIZE, { bigint: true })

  return [primeA, primeB]
}

function phi(p, q) {
  return (p - 1) * (q - 1)
}

function rsa() { }

console.log(generateRandomPrimePair())
