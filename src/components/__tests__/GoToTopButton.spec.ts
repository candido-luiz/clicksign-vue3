import { describe, expect, it, vi } from "vitest";
import GoToTopButton from "../GoToTopButton.vue";
import { shallowMount, VueWrapper } from "@vue/test-utils";


describe('GoToTopButton', () => {
  type Wrapper = VueWrapper<any>
  vi.stubGlobal('scrollTo', vi.fn());
  
  it('Trigger botao de scroll', async () => {
    vi.stubGlobal('scrollY', 60);
    const wrapper: Wrapper = shallowMount(GoToTopButton);
    wrapper.vm.handleScroll();
    expect(wrapper.vm.showButton).toBeTruthy();

    await wrapper.vm.$nextTick();
    const button = wrapper.find('button');
    expect(button.exists()).toBeTruthy();
    await button.trigger('click');
    expect(window.scrollTo).toBeCalledWith({ top: 0, behavior: "smooth" });
  });

  it('Botão não deve ser exibido quando o scrollY for menor que o limite', async () => {
    vi.stubGlobal('scrollY', 40);
    const wrapper: Wrapper = shallowMount(GoToTopButton);
    wrapper.vm.handleScroll();
    expect(wrapper.vm.showButton).toBeFalsy();
  });

  it('Adiciona e remove listeners', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const wrapper: Wrapper = shallowMount(GoToTopButton);
    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', wrapper.vm.handleScroll);

    wrapper.unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', wrapper.vm.handleScroll);
  });

})