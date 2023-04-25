import { renderSearchFormBlock, searchDataFunc, searchDataHandle } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock } from './user.js'
import { renderToast } from './lib.js'

window.addEventListener('DOMContentLoaded', () => {
  renderUserBlock('Jane Smith', './img/avatar2.png', 1)
  renderSearchFormBlock(new Date('2023-05-05'), new Date('2023-05-06'))
  renderSearchStubBlock()
  renderToast(
      {text: 'Это пример уведомления. Используйте его при необходимости', type: 'success'},
      {name: 'Понял', handler: () => {console.log('Уведомление закрыто')}}
  )
})


function sampleInit() {
  if (localStorage.getItem('user') === null) {
    localStorage.setItem('user', JSON.stringify({username: 'John Smith', avatarUrl: '/img/avatar2.jpg'}));
  }
}

// localStorage.user = JSON.stringify({username: 'John Smith', avatarUrl: '/img/avatar2.jpg'});
searchDataHandle();
sampleInit();
