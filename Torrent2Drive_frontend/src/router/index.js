import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (store.getters.isAuthenticated) { next({name: "Download", query: {redirectedFrom: to.fullPath}}) }
      else next()
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/GoogleLogin.vue"),
    beforeEnter: (to, from, next) => {
      if (store.getters.isAuthenticated) { next({name: "Download", query: {redirectedFrom: to.fullPath}}) }
      else next()
    }
  },
  {
    path: '/download',
    name: 'Download',
    component: () => import("@/views/TorrentDownload.vue"),
    afterEnter: async (to, from, next) => {
      if (!store.getters.isAuthenticated && router.history.current.name != "Login") {next({name: "Login", query: { redirectedFrom: to.fullPath}})}
      else next()
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
