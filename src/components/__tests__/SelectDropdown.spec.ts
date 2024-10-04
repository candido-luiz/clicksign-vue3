import { beforeEach,afterEach, describe, expect, it, vi } from "vitest";
import SelectDropdown from "../SelectDropdown.vue";
import { shallowMount, type VueWrapper } from "@vue/test-utils";
import type { IDropdownOption } from "../interfaces/IDropdownOption";


type Wrapper = VueWrapper<any>

describe('HeaderProject', () => {
  const options: IDropdownOption[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  let wrapper: Wrapper;
  beforeEach(() => {
    wrapper = shallowMount(SelectDropdown, {
      props: {
        options,
        defaultOption: { label: 'Default Option', value: 'defaultOption' },
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  })


  it('Deve exibir o valor padrao', () => {
    expect(wrapper.text()).toContain('Default Option');
  });

  it('Deve alterar a visibilidade do dropdown ao clicar no display do dropdown', async () => {
    expect(wrapper.find('.select-options').classes()).toContain('hide-options');

    await wrapper.find('.select-display').trigger('click');
    expect(wrapper.find('.select-options').classes()).not.toContain('hide-options');

    await wrapper.find('.select-display').trigger('click');
    expect(wrapper.find('.select-options').classes()).toContain('hide-options');
  });

  it('Deve emitir optionSelected ao selecionar uma option', async () => {
    await wrapper.find('.select-display').trigger('click');

    await wrapper.findAll('.select-options li').at(1)?.trigger('click');

    expect(wrapper.text()).toContain('Option 2');

    expect(wrapper.emitted('optionSelected')![0]).toEqual(['option2']);
  });

  it('Deve configurar o min-width do dropdown de acordo com o maior item da lista', () => {
    (wrapper.vm as any).setListsMinWidth();

    const dropdownEl = wrapper.find('ul.list-group');
    const dropdownOptionsEl = wrapper.find('.select-options');
    expect((dropdownEl.element as HTMLElement).style.minWidth).toBe((dropdownOptionsEl.element as HTMLElement).style.minWidth);
  });

})
