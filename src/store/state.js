import { PLAY_MODE } from '@/assets/js/constant'
import { FAVORITE_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'
const states = {
  sequenceList: [],
  playlist: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false,
  favoriteList: load(FAVORITE_KEY)
}

export default states