<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { Project } from '@/models/Project'; // Importe o modelo Project
import defaultCoverImage from '@/assets/images/default-card-background.png';
import { useProjectStore } from '@/stores/project';

const props = defineProps<{
  project: Project;
}>();

const { toggleFavorite } = useProjectStore();

// Função para formatar a data
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

const cardCoverImage = computed(() => {
  return props.project.coverImage || defaultCoverImage;
});

const isFavorite = computed(() => props.project.isFavorite);
</script>

<template>
  <div class="card mb-4 shadow-sm">
    <!-- Imagem de capa do projeto -->
    <div class="position-relative">
      <!-- Imagem de capa do projeto ou imagem padrão -->
      <img :src="cardCoverImage" alt="Project Cover" class="card-img-top" />

      <!-- Ícone de favoritar/desfavoritar -->
      <i
        :class="[isFavorite ? 'bi bi-star-fill' : 'bi bi-star']"
        class="position-absolute"
        :style="{ 
          bottom: '10px', 
          right: '10px', 
          fontSize: '1.5rem', 
          cursor: 'pointer',
          color: isFavorite ? '#FFB23D' : 'white' 
        }"
        @click="toggleFavorite(project.id)"
      ></i>
    </div>

    <div class="card-body">
      <!-- Título do card -->
      <h5 class="card-title">{{ project.name }}</h5>

      <!-- Texto do cliente -->
      <p class="card-text">Cliente: {{ project.customer }}</p>

      <!-- Divisor -->
      <hr />

      <!-- Data de início e data final -->
      <div class="d-flex justify-content-between">
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
