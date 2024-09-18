<script setup lang="ts">
import { defineProps } from 'vue';
import { Project } from '@/models/Project'; // Importe o modelo Project

const props = defineProps<{
  project: Project;
}>();

// Função para formatar a data
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};
</script>

<template>
  <div class="tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-md tw-overflow-hidden">
    <!-- Imagem de capa do projeto -->
    <img v-if="project.coverImage" :src="project.coverImage" alt="Project Cover" class="tw-w-full tw-h-48 tw-object-cover" />

    <div class="tw-p-4">
      <!-- Título do card -->
      <h3 class="tw-text-xl tw-font-semibold tw-mb-2">{{ project.name }}</h3>

      <!-- Texto do cliente -->
      <p class="tw-text-gray-600 tw-mb-2">Cliente: {{ project.customer }}</p>

      <!-- Divisor -->
      <hr class="tw-my-4" />

      <!-- Data de início e data final -->
      <div class="tw-flex tw-justify-between">
        <div>
          <strong>Data de Início:</strong> {{ formatDate(project.startDate) }}
        </div>
        <div>
          <strong>Data Final:</strong> {{ formatDate(project.finalDate) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Você pode adicionar estilos adicionais aqui, se necessário */
</style>
