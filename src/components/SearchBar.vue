<template>
  <div class="row mx-0">
    <div class="col-12 px-0">
      <div ref="searchBox" class="searchbox input-group">
        <span class="input-group-text" id="basic-addon1">
          <i class="bi bi-search"></i>
        </span>
        <input 
          id="searchInput"
          ref="searchInput"
          class="form-control searchbar" 
          type="text" 
          placeholder="Digite o nome do projeto..."
          v-model="searchQuery"
          @change="emitSearch"
        >
        <div v-auto-animate class="history-list list-group">
          <li 
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="(item, index) in filteredSuggestionList"
            :key="index"
             @click="searchByHistoryItem(item)"
          >
            <div class="d-flex gap-3 align-items-center list-icon-item">
              <i class="bi bi-clock-history"></i>
              <span>{{ item }}</span>
            </div>
            <div id="removeFromHistory" @click.stop="removeSuggestion(index)" class="remove-icon">
              <i class="bi bi-x "></i>
            </div>
            
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue';

const props = defineProps<{
  suggestions: string[];
}>();

const searchBox = ref<HTMLElement>();
const searchInput = ref<HTMLElement>();
const searchQuery = defineModel<string>({required: true});
const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'removeSuggestion', suggestionIndex: number): void;
  (e: 'cancel'): void;

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

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    emit("cancel");
  }
}

const handleClickOutside = (event: Event) => {
  const searchboxElement = searchBox.value;
  if (searchboxElement && !searchboxElement.contains(event.target as Node)) {
    emit("cancel"); 
  }
}

onMounted(() => {
  if(searchInput.value) {
    searchInput.value.focus();
  }
  document.addEventListener('keyup', handleKeyUp);
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 500);
  nextTick(() => {
  })
});

onBeforeUnmount(() => {
  document.removeEventListener('keyup', handleKeyUp);
  document.removeEventListener('click', handleClickOutside);
})
</script>

<style scoped lang="scss">
.searchbox {
  position: relative;
  margin-top: 0 !important;

  &:focus-within > *{
    border-bottom: 1px solid $clicksign-button-primary-color;
  }

  & input::placeholder {
    font-size: 18px;
  }
}
.input-group > input {
  border-left: 0;
}
.input-group-text {
  background-color: white;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.searchbar {
  height: $clicksign-page-header-height;
  padding: .5rem 1rem;
  font-size: 1.25rem;
  &:focus {
    box-shadow: none !important;
  }
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

.list-icon-item, .remove-icon {
  font-size: 18px;
}

.remove-icon {
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.4);
  }
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
