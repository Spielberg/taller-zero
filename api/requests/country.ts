import { apiUrl, apiKey } from '../../config';

export interface Country {
  ID: string;
  LocalizedName: string;
  EnglishName: string;
}

export const getCountries = async (): Promise<Country[]> => {
  const response = await fetch(`${apiUrl}/locations/v1/countries?apikey=${apiKey}`)
  const data = await response.json();
  return data
}