import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ModalRemoveProject from "../ModalRemoveProject.vue";

describe('ModalRemoveProject', () => {
  
  it('Verifica se o projectName esta renderizado', () => {
    const wrapper = shallowMount(ModalRemoveProject, {
      props: {
        projectName: 'Projeto 01',
        projectId: 'uuid'
      },
    });

    const projectName = wrapper.find('h2');
    expect(projectName.html()).toContain('Projeto 01')
  });

  it('Verifica se o evento cancel é chamado ao clicar no botao de cancelar', async () => {
    const wrapper = shallowMount(ModalRemoveProject, {
      props: {
        projectName: 'Projeto 01',
        projectId: 'uuid'
      },
    });

    const cancelButton = wrapper.find('#cancelarRemocao');
    await cancelButton.trigger('click');
    expect(wrapper.emitted().cancel).toBeTruthy();
  });

  it('Verifica se o evento confirm é chamado ao clicar no botao de confirmar remocao', async () => {
    const wrapper = shallowMount(ModalRemoveProject, {
      props: {
        projectName: 'Projeto 01',
        projectId: 'uuid'
      },
    });

    const confirButton = wrapper.find('#confirmarRemocao');
    await confirButton.trigger('click');
    expect(wrapper.emitted().confirm[0]).toEqual(['uuid']);
  });
})