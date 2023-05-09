import { Reserve } from './interfaces.js';
import { renderBlock, renderToast, sortType } from './lib.js'
// import { getSearchParams, SearchFormData } from "./search-form.js";
import { getSearchParams, SearchFormData } from "./search.js";
import { FlatRentSdk } from "./libs/flat-rent-sdk/flat-rent-sdk.js";
import { renderSearchResultsBlock } from './search-results-render.js';

export interface FavouritePlace {
  id: string;
  name: string;
  img: string;
}

export interface BookResult {
  type: "success" | "error";
  hotelName?: string;
  checinDate?: Date;
  checkoutDate?: Date;
}

export enum Provider {
  Homy = "Homy",
  FlatRent = "FlatRent",
}

export function renderSearchStubBlock(): void {
  renderBlock(
    'search-results-block',
    `<div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>`
  )
}

export function renderEmptyOrErrorSearchBlock(reasonMessage: string): void {
  renderBlock(
    'search-results-block',
    `<div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>`
  )
}

export function toggleFavoriteItem(place: FavouritePlace): void {
  const favoritesElements = <NodeListOf<HTMLElement>>document.querySelectorAll(".favorites");

  const localStorageFavouriteItems: FavouritePlace[] = JSON.parse(
    <string>localStorage.getItem("favoriteItems")
  );
  if (!localStorageFavouriteItems) {
    const favoriteItems: FavouritePlace[] = [];
    favoriteItems.push(place);
    localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
    favoritesElements.forEach((el: HTMLElement) => {
      if (String(el.dataset.id) === String(place.id)) {
        el.classList.add("active");
      }
    });
  } else {
    if (
      localStorageFavouriteItems.reduce(
        (prev, current) => prev || current.id === place.id,
        false
      )
    ) {
      localStorage.setItem(
        "favoriteItems",
        JSON.stringify(
          localStorageFavouriteItems.filter((item) => item.id !== place.id)
        )
      );
      favoritesElements.forEach((el: HTMLElement) => {
        if (String(el.dataset.id) === String(place.id)) {
          el.classList.remove("active");
        }
      });
    } else {
      localStorageFavouriteItems.push(place);
      localStorage.setItem(
        "favoriteItems",
        JSON.stringify(localStorageFavouriteItems)
      );
      favoritesElements.forEach((el: HTMLElement) => {
        if (String(el.dataset.id) === String(place.id)) {
          el.classList.add("active");
        }
      });
    }
  }
}

