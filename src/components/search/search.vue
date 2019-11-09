<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
        <scroll ref="shortcut" class="shortcut" :data="shortcut">
          <div>
            <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li class="item" v-for="(item,index) in hotKey" :key='index'
                @click="addQuery(item.k)">
                  <span>{{item.k}}</span>
                </li>
              </ul>
            </div>
            <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                  <i class="icon-clear"></i>
                </span>
              </h1>
                <search-list  :searches="searchHistory"
                  @delete="deleteSearchHistory" @select="addQuery"
                ></search-list>
            </div>
          </div>
        </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
        <suggest @select="saveSearch" @listScroll="blurInput" ref="suggest" :query="query"></suggest>
    </div>
      <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <transition name='slide'>
    <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import { playlistMixin, searchMixin } from 'common/js/mixin'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/scroll'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import { mapActions } from 'vuex'

export default {
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      query: '',
      hotKey: []
    }
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()

      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
    _getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  // 日后再说
  // 遇事不决先刷新
  components: {
    SearchBox,
    Scroll,
    Suggest,
    SearchList,
    Confirm
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
  .search
    .search-result
      position: fixed
      width: 100%
      top: vw(178)
      bottom: 0
    .search-box-wrapper
      margin: vw(20)
    .shortcut-wrapper
      position: fixed
      top: vw(178)
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .search-history
          position: relative
          margin: 0 vw(20)
          .title
            display: flex
            align-items: center
            height: vw(40)
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
        .hot-key
          margin: 0 vw(20) vw(20) vw(20)
          .title
            margin-bottom: vw(20)
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: vw(5) vw(10)
            margin: 0 vw(20) vw(10) 0
            border-radius: vw(6)
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
</style>
