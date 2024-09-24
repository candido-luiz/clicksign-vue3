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
      <h1>Nenhum projeto</h1>
      <p>Clique no botão abaixo para criar o primeiro e gerenciá-lo.</p>
      <button @click="createNewProject" class="btn btn-primary" type="button">Novo projeto</button>
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
  align-items: center;
  text-align: center;
  background-color: #ffffff;
  padding: 0 10px;
}
h1 {
  color: $clicksign-emphasis-text-color;
  size: 24px;
  margin-bottom: 24px;
}

@media (width >= 600px) {
  .no-project-container{
    padding: 42px 60px;

  }
}
</style>
