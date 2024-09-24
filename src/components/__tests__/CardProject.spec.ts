import { shallowMount, VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CardProject from "../CardProject.vue";
import { Project } from "@/models/Project";
import defaultCoverImage from '@/assets/images/default-card-background.png';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';


vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: () => {}
  }))
}))

vi.mock('@/stores/project', () => ({
  useProjectStore: vi.fn(() => ({
    toggleFavorite: vi.fn()
  }))
}));

let mockProject = {
  id: '1',
  name: 'Test Project',
  coverImage: { url: null },
  isFavorite: false,
  customer: 'Client A',
  startDate: new Date('2024-09-22T00:01-03:00'),
  finalDate: new Date('2024-09-25T00:01-03:00'),
}

let project = new Project(mockProject.name, mockProject.customer, mockProject.startDate, mockProject.finalDate);
describe('CardProject', () => {
  let wrapper: VueWrapper<any>;
  beforeEach(() => {
    wrapper= shallowMount(CardProject, {
      props: {
        project: project,
        projectNameQuery: '',
        highlightProjectName: false
      }
    });
  });

  it('Verifica se o componente foi montado', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('Verifica os valores iniciais de computadas', () => {
    expect(wrapper.vm.cardCoverImage).toBe(defaultCoverImage);
    expect(wrapper.vm.projectName).toBe("Test Project");
    expect(wrapper.vm.isFavorite).toBe(false);
  });

  describe('Computada projectName', () => {
    it('Com highlightProjectName false, deve retornar apenas o projectName', async () => {
      await wrapper.setProps({
        projectNameQuery: 'Test',
          highlightProjectName: false,
      });
  
      expect(wrapper.vm.projectName).toBe('Test Project');
    });
  
    it('Com highlightProjectName true, deve retornar com o texto marcado', async () => {
      await wrapper.setProps({
        projectNameQuery: 'Test',
          highlightProjectName: true,
      });
  
      expect(wrapper.vm.projectName).toContain('<mark');
      expect(wrapper.vm.projectName).toContain('Test');
    });
  
    it('Retorna o project name quando o match da regex nao é feito', async () => {
      await wrapper.setProps({
        projectNameQuery: 'abc',
        highlightProjectName: true,
      });
  
      expect(wrapper.vm.projectName).toContain('Test Project');
    });
  });

  describe('Verifica se as datas foram transformadas', () => {
    
    it('Data de inicio', () => {
      const divStartDate = wrapper.find('[title="Data de início"]');
      expect(divStartDate.html()).toContain('22 de Setembro de 2024');
    });

    it('Data final', () => {
      const divFinalDate = wrapper.find('[title="Data final"]');
      expect(divFinalDate.html()).toContain('25 de Setembro de 2024');
    });
  });

  describe('Testa possíveis açõe do usuário',  () => {

    it('Favoritar', async () => {
      const toggleFavorite = vi.fn().mockImplementation(() => {})
      //@ts-ignore
      useProjectStore.mockImplementationOnce(() => ({
        toggleFavorite
      }));

      const wrapper: any = shallowMount(CardProject, {
        props: {
          project: {
            ...project,
            id: 'uuid'
          },
          projectNameQuery: '',
          highlightProjectName: false
        }
      });

      const icons = wrapper.findAll('i');
      const toggleFavoriteIcon = icons[0];
      expect(toggleFavoriteIcon.exists());

      await toggleFavoriteIcon.trigger('click');
      expect(toggleFavorite).toHaveBeenCalledWith('uuid');

    });

    it('Editar projeto', async () => {
      const push = vi.fn().mockImplementation(() => {})
      //@ts-ignore
      useRouter.mockImplementationOnce(() => ({
        push
      }));

      const wrapper: any = shallowMount(CardProject, {
        props: {
          project: project,
          projectNameQuery: '',
          highlightProjectName: false
        }
      });

      const editProjectIcon = wrapper.find('#editProject');
      expect(editProjectIcon.exists());
      
      await editProjectIcon.trigger('click');

      expect(push).toHaveBeenCalledWith({
        name: 'form-project',
        params: {
          projectId: wrapper.vm.props.project.id
        }
      });
    });

    it('Remover projeto', async () => {
      const removeProjectIcon = wrapper.find('#removeProject');
      expect(removeProjectIcon.exists());
      await removeProjectIcon.trigger('click')
      expect(wrapper.emitted().removeProject[0]).toEqual([wrapper.vm.props.project.id]);
    })
  })

})