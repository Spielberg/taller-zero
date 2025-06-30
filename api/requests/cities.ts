import { apiKey, apiUrl } from "../../config";

interface Region {
  ID: string;
  LocalizedName: string;
  EnglishName: string;
}

interface Country {
  ID: string;
  LocalizedName: string;
  EnglishName: string;
}

interface AdministrativeArea {
  ID: string;
  LocalizedName: string;
  EnglishName: string;
  Level: number;
  LocalizedType: string;
  EnglishType: string;
  CountryID: string;
}

interface TimeZone {
  Code: string;
  Name: string;
  GmtOffset: number;
  IsDaylightSaving: boolean;
  NextOffsetChange: null;
}

interface Measurement {
  Value: number;
  Unit: string;
  UnitType: number;
}

interface Elevation {
  Metric: Measurement;
  Imperial: Measurement;
}

interface GeoPosition {
  Latitude: number;
  Longitude: number;
  Elevation: Elevation;
}

export interface City {
  Version: number;
  Key: string;
  Type: string;
  Rank: number;
  LocalizedName: string;
  EnglishName: string;
  PrimaryPostalCode: string;
  Region: Region;
  Country: Country;
  AdministrativeArea: AdministrativeArea;
  TimeZone: TimeZone;
  GeoPosition: GeoPosition;
  IsAlias: boolean;
  SupplementalAdminAreas: any[];
  DataSets: string[];
}

export const getCities = async (limit: number): Promise<City[]> => {
  const response = await fetch(`${apiUrl}/locations/v1/topcities/${limit}?apikey=${apiKey}`)
  const data = await response.json()
  return data
}