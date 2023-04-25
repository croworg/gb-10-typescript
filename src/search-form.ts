import { renderBlock } from './lib.js'

interface SearchFormData {
  checkinDate: Date;
  checkoutDate: Date;
  maxPrice?: number;
}

export function searchDataHandle(): void {
  const checkinRaw = (<HTMLInputElement>document.getElementById("check-in-date")).value;
  const checkoutRaw = (<HTMLInputElement>document.getElementById('check-out-date')).value;
  const checkinDate = new Date(checkinRaw);
  const checkoutDate = new Date(checkoutRaw);

  searchDataFunc({ checkinDate, checkoutDate })
}

export function searchDataFunc(data: SearchFormData): void {
  console.log(data);
}

export function renderSearchFormBlock(checkinDate: Date, checkoutDate: Date) {
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
