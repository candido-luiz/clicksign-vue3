<script setup lang="ts">
import CardProject from '@/components/CardProject.vue';
import { Project } from '@/models/Project';
import { useProjectStore } from '@/stores/project';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const projectStore = useProjectStore();
const projectList = ref<Project[]>([]);
const totalProjects = computed(() => projectStore.projects.length);

const createNewProject = () => {
  router.push({ name: 'create-project' });
}

const onlyFavorites = computed(() => {
  return projectStore.onlyFavorites;
});

const sortOption = computed(() => {
  return projectStore.sortOption;
})

const toggleFavoritesView = (event: Event) => {
  const showOnlyFavorites = (event.target as HTMLInputElement).checked;
  projectStore.setOnlyFavorites(showOnlyFavorites); 
};

const toggleSortOption = (event: Event) => {
  const option = ((event.target as HTMLInputElement).value) as 'alphabetical' | 'newest' | 'endingSoon';
  projectStore.setSortOption(option);
}

watch([onlyFavorites, sortOption], () => {
  projectList.value = projectStore.projectList;
}, {immediate: true})
</script>

<template>
  <div>
    <!-- Header com quantidade total de projetos -->
    <header class="p-4 bg-light d-flex justify-content-between align-items-center">
      <!-- Título do header -->
       <div class="d-flex align-items-center gap-1">
         <h1 class="fs-4 m-0" style="font-size: 24px; font-weight: 600;">
           Projetos 
         </h1>
         <span class="fs-6" style="font-size: 17px;">({{ totalProjects }})</span>
       </div>

      <!-- Container para os elementos no lado direito -->
      <div class="d-flex align-items-center gap-4">
        <!-- Switch para "Apenas Favoritos" -->
        <div class="form-check form-switch flex-shrink-0">
          <input :checked="onlyFavorites" @change="toggleFavoritesView" class="form-check-input" type="checkbox" id="favoritesSwitch">
          <label class="form-check-label" for="favoritesSwitch">Apenas Favoritos</label>
        </div>

        <!-- Select para Ordenação dos projetos -->
        <select :value="sortOption" @change="toggleSortOption" class="form-select" aria-label="Ordenar projetos">
          <option value="alphabetical" selected>Ordem alfabética</option>
          <option value="newest">Projetos iniciados mais recentemente</option>
          <option value="endingSoon">Projetos próximos à data de finalização</option>
        </select>

        <!-- Botão de Novo Projeto com ícone -->
        <button 
          @click="createNewProject" 
          class="btn btn-primary d-flex align-items-center flex-shrink-0"
        >
          <i class="bi bi-plus-circle" style="font-size: 24px; color: white;"></i>
          <span class="ms-2">Novo projeto</span>
        </button>
      </div>
    </header>

    <!-- Main com a listagem de cards -->
    <main class="p-4">
      <TransitionGroup name="fade" tag="div" class="d-flex flex-wrap gap-4">
        <CardProject
          v-for="project in projectList"
          :key="project.id"
          :project="project"
          class="w-100"
          style="max-width: 346px; min-width: 346px;"
        />
      </TransitionGroup>
</main>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

/* Define o estado inicial da entrada (opacidade zero e posição inicial) */
.fade-enter-from, .fade-leave-to /* .fade-leave-active em versões anteriores */ {
  opacity: 0;
  transform: translateY(20px); 
}
</style>
