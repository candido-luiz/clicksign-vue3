import { beforeEach, describe, expect, it, vi } from "vitest";
import HeaderProject from "../HeaderProject.vue";
import { shallowMount, type VueWrapper } from "@vue/test-utils";
import { afterEach } from "node:test";


vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}));

vi.mock('@/stores/project', () => ({
  useProjectStore: vi.fn(() => ({
    toggleFavorite: vi.fn(),
    setOnlyFavorites: vi.fn(),
    setSortOption: vi.fn(),
    projects: [],
    onlyFavorites: false
  }))
}));

type Wrapper = VueWrapper<any>

describe('HeaderProject', () => {
  let wrapper: Wrapper;
  beforeEach(() => {
    wrapper = shallowMount(HeaderProject);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  })

  describe('Acoes do usuario', () => {
    
    it('Clicar em toggle favoritar - offcanvas', async () => {
      const toggleSwitch = wrapper.find('#favoritesSwitch');
      expect(toggleSwitch.exists()).toBeTruthy();
      await toggleSwitch.setValue(true);
      expect(wrapper.vm.projectStore.setOnlyFavorites).toBeCalledWith(true);
      //Clicar novamente
      wrapper.vm.projectStore.setOnlyFavorites.mockClear();
      await toggleSwitch.setValue(false);
      expect(wrapper.vm.projectStore.setOnlyFavorites).toBeCalledWith(false);
    });

    it('Clicar em toggle favoritar - desktop header ', async () => {
      const toggleSwitch = wrapper.find('#favoritesSwitchDesktop');
      expect(toggleSwitch.exists()).toBeTruthy();
      await toggleSwitch.setValue(true);
      expect(wrapper.vm.projectStore.setOnlyFavorites).toBeCalledWith(true);
      //Clicar novamente
      wrapper.vm.projectStore.setOnlyFavorites.mockClear();
      await toggleSwitch.setValue(false);
      expect(wrapper.vm.projectStore.setOnlyFavorites).toBeCalledWith(false);
    });

    it('Selecionar ordenacao - offcanvas', async () => {
      const selectSort = wrapper.find('#sortOptions');
      expect(selectSort.exists()).toBeTruthy();
      await selectSort.setValue('newest');
      expect(wrapper.vm.projectStore.setSortOption).toBeCalledWith('newest');
    });

    it('Selecionar ordenacao - desktop header', async () => {
      const selectSort = wrapper.find('#sortOptionsDesktop');
      expect(selectSort.exists()).toBeTruthy();
      await selectSort.setValue('endingSoon');
      expect(wrapper.vm.projectStore.setSortOption).toBeCalledWith('endingSoon');
    });

    it('Ir para criacao de novo projeto - offcanvas', async () => {
      const button = wrapper.find('#createProject');
      expect(button.exists()).toBeTruthy();
      await button.trigger('click');
      expect(wrapper.vm.router.push).toBeCalledWith({name: 'form-project'});
    });

    it('Ir para criacao de novo projeto - createProjectDesktop', async () => {
      const button = wrapper.find('#createProject');
      expect(button.exists()).toBeTruthy();
      await button.trigger('click');
      expect(wrapper.vm.router.push).toBeCalledWith({name: 'form-project'});
    });
    
  })



})