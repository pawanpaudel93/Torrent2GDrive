import axios from 'axios'

export default {
  state: {
    stats: [],
  },
  mutations: {
    'SET_STATS' (state, stats) {
      state.stats = stats
    },
  },
  actions: {
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
    deleteStat ({ commit }, payload) {
      axios.post(`/download/stats/`, payload)
        .then(res => {
          // console.log(res.data)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          // console.log(error)
        })
    },
  },
  getters: {
    getStats (state) {
      return state.stats
    },
    isFinished (state) {
      return state.finished
    }
  }
}
