<template>
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="trash-icon-wrapper position-absolute top-0 start-50 translate-middle">
          <i class="bi bi-trash trash-icon"></i>
        </div>

        <div class="modal-body p-4 d-flex flex-column align-items-center">
          <h1 class="mb-3 modal-title">Remover Projeto</h1>
          <hr class="my-3"/>
          <p class="mb-3 text-center modal-info">Essa ação removerá definitivamente o projeto:</p>
          <h2 class="fs-4 mb-4 text-center project-name">{{ projectName }}</h2>
          <div class="d-flex gap-4">
            <button id="cancelarRemocao" class="btn btn-outline-primary py-2 px-4 px-sm-5" @click="$emit('cancel')">Cancelar</button>
            <button id="confirmarRemocao" class="btn btn-primary py-2 px-4 px-sm-5" @click="confirmRemoval">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  projectName: string;
  projectId: string;
}>();

const emit = defineEmits<{
  (e: 'confirm', projectId: string): void;
  (e: 'cancel'): void;
}>();

const confirmRemoval = () => {
  emit('confirm', props.projectId);
};
</script>

<style scoped lang="scss">
.modal-dialog {

  margin-top: 25vh;

  .modal-content {
    max-width: 582px;
    margin: auto; 
    position: relative;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  
    hr {
      width: 100%;
      margin: 0 !important;
    }
  }

  .modal-title {
    font-size: 22px;
    margin-top: 20px;
    color: $clicksign-emphasis-text-color;
  }

  .modal-info {
    margin-top: 20px;
  }
}

.trash-icon-wrapper {
  width: 64px; 
  height: 64px; 
  background: #695CCD; 
  border-radius: 50%; 
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.trash-icon {
  font-size: 20px; 
  color: white; 
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%);
}
.project-name {
  color: $clicksign-topbar-background;
}
</style>
