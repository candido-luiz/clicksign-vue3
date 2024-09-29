<script setup lang="ts">
import { useProjectStore } from '@/stores/project';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const projectStore = useProjectStore();

const totalProjects = computed(() => projectStore.projects.length);
const onlyFavorites = computed(() => {
  return projectStore.onlyFavorites;
});
const sortOption = computed(() => {
  return projectStore.sortOption;
});


const toggleFavoritesView = (event: Event) => {
  const showOnlyFavorites = (event.target as HTMLInputElement).checked;
  projectStore.setOnlyFavorites(showOnlyFavorites); 
};

const toggleSortOption = (event: Event) => {
  const option = ((event.target as HTMLInputElement).value) as 'alphabetical' | 'newest' | 'endingSoon';
  projectStore.setSortOption(option);
}

const createNewProject = () => {
  router.push({ name: 'form-project' });
}

</script>

<template>
  <header class="sticky-header px-4 pt-4 d-flex justify-content-between align-items-center">
    <div class="d-flex align-items-center gap-2">
      <h1 class="fs-4 fw-semibold m-0">
        Projetos 
      </h1>
      <span class="projet-count fs-6" style="font-size: 17px;">({{ totalProjects }})</span>
    </div>

    <div class="mobile-header-options gap-3">
      <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
        <i class="bi bi-funnel-fill"></i>
      </button>
  
      <div class="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasTopLabel">Filtros</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body d-flex flex-column gap-3">
          <div class="form-check form-switch flex-shrink-0">
            <input :checked="onlyFavorites" @change="toggleFavoritesView" class="form-check-input" type="checkbox" id="favoritesSwitch">
            <label class="form-check-label" for="favoritesSwitch">Apenas Favoritos</label>
          </div>
          <div>
            <label for="sortOptions">Ordenar por:</label>
            <select :value="sortOption" id="sortOptions" @change="toggleSortOption" class="form-select" aria-label="Ordenar projetos">
              <option value="alphabetical" selected>Ordem alfabética</option>
              <option value="newest">Projetos iniciados mais recentemente</option>
              <option value="endingSoon">Projetos próximos à data de finalização</option>
            </select>
          </div>
        </div>
      </div>
  
      <button 
        id="createProject"
        @click="createNewProject" 
        class="btn btn-primary d-flex align-items-center flex-shrink-0 px-3"
      >
        <i class="bi bi-plus-circle"></i>
        <span class="ms-2">Novo</span>
      </button>
    </div>


    <div class="desktop-header-options align-items-center gap-4">
      <div class="form-check form-switch flex-shrink-0">
        <input :checked="onlyFavorites" @change="toggleFavoritesView" class="form-check-input" type="checkbox" id="favoritesSwitchDesktop">
        <label class="form-check-label" for="favoritesSwitchDesktop">Apenas Favoritos</label>
      </div>

      <select id="sortOptionsDesktop" :value="sortOption" @change="toggleSortOption" class="form-select" aria-label="Ordenar projetos">
        <option value="alphabetical" selected>Ordem alfabética</option>
        <option value="newest">Projetos iniciados mais recentemente</option>
        <option value="endingSoon">Projetos próximos à data de finalização</option>
      </select>

      <button 
        id="createProjectDesktop"
        @click="createNewProject" 
        class="btn btn-primary d-flex align-items-center flex-shrink-0 px-4"
      >
        <i class="bi bi-plus-circle" style="font-size: 20px; color: white;"></i>
        <span class="ms-2">Novo projeto</span>
      </button>
    </div>
    </header>
</template>

<style scoped lang="scss">
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: $clicksign-background;

  h1 {
    color: $clicksign-emphasis-text-color;
  }

  .projet-count {
    color: $clicksign-primary-color;
  }
}
.form-switch {
  display: flex;
  gap: 10px;
  align-items: center;
  .form-check-input {
    width: 40px;
    height: 20px;
    margin-bottom: 5px;
  }
  .form-check-label{
    font-size: 16px;
    color: #1e1e1e !important;
  }

}
.form-select {
  color: $clicksign-topbar-background;

}
.mobile-header-options {
  display: flex;
}
.desktop-header-options {
  display: none;
}
.offcanvas {
  background-color: $clicksign-background;
}

@media (width >= 990px) {
  .mobile-header-options {
    display: none;
  }
  .desktop-header-options {
    display: flex;
  }
}
</style>