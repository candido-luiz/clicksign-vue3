<script setup lang="ts">
import { useRouter } from 'vue-router';

  const router = useRouter()
  const createNewProject = () => {
    router.push({name: 'form-project'});
  }
</script>

<template>
  <div class="no-project-container">
    <div class="no-projects">
      <h1 class="fw-semibold">Nenhum projeto</h1>
      <p>Clique no botão abaixo para criar o primeiro e gerenciá-lo.</p>
      <button 
        @click="createNewProject" 
        class="btn btn-primary d-flex align-items-center flex-shrink-0 gap-3 px-4"
        type="button"
      >
        <i class="bi bi-plus-circle" style="font-size: 24px; color: white;"></i>
        <span class="fs-5">Novo projeto</span>
      </button>
    </div>
  </div>
</template>


<style scoped lang="scss">
.no-project-container {
  height: calc(100vh - $clicksign-page-header-height);
}
.no-projects {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  align-items: center;
  text-align: center;
  background-color: #ffffff;
  padding: 0 10px;

  & > * {
    margin: 0;
  }

  h1 {
    color: $clicksign-emphasis-text-color;
    font-size: 24px;
  }
}

@media (width >= 600px) {
  .no-project-container{
    padding: 42px 60px;

  }
}
</style>
