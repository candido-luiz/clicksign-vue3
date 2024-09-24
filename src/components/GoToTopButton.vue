<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
const showButton = ref(false);

const handleScroll = () => {
  showButton.value = window.scrollY > 50;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

</script>
<template>
  <button
    v-if="showButton"
    class="btn btn-primary go-to-top"
    @click="scrollToTop"
  >
    <i class="bi bi-arrow-up"></i>
  </button>
</template>



<style scoped>
.go-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
