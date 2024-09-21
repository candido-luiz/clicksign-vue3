import { useProjectStore } from '@/stores/project';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'project-list',
      component: () => import ('@/views/ListProjectView.vue'),
      meta: {
        canSearchProjects: true
      }
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
  if(to.name === 'project-list') {
    if(!projectStore.hasProjects) {
      return { name: 'no-projects' }
    }
  }
})

export default router
