import { mapGetters } from 'vuex';
export const playListMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist);
  },
  activated() { // keep-alive时触发
    this.handlePlaylist(this.playlist);
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal);
    }
  },
  methods: {
    handlePlaylist() { // 组件定义这个函数 会覆盖mixins里面的函数 没定义 会抛出error
      throw new Error('component must implement handlePlaylist methods');
    }
  }
};
