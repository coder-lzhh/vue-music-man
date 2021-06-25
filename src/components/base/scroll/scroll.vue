<template>
    <div ref="rootRef">
        <slot></slot>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, nextTick, watch } from 'vue'
import useScroll from "./use-scroll";
import { ref } from "vue";
export default {
    name: "scroll",
    props: {
        click: {
            type: Boolean,
            default: true,
        },
        probeType: {
            type: Number,
            default: 0,
        },
    },
    emits: ["scroll"],
    setup(props, { emit }) {
        const rootRef = ref(null);
        const { scroll } = useScroll(rootRef, props, emit);


        const store = useStore()
        const playlist = computed(() => store.state.playlist)

        watch(playlist, async () => {
            await nextTick()
            // console.log('xxxxxxxxx')
            scroll.value.refresh()
        })


        return {
            rootRef,
            scroll,
        };
    },
};
</script>

<style scoped lang="scss"></style>
