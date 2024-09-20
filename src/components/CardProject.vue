<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { Project } from '@/models/Project'; // Importe o modelo Project
import defaultCoverImage from '@/assets/images/default-card-background.png';
import { useProjectStore } from '@/stores/project';

const props = defineProps<{
  project: Project;
  projectNameQuery: String;
  highlightProjectName: Boolean;
}>();

const emit = defineEmits<{
  (e: 'removeProject', projectId: string): void;
}>();


const { toggleFavorite } = useProjectStore();

// Função para formatar a data

const cardCoverImage = computed(() => {
  return props.project.coverImage || defaultCoverImage;
});

const projectName = computed(() => {
  const name = props.project.name;
  if (!props.projectNameQuery || !props.highlightProjectName) return name;
  const regex = new RegExp(`(${props.projectNameQuery})`, 'gi');
  return name.replace(
    regex, 
    '<mark style="color: #ffffff; background-color: #ffb23d; padding: 0;">$1</mark>'
  );
});

const isFavorite = computed(() => props.project.isFavorite);

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

const editProject = (projectId: string) => {

}

const removeProject = (projectId: string) => {
  emit('removeProject', projectId)
}

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
          bottom: '17px', 
          right: '74px', 
          fontSize: '1.5rem', 
          cursor: 'pointer',
          color: isFavorite ? '#FFB23D' : 'white' 
        }"
        @click="toggleFavorite(project.id)"
      ></i>

      <!-- Dropdown de ações -->
      <div class="position-absolute" style="bottom: 17px; right: 16px;">
        <div class="dropdown">
          <button 
            class="btn bg-white rounded-circle shadow-sm" 
            type="button" 
            id="dropdownMenuButton" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
            style="width: 36px; height: 36px; padding: 0; display: flex; align-items: center; justify-content: center;"
          >
            <i class="bi bi-three-dots"></i>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#" @click="editProject(project.id)">Editar</a></li>
            <li><a class="dropdown-item text-danger" href="#" @click="removeProject(project.id)">Remover</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="card-body">
      <!-- Título do card -->
      <!-- <h5 class="card-title">{{ project.name }}</h5> -->
      <h5 class="card-title" v-html="projectName"></h5>

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
mark{
  padding: 0;
  margin: 0;
  background-color: #ffb23d; /* ou outra cor de destaque */
}
</style>
