import dotenv from 'dotenv';
import dayjs from 'dayjs';
dotenv.config();

// // TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state: string;
}
// // Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string; //is this data type correct? Correct
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}
// // TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL?: string;
  API_Key?: string;
  cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.API_Key = process.env.API_KEY || '';
    this.cityName = '';
  }
//   // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      if (!this.baseURL || !this.API_Key) {
        throw new Error('API base URL or API key not found. Check .env file if they are set.');
      }

      const response = await fetch(query);
      const data: Coordinates[] = await response.json();
      return data[0];
      
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get city coordinates.');
  }
  }
//   // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(this.cityName)}&limit=1&appid=${this.API_Key}`;
    return geocodeQuery;
  }
//   // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.API_Key}`;
    return weatherQuery;
  }
//   // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return locationData;
  }
//   // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const weatherData = await fetch(query);
    const data = await weatherData.json();
    return data;
  }
//   // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    console.log('response', response);
    const dayjsdate = dayjs(response.dt_txt).format('MM/DD/YYYY');
    return new Weather(
      this.cityName,
      dayjsdate,
      response.weather[0].icon,
      response.weather[0].description,
      response.main.temp,
      response.wind.speed,
      response.main.humidity
    )
  }
//   // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const weatherForecast: Weather[] = [currentWeather];

    for (const weather of weatherData) {
      if (weather.dt_txt.includes('12:00:00')) {
        const forecast = this.parseCurrentWeather(weather);
        weatherForecast.push(forecast);
      }
    }

    return weatherForecast;
  }
//   // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      this.cityName = city;
      const locationData = await this.fetchAndDestructureLocationData();
      console.log('locationData', locationData);
      if (locationData) {
        const weatherData = await this.fetchWeatherData(locationData);
        const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
        const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
        return forecastArray;
      } else {
        throw new Error('Weather data not found.');
      }  
    } catch (error) {
      console.error(error);
      return []
    }
  }
}


export default new WeatherService();
