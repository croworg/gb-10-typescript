export interface SearchFormData {
  city: string,
  checkinDate: Date,
  checkoutDate: Date,
  maxPrice?: number,
}

export class User {
  username: string
  avatarUrl: string
  favoritesAmount?: number

  constructor({ username, avatarUrl, favoritesAmount = 0 }: User) {
    this.username = username
    this.avatarUrl = avatarUrl
    this.favoritesAmount = favoritesAmount
  }
}

export const defaultUser: User = {
  username: 'Guest',
  avatarUrl: './img/avatar.png'
}

export interface Reserve {
  result: string[]
}

export interface ReserveCallback {
  (error?: Error, result?: Reserve): void
}
