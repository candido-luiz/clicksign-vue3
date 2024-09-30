<script setup lang="ts">
import { computed } from 'vue';
import { Project } from '@/models/Project';
import defaultCoverImage from '@/assets/images/default-card-background.png';
import { useProjectStore } from '@/stores/project';
import { useRouter } from 'vue-router';
import dayjs from '@/utils/dayjs';

const props = defineProps<{
  project: Project;
  projectNameQuery: String;
  highlightProjectName: Boolean;
}>();

const emit = defineEmits<{
  (e: 'removeProject', projectId: string): void;
}>();

const router = useRouter();
const { toggleFavorite } = useProjectStore();


const cardCoverImage = computed(() => {
  return props.project.coverImage?.url || defaultCoverImage;
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
  return dayjs(date).format('DD [de] MMMM [de] YYYY');
};

const editProject = (projectId: string) => {
  router.push({
    name: 'form-project',
    params: {
      projectId: projectId
    }
  });
}

const removeProject = (projectId: string) => {
  emit('removeProject', projectId)
}

</script>

<template>
  <div class="card shadow-sm">
    <div class="position-relative">
      <img :src="cardCoverImage" alt="Project Cover" class="card-img-top" height="230" />

      <i
        class="favorite-icon"
        :class="[isFavorite ? 'bi bi-star-fill' : 'bi bi-star']"
        :style="{
          color: isFavorite ? '#FFB23D' : 'white' 
        }"
        @click="toggleFavorite(project.id)"
      ></i>

      <div class="position-absolute" style="bottom: 17px; right: 16px;">
        <div class="dropdown">
          <button 
            class="card-options btn bg-white rounded-circle shadow-sm " 
            type="button" 
            id="dropdownMenuButton" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            <i class="bi bi-three-dots"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li class="d-flex gap-3 align-items-center">
              <i class="bi bi-pencil-square" style="font-size: 20px;"></i>
              <span role="button" id="editProject" class="dropdown-item" @click="editProject(project.id)">Editar</span>
            </li>
            <li class="d-flex gap-3 align-items-center">
              <i class="bi bi-trash" style="font-size: 20px;"></i>
              <span role="button" id="removeProject" class="dropdown-item"@click="removeProject(project.id)">Remover</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="card-body">
      <h1 class="card-title fs-5 fw-bold" v-html="projectName"></h1>

      <p class="card-text">
        <span class="fw-bold">Cliente: </span>
        <span>{{ project.customer }}</span>
      </p>

      <hr />

      <div class="d-flex flex-column gap-2">
        <div class="d-flex gap-3 align-items-center" title="Data de início">
          <span>
            <i class="bi bi-calendar" style="font-size: 24px;"></i>
          </span>
          <span>{{ formatDate(project.startDate) }}</span>
        </div>
         <div class="d-flex gap-3 align-items-center" title="Data final">
          <span>
            <i class="bi bi-calendar-check" style="font-size: 24px;"></i>
          </span>
          <span>{{ formatDate(project.finalDate) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-options {
  width: 36px;
  height: 36px; 
  padding: 0; 
  display: flex; 
  align-items: center; 
  justify-content: center;
}

mark{
  padding: 0;
  margin: 0;
  background-color: #ffb23d;
}

.favorite-icon {
  position: absolute;
  font-size: 1.5rem;
  bottom: 17px;
  right: 74px;
  cursor: pointer;
}

.dropdown-menu {
  min-width: 240px;
  padding: 0;
  li {
    padding: 10px 0 10px 20px;
    color: $clicksign-primary-color;

    &:hover {
      cursor: pointer;
      background-color: $clicksign-primary-color;
      color: #FFFFFF;
    }
  }

  & > li:first-child {
    border-bottom: 1px solid $clicksign-background;
  }

  & .dropdown-item {
    color: inherit;
    padding: 0;

    &:hover {
      background-color: unset;
    }
  }
}

</style>
