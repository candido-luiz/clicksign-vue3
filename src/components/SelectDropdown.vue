<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, onBeforeUnmount } from 'vue';
import { type IDropdownOption } from "@/components/interfaces/IDropdownOption";
import IntersectionObserver from "@/components/IntersectionObserver.vue";

interface Props {
  options: IDropdownOption[],
  defaultOption: IDropdownOption | null,
  fullWidth?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  defaultOption: null,
  fullWidth: false,
})

const emit = defineEmits<{
  (e: 'optionSelected', option: string): void;
}>();

const dropdownWrapper = ref<HTMLElement>();
const selectDropdown = ref<HTMLElement>();
const selectIDropdownOptions = ref<HTMLElement>();
const showOptions= ref<boolean>(false);
const selectedOption = ref<IDropdownOption | null>(props.defaultOption);
const dropdownArrow = ref<HTMLElement>();

const selectedLabel = computed(() => {
  return selectedOption.value ? selectedOption.value.label : 'Selecione uma opção';
});

const selectOption = (option: IDropdownOption) => {
  selectedOption.value = option;
  toggleOptionsVisibility()
  emit('optionSelected', option.value);
};

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    toggleOptionsVisibility();
  }
}

const handleClickOutside = (event: Event) => {
  const dropdown = dropdownWrapper.value;
  if (dropdown && !dropdown.contains(event.target as Node)) {
    toggleOptionsVisibility(); 
  }
}

const toggleOptionsVisibility= () => {
  showOptions.value = !showOptions.value;

  if(showOptions.value) {
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('click', handleClickOutside);
  }
}

const setListsMinWidth = () => {
  if(selectDropdown.value && selectIDropdownOptions.value) {

    if(props.fullWidth) {
      selectIDropdownOptions.value.style.width = "100%";
      return
    }
    const dropdownWidth = selectIDropdownOptions.value.clientWidth;
    const dropdownArrowWidth = 40;
    if(
      selectDropdown.value.style.minWidth &&
      selectDropdown.value.style.minWidth ===
      selectIDropdownOptions.value.style.minWidth
    ) {
      return
    }
    selectDropdown.value.style.minWidth = `${dropdownWidth + dropdownArrowWidth}px`;
    selectIDropdownOptions.value.style.minWidth = selectDropdown.value.style.minWidth;
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('keyup', handleKeyUp);
  document.removeEventListener('click', handleClickOutside);
})

</script>

<template>
  <div ref="dropdownWrapper" class="position-relative">
    <IntersectionObserver @observed="setListsMinWidth"/>
    <ul ref="selectDropdown" class="list-group">
      <li 
        class="list-group-item select-display d-flex justify-content-between"
        :class="{'open': showOptions}"
        @click="toggleOptionsVisibility"
      > 
        <span>{{ selectedLabel }}</span>
        <div ref="dropdownArrow">
          <i v-if="showOptions" class="bi bi-chevron-up"></i>
          <i v-else class="bi bi-chevron-down"></i>
        </div>
      </li>

      <div 
        ref="selectIDropdownOptions" 
        class="select-options"
        :class="{'hide-options': !showOptions}"
      >
        <li 
          class="list-group-item"
          v-for="option in options" :key="option.value"
          @click="selectOption(option)"
        >
          <div>
            {{ option.label }}
          </div>
        </li>
      </div>
    </ul>

  </div>
</template>

<style scoped lang="scss">
$dropdown-border: 1px solid $clicksign-primary-color;

.select-options {
  position: absolute;
  top: 100%;
  min-width: max-content;
  max-width: 100%;

  .list-group-item {

    cursor: pointer;
    border-inline: $dropdown-border;
    &:first-child{
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    &:last-child {
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      border-bottom: $dropdown-border;
    }

    &:hover {
      background-color: $clicksign-background;
      color: black;
    }
  }

  &.hide-options{
    visibility: hidden;
  }
}

.select-display {
  cursor: pointer;
  border-radius: 8px;

  &.open {
    border: $dropdown-border;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  &:hover {
    border: $dropdown-border;
  }
}
</style>
