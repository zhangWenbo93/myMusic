<!--  -->
<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list';
import {mapGetters} from 'vuex';
import {getSongList} from 'api/recommend';
import { ERR_OK } from 'api/config';
import {createSong, isValidMusic, processSongsUrl} from 'common/js/song';

export default {
  data () {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters([
      'disc'
    ])
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this.songs = this._normallizeSongs(res.cdlist[0].songlist)).then((songs) => {
            this.songs = songs;
          });
          console.log(this.songs);
        }
      });
    },
    _normallizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
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
