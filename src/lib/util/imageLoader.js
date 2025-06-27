module.exports = function ({ src, width, quality }) {
  return `${src}?w=${width || 256}&q=${quality || 75}`
}
