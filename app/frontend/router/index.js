import { createWebHistory, createRouter } from 'vue-router'

import Home from '@/components/views/Home/Index.vue'
import { utilities } from '@/data/utilities'

const titleToPath = (title) => title.replace(/\s+/g, '_')

const routes = utilities.map((utility) => ({
  path: `/${titleToPath(utility.title).toLowerCase()}`,
  name: utility.title,
  meta: {
    description: utility.description
  },
  component: () => import(`@/components/views/${utility.title.replace(/\s+/g, '')}/Index.vue`) // Create New Component based on title without spaces
}))

routes.push({ path: '/', name: 'Home', component: Home })

export default createRouter({
  history: createWebHistory(),
  routes
})
