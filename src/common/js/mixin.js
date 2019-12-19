import { mapGetters, mapMutations, mapActions } from 'vuex';
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
      'mode',
      'favoriteList'
    ]),
    favoriteIcon() {
      return this.getFavoriteIcon(this.currentSong);
    }
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
    getFavoriteIcon(song) {
      return this.isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite';
    },
    toggoleFavorite(song) {
      this.isFavorite(song) ? this.deleteFavoriteList(song) : this.saveFavoriteList(song);
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id;
      });
      return index > -1;
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
};

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    };
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query;
    },
    blurInput() { // 接收来自子组件suggest的事件
      this.$refs.searchBox.blur(); // 调用子组件searchBox的事件
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
};
