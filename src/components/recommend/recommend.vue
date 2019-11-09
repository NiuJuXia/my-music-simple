<template>
  <div class="recommend" ref="recommend">
      <scroll ref="scroll" class="recommend-content" :data="discList">
        <div>
          <div class="slider-wrapper" v-if="recommends.length">
            <div class="slider-content" ref="slider1" id='qq'>
              <slider ref="slider">
                <div v-for="item in recommends" :key='item.id'>
                  <a :href="item.linkUrl">
                    <img :src="item.picUrl" @load="loadImage" class="needsclick" >
                  </a>
                </div>
              </slider>
            </div>
          </div>
          <div class="recommend-list">
            <h1 class='list-title'>热门歌单推荐</h1>
            <ul>
              <li  v-for="(item, index) in discList" class="item" :key='index'
               @click="selectItem(item)">
                <div class="icon">
                  <img width="60" height="60" v-lazy="item.imgurl">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: [],
      try1: [1, 2, 5]
    }
  },
  created() {
    this._getRecommend()// 获取 轮播图数据
    // ref获取子组件 非子组件的根元素
    this._getDiscList()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "~common/stylus/variable"
   @import "~common/stylus/mixin"
   // padding百分比是相对于父width  当定位脱离文档流，盒子重新变成标准盒子
   // 别拼错单词，查起来好烦
   .recommend
     position:absolute
     width:100%
     top:vw(88)
     bottom:0
     .recommend-content
       height:100%
       overflow:hidden
       .loading-container
         position: absolute
         width: 100%
         top: 50%
         transform: translateY(-50%)
       .slider-wrapper
         position: relative
         width:100%
         height:0
         padding-top:40%
         overflow:hidden
         .slider-content
           position:absolute
           top:0
           left:0
           width:100%
           height:100%
       .recommend-list
         .list-title
           height: vw(65)
           line-height: vw(65)
           text-align: center
           font-size: $font-size-medium
           color: $color-theme
         .item
           display: flex
           box-sizing: border-box
           align-items: center
           padding: 0 vw(20) vw(20) vw(20)
           color:red
           .icon
             flex: 0 0 vw(60)
             width: vw(60)
             padding-right: vw(20)
           .text
             display: flex
             flex-direction: column
             justify-content: center
             flex: 1
             line-height: vw(20)
             overflow: hidden
             font-size: $font-size-medium
             .name
               margin-bottom: vw(10)
               color: $color-text
             .desc
               color: $color-text-d

</style>
