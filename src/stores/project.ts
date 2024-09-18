import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Project } from '@/models/Project'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([]);
  const searchQuery = ref('');
  const recentSearches = ref<string[]>([]);

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

  // Ordena os projetos
  const sortedProjects = computed(() => {
    const sorted = [...projects.value];
    switch (sortOption.value) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return sorted.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
      case 'endingSoon':
        return sorted.sort((a, b) => a.finalDate.getTime() - b.finalDate.getTime());
      default:
        return sorted;
    }
  });

  // Filtro de favoritos
  const favoriteProjects = computed(() => {
    return projects.value.filter(project => project.isFavorite);
  });

  // Total de projetos
  const totalProjects = computed(() => projects.value.length);

  const hasProjects = computed(() => !!totalProjects.value);

  // Opções de ordenação
  const sortOption = ref<'alphabetical' | 'newest' | 'endingSoon'>('alphabetical');

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
    sortedProjects,
    favoriteProjects,
    totalProjects,
    hasProjects,
    searchQuery,
    searchResults,
    recentSearches,
    addSearchHistory,
    highlightText,
    sortOption
  }
});
