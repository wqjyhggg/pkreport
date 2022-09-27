var storage = window.localStorage
/*
if (storageAvailable('localStorage')) {
  // Yippee! We can use localStorage awesomeness
}
else {
  // Too bad, no localStorage for us
}

//potential fix for not enough storage
*/

const saveStorage = (key, value) => {
  storage.setItem(key, value)
  return value
}

const readStorage = (key) => {
  var value = storage.getItem(key)
  return value
}

const removeStorage = (key) => {
  storage.removeItem(key)
  return 1
}

const clearStorage = () => {
  storage.clear()
}

const resetRem = () => {
  let height = document.documentElement.clientHeight || document.body.clientHeight
  let width = document.documentElement.clientWidth || document.body.clientWidth
  let rem = parseInt(16 * height / 768)
  if (width < height) {
    rem = parseInt(16 * width / 768)
  }
  document.documentElement.style.fontSize = rem + 'px'
  return rem
}

export { saveStorage, readStorage, removeStorage, clearStorage, resetRem }
