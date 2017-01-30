<template>
  <div class="top-nav">
    <md-whiteframe md-elevation="2" class="md-toolbar md-theme-default md-large">
      <h2 id="top-nav-title" class="md-title">OSRS Compare</h2>
    </md-whiteframe>
  </div>
</template>

<script>
export default {
  name: 'top-nav'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#top-nav-title {
  flex: 1;
  text-align: center;
  font-size: 48px;
  line-height: 55px;
}
</style>
