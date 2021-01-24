import axios from 'axios'
import router from '@/router/index'

export default {
  state: {
    user: null,
    token: {
      access: {
        expiresIn: null
      },
      refresh: {
        expiresIn: null
      },
    },
    isAuthenticated: null,
  },
  mutations: {
    'SET_USER' (state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
    'SET_TOKEN' (state, token) {
      state.token = token;
    },
    'SET_ACCESS' (state, token) {
      state.token.access = token;
    },
    'LOGOUT' (state) {
      state.user = state.isAuthenticated = null,
      state.token.access = state.token.refresh = {expiresIn: null}
      localStorage.removeItem('rowdy');
      router.push({name: "Home"}).catch(err => {});
    }
  },
  actions: {
    setUser ({ commit }) {
      axios.get('/auth/user')
        .then(res => {
          commit('SET_USER', res.data.info)
          commit('SET_TOKEN', res.data.token)
        })
        .catch((error) => {
        //   console.log(error)
          router.push({ name: 'Login'}).catch(err => {});
        })
    },
    refreshToken ({commit, state, dispatch}) {
      axios.get("/auth/refresh")
        .then(res => {
          commit('SET_ACCESS', res.data)
        }).catch(error => {
          dispatch("logout")
        })
    },
    logout ({ commit }) {
      localStorage.removeItem('rowdy');
      axios.get('/auth/logout')
      commit('LOGOUT')
      router.push({ name: 'Home'}).catch(err => {});
    },
    inspectToken ({ commit, state, dispatch }) {
      const accessToken = state.token.access;
      const refreshToken = state.token.refresh;
      if (refreshToken.expiresIn) {
        const exp = refreshToken.expiresIn;
        if ((exp - Date.now())/1000 < 300) {
          commit('LOGOUT');
          router.push({name: 'Login'}).catch(err => {});
        }
      }
      if (accessToken.expiresIn) {
        const exp = accessToken.expiresIn;
        if ((exp - Date.now())/1000 < 300) {
          dispatch('refreshToken');
        }
      }
      if (!refreshToken && !accessToken) {
        router.push({name: 'Login'}).catch(err => {});
      }
    }
  },
  getters: {
    getUser (state) {
      return state.user
    },
    isAuthenticated (state) {
      return state.isAuthenticated
    },
  }
}
