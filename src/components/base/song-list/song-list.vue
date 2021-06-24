<template>
  <ul>
    <li class="item" v-for="(song, index) in songs" :key="song.id">
      <div class="content" @click="selectItem(song, index)">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  components: {},
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  emits: ["select"],
  created() {},
  computed: {},
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
    selectItem(song, index) {
      this.$emit("select", { song, index });
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 64px;
  font-size: $font-size-medium;

  .content {
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .name {
      @include no-wrap();
      color: $color-text;
    }
    .desc {
      @include no-wrap();
      margin-top: 4px;
      color: $color-text-d;
    }
  }
}
</style>
