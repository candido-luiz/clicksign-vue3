import type { PiniaPluginContext } from 'pinia';

export function piniaPluginPersist(ctx: PiniaPluginContext) {
  const store = ctx.store;

  // Nome da store que será usado para persistência
  const storageKey = `pinia-${store.$id}`;

  // Carregar estado do localStorage
  const storedState = localStorage.getItem(storageKey);
  if (storedState) {
    store.$state = JSON.parse(storedState);
  }

  // Salvar estado no localStorage quando mudar
  store.$subscribe((_mutation) => {
    localStorage.setItem(storageKey, JSON.stringify(store.$state));
  });
}
