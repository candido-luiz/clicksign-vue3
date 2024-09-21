<script setup lang="ts">
import { ref, computed, watch, inject, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import CardProject from '@/components/CardProject.vue';
import ModalRemoveProject from '@/components/ModalRemoveProject.vue';
import { Project } from '@/models/Project';
import { useProjectStore } from '@/stores/project';
import SearchBar from "@/components/SearchBar.vue";
import { useSuggestionStore } from '@/stores/suggestion';
import { setShowSearchBarKey, showSearchBarKey } from '@/injection-keys/keys';
import ItemsNotFound from '@/components/ItemsNotFound.vue';

const router = useRouter();
const projectStore = useProjectStore();
const suggestionStore = useSuggestionStore();

const showSearchBar = inject(showSearchBarKey)!;
const setShowSearchBar = inject(setShowSearchBarKey)!;

const projectList = ref<Project[]>([]);
const showModal = ref<boolean>(false);
const projectIdToRemove = ref<string | null>(null);
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

const resetFilters = () => {
  projectStore.setOnlyFavorites(false);
  query.value = "";
  searcherdQuery.value = "";
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
    
    <header class="p-4 d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-1">
        <h1 class="fs-4 m-0" style="font-size: 24px; font-weight: 600;">
          Projetos 
        </h1>
        <span class="fs-6" style="font-size: 17px;">({{ totalProjects }})</span>
      </div>

      <div class="d-flex align-items-center gap-4">
        <div class="form-check form-switch flex-shrink-0">
          <input :checked="onlyFavorites" @change="toggleFavoritesView" class="form-check-input" type="checkbox" id="favoritesSwitch">
          <label class="form-check-label" for="favoritesSwitch">Apenas Favoritos</label>
        </div>

        <select :value="sortOption" @change="toggleSortOption" class="form-select" aria-label="Ordenar projetos">
          <option value="alphabetical" selected>Ordem alfabética</option>
          <option value="newest">Projetos iniciados mais recentemente</option>
          <option value="endingSoon">Projetos próximos à data de finalização</option>
        </select>

        <button 
          @click="createNewProject" 
          class="btn btn-primary d-flex align-items-center flex-shrink-0"
        >
          <i class="bi bi-plus-circle" style="font-size: 24px; color: white;"></i>
          <span class="ms-2">Novo projeto</span>
        </button>
      </div>
    </header>

    <main v-if="filteredProjectList.length" class="p-4">
      <TransitionGroup name="fade" tag="div" class="card-grid">
        <CardProject
          v-for="project in filteredProjectList"
          :key="project.id"
          :project="project"
          :projectNameQuery="query"
          :highlightProjectName="showSearchBar"
          class=""
          @removeProject="removeProject"
        />
      </TransitionGroup>
    </main>

    <main v-else>
      <ItemsNotFound 
        @resetFilters="resetFilters"
      />
    </main>

    <ModalRemoveProject
      v-if="showModal"
      :projectName="projectList.find(p => p.id === projectIdToRemove)?.name || ''"
      :projectId="projectIdToRemove!"
      @confirm="confirmRemoval"
      @cancel="cancelRemoval"
    />
  </div>
</template>

<style scoped lang="scss">

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, auto));
  justify-items: center;
  align-items: center;
  gap: 30px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px); 
}
</style>
