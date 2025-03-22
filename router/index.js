import { createRouter, createWebHistory } from 'vue-router'
import { getCookie } from '../utils/cookies'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login/chose'
    },
    {
      path: '/login/chose',
      component: () => import('../pages/login/chose.vue')
    },
    {
      path: '/login/verify',
      component: () => import('../pages/login/verify.vue')
    },
    {
      path: '/main',
      component: () => import('../pages/main/index.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const cookies = document.cookie
    const hasValidToken = cookies.split(';').some(cookie => 
      cookie.trim().startsWith('user_token_')
    )
    
    if (!hasValidToken) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
