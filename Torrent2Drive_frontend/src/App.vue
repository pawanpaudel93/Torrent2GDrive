<template>
  <v-app>
    <app-header></app-header>
    <v-main class="mt-3">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Header from '@/components/Header';

export default {
  name: 'App',

  components: {
    appHeader: Header,
  },
};
</script>

<style>
  a {
    text-decoration: none !important;
  }
</style>