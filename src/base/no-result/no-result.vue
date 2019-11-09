<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .no-result
    text-align: center
    .no-result-icon
      width: vw(86)
      height: vw(90)
      margin: 0 auto
      bg-image('no-result')
      background-size: vw(86) vw(90)
    .no-result-text
      margin-top: vw(30)
      font-size: $font-size-medium
      color: $color-text-d
</style>
