import { Router, type Request, type Response } from 'express';
// import historyService from '../../service/historyService';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  const cityname: string = req.body.cityName
  WeatherService.getWeatherForCity(cityname).then((data) => {
    HistoryService.addCity(cityname)
    res.json(data)
  })
});

// TODO: GET search history
router.get('/history', async (_req: Request, _res: Response) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, _res: Response) => {});

export default router;
