<template>
    <div class="player" v-show="playlist.length">
        <transition name="normal">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.pic" />
                </div>
                <div class="top">
                    <div class="back" @click="goBack">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title">{{ currentSong.name }}</h1>
                    <h2 class="subtitle">{{ currentSong.singer }}</h2>
                </div>
                <div
                    class="middle"
                    @touchstart.prevent="onMiddleTouchStart"
                    @touchmove.prevent="onMiddleTouchMove"
                    @touchend.prevent="onMiddleTouchEnd"
                >
                    <div class="middle-l" :style="middleLStyle">
                        <div class="cd-wrapper">
                            <div class="cd" ref="cdRef">
                                <img
                                    class="image"
                                    ref="cdImageRef"
                                    :class="cdCls"
                                    :src="currentSong.pic"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <Scroll
                        class="middle-r"
                        :style="middleRStyle"
                        ref="lyricScrollRef"
                    >
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric" ref="lyricListRef">
                                <p
                                    class="text"
                                    :class="{
                                        current: currentLineNum === index,
                                    }"
                                    v-for="(line, index) in currentLyric.lines"
                                    :key="line.num"
                                >
                                    {{ line.txt }}
                                </p>
                            </div>
                            <div class="pure-music" v-show="pureMusicLyric">
                                <p>{{ pureMusicLyric }}</p>
                            </div>
                        </div>
                    </Scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span
                            class="dot"
                            :class="{ active: currentShow === 'cd' }"
                        ></span>
                        <span
                            class="dot"
                            :class="{ active: currentShow === 'lyric' }"
                        ></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{
                            formatTime(currentTime)
                        }}</span>
                        <div class="progress-bar-wrapper">
                            <input
                                class="progress"
                                min="0"
                                max="1000"
                                type="range"
                                :value="progressCurrent"
                                @change="progressChange"
                                @touchstart="onTouchStart"
                                @touchmove="onTouchMove"
                                ref="progressRef"
                            />
                        </div>
                        <span class="time time-r">{{
                            formatTime(currentSong.duration)
                        }}</span>
                    </div>

                    <div class="operators">
                        <div class="icon i-left">
                            <i @click="changeMode" :class="modeIcon"></i>
                        </div>
                        <div class="icon i-left">
                            <i @click="prev" class="icon-prev"></i>
                        </div>
                        <div class="icon i-center">
                            <i @click="togglePlay" :class="palyIcon"></i>
                        </div>
                        <div class="icon i-right">
                            <i @click="next" class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i
                                @click="toggleFavorite(currentSong)"
                                :class="favoriteIcon(currentSong)"
                            ></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <MiniPlayer :progress="progress" :toggle-play="togglePlay"></MiniPlayer>
        <audio
            ref="audioRef"
            @pause="pause"
            @canplay="ready"
            @error="error"
            @ended="end"
            @timeupdate="updateTime"
        ></audio>
    </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";

import { formatTime } from "@/assets/js/util";
import { PLAY_MODE } from "@/assets/js/constant";

import Scroll from '@/components/base/scroll/scroll'
import MiniPlayer from './mini-player.vue'

import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import useCd from "./use-cd";
import useLyric from "./use-lyric";
import useMiddleInteractive from "./use-middle-interactive";

