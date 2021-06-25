import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'


export function selectPlay({ commit }, { list, index }) {
  commit('setPlayingState', true)
  commit('setSequenceList', list)
  commit('setPlaylist', list)
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setCurrentIndex', index)
  commit('setFullScreen', true)
}
export function randomPlay({ commit }, list) {
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setSequenceList', list)
  commit('setPlaylist', shuffle(list))
  commit('setPlayMode', PLAY_MODE.random)
  commit('setCurrentIndex', 0)
}
export function removeSong({ commit, state }, song) {
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()
  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playlist, song)

  sequenceList.splice(sequenceIndex, 1)
  playlist.splice(playIndex, 1)

  let currentIndex = state.currentIndex

  if (playIndex < currentIndex || playIndex === playlist.length) {
    currentIndex--
  }

  commit('setCurrentIndex', currentIndex)
  commit('setPlaylist', playlist)
  commit('setSequenceList', sequenceList)

  if (!playlist.length) {
    commit('setPlayingState', false)
  }

}
export function clearSongList({ commit },) {
  commit('setPlaylist', [])
  commit('setSequenceList', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}
function findIndex(list, song) {
  return list.findIndex(item => item.id === song.id)
}
export function changeMode({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id

  if (mode === PLAY_MODE.random) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }
  const index = state.playlist.findIndex(item => item.id === currentId)
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}


