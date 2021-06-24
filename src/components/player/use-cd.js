
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";

export default function useMode() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)


  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdCls = computed(() => playing.value ? 'playing' : '')

  watch(playing, (isPlay) => {
    let wrapper = cdRef.value
    let inner = cdImageRef.value
    if (!isPlay) {
      const wrapperTransform = getComputedStyle(wrapper).transform
      const innerTransform = getComputedStyle(inner).transform
      wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
    }
  })

  return { cdCls, cdImageRef, cdRef }

}