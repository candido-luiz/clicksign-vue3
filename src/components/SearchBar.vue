<template>
  <div class="row">
    <div class="col-12">
      <!-- Input de pesquisa -->
      <div class="searchbox input-group">
        <span class="input-group-text" id="basic-addon1">
          <i class="bi bi-search"></i>


        </span>
        <input 
          class="form-control searchbar" 
          type="text" 
          placeholder="Digite o nome do projeto..."
          v-model="searchQuery"
          @change="emitSearch"
        >
        <ul class="history-list list-group">
          <li 
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="(item, index) in filteredSuggestionList"
            :key="index"
             @click="searchByHistoryItem(item)"
          >
            <div class="d-flex gap-3 align-items-center">
              <i class="bi bi-clock-history list-icon"></i>
              <span>{{ item }}</span>
            </div>
            <div @click.stop="removeSuggestion(index)">
              <i class="bi bi-x list-icon"></i>
            </div>
            
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, computed, nextTick } from 'vue';

const props = defineProps<{
  suggestions: string[];
}>();

const searchQuery = defineModel<string>({required: true});
const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'removeSuggestion', suggestionIndex: number): void;
}>();

const filteredSuggestionList = computed(() => {
  if(searchQuery.value) {
    return props.suggestions.filter(suggestion => {
      return suggestion.toLowerCase().includes(searchQuery.value.toLowerCase());
    })
  }
  return props.suggestions;
})

const emitSearch = () => {
  if(!searchQuery.value.trim()) return
  emit('search', searchQuery.value);
};

const removeSuggestion = (index: number) => {
  emit('removeSuggestion', index)
}

const searchByHistoryItem = (item: string) => {
  searchQuery.value = item;
  nextTick(() => {
    emitSearch();
  });
}
</script>

<style scoped>
.searchbox {
  position: relative;
  margin-top: 0 !important;
}
.input-group > input {
  border-left: 0;
}
.input-group-text {
  background-color: white;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.searchbox input::placeholder {
  font-size: 18px;
}
.searchbar {
  height: 80px;
  padding: .5rem 1rem;
  font-size: 1.25rem;
}
.history-list {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 10;
}

.history-list li {
  cursor: pointer;
  color: #717171;

  &:hover {
    background-color: #d2ccfd;
    color: black;
  }
}

.list-icon {
  font-size: 18px;
}
.input-group {
  margin-top: 20px;
}

.btn-outline-secondary {
  border-color: #ccc;
}

.btn-outline-secondary .bi-search {
  font-size: 20px;
}
</style>
