import { useProjectStore } from '@/stores/project';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import ('@/views/ListProjectView.vue'),
    },
    {
      path: '/no-projects',
      name: 'no-projects',
      component: () => import ('@/views/NoProjectView.vue'),
    },
    {
      path: '/create-project',
      name: 'create-project',
      component: () => import('@/views/CreateProjectView.vue'),
    }
  ]
});

router.beforeEach((to, from) => {
  const projectStore = useProjectStore(); 
  if(to.name === 'home') {
    if(!projectStore.hasProjects) {
      return { name: 'no-projects' }
    }
  }
})

export default router
