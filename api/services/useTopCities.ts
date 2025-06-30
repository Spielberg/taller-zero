import { useQuery } from "@tanstack/react-query";
import { getCities } from "../requests/cities";

export const useTopCities = (limit: number = 50) => {
  return useQuery({
    queryKey: ['top-cities', limit],
    queryFn: () => getCities(limit),
  })
}