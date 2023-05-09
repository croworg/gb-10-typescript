import { renderBlock } from './lib.js'
import { User, defaultUser } from './interfaces.js'
import { FavouritePlace } from './search-results.js';

export function getUserData(): User {
  const userData: unknown = JSON.parse(localStorage.getItem('user') ?? '');
  const user: User = new User(userData as User);

  if (typeof user === null) {
    console.log(`There's no user data`);
  }
  if (user instanceof User) {
    return user;
  } else {
    console.log(`Incorrect user data type`)
    return defaultUser
  }
}

export function getFavoritesAmount(): number | null {
  const favoriteItemsRaw: any = localStorage.getItem('favoritesAmount');

  if (favoriteItemsRaw !== null) {
    const favoriteItems: FavouritePlace[] = JSON.parse(favoriteItemsRaw);
    return favoriteItems.length;
  }
  return 0;
}

export function renderUserBlock(user: User, favoriteItemsAmount?: number): void {
  const favoritesCaption = favoriteItemsAmount ? favoriteItemsAmount : 'ничего нет'
  const hasFavoriteItems = favoriteItemsAmount ? true : false
  const userData = user !== null ? user : defaultUser

  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${userData.avatarUrl}" alt="${userData.username}" />
      <div class="info">
          <p class="name">${userData.username}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  )
}
