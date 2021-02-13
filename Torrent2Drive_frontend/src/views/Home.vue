<template>
  <v-container>
    <div class="justify-center pa-10 ma-auto mt-5" style="background-color: #e9ecef;">
      <h1 class="display-4">Hello, world!</h1>
      <p class="font-weight-regular">Welcome to Torrent2Drive.</p>
      <hr class="my-4">
      <p class="font-weight-light">You can download your torrent files to GDrive.</p>
      <v-btn color="primary" to="/login">Authenticate with GDrive</v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Home"
}
</script>
