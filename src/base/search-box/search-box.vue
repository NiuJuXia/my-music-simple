<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from 'common/js/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    clear() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    },
    blur() {
      this.$refs.query.blur()
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 vw(6)
    height: vw(40)
    background: $color-highlight-background
    border-radius: vw(6)
    .icon-search
      font-size: vw(24)
      color: $color-background
    .box
      flex: 1
      margin: 0 vw(5)
      line-height: vw(18)
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      outline: 0
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: v(16)
      color: $color-background
</style>
