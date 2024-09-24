import { setActivePinia, createPinia } from 'pinia';
import { useProjectStore } from '../project';
import { Project } from '@/models/Project';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Project Store', () => {
  let store: ReturnType<typeof useProjectStore>;

  const createProject = (
    id: string, name: string, customer: string, 
    startDate = new Date(), finalDate = new Date(), 
    isFavorite = false
  ): Project => {
    return {
      id,
      name,
      customer,
      startDate,
      finalDate,
      isFavorite
    }
  }

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useProjectStore();
  });

  it('Adicionar projeto', () => {
    const project: Project = createProject('1', 'Projeto 1', 'Cliente teste');
    store.addProject(project);
    
    expect(store.projects).toHaveLength(1);
    expect(store.projects[0]).toEqual(project);
  });

  it('Buscar projeto por id', () => {
    const project: Project = createProject('1', 'Projeto 1', 'Cliente teste');
    store.addProject(project);
    
    const projectById = store.getProjectById('1');
    
    expect(projectById).toEqual(project);
  });

  it('Remover projeto por id', () => {
    const project1: Project = createProject('1', 'Projeto 1', 'Cliente teste');
    const project2= { ...project1, id: '2'};
    store.addProject(project1);
    store.addProject(project2);
    
    store.removeProject('1');
    
    expect(store.projects).toHaveLength(1);
    expect(store.projects[0].id).toEqual('2');
  });

  it('Editar projeto', () => {
    const project: Project = createProject('1', 'Projeto 1', 'Cliente teste');
    store.addProject(project);
    const updatedProject: Project = createProject('2', 'Updated Project', 'Cliente B', new Date(), new Date(), true);
    store.editProject('1', updatedProject);
    
    expect(store.projects[0]).toEqual(updatedProject);
  });

  it('Toggle favorito', () => {
    const project: Project = createProject('1', 'Projeto 1', 'Cliente teste');
    store.addProject(project);
    
    store.toggleFavorite('1');
    
    expect(store.projects[0].isFavorite).toBe(true);
    
    store.toggleFavorite('1');
    
    expect(store.projects[0].isFavorite).toBe(false);
  });

  it('Set ordenacao', () => {
    store.setSortOption('newest');
    expect(store.sortOption).toEqual('newest');
  });

  it('Verifica se projeto existe na lista', () => {
    const project: Project = createProject('1', 'Projeto 1', 'Cliente teste');
    store.addProject(project);
    const projectExistOnList = store.projectExistsOnList('1');
    const anotherProjectExistOnList = store.projectExistsOnList('2');
    expect(projectExistOnList).toBe(true);
    expect(anotherProjectExistOnList).toBe(false);
  });

  it('Numero total de projetos', () => {
    expect(store.totalProjects).toBe(0);
    
    const project: Project = createProject('1', 'Projeto 1', 'Cliente teste');
    store.addProject(project);
    
    expect(store.totalProjects).toBe(1);
  });

  it('Projetos filtrados pela busca', () => {
    const project1: Project = createProject('1', 'Projeto 1', 'Cliente teste');
    const project2: Project = createProject('2', 'Projeto 2', 'Cliente B');
    
    store.addProject(project1);
    store.addProject(project2);
    
    store.searchQuery = 'Projeto 1';
    const results = store.searchResults;
    
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual(project1);

    store.searchQuery = 'projeto 1';
    const sensitiveCase = store.searchResults;
    
    expect(sensitiveCase).toHaveLength(1);
    expect(sensitiveCase[0]).toEqual(project1);

    store.searchQuery = 'Inexistente';
    const inexistentResults = store.searchResults;
    expect(inexistentResults).toHaveLength(0);

    store.searchQuery = 'Pr';
    const invalidQueryResults = store.searchResults;
    expect(invalidQueryResults).toHaveLength(0);

  });

  it('Adicionar query ao historico de busca', () => {
    store.addSearchHistory('search 1');
    store.addSearchHistory('search 2');
    store.addSearchHistory('search 3');
    store.addSearchHistory('search 4');
    store.addSearchHistory('search 5');
    
    expect(store.recentSearches).toHaveLength(5);
    
    store.addSearchHistory('search 6');
    
    expect(store.recentSearches).toHaveLength(5);
    expect(store.recentSearches[0]).toBe('search 2');
  });

  it('Filtragem por favoritos e ordenacao - oredenacao padrao: onlyFavorites false e order alphabetical', () => {
    const project1: Project = createProject('1', 'Projeto 1', 'Cliente 1');
    const project2: Project = createProject('2', 'Projeto 2', 'Cliente 2');
    const project3: Project = createProject('3', 'Projeto 3', 'Cliente 3');
    const project4: Project = createProject('4', 'Projeto 4', 'Cliente 4');
    store.addProject(project1);
    store.addProject(project2);
    store.addProject(project3);
    store.addProject(project4);

    store.toggleFavorite('3');
    expect(store.projectList).toEqual([project1, project2, project3, project4])
  });

  it('Filtragem por favoritos e ordenacao - onlyFavorites true e order', () => {
    const project1: Project = createProject('1', 'Projeto 1', 'Cliente 1');
    const project2: Project = createProject('2', 'Projeto 2', 'Cliente 2');
    const project3: Project = createProject('3', 'Projeto 3', 'Cliente 3');
    const project4: Project = createProject('4', 'Projeto 4', 'Cliente 4');
    store.addProject(project1);
    store.addProject(project2);
    store.addProject(project3);
    store.addProject(project4);

    store.toggleFavorite('3');
    expect(store.projectList).toEqual([project1, project2, project3, project4]);

    store.setOnlyFavorites(true);

    expect(store.projectList).toEqual([project3]);
  });

  it('Filtragem por favoritos e ordenacao - order newest', () => {
    const project1: Project = createProject('1', 'Projeto 1', 'Cliente 1');
    const project2: Project = createProject('2', 'Projeto 2', 'Cliente 2', new Date('1900'));
    const project3: Project = createProject('3', 'Projeto 3', 'Cliente 3');
    const project4: Project = createProject('4', 'Projeto 4', 'Cliente 4');

    store.addProject(project1);
    store.addProject(project2);
    store.addProject(project3);
    store.addProject(project4);

    store.toggleFavorite('3');
    store.setSortOption('newest');
    
    expect(store.projectList).toEqual([project1, project3, project4, project2]);
  });

  it('Filtragem por favoritos e ordenacao - onlyFavorites true e order alphabetical', () => {
    const project1: Project = createProject('1', 'Projeto X', 'Cliente 1');
    const project2: Project = createProject('2', 'Projeto 2', 'Cliente 2');
    const project3: Project = createProject('3', 'Projeto A', 'Cliente 3');
    const project4: Project = createProject('4', 'Projeto 4', 'Cliente 4');

    store.addProject(project1);
    store.addProject(project2);
    store.addProject(project3);
    store.addProject(project4);

    store.toggleFavorite('3');
    store.toggleFavorite('1');
    
    store.setOnlyFavorites(true);
    
    expect(store.projectList).toEqual([project3, project1]);
  });
});
