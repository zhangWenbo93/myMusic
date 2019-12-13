<!-- 排行榜列表 -->
<template>
  <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list';
import {mapGetters} from 'vuex';
import {getMusicList} from 'api/rank';
import { ERR_OK } from 'api/config';
import {createSong, isValidMusic, processSongsUrl} from 'common/js/song';

export default {
  data () {
    return {
      songs: [],
      rank: true
    };
  },
  computed: {
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return '';
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push({
          path: '/rank'
        });
        return;
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normallizeSongs(res.songlist)).then((songs) => {
            this.songs = songs;
          });
        }
      });
    },
    _normallizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        const musicData = item.data;
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style rel="stylesheet/stylus" lang="stylus">
  .slider-enter-active, .slider-leave-active
    transition all .3s
  .slider-enter, .slider-leave-to
    transform translate3d(100%, 0, 0)
</style>
