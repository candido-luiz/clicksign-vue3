import { mount, shallowMount, VueWrapper , config} from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FormProjectView from "../FormProjectView.vue";
import { Project } from "@/models/Project";


let projectId = '';
let mockProject = {
  id: '1',
  name: 'Test Project',
  coverImage: { url: null },
  isFavorite: false,
  customer: 'Client A',
  startDate: new Date('2024-09-22T00:01-03:00'),
  finalDate: new Date('2024-09-25T00:01-03:00'),
}

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: () => {}
  })),
  useRoute: vi.fn(() => ({
    params: {
      projectId,
    }
  }))
}))

vi.mock('@/stores/project', () => ({
  useProjectStore: vi.fn(() => ({
    addProject: vi.fn(),
    editProject: vi.fn(),
    getProjectById: vi.fn().mockReturnValue({
      ...mockProject
    }),
  }))
}));

vi.mock('@/composables/useToast', () => ({
  useToast: vi.fn(() => ({
    notify: vi.fn()
  }))
}))

describe('FormProjectView', () => {

  const shallowMountComponent =  (options = {}): VueWrapper<any> =>  {
    return shallowMount(FormProjectView, {...options})
  }

  beforeEach(() => {
    projectId = '';
  })

  it('Renderizar FormProjectView', () => {
    const wrapper = shallowMountComponent();
    expect(wrapper.exists()).toBeTruthy();
  });

  describe('Teste inputs do usuario',  () => {
    it('Verifica se ao preenher os inputs obrigatorios, o sistema permite o cadastro de projeto', async () => {
      const wrapper = shallowMountComponent();
      const inputProjectName = wrapper.find('#projectName');
      const inputProjectCustomer = wrapper.find('#projectCustomer');
      const inputProjectStartDate = wrapper.find('#projectStartDate');
      const inputProjectFinalDate = wrapper.find('#projectFinalDate');
      const projectForm = wrapper.find('#projectForm');
      
      //set dos dados de cada input (todos validos)
      await inputProjectName.setValue('Nome do projeto');
      await inputProjectCustomer.setValue('Cliente');
      await inputProjectStartDate.setValue('2024-09-25');
      await inputProjectFinalDate.setValue('2024-09-29');

      //blur dos inputs de texto
      await inputProjectName.trigger('blur');
      await inputProjectCustomer.trigger('blur');

      //submit
      await projectForm.trigger('submit');

      expect(wrapper.vm.notify).toHaveBeenCalledWith({
        message: "Projeto criado com sucesso!",
      });
      const addProjectArgument = wrapper.vm.projectStore.addProject.mock.calls[0][0]
      expect(addProjectArgument instanceof Project);
      const button = wrapper.find('#createProject')
      expect(button.attributes()).not.toHaveProperty('disabled');

    });

    it('Verifica se ao preenher os inputs obrigatorios, o sistema permite a edição do projeto', async () => {
      projectId = 'uuid'
      const wrapper = shallowMountComponent();
      await wrapper.vm.$nextTick();

      const projectForm = wrapper.find('#projectForm');

      await projectForm.trigger('submit');

      expect(wrapper.vm.notify).toHaveBeenCalledWith({
        message: "Projeto alterado com sucesso!",
      });

      const editProjectArgument = wrapper.vm.projectStore.editProject.mock.calls[0][0];
      expect(editProjectArgument instanceof Project);
    });

    it('Verifica se ao inserir nome de projeto invalido, a mensagem de erro sera exibida', async () => {
      const wrapper = shallowMountComponent();
      const inputProjectName = wrapper.find('#projectName');
      const projectNameInvalidFeedback = wrapper.findAll('.invalid-feedback');

      await inputProjectName.setValue('Nome');
      await inputProjectName.trigger('blur');

      expect(inputProjectName.classes()).toContain('is-invalid');
      expect(projectNameInvalidFeedback[0].text()).toEqual(wrapper.vm.errors.projectName);
    });
    it('Verifica se ao inserir nome do cliente invalido, a mensagem de erro sera exibida', async () => {
      const wrapper = shallowMountComponent();
      const inputProjectCustomer = wrapper.find('#projectCustomer');
      const projectNameInvalidFeedback = wrapper.findAll('.invalid-feedback');

      await inputProjectCustomer.setValue(' ');
      await inputProjectCustomer.trigger('blur');

      expect(inputProjectCustomer.classes()).toContain('is-invalid');
      expect(projectNameInvalidFeedback[1].text()).toEqual(wrapper.vm.errors.customer);
    });
    it('Verifica se ao inserir datas invalidas, a mensagem de erro sera exibida', async () => {
      const wrapper = shallowMountComponent();

      const inputProjectStartDate = wrapper.find('#projectStartDate');
      const inputProjectFinalDate = wrapper.find('#projectFinalDate');

      await inputProjectStartDate.setValue('2024-09-25');
      await inputProjectFinalDate.setValue('2024-09-20');
      
      expect(inputProjectFinalDate.classes()).toContain('is-invalid');

      //set uma nova data inicio
      await inputProjectStartDate.setValue('2024-09-26');

      expect(inputProjectStartDate.classes()).toContain('is-invalid');

      const projectNameInvalidFeedback = wrapper.findAll('.invalid-feedback');


      expect(projectNameInvalidFeedback[2].text()).toEqual(wrapper.vm.errors.startDate);
      expect(projectNameInvalidFeedback[3].text()).toEqual(wrapper.vm.errors.finalDate);
      expect(wrapper.vm.errors.startDate).toEqual('A data de início deve ser antes da data final');
      expect(wrapper.vm.errors.finalDate).toEqual('A data final deve ser depois da data de início');
    });
    it('Verifica se botao de enviar esta desabilitado quando os campos nao estao validos', async () => {
      const wrapper = shallowMountComponent();
      await wrapper.vm.$nextTick();
      const button = wrapper.find('#createProject')
      expect(button.attributes()).toHaveProperty('disabled');
    });
    it('Verifica se botao de editar esta desabilitado quando os campos nao estao validos', async () => {
      projectId = 'uuid'
      const wrapper = shallowMountComponent();
      await wrapper.vm.$nextTick();
      const inputProjectName = wrapper.find('#projectName');

      await inputProjectName.setValue('Nome');
      await inputProjectName.trigger('blur');

      const button = wrapper.find('#editProject')
      expect(button.attributes()).toHaveProperty('disabled');
    });
  })
})