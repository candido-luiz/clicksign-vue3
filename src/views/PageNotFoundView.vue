<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageNotFound',
});
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="text-center">
      <h1 class="display-1 fw-bold">404</h1>
      <p class="lead">Página não encontrada</p>
      <RouterLink to="/" class="btn btn-primary mt-4">
        Voltar para a Página Inicial
      </RouteRLink>
    </div>
  </div>
</template>