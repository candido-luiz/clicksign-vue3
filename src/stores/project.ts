import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Project } from '@/models/Project'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([]);
  const searchQuery = ref<string>('');
  const recentSearches = ref<string[]>([]);
  const onlyFavorites = ref<boolean>(false)
  const sortOption = ref<'alphabetical' | 'newest' | 'endingSoon'>('alphabetical');

  const favoriteProjects = computed(() => {
    return projects.value.filter(project => project.isFavorite);
  });

  const projectList = computed(() => {
    let filteredProjects = projects.value;

    if (onlyFavorites.value) {
      filteredProjects = favoriteProjects.value;
    }

    const sortedProjects = [...filteredProjects];
    switch (sortOption.value) {
      case 'alphabetical':
        return sortedProjects.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return sortedProjects.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      case 'endingSoon':
        return sortedProjects.sort((a, b) => new Date(a.finalDate).getTime() - new Date(b.finalDate).getTime());
      default:
        return sortedProjects;
    }
  });

  const totalProjects = computed(() => projects.value.length);

  const hasProjects = computed(() => !!totalProjects.value);

  const searchResults = computed(() => {
    if (searchQuery.value.length < 3) return [];
    const query = searchQuery.value.toLowerCase();
    return projects.value.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.customer.toLowerCase().includes(query)
    );
  });

  const addProject = (project: Project) => {
    projects.value.push(project);
  };

  const getProjectById = (id: string) => {
    return projects.value.find(project => project.id === id);
  };

  const removeProject = (id: string) => {
    projects.value = projects.value.filter(project => project.id !== id);
  };

  const editProject = (id: string, updatedProject: Project) => {
    const index = projects.value.findIndex(project => project.id === id);
    if (index !== -1) {
      projects.value[index] = updatedProject;
    }
  };

  const toggleFavorite = (id: string) => {
    const project = projects.value.find(project => project.id === id);
    if (project) {
      project.isFavorite = !project.isFavorite;
    }
  };

  const setSortOption = (option: 'alphabetical' | 'newest' | 'endingSoon') => {
    sortOption.value = option;
  }

  const setOnlyFavorites = (value: boolean) => {
    onlyFavorites.value = value;
  };

  const projectExistsOnList = (id: string) => {
    return !!projects.value.find(project => project.id === id)
  }  

  const addSearchHistory = (query: string) => {
    if (recentSearches.value.length >= 5) {
      recentSearches.value.shift();
    }
    recentSearches.value.push(query);
  };

  return {
    projects,
    addProject,
    removeProject,
    editProject,
    toggleFavorite,
    projectList,
    totalProjects,
    hasProjects,
    searchQuery,
    searchResults,
    recentSearches,
    addSearchHistory,
    sortOption,
    onlyFavorites,
    setOnlyFavorites,
    setSortOption,
    projectExistsOnList,
    getProjectById,
  }
});
