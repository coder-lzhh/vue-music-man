import { useStore } from "vuex";
import { computed } from "vue";
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'
const maxLen = 100

export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  console.log(favoriteList)

  function favoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function toggleFavorite(song) {
    let list
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)

    function compare(item) {
      return item.id === song.id
    }
  }

  function isFavorite(song) {
    return favoriteList.value.findIndex(item => item.id === song.id) > -1
  }


  return { favoriteIcon, toggleFavorite }
}