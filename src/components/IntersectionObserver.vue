<template>
  <div ref="observedElement" class="h-6 w-full" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue';

interface Props {
  options?: {
    root?: HTMLElement | Document | null;
    rootMargin?: string;
  };
}
const props = withDefaults(defineProps<Props>(), {
  options: () => ({
    root: document,
    rootMargin: '100% 0% 100% 0%'
  })
})

const emit = defineEmits(['observed']);

const observedElement = ref<HTMLElement | null>(null);
const intersectionObserver = ref<IntersectionObserver | null>(null);

function registerInfiniteLoader() {
  intersectionObserver.value = new IntersectionObserver(entries => {
    if (entries && entries[0].isIntersecting) {
      emit('observed');
    }
  }, props.options);

  if (observedElement.value) {
    intersectionObserver.value.observe(observedElement.value);
  }
}

function unobserveInfiniteLoadObserver() {
  if (intersectionObserver.value && observedElement.value) {
    intersectionObserver.value.unobserve(observedElement.value);
  }
}

onMounted(() => {
  registerInfiniteLoader();
});

onBeforeUnmount(() => {
  unobserveInfiniteLoadObserver();
});
</script>
