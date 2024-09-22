import { shallowMount, VueWrapper, config } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import TopBar from "../TopBar.vue";
import { setShowSearchBarKey } from "@/injection-keys/keys";


describe('TopBar', () => {
  let setShowSearchBar = vi.fn();

  config.global.provide = {
    [setShowSearchBarKey]: setShowSearchBar
  }
  it('Verifica se nao renderiza o search icon', () => {
    const wrapper = shallowMount(TopBar, {
      props: {
        showTopbar: true,
        canSearchItems: false,
      },
    });

    const header = wrapper.find('header');
    expect(header.exists()).toBeTruthy();

    const searchIcon = header.find('.search-icon');
    expect(searchIcon.exists()).toBeFalsy();
  });

  it('Verifica se  renderiza o search icon', () => {
    const wrapper = shallowMount(TopBar, {
      props: {
        showTopbar: true,
        canSearchItems: true,
      }
    });

    const header = wrapper.find('header');
    const searchIcon = header.find('.search-icon');
    expect(searchIcon.exists()).toBeTruthy();
  });

  it('Verifica se ao clicar no search icon, a cao de showSearchBar e chamada', async () => {
    const wrapper = shallowMount(TopBar, {
      props: {
        showTopbar: true,
        canSearchItems: true,
      }
    });

    const header = wrapper.find('header');
    const searchIcon = header.find('.search-icon');
    await searchIcon.trigger('click')
    expect(setShowSearchBar).toHaveBeenCalledWith(true)
  });
})