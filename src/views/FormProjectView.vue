<script setup lang="ts">
import { Project } from '@/models/Project';
import { useProjectStore } from '@/stores/project';
import { fileToBase64 } from '@/utils/fileConverter';
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
  errors.value.startDate = isProjectStartDateValid.value ? 
    '' : 
    'Selecione uma data válida'
}

const validateProjectFinalDate = () => {
  errors.value.finalDate = isProjectFinalDateValid.value ? 
    '' : 
    'Selecione uma data válida'
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


const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  
  if (file) {
    try {
      // Converter o arquivo para Base64
      const base64 = await fileToBase64(file);
      
      // Armazenar no localStorage
      localStorage.setItem('projectCover', base64);
      
      // Definir o src da imagem
      projectCoverUlr.value = base64;
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
    projectCoverUlr.value,
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
      const { name, customer, startDate, finalDate } = projectToEdit;
      projectName.value = name;
      projectCustomer.value = customer;
      projectStartDate.value = dayjs(startDate).format('YYYY-MM-DD');
      projectFinalDate.value = dayjs(finalDate).format('YYYY-MM-DD');
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
          <h1 class="fs-4 m-0">Novo projeto</h1>
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
                 @blur="validateProjectStartDate"
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
                 @blur="validateProjectFinalDate"
                 class="form-control"
                :class="{'is-invalid' : !!errors.finalDate}"
               />
                <div class="invalid-feedback">
                  {{ errors.finalDate }}
                </div>
             </div>
           </div>
   
           <div class="mb-3">
             <label for="projectCover" class="form-label">Capa do projeto</label>
             <input
               type="file"
               id="projectCover"
               accept="image/*"
               @change="handleFileChange"
               class="form-control"
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
</style>
