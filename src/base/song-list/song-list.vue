<template>
  <div class="song-list">
    <ul>
      <li v-for='(song,index) in songs' class="item" :key='index' @click="selectItem(song, index)">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class='name'>{{ song.name }}</h2>
          <p class='desc'>{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default: function() {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`
    },
    selectItem(item, index) {
      console.log(item)
      this.$emit('select', item, index)
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: vw(64)
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: vw(25)
          height: vw(24)
          background-size: vw(25) vw(24)
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: vw(20)
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: vw(4)
          color: $color-text-d
</style>
