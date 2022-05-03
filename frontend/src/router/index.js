import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Dashboard from '../views/Dashboard.vue'
import Profile from '../views/Profile.vue'
import UserProfile from '../views/UserProfile.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/myprofile/:userId',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/profile/:userId',
    name: 'UserProfile',
    component: UserProfile,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
