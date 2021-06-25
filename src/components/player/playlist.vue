<template>
    <teleport to="body">
        <div class="playlist" @click="hide" v-show="visible && playlist.length">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon" :class="modeIcon" @click="changeMode">
                        </i>
                        <span class="text">{{ modeText }}</span>
                        <span class="clear" @click="showConfirm">
                            <i class="icon-clear"></i>
                        </span>
                    </h1>
                </div>
                <Scroll ref="scrollRef" class="list-content">
                    <transition-group ref="listRef" tag="ul" name="list">
                        <li
                            class="item"
                            v-for="song in sequenceList"
                            :key="song.id"
                            @click="selectItem(song)"
                        >
                            <i
                                class="current"
                                :class="getCurrentIcon(song)"
                            ></i>
                            <span class="text">{{ song.name }}</span>
                            <span
                                class="favorite"
                                @click.stop="toggleFavorite(song)"
                            >
                                <i :class="favoriteIcon(song)"></i>
                            </span>
                            <span
                                class="delete"
                                @click.stop="removeSong(song)"
                                :class="{ disable: removing }"
                            >
                                <i class="icon-delete"></i>
                            </span>
                        </li>
                    </transition-group>
                </Scroll>
                <div class="list-add">
                    <div class="add" @click="showAddSong">
                        <i class="icon-add"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-footer" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
            <Confirm
                ref="confirmRef"
                @confirm="confirmClear"
                text="是否清空播放列表？"
                confirm-btn-text="清空"
            ></Confirm>
        </div>
    </teleport>
</template>

<script>
import { computed, ref, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import Scroll from '@/components/base/scroll/scroll'
import Confirm from '@/components/base/confirm/confirm'

import useMode from '@/components/player/use-mode.js'
import useFavorite from '@/components/player/use-favorite.js'
export default {
    components: { Scroll, Confirm },
    props: {},
    data() {
        return {
        };
    },
    setup() {
        const store = useStore()
        const scrollRef = ref(null)
        const listRef = ref(null)
        const confirmRef = ref(null)
        let visible = ref(false)
        let removing = ref(false)

        const currentSong = computed(() => store.getters.currentSong)
        const sequenceList = computed(() => store.state.sequenceList)
        const playlist = computed(() => store.state.playlist)

        watch(currentSong, async () => {
            if (!visible.value) return
            await nextTick()
            refreshScroll()
        })

        let { modeText, modeIcon, changeMode } = useMode()
        let { favoriteIcon, toggleFavorite } = useFavorite()

        function hide() {
            visible.value = false
        }
        async function show() {
            visible.value = true
            await nextTick()
            refreshScroll()
            scrollToCurrent()
        }

        function selectItem(song) {
            const playIndex = playlist.value.findIndex(item => item.id === song.id)
            store.commit('setCurrentIndex', playIndex)
            store.commit('setPlayingState', true)
        }

        function scrollToCurrent() {
            const index = sequenceList.value.findIndex(item => item.id === currentSong.value.id)
            if (index > -1) {
                const target = listRef.value.$el.children[index]
                scrollRef.value.scroll.scrollToElement(target, 300)
            }
        }

        function removeSong(song) {
            if (removing.value) return

            store.dispatch('removeSong', song)
            removing.value = true

            setTimeout(() => {
                removing.value = false
            }, 300);
        }
        function refreshScroll() {
            scrollRef.value.scroll.refresh()
        }

        function showAddSong() {
            // visible.value = false
        }
        function showConfirm() {
            confirmRef.value.show()
            console.dir(confirmRef.value)
        }
        function confirmClear() {
            store.dispatch('clearSongList')
            hide()
        }
        function getCurrentIcon(song) {
            if (song.id === currentSong.value.id) {
                return 'icon-play'
            }
        }

        return {
            confirmRef,
            scrollRef,
            listRef,
            playlist,
            sequenceList,
            visible,
            removing,
            modeText,
            modeIcon,
            changeMode,

            show,
            hide,
            showAddSong,
            removeSong,
            selectItem,
            confirmClear,
            showConfirm,

            getCurrentIcon,
            favoriteIcon,
            toggleFavorite
        }
    }
}
</script>

<style  scoped lang='scss'>
.playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active,
    &.list-fade-leave-active {
        transition: opacity 0.3s;
        .list-wrapper {
            transition: all 0.3s;
        }
    }
    &.list-fade-enter-from,
    &.list-fade-leave-to {
        opacity: 0;
        .list-wrapper {
            transform: translate3d(0, 100%, 0);
        }
    }
    .list-wrapper {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 210;
        width: 100%;
        background-color: $color-highlight-background;
        .list-header {
            position: relative;
            padding: 20px 30px 10px 20px;
            .title {
                display: flex;
                align-items: center;
                .icon {
                    margin-right: 10px;
                    font-size: 24px;
                    color: $color-theme-d;
                }
                .text {
                    flex: 1;
                    font-size: $font-size-medium;
                    color: $color-text-l;
                }
                .clear {
                    @include extend-click();
                    .icon-clear {
                        font-size: $font-size-medium;
                        color: $color-text-d;
                    }
                }
            }
        }
        .list-content {
            max-height: 240px;
            overflow: hidden;
            .item {
                display: flex;
                align-items: center;
                height: 40px;
                padding: 0 30px 0 20px;
                overflow: hidden;
                .current {
                    flex: 0 0 20px;
                    width: 20px;
                    font-size: $font-size-small;
                    color: $color-theme-d;
                }
                .text {
                    flex: 1;
                    @include no-wrap();
                    font-size: $font-size-medium;
                    color: $color-text-d;
                }
                .favorite {
                    @include extend-click();
                    margin-right: 15px;
                    font-size: $font-size-small;
                    color: $color-theme;
                    .icon-favorite {
                        color: $color-sub-theme;
                    }
                }
                .delete {
                    @include extend-click();
                    font-size: $font-size-small;
                    color: $color-theme;
                    &.disable {
                        color: $color-theme-d;
                    }
                }
            }
        }
        .list-add {
            width: 140px;
            margin: 20px auto 30px auto;
            .add {
                display: flex;
                align-items: center;
                padding: 8px 16px;
                border: 1px solid $color-text-l;
                border-radius: 100px;
                color: $color-text-l;
                .icon-add {
                    margin-right: 5px;
                    font-size: $font-size-small-s;
                }
                .text {
                    font-size: $font-size-small;
                }
            }
        }
        .list-footer {
            text-align: center;
            line-height: 50px;
            background: $color-background;
            font-size: $font-size-medium-x;
            color: $color-text-l;
        }
    }
}
</style>