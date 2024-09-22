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
      },
    },
    {
      path: '/no-projects',
      name: 'no-projects',
      component: () => import ('@/views/NoProjectView.vue'),
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import ('@/views/ProjectNotFoundView.vue')
    },
    {
      path: '/form-project/:projectId?',
      name: 'form-project',
      component: () => import('@/views/FormProjectView.vue'),
      beforeEnter(to){
        const projectId = to.params.projectId;
        if(projectId && typeof projectId === 'string') {
          const projectStore = useProjectStore();
          if(!projectStore.projectExistsOnList(projectId)) {
            return { name: 'not-found'}
          }
        }

      }
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
