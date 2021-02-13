<template>
  <div>
    <v-app-bar
        app
        color="#007bff"
        dark
      >
      <router-link to="/" tag="a">
        <v-img
          alt="Torrent2GDrive Logo"
          class="shrink mr-2"
          contain
          src="@/assets/icons/logo.png"
          width="60"
        />
      </router-link>
      <v-toolbar-title>Torrent2GDrive</v-toolbar-title>
      <v-toolbar-items class="ml-3 d-none d-sm-flex">
        <v-btn
          v-for="item in activeItems"
          :key="item.title"
          :to="item.link"
          text
        ><v-icon>{{ item.icon }}</v-icon>{{item.title}}</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items class="ml-3 d-none d-sm-flex" v-if="isAuthenticated">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                dark
                icon
                v-on="on"
              >
                <v-img
                  alt="user-avatar"
                  class="shrink mr-2 rounded-circle"
                  contain
                  :src="user.avatar"
                  v-if="user"
                  width="45"
                  aspect-ratio="1"
                />
              </v-btn>
            </template>
            <v-card>
              <v-list>
                <v-subheader><v-icon>mdi-account</v-icon>{{ user.name }}</v-subheader>
                <v-divider></v-divider>
                <v-list-item
                  v-for="dropdown in dropdowns"
                  :key="`dropdown-key-${dropdown.id}`"
                >
                  <v-list-item-title>
                    <v-btn @click="logout"><v-icon>{{dropdown.icon}}</v-icon>{{ dropdown.title }}</v-btn>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-toolbar-items>
      <v-app-bar-nav-icon class="hidden-sm-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      class="hidden-sm-and-up"
      v-model="drawer"
      absolute
      temporary
    >
    	<v-list-item v-if="isAuthenticated">
        <v-list-item-avatar>
          <v-img
            alt="user-avatar"
            class="rounded-circle"
            contain
            :src="user.avatar"
            v-if="user"
            width="25"
            aspect-ratio="1"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{user.name}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in activeItems"
          :key="item.title"
          :to="item.link"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout" v-if="isAuthenticated">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      drawer: null,
      items: [
        { title: 'Login', icon: 'mdi-login', link: '/login' },
        { title: 'Download', icon: 'mdi-download', link: '/download' },
      ],
      dropdowns: [
          {id: 1, title: "Logout", icon: "mdi-logout"},
        ]
    }
  },
  computed: {
    ...mapGetters({
      'isAuthenticated': 'isAuthenticated',
      'user': 'getUser'
    }),
    activeItems () {
      if (this.isAuthenticated) {return [this.items[1]]}
      return [this.items[0]]
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  },
}
</script>
