import { createRouter, createWebHistory } from 'vue-router'
import { utilities } from '@/data/utilities'

function titleToPath(title) {
  return title
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

function getComponentPath(title) {
  // Remove all non-alphanumeric characters for the folder name
  return title.replace(/\//g, '').replace(/[^a-zA-Z0-9]/g, '')
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/views/Home/Index.vue')
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

export default router
