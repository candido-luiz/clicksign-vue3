<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router';
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
  <RouterView />
  <GoToTopButton />
</template>

<style scoped>

</style>
