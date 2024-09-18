<script setup lang="ts">
import CardProject from '@/components/CardProject.vue';
import { Project } from '@/models/Project';
import { useProjectStore } from '@/stores/project';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const projectStore = useProjectStore();

const projects = computed<Project[]>(() => projectStore.projects);
const totalProjects = computed(() => projectStore.projects.length);

const createNewProject = () => {
  router.push({name: 'create-project'});
}
</script>

<template>
  <div>
    <!-- Header com quantidade total de projetos -->
    <header class="tw-p-4 tw-bg-gray-100 tw-border-b tw-border-gray-300 tw-flex tw-justify-between tw-items-center">
      <h1 class="tw-text-2xl tw-font-semibold">Projetos ({{ totalProjects }})</h1>
      <button 
        @click="createNewProject" 
        class="tw-bg-purple-500 tw-text-white tw-px-4 tw-py-2 tw-rounded tw-shadow-md tw-hover:bg-purple-600"
      >
        Novo projeto
      </button>
    </header>

    <!-- Main com a listagem de cards -->
    <main class="tw-p-4">
      <div class="tw-flex tw-flex-wrap tw-gap-4">
        <CardProject
          v-for="project in projects"
          :key="project.id"
          :project="project"
          class="tw-w-full tw-max-w-[346px] tw-min-w-[346px]"
        />
      </div>
    </main>
  </div>
</template>



<style scoped>
/* Adicione estilos adicionais se necessário */
</style>
