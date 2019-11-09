<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" :data="sequenceList" class="list-content" :refreshDelay="refreshDelay">
          <transition-group ref="list" name="list" tag="ul">
            <li :key="item.id" class="item" v-for="(item,index) in sequenceList"
              @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text" v-html="item.name"></span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
        <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
        <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { playerMixin } from 'common/js/mixin'
import { playMode } from 'common/js/config'
import Confirm from 'base/confirm/confirm'
import { mapActions } from 'vuex'
import AddSong from 'components/add-song/add-song'

export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      refreshDelay: 120
    }
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    addSong() {
      this.$refs.addSong.show()
    },
    confirmClear() {
      this.deleteSongList()
      this.hide()
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    deleteOne(item) {
      if (item.deleting) {
        return
      }
      item.deleting = true
      this.deleteSong(item)
      if (!this.playlist.length) {
        this.hide()
      }
      setTimeout(() => {
        item.deleting = false
      }, 300)
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      setTimeout(() => {
        this.scrollToCurrent(newSong)
      }, 20)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-close
        text-align: center
        line-height: vw(50)
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
      .list-operate
        width: vw(140)
        margin: vw(20) auto vw(30) auto
        .add
          display: flex
          align-items: center
          padding: vw(8) vw(16)
          border: vw(1) solid $color-text-l
          border-radius: vw(100)
          color: $color-text-l
          .icon-add
            margin-right: vw(5)
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-content
        max-height: vw(240)
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: vw(40)
          padding: 0 vw(30) 0 vw(20)
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 vw(20)
            width: vw(20)
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: vw(15)
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-header
        position: relative
        padding: vw(20) vw(30) vw(10) vw(20)
        .title
          display: flex
          align-items: center
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
          .icon
            margin-right: vw(10)
            font-size: vw(30)
            color: $color-theme-d

</style>
