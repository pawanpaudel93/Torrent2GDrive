<template>
    <div id="app">
        <app-header></app-header>
        <router-view></router-view>
    </div>
</template>

<script>
    import Header from './components/Header';
    export default {
      components: {
        appHeader: Header
      },
      created () {
        this.$store.dispatch('autoLogin')
      }
    }
</script>

<style>
    /*#app {*/
    /*    font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    /*    -webkit-font-smoothing: antialiased;*/
    /*    -moz-osx-font-smoothing: grayscale;*/
    /*    text-align: center;*/
    /*    color: #2c3e50;*/
    /*}*/
</style>
