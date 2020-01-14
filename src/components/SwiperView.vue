<template>
    <swiper :list="baseList" :index="0" auto loop height="200px"></swiper>
</template>
<script>
import { Swiper, SwiperItem } from 'vux'

export default {
  components: {
    Swiper, SwiperItem
  },
  props: ['baseList'],
  data () {
    return {
      // demo01_list: baseList
    }
  }
}
</script>

