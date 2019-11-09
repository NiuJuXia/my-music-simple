<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listen-scroll="listenScroll"
          @scroll="scroll"
          :probe-type="probeType">
          <ul>
            <li v-for="(group,index) in data" class="list-group" ref="listGroup" :key='index'>
              <h2 class="list-group-title">{{group.title}}</h2>
              <uL>
                <li  @click="selectItem(item)" v-for="(item,index) in group.items" class="list-group-item" :key='index'>
                  <img class="avatar" v-lazy="item.avatar">
                  <span class="name">{{item.name}}</span>
                </li>
              </uL>
            </li>
          </ul>
          <div class="list-shortcut"  @touchstart.stop.prevent="onShortcutTouchStart"
                                      @touchmove.stop.prevent="onShortcutTouchMove"
                                      @touchend.stop>
            <ul>
              <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
              :key='index'
              :class="{'current':currentIndex===index}">{{item}}
              </li>
            </ul>
          </div>
          <div class="list-fixed" ref="fixed" v-show="fixedTitle">
            <div class="fixed-title">{{fixedTitle}} </div>
          </div>
          <div v-show="!data.length" class="loading-container">
            <loading></loading>
          </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
import Loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  methods: {
    refresh() {
      this.$refs.listview.refresh()
    },
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta

      this._scrollTo(anchorIndex)
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      // this.scrollY = this.$refs.listview.scroll.y 没必要
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限,如果最后一个元素过短会出现这种情况
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
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

.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: vw(30)
      line-height: vw(30)
      padding-left: vw(20)
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: vw(20)
    padding: vw(20) 0
    border-radius: vw(10)
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: vw(3)
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-group
    padding-bottom: vw(30)
    .list-group-title
      height: vw(30)
      line-height: vw(30)
      padding-left: vw(20)
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: vw(20) 0 0 vw(30)
      .avatar
        width: vw(50)
        height: vw(50)
        border-radius: 50%
      .name
        margin-left: vw(20)
        color: $color-text-l
        font-size: $font-size-medium
</style>