export default {
    name: "player",
    components: { Scroll, MiniPlayer },
    setup() {
        const audioRef = ref(null);
        const progressRef = ref(null);
        const currentTime = ref(0);
        const songReady = ref(false);
        let progressCurrent = ref(0);
        let progressChanging = false;

        //vuex
        const store = useStore();
        const playing = computed(() => store.state.playing);
        const playMode = computed(() => store.state.playMode);
        const currentIndex = computed(() => store.state.currentIndex);
        const fullScreen = computed(() => store.state.fullScreen);
        const currentSong = computed(() => store.getters.currentSong);
        const playlist = computed(() => store.state.playlist);

        const palyIcon = computed(() => {
            return playing.value ? "icon-pause" : "icon-play";
        });

        let { modeIcon, changeMode } = useMode();
        let { favoriteIcon, toggleFavorite } = useFavorite();
        let { cdCls, cdImageRef, cdRef } = useCd();
        let { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive();
        let { currentLyric, pureMusicLyric, lyricListRef, lyricScrollRef, playingLyric, currentLineNum, playLyric, stopLyric } = useLyric({ songReady, currentTime });

        watch(currentSong, (newsong) => {
            if (!newsong.id || !newsong.url) return;
            songReady.value = false;
            const audioEl = audioRef.value;
            audioEl.src = newsong.url;
            audioEl.play();
            store.commit("setPlayingState", true);
        });

        watch(playing, (isPlay) => {
            if (!songReady.value) return;
            const audioEl = audioRef.value;
            if (isPlay) {
                audioEl.play();
                playLyric()
            } else {
                audioEl.pause();
                stopLyric()
            }
        });

        function togglePlay() {
            store.commit("setPlayingState", !playing.value);
        }

        function loop() {
            const audioEl = audioRef.value;
            audioEl.currentTime = 0;
            audioEl.play();
            store.commit("setPlayingState", true);
        }

        function next() {
            let list = playlist.value;
            if (!songReady.value || !list.length) return;

            if (list.length === 1) {
                loop();
            } else {
                let index = currentIndex.value + 1;
                if (index == list.length) {
                    index = 1;
                }
                store.commit("setCurrentIndex", index);
            }
        }

        function prev() {
            let list = playlist.value;
            if (!songReady.value || !list.length) return;
            if (list.length === 1) {
                loop();
            } else {
                let index = currentIndex.value - 1;
                if (index == -1) {
                    index = list.length - 1;
                }
                store.commit("setCurrentIndex", index);
            }
        }

        function progressChange(e) {
            progressChanging = false;
            progressCurrent.value = e.target.value;
            audioRef.value.currentTime = currentTime.value =
                currentSong.value.duration * (e.target.value / 1000);
            playLyric()
        }
        function onTouchStart() {
            progressChanging = true;
            playLyric()
            stopLyric()
        }

        function onTouchMove(e) {
            currentTime.value = currentSong.value.duration * (e.target.value / 1000);
            progressRef.value.style.backgroundSize = `${e.target.value / 10}% 100%`;
            playLyric()
        }

        function updateTime(e) {
            if (progressChanging) return;
            currentTime.value = e.target.currentTime;
            let duration = currentSong.value.duration;
            let percentage = (currentTime.value | 0) / duration;
            progressRef.value.style.backgroundSize = `${percentage * 100}% 100%`;
            progressCurrent.value = percentage * 1000;
        }

        function end() {
            currentTime.value = 0;
            if (playMode.value === PLAY_MODE.loop) {
                loop();
            } else {
                next();
            }
        }

        function ready() {
            songReady.value = true;
            playLyric()
        }
        function pause() {
            store.commit("setPlayingState", false);
        }
        function error() {
            songReady.value = true;
        }
        function goBack() {
            store.commit("setFullScreen", false);
        }
        return {
            playlist,
            audioRef,
            progressRef,
            palyIcon,
            fullScreen,
            goBack,
            togglePlay,
            next,
            prev,
            ready,
            updateTime,
            progressChange,
            progressCurrent,
            onTouchMove,
            onTouchStart,
            end,
            pause,
            error,

            modeIcon,
            changeMode,

            toggleFavorite,
            favoriteIcon,

            cdCls,
            cdImageRef,
            cdRef,

            formatTime,
            currentTime,
            currentSong,

            currentLyric,
            pureMusicLyric,
            lyricListRef,
            lyricScrollRef,
            playingLyric,
            currentLineNum,
            playLyric,
            stopLyric,

            currentShow,
            middleLStyle,
            middleRStyle,
            onMiddleTouchStart,
            onMiddleTouchMove,
            onMiddleTouchEnd,
        };
    },
};
</script>

<style scoped lang="scss">
.normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);

        img {
            width: 100%;
            height: 100%;
        }
    }
    .top {
        position: relative;
        margin-bottom: 25px;
        .back {
            position: absolute;
            top: 0;
            left: 6px;
            z-index: 50;
        }
        .icon-back {
            display: block;
            padding: 9px;
            font-size: $font-size-large-x;
            color: $color-theme;
            transform: rotate(-90deg);
        }
        .title {
            width: 70%;
            margin: 0 auto;
            line-height: 40px;
            text-align: center;
            @include no-wrap();
            font-size: $font-size-large;
            color: $color-text;
        }
        .subtitle {
            line-height: 20px;
            text-align: center;
            font-size: $font-size-medium;
            color: $color-text;
        }
    }
    .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
            // display: none;
            display: inline-block;
            vertical-align: top;
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 80%;
            .cd-wrapper {
                position: absolute;
                left: 10%;
                top: 0;
                width: 80%;
                box-sizing: border-box;
                height: 100%;
                .cd {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    img {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border-radius: 50%;
                        border: 10px solid rgba(255, 255, 255, 0.1);
                    }
                    .playing {
                        animation: rotate 20s linear infinite;
                    }
                }
            }
        }
        .middle-r {
            display: inline-block;
            vertical-align: top;
            width: 100%;
            height: 100%;
            overflow: hidden;
            .lyric-wrapper {
                width: 80%;
                margin: 0 auto;
                overflow: hidden;
                text-align: center;
                .text {
                    line-height: 32px;
                    color: $color-text-l;
                    font-size: $font-size-medium;
                    &.current {
                        color: $color-text;
                    }
                }
                .pure-music {
                    padding-top: 50%;
                    line-height: 32px;
                    color: $color-text-l;
                    font-size: $font-size-medium;
                }
            }
        }
    }
    .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
            text-align: center;
            font-size: 0;
            .dot {
                display: inline-block;
                vertical-align: middle;
                margin: 0 4px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: $color-text-l;
                &.active {
                    width: 20px;
                    border-radius: 5px;
                    background: $color-text-ll;
                }
            }
        }
        .progress-wrapper {
            display: flex;
            align-items: center;
            width: 80%;
            margin: 0px auto;
            padding: 10px 0;
            .time {
                color: $color-text;
                font-size: $font-size-small;
                flex: 0 0 40px;
                line-height: 30px;
                width: 40px;
                &.time-l {
                    text-align: left;
                }
                &.time-r {
                    text-align: right;
                }
            }
            .progress-bar-wrapper {
                flex: 1;
                line-height: 30px;
                display: flex;
                align-items: center;
                .progress {
                    // transition: all 0.1s;
                    width: 100%;
                    -webkit-appearance: none;
                    background: -webkit-linear-gradient(#ffcd32, #ffcd32)
                            no-repeat,
                        rgba(0, 0, 0, 0.3);
                    background-size: 0% 100%;
                    height: 4px;
                }
                .progress:focus {
                    outline: none;
                }
                .progress::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: #ffcd32;
                    border: 3px solid #fff;
                }
            }
        }
        .operators {
            display: flex;
            align-items: center;
            .icon {
                flex: 1;
                color: $color-theme;
                &.disable {
                    color: $color-theme-d;
                }
                i {
                    font-size: 30px;
                }
            }

            .i-left {
                text-align: right;
            }
            .i-center {
                padding: 0 20px;
                text-align: center;
                i {
                    font-size: 40px;
                }
            }
            .i-right {
                text-align: left;
            }
            .icon-favorite {
                color: $color-sub-theme;
            }
        }
    }
    &.normal-enter-active,
    &.normal-leave-active {
        transition: all 0.6s;
        .top,
        .bottom {
            transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
        }
    }
    &.normal-enter-from,
    &.normal-leave-to {
        opacity: 0;
        .top {
            transform: translate3d(0, -100px, 0);
        }
        .bottom {
            transform: translate3d(0, 100px, 0);
        }
    }
}
</style>
