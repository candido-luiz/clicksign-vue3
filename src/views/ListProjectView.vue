<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue';
import CardProject from '@/components/CardProject.vue';
import ModalRemoveProject from '@/components/ModalRemoveProject.vue';
import { Project } from '@/models/Project';
import { useProjectStore } from '@/stores/project';
import SearchBar from "@/components/SearchBar.vue";
import { useSuggestionStore } from '@/stores/suggestion';
import { setShowSearchBarKey, showSearchBarKey } from '@/injection-keys/keys';
import ItemsNotFound from '@/components/ItemsNotFound.vue';
import HeaderProject from '@/components/HeaderProject.vue';
import { useToast } from '@/composables/useToast';

const projectStore = useProjectStore();
const suggestionStore = useSuggestionStore();
const { notify } = useToast();

const showSearchBar = inject(showSearchBarKey)!;
const setShowSearchBar = inject(setShowSearchBarKey)!;

const projectList = ref<Project[]>([]);
const showModal = ref<boolean>(false);
const projectIdToRemove = ref<string | null>(null);
const query = ref<string>('');
const searchedQuery = ref<string>('');


const onlyFavorites = computed(() => {
  return projectStore.onlyFavorites;
});

const sortOption = computed(() => {
  return projectStore.sortOption;
});

const allProjects = computed(() => {
  return projectStore.projects;
})

const filteredProjectList = computed(() => {
  if(searchedQuery.value) {
    return projectList.value.filter(project => {
      return project.name.toLowerCase().includes(searchedQuery.value.toLowerCase());
    })
  }

  return projectList.value;
})

const suggestionList = computed(() => {
  return suggestionStore.getSuggestions;
})

const resetFilters = () => {
  projectStore.setOnlyFavorites(false);
  query.value = "";
  searchedQuery.value = "";
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
  notify({
    message: "Projeto removido com sucesso!",
  });
};

const cancelRemoval = () => {
  showModal.value = false;
  projectIdToRemove.value = null;
}

const searchProjects = (query: string) => {
  suggestionStore.addSuggestion(query);
  searchedQuery.value = query;
}

const removeFocusFromSearchBar = () => {
  const listView = document.querySelector("#list-view") as HTMLElement || undefined;
  listView?.focus();
}

const closeSearchBar = () => {
  removeFocusFromSearchBar();
  if(!searchedQuery.value) {
    setShowSearchBar(false);
  }
}

const cancelSearch = () => {
  setShowSearchBar(false);
  searchedQuery.value = "";
  query.value = "";
}

const removeSuggestion = (suggestionIndex: number) => {
  suggestionStore.removeSuggestion(suggestionIndex);
}


watch([onlyFavorites, sortOption], () => {
  projectList.value = projectStore.projectList;
}, { immediate: true })
</script>

<template>
  <div id="list-view" tabindex="-1">
    <SearchBar 
      v-if="showSearchBar"
      :suggestions="suggestionList"
      v-model="query"
      @search="searchProjects"
      @removeSuggestion="removeSuggestion"
      @close="closeSearchBar"
    />

    <HeaderProject v-if="!searchedQuery" />

    <header v-else-if="filteredProjectList.length" class="search-results-header pt-4 px-4">
      <div class="d-flex flex-column align-items-start">
        <button
          @click="cancelSearch"
          class="ps-0 btn btn-link text-decoration-none d-flex align-items-center"
        >
          <i class="bi bi-arrow-left me-2"></i> 
          <span>Voltar</span>
        </button>
        <h1 class="fs-4 m-0">Resultado da busca</h1>
      </div>
    </header>

    <main v-if="filteredProjectList.length" class="p-4">
      <div v-auto-animate class="card-grid">
        <CardProject
          v-for="project in filteredProjectList"
          :key="project.id"
          :project="project"
          :projectNameQuery="query"
          :highlightProjectName="showSearchBar"
          class=""
          @removeProject="removeProject"
        />
      </div>
    </main>

    <main v-else-if="allProjects.length">
      <ItemsNotFound 
        title="Nenhum projeto encontrado"
      >
        <p>Não foram encontrados resultados para os filtros selecionados</p>
        <template #action>
          <button @click="resetFilters" class="btn btn-primary" type="button">Limpar filtros</button>
        </template>
      </ItemsNotFound>
    </main>

    <main v-else>
      <ItemsNotFound 
        title="Projetos removidos"
      >
        <p>Todos os projetos foram excluídos</p>
        <template #action>
          <RouterLink to="/form-project" role="button" class="btn btn-primary" >Criar novo projeto</RouterLink>
        </template>
      </ItemsNotFound>
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
#list-view {
  &:focus {
    outline: none;
  }
}
.search-results-header {
  h1 {
    color: $clicksign-emphasis-text-color;
  }
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, auto));
  align-items: center;
  gap: 30px;
}
</style>
