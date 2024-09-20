<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import CardProject from '@/components/CardProject.vue';
import ModalRemoveProject from '@/components/ModalRemoveProject.vue';
import { Project } from '@/models/Project';
import { useProjectStore } from '@/stores/project';
import pageLogo from "@/assets/images/symbol.png";
import SearchBar from "@/components/SearchBar.vue";
import { useSuggestionStore } from '@/stores/suggestion';

const router = useRouter();
const projectStore = useProjectStore();
const suggestionStore = useSuggestionStore();

const projectList = ref<Project[]>([]);
const showModal = ref<boolean>(false);
const projectIdToRemove = ref<string | null>(null);
const showSearchBar = ref<boolean>(false);
const query = ref<string>('');
const searcherdQuery = ref<string>('');

const totalProjects = computed(() => projectStore.projects.length);

const onlyFavorites = computed(() => {
  return projectStore.onlyFavorites;
});

const sortOption = computed(() => {
  return projectStore.sortOption;
});

const filteredProjectList = computed(() => {
  if(searcherdQuery.value) {
    return projectList.value.filter(project => {
      return project.name.toLowerCase().includes(searcherdQuery.value.toLowerCase());
    })
  }

  return projectList.value;
})

const suggestionList = computed(() => {
  return suggestionStore.getSuggestions;
})

const createNewProject = () => {
  router.push({ name: 'create-project' });
}

const toggleFavoritesView = (event: Event) => {
  const showOnlyFavorites = (event.target as HTMLInputElement).checked;
  projectStore.setOnlyFavorites(showOnlyFavorites); 
};

const toggleSortOption = (event: Event) => {
  const option = ((event.target as HTMLInputElement).value) as 'alphabetical' | 'newest' | 'endingSoon';
  projectStore.setSortOption(option);
}

const removeProject = (projectId: string) => {
  projectIdToRemove.value = projectId;
  showModal.value = true;
};

const confirmRemoval = (projectId: string) => {
  projectStore.removeProject(projectId);
  showModal.value = false;
  projectIdToRemove.value = null;
  projectList.value = projectList.value.filter(project => {
    return project.id !== projectId;
  });
};

const cancelRemoval = () => {
  showModal.value = false;
  projectIdToRemove.value = null;
}

const setShowSearchBar = (value: boolean) => {
  showSearchBar.value = value;
}

const searchProjects = (query: string) => {
  suggestionStore.addSuggestion(query);
  setShowSearchBar(false);
  searcherdQuery.value = query;
}

const removeSuggestion = (suggestionIndex: number) => {
  suggestionStore.removeSuggestion(suggestionIndex);
}

watch([onlyFavorites, sortOption], () => {
  projectList.value = projectStore.projectList;
}, { immediate: true })
</script>

<template>
  <div>
    <SearchBar 
      v-if="showSearchBar"
      :suggestions="suggestionList"
      @search="searchProjects"
      @removeSuggestion="removeSuggestion"
      v-model="query"
    />
    <div v-show="!showSearchBar" class="topbar position-relative">
      <img :src="pageLogo" alt="logo do gerenciador de projetos" width="72" height="72">
      <div class="page-title">
        Gerenciador de Projetos
      </div>
      <div class="search-icon" @click="setShowSearchBar(true)">
        <i class="bi bi-search"></i>
      </div>
    </div>
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
          v-for="project in filteredProjectList"
          :key="project.id"
          :project="project"
          :projectNameQuery="query"
          :highlightProjectName="showSearchBar"
          class="w-100"
          style="max-width: 346px; min-width: 346px;"
          @removeProject="removeProject"
        />
      </TransitionGroup>
    </main>

    <!-- Modal de Remoção de Projeto -->
    <ModalRemoveProject
      v-if="showModal"
      :projectName="projectList.find(p => p.id === projectIdToRemove)?.name || ''"
      :projectId="projectIdToRemove!"
      @confirm="confirmRemoval"
      @cancel="cancelRemoval"
    />
  </div>
</template>

<style scoped>
.topbar {
  height: 80px;
  background: #1C1930;
  box-shadow: 0px 4px 4px 0 #00000040;
  margin-bottom: 4px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.topbar .page-title {
  width: min-content;
}

.topbar .search-icon {
  font-size: 18px;
  position: absolute;
  right: 64px;
  cursor: pointer;
  transition: transform 0.3s;
}

.topbar .search-icon:hover {
  transform: scale(1.4);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

/* Define o estado inicial da entrada (opacidade zero e posição inicial) */
.fade-enter-from, .fade-leave-to /* .fade-leave-active em versões anteriores */ {
  opacity: 0;
  transform: translateY(20px); 
}
</style>
