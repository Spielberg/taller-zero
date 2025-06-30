import { useMutation } from "@tanstack/react-query";
import { getForecast } from "../requests/forecasts";
import type { Forecast } from "../requests/forecasts";

export const useForecasts = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: Forecast) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: ({
      cityKey,
      days,
    }:
      {
        cityKey: string;
        days: 'daily' | '5day' | '10day' | '15day' | '15day';
      }
    ) => getForecast(cityKey, days),
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  })
}