import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Project } from '@/models/Project'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([]);
  const searchQuery = ref<string>('');
  const recentSearches = ref<string[]>([]);
  const onlyFavorites = ref<boolean>(false)

  // Opções de ordenação
  const sortOption = ref<'alphabetical' | 'newest' | 'endingSoon'>('alphabetical');

  // Adiciona um novo projeto
  const addProject = (project: Project) => {
    projects.value.push(project);
  };

  // Remove um projeto pelo UUID
  const removeProject = (id: string) => {
    projects.value = projects.value.filter(project => project.id !== id);
  };

  // Edita um projeto existente pelo UUID
  const editProject = (id: string, updatedProject: Project) => {
    const index = projects.value.findIndex(project => project.id === id);
    if (index !== -1) {
      projects.value[index] = updatedProject;
    }
  };

  // Favorita ou desfavorece um projeto pelo UUID
  const toggleFavorite = (id: string) => {
    const project = projects.value.find(project => project.id === id);
    if (project) {
      project.isFavorite = !project.isFavorite;
    }
  };

  const setSortOption = (option: 'alphabetical' | 'newest' | 'endingSoon') => {
    sortOption.value = option;
  }

  const favoriteProjects = computed(() => {
    return projects.value.filter(project => project.isFavorite);
  });

  // Filtra e ordena os projetos com base nas opções fornecidas
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

  const setOnlyFavorites = (value: boolean) => {
    onlyFavorites.value = value;
  };

  // Total de projetos
  const totalProjects = computed(() => projects.value.length);

  const hasProjects = computed(() => !!totalProjects.value);

  // Barra de busca
  const searchResults = computed(() => {
    if (searchQuery.value.length < 3) return [];
    const query = searchQuery.value.toLowerCase();
    return projects.value.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.customer.toLowerCase().includes(query)
    );
  });

  // Adiciona uma nova busca ao histórico
  const addSearchHistory = (query: string) => {
    if (recentSearches.value.length >= 5) {
      recentSearches.value.shift();
    }
    recentSearches.value.push(query);
  };

  // Destaca o texto que corresponde à busca
  const highlightText = (text: string) => {
    const query = searchQuery.value.toLowerCase();
    if (query.length < 3) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return {
    projects,
    addProject,
    removeProject,
    editProject,
    toggleFavorite,
    projectList, // Adiciona a computada projectList
    totalProjects,
    hasProjects,
    searchQuery,
    searchResults,
    recentSearches,
    addSearchHistory,
    highlightText,
    sortOption,
    onlyFavorites,
    setOnlyFavorites,
    setSortOption,
  }
});
