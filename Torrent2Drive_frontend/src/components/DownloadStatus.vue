<template>
    <div class="card border-primary mb-3" style="max-width: 30rem;">
        <div class="card-header">Download Stats</div>
        <div class="card-body text-primary">
            <h5 class="card-title">{{stats.name}}</h5>
            <div class="progress" style="height: 20px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" :style="{width: stats.progress, textAlign: 'center'}">
                    <span style="color: black;"><b>{{stats.progress}}</b></span>
                </div>
            </div>
            <p class="card-text">
                Time Remaining: <span>{{stats.timeRemaining | toMinutesSeconds}}</span><br>
                Speed: <span>{{stats.speed}}</span> <br>
                Downloaded: <span>{{stats.downloaded}}</span> <br>
                Total Size: <span>{{stats.totalSize}}</span>
            </p>
        </div>
    </div>
</template>

<style scoped>
    span {
        color:#007bff;
    }
</style>

<script>
export default {
  props: ['downloadCompleted'],
  data () {
    return {
      stats: null,
      interval: null
    }
  },
  created () {
    this.interval = setInterval(() => {
      this.$store.dispatch('setStats')
      if (JSON.parse(this.$store.getters.getStats)) {
        this.stats = JSON.parse(this.$store.getters.getStats)
      }
      if (Number(JSON.parse(this.$store.getters.getStats).timeRemaining) <= 20) {
        this.$store.dispatch('setFinished')
        if (JSON.parse(this.$store.getters.isFinished)) {
          this.downloadCompleted()
        }
      }
    }, 1000)
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
