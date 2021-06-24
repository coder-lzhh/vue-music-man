import { computed, ref } from "vue";
export default function (props, groupRef) {
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.data.map(i => i.title)
  })


  let touch = {}

  function onShortcutTouchStart(e) {
    const actIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.actIndex = actIndex
    
    scrollTo(actIndex)
  }
  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    const actIndex = parseInt((touch.y2 - touch.y1) / 18) + touch.actIndex

    scrollTo(actIndex)
  }

  function scrollTo(index) {
    if (isNaN(index)) return
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    scrollRef.value.scroll.scrollToElement(targetEl, 0)
  }




  return {
    shortcutList, scrollRef, onShortcutTouchStart, onShortcutTouchMove
  }
}