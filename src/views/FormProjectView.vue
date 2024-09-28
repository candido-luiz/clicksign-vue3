<script setup lang="ts">
import { Project } from '@/models/Project';
import { useProjectStore } from '@/stores/project';
import { fileToBase64} from '@/utils/fileConverter';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import dayjs from '@/utils/dayjs/index';

const route = useRoute();
const router = useRouter();
const { notify } = useToast();
const projectStore = useProjectStore();

const projectName = ref<string>('');
const projectCustomer = ref<string>('');
const projectStartDate = ref<string>('');
const projectFinalDate = ref<string>('');
const projectCoverUlr = ref<string>('');
const projectCoverName = ref<string>('');
const fileInput = ref<HTMLElement>();

const errors = ref({
  projectName: '',
  customer: '',
  startDate: '',
  finalDate: '',
});

const projectIdParam = computed (() => {
  return route.params.projectId as string;
})

const isEditProjectView = computed(() => {
  return !!projectIdParam.value;
})

const isProjectNameValid = computed(() => {
  const regex = /^\w+ \w+/;
  return regex.test(projectName.value);
});

const isProjectCustomerValid = computed(() => {
  const regex = /\b\w{3,}\b/;
  return regex.test(projectCustomer.value);
})

const isProjectStartDateValid = computed(() => {
  return (
    projectStartDate.value && 
    (!projectFinalDate.value || new Date(projectStartDate.value) <= new Date(projectFinalDate.value))
  );
})

const isProjectFinalDateValid = computed(() => {
  return (
    projectFinalDate.value && 
    (!projectStartDate.value || new Date(projectStartDate.value) <= new Date(projectFinalDate.value))
  );
});

const formIsInvalid = computed(() => {
  return (
    !isProjectNameValid.value ||
    !isProjectCustomerValid.value ||
    !isProjectStartDateValid.value ||
    !isProjectFinalDateValid.value
  )
});

const disabledSaveButton = computed(() => {
  return formIsInvalid.value;
});

const validateProjectName = () => {
  errors.value.projectName = isProjectNameValid.value ? 
    '' : 
    'Por favor, digite ao menos duas palavras'
}

const validateProjectCustomer = () => {
  errors.value.customer = isProjectCustomerValid.value ? 
    '' : 
    'Por favor, digite ao menos uma palavra'
}

const validateProjectStartDate = () => {
  if(isProjectStartDateValid.value) {
    errors.value.startDate = ''
    return
  }
  errors.value.startDate = projectStartDate.value ? 
    'A data de início deve ser antes da data final' :
    'Selecione uma data válida';
}

const validateProjectFinalDate = () => {
  if(isProjectFinalDateValid.value) {
    errors.value.finalDate = '';
    return
  }
  errors.value.finalDate = projectFinalDate.value ? 
    'A data final deve ser depois da data de início' :
    'Selecione uma data válida';
}

const validateFormData = () => {
  validateProjectName();
  validateProjectCustomer();
  validateProjectStartDate();
  validateProjectFinalDate();

  return !formIsInvalid.value;
};

const submitForm = () => {
  if (validateFormData()) {
    if(isEditProjectView.value) {
      editProject();
      notify({
        message: "Projeto alterado com sucesso!",
      });
    } else {
      createProject();
      notify({
        message: "Projeto criado com sucesso!",
      });
    }
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0];
    convertAndSetFile(file);
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    convertAndSetFile(file);
  }
};

const convertAndSetFile = async (file: File) => {
  const acceptedFileTypes = ['png', 'jpg', 'jpeg'];
  if (file) {
    const fileType = file.type.split('/')[1];
    if(!acceptedFileTypes.includes(fileType)) {
      return
    }
    try {
      const base64 = await fileToBase64(file);
      projectCoverUlr.value = base64;
      projectCoverName.value = file.name;
    } catch (error) {
      console.error("Erro ao converter a imagem para Base64", error);
    }
  }
};

