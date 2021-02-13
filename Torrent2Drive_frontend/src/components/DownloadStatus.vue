<template>
  <v-container>
    <v-card class="mx-auto" elevation="1" v-for="(stat, index) in stats" v-bind:key="index">
      <v-card-title>
        {{stat.name}}
        <v-icon color="green" v-text="'mdi-checkbox-marked-circle'" v-if="stat.progress=='100%'"></v-icon>
        <v-spacer></v-spacer>
        <v-btn text @click="removeTorrent(stat.infoHash, stat.name)" v-if="stat.progress=='100%'">
          <v-icon color="red" v-text="'mdi-close'"></v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-progress-linear
          v-model="stat.progress"
          height="20"
        >
        <strong class="white--text">{{stat.progress}}</strong>
        </v-progress-linear>
        <div class="d-flex space-between">
          <div class="font-weight-medium">Time Remaining:</div>
          <v-spacer></v-spacer>
          <div>{{stat.timeRemaining | toMinutesSeconds}}</div>
        </div>
        <div class="d-flex space-between">
          <div class="font-weight-medium">Size:</div>
          <v-spacer></v-spacer>
          <div>{{stat.totalSize}}</div>
        </div>
        <div class="d-flex space-between">
          <div class="font-weight-medium">Downloaded:</div>
          <v-spacer></v-spacer>
          <div>{{stat.downloaded}}</div>
        </div>
        <div class="d-flex space-between">
          <div class="font-weight-medium">Speed:</div>
          <v-spacer></v-spacer>
          <div>{{stat.speed}}</div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
    span {
        color:#007bff;
    }
</style>

<script>
import {mapGetters} from 'vuex'
export default {
  props: ['downloadCompleted'],
  data () {
    return {
      interval: null
    }
  },
  methods: {
    removeTorrent(infoHash) {
      this.$store.dispatch('deleteStat', {infoHash: infoHash, name: name})
    }
  },
  created () {
    this.interval = setInterval(() => {
      this.$store.dispatch('setStats')
    }, 1000)
  },
  computed: {
    ...mapGetters({
      stats: "getStats"
    })
  },
  destroyed () {
    clearInterval(this.interval)
  },
  filters: {
    toMinutesSeconds (totalSeconds) {
      const hours = ('0' + Math.floor(totalSeconds / 3600)).slice(-2)
      totalSeconds %= 3600
      const minutes = ('0' + Math.floor(totalSeconds / 60)).slice(-2)
      const seconds = ('0' + Math.floor(totalSeconds % 60)).slice(-2)
      return (hours + ':' + minutes + ':' + seconds)
    }
  }
}
</script>
