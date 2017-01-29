<template>
  <div id="app">
    <top-nav></top-nav>
    <compare></compare>
  </div>
</template>

<script>
import TopNav from './components/TopNav'
import Compare from './components/Compare'

export default {
  name: 'app',
  components: {
    TopNav,
    Compare
  }
}
</script>

<style>
#app {
}
</style>
