import { useProjectStore } from '@/stores/project';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import ('@/views/PageNotFoundView.vue'),
      meta: {
        hideTopBar: true
      },
    },
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
      path: '/project-not-found',
      name: 'project-not-found',
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
            return { name: 'project-not-found'}
          }
        }

      }
    },
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
