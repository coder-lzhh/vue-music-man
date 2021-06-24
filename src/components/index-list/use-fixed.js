import { ref, watch, nextTick, computed } from 'vue'
export default function (props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)


  const fixedTitle = computed(() => {
    if (scrollY.value <= 0) {
      return ''
    }
    let group = props.data[currentIndex.value]
    return group ? group.title : ''
  })

  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0 ,${diff}px ,0)`
    }
  })

  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })

  watch(scrollY, (newY) => {
    let HeightBox = listHeights.value
    for (let index = 0; index < HeightBox.length - 1; index++) {
      const itemTop = HeightBox[index]
      const itemBottom = HeightBox[index + 1]
      if (newY >= itemTop && newY <= itemBottom) {
        currentIndex.value = index
        distance.value = itemBottom - newY
      }
    }
  })

  function calculate() {
    let groupChild = groupRef.value.children
    let HeightBox = listHeights.value
    let Height = 0

    HeightBox.length = 0
    HeightBox.push(Height)

    for (const ch of groupChild) {
      Height += ch.clientHeight
      HeightBox.push(Height)
    }

  }
  function onScroll(pos) {
    scrollY.value = -pos.y
  }
  return { onScroll, groupRef, fixedTitle, fixedStyle, currentIndex }
}