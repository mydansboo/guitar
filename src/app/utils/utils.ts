export const indicesOf = (str, chars) => {
  const indices = []
  for (let i = 0; i < str.length; i++) {
    const sub = str.substring(i)
    if (sub.startsWith(chars)) {
      indices.push(i)
    }
  }
  return indices
}

export const getMatches = (str, regex) => {
  const matches = []
  let match = regex.exec(str)
  while (match != null) {
    matches.push(match[1])
    match = regex.exec(str)
  }
  return matches
}
