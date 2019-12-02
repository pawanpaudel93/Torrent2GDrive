/* eslint-disable handle-callback-err */
/* eslint-disable no-useless-return */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    stats: null,
    finished: false
  },
  mutations: {
    'SET_USER' (state, user) {
      state.user = user
    },
    'SET_STATS' (state, stats) {
      state.stats = stats
    },
    'SET_FINISHED' (state, data) {
      state.finished = data.hasFinished
    },
    'LOGOUT' (state) {
      state.user = null
      state.stats = null
    }
  },
  actions: {
    setUser ({ commit }) {
      axios.get('/auth/user')
        .then(res => {
          commit('SET_USER', res.data)
        })
        .catch((error) => {
        //   console.log(error)
          router.replace('/login')
        })
    },
    setStats ({ commit }) {
      axios.get('/download/stats')
        .then(res => {
          commit('SET_STATS', res.data)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          // console.log(error)
        })
    },
    setFinished ({ commit }) {
      axios.get('/download/finished')
        .then(res => {
          // console.log(res.data)
          commit('SET_FINISHED', JSON.parse(res.data))
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          // console.log(err)
        })
    },
    logout ({ commit }) {
      commit('LOGOUT')
    },
    autoLogin ({ getters }) {
      const expiresIn = localStorage.getItem('expiresIn')
      if (!expiresIn) {
        return
      }
      const now = new Date()
      if (now >= expiresIn) {
        console.log('token expired')
        localStorage.clear()
        return
      } else {
        console.log('token not expired')
        router.replace('/download')
      }
    }
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getStats (state) {
      return state.stats
    },
    isAuthenticated (state) {
      return !!state.user
    },
    isFinished (state) {
      return state.finished
    }
  }
})
