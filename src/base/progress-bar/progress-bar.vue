<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress"  ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
                @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchMove"
                @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
      // this.$emit('percentChanging', this._getPercent())
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
      // this._offset(e.offsetX)
      this._triggerPercent()
    },
    _triggerPercent() {
      this.$emit('percentChange', this._getPercent())
    },
    _getPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      return this.$refs.progress.clientWidth / barWidth
    },
    setProgressOffset(percent) {
      if (percent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = percent * barWidth
        this._offset(offsetWidth)
      }
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    percent(newPercent) {
      this.setProgressOffset(newPercent)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.progress-bar
  height: vw(30)
  .bar-inner
    position: relative
    top: vw(13)
    height: vw(4)
    background: rgba(0, 0, 0, 0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: vw(-8)
      top: vw(-13)
      width: vw(30)
      height: vw(30)
      .progress-btn
        position: relative
        top: vw(7)
        left: vw(7)
        box-sizing: border-box
        width: vw(16)
        height: vw(16)
        border: vw(3) solid $color-text
        border-radius: 50%
        background: $color-theme
</style>
