<script setup lang="ts">
import { useRouter } from 'vue-router';

  const router = useRouter()
  const createNewProject = () => {
    router.push({name: 'create-project'});
  }
</script>

<template>
  <div class="tw-h-full tw-min-h-screen tw-max-h-screen">
    <h1>Nenhum projeto</h1>
    <p>Clique no botão abaixo para criar o primeiro e gerenciá-lo.</p>
    <button @click="createNewProject" class="tw-p-4 tw-bg-blue-900" type="button">Novo projeto</button>
  </div>
</template>

<style scoped>

</style>
