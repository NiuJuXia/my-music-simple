<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="(item, index) in topList" :key='index'>
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList" :key='index'>
              <span>{{index + 1}}</span>
              <span> {{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  created() {
    this._getTopList()
  },
  data() {
    return {
      topList: []
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  watch: {
    topList() {
      setTimeout(() => {
        this.$Lazyload.lazyLoadHandler()
      }, 20)
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: vw(88)
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 vw(20)
        padding-top: vw(20)
        height: 100px
        &:last-child
          padding-bottom: vw(20)
        .icon
          flex: 0 0 vw(100)
          width: vw(100)
          height: vw(100)
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 vw(20)
          height: vw(100)
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: vw(26)
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
