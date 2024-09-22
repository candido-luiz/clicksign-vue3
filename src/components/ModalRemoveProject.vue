<template>
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);" role="dialog">
    <div class="modal-dialog" style="margin-top: 100px;">
      <div class="modal-content" style="max-width: 582px; margin: auto; position: relative;">
        <!-- Ícone de lixeira -->
        <div class="trash-icon position-absolute top-0 start-50 translate-middle" style="width: 64px; height: 64px; background: #695CCD; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);">
          <i class="bi bi-trash" style="font-size: 20px; color: white; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></i>
        </div>

        <div class="modal-body p-4 d-flex flex-column align-items-center">
          <h1 class="mb-3" style="font-size: 22px;">Remover Projeto</h1>
          <hr class="my-3" style="width: 100%; border: 1px solid #dee2e6;"/>
          <p class="mb-3 text-center">Essa ação removerá definitivamente o projeto:</p>
          <h2 class="mb-4 text-center" style="font-size: 24px;">{{ projectName }}</h2>
          <div class="d-flex gap-2">
            <button id="cancelarRemocao" class="btn btn-secondary" @click="$emit('cancel')">Cancelar</button>
            <button id="confirmarRemocao" class="btn btn-primary" @click="confirmRemoval">Confirmar</button>
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

<style scoped>
.modal-content {
  max-width: 582px;
  padding: 32px;
}
.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
