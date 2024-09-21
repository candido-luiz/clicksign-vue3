import type { InjectionKey, Ref } from "vue";

export const showSearchBarKey = Symbol() as InjectionKey<Ref<boolean>>;

export const setShowSearchBarKey = Symbol()  as InjectionKey<(value: boolean) => void>
