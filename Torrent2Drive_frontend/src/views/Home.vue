<template>
    <div class="container">
        <div class="jumbotron" style="margin-top: 75px;">
            <h1 class="display-4">Hello, world!</h1>
            <p class="lead">Welcome to Torrent2Drive.</p>
            <hr class="my-4">
            <p>You can download your torrent files to GDrive.</p>
            <router-link class="btn btn-primary btn-lg" to="/login" tag="button">Authenticate with Google Drive</router-link>
        </div>
    </div>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('autoLogin')
  }
}
</script>
