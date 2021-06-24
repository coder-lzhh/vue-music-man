<template>
  <Header></Header>
  <Tab></Tab>
  <router-view></router-view>
  <Player></Player>
</template>

<script>
import Header from "@/components/header/header";
import Player from "@/components/player/player";
import Tab from "@/components/tab/tab";

export default {
  components: {
    Header,
    Tab,
    Player,
  },
  props: {},
  data() {
    return {};
  },
  created() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>
