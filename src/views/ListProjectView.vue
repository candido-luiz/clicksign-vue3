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

const projectStore = useProjectStore();
const suggestionStore = useSuggestionStore();

const showSearchBar = inject(showSearchBarKey)!;
const setShowSearchBar = inject(setShowSearchBarKey)!;

const projectList = ref<Project[]>([]);
const showModal = ref<boolean>(false);
const projectIdToRemove = ref<string | null>(null);
const query = ref<string>('');
const searcherdQuery = ref<string>('');


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

    <HeaderProject />

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
