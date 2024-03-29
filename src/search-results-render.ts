import { renderBlock, sortType } from "./lib.js";
import { getSearchParams, Place } from "./search.js";
import { bookPlace, getResultsHTML, Provider, sortResults, toggleFavoriteItem } from "./search-results.js";

export function renderSearchResultsBlock(
  results: Place[],
  resultsSortType = sortType.cheap
): void {
  const resultsHTML = getResultsHTML(results);
  console.log(resultsSortType);

  renderBlock(
    "search-results-block",
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select id="search-sort">
                <option ${resultsSortType === sortType.cheap ? "selected" : ""
    } value=${sortType.cheap}>Сначала дешёвые</option>
                <option ${resultsSortType === sortType.expensive ? "selected" : ""
    } value=${sortType.expensive}>Сначала дорогие</option>
                <option ${resultsSortType === sortType.close ? "selected" : ""
    } value=${sortType.close}>Сначала ближе</option>
            </select>
        </div>
    </div>
    <ul class="results-list">
    ${resultsHTML}
    </ul>
    `
  );

  const favoriteItems = document.getElementsByClassName("favorites");

  for (const item of favoriteItems) {
    item.addEventListener("click", (e) => {
      if (e.target instanceof HTMLElement) {
        toggleFavoriteItem({
          id: String(e.target.dataset.id),
          name: String(e.target.dataset.name),
          img: String(e.target.dataset.img),
        });
      }
    });
  }

  const bookButtons = document.getElementsByClassName("book-btn");

  for (const book of bookButtons) {
    book?.addEventListener("click", (e) => {
      if (e.target instanceof HTMLButtonElement) {
        bookPlace(
          String(e.target.dataset.id),
          getSearchParams(),
          Provider[<Provider>e.target.dataset.provider],
        );
      }
    });
  }
  // @ts-ignore
  const e: HTMLSelectElement = document.getElementById("search-sort");
  function show() {
    var as = e.value;
    var strUser = e.options[e.selectedIndex].value;
    console.log(as, strUser);
  }
  e.onchange = () => {
    show();
    sortResults(results, sortType[<sortType>e.value]);
  };
}
