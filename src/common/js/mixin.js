import { mapGetters, mapMutations } from 'vuex';
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/util';

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

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode'
    ])
  },
  methods: {
    changeMode() { // 切换播放模式
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlaylist(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => { // findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
        return item.id === this.currentSong.id; // 符合条件
      });
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  }
};
