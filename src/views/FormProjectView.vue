<script setup lang="ts">
import { Project } from '@/models/Project';
import { useProjectStore } from '@/stores/project';
import { fileToBase64} from '@/utils/fileConverter';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from '@/utils/dayjs/index';

const route = useRoute();
const router = useRouter();
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
    } else {
      createProject();
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
  if (file) {
    try {
      const base64 = await fileToBase64(file);
      projectCoverUlr.value = base64;
      projectCoverName.value = file.name;
    } catch (error) {
      console.error("Erro ao converter a imagem para Base64", error);
    }
  }
};

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
  <div class="container d-flex justify-content-center full-height">
    <div class="d-flex flex-column w-100">
      
      <header class="mb-4">
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

      
       <div class="border rounded-2">
         <form @submit.prevent="submitForm" class="col-md-8 col-lg-6 mx-auto bg-white p-4 rounded">
           <div class="mb-3">
             <label for="projectName" class="form-label">Nome do projeto</label>
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
   
           <div class="mb-3">
             <label for="projectCustomer" class="form-label">Cliente</label>
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
   
           <div class="row mb-3">
             <div class="col">
               <label for="projectStartDate" class="form-label">Data de Início</label>
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
             <div class="col">
               <label for="projectFinalDate" class="form-label">Data final</label>
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
    
           <div class=" mb-3">
            <label for="projectCover" class="form-label">Capa do projeto</label>
            <div
              class="dropzone d-flex justify-content-center align-items-center"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <div v-if="!projectCoverName" class="d-flex flex-column">
                <i class="bi bi-upload"></i>
                <span>Adicione uma imagem</span>
              </div>
              <div v-else class="text-primary">
                <span>{{ projectCoverName }}</span>
              </div>
            </div>
            
            <input
              ref="fileInput"
              type="file"
              id="projectCover"
              accept="image/*"
              @change="handleFileChange"
              class="form-control d-none"
            />
          </div>
   
          <button
            v-if="!isEditProjectView"
            type="submit"
            class="btn btn-primary w-100"
            :disabled="disabledSaveButton"
          >
            Salvar projeto
           </button>
          <button
            v-else 
            type="submit"
            class="btn btn-primary w-100"
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
.full-height {
  height: calc(100vh - $clicksign-page-header-height);
}

.dropzone {
  height: 150px;
  width: 100%;
  border: 2px dashed #ccc;
  cursor: pointer;
  text-align: center;
}
.dropzone:hover {
  border-color: $clicksign-button-primary-color;
}
</style>
