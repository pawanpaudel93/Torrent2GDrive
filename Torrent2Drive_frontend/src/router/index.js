import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/GoogleLogin'
import Download from '../views/TorrentDownload'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/download',
    name: 'download',
    component: Download
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
