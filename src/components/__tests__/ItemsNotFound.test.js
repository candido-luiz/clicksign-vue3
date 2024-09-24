import { shallowMount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ItemsNotFound from "../ItemsNotFound.vue";

describe('ItemsNotFound', () => {
  
  it('Testa rendereizacao dos slots de ItemsNotFound', () => {
    const wrapper = shallowMount(ItemsNotFound, {
      props: {
        title: 'Items não encontrados'
      },
      slots: {
        'default': `<p> Nenhum item foi encontrado na sua busca </p>`,
        'action': `<button> Reset </button>`
      }
    });

    const wrapperHtml = wrapper.html();
    const title = wrapper.find('h1');
    expect(title.html()).toContain('Items não encontrados')
    expect(wrapperHtml).toContain(`<p> Nenhum item foi encontrado na sua busca </p>`);
    expect(wrapperHtml).toContain(`<button> Reset </button>`)
  })
})