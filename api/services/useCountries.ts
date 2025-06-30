import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../requests/country";

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  })
}