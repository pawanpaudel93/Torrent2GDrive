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
          dispatch('refreshToken');
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
          dispatch('refreshToken');
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
