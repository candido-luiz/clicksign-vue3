<script setup lang="ts">
import { Project } from '@/models/Project';
import { useProjectStore } from '@/stores/project';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const projectStore = useProjectStore();

const projectName = ref<string>('');
const projectCustomer = ref<string>('');
const projectStartDate = ref<string>('');
const projectFinalDate = ref<string>('');
const projectCover = ref<File | null>(null);

const createProject = () => {
  const project = new Project(
    projectName.value,
    projectCustomer.value,
    new Date(projectStartDate.value),
    new Date(projectFinalDate.value),
    projectCover.value
  );

  projectStore.addProject(project);
  router.push({name: 'home'});
};
</script>

<template>
  <form @submit.prevent="createProject" class="tw-max-w-[702px] tw-mx-auto tw-p-6 tw-bg-white tw-shadow-md tw-rounded-lg">
    <div class="tw-flex tw-flex-col tw-gap-4">
      <label for="projectName" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Nome do projeto</label>
      <input
        type="text"
        id="projectName"
        v-model="projectName"
        required
        class="tw-block tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-p-2 focus:tw-border-indigo-500 focus:tw-ring focus:tw-ring-indigo-500 focus:tw-ring-opacity-50"
      />

      <label for="projectCustomer" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Cliente</label>
      <input
        type="text"
        id="projectCustomer"
        v-model="projectCustomer"
        required
        class="tw-block tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-p-2 focus:tw-border-indigo-500 focus:tw-ring focus:tw-ring-indigo-500 focus:tw-ring-opacity-50"
      />

      <div class="tw-flex tw-gap-8">
        <div class="tw-flex-1">
          <label for="projectStartDate" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Data de Início</label>
          <input
            type="date"
            id="projectStartDate"
            v-model="projectStartDate"
            required
            class="tw-block tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-p-2 focus:tw-border-indigo-500 focus:tw-ring focus:tw-ring-indigo-500 focus:tw-ring-opacity-50"
          />
        </div>

        <div class="tw-flex-1">
          <label for="projectFinalDate" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Data final</label>
          <input
            type="date"
            id="projectFinalDate"
            v-model="projectFinalDate"
            required
            class="tw-block tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-p-2 focus:tw-border-indigo-500 focus:tw-ring focus:tw-ring-indigo-500 focus:tw-ring-opacity-50"
          />
        </div>
      </div>

      <label for="projectCover" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Capa do projeto</label>
      <input
        type="file"
        id="projectCover"
        accept="image/*"
        class="tw-block tw-w-full tw-text-sm tw-text-gray-500 tw-file:py-2 tw-file:px-4 tw-file:border tw-file:border-gray-300 tw-file:rounded-md tw-file:text-sm tw-file:font-medium tw-file:bg-gray-100 hover:file:tw-bg-gray-200"
      />

      <button
        type="submit"
        class="tw-w-full tw-bg-[#B2A8FF] tw-text-white tw-py-2 tw-px-4 tw-rounded-md tw-border tw-border-transparent tw-shadow-sm tw-text-sm tw-font-medium hover:tw-bg-[#a08ee2] focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-indigo-500"
      >
        Salvar projeto
      </button>
    </div>
  </form>
</template>

<style scoped>
/* Adicione quaisquer estilos adicionais necessários */
</style>
