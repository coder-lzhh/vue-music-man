<template>
    <Header></Header>
    <Tab></Tab>
    <router-view :style="viewStyle"></router-view>
    <Player></Player>
</template>

<script>
import Header from "@/components/header/header";
import Player from "@/components/player/player";
import Tab from "@/components/tab/tab";
import { mapState } from 'vuex'

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
    created() { },
    computed: {
        viewStyle() {
            const bottom = this.playlist.length ? '60px' : '0'
            return { bottom }
        },
        ...mapState(['playlist'])
    },
    methods: {},
    watch: {},
};
</script>
