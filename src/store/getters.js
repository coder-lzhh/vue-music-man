export function currentSong(state) {
  return state.playlist[state.currentIndex] || {}
}