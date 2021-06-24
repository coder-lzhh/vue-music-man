export function shuffle(list) {
  const arr = list.slice()
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

function swap(list, i, j) {
  let item = list[i]
  list[i] = list[j]
  list[j] = item
}

export function formatTime(interval = 0) {
  interval = interval | 0
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = (interval % 60 + '').padStart(2, '0')
  return `${minute}:${second}`
}
