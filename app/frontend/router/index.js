import { createRouter, createWebHistory } from 'vue-router'
import { utilities } from '@/data/utilities'
import { titleToPath, getComponentPath } from '@/lib/routes'
import { recordVisit } from '@/lib/recents'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/views/AllUtilities/Index.vue')
  },
  ...utilities.map((utility) => {
    const componentPath = getComponentPath(utility.title)
    return {
      path: `/${titleToPath(utility.title)}`,
      name: utility.title,
      component: () => import(`@/components/views/${componentPath}/Index.vue`)
    }
  })
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  if (to.name && to.name !== 'Home') recordVisit(String(to.name))
})

export default router
