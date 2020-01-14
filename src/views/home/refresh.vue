// refresh.vue
<script>
export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log(' from', from)
      vm.$router.replace({
        path: from.path,
        query: to.query
      })
    })
  }
}
</script>