import { shallowMount, VueWrapper, config } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchBar from "../SearchBar.vue";

type Wrapper = VueWrapper<any>

describe('SearchBar', () => {
  let wrapper: Wrapper;

  config.global.directives = {
    'auto-animate': vi.fn()
  }
  beforeEach(() => {
    wrapper = shallowMount(SearchBar, {
      props: {
        suggestions: ['Projeto 01', 'projeto 02', 'test name'],
        modelValue: ''
      }
    });
  });

  describe('Testa acoes do usuario', () => {
    it('Usuario digitou algo na busca e apertou enter', async () => {
      const searchInput = wrapper.find('#searchInput');
      await searchInput.setValue('Projeto 01');
      await searchInput.trigger('keypress.enter')

      expect(wrapper.emitted().search[0]).toEqual(['Projeto 01']);

      await searchInput.setValue('');
      expect(wrapper.emitted().search.length).toEqual(1);
    });

    it('Verifica se a lista do historico é renderizada corretamente', async () => {
      const searchInput = wrapper.find('#searchInput');
      await searchInput.setValue('Proje');
      await searchInput.trigger('focus')
      const listItems = wrapper.findAll('.list-group li')
      expect(listItems.length).toBe(2);
      expect(listItems[0].text()).toEqual('Projeto 01');
      expect(listItems[1].text()).toEqual('projeto 02');
    });

    it('Verifica se ao clicar no item do historico, a acao de busca por historico e chamada', async () => {
      const searchInput = wrapper.find('#searchInput');
      await searchInput.trigger('focus')
      const listItems = wrapper.findAll('.list-group li')
      const firstItem = listItems[0];
      await firstItem.trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.searchQuery).toEqual(firstItem.text());
      expect(wrapper.emitted().search.length).toEqual(1);
      expect(wrapper.emitted().search[0]).toEqual(['Projeto 01'])
    });

    it('Verifica se ao clicar no botao de remover item do historico, a acao de remocao e chamada', async () => {
      const searchInput = wrapper.find('#searchInput');
      await searchInput.trigger('focus');
      const listItems = wrapper.findAll('.list-group li')
      const firstItem = listItems[0];
      const removeButton = firstItem.find('#removeFromHistory');
      expect(removeButton.exists()).toBeTruthy();

      await removeButton.trigger('click');
      expect(wrapper.emitted().removeSuggestion[0]).toEqual([0]);
    });

    it('Verifica se o evento cancel e emitido ao clicar no Esc (escape)', async () => {
      const event = new KeyboardEvent('keyup', { key: 'Escape' });
      document.dispatchEvent(event);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().close).toBeTruthy();
    });

    it('Verifica se o evento cancel e emitido ao clicar em uma tecla diferente de Esc', async () => {
      const event = new KeyboardEvent('keyup', { key: 'Space' });
      document.dispatchEvent(event);
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted().close).toBeFalsy();
    });
  })
})