<script setup lang="ts">

const emit = defineEmits<{
  (e: 'resetFilters'): void;
}>();

const resetFilters = () => {
  emit("resetFilters")
}
</script>

<template>
  <div class="no-items">
    <h1>Nenhum item encontrado</h1>
    <button @click="resetFilters" class="btn btn-primary" type="button">Limpar filtros</button>
  </div>
</template>

<style scoped>

.no-items {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  color: var(--clicksign-emphasis-text-color);
  size: 24px;
  margin-bottom: 24px;
}
</style>
