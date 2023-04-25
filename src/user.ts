import { renderBlock } from './lib.js'
import { User } from './interfaces.js'

export function getUserData(): User {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user.usename === String && user.avatarUrl === String) {
    return user;
  }
  return {username: 'Guest', avatarUrl: '/img/avatar.png'}
}

export function getFavoritesAmount(): number {
  const count = JSON.parse(localStorage.getItem('favoritesAmount'));
  if (count === null) {
    return 0
  }
  return count
}

export function renderUserBlock(userName: string, userAvatar: string, favoriteItemsAmount: number) {
  const user = getUserData();
  const favoritesCount = getFavoritesAmount();
  const favoritesCaption = favoritesCount ? favoritesCount : 'ничего нет'
  const hasFavoriteItems = favoritesCount ? true : false
  // const user = userName ? userName : 'Wade Warren';
  // const avatarUrl = userAvatar ? userAvatar : './img/avatar.png';


  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${user.avatarUrl}" alt="${user.username}" />
      <div class="info">
          <p class="name">${user.username}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  )
}
