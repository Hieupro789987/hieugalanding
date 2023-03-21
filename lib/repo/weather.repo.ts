import { BaseModel, CrudRepository } from "./crud.repo";

export interface Weather extends BaseModel {
  name: string;
  regionId: string;
  state: string;
  base: string;
  location: {
    coordinates: number[];
    _id: string;
    type: string | "Point";
  };
  current: CurrentWeather;
  daily: DailyWeather[];
  minutely: any;
  hourly: any;
}
interface CurrentWeather {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  sunrise: number;
  sunset: number;
  temp: number;
  uvi: number;
  visibility: number;
  wind_deg: number;
  wind_speed: number;
  weather: WeatherDetails[];
}
interface DailyWeather {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: { day: number; night: number; eve: number; morn: number };
  humidity: number;
  moon_phase: number;
  moonrise: number;
  moonset: number;
  pop: number;
  pressure: number;
  rain: number;
  sunrise: number;
  sunset: number;
  temp: { day: number; min: number; max: number; night: number; eve: number; morn: number };
  uvi: number;
  weather: WeatherDetails[];
  wind_deg: number;
  wind_gust: number;
  wind_speed: number;
}
interface WeatherDetails {
  description: string;
  icon: string;
  id: number;
  main: string;
}
export class WeatherRepository extends CrudRepository<Weather> {
  apiName: string = "weather";
  displayName: string = "Thời tiết";
  shortFragment: string = this.parseFragment(`
    id: String
    name: String
    regionId: String
    state: String
    location: any
    base: String
    current: Mixed
    daily: Mixed
    createdAt: DateTime
    updatedAt: DateTime
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    name: String
    regionId: String
    state: String
    location: any
    base: String
    current: Mixed
    daily: Mixed
    createdAt: DateTime
    updatedAt: DateTime
  `);

  async getNearestWeather(lng: number, lat: number): Promise<Weather> {
    return this.query({
      query: `
        getNearestWeather(lng: ${lng}, lat: ${lat}) {
          ${this.fullFragment}
        }
      `,
    }).then((res) => res.data.g0);
  }
}
export const WeatherService = new WeatherRepository();
