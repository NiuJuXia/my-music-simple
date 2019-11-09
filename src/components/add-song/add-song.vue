<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" v-if="currentIndex===0" class="list-scroll" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong">
              </song-list>
            </div>
          </scroll>
          <scroll :refreshDelay="refreshDelay" ref="searchList" v-if="currentIndex===1" class="list-scroll"
                  :data="searchHistory">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import { searchMixin } from 'common/js/mixin'
import Switches from 'base/switches/switches'
import { mapGetters, mapActions } from 'vuex'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Song from 'common/js/song'
import SearchList from 'base/search-list/search-list'
import Suggest from 'components/suggest/suggest'
import TopTip from 'base/top-tip/top-tip'

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      currentIndex: 0,
      showSinger: false,
      switches: [
        {
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
        this.$refs.topTip.show()
      }
    },
    selectSuggest() {
      this.$refs.topTip.show()
      this.saveSearch()
    },
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    SearchBox,
    Switches,
    SongList,
    Scroll,
    SearchList,
    Suggest,
    TopTip
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .tip-title
      text-align: center
      padding: vw(18) 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: vw(4)
      .text
        font-size: $font-size-medium
        color: $color-text
    .search-result
      position: fixed
      top: vw(124)
      bottom: 0
      width: 100%
    .search-box-wrapper
      margin: vw(20)
    .shortcut
     .list-wrapper
       position: absolute
       top: vw(165)
       bottom: 0
       width: 100%
       .list-scroll
         height: 100%
         overflow: hidden
         .list-inner
           padding: vw(20) vw(30)
    .header
      position: relative
      height: vw(44)
      text-align: center
      .title
        line-height: vw(44)
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: vw(8)
        .icon-close
          display: block
          padding: vw(12)
          font-size: vw(20)
          color: $color-theme
</style>
