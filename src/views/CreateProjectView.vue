<script setup lang="ts">
import { Project } from '@/models/Project';
import { useProjectStore } from '@/stores/project';
import { fileToBase64 } from '@/utils/fileConverter';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const projectStore = useProjectStore();

const projectName = ref<string>('');
const projectCustomer = ref<string>('');
const projectStartDate = ref<string>('');
const projectFinalDate = ref<string>('');
const projectCoverUlr = ref<string>('');

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

const createProject = () => {
  const project = new Project(
    projectName.value,
    projectCustomer.value,
    new Date(projectStartDate.value),
    new Date(projectFinalDate.value),
    projectCoverUlr.value
  );

  projectStore.addProject(project);
  goToHome();
};

const goToHome = () => {
  router.push({name: 'home'});

}
</script>

<template>
  <div class="container d-flex justify-content-center min-vh-100">
    <div class="d-flex flex-column w-100">
      <!-- Header -->
      <header class="mb-4">
        <div class="d-flex flex-column align-items-start">
          <button
            @click="goToHome"
            class="ps-0 btn btn-link text-decoration-none d-flex align-items-center"
          >
            <i class="bi bi-arrow-left me-2"></i> 
            <span>Voltar</span>
          </button>
          <h1 class="fs-4 m-0">Novo projeto</h1>
        </div>
      </header>

      <!-- Formulário -->
       <div class="border rounded-2">
         <form @submit.prevent="createProject" class="col-md-8 col-lg-6 mx-auto bg-white p-4 rounded">
           <div class="mb-3">
             <label for="projectName" class="form-label">Nome do projeto</label>
             <input
               type="text"
               id="projectName"
               v-model="projectName"
               required
               class="form-control"
             />
           </div>
   
           <div class="mb-3">
             <label for="projectCustomer" class="form-label">Cliente</label>
             <input
               type="text"
               id="projectCustomer"
               v-model="projectCustomer"
               required
               class="form-control"
             />
           </div>
   
           <div class="row mb-3">
             <div class="col">
               <label for="projectStartDate" class="form-label">Data de Início</label>
               <input
                 type="date"
                 id="projectStartDate"
                 v-model="projectStartDate"
                 required
                 class="form-control"
               />
             </div>
             <div class="col">
               <label for="projectFinalDate" class="form-label">Data final</label>
               <input
                 type="date"
                 id="projectFinalDate"
                 v-model="projectFinalDate"
                 required
                 class="form-control"
               />
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
             type="submit"
             class="btn btn-primary w-100"
           >
             Salvar projeto
           </button>
         </form>
       </div>
    </div>
  </div>
</template>

<style scoped>
/* Adicione quaisquer estilos adicionais necessários */
</style>
