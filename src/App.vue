<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import TopBar from "@/components/TopBar.vue";
import { computed, provide, ref } from 'vue';
import { setShowSearchBarKey, showSearchBarKey } from './injection-keys/keys';
import GoToTopButton from '@/components/GoToTopButton.vue';

const route = useRoute();

const showSearchBar = ref<boolean>(false);

const showTopbar = computed(() => {
  return !showSearchBar.value;
})
const canSearchItems = computed(() => {
  return !!route.meta.canSearchProjects;
})
const setShowSearchBar = (value: boolean) => {
  showSearchBar.value = value;
}

provide(showSearchBarKey, showSearchBar);
provide(setShowSearchBarKey, setShowSearchBar);

</script>

<template>
  <TopBar
    :showTopbar="showTopbar"
    :canSearchItems="canSearchItems"
  />
  <RouterView v-slot="{ Component }">
    <div
      v-auto-animate 
      name="smooth-fade" 
      mode="out-in"
    >
      <component :is="Component"/>
    </div>
  </RouterView>
  <GoToTopButton />
</template>

<style scoped lang="scss">
.smooth-fade-enter-active, .smooth-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.smooth-fade-enter-from, .smooth-fade-leave-to {
  opacity: 0;
}
</style>