export async function bookPlaceHomy(
  id: number | string,
  searchParams: SearchFormData,
): Promise<BookResult> {
  const f = await fetch(
    `http://127.0.0.1:3030/places/${id}?checkInDate=${searchParams.checkinDate}&checkOutDate=${searchParams.checkoutDate}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }
  );
  const bookResult = await f.json();
  if (bookResult.name === "BadRequest") {
    return { type: "error" };
  } else {
    return {
      type: "success",
      checinDate: new Date(searchParams.checkinDate),
      checkoutDate: new Date(searchParams.checkoutDate),
    };
  }
}

export async function bookPlaceFlatRent(
  id: number | string,
  searchParams: SearchFormData
): Promise<BookResult> {
  const newFlatRent = new FlatRentSdk();
  const bookResult = newFlatRent.book(
    id,
    new Date(searchParams.checkinDate),
    new Date(searchParams.checkoutDate),
  );
  if (!bookResult) {
    return { type: "error" };
  } else {
    return {
      type: "success",
      checinDate: new Date(searchParams.checkinDate),
      checkoutDate: new Date(searchParams.checkoutDate),
    };
  }
}

export async function bookPlace(
  id: number | string,
  searchParams: SearchFormData,
  provider: Provider
): Promise<void> {
  console.log(provider);

  if (provider === Provider.FlatRent) {
    const bookResult = await bookPlaceFlatRent(id, searchParams);
    if (bookResult.type === "error") {
      renderToast({ text: "Отель недоступен для бронирования", type: "error" });
    }
    if (bookResult.type === "success") {
      renderToast({
        text: `Отель успешно забронирован на даты с ${bookResult.checinDate} по ${bookResult.checkoutDate}`,
        type: "success",
      });
    }
  }
  if (provider === Provider.Homy) {
    const bookResult = await bookPlaceHomy(id, searchParams);
    if (bookResult.type === "error") {
      renderToast({ text: "Отель недоступен для бронирования", type: "error" });
    }
    if (bookResult.type === "success") {
      renderToast({
        text: `Отель успешно забронирован на даты с ${bookResult.checinDate} по ${bookResult.checkoutDate}`,
        type: "success",
      });
    }
  }
}

export function getResultsHTML(results: Reserve[]): string {
  const localStorageFavouriteItems: FavouritePlace[] = JSON.parse(
    <string>localStorage.getItem("favoriteItems")
  );
  let resultsHTML = "";
  results.forEach((result) => {
    const faforiteIsActive = !!localStorageFavouriteItems?.find(
      (el) => String(el.id) === String(result.id)
    );

    resultsHTML += `<li class="result">
        <div class="result-container">
          <div class="result-img-container">
            <div class="favorites ${faforiteIsActive ? "active" : ""
      }" data-id=${result.id} data-name=${result.name} data-img=${result.image
      }></div>
            <img class="result-img" src=${result.image} alt="">
          </div>	
          <div class="result-info">
            <div class="result-info--header">
              <p>${result.name}</p>
              <p class="price">${result.price}&#8381;</p>
            </div>
            <div class="result-info--map"><i class="map-icon"></i>
            ${result.remoteness ? result.remoteness + ' км от вас' : ''}</div>
            <div class="result-info--descr">${result.description}</div>
            <div class="result-info--footer">
              <div>
                <button class="book-btn" data-id=${result.id} data-provider=${result.provider}>
                  Забронировать
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>`;
  });
  return resultsHTML;
}

export function sortResults(results: Reserve[], type = sortType.cheap): void {
  let sortedResults: Reserve[];
  switch (type) {
    case sortType.cheap:
      sortedResults = results.sort((a, b) => a.price - b.price);
      break;
    case sortType.expensive:
      sortedResults = results.sort((a, b) => b.price - a.price);
      break;
    case sortType.close:
      sortedResults = results.sort((a, b) => {
        if (a.remoteness !== undefined && b.remoteness !== undefined) {
          return a.remoteness - b.remoteness;
        }
        return 0;
      });
      break;
    default:
      sortedResults = [];
  }
  renderSearchResultsBlock(sortedResults, type);
}

//   console.log(resultsHTML);
//   renderBlock(
//     "search-results-block",
//     `
//     <div class="search-results-header">
//         <p>Результаты поиска</p>
// Expand All
// 	@@ -40,49 +166,36 @@ export function renderSearchResultsBlock () {
//         </div>
//     </div>
//     <ul class="results-list">
//     ${resultsHTML}
//     </ul>
//     `
//   );

//   const favoriteItems = document.getElementsByClassName("favorites");
//   for (let i = 0; i < favoriteItems.length; i++) {
//     favoriteItems[i].addEventListener("click", (e) => {
//       if (e.target instanceof HTMLElement) {
//         toggleFavoriteItem({
//           id: String(e.target.dataset.id),
//           name: e.target.dataset.name,
//           img: e.target.dataset.img,
//         });
//       }
//     });
//   }

//   const bookButtons = document.getElementsByClassName("book-btn");
//   console.log(bookButtons);

//   for (let i = 0; i < bookButtons.length; i++) {
//     bookButtons[i].addEventListener("click", (e) => {
//       console.log(e);

//       if (e.target instanceof HTMLButtonElement) {
//         bookPlace(
//           e.target.dataset.id,
//           getSearchParams(),
//           Provider[e.target.dataset.provider]
//         );
//       }
//     });
//   }
// }
