import { ReserveCallback, SearchFormData } from './interfaces.js'
import { placesCoordinates, renderBlock, renderToast } from './lib.js'
import { renderSearchResultsBlock } from './search-results.js';

interface requestParameters {
  coordinates: string;
  checkinDate: number;
  checkoutDate: number;
  maxPrice: number;
}

export const searchCallback: ReserveCallback = (error, result) => {
  if (error === null && result !== null) {
    renderSearchResultsBlock(result);
  }
  else {
    renderToast({ type: "error", text: "Повторите поиск" });
  }
}

export async function search(searchParams: SearchFormData, callback: ReserveCallback): Promise<void> {
  // console.log('searchParams: ', searchParams);
  const startDate = searchParams.checkinDate.toISOString().split('T', 1);
  const endDate = searchParams.checkoutDate.toISOString().split('T', 1);

  const f = await fetch(`http://127.0.0.1:3300/places?coordinates=${placesCoordinates.get(searchParams.city)}
  &checkInDate=${startDate}&checkOutDate=${endDate}&maxPrice=${+searchParams.maxPrice}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=utf-8" }
    }
  );
  const d = await f.json();

  setTimeout(() => {
    if (Math.round(Math.random())) {
      //     callback(null, { result: [] })
      //   } else { callback(new Error('My Error')) }
      callback(null, d);
      setTimeout(() => {
        renderToast(
          { text: "Поиск устарел. Повторите поиск", type: "error" },
          {
            name: "Повторить поиск",
            handler: () => {
              search(getSearchParams(), callback);
            },
          }
        );
      }, 20 * 1000);
    } else {
      callback(new Error('Error 1'));
    }
  }, Math.random() * 3 + 500)
}

export function getSearchParams(): SearchFormData {
  return {
    city: (<HTMLInputElement>document.getElementById("city")).value,
    checkinDate: new Date((<HTMLInputElement>document.getElementById("check-in-date")).value),
    checkoutDate: new Date((<HTMLInputElement>document.getElementById("check-out-date")).value),
    maxPrice: +(<HTMLInputElement>document.getElementById("max-price")).value
  }
}

export function searchDataFunc(data: SearchFormData): void {
  console.log(data);
}

export function renderSearchFormBlock(checkinDate?: Date, checkoutDate?: Date) {
  const today = new Date();

  function checkDate(firstDate: Date, secondDate: Date): Date {
    if (new Date(secondDate).getTime() >= firstDate.getTime()) {
      return secondDate;
    }
    return firstDate;
  }

  function addDays(date: Date, amount: number): Date {
    const newDate = new Date(date.getTime())
    newDate.setDate(newDate.getDate() + amount);
    return newDate;
  }

  function dateStr(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  const curCheckInDate = checkinDate ? checkDate(today, checkinDate) : addDays(today, 1);
  const curCheckOutDate = checkoutDate ? checkDate(checkinDate, checkoutDate) : addDays(curCheckInDate, 3);
  const minDate = dateStr(today);
  const maxDate = dateStr(new Date(today.getFullYear(), today.getMonth() + 2, 1));

  renderBlock(
    'search-form-block',
    `
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${dateStr(curCheckInDate)}" min="${minDate}" max="${maxDate}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${dateStr(curCheckOutDate)}" min="${minDate}" max="${maxDate}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="text" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}
export { SearchFormData };

