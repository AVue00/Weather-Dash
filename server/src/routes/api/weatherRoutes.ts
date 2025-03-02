import { Router, type Request, type Response } from 'express';
// import historyService from '../../service/historyService';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const cityName: string = req.body.cityName;
  // TODO: save city to search history
  await HistoryService.addCity(cityName)
  const weatherData = await WeatherService.getWeatherForCity(cityName)
  console.log('Weatherdata',weatherData)
  res.json(weatherData);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  const data = await HistoryService.getCities();
  return res.json(data);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  await HistoryService.removeCity(id);
  return res.json({ message: 'City removed from history' });
});

export default router;
