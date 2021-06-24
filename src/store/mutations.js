
const mutations = {
  setPlayingState(state, playing) {
    state.playing = playing
  },
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  setCurrentIndex(state, currentIndex) {
    state.currentIndex = currentIndex
  },
  setPlayMode(state, playMode) {
    state.playMode = playMode
  },
  setPlaylist(state, playlist) {
    state.playlist = playlist
  },
  setSequenceList(state, sequenceList) {
    state.sequenceList = sequenceList
  },
  setFavoriteList(state, favoriteList) {
    state.favoriteList = favoriteList
  },

}




export default mutations