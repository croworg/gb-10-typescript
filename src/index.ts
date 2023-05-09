import { renderSearchStubBlock } from './search-results.js';
import { getFavoritesAmount, getUserData, renderUserBlock } from './user.js';
import { callback, getSearchParams, search } from "./search.js";
import { renderSearchFormBlock } from "./search-form-render.js";
// import { renderToast, replacer, reviver } from "./lib.js";

window.addEventListener('DOMContentLoaded', () => {
  renderUserBlock(getUserData(), <number>getFavoritesAmount());
  renderSearchFormBlock();
  renderSearchStubBlock();
  // renderToast(
  //   { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
  //   { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
  // );
  document.getElementById('search-form-block')
    ?.addEventListener('submit', (e) => {
      e.preventDefault();
      search(getSearchParams(), callback);
    })
})


function sampleInit() {
  if (localStorage.getItem('user') === null) {
    localStorage.setItem('user', JSON.stringify({ username: 'John Smith', avatarUrl: '/img/avatar2.png' }));
  }
}

sampleInit();
