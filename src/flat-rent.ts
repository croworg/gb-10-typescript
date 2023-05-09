import { FlatRentParameters, FlatRentSdk } from "./libs/flat-rent-sdk/flat-rent-sdk.js";
import { Place, SearchFormData } from "./search.js";
import { Provider } from "./search-results.js";

export async function searchFlatRent(
  searchParams: SearchFormData
): Promise<Place[]> {
  const newFlatRent = new FlatRentSdk();
  const parameters: FlatRentParameters = {
    city: searchParams.city,
    checkInDate: new Date(searchParams.checkinDate),
    checkOutDate: new Date(searchParams.checkoutDate),
    priceLimit: searchParams.maxPrice,
  };

  const searchResult = await newFlatRent.search(parameters);
  const mappedResult: Place[] = searchResult.map((place) => {
    return {
      bookedDates: place.bookedDates,
      description: place.details,
      id: place.id,
      image: place.photos[0],
      name: place.title,
      price: place.totalPrice,
      provider: Provider.FlatRent,
    };
  });
  return mappedResult;
}
