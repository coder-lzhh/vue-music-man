<template>
  <div class="singer" v-loading="!singers.length">
    <IndexList :data="singers" @select="toSingerDetail"></IndexList>
    <router-view v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" :singer="singer" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import IndexList from "@/components/index-list/IndexList.vue";
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant";
import { getSingerList } from "@/service/singer";
export default {
  name: "singer",
  components: { IndexList },
  data() {
    return { singers: [], singer: {} };
  },
  async created() {
    let { singers } = await getSingerList();
    this.singers = singers;
  },
  methods: {
    toSingerDetail(singer) {
      this.singer = singer;
      this.setStorage(singer);
      this.$router.push({
        path: `/singer/${singer.mid}`,
      });
    },
    setStorage(singer) {
      storage.session.set(SINGER_KEY, singer);
    },
  },
};
</script>

<style scoped lang="scss">
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
