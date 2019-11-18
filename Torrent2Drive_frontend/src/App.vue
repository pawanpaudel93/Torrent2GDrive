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
          const expiresIn = localStorage.getItem('expiresIn');
          console.log(expiresIn);
          if (!expiresIn) {
              return;
          }
          const now = new Date();
          if (now >= expiresIn) {
              return;
          } else {
              this.$store.commit('CHANGE_COMPONENT', 'app-torrent-download');
          }
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
