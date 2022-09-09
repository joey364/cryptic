// shouldn't be this simple
function pickValues(p, g) {
  return [p, g]
}

// shouldn't be this simple
function pickPrivateValues(a, b) {
  return [a, b]
}

export default function diffieHellman(p, g, a, b) {
  const [prime, generator] = pickValues(p, g)
  const [sender, receiver] = pickPrivateValues(a, b)

  const x = Math.pow(generator, sender) % prime
  const y = Math.pow(generator, receiver) % prime

  return [x, y]
}
