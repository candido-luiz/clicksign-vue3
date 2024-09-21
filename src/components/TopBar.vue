<script setup lang="ts">
import pageLogo from "@/assets/images/symbol.png";
import { setShowSearchBarKey } from "@/injection-keys/keys";
import { inject } from "vue";

defineProps({
  showTopbar: {
    type: Boolean,
    required: true
  },
  canSearchItems: {
    type: Boolean,
    required: true
  },
});

const setShowSearchBar = inject(setShowSearchBarKey);

</script>

<template>
  <div v-show="showTopbar" class="topbar position-relative">
    <img :src="pageLogo" alt="logo do gerenciador de projetos" width="72" height="72">
    <div class="page-title">
      Gerenciador de Projetos
    </div>
    <div v-if="canSearchItems" class="search-icon" @click="setShowSearchBar!(true)">
      <i class="bi bi-search"></i>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  height: 80px;
  background: #1C1930;
  box-shadow: 0px 4px 4px 0 #00000040;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  .page-title {
    width: min-content;
  }

  .search-icon {
    font-size: 18px;
    position: absolute;
    right: 64px;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.4);
    }
  }
}
</style>