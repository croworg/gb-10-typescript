import { searchCallback, getSearchParams, search } from './search-form.js';
import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { getFavoritesAmount, getUserData, renderUserBlock } from './user.js'
// import { renderToast } from './lib.js'

window.addEventListener('DOMContentLoaded', () => {
  renderUserBlock(getUserData(), getFavoritesAmount());
  renderSearchFormBlock(new Date('2023-04-05'), new Date('2023-04-08'));
  renderSearchStubBlock();
  // renderToast(
  //   { text: 'Это пример уведомления. Используйте его при необходимости', type: 'success' },
  //   { name: 'Понял', handler: () => { console.log('Уведомление закрыто') } }
  // );
  document.getElementById('search-form-block').addEventListener('submit', (e) => {
    e.preventDefault();
    search(getSearchParams(), searchCallback);
  })
})


function sampleInit() {
  if (localStorage.getItem('user') === null) {
    localStorage.setItem('user', JSON.stringify({ username: 'John Smith', avatarUrl: '/img/avatar2.png' }));
  }
}

sampleInit();
