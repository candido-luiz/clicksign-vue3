import { mount, shallowMount, VueWrapper , config, RouterLinkStub} from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ListProjectView from "../ListProjectView.vue";
import mockProjectList from "./mocks/projectList.json";
import { setShowSearchBarKey, showSearchBarKey } from "@/injection-keys/keys";

let projectList = [...mockProjectList];

vi.mock('vue-router')
vi.mock('@/stores/project', () => ({
  useProjectStore: vi.fn(() => ({
    toggleFavorite: vi.fn(),
    setOnlyFavorites: vi.fn(),
    setSortOption: vi.fn(),
    removeProject: vi.fn(),
    projects: projectList,
    projectList: projectList,
    onlyFavorites: false
  }))
}));

vi.mock('@/stores/suggestion', () => ({
  useSuggestionStore: vi.fn(() => ({
    addSuggestion: vi.fn(),
    removeSuggestion: vi.fn(),
    getSuggestions: [],
  }))
}));

vi.mock('@/composables/useToast', () => ({
  useToast: vi.fn(() => ({
    notify: vi.fn()
  }))
}))

let showBar: boolean = true;
let setShowSearchBar = vi.fn((val) => {
  showBar = val
})


describe('ListProjectView', () => {
  config.global.stubs = {
    RouterLink: RouterLinkStub
  }
  config.global.directives = {
    'auto-animate': vi.fn()
  }
  config.global.provide = {
    [setShowSearchBarKey]: setShowSearchBar,
    [showSearchBarKey]: showBar
  }
  
  const mountComponent =  (options = {}): VueWrapper<any> =>  {
    return mount(ListProjectView, {...options})
  }

  const shallowMountComponent =  (options = {}): VueWrapper<any> =>  {
    return shallowMount(ListProjectView, {...options})
  }

  beforeEach(() => {
    projectList = [...mockProjectList]
  })

  it('Verifica se foi montado', () => {
    const wrapper = mountComponent()
    expect(wrapper).toBeDefined()
  });
  
  describe('Verificacao da listagem', () => {

    it('Verifica se com algum item cadastro o componente CardProject é renderizado', async () => {
      const wrapper = mountComponent();
      const cards = wrapper.findAllComponents({ name: 'CardProject'});
      expect(cards.length).toBeGreaterThan(0);
    });

    it('Verifica se a searchBar esta sendo exibida', () => {
      const wrapper = mountComponent();
      const searchBar = wrapper.findComponent({ name: 'SearchBar'});
      expect(searchBar.exists()).toBeTruthy();
    });

    it('Verifica se o HeaderProject esta sendo exibido', () => {
      const wrapper = mountComponent();
      const header = wrapper.findComponent({ name: 'HeaderProject'});
      expect(header.exists()).toBeTruthy();
    });

    it('Verifica se o ItemsNotFound quando nao ha projetos esta sendo montado', async () => {
      projectList = []
      const wrapper = mountComponent();
      const itemsNotFound = wrapper.findComponent({ name: 'ItemsNotFound'})
      expect(itemsNotFound.exists()).toBeTruthy();
      expect(itemsNotFound.html()).toContain('Projetos removidos')

    })
  });

  describe('Acoes do usuario', async () => {
    it('Testa o clique no botao de criar projeto quando nao existe projeto encontrado em filtros', async () => {
      let noFavoriteProject = projectList.find(project => !project.isFavorite) as any;
      projectList = noFavoriteProject ? [noFavoriteProject] : [];
      const wrapper = mountComponent();
      wrapper.vm.searchProjects('inexistentProject');
      await wrapper.vm.$nextTick()
      const itemsNotFound = wrapper.findComponent({ name: 'ItemsNotFound'})
      expect(itemsNotFound.exists()).toBeTruthy();
      expect(itemsNotFound.html()).toContain('Nenhum projeto encontrado');
      await itemsNotFound.find('button').trigger('click');
      expect(wrapper.vm.projectStore.setOnlyFavorites).toHaveBeenCalledWith(false);
      expect(wrapper.vm.query).toEqual('')
      expect(wrapper.vm.searchedQuery).toEqual('')

    })
  });

  describe('Testa metodos chamados nos emits dos componentes filhos', () => {
    it('Teste emit @search do SearchBar', async () => {
      const wrapper = shallowMountComponent();
      wrapper.vm.searchProjects('Proje');
      expect(wrapper.vm.suggestionStore.addSuggestion).toHaveBeenCalledWith('Proje');
      expect(wrapper.vm.searchedQuery).toBe('Proje');
    });
    it('Teste emit @removeSuggestion do SearchBar', async () => {
      const wrapper = shallowMountComponent();
      wrapper.vm.removeSuggestion(0);
      expect(wrapper.vm.suggestionStore.removeSuggestion).toHaveBeenCalledWith(0);
    });
    it('Teste emit @cancelSearch do SearchBar', async () => {
      const wrapper = shallowMountComponent();
      wrapper.vm.cancelSearch();
      expect(wrapper.vm.setShowSearchBar).toHaveBeenCalledWith(false);
      expect(wrapper.vm.searchedQuery).toBe('');
      expect(wrapper.vm.query).toBe('');
    });
    it('Teste emit @removeProject do CardProject', async () => {
      const projectId = projectList[0].id
      const wrapper = shallowMountComponent();
      wrapper.vm.removeProject(projectId);
      expect(wrapper.vm.projectIdToRemove).toBe(projectId);
      expect(wrapper.vm.showModal).toBe(true);
    });
    it('Teste emit @confirm do ModalRemoveProject', async () => {
      const projectId = projectList[0].id
      const wrapper = shallowMountComponent();
      wrapper.vm.confirmRemoval(projectId);
      expect(wrapper.vm.projectStore.removeProject).toHaveBeenCalledWith(projectId);
      expect(wrapper.vm.projectIdToRemove).toBe(null);
      expect(wrapper.vm.showModal).toBe(false);
      expect(wrapper.vm.notify).toHaveBeenCalledWith({
        message: "Projeto removido com sucesso!",
      });
    });
    it('Teste emit @cancel do ModalRemoveProject', async () => {
      const wrapper = shallowMountComponent();
      wrapper.vm.cancelRemoval();
      expect(wrapper.vm.projectIdToRemove).toBe(null);
      expect(wrapper.vm.showModal).toBe(false);
    });
  })
})