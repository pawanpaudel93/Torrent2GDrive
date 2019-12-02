<template>
    <div class="col">
        <div class="card  card-1 border-primary mb-3" style="max-width: 30rem;">
            <div class="card-header">Google Drive Authentication</div>
            <div class="card-body text-primary">
                <h5 class="card-title">Click on Login with Google to authenticate with Google Drive to upload your torrent files.</h5>
                <p class="card-text">
                    <a type="button" class="btn btn-outline-primary" href="/auth/google-drive" @click="setTokenTimer">Login with Google</a>
                </p>
            </div>
         </div>
    </div>
</template>

<script>
    export default {
        methods: {
            setTokenTimer() {
                const now = new Date()
                const expirationDate = new Date(now.getTime() + 60*60*1000)
                localStorage.setItem('expiresIn', expirationDate);
            }
        },
        created () {
            this.$store.dispatch('autoLogin')
        }
    }
</script>

<style>
    .card-1 {
        padding: 10px 10px 10px 10px;
        box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
    }
    .card {
        margin: 100px auto; /* Added */
    }
</style>
