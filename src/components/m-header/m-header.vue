<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class='text'>贱贱梦 Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position:relative
    height:vw(44)
    text-align:center
    color:$color-theme
    font-size:0
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: vw(12)
        font-size: vw(20)
        color: $color-theme
    .icon
      display:inline-block
      margin-top:vw(6)
      width:vw(30)
      height:vw(32)
      margin-right:vw(9)
      bg-image('logo')
      background-size:contain
    .text
      display:inline-block
      line-height:vw(44)
      font-size:$font-size-large
      vertical-align: top
</style>
