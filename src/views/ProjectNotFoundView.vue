<script setup lang="ts">
import { useRouter } from 'vue-router';

  const router = useRouter()
  const createNewProject = () => {
    router.push('/');
  }
</script>

<template>
  <div class="no-project-container">
    <div class="container no-projects">
      <h1>Projeto não foi encontrado</h1>
      <button @click="createNewProject" class="btn btn-primary" type="button">Voltar para o início</button>
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