const removeCoverImage = () => {
  projectCoverUlr.value = '';
  projectCoverName.value = '';
}

const generateProjectInstance = (id?: string) => {
  return new Project(
    projectName.value,
    projectCustomer.value,
    new Date(projectStartDate.value),
    new Date(projectFinalDate.value),
    {
      url: projectCoverUlr.value,
      name: projectCoverName.value
    },
    id
  );
}

const createProject = () => {
  const project = generateProjectInstance();
  projectStore.addProject(project);
  goToProjectList();
};

const editProject = () => {
  const updatedProject = generateProjectInstance(projectIdParam.value);
  projectStore.editProject(projectIdParam.value, updatedProject);
  goToProjectList();
};

const goToProjectList = () => {
  router.push({name: 'project-list'});
}

watch(isEditProjectView, value => {
  if(value) {
    const projectToEdit = projectStore.getProjectById(projectIdParam.value);
    if(projectToEdit) {
      const { name, customer, startDate, finalDate, coverImage } = projectToEdit;
      projectName.value = name;
      projectCustomer.value = customer;
      projectStartDate.value = dayjs(startDate).format('YYYY-MM-DD');
      projectFinalDate.value = dayjs(finalDate).format('YYYY-MM-DD');
      if(coverImage) {
        projectCoverUlr.value = coverImage?.url;
        projectCoverName.value = coverImage?.name;

      }
    }
  }
}, { immediate: true})
</script>

