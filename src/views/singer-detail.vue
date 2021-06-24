<template>
  <div class="singer-detail">
    <MusicList :pic="pic" :title="title" :songs="songs" :loading="loading"></MusicList>
  </div>
</template>

<script>
import { SINGER_KEY } from "@/assets/js/constant";
import { getSingerDetail } from "@/service/singer";
import { processSongs } from "@/service/song";
import MusicList from "@/components/music-list/MusicList";

import storage from "good-storage";

export default {
  name: "singer-detail",
  components: { MusicList },
  props: {
    singer: {
      type: Object,
    },
  },
  data() {
    return { songs: [], loading: true };
  },

  async created() {
    let singer = this.computedSinger;

    if (!singer) {
      const path = this.$route.matched[0].path;
      this.$router.push({ path });
      return;
    }

    let result = await getSingerDetail(singer);
    this.songs = await processSongs(result.songs);

    this.loading = false;
  },
  computed: {
    computedSinger() {
      let ret = null;
      const singer = this.singer;
      if (singer.mid) {
        ret = singer;
      } else {
        const cashed = storage.session.get(SINGER_KEY);
        if (cashed.mid === this.$route.params.id) {
          ret = cashed;
        }
      }
      return ret;
    },
    pic() {
      return this.computedSinger && this.computedSinger.pic;
    },
    title() {
      return this.computedSinger && this.computedSinger.name;
    },
  },
};
</script>

<style scoped lang="scss">
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
