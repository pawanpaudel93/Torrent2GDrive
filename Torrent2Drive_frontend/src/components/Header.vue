<template>
    <nav class="navbar navbar-dark bg-primary navbar-expand-sm">
        <router-link class="navbar-brand" to="/" tag="a">
            <img src="../../public/img/icons/Torrent2Drive.png" width="30" height="30" alt="logo"/>
            Torrent2GDrive
        </router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNavDropdown" class="navbar-collapse collapse">
            <ul class="navbar-nav mr-auto">
                <router-link class="nav-item" tag="li" to="/login" v-if="!isAuthenticated" active-class="active"><a class="nav-link">Authenticate with Google Drive</a></router-link>
                <router-link class="nav-item" tag="li" to="/download" v-if="isAuthenticated" active-class="active"><a class="nav-link">Download</a></router-link>
            </ul>
            <ul class="navbar-nav" v-if="isAuthenticated">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img v-if="user" :src="user.avatar" width="30" height="30" class="rounded-circle">
                        <img v-else src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg" width="30" height="30" class="rounded-circle">
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <p class="dropdown-item" v-if="user">{{user.name}}</p>
                        <hr>
                        <a class="dropdown-item" href="#" @click="logout">Logout</a>
                    </div>
                </li>
                <li class="nav-item">
                    <p class="dropdown-item" v-if="user" style="color: #eeeeee; background: transparent">({{user.email}})</p>
                </li>

            </ul>
        </div>
    </nav>
</template>

<script>
import axios from 'axios'
export default {
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style>
    .navbar {
        margin-bottom: 20px;
    }
    li a {
        text-decoration: none;
        color: lightsteelblue;
    }

    li a:hover,
    li a:active,
    li a.router-link-active {
        color: white;
    }

</style>
