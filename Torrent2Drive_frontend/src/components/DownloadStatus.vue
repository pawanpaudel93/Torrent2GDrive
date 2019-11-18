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
        data() {
           return {
               stats: null
           }
        },
        created () {
            setInterval(() => {
                this.$store.dispatch('setStats');
                this.stats = JSON.parse(this.$store.getters.getStats);
            }, 1000)
        },
        filters: {
            toMinutesSeconds(seconds) {
                return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
            }
        }
    }
</script>
