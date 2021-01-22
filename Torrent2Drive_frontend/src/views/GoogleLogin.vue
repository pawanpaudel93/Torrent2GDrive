<template>
    <v-card outlined class="mx-auto card-1 mt-5" max-width="500">
        <v-card-title class="card-header">Google Drive Authentication</v-card-title>
        <hr color="primary--text">
        <v-spacer></v-spacer>
        <v-card-text class="font-weight-regular primary--text text-h6 text-center">
            Click on Login with Google to authenticate with Google Drive to upload your torrent files.
        </v-card-text>
        <v-card-actions>
			<v-btn
				class="mx-auto"
				outlined
				color="primary"
				href="/auth/google-drive"
			>
				Login with Google
			</v-btn>
        </v-card-actions>
  </v-card>
</template>

<script>
    export default {
        name: "GoogleLogin"
    }
</script>

<style>
    .card-1 {
        padding: 10px 10px 10px 10px;
        box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
    }
</style>
