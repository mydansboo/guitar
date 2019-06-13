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
