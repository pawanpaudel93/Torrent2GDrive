<template>
    <v-container>
      <v-card class="mx-auto mb-5" elevation="0">
        <v-form lazy-validation @submit.prevent="onSubmit">
          <v-card-text>
            <v-checkbox
              v-model="doZip"
              label="Zip all torrent files?"
              hide-details
            ></v-checkbox>
            <v-text-field
              v-model="folderID"
              prepend-icon="mdi-folder-google-drive"
              label="FolderID (Optional)"
              autocomplete="on"
              hide-details
            ></v-text-field>
            <v-text-field
              v-model="magnet"
              :class="{invalid: $v.magnet.$error}"
              prepend-icon="mdi-magnet"
              :error-messages="magnetErrors"
              label="Magnet"
              required
              autocomplete="on"
              :hide-details="magnetErrors.length==0?true:false"
            ></v-text-field>
            <p v-if="error" class="red--text">{{error}}</p>
          </v-card-text>
          <v-card-actions class="mb-3">
            <v-row align="center" justify="space-around">
              <v-btn color="primary" @click="showStats=!showStats" type="submit" ref="downloadButton"><v-icon class="mr-1">mdi-cloud-download</v-icon>Download</v-btn>
            </v-row>
          </v-card-actions>
        </v-form>
      </v-card>
      <app-download-status :downloadCompleted="downloadCompleted"></app-download-status>
    </v-container>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'
import { mapGetters } from 'vuex'
import DownloadStats from '@/components/DownloadStatus'
export default {
  name: "TorrentDownload",
  data () {
    return {
      magnet: '',
      folderID: null,
      showStats: false,
      error: null,
      doZip: false
    }
  },
  validations: {
    magnet: {
      required,
      containsMagnet: magnet => {
        return magnet.includes('magnet') || magnet.includes('torrent')
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
      isAuthenticated: 'isAuthenticated'
    }),
    magnetErrors () {
        const errors = []
        if (!this.$v.magnet.$dirty) return errors
        !this.$v.magnet.required && errors.push('Magnet is required.')
        return errors
      },
  },
  components: {
    appDownloadStatus: DownloadStats,
  },
  methods: {
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$dirty && !this.$v.$error) {
        this.$store.state.stats = null
        axios.post('/download', { magnet: this.magnet, doZip: this.doZip, folderID: this.folderID})
          .then(res => {
            this.showStats = false
          })
          .catch(err => {
            if (err.response.status === 500) {
              this.error = err.response.data.error
              setTimeout(() => {
                this.error = null
              }, 10000)
            }
          })
      }
    },
    showDownloads () {
      if (this.$store.getters.getStats) {
        this.showStats = true
      }
    },
    downloadCompleted () {
      this.magnet = ''
      this.showStats = false
      this.$refs.downloadButton.innerText = 'Download'
      this.doZip = false
    }
  },
  created () {
    if (!this.isAuthenticated) {
      this.$store.dispatch('setUser')
    }
    else {
      this.$store.dispatch('inspectToken')
      this.$store.dispatch('setStats')
    }
  }
}
</script>
