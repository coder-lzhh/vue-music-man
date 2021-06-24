<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" @click="randomItem" v-show="songs.length">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <Scroll
      v-loading="loading"
      v-no-result="noResult"
      class="list"
      :style="scrollStyle"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <SongList :songs="songs" @select="selectItem"></SongList>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from "@/components/base/scroll/scroll";
import SongList from "@/components/base/song-list/song-list";
import { mapActions } from "vuex";
const RESERVED_HEIGHT = 40;
export default {
  components: { Scroll, SongList },
  props: {
    pic: String,
    title: String,
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    loading: Boolean,
  },
  data() {
    return {
      imageHeight: 0,
      maxTranslateY: 0,
      scrollY: 0,
    };
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT;
  },
  computed: {
    noResult() {
      return !this.loading && !this.songs.length;
    },
    playBtnStyle() {
      const scrollY = this.scrollY;
      let display = "";
      if (scrollY > this.maxTranslateY) {
        display = "none";
      }
      return { display };
    },
    filterStyle() {
      const scrollY = this.scrollY;
      const imageHeight = this.imageHeight;

      let blur = 0;
      if (scrollY > 0) {
        blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 15;
      }

      return { backdropFilter: `blur(${blur}px)` };
    },
    bgImageStyle() {
      const scrollY = this.scrollY;
      let height = "0";
      let paddingTop = "70%";
      let zIndex = 0;

      if (scrollY > this.maxTranslateY) {
        height = "40px";
        paddingTop = "0";
        zIndex = 1;
      }

      let scale = 1;
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight);
      }
      return {
        zIndex,
        height,
        paddingTop,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})`,
      };
    },
    scrollStyle() {
      return {
        bottom: 0,
        top: `${this.imageHeight}px`,
      };
    },
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    onScroll(pos) {
      this.scrollY = -pos.y;
    },
    selectItem({ index }) {
      this.selectPlay({
        list: this.songs,
        index,
      });
    },
    randomItem() {
      this.randomPlay(this.songs);
    },
    ...mapActions(["selectPlay", "randomPlay"]),
  },
};
</script>

<style scoped lang="scss">
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    height: 0;
    padding-top: 70%;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
