<script setup lang="ts">

defineProps({
  title: {
    type: String,
    required: true
  }
})

</script>

<template>
  <div class="no-items">
    <h1>{{ title }}</h1>
    <slot></slot>
    <slot name="action"></slot>
  </div>
</template>

<style scoped lang="scss">

.no-items {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
  margin-top: 20vh;

  & > * {
    margin: 0;
  }

  h1 {
    color: $clicksign-emphasis-text-color;
    font-size: 24px;
  }

}
</style>
