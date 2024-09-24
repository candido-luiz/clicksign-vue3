import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useSuggestionStore = defineStore('suggestion', () => {
  const suggestionList = ref<string[]>([]);

  const addSuggestion = (suggestion: string) => {
    const lowerCaseSuggestionList = suggestionList.value.map(suggestion => {
      return suggestion.toLowerCase();
    })
    if (!lowerCaseSuggestionList.includes(suggestion.toLowerCase())) {
      suggestionList.value.unshift(suggestion);
      if(suggestionList.value.length > 5) {
        suggestionList.value.pop();
      }
    }
  };

  const removeSuggestion = (index: number) => {
    if (index >= 0 && index < suggestionList.value.length) {
      suggestionList.value.splice(index, 1);
    }
  };

  const getSuggestions = computed(() => {
    return suggestionList.value;
  })

  return { suggestionList, addSuggestion, removeSuggestion, getSuggestions };
});
