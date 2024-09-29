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
  <header v-show="showTopbar" class="topbar position-relative">
    <img :src="pageLogo" alt="logo do gerenciador de projetos" width="72" height="72">
    <div class="page-title">
      Gerenciador de Projetos
    </div>
    <div v-if="canSearchItems" class="search-icon" @click="setShowSearchBar!(true)">
      <i class="bi bi-search"></i>
    </div>
  </header>
</template>

<style scoped lang="scss">
.topbar {
  height: 80px;
  background: $clicksign-topbar-background;
  box-shadow: 0px 4px 4px 0 rgba($clicksign-primary-color, 0.25);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 9px;

  .page-title {
    width: min-content;
  }

  .search-icon {
    font-size: 18px;
    position: absolute;
    right: 32px;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.4);
    }

    @media (width >= 500px) {
      right: 64px;
    }
  }
}
</style>