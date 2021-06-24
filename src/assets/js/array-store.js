import storage from 'good-storage'

function insertArray(arr, item, compare, maxlen) {
  const index = arr.findIndex(compare)
  if (index == 0) return
  if (index > -1) {
    arr.splice(index, 1)
  }
  arr.unshift(item)
  if (maxlen && arr.lenth > maxlen) {
    arr.pop()
  }
}
function deleteItem(arr, compare) {
  const index = arr.findIndex(compare)

  if (index > -1) {
    arr.splice(index, 1)
  }

}

export function save(item, key, compare, maxlen) {
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxlen)
  storage.set(key, items)
  return items
}
export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteItem(items, compare)
  storage.set(key, items)
  return items
}
export function load(key) {
  return storage.get(key, [])
}


