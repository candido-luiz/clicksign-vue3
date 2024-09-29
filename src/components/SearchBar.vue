<template>
  <div class="row mx-0">
    <div class="col-12 px-0 position-relative" style="margin-bottom: 90px;">
      <div 
        ref="searchBox" 
        class="searchbox"
        :class="{'rounded-searchbox': isSearchBarRounded}"
      >
        <div class="input-group">
          <span class="input-group-text" id="basic-addon1">
            <i class="bi bi-search text-primary"></i>
          </span>
          <input 
            id="searchInput"
            ref="searchInput"
            class="form-control searchbar" 
            :class="{'rounded-searchbar': isSearchBarRounded}"
            type="text" 
            placeholder="Digite o nome do projeto..."
            v-model="searchQuery"
            @keypress.enter="emitSearch"
            @focus="showHistory = true"
          >
        </div>
        <div v-if="showHistory" v-auto-animate class="history-list list-group">
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
              <i class="bi bi-x " style="font-size: 24px;"></i>
            </div>
            
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue';

const props = defineProps<{
  suggestions: string[];
}>();

const searchBox = ref<HTMLElement>();
const searchInput = ref<HTMLElement>();
const searchQuery = defineModel<string>({required: true});
const showHistory = ref<boolean>(false);

const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'removeSuggestion', suggestionIndex: number): void;
  (e: 'close'): void;

}>();

const filteredSuggestionList = computed(() => {
  if(searchQuery.value) {
    return props.suggestions.filter(suggestion => {
      return suggestion.toLowerCase().includes(searchQuery.value.toLowerCase());
    })
  }
  return props.suggestions;
});

const isSearchBarRounded = computed(() => {
  return filteredSuggestionList.value.length > 0 && showHistory.value;
})

const emitSearch = () => {
  if(!searchQuery.value.trim()) return
  emit('search', searchQuery.value);
  showHistory.value = false;
};

const closeSearchBar = () => {
  showHistory.value = false;
  emit("close");
}

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
    closeSearchBar();
  }
}

const handleClickOutside = (event: Event) => {
  const searchboxElement = searchBox.value;
  if (searchboxElement && !searchboxElement.contains(event.target as Node)) {
    closeSearchBar(); 
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
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  left: 0;
  z-index: 10;

  &.rounded-searchbox {
    border: 2px solid $clicksign-primary-color;
    border-radius: 18px;
  }

  & input::placeholder {
    font-size: 18px;
  }
}
.input-group {
  box-shadow: 0px 4px 4px 0 rgba($clicksign-primary-color, 0.25);
  margin-top: 0 !important;
  & > input {
    border: 0;
  }
}
.input-group-text {
  background-color: white;
  border-color: transparent;
  border-bottom-left-radius: 16px;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 0;
}

.searchbar {
  height: $clicksign-page-header-height;
  padding: .5rem 1rem;
  font-size: 1.25rem;
  &:focus {
    box-shadow: none !important;
  }

  &.rounded-searchbar {
    border-top-right-radius: 16px;
  }

}

.history-list li {
  cursor: pointer;
  color: #717171;

  &:hover {
    background-color: #d2ccfd;
    color: black;
  }
}

.list-group-item {
  &:first-child{
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  &:last-child {
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
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

.btn-outline-secondary {
  border-color: #ccc;
}
</style>
