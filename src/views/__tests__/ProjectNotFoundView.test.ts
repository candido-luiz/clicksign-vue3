import { shallowMount, VueWrapper } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import ProjectNotFoundView from "../ProjectNotFoundView.vue";

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))
describe('ProjectNotFoundView', () => {
  
  it('Verifica se ao clicar no botao de novo projeto, o usuario e redirecionado', async () => {
    const wrapper: VueWrapper<any> = shallowMount(ProjectNotFoundView);

    const redirectButton = wrapper.find('button');
    await redirectButton.trigger('click');

    expect(wrapper.vm.router.push).toHaveBeenCalledWith('/')
  })
})