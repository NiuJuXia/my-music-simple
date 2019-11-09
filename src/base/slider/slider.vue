<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref='sliderGroup'>
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{ active: currentPageIndex === index }" v-for="(item, index) in dots" :key='index'></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { addClass } from 'common/js/dom'
import BScroll from 'better-scroll'

export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  activated() {
    this.slider.enable()
    let pageIndex = this.slider.getCurrentPage().pageX
    this.slider.goToPage(pageIndex, 0, 0)
    this.currentPageIndex = pageIndex
    if (this.autoPlay) {
      this._play()
    }
  },
  beforeDestroy() {
    this.slider.disable()
    clearTimeout(this.timer)
  },
  methods: {
    _setSliderWidth(isResize) { // 初始化轮播图宽度
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      let sliderHeight = this.$refs.slider.clientHeight
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        child.style.height = sliderHeight + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        click: true
      })

      this.slider.on('scrollEnd', this._onScrollEnd)
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _play() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    },
    _onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    }
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .slider
    // 方便_setSliderWidth获取宽度
    min-height: vw(1)
    height:100%
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: vw(12)
      transform: translateZ(vw(1))
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 vw(4)
        width: vw(8)
        height: vw(8)
        border-radius: 50%
        background: $color-text-l
        &.active
          width: vw(20)
          border-radius: vw(5)
          background: $color-text-ll
</style>
