<!--  -->
<template>
  <transition name="silde">
    <music-list :songs="songs" :bg-image="bgImage" :title="title"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list';
import { mapGetters } from 'vuex';
import { getSingerDetail } from 'api/singer';
import { ERR_OK } from 'api/config';
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song';

export default {
  data () {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getDetail();
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer');
        return;
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
            this.songs = songs;
          });
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let {musicData} = item;
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
  @import "~common/stylus/variable"
  .singer-detail
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 100
    background $color-background
  .silde-enter-active,.silde-leave-active
    transition all .3s
  .silde-enter,.silde-leave-to
    transform translate3d(100%,0,0)
</style>