<template>
  <div class="container-fluid d-flex justify-content-center px-4 full-height">
    <div class="d-flex flex-column w-100">
      
      <header class="mb-4 mt-5">
        <div class="d-flex flex-column align-items-start">
          <button
            @click="goToProjectList"
            class="ps-0 btn btn-link text-decoration-none d-flex align-items-center"
          >
            <i class="bi bi-arrow-left me-2"></i> 
            <span>Voltar</span>
          </button>
          <h1 v-if="!isEditProjectView" class="fs-4 m-0">Novo projeto</h1>
          <h1 v-else class="fs-4 m-0">Editar projeto</h1>
        </div>
      </header>

      
       <div class="form-border py-4 py-sm-5">
         <form id="projectForm" @submit.prevent="submitForm" class="col-10 col-md-8 col-lg-6 mx-auto">
           <div class="mb-3 mb-md-4">
             <label for="projectName" :class="['form-label', {'invalid-field' : errors.projectName}]">Nome do projeto <span>(Obrigatório)</span></label>
             <input
               type="text"
               id="projectName"
               v-model.trim="projectName"
               @blur="validateProjectName"
               class="form-control"
               :class="{'is-invalid' : !!errors.projectName}"
             />
             <div class="invalid-feedback">
                {{ errors.projectName }}
              </div>
           </div>
   
           <div class="mb-3 mb-md-4">
             <label for="projectCustomer" :class="['form-label', {'invalid-field' : errors.customer}]">Cliente <span>(Obrigatório)</span></label>
             <input
               type="text"
               id="projectCustomer"
               v-model.trim="projectCustomer"
               @blur="validateProjectCustomer"
               class="form-control"
               :class="{'is-invalid' : !!errors.customer}"
             />
             <div class="invalid-feedback">
                {{ errors.customer }}
              </div>
           </div>
   
           <div class="row mb-3 mb-md-4">
             <div class="col-12 col-sm-6  mb-3 mb-sm-0">
               <label for="projectStartDate" :class="['form-label', {'invalid-field' : errors.startDate}]">Data de Início <span>(Obrigatório)</span></label>
               <input
                 type="date"
                 id="projectStartDate"
                 v-model="projectStartDate"
                 @change="validateProjectStartDate"
                 class="form-control"
                :class="{'is-invalid' : !!errors.startDate}"
               />
               <div class="invalid-feedback">
                {{ errors.startDate }}
              </div>
             </div>
             <div class="col-12 col-sm-6">
               <label for="projectFinalDate" :class="['form-label', {'invalid-field' : errors.finalDate}]">Data final <span>(Obrigatório)</span></label>
               <input
                 type="date"
                 id="projectFinalDate"
                 v-model="projectFinalDate"
                 @change="validateProjectFinalDate"
                 class="form-control"
                :class="{'is-invalid' : !!errors.finalDate}"
               />
                <div class="invalid-feedback">
                  {{ errors.finalDate }}
                </div>
             </div>
           </div>
    
           <div class="mb-3 mb-md-4">
            <label for="projectCover" class="form-label">Capa do projeto</label>
            <div
              v-if="!projectCoverName"
              class="dropzone d-flex justify-content-center align-items-center"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <div class="d-flex flex-column  align-items-center gap-3">
                <i class="bi bi-upload text-primary"></i>
                <span>Escolha uma imagem .jpg ou .png no seu dispositivo</span>
                <button
                  class="btn btn-selectCover px-4"
                  type="button"
                >
                  <span class="fs-5">Selecionar</span>
                </button>
              </div>

              <input
                ref="fileInput"
                type="file"
                id="projectCover"
                accept=".png, .jpg, .jpeg"
                @change="handleFileChange"
                class="form-control d-none"
              />
            </div>
            <div 
              v-else-if="projectCoverUlr"
              class="d-flex justify-content-center"
            >
              <div class="position-relative">
                <img :src="projectCoverUlr" class="img-fluid cover" alt="capa do projeto">
                <button 
                  class="delete-coverImage btn bg-white rounded-circle shadow-sm " 
                  type="button" 
                  id="dropdownMenuButton"
                  aria-expanded="false"
                  @click="removeCoverImage"
                >
                  <i class="bi bi-trash text-primary"></i>
                </button>
              </div>
            </div>
          </div>
   
          <button
            v-if="!isEditProjectView"
            id="createProject"
            type="submit"
            class="btn btn-primary w-100 fs-5"
            :disabled="disabledSaveButton"
          >
            Salvar projeto
           </button>
          <button
            v-else 
            id="editProject"
            type="submit"
            class="btn btn-primary w-100 fs-5"
            :disabled="disabledSaveButton"
           >
             Editar projeto
           </button>
         </form>
       </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-border {
  border: 1px solid #dee2e6;
  border-radius: 6px;
}
.full-height {
  height: calc(100vh - $clicksign-page-header-height);
}

header {
  h1 {
    color: $clicksign-emphasis-text-color;
    font-size: 24px;
  }
}

#projectForm {
  label {
    font-size: 18px;
    
    &:is(.invalid-field) {
      color: var(--bs-danger);
    }

    &:not(.invalid-field) {
      color: $clicksign-primary-color;
      span {
        color: $clicksign-normal-text-color;
      }
    }

    span {
      font-size: 14px;
    }

  }
}

.dropzone {
  min-height: 150px;
  width: 100%;
  padding: 12px;
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
}
.dropzone:hover {
  border-color: $clicksign-primary-color;
}
img.cover {
  max-height: 395px;
  border-radius: 6px;
}
.delete-coverImage {
  width: 36px;
  height: 36px; 
  position: absolute;
  top: 25px;
  right: 25px;
  padding: 0; 
  display: flex; 
  align-items: center; 
  justify-content: center;
}
.btn-selectCover {
  background-color: white;
  color: $clicksign-primary-color;
  border: 1px solid currentColor;

  &:hover {
    background-color: rgba($clicksign-primary-color, 0.6);
    color: white;
  }
}

#projectForm input {
  &:-webkit-autofill {
      background-color: white !important;
      transition: background-color 5000s ease-in-out 0s;
  }
  
  &:-moz-autofill {
      background-color: white !important;
  }
  
  &:-ms-autofill {
      background-color: white !important;
  }
  
}
</style>
