import { setActivePinia, createPinia } from 'pinia';
import { useSuggestionStore } from '../suggestion';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Suggestion Store', () => {
  let store: ReturnType<typeof useSuggestionStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useSuggestionStore();
  });

  it('deve adicionar uma nova sugestão', () => {
    store.addSuggestion('Sugestão 1');
    
    expect(store.suggestionList).toHaveLength(1);
    expect(store.suggestionList[0]).toBe('Sugestão 1');
  });

  it('não deve adicionar sugestão duplicada', () => {
    store.addSuggestion('Sugestão 1');
    store.addSuggestion('Sugestão 1');

    expect(store.suggestionList).toHaveLength(1);
  });

  it('deve manter apenas as 5 sugestões mais recentes', () => {
    store.addSuggestion('Sugestão 1');
    store.addSuggestion('Sugestão 2');
    store.addSuggestion('Sugestão 3');
    store.addSuggestion('Sugestão 4');
    store.addSuggestion('Sugestão 5');
    store.addSuggestion('Sugestão 6');

    expect(store.suggestionList).toHaveLength(5);
    expect(store.suggestionList).toContain('Sugestão 6');
    expect(store.suggestionList).not.toContain('Sugestão 1');
  });

  it('Deve remover uma sugestão pelo índice', () => {
    store.addSuggestion('Sugestão 1');
    store.addSuggestion('Sugestão 2');
    
    store.removeSuggestion(0);

    expect(store.suggestionList).toHaveLength(1);
    console.log(store.suggestionList)
    expect(store.suggestionList[0]).toBe('Sugestão 1');
  });

  it('Não deve remover sugestão se o índice for inválido', () => {
    store.addSuggestion('Sugestão 1');

    store.removeSuggestion(-1);
    expect(store.suggestionList).toHaveLength(1);

    store.removeSuggestion(1);
    expect(store.suggestionList).toHaveLength(1);
  });

  it('Deve retornar a lista de sugestões', () => {
    store.addSuggestion('Sugestão 1');
    store.addSuggestion('Sugestão 2');

    const suggestions = store.getSuggestions;
    
    expect(suggestions).toEqual(['Sugestão 2', 'Sugestão 1']);
  });
});
