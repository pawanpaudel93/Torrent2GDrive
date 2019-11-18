<template>
    <div>
        <div class="download-form">
            <form @submit.prevent="onSubmit">
                <div class="input" :class="{invalid: $v.magnet.$error}">
                    <label for="magnet">Magnet</label>
                    <input
                            type="text"
                            id="magnet"
                            placeholder="magnet link here"
                            v-model="magnet"
                            @blur="$v.magnet.$touch()"
                    >
                </div>
                <p v-if="$v.magnet.$error" class="alert alert-danger">Please enter a valid magnet</p>
                <p v-if="error" class="alert alert-danger">{{error}}</p>
                <div class="submit">
                    <button @click="showStats=!showStats" type="submit" :disabled="!$v.magnet.containsMagnet">Download</button>
                </div>
            </form>
        </div>
        <app-download-status v-if="showStats"></app-download-status>
        <p v-if="finished" class="alert alert-success">Torrent Download Finished</p>
    </div>
</template>

<script>
    import {required} from 'vuelidate/lib/validators';
    import axios from 'axios';
    import { mapGetters } from 'vuex';
    import DownloadStats from '../components/DownloadStatus';
    export default {
        data() {
            return {
                magnet: '',
                finished: false,
                showStats: false,
                error: null
            }
        },
        validations: {
            magnet: {
                required,
                containsMagnet: magnet => {
                    return magnet.includes('magnet') || magnet.includes('torrent');
                }
            }
        }
        ,
        computed: {
            ...mapGetters({
                user: 'getUser'
            })
        },
        components: {
            appDownloadStatus: DownloadStats
        },
        methods: {
            onSubmit() {
                this.$store.state.stats = null;
                this.finished = false;
                axios.post('/download', {magnet: this.magnet})
                  .then(res => {
                      this.finished = res.data.finished;
                      this.showStats = false;
                  })
                  .catch(err => {
                      this.error = 'Invalid magnet link detected!! Enter a valid magnet.';
                      setTimeout(()=>{
                          this.error = null;
                      }, 5000);
                      this.showStats = true;
                  })
            }
        },
        created () {
            this.$store.dispatch('setUser');
        }
    }
</script>

<style scoped>
    .download-form {
        width: 600px;
        margin: 30px auto;
        border: 1px solid #eee;
        padding: 20px;
        box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
    }
    .input {
        margin: 10px auto;
    }

    .input label {
        display: block;
        color: black;
        margin-bottom: 6px;
    }

    .input.inline label {
        display: inline;
    }

    .input input {
        font: inherit;
        width: 100%;
        padding: 6px 12px;
        box-sizing: border-box;
        border: 1px solid #ccc;
    }

    .input.inline input {
        width: auto;
    }

    .input input:focus {
        outline: none;
        border: 1px solid #521751;
        background-color: #eee;
    }
    .input.invalid input {
        border: 1px solid red;
        background-color: #ffc9aa;
    }
    .input.invalid label {
        color: red;
    }
    .submit button {
        border: 1px solid #521751;
        color: #007bff;
        padding: 10px 20px;
        font: inherit;
        cursor: pointer;
        display: inline;
    }
    .submit button:hover,
    .submit button:active {
        background-color: #007bff;
        color: white;
    }
    .submit button[disabled],
    .submit button[disabled]:hover,
    .submit button[disabled]:active {
        border: 1px solid #ccc;
        background-color: transparent;
        color: #ccc;
        cursor: not-allowed;
    }
</style>
