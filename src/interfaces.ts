import { Provider } from "./search-results";

export interface SearchFormData {
  city: string,
  checkinDate: Date,
  checkoutDate: Date,
  maxPrice?: number,
};

export class User {
  username: string;
  avatarUrl: string;
  favoritesAmount?: number;

  constructor({ username, avatarUrl, favoritesAmount = 0 }: User) {
    this.username = username;
    this.avatarUrl = avatarUrl;
    this.favoritesAmount = favoritesAmount;
  };
};

export const defaultUser: User = {
  username: 'Guest',
  avatarUrl: './img/avatar.png',
};

export interface Reserve {
  bookedDates: unknown[];
  description: string;
  id: number | string;
  image: string;
  name: string;
  price: number;
  provider: Provider;
  remoteness?: number;
  // result?: string[];
};

export interface ReserveCallback {
  (error?: Error, result?: Reserve[]): void;
};
